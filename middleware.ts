import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  
  // autocar.vibagen.com → rewrite to /autocar/*
  if (hostname.startsWith('autocar.')) {
    const url = request.nextUrl.clone()
    // Don't rewrite if already under /autocar
    if (!url.pathname.startsWith('/autocar')) {
      url.pathname = `/autocar${url.pathname === '/' ? '' : url.pathname}`
      return NextResponse.rewrite(url)
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all paths except static files and API routes
    '/((?!api|_next/static|_next/image|favicon\.png|images|icon\.png).*)',
  ],
}
