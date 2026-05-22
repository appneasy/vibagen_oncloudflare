'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const navItems = [
  { label: 'Dashboard',  icon: '📊', href: '/admin/dashboard' },
  { label: 'Backups',    icon: '💾', href: '/admin/backups' },
  { label: 'Customers',  icon: '👥', href: '/admin/customers',  comingSoon: true },
  { label: 'Uptime',     icon: '🔔', href: '/admin/uptime',     comingSoon: true },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  function isActive(href: string): boolean {
    return pathname === href || pathname.startsWith(href + '/')
  }

  const sidebarContent = (
    <nav
      style={{
        width: 240,
        background: '#0d2749',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: '100vh',
      }}
    >
      {/* Logo / Title */}
      <div
        style={{
          padding: '24px 20px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          fontFamily: 'var(--font-prompt)',
          fontWeight: 700,
          fontSize: 18,
          letterSpacing: '-0.01em',
        }}
      >
        VIBAGEN
        <span style={{ display: 'block', fontSize: 11, fontWeight: 400, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>
          Admin Panel
        </span>
      </div>

      {/* Nav Items */}
      <ul style={{ listStyle: 'none', margin: 0, padding: '12px 0', flex: 1 }}>
        {navItems.map((item) => {
          const active = isActive(item.href)
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '11px 20px',
                  fontSize: 14,
                  fontWeight: active ? 600 : 400,
                  color: active ? '#ff6c01' : 'rgba(255,255,255,0.85)',
                  background: active ? 'rgba(255,255,255,0.10)' : 'transparent',
                  borderLeft: active ? '2px solid #ff6c01' : '2px solid transparent',
                  textDecoration: 'none',
                  transition: 'background 0.15s, color 0.15s',
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    ;(e.currentTarget as HTMLAnchorElement).style.background =
                      'rgba(255,255,255,0.05)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    ;(e.currentTarget as HTMLAnchorElement).style.background = 'transparent'
                  }
                }}
              >
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                <span>{item.label}</span>
                {item.comingSoon && (
                  <span
                    style={{
                      marginLeft: 'auto',
                      fontSize: 10,
                      background: 'rgba(255,108,1,0.2)',
                      color: '#ff6c01',
                      padding: '1px 6px',
                      borderRadius: 4,
                      fontWeight: 500,
                    }}
                  >
                    Soon
                  </span>
                )}
              </Link>
            </li>
          )
        })}
      </ul>

      {/* Version */}
      <div
        style={{
          padding: '16px 20px',
          fontSize: 11,
          color: 'rgba(255,255,255,0.3)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        v1.0
      </div>
    </nav>
  )

  return (
    <>
      {/* ── Mobile hamburger button ── */}
      <button
        aria-label="Open menu"
        onClick={() => setMobileOpen(true)}
        style={{
          position: 'fixed',
          top: 14,
          left: 16,
          zIndex: 60,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: 22,
          color: '#0d2749',
          display: 'none',
          lineHeight: 1,
        }}
        className="admin-hamburger"
      >
        ☰
      </button>

      {/* ── Desktop sidebar ── */}
      <aside
        style={{ flexShrink: 0 }}
        className="admin-sidebar-desktop"
      >
        {sidebarContent}
      </aside>

      {/* ── Mobile overlay ── */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setMobileOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 70,
            }}
          />
          {/* Slide-out panel */}
          <aside
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              height: '100vh',
              zIndex: 80,
            }}
          >
            <div style={{ position: 'relative' }}>
              {/* Close button */}
              <button
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
                style={{
                  position: 'absolute',
                  top: 12,
                  right: -40,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 22,
                  color: '#fff',
                  lineHeight: 1,
                }}
              >
                ✕
              </button>
            </div>
            {sidebarContent}
          </aside>
        </>
      )}

      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar-desktop { display: none !important; }
          .admin-hamburger { display: block !important; }
        }
      `}</style>
    </>
  )
}
