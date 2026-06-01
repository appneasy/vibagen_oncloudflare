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

## Published Articles (content/articles/)

| # | Slug | Category | Date | Featured | Notes |
|---|------|----------|------|----------|-------|
| 1 | real-barrier-agentic-ai-is-not-technology | Agentic AI | 2026-05-07 | Yes | อุปสรรคจริงของ Agentic AI ไม่ใช่เทคโนโลยี |
| 2 | from-appsheet-to-real-app | Case Study | 2026-05-10 | Yes | เคสย้ายจาก AppSheet → real app |
| 3 | nocode-to-ai-assisted-development | Business Digital | 2026-05-12 | Yes | จาก No-Code สู่ AI-Assisted Development |
| 4 | cloudflare-free-infrastructure-for-sme | Infrastructure | 2026-05-20 | Yes | Cloudflare free tier สำหรับ SME |
| 5 | vibecoding-explained | Vibecoding | 2026-05-22 | No | Vibecoding คืออะไร |
| 6 | mdx-static-site-cloudflare-pipeline | Infrastructure | 2026-05-23 | No | MDX + Static Site + Cloudflare Pipeline |
| 7 | docker-vps-for-sme | Infrastructure | 2026-06-09 | Yes | Docker+VPS สำหรับ SME, vibecoding angle สอดแทรกทั่วบทความ |

### Article Writing Style Guide
- โทนคุยเหมือนเล่าให้เพื่อนฟัง — ใช้ "ผม", เล่าจากประสบการณ์จริง
- Vibecoding angle: สอดแทรกว่า config/script ต่างๆ ถูก vibecoding มา (ไม่ใช่เขียนเองจากศูนย์)
- Key message: ทักษะจริงคือเข้าใจ architecture ไม่ใช่จำ syntax
- ไม่ระบุราคาตรงๆ — ใช้คำกว้างๆ เช่น "ไม่กี่ร้อยบาท"
- ลิงก์กลับบทความก่อนหน้าเมื่อเกี่ยวข้อง (cross-reference)

## Contact
- Email destination: akkraphol@gmail.com
- Resend API key: set as RESEND_API_KEY env var in Cloudflare Pages

## SEO Keyword Strategy (Updated 2026-05-16)

Keywords expanded to cover actual Thai search terms found via competitor research.

### AutoCar Care pages — target keywords
- Primary: `โปรแกรมอู่ซ่อมรถ`, `โปรแกรมคาร์แคร์`, `โปรแกรมร้านล้างรถ`, `โปรแกรมบริหารอู่ซ่อมรถ`
- Secondary: `แอพอู่ซ่อมรถ`, `โปรแกรมศูนย์บริการรถยนต์`, `โปรแกรมร้านยาง`, `garage management system`
- Feature terms: `ระบบจองคิวซ่อมรถ`, `ระบบติดตามงานซ่อม`, `ระบบสต็อกอะไหล่`, `ระบบ CRM อู่ซ่อมรถ`, `ระบบสะสมแต้มร้านล้างรถ`, `ระบบนัดหมายอู่ซ่อมรถ`
- Price/compare: `โปรแกรมอู่ซ่อมรถ ราคา`, `โปรแกรมอู่ ราคาเท่าไหร่`, `ระบบอู่ซ่อมรถ เปรียบเทียบ`
- Tutorial: `วิธีใช้โปรแกรมอู่ซ่อมรถ`, `สอนใช้ระบบคาร์แคร์`

### VIBAGEN Services pages — target keywords
- Primary: `รับเขียนโปรแกรม`, `รับทำระบบ`, `รับพัฒนาซอฟต์แวร์`, `จ้างเขียนโปรแกรม`
- Secondary: `รับทำแอพ`, `รับทำ LINE LIFF`, `ระบบหลังบ้าน`, `custom software ไทย`
- Hire-us: `ปรึกษาทำระบบ`, `รับทำเว็บแอพ`, `จ้างทำระบบ SME`, `ระบบภายในองค์กร`
- Expertise: `รับทำระบบ ERP`, `back office system`, `ระบบจัดการภายใน`
- Showcase: `ระบบโรงงาน`, `ระบบจัดการโรงงาน`, `ย้ายระบบ nocode`

