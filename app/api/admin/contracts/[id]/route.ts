import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { getDB } from '@/lib/db'
import { customerContracts } from '@/lib/db/schema'

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
  title:        z.string().min(1).optional(),
  type:         z.enum(['contract', 'quotation', 'invoice', 'requirement', 'other']).optional(),
  r2Key:        z.string().optional(),
  fileSize:     z.number().int().min(0).optional(),
  status:       z.enum(['draft', 'signed', 'expired']).optional(),
  signedDate:   z.string().optional(),
  expiryDate:   z.string().optional(),
  notes:        z.string().optional(),
})

// ─── GET /api/admin/contracts/[id] ───────────────────────
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const contractId = parseInt(id, 10)

  const env = await getCfEnv()
  if (!env?.DB) {
    return Response.json({ error: 'DB unavailable' }, { status: 503 })
  }

  try {
    const db = getDB(env.DB)
    const row = await db
      .select()
      .from(customerContracts)
      .where(eq(customerContracts.id, contractId))
      .get()

    if (!row) {
      return Response.json({ error: 'Contract not found' }, { status: 404 })
    }

    return Response.json(row)
  } catch (err) {
    console.error('[Admin/Contracts/id] GET failed:', err)
    return Response.json({ error: 'DB error' }, { status: 500 })
  }
}

// ─── PUT /api/admin/contracts/[id] ───────────────────────
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const contractId = parseInt(id, 10)

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
    if (data.title        !== undefined) updatePayload.title        = data.title
    if (data.type         !== undefined) updatePayload.type         = data.type
    if (data.r2Key        !== undefined) updatePayload.r2Key        = data.r2Key
    if (data.fileSize     !== undefined) updatePayload.fileSize     = data.fileSize
    if (data.status       !== undefined) updatePayload.status       = data.status
    if (data.signedDate   !== undefined) updatePayload.signedDate   = data.signedDate
    if (data.expiryDate   !== undefined) updatePayload.expiryDate   = data.expiryDate
    if (data.notes        !== undefined) updatePayload.notes        = data.notes

    const [updated] = await db
      .update(customerContracts)
      .set(updatePayload)
      .where(eq(customerContracts.id, contractId))
      .returning()

    if (!updated) {
      return Response.json({ error: 'Contract not found' }, { status: 404 })
    }

    return Response.json(updated)
  } catch (err) {
    console.error('[Admin/Contracts/id] PUT failed:', err)
    return Response.json({ error: 'DB error' }, { status: 500 })
  }
}

// ─── DELETE /api/admin/contracts/[id] ────────────────────
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const contractId = parseInt(id, 10)

  const env = await getCfEnv()
  if (!env?.DB) {
    return Response.json({ error: 'DB unavailable' }, { status: 503 })
  }

  try {
    const db = getDB(env.DB)
    const [deleted] = await db
      .delete(customerContracts)
      .where(eq(customerContracts.id, contractId))
      .returning()

    if (!deleted) {
      return Response.json({ error: 'Contract not found' }, { status: 404 })
    }

    return Response.json({ success: true })
  } catch (err) {
    console.error('[Admin/Contracts/id] DELETE failed:', err)
    return Response.json({ error: 'DB error' }, { status: 500 })
  }
}
