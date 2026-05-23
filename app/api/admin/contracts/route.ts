import { z } from 'zod'
import { eq, desc } from 'drizzle-orm'
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

// ─── Validation Schema ────────────────────────────────────
const contractSchema = z.object({
  customerSlug: z.string().min(1),
  title:        z.string().min(1),
  type:         z.enum(['contract', 'quotation', 'invoice', 'requirement', 'other']),
  r2Key:        z.string().nullable().optional(),
  fileSize:     z.number().int().min(0).nullable().optional(),
  status:       z.enum(['draft', 'signed', 'expired']).nullable().optional(),
  signedDate:   z.string().nullable().optional(),
  expiryDate:   z.string().nullable().optional(),
  notes:        z.string().nullable().optional(),
})

// ─── GET /api/admin/contracts ─────────────────────────────
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
      .from(customerContracts)
      .orderBy(desc(customerContracts.createdAt))

    const rows = customerSlug
      ? await query.where(eq(customerContracts.customerSlug, customerSlug))
      : await query

    return Response.json(rows)
  } catch (err) {
    console.error('[Admin/Contracts] GET failed:', err)
    return Response.json({ error: 'DB error' }, { status: 500 })
  }
}

// ─── POST /api/admin/contracts ────────────────────────────
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

  const result = contractSchema.safeParse(body)
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
      .insert(customerContracts)
      .values({
        customerSlug: data.customerSlug,
        title:        data.title,
        type:         data.type,
        r2Key:        data.r2Key        ?? null,
        fileSize:     data.fileSize     ?? null,
        status:       data.status       ?? 'draft',
        signedDate:   data.signedDate   ?? null,
        expiryDate:   data.expiryDate   ?? null,
        notes:        data.notes        ?? null,
      })
      .returning()

    return Response.json(created, { status: 201 })
  } catch (err) {
    console.error('[Admin/Contracts] POST failed:', err)
    return Response.json({ error: 'DB error' }, { status: 500 })
  }
}
