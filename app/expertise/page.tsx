import type { Metadata } from 'next'
import Navbar from '@/components/sections/Navbar'
import Footer from '@/components/sections/Footer'
import Badge from '@/components/ui/Badge'
import Tooltip from '@/components/ui/Tooltip'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'ความเชี่ยวชาญ — Domain + Technical Expertise | VIBAGEN',
  description:
    'เราเข้าใจทั้ง operation จริง (จัดซื้อ, การผลิต, PM, บริการ) และเทคนิคจริง (Vibecoding, Next.js, PostgreSQL, Claude AI, Docker) — สร้างระบบที่ใช้งานได้จริงเร็วที่สุด',
  alternates: { canonical: 'https://vibagen.com/expertise' },
  keywords: ['domain expertise', 'vibecoding', 'next.js', 'postgresql', 'claude ai', 'docker', 'erp integration', 'ระบบจัดซื้อ', 'ระบบผลิต', 'ซ่อมบำรุง', 'รับทำระบบ ERP', 'back office system', 'ระบบจัดการภายใน', 'custom software development'],
}

const domainCards = [
  {
    icon: '📋',
    titleEn: 'Procurement',
    titleTh: 'จัดซื้อ',
    problems: [
      'PR → PO → ใบสั่งซื้อ → ตรวจรับ → AP ที่ทำใน Excel',
      'approve ไม่มีระบบ ต้องไล่เซ็น ใช้เวลาหลายวัน',
      'ไม่รู้สถานะ PO แต่ละใบ ต้องโทรถามทุกครั้ง',
    ],
    solutions: [
      'ระบบ PR/PO อิเล็กทรอนิกส์ + Approval Workflow (แจ้งเตือนผ่าน LINE)',
      'Dashboard จัดซื้อ real-time — รู้สถานะทุกใบทันที',
      'เชื่อมต่อข้อมูล Item Master / Vendor จาก ERP ที่มีอยู่',
    ],
  },
  {
    icon: '🏭',
    titleEn: 'Production',
    titleTh: 'การผลิต',
    problems: [
      'ติดตามงานผลิตจากกระดาษ / whiteboard ต้องถ่ายรูปส่ง',
      'ไม่รู้ yield / efficiency แบบ real-time ต้องรอรายงานปลายวัน',
      'รายงานต้องทำเองทุกวัน สูญเสียเวลา 1–2 ชั่วโมง/วัน',
    ],
    solutions: [
      'Production tracking dashboard — บันทึก → validate → approve → summary อัตโนมัติ',
      'Work order management + QC digital checklist',
      'KPI Report (Yield, OEE, Loss) แบบ real-time ไม่ต้องทำมือ',
    ],
  },
  {
    icon: '🔧',
    titleEn: 'Preventive Maintenance',
    titleTh: 'ซ่อมบำรุงเชิงป้องกัน',
    problems: [
      'Plan PM ใน Excel แต่ลืม / ทำไม่ครบ ไม่มีใครรู้',
      'แจ้งซ่อมผ่าน chat ไม่มี record ติดตามยาก',
      'ไม่รู้ว่าเครื่องไหนมีปัญหาบ่อย ไม่มีข้อมูล downtime สะสม',
    ],
    solutions: [
      'PM Scheduling + แจ้งเตือนอัตโนมัติตามชั่วโมงหรือรอบเวลา',
      'Work Request → Work Order พร้อม approval flow ผ่าน LINE',
      'Machine history / Downtime tracking + คำนวณต้นทุนซ่อมสะสม',
    ],
  },
  {
    icon: '🎧',
    titleEn: 'Services',
    titleTh: 'บริการหลังการขาย',
    problems: [
      'ติดตามงานซ่อม / service ticket ยาก ไม่รู้ว่าอยู่ขั้นตอนไหน',
      'ลูกค้าถามสถานะงานแล้วตอบไม่ได้ ต้องไปถามช่างอีกที',
      'report สรุปงานต้องทำมือ เสียเวลาทุกสิ้นเดือน',
    ],
    solutions: [
      'Service ticket management + status flow ที่ทุกคนเห็น real-time',
      'Customer portal ดูสถานะงานเองได้ ไม่ต้องโทรถาม',
      'Auto-report รายวัน/สัปดาห์ ส่งผ่าน LINE หรือ Email อัตโนมัติ',
    ],
  },
]

