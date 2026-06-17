# VIBAGEN Website — Session Notes

> สรุปความคืบหน้าจาก Claude Code sessions เพื่อให้ทีมอ่านเข้าใจสถานะปัจจุบัน
> Last updated: 2026-06-17

---

## Current Status

| ส่วน | สถานะ | หมายเหตุ |
|------|--------|----------|
| Homepage (all sections) | Done | 10 sections ครบ |
| Navbar | Done | V icon + HTML text, 6 links (บริการ/ผลงาน/ความเชี่ยวชาญ/Knowledge Hub/AI Lab) |
| Footer | Done | logosquare.png + orange accent line + FB icon |
| Knowledge Hub (articles) | Done | 11 บทความ, SSG + client-side category filter |
| Contact form → Telegram | Done | ส่งเข้า Telegram group, ทำงานบน Cloudflare |
| D1 Database | Done | 7 migrations (articles → customers → uptime → subscriptions → contracts → apps → contract files) |
| Cloudflare Pages Deploy | Done | vibagen.com live, auto-deploy on push |
| SEO | Done | sitemap, robots, OG, canonical, keywords, Google Search Console verified |
| AutoCar Care product pages | Done | /autocar, /autocar/features, /autocar/faq, /autocar/tutorial |
| Showcase + Case Studies | Done | Smart Factory, TMK Migration, AutoCar Care |
| Expertise page | Done | Domain Expertise + Technical Expertise |
| Admin Panel | Done | Dashboard, Customers, Backups, Uptime, Subscriptions, Contracts, Apps |
| Uptime Monitor (Worker) | Done | Cron worker + D1 checks + Telegram alerts |
| Privacy Policy | Done | /privacy-policy (Facebook App compliance) |
| Tracking param strip | Done | middleware 301 redirect ลบ fbclid, utm_* |
| AI Lab | **WIP** | files สร้างแล้ว (untracked), 2 content pieces (P1 + P2), ยังไม่ commit |

---

## Published Articles (11 บทความ)

| # | Slug | Category | Date |
|---|------|----------|------|
| 1 | real-barrier-agentic-ai-is-not-technology | Agentic AI | 2026-05-07 |
| 2 | from-appsheet-to-real-app | Case Study | 2026-05-10 |
| 3 | nocode-to-ai-assisted-development | Business Digital | 2026-05-12 |
| 4 | cloudflare-free-infrastructure-for-sme | Infrastructure | 2026-05-20 |
| 5 | vibecoding-explained | Vibecoding | 2026-05-22 |
| 6 | mdx-static-site-cloudflare-pipeline | Infrastructure | 2026-05-23 |
| 7 | docker-vps-for-sme | Infrastructure | 2026-06-09 |
| 8 | docker-build-cache-vps-crash | Infrastructure | ~2026-06-09 |
| 9 | line-oa-free-messaging | LINE OA | ~2026-06-12 |
| 10 | vibecoding-line-integration | Vibecoding | ~2026-06-12 |
| 11 | maintenance-system-evolution | Case Study | ~2026-06-15 |

---

## Admin Panel

### Architecture
- Auth: cookie-based HMAC-SHA256 token (30-day expiry)
- Layout: inline styles only (no Tailwind), responsive desktop table + mobile card stack at 768px
- D1 tables: `managed_customers`, `uptime_monitors`, `uptime_checks`, `uptime_incidents`, `uptime_maintenance`, `customer_subscriptions`, `customer_contracts`, `customer_apps`

### Pages
| Page | Path | Description |
|------|------|-------------|
| Dashboard | `/admin/dashboard` | Stat cards + CustomerCardGrid with monitor modals |
| Customers | `/admin/customers` | List + add/edit/delete |
| Customer Detail | `/admin/customers/[slug]` | Info + Subscriptions + Contracts + Apps sections |
| Backups | `/admin/backups` | R2 card grid with folder breakdown |
| Backup Detail | `/admin/backups/[slug]` | BackupFolderView (expandable folders, file list) |
| Uptime | `/admin/uptime` | Monitor list + summary cards |
| Monitor Detail | `/admin/uptime/[id]` | Stats grid + recent checks + incidents |

### API Routes
`/api/admin/auth`, `/api/admin/customers`, `/api/admin/monitors`, `/api/admin/subscriptions`, `/api/admin/contracts`, `/api/admin/contracts/[id]/files`, `/api/admin/apps`

### Uptime Worker
- `workers/uptime-checker/` — Cloudflare Worker cron
- Pings URLs at intervals, stores in D1, auto-creates incidents
- Telegram alerts on status change (down/up)

---

## AutoCar Care Product Pages

| Page | Path | Description |
|------|------|-------------|
| Landing | `/autocar` | Product overview |
| Features | `/autocar/features` | Feature list with LINE Notify |
| FAQ | `/autocar/faq` | Server component + SEO |
| Tutorial | `/autocar/tutorial` | 12 topics, step-by-step walkthrough |

- Middleware handles subdomain routing
- Pages use iframe embed with fullscreen toggle

---

## AI Lab (WIP — ยังไม่ commit)

