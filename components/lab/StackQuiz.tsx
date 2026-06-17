'use client'

import { useState } from 'react'

// ─── Types ─────────────────────────────────────────────────

type StackKey = 'tauri' | 'nextjs' | 'supabase' | 'flutter' | 'go_htmx' | 'appsheet'

interface Answer {
  label: string
  value: string
}

interface Question {
  id: number
  phase: number
  phaseLabel: string
  text: string
  options: Answer[]
}

interface StackResult {
  typeLabel: string
  emoji: string
  stack: string
  color: string
  personality: string
  description: string
  tags: { label: string; type: 'ok' | 'warn' }[]
  learnMore: string
}

// ─── Quiz Data ─────────────────────────────────────────────

const questions: Question[] = [
  {
    id: 1, phase: 1, phaseLabel: 'Phase 1 — คุณเป็นใคร',
    text: 'ทีม dev ของคุณมีกี่คน?',
    options: [
      { label: '🧑‍💻 ทำคนเดียว (Solo)', value: 'solo' },
      { label: '👥 2–5 คน', value: 'small' },
      { label: '🏢 5 คนขึ้นไป', value: 'large' },
    ],
  },
  {
    id: 2, phase: 1, phaseLabel: 'Phase 1 — คุณเป็นใคร',
    text: 'คุณชอบ build แบบไหน?',
    options: [
      { label: '🔨 ชอบ control ทุกอย่างเอง', value: 'control' },
      { label: '🧩 ชอบประกอบจากของสำเร็จรูป', value: 'assemble' },
      { label: '⚡ ขอเสร็จเร็วสุด ไม่สนวิธี', value: 'speed' },
    ],
  },
  {
    id: 3, phase: 2, phaseLabel: 'Phase 2 — โปรเจกต์เป็นแบบไหน',
    text: 'จุดมุ่งหมายคืออะไร?',
    options: [
      { label: '🧪 MVP ทดสอบตลาด', value: 'mvp' },
      { label: '🏭 Production ใช้จริงในองค์กร', value: 'production' },
      { label: '🏢 Internal tool ใช้ในทีม', value: 'internal' },
      { label: '📚 Learning project', value: 'learning' },
    ],
  },
  {
    id: 4, phase: 2, phaseLabel: 'Phase 2 — โปรเจกต์เป็นแบบไหน',
    text: 'ขนาดองค์กรที่จะใช้ระบบ?',
    options: [
      { label: '🏪 ร้านเดียว / ทีมเล็ก', value: 'single' },
      { label: '🏬 หลายสาขา / หลายแผนก', value: 'multi' },
      { label: '🏭 โรงงาน / Enterprise', value: 'enterprise' },
    ],
  },
  {
    id: 5, phase: 2, phaseLabel: 'Phase 2 — โปรเจกต์เป็นแบบไหน',
    text: 'Budget สำหรับ infrastructure?',
    options: [
      { label: '🆓 ฟรีเท่าที่ทำได้', value: 'free' },
      { label: '💰 หลักร้อย–พันบาท/เดือน', value: 'moderate' },
      { label: '💎 ไม่จำกัด ขอให้เสถียร', value: 'unlimited' },
    ],
  },
  {
    id: 6, phase: 3, phaseLabel: 'Phase 3 — ข้อจำกัดจริง',
    text: 'ต้องต่ออุปกรณ์ไหม? (ตาชั่ง, เครื่องพิมพ์, barcode scanner)',
    options: [
      { label: '✅ มี ต้องต่อ hardware', value: 'yes' },
      { label: '❌ ไม่มี ใช้แค่ software', value: 'no' },
    ],
  },
  {
    id: 7, phase: 3, phaseLabel: 'Phase 3 — ข้อจำกัดจริง',
    text: 'Internet ที่หน้างานเป็นยังไง?',
    options: [
      { label: '🌐 มีเสมอ เสถียร', value: 'always' },
      { label: '📶 มีบ้าง ไม่แน่นอน', value: 'unstable' },
      { label: '🚫 ไม่มีเลย', value: 'none' },
    ],
  },
  {
    id: 8, phase: 3, phaseLabel: 'Phase 3 — ข้อจำกัดจริง',
    text: 'ใช้บนอะไรเป็นหลัก?',
    options: [
      { label: '💻 Desktop / Laptop', value: 'desktop' },
      { label: '📱 มือถือ (Android/iOS)', value: 'mobile' },
      { label: '🌐 Web Browser', value: 'web' },
      { label: '📱💻🌐 ทุกอย่าง', value: 'all' },
    ],
  },
]

