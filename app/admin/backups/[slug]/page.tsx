export const runtime = 'edge'

import Link from 'next/link'
import { eq } from 'drizzle-orm'
import { getDB } from '@/lib/db'
import { managedCustomers } from '@/lib/db/schema'
import { listObjects } from '@/lib/r2'
import BackupFolderView from '@/components/admin/BackupFolderView'
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

const CUSTOMER_STATUS_BADGE: Record<string, { bg: string; color: string; label: string }> = {
  active:     { bg: '#d1fae5', color: '#065f46', label: 'Active' },
  setup:      { bg: '#dbeafe', color: '#1e40af', label: 'Setup' },
  suspended:  { bg: '#fef3c7', color: '#92400e', label: 'Suspended' },
  terminated: { bg: '#fee2e2', color: '#991b1b', label: 'Terminated' },
}

const BACKUP_STATUS_BADGE: Record<string, { bg: string; color: string; label: string }> = {
  ok:      { bg: '#d1fae5', color: '#065f46', label: 'OK' },
  warning: { bg: '#fef3c7', color: '#92400e', label: 'Warning' },
  fail:    { bg: '#fee2e2', color: '#991b1b', label: 'Fail' },
}

// ─── Group files by folder prefix ─────────────────────────

const KNOWN_FOLDERS = ['config', 'db', 'upload']

function groupFiles(files: { key: string; size: number; lastModified: Date }[]) {
  const groups: Record<string, { key: string; size: number; lastModified: string }[]> = {}
  for (const f of KNOWN_FOLDERS) groups[f] = []
  groups['other'] = []

  for (const file of files) {
    const firstSlash = file.key.indexOf('/')
    const prefix = firstSlash > 0 ? file.key.substring(0, firstSlash) : null
    const folder = prefix && KNOWN_FOLDERS.includes(prefix) ? prefix : 'other'
    groups[folder].push({
      key: file.key,
      size: file.size,
      lastModified: file.lastModified.toISOString(),
    })
  }

  return KNOWN_FOLDERS.concat('other')
    .filter((f) => groups[f].length > 0)
    .map((f) => ({
      folder: f,
      files: groups[f],
      totalSize: groups[f].reduce((s, file) => s + file.size, 0),
    }))
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

  // Compute backup summary
  const totalFiles = files.length
  const totalSize = files.reduce((s, f) => s + f.size, 0)
  const lastBackup = files.length > 0 ? files[0].lastModified : null

  let backupStatus: 'ok' | 'warning' | 'fail' = 'fail'
  if (lastBackup) {
    const hoursSince = (Date.now() - lastBackup.getTime()) / (1000 * 60 * 60)
    backupStatus = hoursSince < 26 ? 'ok' : hoursSince <= 48 ? 'warning' : 'fail'
  }

  const customerBadge = CUSTOMER_STATUS_BADGE[customer.status ?? 'setup'] ?? CUSTOMER_STATUS_BADGE.setup
  const backupBadge = BACKUP_STATUS_BADGE[backupStatus]

  // Group files by folder for BackupFolderView
  const folderGroups = groupFiles(files)

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
          marginBottom: 20,
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
              background: customerBadge.bg,
              color: customerBadge.color,
            }}
          >
            {customerBadge.label}
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

      {/* ── Backup summary row ── */}
      {customer.r2Bucket && !r2Error && (
        <div
          style={{
            background: '#fff',
            borderRadius: 12,
            padding: '14px 20px',
            marginBottom: 20,
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            border: '1px solid #e5e9f0',
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            flexWrap: 'wrap',
            fontSize: 13,
          }}
        >
          <span style={{ color: '#737373' }}>
            Total:{' '}
            <strong style={{ color: '#0d2749' }}>{totalFiles} files</strong>
          </span>
          <span style={{ color: '#737373' }}>
            Size:{' '}
            <strong style={{ color: '#0d2749' }}>{formatBytes(totalSize)}</strong>
          </span>
          <span style={{ color: '#737373' }}>
            Last backup:{' '}
            <strong style={{ color: '#0d2749' }}>
              {lastBackup ? formatRelativeTime(lastBackup) : '—'}
            </strong>
          </span>
          <span
            style={{
              marginLeft: 'auto',
              padding: '3px 10px',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 600,
              background: backupBadge.bg,
              color: backupBadge.color,
            }}
          >
            {backupBadge.label}
          </span>
        </div>
      )}

      {/* ── Folder view ── */}
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
            {totalFiles > 0 && (
              <span style={{ fontWeight: 400, fontSize: 13, color: '#737373', marginLeft: 8 }}>
                ({totalFiles} ไฟล์)
              </span>
            )}
          </h2>
        </div>

        <div style={{ padding: 16 }}>
          {!customer.r2Bucket ? (
            <div
              style={{
                padding: '40px 20px',
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
                padding: '40px 20px',
                textAlign: 'center',
                color: '#991b1b',
                fontSize: 14,
              }}
            >
              ไม่สามารถโหลดข้อมูล R2 ได้
            </div>
          ) : (
            <BackupFolderView folders={folderGroups} />
          )}
        </div>
      </div>
    </div>
  )
}
