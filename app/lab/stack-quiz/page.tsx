import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/sections/Navbar'
import Footer from '@/components/sections/Footer'
import StackQuiz from '@/components/lab/StackQuiz'
import StackQuizCustom from '@/components/lab/StackQuizCustom'

export const metadata: Metadata = {
  title: 'Stack ไหนที่ใช่สำหรับคุณ? — AI Lab | VIBAGEN',
  description:
    'ตอบ 8 คำถาม รู้ทันทีว่าควรใช้ tech stack อะไร — จาก Rust ถึง No-Code ครอบคลุมทุก use case ที่ SME ต้องการ',
  alternates: { canonical: 'https://vibagen.com/lab/stack-quiz' },
  keywords: ['tech stack quiz', 'เลือก stack', 'เลือก framework', 'Stack Decision', 'SME tech', 'vibecoding'],
  openGraph: {
    title: 'Stack ไหนที่ใช่สำหรับคุณ?',
    description: 'ตอบ 8 คำถาม รู้ทันทีว่าควรใช้ tech stack อะไร',
    url: 'https://vibagen.com/lab/stack-quiz',
    type: 'website',
  },
}

export default function StackQuizPage() {
  return (
    <>
      <Navbar />
      <main
        style={{ minHeight: '100vh', background: '#faf7f2', paddingTop: '96px', paddingBottom: '80px' }}
      >
        <div
          style={{
            maxWidth: '760px',
            margin: '0 auto',
            padding: '0 20px',
          }}
        >
          {/* Back link */}
          <Link
            href="/lab"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              color: '#8a8279',
              textDecoration: 'none',
              marginBottom: '32px',
            }}
          >
            ← AI Lab
          </Link>

          {/* Header */}
          <div style={{ marginBottom: '40px' }}>
            {/* Eyebrow */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12px',
              fontWeight: 700,
              color: '#ff6c01',
              textTransform: 'uppercase' as const,
              letterSpacing: '0.8px',
              marginBottom: '14px',
              fontFamily: "'Fira Code', Consolas, monospace",
            }}>
              <span
                style={{
                  display: 'inline-block',
                  width: '8px', height: '8px',
                  borderRadius: '50%',
                  background: '#ff6c01',
                }}
              />
              Stack Personality Quiz
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                color: '#2d2a26',
                fontSize: 'clamp(1.75rem, 5vw, 2.6rem)',
                lineHeight: 1.2,
                marginBottom: '14px',
              }}
            >
              Stack ไหนที่ใช่สำหรับคุณ?
            </h1>

            <p style={{
              fontSize: '16px',
              color: '#8a8279',
              lineHeight: 1.75,
              maxWidth: '560px',
            }}>
              ตอบ 8 คำถาม — รู้ทันทีว่าควรใช้ tech stack อะไร
              ตั้งแต่ Rust สำหรับ hardware จนถึง No-Code สำหรับ solo ที่อยากเริ่มเร็ว
            </p>
          </div>

          {/* ── Quiz Section ─────────────────────────────── */}
          <div style={{
            background: '#faf7f2',
            borderRadius: '20px',
            border: '1.5px solid #e8e0d4',
            padding: 'clamp(20px, 4vw, 36px)',
            marginBottom: '48px',
          }}>
            <StackQuiz />
          </div>

          {/* ── Custom Input Section ──────────────────────── */}
          <div style={{ marginBottom: '60px' }}>
            {/* Divider with label */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '28px',
            }}>
              <div style={{ flex: 1, height: '1px', background: '#e8e0d4' }} />
              <span style={{
                fontSize: '13px',
                color: '#8a8279',
                fontWeight: 600,
                whiteSpace: 'nowrap',
              }}>
                หรือพิมพ์เองว่าอยากสร้างอะไร
              </span>
              <div style={{ flex: 1, height: '1px', background: '#e8e0d4' }} />
            </div>

            {/* Subtitle */}
            <p style={{
              fontSize: '14px',
              color: '#8a8279',
              lineHeight: 1.7,
              marginBottom: '20px',
              textAlign: 'center',
            }}>
              บอกว่าอยากทำอะไร — ดูว่าสมัยก่อนใช้อะไร และปี 2026 ควรใช้อะไร
            </p>

            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '1.5px solid #e8e0d4',
              padding: 'clamp(18px, 4vw, 30px)',
            }}>
              <StackQuizCustom />
            </div>
          </div>

          {/* ── Bottom — Follow & Share ─────────────────────── */}
          <div style={{
            borderRadius: '20px',
            padding: '36px 32px',
            background: '#0d2749',
            textAlign: 'center',
          }}>
            <p style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: '1.4rem',
              color: '#ffffff',
              marginBottom: '10px',
            }}>
              ชอบ Quiz นี้ไหม?
            </p>
            <p style={{
              fontSize: '15px',
              color: 'rgba(255,255,255,0.60)',
              lineHeight: 1.7,
              marginBottom: '24px',
            }}>
              Share ให้เพื่อนลองเล่นด้วย — แล้วมาดูว่าได้ Stack เดียวกันไหม
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a
                href="https://www.facebook.com/vibagen"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 28px',
                  borderRadius: '12px',
                  background: '#ff6c01',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '15px',
                  textDecoration: 'none',
                }}
              >
                ติดตาม VIBAGEN
              </a>
              <a
                href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fvibagen.com%2Flab%2Fstack-quiz"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 28px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.10)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '15px',
                  textDecoration: 'none',
                  border: '1px solid rgba(255,255,255,0.20)',
                }}
              >
                Share Facebook
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
