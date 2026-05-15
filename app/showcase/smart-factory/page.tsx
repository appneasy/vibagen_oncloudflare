import type { Metadata } from 'next'
import Navbar from '@/components/sections/Navbar'
import Footer from '@/components/sections/Footer'
import Badge from '@/components/ui/Badge'
import Link from 'next/link'
import { getAllArticleMeta } from '@/lib/mdx'

export const metadata: Metadata = {
  title: 'Smart Factory Transformation — Case Study | VIBAGEN',
  description:
    'จากกระดาษ → Excel → Google Sheets → Dashboard: บทเรียนจากการสร้าง 9 ระบบ Digitize ในโรงงานอุตสาหกรรมแปรรูปผลผลิตเกษตร ภายใน 3 เดือน',
  alternates: { canonical: 'https://vibagen.com/showcase/smart-factory' },
  keywords: ['smart factory', 'digital transformation', 'โรงงานอัจฉริยะ', 'ระบบโรงงาน', 'ระบบจัดการโรงงาน', 'appsheet', 'google sheets', 'looker dashboard', 'manufacturing', 'ระบบหลังบ้านโรงงาน'],
  openGraph: {
    title: 'Smart Factory Transformation — Case Study',
    description: 'จากกระดาษ → Excel → Google Sheets → Dashboard ภายใน 3 เดือน',
    url: 'https://vibagen.com/showcase/smart-factory',
    type: 'article',
  },
}

const categoryColors: Record<string, string> = {
  'Agentic AI':       'text-[#ff6c01] bg-[#ff6c01]/10 border-[#ff6c01]/20',
  'Vibecoding':       'text-blue-500 bg-blue-500/10 border-blue-500/20',
  'Business Digital': 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  'Maintenance':      'text-purple-500 bg-purple-500/10 border-purple-500/20',
  'Case Study':       'text-amber-500 bg-amber-500/10 border-amber-500/20',
}

