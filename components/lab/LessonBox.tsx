interface LessonBoxProps {
  title: string
  children: React.ReactNode
}

export default function LessonBox({ title, children }: LessonBoxProps) {
  return (
    <div
      className="rounded-xl p-6 my-6 border"
      style={{
        background: 'rgba(34,197,94,0.08)',
        borderColor: 'rgba(34,197,94,0.20)',
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">💡</span>
        <p className="font-bold text-white text-sm">{title}</p>
      </div>
      <div className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.70)' }}>
        {children}
      </div>
    </div>
  )
}
