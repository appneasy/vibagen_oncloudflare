import Badge from '@/components/ui/Badge'
import StatCard from '@/components/ui/StatCard'
import Tooltip from '@/components/ui/Tooltip'

const timeline = [
  {
    year: '2026',
    label: 'AI Assists',
    desc: 'AI ช่วยสรุป วิเคราะห์ แนะนำ แต่คนยังตัดสินใจ',
    active: true,
  },
  {
    year: '2027',
    label: 'AI Acts',
    desc: 'AI ลงมือทำงานบางอย่างได้เองตาม workflow ที่กำหนด',
    active: false,
  },
  {
    year: '2028',
    label: 'AI Coordinates',
    desc: 'AI หลายตัวทำงานร่วมกัน ประสานงาน ตัดสินใจ และรายงาน',
    active: false,
  },
]

const comparison = [
  { label: 'ทำงานได้ตลอดเวลา', traditional: '8 ชม./วัน', agentic: '24/7' },
  { label: 'ตอบสนองเหตุการณ์', traditional: 'รอให้คนเห็น', agentic: 'Realtime auto' },
  { label: 'วิเคราะห์ข้อมูล', traditional: 'ทำ report ทีหลัง', agentic: 'วิเคราะห์ทันที' },
  { label: 'แจ้งเตือนปัญหา', traditional: 'คนสังเกตเอง', agentic: 'AI detect + แจ้ง' },
  { label: 'Scalability', traditional: 'จ้างคนเพิ่ม', agentic: 'Scale ได้ไม่จำกัด' },
]

export default function AgenticAI() {
  return (
    <section
      className="section"
      style={{ background: '#0d2749' }}
      aria-labelledby="ai-heading"
    >
      <div className="container">
        {/* Header */}
        <div className="text-center mb-14">
          <Badge dot className="mb-4">
            The AI Future — เริ่มต้นปี 2026
          </Badge>
          <h2
            id="ai-heading"
            className="font-[--font-heading] font-bold text-white mb-4"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}
          >
            ระบบที่รู้จัก{' '}
            <Tooltip term="agentic-ai">
              <span className="text-[#ff6c01]">Agentic AI</span>
            </Tooltip>{' '}
            จะทำงานแทนคุณ
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg leading-relaxed">
            ไม่ใช่ระบบที่แค่บันทึกข้อมูล — แต่ระบบที่{' '}
            <strong className="text-white">สังเกต ตัดสินใจ และลงมือทำ</strong>{' '}
            เพื่อธุรกิจของคุณ
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          <StatCard value="$80B" label="ตลาด AI Agents ในปี 2030" sublabel="จาก $12B ในปี 2025" />
          <StatCard value="40%" label="งาน routine ที่ AI ทำแทนได้" sublabel="McKinsey 2025" />
          <StatCard value="8,000 ฿" label="รายได้เพิ่ม/เดือน" sublabel="ลูกค้ากลับ 10 คน × 800 ฿" highlight />
          <StatCard value="2 ชม." label="งาน manual ที่ประหยัดต่อวัน" sublabel="มูลค่า 3,000–18,000 ฿/เดือน" />
        </div>

        {/* Timeline */}
        <div className="mb-14">
          <h3 className="font-[--font-heading] font-semibold text-[#ff6c01] text-center text-sm uppercase tracking-widest mb-8">
            Timeline ของ AI ใน Business Operations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {timeline.map((t) => (
              <div
                key={t.year}
                className={[
                  'rounded-2xl p-6 relative',
                  t.active
                    ? 'bg-[#ff6c01] text-white'
                    : 'bg-white/[0.04] border border-white/[0.08] text-white',
                ].join(' ')}
              >
                {t.active && (
                  <span className="absolute top-4 right-4 text-xs bg-white/20 px-2 py-0.5 rounded-full font-medium">
                    NOW
                  </span>
                )}
                <span
                  className={[
                    'font-[--font-heading] font-bold text-4xl block mb-1',
                    t.active ? 'text-white' : 'text-[#ff6c01]',
                  ].join(' ')}
                >
                  {t.year}
                </span>
                <span className="font-[--font-heading] font-semibold text-lg block mb-2">
                  {t.label}
                </span>
                <p className={t.active ? 'text-white/80 text-sm' : 'text-white/50 text-sm'}>
                  {t.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison table */}
        <div className="rounded-2xl overflow-hidden border border-white/[0.08]">
          {/* Table header */}
          <div className="grid grid-cols-3 bg-[#011937] px-6 py-4">
            <span className="text-white/40 text-sm font-medium">ความสามารถ</span>
            <span className="text-white/60 text-sm font-medium text-center">
              Traditional App
            </span>
            <span className="text-[#ff6c01] text-sm font-semibold text-center">
              Agentic AI System
            </span>
          </div>
          {comparison.map((row, i) => (
            <div
              key={row.label}
              className={[
                'grid grid-cols-3 px-6 py-4 items-center',
                i % 2 === 0 ? 'bg-white/[0.02]' : 'bg-transparent',
                'border-t border-white/[0.04]',
              ].join(' ')}
            >
              <span className="text-white/70 text-sm">{row.label}</span>
              <span className="text-white/40 text-sm text-center">{row.traditional}</span>
              <span className="text-[#ff6c01] text-sm font-medium text-center">
                {row.agentic}
              </span>
            </div>
          ))}
        </div>

        {/* Quote */}
        <div className="mt-12 text-center">
          <blockquote className="text-white/80 text-xl italic max-w-2xl mx-auto leading-relaxed">
            &ldquo;ระบบที่ VIBAGEN สร้างวันนี้ ถูกออกแบบให้รองรับ{' '}
            <Tooltip term="ai-agent">AI Agent</Tooltip>{' '}
            ตั้งแต่วันแรก — เมื่อคุณพร้อม ระบบพร้อมแล้ว&rdquo;
          </blockquote>
        </div>
      </div>
    </section>
  )
}
