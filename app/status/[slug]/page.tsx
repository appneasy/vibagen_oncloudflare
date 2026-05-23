export const runtime = 'edge'

import type { Metadata } from 'next'
import Link from 'next/link'
import { eq, desc, and, gte, inArray, sql } from 'drizzle-orm'
import { getDB } from '@/lib/db'
import { uptimeMonitors, uptimeChecks, uptimeIncidents, managedCustomers } from '@/lib/db/schema'
import type { UptimeMonitor, UptimeCheck, UptimeIncident, ManagedCustomer } from '@/lib/db/schema'
import ResponseTimeChart from '@/components/admin/ResponseTimeChart'

async function getCfEnv(): Promise<Env | undefined> {
  try {
    const { getRequestContext } = await import('@cloudflare/next-on-pages')
    return getRequestContext().env as unknown as Env
  } catch {
    return undefined
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const displaySlug = slug.charAt(0).toUpperCase() + slug.slice(1)
  return {
    title: `${displaySlug} Service Status — VIBAGEN`,
    description: `Real-time uptime and incident status for ${displaySlug} services, powered by VIBAGEN.`,
    robots: { index: true, follow: true },
  }
}

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr.replace(' ', 'T') + 'Z').getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  return `${h}h ${m}m`
}

function toDbDatetime(d: Date): string {
  return d.toISOString().replace('T', ' ').slice(0, 19)
}

function uptimeColor(pct: number | null): string {
  if (pct === null) return '#9ca3af'
  if (pct >= 99) return '#10b981'
  if (pct >= 95) return '#f59e0b'
  return '#ef4444'
}

type EnrichedMonitor = UptimeMonitor & {
  lastCheck: UptimeCheck | null
  uptime24h: number | null
  uptime7d:  number | null
  uptime30d: number | null
  recentChecks: UptimeCheck[]
}

