import type { Metadata } from 'next'
import { getAllLabMeta } from '@/lib/lab'
import Navbar from '@/components/sections/Navbar'
import Footer from '@/components/sections/Footer'
import LabContent from '@/components/lab/LabContent'

export const metadata: Metadata = {
  title: 'AI Lab — สิ่งที่ได้จากการคุยกับ AI',
  description:
    'ผลลัพธ์จริงจากการพูดคุยกับ AI อย่างมีทิศทาง — prompt ที่ copy ไปใช้ได้ และ insight ที่สกัดมาแล้ว',
  alternates: { canonical: 'https://vibagen.com/lab' },
}

export default function LabPage() {
  const notes = getAllLabMeta()

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-20 relative" style={{ background: '#0a0a0f' }}>
        {/* Dot grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.035) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
          aria-hidden="true"
        />
        <LabContent notes={notes} />
      </main>
      <Footer />
    </>
  )
}
