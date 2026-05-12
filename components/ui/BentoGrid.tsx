import type { ReactNode } from 'react'

interface BentoGridProps {
  children: ReactNode
  /** Max columns — default 3 */
  cols?: 2 | 3 | 4
  className?: string
}

const colsClass: Record<number, string> = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
}

export default function BentoGrid({ children, cols = 3, className = '' }: BentoGridProps) {
  return (
    <div
      className={[
        'grid gap-4',
        colsClass[cols] ?? colsClass[3],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}
