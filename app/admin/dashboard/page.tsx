export const runtime = 'edge'

import Link from 'next/link'
import { getDB } from '@/lib/db'
import { managedCustomers, uptimeMonitors, uptimeChecks, uptimeIncidents } from '@/lib/db/schema'
import { getMultiBucketStatus } from '@/lib/r2'
import type { ManagedCustomer, UptimeCheck, UptimeIncident, UptimeMonitor } from '@/lib/db/schema'
import { desc, eq, sql, and, isNull } from 'drizzle-orm'

async function getCfEnv(): Promise<Env | undefined> {
  try {
    const { getRequestContext } = await import('@cloudflare/next-on-pages')
    return getRequestContext().env as unknown as Env
  } catch {
    return undefined
  }
}

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr + 'Z').getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'เมื่อสักครู่'
  if (minutes < 60) return `${minutes} นาทีที่แล้ว`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} ชม.ที่แล้ว`
  const days = Math.floor(hours / 24)
  return `${days} วันที่แล้ว`
}

const STATUS_LABELS: Record<string, string> = {
  setup:       'Setup',
  active:      'Active',
  suspended:   'Suspended',
  terminated:  'Terminated',
}

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  active:     { bg: '#d1fae5', color: '#065f46' },
  setup:      { bg: '#dbeafe', color: '#1e40af' },
  suspended:  { bg: '#fef3c7', color: '#92400e' },
  terminated: { bg: '#fee2e2', color: '#991b1b' },
}

// ── Types for uptime activity feed ──
type CheckActivity = {
  kind: 'check'
  monitorLabel: string
  status: string
  checkedAt: string
}
type IncidentActivity = {
  kind: 'incident'
  monitorLabel: string
  severity: string
  resolvedAt: string | null
  startedAt: string
}
type ActivityItem = CheckActivity | IncidentActivity

export default async function DashboardPage() {
  const env = await getCfEnv()
  const now = new Date()

  // ── Fetch customer data ──────────────────────────────────
  let customers: ManagedCustomer[] = []
  let totalCount = 0
  let activeCount = 0
  let backupAlerts = 0
  let dbError = false

  // ── Uptime data ──────────────────────────────────────────
  let totalMonitors = 0
  let monitorsUp = 0
  let monitorsDown = 0
  let openIncidents = 0
  let recentActivity: ActivityItem[] = []

  if (env?.DB) {
    try {
      const db = getDB(env.DB)

      // ── Customer queries ──
      customers = await db.select().from(managedCustomers)
      totalCount = customers.length
      activeCount = customers.filter((c) => c.status === 'active').length

      const withBuckets = customers
        .filter((c) => c.r2Bucket)
        .map((c) => ({ slug: c.slug, bucket: c.r2Bucket! }))

      if (withBuckets.length > 0 && env.R2_ACCOUNT_ID) {
        const statusMap = await getMultiBucketStatus(env, withBuckets)
        backupAlerts = Array.from(statusMap.values()).filter(
          (s) => s.status !== 'ok',
        ).length
      }

      // ── Uptime queries ──
      const allMonitors: UptimeMonitor[] = await db
        .select()
        .from(uptimeMonitors)
        .where(eq(uptimeMonitors.isActive, 1))

      totalMonitors = allMonitors.length

      // Latest check status per monitor — subquery approach using raw SQL
      if (totalMonitors > 0) {
        const latestChecks: { monitorId: number; status: string }[] =
          await db
            .select({
              monitorId: uptimeChecks.monitorId,
              status: uptimeChecks.status,
            })
            .from(uptimeChecks)
            .innerJoin(
              db
                .select({
                  monitorId: uptimeChecks.monitorId,
                  maxAt: sql<string>`MAX(${uptimeChecks.checkedAt})`.as('max_at'),
                })
                .from(uptimeChecks)
                .groupBy(uptimeChecks.monitorId)
                .as('latest'),
              and(
                eq(uptimeChecks.monitorId, sql`latest.monitor_id`),
                eq(uptimeChecks.checkedAt, sql`latest.max_at`),
              ),
            )

        monitorsUp   = latestChecks.filter((r) => r.status === 'up').length
        monitorsDown = latestChecks.filter((r) => r.status === 'down').length
      }

      // Open incidents (resolvedAt IS NULL)
      const openIncidentsResult = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(uptimeIncidents)
        .where(isNull(uptimeIncidents.resolvedAt))
        .get()
      openIncidents = openIncidentsResult ? Number(openIncidentsResult.count) : 0

      // Last 5 checks across all monitors (for activity feed)
      const monitorMap = new Map(allMonitors.map((m) => [m.id, m.label]))
      // Also fetch all monitors (including paused) for label lookup
      const allMonitorsFull: UptimeMonitor[] = await db.select().from(uptimeMonitors)
      for (const m of allMonitorsFull) monitorMap.set(m.id, m.label)

      const recentChecks: UptimeCheck[] = await db
        .select()
        .from(uptimeChecks)
        .orderBy(desc(uptimeChecks.checkedAt))
        .limit(5)

      // Last 3 incidents
      const recentIncidents: UptimeIncident[] = await db
        .select()
        .from(uptimeIncidents)
        .orderBy(desc(uptimeIncidents.startedAt))
        .limit(3)

      // Build combined activity feed
      const checkItems: CheckActivity[] = recentChecks.map((c) => ({
        kind: 'check',
        monitorLabel: monitorMap.get(c.monitorId) ?? `Monitor #${c.monitorId}`,
        status: c.status,
        checkedAt: c.checkedAt,
      }))

      const incidentItems: IncidentActivity[] = recentIncidents.map((inc) => ({
        kind: 'incident',
        monitorLabel: monitorMap.get(inc.monitorId) ?? `Monitor #${inc.monitorId}`,
        severity: inc.severity,
        resolvedAt: inc.resolvedAt ?? null,
        startedAt: inc.startedAt,
      }))

      // Merge and sort by most recent date
      recentActivity = [...checkItems, ...incidentItems].sort((a, b) => {
        const aTime = a.kind === 'check' ? a.checkedAt : a.startedAt
        const bTime = b.kind === 'check' ? b.checkedAt : b.startedAt
        return bTime.localeCompare(aTime)
      })
    } catch {
      dbError = true
    }
  } else {
    dbError = true
  }

  // Top 5 most recent customers
  const recentCustomers = [...customers]
    .sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''))
    .slice(0, 5)

  const formattedDate = now.toLocaleDateString('th-TH', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const formattedTime = now.toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
  })

  const allUp = totalMonitors > 0 && monitorsDown === 0

  return (
    <div>
      {/* ── Header ── */}
      <div style={{ marginBottom: 20 }}>
        <h1
          style={{
            fontFamily: 'var(--font-prompt)',
            fontWeight: 700,
            fontSize: 28,
            color: '#0d2749',
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          Dashboard
        </h1>
        <p style={{ margin: '6px 0 0', fontSize: 14, color: '#737373' }}>
          {formattedDate}
        </p>
      </div>

      {/* ── Quick Links ── */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        <a
          href="/status"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            padding: '5px 14px',
            borderRadius: 20,
            fontSize: 13,
            fontWeight: 500,
            color: '#0d2749',
            border: '1px solid #cdd5e0',
            background: '#fff',
            textDecoration: 'none',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
            <path d="M5 2H2a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V7M7.5 1H11m0 0v3.5M11 1 5.5 6.5" stroke="#0d2749" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          View Status Page
        </a>
        <Link
          href="/admin/uptime"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            padding: '5px 14px',
            borderRadius: 20,
            fontSize: 13,
            fontWeight: 500,
            color: '#0d2749',
            border: '1px solid #cdd5e0',
            background: '#fff',
            textDecoration: 'none',
          }}
        >
          Manage Monitors
        </Link>
        <Link
          href="/admin/customers"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            padding: '5px 14px',
            borderRadius: 20,
            fontSize: 13,
            fontWeight: 500,
            color: '#0d2749',
            border: '1px solid #cdd5e0',
            background: '#fff',
            textDecoration: 'none',
          }}
        >
          Manage Customers
        </Link>
      </div>

      {/* ── DB unavailable notice ── */}
      {dbError && (
        <div
          style={{
            background: '#fef3c7',
            border: '1px solid #fbbf24',
            borderRadius: 10,
            padding: '12px 16px',
            marginBottom: 24,
            fontSize: 13,
            color: '#92400e',
          }}
        >
          DB unavailable — แสดงข้อมูล placeholder (local dev mode)
        </div>
      )}

      {/* ── Stat Cards — Row 1: Customers ── */}
      <div style={{ fontSize: 11, fontWeight: 600, color: '#737373', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
        Customers &amp; Infrastructure
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 16,
          marginBottom: 20,
        }}
      >
        {/* Total Customers */}
        <div
          style={{
            background: '#fff',
            borderRadius: 12,
            padding: 24,
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            border: '1px solid #e5e9f0',
          }}
        >
          <div style={{ fontSize: 12, color: '#737373', marginBottom: 8 }}>
            Total Customers
          </div>
          <div
            style={{
              fontFamily: 'var(--font-prompt)',
              fontSize: 36,
              fontWeight: 700,
              color: '#0d2749',
              lineHeight: 1,
            }}
          >
            {totalCount}
          </div>
        </div>

        {/* Active VPS */}
        <div
          style={{
            background: '#fff',
            borderRadius: 12,
            padding: 24,
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            border: '1px solid #e5e9f0',
          }}
        >
          <div style={{ fontSize: 12, color: '#737373', marginBottom: 8 }}>
            Active VPS
          </div>
          <div
            style={{
              fontFamily: 'var(--font-prompt)',
              fontSize: 36,
              fontWeight: 700,
              color: '#0d2749',
              lineHeight: 1,
            }}
          >
            {activeCount}
          </div>
        </div>

        {/* Backup Alerts */}
        <div
          style={{
            background: backupAlerts > 0 ? '#fff1f1' : '#fff',
            borderRadius: 12,
            padding: 24,
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            border: backupAlerts > 0 ? '1px solid #fca5a5' : '1px solid #e5e9f0',
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: backupAlerts > 0 ? '#991b1b' : '#737373',
              marginBottom: 8,
            }}
          >
            Backup Alerts
          </div>
          <div
            style={{
              fontFamily: 'var(--font-prompt)',
              fontSize: 36,
              fontWeight: 700,
              color: backupAlerts > 0 ? '#dc2626' : '#0d2749',
              lineHeight: 1,
            }}
          >
            {backupAlerts}
          </div>
        </div>

        {/* Last Check */}
        <div
          style={{
            background: '#fff',
            borderRadius: 12,
            padding: 24,
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            border: '1px solid #e5e9f0',
          }}
        >
          <div style={{ fontSize: 12, color: '#737373', marginBottom: 8 }}>
            Last Check
          </div>
          <div
            style={{
              fontFamily: 'var(--font-prompt)',
              fontSize: 24,
              fontWeight: 700,
              color: '#0d2749',
              lineHeight: 1,
            }}
          >
            {formattedTime}
          </div>
        </div>
      </div>

      {/* ── Stat Cards — Row 2: Uptime ── */}
      <div style={{ fontSize: 11, fontWeight: 600, color: '#737373', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
        Uptime Monitoring
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 16,
          marginBottom: 32,
        }}
      >
        {/* Monitors Online */}
        <div
          style={{
            background: allUp ? '#f0fdf4' : '#fff',
            borderRadius: 12,
            padding: 24,
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            border: allUp ? '1px solid #86efac' : '1px solid #e5e9f0',
          }}
        >
          <div style={{ fontSize: 12, color: allUp ? '#15803d' : '#737373', marginBottom: 8 }}>
            Monitors Online
          </div>
          <div
            style={{
              fontFamily: 'var(--font-prompt)',
              fontSize: 36,
              fontWeight: 700,
              color: allUp ? '#16a34a' : '#0d2749',
              lineHeight: 1,
            }}
          >
            {totalMonitors === 0 ? '—' : `${monitorsUp}/${totalMonitors}`}
          </div>
        </div>

        {/* Monitors Offline */}
        <div
          style={{
            background: monitorsDown > 0 ? '#fff1f1' : '#fff',
            borderRadius: 12,
            padding: 24,
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            border: monitorsDown > 0 ? '1px solid #fca5a5' : '1px solid #e5e9f0',
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: monitorsDown > 0 ? '#991b1b' : '#737373',
              marginBottom: 8,
            }}
          >
            Monitors Offline
          </div>
          <div
            style={{
              fontFamily: 'var(--font-prompt)',
              fontSize: 36,
              fontWeight: 700,
              color: monitorsDown > 0 ? '#dc2626' : '#0d2749',
              lineHeight: 1,
            }}
          >
            {monitorsDown}
          </div>
        </div>

        {/* Open Incidents */}
        <div
          style={{
            background: openIncidents > 0 ? '#fff1f1' : '#fff',
            borderRadius: 12,
            padding: 24,
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            border: openIncidents > 0 ? '1px solid #fca5a5' : '1px solid #e5e9f0',
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: openIncidents > 0 ? '#991b1b' : '#737373',
              marginBottom: 8,
            }}
          >
            Open Incidents
          </div>
          <div
            style={{
              fontFamily: 'var(--font-prompt)',
              fontSize: 36,
              fontWeight: 700,
              color: openIncidents > 0 ? '#dc2626' : '#0d2749',
              lineHeight: 1,
            }}
          >
            {openIncidents}
          </div>
        </div>
      </div>

      {/* ── Recent Customers Table ── */}
      <div
        style={{
          background: '#fff',
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          border: '1px solid #e5e9f0',
          marginBottom: 24,
        }}
      >
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #e5e9f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-prompt)',
              fontWeight: 600,
              fontSize: 16,
              color: '#0d2749',
              margin: 0,
            }}
          >
            Recent Customers
          </h2>
        </div>

        {recentCustomers.length === 0 ? (
          <div
            style={{
              padding: '40px 20px',
              textAlign: 'center',
              color: '#737373',
              fontSize: 14,
            }}
          >
            {dbError ? 'ไม่สามารถโหลดข้อมูลได้' : 'ยังไม่มีลูกค้า'}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: '#0d2749' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: '#fff', fontWeight: 500, fontSize: 13 }}>Name</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: '#fff', fontWeight: 500, fontSize: 13 }}>Subdomain</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: '#fff', fontWeight: 500, fontSize: 13 }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: '#fff', fontWeight: 500, fontSize: 13 }}>Start Date</th>
                </tr>
              </thead>
              <tbody>
                {recentCustomers.map((c, i) => {
                  const statusStyle = STATUS_COLORS[c.status ?? 'setup'] ?? STATUS_COLORS.setup
                  return (
                    <tr
                      key={c.id}
                      style={{
                        borderBottom: i < recentCustomers.length - 1 ? '1px solid #f0f4f8' : 'none',
                      }}
                    >
                      <td style={{ padding: '12px 16px', color: '#0d2749', fontWeight: 500 }}>
                        {c.name}
                      </td>
                      <td style={{ padding: '12px 16px', color: '#737373', fontFamily: 'monospace', fontSize: 13 }}>
                        {c.subdomain}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '2px 10px',
                            borderRadius: 20,
                            fontSize: 12,
                            fontWeight: 500,
                            background: statusStyle.bg,
                            color: statusStyle.color,
                          }}
                        >
                          {STATUS_LABELS[c.status ?? 'setup'] ?? c.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', color: '#737373' }}>
                        {c.startDate ?? '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Recent Activity Feed ── */}
      <div
        style={{
          background: '#fff',
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          border: '1px solid #e5e9f0',
        }}
      >
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #e5e9f0',
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-prompt)',
              fontWeight: 600,
              fontSize: 16,
              color: '#0d2749',
              margin: 0,
            }}
          >
            Recent Activity
          </h2>
        </div>

        {dbError || recentActivity.length === 0 ? (
          <div
            style={{
              padding: '40px 20px',
              textAlign: 'center',
              color: '#737373',
              fontSize: 14,
            }}
          >
            {dbError
              ? 'ไม่สามารถโหลดข้อมูลได้'
              : totalMonitors === 0
              ? 'No monitors configured'
              : 'ยังไม่มีข้อมูล Activity'}
          </div>
        ) : (
          <ul style={{ listStyle: 'none', margin: 0, padding: '8px 0' }}>
            {recentActivity.map((item, i) => {
              if (item.kind === 'check') {
                const isUp = item.status === 'up'
                return (
                  <li
                    key={`check-${i}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '10px 20px',
                      borderBottom: i < recentActivity.length - 1 ? '1px solid #f0f4f8' : 'none',
                    }}
                  >
                    {/* Status dot */}
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: isUp ? '#10b981' : '#ef4444',
                        flexShrink: 0,
                        display: 'inline-block',
                      }}
                    />
                    <span style={{ flex: 1, fontSize: 13, color: '#0d2749', fontWeight: 500 }}>
                      {item.monitorLabel}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 500,
                        color: isUp ? '#16a34a' : '#dc2626',
                        background: isUp ? '#f0fdf4' : '#fff1f1',
                        padding: '2px 8px',
                        borderRadius: 12,
                      }}
                    >
                      {isUp ? 'up' : 'down'}
                    </span>
                    <span style={{ fontSize: 12, color: '#9ca3af', whiteSpace: 'nowrap' }}>
                      {relativeTime(item.checkedAt)}
                    </span>
                  </li>
                )
              } else {
                const isOngoing = !item.resolvedAt
                return (
                  <li
                    key={`incident-${i}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '10px 20px',
                      borderBottom: i < recentActivity.length - 1 ? '1px solid #f0f4f8' : 'none',
                      background: isOngoing ? '#fffbeb' : 'transparent',
                    }}
                  >
                    {/* Incident dot */}
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: isOngoing ? '#f59e0b' : '#9ca3af',
                        flexShrink: 0,
                        display: 'inline-block',
                      }}
                    />
                    <span style={{ flex: 1, fontSize: 13, color: '#0d2749', fontWeight: 500 }}>
                      {item.monitorLabel}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 500,
                        color: isOngoing ? '#92400e' : '#737373',
                        background: isOngoing ? '#fef3c7' : '#f3f4f6',
                        padding: '2px 8px',
                        borderRadius: 12,
                        textTransform: 'capitalize',
                      }}
                    >
                      {item.severity} {isOngoing ? '(ongoing)' : 'incident'}
                    </span>
                    <span style={{ fontSize: 12, color: '#9ca3af', whiteSpace: 'nowrap' }}>
                      {relativeTime(item.startedAt)}
                    </span>
                  </li>
                )
              }
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
