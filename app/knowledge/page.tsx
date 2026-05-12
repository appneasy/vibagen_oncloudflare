import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllArticleMeta } from '@/lib/mdx'
import Navbar from '@/components/sections/Navbar'
import Footer from '@/components/sections/Footer'
import Badge from '@/components/ui/Badge'

export const metadata: Metadata = {
  title: 'Knowledge Hub — บทความจากประสบการณ์จริง',
  description:
    'บทความจาก VIBAGEN เกี่ยวกับ Agentic AI, Vibecoding, Digital Transformation และ Business Systems — เขียนจากประสบการณ์การใช้งานจริง',
}

const categoryColors: Record<string, string> = {
  'Agentic AI':       'text-[#ff6c01] bg-[#ff6c01]/10 border-[#ff6c01]/20',
  'Vibecoding':       'text-blue-400 bg-blue-400/10 border-blue-400/20',
  'Business Digital': 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  'Maintenance':      'text-purple-400 bg-purple-400/10 border-purple-400/20',
}

const categories = ['ทั้งหมด', 'Agentic AI', 'Vibecoding', 'Business Digital', 'Maintenance']

export default function KnowledgePage({
  searchParams,
}: {
  searchParams: { category?: string }
}) {
  const articles = getAllArticleMeta()
  const activeCategory = searchParams.category ?? 'ทั้งหมด'

  const filtered =
    activeCategory === 'ทั้งหมด'
      ? articles
      : articles.filter((a) => a.category === activeCategory)

  const featured = articles.find((a) => a.featured)

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-20" style={{ background: '#011937' }}>
        <div className="container">
          {/* Header */}
          <div className="text-center mb-14">
            <Badge dot className="mb-4">Knowledge Hub</Badge>
            <h1
              className="font-[--font-heading] font-bold text-white mb-4"
              style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}
            >
              บทความจากประสบการณ์จริง
            </h1>
            <p className="text-white/60 max-w-2xl mx-auto text-lg">
              ไม่ใช่ content marketing — แต่คือสิ่งที่เรียนรู้จากการทำระบบจริง
              ในองค์กรจริง กับปัญหาจริง
            </p>
          </div>

          {/* Featured article */}
          {featured && (
            <Link
              href={`/knowledge/${featured.slug}`}
              className="group block rounded-2xl p-8 mb-10 border border-[#ff6c01]/20 hover:border-[#ff6c01]/40 transition-all"
              style={{
                background:
                  'linear-gradient(135deg, rgba(255,108,1,0.08) 0%, rgba(13,39,73,0.6) 100%)',
              }}
            >
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full border bg-[#ff6c01]/10 text-[#ff6c01] border-[#ff6c01]/20">
                    Featured · {featured.category}
                  </span>
                  <span className="text-white/30 text-xs">{featured.readTime} นาที</span>
                </div>
                <span className="text-white/30 text-xs">
                  {new Date(featured.date).toLocaleDateString('th-TH', {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </span>
              </div>
              <h2 className="font-[--font-heading] font-bold text-white text-2xl leading-snug mb-3 group-hover:text-[#ff6c01] transition-colors">
                {featured.title}
              </h2>
              <p className="text-white/60 leading-relaxed mb-4">{featured.excerpt}</p>
              <span className="text-[#ff6c01] text-sm font-semibold group-hover:gap-3 flex items-center gap-2 transition-all">
                อ่านบทความ →
              </span>
            </Link>
          )}

          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <Link
                key={cat}
                href={cat === 'ทั้งหมด' ? '/knowledge' : `/knowledge?category=${cat}`}
                className={[
                  'px-4 py-2 rounded-full text-sm font-medium border transition-all',
                  activeCategory === cat
                    ? 'bg-[#ff6c01] text-white border-[#ff6c01]'
                    : 'bg-transparent text-white/50 border-white/10 hover:border-white/30 hover:text-white',
                ].join(' ')}
              >
                {cat}
              </Link>
            ))}
          </div>

          {/* Article grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-white/40">ยังไม่มีบทความในหมวดนี้</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((article) => {
                const catStyle = categoryColors[article.category] ?? 'text-white/50 bg-white/5 border-white/10'
                return (
                  <Link
                    key={article.slug}
                    href={`/knowledge/${article.slug}`}
                    className="group rounded-2xl p-6 bg-white/[0.04] border border-white/[0.06] hover:border-[#ff6c01]/30 transition-all flex flex-col gap-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${catStyle}`}>
                        {article.category}
                      </span>
                      <span className="text-white/30 text-xs">{article.readTime} นาที</span>
                    </div>
                    <h3 className="font-[--font-heading] font-semibold text-white text-lg leading-snug group-hover:text-[#ff6c01] transition-colors flex-1">
                      {article.title}
                    </h3>
                    <p className="text-white/55 text-sm leading-relaxed">{article.excerpt}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/30">
                        {new Date(article.date).toLocaleDateString('th-TH', {
                          year: 'numeric', month: 'long', day: 'numeric',
                        })}
                      </span>
                      <span className="text-[#ff6c01] group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
