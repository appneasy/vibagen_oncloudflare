import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'AutoCar Care — Sales Presentation',
  description:
    'ระบบจัดการอู่ซ่อมรถ + ล้างรถ ครบวงจร — ดูข้อมูลนำเสนอ ปัญหา ฟีเจอร์ ราคา และวิธีเริ่มต้นใช้งาน',
  alternates: { canonical: 'https://vibagen.com/autocar' },
  keywords: [
    'autocar care',
    'ระบบอู่ซ่อมรถ',
    'car care management',
    'perpetual license',
    'line liff',
    'ระบบคาร์แคร์',
    'sales presentation',
  ],
  openGraph: {
    title: 'AutoCar Care — ระบบจัดการอู่ซ่อม + ล้างรถ ครบวงจร',
    description:
      'Perpetual License — เป็นเจ้าของระบบ 100% ซ่อม + ล้าง + Loyalty ในระบบเดียว',
    url: 'https://vibagen.com/autocar',
    type: 'website',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'AutoCar Care',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description: 'ระบบจัดการอู่ซ่อมรถ + ล้างรถ ครบวงจร — Perpetual License',
  offers: {
    '@type': 'Offer',
    price: '29000',
    priceCurrency: 'THB',
    description: 'One-time perpetual license',
  },
  author: {
    '@type': 'Organization',
    name: 'VIBAGEN',
    url: 'https://vibagen.com',
  },
}

const problems = [
  { icon: '🗂️', title: 'ข้อมูลกระจาย', desc: 'ลูกค้าซ่อม + ลูกค้าล้าง แยกกัน ไม่เชื่อม ประวัติหายบ่อย' },
  { icon: '🧠', title: 'ลืมประวัติบริการ', desc: 'ลูกค้าคนเดียวกันทำหลายอย่าง ซ่อมมา ล้างมา บอกไม่ครบ' },
  { icon: '⏳', title: 'อนุมัติช้า + คิวยาว', desc: 'ซ่อมรอ approve ล้างรอนาน ลูกค้าหงุดจิต ร้านเสียรายได้' },
  { icon: '📦', title: 'Supply ล่ม', desc: 'อะไหล่ + วัสดุล้าง หมดไม่รู้ ซื้อด่วนแพง กำไรหาย' },
  { icon: '📊', title: 'ไม่รู้ภาพรวม', desc: 'แยกบัญชี 2 ฝั่ง ดูยาก ห่วงไม่อยู่ไม่ได้' },
]

const dailyCards = [
  { icon: '📱', title: 'รับรถ ซ่อมหรือล้าง ก็ได้', desc: 'Login ผ่าน LINE ไม่ต้องจำรหัส' },
  { icon: '👤', title: 'ลูกค้าคนเดียว รวมซ่อม+ล้าง', desc: 'รวมประวัติ 2 บริการในที่เดียว' },
  { icon: '🔄', title: 'ซ่อมเสร็จ → ล้างต่อได้เลย', desc: 'ไม่บังคับ workflow แบบเป๊ะๆ' },
  { icon: '⭐', title: 'Stamp Card รวม สะสมไว', desc: 'ช่างซื้อของ/ตั้งศูนย์ → บันทึกราคา' },
  { icon: '🏠', title: 'เจ้าของไม่อยู่ก็ได้', desc: 'ทีมทำงานต่อได้ตามสิทธิ์' },
]

const modules = [
  { icon: '👥', label: 'จัดการลูกค้า' },
  { icon: '📅', label: 'จองคิว' },
  { icon: '🔧', label: 'งานซ่อม' },
  { icon: '🚿', label: 'งานล้างรถ' },
  { icon: '🚗', label: 'ประวัติยานพาหนะ' },
  { icon: '🎫', label: 'Stamp + Coupon' },
  { icon: '🧾', label: 'ใบเสร็จ + การเงิน' },
  { icon: '📈', label: 'รายงาน Dashboard' },
]

const featuresCustomer = [
  { icon: '🔍', title: 'Customer Database', desc: 'ค้นหาจากเบอร์โทร ทะเบียนรถ ชื่อ ได้ในวินาที' },
  { icon: '📋', title: 'Vehicle History', desc: 'ทุกครั้งที่เข้าซ่อม ทำอะไร เปลี่ยนชิ้นไหน เก็บครบ' },
  { icon: '⭐', title: 'Combined Loyalty / Stamp Card รวม', desc: 'สะสมแต้มจากทั้งซ่อม + ล้าง' },
  { icon: '💚', title: 'LINE-Native Login', desc: 'ลูกค้า login ผ่าน LINE ไม่ต้องโหลดแอป ไม่ต้องจำรหัส' },
]

