import type { Metadata } from 'next'
import AdminSidebar from '@/components/admin/AdminSidebar'

export const metadata: Metadata = {
  title: 'Admin Panel',
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fc' }}>
      {/* ── Sidebar ── */}
      <AdminSidebar />

      {/* ── Main content area ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top bar */}
        <header
          style={{
            background: '#fff',
            borderBottom: '1px solid #e5e9f0',
            padding: '0 24px',
            height: 56,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {/* Spacer for mobile hamburger */}
          <div style={{ width: 40 }} className="admin-topbar-spacer" />

          <span
            style={{
              fontFamily: 'var(--font-prompt)',
              fontWeight: 700,
              fontSize: 18,
              color: '#0d2749',
              letterSpacing: '-0.01em',
            }}
          >
            VIBAGEN Admin
          </span>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: '32px 24px', background: '#f8f9fc' }}>
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .admin-topbar-spacer { display: block !important; }
        }
        @media (min-width: 769px) {
          .admin-topbar-spacer { display: none !important; }
        }
      `}</style>
    </div>
  )
}
