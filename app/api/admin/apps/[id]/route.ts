import { z } from 'zod'
import { eq } from 'drizzle-orm'
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

// ─── Validation Schema (all fields optional for PUT) ─────
const updateSchema = z.object({
  customerSlug: z.string().min(1).optional(),
  appType:      z.enum(['pos', 'crm', 'hr', 'inventory', 'liff', 'website', 'custom']).optional(),
  appName:      z.string().min(1).optional(),
  version:      z.string().optional(),
  deployUrl:    z.string().optional(),
  techStack:    z.string().optional(),
  status:       z.enum(['development', 'staging', 'production', 'retired']).optional(),
  launchDate:   z.string().optional(),
  notes:        z.string().optional(),
})

// ─── GET /api/admin/apps/[id] ─────────────────────────────
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const appId = parseInt(id, 10)

  const env = await getCfEnv()
  if (!env?.DB) {
    return Response.json({ error: 'DB unavailable' }, { status: 503 })
  }

  try {
    const db = getDB(env.DB)
    const row = await db
      .select()
      .from(customerApps)
      .where(eq(customerApps.id, appId))
      .get()

    if (!row) {
      return Response.json({ error: 'App not found' }, { status: 404 })
    }

    return Response.json(row)
  } catch (err) {
    console.error('[Admin/Apps/id] GET failed:', err)
    return Response.json({ error: 'DB error' }, { status: 500 })
  }
}

// ─── PUT /api/admin/apps/[id] ─────────────────────────────
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const appId = parseInt(id, 10)

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

  const result = updateSchema.safeParse(body)
  if (!result.success) {
    return Response.json(
      { error: 'Validation failed', details: result.error.flatten().fieldErrors },
      { status: 422 },
    )
  }

  const data = result.data

  try {
    const db = getDB(env.DB)

    // Build update payload — only include defined fields
    const updatePayload: Record<string, unknown> = {}
    if (data.customerSlug !== undefined) updatePayload.customerSlug = data.customerSlug
    if (data.appType      !== undefined) updatePayload.appType      = data.appType
    if (data.appName      !== undefined) updatePayload.appName      = data.appName
    if (data.version      !== undefined) updatePayload.version      = data.version
    if (data.deployUrl    !== undefined) updatePayload.deployUrl    = data.deployUrl
    if (data.techStack    !== undefined) updatePayload.techStack    = data.techStack
    if (data.status       !== undefined) updatePayload.status       = data.status
    if (data.launchDate   !== undefined) updatePayload.launchDate   = data.launchDate
    if (data.notes        !== undefined) updatePayload.notes        = data.notes

    const [updated] = await db
      .update(customerApps)
      .set(updatePayload)
      .where(eq(customerApps.id, appId))
      .returning()

    if (!updated) {
      return Response.json({ error: 'App not found' }, { status: 404 })
    }

    return Response.json(updated)
  } catch (err) {
    console.error('[Admin/Apps/id] PUT failed:', err)
    return Response.json({ error: 'DB error' }, { status: 500 })
  }
}

// ─── DELETE /api/admin/apps/[id] ──────────────────────────
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const appId = parseInt(id, 10)

  const env = await getCfEnv()
  if (!env?.DB) {
    return Response.json({ error: 'DB unavailable' }, { status: 503 })
  }

  try {
    const db = getDB(env.DB)
    const [deleted] = await db
      .delete(customerApps)
      .where(eq(customerApps.id, appId))
      .returning()

    if (!deleted) {
      return Response.json({ error: 'App not found' }, { status: 404 })
    }

    return Response.json({ success: true })
  } catch (err) {
    console.error('[Admin/Apps/id] DELETE failed:', err)
    return Response.json({ error: 'DB error' }, { status: 500 })
  }
}
