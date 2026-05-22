export const runtime = 'edge'

import { getDB } from '@/lib/db'
import { managedCustomers } from '@/lib/db/schema'
import { getMultiBucketStatus } from '@/lib/r2'
import type { ManagedCustomer } from '@/lib/db/schema'

async function getCfEnv(): Promise<Env | undefined> {
  try {
    const { getRequestContext } = await import('@cloudflare/next-on-pages')
    return getRequestContext().env as unknown as Env
  } catch {
    return undefined
  }
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

export default async function DashboardPage() {
  const env = await getCfEnv()
  const now = new Date()

  // ── Fetch data ────────────────────────────────────────────
  let customers: ManagedCustomer[] = []
  let totalCount = 0
  let activeCount = 0
  let backupAlerts = 0
  let dbError = false

  if (env?.DB) {
    try {
      const db = getDB(env.DB)
      customers = await db.select().from(managedCustomers)
      totalCount = customers.length
      activeCount = customers.filter((c) => c.status === 'active').length

      // Check R2 backup status for customers with buckets
      const withBuckets = customers
        .filter((c) => c.r2Bucket)
        .map((c) => ({ slug: c.slug, bucket: c.r2Bucket! }))

      if (withBuckets.length > 0 && env.R2_ACCOUNT_ID) {
        const statusMap = await getMultiBucketStatus(env, withBuckets)
        backupAlerts = Array.from(statusMap.values()).filter(
          (s) => s.status !== 'ok',
        ).length
      }
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

  return (
    <div>
      {/* ── Header ── */}
      <div style={{ marginBottom: 28 }}>
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

      {/* ── Stat Cards ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 16,
          marginBottom: 32,
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

      {/* ── Recent Customers Table ── */}
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
    </div>
  )
}
