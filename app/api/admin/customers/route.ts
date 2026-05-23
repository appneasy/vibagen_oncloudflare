import { getDB } from '@/lib/db'
import { managedCustomers } from '@/lib/db/schema'
import { customerCreateSchema } from '@/lib/validators/customer'

export const runtime = 'edge'

async function getCfEnv(): Promise<Env | undefined> {
  try {
    const { getRequestContext } = await import('@cloudflare/next-on-pages')
    return getRequestContext().env as unknown as Env
  } catch {
    return undefined
  }
}

// ─── GET /api/admin/customers ─────────────────────────────
export async function GET() {
  const env = await getCfEnv()
  if (!env?.DB) {
    return Response.json({ error: 'DB unavailable' }, { status: 503 })
  }

  try {
    const db = getDB(env.DB)
    const rows = await db.select().from(managedCustomers)
    return Response.json(rows)
  } catch (err) {
    console.error('[Admin/Customers] GET failed:', err)
    return Response.json({ error: 'DB error' }, { status: 500 })
  }
}

// ─── POST /api/admin/customers ────────────────────────────
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

  const result = customerCreateSchema.safeParse(body)
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
      .insert(managedCustomers)
      .values({
        name:            data.name,
        slug:            data.slug,
        subdomain:       data.subdomain,
        vpsIp:           data.vpsIp ?? null,
        vpsPlan:         data.vpsPlan ?? 'CPX22',
        vpsLocation:     data.vpsLocation ?? 'nbg1',
        r2Bucket:        data.r2Bucket ?? null,
        status:          data.status ?? 'setup',
        startDate:       data.startDate ?? null,
        lineOaName:      data.lineOaName ?? null,
        liffId:          data.liffId ?? null,
        notes:           data.notes ?? null,
      })
      .returning()

    return Response.json(created, { status: 201 })
  } catch (err) {
    console.error('[Admin/Customers] POST failed:', err)
    return Response.json({ error: 'DB error' }, { status: 500 })
  }
}
