export const runtime = 'edge'

import Link from 'next/link'
import { eq } from 'drizzle-orm'
import { getDB } from '@/lib/db'
import { uptimeMonitors } from '@/lib/db/schema'
import type { UptimeMonitor } from '@/lib/db/schema'
import MonitorForm from '@/components/admin/MonitorForm'

async function getCfEnv(): Promise<Env | undefined> {
  try {
    const { getRequestContext } = await import('@cloudflare/next-on-pages')
    return getRequestContext().env as unknown as Env
  } catch {
    return undefined
  }
}

export default async function EditMonitorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const monitorId = parseInt(id, 10)
  const env = await getCfEnv()

  let monitor: UptimeMonitor | null = null
  let dbError = false

  if (!isNaN(monitorId) && env?.DB) {
    try {
      const db = getDB(env.DB)
      const row = await db
        .select()
        .from(uptimeMonitors)
        .where(eq(uptimeMonitors.id, monitorId))
        .get()
      monitor = row ?? null
    } catch {
      dbError = true
    }
  } else {
    dbError = !env?.DB
  }

  if (!monitor) {
    return (
      <div>
        <Link
          href="/admin/uptime"
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
          ← Uptime Monitor
        </Link>
        <div style={{ marginTop: 40, textAlign: 'center', color: '#737373', fontSize: 15 }}>
          {dbError ? 'ไม่สามารถโหลดข้อมูลได้' : 'Monitor not found'}
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* ── Back link ── */}
      <Link
        href={`/admin/uptime/${monitorId}`}
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
        ← {monitor.label}
      </Link>

      {/* ── Page title ── */}
      <h1
        style={{
          fontFamily: 'var(--font-prompt)',
          fontWeight: 700,
          fontSize: 28,
          color: '#0d2749',
          margin: '0 0 24px',
          lineHeight: 1.2,
        }}
      >
        Edit Monitor
      </h1>

      <MonitorForm mode="edit" initialData={monitor} monitorId={monitorId} />
    </div>
  )
}