const featuresRepair = [
  { icon: '📄', title: 'ใบงานซ่อมดิจิทัล', desc: 'ค้นหาได้ ไม่หาย ไม่ต้องจดกระดาษ' },
  { icon: '📸', title: 'DVI ตรวจสภาพ + ภาพประกอบ', desc: 'มีหลักฐานก่อน-หลัง ลดข้อโต้แย้ง' },
  { icon: '✅', title: 'ใบเสนอราคา + อนุมัติผ่าน LINE', desc: 'ส่งลิงก์ให้ลูกค้ากดอนุมัติ ไม่ต้องโทรตาม' },
  { icon: '🔩', title: 'เบิกอะไหล่ + Parts Catalog 215+ รายการ', desc: 'หักสต็อคอัตโนมัติ + เตือนเมื่อใกล้หมด' },
  { icon: '🛡️', title: 'QC ก่อนส่งมอบ + Walk-in Pricing', desc: 'บันทึกทุกจุดตรวจ + ราคาทันทีสำหรับ walk-in' },
]

const featuresWash = [
  { icon: '⚡', title: 'เช็คอินไว', desc: 'เลือกรถ + ขนาด + แพ็กเกจ เริ่มได้ทันที' },
  { icon: '💰', title: 'ราคาตามขนาด (S/M/L/XL)', desc: 'Basic ฿200 / Premium ฿500 / Deluxe ฿1,500' },
  { icon: '📦', title: 'บันทึกวัสดุ / Supply Tracking', desc: 'Checklist ใช้แล้ว restock อัตโนมัติเมื่อต่ำ' },
  { icon: '🎫', title: 'Stamp Card + Coupon', desc: 'ล้างครบ X ครั้ง ได้ส่วนลด ใช้ได้ทั้ง online + walk-in' },
  { icon: '📤', title: 'Share Target Picker', desc: 'แชร์โปรให้เพื่อน ลูกค้าใหม่ฟรี ไม่ต้องจ่ายโฆษณา' },
]

const featuresReports = [
  { icon: '📊', title: 'Combined Dashboard', desc: 'เห็นรายได้ + จำนวนงาน ทั้งซ่อม + ล้าง ในหน้าเดียว' },
  { icon: '🔗', title: 'Cross-Service Analytics', desc: 'ลูกค้าซ่อมไหนใช้บริการล้างต่อ เห็นความสัมพันธ์' },
  { icon: '🏆', title: 'Top Customer Insights', desc: 'ใครใช้ทั้ง 2 บริการ ใช้จ่ายรวมเท่าไร' },
  { icon: '🥧', title: 'Service Mix Reports', desc: 'Repair X% / Wash Y% ปรับกลยุทธ์ได้' },
  { icon: '🔒', title: 'Owner-Only Financial Stats', desc: 'Revenue / Cost / Profit เห็นเฉพาะเจ้าของ' },
]

const licenseItems = [
  { icon: '♾️', title: 'ใช้งานได้ตลอดไป', desc: 'ซื้อครั้งเดียว ใช้ได้ตลอดอายุของร้าน ไม่ใช่เช่ารายเดือน' },
  { icon: '🏢', title: 'ข้อมูลเป็นของร้าน 100%', desc: 'ลูกค้า ประวัติซ่อม ใบงาน ภาพ ทั้งหมดเป็นของคุณ' },
  { icon: '🛡️', title: 'Bug ฟรี 60 วัน', desc: 'ตั้งแต่วันส่งมอบ เจอปัญหาแก้ฟรี' },
  { icon: '🎨', title: 'ปรับแต่งได้ตามใจ', desc: 'อยากเพิ่ม feature ใหม่ บอกได้ จ่ายตามงาน Tier S/M/L/XL' },
  { icon: '🇹🇭', title: 'Support ภาษาไทย', desc: 'ติดต่อได้ทางโทรศัพท์ / LINE / อีเมล' },
]

