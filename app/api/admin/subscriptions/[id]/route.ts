import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { getDB } from '@/lib/db'
import { customerSubscriptions } from '@/lib/db/schema'

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
  provider:     z.enum(['cloudflare', 'hetzner', 'other']).optional(),
  serviceName:  z.string().min(1).optional(),
  plan:         z.enum(['monthly', 'yearly', 'one-time']).optional(),
  priceThb:     z.number().int().min(0).optional(),
  startDate:    z.string().optional(),
  nextDueDate:  z.string().optional(),
  autoRenew:    z.number().int().min(0).max(1).optional(),
  status:       z.enum(['active', 'cancelled', 'expired']).optional(),
  notes:        z.string().optional(),
})

// ─── GET /api/admin/subscriptions/[id] ───────────────────
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const subId = parseInt(id, 10)

  const env = await getCfEnv()
  if (!env?.DB) {
    return Response.json({ error: 'DB unavailable' }, { status: 503 })
  }

  try {
    const db = getDB(env.DB)
    const row = await db
      .select()
      .from(customerSubscriptions)
      .where(eq(customerSubscriptions.id, subId))
      .get()

    if (!row) {
      return Response.json({ error: 'Subscription not found' }, { status: 404 })
    }

    return Response.json(row)
  } catch (err) {
    console.error('[Admin/Subscriptions/id] GET failed:', err)
    return Response.json({ error: 'DB error' }, { status: 500 })
  }
}

// ─── PUT /api/admin/subscriptions/[id] ───────────────────
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const subId = parseInt(id, 10)

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
    if (data.provider !== undefined)     updatePayload.provider = data.provider
    if (data.serviceName !== undefined)  updatePayload.serviceName = data.serviceName
    if (data.plan !== undefined)         updatePayload.plan = data.plan
    if (data.priceThb !== undefined)     updatePayload.priceThb = data.priceThb
    if (data.startDate !== undefined)    updatePayload.startDate = data.startDate
    if (data.nextDueDate !== undefined)  updatePayload.nextDueDate = data.nextDueDate
    if (data.autoRenew !== undefined)    updatePayload.autoRenew = data.autoRenew
    if (data.status !== undefined)       updatePayload.status = data.status
    if (data.notes !== undefined)        updatePayload.notes = data.notes

    const [updated] = await db
      .update(customerSubscriptions)
      .set(updatePayload)
      .where(eq(customerSubscriptions.id, subId))
      .returning()

    if (!updated) {
      return Response.json({ error: 'Subscription not found' }, { status: 404 })
    }

    return Response.json(updated)
  } catch (err) {
    console.error('[Admin/Subscriptions/id] PUT failed:', err)
    return Response.json({ error: 'DB error' }, { status: 500 })
  }
}

// ─── DELETE /api/admin/subscriptions/[id] ────────────────
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const subId = parseInt(id, 10)

  const env = await getCfEnv()
  if (!env?.DB) {
    return Response.json({ error: 'DB unavailable' }, { status: 503 })
  }

  try {
    const db = getDB(env.DB)
    const [deleted] = await db
      .delete(customerSubscriptions)
      .where(eq(customerSubscriptions.id, subId))
      .returning()

    if (!deleted) {
      return Response.json({ error: 'Subscription not found' }, { status: 404 })
    }

    return Response.json({ success: true })
  } catch (err) {
    console.error('[Admin/Subscriptions/id] DELETE failed:', err)
    return Response.json({ error: 'DB error' }, { status: 500 })
  }
}
