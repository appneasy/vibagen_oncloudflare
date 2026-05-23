import { eq } from 'drizzle-orm'
import { getDB } from '@/lib/db'
import { contractFiles } from '@/lib/db/schema'
import { getObject, deleteObject } from '@/lib/r2'

export const runtime = 'edge'

async function getCfEnv(): Promise<Env | undefined> {
  try {
    const { getRequestContext } = await import('@cloudflare/next-on-pages')
    return getRequestContext().env as unknown as Env
  } catch {
    return undefined
  }
}

// ─── GET /api/admin/contracts/files/[fileId] — download proxy ──
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ fileId: string }> },
) {
  const { fileId } = await params
  const fid = parseInt(fileId, 10)

  const env = await getCfEnv()
  if (!env?.DB) {
    return Response.json({ error: 'DB unavailable' }, { status: 503 })
  }

  const bucket = env.CONTRACTS_R2_BUCKET
  if (!bucket) {
    return Response.json({ error: 'CONTRACTS_R2_BUCKET not configured' }, { status: 503 })
  }

  try {
    const db = getDB(env.DB)
    const file = await db
      .select()
      .from(contractFiles)
      .where(eq(contractFiles.id, fid))
      .get()

    if (!file) {
      return Response.json({ error: 'File not found' }, { status: 404 })
    }

    const obj = await getObject(env, bucket, file.r2Key)
    if (!obj) {
      return Response.json({ error: 'File not found in storage' }, { status: 404 })
    }

    // Determine if we should inline (images) or download (other files)
    const isImage = file.fileType.startsWith('image/')
    const disposition = isImage
      ? `inline; filename="${file.fileName}"`
      : `attachment; filename="${file.fileName}"`

    return new Response(obj.body, {
      headers: {
        'Content-Type': obj.contentType,
        'Content-Disposition': disposition,
        'Content-Length': String(obj.size),
        'Cache-Control': 'private, max-age=3600',
      },
    })
  } catch (err) {
    console.error('[Contracts/Files] GET download failed:', err)
    return Response.json({ error: 'Download failed' }, { status: 500 })
  }
}

// ─── DELETE /api/admin/contracts/files/[fileId] ──────────
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ fileId: string }> },
) {
  const { fileId } = await params
  const fid = parseInt(fileId, 10)

  const env = await getCfEnv()
  if (!env?.DB) {
    return Response.json({ error: 'DB unavailable' }, { status: 503 })
  }

  const bucket = env.CONTRACTS_R2_BUCKET
  if (!bucket) {
    return Response.json({ error: 'CONTRACTS_R2_BUCKET not configured' }, { status: 503 })
  }

  try {
    const db = getDB(env.DB)

    // Get file info first
    const file = await db
      .select()
      .from(contractFiles)
      .where(eq(contractFiles.id, fid))
      .get()

    if (!file) {
      return Response.json({ error: 'File not found' }, { status: 404 })
    }

    // Delete from R2
    await deleteObject(env, bucket, file.r2Key)

    // Delete from DB
    await db.delete(contractFiles).where(eq(contractFiles.id, fid))

    return Response.json({ success: true })
  } catch (err) {
    console.error('[Contracts/Files] DELETE failed:', err)
    return Response.json({ error: 'Delete failed' }, { status: 500 })
  }
}