const careItems = [
  { icon: '🚀', title: 'Setup & Onboarding', desc: 'ติดตั้งระบบ โอนข้อมูลเก่า ตั้งค่าให้เหมาะกับอู่' },
  { icon: '🎓', title: 'Staff Training', desc: 'อบรม 1-2 ครั้ง คู่มือใช้งาน Help อยู่ในระบบทุกส่วน' },
  { icon: '🔧', title: 'Warranty + Maintenance', desc: 'รับประกัน 60 วันแรกฟรี Maintenance plan รายเดือน (เลือกเอง)' },
  { icon: '💡', title: 'Custom Development', desc: 'อยากเพิ่ม feature ใหม่ ทำได้ Quote ก่อนทำงาน' },
]

const steps = [
  { num: '01', title: 'Demo & Discuss', desc: 'ดู demo จริง สอบถามฟีเจอร์', duration: '1 day' },
  { num: '02', title: 'Quote & Plan', desc: 'เสนอแพ็กเกจที่เหมาะกับร้าน', duration: '2-3 days' },
  { num: '03', title: 'Sign Contract', desc: 'ตกลงสัญญา + งวดแรก ฿10,000', duration: '1 day' },
  { num: '04', title: 'Install & Train', desc: 'ติดตั้งระบบ ฝึกอบรมทีมงาน', duration: '3-7 days' },
  { num: '05', title: 'Go Live!', desc: 'ใช้งานทันที เราดูแลต่อเนื่อง', duration: '' },
]

const faqs = [
  { q: 'ระบบนี้เช่ารายเดือนหรือซื้อขาด?', a: 'ซื้อขาด ใช้ได้ตลอดไป ไม่บังคับต่ออายุ' },
  { q: 'ใช้ทั้ง repair + wash พร้อมกันได้ไหม?', a: 'ใช่ ทั้ง 2 module เปิดพร้อมกันได้' },
  { q: 'ข้อมูลลูกค้าใครเป็นเจ้าของ?', a: 'ร้านของคุณเป็นเจ้าของ 100%' },
  { q: 'ใช้บนคลาวด์หรือเครื่องที่ร้าน?', a: 'Cloud ผ่าน VPS 400-900 บาท/เดือน' },
  { q: 'ใช้กับมือถือ/iPad ได้ไหม?', a: 'ใช้ได้ทุกเครื่อง browser + LINE LIFF บนมือถือ' },
  { q: 'ต้องมีอินเทอร์เน็ตตลอดเวลาไหม?', a: 'ใช่ เน็ตบ้าน หรือ 4G/5G ใช้ได้' },
  { q: 'ปรับแต่งได้แค่ไหน?', a: 'ตามแพ็กเกจ Tier S/M/L/XL ใช้ได้ทั้ง 2 module' },
  { q: 'ปิด module ที่ไม่ใช้ได้ไหม?', a: 'ได้ เปิดปิดได้ตามต้องการ' },
]


