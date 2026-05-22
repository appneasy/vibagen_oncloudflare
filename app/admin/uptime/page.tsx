export const runtime = 'edge'

import Link from 'next/link'
import { getDB } from '@/lib/db'
import { uptimeMonitors, uptimeChecks } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import type { UptimeMonitor, UptimeCheck } from '@/lib/db/schema'

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

type EnrichedMonitor = UptimeMonitor & {
  lastStatus:         UptimeCheck['status'] | null
  lastResponseTimeMs: number | null
  lastCheckedAt:      string | null
}

const STATUS_DOT: Record<string, string> = {
  up:      '#10b981',
  down:    '#ef4444',
  paused:  '#9ca3af',
  unknown: '#d1d5db',
}

export default async function UptimePage() {
  const env = await getCfEnv()

  let monitors: EnrichedMonitor[] = []
  let dbError = false

  if (env?.DB) {
    try {
      const db = getDB(env.DB)
      const rows = await db.select().from(uptimeMonitors)

      monitors = await Promise.all(
        rows.map(async (m) => {
          const latestCheck = await db
            .select()
            .from(uptimeChecks)
            .where(eq(uptimeChecks.monitorId, m.id))
            .orderBy(desc(uptimeChecks.checkedAt))
            .limit(1)
            .get()

          return {
            ...m,
            lastStatus:         latestCheck?.status         ?? null,
            lastResponseTimeMs: latestCheck?.responseTimeMs ?? null,
            lastCheckedAt:      latestCheck?.checkedAt      ?? null,
          }
        }),
      )
    } catch {
      dbError = true
    }
  } else {
    dbError = true
  }

  const totalCount  = monitors.length
  const onlineCount = monitors.filter((m) => m.isActive === 1 && m.lastStatus === 'up').length
  const offlineCount = monitors.filter((m) => m.isActive === 1 && m.lastStatus === 'down').length
  const pausedCount = monitors.filter((m) => m.isActive === 0).length

  function getStatusKey(m: EnrichedMonitor): string {
    if (m.isActive === 0) return 'paused'
    if (!m.lastStatus) return 'unknown'
    return m.lastStatus
  }

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
          Uptime Monitor
        </h1>
        <Link
          href="/admin/uptime/new"
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
          + Add Monitor
        </Link>
      </div>

      {/* ── Summary cards ── */}
      {!dbError && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12, marginBottom: 20 }}>
          {/* Total */}
          <div
            style={{
              background: '#fff',
              borderRadius: 10,
              padding: '14px 16px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              border: '1px solid #e5e9f0',
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 600, color: '#737373', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
              Total
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, color: '#0d2749', fontFamily: 'var(--font-prompt)' }}>
              {totalCount}
            </div>
          </div>

          {/* Online */}
          <div
            style={{
              background: '#fff',
              borderRadius: 10,
              padding: '14px 16px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              border: '1px solid #e5e9f0',
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 600, color: '#737373', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
              Online
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, color: '#10b981', fontFamily: 'var(--font-prompt)' }}>
              {onlineCount}
            </div>
          </div>

          {/* Offline */}
          <div
            style={{
              background: '#fff',
              borderRadius: 10,
              padding: '14px 16px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              border: '1px solid #e5e9f0',
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 600, color: '#737373', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
              Offline
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, color: offlineCount > 0 ? '#ef4444' : '#0d2749', fontFamily: 'var(--font-prompt)' }}>
              {offlineCount}
            </div>
          </div>

          {/* Paused */}
          <div
            style={{
              background: '#fff',
              borderRadius: 10,
              padding: '14px 16px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              border: '1px solid #e5e9f0',
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 600, color: '#737373', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
              Paused
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, color: '#9ca3af', fontFamily: 'var(--font-prompt)' }}>
              {pausedCount}
            </div>
          </div>
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
      {monitors.length === 0 && (
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
              ยังไม่มี Monitor —{' '}
              <Link
                href="/admin/uptime/new"
                style={{ color: '#ff6c01', textDecoration: 'none', fontWeight: 500 }}
              >
                เพิ่ม Monitor ใหม่
              </Link>
            </>
          )}
        </div>
      )}

      {monitors.length > 0 && (
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
                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#0d2749', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', width: 36 }}></th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#0d2749', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Label</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#0d2749', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>URL</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#0d2749', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Response Time</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#0d2749', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Last Check</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#0d2749', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Customer</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#0d2749', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {monitors.map((m, i) => {
                    const statusKey = getStatusKey(m)
                    const dotColor  = STATUS_DOT[statusKey] ?? STATUS_DOT.unknown
                    return (
                      <tr
                        key={m.id}
                        className="admin-table-row"
                        style={{
                          borderBottom: i < monitors.length - 1 ? '1px solid #f0f4f8' : 'none',
                        }}
                      >
                        {/* Status dot */}
                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                          <span style={{ color: dotColor, fontSize: 18, lineHeight: 1 }}>●</span>
                        </td>

                        {/* Label */}
                        <td style={{ padding: '12px 16px', fontWeight: 500 }}>
                          <Link
                            href={`/admin/uptime/${m.id}`}
                            style={{ color: '#0d2749', textDecoration: 'none' }}
                          >
                            {m.label}
                          </Link>
                        </td>

                        {/* URL */}
                        <td
                          style={{
                            padding: '12px 16px',
                            color: '#737373',
                            fontFamily: 'monospace',
                            fontSize: 12,
                            maxWidth: 220,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {m.url}
                        </td>

                        {/* Response time */}
                        <td style={{ padding: '12px 16px', color: '#374151', fontSize: 13 }}>
                          {m.lastResponseTimeMs != null ? `${m.lastResponseTimeMs} ms` : '—'}
                        </td>

                        {/* Last check */}
                        <td style={{ padding: '12px 16px', color: '#737373', fontSize: 13 }}>
                          {m.lastCheckedAt ? relativeTime(m.lastCheckedAt) : '—'}
                        </td>

                        {/* Customer */}
                        <td style={{ padding: '12px 16px', fontSize: 13 }}>
                          {m.customerSlug ? (
                            <Link
                              href={`/admin/customers/${m.customerSlug}`}
                              style={{ color: '#ff6c01', textDecoration: 'none', fontWeight: 500 }}
                            >
                              {m.customerSlug}
                            </Link>
                          ) : (
                            <span style={{ color: '#9ca3af' }}>—</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td style={{ padding: '12px 16px' }}>
                          <Link
                            href={`/admin/uptime/${m.id}`}
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
            {monitors.map((m) => {
              const statusKey = getStatusKey(m)
              const dotColor  = STATUS_DOT[statusKey] ?? STATUS_DOT.unknown
              return (
                <Link
                  key={m.id}
                  href={`/admin/uptime/${m.id}`}
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
                    {/* Row 1: Status dot + Label */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ color: dotColor, fontSize: 16, lineHeight: 1 }}>●</span>
                        <span style={{ fontFamily: 'var(--font-prompt)', fontWeight: 600, fontSize: 15, color: '#0d2749' }}>
                          {m.label}
                        </span>
                      </div>
                      {m.isActive === 0 && (
                        <span style={{ padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: '#f3f4f6', color: '#9ca3af' }}>
                          Paused
                        </span>
                      )}
                    </div>
                    {/* Row 2: URL */}
                    <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#737373', marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {m.url}
                    </div>
                    {/* Row 3: Response time + Last check + Customer */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 14px', fontSize: 12, color: '#737373' }}>
                      {m.lastResponseTimeMs != null && (
                        <span>{m.lastResponseTimeMs} ms</span>
                      )}
                      {m.lastCheckedAt && (
                        <span>{relativeTime(m.lastCheckedAt)}</span>
                      )}
                      {m.customerSlug && (
                        <span style={{ color: '#ff6c01', fontWeight: 500 }}>{m.customerSlug}</span>
                      )}
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
