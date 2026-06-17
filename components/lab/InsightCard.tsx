interface InsightCardProps {
  number: number
  title: string
  description: string
}

export default function InsightCard({ number, title, description }: InsightCardProps) {
  return (
    <div
      className="flex gap-4 rounded-xl p-5 my-4 border"
      style={{
        background: 'rgba(255,255,255,0.03)',
        borderColor: 'rgba(255,255,255,0.06)',
        borderLeft: '3px solid #ff6c01',
      }}
    >
      {/* Number badge */}
      <div
        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
        style={{ background: 'rgba(255,108,1,0.15)', color: '#ff6c01' }}
      >
        {number}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-white mb-1">{title}</p>
        <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
          {description}
        </p>
      </div>
    </div>
  )
}