### Competitors (AutoCar Care segment)
- Ursa (ursashop.com) — โปรแกรมร้านยาง คาร์แคร์ cloud
- CKBOSS (ckboss.app) — ระบบอู่ซ่อมรถ ครบวงจร
- Accusoft (accusoft.co.th) — โปรแกรมอู่รถยนต์ SME
- GarageBox (garagebox.io) — garage management Thailand
- Aristo (aristosoft.org) — โปรแกรมร้านคาร์แคร์ ล้างรถ
- PKT Soft (pktsoft.com) — โปรแกรมอู่ซ่อมสีตัวถัง 20+ ปี

### Google Search Console
- Verification file: `public/googlee678bec7b81dd546.html`
- Sitemap URL: `https://vibagen.com/sitemap.xml`
- Total indexed URLs: 16 static + dynamic articles

---

## Admin Panel

### Architecture
- Auth: cookie-based HMAC-SHA256 token (30-day expiry), password in `wrangler.toml` [vars] `ADMIN_PASSWORD`
- Layout: `app/admin/layout.tsx` — auth check → login form or sidebar+main layout
- All admin pages use **inline styles only** (no Tailwind), responsive via `<style>` media queries + CSS classes
- Responsive pattern: desktop table (`admin-table-desktop`) + mobile card stack (`admin-card-mobile`), hidden/shown at 768px breakpoint
- Main padding: `32px 24px` desktop, `16px` mobile (`admin-main` class)

### Auth Files
- `lib/admin-auth.ts` — `createAdminToken()`, `verifyAdminToken()`, COOKIE_NAME, COOKIE_MAX_AGE
- `app/api/admin/auth/route.ts` — POST login, DELETE logout (fallback `process.env.ADMIN_PASSWORD` for local dev)
- `middleware.ts` — blocks `/api/admin/*` (except `/api/admin/auth`) without cookie

### Admin Pages
| Page | Path | Description |
|------|------|-------------|
| Dashboard | `/admin/dashboard` | Stat cards (customers, uptime, backup alerts) + CustomerCardGrid with monitor modals |
| Customers | `/admin/customers` | List (table desktop / card mobile) + add/edit/delete |
| Customer Detail | `/admin/customers/[slug]` | Info card + Subscriptions + Contracts + Apps + action buttons |
| Backups | `/admin/backups` | Card grid with folder breakdown (config/db/upload) |
| Backup Detail | `/admin/backups/[slug]` | BackupFolderView (expandable folders, file table/cards) |
| Uptime | `/admin/uptime` | Monitor list + summary cards (online/offline/paused) |
| Monitor Detail | `/admin/uptime/[id]` | Stats grid + recent checks + incidents tables |

### D1 Tables (Admin)
| Table | Purpose | Migration |
|-------|---------|-----------|
| `managed_customers` | Customer info (name, slug, subdomain, VPS, R2, LINE OA) | 0002 |
| `uptime_monitors` | URL monitors with check intervals | 0003 |
| `uptime_checks` | Raw check results (status, response time) | 0003 |
| `uptime_incidents` | Downtime incidents with duration | 0003 |
| `uptime_maintenance` | Planned maintenance windows | 0003 |
| `customer_subscriptions` | Provider subscriptions (Cloudflare/Hetzner), plan, price, due dates | 0004 |
| `customer_contracts` | เอกสาร (สัญญา/ใบเสนอราคา/invoice/requirement), R2 file refs, status | 0005 |
| `customer_apps` | App ที่ลูกค้าซื้อ (POS/CRM/LIFF/website), version, deploy URL, tech stack | 0006 |

