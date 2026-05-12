import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import projectsData from '@/data/projects.json'

export default function Showcase() {
  return (
    <section
      className="section"
      style={{ background: 'linear-gradient(180deg, #011937 0%, #0d2749 100%)' }}
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
            className="font-[--font-heading] font-bold text-white mb-4"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}
          >
            ระบบที่สร้างและส่งมอบแล้ว
          </h2>
          <p className="text-white/60 max-w-xl mx-auto text-lg">
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
              {/* Image placeholder */}
              <div
                className="relative h-52 flex items-center justify-center"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(255,108,1,0.08) 0%, rgba(13,39,73,0.8) 100%)',
                }}
              >
                {/* Dashboard mockup bars */}
                <div className="flex items-end gap-2 opacity-40">
                  {[60, 80, 50, 90, 70, 100, 75].map((h, i) => (
                    <div
                      key={i}
                      className="w-6 rounded-sm"
                      style={{
                        height: `${h * 0.7}px`,
                        background: i === 5 ? '#ff6c01' : 'rgba(255,255,255,0.3)',
                      }}
                    />
                  ))}
                </div>
                {/* Industry tag */}
                <span className="absolute top-4 left-4 text-xs bg-white/10 text-white/60 px-3 py-1 rounded-full">
                  {project.industry}
                </span>
                {/* Model tag */}
                <span
                  className="absolute top-4 right-4 text-xs px-3 py-1 rounded-full font-medium"
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
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/20 text-white/70 hover:border-white/50 hover:text-white text-sm font-medium transition-all"
          >
            ดูผลงานทั้งหมด →
          </Link>
        </div>
      </div>
    </section>
  )
}
