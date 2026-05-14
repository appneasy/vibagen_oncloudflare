# VIBAGEN Website — Session Notes

> สรุปความคืบหน้าจาก Claude Code sessions เพื่อให้ทีมอ่านเข้าใจสถานะปัจจุบัน
> Last updated: 2026-05-13

---

## Current Status

| ส่วน | สถานะ | หมายเหตุ |
|------|--------|----------|
| Homepage (all sections) | Done | 10 sections ครบ |
| Navbar | Done | V icon + HTML text, Prosto + Inter fonts |
| Footer | Done | logosquare.png + orange accent line |
| Article page | Done | Navy header + light content zone, SSG |
| Knowledge list page | Done | SSG + client-side category filtering |
| Contact form → Telegram | Done | ส่งเข้า Telegram group, ทำงานบน Cloudflare แล้ว |
| D1 Database | Done | สร้าง + migration + binding ตั้งแล้ว |
| Cloudflare Pages Deploy | Done | vibagen.com live |
| Custom domain (vibagen.com) | Done | ใช้งานได้แล้ว |
| Favicon | Done | แปลงเป็น ICO จริง (16/32/48px), รอ browser cache clear |
| SEO (sitemap, robots, OG) | Done | มีอยู่แล้วจาก phase ก่อน |

---

## สิ่งที่ทำในวันนี้ (2026-05-13) — Cloudflare Deploy

### 1. Downgrade Next.js 16 → 15.3.3
- `@cloudflare/next-on-pages@1.13.16` รองรับแค่ `next@<=15.5.2`
- Next.js 16 + React 19.2.4 ทำให้ build crash (`useContext` null error ทุกหน้า)
- Downgrade: `next@15.3.3`, `@next/mdx@^15.3.3`, `react@^19.0.0`, `react-dom@^19.0.0`
- **Files:** `package.json`, `pnpm-lock.yaml`

### 2. Knowledge Pages — SSG Fix
- **ปัญหา:** `app/knowledge/[slug]/page.tsx` ใช้ `runtime = 'edge'` แต่ `lib/mdx.ts` ใช้ `fs` (Node.js only)
- **แก้ไข:**
  - ลบ `export const runtime = 'edge'` + `export const dynamic = 'force-dynamic'`
  - เพิ่ม `generateStaticParams()` กลับมา → articles สร้างเป็น static HTML ตอน build
  - แยก `app/knowledge/page.tsx` เป็น server component (อ่าน articles ตอน build) + client component `KnowledgeContent.tsx` (filter ด้วย `useState`)
  - Category filter เปลี่ยนจาก `<Link>` + `searchParams` เป็น `<button>` + `useState`
- **Files:** `app/knowledge/[slug]/page.tsx`, `app/knowledge/page.tsx`, `components/sections/KnowledgeContent.tsx`

### 3. API Routes — ESM Import Fix
- `@cloudflare/next-on-pages` เป็น ESM-only package → `require()` ไม่ทำงาน
- เปลี่ยน `require('@cloudflare/next-on-pages')` → `await import('@cloudflare/next-on-pages')`
- `getCfEnv()` เปลี่ยนเป็น `async` function
- Type assertion: `getRequestContext().env as unknown as Env`
- **Files:** `app/api/contact/route.ts`, `app/api/views/[slug]/route.ts`

### 4. Remove @next/mdx Wrapper
- Articles อ่านด้วย `gray-matter` + `fs` ไม่ใช้ MDX page rendering
- ลบ `withMDX()` wrapper + `pageExtensions` จาก `next.config.ts`
- ลดความซับซ้อนของ build pipeline
- **Files:** `next.config.ts`

### 5. Error Pages
- เพิ่ม `app/not-found.tsx` — custom 404 page (App Router)
- เพิ่ม `app/global-error.tsx` — minimal error boundary
- **Files:** `app/not-found.tsx`, `app/global-error.tsx`

### 6. Cloudflare Pages Setup
- **Project type:** Pages (ไม่ใช่ Workers) — ต้องสร้างผ่าน Pages → Connect to Git
- **Build command:** `npx @cloudflare/next-on-pages`
- **Build output directory:** `.vercel/output/static`
- **Deploy command:** ไม่ต้องตั้ง (Pages auto-deploy)
- **NODE_VERSION:** `22` (wrangler ต้องการ ≥22)
- **D1 binding:** Settings → Bindings → `DB` → `vibagen-db`
- **Env vars (Production):**
  - `TELEGRAM_BOT_TOKEN`
  - `TELEGRAM_CHAT_ID`
  - `NODE_VERSION=22`

### 7. Favicon Fix
- Next.js auto-generate `/favicon.ico` เป็น Vercel/Next.js default icon (สามเหลี่ยมดำ)
- แก้โดย: วาง `app/favicon.ico` เพื่อทับ default
- แปลง PNG (1254x1254, 441KB) → ICO จริง (16/32/48px, 5.5KB) ด้วย Pillow
- ลบ `icons` metadata ออก → ใช้ `<link rel="icon">` ตรงใน `<head>` แทน
- **Files:** `app/favicon.ico`, `app/layout.tsx`

