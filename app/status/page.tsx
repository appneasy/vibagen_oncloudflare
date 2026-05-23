export const runtime = 'edge'

import type { Metadata } from 'next'
import Link from 'next/link'
import { eq, desc, and, gte, sql } from 'drizzle-orm'
import { getDB } from '@/lib/db'
import { uptimeMonitors, uptimeChecks, uptimeIncidents } from '@/lib/db/schema'
import type { UptimeMonitor, UptimeCheck, UptimeIncident } from '@/lib/db/schema'

export const metadata: Metadata = {
  title: 'System Status — VIBAGEN',
  description: 'VIBAGEN System Status — ตรวจสอบสถานะบริการแบบ real-time',
  robots: { index: true, follow: true },
}

async function getCfEnv(): Promise<Env | undefined> {
  try {
    const { getRequestContext } = await import('@cloudflare/next-on-pages')
    return getRequestContext().env as unknown as Env
  } catch {
    return undefined
  }
}

function relativeTime(dateStr: string): string {
  const n = dateStr.replace(' ', 'T')
  const diff = Date.now() - new Date(n.endsWith('Z') ? n : n + 'Z').getTime()
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
  lastStatus: UptimeCheck['status'] | null
  lastCheckedAt: string | null
  uptime30d: number | null
}

type EnrichedIncident = UptimeIncident & {
  monitorLabel: string
  monitorCustomerSlug: string | null
}

