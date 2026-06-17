'use client'

import { useState } from 'react'
import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import PatternBadge from '@/components/lab/PatternBadge'
import type { LabNoteMeta } from '@/lib/lab'

const patternFilters = [
  { key: 'ทั้งหมด', label: 'ทั้งหมด' },
  { key: 'P1', label: 'P1 · Decode→Deploy' },
  { key: 'P2', label: 'P2 · Field Note' },
]

interface LabContentProps {
  notes: LabNoteMeta[]
}

export default function LabContent({ notes }: LabContentProps) {
  const [activePattern, setActivePattern] = useState('ทั้งหมด')

  const filtered =
    activePattern === 'ทั้งหมด'
      ? notes
      : notes.filter((n) => n.pattern === activePattern)

  return (
    <div className="container">
      {/* Header */}
      <div className="text-center mb-14">
        <Badge dot className="mb-4">AI Lab</Badge>
        <h1
          className="font-[--font-heading] font-bold text-white mb-4"
          style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}
        >
          สิ่งที่ได้จากการคุยกับ AI
        </h1>
        <p className="text-white/60 max-w-2xl mx-auto text-lg">
          ผลลัพธ์จริงจากการพูดคุยกับ AI อย่างมีทิศทาง — prompt ที่ copy ไปใช้ได้ และ insight ที่สกัดมาแล้ว
        </p>
      </div>

      {/* Pattern filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {patternFilters.map((f) => (
          <button
            key={f.key}
            onClick={() => setActivePattern(f.key)}
            className={[
              'px-4 py-2 rounded-full text-sm font-medium border transition-all',
              activePattern === f.key
                ? 'bg-[#ff6c01] text-white border-[#ff6c01]'
                : 'bg-transparent text-white/50 border-white/10 hover:border-white/30 hover:text-white',
            ].join(' ')}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-white/40">ยังไม่มีเนื้อหาในหมวดนี้</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((note) => {
            const patternColor = note.pattern === 'P1' ? '#f59e0b' : '#22d3ee'
            return (
            <Link
              key={note.slug}
              href={`/lab/${note.slug}`}
              className="group rounded-2xl p-6 transition-all flex flex-col gap-4"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderTop: `2px solid ${patternColor}40`,
              }}
            >
              {/* Pattern badge + read time */}
              <div className="flex items-center justify-between">
                <PatternBadge pattern={note.pattern} patternName={note.patternName} />
                <span className="text-white/30 text-xs">{note.readTime} นาที</span>
              </div>

              {/* Title */}
              <h3 className="font-[--font-heading] font-semibold text-white text-lg leading-snug group-hover:text-[#ff6c01] transition-colors flex-1">
                {note.title}
              </h3>

              {/* Excerpt */}
              <p className="text-white/55 text-sm leading-relaxed">{note.excerpt}</p>

              {/* Tags */}
              {note.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {note.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 rounded-md"
                      style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.45)' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/30">
                  {new Date(note.date).toLocaleDateString('th-TH', {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </span>
                <span className="text-[#ff6c01] group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
