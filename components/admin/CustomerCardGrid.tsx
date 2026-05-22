'use client'

import { useState, useEffect, useCallback } from 'react'
import ResponseTimeChart from '@/components/admin/ResponseTimeChart'

type MonitorSummary = {
  id: number
  label: string
  url: string
  isActive: number
  lastStatus: 'up' | 'down' | null
  lastResponseTimeMs: number | null
  lastCheckedAt: string | null
  uptime24h: number | null
  uptime7d: number | null
  uptime30d: number | null
  streakSeconds: number | null
  recentChecks: { responseTimeMs: number | null; status: string; checkedAt: string }[]
}

type CustomerCardData = {
  name: string
  slug: string
  subdomain: string | null
  status: string | null
  startDate: string | null
  monitors: MonitorSummary[]
}

type Props = {
  cards: CustomerCardData[]
}

const STATUS_LABELS: Record<string, string> = {
  setup:       'Setup',
  active:      'Active',
  suspended:   'Suspended',
  terminated:  'Terminated',
}

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  active:     { bg: '#d1fae5', color: '#065f46' },
  setup:      { bg: '#dbeafe', color: '#1e40af' },
  suspended:  { bg: '#fef3c7', color: '#92400e' },
  terminated: { bg: '#fee2e2', color: '#991b1b' },
}

function uptimeColor(pct: number | null): string {
  if (pct === null) return '#9ca3af'
  if (pct >= 99) return '#10b981'
  if (pct >= 95) return '#f59e0b'
  return '#ef4444'
}

function formatStreak(seconds: number | null): string {
  if (seconds === null || seconds <= 0) return 'Offline'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h < 24) return `${h}h ${m}m`
  const d = Math.floor(h / 24)
  const rh = h % 24
  return `${d}d ${rh}h`
}

function statusDotColor(monitor: MonitorSummary): string {
  if (monitor.isActive === 0) return '#9ca3af'
  if (monitor.lastStatus === 'up') return '#10b981'
  if (monitor.lastStatus === 'down') return '#ef4444'
  return '#9ca3af'
}

function monitorStatusBadge(monitor: MonitorSummary): { label: string; bg: string; color: string } {
  if (monitor.isActive === 0) {
    return { label: 'Paused', bg: '#f3f4f6', color: '#9ca3af' }
  }
  if (!monitor.lastStatus) {
    return { label: 'No Data', bg: '#f3f4f6', color: '#9ca3af' }
  }
  if (monitor.lastStatus === 'up') {
    return { label: 'Online', bg: '#d1fae5', color: '#065f46' }
  }
  return { label: 'Offline', bg: '#fee2e2', color: '#991b1b' }
}

function MonitorDetailModal({
  monitor,
  onClose,
}: {
  monitor: MonitorSummary
  onClose: () => void
}) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  const badge = monitorStatusBadge(monitor)
  const isOnline = monitor.isActive === 1 && monitor.lastStatus === 'up'

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 14,
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
          width: '100%',
          maxWidth: 440,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '20px 24px', position: 'relative' }}>
          <div
            style={{
              fontFamily: 'var(--font-prompt)',
              fontWeight: 600,
              fontSize: 18,
              color: '#0d2749',
              marginBottom: 8,
              paddingRight: 32,
            }}
          >
            {monitor.label}
          </div>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 18,
              right: 20,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 18,
              color: '#9ca3af',
              lineHeight: 1,
              padding: '2px 6px',
              borderRadius: 4,
            }}
            aria-label="Close"
          >
            ✕
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span
              style={{
                display: 'inline-block',
                padding: '2px 10px',
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
                background: badge.bg,
                color: badge.color,
              }}
            >
              {badge.label}
            </span>
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: 12,
                color: '#737373',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: 260,
              }}
            >
              {monitor.url}
            </span>
          </div>
        </div>

        {/* Uptime section */}
        <div style={{ padding: '0 24px 20px', borderBottom: '1px solid #f0f4f8' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {[
              { label: '24 HOURS', value: monitor.uptime24h },
              { label: '7 DAYS',   value: monitor.uptime7d },
              { label: '30 DAYS',  value: monitor.uptime30d },
            ].map(({ label, value }) => (
              <div
                key={label}
                style={{
                  background: '#f8f9fc',
                  borderRadius: 8,
                  padding: 12,
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: '#9ca3af',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    marginBottom: 6,
                  }}
                >
                  {label}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-prompt)',
                    fontWeight: 700,
                    fontSize: 20,
                    color: uptimeColor(value),
                  }}
                >
                  {value != null ? `${value}%` : '—'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Streak line */}
        <div
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid #f0f4f8',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: isOnline ? '#10b981' : '#9ca3af',
              display: 'inline-block',
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>
            {isOnline
              ? `Online for ${formatStreak(monitor.streakSeconds)}`
              : monitor.isActive === 0
              ? 'Paused'
              : monitor.lastStatus === 'down'
              ? 'Offline'
              : 'No data'}
          </span>
        </div>

        {/* Chart section */}
        <div style={{ padding: '16px 24px 24px' }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: '#9ca3af',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: 8,
            }}
          >
            Response Time
          </div>
          <ResponseTimeChart checks={monitor.recentChecks} />
        </div>
      </div>
    </div>
  )
}

