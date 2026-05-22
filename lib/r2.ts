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

// ─── Folder-grouped types and helpers ─────────────────────

export interface FolderSummary {
  folder: string          // 'config' | 'db' | 'upload' | 'other'
  fileCount: number
  totalSize: number
  lastModified: Date | null
}

// Group R2 objects by folder prefix (config/, db/, upload/)
// Files without a known prefix go into 'other'
export function groupObjectsByFolder(objects: R2Object[]): FolderSummary[] {
  const KNOWN_FOLDERS = ['config', 'db', 'upload']
  const groups: Record<string, { files: number; size: number; lastMod: Date | null }> = {}

  // Initialize known folders
  for (const f of KNOWN_FOLDERS) {
    groups[f] = { files: 0, size: 0, lastMod: null }
  }
  groups['other'] = { files: 0, size: 0, lastMod: null }

  for (const obj of objects) {
    const firstSlash = obj.key.indexOf('/')
    const prefix = firstSlash > 0 ? obj.key.substring(0, firstSlash) : null
    const folder = prefix && KNOWN_FOLDERS.includes(prefix) ? prefix : 'other'

    groups[folder].files++
    groups[folder].size += obj.size
    if (!groups[folder].lastMod || obj.lastModified > groups[folder].lastMod) {
      groups[folder].lastMod = obj.lastModified
    }
  }

  // Return only folders that have files, with known folders first
  return [...KNOWN_FOLDERS, 'other']
    .filter((f) => groups[f].files > 0)
    .map((f) => ({
      folder: f,
      fileCount: groups[f].files,
      totalSize: groups[f].size,
      lastModified: groups[f].lastMod,
    }))
}

export interface BucketGroupedStatus {
  bucket: string
  folders: FolderSummary[]
  totalFiles: number
  totalSize: number
  lastBackup: Date | null
  status: BackupStatus
  hoursSinceBackup: number | null
}

export async function getGroupedBucketStatus(env: Env, bucket: string): Promise<BucketGroupedStatus> {
  try {
    const objects = await listObjects(env, bucket)
    const folders = groupObjectsByFolder(objects)
    const totalFiles = folders.reduce((s, f) => s + f.fileCount, 0)
    const totalSize = folders.reduce((s, f) => s + f.totalSize, 0)

    let lastBackup: Date | null = null
    for (const f of folders) {
      if (f.lastModified && (!lastBackup || f.lastModified > lastBackup)) {
        lastBackup = f.lastModified
      }
    }

    let hoursSinceBackup: number | null = null
    let status: BackupStatus = 'fail'
    if (lastBackup) {
      hoursSinceBackup = (Date.now() - lastBackup.getTime()) / (1000 * 60 * 60)
      status = hoursSinceBackup < 26 ? 'ok' : hoursSinceBackup <= 48 ? 'warning' : 'fail'
    }

    return { bucket, folders, totalFiles, totalSize, lastBackup, status, hoursSinceBackup }
  } catch {
    return { bucket, folders: [], totalFiles: 0, totalSize: 0, lastBackup: null, status: 'fail', hoursSinceBackup: null }
  }
}

export async function getMultiBucketGroupedStatus(
  env: Env,
  buckets: { slug: string; bucket: string }[],
): Promise<Map<string, BucketGroupedStatus>> {
  const results = await Promise.all(
    buckets.map(async ({ slug, bucket }) => {
      const status = await getGroupedBucketStatus(env, bucket)
      return { slug, status }
    }),
  )
  const map = new Map<string, BucketGroupedStatus>()
  for (const { slug, status } of results) {
    map.set(slug, status)
  }
  return map
}
