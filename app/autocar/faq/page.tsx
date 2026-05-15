import type { Metadata } from 'next'
import { faqItems, categories } from '@/data/autocar-faq'
import FaqFilter from '@/components/autocar/FaqFilter'

export const metadata: Metadata = {
  title: 'คำถาม-คำตอบ — AutoCar Care',
  description: '20 คำถามยอดนิยมเกี่ยวกับ AutoCar Care ระบบจัดการอู่ซ่อมรถ — ตอบทุกข้อสงสัยได้ทันที',
  alternates: { canonical: 'https://vibagen.com/autocar/faq' },
  keywords: [
    'autocar care คำถาม',
    'FAQ ระบบอู่ซ่อมรถ',
    'autocar care ราคา',
    'โปรแกรมอู่ซ่อมรถ ราคา',
    'โปรแกรมอู่ ราคาเท่าไหร่',
    'ระบบอู่ซ่อมรถ เปรียบเทียบ',
    'ระบบจัดการอู่ซ่อม support',
    'autocar care ใช้งาน',
    'LINE อู่ซ่อมรถ',
  ],
  openGraph: {
    title: 'คำถาม-คำตอบ — AutoCar Care',
    description: '20 คำถามยอดนิยม ตอบทุกข้อสงสัยเกี่ยวกับ AutoCar Care',
    url: 'https://vibagen.com/autocar/faq',
    type: 'website',
  },
}

export default function FaqPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.short,
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section style={{ backgroundColor: '#011937' }} className="text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-sm font-[--font-body] text-white/80">FAQ</span>
          </div>
          <h1 className="font-[--font-heading] font-bold text-4xl sm:text-5xl leading-tight mb-4">
            คำถาม-คำตอบ เกี่ยวกับโปรแกรม
          </h1>
          <p className="font-[--font-body] text-lg text-white/70 max-w-xl mx-auto">
            20 คำถามยอดนิยม — ตอบทุกข้อสงสัย ได้ทันที
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <FaqFilter items={faqItems} categories={categories} />
        </div>
      </section>

      <section style={{ backgroundColor: '#011937' }} className="text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <h2 className="font-[--font-heading] font-bold text-3xl sm:text-4xl mb-4">
            ยังมีคำถามอื่นอีกไหม?
          </h2>
          <p className="font-[--font-body] text-white/70 mb-10 max-w-xl mx-auto">
            ทีมเราพร้อมตอบทุกคำถาม ติดต่อผ่าน LINE ได้เลย
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://demo.vibagen.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 font-[--font-heading] font-semibold text-base text-white transition-colors duration-200 hover:opacity-90"
              style={{ backgroundColor: '#ff6c01' }}
            >
              เปิด Live Demo →
            </a>
            <a
              href="/autocar"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 font-[--font-heading] font-semibold text-base text-white border border-white/30 transition-colors duration-200 hover:bg-white/10"
            >
              ดูข้อมูลนำเสนอ
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
