# VIBAGEN Website — Claude Code Project Guide

## Project Overview
VIBAGEN (vibagen.com) — Product Engineering Studio
"Crafting Ideas into Real Products"

Build a marketing/portfolio website with:
- Next.js 15 App Router + TypeScript + Tailwind CSS v4
- Deployed on **Cloudflare Pages** (Edge Runtime)
- **No Prisma** — use Drizzle ORM + Cloudflare D1 (SQLite)
- Articles via MDX (static, no DB for content)
- D1 only for: article view counts + contact form submissions
- Email via Resend API (not SMTP — Edge Runtime constraint)

---

## Brand System

```
Colors:
  --navy:        #0d2749   (headings, card text on light bg)
  --navy-dark:   #011937   (navbar, footer, hero bg)
  --navy-light:  #1a3a5c   (navbar bg)
  --orange:      #ff6c01   (accent/CTA)
  --orange-dark: #d54e01   (hover states)
  --gray:        #737373   (body text secondary)
  --white:       #ffffff

Theme Layout:
  Navbar       : navy (#1a3a5c → #2a4a6c on scroll) + navy fade at bottom
  Hero         : dark gradient (navy-dark → navy) — text-white
  Sections     : alternating white (#ffffff) and off-white (#f8f9fc)
  Cards        : white bg + subtle border on off-white sections
                 light gray (#f0f4f8) bg on white sections
  Tables       : navy header + light body rows
  Footer       : navy-dark (#011937) — text-white

  CSS classes:
    .section-dark    → background: #ffffff, color: #1a1a2e
    .section-navy    → background: #f8f9fc, color: #1a1a2e
    .section-divider → subtle navy gradient between sections

Card text on light bg:
  Heading: text-[#0d2749]
  Body:    text-gray-500 / text-gray-600
  Accent:  text-[#ff6c01]

Cards/elements with own dark bg (Showcase, Services navy/orange, Hero):
  Keep text-white — do NOT change

Fonts (Google Fonts, loaded via next/font/google):
  Heading (H1-H3): Prompt 700/600/500
  Body/Caption:    Sarabun 400
  Logo only:       Prosto One (never in UI)

Type Scale:
  Display/Hero : Prompt 700, 56px, lh 1.1
  H1           : Prompt 700, 40px, lh 1.2
  H2           : Prompt 600, 28px, lh 1.3
  H3/Label     : Prompt 500, 20px, lh 1.4, color #ff6c01
  Body         : Sarabun 400, 16px, lh 1.75
  Caption      : Sarabun 400, 13px, lh 1.6, color #737373
```

### Logo
- Navbar: `public/images/logosquare.png` (V icon + VIBAGEN text + motto)
- Favicon: `app/icon.png` (V icon only, converted from Vlogo.png)

---

## Architecture Decision — CRITICAL

### ✅ Use Drizzle ORM (NOT Prisma)
Prisma's Rust engine + TCP connections don't work on Cloudflare Edge Runtime.
Drizzle is edge-native, lightweight (~30KB), same TypeScript DX.

### ✅ Every API Route MUST export runtime
```typescript
export const runtime = 'edge' // Required for every route.ts file
```

### ✅ No Node.js-only APIs
- ❌ fs, net, tls, nodemailer, sharp
- ✅ fetch, Web Crypto, Response/Request, FormData

---

## Stack

```
Framework    : Next.js 15 (App Router)
Language     : TypeScript (strict)
Styling      : Tailwind CSS v4
ORM          : Drizzle ORM
Database     : Cloudflare D1 (SQLite) — view counts + contacts only
Content      : MDX (@next/mdx) — articles in /content/articles/
Static Data  : JSON files in /data/
Email        : Resend API
Package Mgr  : pnpm
Deploy       : Cloudflare Pages via @cloudflare/next-on-pages
Analytics    : Cloudflare Web Analytics (script in layout)
Validation   : Zod
```

---

## D1 Schema (Drizzle)

```typescript
// lib/db/schema.ts
import { int, text, sqliteTable } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

export const articleViews = sqliteTable('article_views', {
  slug:      text('slug').primaryKey(),
  views:     int('views').notNull().default(0),
  updatedAt: text('updated_at').default(sql`(datetime('now'))`),
})

export const contacts = sqliteTable('contacts', {
  id:        int('id').primaryKey({ autoIncrement: true }),
  name:      text('name').notNull(),
  email:     text('email').notNull(),
  company:   text('company'),
  industry:  text('industry'),
  problem:   text('problem').notNull(),
  budget:    text('budget'),
  createdAt: text('created_at').default(sql`(datetime('now'))`),
})
```

---

## File Structure

