import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Strip tracking query params → 301 redirect to clean URL
  const TRACKING_PARAMS = ['fbclid', 'gclid', 'fbadid', 'mc_cid', 'mc_eid'];
  const UTM_PREFIX = 'utm_';
  const url = request.nextUrl.clone();
  let hasTracking = false;

  for (const key of url.searchParams.keys()) {
    if (TRACKING_PARAMS.includes(key) || key.startsWith(UTM_PREFIX)) {
      hasTracking = true;
      break;
    }
  }

  if (hasTracking) {
    const cleanUrl = request.nextUrl.clone();
    for (const key of [...cleanUrl.searchParams.keys()]) {
      if (TRACKING_PARAMS.includes(key) || key.startsWith(UTM_PREFIX)) {
        cleanUrl.searchParams.delete(key);
      }
    }
    return NextResponse.redirect(cleanUrl, 301);
  }

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
