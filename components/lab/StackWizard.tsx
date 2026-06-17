'use client'

import { useState } from 'react'

type ResultKey = 'rust' | 'nextjs' | 'flutter' | null

interface Question {
  id: number
  text: string
}

const questions: Question[] = [
  { id: 1, text: 'App ต้องต่อกับ hardware จริงๆ ไหม? (serial port, COM port, printer, USB HID)' },
  { id: 2, text: 'User ต้องใช้บน Mobile (Android / iOS) เป็นหลักไหม?' },
  { id: 3, text: 'ต้องการ offline? (ทำงานได้โดยไม่มี internet)' },
  { id: 4, text: 'มี user หลายคน ต้องการ real-time sync หรือ collaboration ไหม?' },
  { id: 5, text: 'ต้องการ ship เร็วแค่ไหน?' },
]

const TOTAL_QUESTIONS = 5

const resultData = {
  rust: {
    accent: '#fb923c',
    emoji: '🦀',
    stack: 'Tauri 2.0 + Rust + React',
    description:
      'เหมาะสุดสำหรับงานนี้ เพราะต้องการ hardware integration และ/หรือ offline 100%. ได้ .exe ไฟล์เดียว ขนาด 8–15 MB รันบน Windows ไม่ต้องติดตั้ง runtime. Business logic อยู่ใน Rust — ปลอดภัย เร็ว ไม่มี race condition',
    tags: [
      { label: 'Offline 100%', type: 'ok' },
      { label: 'Serial Port / COM', type: 'ok' },
      { label: 'ESC/P2 Printer', type: 'ok' },
      { label: 'Setup 3–5 วัน', type: 'warn' },
    ],
  },
  nextjs: {
    accent: '#4ade80',
    emoji: '🟢',
    stack: 'Next.js + PostgreSQL + Prisma',
    description:
      'เหมาะสุดสำหรับงานนี้ เพราะต้องการ multi-user, web-accessible, และ ship เร็ว. Vibecoding ได้ดีที่สุด — AI ช่วย generate หน้า form ได้ในชั่วโมง. Deploy ง่าย: git push → Vercel auto deploy ไม่ต้องดูแล server',
    tags: [
      { label: 'Multi-user', type: 'ok' },
      { label: 'Vibecoding ★★★★★', type: 'ok' },
      { label: 'Deploy ง่าย', type: 'ok' },
      { label: 'ต้องการ Internet', type: 'warn' },
    ],
  },
  flutter: {
    accent: '#38bdf8',
    emoji: '🔵',
    stack: 'Flutter + flutter_rust_bridge + SQLite',
    description:
      'เหมาะสุดสำหรับงานนี้ เพราะต้องการ native mobile UX และ offline capability. Rust logic ใช้ซ้ำข้าม platform ได้ถึง 90% — ลงทุนครั้งเดียว ได้ Android + iOS + Desktop. ระวัง: setup time สูงกว่า ต้องลงทุน 1–2 สัปดาห์แรก',
    tags: [
      { label: 'Android + iOS', type: 'ok' },
      { label: 'Offline (SQLite)', type: 'ok' },
      { label: 'Native UX', type: 'ok' },
      { label: 'Setup 5–10 วัน', type: 'warn' },
    ],
  },
}

