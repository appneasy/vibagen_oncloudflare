import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react'
import Link from 'next/link'

type ButtonVariant = 'primary' | 'outline' | 'navy' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonBaseProps {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
  className?: string
  fullWidth?: boolean
}

interface ButtonAsButton extends ButtonBaseProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> {
  href?: undefined
}

interface ButtonAsLink extends ButtonBaseProps {
  href: string
  external?: boolean
}

type ButtonProps = ButtonAsButton | ButtonAsLink

const variantStyles: Record<ButtonVariant, string> = {
  primary: [
    'bg-[#ff6c01] text-white',
    'hover:bg-[#d54e01]',
    'border border-[#ff6c01]',
  ].join(' '),
  outline: [
    'bg-transparent text-[#ff6c01]',
    'border border-[#ff6c01]',
    'hover:bg-[#ff6c01] hover:text-white',
  ].join(' '),
  navy: [
    'bg-[#0d2749] text-white',
    'border border-white/10',
    'hover:border-[#ff6c01] hover:text-[#ff6c01]',
  ].join(' '),
  ghost: [
    'bg-transparent text-white/70',
    'hover:text-white hover:bg-white/5',
    'border border-transparent',
  ].join(' '),
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
}

function getBaseClasses(
  variant: ButtonVariant,
  size: ButtonSize,
  fullWidth: boolean,
  className?: string,
) {
  return [
    'inline-flex items-center justify-center gap-2',
    'font-[--font-heading] font-semibold',
    'rounded-lg',
    'transition-all duration-200',
    'cursor-pointer select-none',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6c01] focus-visible:ring-offset-2 focus-visible:ring-offset-[#011937]',
    variantStyles[variant],
    sizeStyles[size],
    fullWidth ? 'w-full' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')
}

export default function Button(props: ButtonProps) {
  const {
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    className,
    children,
  } = props

  const classes = getBaseClasses(variant, size, fullWidth, className)

  if ('href' in props && props.href) {
    const { href, external } = props
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
          {children}
        </a>
      )
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  const { href: _href, external: _ext, fullWidth: _fw, variant: _v, size: _s, ...rest } =
    props as ButtonAsButton & { external?: boolean; href?: undefined }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  )
}
