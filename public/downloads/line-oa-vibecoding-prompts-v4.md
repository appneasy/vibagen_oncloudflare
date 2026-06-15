# LINE OA Vibecoding — v4
Stack: Next.js 15 + Prisma + PostgreSQL
⚠ Global rules: secrets=env only | all URLs=HTTPS | no raw errors to user | log every LINE API call+status | test Android+iOS | idempotency on webhook+push

---

## ENV required
```
LINE_LOGIN_CHANNEL_ID / LINE_LOGIN_CHANNEL_SECRET   ← Login Channel
LINE_MESSAGING_CHANNEL_SECRET / LINE_CHANNEL_ACCESS_TOKEN  ← Messaging Channel
NEXT_PUBLIC_LIFF_ID   ← client-side only
LINE_ADMIN_USER_ID / NEXTAUTH_SECRET / DATABASE_URL
```
⚠ 2 Channels ใต้ Provider เดียว — token คนละชุด ห้ามปนกัน

---

## P1 — Auth

**FLOW 1 · LIFF auto-login**
```
liff.init({ liffId }) → isLoggedIn() → getProfile() → ส่ง idToken → backend
POST api.line.me/oauth2/v2.1/verify { id_token, client_id } → สร้าง session
```

**FLOW 2 · LINE OAuth (browser)**
```
1. gen state (16B base64url) → เก็บใน HttpOnly signed cookie TTL=10m
   gen code_verifier (43-128c) → code_challenge = SHA256(verifier) base64url

2. redirect → access.line.me/oauth2/v2.1/authorize
   ?response_type=code&client_id&redirect_uri&scope=profile%20openid
   &state&code_challenge&code_challenge_method=S256

3. callback GET /api/auth/line/callback:
   ⚠ verify state vs cookie → ไม่ตรง = return 400 ทันที (CSRF)
   POST /oauth2/v2.1/token { grant_type,code,redirect_uri,client_id,client_secret,code_verifier }
   GET /v2/profile Bearer → userId → สร้าง session → clear state cookie (single-use)
```
Session: `{ userId, displayName, pictureUrl, role }` — HttpOnly + Secure + SameSite=Lax
ห้ามเก็บ access_token ใน cookie

---

## P2 — LIFF Utility

⚠ LIFF size (Full/Tall/Compact) กำหนดใน Console เท่านั้น — liff.init() รับแค่ { liffId }
⚠ liffId ต้องตรง domain ที่ register — คนละ domain = fail ทันที

```
initLiff()               liff.init({liffId}) + isInitialized() guard (no double-init)
getProfile()             check isInClient()&&isLoggedIn() → null+warn if not; login() if not logged
sendMessages(msgs)       ⚠ isInClient() first → return false+"กรุณาเปิดผ่าน LINE app" if not; no throw
shareTargetPicker(msgs)  isInClient() first → fallback msg; cancel = false (not error)
closeWindow()            isInClient() first → redirect home if not

LiffProfile shape: { userId, displayName, pictureUrl, statusMessage? }
```

---

## P3 — Rich Menu

⚠ ลำดับ: create → upload → alias → set-default → link (ผิดลำดับ = reject)
⚠ Image: JPEG only (PNG = silent reject) | full=2500×1686 | half=2500×843 | ≤1MB | Content-Type: image/jpeg
⚠ bounds: ห้าม overlap — x+width ปุ่มหนึ่งต้องไม่ทับ x ปุ่มถัดไป

```json
{ "size":{"width":2500,"height":1686}, "selected":false, "name":"menu_customer_v1",
  "chatBarText":"เมนูหลัก",
  "areas":[{ "bounds":{"x":0,"y":0,"width":833,"height":843},
             "action":{"type":"postback","label":"จองบริการ","data":"action=booking"} }] }
```
actions: postback | uri(HTTPS) | message

```
POST   /v2/bot/richmenu                         → create (→richMenuId)
POST   api-data.../v2/bot/richmenu/{id}/content → upload image
POST   /v2/bot/richmenu/alias                   → create alias
POST   /v2/bot/user/all/richmenu                → set default
POST   /v2/bot/richmenu/bulk/link               → bulk link
DELETE /v2/bot/user/{userId}/richmenu           → unlink (ทำก่อน relink เสมอ)
Header: Authorization: Bearer {LINE_CHANNEL_ACCESS_TOKEN}
```

---

## P4 — Flex Message

⚠ ≤50KB/msg (silent reject) | image=HTTPS ≤1MB | no custom font
⚠ line-height enum ONLY: none|xs|sm|md|lg|xl|xxl — ห้ามใช้ px (iOS silent fail)
⚠ font size enum: xxs|xs|sm|md|lg|xl|xxl|3xl|4xl|5xl
⚠ altText ต้องมีความหมาย — ห้ามใช้ "Flex Message"

```
buildBookingConfirmFlex({ bookingId, date, time, service, customerName, carPlate })
  altText: "ยืนยันจอง ${date} ${time} — ${service}"

buildServiceStatusFlex({ jobId, status, estimatedDone, technicianName, items })
  altText: "อัปเดตสถานะ: ${status} — ${jobId}"

buildCarReadyFlex({ customerName, carPlate, totalAmount, locationUrl })
  altText: "รถพร้อมรับ — ${carPlate} ยอดชำระ ${totalAmount} บาท"

buildCarouselFlex(items)  ≤12 bubbles | ตรวจ total size ไม่เกิน 50KB รวม
```
ทดสอบ: https://developers.line.biz/flex-simulator/

