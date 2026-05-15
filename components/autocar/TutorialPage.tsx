'use client'

import { useState } from 'react'
import type { TutorialTopic } from '@/data/autocar-tutorial'
import TutorialViewer from './TutorialViewer'

interface TutorialPageProps {
  topics: TutorialTopic[]
  phases: { phase: number; title: string; subtitle: string }[]
}

// Short labels for mobile pills (truncated)
const SHORT_LABELS: Record<number, string> = {
  1: 'รับรถ',
  2: 'จองออนไลน์',
  3: 'ประเมินราคา',
  4: 'ติดตามซ่อม',
  5: 'ล้างรถ',
  6: 'สต็อก',
  7: 'ทีม',
  8: 'ประวัติลูกค้า',
  9: 'Dashboard',
  10: 'โปรโมชั่น',
  11: 'PM แจ้งเตือน',
  12: 'Health Check',
}

const PHASE_COLORS: Record<number, string> = {
  1: 'bg-blue-100 text-blue-700',
  2: 'bg-purple-100 text-purple-700',
  3: 'bg-orange-100 text-orange-700',
  4: 'bg-green-100 text-green-700',
}

export default function TutorialPage({ topics, phases }: TutorialPageProps) {
  const [selectedId, setSelectedId] = useState(topics[0].id)

  const selectedTopic = topics.find((t) => t.id === selectedId) ?? topics[0]

  function selectTopic(id: string) {
    setSelectedId(id)
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 lg:gap-10">
      {/* ── Sidebar (desktop md+) ── */}
      <aside className="hidden md:block w-72 flex-shrink-0">
        <div className="sticky top-[120px] rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          {phases.map((ph) => {
            const phaseTopics = topics.filter((t) => t.phase === ph.phase)
            return (
              <div key={ph.phase}>
                {/* Phase header */}
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className={`text-xs font-[--font-heading] font-semibold px-2 py-0.5 rounded-full ${PHASE_COLORS[ph.phase]}`}
                    >
                      Phase {ph.phase}
                    </span>
                  </div>
                  <p className="font-[--font-heading] font-semibold text-[#0d2749] text-sm leading-tight">
                    {ph.title}
                  </p>
                  <p className="font-[--font-body] text-gray-400 text-xs mt-0.5">{ph.subtitle}</p>
                </div>

                {/* Topics in phase */}
                <ul>
                  {phaseTopics.map((topic) => {
                    const isActive = topic.id === selectedId
                    return (
                      <li key={topic.id}>
                        <button
                          onClick={() => selectTopic(topic.id)}
                          className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors border-b border-gray-50 last:border-0 ${
                            isActive
                              ? 'bg-amber-50 border-l-4 border-l-amber-500'
                              : 'hover:bg-gray-50 border-l-4 border-l-transparent'
                          }`}
                        >
                          <span className="text-lg leading-none flex-shrink-0">{topic.icon}</span>
                          <span className="flex-1 min-w-0">
                            <span
                              className={`block font-[--font-heading] font-medium text-sm leading-snug truncate ${
                                isActive ? 'text-[#0d2749]' : 'text-gray-600'
                              }`}
                            >
                              {topic.topicNumber}. {topic.title}
                            </span>
                          </span>
                          {isActive && (
                            <span className="text-amber-500 text-xs flex-shrink-0">◀</span>
                          )}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
        </div>
      </aside>

      {/* ── Mobile pill selector ── */}
      <div className="md:hidden -mx-4 px-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {topics.map((topic) => {
            const isActive = topic.id === selectedId
            return (
              <button
                key={topic.id}
                onClick={() => selectTopic(topic.id)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-[--font-body] transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-500 text-[#0d2749] font-medium'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {topic.topicNumber}. {SHORT_LABELS[topic.topicNumber] ?? topic.title}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Content area ── */}
      <div className="flex-1 min-w-0">
        {/* Topic header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span
              className={`text-xs font-[--font-heading] font-semibold px-2.5 py-1 rounded-full ${PHASE_COLORS[selectedTopic.phase]}`}
            >
              Phase {selectedTopic.phase}
            </span>
            <span className="text-xs font-[--font-body] text-gray-400">
              หัวข้อที่ {selectedTopic.topicNumber} / 12
            </span>
          </div>
          <h2 className="font-[--font-heading] font-bold text-2xl sm:text-3xl text-[#0d2749] mb-1 leading-tight">
            {selectedTopic.icon} {selectedTopic.title}
          </h2>
          <p className="font-[--font-body] text-gray-500 text-base">{selectedTopic.subtitle}</p>
        </div>

        {/* Problem card */}
        <div className="bg-red-50 border border-red-100 rounded-xl p-5 mb-6">
          <p className="font-[--font-heading] font-semibold text-red-800 text-sm mb-1">
            🔴 ปัญหา
          </p>
          <p className="font-[--font-body] text-red-700 text-base leading-relaxed">
            {selectedTopic.problem}
          </p>
          <p className="font-[--font-heading] font-semibold text-green-800 text-sm mt-3 mb-1">
            ✅ ระบบช่วย
          </p>
          <p className="font-[--font-body] text-green-700 text-base leading-relaxed">
            {selectedTopic.solution}
          </p>
        </div>

        {/* Step viewer */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 mb-6">
          <TutorialViewer topic={selectedTopic} />
        </div>

        {/* Values */}
        <div className="mb-6">
          <p className="font-[--font-heading] font-semibold text-[#0d2749] text-base mb-3">
            💡 คุณค่าที่ได้
          </p>
          <ul className="space-y-2">
            {selectedTopic.values.map((v, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="text-green-600 font-bold text-base leading-relaxed flex-shrink-0">
                  ✓
                </span>
                <span className="font-[--font-body] text-gray-700 text-base leading-relaxed">
                  {v}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer note */}
        {selectedTopic.customerNote && (
          <div className="bg-blue-50 border-l-4 border-blue-400 rounded-r-xl p-4">
            <p className="font-[--font-heading] font-semibold text-blue-800 text-sm mb-1">
              📱 ลูกค้าเห็นอะไร
            </p>
            <p className="font-[--font-body] text-blue-700 text-sm leading-relaxed">
              {selectedTopic.customerNote}
            </p>
          </div>
        )}

        {/* Topic navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
          {(() => {
            const currentIdx = topics.findIndex((t) => t.id === selectedId)
            const prevTopic = currentIdx > 0 ? topics[currentIdx - 1] : null
            const nextTopic = currentIdx < topics.length - 1 ? topics[currentIdx + 1] : null
            return (
              <>
                <div>
                  {prevTopic && (
                    <button
                      onClick={() => selectTopic(prevTopic.id)}
                      className="flex items-center gap-2 text-sm font-[--font-body] text-gray-500 hover:text-[#0d2749] transition-colors"
                    >
                      <span>←</span>
                      <span className="hidden sm:inline">
                        {prevTopic.topicNumber}. {prevTopic.title}
                      </span>
                      <span className="sm:hidden">ก่อนหน้า</span>
                    </button>
                  )}
                </div>
                <div>
                  {nextTopic && (
                    <button
                      onClick={() => selectTopic(nextTopic.id)}
                      className="flex items-center gap-2 text-sm font-[--font-body] text-gray-500 hover:text-[#0d2749] transition-colors"
                    >
                      <span className="hidden sm:inline">
                        {nextTopic.topicNumber}. {nextTopic.title}
                      </span>
                      <span className="sm:hidden">ถัดไป</span>
                      <span>→</span>
                    </button>
                  )}
                </div>
              </>
            )
          })()}
        </div>
      </div>
    </div>
  )
}
