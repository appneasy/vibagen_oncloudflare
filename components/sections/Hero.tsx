import Link from 'next/link'
import Badge from '@/components/ui/Badge'

export default function Hero() {
  return (
    <section
      className="relative min-h-[85vh] flex items-center overflow-hidden"
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

      <div className="container relative z-10 pt-28 pb-20">
        {/* 2-column layout */}
        <div className="flex flex-col md:flex-row md:items-center md:gap-12 lg:gap-16">

          {/* Left column — 55% */}
          <div className="flex-none md:w-[55%]">
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

          {/* Right column — 45% — hidden on mobile */}
          <div className="hidden md:flex flex-none md:w-[45%] items-center justify-center overflow-hidden" aria-hidden="true">
            <DashboardPreview />
          </div>

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

/** Inline SVG dashboard analytics mockup */
function DashboardPreview() {
  const barHeights = [38, 55, 42, 70, 52, 80, 62, 75, 58, 88, 68, 96]

  return (
    <div
      className="relative w-full max-w-[480px]"
      style={{
        filter: 'drop-shadow(0 0 40px rgba(255,108,1,0.18))',
        transform: 'perspective(1000px) rotateY(-6deg) rotateX(2deg)',
      }}
    >
      {/* Glass container */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(13,39,73,0.72)',
          border: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(20px)',
          boxShadow:
            '0 40px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,108,1,0.08), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
      >
        {/* Title bar */}
        <div
          className="flex items-center gap-2 px-4 py-3"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
          <span className="ml-2 text-white/30 text-xs font-mono">VIBAGEN · System Dashboard</span>
        </div>

        <div className="p-5 space-y-4">
          {/* Stat row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Revenue', value: '฿284K', change: '+23%', color: '#ff6c01' },
              { label: 'Users', value: '1,284', change: '+8%', color: '#ffffff' },
              { label: 'Uptime', value: '99.8%', change: '+0.2%', color: '#4ade80' },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl p-3"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.04)' }}
              >
                <div className="text-[10px] text-white/40 mb-1">{s.label}</div>
                <div className="font-bold text-sm leading-tight" style={{ color: s.color }}>
                  {s.value}
                </div>
                <div className="text-[9px] text-[#4ade80] mt-0.5">{s.change}</div>
              </div>
            ))}
          </div>

          {/* SVG Bar Chart */}
          <div
            className="rounded-xl overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.04)' }}
          >
            <div className="px-3 pt-3 pb-1 flex items-center justify-between">
              <span className="text-[10px] text-white/40">Monthly Revenue</span>
              <span className="text-[10px] text-[#ff6c01]">2025</span>
            </div>
            <svg
              viewBox="0 0 360 100"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full"
              style={{ height: '100px' }}
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="barGradActive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff6c01" stopOpacity="1" />
                  <stop offset="100%" stopColor="#d54e01" stopOpacity="0.6" />
                </linearGradient>
                <linearGradient id="barGradIdle" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.25)" stopOpacity="1" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.05)" stopOpacity="1" />
                </linearGradient>
              </defs>
              {/* Grid lines */}
              {[25, 50, 75].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={y}
                  x2="360"
                  y2={y}
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="1"
                />
              ))}
              {/* Bars */}
              {barHeights.map((h, i) => {
                const barW = 20
                const gap = 10
                const totalStep = barW + gap
                const startX = (360 - barHeights.length * totalStep + gap) / 2
                const x = startX + i * totalStep
                const barH = (h / 100) * 85
                const y = 95 - barH
                const isLast = i === barHeights.length - 1
                return (
                  <rect
                    key={i}
                    x={x}
                    y={y}
                    width={barW}
                    height={barH}
                    rx="3"
                    fill={isLast ? 'url(#barGradActive)' : 'url(#barGradIdle)'}
                  />
                )
              })}
            </svg>
          </div>

          {/* SVG Line / area sparkline */}
          <div
            className="rounded-xl overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.04)' }}
          >
            <div className="px-3 pt-3 pb-1 flex items-center justify-between">
              <span className="text-[10px] text-white/40">Active Users · Live</span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] inline-block" style={{ boxShadow: '0 0 6px #4ade80' }} />
                <span className="text-[10px] text-[#4ade80]">1,284</span>
              </span>
            </div>
            <svg
              viewBox="0 0 360 60"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full"
              style={{ height: '60px' }}
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff6c01" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#ff6c01" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Area fill */}
              <path
                d="M0,45 L30,38 L60,42 L90,28 L120,34 L150,20 L180,26 L210,14 L240,18 L270,8 L300,12 L330,6 L360,4 L360,60 L0,60 Z"
                fill="url(#areaGrad)"
              />
              {/* Line */}
              <path
                d="M0,45 L30,38 L60,42 L90,28 L120,34 L150,20 L180,26 L210,14 L240,18 L270,8 L300,12 L330,6 L360,4"
                fill="none"
                stroke="#ff6c01"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Last dot */}
              <circle cx="360" cy="4" r="3" fill="#ff6c01" />
              <circle cx="360" cy="4" r="6" fill="rgba(255,108,1,0.25)" />
            </svg>
          </div>

          {/* Activity rows */}
          <div className="space-y-2">
            {[
              { label: 'AutoCar — Service #2891', status: 'Active', dot: '#ff6c01' },
              { label: 'Smart Factory — Shift A', status: 'Online', dot: '#4ade80' },
              { label: 'Smart Factory — Shift B', status: 'Online', dot: '#4ade80' },
            ].map((row, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg px-3 py-2"
                style={{ background: 'rgba(255,255,255,0.025)' }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-none"
                    style={{ background: row.dot, boxShadow: `0 0 4px ${row.dot}` }}
                  />
                  <span className="text-white/50 text-xs">{row.label}</span>
                </div>
                <span className="text-white/30 text-xs">{row.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ambient glow behind card */}
      <div
        className="absolute inset-0 -z-10 rounded-2xl blur-3xl"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255,108,1,0.15) 0%, transparent 70%)',
          animation: 'pulse-glow 3s ease-in-out infinite'
        }}
      />
    </div>
  )
}
