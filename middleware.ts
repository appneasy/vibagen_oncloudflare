import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const pathname = request.nextUrl.pathname

  // ── Protect admin API routes ──
  if (pathname.startsWith('/api/admin') && !pathname.startsWith('/api/admin/auth')) {
    const token = request.cookies.get('admin_token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  // ── autocar.vibagen.com → rewrite to /autocar/* (skip API routes) ──
  if (hostname.startsWith('autocar.') && !pathname.startsWith('/api')) {
    const url = request.nextUrl.clone()
    if (!url.pathname.startsWith('/autocar')) {
      url.pathname = `/autocar${url.pathname === '/' ? '' : url.pathname}`
      return NextResponse.rewrite(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.png|images|icon\\.png).*)',
  ],
}
