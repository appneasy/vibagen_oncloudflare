/**
 * Tech Stack Quiz — Retro → Modern Mapping
 * A fun, historically accurate quiz about technology evolution
 *
 * Features:
 * - Real historical tech that was actually used
 * - Witty Thai+English humor (polite, friendly tone)
 * - Accurate modern 2026 recommendations
 */

export interface TechStackMapping {
  id: string;
  category: string;
  categoryTh: string;
  categoryKeywords: string[];
  retro: {
    tech: string;
    joke: string;
  };
  modern: {
    stack: string[];
    reason: string;
  };
}

export interface WildcardResponse {
  pattern: string | RegExp;
  response: string;
  category: string;
}

export const techStackQuiz: TechStackMapping[] = [
  {
    id: "game",
    category: "Game Development",
    categoryTh: "พัฒนาเกมส์",
    categoryKeywords: ["game", "gaming", "เกมส์", "เกม", "unity", "unreal", "godot", "steam", "เกมมือถือ", "mobile game", "pc game", "เกมpc", "เกมออนไลน์", "rpg", "fps", "mmorpg"],
    retro: {
      tech: "Turbo Pascal + BGI Graphics (1980s–1990s)",
      joke: "Turbo Pascal กับ BGI — สมัยที่ 'กราฟิก' แปลว่าวาดเส้นทีละ pixel แล้วภูมิใจมาก 😄 compile ทีต้องปิดทุกโปรแกรมก่อน ไม่งั้น RAM ไม่พอ",
    },
    modern: {
      stack: ["Unreal Engine 5 (C++)", "Unity 6 (C#)", "Godot 4 (GDScript)", "Three.js (WebGL)"],
      reason: "ฟรี + cross-platform + physics/rendering ครบ + asset store ขนาดใหญ่ + community ช่วยได้ตลอด",
    },
  },
  {
    id: "ai",
    category: "AI / Machine Learning",
    categoryTh: "AI / ปัญญาประดิษฐ์",
    categoryKeywords: ["ai", "ml", "machine learning", "แชทบอท", "chatbot", "chatgpt", "claude", "gpt", "llm", "ปัญญาประดิษฐ์", "deep learning", "neural", "prompt", "โมเดล ai"],
    retro: {
      tech: "LISP / Prolog Expert Systems (1980s–1990s)",
      joke: "LISP กับ Prolog — เขียน rules แบบดึงฟัน ก่อนจะเห็น AI ตอบได้สักข้อ 😅 debug ต้องนั่งนับ parentheses: (((( ))))",
    },
    modern: {
      stack: ["Claude / GPT-4o API", "Hugging Face Transformers", "LangChain", "Vercel AI SDK"],
      reason: "LLM ใหญ่ = ไม่ต้องเขียน rules เอง → prompt engineering เท่านั้น + cloud API พร้อมใช้ทันที",
    },
  },
  {
    id: "ecommerce",
    category: "E-commerce / Online Store",
    categoryTh: "ร้านค้าออนไลน์",
    categoryKeywords: ["e-commerce", "ecommerce", "shop", "shopping", "ร้านค้า", "ขายของ", "ขายออนไลน์", "store", "ร้านค้าออนไลน์", "shopee", "lazada", "marketplace", "cart", "checkout", "payment"],
    retro: {
      tech: "Microsoft FrontPage + Microsoft Access (late 1990s)",
      joke: "FrontPage + Access — WYSIWYG ที่ generate HTML มั่วๆ + database ที่แล็คพอมี 20 คนเข้าพร้อมกัน 🤣",
    },
    modern: {
      stack: ["Shopify / WooCommerce", "Next.js + Stripe (headless)", "Medusa (self-hosted)", "BigCommerce API"],
      reason: "Payment gateway built-in + scalable + mobile-first + inventory + analytics พร้อมไม่ต้องทำเอง",
    },
  },
  {
    id: "mobile",
    category: "Mobile App",
    categoryTh: "แอปมือถือ",
    categoryKeywords: ["mobile", "app", "แอพ", "แอป", "android", "ios", "smartphone", "appstore", "play store", "react native", "flutter", "แอพพลิเคชัน", "แอปพลิเคชัน", "มือถือ"],
    retro: {
      tech: "J2ME + Symbian C++ (2000s)",
      joke: "J2ME บน Nokia — RAM มี 512 KB เปิดพร้อมกัน 2 app ก็ค้างแล้ว 😄 Symbian API ยุ่งจน nickname คือ 'Symbian ≠ Simpler'",
    },
    modern: {
      stack: ["React Native + Expo", "Flutter (Dart)", "Kotlin (Android native)", "Swift (iOS native)"],
      reason: "Code once deploy 2 platform + hot reload + native performance + App Store ready",
    },
  },
  {
    id: "website",
    category: "Website / Homepage",
    categoryTh: "เว็บไซต์",
    categoryKeywords: ["website", "homepage", "landing page", "web", "เว็บ", "เว็บไซต์", "หน้าเว็บ", "wordpress", "wix", "html", "css", "portfolio", "corporate", "บริษัท"],
    retro: {
      tech: "Dreamweaver + Perl CGI scripts (1990s–2000s)",
      joke: "Dreamweaver — ลาก drop สวย แต่พอดู source code table ซ้อน table 10 ชั้น 😭 Perl emit HTML string ยาวเป็นหน้า",
    },
    modern: {
      stack: ["Next.js 15 (React)", "Astro", "SvelteKit", "Hugo / 11ty (static)"],
      reason: "Server Components + SSR + edge runtime + built-in SEO + deploy ได้ภายในนาที",
    },
  },
  {
    id: "erp",
    category: "ERP / Accounting",
    categoryTh: "ระบบ ERP / บัญชี",
    categoryKeywords: ["erp", "accounting", "บัญชี", "ระบบบัญชี", "enterprise", "sap", "oracle", "inventory", "purchase", "finance", "การเงิน", "งบการเงิน", "ผลประกอบการ", "stock", "สต็อก"],
    retro: {
      tech: "Visual FoxPro + DBF files (1990s–2000s)",
      joke: "VFP + DBF ใน share folder — concurrent users ได้ 3–4 คนก่อนขัดข้อง 😅 ใครจะซื้อ SAP? consultant อีก 200 ชั่วโมงนะ",
    },
    modern: {
      stack: ["Odoo (open-source ERP)", "Xero / QuickBooks Online", "ERPNext / Frappe", "SAP S/4HANA Cloud"],
      reason: "Multi-user cloud + real-time sync + tax automation + API-first + ไม่ต้องดูแล server เอง",
    },
  },
  {
    id: "iot",
    category: "IoT / Robot / Hardware",
    categoryTh: "IoT / หุ่นยนต์ / ฮาร์ดแวร์",
    categoryKeywords: ["iot", "robot", "หุ่นยนต์", "arduino", "sensor", "embedded", "plc", "scada", "hardware", "raspberry pi", "esp32", "microcontroller", "ระบบอัตโนมัติ", "automation"],
    retro: {
      tech: "PLC Siemens S7 + SCADA + AVR Assembly (2000s)",
      joke: "PLC + SCADA — debug ต้องไปหน้าตู้ control ในโรงงาน นั่งกับจอ monochrome 🤖 AVR assembly? จำ register ไม่ไหวก็ print cheat sheet ติดโต๊ะ",
    },
    modern: {
      stack: ["Arduino + MicroPython", "Raspberry Pi 5 + Python", "ESP32 + ESPHome", "Tauri Embedded"],
      reason: "MicroPython = prototyping เร็ว + WiFi/BLE built-in + community ใหญ่ + hardware ถูก",
    },
  },
  {
    id: "chat",
    category: "Chat Bot / LINE Bot / Messaging",
    categoryTh: "แชทบอท / LINE Bot",
    categoryKeywords: ["chat", "messaging", "แชท", "messenger", "line", "telegram", "bot", "line bot", "notify", "line oa", "whatsapp", "discord", "slack bot", "ตอบข้อความอัตโนมัติ"],
    retro: {
      tech: "AIM Bot scripts (Visual Basic) / mIRC Scripts (late 1990s)",
      joke: "AIM Bot ใน VB6 — อ่านทีละ message แบบ sequential ช้าเหมือนเต่า 🐢 mIRC script code ยาว 5 หน้าจอยังหาตัวแปรไม่เจอ",
    },
    modern: {
      stack: ["LINE Bot SDK (Node.js / Python)", "Telegram Bot API", "Discord.js", "WhatsApp Business API"],
      reason: "Webhook + async + rich UI (buttons, cards, templates) + ฟรี tier + code base เดียวหลาย platform",
    },
  },
  {
    id: "desktop",
    category: "Desktop Windows App",
    categoryTh: "โปรแกรม Windows",
    categoryKeywords: ["desktop", "windows app", "โปรแกรม", "windows", "winforms", "vb", "vb6", "delphi", "exe", ".net", "c#", "c++", "ซอฟต์แวร์", "โปรแกรมเดสก์ท็อป", "pascal"],
    retro: {
      tech: "Visual Basic 6 + Windows API (1990s–2000s)",
      joke: "VB6 + Windows API — form design คลิกไปคลิกมา แล้วต้อง call SetWindowLong อีก 100 ครั้ง 😤 memory leak? 'ปิดแล้ว restart ก็ได้'",
    },
    modern: {
      stack: ["Tauri (Rust + Web UI)", "Electron (Node.js + Chromium)", ".NET MAUI (C#)", "WPF (C#)"],
      reason: "Tauri = binary เล็ก + native / Electron = ecosystem ใหญ่ + web dev ทำได้ทันที",
    },
  },
  {
    id: "dashboard",
    category: "Dashboard / Data Analytics",
    categoryTh: "แดชบอร์ด / วิเคราะห์ข้อมูล",
    categoryKeywords: ["dashboard", "analytics", "รายงาน", "report", "bi", "reporting", "data", "chart", "กราฟ", "visualization", "power bi", "tableau", "metabase", "สถิติ", "ข้อมูล"],
    retro: {
      tech: "Excel VBA Macros + Access Reports (1990s–2000s)",
      joke: "Excel VBA — 10,000 rows ก็เริ่มชา 🐌 พอ join table เยอะๆ ต้อง reboot เครื่องเพื่อ 'clear cache'",
    },
    modern: {
      stack: ["Metabase (open-source BI)", "Looker Studio (Google ฟรี)", "Tableau", "Superset (Apache)"],
      reason: "Real-time SQL + interactive charts + ไม่มี Excel formula hell + mobile-responsive + API embed",
    },
  },
  {
    id: "blockchain",
    category: "Blockchain / Crypto",
    categoryTh: "บล็อกเชน / คริปโต",
    categoryKeywords: ["blockchain", "crypto", "web3", "nft", "bitcoin", "ethereum", "smart contract", "defi", "token", "solana", "คริปโต", "บล็อกเชน", "เหรียญ"],
    retro: {
      tech: "ไม่มี — closest: PayPal API (2000s)",
      joke: "ก่อน blockchain — ต้องไว้ใจ PayPal/Visa 100% ว่าจะไม่ freeze account 😅 คำว่า 'decentralized' ยังไม่มีในพจนานุกรม",
    },
    modern: {
      stack: ["Solidity + Hardhat (Ethereum)", "Rust + Anchor (Solana)", "Move (Aptos/Sui)", "wagmi (Web3 React hooks)"],
      reason: "Smart contracts = trustless + transparent + immutable audit trail + เหมาะระบบที่ต้องการความน่าเชื่อถือสูง",
    },
  },
  {
    id: "video",
    category: "Video / Streaming",
    categoryTh: "วิดีโอ / ถ่ายทอดสด",
    categoryKeywords: ["video", "streaming", "ถ่ายทอดสด", "live", "broadcast", "youtube", "vod", "obs", "conference", "meeting", "webinar", "zoom", "วิดีโอ"],
    retro: {
      tech: "Flash Video (FLV) + Windows Media Server (2000s)",
      joke: "Flash Video — 'buffer' หมายถึงไปชงกาแฟรอก่อน ☕ Windows Media DRM? ผู้ใช้ต้องลบ cache ทั้งหมดก่อนดูได้",
    },
    modern: {
      stack: ["HLS / DASH (adaptive bitrate)", "FFmpeg (video encoding)", "Cloudflare Stream", "OBS Studio"],
      reason: "Adaptive bitrate = smooth ไม่ว่า bandwidth เท่าไหร่ + CDN ทั่วโลก + ไม่มี Flash nightmare",
    },
  },
  {
    id: "pos",
    category: "POS / Retail / Restaurant",
    categoryTh: "ระบบ POS / ร้านค้าปลีก / ร้านอาหาร",
    categoryKeywords: ["pos", "point of sale", "ร้านอาหาร", "ร้านกาแฟ", "retail", "cash register", "ร้านค้าปลีก", "cashier", "receipt", "ใบเสร็จ", "เครื่องคิดเงิน", "ร้านสะดวกซื้อ", "คาเฟ่", "cafe", "restaurant"],
    retro: {
      tech: "DOS-based Cash Register + Dot Matrix Printer (1990s)",
      joke: "POS สมัยก่อนจอเขียว DOS พิมพ์รหัสสินค้าเอง ถ้ากดผิดต้อง void ใหม่ทั้ง bill 😤 เครื่องปริ้นเสียงดังทั้งร้าน",
    },
    modern: {
      stack: ["Toast POS", "Square POS", "Loyverse (ฟรี)", "Clover"],
      reason: "Offline mode + sync cloud, inventory real-time ข้ามสาขา, customer loyalty built-in, split payment รองรับ",
    },
  },
  {
    id: "crm",
    category: "CRM / Sales Management",
    categoryTh: "CRM / ระบบจัดการลูกค้า",
    categoryKeywords: ["crm", "customer", "ระบบลูกค้า", "sales", "lead", "pipeline", "salesforce", "hubspot", "ฐานข้อมูลลูกค้า", "ลูกค้าสัมพันธ์", "การขาย", "โอกาสขาย"],
    retro: {
      tech: "Rolodex + Excel + Outlook Contacts (1990s–2000s)",
      joke: "CRM สมัยก่อนคือ Excel sheet + Outlook contacts — sales ลาออกไป ข้อมูลลูกค้าหายไปด้วย 😱 ไม่มีใครรู้ว่า deal ไปถึงไหน",
    },
    modern: {
      stack: ["HubSpot CRM (free tier)", "Salesforce", "Pipedrive", "Freshsales"],
      reason: "Sales forecast AI + email tracking อัตโนมัติ + lead scoring + pipeline visualization ชัดเจน",
    },
  },
  {
    id: "hr",
    category: "HR / Payroll / Attendance",
    categoryTh: "HR / เงินเดือน / ลาหยุด",
    categoryKeywords: ["hr", "human resources", "payroll", "เงินเดือน", "ทรัพยากรบุคคล", "attendance", "ลาหยุด", "ลางาน", "สลิปเงินเดือน", "ประเมินผล", "สแกนนิ้ว", "time attendance", "recruitment"],
    retro: {
      tech: "Punch Card Timeclock + Manual Payroll Ledger (1980s–1990s)",
      joke: "เงินเดือนสมัยก่อน HR นั่งคำนวณ Excel ทีละคน 300 คน ใช้ 2 วัน 😓 boss แก้ OT rate ทีก็ต้องคำนวณใหม่หมด",
    },
    modern: {
      stack: ["BambooHR", "Personio", "Paychex", "ADP Workforce Now"],
      reason: "Self-service portal + clock-in มือถือ + payroll 1 click คำนวณภาษีให้ + leave balance real-time",
    },
  },
  {
    id: "hotel",
    category: "Hotel / Booking / Reservation",
    categoryTh: "โรงแรม / จองห้องพัก",
    categoryKeywords: ["โรงแรม", "hotel", "booking", "reservation", "ห้องพัก", "จองห้อง", "resort", "hostel", "ที่พัก", "check-in", "hospitality", "guest", "ที่พักแรม"],
    retro: {
      tech: "Manual Reservation Book + Phone Only (1980s–1990s)",
      joke: "โรงแรมสมัยก่อนจองห้องด้วยสมุด — ลายมือไม่ชัดก็ overbooking 😅 ลูกค้ายกเลิกไม่ได้โทรมา ห้องว่างแต่ไม่รู้",
    },
    modern: {
      stack: ["Mews (cloud PMS)", "Cloudbeds", "Hotelogix", "Smoobu (small hotels)"],
      reason: "Mobile check-in + dynamic pricing AI + OTA sync อัตโนมัติ (Booking.com/Agoda) + housekeeping app real-time",
    },
  },
  {
    id: "logistics",
    category: "Logistics / Transport / Delivery",
    categoryTh: "ขนส่ง / Logistics / Delivery",
    categoryKeywords: ["logistics", "ขนส่ง", "transport", "fleet", "gps tracking", "delivery", "shipment", "tracking", "เส้นทาง", "รถบรรทุก", "จัดส่ง", "พัสดุ", "courier"],
    retro: {
      tech: "Paper Manifest + Walkie-Talkie + Garmin GPS (1990s–2000s)",
      joke: "คนขับรถสมัยก่อนถือแผนที่กระดาษ ไม่มี GPS 🗺️ dispatcher โทรบอก 'เลี้ยวซ้ายตรงสะพาน' — สะพานไหนไม่รู้",
    },
    modern: {
      stack: ["Grab Logistics", "Lalamove", "Routific (route optimization)", "Tookan"],
      reason: "GPS real-time + AI optimal route + customer แจ้ง ETA อัตโนมัติ + driver app offline-first",
    },
  },
  {
    id: "warehouse",
    category: "Warehouse / Inventory Management",
    categoryTh: "คลังสินค้า / WMS",
    categoryKeywords: ["warehouse", "wms", "คลังสินค้า", "inventory", "stock management", "สต็อก", "bin location", "pick pack", "barcode", "qr code", "รับของ", "ส่งของ", "โกดัง"],
    retro: {
      tech: "Clipboard + Hand Count + Excel VLOOKUP (1990s–2000s)",
      joke: "นับสต็อกสมัยก่อน ปิดคลัง 1 อาทิตย์ นับ 3 รอบ ได้ตัวเลข 3 แบบ 😩 เพราะกะกลางคืนเบิกของไปแต่ไม่บันทึก",
    },
    modern: {
      stack: ["Fishbowl Inventory", "Zoho Inventory", "Manhattan Associates", "Infor WMS"],
      reason: "Barcode scan + cycle counting ไม่ต้องปิดคลัง + FIFO/FEFO auto + แจ้งเตือน reorder point อัตโนมัติ",
    },
  },
  {
    id: "manufacturing",
    category: "Manufacturing / MES / Production",
    categoryTh: "โรงงาน / ระบบผลิต",
    categoryKeywords: ["manufacturing", "โรงงาน", "mes", "production", "factory", "ระบบผลิต", "quality control", "qc", "bom", "oee", "เครื่องจักร", "ไลน์ผลิต", "สายพาน", "machine"],
    retro: {
      tech: "Paper Work Order + Shopfloor Log Sheet (1980s–2000s)",
      joke: "โรงงานสมัยก่อน line down ต้องรอ supervisor เดินมาดู 15 นาที ☎️ กว่าจะรู้ว่าหยุดมา 2 ชม.แล้ว — dashboard ยังไม่ update",
    },
    modern: {
      stack: ["Parsable (digital work instructions)", "Wonderware MES", "Siemens Opcenter", "Custom IoT + Node-RED"],
      reason: "OEE real-time + predictive maintenance (sensor ตรวจก่อนพัง 48 ชม.) + SPC chart auto-flag deviation",
    },
  },
  {
    id: "construction",
    category: "Construction / BIM / BOQ",
    categoryTh: "ก่อสร้าง / BIM / ประมาณราคา",
    categoryKeywords: ["construction", "ก่อสร้าง", "bim", "boq", "ประมาณราคา", "project management", "site", "แบบก่อสร้าง", "blueprint", "ผู้รับเหมา", "สถาปนิก", "วิศวกร", "คอนกรีต"],
    retro: {
      tech: "Blueprint Paper + Drafting Table + Lotus 1-2-3 (1990s)",
      joke: "สถาปนิกสมัยก่อนนั่งโต๊ะเขียนแบบ 8 ชม.ต่อ 1 แผ่น 📐 ลบผิดก็ขูดจนกระดาษบาง เปลี่ยน column ทีต้องวาดใหม่ทั้งแผ่น",
    },
    modern: {
      stack: ["Revit + BIM 360", "Autodesk Construction Cloud", "Archicad", "Touchplan"],
      reason: "BIM 3D clash detection real-time + BOQ generate จาก model + mobile site inspection + schedule link 3D",
    },
  },
  {
    id: "healthcare",
    category: "Healthcare / Hospital / Clinic",
    categoryTh: "โรงพยาบาล / คลินิก / ร้านยา",
    categoryKeywords: ["hospital", "โรงพยาบาล", "his", "emr", "clinic", "คลินิก", "patient", "pharmacy", "ร้านยา", "ยา", "prescription", "medical", "สุขภาพ", "ทันตกรรม", "dental", "แพทย์", "หมอ"],
    retro: {
      tech: "Paper Medical Chart + DOS Hospital System (1980s–1990s)",
      joke: "ชาร์ตคนไข้สมัยก่อนเป็นกระดาษ — หาย ก็หาย 😰 ลายมือหมอเขียนยา 'ampicillin' อ่านเป็น 'amitriptyline' คนไข้หลับยาว",
    },
    modern: {
      stack: ["Epic (enterprise)", "OpenMRS (open-source)", "MEDICORE (Thailand)", "Cerner Cloud"],
      reason: "E-prescription ตรวจ drug interaction อัตโนมัติ + patient portal ดู lab result 24/7 + telemedicine",
    },
  },
  {
    id: "education",
    category: "Education / LMS / School",
    categoryTh: "โรงเรียน / LMS / e-Learning",
    categoryKeywords: ["school", "โรงเรียน", "lms", "e-learning", "education", "course", "student", "นักเรียน", "มหาวิทยาลัย", "สอนออนไลน์", "ลงทะเบียน", "exam", "สอบ", "grading", "ให้คะแนน", "classroom"],
    retro: {
      tech: "Moodle 1.x + Paper Enrollment Forms (2000s)",
      joke: "Moodle ยุคแรก — อาจารย์หา upload link ต้องคลิก 4 ครั้ง ไม่มี breadcrumb 😵 กว่าจะกลับหน้าแรกได้กด back 10 ที",
    },
    modern: {
      stack: ["Canvas LMS", "Google Classroom (ฟรี K-12)", "Moodle 4.x", "Teachable"],
      reason: "Mobile-first + assignment submit 1 click + plagiarism detection + video embedded + grade curve AI",
    },
  },
  {
    id: "legal",
    category: "Legal / Law / Case Management",
    categoryTh: "สำนักงานกฎหมาย / ทนาย",
    categoryKeywords: ["legal", "law", "lawyer", "ทนาย", "กฎหมาย", "สำนักงานกฎหมาย", "case", "contract", "สัญญา", "คดี", "court", "ศาล", "litigation"],
    retro: {
      tech: "Filing Cabinet + WordPerfect 5.1 + Timesheets (1989–2000s)",
      joke: "สำนักงานกฎหมายสมัยก่อน ค้นหา 1 คดีจากตู้เอกสารใช้เวลา 2 ชม. 📂 ย้าย office ทีต้องขนตู้ไฟล์ 50 ตู้",
    },
    modern: {
      stack: ["Casetext (AI legal research)", "Rocket Matter", "LawGeex (contract AI)", "Practical Law"],
      reason: "AI legal research + time tracking อัตโนมัติ + document assembly template + conflict check 1 วินาที",
    },
  },
  {
    id: "salon",
    category: "Salon / Beauty / Spa / Appointment",
    categoryTh: "ร้านเสริมสวย / สปา / นัดคิว",
    categoryKeywords: ["salon", "beauty", "spa", "นวด", "ร้านตัดผม", "barber", "ร้านเสริมสวย", "appointment", "จองนัด", "จองคิว", "นัดคิว", "ร้านเล็บ", "nail", "ร้านนวด", "massage"],
    retro: {
      tech: "Paper Appointment Book + Phone Booking (1990s–2000s)",
      joke: "สมุดนัดร้านตัดผมสมัยก่อน — ลูกค้า 3 PM มาถึง เจอว่ามีคนจอง 3 PM อีกคน 😅 ลายมือไม่ชัด นัดซ้ำเป็นเรื่องปกติ",
    },
    modern: {
      stack: ["Booksy", "Fresha (mobile-first)", "Acuity Scheduling", "Square for Beauty"],
      reason: "จองออนไลน์ 24/7 + SMS เตือนอัตโนมัติ (ลด no-show 75%) + loyalty points + review request หลัง service",
    },
  },
  {
    id: "design",
    category: "Design / Graphics / UI-UX",
    categoryTh: "ออกแบบ / กราฟิก / UI-UX",
    categoryKeywords: ["design", "graphic", "ui", "ux", "figma", "photoshop", "adobe", "illustrator", "canva", "ออกแบบ", "กราฟิก", "โลโก้", "logo", "poster", "โปสเตอร์", "แบนเนอร์", "banner"],
    retro: {
      tech: "Photoshop 1.0 + CorelDRAW 3 (1990–1991)",
      joke: "Photoshop สมัยก่อนทำรูป 3000px auto-save ค้าง ☠️ crash ปุ๊บ 'last saved 3 hours ago' — ร้องไห้แล้วทำใหม่",
    },
    modern: {
      stack: ["Figma (collab real-time)", "Adobe Creative Cloud 2024", "Affinity Designer", "Framer"],
      reason: "Figma multiplayer ไม่ conflict ไฟล์ + design system auto-update + prototype + handoff 1 export",
    },
  },
  {
    id: "music",
    category: "Music / Audio / Podcast",
    categoryTh: "เพลง / เสียง / Podcast",
    categoryKeywords: ["music", "เพลง", "daw", "recording", "mixing", "mastering", "podcast", "audio", "ableton", "logic pro", "studio", "บันทึกเสียง", "ตัดต่อเสียง", "producer"],
    retro: {
      tech: "4-Track Cassette Recorder + MIDI Sequencer (1980s)",
      joke: "บันทึกเพลงลงเทป cassette สมัยก่อน 🎵 เทป 90 นาทีหมด mid-song ก็ต้องซื้อม้วนใหม่ rewind-record ใหม่ทั้งเพลง",
    },
    modern: {
      stack: ["Ableton Live 12", "Logic Pro 2024", "Reaper (ราคาถูก)", "Adobe Audition (podcast)"],
      reason: "Unlimited tracks + plugin CPU meter real-time + stock plugins คุณภาพดี + podcast loudness normalize อัตโนมัติ",
    },
  },
  {
    id: "cad",
    category: "CAD / 3D Modeling / Engineering Drawing",
    categoryTh: "CAD / แบบแปลน / 3D",
    categoryKeywords: ["cad", "autocad", "3d", "modeling", "engineering", "drawing", "solidworks", "แบบแปลน", "เขียนแบบ", "3d printing", "พิมพ์ 3 มิติ", "cnc", "drafting", "fusion 360"],
    retro: {
      tech: "Drafting Table + AutoCAD R12 (DOS command-line) (1992)",
      joke: "AutoCAD บน DOS — พิมพ์ command ทีละบรรทัด ไม่มี mouse GUI 😤 startup ใช้เวลา 2 นาที พอจะ plot ต้อง config plotter อีก 30 นาที",
    },
    modern: {
      stack: ["Autodesk Fusion 360 (cloud)", "SolidWorks 2024", "Onshape (browser-based)", "FreeCAD"],
      reason: "Cloud collab + parametric design + FEA simulation 1 ปุ่ม + export STL/STEP → 3D print/CNC ทันที",
    },
  },
  {
    id: "devops",
    category: "DevOps / CI-CD / Infrastructure",
    categoryTh: "DevOps / Docker / Server",
    categoryKeywords: ["devops", "docker", "kubernetes", "ci/cd", "deploy", "server", "cloud", "infrastructure", "container", "monitoring", "pipeline", "jenkins", "github actions", "aws", "azure", "gcp"],
    retro: {
      tech: "Manual SSH + SCP File Copy + cron jobs (1990s–2000s)",
      joke: "Deploy สมัยก่อน SCP ไฟล์ไป server แล้ว SSH remote restart 🤞 crash ก็ SSH กลับ restart อีกรอบ — uptime 99%? เทพเท่านั้น",
    },
    modern: {
      stack: ["Docker + Docker Compose", "Kubernetes", "GitHub Actions", "ArgoCD (GitOps)"],
      reason: "Docker multi-stage build + K8s auto-scale + CI matrix test 12 combo พร้อมกัน + GitOps deploy ปลอดภัย",
    },
  },
  {
    id: "security",
    category: "Security / CCTV / Firewall",
    categoryTh: "ระบบรักษาความปลอดภัย / CCTV",
    categoryKeywords: ["security", "firewall", "cctv", "กล้องวงจรปิด", "surveillance", "antivirus", "vpn", "network security", "cybersecurity", "penetration test", "pentest", "ระบบรักษาความปลอดภัย"],
    retro: {
      tech: "VHS CCTV Tape Loop + Norton Antivirus (1990s)",
      joke: "CCTV สมัยก่อนบันทึกลงเทป VHS ภาพ 240p ขาวดำ 📼 ดู footage หาคนร้าย — เห็นแค่ 'เสื้อเทา ผมดำ' ซึ่งเหมือนทุกคน",
    },
    modern: {
      stack: ["Zeek (IDS)", "Wazuh (SIEM)", "OPNsense (firewall)", "AI-powered CCTV analytics"],
      reason: "AI face recognition alert 1 วินาที + SIEM centralize log + VPN WireGuard เร็วกว่า OpenVPN 3x",
    },
  },
  {
    id: "scraping",
    category: "Web Scraping / RPA / Automation",
    categoryTh: "Scraping / RPA / Automation",
    categoryKeywords: ["scraping", "web scraping", "rpa", "crawler", "automation", "macro", "selenium", "puppeteer", "data extraction", "ดึงข้อมูล", "bot", "automate", "robot process"],
    retro: {
      tech: "VB6 SendKeys Macro + Perl Regex HTML Parsing (1990s–2000s)",
      joke: "VB6 macro automation — press Tab 5 ครั้ง type order number กด Enter 🤖 ถ้า popup ขึ้นมาสักตัว Tab ไป field ผิดทั้ง batch เลย",
    },
    modern: {
      stack: ["Puppeteer (headless Chrome)", "Playwright", "Scrapy (Python)", "Cheerio (Node.js)"],
      reason: "wait-for-selector ไม่มี race condition + parallel scrape 100x เร็ว + codegen record click → auto-write code",
    },
  },
  {
    id: "carwash",
    category: "Car Wash / Auto Repair / Garage",
    categoryTh: "คาร์แคร์ / อู่ซ่อมรถ / ร้านยาง",
    categoryKeywords: ["car wash", "carwash", "คาร์แคร์", "auto repair", "garage", "อู่ซ่อมรถ", "อู่", "ล้างรถ", "ร้านยาง", "ซ่อมรถ", "mechanic", "ช่าง", "ร้านซ่อม", "service center", "ศูนย์บริการ", "เปลี่ยนยาง", "เปลี่ยนถ่ายน้ำมัน"],
    retro: {
      tech: "Notebook + Phone Calendar + Punch Card (1990s–2000s)",
      joke: "ล้างรถสมัยก่อนเขียนใส่สมุด 'วันนี้เต็ม เสาร์มา' 📓 ลูกค้า 20 คนนั่งรอ 4 ชม. ไม่รู้ ETA — ถามทีก็บอก 'อีกแป๊บ'",
    },
    modern: {
      stack: ["AutoCar Care (VIBAGEN)", "Service Assistant", "Fixd (vehicle tracker)", "Custom LINE LIFF"],
      reason: "Mobile booking เลือกช่าง+เวลา + แจ้ง ETA real-time + photo inspection ก่อน-หลัง + inventory scan QR auto-bill",
    },
  },
  {
    id: "agriculture",
    category: "Agriculture / Farm / Weighbridge",
    categoryTh: "เกษตร / ฟาร์ม / ชั่งน้ำหนัก",
    categoryKeywords: ["agriculture", "farming", "เกษตร", "ฟาร์ม", "farm", "ปาล์มน้ำมัน", "palm oil", "ยางพารา", "ชั่งน้ำหนัก", "weighbridge", "ตาชั่ง", "crop", "harvest", "เก็บเกี่ยว", "โรงงานปาล์ม"],
    retro: {
      tech: "Manual Weighbridge Dial + Ledger Book + Dot Matrix Receipt (1990s–2000s)",
      joke: "ตาชั่งสมัยก่อนอ่านเข็มทีละคัน จดลงสมุด ✏️ ชั่ง 3 ที่ได้ตัวเลข 3 แบบ — เอา 'average' ไป คิดเงินแบบมั่วๆ",
    },
    modern: {
      stack: ["NewScale (Tauri + Rust IoT)", "Trimble Ag (GPS + mapping)", "AgWorld", "Custom IoT + LoRa"],
      reason: "IoT ตาชั่ง auto-capture weight+barcode (zero manual) + GPS field map + soil sensor predict irrigation",
    },
  },
  {
    id: "realestate",
    category: "Real Estate / Property Management",
    categoryTh: "อสังหา / จัดการห้องเช่า",
    categoryKeywords: ["real estate", "property", "อสังหา", "ห้องเช่า", "condo", "คอนโด", "หอพัก", "apartment", "อพาร์ทเมนต์", "landlord", "tenant", "ผู้เช่า", "lease", "ค่าเช่า", "นิติบุคคล"],
    retro: {
      tech: "Tenant Ledger + Phone Reminders (1990s–2000s)",
      joke: "เก็บค่าเช่าสมัยก่อน เจ้าของโทรเตือนทีละคน 📞 ลืมจดก็ลืม — ผู้เช่าบอก 'จ่ายแล้วนะ' เจ้าของหา receipt ไม่เจอ",
    },
    modern: {
      stack: ["DoorLoop", "Rentman", "Zoho CRM (real estate)", "Airbnb (short-term)"],
      reason: "Tenant portal จ่ายค่าเช่าออนไลน์ + maintenance request รูปถ่าย + lease renewal เตือน 60 วันก่อนหมด",
    },
  },
  {
    id: "nonprofit",
    category: "Non-Profit / NGO / Donation",
    categoryTh: "มูลนิธิ / NGO / บริจาค",
    categoryKeywords: ["nonprofit", "ngo", "donation", "มูลนิธิ", "บริจาค", "charity", "fundraising", "ระบบบริจาค", "donor", "อาสาสมัคร", "volunteer", "giving", "องค์กรไม่แสวงหากำไร"],
    retro: {
      tech: "Manual Donor Cards + Phone Fundraising (1990s–2000s)",
      joke: "NGO สมัยก่อนโทรหา donor ทีละคน 📞 ไม่มี tracking — donor บอก 'บริจาคแล้ว' เมื่อไหร่? ไม่มี record เลย",
    },
    modern: {
      stack: ["Donorbox (recurring)", "GiveWP", "Qgiv (multi-channel)", "Tech Soup (free/cheap)"],
      reason: "Recurring auto-charge (retention 70%) + SMS campaign + AI thank-you letter + impact report auto-generate",
    },
  },
  {
    id: "government",
    category: "Government / e-Government / Registry",
    categoryTh: "ราชการ / e-Government / สารบรรณ",
    categoryKeywords: ["government", "ราชการ", "e-government", "สารบรรณ", "เอกสาร", "ทะเบียน", "ใบอนุญาต", "permit", "license", "civil service", "ระบบราชการ", "หนังสือราชการ", "ทะเบียนราษฎร์"],
    retro: {
      tech: "Paper Queue + Filing Cabinet + Oracle Forms (1990s–2000s)",
      joke: "ไปสำนักงานราชการเตรียมเอกสาร 5 ชุด รอคิว 4 ชม. 🏛️ เจ้าหน้าที่บอก 'ขาดสำเนาบัตรอีก 1 ใบ' — กลับมาใหม่พรุ่งนี้",
    },
    modern: {
      stack: ["GovTech.Thailand", "e-Licensing", "WeGov (open-source)", "DigitalGov Platform"],
      reason: "e-ID verify ไม่ต้องไป office + paperless workflow + blockchain certificate + chatbot บอก docs ที่ต้องเตรียม",
    },
  },
];

