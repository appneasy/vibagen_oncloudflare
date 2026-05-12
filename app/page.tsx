import type { Metadata } from 'next'
import Navbar from '@/components/sections/Navbar'
import Hero from '@/components/sections/Hero'
import Problems from '@/components/sections/Problems'
import AgenticAI from '@/components/sections/AgenticAI'
import WhyVibagen from '@/components/sections/WhyVibagen'
import Services from '@/components/sections/Services'
import Showcase from '@/components/sections/Showcase'
import Process from '@/components/sections/Process'
import KnowledgeHub from '@/components/sections/KnowledgeHub'
import ContactForm from '@/components/sections/ContactForm'
import Footer from '@/components/sections/Footer'

export const metadata: Metadata = {
  title: 'VIBAGEN — Crafting Ideas into Real Products',
  description:
    'VIBAGEN คือ Product Engineering Studio ที่เปลี่ยนไอเดียและปัญหาธุรกิจให้กลายเป็น Software ที่ใช้งานได้จริง ด้วย Vibecoding และ Agentic AI — ลูกค้าเป็นเจ้าของระบบ 100%',
  alternates: {
    canonical: 'https://vibagen.com',
  },
}

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Problems />
        <AgenticAI />
        <WhyVibagen />
        <Services />
        <Showcase />
        <Process />
        <KnowledgeHub />
        <ContactForm />
      </main>
      <Footer />
    </>
  )
}