const TOTAL = questions.length

// ─── Result Data ────────────────────────────────────────────

const resultData: Record<StackKey, StackResult> = {
  tauri: {
    typeLabel: 'The Craftsman',
    emoji: '🦀',
    stack: 'Tauri 2.0 + Rust + React',
    color: '#fb923c',
    personality: 'คุณชอบ control ทุกอย่างเอง ไม่กลัว compile error ขอแค่ได้ .exe ที่ perfect',
    description:
      'เหมาะกับ desktop app ที่ต้องต่อ hardware, ทำงาน offline 100%, ได้ .exe ไฟล์เดียว 8–15 MB. Business logic อยู่ใน Rust — ปลอดภัย เร็ว ไม่มี race condition',
    tags: [
      { label: 'Offline 100%', type: 'ok' },
      { label: 'Hardware Integration', type: 'ok' },
      { label: 'ไฟล์เดียว .exe', type: 'ok' },
      { label: 'Learning Curve สูง', type: 'warn' },
    ],
    learnMore: '/knowledge/real-barrier-agentic-ai-is-not-technology',
  },
  nextjs: {
    typeLabel: 'The Pragmatist',
    emoji: '🟢',
    stack: 'Next.js + PostgreSQL + Prisma',
    color: '#4ade80',
    personality: 'คุณเชื่อว่า ship เร็ว = ชนะ ไม่ต้องเขียนเองทุกอย่าง AI ช่วยได้ก็ให้ช่วย',
    description:
      'Default ที่ถูกสำหรับ multi-user web app. Vibecoding ได้ดีที่สุด — AI ช่วย generate หน้า form ได้ภายในชั่วโมง. Deploy ง่าย: git push → auto deploy',
    tags: [
      { label: 'Multi-user', type: 'ok' },
      { label: 'Vibecoding ★★★★★', type: 'ok' },
      { label: 'Deploy ง่าย', type: 'ok' },
      { label: 'ต้องมี Internet', type: 'warn' },
    ],
    learnMore: '/knowledge/nocode-to-ai-assisted-development',
  },
  supabase: {
    typeLabel: 'The Speed Runner',
    emoji: '⚡',
    stack: 'Next.js + Supabase (Free Tier)',
    color: '#a78bfa',
    personality: 'คุณอยากเห็นผลลัพธ์พรุ่งนี้เช้า ไม่ใช่เดือนหน้า ขอแค่ทำงานได้ก่อน perfect ทีหลัง',
    description:
      'MVP ที่เร็วที่สุด — Supabase ให้ auth, database, storage ฟรี. Ship ได้ภายในสัปดาห์. พอโตก็ย้ายไป production stack ได้ไม่ยาก',
    tags: [
      { label: 'ฟรี 100%', type: 'ok' },
      { label: 'Auth + DB + Storage', type: 'ok' },
      { label: 'Ship ภายในสัปดาห์', type: 'ok' },
      { label: 'Scale limit ใน free tier', type: 'warn' },
    ],
    learnMore: '/knowledge/cloudflare-free-infrastructure-for-sme',
  },
  flutter: {
    typeLabel: 'The Cross-Platform Pro',
    emoji: '🔵',
    stack: 'Flutter + SQLite + (optional Rust bridge)',
    color: '#38bdf8',
    personality: 'คุณต้องการ native UX บนมือถือ ไม่ยอมแค่ web ที่ดูเหมือน app',
    description:
      'ลงทุนครั้งเดียว ได้ Android + iOS + Desktop. SQLite local สำหรับ offline. Code base เดียว deploy ได้ทุก platform',
    tags: [
      { label: 'Android + iOS', type: 'ok' },
      { label: 'Offline (SQLite)', type: 'ok' },
      { label: 'Native UX', type: 'ok' },
      { label: 'Setup 5–10 วัน', type: 'warn' },
    ],
    learnMore: '/knowledge/from-appsheet-to-real-app',
  },
  go_htmx: {
    typeLabel: 'The Minimalist',
    emoji: '🧊',
    stack: 'Go + HTMX + SQLite',
    color: '#06b6d4',
    personality: 'คุณเกลียด JavaScript framework ที่เปลี่ยนทุก 6 เดือน ขอ binary เดียว deploy จบ',
    description:
      'Binary เดียว, zero JS framework, เร็วมาก. เหมาะกับ internal tool ที่ไม่ต้อง fancy UI แต่ต้องเสถียร. Go compile ได้ทุก OS, HTMX ให้ interactivity โดยไม่ต้องเขียน JS',
    tags: [
      { label: 'Binary เดียว', type: 'ok' },
      { label: 'Zero JS Framework', type: 'ok' },
      { label: 'เสถียรมาก', type: 'ok' },
      { label: 'UI ไม่ fancy', type: 'warn' },
    ],
    learnMore: '/knowledge/docker-vps-for-sme',
  },
  appsheet: {
    typeLabel: 'The No-Code Veteran',
    emoji: '📊',
    stack: 'Google Sheets + AppSheet (No-Code)',
    color: '#f59e0b',
    personality: 'คุณไม่ได้เป็น developer แต่อยากมีระบบใช้ — ขอแค่ทำงานได้ก่อน เขียนโค้ดทีหลัง',
    description:
      'ไม่ต้องเขียนโค้ดเลย — สร้างจาก spreadsheet ที่มีอยู่แล้ว. เหมาะกับร้านเดียว internal tool. ถ้าโตจนไม่พอ ค่อยย้ายไป real app (เหมือนที่ VIBAGEN เคยทำ)',
    tags: [
      { label: 'ไม่ต้องเขียนโค้ด', type: 'ok' },
      { label: 'สร้างจาก Sheets', type: 'ok' },
      { label: 'ฟรี (Google Workspace)', type: 'ok' },
      { label: 'Scale ไม่ได้', type: 'warn' },
    ],
    learnMore: '/knowledge/from-appsheet-to-real-app',
  },
}

