export const runtime = 'edge'

import Link from 'next/link'
import { getDB } from '@/lib/db'
import { managedCustomers } from '@/lib/db/schema'
import { getMultiBucketGroupedStatus } from '@/lib/r2'
import type { ManagedCustomer } from '@/lib/db/schema'
import type { BucketGroupedStatus } from '@/lib/r2'

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

const FOLDER_DOT: Record<string, string> = {
  config: '#3b82f6',
  db:     '#8b5cf6',
  upload: '#f59e0b',
  other:  '#9ca3af',
}

// ─── Page ─────────────────────────────────────────────────

export default async function BackupsPage() {
  const env = await getCfEnv()

  let customers: ManagedCustomer[] = []
  let statusMap = new Map<string, BucketGroupedStatus>()
  let dbError = false

  if (env?.DB) {
    try {
      const db = getDB(env.DB)
      customers = await db.select().from(managedCustomers)

      const withBuckets = customers
        .filter((c) => c.r2Bucket)
        .map((c) => ({ slug: c.slug, bucket: c.r2Bucket! }))

      if (withBuckets.length > 0 && env.R2_ACCOUNT_ID) {
        statusMap = await getMultiBucketGroupedStatus(env, withBuckets)
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
        <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
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

      {/* ── Card grid ── */}
      {customersWithBuckets.length === 0 ? (
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
          {dbError ? 'ไม่สามารถโหลดข้อมูลได้' : 'ยังไม่มี customer ที่ตั้งค่า R2 bucket'}
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 16,
          }}
        >
          {customersWithBuckets.map((c) => {
            const s = statusMap.get(c.slug)
            const badge = STATUS_BADGE[s?.status ?? 'fail']

            return (
              <Link
                key={c.id}
                href={`/admin/backups/${c.slug}`}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'block',
                }}
              >
                <div
                  style={{
                    background: '#fff',
                    borderRadius: 12,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                    border: '1px solid #e5e9f0',
                    overflow: 'hidden',
                  }}
                >
                  {/* Card header */}
                  <div
                    style={{
                      padding: '16px 20px',
                      borderBottom: '1px solid #f0f4f8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 8,
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
                      {c.name}
                    </span>
                    <span
                      style={{
                        padding: '3px 10px',
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 600,
                        background: badge.bg,
                        color: badge.color,
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                      }}
                    >
                      {badge.label}
                    </span>
                  </div>

                  {/* Card body */}
                  <div style={{ padding: '14px 20px' }}>
                    {/* Subdomain */}
                    <div
                      style={{
                        fontSize: 12,
                        color: '#737373',
                        fontFamily: 'monospace',
                        marginBottom: 10,
                      }}
                    >
                      {c.subdomain}
                    </div>

                    {/* Last backup */}
                    <div style={{ fontSize: 13, color: '#737373', marginBottom: 14 }}>
                      Last backup:{' '}
                      <span style={{ color: '#0d2749', fontWeight: 500 }}>
                        {s?.lastBackup ? formatRelativeTime(s.lastBackup) : '—'}
                      </span>
                    </div>

                    {/* Folder breakdown */}
                    {s && s.folders.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {s.folders.map((f) => (
                          <div
                            key={f.folder}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                              fontSize: 13,
                            }}
                          >
                            {/* Colored dot */}
                            <span
                              style={{
                                display: 'inline-block',
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                background: FOLDER_DOT[f.folder] ?? FOLDER_DOT.other,
                                flexShrink: 0,
                              }}
                            />
                            <span style={{ color: '#0d2749', fontWeight: 500, minWidth: 56 }}>
                              {f.folder}/
                            </span>
                            <span style={{ color: '#737373' }}>
                              {f.fileCount} {f.fileCount === 1 ? 'file' : 'files'}
                            </span>
                            <span style={{ color: '#9ca3af', marginLeft: 'auto' }}>
                              {formatBytes(f.totalSize)}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ fontSize: 13, color: '#9ca3af' }}>No backup files</div>
                    )}

                    {/* Total summary */}
                    {s && s.totalFiles > 0 && (
                      <div
                        style={{
                          marginTop: 12,
                          paddingTop: 10,
                          borderTop: '1px solid #f0f4f8',
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: 12,
                          color: '#737373',
                        }}
                      >
                        <span>Total: {s.totalFiles} files</span>
                        <span>{formatBytes(s.totalSize)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
