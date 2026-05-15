'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import type { TutorialTopic } from '@/data/autocar-tutorial'

interface TutorialViewerProps {
  topic: TutorialTopic
}

export default function TutorialViewer({ topic }: TutorialViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  const totalSteps = topic.steps.length
  const step = topic.steps[currentIndex]

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

  return (
    <div className="flex flex-col md:flex-row gap-10 md:gap-14 items-center md:items-start">
      {/* Phone frame */}
      <div className="flex-shrink-0 flex justify-center w-full md:w-auto">
        <div
          className="relative rounded-[2.5rem] border-[6px] border-[#1a1a2e] shadow-2xl overflow-hidden"
          style={{ width: 280, background: '#1a1a2e' }}
        >
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#1a1a2e] rounded-b-2xl z-10" />

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
                priority={currentIndex === 0}
              />
            </div>
          </div>

          {/* Home indicator bar */}
          <div className="flex justify-center py-2 bg-[#1a1a2e]">
            <div className="w-20 h-1 rounded-full bg-white/30" />
          </div>
        </div>
      </div>

      {/* Step info */}
      <div className="flex-1 w-full flex flex-col">
        {/* Step dots */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {topic.steps.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`ขั้นตอนที่ ${i + 1}`}
              className={`rounded-full transition-all duration-200 ${
                i === currentIndex
                  ? 'w-6 h-2.5 bg-amber-500'
                  : 'w-2.5 h-2.5 bg-gray-200 hover:bg-amber-200'
              }`}
            />
          ))}
        </div>

        {/* Step counter */}
        <p className="font-[--font-body] text-sm text-gray-400 mb-3 tracking-wide">
          ขั้นตอน {currentIndex + 1}/{totalSteps}
        </p>

        {/* Title + description */}
        <div
          className="transition-opacity duration-150"
          style={{ opacity: visible ? 1 : 0 }}
        >
          <h2 className="font-[--font-heading] font-bold text-2xl text-[#0d2749] mb-3 leading-snug">
            {step.title}
          </h2>
          <p className="font-[--font-body] text-gray-600 text-base leading-relaxed mb-5">
            {step.description}
          </p>

          {step.highlight && (
            <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-lg px-4 py-3 mb-5">
              <p className="font-[--font-body] text-sm text-amber-900 leading-relaxed">
                {step.highlight}
              </p>
            </div>
          )}
        </div>

        {/* Navigation buttons */}
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

        {/* Keyboard hint */}
        <p className="font-[--font-body] text-xs text-gray-400 mt-3">
          กด ← → บนคีย์บอร์ดเพื่อเปลี่ยนขั้นตอน
        </p>
      </div>
    </div>
  )
}
