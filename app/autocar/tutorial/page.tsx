import type { Metadata } from 'next'
import { tutorialTopics, phases } from '@/data/autocar-tutorial'
import TutorialPage from '@/components/autocar/TutorialPage'

export const metadata: Metadata = {
  title: 'คู่มือใช้งาน — AutoCar Care',
  description:
    'คู่มือการใช้งาน AutoCar Care 12 หัวข้อ 4 Phases — ดูวิธีใช้จริงทั้ง Admin และลูกค้า',
  alternates: { canonical: 'https://vibagen.com/autocar/tutorial' },
  keywords: [
    'autocar care คู่มือ',
    'วิธีใช้ autocar care',
    'วิธีใช้โปรแกรมอู่ซ่อมรถ',
    'สอนใช้ระบบคาร์แคร์',
    'tutorial อู่ซ่อมรถ',
    'ระบบจัดการอู่ คู่มือ',
    'อู่ซ่อมรถ training',
    'โปรแกรมอู่ซ่อมรถ สอนใช้',
  ],
  openGraph: {
    title: 'คู่มือใช้งาน — AutoCar Care',
    description: 'คู่มือ 12 หัวข้อ ดูวิธีใช้งานจริงทั้ง Admin และลูกค้า',
    url: 'https://vibagen.com/autocar/tutorial',
    type: 'website',
  },
}

export default function TutorialPageRoute() {
  return (
    <>
      {/* Hero */}
      <section style={{ backgroundColor: '#011937' }} className="text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <span className="text-base">📱</span>
            <span className="text-sm font-[--font-body] text-white/80">คู่มือ 12 หัวข้อ</span>
          </div>
          <h1 className="font-[--font-heading] font-bold text-3xl sm:text-4xl leading-tight mb-4">
            คู่มือใช้งาน AutoCar Care
          </h1>
          <p className="font-[--font-body] text-base text-white/70 max-w-2xl mx-auto">
            เรียนรู้การใช้งานระบบ ทั้งฝั่ง Admin และลูกค้า — ตั้งแต่รับรถเข้าซ่อม จนส่งมอบ
          </p>

          {/* Phase summary pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {phases.map((ph) => (
              <div
                key={ph.phase}
                className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-3 py-1"
              >
                <span className="text-xs font-[--font-heading] font-semibold text-amber-400">
                  Phase {ph.phase}
                </span>
                <span className="text-xs font-[--font-body] text-white/70">{ph.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tutorial content */}
      <section className="bg-[#f8f9fc] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <TutorialPage topics={tutorialTopics} phases={phases} />
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
