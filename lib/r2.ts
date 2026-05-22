import { AwsClient } from 'aws4fetch'

// ─── Types ────────────────────────────────────────────────

interface R2Object {
  key: string
  lastModified: Date
  size: number
}

export type BackupStatus = 'ok' | 'warning' | 'fail'

export interface BucketBackupStatus {
  bucket: string
  lastBackup: Date | null
  totalFiles: number
  totalSize: number
  status: BackupStatus
  hoursSinceBackup: number | null
}

// ─── Helpers ─────────────────────────────────────────────

function getR2Client(env: Env): AwsClient {
  return new AwsClient({
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  })
}

function getR2Endpoint(env: Env): string {
  return `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
}

// Parse S3 ListObjectsV2 XML response with regex
// (DOMParser is not available on Edge Runtime)
function parseListObjectsXml(xml: string): R2Object[] {
  const objects: R2Object[] = []
  // Match each <Contents> block
  const contentsPattern = /<Contents>([\s\S]*?)<\/Contents>/g
  let match: RegExpExecArray | null

  while ((match = contentsPattern.exec(xml)) !== null) {
    const block = match[1]

    const keyMatch = /<Key>([\s\S]*?)<\/Key>/.exec(block)
    const lastModMatch = /<LastModified>([\s\S]*?)<\/LastModified>/.exec(block)
    const sizeMatch = /<Size>([\s\S]*?)<\/Size>/.exec(block)

    if (keyMatch && lastModMatch && sizeMatch) {
      objects.push({
        key: keyMatch[1].trim(),
        lastModified: new Date(lastModMatch[1].trim()),
        size: parseInt(sizeMatch[1].trim(), 10),
      })
    }
  }

  return objects
}

// ─── Public API ───────────────────────────────────────────

// List all objects in a bucket
export async function listObjects(
  env: Env,
  bucket: string,
  prefix?: string,
  maxKeys = 1000,
): Promise<R2Object[]> {
  const client = getR2Client(env)
  const endpoint = getR2Endpoint(env)

  const url = new URL(`/${bucket}`, endpoint)
  url.searchParams.set('list-type', '2')
  url.searchParams.set('max-keys', String(maxKeys))
  if (prefix) url.searchParams.set('prefix', prefix)

  const response = await client.fetch(url.toString())

  if (!response.ok) {
    throw new Error(`R2 list failed: ${response.status} ${response.statusText}`)
  }

  const xml = await response.text()
  return parseListObjectsXml(xml)
}

// Get backup status summary for a bucket
// Alert logic: <26h = ok, 26-48h = warning, >48h = fail, no files = fail
export async function getBackupStatus(env: Env, bucket: string): Promise<BucketBackupStatus> {
  try {
    const objects = await listObjects(env, bucket)

    if (objects.length === 0) {
      return {
        bucket,
        lastBackup: null,
        totalFiles: 0,
        totalSize: 0,
        status: 'fail',
        hoursSinceBackup: null,
      }
    }

    const totalSize = objects.reduce((sum, obj) => sum + obj.size, 0)

    // Find most recent file
    const sorted = [...objects].sort(
      (a, b) => b.lastModified.getTime() - a.lastModified.getTime(),
    )
    const lastBackup = sorted[0].lastModified

    const nowMs = Date.now()
    const hoursSinceBackup = (nowMs - lastBackup.getTime()) / (1000 * 60 * 60)

    let status: BackupStatus
    if (hoursSinceBackup < 26) {
      status = 'ok'
    } else if (hoursSinceBackup <= 48) {
      status = 'warning'
    } else {
      status = 'fail'
    }

    return {
      bucket,
      lastBackup,
      totalFiles: objects.length,
      totalSize,
      status,
      hoursSinceBackup,
    }
  } catch {
    return {
      bucket,
      lastBackup: null,
      totalFiles: 0,
      totalSize: 0,
      status: 'fail',
      hoursSinceBackup: null,
    }
  }
}

// Get backup status for multiple buckets in parallel
export async function getMultiBucketStatus(
  env: Env,
  buckets: { slug: string; bucket: string }[],
): Promise<Map<string, BucketBackupStatus>> {
  const results = await Promise.all(
    buckets.map(async ({ slug, bucket }) => {
      const status = await getBackupStatus(env, bucket)
      return { slug, status }
    }),
  )

  const map = new Map<string, BucketBackupStatus>()
  for (const { slug, status } of results) {
    map.set(slug, status)
  }
  return map
}
