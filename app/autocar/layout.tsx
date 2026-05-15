import type { Metadata } from 'next'
import Navbar from '@/components/sections/Navbar'
import Footer from '@/components/sections/Footer'
import AutoCarSubNav from '@/components/autocar/SubNav'

export const metadata: Metadata = {
  title: {
    default: 'AutoCar Care — ระบบจัดการอู่ซ่อม + ล้างรถ ครบวงจร',
    template: '%s | AutoCar Care — VIBAGEN',
  },
  description:
    'AutoCar Care — ระบบจัดการอู่ซ่อมรถ + ล้างรถ ครบวงจร Perpetual License เป็นเจ้าของ 100%',
}

export default function AutoCarLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <AutoCarSubNav />
      <main className="min-h-screen pt-[108px]">{children}</main>
      <Footer />
    </>
  )
}
