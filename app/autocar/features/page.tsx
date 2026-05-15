import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ฟีเจอร์ทั้งหมด — AutoCar Care',
  description: 'ฟีเจอร์ 120+ รายการ — จองคิว ติดตามงานซ่อม สต็อกอะไหล่ CRM ลูกค้า สะสมแต้ม โปรโมชั่น แยกตาม 4 บทบาท Admin ช่าง ลูกค้า เจ้าของ',
  alternates: { canonical: 'https://vibagen.com/autocar/features' },
  keywords: ['autocar care features', 'ฟีเจอร์ระบบอู่ซ่อมรถ', 'ระบบจองคิวซ่อมรถ', 'ระบบติดตามงานซ่อม', 'ระบบสต็อกอะไหล่', 'ระบบ CRM อู่ซ่อมรถ', 'ระบบสะสมแต้มร้านล้างรถ', 'ระบบนัดหมายอู่ซ่อมรถ', 'โปรแกรมร้านยาง', 'car care features', 'line liff features', 'role-based access'],
  openGraph: {
    title: 'ฟีเจอร์ทั้งหมด — AutoCar Care',
    description: '120+ ฟีเจอร์ แยกตาม 4 บทบาท',
    url: 'https://vibagen.com/autocar/features',
    type: 'website',
  },
}