### API Routes
| Route | Methods | Description |
|-------|---------|-------------|
| `/api/admin/auth` | POST, DELETE | Login/logout |
| `/api/admin/customers` | GET, POST | List/create customers |
| `/api/admin/customers/[slug]` | GET, PUT, DELETE | Single customer CRUD |
| `/api/admin/monitors` | GET, POST | List/create monitors |
| `/api/admin/monitors/[id]` | GET, PUT, DELETE | Single monitor CRUD |
| `/api/admin/subscriptions` | GET, POST | List (filter by `?customerSlug=`), create |
| `/api/admin/subscriptions/[id]` | GET, PUT, DELETE | Single subscription CRUD |
| `/api/admin/contracts` | GET, POST | List (filter by `?customerSlug=`), create |
| `/api/admin/contracts/[id]` | GET, PUT, DELETE | Single contract CRUD |
| `/api/admin/apps` | GET, POST | List (filter by `?customerSlug=`), create |
| `/api/admin/apps/[id]` | GET, PUT, DELETE | Single app CRUD |

### Key Components
| Component | Type | Description |
|-----------|------|-------------|
| `AdminSidebar` | client | Sidebar nav, logo-banner, logout, mobile hamburger |
| `AdminLoginForm` | client | Password login form with logo-banner |
| `CustomerForm` | client | Add/edit customer form |
| `MonitorForm` | client | Add/edit uptime monitor form |
| `CustomerCardGrid` | client | Dashboard customer cards with monitor detail modals + response time chart |
| `ResponseTimeChart` | client | SVG sparkline chart for response times |
| `BackupFolderView` | client | Expandable folder sections (config/db/upload) with file list (table desktop, cards mobile) |
| `SubscriptionSection` | client | Subscription CRUD — card list + add/edit modal, due date color alerts |
| `ContractSection` | client | Contract CRUD — card list + add/edit modal, type badges, R2 file refs |
| `AppSection` | client | App CRUD — card list + add/edit modal, deploy URL links, version/tech stack |
| `DeleteCustomerButton` | client | Confirm-delete button for customer |

### Backup System
- R2 storage via `aws4fetch` (S3-compatible API) — `lib/r2.ts`
- Files grouped by folder prefix: `config/`, `db/`, `upload/`, `other`
- `getGroupedBucketStatus()` / `getMultiBucketGroupedStatus()` for parallel folder-grouped status
- Backup list page: card grid with folder breakdown dots + last backup + status badge
- Backup detail page: `BackupFolderView` client component — expandable sections, db folder default expanded
- Backup alerts on dashboard: counts customers with no backup in 24h

### Uptime Monitor System
- Cloudflare Worker (`workers/uptime-checker/`) pings URLs at intervals
- Results stored in `uptime_checks` table, incidents auto-created on status change
- Dashboard: `CustomerCardGrid` with per-customer monitor cards, click to open detail modal with uptime %, streak, response time chart
- Uptime page: summary cards (total/online/offline/paused) + monitor table/cards
- Monitor detail: stats grid (uptime 24h/7d/30d), recent checks table, incidents table
- Telegram alerts via bot token on down/up status changes

### Planned Features
| Feature | Description | Priority |
|---------|-------------|----------|
| Dashboard due-soon alert | Subscription ใกล้ครบกำหนด 7 วัน แสดงบน dashboard | High |
| Contract file upload | Upload PDF/doc ไป R2 bucket `contracts/` folder จาก ContractSection | Medium |
| Customer summary view | แสดงจำนวน subscriptions/contracts/apps บน customer list page | Low |

---

## Environment Variables
```
RESEND_API_KEY=re_xxxxx
NEXT_PUBLIC_SITE_URL=https://vibagen.com
NEXT_PUBLIC_CF_ANALYTICS_TOKEN=xxxxx
ADMIN_PASSWORD=vibagen@2026  # in wrangler.toml [vars] + .env.local for local dev
```
