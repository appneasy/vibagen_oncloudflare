import { z } from 'zod'
import { eq, desc, and, gte, sql } from 'drizzle-orm'
import { getDB } from '@/lib/db'
import { uptimeMonitors, uptimeChecks, uptimeIncidents, uptimeMaintenance } from '@/lib/db/schema'

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
  customerSlug:    z.string().optional(),
  url:             z.string().url().optional(),
  label:           z.string().min(1).optional(),
  checkInterval:   z.number().int().min(60).max(3600).optional(),
  expectedStatus:  z.number().int().min(100).max(599).optional(),
  expectedKeyword: z.string().optional(),
  isActive:        z.number().int().min(0).max(1).optional(),
  alertEmails:     z.string().optional(),
  telegramChatId:  z.string().optional(),
})

// ─── Helper: uptime percentage for a time window ─────────
async function calcUptime(
  db: ReturnType<typeof getDB>,
  monitorId: number,
  sinceIso: string,
): Promise<number | null> {
  const rows = await db
    .select({
      total:   sql<number>`COUNT(*)`,
      upCount: sql<number>`SUM(CASE WHEN ${uptimeChecks.status} = 'up' THEN 1 ELSE 0 END)`,
    })
    .from(uptimeChecks)
    .where(and(eq(uptimeChecks.monitorId, monitorId), gte(uptimeChecks.checkedAt, sinceIso)))
    .get()

  if (!rows || rows.total === 0) return null
  return Math.round((Number(rows.upCount) / Number(rows.total)) * 1000) / 10
}

// ─── GET /api/admin/monitors/[id] ────────────────────────
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const monitorId = parseInt(id, 10)
  if (isNaN(monitorId)) {
    return Response.json({ error: 'Invalid monitor ID' }, { status: 400 })
  }

  const env = await getCfEnv()
  if (!env?.DB) {
    return Response.json({ error: 'DB unavailable' }, { status: 503 })
  }

  try {
    const db = getDB(env.DB)

    const monitor = await db
      .select()
      .from(uptimeMonitors)
      .where(eq(uptimeMonitors.id, monitorId))
      .get()

    if (!monitor) {
      return Response.json({ error: 'Monitor not found' }, { status: 404 })
    }

    const recentChecks = await db
      .select()
      .from(uptimeChecks)
      .where(eq(uptimeChecks.monitorId, monitorId))
      .orderBy(desc(uptimeChecks.checkedAt))
      .limit(50)

    const openIncidents = await db
      .select()
      .from(uptimeIncidents)
      .where(and(eq(uptimeIncidents.monitorId, monitorId), sql`${uptimeIncidents.resolvedAt} IS NULL`))
      .orderBy(desc(uptimeIncidents.startedAt))

    const now = new Date()
    const since24h  = new Date(now.getTime() - 24  * 60 * 60 * 1000).toISOString().replace('T', ' ').slice(0, 19)
    const since7d   = new Date(now.getTime() -  7  * 24 * 60 * 60 * 1000).toISOString().replace('T', ' ').slice(0, 19)
    const since30d  = new Date(now.getTime() - 30  * 24 * 60 * 60 * 1000).toISOString().replace('T', ' ').slice(0, 19)

    const [uptime24h, uptime7d, uptime30d] = await Promise.all([
      calcUptime(db, monitorId, since24h),
      calcUptime(db, monitorId, since7d),
      calcUptime(db, monitorId, since30d),
    ])

    return Response.json({ monitor, recentChecks, openIncidents, uptime24h, uptime7d, uptime30d })
  } catch (err) {
    console.error('[Admin/Monitors/id] GET failed:', err)
    return Response.json({ error: 'DB error' }, { status: 500 })
  }
}

// ─── PUT /api/admin/monitors/[id] ────────────────────────
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const monitorId = parseInt(id, 10)
  if (isNaN(monitorId)) {
    return Response.json({ error: 'Invalid monitor ID' }, { status: 400 })
  }

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

    const updatePayload: Record<string, unknown> = {
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
    }
    if (data.customerSlug    !== undefined) updatePayload.customerSlug    = data.customerSlug
    if (data.url             !== undefined) updatePayload.url             = data.url
    if (data.label           !== undefined) updatePayload.label           = data.label
    if (data.checkInterval   !== undefined) updatePayload.checkInterval   = data.checkInterval
    if (data.expectedStatus  !== undefined) updatePayload.expectedStatus  = data.expectedStatus
    if (data.expectedKeyword !== undefined) updatePayload.expectedKeyword = data.expectedKeyword
    if (data.isActive        !== undefined) updatePayload.isActive        = data.isActive
    if (data.alertEmails     !== undefined) updatePayload.alertEmails     = data.alertEmails
    if (data.telegramChatId  !== undefined) updatePayload.telegramChatId  = data.telegramChatId

    const [updated] = await db
      .update(uptimeMonitors)
      .set(updatePayload)
      .where(eq(uptimeMonitors.id, monitorId))
      .returning()

    if (!updated) {
      return Response.json({ error: 'Monitor not found' }, { status: 404 })
    }

    return Response.json(updated)
  } catch (err) {
    console.error('[Admin/Monitors/id] PUT failed:', err)
    return Response.json({ error: 'DB error' }, { status: 500 })
  }
}

// ─── DELETE /api/admin/monitors/[id] ─────────────────────
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const monitorId = parseInt(id, 10)
  if (isNaN(monitorId)) {
    return Response.json({ error: 'Invalid monitor ID' }, { status: 400 })
  }

  const env = await getCfEnv()
  if (!env?.DB) {
    return Response.json({ error: 'DB unavailable' }, { status: 503 })
  }

  try {
    const db = getDB(env.DB)

    // Cascade deletes
    await db.delete(uptimeMaintenance).where(eq(uptimeMaintenance.monitorId, monitorId))
    await db.delete(uptimeIncidents).where(eq(uptimeIncidents.monitorId, monitorId))
    await db.delete(uptimeChecks).where(eq(uptimeChecks.monitorId, monitorId))

    const [deleted] = await db
      .delete(uptimeMonitors)
      .where(eq(uptimeMonitors.id, monitorId))
      .returning()

    if (!deleted) {
      return Response.json({ error: 'Monitor not found' }, { status: 404 })
    }

    return Response.json({ success: true })
  } catch (err) {
    console.error('[Admin/Monitors/id] DELETE failed:', err)
    return Response.json({ error: 'DB error' }, { status: 500 })
  }
}
