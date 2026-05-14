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
                ) : project.id === 'smart-factory' ? (
                  <SmartFactoryMockup />
                ) : (
                  <TMKMigrationMockup />
                )}
                {/* Industry tag */}
                <span className="absolute top-4 left-4 text-xs bg-[#0d2749] text-white/60 px-3 py-1 rounded-full z-10">
                  {project.industry}
                </span>
                {/* Model tag */}
                <span
                  className="absolute top-4 right-4 text-xs px-3 py-1 rounded-full font-medium z-10"
                  style={{
                    background:
                      project.model === 'Perpetual License'
                        ? '#ff6c01'
                        : '#0d2749',
                    color: '#ffffff',
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
                  href={`/showcase/${project.id}`}
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

/** Smart Factory — 3 mobile screenshots side by side */
function SmartFactoryMockup() {
  const screens = [
    { src: '/images/sf-production.png', label: 'Production' },
    { src: '/images/sf-lab-yield.png', label: 'LAB / Yield' },
    { src: '/images/sf-line-liff.png', label: 'LINE LIFF' },
  ]
  return (
    <div
      className="absolute inset-0 flex items-center justify-center gap-3 px-6"
      style={{
        background: 'linear-gradient(135deg, #011937 0%, #0d2749 100%)',
      }}
    >
      {screens.map((s) => (
        <div key={s.label} className="flex flex-col items-center gap-1">
          <div className="w-[90px] h-[160px] rounded-xl border border-white/15 overflow-hidden bg-black/30 shadow-lg">
            <img
              src={s.src}
              alt={s.label}
              className="w-full h-full object-cover object-top"
              loading="lazy"
            />
          </div>
          <span className="text-white/40 text-[10px]">{s.label}</span>
        </div>
      ))}
    </div>
  )
}

/** TMK Migration — SVG dashboard with approval flow + chart */
function TMKMigrationMockup() {
  return (
    <svg
      viewBox="0 0 480 200"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="tmkBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#011937" />
          <stop offset="100%" stopColor="#0d2749" />
        </linearGradient>
      </defs>
      <rect width="480" height="200" fill="url(#tmkBg)" />
      {[50, 100, 150].map((y) => (
        <line key={y} x1="0" y1={y} x2="480" y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
      ))}

      {/* Approval flow cards (left) */}
      <rect x="24" y="20" width="130" height="34" rx="6" fill="rgba(250,204,21,0.08)" stroke="rgba(250,204,21,0.25)" strokeWidth="1" />
      <circle cx="40" cy="37" r="5" fill="#facc15" />
      <text x="52" y="41" fontSize="9" fill="rgba(255,255,255,0.7)" fontFamily="sans-serif">Pending Review</text>

      <text x="89" y="68" textAnchor="middle" fontSize="12" fill="rgba(255,108,1,0.5)" fontFamily="sans-serif">↓</text>

      <rect x="24" y="74" width="130" height="34" rx="6" fill="rgba(74,222,128,0.08)" stroke="rgba(74,222,128,0.25)" strokeWidth="1" />
      <circle cx="40" cy="91" r="5" fill="#4ade80" />
      <text x="52" y="95" fontSize="9" fill="rgba(255,255,255,0.7)" fontFamily="sans-serif">Approved</text>

      <text x="89" y="122" textAnchor="middle" fontSize="12" fill="rgba(255,108,1,0.5)" fontFamily="sans-serif">↓</text>

      <rect x="24" y="128" width="130" height="34" rx="6" fill="rgba(255,108,1,0.08)" stroke="rgba(255,108,1,0.25)" strokeWidth="1" />
      <circle cx="40" cy="145" r="5" fill="#ff6c01" />
      <text x="52" y="149" fontSize="9" fill="rgba(255,255,255,0.7)" fontFamily="sans-serif">Published</text>

      <text x="89" y="180" fontSize="8" fill="rgba(255,255,255,0.3)" fontFamily="sans-serif">Approval Flow</text>

      {/* Stats (center-top) */}
      <rect x="175" y="14" width="85" height="42" rx="6" fill="rgba(255,108,1,0.08)" stroke="rgba(255,108,1,0.2)" strokeWidth="1" />
      <text x="217" y="32" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.45)" fontFamily="sans-serif">RBAC Users</text>
      <text x="217" y="48" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#ff6c01" fontFamily="sans-serif">50</text>

      <rect x="272" y="14" width="85" height="42" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      <text x="314" y="32" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.45)" fontFamily="sans-serif">Modules</text>
      <text x="314" y="48" textAnchor="middle" fontSize="14" fontWeight="bold" fill="rgba(255,255,255,0.9)" fontFamily="sans-serif">9</text>

      <rect x="369" y="14" width="95" height="42" rx="6" fill="rgba(74,222,128,0.06)" stroke="rgba(74,222,128,0.15)" strokeWidth="1" />
      <text x="416" y="32" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.45)" fontFamily="sans-serif">Deploy Time</text>
      <text x="416" y="48" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#4ade80" fontFamily="sans-serif">4 wks</text>

      {/* Table mockup (right) */}
      <rect x="175" y="68" width="289" height="118" rx="6" fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
      {/* Table header */}
      <rect x="175" y="68" width="289" height="22" rx="6" fill="rgba(255,108,1,0.15)" />
      <text x="195" y="83" fontSize="8" fill="rgba(255,255,255,0.7)" fontFamily="sans-serif">Date</text>
      <text x="265" y="83" fontSize="8" fill="rgba(255,255,255,0.7)" fontFamily="sans-serif">Production</text>
      <text x="345" y="83" fontSize="8" fill="rgba(255,255,255,0.7)" fontFamily="sans-serif">Yield</text>
      <text x="415" y="83" fontSize="8" fill="rgba(255,255,255,0.7)" fontFamily="sans-serif">Status</text>

      {/* Table rows */}
      {[0, 1, 2, 3].map((r) => {
        const y = 98 + r * 22
        const data = [
          ['12 May', '1,250 ton', '17.72%', 'Approved'],
          ['11 May', '1,180 ton', '17.85%', 'Approved'],
          ['10 May', '1,320 ton', '17.63%', 'Pending'],
          ['09 May', '1,200 ton', '17.91%', 'Approved'],
        ][r]!
        return (
          <g key={r}>
            <line x1="175" y1={y - 4} x2="464" y2={y - 4} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            <text x="195" y={y + 8} fontSize="8" fill="rgba(255,255,255,0.5)" fontFamily="sans-serif">{data[0]}</text>
            <text x="265" y={y + 8} fontSize="8" fill="rgba(255,255,255,0.5)" fontFamily="sans-serif">{data[1]}</text>
            <text x="345" y={y + 8} fontSize="8" fill="rgba(255,255,255,0.5)" fontFamily="sans-serif">{data[2]}</text>
            <circle cx="418" cy={y + 5} r="3" fill={data[3] === 'Approved' ? '#4ade80' : '#facc15'} />
            <text x="426" y={y + 8} fontSize="7" fill={data[3] === 'Approved' ? '#4ade80' : '#facc15'} fontFamily="sans-serif">{data[3]}</text>
          </g>
        )
      })}
    </svg>
  )
}
