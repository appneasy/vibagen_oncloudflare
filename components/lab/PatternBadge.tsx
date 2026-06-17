'use client'

interface PatternBadgeProps {
  pattern: string
  patternName: string
}

export default function PatternBadge({ pattern, patternName }: PatternBadgeProps) {
  const isP1 = pattern === 'P1'

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border"
      style={
        isP1
          ? {
              color: '#f59e0b',
              background: 'rgba(245,158,11,0.10)',
              borderColor: 'rgba(245,158,11,0.25)',
            }
          : {
              color: '#22d3ee',
              background: 'rgba(34,211,238,0.10)',
              borderColor: 'rgba(34,211,238,0.25)',
            }
      }
    >
      {pattern} · {patternName}
    </span>
  )
}