function CustomerCard({
  card,
  onSelectMonitor,
}: {
  card: CustomerCardData
  onSelectMonitor: (monitor: MonitorSummary) => void
}) {
  const statusStyle = STATUS_COLORS[card.status ?? 'setup'] ?? STATUS_COLORS.setup

  return (
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
      <div style={{ padding: '16px 20px 12px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
            marginBottom: 4,
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-prompt)',
              fontWeight: 600,
              fontSize: 15,
              color: '#0d2749',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {card.name}
          </span>
          <span
            style={{
              display: 'inline-block',
              padding: '2px 10px',
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 600,
              background: statusStyle.bg,
              color: statusStyle.color,
              flexShrink: 0,
            }}
          >
            {STATUS_LABELS[card.status ?? 'setup'] ?? card.status}
          </span>
        </div>
        {card.subdomain && (
          <div
            style={{
              fontFamily: 'monospace',
              fontSize: 12,
              color: '#737373',
            }}
          >
            {card.subdomain}
          </div>
        )}
      </div>

      {/* Divider */}
      <div style={{ borderTop: '1px solid #f0f4f8' }} />

      {/* Monitor rows */}
      <div>
        {card.monitors.length === 0 ? (
          <div
            style={{
              padding: '20px',
              textAlign: 'center',
              fontSize: 13,
              color: '#9ca3af',
            }}
          >
            No monitors linked
          </div>
        ) : (
          card.monitors.map((monitor) => (
            <button
              key={monitor.id}
              onClick={() => onSelectMonitor(monitor)}
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                padding: '10px 20px',
                background: 'none',
                border: 'none',
                borderBottom: '1px solid #f0f4f8',
                cursor: 'pointer',
                textAlign: 'left',
                gap: 10,
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.background = '#f8f9fc'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.background = 'none'
              }}
            >
              {/* Status dot */}
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: statusDotColor(monitor),
                  display: 'inline-block',
                  flexShrink: 0,
                }}
              />
              {/* Label */}
              <span
                style={{
                  flex: 1,
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#0d2749',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {monitor.label}
              </span>
              {/* Chevron */}
              <span style={{ fontSize: 16, color: '#9ca3af', flexShrink: 0 }}>›</span>
            </button>
          ))
        )}
      </div>

      {/* Footer */}
      {card.startDate && (
        <div
          style={{
            padding: '8px 20px',
            fontSize: 11,
            color: '#9ca3af',
            borderTop: card.monitors.length === 0 ? '1px solid #f0f4f8' : undefined,
          }}
        >
          Since {card.startDate}
        </div>
      )}
    </div>
  )
}

export default function CustomerCardGrid({ cards }: Props) {
  const [selectedMonitor, setSelectedMonitor] = useState<MonitorSummary | null>(null)

  const handleClose = useCallback(() => setSelectedMonitor(null), [])

  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 16,
        }}
      >
        {cards.map((card) => (
          <CustomerCard
            key={card.slug}
            card={card}
            onSelectMonitor={setSelectedMonitor}
          />
        ))}
      </div>

      {selectedMonitor !== null && (
        <MonitorDetailModal monitor={selectedMonitor} onClose={handleClose} />
      )}
    </>
  )
}
