export const runtime = 'edge'

import { NextResponse } from 'next/server'
import { createAdminToken, COOKIE_NAME, COOKIE_MAX_AGE } from '@/lib/admin-auth'

async function getCfEnv(): Promise<Env | undefined> {
  try {
    const { getRequestContext } = await import('@cloudflare/next-on-pages')
    return getRequestContext().env as unknown as Env
  } catch {
    return undefined
  }
}

// POST — Login
export async function POST(request: Request) {
  const env = await getCfEnv()
  if (!env?.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Auth not configured' }, { status: 500 })
  }

  let body: { password?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  if (!body.password || body.password !== env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Wrong password' }, { status: 401 })
  }

  const token = await createAdminToken(env.ADMIN_PASSWORD)

  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: COOKIE_MAX_AGE,
  })

  return res
}

// DELETE — Logout
export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
  return res
}
