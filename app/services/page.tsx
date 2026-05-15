import type { Metadata } from 'next'
import Navbar from '@/components/sections/Navbar'
import Services from '@/components/sections/Services'
import Footer from '@/components/sections/Footer'
import Badge from '@/components/ui/Badge'
import Tooltip from '@/components/ui/Tooltip'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'บริการ — สร้างระบบที่แก้ปัญหาจริง จบใน 30–60 วัน | VIBAGEN',
  description:
    'VIBAGEN สร้างระบบ Operation ภายในองค์กร, Platform สำหรับลูกค้า และ LINE Mini App — ส่งมอบใน 30–60 วัน คุณเป็นเจ้าของระบบ 100% ไม่มีค่า subscription รายเดือน',
  alternates: { canonical: 'https://vibagen.com/services' },
  keywords: ['บริการสร้างระบบ', 'perpetual license', 'mvp 30 วัน', 'line liff', 'erp integration', 'vibecoding', 'ระบบภายในองค์กร', 'software house ไทย'],
}

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">

        {/* ===== Navy dark section: Hero + จุดแข็ง ===== */}
        <div style={{ background: '#011937' }}>

          {/* Hero Header */}
          <div className="container pt-24 pb-14 text-center">
            <Badge dot className="mb-4">Services</Badge>
            <h1
              className="font-[--font-heading] font-bold text-white mb-4"
              style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}
            >
              บริการที่ช่วยแก้ปัญหาจริง
            </h1>
            <p className="text-white/60 max-w-2xl mx-auto text-lg leading-relaxed">
              ไม่ใช่ขาย software — แต่คือเข้าใจปัญหาของคุณ แล้วสร้างระบบที่แก้ปัญหานั้นจริงๆ
              จบใน 30–60 วัน ส่งมอบแล้วคุณเป็นเจ้าของ
            </p>
          </div>

          {/* จุดแข็งของเรา */}
          <div className="container pb-16">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

              {/* Card 01 */}
              <div className="rounded-2xl p-6 bg-white/[0.04] border border-white/[0.06]">
                <span
                  className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-4"
                  style={{ background: 'rgba(255,108,1,0.15)', color: '#ff6c01' }}
                >
                  01
                </span>
                <h3 className="font-[--font-heading] font-semibold text-white text-lg mb-2">
                  สร้างจากปัญหาจริง
                </h3>
                <p className="text-white/55 text-sm leading-relaxed">
                  ไม่ใช่ template สำเร็จรูป — เราฟังปัญหาของคุณก่อน แล้วออกแบบระบบจาก workflow จริง
                  ที่คนในองค์กรใช้ทุกวัน
                </p>
              </div>

              {/* Card 02 */}
              <div className="rounded-2xl p-6 bg-white/[0.04] border border-white/[0.06]">
                <span
                  className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-4"
                  style={{ background: 'rgba(255,108,1,0.15)', color: '#ff6c01' }}
                >
                  02
                </span>
                <h3 className="font-[--font-heading] font-semibold text-white text-lg mb-2">
                  จบใน 30–60 วัน
                </h3>
                <p className="text-white/55 text-sm leading-relaxed">
                  ส่งมอบ{' '}
                  <Tooltip term="mvp">MVP</Tooltip>
                  {' '}ที่ใช้งานได้จริงภายใน 30 วัน ระบบเต็มภายใน 60 วัน — ไม่มีโปรเจกต์ที่ลากยาวเป็นปี
                </p>
              </div>

              {/* Card 03 */}
              <div className="rounded-2xl p-6 bg-white/[0.04] border border-white/[0.06]">
                <span
                  className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-4"
                  style={{ background: 'rgba(255,108,1,0.15)', color: '#ff6c01' }}
                >
                  03
                </span>
                <h3 className="font-[--font-heading] font-semibold text-white text-lg mb-2">
                  ส่งมอบแล้วเป็นเจ้าของ
                </h3>
                <p className="text-white/55 text-sm leading-relaxed">
                  โมเดล{' '}
                  <Tooltip term="perpetual-license">Perpetual License</Tooltip>
                  {' '}— ซื้อขาด ข้อมูลเป็นของคุณ 100% ไม่ผูกกับ subscription รายเดือน
                </p>
              </div>

            </div>
          </div>

        </div>
        {/* ===== /Navy dark section ===== */}

        {/* Services Bento Grid — component has its own white bg-dots wrapper */}
        <Services />

        {/* ===== White bg-dots section: โมเดลการส่งมอบ + ขอบเขต ===== */}
        <div className="bg-dots">

          {/* โมเดลการส่งมอบ */}
          <section className="section" aria-labelledby="delivery-model-heading">
            <div className="container">

              <div className="text-center mb-12">
                <Badge dot className="mb-4">โมเดลการส่งมอบ</Badge>
                <h2
                  id="delivery-model-heading"
                  className="font-[--font-heading] font-bold text-[#0d2749] mb-4"
                  style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}
                >
                  โมเดลการส่งมอบ — สร้างให้จบ ส่งมอบให้จริง
                </h2>
                <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
                  เราไม่ส่งมอบแล้วหายไป — ทุกโปรเจกต์มีขั้นตอนที่ชัดเจน ตั้งแต่วันแรกจนถึงวันที่คุณ
                  จัดการระบบได้เอง
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                {/* Step 01 */}
                <div className="bg-[#f0f4f8] rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                      style={{ background: '#ff6c01' }}
                    >
                      01
                    </span>
                    <span className="text-xs text-gray-400 font-medium">1–2 สัปดาห์</span>
                  </div>
                  <h3 className="font-[--font-heading] font-semibold text-[#0d2749] text-lg mb-2">
                    เข้าใจปัญหา + ออกแบบ
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    ฟังปัญหาจริง วาด workflow ร่วมกัน ตกลง{' '}
                    <Tooltip term="stack">Stack</Tooltip>
                    {' '}และขอบเขตที่ชัดเจน ก่อนเขียนโค้ดบรรทัดแรก
                  </p>
                </div>

                {/* Step 02 */}
                <div
                  className="rounded-2xl p-6 border border-[#ff6c01]/20"
                  style={{ background: 'rgba(255,108,1,0.05)' }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                      style={{ background: '#ff6c01' }}
                    >
                      02
                    </span>
                    <span className="text-xs text-gray-400 font-medium">3–6 สัปดาห์</span>
                  </div>
                  <h3 className="font-[--font-heading] font-semibold text-[#0d2749] text-lg mb-2">
                    พัฒนา + ทดสอบ
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    ใช้{' '}
                    <Tooltip term="vibecoding">Vibecoding</Tooltip>
                    {' '}สร้างระบบ ทดสอบกับผู้ใช้จริงระหว่างทาง ไม่ใช่สร้างเสร็จแล้วค่อยลอง
                  </p>
                </div>

                {/* Step 03 */}
                <div className="bg-[#f0f4f8] rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                      style={{ background: '#ff6c01' }}
                    >
                      03
                    </span>
                    <span className="text-xs text-gray-400 font-medium">ต่อเนื่อง</span>
                  </div>
                  <h3 className="font-[--font-heading] font-semibold text-[#0d2749] text-lg mb-2">
                    ส่งมอบ + เรียนรู้ + จัดการเอง
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    ติดตั้ง ฝึกอบรม รับประกัน 60 วัน — หลังจากนั้นคุณจัดการระบบเองได้ ไม่ต้องพึ่งเราตลอด
                    ถ้าอยากเพิ่มฟีเจอร์ใหม่ก็กลับมาคุยได้เสมอ
                  </p>
                </div>

              </div>
            </div>
          </section>

          {/* ขอบเขตที่ชัดเจน */}
          <section className="section" aria-labelledby="scope-heading">
            <div className="container">

              <div className="text-center mb-12">
                <Badge dot className="mb-4">ขอบเขต</Badge>
                <h2
                  id="scope-heading"
                  className="font-[--font-heading] font-bold text-[#0d2749] mb-4"
                  style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}
                >
                  ขอบเขตที่ชัดเจน — เราไม่ทำทุกอย่าง
                </h2>
                <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
                  เราโฟกัสสิ่งที่ถนัดจริง เพื่อให้ทุกโปรเจกต์ได้คุณภาพสูงสุด
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">

                {/* Left — สิ่งที่เราทำ */}
                <div className="flex-1 bg-[#f0f4f8] rounded-2xl p-6">
                  <h3 className="font-[--font-heading] font-semibold text-[#0d2749] text-lg mb-5">
                    สิ่งที่เราทำ
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-gray-600 text-sm leading-relaxed">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold text-white" style={{ background: '#22c55e' }}>✓</span>
                      ระบบ operation ภายในองค์กร (จัดซื้อ, ผลิต, ซ่อมบำรุง, บริการ)
                    </li>
                    <li className="flex items-start gap-3 text-gray-600 text-sm leading-relaxed">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold text-white" style={{ background: '#22c55e' }}>✓</span>
                      Platform สำหรับลูกค้า (จองคิว, ดูสถานะ, ประวัติบริการ)
                    </li>
                    <li className="flex items-start gap-3 text-gray-600 text-sm leading-relaxed">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold text-white" style={{ background: '#22c55e' }}>✓</span>
                      เชื่อมต่อกับ{' '}
                      <Tooltip term="erp">ERP</Tooltip>
                      {' '}ที่มีอยู่ แบบไม่กระทบระบบเดิม
                    </li>
                    <li className="flex items-start gap-3 text-gray-600 text-sm leading-relaxed">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold text-white" style={{ background: '#22c55e' }}>✓</span>
                      Dashboard และ Report อัตโนมัติ
                    </li>
                    <li className="flex items-start gap-3 text-gray-600 text-sm leading-relaxed">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold text-white" style={{ background: '#22c55e' }}>✓</span>
                      <Tooltip term="line-liff">LINE LIFF</Tooltip>
                      {' '}Mini App สำหรับลูกค้าหรือทีมงาน
                    </li>
                  </ul>
                </div>

                {/* Right — สิ่งที่ไม่ใช่ขอบเขตของเรา */}
                <div className="flex-1 bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <h3 className="font-[--font-heading] font-semibold text-[#0d2749] text-lg mb-5">
                    สิ่งที่ไม่ใช่ขอบเขตของเรา
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-gray-400 text-sm leading-relaxed">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold text-white bg-gray-300">×</span>
                      ERP implementation ขนาดใหญ่ (SAP full suite, Oracle)
                    </li>
                    <li className="flex items-start gap-3 text-gray-400 text-sm leading-relaxed">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold text-white bg-gray-300">×</span>
                      Mobile App native (iOS/Android)
                    </li>
                    <li className="flex items-start gap-3 text-gray-400 text-sm leading-relaxed">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold text-white bg-gray-300">×</span>
                      Graphic Design / Branding
                    </li>
                    <li className="flex items-start gap-3 text-gray-400 text-sm leading-relaxed">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold text-white bg-gray-300">×</span>
                      E-commerce platform
                    </li>
                    <li className="flex items-start gap-3 text-gray-400 text-sm leading-relaxed">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold text-white bg-gray-300">×</span>
                      Social media marketing
                    </li>
                  </ul>
                </div>

              </div>
            </div>
          </section>

          {/* CTA */}
          <div className="container pb-20 text-center">
            <Link
              href="/hire-us"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#ff6c01] text-white font-semibold text-lg rounded-xl hover:bg-[#d54e01] transition-colors"
            >
              เล่าปัญหาของคุณให้เราฟัง →
            </Link>
          </div>

        </div>
        {/* ===== /White bg-dots section ===== */}

      </main>
      <Footer />
    </>
  )
}
