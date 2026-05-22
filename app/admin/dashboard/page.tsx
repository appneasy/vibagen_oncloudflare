export const runtime = 'edge'

import Link from 'next/link'
import { getDB } from '@/lib/db'
import { managedCustomers, uptimeMonitors, uptimeChecks, uptimeIncidents } from '@/lib/db/schema'
import { getMultiBucketStatus } from '@/lib/r2'
import type { ManagedCustomer } from '@/lib/db/schema'
import { desc, eq, sql, and, isNull, gte } from 'drizzle-orm'
import CustomerCardGrid from '@/components/admin/CustomerCardGrid'

async function getCfEnv(): Promise<Env | undefined> {
  try {
    const { getRequestContext } = await import('@cloudflare/next-on-pages')
    return getRequestContext().env as unknown as Env
  } catch {
    return undefined
  }
}

function toDbDatetime(d: Date): string {
  return d.toISOString().replace('T', ' ').slice(0, 19)
}

type MonitorSummary = {
  id: number
  label: string
  url: string
  isActive: number
  customerSlug: string | null
  lastStatus: 'up' | 'down' | null
  lastResponseTimeMs: number | null
  lastCheckedAt: string | null
  uptime24h: number | null
  uptime7d: number | null
  uptime30d: number | null
  streakSeconds: number | null
  recentChecks: { responseTimeMs: number | null; status: string; checkedAt: string }[]
}

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
  let monitorSummaries: MonitorSummary[] = []

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

      // Open incidents (resolvedAt IS NULL)
      const openIncidentsResult = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(uptimeIncidents)
        .where(isNull(uptimeIncidents.resolvedAt))
        .get()
      openIncidents = openIncidentsResult ? Number(openIncidentsResult.count) : 0

      // ── Build monitor summaries (replaces allMonitors + latestChecks queries) ──
      const allMonitorsForCards = await db.select().from(uptimeMonitors)

      const nowTime = new Date()
      const since24h = toDbDatetime(new Date(nowTime.getTime() - 24 * 60 * 60 * 1000))
      const since7d  = toDbDatetime(new Date(nowTime.getTime() - 7 * 24 * 60 * 60 * 1000))
      const since30d = toDbDatetime(new Date(nowTime.getTime() - 30 * 24 * 60 * 60 * 1000))

      monitorSummaries = await Promise.all(
        allMonitorsForCards.map(async (m) => {
          // Recent 20 checks
          const checks = await db
            .select()
            .from(uptimeChecks)
            .where(eq(uptimeChecks.monitorId, m.id))
            .orderBy(desc(uptimeChecks.checkedAt))
            .limit(20)

          const lastCheck = checks[0] ?? null

          // Uptime calculations
          async function calcUptime(sinceIso: string): Promise<number | null> {
            const row = await db
              .select({
                total:   sql<number>`COUNT(*)`,
                upCount: sql<number>`SUM(CASE WHEN ${uptimeChecks.status} = 'up' THEN 1 ELSE 0 END)`,
              })
              .from(uptimeChecks)
              .where(and(eq(uptimeChecks.monitorId, m.id), gte(uptimeChecks.checkedAt, sinceIso)))
              .get()
            if (!row || Number(row.total) === 0) return null
            return Math.round((Number(row.upCount) / Number(row.total)) * 1000) / 10
          }

          const [uptime24h, uptime7d, uptime30d] = await Promise.all([
            calcUptime(since24h),
            calcUptime(since7d),
            calcUptime(since30d),
          ])

          // Streak: walk checks from newest, count consecutive "up"
          let streakCount = 0
          for (const c of checks) {
            if (c.status === 'up') streakCount++
            else break
          }
          const streakSeconds = streakCount > 0 ? streakCount * m.checkInterval : null

          return {
            id: m.id,
            label: m.label,
            url: m.url,
            isActive: m.isActive,
            customerSlug: m.customerSlug,
            lastStatus: (lastCheck?.status ?? null) as 'up' | 'down' | null,
            lastResponseTimeMs: lastCheck?.responseTimeMs ?? null,
            lastCheckedAt: lastCheck?.checkedAt ?? null,
            uptime24h,
            uptime7d,
            uptime30d,
            streakSeconds,
            recentChecks: checks.map((c) => ({
              responseTimeMs: c.responseTimeMs,
              status: c.status,
              checkedAt: c.checkedAt,
            })),
          }
        })
      )

      // Derive stat card values from summaries (active monitors only)
      const activeMonitorSummaries = monitorSummaries.filter((m) => m.isActive === 1)
      totalMonitors = activeMonitorSummaries.length
      monitorsUp    = activeMonitorSummaries.filter((m) => m.lastStatus === 'up').length
      monitorsDown  = activeMonitorSummaries.filter((m) => m.lastStatus === 'down').length
    } catch {
      dbError = true
    }
  } else {
    dbError = true
  }

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

  // ── Group monitors by customerSlug ──
  const monitorsByCustomer = new Map<string, MonitorSummary[]>()
  for (const ms of monitorSummaries) {
    if (ms.customerSlug) {
      const existing = monitorsByCustomer.get(ms.customerSlug) ?? []
      existing.push(ms)
      monitorsByCustomer.set(ms.customerSlug, existing)
    }
  }

  // ── Build customer cards array ──
  const customerCards = customers.map((c) => ({
    name: c.name,
    slug: c.slug,
    subdomain: c.subdomain,
    status: c.status,
    startDate: c.startDate,
    monitors: monitorsByCustomer.get(c.slug) ?? [],
  }))

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

      {/* ── Customer & Monitor Cards ── */}
      <CustomerCardGrid cards={customerCards} />
    </div>
  )
}
