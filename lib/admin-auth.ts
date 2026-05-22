// Token format: "{expiry_hex}:{hmac_hex}"
// HMAC = HMAC-SHA256(key=password, message="vibagen-admin-" + expiry_hex)
// Token valid for 30 days

const TOKEN_MAX_AGE_SECONDS = 30 * 24 * 60 * 60 // 30 days

export async function createAdminToken(password: string): Promise<string> {
  const expiry = Math.floor(Date.now() / 1000) + TOKEN_MAX_AGE_SECONDS
  const expiryHex = expiry.toString(16)
  const message = `vibagen-admin-${expiryHex}`

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message))
  const sigHex = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')

  return `${expiryHex}:${sigHex}`
}

export async function verifyAdminToken(token: string, password: string): Promise<boolean> {
  const parts = token.split(':')
  if (parts.length !== 2) return false

  const [expiryHex, sigHex] = parts
  const expiry = parseInt(expiryHex, 16)
  if (isNaN(expiry)) return false

  // Check expiry
  const now = Math.floor(Date.now() / 1000)
  if (now > expiry) return false

  // Recompute HMAC
  const message = `vibagen-admin-${expiryHex}`
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify'],
  )

  // Convert sigHex back to Uint8Array
  const matches = sigHex.match(/.{2}/g)
  if (!matches) return false
  const sigBytes = new Uint8Array(matches.map((h) => parseInt(h, 16)))

  return crypto.subtle.verify('HMAC', key, sigBytes, new TextEncoder().encode(message))
}

export const COOKIE_NAME = 'admin_token'
export const COOKIE_MAX_AGE = TOKEN_MAX_AGE_SECONDS
