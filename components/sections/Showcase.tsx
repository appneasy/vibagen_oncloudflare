import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import projectsData from '@/data/projects.json'

export default function Showcase() {
  return (
    <section
      className="section section-navy"
      aria-labelledby="showcase-heading"
    >
      <div className="container">
        {/* Header */}
        <div className="text-center mb-14">
          <Badge dot className="mb-4">
            Showcase
          </Badge>
          <h2
            id="showcase-heading"
            className="font-[--font-heading] font-bold text-[#0d2749] mb-4"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}
          >
            ระบบที่สร้างและส่งมอบแล้ว
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-lg">
            แต่ละโปรเจกต์คือการแก้ปัญหาจริง ไม่ใช่ demo
          </p>
        </div>

        {/* Project cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projectsData.map((project) => (
            <article
              key={project.id}
              className="rounded-2xl overflow-hidden bg-[#0d2749] border border-white/[0.06] hover:border-[#ff6c01]/30 transition-all duration-300 group"
            >
              {/* SVG mockup visual */}
              <div
                className="relative overflow-hidden"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(1,25,55,0.95) 0%, rgba(13,39,73,0.8) 100%)',
                  height: '200px',
                }}
              >
                {project.id === 'autocar-care' ? (
                  <AutoCarMockup />
                ) : (
                  <SmartFactoryMockup />
                )}
                {/* Industry tag */}
                <span className="absolute top-4 left-4 text-xs bg-white/10 text-white/60 px-3 py-1 rounded-full z-10">
                  {project.industry}
                </span>
                {/* Model tag */}
                <span
                  className="absolute top-4 right-4 text-xs px-3 py-1 rounded-full font-medium z-10"
                  style={{
                    background:
                      project.model === 'Perpetual License'
                        ? 'rgba(255,108,1,0.2)'
                        : 'rgba(255,255,255,0.08)',
                    color:
                      project.model === 'Perpetual License' ? '#ff6c01' : 'rgba(255,255,255,0.5)',
                  }}
                >
                  {project.model}
                </span>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-[--font-heading] font-bold text-white text-2xl mb-1">
                  {project.title}
                </h3>
                <p className="text-[#ff6c01] text-sm font-medium mb-3">{project.subtitle}</p>
                <p className="text-white/60 text-sm leading-relaxed mb-4">{project.desc}</p>

                {/* Highlight */}
                <div className="rounded-lg px-4 py-3 mb-5 bg-white/[0.04] border-l-2 border-[#ff6c01]">
                  <p className="text-white/80 text-sm italic">{project.highlight}</p>
                </div>

                {/* Stack tags */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-2.5 py-1 rounded-full bg-white/[0.06] text-white/50"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <Link
                  href={`/showcase#${project.id}`}
                  className="inline-flex items-center gap-2 text-[#ff6c01] text-sm font-semibold hover:gap-3 transition-all"
                >
                  {project.cta}
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* All projects link */}
        <div className="text-center mt-10">
          <Link
            href="/showcase"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[#0d2749]/20 text-[#0d2749]/70 hover:border-[#0d2749]/50 hover:text-[#0d2749] text-sm font-medium transition-all"
          >
            ดูผลงานทั้งหมด →
          </Link>
        </div>
      </div>
    </section>
  )
}