function FeatureCard({ title, items, accent }: { title: string; items: string[]; accent: string }) {
  return (
    <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
      <div className={'h-1 w-full ' + accent} />
      <div className="p-6">
        <h4 className="font-[--font-heading] font-semibold text-base mb-3" style={{ color: '#0d2749' }}>{title}</h4>
        <ul className="space-y-1.5">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-600 font-[--font-body]">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function FeatureCardLight({ title, items, accent }: { title: string; items: string[]; accent: string }) {
  return (
    <div className="bg-[#f0f4f8] rounded-2xl overflow-hidden">
      <div className={'h-1 w-full ' + accent} />
      <div className="p-6">
        <h4 className="font-[--font-heading] font-semibold text-base mb-3" style={{ color: '#0d2749' }}>{title}</h4>
        <ul className="space-y-1.5">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-600 font-[--font-body]">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function HiddenBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs bg-red-50 text-red-500 border border-red-200 rounded px-2 py-0.5 font-[--font-body]">
      🚫 {label}
    </span>
  )
}

export default function FeaturesPage() {
  return (
    <>
      <section style={{ backgroundColor: '#011937' }} className="text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-sm font-[--font-body] text-white/80">Role-Based Feature Matrix</span>
          </div>
          <h1 className="font-[--font-heading] font-bold text-4xl sm:text-5xl leading-tight mb-4">ทุกฟีเจอร์ ในระบบเดียว</h1>
          <p className="font-[--font-body] text-lg text-white/70 mb-12 max-w-2xl mx-auto">รายการฟีเจอร์ครบครัน แยกตามบทบาทผู้ใช้</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[{ value: '120+', label: 'Features' },{ value: '4', label: 'Roles' },{ value: '2', label: 'Modules' },{ value: '✓', label: 'Production-ready' }].map((s) => (
              <div key={s.label} className="bg-white/10 border border-white/15 rounded-2xl px-4 py-5 text-center">
                <p className="font-[--font-heading] font-bold text-3xl" style={{ color: '#F59E0B' }}>{s.value}</p>
                <p className="font-[--font-body] text-sm text-white/70 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center mb-12">
            <h2 className="font-[--font-heading] font-bold text-3xl sm:text-4xl mb-3" style={{ color: '#0d2749' }}>ใครเห็นอะไรบ้าง?</h2>
            <p className="font-[--font-body] text-gray-500">แต่ละบทบาทได้รับสิทธิ์เข้าถึงข้อมูลเฉพาะส่วนที่จำเป็น</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#f0f4f8] rounded-2xl p-6 border-l-4 border-blue-500">
              <div className="text-4xl mb-3">👤</div>
              <span className="inline-block text-xs font-[--font-body] border rounded px-2 py-0.5 mb-3 bg-blue-50 text-blue-700 border-blue-200">Customer</span>
              <h3 className="font-[--font-heading] font-semibold text-lg mb-1" style={{ color: '#0d2749' }}>ลูกค้า / เจ้าของรถ</h3>
              <p className="font-[--font-body] text-sm text-gray-500">เข้าผ่าน LINE LIFF</p>
            </div>
            <div className="bg-[#f0f4f8] rounded-2xl p-6 border-l-4 border-orange-500">
              <div className="text-4xl mb-3">🔧</div>
              <span className="inline-block text-xs font-[--font-body] border rounded px-2 py-0.5 mb-3 bg-orange-50 text-orange-700 border-orange-200">Technician</span>
              <h3 className="font-[--font-heading] font-semibold text-lg mb-1" style={{ color: '#0d2749' }}>ช่างซ่อม / พนักงานล้างรถ</h3>
              <p className="font-[--font-body] text-sm text-gray-500">Web App</p>
            </div>
            <div className="bg-[#f0f4f8] rounded-2xl p-6 border-l-4 border-emerald-500">
              <div className="text-4xl mb-3">📋</div>
              <span className="inline-block text-xs font-[--font-body] border rounded px-2 py-0.5 mb-3 bg-emerald-50 text-emerald-700 border-emerald-200">Admin</span>
              <h3 className="font-[--font-heading] font-semibold text-lg mb-1" style={{ color: '#0d2749' }}>ผู้จัดการร้าน</h3>
              <p className="font-[--font-body] text-sm text-gray-500">มีสิทธิ์เกือบครบ ยกเว้นข้อมูลการเงิน</p>
            </div>
            <div className="bg-[#f0f4f8] rounded-2xl p-6 border-l-4 border-amber-500">
              <div className="text-4xl mb-3">👑</div>
              <span className="inline-block text-xs font-[--font-body] border rounded px-2 py-0.5 mb-3 bg-amber-50 text-amber-700 border-amber-200">Owner</span>
              <h3 className="font-[--font-heading] font-semibold text-lg mb-1" style={{ color: '#0d2749' }}>เจ้าของกิจการ</h3>
              <p className="font-[--font-body] text-sm text-gray-500">เห็นทุกอย่าง รวม Financial Dashboard</p>
            </div>
          </div>
        </div>
      </section>
      <section style={{ backgroundColor: '#f8f9fc' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">👤</span>
            <h2 className="font-[--font-heading] font-bold text-3xl sm:text-4xl" style={{ color: '#0d2749' }}>ฟีเจอร์สำหรับลูกค้า</h2>
          </div>
          <p className="font-[--font-body] text-gray-500 mb-10 ml-12">ใช้งานผ่าน LINE LIFF บนมือถือ — ไม่ต้องโหลดแอปเพิ่ม</p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            <FeatureCard accent="bg-blue-500" title="3.1 หน้าแรก (Home)" items={["ทักทาย + avatar + กระดิ่งแจ้งเตือน", "Vehicle Switcher — เลือกรถที่ต้องการดู", "Quick Actions 5 ปุ่ม (จองคิว · ล้างรถ · ประวัติ · สถานะ · แจ้งอาการ)", "Next Appointment Card — แสดงนัดถัดไป", "Pending Estimate Banner — แจ้งเมื่อมีใบเสนอราคารอ"]} />
            <FeatureCard accent="bg-blue-500" title="3.2 จองคิวซ่อม" items={["Repair Wizard 4 ขั้นตอน — เลือกรถ · บริการ · วัน-เวลา · ยืนยัน", "6 บริการมาตรฐานให้เลือก + จองด่วนนอกเวลา", "นัดหมายของฉัน — ดูและยกเลิกได้ก่อนเวลา", "Auto-cancel ถ้าเลยเวลา 15 นาที"]} />
            <FeatureCard accent="bg-blue-500" title="3.3 จองล้างรถ" items={["เลือกรถ + แพ็กเกจ 3 ระดับ (Basic / Premium / Deluxe)", "Basic ฿200 · Premium ฿500 · Deluxe ฿1,500", "เช็คคิวก่อนจอง", "กำหนดวันเวลาล่วงหน้าได้"]} />
            <FeatureCard accent="bg-blue-500" title="3.4 ประวัติซ่อม" items={["ดูใบงานทั้งหมด — filter ตามสถานะ", "เห็นรายการอะไหล่ + ค่าแรง (ไม่เห็นราคาทุน)", "ดู DVI Report ย้อนหลัง"]} />
            <FeatureCard accent="bg-blue-500" title="3.5 สถานะรถ Real-time" items={["ดูสถานะ live — inspecting / approved / in_progress / completed", "แจ้งเตือนผ่าน LINE เมื่อสถานะเปลี่ยน"]} />
            <FeatureCard accent="bg-blue-500" title="3.6 Garage รถของฉัน" items={["ดูรถทุกคันที่ลงทะเบียน + ประวัติแต่ละคัน", "เพิ่มรถใหม่ได้เอง"]} />
            <FeatureCard accent="bg-blue-500" title="3.7 หลังบริการ / แจ้งอาการ" items={["แจ้งอาการผิดปกติหลังซ่อม", "ถ่ายรูป + อธิบายปัญหา"]} />
            <FeatureCard accent="bg-blue-500" title="3.8 Stamp Card + Coupon" items={["ดูแต้มสะสม + ใช้คูปอง", "สะสมจากทั้งงานซ่อม + ล้างรถ"]} />
            <FeatureCard accent="bg-blue-500" title="3.9 ตั้งค่าแจ้งเตือน" items={["เปิด/ปิดการแจ้งเตือน LINE", "เลือกประเภทที่ต้องการรับ"]} />
            <FeatureCard accent="bg-blue-500" title="3.10 แผนที่ร้าน" items={["แสดงตำแหน่งร้าน + เส้นทาง Google Maps"]} />
            <FeatureCard accent="bg-blue-500" title="3.11 โปรไฟล์" items={["แก้ไขข้อมูลส่วนตัว", "ดูประวัติการใช้งาน"]} />
            <FeatureCard accent="bg-blue-500" title="3.12 PM Reminder" items={["แจ้งเตือนรอบบำรุงรักษาตามระยะทางหรือเวลา"]} />
          </div>
        </div>
      </section>
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">🔧</span>
            <h2 className="font-[--font-heading] font-bold text-3xl sm:text-4xl" style={{ color: '#0d2749' }}>ฟีเจอร์สำหรับช่าง / พนักงาน</h2>
          </div>
          <p className="font-[--font-body] text-gray-500 mb-10 ml-12">ใช้งานผ่าน Web App — เห็นข้อมูลที่จำเป็นต่อการทำงาน · ซ่อนราคาทุน · การเงิน</p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            <FeatureCardLight accent="bg-orange-500" title="4.1 Dashboard (Operations)" items={["จำนวนงานวันนี้ · อัตราเสร็จงาน · เวลาเฉลี่ย", "อัตราอนุมัติใบราคา", "งานที่ assigned ให้ตัวเอง"]} />
            <div className="bg-[#f0f4f8] rounded-2xl overflow-hidden">
              <div className="h-1 w-full bg-orange-500" />
              <div className="p-6">
                <h4 className="font-[--font-heading] font-semibold text-base mb-3" style={{ color: '#0d2749' }}>4.1 Dashboard — ซ่อน</h4>
                <div className="flex flex-wrap gap-2">
                  {['รายได้','ต้นทุน','กำไร','Revenue chart'].map((h)=>(<HiddenBadge key={h} label={h} />))}
                </div>
              </div>
            </div>
            <FeatureCardLight accent="bg-orange-500" title="4.2 งานซ่อม (Repair)" items={["ดูรายการงานซ่อม + filter สถานะ", "สร้างใบงานใหม่", "อัปเดตสถานะ: inspecting → estimate_ready → approved → in_progress → completed", "DVI — ตรวจสภาพรถ + ถ่ายรูป", "เบิกอะไหล่จากสต็อก", "QC Checklist ก่อนส่งมอบ"]} />
            <FeatureCardLight accent="bg-orange-500" title="4.3 งานล้างรถ (Wash)" items={["เช็คอินลูกค้า · เลือกแพ็กเกจ", "อัปเดตสถานะงานล้างรถ", "บันทึกวัสดุที่ใช้ (Supply Tracking)"]} />
            <FeatureCardLight accent="bg-orange-500" title="4.4 อะไหล่ (Limited)" items={["เบิกของจากสต็อก", "ดูจำนวนคงเหลือ"]} />
            <div className="bg-[#f0f4f8] rounded-2xl overflow-hidden">
              <div className="h-1 w-full bg-orange-500" />
              <div className="p-6">
                <h4 className="font-[--font-heading] font-semibold text-base mb-3" style={{ color: '#0d2749' }}>4.4 อะไหล่ — ซ่อน</h4>
                <div className="flex flex-wrap gap-2">
                  {['ราคาทุน','ราคาขาย','สร้าง PO'].map((h)=>(<HiddenBadge key={h} label={h} />))}
                </div>
              </div>
            </div>
            <FeatureCardLight accent="bg-orange-500" title="4.5 ลูกค้า & รถ" items={["ค้นหาลูกค้า · ดูประวัติ", "เพิ่มรถใหม่ให้ลูกค้า"]} />
          </div>
          <p className="font-[--font-body] text-sm text-gray-400 mt-6 italic">* ใบเสนอราคา — Admin เป็นผู้สร้าง Technician ไม่มีสิทธิ์</p>
        </div>
      </section>
      <section style={{ backgroundColor: '#f8f9fc' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">📋</span>
            <h2 className="font-[--font-heading] font-bold text-3xl sm:text-4xl" style={{ color: '#0d2749' }}>ฟีเจอร์สำหรับผู้จัดการ</h2>
          </div>
          <p className="font-[--font-body] text-gray-500 mb-10 ml-12">ทุกอย่างที่ Technician ทำได้ + ใบเสนอราคา · สต็อกแบบเต็ม · Campaign · ตั้งค่าร้าน</p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            <FeatureCard accent="bg-emerald-500" title="5.1 ใบเสนอราคา (Estimate)" items={["สร้างใบเสนอราคา · ใส่ราคาอะไหล่ + ค่าแรง", "ส่งให้ลูกค้าอนุมัติผ่าน LINE", "Track สถานะการอนุมัติ", "Walk-in On-Site Pricing (auto-approve)", "PDF + ลายเซ็นดิจิทัล + ส่วนลดรวม"]} />
            <FeatureCard accent="bg-emerald-500" title="5.2 อะไหล่ & สต็อก (Full)" items={["ทุกอย่างของ Technician + ราคาทุน + ราคาขาย", "สร้าง / รับ Purchase Order", "ปรับสต็อกมือ", "Stock Movement Report · Low-Stock Alert", "Vendor / Supplier Master", "Import / Export Catalog"]} />
            <FeatureCard accent="bg-emerald-500" title="5.3 บริการ & ราคา" items={["ตั้งราคาบริการซ่อม", "Wash Packages", "Promotion & Discount"]} />
            <FeatureCard accent="bg-emerald-500" title="5.4 Campaign & Marketing" items={["สร้าง Coupon", "กำหนด Promotion", "Share Target Picker — ส่งข้อความแบบ targeted"]} />
            <FeatureCard accent="bg-emerald-500" title="5.5 ตั้งค่าร้าน" items={["ข้อมูลร้าน", "เวลาทำการ", "LINE OA config"]} />
            <FeatureCard accent="bg-emerald-500" title="5.6 Approval Center" items={["อนุมัติใบงาน", "อนุมัติใบเสนอราคา", "อนุมัติ Purchase Order"]} />
            <FeatureCard accent="bg-emerald-500" title="5.7 Follow-up & Monitor" items={["ติดตามงานค้าง", "ลูกค้าที่ไม่กลับมา — re-engagement"]} />
          </div>
          <div className="mt-6 rounded-2xl bg-white border border-red-100 p-5 max-w-lg">
            <p className="font-[--font-heading] font-semibold text-sm text-red-600 mb-2">Admin ปกติยังเห็นไม่ได้</p>
            <div className="flex flex-wrap gap-2">
              {['Financial Dashboard','P&L','Owner-only Reports'].map((h)=>(<HiddenBadge key={h} label={h} />))}
            </div>
          </div>
        </div>
      </section>
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">👑</span>
            <h2 className="font-[--font-heading] font-bold text-3xl sm:text-4xl" style={{ color: '#0d2749' }}>ฟีเจอร์สำหรับเจ้าของ</h2>
          </div>
          <p className="font-[--font-body] text-gray-500 mb-10 ml-12">ADMIN + isOwner=true → เห็นทุกอย่างไม่มีข้อจำกัด</p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            <FeatureCardLight accent="bg-amber-500" title="6.1 Financial Dashboard (Owner Only)" items={["Revenue / Cost / Profit (รายวัน · สัปดาห์ · เดือน · ปี)", "Revenue by Technician chart", "Parts vs Labor breakdown", "Profit margin trends", "Peak hours analysis"]} />
            <FeatureCardLight accent="bg-amber-500" title="6.2 Reports (ครบ)" items={["Monthly P&L · Yearly comparison", "Top customers (by spending)", "Top services (by revenue)", "Slow movers — อะไหล่ขายช้า", "Stock valuation"]} />
            <FeatureCardLight accent="bg-amber-500" title="6.3 Permission Management" items={["Override — เลือก user", "เปิด / ปิด field-level access รายคน"]} />
            <FeatureCardLight accent="bg-amber-500" title="6.4 Strategic Tools" items={["Business planning data", "Growth metrics dashboard"]} />
          </div>
        </div>
      </section>
      <section style={{ backgroundColor: '#f8f9fc' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center mb-12">
            <h2 className="font-[--font-heading] font-bold text-3xl sm:text-4xl mb-3" style={{ color: '#0d2749' }}>ระบบรักษาความปลอดภัยและความเสถียร</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            <FeatureCard accent="bg-slate-500" title="ตรวจสอบระบบ 24 ชม." items={["Health check อัตโนมัติทุก 5 นาที (UptimeRobot)", "แจ้งเตือน Telegram เมื่อระบบผิดปกติ", "Status Page สาธารณะ"]} />
            <FeatureCard accent="bg-slate-500" title="Backup & Recovery" items={["สำรองข้อมูลตามกำหนดการอัตโนมัติ", "กู้คืนได้เมื่อจำเป็น", "Export / Import CSV ข้อมูล"]} />
            <FeatureCard accent="bg-slate-500" title="ความปลอดภัยข้อมูล" items={["VPS แยกต่อลูกค้า — ไม่แชร์ฐานข้อมูล", "Docker ports ล็อคไม่เปิดออก internet"]} />
            <FeatureCard accent="bg-slate-500" title="การดูแล & อัปเดต" items={["Bug fix ตามระดับ SLA", "Security update เชิงรุก"]} />
            <FeatureCard accent="bg-slate-500" title="รองรับการเติบโต" items={["Scale ได้ไม่ต้องเขียนใหม่", "Multi-branch รองรับในอนาคต"]} />
          </div>
        </div>
      </section>
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center mb-10">
            <h2 className="font-[--font-heading] font-bold text-3xl sm:text-4xl mb-3" style={{ color: '#0d2749' }}>LINE Integration</h2>
            <p className="font-[--font-body] text-gray-500">ลูกค้าใช้ LINE ที่มีอยู่แล้ว — ไม่ต้องสมัครระบบเพิ่ม</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            <div className="bg-[#f0f4f8] rounded-2xl p-6 text-center">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="font-[--font-heading] font-semibold text-lg mb-2" style={{ color: '#0d2749' }}>LINE LIFF</h3>
              <p className="font-[--font-body] text-sm text-gray-500">Mini App สำหรับลูกค้า — จองคิว ดูสถานะ ประวัติซ่อม ทุกอย่างใน LINE</p>
            </div>
            <div className="bg-[#f0f4f8] rounded-2xl p-6 text-center">
              <div className="text-4xl mb-4">🔔</div>
              <h3 className="font-[--font-heading] font-semibold text-lg mb-2" style={{ color: '#0d2749' }}>LINE Notify</h3>
              <p className="font-[--font-body] text-sm text-gray-500">แจ้งเตือน push ตามจุด — เมื่อใบเสนอราคาส่ง / สถานะรถเปลี่ยน / งานเสร็จ (เฉพาะลูกค้าเสียค่าบริการตรง LINE)</p>
            </div>
            <div className="bg-[#f0f4f8] rounded-2xl p-6 text-center">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="font-[--font-heading] font-semibold text-lg mb-2" style={{ color: '#0d2749' }}>Rich Menu</h3>
              <p className="font-[--font-body] text-sm text-gray-500">Navigation ด้านล่าง LINE Chat — เข้าถึงฟีเจอร์หลักด้วย tap เดียว</p>
            </div>
          </div>
        </div>
      </section>
      <section style={{ backgroundColor: '#011937' }} className="text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <h2 className="font-[--font-heading] font-bold text-3xl sm:text-4xl mb-4">เริ่มต้นใช้งาน AutoCar Care วันนี้</h2>
          <p className="font-[--font-body] text-white/70 mb-10 max-w-xl mx-auto">ระบบพร้อม Deploy ทดลองใช้งาน Live Demo ได้เลย</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://demo.vibagen.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 font-[--font-heading] font-semibold text-base text-white transition-colors duration-200 hover:opacity-90" style={{ backgroundColor: '#ff6c01' }}>เปิด Live Demo →</a>
            <a href="/autocar" className="inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 font-[--font-heading] font-semibold text-base text-white border border-white/30 transition-colors duration-200 hover:bg-white/10">ดูข้อมูลนำเสนอ</a>
          </div>
        </div>
      </section>
    </>
  )
}