'use client'

import { useState, useEffect, useCallback } from 'react'

const summaryItems = [
  { label: 'ค่าระบบ', value: '฿29,000', sub: 'ซื้อขาดครั้งเดียว' },
  { label: 'Hosting', value: '฿400–900/เดือน', sub: 'ลูกค้าจ่ายตรง' },
  { label: 'Warranty', value: '60 วัน', sub: 'Bug fix ฟรี' },
  { label: 'Customization', value: 'ตาม Tier', sub: 'S / M / L / XL' },
]

const highlights = [
  { q: 'ซื้อขาด หรือเช่ารายเดือน?', a: 'ซื้อขาดครั้งเดียว ฿29,000 — ได้ Source Code ทั้งหมด ไม่มีค่ารายปี' },
  { q: 'ข้อมูลลูกค้าเป็นของใคร?', a: 'ของร้านคุณ 100% — Vibagen ไม่เข้าถึงหรือใช้ข้อมูลนั้น' },
  { q: 'ลูกค้าต้องติดตั้ง App ไหม?', a: 'ไม่ต้อง — ใช้ผ่าน LINE LIFF ที่มีอยู่แล้วได้เลย' },
  { q: 'ย้าย Server ได้ไหม?', a: 'ได้เลย คุณเป็นเจ้าของ Source Code — ไม่มี Lock-in' },
  { q: 'หลายสาขาได้ไหม?', a: 'ได้ แต่ละสาขาข้อมูลแยก Admin ดู Dashboard รวมได้' },
  { q: 'Hotseat Plan คืออะไร?', a: 'Vibagen ดูแล Server, Update, Monitor, Backup ให้ — คุณไม่ต้องยุ่งเรื่องเทคนิค' },
]

export default function FaqViewer() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen])

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  return (
    <>
      {/* ── Landing content ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">

        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-[--font-body] font-semibold tracking-widest uppercase text-amber-500 mb-3">
            FAQ
          </span>
          <h1 className="font-[--font-heading] font-bold text-3xl sm:text-4xl text-[#0d2749] mb-4">
            คำถามที่พบบ่อย
          </h1>
          <p className="font-[--font-body] text-gray-500 text-lg max-w-2xl mx-auto">
            คำตอบสำหรับทุกข้อสงสัยเกี่ยวกับ AutoCar Care
          </p>
        </div>

        {/* Summary pills */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-12">
          {summaryItems.map((item) => (
            <div key={item.label} className="bg-[#f8f9fc] rounded-xl p-4 text-center">
              <p className="font-[--font-body] text-xs text-gray-400 mb-1">{item.label}</p>
              <p className="font-[--font-heading] font-bold text-lg text-[#0d2749]">{item.value}</p>
              <p className="font-[--font-body] text-xs text-gray-400">{item.sub}</p>
            </div>
          ))}
        </div>

        {/* Highlight Q&A */}
        <div className="mb-12">
          <h2 className="font-[--font-heading] font-semibold text-lg text-[#0d2749] mb-6">
            คำถามยอดนิยม
          </h2>
          <div className="divide-y divide-gray-100">
            {highlights.map((item) => (
              <div key={item.q} className="py-5">
                <p className="font-[--font-heading] font-semibold text-[15px] text-[#0d2749] mb-2">
                  {item.q}
                </p>
                <p className="font-[--font-body] text-gray-500 text-sm leading-relaxed">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA to full Q&A */}
        <div className="bg-[#011937] rounded-2xl p-8 sm:p-10 text-center">
          <h3 className="font-[--font-heading] font-bold text-xl text-white mb-2">
            ดูคำถาม-คำตอบทั้งหมด
          </h3>
          <p className="font-[--font-body] text-gray-400 text-sm mb-6">
            รวม 31 คำถามพร้อมคำตอบ — ค่าระบบ, Hosting, Maintenance, Customization และอื่นๆ
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={open}
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-[#0d2749] font-[--font-heading] font-semibold rounded-xl transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 6V2h4M10 2h4v4M14 10v4h-4M6 14H2v-4" />
              </svg>
              เปิดดู Q&A ฉบับเต็ม
            </button>
            <a
              href="/autocar/faq-data.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 hover:bg-white/[0.08] text-white font-[--font-heading] font-medium rounded-xl transition-colors"
            >
              เปิดในหน้าต่างใหม่
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M11 8v3.5a1 1 0 0 1-1 1H2.5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1H6M8.5 1.5H12.5V5.5M6.5 7.5L12.5 1.5" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* ── Popup overlay ── */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] bg-black">
          <iframe
            src="/autocar/faq-data.html"
            className="w-full h-full border-0"
            title="AutoCar Care — Q&A ฉบับเต็ม"
            allowFullScreen
          />
          <button
            onClick={close}
            className="absolute top-3 right-3 z-10 flex items-center gap-2 px-3 py-2 bg-black/60 hover:bg-black/80 text-white text-sm font-medium rounded-lg backdrop-blur-sm border border-white/20 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
            <span className="hidden sm:inline">ปิด</span>
          </button>
        </div>
      )}
    </>
  )
}