### สถานะปัจจุบัน
- **Untracked files**: `app/lab/`, `components/lab/`, `content/lab/`, `lib/lab.ts`, `public/lab/`
- **Navbar**: AI Lab link เพิ่มแล้ว (modified, unstaged)
- **CLAUDE.md**: updated with Lab spec (modified, unstaged)

### Files สร้างแล้ว
```
app/lab/
  page.tsx                    # List page + intro
  [slug]/page.tsx             # Single lab note renderer

components/lab/
  InsightCard.tsx             # Numbered insight cards
  LabContent.tsx              # Content renderer
  LessonBox.tsx               # Lesson/takeaway box
  PatternBadge.tsx            # P1/P2 badge
  PromptBox.tsx               # Copy-ready prompt + copy button
  StackWizard.tsx             # Interactive stack decision tool

content/lab/
  p1-stack-decision.mdx       # P1: Decode → Deploy (NewScale stack)
  p2-pdm-field-note.mdx       # P2: Engineer's Field Note (PdM Dashboard)

lib/lab.ts                    # Lab content loader
public/lab/                   # Lab static assets
```

### สิ่งที่ยังเหลือ
- [ ] Review UI + impeccable lint
- [ ] เพิ่มใน sitemap.ts
- [ ] Metadata + JSON-LD
- [ ] ทดสอบ responsive
- [ ] Commit + deploy

---

## Timeline Summary (2026-05-13 → 2026-06-17)

### 2026-05-14 ~ 05-16 — SEO + AutoCar + Showcase
- Google Search Console verification
- SEO keywords ขยายทุกหน้า (Thai search terms)
- AutoCar Care product pages (/autocar, features, faq, tutorial)
- Smart Factory + TMK Migration case study pages
- Expertise page rebuild (Domain + Technical)
- Services page rewrite + founder statement

### 2026-05-20 ~ 05-23 — Articles batch
- Article 4: Cloudflare free infra for SME
- Article 5: Vibecoding explained
- Article 6: MDX + Static Site + Cloudflare Pipeline
- Footer: เพิ่ม Facebook icon

### 2026-05-24 ~ 06-01 — Admin Panel (Phase 1-4)
- Phase 1: Backup monitor + customer management foundation (R2 via aws4fetch)
- Phase 2: Customer CRUD UI (list, create, detail, edit, delete)
- Phase 3: Uptime monitor (D1 schema + cron Worker + admin UI + Telegram alerts)
- Phase 4: Dashboard redesign (card layout, monitor popup modal, response time chart)
- Backup pages redesign (card grid + folder-based BackupFolderView)
- Admin auth: cookie-based HMAC-SHA256

### 2026-06-01 ~ 06-08 — Admin Panel (Phase 5-7) + Articles
- Customer subscriptions (schema, API, UI section)
- Customer contracts + file attachments (upload/compress/download to R2)
- Customer apps (schema, API, UI)
- Contract datatable with expand rows
- Dashboard due-soon alerts + Telegram notify
- Article 7: Docker+VPS for SME
- Article 8: Docker build cache VPS crash

### 2026-06-09 ~ 06-15 — Articles + Misc
- Article 9: LINE OA free messaging
- Article 10: Vibecoding LINE integration
- Article 11: Maintenance system evolution (timeline chart)
- Downloadable prompt sheet
- Privacy policy page (Facebook compliance)
- Tracking param strip middleware (fbclid, utm_*)

### 2026-06-15 ~ 06-17 — AI Lab (WIP)
- Lab architecture + content spec ใน CLAUDE.md
- Lab components: PromptBox, InsightCard, LessonBox, PatternBadge, StackWizard
- Lab content: P1 (Stack Decision) + P2 (PdM Field Note) as MDX
- Lab list page + [slug] renderer (dark theme)
- Navbar: เพิ่ม AI Lab link

---

## D1 Migrations

| # | File | Tables |
|---|------|--------|
| 0001 | init.sql | `article_views`, `contacts` |
| 0002 | managed_customers.sql | `managed_customers` |
| 0003 | uptime_tables.sql | `uptime_monitors`, `uptime_checks`, `uptime_incidents`, `uptime_maintenance` |
| 0004 | customer_subscriptions.sql | `customer_subscriptions` |
| 0005 | customer_contracts.sql | `customer_contracts` |
| 0006 | customer_apps.sql | `customer_apps` |
| 0007 | contract_files.sql | (contract file attachments) |

---

## Environment Variables

### Local Dev (`.env.local`)
```
TELEGRAM_BOT_TOKEN=<bot-token>
TELEGRAM_CHAT_ID=<chat-id>
ADMIN_PASSWORD=vibagen@2026
```

### Cloudflare Pages (Dashboard → Settings → Environment variables)
```
TELEGRAM_BOT_TOKEN
TELEGRAM_CHAT_ID
ADMIN_TELEGRAM_CHAT_ID
NODE_VERSION = 22
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
- [ ] ลบ `resend` package จาก dependencies (ไม่ได้ใช้แล้ว)
- [ ] AI Lab — review, lint, sitemap, commit, deploy
- [ ] Dashboard due-soon alert ปรับปรุง (subscription ใกล้ครบ 7 วัน)
- [ ] Contract file upload จาก UI โดยตรง (ปัจจุบันใช้ R2 path reference)
