import Link from 'next/link'
import Badge from '@/components/ui/Badge'

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse 80% 60% at 60% 20%, rgba(255,108,1,0.08) 0%, transparent 60%), linear-gradient(180deg, #011937 0%, #0d2749 100%)',
      }}
      aria-label="Hero section"
    >
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
        aria-hidden="true"
      />

      <div className="container relative z-10 pt-24 pb-20">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <Badge dot className="mb-6">
            Product Engineering Studio
          </Badge>

          {/* Headline */}
          <h1
            className="font-[--font-heading] font-bold leading-[1.1] mb-6"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 3.75rem)' }}
          >
            เปลี่ยนไอเดียและ
            <br />
            <span className="text-[#ff6c01]">ปัญหาธุรกิจ</span>
            <br />
            ให้เป็น Software จริง
          </h1>

          {/* Sub */}
          <p className="text-white/70 text-xl leading-relaxed mb-4 max-w-2xl">
            VIBAGEN สร้างระบบที่ลูกค้า{' '}
            <strong className="text-white font-semibold">เป็นเจ้าของได้จริง</strong>{' '}
            — ไม่ผูกค่าใช้จ่ายรายเดือน ไม่สร้างการพึ่งพาระยะยาว
          </p>
          <p className="text-white/50 text-base leading-relaxed mb-10 max-w-xl">
            ด้วย Vibecoding + Agentic AI — พัฒนาได้เร็วขึ้น 50–70%{' '}
            และออกแบบให้รองรับ AI ตั้งแต่วันแรก
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 items-center">
            <Link
              href="/hire-us"
              className="px-8 py-4 bg-[#ff6c01] text-white font-semibold text-lg rounded-xl hover:bg-[#d54e01] transition-colors shadow-lg"
            >
              ปรึกษาฟรี →
            </Link>
            <Link
              href="/showcase"
              className="px-8 py-4 bg-transparent text-white font-semibold text-lg rounded-xl border border-white/20 hover:border-white/50 transition-colors"
            >
              ดูผลงาน
            </Link>
          </div>

          {/* Social proof strip */}
          <div className="mt-14 flex flex-wrap gap-8 items-center">
            <div className="flex flex-col">
              <span className="font-[--font-heading] font-bold text-3xl text-[#ff6c01]">50–70%</span>
              <span className="text-white/50 text-sm">เร็วกว่า Traditional Dev</span>
            </div>
            <div className="w-px h-10 bg-white/10 hidden sm:block" />
            <div className="flex flex-col">
              <span className="font-[--font-heading] font-bold text-3xl text-white">30 วัน</span>
              <span className="text-white/50 text-sm">Fast-Track MVP</span>
            </div>
            <div className="w-px h-10 bg-white/10 hidden sm:block" />
            <div className="flex flex-col">
              <span className="font-[--font-heading] font-bold text-3xl text-white">100%</span>
              <span className="text-white/50 text-sm">ลูกค้าเป็นเจ้าของระบบ</span>
            </div>
          </div>
        </div>

        {/* Floating dashboard preview — CSS only, no image needed */}
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 w-[45%] hidden xl:block"
          aria-hidden="true"
        >
          <DashboardPreview />
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent, #011937)',
        }}
        aria-hidden="true"
      />
    </section>
  )
}

/** CSS-only dashboard visual — no external image needed */
function DashboardPreview() {
  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(13, 39, 73, 0.7)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(20px)',
        transform: 'perspective(1000px) rotateY(-8deg) rotateX(2deg)',
        boxShadow: '0 40px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,108,1,0.1)',
      }}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
        <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
        <span className="ml-2 text-white/30 text-xs">VIBAGEN System Dashboard</span>
      </div>

      {/* Content mock */}
      <div className="p-5 space-y-4">
        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Revenue', value: '฿284K', color: '#ff6c01' },
            { label: 'Orders', value: '1,429', color: '#ffffff' },
            { label: 'Uptime', value: '99.8%', color: '#4ade80' },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-lg p-3"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <div className="text-[10px] text-white/40 mb-1">{s.label}</div>
              <div className="font-bold text-base" style={{ color: s.color }}>
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* Chart mock */}
        <div
          className="rounded-lg p-3 h-24 flex items-end gap-1.5"
          style={{ background: 'rgba(255,255,255,0.03)' }}
        >
          {[40, 65, 50, 80, 60, 90, 75, 85, 70, 95, 80, 100].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm"
              style={{
                height: `${h}%`,
                background:
                  i === 11
                    ? '#ff6c01'
                    : `rgba(255,108,1,${0.15 + i * 0.04})`,
              }}
            />
          ))}
        </div>

        {/* Table mock */}
        <div className="space-y-2">
          {['AutoCar — Service #2891', 'Smart Factory — Shift A', 'Smart Factory — Shift B'].map(
            (row, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg px-3 py-2"
                style={{ background: 'rgba(255,255,255,0.03)' }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: i === 0 ? '#ff6c01' : '#4ade80' }}
                  />
                  <span className="text-white/50 text-xs">{row}</span>
                </div>
                <span className="text-white/30 text-xs">Active</span>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  )
}