```
vibagen-website/
├── app/
│   ├── layout.tsx              # Root: fonts, analytics, metadata defaults
│   ├── page.tsx                # Home — all sections
│   ├── expertise/page.tsx
│   ├── services/page.tsx
│   ├── showcase/page.tsx
│   ├── knowledge/
│   │   ├── page.tsx            # Article list
│   │   └── [slug]/page.tsx     # Single article (MDX)
│   ├── hire-us/page.tsx
│   ├── sitemap.ts              # Auto sitemap.xml
│   ├── robots.ts               # robots.txt
│   ├── og/route.tsx            # Dynamic OG image (Edge ImageResponse)
│   └── api/
│       ├── contact/route.ts    # POST: save D1 + Resend email
│       └── views/
│           └── [slug]/route.ts # POST/GET: D1 view counter
├── components/
│   ├── ui/
│   │   ├── BentoCard.tsx       # variant: navy|orange|light|white|glass
│   │   ├── BentoGrid.tsx
│   │   ├── Tooltip.tsx         # Balloon tip for tech terms
│   │   ├── Badge.tsx           # Eyebrow labels
│   │   ├── Button.tsx          # primary|outline|navy variants
│   │   └── StatCard.tsx
│   └── sections/
│       ├── Navbar.tsx
│       ├── Hero.tsx
│       ├── Problems.tsx
│       ├── AgenticAI.tsx       # AI Future section
│       ├── WhyVibagen.tsx
│       ├── Services.tsx        # Bento grid
│       ├── Showcase.tsx        # Projects
│       ├── Process.tsx         # 6-step timeline
│       ├── KnowledgeHub.tsx    # Article preview grid
│       ├── ContactForm.tsx
│       └── Footer.tsx
├── content/
│   └── articles/               # .mdx files (frontmatter + content)
├── data/
│   ├── projects.json
│   ├── services.json
│   └── glossary.json           # Tooltip definitions
├── lib/
│   ├── db/
│   │   ├── schema.ts           # Drizzle schema
│   │   └── index.ts            # DB connection helper
│   ├── email.ts                # Resend helper
│   ├── mdx.ts                  # MDX article loader
│   └── utils.ts
├── public/
│   └── images/
│       ├── og-default.png      # 1200x630 OG default
│       └── logo.svg
├── migrations/                 # Drizzle SQL migrations
│   └── 0001_init.sql
├── wrangler.toml
├── next.config.ts
├── tailwind.config.ts
├── drizzle.config.ts
└── package.json
```

---

## Agentic Build Workflow

Build in this exact order. Each phase is self-contained.

### Phase 1 — Project Scaffold
```bash
pnpm create next-app vibagen-website --typescript --tailwind --app --no-src-dir
cd vibagen-website
pnpm add drizzle-orm @cloudflare/next-on-pages wrangler resend zod @next/mdx
pnpm add -D drizzle-kit
```

Configure:
- `wrangler.toml` with D1 + KV bindings
- `next.config.ts` with MDX + edge config
- `tailwind.config.ts` with Prompt + Sarabun fonts
- CSS variables in `app/globals.css`

### Phase 2 — Design System Components
Build in order: `Button` → `Badge` → `BentoCard` → `BentoGrid` → `Tooltip`
Test each component in isolation before moving on.
Color variables must match brand system exactly.

### Phase 3 — Home Page (Section by Section)
`Navbar` → `Hero` → `Problems` → `AgenticAI` → `WhyVibagen` →
`Services` → `Showcase` (static data) → `Process` → `KnowledgeHub preview` →
`ContactForm` (UI only) → `Footer`

### Phase 4 — Database + API
- Create Drizzle schema
- Generate migration SQL
- `wrangler d1 create vibagen-db`
- `wrangler d1 execute vibagen-db --file migrations/0001_init.sql`
- Build `/api/contact/route.ts` (edge + Zod + D1 + Resend)
- Build `/api/views/[slug]/route.ts` (edge + D1 counter)

### Phase 5 — Knowledge Hub
- Setup `@next/mdx`
- Create 3 sample articles in `/content/articles/`
- Article list page with category filter
- Single article page with view count

### Phase 6 — SEO Layer
- `app/sitemap.ts` (auto from MDX files + static pages)
- `app/robots.ts`
- `app/og/route.tsx` (Edge ImageResponse)
- JSON-LD: Organization (layout), Article ([slug]), FAQ (hire-us)
- Per-page `generateMetadata()` with Thai keywords

### Phase 7 — Cloudflare Deploy
- `wrangler pages project create vibagen-web`
- Test with `wrangler pages dev .next`
- Deploy: `pnpm build && wrangler pages deploy .vercel/output/static`

