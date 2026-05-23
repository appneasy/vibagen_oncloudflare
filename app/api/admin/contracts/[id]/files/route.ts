import { eq, desc } from 'drizzle-orm'
import { getDB } from '@/lib/db'
import { contractFiles, customerContracts } from '@/lib/db/schema'
import { putObject } from '@/lib/r2'

export const runtime = 'edge'

async function getCfEnv(): Promise<Env | undefined> {
  try {
    const { getRequestContext } = await import('@cloudflare/next-on-pages')
    return getRequestContext().env as unknown as Env
  } catch {
    return undefined
  }
}

// ─── GET /api/admin/contracts/[id]/files ─────────────────
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
    const files = await db
      .select()
      .from(contractFiles)
      .where(eq(contractFiles.contractId, contractId))
      .orderBy(desc(contractFiles.createdAt))

    return Response.json(files)
  } catch (err) {
    console.error('[Contracts/Files] GET failed:', err)
    return Response.json({ error: 'DB error' }, { status: 500 })
  }
}

// ─── POST /api/admin/contracts/[id]/files ────────────────
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const contractId = parseInt(id, 10)

  const env = await getCfEnv()
  if (!env?.DB) {
    return Response.json({ error: 'DB unavailable' }, { status: 503 })
  }

  const bucket = env.CONTRACTS_R2_BUCKET
  if (!bucket) {
    return Response.json({ error: 'CONTRACTS_R2_BUCKET not configured' }, { status: 503 })
  }

  // Parse multipart form data
  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return Response.json({ error: 'Invalid form data' }, { status: 400 })
  }

  const file = formData.get('file') as File | null
  const label = (formData.get('label') as string) || null

  if (!file || file.size === 0) {
    return Response.json({ error: 'No file provided' }, { status: 400 })
  }

  // Validate file size: PDFs max 20MB, others max 20MB too
  const MAX_SIZE = 20 * 1024 * 1024 // 20MB
  if (file.size > MAX_SIZE) {
    return Response.json({ error: 'File too large (max 20MB)' }, { status: 413 })
  }

  try {
    const db = getDB(env.DB)

    // Verify contract exists and get customerSlug
    const contract = await db
      .select()
      .from(customerContracts)
      .where(eq(customerContracts.id, contractId))
      .get()

    if (!contract) {
      return Response.json({ error: 'Contract not found' }, { status: 404 })
    }

    // Generate R2 key
    const timestamp = Date.now()
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const r2Key = `${contract.customerSlug}/${contractId}/${timestamp}-${safeName}`

    // Read file data
    const arrayBuffer = await file.arrayBuffer()

    // Upload to R2
    await putObject(env, bucket, r2Key, arrayBuffer, file.type)

    // Save metadata to DB
    const [created] = await db
      .insert(contractFiles)
      .values({
        contractId,
        fileName: file.name,
        r2Key,
        fileSize: file.size,
        fileType: file.type,
        label,
      })
      .returning()

    return Response.json(created, { status: 201 })
  } catch (err) {
    console.error('[Contracts/Files] POST failed:', err)
    return Response.json({ error: 'Upload failed' }, { status: 500 })
  }
}
