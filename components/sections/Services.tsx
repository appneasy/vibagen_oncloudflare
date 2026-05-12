import Badge from '@/components/ui/Badge'
import servicesData from '@/data/services.json'

// Icon map (inline SVG paths via Heroicons outline)
const icons: Record<string, React.ReactNode> = {
  Layers: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" />
    </svg>
  ),
  Zap: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  ),
  Brain: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  ),
  Rocket: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
    </svg>
  ),
  Database: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
    </svg>
  ),
  ArrowUpRight: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
    </svg>
  ),
}

const variantMap: Record<string, { bg: string; iconColor: string; textColor: string }> = {
  navy:  { bg: 'bg-[#0d2749] border border-white/[0.06]',           iconColor: 'text-[#ff6c01]', textColor: 'text-white' },
  orange:{ bg: 'bg-[#ff6c01]',                                       iconColor: 'text-white',     textColor: 'text-white' },
  glass: { bg: 'bg-[#f0f4f8] border border-[#0d2749]/8', iconColor: 'text-[#ff6c01]', textColor: 'text-[#0d2749]' },
}

export default function Services() {
  return (
    <section
      className="section section-dark"
      aria-labelledby="services-heading"
    >
      <div className="container">
        {/* Header */}
        <div className="text-center mb-14">
          <Badge dot className="mb-4">
            What We Build
          </Badge>
          <h2
            id="services-heading"
            className="font-[--font-heading] font-bold text-[#0d2749] mb-4"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}
          >
            สิ่งที่ VIBAGEN สร้าง
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            ทุก solution ออกแบบตาม workflow จริงของลูกค้า ไม่ใช่ template สำเร็จรูป
          </p>
        </div>

        {/* Bento-style grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {servicesData.map((service) => {
            const v = variantMap[service.variant] ?? variantMap.navy
            const isOrange = service.variant === 'orange'
            const isNavy = service.variant === 'navy'
            const isDark = isOrange || isNavy
            return (
              <div
                key={service.id}
                className={[
                  'rounded-2xl p-6 flex flex-col gap-4',
                  'transition-all duration-300 hover:scale-[1.01]',
                  service.span === 2 ? 'lg:col-span-2' : 'col-span-1',
                  v.bg,
                ].join(' ')}
              >
                {/* Icon */}
                <div className={['w-12 h-12 flex items-center justify-center', v.iconColor].join(' ')}>
                  {icons[service.icon]}
                </div>

                {/* Title */}
                <div>
                  <p className={['text-xs font-medium mb-1', isOrange ? 'text-white/70' : 'text-[#ff6c01]'].join(' ')}>
                    {service.titleTh}
                  </p>
                  <h3 className={['font-[--font-heading] font-semibold text-xl', v.textColor].join(' ')}>
                    {service.title}
                  </h3>
                </div>

                {/* Description */}
                <p className={['text-sm leading-relaxed', isDark ? (isOrange ? 'text-white/80' : 'text-white/55') : 'text-gray-500'].join(' ')}>
                  {service.desc}
                </p>

                {/* Example tags */}
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {service.examples.map((ex) => (
                    <span
                      key={ex}
                      className={[
                        'text-xs px-2.5 py-1 rounded-full',
                        isDark
                          ? (isOrange ? 'bg-white/20 text-white' : 'bg-white/[0.06] text-white/50')
                          : 'bg-[#0d2749]/8 text-gray-500',
                      ].join(' ')}
                    >
                      {ex}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
