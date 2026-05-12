import Badge from '@/components/ui/Badge'
import Tooltip from '@/components/ui/Tooltip'

const points = [
  {
    number: '01',
    title: 'Business First',
    desc: 'เราเริ่มจากการเข้าใจ workflow และปัญหาจริง ไม่ใช่เริ่มจากเลือกเทคโนโลยี',
  },
  {
    number: '02',
    title: 'AI-Ready Architecture',
    desc: (
      <>
        ทุกระบบออกแบบด้วย{' '}
        <Tooltip term="ai-ready">AI-Ready Architecture</Tooltip>{' '}
        — พร้อมเชื่อมต่อ AI ได้ทันทีโดยไม่ต้อง rebuild
      </>
    ),
  },
  {
    number: '03',
    title: 'Rapid Construction',
    desc: (
      <>
        ใช้ <Tooltip term="vibecoding">Vibecoding</Tooltip> + AI-assisted engineering
        ย่นเวลาพัฒนา 50–70% โดยไม่ลด code quality
      </>
    ),
  },
  {
    number: '04',
    title: 'Ownership Matters',
    desc: (
      <>
        ลูกค้าเป็นเจ้าของระบบ 100% —{' '}
        <Tooltip term="perpetual-license">Perpetual License</Tooltip>, source code,
        และข้อมูลทั้งหมดเป็นของลูกค้า
      </>
    ),
  },
  {
    number: '05',
    title: 'Simple & Maintainable',
    desc: 'ระบบต้องเข้าใจง่าย แก้ไขง่าย ดูแลต่อได้ ไม่ซับซ้อนเกินจำเป็น',
  },
  {
    number: '06',
    title: 'Real Problem Solver',
    desc: 'ทุกระบบต้องแก้ปัญหาได้จริง วัดผลได้จริง ไม่ใช่แค่ "ดูดี"',
  },
]

const comparison = [
  { feature: 'เวลาพัฒนา', traditional: 'ช้า (3–12 เดือน)', vibagen: 'เร็ว (30–90 วัน)' },
  { feature: 'ความเป็นเจ้าของ', traditional: 'ผูกกับ vendor', vibagen: 'ลูกค้าเป็นเจ้าของ 100%' },
  { feature: 'AI Integration', traditional: 'ต้อง rebuild', vibagen: 'Built-in ready' },
  { feature: 'ค่าใช้จ่าย', traditional: 'รายเดือน/รายปีไม่รู้จบ', vibagen: 'จ่ายครั้งเดียว' },
  { feature: 'ปรับแก้ระบบ', traditional: 'รอ vendor', vibagen: 'แก้ได้เองหรือกับเรา' },
]

export default function WhyVibagen() {
  return (
    <section
      className="section bg-dots"
      aria-labelledby="why-heading"
    >
      <div className="container">
        {/* Header */}
        <div className="text-center mb-14">
          <Badge dot className="mb-4">
            Why VIBAGEN
          </Badge>
          <h2
            id="why-heading"
            className="font-[--font-heading] font-bold text-[#0d2749] mb-4"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}
          >
            ต่างจาก Software House ทั่วไปอย่างไร
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
            เราเข้าใจ operation จริง พัฒนาเร็ว และออกแบบให้ดูแลได้ง่าย
          </p>
        </div>

        {/* 6 points grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {points.map((p, i) => (
            <div
              key={p.number}
              className="group rounded-2xl p-6 bg-white border border-[#0d2749]/8 shadow-sm hover:border-[#ff6c01]/40 hover:shadow-md transition-all duration-300"
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
              <span className="font-[--font-heading] font-bold text-[#ff6c01] text-4xl block mb-3 opacity-40 group-hover:opacity-70 transition-opacity">
                {p.number}
              </span>
              <h3 className="font-[--font-heading] font-semibold text-[#0d2749] text-lg mb-2">
                {p.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

        {/* Comparison table */}
        <div className="rounded-2xl overflow-hidden border border-[#0d2749]/10">
          <div className="grid grid-cols-3 bg-[#011937] px-6 py-4">
            <span className="text-white/40 text-sm font-medium">เปรียบเทียบ</span>
            <span className="text-white/60 text-sm font-medium text-center">
              Software House ทั่วไป
            </span>
            <span className="text-[#ff6c01] text-sm font-semibold text-center">VIBAGEN</span>
          </div>
          {comparison.map((row, i) => (
            <div
              key={row.feature}
              className={[
                'grid grid-cols-3 px-6 py-4 items-center border-t border-[#0d2749]/6',
                i % 2 === 0 ? 'bg-[#f8f9fc]' : 'bg-white',
              ].join(' ')}
            >
              <span className="text-[#0d2749] text-sm">{row.feature}</span>
              <span className="text-gray-400 text-sm text-center">{row.traditional}</span>
              <span className="text-[#ff6c01] text-sm font-medium text-center">
                {row.vibagen}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
