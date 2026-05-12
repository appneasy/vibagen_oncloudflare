'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const navLinks = [
  { label: 'บริการ', href: '/services' },
  { label: 'ผลงาน', href: '/showcase' },
  { label: 'ความเชี่ยวชาญ', href: '/expertise' },
  { label: 'Knowledge Hub', href: '/knowledge' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={[
        'fixed top-0 left-0 right-0 z-50',
        'transition-all duration-300',
        scrolled
          ? 'bg-[#2a4a6c]/95 backdrop-blur-md border-b border-white/[0.06] shadow-lg'
          : 'bg-[#1a3a5c]/70 backdrop-blur-sm',
      ].join(' ')}
    >
      <nav className="container flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" aria-label="VIBAGEN Home" className="flex-shrink-0">
          <Image
            src="/images/banner-logo.png"
            alt="VIBAGEN — Crafting Ideas into Real Products"
            width={220}
            height={44}
            className="h-10 w-auto rounded"
            priority
          />
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1" role="list">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="hidden md:block">
          <Link
            href="/hire-us"
            className="px-5 py-2 bg-[#ff6c01] text-white text-sm font-semibold rounded-lg hover:bg-[#d54e01] transition-colors"
          >
            ปรึกษาฟรี →
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-white/70 hover:text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'ปิดเมนู' : 'เปิดเมนู'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#1a3a5c]/98 border-b border-white/[0.06] px-4 pb-4">
          <ul className="flex flex-col gap-1 pt-2" role="list">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-3">
            <Link
              href="/hire-us"
              className="block w-full text-center px-5 py-3 bg-[#ff6c01] text-white font-semibold rounded-lg hover:bg-[#d54e01] transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              ปรึกษาฟรี →
            </Link>
          </div>
        </div>
      )}

      {/* Navy gradient fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none translate-y-full"
        style={{ background: 'linear-gradient(180deg, rgba(13,39,73,0.6) 0%, rgba(13,39,73,0.2) 40%, transparent 100%)' }}
        aria-hidden="true"
      />
    </header>
  )
}