export default function StackWizard() {
  const [currentQ, setCurrentQ] = useState(1)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [result, setResult] = useState<ResultKey>(null)
  const [answered, setAnswered] = useState(0)

  function getProgress() {
    if (result) return 100
    return Math.round((answered / TOTAL_QUESTIONS) * 100)
  }

  function handleAnswer(qId: number, value: string) {
    const newAnswers = { ...answers, [qId]: value }
    setAnswers(newAnswers)
    const newAnswered = answered + 1
    setAnswered(newAnswered)

    // Branching logic
    if (qId === 1) {
      if (value === 'yes') {
        setAnswered(TOTAL_QUESTIONS)
        setResult('rust')
        return
      }
      setCurrentQ(2)
    } else if (qId === 2) {
      if (value === 'yes') {
        setCurrentQ(3)
      } else {
        setCurrentQ(4)
      }
    } else if (qId === 3) {
      if (value === 'yes') {
        setAnswered(TOTAL_QUESTIONS)
        setResult('flutter')
      } else {
        setAnswered(TOTAL_QUESTIONS)
        setResult('nextjs')
      }
    } else if (qId === 4) {
      setCurrentQ(5)
    } else if (qId === 5) {
      const q4Answer = newAnswers[4]
      if (q4Answer === 'yes' || value === 'fast') {
        setResult('nextjs')
      } else {
        setResult('rust')
      }
    }
  }

  function handleReset() {
    setCurrentQ(1)
    setAnswers({})
    setResult(null)
    setAnswered(0)
  }

  const progress = getProgress()
  const res = result ? resultData[result] : null

  return (
    <section>
      <style>{`
        @keyframes swFadeSlide {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .sw-animate {
          animation: swFadeSlide 0.28s ease forwards;
        }
        .sw-btn {
          display: block;
          width: 100%;
          text-align: left;
          padding: 12px 18px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.10);
          background: rgba(255,255,255,0.03);
          color: rgba(255,255,255,0.75);
          font-size: 14px;
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s, color 0.15s;
          font-family: inherit;
        }
        .sw-btn:hover {
          border-color: rgba(255,255,255,0.28);
          background: rgba(255,255,255,0.07);
          color: #fff;
        }
        .sw-btn-selected {
          border-color: #ff6c01;
          background: rgba(255,108,1,0.12);
          color: #fff;
        }
        .sw-q5-btn {
          flex: 1;
          text-align: center;
          padding: 12px 14px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.10);
          background: rgba(255,255,255,0.03);
          color: rgba(255,255,255,0.75);
          font-size: 13px;
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s, color 0.15s;
          font-family: inherit;
        }
        .sw-q5-btn:hover {
          border-color: rgba(255,255,255,0.28);
          background: rgba(255,255,255,0.07);
          color: #fff;
        }
      `}</style>

      {/* Heading */}
      <div style={{ marginBottom: '24px' }}>
        <h2
          style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,
            color: '#fff',
            fontSize: '1.5rem',
            marginBottom: '6px',
          }}
        >
          Stack Decision Wizard
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.50)', fontSize: '14px', margin: 0 }}>
          ตอบ 5 คำถาม → รู้ทันทีว่าควรใช้ stack อะไร
        </p>
      </div>

      {/* Terminal wrapper */}
      <div
        style={{
          background: '#141419',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px',
          overflow: 'hidden',
        }}
      >
        {/* Terminal dot header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(255,255,255,0.02)',
          }}
        >
          <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#ff5f57', display: 'inline-block' }} />
          <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#febc2e', display: 'inline-block' }} />
          <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#28c840', display: 'inline-block' }} />
          <span
            style={{
              marginLeft: '10px',
              fontSize: '11px',
              fontFamily: "'Fira Code', Consolas, monospace",
              color: 'rgba(255,255,255,0.35)',
              letterSpacing: '0.3px',
            }}
          >
            stack-decision-wizard
          </span>
        </div>

        {/* Progress bar */}
        <div style={{ padding: '16px 20px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', fontFamily: "'Fira Code', Consolas, monospace" }}>
              progress
            </span>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', fontFamily: "'Fira Code', Consolas, monospace" }}>
              {answered}/{TOTAL_QUESTIONS}
            </span>
          </div>
          <div
            style={{
              height: '4px',
              borderRadius: '4px',
              background: 'rgba(255,255,255,0.06)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                borderRadius: '4px',
                background: '#ff6c01',
                width: `${progress}%`,
                transition: 'width 0.35s ease',
              }}
            />
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '24px 20px 24px' }}>
          {!result ? (
            <div className="sw-animate" key={currentQ}>
              {/* Question number */}
              <div style={{ marginBottom: '16px' }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#ff6c01',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontFamily: "'Fira Code', Consolas, monospace",
                  }}
                >
                  Q{currentQ} / {TOTAL_QUESTIONS}
                </span>
              </div>

              {/* Question text */}
              <p
                style={{
                  color: '#fff',
                  fontSize: '16px',
                  fontWeight: 500,
                  lineHeight: 1.6,
                  marginBottom: '20px',
                }}
              >
                {questions[currentQ - 1].text}
              </p>

              {/* Answer buttons */}
              {currentQ !== 5 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button
                    className={`sw-btn${answers[currentQ] === 'yes' ? ' sw-btn-selected' : ''}`}
                    onClick={() => handleAnswer(currentQ, 'yes')}
                  >
                    ใช่
                  </button>
                  <button
                    className={`sw-btn${answers[currentQ] === 'no' ? ' sw-btn-selected' : ''}`}
                    onClick={() => handleAnswer(currentQ, 'no')}
                  >
                    ไม่ใช่
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    className={`sw-q5-btn${answers[5] === 'fast' ? ' sw-btn-selected' : ''}`}
                    onClick={() => handleAnswer(5, 'fast')}
                  >
                    <div style={{ fontWeight: 600, marginBottom: '4px' }}>เร็วมาก</div>
                    <div style={{ fontSize: '12px', opacity: 0.65 }}>1–2 สัปดาห์</div>
                  </button>
                  <button
                    className={`sw-q5-btn${answers[5] === 'normal' ? ' sw-btn-selected' : ''}`}
                    onClick={() => handleAnswer(5, 'normal')}
                  >
                    <div style={{ fontWeight: 600, marginBottom: '4px' }}>ปกติ</div>
                    <div style={{ fontSize: '12px', opacity: 0.65 }}>1–2 เดือน</div>
                  </button>
                </div>
              )}
            </div>
          ) : (
            res && (
              <div className="sw-animate" key="result">
                {/* Result card */}
                <div
                  style={{
                    borderRadius: '12px',
                    padding: '24px',
                    background: `${res.accent}0f`,
                    border: `1px solid ${res.accent}30`,
                    borderLeft: `3px solid ${res.accent}`,
                  }}
                >
                  {/* Stack name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                    <span style={{ fontSize: '24px' }}>{res.emoji}</span>
                    <div>
                      <div
                        style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          color: res.accent,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          marginBottom: '2px',
                          fontFamily: "'Fira Code', Consolas, monospace",
                        }}
                      >
                        แนะนำ stack
                      </div>
                      <div style={{ color: '#fff', fontWeight: 700, fontSize: '17px' }}>{res.stack}</div>
                    </div>
                  </div>

                  {/* Description */}
                  <p
                    style={{
                      color: 'rgba(255,255,255,0.70)',
                      fontSize: '14px',
                      lineHeight: 1.75,
                      marginBottom: '18px',
                    }}
                  >
                    {res.description}
                  </p>

                  {/* Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                    {res.tags.map((tag) => (
                      <span
                        key={tag.label}
                        style={{
                          fontSize: '12px',
                          fontWeight: 600,
                          padding: '4px 10px',
                          borderRadius: '6px',
                          background:
                            tag.type === 'ok'
                              ? 'rgba(74,222,128,0.12)'
                              : 'rgba(251,191,36,0.12)',
                          color:
                            tag.type === 'ok'
                              ? '#4ade80'
                              : '#fbbf24',
                          border: `1px solid ${tag.type === 'ok' ? 'rgba(74,222,128,0.25)' : 'rgba(251,191,36,0.25)'}`,
                        }}
                      >
                        {tag.type === 'ok' ? '✅ ' : '⚠️ '}{tag.label}
                      </span>
                    ))}
                  </div>

                  {/* Reset */}
                  <button
                    onClick={handleReset}
                    style={{
                      padding: '9px 18px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.12)',
                      background: 'rgba(255,255,255,0.05)',
                      color: 'rgba(255,255,255,0.65)',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      transition: 'border-color 0.15s, background 0.15s, color 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget
                      el.style.borderColor = 'rgba(255,255,255,0.28)'
                      el.style.background = 'rgba(255,255,255,0.09)'
                      el.style.color = '#fff'
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget
                      el.style.borderColor = 'rgba(255,255,255,0.12)'
                      el.style.background = 'rgba(255,255,255,0.05)'
                      el.style.color = 'rgba(255,255,255,0.65)'
                    }}
                  >
                    ← เริ่มใหม่
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Link to full quiz */}
      <div style={{
        marginTop: '24px',
        padding: '16px 20px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '12px',
        textAlign: 'center',
      }}>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', margin: '0 0 8px' }}>
          อยากรู้ลึกกว่านี้?
        </p>
        <a
          href="/lab/stack-quiz"
          style={{
            color: '#ff6c01',
            fontSize: '14px',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          ลองเวอร์ชันเต็ม → Stack Personality Quiz
        </a>
      </div>
    </section>
  )
}