export const wildcardResponses: WildcardResponse[] = [
  {
    pattern: /^(ไม่รู้|อะไรก็ได้|random|น่ะ|ไม่แน่ใจ|ไม่รู้เลย|แนะนำหน่อย)$/i,
    response: "ลองพิมพ์ว่าอยากสร้างอะไร เช่น 'ร้านอาหาร', 'AI chatbot', 'คลังสินค้า', 'โรงแรม', 'ร้านเสริมสวย' ครับ 🎲 มีให้เลือกเยอะ!",
    category: "random",
  },
  {
    pattern: /^(autocare|vibagen|pos|crm|liff)$/i,
    response: "เฮ้ อันนี้ไม่ใช่ category quiz นะครับ 😄 ดูที่ /showcase ดีกว่า — VIBAGEN สร้าง AutoCar Care ทั้งระบบ! ลองถามเรื่อง 'mobile app' หรือ 'desktop' แทน",
    category: "shameless_plug",
  },
  {
    pattern: /^(โปรแกรมอู่ซ่อมรถ|โปรแกรมคาร์แคร์|โปรแกรมร้านล้างรถ|autocare|vibagen|autocar)$/i,
    response: "เฮ้ อันนี้ VIBAGEN ทำให้ AutoCar Care เลย! 🚗 ดูที่ /showcase/autocar-care หรือลองถามเรื่อง 'อู่ซ่อมรถ' ดูครับ",
    category: "shameless_plug",
  },
  {
    pattern: /^(excel|google sheets|spreadsheet|สเปรดชีต)$/i,
    response: "Excel/Sheets ไม่ใช่ 'โปรแกรม' ที่สร้าง แต่ถ้าอยากรู้ว่า dashboard ยุคเก่ากับยุคใหม่ต่างกันยังไง ลองพิมพ์ 'dashboard' ดูครับ 📊",
    category: "redirect",
  },
  {
    pattern: /^(hello|hi|สวัสดี|ว่าไง|หวัดดี|hey)$/i,
    response: "สวัสดีครับ! 👋 ลองพิมพ์ว่าอยากสร้างอะไร เช่น 'เกมส์', 'AI chatbot', 'แอพมือถือ', 'เว็บไซต์' หรือ 'ระบบบัญชี' ครับ",
    category: "greeting",
  },
  {
    pattern: /^(ขอบคุณ|thanks|thank you|ขอบคุณครับ|ขอบคุณค่ะ)$/i,
    response: "ยินดีครับ! 😊 ถ้าอยากปรึกษาเรื่อง tech stack จริงๆ ไปที่ /hire-us ได้เลย — ฟรี ไม่มีขาย",
    category: "gratitude",
  },
];

