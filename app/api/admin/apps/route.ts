import { z } from 'zod'
import { eq, desc } from 'drizzle-orm'
import { getDB } from '@/lib/db'
import { customerApps } from '@/lib/db/schema'

export const runtime = 'edge'

async function getCfEnv(): Promise<Env | undefined> {
  try {
    const { getRequestContext } = await import('@cloudflare/next-on-pages')
    return getRequestContext().env as unknown as Env
  } catch {
    return undefined
  }
}

// ─── Validation Schema ────────────────────────────────────
const appSchema = z.object({
  customerSlug: z.string().min(1),
  appType:      z.enum(['pos', 'crm', 'hr', 'inventory', 'liff', 'website', 'custom']),
  appName:      z.string().min(1),
  version:      z.string().optional(),
  deployUrl:    z.string().optional(),
  techStack:    z.string().optional(),
  status:       z.enum(['development', 'staging', 'production', 'retired']).optional(),
  launchDate:   z.string().optional(),
  notes:        z.string().optional(),
})

// ─── GET /api/admin/apps ──────────────────────────────────
export async function GET(req: Request) {
  const env = await getCfEnv()
  if (!env?.DB) {
    return Response.json({ error: 'DB unavailable' }, { status: 503 })
  }

  const { searchParams } = new URL(req.url)
  const customerSlug = searchParams.get('customerSlug')

  try {
    const db = getDB(env.DB)
    const query = db
      .select()
      .from(customerApps)
      .orderBy(desc(customerApps.createdAt))

    const rows = customerSlug
      ? await query.where(eq(customerApps.customerSlug, customerSlug))
      : await query

    return Response.json(rows)
  } catch (err) {
    console.error('[Admin/Apps] GET failed:', err)
    return Response.json({ error: 'DB error' }, { status: 500 })
  }
}

// ─── POST /api/admin/apps ─────────────────────────────────
export async function POST(req: Request) {
  const env = await getCfEnv()
  if (!env?.DB) {
    return Response.json({ error: 'DB unavailable' }, { status: 503 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const result = appSchema.safeParse(body)
  if (!result.success) {
    return Response.json(
      { error: 'Validation failed', details: result.error.flatten().fieldErrors },
      { status: 422 },
    )
  }

  const data = result.data

  try {
    const db = getDB(env.DB)
    const [created] = await db
      .insert(customerApps)
      .values({
        customerSlug: data.customerSlug,
        appType:      data.appType,
        appName:      data.appName,
        version:      data.version      ?? null,
        deployUrl:    data.deployUrl    ?? null,
        techStack:    data.techStack    ?? null,
        status:       data.status       ?? 'development',
        launchDate:   data.launchDate   ?? null,
        notes:        data.notes        ?? null,
      })
      .returning()

    return Response.json(created, { status: 201 })
  } catch (err) {
    console.error('[Admin/Apps] POST failed:', err)
    return Response.json({ error: 'DB error' }, { status: 500 })
  }
}