/** AutoCar Care — dashboard SVG with car/wrench icon and bar chart */
function AutoCarMockup() {
  const bars = [55, 70, 48, 82, 60, 75, 90]
  return (
    <svg
      viewBox="0 0 480 200"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="acBarActive" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff6c01" stopOpacity="1" />
          <stop offset="100%" stopColor="#d54e01" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="acBarIdle" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.22)" stopOpacity="1" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.04)" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="acBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#011937" />
          <stop offset="100%" stopColor="#0d2749" />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect width="480" height="200" fill="url(#acBg)" />

      {/* Subtle grid */}
      {[40, 80, 120, 160].map((y) => (
        <line key={y} x1="0" y1={y} x2="480" y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
      ))}

      {/* ─── Car icon outline (left side) ─── */}
      {/* Car body */}
      <rect x="30" y="105" width="110" height="38" rx="8" fill="none" stroke="rgba(255,108,1,0.5)" strokeWidth="2" />
      {/* Cabin */}
      <path d="M50,105 L65,78 L105,78 L120,105" fill="none" stroke="rgba(255,108,1,0.5)" strokeWidth="2" strokeLinejoin="round" />
      {/* Wheels */}
      <circle cx="60" cy="143" r="12" fill="none" stroke="rgba(255,108,1,0.4)" strokeWidth="2" />
      <circle cx="60" cy="143" r="5" fill="rgba(255,108,1,0.25)" />
      <circle cx="110" cy="143" r="12" fill="none" stroke="rgba(255,108,1,0.4)" strokeWidth="2" />
      <circle cx="110" cy="143" r="5" fill="rgba(255,108,1,0.25)" />
      {/* Windshield */}
      <path d="M68,105 L76,84 L100,84 L112,105" fill="rgba(255,108,1,0.06)" stroke="rgba(255,108,1,0.2)" strokeWidth="1" strokeLinejoin="round" />

      {/* Wrench icon (lower-left) */}
      <g transform="translate(155,115)" opacity="0.5">
        {/* Wrench handle */}
        <rect x="-4" y="0" width="8" height="30" rx="3" fill="rgba(255,255,255,0.2)" transform="rotate(-40)" />
        {/* Wrench head */}
        <circle cx="0" cy="0" r="10" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" />
        <circle cx="0" cy="0" r="5" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
      </g>

      {/* ─── Stat cards (right area) ─── */}
      {/* Revenue card */}
      <rect x="200" y="18" width="100" height="46" rx="7" fill="rgba(255,108,1,0.08)" stroke="rgba(255,108,1,0.2)" strokeWidth="1" />
      <text x="250" y="36" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.45)" fontFamily="sans-serif">Today Revenue</text>
      <text x="250" y="54" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#ff6c01" fontFamily="sans-serif">฿48,200</text>

      {/* Queue card */}
      <rect x="315" y="18" width="90" height="46" rx="7" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
      <text x="360" y="36" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.45)" fontFamily="sans-serif">Queue Today</text>
      <text x="360" y="54" textAnchor="middle" fontSize="15" fontWeight="bold" fill="rgba(255,255,255,0.9)" fontFamily="sans-serif">23 คิว</text>

      {/* Customers card */}
      <rect x="420" y="18" width="50" height="46" rx="7" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      <text x="445" y="36" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.45)" fontFamily="sans-serif">Cars</text>
      <text x="445" y="54" textAnchor="middle" fontSize="15" fontWeight="bold" fill="rgba(255,255,255,0.8)" fontFamily="sans-serif">847</text>

      {/* ─── Bar chart ─── */}
      <rect x="200" y="76" width="270" height="108" rx="7" fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
      <text x="212" y="93" fontSize="9" fill="rgba(255,255,255,0.4)" fontFamily="sans-serif">Weekly Revenue</text>

      {bars.map((h, i) => {
        const maxH = 65
        const barH = (h / 100) * maxH
        const barW = 24
        const gap = 14
        const startX = 218
        const baseY = 178
        const x = startX + i * (barW + gap)
        const y = baseY - barH
        const isLast = i === bars.length - 1
        const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={barH} rx="3" fill={isLast ? 'url(#acBarActive)' : 'url(#acBarIdle)'} />
            <text x={x + barW / 2} y={baseY + 12} textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.3)" fontFamily="sans-serif">{days[i]}</text>
          </g>
        )
      })}
    </svg>
  )
}

