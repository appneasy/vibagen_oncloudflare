# VIBAGEN Website — Session Notes

> สรุปความคืบหน้าจาก Claude Code sessions เพื่อให้ทีมอ่านเข้าใจสถานะปัจจุบัน
> Last updated: 2026-05-12

---

## Current Status

| ส่วน | สถานะ | หมายเหตุ |
|------|--------|----------|
| Homepage (all sections) | Done | 10 sections ครบ |
| Navbar | Done | V icon + HTML text, Prosto + Inter fonts |
| Footer | Done | logosquare.png + orange accent line |
| Article page | Done | Navy header + light content zone |
| Contact form → Telegram | Done | ส่งเข้า Telegram group แทน Resend |
| D1 Database | Done | สร้างแล้ว + migration เรียบร้อย |
| Cloudflare Pages Deploy | In Progress | Git connected, แก้ NODE_VERSION=20 แล้ว retry |
| Custom domain (vibagen.com) | Not started | ต้องตั้งหลัง deploy สำเร็จ |
| SEO (sitemap, robots, OG) | Done | มีอยู่แล้วจาก phase ก่อน |

---

## สิ่งที่ทำในวันนี้ (2026-05-12)

### 1. Navbar Logo + Background
- เปลี่ยนจาก `banner-logo.png` → `vlogo.png` (V icon) + HTML text
  - "VIBAGEN" → font Prosto One, สีขาว
  - "Crafting ideas into real products" → font Inter (แทน Neue Montreal ที่เป็น commercial font), สี white/60
- Navbar background เข้มขึ้น: `#0d2749` (ทั้ง scrolled และ non-scrolled)
- Mobile menu bg: `#0d2749/98`
- **Files:** `components/sections/Navbar.tsx`, `app/layout.tsx`

### 2. Font System
- เพิ่ม **Inter** (Google Fonts) เป็น `--font-inter` CSS variable
- ใช้แทน Neue Montreal สำหรับ tagline (ใกล้เคียงมากสุดในตัวฟรี)
- Brand spec fonts:
  - VIBAGEN → Prosto One (มีแล้ว)
  - Tagline → Neue Montreal → ใช้ Inter แทน
  - Small caps tagline → Plate Gothic Two Four → ยังไม่ได้ใช้
- **Files:** `app/layout.tsx`, `app/globals.css`

### 3. Article Page Readability
- แยกหน้าบทความเป็น 2 zones:
  - **Hero zone** (navy #011937): title, category, author, date
  - **Content zone** (off-white #fafaf9): เนื้อหา + CTA
- Gradient transition 80px ระหว่าง 2 zones
- Text colors เปลี่ยนจากขาวเป็นเข้ม (#2d3748) สำหรับ content zone
- Headings: navy (#0d2749), H3: orange (#ff6c01)
- **Files:** `app/knowledge/[slug]/page.tsx`

### 4. Contact Form → Telegram Bot
- แทนที่ **Resend email** ด้วย **Telegram Bot API**
- Bot token: `8592027763:AAEgM9W6_OfPBkqrmVVs8_56aXzyUZ8TLCQ`
- Chat ID: `-5002677677` (Vibagen Group)
- ทดสอบ local แล้ว — ส่งเข้า group สำเร็จ
- D1 save ยังทำงานบน Cloudflare (skip ใน local dev)
- Env vars: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`
- **Files:** `app/api/contact/route.ts`, `.env.local` (local dev only)

### 5. Dotted Background Pattern
- สร้าง CSS class `.bg-dots` — halftone dot pattern
- พื้น light blue-gray (#e8ecf2) + จุดขาวกระจาย
- จุดเข้มที่มุมขวาล่าง จางไปที่ซ้ายบน (mask-image gradient)
- CSS-only: radial-gradient + mask-image, ไม่มี image file
- ทดลองกับ WhyVibagen section — ใช้ได้ดี
- สามารถ apply กับ section อื่นได้โดยเพิ่ม className `bg-dots`
- **Files:** `app/globals.css`, `components/sections/WhyVibagen.tsx`

### 6. Cloudflare Pages Deployment
- D1 database `vibagen-db` สร้างแล้ว (region: APAC/SIN)
- Database ID: `8e46686e-0c24-456f-baca-024b6218897a`
- Migration 0001_init.sql รันแล้ว (2 tables: article_views, contacts)
- Pages project สร้างผ่าน Dashboard + GitHub integration
- Build command: `npx @cloudflare/next-on-pages`
- Build output: `.vercel/output/static`
- **ปัญหาที่เจอ:** Next.js 16 ต้อง Node >= 20, ตั้ง `NODE_VERSION=20`
- **TODO หลัง deploy สำเร็จ:**
  - ตั้ง D1 binding ใน Pages Settings → Functions → `DB` → `vibagen-db`
  - ตั้ง custom domain vibagen.com
- **Files:** `wrangler.toml`, `env.d.ts`

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
NODE_VERSION       = 20
```

### Cloudflare Pages (Dashboard → Settings → Functions → Bindings)
```
D1 Database: DB → vibagen-db
```

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

## Git Commits (ล่าสุด → เก่าสุด)

```
20c16be Update env types and wrangler config for Cloudflare deploy
940d2a7 Add dotted background pattern to WhyVibagen section
4b1fdb0 Fix contact API for local dev: optional D1, process.env fallback
20b1d8e Replace Resend email with Telegram Bot for contact notifications
00fcf2f Improve article page readability: light bg for content zone
6cbd564 Add Inter font for tagline (Neue Montreal alternative)
49032c5 Darken navbar bg and replace logo PNG with V icon + HTML text
066765f Adjust logo visibility per reference: logosquare in footer, brighter navbar
41e9327 Fix Hero text visibility, reduce padding, clean up footer
50c5626 Fix CSS shorthand overriding Tailwind utilities
51b8736 Theme overhaul: white content sections, navy navbar with fade
```

---

## Known Issues / TODO

- [ ] Cloudflare Pages deploy — รอ build สำเร็จหลังแก้ NODE_VERSION=20
- [ ] ตั้ง D1 binding หลัง deploy สำเร็จ
- [ ] ตั้ง custom domain vibagen.com
- [ ] พิจารณา migrate จาก `@cloudflare/next-on-pages` (deprecated) ไป OpenNext adapter
- [ ] Neue Montreal / Plate Gothic Two Four — ถ้าต้องการ font ตรง brand spec ต้องซื้อ license
- [ ] Apply `.bg-dots` background กับ section อื่นถ้าต้องการ
- [ ] ลบ `resend` package จาก dependencies (ไม่ได้ใช้แล้ว)
