import Badge from '@/components/ui/Badge'

const steps = [
  {
    number: '01',
    label: 'Understand',
    labelTh: 'เข้าใจธุรกิจ',
    desc: 'วิเคราะห์ workflow, operation, bottleneck และปัญหาที่แท้จริง ก่อนเขียนโค้ดแม้แต่บรรทัดเดียว',
    icon: '🔍',
  },
  {
    number: '02',
    label: 'Simplify',
    labelTh: 'ลดความซับซ้อน',
    desc: 'ออกแบบ flow ใหม่ที่เหมาะสม ตัดสิ่งที่ไม่จำเป็นออก เพิ่มสิ่งที่ขาด',
    icon: '✂️',
  },
  {
    number: '03',
    label: 'Prototype',
    labelTh: 'สร้าง Prototype',
    desc: 'เห็นภาพระบบเร็วที่สุด ก่อน commit กับทิศทางที่ผิด',
    icon: '🎨',
  },
  {
    number: '04',
    label: 'Craft',
    labelTh: 'พัฒนาระบบจริง',
    desc: 'สร้างด้วย AI-assisted engineering, modular architecture และ code ที่ดูแลต่อได้',
    icon: '⚡',
  },
  {
    number: '05',
    label: 'Deploy',
    labelTh: 'ส่งมอบ',
    desc: 'นำระบบขึ้นใช้งานจริง พร้อม training ทีมงานของลูกค้า',
    icon: '🚀',
  },
  {
    number: '06',
    label: 'Improve',
    labelTh: 'ปรับปรุงต่อเนื่อง',
    desc: 'ปรับปรุงจาก feedback การใช้งานจริง ให้ระบบตอบโจทย์มากขึ้นเรื่อยๆ',
    icon: '📈',
  },
]

export default function Process() {
  return (
    <section
      className="section section-dark"
      aria-labelledby="process-heading"
    >
      <div className="container">
        {/* Header */}
        <div className="text-center mb-14">
          <Badge dot className="mb-4">
            Construction Framework
          </Badge>
          <h2
            id="process-heading"
            className="font-[--font-heading] font-bold text-white mb-4"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}
          >
            วิธีที่เราสร้างระบบ
          </h2>
          <p className="text-white/60 max-w-xl mx-auto text-lg">
            6 ขั้นตอนที่ออกแบบมาเพื่อให้ได้ระบบที่ใช้งานได้จริงเร็วที่สุด
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className={[
                'rounded-2xl p-6',
                'transition-all duration-300 hover:scale-[1.02]',
                i === 3
                  ? 'bg-[#ff6c01]' // Craft = orange highlight
                  : 'bg-white/[0.04] border border-white/[0.06]',
              ].join(' ')}
            >
              {/* Number + Icon */}
              <div className="flex items-start justify-between mb-4">
                <span
                  className={[
                    'font-[--font-heading] font-bold text-4xl',
                    i === 3 ? 'text-white/40' : 'text-[#ff6c01]/40',
                  ].join(' ')}
                >
                  {step.number}
                </span>
                <span className="text-3xl" role="img" aria-label={step.label}>
                  {step.icon}
                </span>
              </div>

              {/* Labels */}
              <p
                className={[
                  'text-xs font-medium uppercase tracking-wider mb-1',
                  i === 3 ? 'text-white/70' : 'text-[#ff6c01]',
                ].join(' ')}
              >
                {step.label}
              </p>
              <h3
                className={[
                  'font-[--font-heading] font-semibold text-xl mb-3',
                  i === 3 ? 'text-white' : 'text-white',
                ].join(' ')}
              >
                {step.labelTh}
              </h3>
              <p
                className={[
                  'text-sm leading-relaxed',
                  i === 3 ? 'text-white/80' : 'text-white/55',
                ].join(' ')}
              >
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Timeline connector — decorative */}
        <div className="hidden lg:flex justify-center mt-8 gap-0">
          {steps.map((_, i) => (
            <div key={i} className="flex items-center">
              <div
                className="w-3 h-3 rounded-full"
                style={{ background: i === 3 ? '#ff6c01' : 'rgba(255,255,255,0.2)' }}
              />
              {i < steps.length - 1 && (
                <div className="w-28 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
