import type { Metadata } from 'next'
import Navbar from '@/components/sections/Navbar'
import Services from '@/components/sections/Services'
import Footer from '@/components/sections/Footer'
import Badge from '@/components/ui/Badge'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'บริการ — สิ่งที่ VIBAGEN สร้าง',
  description:
    'ระบบ Internal Business, Operational Platforms, AI-Assisted Systems, Rapid MVP, ERP Integration และ No-Code Migration — ออกแบบตาม workflow จริงของคุณ',
}

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24" style={{ background: '#011937' }}>
        <div className="container py-16 text-center">
          <Badge dot className="mb-4">What We Build</Badge>
          <h1
            className="font-[--font-heading] font-bold text-white mb-4"
            style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}
          >
            สิ่งที่ VIBAGEN สร้าง
          </h1>
          <p className="text-white/60 max-w-xl mx-auto text-lg mb-4">
            ทุก solution ออกแบบตาม workflow จริงของลูกค้า ไม่ใช่ template สำเร็จรูป
          </p>
        </div>
        <Services />
        <div className="py-16 text-center">
          <Link
            href="/hire-us"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#ff6c01] text-white font-semibold text-lg rounded-xl hover:bg-[#d54e01] transition-colors"
          >
            ปรึกษาฟรี →
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