export const FALLBACK_MESSAGE =
  "ไม่เจอ category นี้ครับ 🤔 ลองพิมพ์ เช่น 'ร้านอาหาร', 'AI', 'โรงแรม', 'อู่ซ่อมรถ', 'โรงงาน', 'คลังสินค้า', 'โรงเรียน', 'เว็บ' หรือ 'เกมส์'";

/**
 * findTechStack — query → TechStackMapping | WildcardResponse | null
 *
 * 1. Match against categoryKeywords (.includes(), case-insensitive)
 * 2. If no match → try wildcardResponses
 * 3. If still no match → return null (caller shows FALLBACK_MESSAGE)
 */
export function findTechStack(query: string): TechStackMapping | WildcardResponse | null {
  if (!query || !query.trim()) return null;

  const q = query.trim().toLowerCase();

  // Category keyword match (substring)
  for (const mapping of techStackQuiz) {
    for (const keyword of mapping.categoryKeywords) {
      if (q.includes(keyword.toLowerCase())) {
        return mapping;
      }
    }
  }

  // Wildcard patterns
  for (const wildcard of wildcardResponses) {
    if (wildcard.pattern instanceof RegExp) {
      if (wildcard.pattern.test(q)) {
        return wildcard;
      }
    } else {
      if (q === (wildcard.pattern as string).toLowerCase()) {
        return wildcard;
      }
    }
  }

  return null;
}