export default async function CustomerStatusPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const env = await getCfEnv()

  let customer: ManagedCustomer | null = null
  let monitors: EnrichedMonitor[] = []
  let incidents: UptimeIncident[] = []
  let dbError = false
  let notFound = false
  let lastUpdated: Date | null = null

  if (env?.DB) {
    try {
      const db = getDB(env.DB)

      // Try to find managed customer by slug
      customer = await db
        .select()
        .from(managedCustomers)
        .where(eq(managedCustomers.slug, slug))
        .get() ?? null

      // Get monitors for this customer slug
      const monitorRows = await db
        .select()
        .from(uptimeMonitors)
        .where(eq(uptimeMonitors.customerSlug, slug))

      if (monitorRows.length === 0) {
        notFound = true
      } else {
        const now = new Date()
        const since24h = toDbDatetime(new Date(now.getTime() - 24 * 60 * 60 * 1000))
        const since7d  = toDbDatetime(new Date(now.getTime() - 7  * 24 * 60 * 60 * 1000))
        const since30d = toDbDatetime(new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000))

        async function calcUptime(monitorId: number, sinceIso: string): Promise<number | null> {
          const row = await db
            .select({
              total:   sql<number>`COUNT(*)`,
              upCount: sql<number>`SUM(CASE WHEN ${uptimeChecks.status} = 'up' THEN 1 ELSE 0 END)`,
            })
            .from(uptimeChecks)
            .where(and(eq(uptimeChecks.monitorId, monitorId), gte(uptimeChecks.checkedAt, sinceIso)))
            .get()
          if (!row || Number(row.total) === 0) return null
          return Math.round((Number(row.upCount) / Number(row.total)) * 1000) / 10
        }

        monitors = await Promise.all(
          monitorRows.map(async (m) => {
            const checksRows = await db
              .select()
              .from(uptimeChecks)
              .where(eq(uptimeChecks.monitorId, m.id))
              .orderBy(desc(uptimeChecks.checkedAt))
              .limit(50)

            const lastCheck = checksRows[0] ?? null

            const [uptime24h, uptime7d, uptime30d] = await Promise.all([
              calcUptime(m.id, since24h),
              calcUptime(m.id, since7d),
              calcUptime(m.id, since30d),
            ])

            return { ...m, lastCheck, uptime24h, uptime7d, uptime30d, recentChecks: checksRows }
          }),
        )

        // Incidents for these monitors (last 10)
        const monitorIds = monitorRows.map((m) => m.id)
        if (monitorIds.length === 1) {
          incidents = await db
            .select()
            .from(uptimeIncidents)
            .where(eq(uptimeIncidents.monitorId, monitorIds[0]))
            .orderBy(desc(uptimeIncidents.startedAt))
            .limit(10)
        } else {
          incidents = await db
            .select()
            .from(uptimeIncidents)
            .where(inArray(uptimeIncidents.monitorId, monitorIds))
            .orderBy(desc(uptimeIncidents.startedAt))
            .limit(10)
        }

        lastUpdated = now
      }
    } catch {
      dbError = true
    }
  } else {
    dbError = true
  }

  // Not found state
  if (!dbError && notFound) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8f9fc' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px' }}>
          <Link
            href="/status"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 14,
              color: '#ff6c01',
              textDecoration: 'none',
              marginBottom: 32,
            }}
          >
            ← All Services
          </Link>
          <div
            style={{
              background: '#fff',
              borderRadius: 12,
              padding: '60px 24px',
              textAlign: 'center',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              border: '1px solid #e5e9f0',
              color: '#737373',
              fontSize: 15,
            }}
          >
            No status information available for this service.
          </div>
          <div style={{ marginTop: 32, textAlign: 'center', fontSize: 12, color: '#9ca3af' }}>
            Powered by{' '}
            <Link href="https://vibagen.com" style={{ color: '#ff6c01', textDecoration: 'none', fontWeight: 500 }}>
              VIBAGEN
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Determine overall status
  const downCount    = monitors.filter((m) => m.isActive === 1 && m.lastCheck?.status === 'down').length
  const activeCount  = monitors.filter((m) => m.isActive === 1).length

  type OverallStatus = 'operational' | 'partial' | 'major' | 'unavailable'
  let overallStatus: OverallStatus
  if (dbError) {
    overallStatus = 'unavailable'
  } else if (activeCount === 0 || downCount === 0) {
    overallStatus = 'operational'
  } else if (downCount === activeCount) {
    overallStatus = 'major'
  } else {
    overallStatus = 'partial'
  }

  const overallBanner: Record<OverallStatus, { label: string; bg: string; color: string; dot: string }> = {
    operational: { label: 'All Systems Operational', bg: '#d1fae5', color: '#065f46', dot: '#10b981' },
    partial:     { label: 'Partial System Outage',   bg: '#fef3c7', color: '#92400e', dot: '#f59e0b' },
    major:       { label: 'Major System Outage',     bg: '#fee2e2', color: '#991b1b', dot: '#ef4444' },
    unavailable: { label: 'Status Unavailable',      bg: '#f3f4f6', color: '#6b7280', dot: '#9ca3af' },
  }

  const banner = overallBanner[overallStatus]
  const displayName = customer?.name ?? (slug.charAt(0).toUpperCase() + slug.slice(1))

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fc' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px' }}>

        {/* ── Back link ── */}
        <Link
          href="/status"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 14,
            color: '#ff6c01',
            textDecoration: 'none',
            marginBottom: 24,
          }}
        >
          ← All Services
        </Link>

        {/* ── Header ── */}
        <div style={{ marginBottom: 32 }}>
          <h1
            style={{
              fontFamily: 'var(--font-prompt)',
              fontWeight: 700,
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
              color: '#0d2749',
              margin: '0 0 16px 0',
              lineHeight: 1.2,
            }}
          >
            {displayName} Status
          </h1>

          {/* Overall status banner */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '14px 20px',
              borderRadius: 10,
              background: banner.bg,
              color: banner.color,
              fontWeight: 600,
              fontSize: 15,
            }}
          >
            <span style={{ fontSize: 20, lineHeight: 1, color: banner.dot }}>●</span>
            {banner.label}
          </div>
        </div>

        {/* ── DB error ── */}
        {dbError && (
          <div
            style={{
              background: '#fff',
              borderRadius: 12,
              padding: '40px 24px',
              textAlign: 'center',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              border: '1px solid #e5e9f0',
              marginBottom: 24,
              color: '#737373',
              fontSize: 15,
            }}
          >
            Status information is currently unavailable. Please check back later.
          </div>
        )}

        {/* ── Monitors ── */}
        {!dbError && monitors.map((m) => {
          const isDown = m.isActive === 1 && m.lastCheck?.status === 'down'
          const isUp   = m.isActive === 1 && m.lastCheck?.status === 'up'
          const isPaused = m.isActive === 0
          const dotColor = isPaused ? '#9ca3af' : isUp ? '#10b981' : isDown ? '#ef4444' : '#d1d5db'

          let statusLabel: string
          let statusBg: string
          let statusColor: string
          if (isPaused)       { statusLabel = 'Paused';    statusBg = '#f3f4f6'; statusColor = '#9ca3af' }
          else if (!m.lastCheck) { statusLabel = 'No Data'; statusBg = '#f3f4f6'; statusColor = '#9ca3af' }
          else if (isUp)      { statusLabel = 'Operational'; statusBg = '#d1fae5'; statusColor = '#065f46' }
          else                { statusLabel = 'Outage';    statusBg = '#fee2e2'; statusColor = '#991b1b' }

          return (
            <div
              key={m.id}
              style={{
                background: '#fff',
                borderRadius: 12,
                padding: '24px',
                marginBottom: 16,
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                border: '1px solid #e5e9f0',
              }}
            >
              {/* Monitor header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 10,
                  marginBottom: 16,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ color: dotColor, fontSize: 20, lineHeight: 1 }}>●</span>
                  <span
                    style={{
                      fontFamily: 'var(--font-prompt)',
                      fontWeight: 600,
                      fontSize: 16,
                      color: '#0d2749',
                    }}
                  >
                    {m.label}
                  </span>
                </div>
                <span
                  style={{
                    padding: '3px 12px',
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 600,
                    background: statusBg,
                    color: statusColor,
                  }}
                >
                  {statusLabel}
                </span>
              </div>

              {/* Response time + last check */}
              <div
                style={{
                  display: 'flex',
                  gap: 20,
                  marginBottom: 16,
                  flexWrap: 'wrap',
                }}
              >
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>
                    Response Time
                  </div>
                  <div style={{ fontSize: 14, color: '#374151', fontWeight: 500 }}>
                    {m.lastCheck?.responseTimeMs != null ? `${m.lastCheck.responseTimeMs} ms` : '—'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>
                    Last Checked
                  </div>
                  <div style={{ fontSize: 14, color: '#374151' }}>
                    {m.lastCheck?.checkedAt ? relativeTime(m.lastCheck.checkedAt) : '—'}
                  </div>
                </div>
              </div>

              {/* Uptime stats */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 10,
                  marginBottom: 20,
                }}
              >
                {([
                  { label: '24 Hours', value: m.uptime24h },
                  { label: '7 Days',   value: m.uptime7d  },
                  { label: '30 Days',  value: m.uptime30d },
                ] as { label: string; value: number | null }[]).map(({ label, value }) => (
                  <div
                    key={label}
                    style={{
                      background: '#f8f9fc',
                      borderRadius: 8,
                      padding: '12px',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                      {label}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-prompt)',
                        fontWeight: 700,
                        fontSize: 18,
                        color: uptimeColor(value),
                      }}
                    >
                      {value !== null ? `${value}%` : '—'}
                    </div>
                  </div>
                ))}
              </div>

              {/* Response time chart */}
              <div style={{ borderTop: '1px solid #f0f4f8', paddingTop: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                  Response Time
                </div>
                <ResponseTimeChart checks={m.recentChecks} />
              </div>
            </div>
          )
        })}

        {/* ── Incident Timeline ── */}
        {!dbError && (
          <div
            style={{
              background: '#fff',
              borderRadius: 12,
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              border: '1px solid #e5e9f0',
              marginBottom: 24,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '16px 24px',
                borderBottom: '1px solid #f0f4f8',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-prompt)',
                  fontWeight: 600,
                  fontSize: 16,
                  color: '#0d2749',
                }}
              >
                Incident History
              </span>
            </div>

            {incidents.length === 0 ? (
              <div
                style={{
                  padding: '32px 24px',
                  textAlign: 'center',
                  color: '#737373',
                  fontSize: 14,
                }}
              >
                No incidents reported.
              </div>
            ) : (
              incidents.map((inc, i) => {
                const isResolved  = !!inc.resolvedAt
                const statusLabel = isResolved ? 'Resolved' : 'Ongoing'
                const statusColor = isResolved ? '#065f46' : '#991b1b'
                const statusBg    = isResolved ? '#d1fae5' : '#fee2e2'

                const severityBadge: Record<string, { bg: string; color: string }> = {
                  minor:    { bg: '#fef3c7', color: '#92400e' },
                  major:    { bg: '#fee2e2', color: '#991b1b' },
                  critical: { bg: '#7f1d1d', color: '#fff'    },
                }
                const sevStyle = severityBadge[inc.severity] ?? severityBadge.major

                // Find monitor label
                const mon = monitors.find((m) => m.id === inc.monitorId)

                return (
                  <div
                    key={inc.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 12,
                      padding: '16px 24px',
                      borderBottom: i < incidents.length - 1 ? '1px solid #f0f4f8' : 'none',
                      flexWrap: 'wrap',
                    }}
                  >
                    {/* Timeline dot */}
                    <div style={{ paddingTop: 4, flexShrink: 0 }}>
                      <span
                        style={{
                          display: 'inline-block',
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: isResolved ? '#10b981' : '#ef4444',
                        }}
                      />
                    </div>

                    {/* Details */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                        {mon && (
                          <span style={{ fontWeight: 500, fontSize: 14, color: '#0d2749' }}>
                            {mon.label}
                          </span>
                        )}
                        <span
                          style={{
                            padding: '1px 8px',
                            borderRadius: 12,
                            fontSize: 11,
                            fontWeight: 600,
                            background: statusBg,
                            color: statusColor,
                          }}
                        >
                          {statusLabel}
                        </span>
                        <span
                          style={{
                            padding: '1px 8px',
                            borderRadius: 12,
                            fontSize: 11,
                            fontWeight: 600,
                            background: sevStyle.bg,
                            color: sevStyle.color,
                            textTransform: 'capitalize',
                          }}
                        >
                          {inc.severity}
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 12, color: '#737373' }}>
                        <span>Started: {relativeTime(inc.startedAt)}</span>
                        {inc.resolvedAt && (
                          <span>Resolved: {relativeTime(inc.resolvedAt)}</span>
                        )}
                        {inc.durationSeconds != null && (
                          <span>Duration: {formatDuration(inc.durationSeconds)}</span>
                        )}
                      </div>

                      {inc.cause && (
                        <div style={{ fontSize: 13, color: '#374151', marginTop: 4 }}>
                          {inc.cause}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}

        {/* ── Footer ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 8,
            fontSize: 12,
            color: '#9ca3af',
            paddingTop: 8,
          }}
        >
          <span>
            Powered by{' '}
            <Link
              href="https://vibagen.com"
              style={{ color: '#ff6c01', textDecoration: 'none', fontWeight: 500 }}
            >
              VIBAGEN
            </Link>
          </span>
          {lastUpdated && (
            <span>
              Last updated: {relativeTime(lastUpdated.toISOString().replace('T', ' ').slice(0, 19))}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
