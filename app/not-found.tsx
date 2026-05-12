import Link from 'next/link'
import Navbar from '@/components/sections/Navbar'
import Footer from '@/components/sections/Footer'

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main
        className="min-h-screen flex items-center justify-center"
        style={{ background: '#011937' }}
      >
        <div className="text-center">
          <p className="text-[#ff6c01] text-6xl font-bold mb-4">404</p>
          <h1 className="font-[--font-heading] text-white text-2xl font-bold mb-2">
            ไม่พบหน้าที่คุณต้องการ
          </h1>
          <p className="text-white/50 mb-8">หน้านี้อาจถูกย้าย ลบ หรือไม่มีอยู่จริง</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#ff6c01] text-white font-semibold rounded-xl hover:bg-[#d54e01] transition-colors"
          >
            ← กลับหน้าแรก
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
