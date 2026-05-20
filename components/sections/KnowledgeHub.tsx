import Link from 'next/link'
import Badge from '@/components/ui/Badge'

// Preview articles — matched to actual MDX files in content/articles/
const previewArticles = [
  {
    slug: 'real-barrier-agentic-ai-is-not-technology',
    category: 'Agentic AI',
    title: 'สิ่งที่ยากที่สุดของการนำ Agentic AI มาใช้ ไม่ใช่ตัว AI — แต่คือองค์กรของคุณเอง',
    excerpt:
      'ทุกคนถามว่า Agentic AI ทำได้ไหม? คำตอบคือทำได้เสมอ สิ่งที่ทำไม่ได้คือบังคับให้ทีมงานกรอกข้อมูลให้ครบ และนั่นคือกำแพงที่แท้จริง',
    readTime: 8,
    date: '2026-05-12',
  },
  {
    slug: 'nocode-to-ai-assisted-development',
    category: 'Vibecoding',
    title: 'NoCode ดีพอแล้ว — แล้วทำไมถึงเปลี่ยนใจ เมื่อ AI โค้ดแทนได้จริง',
    excerpt:
      'กันยายน 2025 ผมกำลังสร้าง Prototype ด้วย AppSheet อยู่ดีๆ AI ก็มาเปลี่ยนทุกอย่าง ไม่ใช่เพราะ NoCode ไม่ดี แต่เพราะกำแพงระหว่าง \'ทำได้\' กับ \'ต้องเขียนโค้ด\' ถูกทลายลงแล้ว',
    readTime: 10,
    date: '2026-05-14',
  },
  {
    slug: 'from-appsheet-to-real-app',
    category: 'Case Study',
    title: 'จาก Logsheet กระดาษสู่ Dashboard Real-time: บทเรียน 9 ระบบในโรงงานปาล์มน้ำมัน',
    excerpt:
      'ทุกโรงงานเริ่มจากกระดาษ แล้วก็ไปถึง Excel แล้วก็ถึง AppSheet จนวันหนึ่งมันไม่พออีกต่อไป',
    readTime: 12,
    date: '2026-05-13',
  },
]

const categoryColors: Record<string, string> = {
  'Agentic AI':      'text-[#ff6c01] bg-[#ff6c01]/10',
  'Vibecoding':      'text-blue-400 bg-blue-400/10',
  'Business Digital':'text-emerald-400 bg-emerald-400/10',
  'Case Study':      'text-amber-400 bg-amber-400/10',
  'Maintenance':     'text-purple-400 bg-purple-400/10',
}

export default function KnowledgeHub() {
  return (
    <section
      className="section section-navy"
      aria-labelledby="knowledge-heading"
    >
      <div className="container">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <Badge dot className="mb-4">
              Knowledge Hub
            </Badge>
            <h2
              id="knowledge-heading"
              className="font-[--font-heading] font-bold text-[#0d2749]"
              style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}
            >
              บทความจากประสบการณ์จริง
            </h2>
          </div>
          <Link
            href="/knowledge"
            className="text-[#ff6c01] text-sm font-semibold hover:gap-2 flex items-center gap-1.5 transition-all shrink-0"
          >
            ดูทั้งหมด →
          </Link>
        </div>

        {/* Article cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {previewArticles.map((article) => {
            const catStyle = categoryColors[article.category] ?? 'text-gray-500 bg-gray-100'
            return (
              <Link
                key={article.slug}
                href={`/knowledge/${article.slug}`}
                className="group rounded-2xl p-6 bg-white border border-[#0d2749]/8 shadow-sm hover:border-[#ff6c01]/40 hover:shadow-md transition-all duration-300 flex flex-col gap-4"
              >
                {/* Category + read time */}
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${catStyle}`}>
                    {article.category}
                  </span>
                  <span className="text-gray-400 text-xs">{article.readTime} นาที</span>
                </div>

                {/* Title */}
                <h3 className="font-[--font-heading] font-semibold text-[#0d2749] text-lg leading-snug group-hover:text-[#ff6c01] transition-colors">
                  {article.title}
                </h3>

                {/* Excerpt */}
                <p className="text-gray-500 text-sm leading-relaxed flex-1">{article.excerpt}</p>

                {/* Date + arrow */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">
                    {new Date(article.date).toLocaleDateString('th-TH', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                  <span className="text-[#ff6c01] group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