const techCards = [
  {
    icon: '⚡',
    titleEn: 'Vibecoding',
    titleTh: 'AI-Assisted Development',
    desc: 'วิธีการพัฒนาซอฟต์แวร์ที่ใช้ AI เป็น co-developer ตลอดกระบวนการ ไม่ใช่แค่ generate code แต่คือการออกแบบ, debug, review ร่วมกับ AI',
    items: [
      'Cursor + Claude Code',
      'งาน 3 เดือน สร้างได้ใน 4 สัปดาห์',
      'ทีมเล็กสร้างระบบคุณภาพสูงได้จริง',
      'ลด human error จาก boilerplate code',
    ],
  },
  {
    icon: '🖥️',
    titleEn: 'Frontend & UI',
    titleTh: 'หน้าจอที่ใช้งานได้จริง',
    desc: 'Mobile-First เสมอ — field worker ต้องใช้โทรศัพท์ได้สบาย UI เรียบง่าย ใช้งานได้ทันทีโดยไม่ต้องฝึก',
    items: [
      'Next.js 15 (App Router) + TypeScript',
      'Tailwind CSS v4',
      'LINE LIFF Mini App',
      'Responsive ทุก device',
    ],
  },
  {
    icon: '🗄️',
    titleEn: 'Backend & Database',
    titleTh: 'ฐานข้อมูลที่ AI อ่านได้',
    desc: 'Clean schema ที่ AI อ่านแล้วเข้าใจ context ได้ทันที ออกแบบให้ AI Agent เชื่อมต่อได้ตั้งแต่วันแรก',
    items: [
      'PostgreSQL — DB อันดับ 1 ที่ dev เลือก 5 ปีซ้อน',
      'MSSQL — สำหรับ Windows / Microsoft ecosystem',
      'tRPC — Type-safe API',
      'Prisma ORM — schema migration ชัดเจน',
    ],
  },
  {
    icon: '🤖',
    titleEn: 'AI Layer',
    titleTh: 'Claude First',
    desc: 'Claude (Anthropic) — จุดเริ่มต้นที่ดีที่สุดสำหรับ Business System: Structured Output, Tool Use, Context Window ขนาดใหญ่',
    items: [
      'Claude — Instruction Following ดีที่สุด',
      'Gemini — สำหรับ multimodal',
      'GPT-4o — สำหรับ ecosystem ที่มีอยู่',
      'OCR, Auto-classify, Anomaly Detection',
    ],
  },
  {
    icon: '☁️',
    titleEn: 'Infrastructure',
    titleTh: 'พอดีกับขนาดธุรกิจ',
    desc: 'เลือก infrastructure ที่พอดีกับขนาดธุรกิจจริง ไม่ over-engineer — SME 10–500 users ไม่จำเป็นต้องใช้ Kubernetes',
    items: [
      'Docker — containerize ทุกอย่าง',
      'GitHub Actions — CI/CD อัตโนมัติ',
      'VPS (700–2,000 บาท/เดือน)',
      'Scale เมื่อจำเป็น ไม่ใช่ตั้งแต่วันแรก',
    ],
  },
  {
    icon: '🔗',
    titleEn: 'ERP Integration',
    titleTh: 'Read-Only Data Mirror',
    desc: 'ไม่แตะ Core Transaction ของ ERP — สร้าง Read-Only Data Mirror Layer สำหรับ Reporting และ Custom Operation System',
    items: [
      'Materialized View จาก ERP database',
      'SQL Extract — Item Master / Vendor / Budget',
      'Dashboard ดึงจาก ERP ไม่ต้องซื้อ license เพิ่ม',
      'Read-only by design — ไม่มีความเสี่ยง',
    ],
  },
]

