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

      {/* ── Empty state ── */}
      {customers.length === 0 && (
        <div
          style={{
            background: '#fff',
            borderRadius: 12,
            padding: '60px 20px',
            textAlign: 'center',
            color: '#737373',
            fontSize: 14,
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            border: '1px solid #e5e9f0',
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
      )}

      {customers.length > 0 && (
        <>
          {/* ── Desktop Table ── */}
          <div
            className="admin-table-desktop"
            style={{
              background: '#fff',
              borderRadius: 12,
              overflow: 'hidden',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              border: '1px solid #e5e9f0',
            }}
          >
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e5e9f0' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#0d2749', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Name</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#0d2749', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Subdomain</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#0d2749', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>VPS IP</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#0d2749', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#0d2749', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Start Date</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#0d2749', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c, i) => {
                    const statusStyle = STATUS_COLORS[c.status ?? 'setup'] ?? STATUS_COLORS.setup
                    return (
                      <tr
                        key={c.id}
                        className="admin-table-row"
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
                              fontWeight: 600,
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
          </div>

          {/* ── Mobile Card Stack ── */}
          <div className="admin-card-mobile">
            {customers.map((c) => {
              const statusStyle = STATUS_COLORS[c.status ?? 'setup'] ?? STATUS_COLORS.setup
              return (
                <Link
                  key={c.id}
                  href={`/admin/customers/${c.slug}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div
                    style={{
                      background: '#fff',
                      borderRadius: 12,
                      padding: '16px 18px',
                      marginBottom: 10,
                      border: '1px solid #e5e9f0',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    }}
                  >
                    {/* Row 1: Name + Status */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <span style={{ fontFamily: 'var(--font-prompt)', fontWeight: 600, fontSize: 15, color: '#0d2749' }}>
                        {c.name}
                      </span>
                      <span style={{ padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: statusStyle.bg, color: statusStyle.color }}>
                        {STATUS_LABELS[c.status ?? 'setup'] ?? c.status}
                      </span>
                    </div>
                    {/* Row 2: Details */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px', fontSize: 13, color: '#737373' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{c.subdomain}</span>
                      {c.vpsIp && <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{c.vpsIp}</span>}
                      {c.startDate && <span>{c.startDate}</span>}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </>
      )}

      <style>{`
        @media (min-width: 769px) {
          .admin-card-mobile { display: none !important; }
        }
        @media (max-width: 768px) {
          .admin-table-desktop { display: none !important; }
          .admin-card-mobile { display: block !important; }
        }
        .admin-table-row:hover {
          background: #fff8f5;
          border-left: 3px solid #ff6c01;
        }
      `}</style>
    </div>
  )
}
