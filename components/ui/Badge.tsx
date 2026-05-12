import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  className?: string
  /** orange dot before text */
  dot?: boolean
}

/** Eyebrow label — uppercase orange text, used above section headings */
export default function Badge({ children, className = '', dot = false }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1.5',
        'font-[--font-heading] text-[0.7rem] font-semibold tracking-widest uppercase',
        'text-[#ff6c01]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {dot && (
        <span
          className="inline-block w-1.5 h-1.5 rounded-full bg-[#ff6c01] shrink-0"
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  )
}