export default function SmartFactoryPage() {
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

            <Badge dot className="mb-4">Case Study</Badge>

            <h1
              className="font-[--font-heading] font-bold text-white mb-4"
              style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1.1 }}
            >
              Smart Factory Transformation
            </h1>

            <p className="text-white/70 text-xl leading-relaxed mb-10 max-w-2xl">
              จากกระดาษ → Excel → Google Sheets → Dashboard ที่ทุกคนใช้ได้
            </p>

            {/* Metadata row */}
            <div className="flex flex-wrap gap-x-8 gap-y-4">
              {/* Industry */}
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Industry</p>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-white text-sm font-medium">
                  Manufacturing
                </span>
              </div>
              {/* Timeline */}
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Timeline</p>
                <p className="text-white font-medium">3 เดือน</p>
              </div>
              {/* Systems */}
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Systems</p>
                <p className="text-white font-medium">9 ระบบ</p>
              </div>
              {/* Model */}
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Model</p>
                <p className="text-white font-medium">Custom Project</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Main Content ──────────────────────────────────────── */}
        <div className="bg-dots" style={{ background: '#ffffff' }}>
          <div className="container py-16">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">

              {/* ── Article column ─────────────────────────────── */}
              <article>

                {/* A) ปัญหาเดิม ───────────────────────────────── */}
                <section className="mb-12">
                  <h2 className="font-[--font-heading] font-bold text-[#0d2749] text-2xl mb-4">
                    ปัญหาเดิม — ข้อมูลกระจาย ไม่มีที่เดียวที่เชื่อถือได้
                  </h2>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    โรงงานอุตสาหกรรมแปรรูปผลผลิตเกษตรแห่งหนึ่งในภาคใต้ เคยใช้เวลาหลายชั่วโมงต่อวันในการรวบรวมข้อมูลจาก Excel หลายไฟล์ และทำรายงานสรุปด้วยมือ
                  </p>

                  {/* Problem card */}
                  <div className="rounded-2xl bg-[#f0f4f8] p-6 border border-[#0d2749]/[0.08]">
                    <ul className="space-y-4">
                      {[
                        'ข้อมูล Production, Quality, Maintenance กระจายอยู่ใน Excel หลายไฟล์',
                        'บันทึกจากกระดาษ → ถ่ายลง Excel → ทำสรุปมือ → สูญเสียเวลา',
                        'ไม่มีระบบ approve / ตรวจสอบ ก่อนข้อมูลเข้า dashboard',
                        'ไม่สามารถดู KPI แบบ real-time ได้',
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

                {/* B) Migration Timeline ─────────────────────────── */}
                <section className="mb-12">
                  <h2 className="font-[--font-heading] font-bold text-[#0d2749] text-2xl mb-6">
                    เส้นทางการ Migrate
                  </h2>

                  {/* Desktop: horizontal | Mobile: vertical stack */}
                  <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-0">
                    {[
                      {
                        icon: '📄',
                        label: 'กระดาษ / Logsheet',
                        sub: 'บันทึกด้วยมือทุกวัน',
                        active: false,
                      },
                      {
                        icon: '📊',
                        label: 'Excel / Spreadsheet',
                        sub: 'กระจายหลายไฟล์ หลายแท็บ',
                        active: false,
                      },
                      {
                        icon: '📱',
                        label: 'AppSheet + Google Sheets',
                        sub: 'ทีมหน้างานบันทึกผ่านมือถือ',
                        active: true,
                      },
                      {
                        icon: '📈',
                        label: 'Looker Dashboard',
                        sub: 'ผู้บริหารดู KPI real-time',
                        active: true,
                      },
                    ].map((step, i, arr) => (
                      <div key={step.label} className="flex flex-col sm:flex-row items-center w-full sm:w-auto sm:flex-1">
                        {/* Step card */}
                        <div
                          className={[
                            'rounded-xl p-4 text-center w-full sm:w-auto flex-1',
                            step.active
                              ? 'bg-[#ff6c01]/5 border border-[#ff6c01]/20'
                              : 'bg-gray-100 border border-transparent',
                          ].join(' ')}
                        >
                          <div className="text-2xl mb-2">{step.icon}</div>
                          <p
                            className={[
                              'font-[--font-heading] font-semibold text-sm',
                              step.active ? 'text-[#0d2749]' : 'text-gray-400',
                            ].join(' ')}
                          >
                            {step.label}
                          </p>
                          <p
                            className={[
                              'text-xs mt-1',
                              step.active ? 'text-gray-500' : 'text-gray-400',
                            ].join(' ')}
                          >
                            {step.sub}
                          </p>
                        </div>

                        {/* Arrow — hidden on last item, hidden on mobile */}
                        {i < arr.length - 1 && (
                          <span
                            className="hidden sm:block text-[#ff6c01] text-xl mx-2 shrink-0"
                            aria-hidden="true"
                          >
                            →
                          </span>
                        )}
                        {/* Arrow for mobile (vertical) */}
                        {i < arr.length - 1 && (
                          <span
                            className="sm:hidden text-[#ff6c01] text-xl my-1 shrink-0 rotate-90"
                            aria-hidden="true"
                          >
                            →
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                {/* C) Data Flow ──────────────────────────────────── */}
                <section className="mb-12">
                  <h2 className="font-[--font-heading] font-bold text-[#0d2749] text-2xl mb-4">
                    แนวทาง — เปลี่ยนวิธีจัดการข้อมูลตั้งแต่ต้นทาง
                  </h2>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    แทนที่จะพยายามรวม Excel ที่กระจาย เราออกแบบ flow ใหม่ตั้งแต่จุดเก็บข้อมูล ให้ข้อมูลผ่านกระบวนการควบคุมคุณภาพก่อนเข้า Dashboard
                  </p>

                  {/* Flow blocks */}
                  <div className="flex flex-wrap items-center gap-3">
                    {['Data Collection', 'Data Validation', 'Data Approve', 'Summary Report'].map(
                      (block, i, arr) => (
                        <div key={block} className="flex items-center gap-3">
                          <span className="rounded-lg bg-[#0d2749] text-white px-4 py-2 text-sm font-medium font-[--font-heading]">
                            {block}
                          </span>
                          {i < arr.length - 1 && (
                            <span className="text-[#ff6c01] text-xl font-bold" aria-hidden="true">
                              →
                            </span>
                          )}
                        </div>
                      ),
                    )}
                  </div>
                </section>

                {/* D) ระบบที่สร้าง ────────────────────────────────── */}
                <section className="mb-12">
                  <h2 className="font-[--font-heading] font-bold text-[#0d2749] text-2xl mb-6">
                    ระบบที่สร้าง — Production, LAB, LINE LIFF
                  </h2>

                  {/* Card 1: Production */}
                  <div className="rounded-2xl bg-[#f0f4f8] p-6 border border-[#0d2749]/[0.08] mb-6 flex flex-col sm:flex-row gap-6">
                    {/* Phone frame */}
                    <div className="w-[120px] h-[213px] rounded-xl border-2 border-[#0d2749]/15 overflow-hidden bg-white shadow-md shrink-0 mx-auto sm:mx-0">
                      <img
                        src="/images/sf-production.png"
                        alt="Production Data System screenshot"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    {/* Text */}
                    <div className="flex-1">
                      <h3 className="font-[--font-heading] font-semibold text-[#0d2749] text-lg mb-2">
                        Production Data Collection
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-sm mb-4">
                        ระบบบันทึกข้อมูลการผลิต กำลังผลิต ประสิทธิภาพ ผ่าน AppSheet บนมือถือ ข้อมูลผ่าน Validate → Approve ก่อนเข้า Dashboard อัตโนมัติ รายงาน Yield, OEE, Input-Output แบบ real-time
                      </p>
                      <ul className="space-y-1.5">
                        {[
                          'Production Performance & Fruit W/M',
                          'FFB / Yield / CPO Tracking',
                          'Daily → Weekly → Monthly Summary',
                        ].map((feat) => (
                          <li key={feat} className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#ff6c01] shrink-0" />
                            {feat}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Card 2: LAB */}
                  <div className="rounded-2xl bg-[#f0f4f8] p-6 border border-[#0d2749]/[0.08] mb-6 flex flex-col sm:flex-row gap-6">
                    <div className="w-[120px] h-[213px] rounded-xl border-2 border-[#0d2749]/15 overflow-hidden bg-white shadow-md shrink-0 mx-auto sm:mx-0">
                      <img
                        src="/images/sf-lab-yield.png"
                        alt="LAB Quality Control screenshot"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-[--font-heading] font-semibold text-[#0d2749] text-lg mb-2">
                        LAB / Quality Control
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-sm mb-4">
                        ระบบบันทึกค่าควบคุมคุณภาพจาก LAB — %Yield น้ำมัน CPO, Yield Kernel, ค่า Loss ของกระบวนการผลิต ข้อมูลแสดงผลแบบ real-time เปรียบเทียบรายวัน
                      </p>
                      <ul className="space-y-1.5">
                        {[
                          '%Yield CPO / Kernel รายวัน',
                          'Quality Control Parameters',
                          'เปรียบเทียบ Trend ย้อนหลัง',
                        ].map((feat) => (
                          <li key={feat} className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#ff6c01] shrink-0" />
                            {feat}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Card 3: LINE LIFF */}
                  <div className="rounded-2xl bg-[#f0f4f8] p-6 border border-[#0d2749]/[0.08] mb-6 flex flex-col sm:flex-row gap-6">
                    <div className="w-[120px] h-[213px] rounded-xl border-2 border-[#0d2749]/15 overflow-hidden bg-white shadow-md shrink-0 mx-auto sm:mx-0">
                      <img
                        src="/images/sf-line-liff.png"
                        alt="LINE LIFF Dashboard screenshot"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-[--font-heading] font-semibold text-[#0d2749] text-lg mb-2">
                        LINE LIFF Dashboard
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-sm mb-4">
                        Dashboard ที่เข้าถึงได้ผ่าน LINE ไม่ต้องติดตั้ง App เพิ่ม ทีมงานทุกระดับเข้าดู KPI, ค่าซ่อมบำรุง, ชั่วโมงเครื่องจักร, รายงานสัปดาห์ ได้จากมือถือทันที
                      </p>
                      <ul className="space-y-1.5">
                        {[
                          'เข้าถึงผ่าน LINE ที่ใช้อยู่แล้ว',
                          'KPI Dashboard + ค่าซ่อมบำรุง',
                          'ชั่วโมงเครื่องจักร + รายงานสัปดาห์',
                        ].map((feat) => (
                          <li key={feat} className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#ff6c01] shrink-0" />
                            {feat}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>

                {/* E) Tech Stack ─────────────────────────────────── */}
                <section className="mb-12">
                  <h2 className="font-[--font-heading] font-bold text-[#0d2749] text-2xl mb-4">
                    Tech Stack ที่ใช้
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {[
                      'AppSheet',
                      'Google Sheets + Apps Script',
                      'Looker Studio',
                      'LINE Message API',
                      'SAP B1 Integration',
                    ].map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full px-4 py-2 bg-[#0d2749] text-white text-sm font-medium font-[--font-heading]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </section>

                {/* F) ผลลัพธ์ ────────────────────────────────────── */}
                <section className="mb-12">
                  <h2 className="font-[--font-heading] font-bold text-[#0d2749] text-2xl mb-6">
                    ผลลัพธ์
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    {[
                      { value: '>30%', label: 'ลดงานซ้ำซ้อน' },
                      { value: '9',    label: 'ระบบที่สร้าง' },
                      { value: 'Real-time', label: 'KPI Dashboard' },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-2xl p-6 text-center"
                        style={{ background: 'rgba(255,108,1,0.05)', border: '1px solid rgba(255,108,1,0.15)' }}
                      >
                        <p className="text-3xl font-bold text-[#ff6c01] font-[--font-heading] mb-1">
                          {stat.value}
                        </p>
                        <p className="text-sm text-gray-500">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  <p className="text-gray-600 leading-relaxed">
                    ผู้บริหารเข้าถึง KPI แบบ real-time ได้จากทุกอุปกรณ์ ทีมงานทุกระดับใช้งานได้ ไม่ต้องมีความรู้ IT
                  </p>
                </section>

                {/* G) Key Takeaway quote ─────────────────────────── */}
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
                      "วิธีการเดิมแม้จะตอบโจทย์เบื้องต้นได้ดี แต่มีข้อจำกัดในการนำข้อมูลไปใช้เชิงวิเคราะห์ การปรับเปลี่ยนไปใช้ระบบที่มีโครงสร้างข้อมูลเป็นระเบียบตั้งแต่เริ่มต้น ช่วยรองรับการวิเคราะห์อย่างรวดเร็ว"
                    </p>
                  </blockquote>
                </section>

                {/* H) CTA ───────────────────────────────────────── */}
                <div className="text-center">
                  <Link
                    href="/hire-us"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-[#ff6c01] text-white font-semibold text-lg rounded-xl hover:bg-[#d54e01] transition-colors"
                  >
                    มีโปรเจกต์ที่อยากปรับระบบ? ปรึกษาฟรี →
                  </Link>
                </div>
              </article>

              {/* ── Sidebar ───────────────────────────────────────── */}
              <aside className="lg:sticky lg:top-28 lg:self-start">

                {/* Sidebar A: About this project */}
                <div className="rounded-2xl bg-[#f0f4f8] p-5 border border-[#0d2749]/[0.08] mb-6">
                  <h3 className="font-[--font-heading] font-semibold text-[#0d2749] text-base mb-4">
                    เกี่ยวกับโปรเจกต์นี้
                  </h3>
                  <dl>
                    {[
                      { term: 'Industry', def: 'อุตสาหกรรมแปรรูปผลผลิตเกษตร' },
                      { term: 'Timeline', def: '3 เดือน' },
                      { term: 'Systems',  def: '9 ระบบ' },
                      { term: 'Model',    def: 'Custom Project' },
                      { term: 'Stack',    def: 'AppSheet, Google Sheets, Looker' },
                    ].map(({ term, def }) => (
                      <div key={term}>
                        <dt className="text-xs text-gray-400 uppercase tracking-wider">{term}</dt>
                        <dd className="text-sm text-[#0d2749] font-medium mb-3">{def}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                {/* Sidebar B: Related Articles */}
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
                            {/* Category badge */}
                            <span
                              className={`inline-block text-[0.65rem] font-semibold px-2 py-0.5 rounded-full border mb-1.5 ${catStyle}`}
                            >
                              {article.category}
                            </span>
                            {/* Title */}
                            <p className="text-sm font-semibold text-[#0d2749] group-hover:text-[#ff6c01] transition-colors leading-snug mb-1">
                              {article.title}
                            </p>
                            {/* Read time */}
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
