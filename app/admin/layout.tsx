import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminLoginForm from '@/components/admin/AdminLoginForm'
import { verifyAdminToken, COOKIE_NAME } from '@/lib/admin-auth'

export const metadata: Metadata = {
  title: 'Admin Panel',
  robots: { index: false, follow: false },
}

async function getCfEnv(): Promise<Env | undefined> {
  try {
    const { getRequestContext } = await import('@cloudflare/next-on-pages')
    return getRequestContext().env as unknown as Env
  } catch {
    return undefined
  }
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // ── Auth check ──
  const env = await getCfEnv()
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value

  let isAuthed = false
  if (token && env?.ADMIN_PASSWORD) {
    isAuthed = await verifyAdminToken(token, env.ADMIN_PASSWORD)
  }

  if (!isAuthed) {
    return <AdminLoginForm />
  }

  // ── Authenticated layout ──
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fc' }}>
      <AdminSidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <header
          style={{
            background: '#fff',
            borderBottom: '1px solid #e5e9f0',
            padding: '0 24px',
            height: 56,
            display: 'flex',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 40,
          }}
        >
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
        <main className="admin-main" style={{ flex: 1, padding: '32px 24px', background: '#f8f9fc' }}>
          {children}
        </main>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .admin-topbar-spacer { display: block !important; }
          .admin-main { padding: 16px !important; }
        }
        @media (min-width: 769px) {
          .admin-topbar-spacer { display: none !important; }
        }
      `}</style>
    </div>
  )
}
