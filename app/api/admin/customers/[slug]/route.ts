import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { getDB } from '@/lib/db'
import { managedCustomers } from '@/lib/db/schema'

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
  name:        z.string().min(1).optional(),
  slug:        z.string().min(1).optional(),
  subdomain:   z.string().min(1).optional(),
  vpsIp:       z.string().optional(),
  vpsPlan:     z.string().optional(),
  vpsLocation: z.string().optional(),
  r2Bucket:    z.string().optional(),
  status:      z.enum(['setup', 'active', 'suspended', 'terminated']).optional(),
  startDate:   z.string().optional(),
  lineOaName:  z.string().optional(),
  liffId:      z.string().optional(),
  notes:       z.string().optional(),
})

// ─── GET /api/admin/customers/[slug] ─────────────────────
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params

  const env = await getCfEnv()
  if (!env?.DB) {
    return Response.json({ error: 'DB unavailable' }, { status: 503 })
  }

  try {
    const db = getDB(env.DB)
    const row = await db
      .select()
      .from(managedCustomers)
      .where(eq(managedCustomers.slug, slug))
      .get()

    if (!row) {
      return Response.json({ error: 'Customer not found' }, { status: 404 })
    }

    return Response.json(row)
  } catch (err) {
    console.error('[Admin/Customers/slug] GET failed:', err)
    return Response.json({ error: 'DB error' }, { status: 500 })
  }
}

// ─── PUT /api/admin/customers/[slug] ─────────────────────
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params

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
    if (data.name !== undefined)        updatePayload.name = data.name
    if (data.slug !== undefined)        updatePayload.slug = data.slug
    if (data.subdomain !== undefined)   updatePayload.subdomain = data.subdomain
    if (data.vpsIp !== undefined)       updatePayload.vpsIp = data.vpsIp
    if (data.vpsPlan !== undefined)     updatePayload.vpsPlan = data.vpsPlan
    if (data.vpsLocation !== undefined) updatePayload.vpsLocation = data.vpsLocation
    if (data.r2Bucket !== undefined)    updatePayload.r2Bucket = data.r2Bucket
    if (data.status !== undefined)      updatePayload.status = data.status
    if (data.startDate !== undefined)   updatePayload.startDate = data.startDate
    if (data.lineOaName !== undefined)  updatePayload.lineOaName = data.lineOaName
    if (data.liffId !== undefined)      updatePayload.liffId = data.liffId
    if (data.notes !== undefined)       updatePayload.notes = data.notes

    const [updated] = await db
      .update(managedCustomers)
      .set(updatePayload)
      .where(eq(managedCustomers.slug, slug))
      .returning()

    if (!updated) {
      return Response.json({ error: 'Customer not found' }, { status: 404 })
    }

    return Response.json(updated)
  } catch (err) {
    console.error('[Admin/Customers/slug] PUT failed:', err)
    return Response.json({ error: 'DB error' }, { status: 500 })
  }
}

// ─── DELETE /api/admin/customers/[slug] ──────────────────
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params

  const env = await getCfEnv()
  if (!env?.DB) {
    return Response.json({ error: 'DB unavailable' }, { status: 503 })
  }

  try {
    const db = getDB(env.DB)
    const [deleted] = await db
      .delete(managedCustomers)
      .where(eq(managedCustomers.slug, slug))
      .returning()

    if (!deleted) {
      return Response.json({ error: 'Customer not found' }, { status: 404 })
    }

    return Response.json({ success: true })
  } catch (err) {
    console.error('[Admin/Customers/slug] DELETE failed:', err)
    return Response.json({ error: 'DB error' }, { status: 500 })
  }
}