---

## สิ่งที่ทำเมื่อวาน (2026-05-12)

### 1. Navbar Logo + Background
- เปลี่ยนจาก `banner-logo.png` → `vlogo.png` (V icon) + HTML text
  - "VIBAGEN" → font Prosto One, สีขาว
  - "Crafting ideas into real products" → font Inter (แทน Neue Montreal), สี white/60
- Navbar background เข้มขึ้น: `#0d2749`

### 2. Font System
- เพิ่ม **Inter** (Google Fonts) เป็น `--font-inter` CSS variable
- ใช้แทน Neue Montreal สำหรับ tagline

### 3. Article Page Readability
- แยกเป็น 2 zones: Navy hero + Off-white content
- Gradient transition 80px

### 4. Contact Form → Telegram Bot
- แทนที่ Resend email ด้วย Telegram Bot API

### 5. Dotted Background Pattern
- CSS class `.bg-dots` — halftone dot pattern
- ใช้กับ WhyVibagen section

---

## Environment Variables

### Local Dev (`.env.local`)
```
TELEGRAM_BOT_TOKEN=8592027763:AAEgM9W6_OfPBkqrmVVs8_56aXzyUZ8TLCQ
TELEGRAM_CHAT_ID=-5002677677
```

### Cloudflare Pages (Dashboard → Settings → Environment variables)
```
TELEGRAM_BOT_TOKEN = 8592027763:AAEgM9W6_OfPBkqrmVVs8_56aXzyUZ8TLCQ
TELEGRAM_CHAT_ID   = -5002677677
NODE_VERSION       = 22
```

### Cloudflare Pages (Dashboard → Settings → Bindings)
```
D1 Database: DB → vibagen-db
```

---

## Build Errors ที่เจอและแก้ไขแล้ว (Cloudflare Pages)

| # | Error | สาเหตุ | แก้ไข |
|---|-------|--------|-------|
| 1 | NODE_VERSION=18 too old | Next.js 15+ ต้อง Node ≥20 | ตั้ง `NODE_VERSION=22` |
| 2 | API route signature mismatch | ใช้ `(req, { env })` แทน Next.js standard | ใช้ `getRequestContext()` |
| 3 | Button type conflict | `ButtonBaseProps` ซ้อนกับ `ButtonHTMLAttributes` | `Omit<>` overlapping props |
| 4 | D1Database type not found | ขาด type definitions | เพิ่ม `@cloudflare/workers-types` |
| 5 | pnpm-lock.yaml outdated | เพิ่ม dependency ไม่ได้ update lock | `pnpm install` ใหม่ |
| 6 | ViewCounter data unknown | `res.json()` returns `unknown` | Cast as `Promise<{views?: number}>` |
| 7 | /icon.png no edge runtime | `app/icon.png` สร้าง route handler | ย้ายไป `public/favicon.png` |
| 8 | Invalid prerender /knowledge/[slug] | `generateStaticParams` issue | เพิ่ม `runtime='edge'` (ผิด) |
| 9 | fs module on Edge Runtime | `lib/mdx.ts` ใช้ `fs` บน edge | Restore SSG + `generateStaticParams` |
| 10 | useContext null (Next.js 16) | Next.js 16 ไม่ compatible กับ `@cloudflare/next-on-pages` | Downgrade Next.js 15.3.3 |
| 11 | ESM-only package require() | `@cloudflare/next-on-pages` ไม่ export CJS | เปลี่ยนเป็น `await import()` |
| 12 | CloudflareEnv type mismatch | `getRequestContext().env` ≠ `Env` | `as unknown as Env` |
| 13 | Html outside _document | auto-generated 404 ใช้ Pages Router | เพิ่ม `app/not-found.tsx` |
| 14 | Wrangler Node ≥22 required | Deploy command ใช้ wrangler | ตั้ง `NODE_VERSION=22` |
| 15 | Wrangler deploy auth error | สร้างเป็น Workers ไม่ใช่ Pages | ลบ → สร้างใหม่เป็น Pages project |

---

## Local Dev Setup

```bash
# Docker dev server (port 3002)
docker compose up -d

# หรือ restart หลังแก้โค้ด
docker compose restart

# ทดสอบ contact API
curl -X POST http://localhost:3002/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","problem":"ทดสอบระบบ"}'
```

---

## Known Issues / TODO

- [ ] พิจารณา migrate จาก `@cloudflare/next-on-pages` (deprecated) ไป OpenNext adapter
- [ ] Neue Montreal / Plate Gothic Two Four — ถ้าต้องการ font ตรง brand spec ต้องซื้อ license
- [ ] Apply `.bg-dots` background กับ section อื่นถ้าต้องการ
- [ ] ลบ `resend` package จาก dependencies (ไม่ได้ใช้แล้ว)
- [ ] Local Docker build ใช้ `NODE_ENV=development` ทำให้ `next build` มี warning — ไม่กระทบ production
