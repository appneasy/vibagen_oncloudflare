import { z } from 'zod'
import { getDB } from '@/lib/db'
import { uptimeMonitors, uptimeChecks } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'

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
const monitorSchema = z.object({
  customerSlug:    z.string().optional(),
  url:             z.string().url(),
  label:           z.string().min(1),
  checkInterval:   z.number().int().min(60).max(3600).optional(),
  expectedStatus:  z.number().int().min(100).max(599).optional(),
  expectedKeyword: z.string().optional(),
  isActive:        z.number().int().min(0).max(1).optional(),
  alertEmails:     z.string().optional(),
  telegramChatId:  z.string().optional(),
})

// ─── GET /api/admin/monitors ──────────────────────────────
export async function GET() {
  const env = await getCfEnv()
  if (!env?.DB) {
    return Response.json({ error: 'DB unavailable' }, { status: 503 })
  }

  try {
    const db = getDB(env.DB)
    const monitors = await db.select().from(uptimeMonitors)

    // For each monitor, get latest check
    const enriched = await Promise.all(
      monitors.map(async (m) => {
        const latestCheck = await db
          .select()
          .from(uptimeChecks)
          .where(eq(uptimeChecks.monitorId, m.id))
          .orderBy(desc(uptimeChecks.checkedAt))
          .limit(1)
          .get()

        return {
          ...m,
          lastStatus:         latestCheck?.status ?? null,
          lastResponseTimeMs: latestCheck?.responseTimeMs ?? null,
          lastCheckedAt:      latestCheck?.checkedAt ?? null,
        }
      }),
    )

    return Response.json(enriched)
  } catch (err) {
    console.error('[Admin/Monitors] GET failed:', err)
    return Response.json({ error: 'DB error' }, { status: 500 })
  }
}

// ─── POST /api/admin/monitors ─────────────────────────────
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

  const result = monitorSchema.safeParse(body)
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
      .insert(uptimeMonitors)
      .values({
        customerSlug:    data.customerSlug    ?? null,
        url:             data.url,
        label:           data.label,
        checkInterval:   data.checkInterval   ?? 300,
        expectedStatus:  data.expectedStatus  ?? 200,
        expectedKeyword: data.expectedKeyword ?? null,
        isActive:        data.isActive        ?? 1,
        alertEmails:     data.alertEmails     ?? null,
        telegramChatId:  data.telegramChatId  ?? null,
      })
      .returning()

    return Response.json(created, { status: 201 })
  } catch (err) {
    console.error('[Admin/Monitors] POST failed:', err)
    return Response.json({ error: 'DB error' }, { status: 500 })
  }
}
