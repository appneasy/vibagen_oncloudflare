import { eq, sql } from 'drizzle-orm'
import { getDB } from '@/lib/db'
import { articleViews } from '@/lib/db/schema'

export const runtime = 'edge'

function getCfEnv(): Env | undefined {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getRequestContext } = require('@cloudflare/next-on-pages')
    return getRequestContext().env
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

  const env = getCfEnv()
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

  const env = getCfEnv()
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
