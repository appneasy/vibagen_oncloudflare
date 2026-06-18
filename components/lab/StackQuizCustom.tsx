'use client'

import { useState, useRef } from 'react'
import { findTechStack, FALLBACK_MESSAGE, SKILL_LEVELS, getTimeEstimate, type TechStackMapping, type SkillLevelId } from '@/lib/tech-stack-quiz'

const categoryGroups: { label: string; emoji: string; ids: { id: string; emoji: string; label: string; keyword: string }[] }[] = [
  {
    label: 'ธุรกิจ', emoji: '💼',
    ids: [
      { id: 'ecommerce', emoji: '🛒', label: 'ร้านค้าออนไลน์', keyword: 'ร้านค้า' },
      { id: 'pos', emoji: '🧾', label: 'POS / ร้านอาหาร', keyword: 'ร้านอาหาร' },
      { id: 'crm', emoji: '👥', label: 'CRM / ลูกค้า', keyword: 'crm' },
      { id: 'hr', emoji: '👔', label: 'HR / เงินเดือน', keyword: 'hr' },
      { id: 'erp', emoji: '📊', label: 'ERP / บัญชี', keyword: 'erp' },
    ],
  },
  {
    label: 'บริการ', emoji: '🏨',
    ids: [
      { id: 'hotel', emoji: '🏨', label: 'โรงแรม / จอง', keyword: 'โรงแรม' },
      { id: 'salon', emoji: '💇', label: 'ร้านเสริมสวย', keyword: 'salon' },
      { id: 'logistics', emoji: '🚚', label: 'ขนส่ง / Delivery', keyword: 'logistics' },
      { id: 'warehouse', emoji: '📦', label: 'คลังสินค้า', keyword: 'คลังสินค้า' },
      { id: 'carwash', emoji: '🚗', label: 'อู่ซ่อมรถ / คาร์แคร์', keyword: 'อู่ซ่อมรถ' },
      { id: 'realestate', emoji: '🏠', label: 'อสังหา / ห้องเช่า', keyword: 'อสังหา' },
      { id: 'nonprofit', emoji: '💚', label: 'มูลนิธิ / NGO', keyword: 'มูลนิธิ' },
    ],
  },
  {
    label: 'เทคโนโลยี', emoji: '💻',
    ids: [
      { id: 'website', emoji: '🌐', label: 'เว็บไซต์', keyword: 'เว็บ' },
      { id: 'mobile', emoji: '📱', label: 'แอปมือถือ', keyword: 'แอพ' },
      { id: 'desktop', emoji: '🖥️', label: 'โปรแกรม Windows', keyword: 'desktop' },
      { id: 'game', emoji: '🎮', label: 'เกมส์', keyword: 'เกมส์' },
      { id: 'ai', emoji: '🤖', label: 'AI / Chatbot', keyword: 'ai' },
      { id: 'chat', emoji: '💬', label: 'LINE Bot / Chat', keyword: 'line bot' },
      { id: 'dashboard', emoji: '📈', label: 'Dashboard', keyword: 'dashboard' },
      { id: 'devops', emoji: '🐳', label: 'DevOps / Docker', keyword: 'devops' },
      { id: 'security', emoji: '🔒', label: 'Security / CCTV', keyword: 'security' },
      { id: 'scraping', emoji: '🕷️', label: 'Scraping / RPA', keyword: 'scraping' },
    ],
  },
  {
    label: 'สร้างสรรค์', emoji: '🎨',
    ids: [
      { id: 'design', emoji: '🎨', label: 'กราฟิก / UI-UX', keyword: 'design' },
      { id: 'music', emoji: '🎵', label: 'เพลง / Podcast', keyword: 'music' },
      { id: 'video', emoji: '🎬', label: 'วิดีโอ / Streaming', keyword: 'video' },
      { id: 'cad', emoji: '📐', label: 'CAD / 3D', keyword: 'cad' },
    ],
  },
  {
    label: 'อุตสาหกรรม', emoji: '🏭',
    ids: [
      { id: 'manufacturing', emoji: '🏭', label: 'โรงงาน / ผลิต', keyword: 'โรงงาน' },
      { id: 'construction', emoji: '🏗️', label: 'ก่อสร้าง / BIM', keyword: 'ก่อสร้าง' },
      { id: 'healthcare', emoji: '🏥', label: 'โรงพยาบาล / คลินิก', keyword: 'hospital' },
      { id: 'education', emoji: '🎓', label: 'โรงเรียน / LMS', keyword: 'school' },
      { id: 'legal', emoji: '⚖️', label: 'กฎหมาย / ทนาย', keyword: 'legal' },
      { id: 'agriculture', emoji: '🌾', label: 'เกษตร / ฟาร์ม', keyword: 'เกษตร' },
      { id: 'government', emoji: '🏛️', label: 'ราชการ', keyword: 'ราชการ' },
      { id: 'blockchain', emoji: '⛓️', label: 'Blockchain', keyword: 'blockchain' },
    ],
  },
]


