interface StatCardProps {
  value: string
  label: string
  sublabel?: string
  highlight?: boolean
  className?: string
}

export default function StatCard({
  value,
  label,
  sublabel,
  highlight = false,
  className = '',
}: StatCardProps) {
  return (
    <div
      className={[
        'rounded-2xl p-6 flex flex-col gap-1',
        highlight
          ? 'bg-[#ff6c01] text-white'
          : 'bg-white/[0.06] border border-white/[0.08] text-white',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span
        className={[
          'font-[--font-heading] font-bold leading-none',
          'text-4xl',
          highlight ? 'text-white' : 'text-[#ff6c01]',
        ].join(' ')}
      >
        {value}
      </span>
      <span className="font-[--font-heading] font-semibold text-base mt-1">{label}</span>
      {sublabel && (
        <span className={['text-sm', highlight ? 'text-white/80' : 'text-white/50'].join(' ')}>
          {sublabel}
        </span>
      )}
    </div>
  )
}
