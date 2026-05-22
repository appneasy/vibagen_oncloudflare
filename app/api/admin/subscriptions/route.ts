import { z } from 'zod'
import { eq, asc } from 'drizzle-orm'
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

// ─── Validation Schema ────────────────────────────────────
const subscriptionSchema = z.object({
  customerSlug: z.string().min(1),
  provider:     z.enum(['cloudflare', 'hetzner', 'other']),
  serviceName:  z.string().min(1),
  plan:         z.enum(['monthly', 'yearly', 'one-time']).optional(),
  priceThb:     z.number().int().min(0).optional(),
  startDate:    z.string().optional(),
  nextDueDate:  z.string().optional(),
  autoRenew:    z.number().int().min(0).max(1).optional(),
  status:       z.enum(['active', 'cancelled', 'expired']).optional(),
  notes:        z.string().optional(),
})

// ─── GET /api/admin/subscriptions ────────────────────────
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
      .from(customerSubscriptions)
      .orderBy(asc(customerSubscriptions.nextDueDate))

    const rows = customerSlug
      ? await query.where(eq(customerSubscriptions.customerSlug, customerSlug))
      : await query

    return Response.json(rows)
  } catch (err) {
    console.error('[Admin/Subscriptions] GET failed:', err)
    return Response.json({ error: 'DB error' }, { status: 500 })
  }
}

// ─── POST /api/admin/subscriptions ───────────────────────
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

  const result = subscriptionSchema.safeParse(body)
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
      .insert(customerSubscriptions)
      .values({
        customerSlug: data.customerSlug,
        provider:     data.provider,
        serviceName:  data.serviceName,
        plan:         data.plan ?? 'monthly',
        priceThb:     data.priceThb ?? null,
        startDate:    data.startDate ?? null,
        nextDueDate:  data.nextDueDate ?? null,
        autoRenew:    data.autoRenew ?? 1,
        status:       data.status ?? 'active',
        notes:        data.notes ?? null,
      })
      .returning()

    return Response.json(created, { status: 201 })
  } catch (err) {
    console.error('[Admin/Subscriptions] POST failed:', err)
    return Response.json({ error: 'DB error' }, { status: 500 })
  }
}
