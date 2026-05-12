import { z } from 'zod'
import { getDB } from '@/lib/db'
import { contacts } from '@/lib/db/schema'
import { Resend } from 'resend'

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
export async function POST(req: Request, { env }: { env: Env }) {
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

  // 2. Save to D1
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
    return Response.json({ error: 'Database error' }, { status: 500 })
  }

  // 3. Send email via Resend
  try {
    const resend = new Resend(env.RESEND_API_KEY)
    await resend.emails.send({
      from:    'VIBAGEN Contact <noreply@vibagen.com>',
      to:      'akkraphol@gmail.com',
      replyTo: data.email,
      subject: `[VIBAGEN Lead] ${data.name}${data.company ? ` — ${data.company}` : ''}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#ff6c01">VIBAGEN — New Lead</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;width:120px">ชื่อ</td><td style="padding:8px;border-bottom:1px solid #eee">${data.name}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">อีเมล</td><td style="padding:8px;border-bottom:1px solid #eee"><a href="mailto:${data.email}">${data.email}</a></td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">บริษัท</td><td style="padding:8px;border-bottom:1px solid #eee">${data.company ?? '—'}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">ธุรกิจ</td><td style="padding:8px;border-bottom:1px solid #eee">${data.industry ?? '—'}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">งบประมาณ</td><td style="padding:8px;border-bottom:1px solid #eee">${data.budget ?? '—'}</td></tr>
          </table>
          <h3 style="margin-top:20px">ปัญหา / ความต้องการ</h3>
          <p style="background:#f5f5f5;padding:16px;border-radius:8px;white-space:pre-wrap">${data.problem}</p>
          <hr style="margin:24px 0;border:none;border-top:1px solid #eee"/>
          <p style="color:#999;font-size:12px">Sent via vibagen.com contact form</p>
        </div>
      `,
    })
  } catch (err) {
    // Email failure should NOT fail the request — data is already saved
    console.error('[Contact] Resend failed:', err)
  }

  return Response.json({ success: true })
}
