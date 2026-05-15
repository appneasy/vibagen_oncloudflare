import type { Metadata } from 'next'
import { getAllArticleMeta } from '@/lib/mdx'
import Navbar from '@/components/sections/Navbar'
import Footer from '@/components/sections/Footer'
import KnowledgeContent from '@/components/sections/KnowledgeContent'

export const metadata: Metadata = {
  title: 'Knowledge Hub — บทความจากประสบการณ์จริง',
  description:
    'บทความจาก VIBAGEN เกี่ยวกับ Agentic AI, Vibecoding, Digital Transformation และ Business Systems — เขียนจากประสบการณ์การใช้งานจริง',
  alternates: { canonical: 'https://vibagen.com/knowledge' },
  keywords: ['agentic ai', 'vibecoding', 'digital transformation', 'business systems', 'บทความเทคโนโลยี', 'nocode to fullstack'],
}

export default function KnowledgePage() {
  const articles = getAllArticleMeta()

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-20" style={{ background: '#011937' }}>
        <KnowledgeContent articles={articles} />
      </main>
      <Footer />
    </>
  )
}
