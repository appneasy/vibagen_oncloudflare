# SKILL: Build VIBAGEN Website on Cloudflare

## When to Use
Use this skill when building or continuing the vibagen.com website project.
Triggers: "build website", "สร้างเว็บ", "ต่อจากตรงนี้", "next phase", "implement section"

---

## Pre-flight Check (Run FIRST every session)

```bash
# 1. Check current state
ls app/ components/ content/ data/ lib/

# 2. Check what's built
cat CLAUDE.md  # project context

# 3. Check wrangler config
cat wrangler.toml

# 4. Verify edge runtime on all API routes
grep -r "export const runtime" app/api/
```

Then ask: "Which phase/section should I continue from?"

---

## Edge Runtime Rules (NEVER BREAK THESE)

```typescript
// Every API route MUST have:
export const runtime = 'edge'

// Never use:
import fs from 'fs'           // ❌
import nodemailer from 'nodemailer' // ❌
import { PrismaClient } from '@prisma/client' // ❌

// Always use instead:
import { drizzle } from 'drizzle-orm/d1'  // ✅
import { Resend } from 'resend'            // ✅
```

---

## Component Building Protocol

### BentoCard (core building block)
```typescript
// components/ui/BentoCard.tsx
type BentoVariant = 'navy' | 'orange' | 'light' | 'white' | 'glass'

interface BentoCardProps {
  variant?: BentoVariant
  span?: 1 | 2 | 3 | 4        // grid column span
  className?: string
  children: React.ReactNode
}
```

### Tooltip (balloon tip for tech terms)
```typescript
// components/ui/Tooltip.tsx
// Reads from /data/glossary.json
// Desktop: hover → show
// Mobile: click → show 3s → auto-hide
// Style: navy bg + white text + orange term name

interface TooltipProps {
  term: string    // key in glossary.json
  children: React.ReactNode
}

// Usage in content:
// <Tooltip term="saas">SaaS</Tooltip>
// <Tooltip term="agentic-ai">Agentic AI</Tooltip>
```

---

## API Route Template

```typescript
// app/api/contact/route.ts
import { drizzle } from 'drizzle-orm/d1'
import { contacts } from '@/lib/db/schema'
import { Resend } from 'resend'
import { z } from 'zod'

export const runtime = 'edge'

const schema = z.object({
  name:     z.string().min(2).max(100),
  email:    z.string().email(),
  company:  z.string().optional(),
  industry: z.string().optional(),
  problem:  z.string().min(10).max(2000),
  budget:   z.string().optional(),
})

export async function POST(req: Request, { env }: { env: Env }) {
  const body = await req.json()
  const data = schema.safeParse(body)
  if (!data.success) return Response.json({ error: data.error }, { status: 400 })

  const db = drizzle(env.DB)
  await db.insert(contacts).values(data.data)

  const resend = new Resend(env.RESEND_API_KEY)
  await resend.emails.send({
    from:    'VIBAGEN <noreply@vibagen.com>',
    to:      'akkraphol@gmail.com',
    subject: `[VIBAGEN] Lead จาก ${data.data.name}`,
    html:    `<p>${JSON.stringify(data.data, null, 2)}</p>`,
  })

  return Response.json({ success: true })
}
```

---

## MDX Article Template

```mdx
---
title: "ชื่อบทความ"
slug: "url-slug-here"
category: "Agentic AI"
date: "2026-05-12"
excerpt: "สรุปย่อ 1-2 ประโยค สำหรับ meta description และ card preview"
readTime: 8
featured: false
keywords: ["keyword1", "keyword2"]
ogImage: "/og?title=ชื่อบทความ"
---

# ชื่อบทความ (H1 — มี keyword เป้าหมาย)

เนื้อหา...

## หัวข้อย่อย (H2)

...
```

---

## SEO Checklist (Run after each page)

```
□ H1 tag มีอยู่ 1 อัน และมี keyword เป้าหมาย
□ generateMetadata() หรือ metadata export มีอยู่
□ description ยาว 130-160 ตัวอักษร
□ openGraph.images มีอยู่
□ JSON-LD schema ถูกต้องตาม page type
□ Canonical URL ถูกต้อง
□ Image alt text ครบทุกรูป
□ Internal links อ้างถึง related content
```

---

## Wrangler Config Template

```toml
# wrangler.toml
name = "vibagen-web"
compatibility_date = "2024-09-23"
compatibility_flags = ["nodejs_compat"]
pages_build_output_dir = ".vercel/output/static"

[[d1_databases]]
binding = "DB"
database_name = "vibagen-db"
database_id = "REPLACE_WITH_ACTUAL_ID"

[[kv_namespaces]]
binding = "KV"
id = "REPLACE_WITH_ACTUAL_ID"

[vars]
NEXT_PUBLIC_SITE_URL = "https://vibagen.com"
```

---

## Build Commands

```bash
# Development
pnpm dev

# Local Cloudflare simulation
pnpm wrangler pages dev .next --d1=DB=local-db

# D1 migration
pnpm wrangler d1 execute vibagen-db --file migrations/0001_init.sql

# Production build + deploy
pnpm build
pnpm wrangler pages deploy .vercel/output/static

# Drizzle generate migration
pnpm drizzle-kit generate

# Lighthouse test (after deploy)
npx lighthouse https://vibagen.com --output html
```

---

## Performance Rules

1. **Hero section**: CSS gradient ไม่ใช่ background image — ป้องกัน LCP ช้า
2. **Google Fonts**: ใช้ `next/font/google` เท่านั้น (ไม่ใช่ `<link>` tag)
3. **Icons**: ใช้ named import เท่านั้น `import { ArrowRight } from 'lucide-react'`
4. **Images**: ใช้ `next/image` ทุกรูป + กำหนด width/height เสมอ
5. **Animation**: CSS transition เท่านั้น ห้าม framer-motion (bundle ใหญ่เกิน)
6. **Client components**: ใช้ 'use client' เฉพาะที่จำเป็น (nav mobile, form, tooltip)

---

## Thai Content Rules

- Heading หลัก: ภาษาไทย
- Technical terms: ภาษาอังกฤษ พร้อม Tooltip อธิบาย
- CTA buttons: ภาษาไทย ("ปรึกษาฟรี →", "ดู Demo จริงเลย →")
- Section labels (H3/eyebrow): English ("Agentic AI", "Why VIBAGEN")
- Body copy: Thai เป็นหลัก English เฉพาะ term ที่มีความหมายเฉพาะ