// ─── Easter Eggs ────────────────────────────────────────────

function detectEasterEgg(answers: Record<number, string>): string | null {
  const a = answers
  // hardware=yes + budget=free + solo + speed
  if (a[6] === 'yes' && a[5] === 'free' && a[1] === 'solo' && a[2] === 'speed') {
    return '🕰️ สมัยก่อนเราใช้ Delphi + BDE ทำแบบนี้... ใน budget ฟรีด้วย crack version 😅 แต่ปี 2026 มีทางที่ดีกว่านั้นแล้ว'
  }
  // learning + all "speed" answers
  if (a[3] === 'learning' && a[2] === 'speed' && a[5] === 'free') {
    return '📼 คุณเหมือนคนสมัย Visual Basic 6 — ลาก drop วางแล้วก็ RUN เลย! แต่ปี 2026 มี scaffold ที่ทำแบบนั้นได้จริง'
  }
  // mvp + enterprise + unlimited budget
  if (a[3] === 'mvp' && a[4] === 'enterprise' && a[5] === 'unlimited') {
    return '💼 Budget ไม่จำกัดแต่จะทำ MVP? คุณคือ corporate innovation team ใช่ไหม 😄 ไม่เป็นไร เราเดาได้จาก answers'
  }
  return null
}

// ─── Scoring ─────────────────────────────────────────────────

