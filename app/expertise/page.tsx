import type { Metadata } from 'next'
import Navbar from '@/components/sections/Navbar'
import Footer from '@/components/sections/Footer'
import Badge from '@/components/ui/Badge'
import Tooltip from '@/components/ui/Tooltip'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'ความเชี่ยวชาญ — เทคโนโลยีและแนวทางที่ VIBAGEN ใช้',
  description:
    'Next.js, PostgreSQL, Cloudflare, Agentic AI, Vibecoding, SAP B1 Integration — stack และความเชี่ยวชาญที่ VIBAGEN ใช้สร้างระบบให้ลูกค้า',
}

const expertiseAreas = [
  {
    title: 'Frontend & UI',
    items: ['Next.js 15 (App Router)', 'TypeScript', 'Tailwind CSS v4', 'Responsive + Mobile-first'],
  },
  {
    title: 'Backend & Database',
    items: ['PostgreSQL', 'Cloudflare D1 (SQLite)', 'Drizzle ORM', 'API-first Architecture'],
  },
  {
    title: 'AI Layer',
    items: ['OpenAI GPT-4o', 'Google Gemini', 'OCR + Classification', 'Agentic AI Workflow'],
  },
  {
    title: 'Infrastructure',
    items: ['Cloudflare Pages + Workers', 'Docker + VPS', 'GitHub CI/CD', 'Edge Runtime'],
  },
  {
    title: 'ERP Integration',
    items: ['SAP Business One API', 'Materialized View Pattern', 'Service Layer Integration', 'License Reduction Strategy'],
  },
  {
    title: 'Development Method',
    items: ['Vibecoding + AI-assisted', 'Modular Architecture', 'Rapid MVP (30 days)', 'No-Code → Modern Stack Migration'],
  },
]

export default function ExpertisePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-20" style={{ background: '#011937' }}>
        <div className="container">
          {/* Header */}
          <div className="text-center py-16">
            <Badge dot className="mb-4">Expertise</Badge>
            <h1
              className="font-[--font-heading] font-bold text-white mb-4"
              style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}
            >
              เทคโนโลยีและแนวทาง
              <br />
              ที่เราใช้สร้างระบบ
            </h1>
            <p className="text-white/60 max-w-xl mx-auto text-lg">
              เลือก stack ที่เหมาะกับปัญหา ไม่ใช่ stack ที่ถนัด
            </p>
          </div>

          {/* Expertise grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
            {expertiseAreas.map((area) => (
              <div
                key={area.title}
                className="rounded-2xl p-6 bg-white/[0.04] border border-white/[0.06] hover:border-[#ff6c01]/30 transition-all"
              >
                <h2 className="font-[--font-heading] font-semibold text-[#ff6c01] text-lg mb-4">
                  {area.title}
                </h2>
                <ul className="space-y-2">
                  {area.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-white/70 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ff6c01] shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Philosophy */}
          <div
            className="rounded-2xl p-10 text-center mb-10"
            style={{
              background: 'linear-gradient(135deg, rgba(255,108,1,0.08) 0%, rgba(13,39,73,0.6) 100%)',
              border: '1px solid rgba(255,108,1,0.15)',
            }}
          >
            <h2 className="font-[--font-heading] font-bold text-white text-2xl mb-4">
              ทำไมต้อง <Tooltip term="ai-ready">AI-Ready Architecture</Tooltip>?
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto leading-relaxed mb-6">
              เราออกแบบทุกระบบให้รองรับ AI ตั้งแต่วันแรก — API endpoints พร้อม, database structure ที่ AI อ่านได้,
              และ modular design ที่เพิ่ม AI feature ได้โดยไม่ต้อง rebuild ทั้งหมด
            </p>
            <p className="text-white/40 text-sm italic">
              ลงทุนวันนี้กับ architecture ที่ถูกต้อง — พร้อมสำหรับ AI ทุกรูปแบบที่จะมาในอนาคต
            </p>
          </div>

          <div className="text-center">
            <Link
              href="/hire-us"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#ff6c01] text-white font-semibold text-lg rounded-xl hover:bg-[#d54e01] transition-colors"
            >
              ปรึกษาการออกแบบระบบ →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