// ─── Skill Level & Time Estimate ────────────────────────────────────────────

export type SkillLevelId = 'none' | 'nocode' | 'junior' | 'developer' | 'senior'

export interface SkillLevel {
  id: SkillLevelId
  emoji: string
  label: string
  description: string
}

export interface TimeEstimate {
  traditional: string
  vibecoding: string
  note: string
}

export const SKILL_LEVELS: SkillLevel[] = [
  { id: 'none', emoji: '🌱', label: 'ไม่เคยเขียนเลย', description: 'ใช้แค่ Excel, Google Sheets' },
  { id: 'nocode', emoji: '🧩', label: 'เคยใช้ No-Code', description: 'AppSheet, Wix, WordPress' },
  { id: 'junior', emoji: '🔧', label: 'เคยเขียนบ้าง', description: 'HTML/CSS, Python, SQL เบื้องต้น' },
  { id: 'developer', emoji: '💻', label: 'Developer', description: 'เขียนโค้ดเป็นงานหลัก' },
  { id: 'senior', emoji: '🏗️', label: 'Senior / Architect', description: 'ออกแบบระบบ + DevOps' },
]

const categoryComplexity: Record<string, number> = {
  // Tier 1 — Simple (website, portfolio, basic tools)
  website: 1, dashboard: 1, design: 1, music: 1, video: 1, salon: 1,
  // Tier 2 — Medium (standard business apps)
  ecommerce: 2, mobile: 2, chat: 2, pos: 2, crm: 2, hr: 2, hotel: 2,
  scraping: 2, carwash: 2, realestate: 2, nonprofit: 2, education: 2, legal: 2, government: 2,
  // Tier 3 — Complex (enterprise / multi-module)
  erp: 3, manufacturing: 3, logistics: 3, warehouse: 3, healthcare: 3, construction: 3,
  // Tier 4 — Specialized (deep domain expertise needed)
  game: 4, ai: 4, iot: 4, desktop: 4, blockchain: 4, devops: 4, security: 4, cad: 4, agriculture: 4,
}