function calcScores(answers: Record<number, string>): { winner: StackKey; runnerUp: StackKey } {
  const scores: Record<StackKey, number> = {
    tauri: 0, nextjs: 0, supabase: 0, flutter: 0, go_htmx: 0, appsheet: 0,
  }

  const add = (key: StackKey, pts: number) => { scores[key] += pts }

  // Q1 team size
  if (answers[1] === 'solo')  { add('supabase', 3); add('appsheet', 2); add('go_htmx', 1) }
  if (answers[1] === 'small') { add('nextjs', 3); add('flutter', 2); add('tauri', 1) }
  if (answers[1] === 'large') { add('nextjs', 2); add('flutter', 2); add('tauri', 2) }

  // Q2 build style
  if (answers[2] === 'control')  { add('tauri', 3); add('go_htmx', 3) }
  if (answers[2] === 'assemble') { add('nextjs', 2); add('supabase', 3); add('appsheet', 2) }
  if (answers[2] === 'speed')    { add('supabase', 3); add('appsheet', 2); add('nextjs', 1) }

  // Q3 purpose
  if (answers[3] === 'mvp')        { add('supabase', 4); add('appsheet', 2) }
  if (answers[3] === 'production') { add('nextjs', 3); add('tauri', 2); add('flutter', 2) }
  if (answers[3] === 'internal')   { add('go_htmx', 3); add('nextjs', 2); add('appsheet', 2) }
  if (answers[3] === 'learning')   { add('nextjs', 2); add('supabase', 2) }

  // Q4 org size
  if (answers[4] === 'single')     { add('appsheet', 3); add('supabase', 2) }
  if (answers[4] === 'multi')      { add('nextjs', 3); add('flutter', 2) }
  if (answers[4] === 'enterprise') { add('tauri', 2); add('nextjs', 2); add('go_htmx', 1) }

  // Q5 budget
  if (answers[5] === 'free')      { add('supabase', 3); add('appsheet', 3) }
  if (answers[5] === 'moderate')  { add('nextjs', 2); add('go_htmx', 2) }
  if (answers[5] === 'unlimited') { add('tauri', 2); add('flutter', 2); add('nextjs', 1) }

  // Q6 hardware — HARD CONSTRAINT
  if (answers[6] === 'yes') { add('tauri', 10); add('flutter', 2) }
  if (answers[6] === 'no')  { add('nextjs', 1); add('supabase', 1) }

  // Q7 internet
  if (answers[7] === 'always')   { add('nextjs', 3); add('supabase', 3) }
  if (answers[7] === 'unstable') { add('flutter', 3); add('tauri', 2) }
  if (answers[7] === 'none')     { add('tauri', 5); add('flutter', 3) }

  // Q8 platform
  if (answers[8] === 'desktop') { add('tauri', 4); add('go_htmx', 2) }
  if (answers[8] === 'mobile')  { add('flutter', 4); add('supabase', 1) }
  if (answers[8] === 'web')     { add('nextjs', 4); add('supabase', 3) }
  if (answers[8] === 'all')     { add('flutter', 3); add('nextjs', 2) }

  const sorted = (Object.keys(scores) as StackKey[]).sort((a, b) => scores[b] - scores[a])
  return { winner: sorted[0], runnerUp: sorted[1] }
}

// ─── Component ───────────────────────────────────────────────

