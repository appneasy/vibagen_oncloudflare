'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { label: 'นำเสนอ', href: '/autocar', disabled: false },
  { label: 'ฟีเจอร์', href: '/autocar/features', disabled: false },
  { label: 'Q&A', href: '/autocar/faq', disabled: false },
  { label: 'คู่มือ', href: '/autocar/tutorial', disabled: true },
]

export default function AutoCarSubNav() {
  const pathname = usePathname()

  return (
    <div className="fixed top-[64px] left-0 right-0 z-40 bg-[#0d2749]/95 backdrop-blur-md border-b border-amber-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-11">
        <div className="flex items-center gap-1">
          <span className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center text-[#0d2749] font-bold text-xs mr-2">
            AC
          </span>
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive =
                item.href === '/autocar'
                  ? pathname === '/autocar'
                  : pathname.startsWith(item.href)

              if (item.disabled) {
                return (
                  <span
                    key={item.href}
                    className="px-3 py-1.5 text-sm rounded-md text-white/30 cursor-not-allowed"
                  >
                    {item.label}
                  </span>
                )
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    isActive
                      ? 'text-white bg-white/[0.12] font-medium'
                      : 'text-white/70 hover:text-white hover:bg-white/[0.08]'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
        <a
          href="https://demo.vibagen.com"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-1.5 text-sm font-medium text-[#0d2749] bg-amber-500 hover:bg-amber-400 rounded-md transition-colors"
        >
          ทดลอง Demo →
        </a>
      </div>
    </div>
  )
}