/** Smart Factory — dashboard SVG with gear/factory icon and line chart */
function SmartFactoryMockup() {
  const linePoints = '30,155 75,138 120,145 165,118 210,124 255,100 300,108 345,88 390,92 435,72 480,68'
  const areaPoints = '30,155 75,138 120,145 165,118 210,124 255,100 300,108 345,88 390,92 435,72 480,68 480,190 30,190'
  return (
    <svg
      viewBox="0 0 480 200"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="sfAreaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff6c01" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#ff6c01" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="sfBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#011937" />
          <stop offset="100%" stopColor="#0d2749" />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect width="480" height="200" fill="url(#sfBg)" />

      {/* Subtle grid */}
      {[50, 100, 150].map((y) => (
        <line key={y} x1="0" y1={y} x2="480" y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
      ))}

      {/* ─── Gear icon (left side, decorative) ─── */}
      <g transform="translate(75,115) scale(1.1)" opacity="0.55">
        {/* Outer gear teeth (8 teeth via rects rotated) */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
          <rect
            key={i}
            x="-5"
            y="-38"
            width="10"
            height="14"
            rx="2"
            fill="rgba(255,108,1,0.5)"
            transform={`rotate(${deg})`}
          />
        ))}
        {/* Outer circle */}
        <circle cx="0" cy="0" r="26" fill="none" stroke="rgba(255,108,1,0.45)" strokeWidth="2.5" />
        {/* Inner circle */}
        <circle cx="0" cy="0" r="12" fill="none" stroke="rgba(255,108,1,0.35)" strokeWidth="2" />
        {/* Center bolt */}
        <circle cx="0" cy="0" r="5" fill="rgba(255,108,1,0.3)" />
      </g>

      {/* Factory chimney outline */}
      <g opacity="0.3">
        <rect x="28" y="148" width="35" height="30" rx="2" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
        <rect x="36" y="135" width="10" height="15" rx="1" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
        <rect x="50" y="130" width="10" height="20" rx="1" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
        {/* Smoke puffs */}
        <circle cx="41" cy="130" r="4" fill="rgba(255,255,255,0.12)" />
        <circle cx="55" cy="124" r="5" fill="rgba(255,255,255,0.1)" />
        <circle cx="44" cy="122" r="3" fill="rgba(255,255,255,0.08)" />
      </g>

      {/* ─── Stat cards ─── */}
      {/* OEE card */}
      <rect x="158" y="14" width="90" height="46" rx="7" fill="rgba(255,108,1,0.09)" stroke="rgba(255,108,1,0.22)" strokeWidth="1" />
      <text x="203" y="32" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.45)" fontFamily="sans-serif">OEE</text>
      <text x="203" y="50" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#ff6c01" fontFamily="sans-serif">87.4%</text>

      {/* Downtime card */}
      <rect x="262" y="14" width="100" height="46" rx="7" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      <text x="312" y="32" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.45)" fontFamily="sans-serif">Downtime Today</text>
      <text x="312" y="50" textAnchor="middle" fontSize="15" fontWeight="bold" fill="rgba(255,255,255,0.88)" fontFamily="sans-serif">12 min</text>

      {/* Defect Rate card */}
      <rect x="376" y="14" width="95" height="46" rx="7" fill="rgba(74,222,128,0.06)" stroke="rgba(74,222,128,0.15)" strokeWidth="1" />
      <text x="423" y="32" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.45)" fontFamily="sans-serif">Defect Rate</text>
      <text x="423" y="50" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#4ade80" fontFamily="sans-serif">0.8%</text>

      {/* ─── Line / area chart (Production Output) ─── */}
      <rect x="158" y="72" width="313" height="116" rx="7" fill="rgba(255,255,255,0.022)" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
      {/* Chart title */}
      <text x="170" y="90" fontSize="9" fill="rgba(255,255,255,0.4)" fontFamily="sans-serif">Production Output · Last 24h</text>

      {/* Grid lines inside chart */}
      {[108, 128, 148, 168].map((y) => (
        <line key={y} x1="168" y1={y} x2="462" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      ))}

      {/* Area fill — clipped to chart bounds */}
      <clipPath id="sfChartClip">
        <rect x="158" y="72" width="313" height="116" rx="7" />
      </clipPath>
      <g clipPath="url(#sfChartClip)">
        {/* Offset the polyline into chart coordinate space */}
        <g transform="translate(138,0) scale(0.6229,0.52)">
          <polygon points={areaPoints} fill="url(#sfAreaGrad)" />
          <polyline
            points={linePoints}
            fill="none"
            stroke="#ff6c01"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Last data point highlight */}
          <circle cx="480" cy="68" r="5" fill="#ff6c01" />
          <circle cx="480" cy="68" r="10" fill="rgba(255,108,1,0.2)" />
        </g>
      </g>

      {/* Y-axis labels */}
      <text x="170" y="108" fontSize="8" fill="rgba(255,255,255,0.25)" fontFamily="sans-serif">100%</text>
      <text x="170" y="148" fontSize="8" fill="rgba(255,255,255,0.25)" fontFamily="sans-serif">50%</text>
      <text x="170" y="182" fontSize="8" fill="rgba(255,255,255,0.25)" fontFamily="sans-serif">0%</text>

      {/* Live badge */}
      <rect x="422" y="76" width="42" height="16" rx="8" fill="rgba(74,222,128,0.15)" />
      <circle cx="432" cy="84" r="3" fill="#4ade80" />
      <text x="438" y="88" fontSize="8" fill="#4ade80" fontFamily="sans-serif">LIVE</text>
    </svg>
  )
}
