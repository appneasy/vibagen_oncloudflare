import type { Metadata } from 'next'
import Navbar from '@/components/sections/Navbar'
import Showcase from '@/components/sections/Showcase'
import Footer from '@/components/sections/Footer'
import Badge from '@/components/ui/Badge'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'ผลงาน — ระบบที่สร้างและส่งมอบแล้ว',
  description:
    'AutoCar Care และ Smart Factory Dashboard — ระบบที่ VIBAGEN สร้างและส่งมอบจริง พร้อม stack, feature และบทเรียนจากการใช้งานจริง',
}

export default function ShowcasePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24" style={{ background: '#011937' }}>
        <div className="container py-16 text-center">
          <Badge dot className="mb-4">Showcase</Badge>
          <h1
            className="font-[--font-heading] font-bold text-white mb-4"
            style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}
          >
            ระบบที่สร้างและส่งมอบแล้ว
          </h1>
          <p className="text-white/60 max-w-xl mx-auto text-lg">
            แต่ละโปรเจกต์คือการแก้ปัญหาจริง — ไม่ใช่ demo
          </p>
        </div>
        <Showcase />
        <div className="py-16 text-center">
          <Link
            href="/hire-us"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#ff6c01] text-white font-semibold text-lg rounded-xl hover:bg-[#d54e01] transition-colors"
          >
            มีโปรเจกต์ที่อยากพูดคุย? ปรึกษาฟรี →
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
