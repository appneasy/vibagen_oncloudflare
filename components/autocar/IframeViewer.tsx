'use client'

import { useState, useEffect, useCallback } from 'react'

interface IframeViewerProps {
  src: string
  title: string
  label: string
  description: string
}

export default function IframeViewer({ src, title, label, description }: IframeViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check, { passive: true })
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (!isFullscreen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFullscreen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isFullscreen])

  const openFullscreen = useCallback(() => setIsFullscreen(true), [])
  const closeFullscreen = useCallback(() => setIsFullscreen(false), [])

  return (
    <>
      {/* Desktop */}
      {!isFullscreen && !isMobile && (
        <div className="relative w-full" style={{ height: 'calc(100vh - 108px)' }}>
          <iframe src={src} className="w-full h-full border-0" title={title} allowFullScreen />
          <button
            onClick={openFullscreen}
            className="absolute bottom-4 right-4 z-10 flex items-center gap-2 px-4 py-2 bg-[#0d2749]/90 hover:bg-[#0d2749] text-white text-sm font-medium rounded-lg backdrop-blur-sm border border-white/10 transition-colors shadow-lg"
          >
            <ExpandIcon />
            เต็มจอ
          </button>
        </div>
      )}

      {/* Mobile: preview + tap to fullscreen */}
      {!isFullscreen && isMobile && (
        <div className="px-4 py-8">
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-xl" style={{ background: '#0F2A5C' }}>
            <div className="relative w-full overflow-hidden" style={{ height: '260px' }}>
              <iframe
                src={src}
                className="border-0 pointer-events-none"
                title={`${title} — Preview`}
                style={{ width: '1920px', height: '1080px', transform: 'scale(0.22)', transformOrigin: 'top left' }}
                tabIndex={-1}
              />
            </div>
            <button
              onClick={openFullscreen}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/40 active:bg-black/50"
            >
              <div className="w-16 h-16 rounded-full bg-amber-500 flex items-center justify-center mb-3 shadow-lg">
                <ExpandIcon size={28} />
              </div>
              <span className="text-white font-[--font-heading] font-semibold text-lg">ดูแบบเต็มจอ</span>
              <span className="text-white/60 text-sm mt-1">แตะเพื่อเปิด {label}</span>
            </button>
          </div>
          <div className="mt-6 space-y-3">
            <h2 className="font-[--font-heading] font-bold text-xl text-[#0d2749]">{title}</h2>
            <p className="font-[--font-body] text-gray-600 text-sm leading-relaxed">{description}</p>
            <button
              onClick={openFullscreen}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-[#0d2749] font-[--font-heading] font-semibold rounded-xl transition-colors"
            >
              <ExpandIcon />
              เปิดเต็มจอ
            </button>
          </div>
        </div>
      )}

      {/* Fullscreen overlay */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[9999] bg-black">
          <iframe src={src} className="w-full h-full border-0" title={title} allowFullScreen />
          <button
            onClick={closeFullscreen}
            className="absolute top-3 right-3 z-10 flex items-center gap-2 px-3 py-2 bg-black/60 hover:bg-black/80 text-white text-sm font-medium rounded-lg backdrop-blur-sm border border-white/20 transition-colors"
          >
            <CollapseIcon />
            <span className="hidden sm:inline">ESC ออกจากเต็มจอ</span>
            <span className="sm:hidden">ปิด</span>
          </button>
        </div>
      )}
    </>
  )
}

function ExpandIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 6V2h4M10 2h4v4M14 10v4h-4M6 14H2v-4" />
    </svg>
  )
}

function CollapseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 2v4H2M10 2v4h4M6 14v-4H2M10 14v-4h4" />
    </svg>
  )
}