export default async function StatusPage() {
  const env = await getCfEnv()

  let monitors: EnrichedMonitor[] = []
  let recentIncidents: EnrichedIncident[] = []
  let dbError = false
  let lastUpdated: Date | null = null

  if (env?.DB) {
    try {
      const db = getDB(env.DB)

      const now = new Date()
      const since30d = toDbDatetime(new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000))

      // Get all active monitors
      const rows = await db
        .select()
        .from(uptimeMonitors)
        .where(eq(uptimeMonitors.isActive, 1))

      monitors = await Promise.all(
        rows.map(async (m) => {
          const latestCheck = await db
            .select()
            .from(uptimeChecks)
            .where(eq(uptimeChecks.monitorId, m.id))
            .orderBy(desc(uptimeChecks.checkedAt))
            .limit(1)
            .get()

          const uptimeRow = await db
            .select({
              total:   sql<number>`COUNT(*)`,
              upCount: sql<number>`SUM(CASE WHEN ${uptimeChecks.status} = 'up' THEN 1 ELSE 0 END)`,
            })
            .from(uptimeChecks)
            .where(and(eq(uptimeChecks.monitorId, m.id), gte(uptimeChecks.checkedAt, since30d)))
            .get()

          let uptime30d: number | null = null
          if (uptimeRow && Number(uptimeRow.total) > 0) {
            uptime30d = Math.round((Number(uptimeRow.upCount) / Number(uptimeRow.total)) * 1000) / 10
          }

          return {
            ...m,
            lastStatus:    latestCheck?.status    ?? null,
            lastCheckedAt: latestCheck?.checkedAt ?? null,
            uptime30d,
          }
        }),
      )

      // Recent incidents (last 5 resolved or ongoing) across all monitors
      const monitorIds = monitors.map((m) => m.id)
      if (monitorIds.length > 0) {
        const allIncidents = await db
          .select()
          .from(uptimeIncidents)
          .orderBy(desc(uptimeIncidents.startedAt))
          .limit(20)

        const monitorMap = new Map(monitors.map((m) => [m.id, m]))
        const filtered = allIncidents.filter((inc) => monitorIds.includes(inc.monitorId))

        recentIncidents = filtered.slice(0, 5).map((inc) => {
          const mon = monitorMap.get(inc.monitorId)
          return {
            ...inc,
            monitorLabel:       mon?.label        ?? 'Unknown',
            monitorCustomerSlug: mon?.customerSlug ?? null,
          }
        })
      }

      lastUpdated = now
    } catch {
      dbError = true
    }
  } else {
    dbError = true
  }

  // Determine overall status
  const downCount = monitors.filter((m) => m.lastStatus === 'down').length
  const unknownCount = monitors.filter((m) => m.lastStatus === null).length

  type OverallStatus = 'operational' | 'partial' | 'major' | 'unavailable'
  let overallStatus: OverallStatus
  if (dbError || (monitors.length === 0 && dbError)) {
    overallStatus = 'unavailable'
  } else if (monitors.length === 0) {
    overallStatus = 'operational'
  } else if (downCount === 0 && unknownCount === 0) {
    overallStatus = 'operational'
  } else if (downCount === monitors.length) {
    overallStatus = 'major'
  } else if (downCount > 0) {
    overallStatus = 'partial'
  } else {
    overallStatus = 'operational'
  }

  const overallBanner: Record<OverallStatus, { label: string; bg: string; color: string; dot: string }> = {
    operational: { label: 'All Systems Operational', bg: '#d1fae5', color: '#065f46', dot: '#10b981' },
    partial:     { label: 'Partial System Outage',   bg: '#fef3c7', color: '#92400e', dot: '#f59e0b' },
    major:       { label: 'Major System Outage',     bg: '#fee2e2', color: '#991b1b', dot: '#ef4444' },
    unavailable: { label: 'Status Unavailable',      bg: '#f3f4f6', color: '#6b7280', dot: '#9ca3af' },
  }

  const banner = overallBanner[overallStatus]

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f8f9fc',
        fontFamily: 'inherit',
      }}
    >
      <div
        style={{
          maxWidth: 800,
          margin: '0 auto',
          padding: '40px 20px',
        }}
      >
        {/* ── Header ── */}
        <div style={{ marginBottom: 32 }}>
          <Link
            href="https://vibagen.com"
            style={{ textDecoration: 'none', display: 'inline-block', marginBottom: 20 }}
          >
            <span
              style={{
                fontFamily: 'var(--font-prompt)',
                fontWeight: 700,
                fontSize: 22,
                color: '#ff6c01',
                letterSpacing: '-0.02em',
              }}
            >
              VIBAGEN
            </span>
          </Link>

          <h1
            style={{
              fontFamily: 'var(--font-prompt)',
              fontWeight: 700,
              fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
              color: '#0d2749',
              margin: '0 0 20px 0',
              lineHeight: 1.2,
            }}
          >
            System Status
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

        {/* ── DB error notice ── */}
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

        {/* ── Monitor list ── */}
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
                Services
              </span>
            </div>

            {monitors.length === 0 ? (
              <div
                style={{
                  padding: '48px 24px',
                  textAlign: 'center',
                  color: '#737373',
                  fontSize: 14,
                }}
              >
                No monitors configured.
              </div>
            ) : (
              monitors.map((m, i) => {
                const isDown = m.lastStatus === 'down'
                const isUp   = m.lastStatus === 'up'
                const dotColor = isUp ? '#10b981' : isDown ? '#ef4444' : '#9ca3af'
                const uptimePct = m.uptime30d
                const statusLink = m.customerSlug ? `/status/${m.customerSlug}` : null

                return (
                  <div
                    key={m.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px 24px',
                      borderBottom: i < monitors.length - 1 ? '1px solid #f0f4f8' : 'none',
                      gap: 12,
                      flexWrap: 'wrap',
                    }}
                  >
                    {/* Left: status dot + label */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                      <span style={{ color: dotColor, fontSize: 18, lineHeight: 1, flexShrink: 0 }}>●</span>
                      {statusLink ? (
                        <Link
                          href={statusLink}
                          style={{
                            fontWeight: 500,
                            fontSize: 15,
                            color: '#0d2749',
                            textDecoration: 'none',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {m.label}
                        </Link>
                      ) : (
                        <span
                          style={{
                            fontWeight: 500,
                            fontSize: 15,
                            color: '#0d2749',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {m.label}
                        </span>
                      )}
                    </div>

                    {/* Right: uptime % */}
                    <div style={{ flexShrink: 0 }}>
                      {uptimePct !== null ? (
                        <span
                          style={{
                            fontFamily: 'var(--font-prompt)',
                            fontWeight: 600,
                            fontSize: 14,
                            color: uptimeColor(uptimePct),
                          }}
                        >
                          {uptimePct}% uptime
                        </span>
                      ) : (
                        <span style={{ fontSize: 13, color: '#9ca3af' }}>No data</span>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}

        {/* ── Recent Incidents ── */}
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
                Recent Incidents
              </span>
            </div>

            {recentIncidents.length === 0 ? (
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
              recentIncidents.map((inc, i) => {
                const isResolved = !!inc.resolvedAt
                const statusLabel = isResolved ? 'Resolved' : 'Ongoing'
                const statusColor = isResolved ? '#065f46' : '#991b1b'
                const statusBg    = isResolved ? '#d1fae5'  : '#fee2e2'
                const detailLink  = inc.monitorCustomerSlug
                  ? `/status/${inc.monitorCustomerSlug}`
                  : null

                return (
                  <div
                    key={inc.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 12,
                      padding: '14px 24px',
                      borderBottom: i < recentIncidents.length - 1 ? '1px solid #f0f4f8' : 'none',
                      flexWrap: 'wrap',
                    }}
                  >
                    {/* Timeline dot */}
                    <div style={{ paddingTop: 3, flexShrink: 0 }}>
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 2 }}>
                        {detailLink ? (
                          <Link
                            href={detailLink}
                            style={{
                              fontWeight: 500,
                              fontSize: 14,
                              color: '#0d2749',
                              textDecoration: 'none',
                            }}
                          >
                            {inc.monitorLabel}
                          </Link>
                        ) : (
                          <span style={{ fontWeight: 500, fontSize: 14, color: '#0d2749' }}>
                            {inc.monitorLabel}
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
                        {inc.durationSeconds != null && (
                          <span style={{ fontSize: 12, color: '#737373' }}>
                            {formatDuration(inc.durationSeconds)}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 12, color: '#9ca3af' }}>
                        {relativeTime(inc.startedAt)}
                        {inc.cause && ` — ${inc.cause}`}
                      </div>
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
            <span>Last updated: {relativeTime(lastUpdated.toISOString().replace('T', ' ').slice(0, 19))}</span>
          )}
        </div>
      </div>
    </div>
  )
}