export default function ExpertisePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-20" style={{ background: '#011937' }}>
        <div className="container">

          {/* Page Header */}
          <div className="text-center py-16">
            <Badge dot className="mb-4">Expertise</Badge>
            <h1
              className="font-[--font-heading] font-bold text-white mb-4"
              style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}
            >
              เราเข้าใจทั้งธุรกิจจริง และเทคนิคจริง
            </h1>
            <p className="text-white/60 max-w-2xl mx-auto text-lg leading-relaxed">
              ไม่ใช่แค่ programmer ที่รับ spec แล้วเขียนโค้ด — แต่คือคนที่เข้าใจปัญหาและรู้ว่าจะแก้ยังไงด้วยเครื่องมือที่ใช่
            </p>
          </div>

          {/* PART A — Domain Expertise */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <Badge dot className="mb-4">Domain Expertise</Badge>
              <h2
                className="font-[--font-heading] font-bold text-white mb-4"
                style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)' }}
              >
                เราเข้าใจ Operation จริง — ไม่ใช่แค่อ่าน Requirement
              </h2>
              <p className="text-white/60 max-w-2xl mx-auto leading-relaxed">
                ก่อนเขียนโค้ดบรรทัดแรก เราต้องเข้าใจว่าคนหน้างานทำงานยังไง นั่นคือความแตกต่างระหว่างระบบที่ใช้งานจริงได้ กับระบบที่ทำแล้วไม่มีคนใช้
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {domainCards.map((card) => (
                <div
                  key={card.titleEn}
                  className="rounded-2xl p-6 bg-white/[0.04] border border-white/[0.06] hover:border-[#ff6c01]/30 transition-all"
                >
                  {/* Card top */}
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-3xl">{card.icon}</span>
                    <div>
                      <p className="text-[#ff6c01] text-xs uppercase tracking-wider leading-none mb-1">
                        {card.titleEn}
                      </p>
                      <h3 className="font-[--font-heading] font-semibold text-white text-xl leading-tight">
                        {card.titleTh}
                      </h3>
                    </div>
                  </div>

                  {/* Problems */}
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-2">ปัญหาที่เข้าใจ</p>
                  <ul className="space-y-1.5 mb-5">
                    {card.problems.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-white/60 text-sm leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400/60 shrink-0 mt-1.5" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  {/* Solutions */}
                  <p className="text-[#ff6c01]/60 text-xs uppercase tracking-wider mb-2">ระบบที่ทำได้</p>
                  <ul className="space-y-1.5">
                    {card.solutions.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-white/70 text-sm leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ff6c01] shrink-0 mt-1.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* PART B — Technical Expertise */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <Badge dot className="mb-4">Technical Expertise</Badge>
              <h2
                className="font-[--font-heading] font-bold text-white mb-4"
                style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)' }}
              >
                เครื่องมือที่เลือก ต้องเหมาะกับปัญหา — ไม่ใช่แค่ trending
              </h2>
              <p className="text-white/60 max-w-2xl mx-auto leading-relaxed">
                เราเลือก stack ที่ proven, ดูแลได้จริง และพร้อมรองรับ AI ที่จะเข้ามาในระบบของคุณในอีก 1–2 ปีข้างหน้า
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {techCards.map((card) => (
                <div
                  key={card.titleEn}
                  className="rounded-2xl p-6 bg-white/[0.04] border border-white/[0.06] hover:border-[#ff6c01]/30 transition-all"
                >
                  <span className="text-3xl block mb-3">{card.icon}</span>
                  <p className="text-[#ff6c01] text-xs uppercase tracking-wider mb-1">{card.titleEn}</p>
                  <h3 className="font-[--font-heading] font-semibold text-white text-xl mb-2">{card.titleTh}</h3>
                  <p className="text-white/55 text-sm leading-relaxed mb-4">{card.desc}</p>
                  <ul className="space-y-1.5">
                    {card.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-white/70 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ff6c01] shrink-0 mt-1.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Personal Statement — Founder */}
          <section className="mb-20">
            <div
              className="rounded-2xl overflow-hidden"
              style={{ border: '1px solid rgba(255,108,1,0.15)' }}
            >
              {/* Header strip */}
              <div className="px-8 py-4" style={{ background: 'rgba(255,108,1,0.08)' }}>
                <p className="text-[#ff6c01] text-xs uppercase tracking-wider font-semibold">
                  จากผู้พัฒนา
                </p>
              </div>

              <div className="px-8 py-8" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <p className="text-white/80 leading-[1.9] mb-5">
                  ผมไม่ใช่โปรแกรมเมอร์ที่เก่งที่สุด — แต่ผมอยู่กับปัญหาในองค์กรมามากกว่า 20 ปี สัมผัสแทบทุกระบบ ตั้งแต่จัดซื้อ ผลิต ซ่อมบำรุง ไปจนถึงบริการหลังการขาย
                </p>

                <p className="text-white/80 leading-[1.9] mb-5">
                  ผมเห็นการเปลี่ยนผ่านมาทุกรอบ — จาก Excel สู่ Google Sheets สู่ AppSheet สู่ Looker Dashboard ทุกเครื่องมือช่วยแก้ปัญหาได้จริง ถ้าเลือกให้ถูกจังหวะ และทุกครั้งที่เทคโนโลยีเปลี่ยน ผมพาองค์กรให้เห็นก่อนที่จะตัดสินใจ — ไม่ใช่ขาย แต่คือให้ลอง ให้เข้าใจ แล้วเลือกเอง
                </p>

                <p className="text-white/80 leading-[1.9] mb-5">
                  ผมไม่ได้ทำโปรเจกต์ใหญ่ — ผมทำในสิ่งที่เป็นปัญหาจริงทุกวัน ปัญหาเล็กๆ ที่เกิดขึ้นซ้ำ สะสม และกลายเป็นต้นทุนที่มองไม่เห็น สิ่งที่ผมถนัดคือเข้าใจว่าปัญหาเหล่านั้นเชื่อมกันยังไง และจะแก้ที่จุดไหนให้ได้ผลจริง
                </p>

                <p className="text-white leading-[1.9] font-medium">
                  หากคุณสามารถเล่าปัญหาของคุณได้ และตั้งใจจะเดินหน้าไปพร้อมกับ AI — ผมพร้อมทำให้คุณเห็นว่า สิ่งที่คิดถูกเปลี่ยนเป็นระบบจริงได้
                </p>
              </div>
            </div>
          </section>

          {/* Philosophy */}
          <div
            className="rounded-2xl p-10 text-center mb-10"
            style={{
              background: 'linear-gradient(135deg, rgba(255,108,1,0.08) 0%, rgba(13,39,73,0.6) 100%)',
              border: '1px solid rgba(255,108,1,0.15)',
            }}
          >
            <h2 className="font-[--font-heading] font-bold text-white text-2xl mb-4">
              ทำไมต้อง <Tooltip term="ai-ready">AI-Ready Architecture</Tooltip>?
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto leading-relaxed mb-6">
              เราออกแบบทุกระบบให้รองรับ AI ตั้งแต่วันแรก — API endpoints พร้อม, database structure ที่ AI อ่านได้,
              และ modular design ที่เพิ่ม AI feature ได้โดยไม่ต้อง rebuild ทั้งหมด
            </p>
            <p className="text-white/40 text-sm italic">
              ลงทุนวันนี้กับ architecture ที่ถูกต้อง — พร้อมสำหรับ AI ทุกรูปแบบที่จะมาในอนาคต
            </p>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link
              href="/hire-us"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#ff6c01] text-white font-semibold text-lg rounded-xl hover:bg-[#d54e01] transition-colors"
            >
              ปรึกษาการออกแบบระบบ →
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}