export default function AutoCarPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── 1. Hero ── */}
      <section className="bg-gradient-to-br from-[#011937] to-[#0d2749] py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-1.5 mb-6">
            <span className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-[#0d2749] font-bold text-[10px]">AC</span>
            <span className="text-amber-400 text-sm font-medium">ประกาศเปิดตัว — AutoCar Care v2.0</span>
          </div>
          <h1 className="font-[--font-heading] font-bold text-4xl sm:text-5xl text-white mb-4 leading-tight">
            ระบบจัดการอู่ซ่อมรถ + ล้างรถ<br />
            <span className="text-amber-400">ครบวงจร ในระบบเดียว</span>
          </h1>
          <p className="font-[--font-body] text-white/70 text-lg mb-8 max-w-2xl mx-auto">
            เป็นเจ้าของระบบ 100% — Perpetual License จ่ายครั้งเดียว ไม่มีรายเดือนตลอดชีพ
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://demo.vibagen.com" target="_blank" rel="noopener noreferrer"
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-[#0d2749] font-semibold rounded-lg transition-colors font-[--font-heading]">
              ทดลอง Demo →
            </a>
            <a href="#pricing"
              className="px-6 py-3 border border-white/30 hover:border-amber-400/60 text-white rounded-lg transition-colors font-[--font-heading]">
              ดูราคา
            </a>
          </div>
          <div className="mt-12 grid grid-cols-3 gap-6 max-w-lg mx-auto">
            {[
              ['29,000บาท', 'Perpetual License'],
              ['3 ระบบ', 'ซ่อม + ล้าง + Loyalty'],
              ['< 3 วัน', 'ติดตั้งพร้อมใช้'],
            ].map(([val, label]) => (
              <div key={label} className="text-center">
                <div className="text-amber-400 font-bold text-xl font-[--font-heading]">{val}</div>
                <div className="text-white/60 text-xs font-[--font-body] mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. Problems ── */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="font-[--font-heading] font-medium text-amber-500 text-center mb-2">ปัญหาที่เจอบ่อย</p>
          <h2 className="font-[--font-heading] font-bold text-3xl text-[#0d2749] text-center mb-10">
            อู่ของคุณเป็นแบบนี้อยู่ไหม?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {problems.map((p) => (
              <div key={p.title} className="flex gap-3 p-5 rounded-xl border border-gray-100 bg-[#f8f9fc]">
                <span className="text-2xl flex-shrink-0">{p.icon}</span>
                <div>
                  <p className="font-[--font-heading] font-semibold text-[#0d2749] text-sm mb-1">{p.title}</p>
                  <p className="font-[--font-body] text-gray-500 text-sm leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Daily Operations ── */}
      <section className="bg-[#f8f9fc] py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="font-[--font-heading] font-medium text-amber-500 text-center mb-2">คุณต้องทำสิ่งเหล่านี้ทุกวัน</p>
          <h2 className="font-[--font-heading] font-bold text-3xl text-[#0d2749] text-center mb-10">
            งานประจำวันที่คุณต้องจัดการ
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dailyCards.map((c) => (
              <div key={c.title} className="p-5 rounded-xl bg-white border border-gray-100 shadow-sm">
                <div className="text-3xl mb-3">{c.icon}</div>
                <h3 className="font-[--font-heading] font-semibold text-[#0d2749] text-sm mb-1">{c.title}</h3>
                <p className="font-[--font-body] text-gray-500 text-sm leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Solution Overview ── */}
      <section className="bg-[#0d2749] py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="font-[--font-heading] font-medium text-amber-400 text-center mb-2">โมดูลทั้งหมด</p>
          <h2 className="font-[--font-heading] font-bold text-3xl text-white text-center mb-3">
            AutoCar Care ครอบคลุมอะไรบ้าง?
          </h2>
          <p className="font-[--font-body] text-white/60 text-center mb-10">
            หนึ่งระบบ ครอบทุกการจัดการอู่ซ่อม ล้างรถ และ Loyalty
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {modules.map((m) => (
              <div key={m.label} className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-amber-400/40 transition-colors">
                <div className="text-2xl mb-3">{m.icon}</div>
                <h3 className="font-[--font-heading] font-semibold text-white text-sm">{m.label}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Customer Features ── */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="font-[--font-heading] font-medium text-amber-500 text-center mb-2">ฟีเจอร์ลูกค้า</p>
          <h2 className="font-[--font-heading] font-bold text-3xl text-[#0d2749] text-center mb-10">
            ลูกค้าใช้ Line สะดวก ไม่ต้องโหลดแอป
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {featuresCustomer.map((f) => (
              <div key={f.title} className="flex gap-4 p-5 rounded-xl border border-gray-100 bg-[#f8f9fc]">
                <span className="text-3xl flex-shrink-0">{f.icon}</span>
                <div>
                  <h3 className="font-[--font-heading] font-semibold text-[#0d2749] mb-1">{f.title}</h3>
                  <p className="font-[--font-body] text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Repair Features ── */}
      <section className="bg-[#f8f9fc] py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="font-[--font-heading] font-medium text-amber-500 text-center mb-2">อู่ซ่อม</p>
          <h2 className="font-[--font-heading] font-bold text-3xl text-[#0d2749] text-center mb-10">
            จัดการงานซ่อมบำรุงเต็มระบบ
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuresRepair.map((f) => (
              <div key={f.title} className="p-5 rounded-xl bg-white border border-gray-100 shadow-sm">
                <div className="text-2xl mb-3">{f.icon}</div>
                <h3 className="font-[--font-heading] font-semibold text-[#0d2749] text-sm mb-1">{f.title}</h3>
                <p className="font-[--font-body] text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. Wash Features ── */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="font-[--font-heading] font-medium text-amber-500 text-center mb-2">บริการล้างรถ</p>
          <h2 className="font-[--font-heading] font-bold text-3xl text-[#0d2749] text-center mb-10">
            จัดคิว จองคิว เช็คอิน ครบในคลิกเดียว
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuresWash.map((f) => (
              <div key={f.title} className="p-5 rounded-xl border border-gray-100 bg-[#f8f9fc]">
                <div className="text-2xl mb-3">{f.icon}</div>
                <h3 className="font-[--font-heading] font-semibold text-[#0d2749] text-sm mb-1">{f.title}</h3>
                <p className="font-[--font-body] text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. Reports ── */}
      <section className="bg-[#f8f9fc] py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="font-[--font-heading] font-medium text-amber-500 text-center mb-2">รายงาน & วิเคราะห์</p>
          <h2 className="font-[--font-heading] font-bold text-3xl text-[#0d2749] text-center mb-10">
            ข้อมูลครบ ตัดสินใจได้ทันที
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuresReports.map((f) => (
              <div key={f.title} className="p-5 rounded-xl bg-white border border-gray-100 shadow-sm">
                <div className="text-2xl mb-3">{f.icon}</div>
                <h3 className="font-[--font-heading] font-semibold text-[#0d2749] text-sm mb-1">{f.title}</h3>
                <p className="font-[--font-body] text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. License — What You Get ── */}
      <section className="bg-[#0d2749] py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="font-[--font-heading] font-medium text-amber-400 text-center mb-2">คุณได้อะไร</p>
          <h2 className="font-[--font-heading] font-bold text-3xl text-white text-center mb-10">
            Perpetual License คืออะไร?
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {licenseItems.map((item) => (
              <div key={item.title} className="flex gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                <div>
                  <p className="font-[--font-heading] font-semibold text-amber-300 text-sm">{item.title}</p>
                  <p className="font-[--font-body] text-white/65 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. How We Take Care ── */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="font-[--font-heading] font-medium text-amber-500 text-center mb-2">หลังซื้อ</p>
          <h2 className="font-[--font-heading] font-bold text-3xl text-[#0d2749] text-center mb-10">
            เราดูแลคุณอย่างไร?
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {careItems.map((c) => (
              <div key={c.title} className="flex gap-4 p-5 rounded-xl border border-gray-100 bg-[#f8f9fc]">
                <span className="text-3xl flex-shrink-0">{c.icon}</span>
                <div>
                  <p className="font-[--font-heading] font-semibold text-[#0d2749] mb-1">{c.title}</p>
                  <p className="font-[--font-body] text-gray-500 text-sm leading-relaxed">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 11. Getting Started (5 steps) ── */}
      <section className="bg-[#f8f9fc] py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="font-[--font-heading] font-medium text-amber-500 text-center mb-2">เริ่มต้นใช้งาน</p>
          <h2 className="font-[--font-heading] font-bold text-3xl text-[#0d2749] text-center mb-10">
            5 ขั้นติดตั้งภายใน 3 วัน
          </h2>
          <div className="space-y-4">
            {steps.map((s, i) => (
              <div key={s.title} className="flex gap-4 items-start p-5 rounded-xl bg-white border border-gray-100 shadow-sm">
                <div className="w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center text-[#0d2749] font-bold text-sm flex-shrink-0 font-[--font-heading]">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-[--font-heading] font-semibold text-[#0d2749] mb-1">{s.title}</h3>
                  <p className="font-[--font-body] text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 12. Pricing ── */}
      <section id="pricing" className="bg-white py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="font-[--font-heading] font-medium text-amber-500 text-center mb-2">ราคา</p>
          <h2 className="font-[--font-heading] font-bold text-3xl text-[#0d2749] text-center mb-10">
            โปร่งแบบไม่มีเซอร์ไพร์ส์
          </h2>
          <div className="max-w-sm mx-auto rounded-2xl border-2 border-amber-400 overflow-hidden shadow-lg">
            <div className="bg-[#0d2749] px-8 py-6 text-center">
              <p className="font-[--font-heading] font-medium text-amber-400 text-sm mb-1">Perpetual License</p>
              <p className="font-[--font-heading] font-bold text-white text-5xl mb-1">29,000</p>
              <p className="font-[--font-body] text-white/60 text-sm">บาท — จ่ายครั้งเดียว</p>
            </div>
            <div className="bg-white px-8 py-6">
              <ul className="space-y-3 mb-6">
                {[
                  'ระบบซ่อม + ล้างรถ + Loyalty ครบ',
                  'Line LIFF + Web Admin',
                  'ติดตั้งบน Hosting ของเรา ไม่ต้องทำอะไร',
                  'อบรมจนใช้งานได้',
                  'Support 12 เดือน (ทีม LINE)',
                  'อัปเดต bug fix ฟรี',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 font-[--font-body] text-gray-700 text-sm">
                    <span className="text-amber-500 font-bold">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <a href="https://demo.vibagen.com" target="_blank" rel="noopener noreferrer"
                className="block w-full text-center py-3 bg-amber-500 hover:bg-amber-400 text-[#0d2749] font-semibold rounded-lg transition-colors font-[--font-heading]">
                ทดลอง Demo ก่อนตัดสินใจ
              </a>
              <p className="text-center text-gray-400 text-xs mt-3 font-[--font-body]">ทดลองได้เลย ไม่ต้องให้ข้อมูล</p>
            </div>
          </div>
          <p className="text-center text-gray-400 text-sm mt-6 font-[--font-body]">
            * ค่า Hosting รายปี ~3,600 บาท/ปี (หลังปีแรก) — ดูโมดูล Hosting ด้านล่าง
          </p>
        </div>
      </section>

      {/* ── 13. FAQ ── */}
      <section className="bg-[#f8f9fc] py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="font-[--font-heading] font-medium text-amber-500 text-center mb-2">คำถามที่พบบ่อย</p>
          <h2 className="font-[--font-heading] font-bold text-3xl text-[#0d2749] text-center mb-10">FAQ</h2>
          <div className="space-y-3">
            {faqs.map((f) => (
              <details key={f.q} className="group rounded-xl border border-gray-200 bg-white overflow-hidden">
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none font-[--font-heading] font-semibold text-[#0d2749] text-sm">
                  {f.q}
                  <span className="ml-4 flex-shrink-0 text-amber-500 group-open:rotate-45 transition-transform duration-200">+</span>
                </summary>
                <div className="px-5 pb-5 font-[--font-body] text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
                  {f.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── 14. CTA Demo ── */}
      <section className="bg-amber-500 py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-[--font-heading] font-bold text-3xl text-[#0d2749] mb-4">
            พร้อมเริ่มใช้งานแล้วหรือยัง?
          </h2>
          <p className="font-[--font-body] text-[#0d2749]/75 mb-8 text-lg">
            ทดลองใช้งานได้เลยตอนนี้ ไม่ต้องให้ข้อมูลใดๆ ทีมเราพร้อมอธิบาย
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://demo.vibagen.com" target="_blank" rel="noopener noreferrer"
              className="px-8 py-3 bg-[#0d2749] text-white font-semibold rounded-lg hover:bg-[#011937] transition-colors font-[--font-heading]">
              เข้าสู่ Demo
            </a>
            <a href="https://line.me/R/ti/p/@vibagen" target="_blank" rel="noopener noreferrer"
              className="px-8 py-3 border-2 border-[#0d2749]/30 text-[#0d2749] font-semibold rounded-lg hover:border-[#0d2749] transition-colors font-[--font-heading]">
              ติดต่อทีมผ่าน LINE
            </a>
          </div>
        </div>
      </section>

      {/* ── 15. Hosting ── */}
      <section className="bg-[#011937] py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="font-[--font-heading] font-medium text-amber-400 text-center mb-2">Infrastructure</p>
          <h2 className="font-[--font-heading] font-bold text-3xl text-white text-center mb-10">
            ระบบอยู่ที่ไหน?
          </h2>
          <div className="grid sm:grid-cols-3 gap-6 mb-10">
            {[
              ['☁️', 'Cloud Hosting', 'เราจัดการ Server ให้ คุณไม่ต้องดูแล Infrastructure เลย'],
              ['🔒', 'SSL & Security', 'HTTPS ทุกหน้า + บักอัปเดต เพัชชวะอัตโนมัติ'],
              ['📊', 'ค่าใช้จ่าย', '~3,600 บาท/ปี เริ่มตั้งแต่ปีที่ 2'],
            ].map(([icon, title, desc]) => (
              <div key={title} className="p-5 rounded-xl bg-white/5 border border-white/10 text-center">
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="font-[--font-heading] font-semibold text-amber-300 mb-2">{title}</h3>
                <p className="font-[--font-body] text-white/60 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-6 text-center">
            <p className="font-[--font-body] text-white/70 text-sm leading-relaxed">
              หรือเลือกทำบน Server ของตัวเองได้ — ระบบเป็น Docker-ready เคลื่อนย้ายได้ทุกเมื่อต้องการ
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
