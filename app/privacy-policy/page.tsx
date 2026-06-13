import type { Metadata } from 'next'
import Navbar from '@/components/sections/Navbar'
import Footer from '@/components/sections/Footer'

export const metadata: Metadata = {
  title: 'นโยบายความเป็นส่วนตัว — Privacy Policy',
  description: 'นโยบายความเป็นส่วนตัวสำหรับ Vibagen Tools — วิธีที่เราเก็บรวบรวม ใช้ และปกป้องข้อมูลของคุณ',
  alternates: { canonical: 'https://vibagen.com/privacy-policy' },
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
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
            <h1
              className="font-[--font-heading] font-bold text-white mb-4"
              style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}
            >
              นโยบายความเป็นส่วนตัว
            </h1>
            <p className="text-white/60 max-w-xl mx-auto">
              Privacy Policy สำหรับ Vibagen Tools
            </p>
          </div>
        </div>

        {/* Content */}
        <section className="py-16">
          <div className="container max-w-3xl">
            <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-8 md:p-12">
              <p className="text-white/50 text-sm mb-8">
                มีผลบังคับใช้ตั้งแต่วันที่: 13 มิถุนายน 2026
              </p>

              <p className="text-white/70 leading-relaxed mb-8">
                Vibagen (&ldquo;เรา&rdquo;, &ldquo;ของเรา&rdquo;) ให้ความสำคัญกับความเป็นส่วนตัวของคุณ
                นโยบายความเป็นส่วนตัวนี้อธิบายถึงวิธีที่เราเก็บรวบรวม ใช้ เปิดเผย และปกป้องข้อมูลของคุณ
                เมื่อคุณใช้งานแอปพลิเคชัน Vibagen Tools (&ldquo;แอป&rdquo;) ซึ่งเชื่อมต่อกับ Facebook Platform
              </p>

              {/* Section 1 */}
              <h2 className="text-xl font-[--font-heading] font-semibold text-white mb-4 mt-10">
                1. ข้อมูลที่เราเก็บรวบรวม
              </h2>
              <p className="text-white/70 text-sm leading-relaxed mb-4">
                เมื่อคุณใช้งาน Vibagen ผ่าน Facebook เราอาจเข้าถึงข้อมูลบางประการตามที่คุณอนุญาต ดังนี้:
              </p>
              <ul className="space-y-2 ml-4 mb-4">
                <li className="text-white/70 text-sm flex gap-2">
                  <span className="text-[#ff6c01] shrink-0">•</span>
                  <span>ข้อมูลโปรไฟล์สาธารณะ: เช่น ชื่อ, รูปโปรไฟล์</span>
                </li>
                <li className="text-white/70 text-sm flex gap-2">
                  <span className="text-[#ff6c01] shrink-0">•</span>
                  <span>ข้อมูลเพจ (Pages): เพื่อใช้ในการจัดการโพสต์และอ่านข้อมูลสถิติของเพจที่คุณเป็นผู้ดูแล</span>
                </li>
                <li className="text-white/70 text-sm flex gap-2">
                  <span className="text-[#ff6c01] shrink-0">•</span>
                  <span>เนื้อหาการโพสต์: ข้อมูลที่คุณเลือกจะเผยแพร่ผ่านเครื่องมือของเรา</span>
                </li>
              </ul>

              {/* Section 2 */}
              <h2 className="text-xl font-[--font-heading] font-semibold text-white mb-4 mt-10">
                2. วิธีที่เราใช้ข้อมูลของคุณ
              </h2>
              <p className="text-white/70 text-sm leading-relaxed mb-4">
                เราใช้ข้อมูลที่ได้รับเพื่อวัตถุประสงค์ดังต่อไปนี้เท่านั้น:
              </p>
              <ul className="space-y-2 ml-4 mb-4">
                <li className="text-white/70 text-sm flex gap-2">
                  <span className="text-[#ff6c01] shrink-0">•</span>
                  <span>เพื่อให้บริการฟังก์ชันการโพสต์เนื้อหาอัตโนมัติไปยัง Facebook Page ของคุณ</span>
                </li>
                <li className="text-white/70 text-sm flex gap-2">
                  <span className="text-[#ff6c01] shrink-0">•</span>
                  <span>เพื่อแสดงสถิติและข้อมูลการตอบรับของโพสต์ภายในระบบ Vibagen</span>
                </li>
                <li className="text-white/70 text-sm flex gap-2">
                  <span className="text-[#ff6c01] shrink-0">•</span>
                  <span>เพื่อปรับปรุงประสิทธิภาพการทำงานของแอปพลิเคชัน</span>
                </li>
              </ul>

              {/* Section 3 */}
              <h2 className="text-xl font-[--font-heading] font-semibold text-white mb-4 mt-10">
                3. การแบ่งปันข้อมูล
              </h2>
              <p className="text-white/70 text-sm leading-relaxed mb-4">
                เรา <strong className="text-white/90">ไม่มีนโยบาย</strong> ในการขาย ให้เช่า หรือแบ่งปันข้อมูลส่วนบุคคลของคุณให้กับบุคคลที่สามเพื่อวัตถุประสงค์ทางการค้า
                ข้อมูลของคุณจะถูกส่งไปยัง Facebook Platform โดยตรงตามคำสั่งการใช้งานของคุณเท่านั้น
              </p>

              {/* Section 4 */}
              <h2 className="text-xl font-[--font-heading] font-semibold text-white mb-4 mt-10">
                4. การรักษาความปลอดภัยของข้อมูล
              </h2>
              <p className="text-white/70 text-sm leading-relaxed mb-4">
                เราใช้มาตรการทางเทคนิคที่เหมาะสมเพื่อปกป้องข้อมูลของคุณจากการเข้าถึงโดยไม่ได้รับอนุญาต
                การสูญหาย หรือการถูกทำลาย
              </p>

              {/* Section 5 */}
              <h2 className="text-xl font-[--font-heading] font-semibold text-white mb-4 mt-10">
                5. สิทธิ์ของคุณและการลบข้อมูล
              </h2>
              <p className="text-white/70 text-sm leading-relaxed mb-4">
                คุณสามารถยกเลิกการเชื่อมต่อแอป Vibagen Tools กับบัญชี Facebook ของคุณได้ตลอดเวลา
                ผ่านการตั้งค่าใน Facebook (Settings &gt; Business Integrations)
              </p>
              <ul className="space-y-2 ml-4 mb-4">
                <li className="text-white/70 text-sm flex gap-2">
                  <span className="text-[#ff6c01] shrink-0">•</span>
                  <span>
                    การลบข้อมูล: หากคุณต้องการให้เราลบข้อมูลใดๆ ที่เกี่ยวข้องกับการใช้งานแอป
                    คุณสามารถติดต่อเราได้ที่{' '}
                    <a
                      href="mailto:akkraphol@gmail.com"
                      className="text-[#ff6c01] hover:underline"
                    >
                      akkraphol@gmail.com
                    </a>{' '}
                    เราจะดำเนินการลบข้อมูลภายใน 30 วัน
                  </span>
                </li>
              </ul>

              {/* Section 6 */}
              <h2 className="text-xl font-[--font-heading] font-semibold text-white mb-4 mt-10">
                6. การเปลี่ยนแปลงนโยบาย
              </h2>
              <p className="text-white/70 text-sm leading-relaxed mb-4">
                เราอาจอัปเดตนโยบายความเป็นส่วนตัวนี้เป็นครั้งคราว
                โดยจะแจ้งให้ทราบผ่านการเปลี่ยนแปลงวันที่ &ldquo;มีผลบังคับใช้&rdquo; ที่ด้านบนของหน้านี้
              </p>

              {/* Section 7 */}
              <h2 className="text-xl font-[--font-heading] font-semibold text-white mb-4 mt-10">
                7. ติดต่อเรา
              </h2>
              <p className="text-white/70 text-sm leading-relaxed mb-4">
                หากคุณมีคำถามเกี่ยวกับนโยบายความเป็นส่วนตัวนี้ โปรดติดต่อเราที่:
              </p>
              <ul className="space-y-2 ml-4 mb-4">
                <li className="text-white/70 text-sm flex gap-2">
                  <span className="text-[#ff6c01] shrink-0">•</span>
                  <span>
                    เว็บไซต์:{' '}
                    <a
                      href="https://vibagen.com"
                      className="text-[#ff6c01] hover:underline"
                    >
                      vibagen.com
                    </a>
                  </span>
                </li>
                <li className="text-white/70 text-sm flex gap-2">
                  <span className="text-[#ff6c01] shrink-0">•</span>
                  <span>
                    อีเมล:{' '}
                    <a
                      href="mailto:akkraphol@gmail.com"
                      className="text-[#ff6c01] hover:underline"
                    >
                      akkraphol@gmail.com
                    </a>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
