import type { ReactNode } from 'react'

export type BentoVariant = 'navy' | 'orange' | 'light' | 'glass' | 'dark'

interface BentoCardProps {
  variant?: BentoVariant
  /** Grid column span (used by parent BentoGrid) */
  span?: 1 | 2 | 3 | 4
  className?: string
  children: ReactNode
  /** Padding size */
  padding?: 'sm' | 'md' | 'lg'
}

const variantStyles: Record<BentoVariant, string> = {
  navy:   'bg-[#0d2749] border border-white/[0.06]',
  orange: 'bg-[#ff6c01] border border-[#ff6c01]',
  light:  'bg-white/[0.04] border border-white/[0.08]',
  glass:  'bg-white/[0.06] border border-white/[0.08] backdrop-blur-md',
  dark:   'bg-[#011937] border border-white/[0.04]',
}

const paddingStyles = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

const spanClasses: Record<number, string> = {
  1: 'col-span-1',
  2: 'col-span-2',
  3: 'col-span-3',
  4: 'col-span-4',
}

export default function BentoCard({
  variant = 'navy',
  span = 1,
  padding = 'md',
  className = '',
  children,
}: BentoCardProps) {
  return (
    <div
      className={[
        'rounded-2xl',
        'transition-all duration-300',
        'hover:scale-[1.01] hover:shadow-lg',
        variantStyles[variant],
        paddingStyles[padding],
        spanClasses[span] ?? 'col-span-1',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}
