import type { Metadata } from 'next'
import { tutorialTopics } from '@/data/autocar-tutorial'
import TutorialViewer from '@/components/autocar/TutorialViewer'

export const metadata: Metadata = {
  title: 'คู่มือใช้งาน — AutoCar Care',
  description:
    'คู่มือการใช้งาน AutoCar Care แบบ Step-by-Step — ดูวิธีใช้จริงบนมือถือ ตั้งแต่จองซ่อมจนรับรถกลับ',
  alternates: { canonical: 'https://vibagen.com/autocar/tutorial' },
  keywords: [
    'autocar care คู่มือ',
    'วิธีใช้ autocar care',
    'tutorial อู่ซ่อมรถ',
    'ระบบจัดการอู่ คู่มือ',
  ],
  openGraph: {
    title: 'คู่มือใช้งาน — AutoCar Care',
    description: 'ดูวิธีใช้งานจริงบนมือถือ ตั้งแต่จองซ่อมจนรับรถกลับ',
    url: 'https://vibagen.com/autocar/tutorial',
    type: 'website',
  },
}

export default function TutorialPage() {
  return (
    <>
      {/* Hero */}
      <section style={{ backgroundColor: '#011937' }} className="text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <span className="text-base">📱</span>
            <span className="text-sm font-[--font-body] text-white/80">คู่มือ</span>
          </div>
          <h1 className="font-[--font-heading] font-bold text-4xl sm:text-5xl leading-tight mb-4">
            คู่มือใช้งาน AutoCar Care
          </h1>
          <p className="font-[--font-body] text-lg text-white/70 max-w-xl mx-auto">
            ดูวิธีใช้งานจริงบนมือถือ — จากหน้าจอลูกค้า ทุกขั้นตอน
          </p>
        </div>
      </section>

      {/* Tutorial viewer */}
      <section className="bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          {/* Topic header */}
          <div className="mb-10">
            <span className="inline-flex items-center gap-1.5 text-sm font-[--font-body] text-amber-600 font-medium mb-2">
              <span className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-xs">
                {tutorialTopics[0].topicNumber}
              </span>
              หัวข้อที่ {tutorialTopics[0].topicNumber}
            </span>
            <h2 className="font-[--font-heading] font-bold text-2xl sm:text-3xl text-[#0d2749] mb-2">
              {tutorialTopics[0].icon} {tutorialTopics[0].title}
            </h2>
            <p className="font-[--font-body] text-gray-500 text-base">
              {tutorialTopics[0].subtitle}
            </p>
          </div>

          <TutorialViewer topic={tutorialTopics[0]} />
        </div>
      </section>

      {/* CTA */}
      <section style={{ backgroundColor: '#011937' }} className="text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <h2 className="font-[--font-heading] font-bold text-3xl sm:text-4xl mb-4">
            อยากลองใช้งานจริง?
          </h2>
          <p className="font-[--font-body] text-white/70 mb-10 max-w-xl mx-auto">
            เปิด Demo ทดลองได้เลย ไม่ต้องสมัคร
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
              href="/autocar/features"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 font-[--font-heading] font-semibold text-base text-white border border-white/30 transition-colors duration-200 hover:bg-white/10"
            >
              ดูฟีเจอร์ทั้งหมด
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
