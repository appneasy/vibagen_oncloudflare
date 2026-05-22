export const runtime = 'edge'

import Link from 'next/link'
import { eq } from 'drizzle-orm'
import { getDB } from '@/lib/db'
import { managedCustomers } from '@/lib/db/schema'
import { listObjects } from '@/lib/r2'
import type { ManagedCustomer } from '@/lib/db/schema'

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

function formatDateTime(date: Date): string {
  return date.toLocaleString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const STATUS_BADGE: Record<string, { bg: string; color: string; label: string }> = {
  active:     { bg: '#d1fae5', color: '#065f46', label: 'Active' },
  setup:      { bg: '#dbeafe', color: '#1e40af', label: 'Setup' },
  suspended:  { bg: '#fef3c7', color: '#92400e', label: 'Suspended' },
  terminated: { bg: '#fee2e2', color: '#991b1b', label: 'Terminated' },
}

// ─── Page ─────────────────────────────────────────────────

export default async function BackupDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const env = await getCfEnv()

  let customer: ManagedCustomer | null = null
  let files: { key: string; size: number; lastModified: Date }[] = []
  let dbError = false
  let r2Error = false

  if (env?.DB) {
    try {
      const db = getDB(env.DB)
      const row = await db
        .select()
        .from(managedCustomers)
        .where(eq(managedCustomers.slug, slug))
        .get()
      customer = row ?? null
    } catch {
      dbError = true
    }
  } else {
    dbError = true
  }

  if (!customer) {
    return (
      <div>
        <Link
          href="/admin/backups"
          style={{ fontSize: 14, color: '#ff6c01', textDecoration: 'none' }}
        >
          ← Backup Monitor
        </Link>
        <div
          style={{
            marginTop: 40,
            textAlign: 'center',
            color: '#737373',
            fontSize: 15,
          }}
        >
          {dbError ? 'ไม่สามารถโหลดข้อมูลได้' : 'Customer not found'}
        </div>
      </div>
    )
  }

  // Load R2 file list
  if (customer.r2Bucket && env?.R2_ACCOUNT_ID) {
    try {
      const objects = await listObjects(env, customer.r2Bucket)
      // Sort newest first
      files = [...objects].sort(
        (a, b) => b.lastModified.getTime() - a.lastModified.getTime(),
      )
    } catch {
      r2Error = true
    }
  }

  const statusBadge = STATUS_BADGE[customer.status ?? 'setup'] ?? STATUS_BADGE.setup

  return (
    <div>
      {/* ── Back link ── */}
      <Link
        href="/admin/backups"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 14,
          color: '#ff6c01',
          textDecoration: 'none',
          marginBottom: 20,
        }}
      >
        ← Backup Monitor
      </Link>

      {/* ── Customer info header ── */}
      <div
        style={{
          background: '#fff',
          borderRadius: 12,
          padding: '20px 24px',
          marginBottom: 24,
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          border: '1px solid #e5e9f0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <h1
            style={{
              fontFamily: 'var(--font-prompt)',
              fontWeight: 700,
              fontSize: 22,
              color: '#0d2749',
              margin: 0,
            }}
          >
            {customer.name}
          </h1>
          <span
            style={{
              padding: '3px 10px',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 600,
              background: statusBadge.bg,
              color: statusBadge.color,
            }}
          >
            {statusBadge.label}
          </span>
        </div>

        <div
          style={{
            marginTop: 12,
            display: 'flex',
            gap: 24,
            flexWrap: 'wrap',
            fontSize: 13,
            color: '#737373',
          }}
        >
          <span>
            <strong style={{ color: '#0d2749' }}>Subdomain:</strong>{' '}
            <code style={{ fontFamily: 'monospace', fontSize: 12 }}>{customer.subdomain}</code>
          </span>
          <span>
            <strong style={{ color: '#0d2749' }}>R2 Bucket:</strong>{' '}
            <code style={{ fontFamily: 'monospace', fontSize: 12 }}>
              {customer.r2Bucket ?? '—'}
            </code>
          </span>
          {customer.vpsIp && (
            <span>
              <strong style={{ color: '#0d2749' }}>VPS IP:</strong>{' '}
              <code style={{ fontFamily: 'monospace', fontSize: 12 }}>{customer.vpsIp}</code>
            </span>
          )}
        </div>
      </div>

      {/* ── File list table ── */}
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
            padding: '14px 20px',
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
            Backup Files
            {files.length > 0 && (
              <span style={{ fontWeight: 400, fontSize: 13, color: '#737373', marginLeft: 8 }}>
                ({files.length} ไฟล์)
              </span>
            )}
          </h2>
        </div>

        {!customer.r2Bucket ? (
          <div
            style={{
              padding: '60px 20px',
              textAlign: 'center',
              color: '#737373',
              fontSize: 14,
            }}
          >
            Customer นี้ยังไม่ได้ตั้งค่า R2 bucket
          </div>
        ) : r2Error ? (
          <div
            style={{
              padding: '60px 20px',
              textAlign: 'center',
              color: '#991b1b',
              fontSize: 14,
            }}
          >
            ไม่สามารถโหลดข้อมูล R2 ได้
          </div>
        ) : files.length === 0 ? (
          <div
            style={{
              padding: '60px 20px',
              textAlign: 'center',
              color: '#737373',
              fontSize: 14,
            }}
          >
            No backup files found
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: '#0d2749' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: '#fff', fontWeight: 500, fontSize: 13 }}>Key (Filename)</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', color: '#fff', fontWeight: 500, fontSize: 13 }}>Size</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: '#fff', fontWeight: 500, fontSize: 13 }}>Last Modified</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file, i) => (
                  <tr
                    key={file.key}
                    style={{
                      borderBottom: i < files.length - 1 ? '1px solid #f0f4f8' : 'none',
                    }}
                  >
                    <td
                      style={{
                        padding: '11px 16px',
                        color: '#0d2749',
                        fontFamily: 'monospace',
                        fontSize: 13,
                        wordBreak: 'break-all',
                      }}
                    >
                      {file.key}
                    </td>
                    <td
                      style={{
                        padding: '11px 16px',
                        color: '#737373',
                        textAlign: 'right',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {formatBytes(file.size)}
                    </td>
                    <td
                      style={{
                        padding: '11px 16px',
                        color: '#737373',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {formatDateTime(file.lastModified)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