const timeMatrix: Record<number, Record<SkillLevelId, TimeEstimate>> = {
  1: {
    none:      { traditional: '3-6 เดือน',    vibecoding: '2-4 สัปดาห์', note: 'Vibecoding ช่วยสร้าง prototype ได้เลย — แต่ต้องเรียนพื้นฐาน HTML/CSS ควบคู่' },
    nocode:    { traditional: '1-2 เดือน',    vibecoding: '3-7 วัน',     note: 'คุณเข้าใจ logic อยู่แล้ว AI ช่วยเขียนโค้ดจริงให้ — เร็วมาก' },
    junior:    { traditional: '2-4 สัปดาห์',   vibecoding: '2-5 วัน',     note: 'AI ลด boilerplate ได้เยอะ — คุณ focus ที่ design กับ UX' },
    developer: { traditional: '1-2 สัปดาห์',   vibecoding: '1-3 วัน',     note: 'Scaffold ทั้ง project ใน 1 ชม. — เหลือแค่ fine-tune' },
    senior:    { traditional: '3-7 วัน',       vibecoding: '1-2 วัน',     note: 'AI scaffold ให้ คุณ tune architecture — จบเร็ว' },
  },
  2: {
    none:      { traditional: 'ทำเองยากมาก',   vibecoding: '1-3 เดือน',   note: 'ต้องมีคนช่วย review code — แต่ AI ช่วยให้เริ่มได้' },
    nocode:    { traditional: '3-6 เดือน',    vibecoding: '2-4 สัปดาห์', note: 'เข้าใจ business logic อยู่แล้ว → AI แปลงเป็นโค้ดจริง' },
    junior:    { traditional: '2-4 เดือน',    vibecoding: '1-3 สัปดาห์', note: 'AI ช่วย pattern ที่ไม่คุ้นเคย เช่น payment, auth' },
    developer: { traditional: '1-3 เดือน',    vibecoding: '1-2 สัปดาห์', note: 'Vibecoding ลดงาน CRUD ซ้ำๆ ได้ 80% — focus ที่ business logic' },
    senior:    { traditional: '2-6 สัปดาห์',   vibecoding: '3-7 วัน',     note: 'Design architecture เอง ให้ AI implement — review แล้ว ship' },
  },
  3: {
    none:      { traditional: 'ทำเองไม่ได้',   vibecoding: '3-6 เดือน',   note: 'ระบบซับซ้อน ต้องมีที่ปรึกษา + AI เป็น co-pilot' },
    nocode:    { traditional: 'ทำเองไม่ได้',   vibecoding: '2-4 เดือน',   note: 'ต้องเข้าใจ domain ก่อน — AI ช่วยแปลงเป็น production code' },
    junior:    { traditional: '6-12 เดือน',   vibecoding: '1-3 เดือน',   note: 'AI ช่วยลด learning curve ระบบ enterprise ได้มาก' },
    developer: { traditional: '4-8 เดือน',    vibecoding: '1-2 เดือน',   note: 'Vibecoding ลดงาน integration + testing — คุณ focus ที่ architecture' },
    senior:    { traditional: '2-6 เดือน',    vibecoding: '2-6 สัปดาห์', note: 'Architect ทั้งระบบเอง AI build module ทีละชิ้น — review แล้ว ship' },
  },
  4: {
    none:      { traditional: 'ทำเองไม่ได้',   vibecoding: '3-6 เดือน',   note: 'Prototype ได้ แต่ production ต้องมี mentor ด้าน domain' },
    nocode:    { traditional: 'ทำเองไม่ได้',   vibecoding: '2-4 เดือน',   note: 'ต้องเรียนรู้ domain เฉพาะทางก่อน — AI ช่วย accelerate' },
    junior:    { traditional: '6-12+ เดือน',  vibecoding: '1-3 เดือน',   note: 'AI ช่วยเรื่อง domain knowledge ที่ปกติต้องศึกษานาน' },
    developer: { traditional: '3-6 เดือน',    vibecoding: '2-6 สัปดาห์', note: 'AI accelerate R&D phase — prototype เร็วขึ้น 3-5x' },
    senior:    { traditional: '1-3 เดือน',    vibecoding: '1-4 สัปดาห์', note: 'AI = pair programmer ที่รู้ทุก domain — คุณ direct มัน implement' },
  },
}

export function getTimeEstimate(categoryId: string, skillLevel: SkillLevelId): TimeEstimate | null {
  const tier = categoryComplexity[categoryId]
  if (!tier) return null
  const tierEstimates = timeMatrix[tier]
  if (!tierEstimates) return null
  return tierEstimates[skillLevel] || null
}
