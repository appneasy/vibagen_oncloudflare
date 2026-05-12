import Badge from '@/components/ui/Badge'
import Tooltip from '@/components/ui/Tooltip'

const problems = [
  {
    icon: '📊',
    title: 'Excel ที่ซับซ้อนขึ้นทุกปี',
    desc: 'ไฟล์เยอะขึ้น สูตรซับซ้อนขึ้น คนเดียวดูแลได้ เกิดข้อผิดพลาดง่าย และ AI ไม่สามารถเชื่อมต่อเข้าไปได้โดยตรง',
  },
  {
    icon: '💸',
    title: 'ค่า SaaS ที่เพิ่มขึ้นทุกปี',
    desc: 'จ่ายรายเดือน แต่ไม่ได้เป็นเจ้าของระบบ ข้อมูลอยู่กับ vendor และเมื่อหยุดจ่าย ทุกอย่างหายหมด',
  },
  {
    icon: '🔄',
    title: 'งาน Manual ซ้ำซ้อนทุกวัน',
    desc: 'ก็อปปี้ข้อมูลจากระบบหนึ่งไปอีกระบบ พิมพ์รายงาน ส่ง WhatsApp ประสานงาน — งานที่ระบบที่ดีควรทำให้เองได้',
  },
  {
    icon: '🔒',
    title: 'ระบบที่ปรับแก้ไม่ได้',
    desc: 'SaaS ที่ไม่ตอบ requirement จริง แต่ก็เปลี่ยนไม่ได้ เพราะข้อมูลอยู่ในนั้น และทีม dev ของ vendor ตอบช้า',
  },
  {
    icon: '🏝️',
    title: 'ข้อมูลกระจัดกระจาย',
    desc: 'Accounting อยู่ใน ERP, Operation อยู่ใน Excel, Customer อยู่ใน WhatsApp — ไม่มีใครเห็นภาพรวมจริงๆ',
  },
  {
    icon: '🤖',
    title: 'ยังรอ AI แต่ระบบไม่พร้อม',
    desc: 'ต้องการใช้ AI ช่วยวิเคราะห์และตัดสินใจ แต่ข้อมูลไม่ได้โครงสร้าง และระบบไม่มี API ให้ AI เชื่อมต่อ',
  },
]

export default function Problems() {
  return (
    <section
      className="section section-navy"
      aria-labelledby="problems-heading"
    >
      <div className="container">
        {/* Header */}
        <div className="text-center mb-14">
          <Badge dot className="mb-4">
            ปัญหาที่เราเห็นทุกวัน
          </Badge>
          <h2
            id="problems-heading"
            className="font-[--font-heading] font-bold text-[#0d2749] mb-4"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}
          >
            <Tooltip term="digital-debt">Digital Debt</Tooltip>{' '}
            กำลังกัดกินธุรกิจของคุณ
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
            ค่าใช้จ่ายที่ซ่อนอยู่จากระบบที่ไม่เหมาะสม สะสมทุกวัน
            โดยที่ส่วนใหญ่ยังไม่รู้ตัว
          </p>
        </div>

        {/* Problem cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-14">
          {problems.map((p, i) => (
            <div
              key={p.title}
              className="rounded-2xl p-6 bg-white border border-[#0d2749]/8 shadow-sm hover:border-[#ff6c01]/40 hover:shadow-md transition-all duration-300"
              style={{
                borderLeft: [
                  '3px solid #ff6c01',
                  '3px solid #3b82f6',
                  '3px solid #8b5cf6',
                  '3px solid #ef4444',
                  '3px solid #10b981',
                  '3px solid #f59e0b',
                ][i],
              }}
            >
              <span className="text-3xl mb-4 block" role="img" aria-hidden="true">
                {p.icon}
              </span>
              <h3 className="font-[--font-heading] font-semibold text-[#0d2749] text-lg mb-2">
                {p.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

        {/* Callout */}
        <div
          className="rounded-2xl p-8 text-center"
          style={{
            background:
              'linear-gradient(135deg, rgba(255,108,1,0.06) 0%, rgba(255,108,1,0.03) 100%)',
            border: '1px solid rgba(255,108,1,0.2)',
          }}
        >
          <p className="text-[#0d2749] text-xl font-[--font-heading] font-semibold mb-2">
            ถ้าใช้ Excel + SaaS 5 ตัว + WhatsApp ประสานงาน
          </p>
          <p className="text-gray-500 text-base">
            คุณกำลังสะสม <Tooltip term="digital-debt">Digital Debt</Tooltip> ทุกวัน —
            และยิ่งนานยิ่งแก้ยาก
          </p>
        </div>
      </div>
    </section>
  )
}
