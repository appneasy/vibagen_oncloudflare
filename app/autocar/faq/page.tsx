import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "คำถามที่พบบ่อย — AutoCar Care",
  description: "คำตอบสำหรับทุกคำถามเกี่ยวกับ AutoCar Care — ค่าระบบ Hosting Maintenance Customization",
  alternates: { canonical: "https://vibagen.com/autocar/faq" },
  keywords: ["autocar care faq", "คำถามระบบอู่ซ่อมรถ", "autocar pricing", "perpetual license", "hosting"],
  openGraph: {
    title: "คำถามที่พบบ่อย — AutoCar Care",
    description: "คำตอบสำหรับทุกคำถามเกี่ยวกับ AutoCar Care — ค่าระบบ Hosting Maintenance Customization",
    url: "https://vibagen.com/autocar/faq",
    type: "website",
  },
}

export default function FaqPage() {
  return (
    <>

      {/* S1: Hero */}
      <section style={{ background: "#011937" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-[--font-body] font-semibold tracking-widest uppercase text-amber-400 mb-3">FAQ</span>
            <h1 className="font-[--font-heading] font-bold text-4xl sm:text-5xl text-white mb-4">
              คำถามที่พบบ่อย
            </h1>
            <p className="font-[--font-body] text-gray-300 text-lg max-w-2xl mx-auto">
              คำตอบสำหรับทุกคำถามเกี่ยวกับ AutoCar Care
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center border border-white/20">
              <div className="font-[--font-body] text-xs text-amber-400 mb-1">ค่าระบบ</div>
              <div className="font-[--font-heading] font-bold text-2xl text-white mb-1">29,000 บาท</div>
              <div className="font-[--font-body] text-xs text-gray-400">ซื้อขาดเพียงครั้งเดียว</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center border border-white/20">
              <div className="font-[--font-body] text-xs text-amber-400 mb-1">Hosting</div>
              <div className="font-[--font-heading] font-bold text-2xl text-white mb-1">400–900 บาท/เดือน</div>
              <div className="font-[--font-body] text-xs text-gray-400">ตามพื้นที่ใช้จริง</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center border border-white/20">
              <div className="font-[--font-body] text-xs text-amber-400 mb-1">ค่าดูแล</div>
              <div className="font-[--font-heading] font-bold text-2xl text-white mb-1">ไม่มี / Hotseat</div>
              <div className="font-[--font-body] text-xs text-gray-400">เลือกตามเพลน</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center border border-white/20">
              <div className="font-[--font-body] text-xs text-amber-400 mb-1">งานพิเศษ</div>
              <div className="font-[--font-heading] font-bold text-2xl text-white mb-1">ต่อรอง+คำนวณ</div>
              <div className="font-[--font-body] text-xs text-gray-400">ตามความซับซ้อน</div>
            </div>
          </div>
        </div>
      </section>


      <section style={{ background: "#ffffff" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="flex items-center gap-3 mb-8">
            <span className="inline-block px-3 py-1 text-xs font-semibold font-[--font-body] rounded-full border-amber-400 bg-amber-50 text-amber-700">
              ค่าระบบ / License
            </span>
          </div>
          <div className="space-y-3">
            <details className="bg-[#f0f4f8] rounded-2xl overflow-hidden group">
              <summary className="flex items-center justify-between gap-4 p-6 cursor-pointer list-none">
                <span className="font-[--font-heading] font-semibold text-base" style={{ color: "#0d2749" }}>ซื้อขาด หรือเช่ารายปี?</span>
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-sm font-bold transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="px-6 pb-6">
                <p className="font-[--font-body] text-gray-600 text-sm leading-relaxed">ซื้อขาดครั้งเดียว 29,000 บาท คุณได้โค้ดทั้งหมด ไม่มีค่า License รายปี</p>
              </div>
            </details>
            <details className="bg-[#f0f4f8] rounded-2xl overflow-hidden group">
              <summary className="flex items-center justify-between gap-4 p-6 cursor-pointer list-none">
                <span className="font-[--font-heading] font-semibold text-base" style={{ color: "#0d2749" }}>ราคา 29,000 รวมอะไรบ้าง?</span>
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-sm font-bold transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="px-6 pb-6">
                <p className="font-[--font-body] text-gray-600 text-sm leading-relaxed">รวม: Source code, ติดตั้งบน VPS, อบรมการใช้งาน 1 วัน, LINE OA Integration, เอกสารการใช้งาน</p>
              </div>
            </details>
            <details className="bg-[#f0f4f8] rounded-2xl overflow-hidden group">
              <summary className="flex items-center justify-between gap-4 p-6 cursor-pointer list-none">
                <span className="font-[--font-heading] font-semibold text-base" style={{ color: "#0d2749" }}>ค่าใช้จ่ายหลังจากนั้นมีอะไรอีก?</span>
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-sm font-bold transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="px-6 pb-6">
                <p className="font-[--font-body] text-gray-600 text-sm leading-relaxed">มีแค่ค่า Hosting (VPS เริ่ม 400–900 บาท/เดือน) และค่า Maintenance ถ้าเลือก Hotseat</p>
              </div>
            </details>
            <details className="bg-[#f0f4f8] rounded-2xl overflow-hidden group">
              <summary className="flex items-center justify-between gap-4 p-6 cursor-pointer list-none">
                <span className="font-[--font-heading] font-semibold text-base" style={{ color: "#0d2749" }}>รายหัวมีไหม?</span>
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-sm font-bold transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="px-6 pb-6">
                <p className="font-[--font-body] text-gray-600 text-sm leading-relaxed">ไม่มีค่ารายหัว เป็น Software ชุดเดียว เพียงเลือก Maintenance Plan</p>
              </div>
            </details>
          </div>
        </div>
      </section>

      <section style={{ background: "#f8f9fc" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="flex items-center gap-3 mb-8">
            <span className="inline-block px-3 py-1 text-xs font-semibold font-[--font-body] rounded-full border-blue-400 bg-blue-50 text-blue-700">
              Hosting & Infrastructure
            </span>
          </div>
          <div className="space-y-3">
            <details className="bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden group">
              <summary className="flex items-center justify-between gap-4 p-6 cursor-pointer list-none">
                <span className="font-[--font-heading] font-semibold text-base" style={{ color: "#0d2749" }}>ค่า Hosting เป็นเท่าไหร่?</span>
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-sm font-bold transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="px-6 pb-6">
                <p className="font-[--font-body] text-gray-600 text-sm leading-relaxed">VPS เริ่มต้นที่ 400–900 บาท/เดือน ขึ้นอยู่กับ Traffic และ Spec</p>
              </div>
            </details>
            <details className="bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden group">
              <summary className="flex items-center justify-between gap-4 p-6 cursor-pointer list-none">
                <span className="font-[--font-heading] font-semibold text-base" style={{ color: "#0d2749" }}>VPS ใครเป็นคนจ่าย?</span>
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-sm font-bold transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="px-6 pb-6">
                <p className="font-[--font-body] text-gray-600 text-sm leading-relaxed">ลูกค้าจัดเอง Vibagen ช่วยเลือก Provider สามารถ Migrate ได้ทุกเมื่อ</p>
              </div>
            </details>
            <details className="bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden group">
              <summary className="flex items-center justify-between gap-4 p-6 cursor-pointer list-none">
                <span className="font-[--font-heading] font-semibold text-base" style={{ color: "#0d2749" }}>ย้าย Server ได้ไหม?</span>
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-sm font-bold transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="px-6 pb-6">
                <p className="font-[--font-body] text-gray-600 text-sm leading-relaxed">ได้เลย คุณเป็นเจ้าของ Source Code ไม่มี Lock-in กับผู้ให้บริการ</p>
              </div>
            </details>
            <details className="bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden group">
              <summary className="flex items-center justify-between gap-4 p-6 cursor-pointer list-none">
                <span className="font-[--font-heading] font-semibold text-base" style={{ color: "#0d2749" }}>LINE OA ต้องเสียค่าเพิ่มไหม?</span>
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-sm font-bold transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="px-6 pb-6">
                <p className="font-[--font-body] text-gray-600 text-sm leading-relaxed">LINE OA ปกติเปิดฟรี ถ้าเพิ่มข้อความ Premium ค่ายกเว้นจาก LINE โดยตรง</p>
              </div>
            </details>
            <details className="bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden group">
              <summary className="flex items-center justify-between gap-4 p-6 cursor-pointer list-none">
                <span className="font-[--font-heading] font-semibold text-base" style={{ color: "#0d2749" }}>รองรับลูกค้ากี่คนพร้อมกัน?</span>
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-sm font-bold transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="px-6 pb-6">
                <p className="font-[--font-body] text-gray-600 text-sm leading-relaxed">แนะนำเริ่ม 2 vCPU / 4 GB RAM รองรับได้เกิน 1,000 คน/วัน</p>
              </div>
            </details>
          </div>
        </div>
      </section>

      <section style={{ background: "#ffffff" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="flex items-center gap-3 mb-8">
            <span className="inline-block px-3 py-1 text-xs font-semibold font-[--font-body] rounded-full border-emerald-400 bg-emerald-50 text-emerald-700">
              Maintenance & Support
            </span>
          </div>
          <div className="space-y-3">
            <details className="bg-[#f0f4f8] rounded-2xl overflow-hidden group">
              <summary className="flex items-center justify-between gap-4 p-6 cursor-pointer list-none">
                <span className="font-[--font-heading] font-semibold text-base" style={{ color: "#0d2749" }}>หลังติดตั้งแล้วใครดูแลระบบ?</span>
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-sm font-bold transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="px-6 pb-6">
                <p className="font-[--font-body] text-gray-600 text-sm leading-relaxed">คุณดูแลเองบน VPS ที่คุณควบคุม หรือเลือก Hotseat Plan</p>
              </div>
            </details>
            <details className="bg-[#f0f4f8] rounded-2xl overflow-hidden group">
              <summary className="flex items-center justify-between gap-4 p-6 cursor-pointer list-none">
                <span className="font-[--font-heading] font-semibold text-base" style={{ color: "#0d2749" }}>Hotseat Plan คืออะไร?</span>
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-sm font-bold transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="px-6 pb-6">
                <p className="font-[--font-body] text-gray-600 text-sm leading-relaxed">Vibagen ดูแล Server, Update, Monitor, Backup ให้ คุณไม่ต้องยุ่งเรื่อง Server</p>
              </div>
            </details>
            <details className="bg-[#f0f4f8] rounded-2xl overflow-hidden group">
              <summary className="flex items-center justify-between gap-4 p-6 cursor-pointer list-none">
                <span className="font-[--font-heading] font-semibold text-base" style={{ color: "#0d2749" }}>ถ้าระบบล่ม ใครรับผิดชอบ?</span>
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-sm font-bold transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="px-6 pb-6">
                <p className="font-[--font-body] text-gray-600 text-sm leading-relaxed">ถ้าเลือก Hotseat — Vibagen แก้ไข ถ้าดูแลเองต้องหา DevOps เอง</p>
              </div>
            </details>
            <details className="bg-[#f0f4f8] rounded-2xl overflow-hidden group">
              <summary className="flex items-center justify-between gap-4 p-6 cursor-pointer list-none">
                <span className="font-[--font-heading] font-semibold text-base" style={{ color: "#0d2749" }}>Bug Fix รวมอยู่ในราคาไหม?</span>
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-sm font-bold transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="px-6 pb-6">
                <p className="font-[--font-body] text-gray-600 text-sm leading-relaxed">Bug จาก Core System แก้ฟรี นอกเหนือการ Custom หรือแก้ Code ที่ลูกค้าแก้เอง</p>
              </div>
            </details>
          </div>
        </div>
      </section>

      <section style={{ background: "#f8f9fc" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="flex items-center gap-3 mb-8">
            <span className="inline-block px-3 py-1 text-xs font-semibold font-[--font-body] rounded-full border-purple-400 bg-purple-50 text-purple-700">
              Customization & พัฒนาเพิ่ม
            </span>
          </div>
          <div className="space-y-3">
            <details className="bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden group">
              <summary className="flex items-center justify-between gap-4 p-6 cursor-pointer list-none">
                <span className="font-[--font-heading] font-semibold text-base" style={{ color: "#0d2749" }}>เพิ่มฟีเจอร์ใหม่ได้ไหม?</span>
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-sm font-bold transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="px-6 pb-6">
                <p className="font-[--font-body] text-gray-600 text-sm leading-relaxed">ทำได้ คิดค่าตามความซับซ้อน แจ้งความต้องการแล้ว Vibagen ประเมินค่าให้</p>
              </div>
            </details>
            <details className="bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden group">
              <summary className="flex items-center justify-between gap-4 p-6 cursor-pointer list-none">
                <span className="font-[--font-heading] font-semibold text-base" style={{ color: "#0d2749" }}>เปลี่ยน Logo หรือชื่อร้านได้ไหม?</span>
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-sm font-bold transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="px-6 pb-6">
                <p className="font-[--font-body] text-gray-600 text-sm leading-relaxed">ได้เลย เป็นส่วนหนึ่งของ On-boarding White-label ให้เป็นแบรนด์ของคุณ</p>
              </div>
            </details>
            <details className="bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden group">
              <summary className="flex items-center justify-between gap-4 p-6 cursor-pointer list-none">
                <span className="font-[--font-heading] font-semibold text-base" style={{ color: "#0d2749" }}>เชื่อม ERP หรือบัญชีได้ไหม?</span>
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-sm font-bold transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="px-6 pb-6">
                <p className="font-[--font-body] text-gray-600 text-sm leading-relaxed">ทำได้ คิดค่าตาม API Integration Scope มี REST API พร้อมใช้งาน</p>
              </div>
            </details>
            <details className="bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden group">
              <summary className="flex items-center justify-between gap-4 p-6 cursor-pointer list-none">
                <span className="font-[--font-heading] font-semibold text-base" style={{ color: "#0d2749" }}>หลายสาขาได้ไหม?</span>
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-sm font-bold transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="px-6 pb-6">
                <p className="font-[--font-body] text-gray-600 text-sm leading-relaxed">ได้ แต่ละสาขาข้อมูลแยกกัน Admin ดู Dashboard รวมได้</p>
              </div>
            </details>
          </div>
        </div>
      </section>

      <section style={{ background: "#ffffff" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="flex items-center gap-3 mb-8">
            <span className="inline-block px-3 py-1 text-xs font-semibold font-[--font-body] rounded-full border-orange-400 bg-orange-50 text-orange-700">
              การใช้งาน
            </span>
          </div>
          <div className="space-y-3">
            <details className="bg-[#f0f4f8] rounded-2xl overflow-hidden group">
              <summary className="flex items-center justify-between gap-4 p-6 cursor-pointer list-none">
                <span className="font-[--font-heading] font-semibold text-base" style={{ color: "#0d2749" }}>ลูกค้าต้องติดตั้ง App ไหม?</span>
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-sm font-bold transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="px-6 pb-6">
                <p className="font-[--font-body] text-gray-600 text-sm leading-relaxed">ไม่ต้อง ใช้ LINE LIFF ผ่าน Chat LINE ที่มีอยู่แล้ว</p>
              </div>
            </details>
            <details className="bg-[#f0f4f8] rounded-2xl overflow-hidden group">
              <summary className="flex items-center justify-between gap-4 p-6 cursor-pointer list-none">
                <span className="font-[--font-heading] font-semibold text-base" style={{ color: "#0d2749" }}>ช่างใช้งานผ่านอะไร?</span>
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-sm font-bold transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="px-6 pb-6">
                <p className="font-[--font-body] text-gray-600 text-sm leading-relaxed">Web Browser ปกติ Chrome / Safari เปิดบนมือถือหรือ Desktop</p>
              </div>
            </details>
            <details className="bg-[#f0f4f8] rounded-2xl overflow-hidden group">
              <summary className="flex items-center justify-between gap-4 p-6 cursor-pointer list-none">
                <span className="font-[--font-heading] font-semibold text-base" style={{ color: "#0d2749" }}>มีกี่ภาษา?</span>
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-sm font-bold transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="px-6 pb-6">
                <p className="font-[--font-body] text-gray-600 text-sm leading-relaxed">ภาษาไทย สามารถเพิ่มภาษาอื่นตาม Scope Custom</p>
              </div>
            </details>
            <details className="bg-[#f0f4f8] rounded-2xl overflow-hidden group">
              <summary className="flex items-center justify-between gap-4 p-6 cursor-pointer list-none">
                <span className="font-[--font-heading] font-semibold text-base" style={{ color: "#0d2749" }}>ไม่มี Internet ใช้ได้ไหม?</span>
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-sm font-bold transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="px-6 pb-6">
                <p className="font-[--font-body] text-gray-600 text-sm leading-relaxed">ต้องมี Internet เนื่องจากทำงานบน Cloud Server แต่ 4G ปกติสุดพอ</p>
              </div>
            </details>
            <details className="bg-[#f0f4f8] rounded-2xl overflow-hidden group">
              <summary className="flex items-center justify-between gap-4 p-6 cursor-pointer list-none">
                <span className="font-[--font-heading] font-semibold text-base" style={{ color: "#0d2749" }}>Mobile รองรับไหม?</span>
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-sm font-bold transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="px-6 pb-6">
                <p className="font-[--font-body] text-gray-600 text-sm leading-relaxed">รองรับทุกขนาด Responsive Design เป็นหลัก</p>
              </div>
            </details>
          </div>
        </div>
      </section>

      <section style={{ background: "#f8f9fc" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="flex items-center gap-3 mb-8">
            <span className="inline-block px-3 py-1 text-xs font-semibold font-[--font-body] rounded-full border-red-400 bg-red-50 text-red-700">
              ข้อมูล & ความปลอดภัย
            </span>
          </div>
          <div className="space-y-3">
            <details className="bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden group">
              <summary className="flex items-center justify-between gap-4 p-6 cursor-pointer list-none">
                <span className="font-[--font-heading] font-semibold text-base" style={{ color: "#0d2749" }}>ข้อมูลลูกค้าเป็นของใคร?</span>
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-sm font-bold transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="px-6 pb-6">
                <p className="font-[--font-body] text-gray-600 text-sm leading-relaxed">ของลูกค้า Vibagen ไม่เข้าถึงหรือใช้ข้อมูลนั้น</p>
              </div>
            </details>
            <details className="bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden group">
              <summary className="flex items-center justify-between gap-4 p-6 cursor-pointer list-none">
                <span className="font-[--font-heading] font-semibold text-base" style={{ color: "#0d2749" }}>สำรองข้อมูลไว้ที่ไหน?</span>
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-sm font-bold transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="px-6 pb-6">
                <p className="font-[--font-body] text-gray-600 text-sm leading-relaxed">บน VPS ส่วนตัวของคุณ ไม่ได้อยู่บน Cloud สาธารณะที่แชร์กัน</p>
              </div>
            </details>
            <details className="bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden group">
              <summary className="flex items-center justify-between gap-4 p-6 cursor-pointer list-none">
                <span className="font-[--font-heading] font-semibold text-base" style={{ color: "#0d2749" }}>Backup ทำอย่างไร?</span>
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-sm font-bold transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="px-6 pb-6">
                <p className="font-[--font-body] text-gray-600 text-sm leading-relaxed">ถ้าเลือก Hotseat — Backup อัตโนมัติทุกวัน ดูแลเองต้องตั้งเอง</p>
              </div>
            </details>
            <details className="bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden group">
              <summary className="flex items-center justify-between gap-4 p-6 cursor-pointer list-none">
                <span className="font-[--font-heading] font-semibold text-base" style={{ color: "#0d2749" }}>PDPA รองรับไหม?</span>
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-sm font-bold transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="px-6 pb-6">
                <p className="font-[--font-body] text-gray-600 text-sm leading-relaxed">รองรับ มีระบบ Role-based Access ตามบทบาท คุ้มครองสิทธิ์ทุกชั้น</p>
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "#011937" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <h2 className="font-[--font-heading] font-bold text-3xl sm:text-4xl text-white mb-4">พร้อมเริ่มต้นแล้วหรือยัง?</h2>
          <p className="font-[--font-body] text-gray-300 text-lg mb-10">ติดต่อ Vibagen วันนี้ หรือทดลอง Demo เพื่อดูระบบจริงก่อนตัดสินใจ</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/autocar"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white font-[--font-heading] font-semibold px-8 py-4 rounded-xl transition-colors">
              ดูภาพรวม AutoCar Care
            </a>
            <a href="/autocar/features"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-[--font-heading] font-semibold px-8 py-4 rounded-xl transition-colors border border-white/20">
              ดูฟีเจอร์ทั้งหมด
            </a>
            <a href="https://demo.vibagen.com" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-[--font-heading] font-semibold px-8 py-4 rounded-xl transition-colors border border-white/20">
              ทดลอง Demo
            </a>
          </div>
        </div>
      </section>

    </>
  )
}