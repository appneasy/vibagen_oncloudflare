import { eq, sql } from 'drizzle-orm'
import { getDB } from '@/lib/db'
import { articleViews } from '@/lib/db/schema'

export const runtime = 'edge'

async function getCfEnv(): Promise<Env | undefined> {
  try {
    const { getRequestContext } = await import('@cloudflare/next-on-pages')
    return getRequestContext().env as unknown as Env
  } catch {
    return undefined
  }
}

// ─── GET /api/views/[slug] — return current count ─────────
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  if (!slug) return Response.json({ views: 0 })

  const env = await getCfEnv()
  if (!env?.DB) return Response.json({ views: 0 })

  try {
    const db = getDB(env.DB)
    const row = await db
      .select({ views: articleViews.views })
      .from(articleViews)
      .where(eq(articleViews.slug, slug))
      .get()
    return Response.json({ views: row?.views ?? 0 })
  } catch {
    return Response.json({ views: 0 })
  }
}

// ─── POST /api/views/[slug] — increment + return new count ─
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  if (!slug) return Response.json({ error: 'Missing slug' }, { status: 400 })

  const env = await getCfEnv()
  if (!env?.DB) return Response.json({ error: 'DB unavailable' }, { status: 503 })

  try {
    const db = getDB(env.DB)

    // Upsert: insert or increment
    await db
      .insert(articleViews)
      .values({ slug, views: 1 })
      .onConflictDoUpdate({
        target: articleViews.slug,
        set: {
          views:     sql`${articleViews.views} + 1`,
          updatedAt: sql`(datetime('now'))`,
        },
      })

    const row = await db
      .select({ views: articleViews.views })
      .from(articleViews)
      .where(eq(articleViews.slug, slug))
      .get()

    return Response.json({ views: row?.views ?? 1 })
  } catch (err) {
    console.error('[Views] D1 error:', err)
    return Response.json({ error: 'DB error' }, { status: 500 })
  }
}
