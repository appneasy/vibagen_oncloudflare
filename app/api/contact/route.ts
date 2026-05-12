import { z } from 'zod'
import { getDB } from '@/lib/db'
import { contacts } from '@/lib/db/schema'

export const runtime = 'edge'

// ─── Validation Schema ────────────────────────────────────
const contactSchema = z.object({
  name:     z.string().min(2, 'ชื่อต้องมีอย่างน้อย 2 ตัวอักษร').max(100),
  email:    z.string().email('รูปแบบอีเมลไม่ถูกต้อง'),
  company:  z.string().max(200).optional(),
  industry: z.string().max(100).optional(),
  problem:  z.string().min(10, 'กรุณาอธิบายปัญหาให้มากกว่านี้').max(2000),
  budget:   z.string().max(100).optional(),
})

// ─── POST /api/contact ────────────────────────────────────
export async function POST(req: Request, ctx?: { env?: Env }) {
  const env = ctx?.env

  // 1. Parse + validate body
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const result = contactSchema.safeParse(body)
  if (!result.success) {
    return Response.json(
      { error: 'Validation failed', details: result.error.flatten().fieldErrors },
      { status: 422 },
    )
  }

  const data = result.data

  // 2. Save to D1 (skip if DB binding unavailable — local dev)
  if (env?.DB) {
    try {
      const db = getDB(env.DB)
      await db.insert(contacts).values({
        name:     data.name,
        email:    data.email,
        company:  data.company ?? null,
        industry: data.industry ?? null,
        problem:  data.problem,
        budget:   data.budget ?? null,
      })
    } catch (err) {
      console.error('[Contact] D1 insert failed:', err)
    }
  }

  // 3. Send to Telegram
  try {
    const token = env?.TELEGRAM_BOT_TOKEN ?? process.env.TELEGRAM_BOT_TOKEN
    const chatId = env?.TELEGRAM_CHAT_ID ?? process.env.TELEGRAM_CHAT_ID
    if (token && chatId) {
      const text = [
        `🔔 <b>VIBAGEN — New Lead</b>`,
        ``,
        `<b>ชื่อ:</b> ${escapeHtml(data.name)}`,
        `<b>อีเมล:</b> ${escapeHtml(data.email)}`,
        `<b>บริษัท:</b> ${escapeHtml(data.company ?? '—')}`,
        `<b>ธุรกิจ:</b> ${escapeHtml(data.industry ?? '—')}`,
        `<b>งบประมาณ:</b> ${escapeHtml(data.budget ?? '—')}`,
        ``,
        `<b>ปัญหา / ความต้องการ:</b>`,
        escapeHtml(data.problem),
      ].join('\n')

      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'HTML',
        }),
      })
    }
  } catch (err) {
    // Telegram failure should NOT fail the request — data is already saved
    console.error('[Contact] Telegram send failed:', err)
  }

  return Response.json({ success: true })
}

/** Escape HTML special chars for Telegram HTML parse mode */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
