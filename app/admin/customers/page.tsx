export const runtime = 'edge'

import Link from 'next/link'
import { getDB } from '@/lib/db'
import { managedCustomers } from '@/lib/db/schema'
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
  setup:      'Setup',
  active:     'Active',
  suspended:  'Suspended',
  terminated: 'Terminated',
}

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  active:     { bg: '#d1fae5', color: '#065f46' },
  setup:      { bg: '#dbeafe', color: '#1e40af' },
  suspended:  { bg: '#fef3c7', color: '#92400e' },
  terminated: { bg: '#fee2e2', color: '#991b1b' },
}

export default async function CustomersPage() {
  const env = await getCfEnv()

  let customers: ManagedCustomer[] = []
  let dbError = false

  if (env?.DB) {
    try {
      const db = getDB(env.DB)
      customers = await db.select().from(managedCustomers)
      // Sort by name ascending
      customers.sort((a, b) => a.name.localeCompare(b.name))
    } catch {
      dbError = true
    }
  } else {
    dbError = true
  }

  const totalCount      = customers.length
  const activeCount     = customers.filter((c) => c.status === 'active').length
  const setupCount      = customers.filter((c) => c.status === 'setup').length
  const suspendedCount  = customers.filter((c) => c.status === 'suspended').length

  return (
    <div>
      {/* ── Header ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 16,
        }}
      >
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
          Customers
        </h1>
        <Link
          href="/admin/customers/new"
          style={{
            background: '#ff6c01',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '9px 20px',
            fontWeight: 600,
            fontSize: 14,
            textDecoration: 'none',
            display: 'inline-block',
          }}
        >
          + Add Customer
        </Link>
      </div>

      {/* ── Status summary badges ── */}
      {!dbError && (
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
          <span
            style={{
              padding: '4px 12px',
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 600,
              background: '#f0f4f8',
              color: '#0d2749',
            }}
          >
            Total: {totalCount}
          </span>
          <span
            style={{
              padding: '4px 12px',
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 600,
              background: '#d1fae5',
              color: '#065f46',
            }}
          >
            Active: {activeCount}
          </span>
          <span
            style={{
              padding: '4px 12px',
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 600,
              background: '#dbeafe',
              color: '#1e40af',
            }}
          >
            Setup: {setupCount}
          </span>
          <span
            style={{
              padding: '4px 12px',
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 600,
              background: '#fef3c7',
              color: '#92400e',
            }}
          >
            Suspended: {suspendedCount}
          </span>
        </div>
      )}

      {/* ── DB error notice ── */}
      {dbError && (
        <div
          style={{
            background: '#fef3c7',
            border: '1px solid #fbbf24',
            borderRadius: 10,
            padding: '12px 16px',
            marginBottom: 20,
            fontSize: 13,
            color: '#92400e',
          }}
        >
          DB unavailable — ไม่สามารถโหลดข้อมูลได้ (local dev mode)
        </div>
      )}

      {/* ── Table ── */}
      <div
        style={{
          background: '#fff',
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          border: '1px solid #e5e9f0',
        }}
      >
        {customers.length === 0 ? (
          <div
            style={{
              padding: '60px 20px',
              textAlign: 'center',
              color: '#737373',
              fontSize: 14,
            }}
          >
            {dbError ? (
              'ไม่สามารถโหลดข้อมูลได้'
            ) : (
              <>
                ยังไม่มีลูกค้า —{' '}
                <Link
                  href="/admin/customers/new"
                  style={{ color: '#ff6c01', textDecoration: 'none', fontWeight: 500 }}
                >
                  เพิ่มลูกค้าใหม่
                </Link>
              </>
            )}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: '#0d2749' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: '#fff', fontWeight: 500, fontSize: 13 }}>Name</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: '#fff', fontWeight: 500, fontSize: 13 }}>Subdomain</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: '#fff', fontWeight: 500, fontSize: 13 }}>VPS IP</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: '#fff', fontWeight: 500, fontSize: 13 }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: '#fff', fontWeight: 500, fontSize: 13 }}>Start Date</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: '#fff', fontWeight: 500, fontSize: 13 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c, i) => {
                  const statusStyle = STATUS_COLORS[c.status ?? 'setup'] ?? STATUS_COLORS.setup
                  return (
                    <tr
                      key={c.id}
                      style={{
                        borderBottom: i < customers.length - 1 ? '1px solid #f0f4f8' : 'none',
                      }}
                    >
                      <td style={{ padding: '12px 16px', fontWeight: 500 }}>
                        <Link
                          href={`/admin/customers/${c.slug}`}
                          style={{ color: '#0d2749', textDecoration: 'none' }}
                        >
                          {c.name}
                        </Link>
                      </td>
                      <td style={{ padding: '12px 16px', color: '#737373', fontFamily: 'monospace', fontSize: 13 }}>
                        {c.subdomain}
                      </td>
                      <td style={{ padding: '12px 16px', color: '#737373', fontFamily: 'monospace', fontSize: 13 }}>
                        {c.vpsIp ?? '—'}
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
                      <td style={{ padding: '12px 16px' }}>
                        <Link
                          href={`/admin/customers/${c.slug}`}
                          style={{ color: '#ff6c01', textDecoration: 'none', fontWeight: 500, fontSize: 13 }}
                        >
                          View
                        </Link>
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
