import type { Metadata } from 'next'
import Navbar from '@/components/sections/Navbar'
import Footer from '@/components/sections/Footer'
import Badge from '@/components/ui/Badge'
import Link from 'next/link'
import { getAllArticleMeta } from '@/lib/mdx'

export const metadata: Metadata = {
  title: 'จาก AppSheet สู่ Full-Stack ใน 4 สัปดาห์ — Case Study | VIBAGEN',
  description:
    'เมื่อระบบ AppSheet ถึงขีดจำกัด การมี foundation ที่ดีจาก Phase แรก + AI-assisted development ทำให้ migrate สู่ Next.js + PostgreSQL ได้ใน 4 สัปดาห์',
}

const categoryColors: Record<string, string> = {
  'Agentic AI':       'text-[#ff6c01] bg-[#ff6c01]/10 border-[#ff6c01]/20',
  'Vibecoding':       'text-blue-500 bg-blue-500/10 border-blue-500/20',
  'Business Digital': 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  'Maintenance':      'text-purple-500 bg-purple-500/10 border-purple-500/20',
  'Case Study':       'text-amber-500 bg-amber-500/10 border-amber-500/20',
}

export default function TmkNextMigrationPage() {
  const articles = getAllArticleMeta()

  return (
    <>
      <Navbar />
      <main className="min-h-screen">

        {/* ── Hero ─────────────────────────────────────────────── */}
        <div style={{ background: '#011937' }} className="pt-24 pb-14">
          <div className="container">
            {/* Back link */}
            <Link
              href="/showcase"
              className="inline-flex items-center gap-2 text-white/40 text-sm hover:text-white transition-colors mb-8"
            >
              ← Showcase
            </Link>

            <Badge dot className="mb-4">Case Study — Phase 2</Badge>

            <h1
              className="font-[--font-heading] font-bold text-white mb-4"
              style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1.1 }}
            >
              จาก AppSheet สู่ Full-Stack ใน 4 สัปดาห์
            </h1>

            <p className="text-white/70 text-xl leading-relaxed mb-10 max-w-2xl">
              เมื่อ AppSheet ถึงขีดจำกัด — ระบบเดิมที่สร้างไว้ดี + AI-assisted development ทำให้ไม่ต้องเริ่มใหม่จากศูนย์
            </p>

            {/* Metadata row */}
            <div className="flex flex-wrap gap-x-8 gap-y-4 mb-8">
              {/* Timeline */}
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Timeline</p>
                <p className="text-white font-medium">4 สัปดาห์</p>
              </div>
              {/* Modules */}
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Modules</p>
                <p className="text-white font-medium">Production System</p>
              </div>
              {/* Method */}
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Method</p>
                <p className="text-white font-medium">AI-Assisted (Vibecoding)</p>
              </div>
              {/* Phase */}
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Phase</p>
                <p className="text-white font-medium">Phase 2 — ต่อจาก Smart Factory</p>
              </div>
            </div>

            {/* Phase 1 link callout */}
            <Link
              href="/showcase/smart-factory"
              className="inline-flex items-center gap-2 text-[#ff6c01] text-sm hover:gap-3 transition-all"
            >
              ← อ่าน Phase 1: Smart Factory Transformation
            </Link>
          </div>
        </div>

        {/* ── Main Content ──────────────────────────────────────── */}
        <div className="bg-dots" style={{ background: '#ffffff' }}>
          <div className="container py-16">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">

              {/* ── Article column ─────────────────────────────── */}
              <article>

                {/* A) ทำไมต้อง Migrate? ─────────────────────────── */}
                <section className="mb-12">
                  <h2 className="font-[--font-heading] font-bold text-[#0d2749] text-2xl mb-4">
                    ทำไมต้อง Migrate?
                  </h2>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    ระบบ AppSheet + Google Sheets ที่สร้างใน Phase 1 ช่วยให้โรงงานเปลี่ยนจากกระดาษสู่ดิจิทัลได้สำเร็จ แต่เมื่อข้อมูลมากขึ้น ความต้องการซับซ้อนขึ้น ข้อจำกัดของ platform เริ่มชัด
                  </p>

                  {/* Problem card */}
                  <div className="rounded-2xl bg-[#f0f4f8] p-6 border border-[#0d2749]/[0.08]">
                    <ul className="space-y-4">
                      {[
                        'Google Sheets row limit — ข้อมูลเริ่มถึงขีดจำกัด performance ลดลง',
                        'ไม่มีระบบ Approval Workflow — ข้อมูลเข้าระบบโดยไม่มีการตรวจสอบ',
                        'Role-Based Access ทำได้จำกัด — ควบคุมสิทธิ์ละเอียดไม่ได้',
                        'Report สร้างเองไม่ได้ — ต้องรอคนทำ Looker ให้ทุกครั้ง',
                      ].map((pain) => (
                        <li key={pain} className="flex items-start gap-3">
                          <span
                            className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                            style={{ background: 'rgba(220,38,38,0.1)', color: '#dc2626' }}
                            aria-hidden="true"
                          >
                            ✗
                          </span>
                          <span className="text-gray-600 leading-relaxed">{pain}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>

                {/* B) ทำไมถึงเร็ว ────────────────────────────────── */}
                <section className="mb-12">
                  <h2 className="font-[--font-heading] font-bold text-[#0d2749] text-2xl mb-6">
                    ทำไมถึงทำได้ใน 4 สัปดาห์
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Card 1: Foundation พร้อม */}
                    <div className="bg-[#f0f4f8] rounded-2xl p-5 border border-[#0d2749]/[0.08]">
                      <div className="text-3xl mb-3" aria-hidden="true">🧱</div>
                      <h3 className="font-[--font-heading] font-semibold text-[#0d2749] text-base mb-2">
                        Foundation พร้อม
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        ข้อมูลมีโครงสร้างชัดเจนจาก Phase 1 แล้ว — Google Sheets → PostgreSQL migrate ได้ตรงๆ ไม่ต้อง re-discover workflow
                      </p>
                    </div>

                    {/* Card 2: AI-Assisted Development */}
                    <div className="bg-[#ff6c01]/5 rounded-2xl p-5 border border-[#ff6c01]/20">
                      <div className="text-3xl mb-3" aria-hidden="true">🤖</div>
                      <h3 className="font-[--font-heading] font-semibold text-[#0d2749] text-base mb-2">
                        AI-Assisted Development
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        ใช้ Cursor + Claude Code เป็น co-developer ตลอดกระบวนการ — ออกแบบ, เขียน, debug, review ร่วมกับ AI งานที่เคยใช้ 3 เดือน ลดเหลือ 4 สัปดาห์
                      </p>
                    </div>

                    {/* Card 3: Prototype มีอยู่แล้ว */}
                    <div className="bg-[#f0f4f8] rounded-2xl p-5 border border-[#0d2749]/[0.08]">
                      <div className="text-3xl mb-3" aria-hidden="true">🔄</div>
                      <h3 className="font-[--font-heading] font-semibold text-[#0d2749] text-base mb-2">
                        Prototype มีอยู่แล้ว
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        ระบบ AppSheet เดิมคือ prototype ที่พิสูจน์แล้วว่า workflow ใช้งานได้จริง — แค่ re-implement ด้วย stack ที่แข็งแรงกว่า
                      </p>
                    </div>
                  </div>
                </section>

                {/* C) 4-Week Timeline ────────────────────────────── */}
                <section className="mb-12">
                  <h2 className="font-[--font-heading] font-bold text-[#0d2749] text-2xl mb-6">
                    4 สัปดาห์ — ทำอะไรบ้าง
                  </h2>

                  {[
                    {
                      week: 'W1',
                      title: 'Understand + Data Migration',
                      tasks: [
                        'ย้ายข้อมูลจาก Google Sheets → PostgreSQL',
                        'ออกแบบ Prisma schema จาก data ที่มีอยู่',
                        'วาง RBAC + Approval flow architecture',
                      ],
                      deliverables: ['Database schema', 'Data migration scripts'],
                    },
                    {
                      week: 'W2',
                      title: 'Build Production Module',
                      tasks: [
                        'สร้างหน้า Production data entry + validation',
                        'Approval workflow (Submit → Review → Approve)',
                        'Audit logging ทุก transaction',
                      ],
                      deliverables: ['Production module', 'Approval workflow'],
                    },
                    {
                      week: 'W3',
                      title: 'Dashboard + Reports',
                      tasks: [
                        'Production KPI Dashboard',
                        'Dynamic Report Builder',
                        'PDF export',
                      ],
                      deliverables: ['KPI Dashboard', 'Report Builder', 'PDF export'],
                    },
                    {
                      week: 'W4',
                      title: 'Deploy + Training',
                      tasks: [
                        'On-premise server setup (Dell Precision 3460 SFF)',
                        'PM2 Cluster + Caddy reverse proxy',
                        'Training ทีมงาน + Go-live',
                      ],
                      deliverables: ['Production deployment', 'Team training'],
                    },
                  ].map((item) => (
                    <div key={item.week} className="flex gap-4 mb-4">
                      {/* Week badge */}
                      <div
                        className="w-16 h-16 rounded-2xl bg-[#0d2749] text-white flex items-center justify-center font-bold text-lg shrink-0"
                        aria-hidden="true"
                      >
                        {item.week}
                      </div>
                      {/* Content */}
                      <div className="flex-1 rounded-2xl bg-[#f0f4f8] p-5 border border-[#0d2749]/[0.08]">
                        <h3 className="font-[--font-heading] font-semibold text-[#0d2749] text-base mb-2">
                          {item.title}
                        </h3>
                        <ul className="space-y-1 mb-3">
                          {item.tasks.map((task) => (
                            <li key={task} className="flex items-start gap-2 text-sm text-gray-600">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#ff6c01] shrink-0 mt-1.5" />
                              {task}
                            </li>
                          ))}
                        </ul>
                        <div className="flex flex-wrap gap-2">
                          {item.deliverables.map((d) => (
                            <span
                              key={d}
                              className="text-xs px-2.5 py-1 rounded-full bg-[#0d2749]/[0.06] text-[#0d2749] font-medium"
                            >
                              {d}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </section>

                {/* D) เทียบระบบเดิม vs ใหม่ ─────────────────────── */}
                <section className="mb-12">
                  <h2 className="font-[--font-heading] font-bold text-[#0d2749] text-2xl mb-6">
                    สิ่งที่ได้เพิ่มจากการ Migrate
                  </h2>

                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Before */}
                    <div className="flex-1 bg-gray-50 rounded-2xl p-5 border border-gray-200">
                      <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-4">BEFORE</p>
                      <p className="font-[--font-heading] font-semibold text-gray-400 text-sm mb-3">
                        ระบบเดิม (AppSheet)
                      </p>
                      <ul className="space-y-2.5">
                        {[
                          'Google Sheets — row limit, performance ลด',
                          'ทุกคนเห็นข้อมูลเท่ากัน',
                          'ไม่มี approval workflow',
                          'Report ต้องทำใน Looker แยก',
                          'ไม่มี audit log',
                        ].map((item) => (
                          <li key={item} className="flex items-start gap-2 text-sm text-gray-500">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0 mt-1.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* After */}
                    <div className="flex-1 bg-[#ff6c01]/5 rounded-2xl p-5 border border-[#ff6c01]/20">
                      <p className="text-[#ff6c01] text-xs uppercase tracking-wider font-semibold mb-4">AFTER</p>
                      <p className="font-[--font-heading] font-semibold text-[#0d2749] text-sm mb-3">
                        ระบบใหม่ (Next.js)
                      </p>
                      <ul className="space-y-2.5">
                        {[
                          'PostgreSQL — ไม่มี row limit, query เร็ว',
                          'RBAC 3 ระดับ (Admin / Assistant / User)',
                          'Approval workflow + แจ้งเตือนอัตโนมัติ',
                          'Dynamic Report Builder — สร้างรายงานเองได้',
                          'Audit log ทุก action — traceability 100%',
                        ].map((item) => (
                          <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#ff6c01] shrink-0 mt-1.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>

                {/* E) SVG Mockup Screenshots ─────────────────────── */}
                <section className="mb-12">
                  <h2 className="font-[--font-heading] font-bold text-[#0d2749] text-2xl mb-6">
                    ตัวอย่างหน้าจอระบบใหม่
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                    {/* Mockup 1: Production Dashboard */}
                    <div className="rounded-2xl overflow-hidden border border-[#0d2749]/[0.08]">
                      <div className="h-[200px]">
                        <svg
                          viewBox="0 0 400 200"
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-full h-full"
                          aria-label="Production Dashboard mockup"
                        >
                          <defs>
                            <linearGradient id="dashGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#011937" />
                              <stop offset="100%" stopColor="#0d2749" />
                            </linearGradient>
                          </defs>
                          <rect width="400" height="200" fill="url(#dashGrad)" />

                          {/* Stat cards row */}
                          <rect x="16" y="16" width="108" height="44" rx="6" fill="rgba(255,255,255,0.07)" />
                          <text x="24" y="30" fill="rgba(255,255,255,0.45)" fontSize="8" fontFamily="sans-serif">Yield</text>
                          <text x="24" y="48" fill="#ff6c01" fontSize="13" fontFamily="sans-serif" fontWeight="bold">17.72%</text>

                          <rect x="146" y="16" width="108" height="44" rx="6" fill="rgba(255,255,255,0.07)" />
                          <text x="154" y="30" fill="rgba(255,255,255,0.45)" fontSize="8" fontFamily="sans-serif">OEE</text>
                          <text x="154" y="48" fill="rgba(255,255,255,0.9)" fontSize="13" fontFamily="sans-serif" fontWeight="bold">87.4%</text>

                          <rect x="276" y="16" width="108" height="44" rx="6" fill="rgba(255,255,255,0.07)" />
                          <text x="284" y="30" fill="rgba(255,255,255,0.45)" fontSize="8" fontFamily="sans-serif">Output</text>
                          <text x="284" y="48" fill="rgba(255,255,255,0.9)" fontSize="13" fontFamily="sans-serif" fontWeight="bold">1,250 t</text>

                          {/* Bar chart */}
                          {[
                            { x: 20,  h: 60, orange: false },
                            { x: 68,  h: 80, orange: false },
                            { x: 116, h: 50, orange: false },
                            { x: 164, h: 90, orange: false },
                            { x: 212, h: 70, orange: false },
                            { x: 260, h: 55, orange: false },
                            { x: 308, h: 95, orange: true  },
                          ].map((bar, i) => (
                            <rect
                              key={i}
                              x={bar.x}
                              y={160 - bar.h}
                              width="32"
                              height={bar.h}
                              rx="4"
                              fill={bar.orange ? '#ff6c01' : 'rgba(255,255,255,0.18)'}
                            />
                          ))}

                          {/* X-axis line */}
                          <line x1="16" y1="162" x2="356" y2="162" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

                          {/* Chart label */}
                          <text x="370" y="162" fill="rgba(255,255,255,0.3)" fontSize="8" fontFamily="sans-serif" textAnchor="end">7 days</text>
                        </svg>
                      </div>
                      <div className="px-4 py-3 bg-white border-t border-[#0d2749]/[0.06]">
                        <p className="font-[--font-heading] font-semibold text-[#0d2749] text-sm">
                          Production Dashboard
                        </p>
                      </div>
                    </div>

                    {/* Mockup 2: Approval Workflow */}
                    <div className="rounded-2xl overflow-hidden border border-[#0d2749]/[0.08]">
                      <div className="h-[200px]">
                        <svg
                          viewBox="0 0 400 200"
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-full h-full"
                          aria-label="Approval Workflow mockup"
                        >
                          <defs>
                            <linearGradient id="approvalGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#011937" />
                              <stop offset="100%" stopColor="#0d2749" />
                            </linearGradient>
                          </defs>
                          <rect width="400" height="200" fill="url(#approvalGrad)" />

                          {/* Status cards stacked */}
                          {/* Pending */}
                          <rect x="80" y="20" width="240" height="40" rx="8" fill="rgba(255,255,255,0.07)" />
                          <circle cx="104" cy="40" r="6" fill="#facc15" />
                          <text x="118" y="37" fill="rgba(255,255,255,0.8)" fontSize="10" fontFamily="sans-serif">Pending Review</text>
                          <text x="118" y="51" fill="rgba(255,255,255,0.4)" fontSize="8" fontFamily="sans-serif">12 records waiting</text>

                          {/* Arrow */}
                          <line x1="200" y1="62" x2="200" y2="78" stroke="rgba(255,108,1,0.5)" strokeWidth="2" />
                          <polygon points="194,76 200,84 206,76" fill="#ff6c01" />

                          {/* Approved */}
                          <rect x="80" y="86" width="240" height="40" rx="8" fill="rgba(255,255,255,0.07)" />
                          <circle cx="104" cy="106" r="6" fill="#4ade80" />
                          <text x="118" y="103" fill="rgba(255,255,255,0.8)" fontSize="10" fontFamily="sans-serif">Approved</text>
                          <text x="118" y="117" fill="rgba(255,255,255,0.4)" fontSize="8" fontFamily="sans-serif">8 records approved today</text>

                          {/* Arrow */}
                          <line x1="200" y1="128" x2="200" y2="144" stroke="rgba(255,108,1,0.5)" strokeWidth="2" />
                          <polygon points="194,142 200,150 206,142" fill="#ff6c01" />

                          {/* Rejected */}
                          <rect x="80" y="152" width="240" height="40" rx="8" fill="rgba(255,255,255,0.07)" />
                          <circle cx="104" cy="172" r="6" fill="#f87171" />
                          <text x="118" y="169" fill="rgba(255,255,255,0.8)" fontSize="10" fontFamily="sans-serif">Rejected</text>
                          <text x="118" y="183" fill="rgba(255,255,255,0.4)" fontSize="8" fontFamily="sans-serif">2 records need correction</text>
                        </svg>
                      </div>
                      <div className="px-4 py-3 bg-white border-t border-[#0d2749]/[0.06]">
                        <p className="font-[--font-heading] font-semibold text-[#0d2749] text-sm">
                          Approval Workflow
                        </p>
                      </div>
                    </div>

                    {/* Mockup 3: Report Builder */}
                    <div className="rounded-2xl overflow-hidden border border-[#0d2749]/[0.08]">
                      <div className="h-[200px]">
                        <svg
                          viewBox="0 0 400 200"
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-full h-full"
                          aria-label="Dynamic Report Builder mockup"
                        >
                          <defs>
                            <linearGradient id="reportGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#011937" />
                              <stop offset="100%" stopColor="#0d2749" />
                            </linearGradient>
                          </defs>
                          <rect width="400" height="200" fill="url(#reportGrad)" />

                          {/* Sidebar */}
                          <rect x="0" y="0" width="90" height="200" fill="rgba(0,0,0,0.25)" />
                          <text x="10" y="20" fill="rgba(255,255,255,0.5)" fontSize="7" fontFamily="sans-serif">REPORTS</text>
                          {[0, 1, 2, 3, 4].map((i) => (
                            <rect
                              key={i}
                              x="10"
                              y={30 + i * 28}
                              width="70"
                              height="18"
                              rx="4"
                              fill={i === 1 ? '#ff6c01' : 'rgba(255,255,255,0.07)'}
                            />
                          ))}
                          <text x="16" y="43" fill="rgba(255,255,255,0.35)" fontSize="7" fontFamily="sans-serif">Daily</text>
                          <text x="16" y="71" fill="rgba(255,255,255,0.9)" fontSize="7" fontFamily="sans-serif">Weekly</text>
                          <text x="16" y="99" fill="rgba(255,255,255,0.35)" fontSize="7" fontFamily="sans-serif">Monthly</text>
                          <text x="16" y="127" fill="rgba(255,255,255,0.35)" fontSize="7" fontFamily="sans-serif">Yield</text>
                          <text x="16" y="155" fill="rgba(255,255,255,0.35)" fontSize="7" fontFamily="sans-serif">OEE</text>

                          {/* Table area */}
                          {/* Header row */}
                          <rect x="100" y="16" width="290" height="24" rx="4" fill="#ff6c01" />
                          <text x="112" y="32" fill="white" fontSize="8" fontFamily="sans-serif" fontWeight="bold">Date</text>
                          <text x="190" y="32" fill="white" fontSize="8" fontFamily="sans-serif" fontWeight="bold">Yield%</text>
                          <text x="268" y="32" fill="white" fontSize="8" fontFamily="sans-serif" fontWeight="bold">Output</text>
                          <text x="340" y="32" fill="white" fontSize="8" fontFamily="sans-serif" fontWeight="bold">OEE%</text>

                          {/* Data rows */}
                          {[
                            ['01/05', '17.72', '1,250', '87.4'],
                            ['02/05', '17.45', '1,190', '85.1'],
                            ['03/05', '18.01', '1,310', '89.2'],
                            ['04/05', '17.88', '1,275', '88.0'],
                          ].map((row, i) => (
                            <g key={i}>
                              <rect
                                x="100"
                                y={44 + i * 26}
                                width="290"
                                height="22"
                                fill={i % 2 === 0 ? 'rgba(255,255,255,0.05)' : 'transparent'}
                              />
                              <text x="112" y={59 + i * 26} fill="rgba(255,255,255,0.7)" fontSize="8" fontFamily="sans-serif">{row[0]}</text>
                              <text x="190" y={59 + i * 26} fill="rgba(255,255,255,0.7)" fontSize="8" fontFamily="sans-serif">{row[1]}</text>
                              <text x="268" y={59 + i * 26} fill="rgba(255,255,255,0.7)" fontSize="8" fontFamily="sans-serif">{row[2]}</text>
                              <text x="340" y={59 + i * 26} fill="rgba(255,255,255,0.7)" fontSize="8" fontFamily="sans-serif">{row[3]}</text>
                            </g>
                          ))}

                          {/* Export button hint */}
                          <rect x="290" y="152" width="100" height="28" rx="6" fill="rgba(255,108,1,0.3)" />
                          <text x="340" y="170" fill="#ff6c01" fontSize="9" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">Export PDF</text>
                        </svg>
                      </div>
                      <div className="px-4 py-3 bg-white border-t border-[#0d2749]/[0.06]">
                        <p className="font-[--font-heading] font-semibold text-[#0d2749] text-sm">
                          Dynamic Report Builder
                        </p>
                      </div>
                    </div>

                  </div>
                </section>

                {/* F) Tech Stack ─────────────────────────────────── */}
                <section className="mb-12">
                  <h2 className="font-[--font-heading] font-bold text-[#0d2749] text-2xl mb-4">
                    Tech Stack
                  </h2>

                  <div className="mb-4">
                    <p className="text-xs text-gray-400 mb-2">Application</p>
                    <div className="flex flex-wrap gap-2">
                      {['Next.js 15', 'TypeScript', 'Prisma ORM', 'tRPC', 'Tailwind CSS', 'MUI'].map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full px-4 py-2 bg-[#0d2749] text-white text-sm font-medium font-[--font-heading]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 mb-2">Infrastructure</p>
                    <div className="flex flex-wrap gap-2">
                      {['PostgreSQL', 'Redis', 'PM2 Cluster', 'Caddy', 'Windows Server', 'Cloudflare'].map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full px-4 py-2 bg-[#0d2749] text-white text-sm font-medium font-[--font-heading]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </section>

                {/* G) Key Insight blockquote ─────────────────────── */}
                <section className="mb-12">
                  <blockquote
                    className="rounded-2xl p-8"
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(255,108,1,0.06) 0%, rgba(13,39,73,0.04) 100%)',
                      border: '1px solid rgba(255,108,1,0.15)',
                    }}
                  >
                    <p className="text-[#0d2749] font-medium text-lg italic leading-relaxed font-[--font-body]">
                      "การ migrate ที่เร็วที่สุด ไม่ใช่การเขียนโค้ดเร็ว — แต่คือการไม่ต้องเดาว่า workflow ควรเป็นอย่างไร เพราะ Phase 1 พิสูจน์มาแล้ว"
                    </p>
                  </blockquote>
                </section>

                {/* H) What's Next ────────────────────────────────── */}
                <section className="mb-12">
                  <div className="rounded-2xl p-6 bg-[#0d2749] text-white border border-white/[0.06]">
                    <Badge dot className="mb-3">Coming Next</Badge>
                    <h3 className="font-[--font-heading] font-semibold text-white text-xl mb-3">
                      Phase 3 — AI Layer Integration
                    </h3>
                    <p className="text-white/70 leading-relaxed">
                      ขั้นต่อไปคือการนำ AI เข้ามาวิเคราะห์ข้อมูลที่สะสมจาก 2 Phase — Anomaly detection, Auto-classification, Predictive maintenance ระบบพร้อมรองรับตั้งแต่วันที่ migrate
                    </p>
                  </div>
                </section>

                {/* I) CTA ───────────────────────────────────────── */}
                <div className="text-center">
                  <Link
                    href="/hire-us"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-[#ff6c01] text-white font-semibold text-lg rounded-xl hover:bg-[#d54e01] transition-colors"
                  >
                    มีระบบที่อยากยกระดับ? ปรึกษาฟรี →
                  </Link>
                </div>
              </article>

              {/* ── Sidebar ───────────────────────────────────────── */}
              <aside className="lg:sticky lg:top-28 lg:self-start">

                {/* Sidebar A: เกี่ยวกับโปรเจกต์นี้ */}
                <div className="rounded-2xl bg-[#f0f4f8] p-5 border border-[#0d2749]/[0.08] mb-6">
                  <h3 className="font-[--font-heading] font-semibold text-[#0d2749] text-base mb-4">
                    เกี่ยวกับโปรเจกต์นี้
                  </h3>
                  <dl>
                    {[
                      { term: 'Phase',    def: '2 — ต่อจาก Smart Factory' },
                      { term: 'Timeline', def: '4 สัปดาห์' },
                      { term: 'Focus',    def: 'Production Module' },
                      { term: 'Method',   def: 'Vibecoding (AI-Assisted)' },
                      { term: 'Server',   def: 'On-premise (Dell Precision)' },
                    ].map(({ term, def }) => (
                      <div key={term}>
                        <dt className="text-xs text-gray-400 uppercase tracking-wider">{term}</dt>
                        <dd className="text-sm text-[#0d2749] font-medium mb-3">{def}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                {/* Sidebar B: Case Study Series */}
                <div className="rounded-2xl bg-[#f0f4f8] p-5 border border-[#0d2749]/[0.08] mb-6">
                  <h3 className="font-[--font-heading] font-semibold text-[#0d2749] text-base mb-4">
                    อ่าน Case Study ทั้งหมด
                  </h3>
                  <Link
                    href="/showcase/smart-factory"
                    className="block py-3 group border border-[#0d2749]/[0.06] rounded-xl px-3 hover:border-[#ff6c01]/30 transition-colors"
                  >
                    <span className="inline-block text-[0.65rem] font-semibold px-2 py-0.5 rounded-full border mb-1.5 text-[#ff6c01] bg-[#ff6c01]/10 border-[#ff6c01]/20">
                      Phase 1
                    </span>
                    <p className="text-sm font-semibold text-[#0d2749] group-hover:text-[#ff6c01] transition-colors leading-snug mb-0.5">
                      Smart Factory Transformation
                    </p>
                    <p className="text-xs text-gray-400">
                      กระดาษ → Excel → AppSheet → Dashboard
                    </p>
                  </Link>
                </div>

                {/* Sidebar C: บทความที่เกี่ยวข้อง */}
                <div className="rounded-2xl bg-[#f0f4f8] p-5 border border-[#0d2749]/[0.08]">
                  <h3 className="font-[--font-heading] font-semibold text-[#0d2749] text-base mb-4">
                    บทความที่เกี่ยวข้อง
                  </h3>

                  {articles.length === 0 ? (
                    <p className="text-sm text-gray-400">ยังไม่มีบทความ</p>
                  ) : (
                    <div>
                      {articles.map((article, i) => {
                        const catStyle =
                          categoryColors[article.category] ??
                          'text-gray-500 bg-gray-100 border-gray-200'
                        const isLast = i === articles.length - 1
                        return (
                          <Link
                            key={article.slug}
                            href={`/knowledge/${article.slug}`}
                            className={[
                              'block py-3 group',
                              !isLast ? 'border-b border-[#0d2749]/[0.06]' : '',
                            ].join(' ')}
                          >
                            <span
                              className={`inline-block text-[0.65rem] font-semibold px-2 py-0.5 rounded-full border mb-1.5 ${catStyle}`}
                            >
                              {article.category}
                            </span>
                            <p className="text-sm font-semibold text-[#0d2749] group-hover:text-[#ff6c01] transition-colors leading-snug mb-1">
                              {article.title}
                            </p>
                            <p className="text-xs text-gray-400">{article.readTime} นาทีอ่าน</p>
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>

              </aside>

            </div>
          </div>
        </div>

      </main>
      <Footer />
    </>
  )
}
