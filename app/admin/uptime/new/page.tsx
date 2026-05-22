export const runtime = 'edge'

import Link from 'next/link'
import MonitorForm from '@/components/admin/MonitorForm'

export default function NewMonitorPage() {
  return (
    <div>
      {/* ── Back link ── */}
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
        Add Monitor
      </h1>

      <MonitorForm mode="create" />
    </div>
  )
}
