'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import type { TutorialTopic, TutorialStep } from '@/data/autocar-tutorial'

interface TutorialViewerProps {
  topic: TutorialTopic
  initialIndex?: number
}

function PhoneFrame({ step, visible }: { step: TutorialStep; visible: boolean }) {
  return (
    <div className="flex-shrink-0 flex justify-center w-full md:w-auto">
      <div
        className="relative rounded-[2.5rem] border-[6px] border-[#1a1a2e] shadow-2xl overflow-hidden"
        style={{ width: 260, background: '#1a1a2e' }}
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#1a1a2e] rounded-b-2xl z-10" />

        {/* Screen */}
        <div
          className="overflow-hidden bg-gray-100"
          style={{ width: '100%', aspectRatio: '375/812' }}
        >
          <div
            className="w-full h-full transition-opacity duration-150"
            style={{ opacity: visible ? 1 : 0 }}
          >
            <Image
              src={step.image}
              alt={step.title}
              width={375}
              height={812}
              className="w-full h-full object-cover object-top"
              unoptimized
            />
          </div>
        </div>

        {/* Home indicator */}
        <div className="flex justify-center py-2 bg-[#1a1a2e]">
          <div className="w-16 h-1 rounded-full bg-white/30" />
        </div>
      </div>
    </div>
  )
}

function BrowserFrame({ step, visible }: { step: TutorialStep; visible: boolean }) {
  return (
    <div className="w-full rounded-xl overflow-hidden border border-gray-200 shadow-lg">
      {/* Title bar */}
      <div className="bg-gray-100 px-4 py-2.5 flex items-center gap-2 border-b border-gray-200">
        <span className="w-2.5 h-2.5 rounded-full bg-red-400 flex-shrink-0" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 flex-shrink-0" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-400 flex-shrink-0" />
        <span className="ml-2 text-xs font-[--font-body] text-gray-400 truncate">{step.title}</span>
      </div>

      {/* Screenshot */}
      <div
        className="overflow-hidden bg-white"
        style={{ aspectRatio: '16/10' }}
      >
        <div
          className="w-full h-full transition-opacity duration-150"
          style={{ opacity: visible ? 1 : 0 }}
        >
          <Image
            src={step.image}
            alt={step.title}
            width={1280}
            height={800}
            className="w-full h-full object-cover object-top"
            unoptimized
          />
        </div>
      </div>
    </div>
  )
}

export default function TutorialViewer({ topic, initialIndex = 0 }: TutorialViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [visible, setVisible] = useState(true)

  const totalSteps = topic.steps.length
  const step = topic.steps[currentIndex]

  // Reset to 0 when topic changes
  useEffect(() => {
    setCurrentIndex(0)
    setVisible(true)
  }, [topic.id])

  const goTo = useCallback(
    (index: number) => {
      if (index < 0 || index >= totalSteps) return
      setVisible(false)
      setTimeout(() => {
        setCurrentIndex(index)
        setVisible(true)
      }, 150)
    },
    [totalSteps],
  )

  const goPrev = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo])
  const goNext = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [goPrev, goNext])

  const isAdmin = step.viewport === 'admin'

  // Step info panel — shared between both layouts
  const stepInfo = (
    <div className="flex flex-col flex-1 w-full">
      {/* Step dots */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {topic.steps.map((s, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`ขั้นตอนที่ ${i + 1}`}
            title={s.title}
            className={`rounded-full transition-all duration-200 ${
              i === currentIndex
                ? 'w-6 h-2.5 bg-amber-500'
                : 'w-2.5 h-2.5 bg-gray-200 hover:bg-amber-200'
            }`}
          />
        ))}
      </div>

      {/* Step counter */}
      <p className="font-[--font-body] text-sm text-gray-400 mb-2 tracking-wide">
        ขั้นตอน {currentIndex + 1}/{totalSteps}
        <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500">
          {isAdmin ? '🖥 Admin' : '📱 ลูกค้า'}
        </span>
      </p>

      {/* Title + description */}
      <div className="transition-opacity duration-150" style={{ opacity: visible ? 1 : 0 }}>
        <h3 className="font-[--font-heading] font-bold text-xl text-[#0d2749] mb-2 leading-snug">
          {step.title}
        </h3>
        <p className="font-[--font-body] text-gray-600 text-base leading-relaxed mb-4">
          {step.description}
        </p>

        {step.highlight && (
          <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-lg px-4 py-3 mb-4">
            <p className="font-[--font-body] text-sm text-amber-900 leading-relaxed">
              {step.highlight}
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-3 mt-auto pt-4">
        <button
          onClick={goPrev}
          disabled={currentIndex === 0}
          className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-[--font-heading] font-medium text-sm hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ← ก่อนหน้า
        </button>
        <button
          onClick={goNext}
          disabled={currentIndex === totalSteps - 1}
          className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-amber-500 text-[#0d2749] font-[--font-heading] font-semibold text-sm hover:bg-amber-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ถัดไป →
        </button>
      </div>

      {/* Keyboard hint — desktop only */}
      <p className="hidden md:block font-[--font-body] text-xs text-gray-400 mt-3">
        กด ← → บนคีย์บอร์ดเพื่อเปลี่ยนขั้นตอน
      </p>
    </div>
  )

  if (isAdmin) {
    // Admin: stacked layout — browser frame full width on top, info below
    return (
      <div className="flex flex-col gap-6">
        <BrowserFrame step={step} visible={visible} />
        <div className="flex flex-col">{stepInfo}</div>
      </div>
    )
  }

  // Customer: two-column layout — phone frame left, info right
  return (
    <div className="flex flex-col md:flex-row gap-10 md:gap-12 items-center md:items-start">
      <PhoneFrame step={step} visible={visible} />
      {stepInfo}
    </div>
  )
}