export default function StackQuiz() {
  const [currentQ, setCurrentQ] = useState(0)           // index into questions[]
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [result, setResult] = useState<{ winner: StackKey; runnerUp: StackKey; egg: string | null } | null>(null)
  const [copied, setCopied] = useState(false)

  const q = questions[currentQ]
  const answered = Object.keys(answers).length
  const progress = result ? 100 : Math.round((answered / TOTAL) * 100)

  function handleAnswer(value: string) {
    const newAnswers = { ...answers, [q.id]: value }
    setAnswers(newAnswers)

    if (currentQ < TOTAL - 1) {
      setCurrentQ(currentQ + 1)
    } else {
      // All done — calculate
      const { winner, runnerUp } = calcScores(newAnswers)
      const egg = detectEasterEgg(newAnswers)
      setResult({ winner, runnerUp, egg })
    }
  }

  function handleReset() {
    setCurrentQ(0)
    setAnswers({})
    setResult(null)
    setCopied(false)
  }

  function handleCopy() {
    if (!result) return
    const win = resultData[result.winner]
    const run = resultData[result.runnerUp]
    const text = `Stack Personality Quiz — VIBAGEN AI Lab\n\nผลลัพธ์: ${win.typeLabel}\nStack: ${win.stack}\n\nRunner-up: ${run.typeLabel}\nStack: ${run.stack}\n\nhttps://vibagen.com/lab/stack-quiz`
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const win = result ? resultData[result.winner] : null
  const run = result ? resultData[result.runnerUp] : null

  return (
    <div>
      <style>{`
        @keyframes sqFadeSlide {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .sq-animate { animation: sqFadeSlide 0.28s ease forwards; }

        .sq-opt {
          display: block;
          width: 100%;
          text-align: left;
          padding: 14px 18px;
          border-radius: 12px;
          border: 1.5px solid #e8e0d4;
          background: #ffffff;
          color: #2d2a26;
          font-size: 15px;
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s, transform 0.1s;
          font-family: inherit;
          line-height: 1.4;
        }
        .sq-opt:hover {
          border-color: #ff6c01;
          background: #fff8f4;
          transform: translateX(3px);
        }
        .sq-opt:active { transform: translateX(1px); }

        .sq-btn-ghost {
          padding: 9px 18px;
          border-radius: 10px;
          border: 1.5px solid #e8e0d4;
          background: #ffffff;
          color: #8a8279;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: border-color 0.15s, color 0.15s;
        }
        .sq-btn-ghost:hover {
          border-color: #8a8279;
          color: #2d2a26;
        }

        .sq-btn-orange {
          padding: 9px 18px;
          border-radius: 10px;
          border: none;
          background: #ff6c01;
          color: #fff;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.15s;
        }
        .sq-btn-orange:hover { background: #d54e01; }

        .sq-phase-chip {
          display: inline-block;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 20px;
          background: rgba(255,108,1,0.10);
          color: #ff6c01;
          letter-spacing: 0.3px;
          margin-bottom: 14px;
        }
      `}</style>

      {/* Progress bar */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: '8px',
        }}>
          <span style={{ fontSize: '12px', color: '#8a8279', fontFamily: "'Fira Code', Consolas, monospace" }}>
            {result ? 'เสร็จแล้ว!' : `คำถาม ${answered + 1} / ${TOTAL}`}
          </span>
          <span style={{ fontSize: '12px', color: '#ff6c01', fontWeight: 700, fontFamily: "'Fira Code', Consolas, monospace" }}>
            {progress}%
          </span>
        </div>
        <div style={{
          height: '6px', borderRadius: '6px',
          background: '#e8e0d4', overflow: 'hidden',
        }}>
          <div style={{
            height: '100%', borderRadius: '6px',
            background: 'linear-gradient(90deg, #ff6c01, #d54e01)',
            width: `${progress}%`,
            transition: 'width 0.4s ease',
          }} />
        </div>
      </div>

      {/* Question or Result */}
      {!result ? (
        <div className="sq-animate" key={currentQ}>
          {/* Phase chip */}
          <div>
            <span className="sq-phase-chip">{q.phaseLabel}</span>
          </div>

          {/* Question text */}
          <p style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,
            fontSize: 'clamp(1.1rem, 3vw, 1.35rem)',
            color: '#2d2a26',
            lineHeight: 1.4,
            marginBottom: '22px',
          }}>
            {q.text}
          </p>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {q.options.map((opt) => (
              <button
                key={opt.value}
                className="sq-opt"
                onClick={() => handleAnswer(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        win && run && (
          <div className="sq-animate" key="result">
            {/* Easter egg */}
            {result.egg && (
              <div style={{
                padding: '14px 18px',
                borderRadius: '12px',
                background: '#fef3c7',
                border: '1px solid #fcd34d',
                marginBottom: '20px',
                fontSize: '14px',
                color: '#92400e',
                lineHeight: 1.6,
              }}>
                {result.egg}
              </div>
            )}

            {/* Winner card */}
            <div style={{
              borderRadius: '16px',
              padding: '28px',
              background: '#ffffff',
              border: `2px solid ${win.color}40`,
              boxShadow: `0 4px 24px ${win.color}18`,
              marginBottom: '16px',
            }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
                <span style={{ fontSize: '32px' }}>{win.emoji}</span>
                <div>
                  <div style={{
                    fontSize: '11px', fontWeight: 700,
                    color: win.color, textTransform: 'uppercase',
                    letterSpacing: '0.6px', marginBottom: '3px',
                    fontFamily: "'Fira Code', Consolas, monospace",
                  }}>
                    {win.typeLabel}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700, fontSize: '1.2rem',
                    color: '#2d2a26',
                  }}>
                    {win.stack}
                  </div>
                </div>
              </div>

              {/* Personality */}
              <p style={{
                fontSize: '15px', fontStyle: 'italic',
                color: '#5a5652', lineHeight: 1.6,
                marginBottom: '14px',
                borderLeft: `3px solid ${win.color}`,
                paddingLeft: '14px',
              }}>
                "{win.personality}"
              </p>

              {/* Description */}
              <p style={{
                fontSize: '14px', color: '#6b6460',
                lineHeight: 1.75, marginBottom: '20px',
              }}>
                {win.description}
              </p>

              {/* Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '22px' }}>
                {win.tags.map((tag) => (
                  <span
                    key={tag.label}
                    style={{
                      fontSize: '12px', fontWeight: 600,
                      padding: '4px 12px', borderRadius: '6px',
                      background: tag.type === 'ok' ? 'rgba(22,163,74,0.10)' : 'rgba(217,119,6,0.10)',
                      color: tag.type === 'ok' ? '#16a34a' : '#d97706',
                      border: `1px solid ${tag.type === 'ok' ? 'rgba(22,163,74,0.25)' : 'rgba(217,119,6,0.25)'}`,
                    }}
                  >
                    {tag.type === 'ok' ? '✅ ' : '⚠️ '}{tag.label}
                  </span>
                ))}
              </div>

              {/* Runner-up */}
              <div style={{
                padding: '16px',
                borderRadius: '12px',
                background: '#faf7f2',
                border: '1px solid #e8e0d4',
                marginBottom: '22px',
              }}>
                <div style={{
                  fontSize: '11px', color: '#8a8279',
                  fontWeight: 700, textTransform: 'uppercase',
                  letterSpacing: '0.5px', marginBottom: '8px',
                  fontFamily: "'Fira Code', Consolas, monospace",
                }}>
                  Runner-up
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '20px' }}>{run.emoji}</span>
                  <span style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700, color: '#2d2a26', fontSize: '0.95rem',
                  }}>
                    {run.stack}
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: '#8a8279', margin: 0, lineHeight: 1.6 }}>
                  {run.personality}
                </p>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <button className="sq-btn-ghost" onClick={handleCopy}>
                  {copied ? '✓ Copied!' : '📋 Copy ผลลัพธ์'}
                </button>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://vibagen.com/lab/stack-quiz')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '9px 18px', borderRadius: '10px',
                    border: '1.5px solid #e8e0d4', background: '#ffffff',
                    color: '#8a8279', fontSize: '13px', fontWeight: 600,
                    textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px',
                  }}
                >
                  📤 แชร์
                </a>
                <button className="sq-btn-ghost" onClick={handleReset}>
                  🔄 เริ่มใหม่
                </button>
                <a
                  href={win.learnMore}
                  style={{
                    padding: '9px 18px', borderRadius: '10px',
                    border: 'none', background: '#ff6c01',
                    color: '#fff', fontSize: '13px', fontWeight: 600,
                    textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
                  }}
                >
                  📖 อ่านเพิ่ม →
                </a>
              </div>
            </div>

            {/* CTA */}
            <div style={{
              padding: '24px',
              borderRadius: '16px',
              background: '#fff8f4',
              border: '1.5px solid rgba(255,108,1,0.25)',
              textAlign: 'center',
            }}>
              <p style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 700, fontSize: '1.1rem',
                color: '#2d2a26', marginBottom: '8px',
              }}>
                ยังไม่แน่ใจ? ปรึกษาได้เลย
              </p>
              <p style={{ fontSize: '14px', color: '#8a8279', marginBottom: '16px', lineHeight: 1.6 }}>
                VIBAGEN ช่วยเลือก stack ที่เหมาะกับโปรเจกต์จริงๆ ของคุณ — ฟรี ไม่ขาย
              </p>
              <a
                href="/hire-us"
                style={{
                  display: 'inline-flex', alignItems: 'center',
                  padding: '12px 28px', borderRadius: '12px',
                  background: '#ff6c01', color: '#fff',
                  fontWeight: 700, fontSize: '15px',
                  textDecoration: 'none',
                }}
              >
                💬 ปรึกษา VIBAGEN →
              </a>
            </div>
          </div>
        )
      )}
    </div>
  )
}
