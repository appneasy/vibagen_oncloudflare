// Cloudflare Workers / Pages bindings type declarations
// These match the bindings configured in wrangler.toml

interface Env {
  /** Cloudflare D1 — vibagen-db */
  DB: D1Database

  /** Cloudflare KV namespace */
  KV: KVNamespace

  /** Resend API key — set in Cloudflare Pages dashboard */
  RESEND_API_KEY: string

  /** Optional: Cloudflare Web Analytics token */
  NEXT_PUBLIC_CF_ANALYTICS_TOKEN?: string

  /** Site URL */
  NEXT_PUBLIC_SITE_URL?: string
}