---

## P5 — Webhook

```
// Next.js route config — ต้องมีเสมอ
export const config = { api: { bodyParser: false } }
```

⚠ ลำดับบังคับ:
```
1. อ่าน raw body → Buffer
2. verify HMAC-SHA256 ทันที (ก่อนทำอะไรทั้งนั้น)
3. parse JSON
4. return 200 ทันที
5. business logic async หลัง return
```

```
// Signature verify
sig  = req.headers['x-line-signature']
hash = HMAC-SHA256(rawBody, LINE_MESSAGING_CHANNEL_SECRET).base64
if hash !== sig → return 401

// Idempotency — PostgreSQL แทน Redis
INSERT INTO webhook_events (id, processed_at)
VALUES (event.webhookEventId, NOW())
ON CONFLICT (id) DO NOTHING
→ affected rows = 0 → skip (dup event)
```

Events: message(text/image/sticker) | postback | follow→role+menu | unfollow→DB | join | memberJoined/Left
replyToken: ~30s อายุ | ใช้ได้ครั้งเดียว | ≤5 msgs
Error: catch ทุก async | ห้าม unhandled throw | push notify LINE_ADMIN_USER_ID ถ้า critical

---

## P6 — Reply + Push

**Reply** (ฟรี)
```
POST /v2/bot/message/reply { replyToken, messages[≤5] }
ห้าม retry (token expired) | log token[0:8] เท่านั้น
```

**Push** (นับ quota)
```
single: POST /v2/bot/message/push      { to: userId, messages }
batch:  POST /v2/bot/message/multicast { to: userId[≤500], messages }
⚠ ห้าม loop push เดี่ยว → ใช้ multicast เสมอสำหรับหลายคน
```

Logging (บังคับ): push_logs(userId_hash, sentAt, messageType, status, quota_date)

Retry / dedup — PostgreSQL:
```
push_logs มี UNIQUE(userId, messageType, date)
INSERT ... ON CONFLICT DO NOTHING → affected=0 → skip (ห้าม double-send)
5xx → retry ≤3 ครั้ง backoff 1s/2s/4s
429 → sleep 60s แล้ว retry
bulk → for...of loop multicast 500/batch + await sleep(50ms) ต่อ batch
```

---

## P7 — Quick Reply

≤13 ปุ่ม | แนบที่ message.quickReply.items (ไม่ใช่ messages array)

| action | replyToken | notes |
|---|---|---|
| message / postback | ✓ ใหม่ | dialog ต่อฟรี |
| uri | ✗ | dialog จบ — ใช้แค่ขั้นตอนสุดท้าย |
| location / camera / cameraRoll | ✓ ใหม่ | |
| datetimepicker | ✓ ใหม่ | ⚠ mode=date\|time\|datetime เท่านั้น |
| richmenuswitch | — | ⚠ ใช้ richMenuAliasId ไม่ใช่ richMenuId; Messaging API v2 |
| clipboard | — | |

datetimepicker format: date="2026-06-15" | time="10:00" | datetime="2026-06-15T10:00"

```json
{ "type":"text","text":"เลือกบริการ",
  "quickReply":{"items":[
    {"type":"action","action":{"type":"postback","label":"เปลี่ยนถ่ายน้ำมัน","data":"service=oil","displayText":"เปลี่ยนถ่ายน้ำมัน"}},
    {"type":"action","action":{"type":"datetimepicker","label":"เลือกวันนัด","data":"action=date","mode":"datetime","initial":"2026-06-15T09:00","min":"2026-06-15T08:00","max":"2026-12-31T18:00"}}
  ]}}
```
Dialog state ยาว → PostgreSQL users.dialog_state (jsonb) TTL ตรวจด้วย updated_at

---

## P8 — Role-Based Menu

role→alias map (config ไม่ใช่ hardcode): customer→menu_customer | vip→menu_vip | admin→menu_admin
⚠ ห้าม link richMenuId โดยตรง — ต้องผ่าน alias เสมอ

```
linkRichMenu(userId, role):
  alias = ROLE_MENU_MAP[role]
  DELETE /v2/bot/user/{userId}/richmenu       → 404 = ignore (ยังไม่มี menu)
  POST   /v2/bot/user/{userId}/richmenu { richMenuAliasId: alias }
  UPDATE users SET rich_menu_alias=alias, rich_menu_linked_at=NOW() WHERE line_user_id=userId
```

Triggers: follow event | login callback (P1) | admin เปลี่ยน role → relink ทันที
Bulk: POST /v2/bot/richmenu/bulk/link { richMenuAliasId, userIds[≤500] } — batch เหมือน P6
Error: log + retry 1 ครั้ง + notify admin | failed → queue ใน DB retry รายชั่วโมง
Monitor: GET /api/admin/richmenu/status → count/role, last linked, failed count

---

## LINE API Base URLs
```
Messaging:  https://api.line.me/v2/bot/
Data:       https://api-data.line.me/v2/bot/
Login:      https://access.line.me/oauth2/v2.1/
Profile:    https://api.line.me/v2/profile
Verify:     https://api.line.me/oauth2/v2.1/verify
```
*v4 · Jun 2026 · no Redis · no TypeScript syntax*
