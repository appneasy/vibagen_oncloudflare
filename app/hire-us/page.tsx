import type { Metadata } from 'next'
import Navbar from '@/components/sections/Navbar'
import ContactForm from '@/components/sections/ContactForm'
import Footer from '@/components/sections/Footer'
import Badge from '@/components/ui/Badge'

export const metadata: Metadata = {
  title: 'ปรึกษาฟรี — ให้เราช่วยแก้ปัญหาธุรกิจของคุณ',
  description:
    'ปรึกษาทำระบบฟรี รับทำเว็บแอพ จ้างทำระบบ SME ระบบภายในองค์กร — วิเคราะห์และเสนอแนวทาง ไม่มีข้อผูกมัด ตอบกลับภายใน 24 ชั่วโมง',
  alternates: { canonical: 'https://vibagen.com/hire-us' },
  keywords: ['ปรึกษาทำระบบ', 'รับทำเว็บแอพ', 'จ้างทำระบบ SME', 'ระบบภายในองค์กร', 'จ้างเขียนโปรแกรม', 'รับทำระบบ ERP', 'software house ไทย ปรึกษา'],
}

// FAQ JSON-LD
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'VIBAGEN รับงานประเภทไหนบ้าง?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'รับสร้างระบบ Internal Business Systems, Operational Platforms, AI-Assisted Systems, Rapid MVP, ERP Integration และ No-Code Migration สำหรับ SME และองค์กรขนาดกลาง',
      },
    },
    {
      '@type': 'Question',
      name: 'ราคาเริ่มต้นเท่าไหร่?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'ขึ้นอยู่กับขอบเขตงาน Fast-Track MVP เริ่มต้นที่ 30,000–80,000 บาท ระบบองค์กรที่ซับซ้อนกว่า 150,000 บาทขึ้นไป ปรึกษาฟรีเพื่อรับ estimate ที่ตรงกับงานของคุณ',
      },
    },
    {
      '@type': 'Question',
      name: 'ใช้เวลานานแค่ไหนในการพัฒนา?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Fast-Track MVP: 30 วัน ระบบขนาดกลาง: 6–10 สัปดาห์ ระบบองค์กรเต็มรูปแบบ: 3–4 เดือน ขึ้นอยู่กับความซับซ้อนและความพร้อมของข้อมูลจากลูกค้า',
      },
    },
    {
      '@type': 'Question',
      name: 'หลังส่งมอบระบบแล้ว ดูแลต่อได้อย่างไร?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'ลูกค้าได้รับ source code + documentation ทั้งหมด สามารถดูแลต่อเองหรือจ้างทีมอื่นได้ VIBAGEN ให้บริการ maintenance package แยกต่างหากสำหรับลูกค้าที่ต้องการ',
      },
    },
  ],
}

export default function HireUsPage() {
  return (
    <>
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="min-h-screen pt-24" style={{ background: '#011937' }}>
        {/* Hero strip */}
        <div
          className="py-16 text-center"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,108,1,0.08) 0%, transparent 70%)',
          }}
        >
          <div className="container">
            <Badge dot className="mb-4">ปรึกษาฟรี — ไม่มีข้อผูกมัด</Badge>
            <h1
              className="font-[--font-heading] font-bold text-white mb-4"
              style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}
            >
              เล่าปัญหาให้ฟัง
              <br />
              <span className="text-[#ff6c01]">เราช่วยหาทางออก</span>
            </h1>
            <p className="text-white/60 max-w-xl mx-auto text-lg">
              ไม่ต้องรู้ว่าต้องการอะไรแน่ๆ แค่เล่าสิ่งที่เป็นปัญหาในธุรกิจตอนนี้
            </p>
          </div>
        </div>

        {/* Contact form */}
        <ContactForm />

        {/* FAQ */}
        <section className="section" style={{ background: '#0d2749' }}>
          <div className="container max-w-3xl">
            <h2 className="font-[--font-heading] font-bold text-white text-2xl mb-8 text-center">
              คำถามที่พบบ่อย
            </h2>
            <div className="space-y-4">
              {faqSchema.mainEntity.map((faq) => (
                <details
                  key={faq.name}
                  className="rounded-xl bg-white/[0.04] border border-white/[0.06] group"
                >
                  <summary className="p-5 cursor-pointer font-[--font-heading] font-semibold text-white list-none flex items-center justify-between">
                    {faq.name}
                    <span className="text-[#ff6c01] ml-4 shrink-0 group-open:rotate-180 transition-transform">
                      ▾
                    </span>
                  </summary>
                  <p className="px-5 pb-5 text-white/60 text-sm leading-relaxed">
                    {faq.acceptedAnswer.text}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
