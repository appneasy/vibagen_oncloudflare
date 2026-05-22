import Link from 'next/link'
import { getDB } from '@/lib/db'
import { managedCustomers } from '@/lib/db/schema'
import { getMultiBucketStatus } from '@/lib/r2'
import type { ManagedCustomer } from '@/lib/db/schema'
import type { BucketBackupStatus } from '@/lib/r2'

async function getCfEnv(): Promise<Env | undefined> {
  try {
    const { getRequestContext } = await import('@cloudflare/next-on-pages')
    return getRequestContext().env as unknown as Env
  } catch {
    return undefined
  }
}

// ─── Helpers ──────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

function formatRelativeTime(date: Date): string {
  const nowMs = Date.now()
  const diffMs = nowMs - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 1) return 'เพิ่งสักครู่'
  if (diffMins < 60) return `${diffMins} นาทีที่แล้ว`
  if (diffHours < 24) return `${diffHours} ชั่วโมงที่แล้ว`
  if (diffDays === 1) return 'เมื่อวาน'
  return `${diffDays} วันที่แล้ว`
}

const STATUS_BADGE: Record<string, { bg: string; color: string; label: string }> = {
  ok:      { bg: '#d1fae5', color: '#065f46', label: 'OK' },
  warning: { bg: '#fef3c7', color: '#92400e', label: 'Warning' },
  fail:    { bg: '#fee2e2', color: '#991b1b', label: 'Fail' },
}

// ─── Page ─────────────────────────────────────────────────

export default async function BackupsPage() {
  const env = await getCfEnv()

  let customers: ManagedCustomer[] = []
  let statusMap = new Map<string, BucketBackupStatus>()
  let dbError = false

  if (env?.DB) {
    try {
      const db = getDB(env.DB)
      customers = await db.select().from(managedCustomers)

      const withBuckets = customers
        .filter((c) => c.r2Bucket)
        .map((c) => ({ slug: c.slug, bucket: c.r2Bucket! }))

      if (withBuckets.length > 0 && env.R2_ACCOUNT_ID) {
        statusMap = await getMultiBucketStatus(env, withBuckets)
      }
    } catch {
      dbError = true
    }
  } else {
    dbError = true
  }

  const customersWithBuckets = customers.filter((c) => c.r2Bucket)

  // Summary counts
  let okCount = 0
  let warningCount = 0
  let failCount = 0
  for (const [, s] of statusMap) {
    if (s.status === 'ok') okCount++
    else if (s.status === 'warning') warningCount++
    else failCount++
  }

  return (
    <div>
      {/* ── Header ── */}
      <div style={{ marginBottom: 24 }}>
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
          Backup Monitor
        </h1>
        <p style={{ margin: '6px 0 0', fontSize: 14, color: '#737373' }}>
          สถานะ R2 backup ของทุก customer
        </p>
      </div>

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

      {/* ── Summary badges ── */}
      {statusMap.size > 0 && (
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
          <span
            style={{
              padding: '4px 14px',
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 600,
              background: '#d1fae5',
              color: '#065f46',
            }}
          >
            {okCount} OK
          </span>
          <span
            style={{
              padding: '4px 14px',
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 600,
              background: '#fef3c7',
              color: '#92400e',
            }}
          >
            {warningCount} Warning
          </span>
          <span
            style={{
              padding: '4px 14px',
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 600,
              background: '#fee2e2',
              color: '#991b1b',
            }}
          >
            {failCount} Failed
          </span>
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
        {customersWithBuckets.length === 0 ? (
          <div
            style={{
              padding: '60px 20px',
              textAlign: 'center',
              color: '#737373',
              fontSize: 14,
            }}
          >
            {dbError
              ? 'ไม่สามารถโหลดข้อมูลได้'
              : 'ยังไม่มี customer ที่ตั้งค่า R2 bucket'}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: '#0d2749' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: '#fff', fontWeight: 500, fontSize: 13 }}>Customer</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: '#fff', fontWeight: 500, fontSize: 13 }}>Subdomain</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: '#fff', fontWeight: 500, fontSize: 13 }}>R2 Bucket</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: '#fff', fontWeight: 500, fontSize: 13 }}>Last Backup</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', color: '#fff', fontWeight: 500, fontSize: 13 }}>Files</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', color: '#fff', fontWeight: 500, fontSize: 13 }}>Size</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', color: '#fff', fontWeight: 500, fontSize: 13 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {customersWithBuckets.map((c, i) => {
                  const s = statusMap.get(c.slug)
                  const badge = STATUS_BADGE[s?.status ?? 'fail']
                  const isLast = i === customersWithBuckets.length - 1

                  return (
                    <tr
                      key={c.id}
                      style={{
                        borderBottom: isLast ? 'none' : '1px solid #f0f4f8',
                        cursor: 'pointer',
                      }}
                    >
                      <td style={{ padding: '13px 16px' }}>
                        <Link
                          href={`/admin/backups/${c.slug}`}
                          style={{
                            color: '#0d2749',
                            fontWeight: 500,
                            textDecoration: 'none',
                          }}
                        >
                          {c.name}
                        </Link>
                      </td>
                      <td style={{ padding: '13px 16px', color: '#737373', fontFamily: 'monospace', fontSize: 13 }}>
                        {c.subdomain}
                      </td>
                      <td style={{ padding: '13px 16px', color: '#737373', fontFamily: 'monospace', fontSize: 12 }}>
                        {c.r2Bucket}
                      </td>
                      <td style={{ padding: '13px 16px', color: '#737373' }}>
                        {s?.lastBackup ? formatRelativeTime(s.lastBackup) : '—'}
                      </td>
                      <td style={{ padding: '13px 16px', color: '#737373', textAlign: 'right' }}>
                        {s ? s.totalFiles.toLocaleString() : '—'}
                      </td>
                      <td style={{ padding: '13px 16px', color: '#737373', textAlign: 'right' }}>
                        {s ? formatBytes(s.totalSize) : '—'}
                      </td>
                      <td style={{ padding: '13px 16px', textAlign: 'center' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '3px 10px',
                            borderRadius: 20,
                            fontSize: 12,
                            fontWeight: 600,
                            background: badge.bg,
                            color: badge.color,
                          }}
                        >
                          {badge.label}
                        </span>
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
