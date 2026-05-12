/// <reference types="@cloudflare/workers-types" />

// Cloudflare Workers / Pages bindings type declarations
// These match the bindings configured in wrangler.toml

interface Env {
  /** Cloudflare D1 — vibagen-db */
  DB: D1Database

  /** Telegram Bot — set in Cloudflare Pages dashboard */
  TELEGRAM_BOT_TOKEN: string
  TELEGRAM_CHAT_ID: string

  /** Optional: Cloudflare Web Analytics token */
  NEXT_PUBLIC_CF_ANALYTICS_TOKEN?: string

  /** Site URL */
  NEXT_PUBLIC_SITE_URL?: string
}
