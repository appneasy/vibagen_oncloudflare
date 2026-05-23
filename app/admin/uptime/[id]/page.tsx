export const runtime = 'edge'

import Link from 'next/link'
import { eq, desc, and, gte, sql } from 'drizzle-orm'
import { getDB } from '@/lib/db'
import { uptimeMonitors, uptimeChecks, uptimeIncidents, uptimeMaintenance } from '@/lib/db/schema'
import type { UptimeMonitor, UptimeCheck, UptimeIncident, UptimeMaintenance } from '@/lib/db/schema'
import DeleteMonitorButton from './DeleteMonitorButton'
import PauseResumeButton from './PauseResumeButton'
import ResponseTimeChart from '@/components/admin/ResponseTimeChart'

async function getCfEnv(): Promise<Env | undefined> {
  try {
    const { getRequestContext } = await import('@cloudflare/next-on-pages')
    return getRequestContext().env as unknown as Env
  } catch {
    return undefined
  }
}

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr.replace(' ', 'T') + 'Z').getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'เมื่อสักครู่'
  if (minutes < 60) return `${minutes} นาทีที่แล้ว`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} ชม.ที่แล้ว`
  const days = Math.floor(hours / 24)
  return `${days} วันที่แล้ว`
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  return `${h}h ${m}m`
}

function toDbDatetime(d: Date): string {
  return d.toISOString().replace('T', ' ').slice(0, 19)
}

function DetailField({ label, value, mono = false }: { label: string; value: string | null | undefined; mono?: boolean }) {
  return (
    <div>
      <div
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: '#0d2749',
          marginBottom: 4,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 14,
          color: value ? '#374151' : '#9ca3af',
          fontFamily: mono ? 'monospace' : 'inherit',
        }}
      >
        {value ?? '—'}
      </div>
    </div>
  )
}

const SEVERITY_BADGE: Record<string, { bg: string; color: string }> = {
  minor:    { bg: '#fef3c7', color: '#92400e' },
  major:    { bg: '#fee2e2', color: '#991b1b' },
  critical: { bg: '#7f1d1d', color: '#fff' },
}

const STATUS_DOT: Record<string, string> = {
  up:   '#10b981',
  down: '#ef4444',
}

export default async function MonitorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const monitorId = parseInt(id, 10)

  const env = await getCfEnv()

  let monitor: UptimeMonitor | null = null
  let recentChecks: UptimeCheck[] = []
  let recentIncidents: UptimeIncident[] = []
  let maintenanceWindows: UptimeMaintenance[] = []
  let uptime24h: number | null = null
  let uptime7d:  number | null = null
  let uptime30d: number | null = null
  let dbError = false

  if (isNaN(monitorId)) {
    return (
      <div>
        <Link href="/admin/uptime" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: '#ff6c01', textDecoration: 'none', marginBottom: 20 }}>
          ← Uptime Monitor
        </Link>
        <div style={{ marginTop: 40, textAlign: 'center', color: '#737373', fontSize: 15 }}>
          Invalid monitor ID
        </div>
      </div>
    )
  }

  if (env?.DB) {
    try {
      const db = getDB(env.DB)

      monitor = await db
        .select()
        .from(uptimeMonitors)
        .where(eq(uptimeMonitors.id, monitorId))
        .get() ?? null

      if (monitor) {
        recentChecks = await db
          .select()
          .from(uptimeChecks)
          .where(eq(uptimeChecks.monitorId, monitorId))
          .orderBy(desc(uptimeChecks.checkedAt))
          .limit(50)

        recentIncidents = await db
          .select()
          .from(uptimeIncidents)
          .where(eq(uptimeIncidents.monitorId, monitorId))
          .orderBy(desc(uptimeIncidents.startedAt))
          .limit(10)

        maintenanceWindows = await db
          .select()
          .from(uptimeMaintenance)
          .where(eq(uptimeMaintenance.monitorId, monitorId))

        const now = new Date()
        const since24h = toDbDatetime(new Date(now.getTime() - 24 * 60 * 60 * 1000))
        const since7d  = toDbDatetime(new Date(now.getTime() - 7  * 24 * 60 * 60 * 1000))
        const since30d = toDbDatetime(new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000))

        async function calcUptime(sinceIso: string): Promise<number | null> {
          const row = await db
            .select({
              total:   sql<number>`COUNT(*)`,
              upCount: sql<number>`SUM(CASE WHEN ${uptimeChecks.status} = 'up' THEN 1 ELSE 0 END)`,
            })
            .from(uptimeChecks)
            .where(and(eq(uptimeChecks.monitorId, monitorId), gte(uptimeChecks.checkedAt, sinceIso)))
            .get()
          if (!row || Number(row.total) === 0) return null
          return Math.round((Number(row.upCount) / Number(row.total)) * 1000) / 10
        }

        ;[uptime24h, uptime7d, uptime30d] = await Promise.all([
          calcUptime(since24h),
          calcUptime(since7d),
          calcUptime(since30d),
        ])
      }
    } catch {
      dbError = true
    }
  } else {
    dbError = true
  }

  if (!monitor) {
    return (
      <div>
        <Link
          href="/admin/uptime"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: '#ff6c01', textDecoration: 'none', marginBottom: 20 }}
        >
          ← Uptime Monitor
        </Link>
        <div style={{ marginTop: 40, textAlign: 'center', color: '#737373', fontSize: 15 }}>
          {dbError ? 'ไม่สามารถโหลดข้อมูลได้' : 'Monitor not found'}
        </div>
      </div>
    )
  }

  const latestCheck = recentChecks[0] ?? null

  // Determine overall status for badge
  let statusBadge: { label: string; bg: string; color: string }
  if (monitor.isActive === 0) {
    statusBadge = { label: 'Paused', bg: '#f3f4f6', color: '#9ca3af' }
  } else if (!latestCheck) {
    statusBadge = { label: 'No Data', bg: '#f3f4f6', color: '#9ca3af' }
  } else if (latestCheck.status === 'up') {
    statusBadge = { label: 'Online', bg: '#d1fae5', color: '#065f46' }
  } else {
    statusBadge = { label: 'Offline', bg: '#fee2e2', color: '#991b1b' }
  }

  function uptimeColor(pct: number | null): string {
    if (pct === null) return '#9ca3af'
    if (pct >= 99) return '#10b981'
    if (pct >= 95) return '#f59e0b'
    return '#ef4444'
  }

  const intervalLabel: Record<number, string> = {
    60: '1 min', 120: '2 min', 300: '5 min',
    600: '10 min', 900: '15 min', 1800: '30 min', 3600: '1 hour',
  }

  // void unused variable — maintenanceWindows available if needed later
  void maintenanceWindows

  return (
    <div>
      {/* ── Back link ── */}
      <Link
        href="/admin/uptime"
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: '#ff6c01', textDecoration: 'none', marginBottom: 20 }}
      >
        ← Uptime Monitor
      </Link>

      {/* ── A. Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 6 }}>
            <h1
              style={{
                fontFamily: 'var(--font-prompt)',
                fontWeight: 700,
                fontSize: 26,
                color: '#0d2749',
                margin: 0,
              }}
            >
              {monitor.label}
            </h1>
            <span
              style={{
                padding: '3px 12px',
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
          <a
            href={monitor.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontFamily: 'monospace', fontSize: 13, color: '#737373', textDecoration: 'none' }}
          >
            {monitor.url}
          </a>
        </div>
      </div>

      {/* ── B. Stats cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
        {/* Current status */}
        <div style={{ background: '#fff', borderRadius: 10, padding: '14px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #e5e9f0' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#737373', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
            Current Status
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: statusBadge.color, fontFamily: 'var(--font-prompt)' }}>
            {statusBadge.label}
          </div>
          {latestCheck?.responseTimeMs != null && (
            <div style={{ fontSize: 12, color: '#737373', marginTop: 4 }}>
              {latestCheck.responseTimeMs} ms
            </div>
          )}
        </div>

        {/* Uptime 24h */}
        <div style={{ background: '#fff', borderRadius: 10, padding: '14px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #e5e9f0' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#737373', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
            Uptime 24h
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: uptimeColor(uptime24h), fontFamily: 'var(--font-prompt)' }}>
            {uptime24h != null ? `${uptime24h}%` : '—'}
          </div>
        </div>

        {/* Uptime 7d */}
        <div style={{ background: '#fff', borderRadius: 10, padding: '14px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #e5e9f0' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#737373', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
            Uptime 7d
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: uptimeColor(uptime7d), fontFamily: 'var(--font-prompt)' }}>
            {uptime7d != null ? `${uptime7d}%` : '—'}
          </div>
        </div>

        {/* Uptime 30d */}
        <div style={{ background: '#fff', borderRadius: 10, padding: '14px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #e5e9f0' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#737373', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
            Uptime 30d
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: uptimeColor(uptime30d), fontFamily: 'var(--font-prompt)' }}>
            {uptime30d != null ? `${uptime30d}%` : '—'}
          </div>
        </div>
      </div>

      {/* ── C. Monitor details card ── */}
      <div
        style={{
          background: '#fff',
          borderRadius: 12,
          padding: '24px',
          marginBottom: 20,
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          border: '1px solid #e5e9f0',
        }}
      >
        <div style={{ fontFamily: 'var(--font-prompt)', fontWeight: 600, fontSize: 16, color: '#0d2749', marginBottom: 20 }}>
          Monitor Details
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px 32px' }}>
          <DetailField
            label="Check Interval"
            value={intervalLabel[monitor.checkInterval] ?? `${monitor.checkInterval}s`}
          />
          <DetailField label="Expected Status" value={String(monitor.expectedStatus)} />
          <DetailField label="Expected Keyword" value={monitor.expectedKeyword} />
          <DetailField label="Customer" value={monitor.customerSlug} />
          <DetailField label="Alert Emails" value={monitor.alertEmails} />
          <DetailField label="Telegram Chat ID" value={monitor.telegramChatId} mono />
        </div>
      </div>

      {/* ── D-pre. Response Time Chart ── */}
      <div
        style={{
          background: '#fff',
          borderRadius: 12,
          padding: '24px',
          marginBottom: 20,
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          border: '1px solid #e5e9f0',
        }}
      >
        <div style={{ fontFamily: 'var(--font-prompt)', fontWeight: 600, fontSize: 16, color: '#0d2749', marginBottom: 16 }}>
          Response Time
        </div>
        <ResponseTimeChart checks={recentChecks} />
      </div>

      {/* ── D. Recent Checks ── */}
      <div
        style={{
          background: '#fff',
          borderRadius: 12,
          overflow: 'hidden',
          marginBottom: 20,
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          border: '1px solid #e5e9f0',
        }}
      >
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f4f8' }}>
          <span style={{ fontFamily: 'var(--font-prompt)', fontWeight: 600, fontSize: 16, color: '#0d2749' }}>
            Recent Checks
          </span>
          <span style={{ fontSize: 12, color: '#9ca3af', marginLeft: 8 }}>
            (last {recentChecks.length})
          </span>
        </div>
        {recentChecks.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: '#737373', fontSize: 14 }}>
            ยังไม่มีข้อมูล Check
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="admin-table-desktop" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e5e9f0' }}>
                    <th style={{ padding: '10px 16px', textAlign: 'left', color: '#0d2749', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}></th>
                    <th style={{ padding: '10px 16px', textAlign: 'left', color: '#0d2749', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status Code</th>
                    <th style={{ padding: '10px 16px', textAlign: 'left', color: '#0d2749', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Response Time</th>
                    <th style={{ padding: '10px 16px', textAlign: 'left', color: '#0d2749', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Region</th>
                    <th style={{ padding: '10px 16px', textAlign: 'left', color: '#0d2749', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentChecks.map((c, i) => (
                    <tr key={c.id} style={{ borderBottom: i < recentChecks.length - 1 ? '1px solid #f0f4f8' : 'none' }}>
                      <td style={{ padding: '10px 16px' }}>
                        <span style={{ color: STATUS_DOT[c.status] ?? '#9ca3af', fontSize: 16 }}>●</span>
                      </td>
                      <td style={{ padding: '10px 16px', color: '#374151', fontFamily: 'monospace' }}>
                        {c.statusCode ?? '—'}
                      </td>
                      <td style={{ padding: '10px 16px', color: '#374151' }}>
                        {c.responseTimeMs != null ? `${c.responseTimeMs} ms` : '—'}
                      </td>
                      <td style={{ padding: '10px 16px', color: '#737373', fontFamily: 'monospace' }}>
                        {c.region ?? '—'}
                      </td>
                      <td style={{ padding: '10px 16px', color: '#737373' }}>
                        {relativeTime(c.checkedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile card stack */}
            <div className="admin-card-mobile" style={{ padding: '10px 14px' }}>
              {recentChecks.map((c) => (
                <div
                  key={c.id}
                  style={{
                    background: '#f8fafc',
                    borderRadius: 10,
                    padding: '10px 14px',
                    marginBottom: 8,
                    border: '1px solid #e5e9f0',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ color: STATUS_DOT[c.status] ?? '#9ca3af', fontSize: 14 }}>●</span>
                    <span style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>
                      {relativeTime(c.checkedAt)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 14px', fontSize: 12, color: '#737373' }}>
                    {c.responseTimeMs != null && <span>{c.responseTimeMs} ms</span>}
                    {c.statusCode != null && <span style={{ fontFamily: 'monospace' }}>HTTP {c.statusCode}</span>}
                    {c.region && <span style={{ fontFamily: 'monospace' }}>{c.region}</span>}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── E. Recent Incidents ── */}
      <div
        style={{
          background: '#fff',
          borderRadius: 12,
          overflow: 'hidden',
          marginBottom: 24,
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          border: '1px solid #e5e9f0',
        }}
      >
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f4f8' }}>
          <span style={{ fontFamily: 'var(--font-prompt)', fontWeight: 600, fontSize: 16, color: '#0d2749' }}>
            Recent Incidents
          </span>
        </div>
        {recentIncidents.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: '#737373', fontSize: 14 }}>
            ไม่มี Incident — ทุกอย่างปกติดี
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="admin-table-desktop" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e5e9f0' }}>
                    <th style={{ padding: '10px 16px', textAlign: 'left', color: '#0d2749', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Severity</th>
                    <th style={{ padding: '10px 16px', textAlign: 'left', color: '#0d2749', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Started</th>
                    <th style={{ padding: '10px 16px', textAlign: 'left', color: '#0d2749', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Resolved</th>
                    <th style={{ padding: '10px 16px', textAlign: 'left', color: '#0d2749', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Duration</th>
                    <th style={{ padding: '10px 16px', textAlign: 'left', color: '#0d2749', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cause</th>
                  </tr>
                </thead>
                <tbody>
                  {recentIncidents.map((inc, i) => {
                    const badge = SEVERITY_BADGE[inc.severity] ?? SEVERITY_BADGE.major
                    return (
                      <tr key={inc.id} style={{ borderBottom: i < recentIncidents.length - 1 ? '1px solid #f0f4f8' : 'none' }}>
                        <td style={{ padding: '10px 16px' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '2px 10px',
                              borderRadius: 20,
                              fontSize: 11,
                              fontWeight: 600,
                              background: badge.bg,
                              color: badge.color,
                              textTransform: 'capitalize',
                            }}
                          >
                            {inc.severity}
                          </span>
                        </td>
                        <td style={{ padding: '10px 16px', color: '#374151' }}>
                          {relativeTime(inc.startedAt)}
                        </td>
                        <td style={{ padding: '10px 16px', color: inc.resolvedAt ? '#374151' : '#ef4444', fontWeight: inc.resolvedAt ? 400 : 600 }}>
                          {inc.resolvedAt ? relativeTime(inc.resolvedAt) : 'Ongoing'}
                        </td>
                        <td style={{ padding: '10px 16px', color: '#737373', fontFamily: 'monospace' }}>
                          {inc.durationSeconds != null ? formatDuration(inc.durationSeconds) : '—'}
                        </td>
                        <td style={{ padding: '10px 16px', color: '#737373' }}>
                          {inc.cause ?? '—'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile card stack */}
            <div className="admin-card-mobile" style={{ padding: '10px 14px' }}>
              {recentIncidents.map((inc) => {
                const badge = SEVERITY_BADGE[inc.severity] ?? SEVERITY_BADGE.major
                return (
                  <div
                    key={inc.id}
                    style={{
                      background: '#f8fafc',
                      borderRadius: 10,
                      padding: '12px 14px',
                      marginBottom: 8,
                      border: '1px solid #e5e9f0',
                    }}
                  >
                    {/* Row 1: Severity badge + Started */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '2px 10px',
                          borderRadius: 20,
                          fontSize: 11,
                          fontWeight: 600,
                          background: badge.bg,
                          color: badge.color,
                          textTransform: 'capitalize',
                        }}
                      >
                        {inc.severity}
                      </span>
                      <span style={{ fontSize: 13, color: '#374151' }}>
                        {relativeTime(inc.startedAt)}
                      </span>
                    </div>
                    {/* Row 2: Resolved + Duration + Cause */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 14px', fontSize: 12, color: '#737373' }}>
                      <span style={{ color: inc.resolvedAt ? '#737373' : '#ef4444', fontWeight: inc.resolvedAt ? 400 : 600 }}>
                        {inc.resolvedAt ? `Resolved ${relativeTime(inc.resolvedAt)}` : 'Ongoing'}
                      </span>
                      {inc.durationSeconds != null && (
                        <span style={{ fontFamily: 'monospace' }}>{formatDuration(inc.durationSeconds)}</span>
                      )}
                      {inc.cause && <span>{inc.cause}</span>}
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>

      <style>{`
        @media (min-width: 769px) {
          .admin-card-mobile { display: none !important; }
        }
        @media (max-width: 768px) {
          .admin-table-desktop { display: none !important; }
          .admin-card-mobile { display: block !important; }
        }
      `}</style>

      {/* ── F. Action buttons ── */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link
          href={`/admin/uptime/${monitorId}/edit`}
          style={{
            background: '#ff6c01',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '10px 24px',
            fontWeight: 600,
            fontSize: 14,
            textDecoration: 'none',
            display: 'inline-block',
          }}
        >
          Edit
        </Link>

        <PauseResumeButton monitorId={monitorId} currentlyActive={monitor.isActive === 1} />

        <DeleteMonitorButton monitorId={monitorId} label={monitor.label} />
      </div>
    </div>
  )
}