### Phase 8 — Verification
- Lighthouse audit (target ≥ 90 all categories)
- Test contact form end-to-end (D1 save + email received)
- Test article view counter
- Validate sitemap.xml at /sitemap.xml
- Check OG image at /og?title=Test
- Mobile responsive test (375px, 768px, 1280px)

---

## Page Creation Standard — Checklist

ทุกครั้งที่สร้างหน้าใหม่ ต้องทำตามมาตรฐานนี้ครบทุกข้อ:

### 1. Metadata (บังคับทุกหน้า)
```typescript
export const metadata: Metadata = {
  title: 'ชื่อหน้า — คำอธิบายสั้น | VIBAGEN',     // ≤ 60 ตัวอักษร
  description: 'คำอธิบายภาษาไทย + อังกฤษ...',     // ≤ 160 ตัวอักษร
  alternates: { canonical: 'https://vibagen.com/path' },
  keywords: ['keyword1', 'keyword2', ...],          // 5–10 คำ
}
```

### 2. OpenGraph (บังคับสำหรับ showcase/article pages)
```typescript
openGraph: {
  title: '...',
  description: '...',
  url: 'https://vibagen.com/path',
  type: 'article',  // หรือ 'website' สำหรับหน้าปกติ
}
```

### 3. Sitemap — เพิ่มทุกหน้าใหม่ใน `app/sitemap.ts`
```typescript
{ url: `${BASE}/new-page`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
```

### 4. JSON-LD Structured Data (ถ้าเหมาะสม)
- Article pages → `@type: Article`
- FAQ pages → `@type: FAQPage`
- Case Study pages → `@type: Article` + `articleSection: "Case Study"`
- Service pages → พิจารณา `@type: Service`

### 5. Tooltip — ศัพท์เทคนิคต้องมี tooltip
- ใช้ `<Tooltip term="key">visible text</Tooltip>` สำหรับคำเทคนิคเช่น MVP, Stack, ERP, Perpetual License
- ตรวจสอบ key ใน `data/glossary.json` ก่อน ถ้าไม่มีให้เพิ่ม
- คำอธิบายใน glossary ต้องเป็นภาษาไทยง่ายๆ + มีตัวอย่าง

### 6. View Counter (บังคับสำหรับ article pages)
- ใช้ `<ViewCounter slug={slug} />` ใน article pages
- Component อยู่ที่ `components/ui/ViewCounter.tsx`
- POST ไป `/api/views/[slug]` ตอน mount เพื่อนับ
- แสดงยอดวิวบนหน้า

### 7. Layout Pattern
- **Dark pages** (expertise, showcase hero): `style={{ background: '#011937' }}`
- **White pages** (article content, services detail): `className="bg-dots"`
- **2-column blog**: `grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10`
- Sidebar: `lg:sticky lg:top-28 lg:self-start`

### 8. Typography
- Heading: `font-[--font-heading]` (Prompt font)
- Body text: default (Sarabun font)
- Hero title: `style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}`
- Section title: `style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}`

### 9. Brand Colors (ห้ามเดา ต้องใช้ค่าจริง)
- Navy text on light bg: `text-[#0d2749]`
- Orange accent/CTA: `bg-[#ff6c01]` hover: `hover:bg-[#d54e01]`
- Card on white section: `bg-[#f0f4f8]`
- Card border: `border border-[#0d2749]/[0.08]`
- Dark card: `bg-white/[0.04] border border-white/[0.06]`

### 10. Pre-Push Checklist
- [ ] Metadata ครบ (title, description, canonical, keywords)
- [ ] เพิ่มใน sitemap.ts แล้ว
- [ ] Tooltip ครอบคำเทคนิคแล้ว
- [ ] OpenGraph ใส่แล้ว (ถ้าเป็น showcase/article)
- [ ] Docker build ผ่าน
- [ ] ตรวจ mobile responsive (container ไม่ล้น)

---

## Content References

All copy is ready in:
- `D:\My Data\Vibagen\content-plan.txt` — all page content
- `D:\My Data\Vibagen\content-sections\` — detailed section content
- `D:\My Data\Vibagen\content-sections\article-real-barrier-agentic-ai.txt` — first article
- `D:\My Data\Vibagen\content-sections\section-tooltip-glossary.txt` — tooltip definitions

## Contact
- Email destination: akkraphol@gmail.com
- Resend API key: set as RESEND_API_KEY env var in Cloudflare Pages

## Environment Variables
```
RESEND_API_KEY=re_xxxxx
NEXT_PUBLIC_SITE_URL=https://vibagen.com
NEXT_PUBLIC_CF_ANALYTICS_TOKEN=xxxxx
```
