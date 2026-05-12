'use client'

import { useState, useRef, useCallback } from 'react'
import glossary from '@/data/glossary.json'

type GlossaryKey = keyof typeof glossary

interface TooltipProps {
  /** Key in data/glossary.json */
  term: GlossaryKey
  children: React.ReactNode
}

export default function Tooltip({ term, children }: TooltipProps) {
  const entry = glossary[term]
  const [active, setActive] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showBalloon = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setActive(true)
  }, [])

  const hideBalloon = useCallback(() => {
    setActive(false)
  }, [])

  // Mobile: tap to show, auto-hide after 3s
  const handleClick = useCallback(() => {
    if (active) {
      hideBalloon()
      return
    }
    showBalloon()
    timerRef.current = setTimeout(hideBalloon, 3000)
  }, [active, showBalloon, hideBalloon])

  if (!entry) {
    // Fallback — render without tooltip if term not found
    return <>{children}</>
  }

  return (
    <span
      className={`tooltip-wrapper ${active ? 'active' : ''}`}
      onMouseEnter={showBalloon}
      onMouseLeave={hideBalloon}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      aria-describedby={`tooltip-${term}`}
    >
      <span className="tooltip-trigger">{children}</span>

      {/* Balloon */}
      <span
        id={`tooltip-${term}`}
        role="tooltip"
        className="tooltip-balloon"
        style={{ display: active ? 'block' : undefined }}
      >
        <span className="tooltip-term">{entry.label}</span>
        <span className="tooltip-desc">{entry.desc}</span>
        {entry.example && (
          <span
            className="tooltip-desc block mt-1.5 text-[0.75rem] opacity-70 italic"
          >
            ตัวอย่าง: {entry.example}
          </span>
        )}
      </span>
    </span>
  )
}