export default function StackQuizCustom() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState<TechStackMapping | { wildcardResponse: string } | 'fallback' | null>(null)
  const [showBrowser, setShowBrowser] = useState(false)
  const [skillLevel, setSkillLevel] = useState<SkillLevelId | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleSearch() {
    const q = query.trim()
    if (!q) return

    const found = findTechStack(q)
    if (!found) {
      setResult('fallback')
    } else if ('retro' in found) {
      setResult(found as TechStackMapping)
    } else {
      setResult({ wildcardResponse: found.response })
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleSearch()
  }

  function handleReset() {
    setQuery('')
    setResult(null)
    setSkillLevel(null)
    inputRef.current?.focus()
  }

  function handleChipClick(keyword: string) {
    setQuery(keyword)
    const found = findTechStack(keyword)
    if (!found) {
      setResult('fallback')
    } else if ('retro' in found) {
      setResult(found as TechStackMapping)
    } else {
      setResult({ wildcardResponse: found.response })
    }
  }

  const isMapping = result && result !== 'fallback' && !('wildcardResponse' in result)
  const mapping = isMapping ? (result as TechStackMapping) : null
  const timeEstimate = mapping && skillLevel ? getTimeEstimate(mapping.id, skillLevel) : null

  return (
    <div>
      <style>{`
        .sqc-input {
          width: 100%;
          padding: 14px 18px;
          border-radius: 12px;
          border: 1.5px solid #e8e0d4;
          background: #ffffff;
          color: #2d2a26;
          font-size: 15px;
          font-family: inherit;
          outline: none;
          transition: border-color 0.15s;
          box-sizing: border-box;
        }
        .sqc-input:focus { border-color: #ff6c01; }
        .sqc-input::placeholder { color: #b8b0a8; }

        .sqc-btn {
          padding: 14px 28px;
          border-radius: 12px;
          border: none;
          background: #ff6c01;
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          white-space: nowrap;
          transition: background 0.15s;
          flex-shrink: 0;
        }
        .sqc-btn:hover { background: #d54e01; }

        @keyframes sqcSlide {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .sqc-result { animation: sqcSlide 0.25s ease forwards; }

        .sqc-tag {
          display: inline-block;
          font-size: 12px;
          font-family: 'Fira Code', Consolas, monospace;
          padding: 3px 10px;
          border-radius: 5px;
          background: rgba(45,42,38,0.07);
          color: #5a5652;
          margin: 3px 4px 3px 0;
        }
        .sqc-chip {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: none;
          border: 1px solid #e8e0d4;
          border-radius: 20px;
          padding: 4px 12px;
          font-size: 12px;
          color: #8a8279;
          cursor: pointer;
          font-family: inherit;
          transition: border-color 0.15s, color 0.15s, background 0.15s;
          white-space: nowrap;
        }
        .sqc-chip:hover {
          border-color: #ff6c01;
          color: #ff6c01;
          background: rgba(255,108,1,0.04);
        }
        @keyframes sqcExpand {
          from { opacity: 0; max-height: 0; }
          to   { opacity: 1; max-height: 800px; }
        }
        .sqc-browser {
          animation: sqcExpand 0.3s ease forwards;
          overflow: hidden;
        }
        .sqc-skill-btn {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 2px;
          padding: 10px 14px;
          border-radius: 10px;
          border: 1.5px solid #e8e0d4;
          background: #ffffff;
          cursor: pointer;
          font-family: inherit;
          transition: border-color 0.15s, background 0.15s;
          text-align: left;
          flex: 1;
          min-width: 140px;
        }
        .sqc-skill-btn:hover {
          border-color: #ff6c01;
          background: rgba(255,108,1,0.03);
        }
        .sqc-skill-btn.active {
          border-color: #ff6c01;
          background: rgba(255,108,1,0.06);
        }
        @keyframes sqcFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .sqc-time-result {
          animation: sqcFadeIn 0.2s ease forwards;
        }
      `}</style>

      {/* Input row */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'stretch', marginBottom: '20px' }}>
        <input
          ref={inputRef}
          className="sqc-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="เช่น จะทำเกมส์, อยากทำ AI chatbot, ระบบบัญชี..."
          autoComplete="off"
        />
        <button className="sqc-btn" onClick={handleSearch}>
          ค้นหา
        </button>
      </div>

      {/* Suggestion chips / Category browser */}
      {!result && (
        <div style={{ marginBottom: '4px' }}>
          {/* Toggle row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', color: '#b8b0a8' }}>ลองเช่น:</span>
            {!showBrowser && ['เกมส์', 'AI', 'แอพมือถือ', 'เว็บ', 'ERP', 'IoT', 'dashboard'].map((s) => (
              <button
                key={s}
                className="sqc-chip"
                onClick={() => handleChipClick(s)}
              >
                {s}
              </button>
            ))}
            <button
              onClick={() => setShowBrowser((v) => !v)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                fontSize: '13px', color: '#8a8279', cursor: 'pointer',
                background: 'none', border: '1px solid #e8e0d4', borderRadius: '20px',
                padding: '6px 16px', fontFamily: 'inherit', transition: 'border-color 0.15s, color 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#ff6c01'; e.currentTarget.style.color = '#ff6c01' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e8e0d4'; e.currentTarget.style.color = '#8a8279' }}
            >
              {showBrowser ? 'ซ่อนหมวดหมู่ ▲' : 'ดูหมวดหมู่ทั้งหมด (35) ▼'}
            </button>
          </div>

          {/* Category browser */}
          {showBrowser && (
            <div className="sqc-browser" style={{ marginTop: 14 }}>
              {categoryGroups.map(group => (
                <div key={group.label} style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#8a8279', marginBottom: 6 }}>
                    {group.emoji} {group.label}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {group.ids.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => handleChipClick(cat.keyword)}
                        className="sqc-chip"
                      >
                        {cat.emoji} {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="sqc-result">
          {/* Fallback */}
          {result === 'fallback' && (
            <div style={{
              padding: '20px 24px',
              borderRadius: '14px',
              background: '#faf7f2',
              border: '1.5px solid #e8e0d4',
            }}>
              <p style={{ color: '#5a5652', fontSize: '15px', lineHeight: 1.7, margin: '0 0 14px' }}>
                {FALLBACK_MESSAGE}
              </p>
              <button
                onClick={handleReset}
                style={{
                  background: 'none', border: '1px solid #e8e0d4',
                  borderRadius: '8px', padding: '8px 16px',
                  fontSize: '13px', color: '#8a8279',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                ← ลองใหม่
              </button>
            </div>
          )}

          {/* Wildcard response */}
          {typeof result === 'object' && result !== null && 'wildcardResponse' in result && (
            <div style={{
              padding: '20px 24px',
              borderRadius: '14px',
              background: '#fff8f4',
              border: '1.5px solid rgba(255,108,1,0.25)',
            }}>
              <p style={{ color: '#2d2a26', fontSize: '15px', lineHeight: 1.7, margin: '0 0 14px' }}>
                {(result as { wildcardResponse: string }).wildcardResponse}
              </p>
              <button
                onClick={handleReset}
                style={{
                  background: 'none', border: '1px solid #e8e0d4',
                  borderRadius: '8px', padding: '8px 16px',
                  fontSize: '13px', color: '#8a8279',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                ← ลองใหม่
              </button>
            </div>
          )}

          {/* Tech mapping card */}
          {mapping && (
            <div style={{
              borderRadius: '16px',
              border: '1.5px solid #e8e0d4',
              background: '#ffffff',
              overflow: 'hidden',
            }}>
              {/* Retro section */}
              <div style={{
                padding: '22px 24px',
                background: '#f5f0e8',
                borderBottom: '1px solid #e8e0d4',
              }}>
                <div style={{
                  fontSize: '11px', fontWeight: 700,
                  color: '#8a8279', textTransform: 'uppercase',
                  letterSpacing: '0.6px', marginBottom: '10px',
                  fontFamily: "'Fira Code', Consolas, monospace",
                }}>
                  🕰️ สมัยก่อน
                </div>
                <p style={{
                  fontFamily: "'Fira Code', Consolas, monospace",
                  fontSize: '13px', color: '#5a5652',
                  background: 'rgba(45,42,38,0.06)',
                  padding: '8px 14px', borderRadius: '8px',
                  marginBottom: '10px', lineHeight: 1.7,
                }}>
                  {mapping.retro.tech}
                </p>
                <p style={{ fontSize: '14px', color: '#6b6460', lineHeight: 1.7, margin: 0 }}>
                  {mapping.retro.joke}
                </p>
              </div>

              {/* Modern section */}
              <div style={{ padding: '22px 24px' }}>
                <div style={{
                  fontSize: '11px', fontWeight: 700,
                  color: '#ff6c01', textTransform: 'uppercase',
                  letterSpacing: '0.6px', marginBottom: '12px',
                  fontFamily: "'Fira Code', Consolas, monospace",
                }}>
                  🚀 ปี 2026 — Modern Stack
                </div>

                {/* Stack tags */}
                <div style={{ marginBottom: '12px' }}>
                  {mapping.modern.stack.map((s) => (
                    <span key={s} className="sqc-tag">{s}</span>
                  ))}
                </div>

                <p style={{ fontSize: '14px', color: '#6b6460', lineHeight: 1.75, marginBottom: '18px' }}>
                  {mapping.modern.reason}
                </p>

                {/* Footer row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <button
                    onClick={handleReset}
                    style={{
                      background: 'none', border: '1px solid #e8e0d4',
                      borderRadius: '8px', padding: '7px 14px',
                      fontSize: '12px', color: '#8a8279',
                      cursor: 'pointer', fontFamily: 'inherit',
                    }}
                  >
                    ← ลองใหม่
                  </button>
                </div>
              </div>

              {/* Time estimate section */}
              <div style={{
                padding: '22px 24px',
                borderTop: '1px solid #e8e0d4',
                background: '#faf7f2',
              }}>
                <div style={{
                  fontSize: '11px', fontWeight: 700,
                  color: '#8a8279', textTransform: 'uppercase',
                  letterSpacing: '0.6px', marginBottom: '14px',
                  fontFamily: "'Fira Code', Consolas, monospace",
                }}>
                  ⏱️ ประเมินเวลาพัฒนา (MVP)
                </div>

                <p style={{ fontSize: '14px', color: '#5a5652', marginBottom: '12px' }}>
                  คุณเคยเขียนโค้ดอะไรมาก่อนบ้าง?
                </p>

                {/* Skill level buttons */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                  {SKILL_LEVELS.map(skill => (
                    <button
                      key={skill.id}
                      onClick={() => setSkillLevel(skill.id)}
                      className={`sqc-skill-btn${skillLevel === skill.id ? ' active' : ''}`}
                    >
                      <span style={{ fontSize: '14px' }}>
                        {skill.emoji} {skill.label}
                      </span>
                      <span style={{ fontSize: '11px', color: '#b8b0a8' }}>
                        {skill.description}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Time comparison cards */}
                {timeEstimate && (
                  <div className="sqc-time-result">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                      {/* Traditional */}
                      <div style={{
                        padding: '16px',
                        borderRadius: '12px',
                        background: '#f0ede7',
                        textAlign: 'center',
                      }}>
                        <div style={{ fontSize: '12px', color: '#8a8279', marginBottom: '6px' }}>
                          🐌 แบบเดิม (เขียนเอง)
                        </div>
                        <div style={{
                          fontSize: '18px', fontWeight: 700, color: '#5a5652',
                        }}>
                          {timeEstimate.traditional}
                        </div>
                      </div>

                      {/* Vibecoding */}
                      <div style={{
                        padding: '16px',
                        borderRadius: '12px',
                        background: 'rgba(255,108,1,0.07)',
                        textAlign: 'center',
                      }}>
                        <div style={{ fontSize: '12px', color: '#ff6c01', marginBottom: '6px' }}>
                          ⚡ Vibecoding
                        </div>
                        <div style={{
                          fontSize: '18px', fontWeight: 700, color: '#ff6c01',
                        }}>
                          {timeEstimate.vibecoding}
                        </div>
                      </div>
                    </div>

                    {/* Tip */}
                    <p style={{
                      fontSize: '13px', color: '#6b6460', lineHeight: 1.7,
                      margin: '0 0 8px',
                      padding: '10px 14px',
                      background: 'rgba(255,108,1,0.04)',
                      borderRadius: '8px',
                    }}>
                      💡 {timeEstimate.note}
                    </p>

                    {/* Caveat */}
                    <p style={{
                      fontSize: '11px', color: '#b8b0a8', margin: 0,
                    }}>
                      * เวลาประมาณสำหรับ MVP version — production system ใช้เวลาเพิ่ม 2-3x
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
