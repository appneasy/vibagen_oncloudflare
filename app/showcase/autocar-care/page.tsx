import type { Metadata } from 'next'
import Navbar from '@/components/sections/Navbar'
import Footer from '@/components/sections/Footer'
import Badge from '@/components/ui/Badge'
import Link from 'next/link'
import { getAllArticleMeta } from '@/lib/mdx'

export const metadata: Metadata = {
  title: 'AutoCar Care — ระบบจัดการร้านคาร์แคร์ครบวงจร | VIBAGEN',
  description:
    'ระบบบริหารร้านคาร์แคร์ครบวงจร — LINE LIFF สำหรับลูกค้า, Web Admin สำหรับร้าน, Perpetual License เป็นเจ้าของข้อมูล 100%',
}

const categoryColors: Record<string, string> = {
  'Agentic AI':       'text-[#ff6c01] bg-[#ff6c01]/10 border-[#ff6c01]/20',
  'Vibecoding':       'text-blue-500 bg-blue-500/10 border-blue-500/20',
  'Business Digital': 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  'Maintenance':      'text-purple-500 bg-purple-500/10 border-purple-500/20',
  'Case Study':       'text-amber-500 bg-amber-500/10 border-amber-500/20',
}

export default function AutoCarCarePage() {
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

            <Badge dot className="mb-4">Case Study — Product</Badge>

            <h1
              className="font-[--font-heading] font-bold text-white mb-4"
              style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1.1 }}
            >
              AutoCar Care
            </h1>

            <p className="text-white/70 text-xl leading-relaxed mb-10 max-w-2xl">
              ระบบจัดการร้านคาร์แคร์ครบวงจร — สร้างใหม่ตั้งแต่ต้นด้วย Vibecoding
            </p>

            {/* Metadata row */}
            <div className="flex flex-wrap gap-x-8 gap-y-4">
              {/* Industry */}
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Industry</p>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-white text-sm font-medium">
                  Automotive Service
                </span>
              </div>
              {/* Model */}
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Model</p>
                <p className="text-white font-medium">Perpetual License</p>
              </div>
              {/* Interfaces */}
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Interfaces</p>
                <p className="text-white font-medium">3 (LINE LIFF + Web Admin + Public)</p>
              </div>
              {/* Method */}
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Method</p>
                <p className="text-white font-medium">Vibecoding (AI-Assisted)</p>
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

                {/* A) ปัญหาที่ร้านคาร์แคร์เจอทุกวัน ───────────── */}
                <section className="mb-12">
                  <h2 className="font-[--font-heading] font-bold text-[#0d2749] text-2xl mb-4">
                    ปัญหาที่ร้านคาร์แคร์เจอทุกวัน
                  </h2>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    ร้านคาร์แคร์ส่วนใหญ่เติบโตมาจากความชำนาญงาน ไม่ใช่จากระบบ — เจ้าของร้านเก่งเรื่องรถ แต่พอธุรกิจขยาย ข้อมูลที่กระจัดกระจายทำให้จัดการยากขึ้นทุกวัน ลูกค้าหลุด รายได้หาย โอกาสเติบโตถูกบล็อกด้วยปัญหาที่แก้ได้
                  </p>

                  {/* Problem card */}
                  <div className="rounded-2xl bg-[#f0f4f8] p-6 border border-[#0d2749]/[0.08]">
                    <ul className="space-y-4">
                      {[
                        'ข้อมูลลูกค้ากระจาย — สมุด, Excel, ความจำ ไม่มีระบบกลาง',
                        'ออกบิลช้า เสียเวลา — ใช้กระดาษ เขียนมือ ลูกค้ารอนาน',
                        'ลืมประวัติบริการ — ไม่รู้ว่าลูกค้าคนนี้เคยทำอะไรมาบ้าง',
                        'ติดตามลูกค้าไม่ได้ — ไม่รู้ว่าใครถึงเวลานัดเปลี่ยนถ่าย',
                        'ไม่รู้รายได้จริง — ตัวเลขไม่ชัด ตัดสินใจขยายกิจการยาก',
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

                {/* B) เริ่มจากร้าน ไม่ใช่จากระบบ ─────────────── */}
                <section className="mb-12">
                  <h2 className="font-[--font-heading] font-bold text-[#0d2749] text-2xl mb-4">
                    เริ่มจากร้าน ไม่ใช่จากระบบ
                  </h2>

                  {/* Daily reality story */}
                  <div
                    className="rounded-2xl p-6 mb-6"
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(13,39,73,0.04) 0%, rgba(255,108,1,0.04) 100%)',
                      border: '1px solid rgba(13,39,73,0.08)',
                    }}
                  >
                    <p className="text-gray-600 leading-relaxed mb-4">
                      เช้ามาเปิดร้าน ลูกค้าเข้ามาก็จดสมุด โทรนัดก็จำในหัว รายได้สรุปปลายเดือนค่อยมานั่งรวม — ยังทำงานได้ แต่พอลูกค้ามากขึ้น ช่างมากขึ้น งานเริ่มตกหล่น เริ่มลืมนัด เริ่มไม่รู้ว่ากำไรจริงเท่าไหร่
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                      AutoCar Care เกิดจากการทำงานร่วมกับเจ้าของอู่เล็กๆ ที่อยากเปลี่ยน แต่รู้ว่าถ้าวางระบบที่ซับซ้อนเกินไป คนในร้านก็ไม่ใช้ ระบบจึงถูกออกแบบจาก workflow จริงของร้าน — ไม่ใช่จากสิ่งที่ developer คิดว่าควรจะเป็น
                    </p>
                  </div>

                  {/* Adoption path — 3 steps */}
                  <h3 className="font-[--font-heading] font-semibold text-[#0d2749] text-lg mb-4">
                    ไม่ได้เปลี่ยนวันเดียว — ค่อยๆ เริ่มจากข้างใน
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Step 1 */}
                    <div className="bg-[#f0f4f8] rounded-2xl p-5 border border-[#0d2749]/[0.08]">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-7 h-7 rounded-full bg-[#0d2749] text-white text-xs font-bold flex items-center justify-center shrink-0">1</span>
                        <h4 className="font-[--font-heading] font-semibold text-[#0d2749] text-sm">ร้านใช้ก่อน</h4>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        เริ่มจาก staff บันทึกงานซ่อม ออกบิล ดูสต็อก ผ่าน Web Admin — ยังไม่ต้องแตะ LINE ยังไม่ต้องให้ลูกค้าเปลี่ยนพฤติกรรมอะไร
                      </p>
                    </div>

                    {/* Step 2 */}
                    <div className="bg-[#f0f4f8] rounded-2xl p-5 border border-[#0d2749]/[0.08]">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-7 h-7 rounded-full bg-[#0d2749] text-white text-xs font-bold flex items-center justify-center shrink-0">2</span>
                        <h4 className="font-[--font-heading] font-semibold text-[#0d2749] text-sm">Owner เห็นภาพ</h4>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        พอข้อมูลเข้าระบบ เจ้าของเริ่มเห็นรายได้ real-time เห็นว่าลูกค้าคนไหนมาบ่อย คนไหนหายไป — เริ่มเข้าใจว่าระบบช่วยอะไรได้
                      </p>
                    </div>

                    {/* Step 3 */}
                    <div className="rounded-2xl p-5 border border-[#ff6c01]/20" style={{ background: 'rgba(255,108,1,0.05)' }}>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-7 h-7 rounded-full bg-[#ff6c01] text-white text-xs font-bold flex items-center justify-center shrink-0">3</span>
                        <h4 className="font-[--font-heading] font-semibold text-[#0d2749] text-sm">ขยายไปลูกค้า</h4>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        พอ owner พร้อม ค่อยเปิด LINE LIFF ให้ลูกค้าจองคิว ดูสถานะ รับโปรโมชัน — ลูกค้าได้ประสบการณ์ที่ดี เพราะข้างในร้านพร้อมแล้ว
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-500 text-sm mt-4 italic">
                    ระบบจูนเข้าหาคน ไม่ใช่บังคับคนเข้าหาระบบ — เพราะคนพัฒนาเข้าใจ process องค์กร และ owner เข้าใจหน้างาน ทั้งสองฝั่งใช้เวลาร่วมกัน จึงได้ระบบที่คนใช้จริง
                  </p>
                </section>

                {/* C) ทำไมไม่ใช้ NoCode? ────────────────────────── */}
                <section className="mb-12">
                  <h2 className="font-[--font-heading] font-bold text-[#0d2749] text-2xl mb-4">
                    ทำไมไม่ใช้ NoCode?
                  </h2>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    AutoCar Care เป็นระบบที่ออกแบบสำหรับอุตสาหกรรมบริการรถยนต์โดยเฉพาะ — คนละ workflow คนละความต้องการจากโรงงาน เมื่อ AI-assisted development ทำให้สร้าง custom software ได้เร็วและคุ้มค่ากว่าเดิม จึงเลือกสร้างระบบเต็มรูปแบบตั้งแต่วันแรก
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* NoCode approach */}
                    <div className="flex-1 bg-gray-50 rounded-2xl p-5 border border-gray-200">
                      <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-4">แนวทาง NoCode</p>
                      <ul className="space-y-2.5">
                        {[
                          'ยืดหยุ่นจำกัด',
                          'ถูกผูกกับ platform',
                          'custom workflow ทำไม่ได้',
                        ].map((item) => (
                          <li key={item} className="flex items-start gap-2 text-sm text-gray-500">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0 mt-1.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Vibecoding approach */}
                    <div className="flex-1 bg-[#ff6c01]/5 rounded-2xl p-5 border border-[#ff6c01]/20">
                      <p className="text-[#ff6c01] text-xs uppercase tracking-wider font-semibold mb-4">แนวทาง Vibecoding</p>
                      <ul className="space-y-2.5">
                        {[
                          'ออกแบบ workflow ได้เองทั้งหมด',
                          'เป็นเจ้าของ source code',
                          'ขยายได้ไม่จำกัด',
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

                {/* C) ระบบ 3 Interfaces ──────────────────────────── */}
                <section className="mb-12">
                  <h2 className="font-[--font-heading] font-bold text-[#0d2749] text-2xl mb-4">
                    หนึ่งระบบ สาม Interface
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* LINE LIFF */}
                    <div className="bg-[#f0f4f8] rounded-2xl p-5 border border-[#0d2749]/[0.08]">
                      <div className="text-3xl mb-3" aria-hidden="true">📱</div>
                      <h3 className="font-[--font-heading] font-semibold text-[#0d2749] text-base mb-2">
                        LINE LIFF — ลูกค้า
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        จองคิว ดูสถานะ รับแจ้งเตือน ดูประวัติบริการ ผ่าน LINE ที่ใช้อยู่แล้ว ไม่ต้องติดตั้ง app เพิ่ม
                      </p>
                    </div>

                    {/* Web Admin */}
                    <div className="bg-[#ff6c01]/5 rounded-2xl p-5 border border-[#ff6c01]/20">
                      <div className="text-3xl mb-3" aria-hidden="true">💼</div>
                      <h3 className="font-[--font-heading] font-semibold text-[#0d2749] text-base mb-2">
                        Web Admin — ร้าน
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        จัดการคิว ซ่อม ล้าง สต็อก แคมเปญ ผ่าน browser บนคอม มือถือ iPad
                      </p>
                    </div>

                    {/* Public Tracking */}
                    <div className="bg-[#f0f4f8] rounded-2xl p-5 border border-[#0d2749]/[0.08]">
                      <div className="text-3xl mb-3" aria-hidden="true">🔗</div>
                      <h3 className="font-[--font-heading] font-semibold text-[#0d2749] text-base mb-2">
                        Public Tracking — ทุกคน
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        ลูกค้า walk-in ดูสถานะรถผ่าน link ไม่ต้อง login ไม่ต้องมี LINE
                      </p>
                    </div>
                  </div>
                </section>

                {/* D) Customer Journey ───────────────────────────── */}
                <section className="mb-12">
                  <h2 className="font-[--font-heading] font-bold text-[#0d2749] text-2xl mb-4">
                    เส้นทางของลูกค้า — จาก LINE ถึงรับรถ
                  </h2>

                  {/* Flow blocks */}
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    {['จองคิว', 'Check-in', 'ตรวจสภาพ (DVI)', 'ส่ง Estimate', 'ลูกค้า Approve', 'ดำเนินการ', 'QC', 'ส่งมอบ'].map(
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

                  <p className="text-gray-600 leading-relaxed">
                    ระบบ Digital Vehicle Inspection (DVI) ใช้ traffic light system (เขียว/เหลือง/แดง) ให้ช่างบันทึกสภาพรถทุกจุด สร้าง estimate อัตโนมัติ ส่งให้ลูกค้า approve ผ่าน LINE ก่อนเริ่มงาน — ไม่มีค่าใช้จ่ายเซอร์ไพรส์
                  </p>
                </section>

                {/* E) ฟีเจอร์หลัก ────────────────────────────────── */}
                <section className="mb-12">
                  <h2 className="font-[--font-heading] font-bold text-[#0d2749] text-2xl mb-6">
                    ฟีเจอร์หลัก
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* DVI + Estimate */}
                    <div className="bg-[#f0f4f8] rounded-2xl p-5 border border-[#0d2749]/[0.08]">
                      <div className="text-3xl mb-3" aria-hidden="true">🔍</div>
                      <h3 className="font-[--font-heading] font-semibold text-[#0d2749] text-base mb-2">
                        DVI + Estimate
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        ตรวจสภาพรถด้วยระบบ traffic light สร้าง estimate อัตโนมัติ ลูกค้า approve ผ่าน LINE ก่อนเริ่มงาน
                      </p>
                    </div>

                    {/* Parts & Inventory */}
                    <div className="bg-[#f0f4f8] rounded-2xl p-5 border border-[#0d2749]/[0.08]">
                      <div className="text-3xl mb-3" aria-hidden="true">📦</div>
                      <h3 className="font-[--font-heading] font-semibold text-[#0d2749] text-base mb-2">
                        Parts & Inventory
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        จัดการอะไหล่ สั่งซื้อ PO เบิกจ่าย หักสต็อกอัตโนมัติ เตือนเมื่อใกล้หมด
                      </p>
                    </div>

                    {/* Campaign & Loyalty */}
                    <div className="bg-[#f0f4f8] rounded-2xl p-5 border border-[#0d2749]/[0.08]">
                      <div className="text-3xl mb-3" aria-hidden="true">📣</div>
                      <h3 className="font-[--font-heading] font-semibold text-[#0d2749] text-base mb-2">
                        Campaign & Loyalty
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        ส่งโปรโมชัน แจ้งเตือน PM 50 templates พร้อมใช้ stamp cards คูปอง
                      </p>
                    </div>

                    {/* Revenue Dashboard */}
                    <div className="rounded-2xl p-5 border border-[#ff6c01]/20" style={{ background: 'rgba(255,108,1,0.05)' }}>
                      <div className="text-3xl mb-3" aria-hidden="true">📊</div>
                      <h3 className="font-[--font-heading] font-semibold text-[#0d2749] text-base mb-2">
                        Revenue Dashboard
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        รายได้วันนี้ สัปดาห์นี้ เดือนนี้ เปรียบเทียบรายงาน ดูได้ real-time ทุกอุปกรณ์
                      </p>
                    </div>
                  </div>
                </section>

                {/* F) SVG Mockup Screenshots ─────────────────────── */}
                <section className="mb-12">
                  <h2 className="font-[--font-heading] font-bold text-[#0d2749] text-2xl mb-6">
                    ตัวอย่างหน้าจอระบบ
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                    {/* Mockup 1: LINE LIFF Booking */}
                    <div className="rounded-2xl overflow-hidden border border-[#0d2749]/[0.08]">
                      <div className="h-[200px]">
                        <svg
                          viewBox="0 0 400 200"
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-full h-full"
                          aria-label="LINE LIFF Booking mockup"
                        >
                          <defs>
                            <linearGradient id="acLiffGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#011937" />
                              <stop offset="100%" stopColor="#0d2749" />
                            </linearGradient>
                          </defs>
                          <rect width="400" height="200" fill="url(#acLiffGrad)" />

                          {/* Phone outline */}
                          <rect x="140" y="12" width="120" height="176" rx="12" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />

                          {/* Phone header — "จองคิว" */}
                          <rect x="140" y="12" width="120" height="28" rx="12" fill="rgba(255,255,255,0.10)" />
                          <text x="200" y="30" fill="rgba(255,255,255,0.9)" fontSize="9" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">จองคิว</text>

                          {/* Date field */}
                          <rect x="152" y="48" width="96" height="18" rx="4" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
                          <text x="160" y="60" fill="rgba(255,255,255,0.4)" fontSize="7" fontFamily="sans-serif">วันที่</text>
                          <text x="232" y="60" fill="rgba(255,255,255,0.3)" fontSize="7" fontFamily="sans-serif" textAnchor="end">เลือกวัน ▾</text>

                          {/* Service type pills */}
                          <rect x="152" y="74" width="44" height="16" rx="8" fill="#ff6c01" />
                          <text x="174" y="85" fill="white" fontSize="7" fontFamily="sans-serif" textAnchor="middle">ซ่อม</text>
                          <rect x="200" y="74" width="44" height="16" rx="8" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                          <text x="222" y="85" fill="rgba(255,255,255,0.6)" fontSize="7" fontFamily="sans-serif" textAnchor="middle">ล้าง</text>

                          {/* Vehicle plate input */}
                          <rect x="152" y="98" width="96" height="18" rx="4" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
                          <text x="160" y="110" fill="rgba(255,255,255,0.4)" fontSize="7" fontFamily="sans-serif">ทะเบียนรถ</text>

                          {/* Time slot row */}
                          <rect x="152" y="124" width="27" height="14" rx="4" fill="rgba(255,255,255,0.08)" />
                          <text x="165" y="134" fill="rgba(255,255,255,0.4)" fontSize="6" fontFamily="sans-serif" textAnchor="middle">9:00</text>
                          <rect x="183" y="124" width="27" height="14" rx="4" fill="#ff6c01" />
                          <text x="196" y="134" fill="white" fontSize="6" fontFamily="sans-serif" textAnchor="middle">10:00</text>
                          <rect x="214" y="124" width="27" height="14" rx="4" fill="rgba(255,255,255,0.08)" />
                          <text x="227" y="134" fill="rgba(255,255,255,0.4)" fontSize="6" fontFamily="sans-serif" textAnchor="middle">11:00</text>

                          {/* Confirm button */}
                          <rect x="152" y="148" width="96" height="22" rx="6" fill="#ff6c01" />
                          <text x="200" y="162" fill="white" fontSize="8" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">ยืนยัน</text>
                        </svg>
                      </div>
                      <div className="px-4 py-3 bg-white border-t border-[#0d2749]/[0.06]">
                        <p className="font-[--font-heading] font-semibold text-[#0d2749] text-sm">
                          LINE LIFF Booking
                        </p>
                      </div>
                    </div>

                    {/* Mockup 2: DVI Inspection */}
                    <div className="rounded-2xl overflow-hidden border border-[#0d2749]/[0.08]">
                      <div className="h-[200px]">
                        <svg
                          viewBox="0 0 400 200"
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-full h-full"
                          aria-label="DVI Inspection mockup"
                        >
                          <defs>
                            <linearGradient id="acDviGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#011937" />
                              <stop offset="100%" stopColor="#0d2749" />
                            </linearGradient>
                          </defs>
                          <rect width="400" height="200" fill="url(#acDviGrad)" />

                          {/* Header */}
                          <text x="200" y="24" fill="rgba(255,255,255,0.9)" fontSize="11" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">Vehicle Inspection</text>
                          <line x1="20" y1="32" x2="380" y2="32" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

                          {/* Inspection rows */}
                          {[
                            { label: 'Engine Oil',  status: 'OK',      color: '#4ade80', y: 52  },
                            { label: 'Brake Pads',  status: 'OK',      color: '#4ade80', y: 80  },
                            { label: 'Tire Wear',   status: 'Monitor', color: '#facc15', y: 108 },
                            { label: 'Battery',     status: 'Replace', color: '#f87171', y: 136 },
                            { label: 'Coolant',     status: 'OK',      color: '#4ade80', y: 164 },
                          ].map((row) => (
                            <g key={row.label}>
                              <rect x="20" y={row.y - 12} width="360" height="22" rx="4" fill="rgba(255,255,255,0.04)" />
                              <circle cx="38" cy={row.y} r="6" fill={row.color} />
                              <text x="52" y={row.y + 4} fill="rgba(255,255,255,0.8)" fontSize="9" fontFamily="sans-serif">{row.label}</text>
                              <text x="370" y={row.y + 4} fill={row.color} fontSize="8" fontFamily="sans-serif" fontWeight="bold" textAnchor="end">{row.status}</text>
                            </g>
                          ))}

                          {/* Camera icon hint */}
                          <rect x="172" y="188" width="56" height="10" rx="3" fill="rgba(255,108,1,0.25)" />
                          <text x="200" y="196" fill="#ff6c01" fontSize="7" fontFamily="sans-serif" textAnchor="middle">+ Add Photo</text>
                        </svg>
                      </div>
                      <div className="px-4 py-3 bg-white border-t border-[#0d2749]/[0.06]">
                        <p className="font-[--font-heading] font-semibold text-[#0d2749] text-sm">
                          DVI Inspection
                        </p>
                      </div>
                    </div>

                    {/* Mockup 3: Admin Dashboard */}
                    <div className="rounded-2xl overflow-hidden border border-[#0d2749]/[0.08]">
                      <div className="h-[200px]">
                        <svg
                          viewBox="0 0 400 200"
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-full h-full"
                          aria-label="Admin Dashboard mockup"
                        >
                          <defs>
                            <linearGradient id="acDashGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#011937" />
                              <stop offset="100%" stopColor="#0d2749" />
                            </linearGradient>
                          </defs>
                          <rect width="400" height="200" fill="url(#acDashGrad)" />

                          {/* 3 stat cards top row */}
                          {/* Revenue */}
                          <rect x="14" y="14" width="112" height="44" rx="6" fill="rgba(255,255,255,0.07)" />
                          <text x="22" y="28" fill="rgba(255,255,255,0.45)" fontSize="7" fontFamily="sans-serif">Revenue</text>
                          <text x="22" y="46" fill="#ff6c01" fontSize="12" fontFamily="sans-serif" fontWeight="bold">฿48,200</text>

                          {/* Queue */}
                          <rect x="144" y="14" width="112" height="44" rx="6" fill="rgba(255,255,255,0.07)" />
                          <text x="152" y="28" fill="rgba(255,255,255,0.45)" fontSize="7" fontFamily="sans-serif">Queue</text>
                          <text x="152" y="46" fill="rgba(255,255,255,0.9)" fontSize="12" fontFamily="sans-serif" fontWeight="bold">23 คิว</text>

                          {/* Cars */}
                          <rect x="274" y="14" width="112" height="44" rx="6" fill="rgba(255,255,255,0.07)" />
                          <text x="282" y="28" fill="rgba(255,255,255,0.45)" fontSize="7" fontFamily="sans-serif">Cars</text>
                          <text x="282" y="46" fill="rgba(255,255,255,0.9)" fontSize="12" fontFamily="sans-serif" fontWeight="bold">847</text>

                          {/* Bar chart */}
                          {[
                            { x: 20,  h: 58, orange: false },
                            { x: 68,  h: 76, orange: false },
                            { x: 116, h: 48, orange: false },
                            { x: 164, h: 88, orange: false },
                            { x: 212, h: 66, orange: false },
                            { x: 260, h: 52, orange: false },
                            { x: 308, h: 92, orange: true  },
                          ].map((bar, i) => (
                            <rect
                              key={i}
                              x={bar.x}
                              y={162 - bar.h}
                              width="32"
                              height={bar.h}
                              rx="4"
                              fill={bar.orange ? '#ff6c01' : 'rgba(255,255,255,0.10)'}
                            />
                          ))}

                          {/* X-axis line */}
                          <line x1="14" y1="164" x2="356" y2="164" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                          <text x="356" y="174" fill="rgba(255,255,255,0.25)" fontSize="7" fontFamily="sans-serif" textAnchor="end">7 days</text>
                        </svg>
                      </div>
                      <div className="px-4 py-3 bg-white border-t border-[#0d2749]/[0.06]">
                        <p className="font-[--font-heading] font-semibold text-[#0d2749] text-sm">
                          Admin Dashboard
                        </p>
                      </div>
                    </div>

                  </div>
                </section>

                {/* G) Perpetual License ──────────────────────────── */}
                <section className="mb-12">
                  <h2 className="font-[--font-heading] font-bold text-[#0d2749] text-2xl mb-6">
                    Perpetual License — เป็นเจ้าของ ไม่ใช่ผู้เช่า
                  </h2>

                  <blockquote
                    className="rounded-2xl p-8 mb-6"
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(255,108,1,0.06) 0%, rgba(13,39,73,0.04) 100%)',
                      border: '1px solid rgba(255,108,1,0.15)',
                    }}
                  >
                    <p className="text-[#0d2749] font-medium text-lg italic leading-relaxed font-[--font-body]">
                      "ซื้อครั้งเดียว ใช้ได้ตลอด ข้อมูลเป็นของร้านคุณ 100%"
                    </p>
                  </blockquote>

                  <ul className="space-y-4">
                    {[
                      'Perpetual License — ไม่มี subscription รายเดือน',
                      'Data Ownership — ข้อมูลลูกค้า ประวัติ บิล เป็นของร้าน',
                      'Customizable — เพิ่ม feature ใหม่ได้ตามต้องการ',
                      'Thai Support — ติดต่อทางโทรศัพท์ LINE อีเมลได้',
                    ].map((benefit) => (
                      <li key={benefit} className="flex items-start gap-3">
                        <span
                          className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                          style={{ background: 'rgba(74,222,128,0.15)', color: '#16a34a' }}
                          aria-hidden="true"
                        >
                          ✅
                        </span>
                        <span className="text-gray-600 leading-relaxed">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* H) Tech Stack ─────────────────────────────────── */}
                <section className="mb-12">
                  <h2 className="font-[--font-heading] font-bold text-[#0d2749] text-2xl mb-4">
                    Tech Stack
                  </h2>

                  <div className="mb-4">
                    <p className="text-xs text-gray-400 mb-2">Application</p>
                    <div className="flex flex-wrap gap-2">
                      {['Next.js 15', 'TypeScript', 'Prisma ORM', 'tRPC', 'Tailwind CSS', 'LINE LIFF SDK'].map((tech) => (
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
                      {['PostgreSQL', 'Docker', 'Hetzner VPS', 'Caddy', 'GitHub Actions', 'Cloudflare'].map((tech) => (
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

                {/* I) Key Insight blockquote ─────────────────────── */}
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
                      "ร้านคาร์แคร์ไม่ต้องเลือกระหว่างระบบแพงกับไม่มีระบบอีกต่อไป — AI-assisted development ทำให้สร้างระบบ custom ที่ตรงกับ workflow จริง ในราคาที่ SME เอื้อมถึง"
                    </p>
                  </blockquote>
                </section>

                {/* J) CTA ───────────────────────────────────────── */}
                <div className="text-center">
                  <Link
                    href="/hire-us"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-[#ff6c01] text-white font-semibold text-lg rounded-xl hover:bg-[#d54e01] transition-colors"
                  >
                    สนใจระบบสำหรับร้านของคุณ? ปรึกษาฟรี →
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
                      { term: 'Industry',   def: 'ศูนย์บริการรถยนต์ (Automotive)' },
                      { term: 'Model',      def: 'Perpetual License' },
                      { term: 'Interfaces', def: '3 (LINE LIFF + Web + Public)' },
                      { term: 'Method',     def: 'Vibecoding (AI-Assisted)' },
                      { term: 'Stack',      def: 'Next.js, PostgreSQL, Docker' },
                    ].map(({ term, def }) => (
                      <div key={term}>
                        <dt className="text-xs text-gray-400 uppercase tracking-wider">{term}</dt>
                        <dd className="text-sm text-[#0d2749] font-medium mb-3">{def}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                {/* Sidebar B: Case Study อื่น */}
                <div className="rounded-2xl bg-[#f0f4f8] p-5 border border-[#0d2749]/[0.08] mb-6">
                  <h3 className="font-[--font-heading] font-semibold text-[#0d2749] text-base mb-4">
                    Case Study อื่น
                  </h3>

                  <Link
                    href="/showcase/smart-factory"
                    className="block py-3 group border border-[#0d2749]/[0.06] rounded-xl px-3 hover:border-[#ff6c01]/30 transition-colors mb-3"
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

                  <Link
                    href="/showcase/tmk-next-migration"
                    className="block py-3 group border border-[#0d2749]/[0.06] rounded-xl px-3 hover:border-[#ff6c01]/30 transition-colors"
                  >
                    <span className="inline-block text-[0.65rem] font-semibold px-2 py-0.5 rounded-full border mb-1.5 text-[#ff6c01] bg-[#ff6c01]/10 border-[#ff6c01]/20">
                      Phase 2
                    </span>
                    <p className="text-sm font-semibold text-[#0d2749] group-hover:text-[#ff6c01] transition-colors leading-snug mb-0.5">
                      AppSheet → Full-Stack ใน 4 สัปดาห์
                    </p>
                    <p className="text-xs text-gray-400">
                      foundation ดี + AI ช่วย
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
