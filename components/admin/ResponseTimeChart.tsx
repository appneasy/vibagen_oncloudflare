// Server component — inline SVG only, no client-side JS

type CheckPoint = {
  responseTimeMs: number | null
  status: string
  checkedAt: string
}

type Props = {
  checks: CheckPoint[]
}

const W = 600
const H = 120
const PAD_LEFT   = 48
const PAD_RIGHT  = 12
const PAD_TOP    = 12
const PAD_BOTTOM = 28

export default function ResponseTimeChart({ checks }: Props) {
  // Oldest first (DB returns DESC)
  const ordered = [...checks].reverse()

  // Filter points that have a valid response time
  const validPoints = ordered
    .map((c, i) => ({ ...c, index: i }))
    .filter((c) => c.responseTimeMs != null)

  const totalCount = ordered.length

  if (totalCount === 0 || validPoints.length === 0) {
    return (
      <div
        style={{
          height: H,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#9ca3af',
          fontSize: 13,
        }}
      >
        No data
      </div>
    )
  }

  const chartW = W - PAD_LEFT - PAD_RIGHT
  const chartH = H - PAD_TOP - PAD_BOTTOM

  const minMs = Math.min(...validPoints.map((p) => p.responseTimeMs!))
  const maxMs = Math.max(...validPoints.map((p) => p.responseTimeMs!))
  const rangeMs = maxMs - minMs || 1

  const avgMs = Math.round(
    validPoints.reduce((sum, p) => sum + p.responseTimeMs!, 0) / validPoints.length,
  )

  // Map index → x, responseTimeMs → y
  const xOf = (idx: number) =>
    PAD_LEFT + (totalCount <= 1 ? chartW / 2 : (idx / (totalCount - 1)) * chartW)

  const yOf = (ms: number) =>
    PAD_TOP + chartH - ((ms - minMs) / rangeMs) * chartH

  const avgY = yOf(avgMs)

  // Build SVG path points for valid points only
  const pts = validPoints.map((p) => ({
    x: xOf(p.index),
    y: yOf(p.responseTimeMs!),
    status: p.status,
    ms: p.responseTimeMs!,
  }))

  // Line path
  const linePath = pts
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(' ')

  // Closed fill path
  const fillPath =
    linePath +
    ` L${pts[pts.length - 1].x.toFixed(1)},${(PAD_TOP + chartH).toFixed(1)}` +
    ` L${pts[0].x.toFixed(1)},${(PAD_TOP + chartH).toFixed(1)} Z`

  // X-axis time labels — show up to 4 labels evenly spread from the ordered array
  const labelIndices =
    totalCount <= 4
      ? ordered.map((_, i) => i)
      : [0, Math.floor(totalCount / 3), Math.floor((2 * totalCount) / 3), totalCount - 1]

  function shortTime(dateStr: string): string {
    // dateStr is "YYYY-MM-DD HH:MM:SS" (DB format, UTC)
    const d = new Date(dateStr + 'Z')
    const h = d.getUTCHours().toString().padStart(2, '0')
    const m = d.getUTCMinutes().toString().padStart(2, '0')
    return `${h}:${m}`
  }

  // Down dots (checks that have status=down, whether or not they have responseTimeMs)
  const downChecks = ordered
    .map((c, i) => ({ ...c, index: i }))
    .filter((c) => c.status === 'down')

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height={H}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', overflow: 'visible' }}
      aria-label="Response time chart"
    >
      {/* Y-axis labels */}
      <text
        x={PAD_LEFT - 4}
        y={PAD_TOP + 4}
        textAnchor="end"
        fontSize={9}
        fill="#9ca3af"
        fontFamily="monospace"
      >
        {maxMs}ms
      </text>
      <text
        x={PAD_LEFT - 4}
        y={PAD_TOP + chartH}
        textAnchor="end"
        fontSize={9}
        fill="#9ca3af"
        fontFamily="monospace"
      >
        {minMs}ms
      </text>

      {/* Avg dashed line */}
      <line
        x1={PAD_LEFT}
        y1={avgY.toFixed(1)}
        x2={W - PAD_RIGHT}
        y2={avgY.toFixed(1)}
        stroke="#ff6c01"
        strokeWidth={1}
        strokeDasharray="4 3"
        opacity={0.5}
      />
      <text
        x={W - PAD_RIGHT - 2}
        y={(avgY - 3).toFixed(1)}
        textAnchor="end"
        fontSize={8}
        fill="#ff6c01"
        fontFamily="monospace"
        opacity={0.8}
      >
        avg {avgMs}ms
      </text>

      {/* Fill area */}
      {pts.length > 1 && (
        <path d={fillPath} fill="rgba(255,108,1,0.10)" stroke="none" />
      )}

      {/* Line */}
      {pts.length > 1 && (
        <path
          d={linePath}
          fill="none"
          stroke="#ff6c01"
          strokeWidth={1.8}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      )}

      {/* Valid data point dots */}
      {pts.map((p, i) => (
        <circle key={i} cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r={2.5} fill="#ff6c01" />
      ))}

      {/* Down check markers — red dots at the x-axis bottom */}
      {downChecks.map((c, i) => (
        <circle
          key={`down-${i}`}
          cx={xOf(c.index).toFixed(1)}
          cy={(PAD_TOP + chartH + 6).toFixed(1)}
          r={3}
          fill="#ef4444"
        />
      ))}

      {/* X-axis time labels */}
      {labelIndices.map((idx) => {
        const c = ordered[idx]
        if (!c) return null
        const x = xOf(idx)
        const anchor =
          idx === 0 ? 'start' : idx === totalCount - 1 ? 'end' : 'middle'
        return (
          <text
            key={idx}
            x={x.toFixed(1)}
            y={H - 2}
            textAnchor={anchor}
            fontSize={8}
            fill="#9ca3af"
            fontFamily="monospace"
          >
            {shortTime(c.checkedAt)}
          </text>
        )
      })}

      {/* X axis baseline */}
      <line
        x1={PAD_LEFT}
        y1={PAD_TOP + chartH}
        x2={W - PAD_RIGHT}
        y2={PAD_TOP + chartH}
        stroke="#e5e9f0"
        strokeWidth={1}
      />
    </svg>
  )
}
