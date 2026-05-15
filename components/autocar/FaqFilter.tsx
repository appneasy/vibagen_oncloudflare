'use client'

import { useState } from 'react'
import type { FaqItem, FaqBodyItem, FaqBodyChecklist, FaqBodyList, FaqBodySplit, FaqBodyTiers } from '@/data/autocar-faq'

const tierBorderColor: Record<string, string> = {
  green: 'border-l-green-500',
  yellow: 'border-l-amber-400',
  blue: 'border-l-blue-500',
  red: 'border-l-red-500',
}

const tierBadgeColor: Record<string, string> = {
  green: 'bg-green-100 text-green-700',
  yellow: 'bg-amber-100 text-amber-700',
  blue: 'bg-blue-100 text-blue-700',
  red: 'bg-red-100 text-red-700',
}

function renderBodyItem(item: FaqBodyItem, idx: number) {
  if (typeof item === 'string') {
    return (
      <p
        key={idx}
        className="font-[--font-body] text-gray-600 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: item }}
      />
    )
  }

  if (item.kind === 'checklist') {
    const checklist = item as FaqBodyChecklist
    const marker = checklist.warn ? '✗' : '✓'
    const markerColor = checklist.warn ? 'text-red-500' : 'text-amber-500'
    return (
      <div key={idx}>
        {checklist.title && (
          <p className="font-[--font-body] font-semibold text-[#0d2749] mb-2 text-sm">
            {checklist.title}
          </p>
        )}
        <ul className="space-y-1.5">
          {checklist.items.map((line, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className={`mt-0.5 font-bold text-sm flex-shrink-0 ${markerColor}`}>{marker}</span>
              <span
                className="font-[--font-body] text-gray-600 text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: line }}
              />
            </li>
          ))}
        </ul>
      </div>
    )
  }

  if (item.kind === 'list') {
    const list = item as FaqBodyList
    return (
      <ol key={idx} className="space-y-1.5 list-decimal list-inside">
        {list.items.map((line, i) => (
          <li key={i} className="font-[--font-body] text-gray-600 text-sm leading-relaxed">
            <span dangerouslySetInnerHTML={{ __html: line }} />
          </li>
        ))}
      </ol>
    )
  }

  if (item.kind === 'split') {
    const split = item as FaqBodySplit
    return (
      <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[split.a, split.b].map((side, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-100 p-4">
            <p className="font-[--font-heading] font-semibold text-sm text-[#0d2749] mb-2">
              {side.title}
            </p>
            <ul className="space-y-1">
              {side.lines.map((line, j) => (
                <li
                  key={j}
                  className="font-[--font-body] text-gray-600 text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: line }}
                />
              ))}
            </ul>
          </div>
        ))}
      </div>
    )
  }

  if (item.kind === 'tiers') {
    const tiers = item as FaqBodyTiers
    return (
      <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {tiers.items.map((t) => (
          <div
            key={t.tier}
            className={`bg-white rounded-lg border border-gray-100 border-l-4 ${tierBorderColor[t.color] ?? 'border-l-gray-300'} p-4`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-bold rounded px-2 py-0.5 ${tierBadgeColor[t.color] ?? 'bg-gray-100 text-gray-700'}`}>
                Tier {t.tier}
              </span>
              <span className="font-[--font-heading] font-bold text-[#0d2749] text-sm">
                ฿{t.price}
              </span>
              <span className="font-[--font-body] text-gray-400 text-xs">{t.time}</span>
            </div>
            <p className="font-[--font-body] text-gray-700 text-sm font-medium">{t.desc}</p>
            <p className="font-[--font-body] text-gray-400 text-xs mt-1">{t.ex}</p>
          </div>
        ))}
      </div>
    )
  }

  return null
}

function FaqCard({ item }: { item: FaqItem }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left px-6 py-5 flex items-start gap-4 focus:outline-none"
        aria-expanded={open}
      >
        <span className="text-2xl flex-shrink-0 mt-0.5">{item.icon}</span>
        <div className="flex-1 min-w-0">
          <span className="inline-block text-xs font-[--font-body] text-amber-600 bg-amber-50 border border-amber-100 rounded px-2 py-0.5 mb-2">
            {item.catLabel}
          </span>
          <h3 className="font-[--font-heading] font-semibold text-base text-[#0d2749] leading-snug mb-1">
            {item.q}
          </h3>
          <p className="font-[--font-body] text-sm text-gray-500 leading-relaxed">{item.short}</p>
        </div>
        <span
          className={`flex-shrink-0 mt-1 text-amber-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>

      {open && (
        <div className="bg-[#f8f9fc] border-t border-gray-100 px-6 py-5">
          <div className="space-y-4">
            {item.body.map((bodyItem, idx) => renderBodyItem(bodyItem, idx))}
          </div>
        </div>
      )}
    </div>
  )
}

interface FaqFilterProps {
  items: FaqItem[]
  categories: { key: string; label: string; icon: string }[]
}

export default function FaqFilter({ items, categories }: FaqFilterProps) {
  const [active, setActive] = useState<string>('ALL')

  const filtered = active === 'ALL' ? items : items.filter((item) => item.cat === active)

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-10 justify-center">
        <button
          onClick={() => setActive('ALL')}
          className={`px-4 py-2 rounded-full text-sm font-[--font-body] font-medium transition-colors duration-150 ${
            active === 'ALL'
              ? 'bg-amber-500 text-[#0d2749]'
              : 'bg-[#f8f9fc] text-gray-600 hover:bg-gray-100'
          }`}
        >
          ทั้งหมด ({items.length})
        </button>
        {categories.map((cat) => {
          const count = items.filter((item) => item.cat === cat.key).length
          return (
            <button
              key={cat.key}
              onClick={() => setActive(cat.key)}
              className={`px-4 py-2 rounded-full text-sm font-[--font-body] font-medium transition-colors duration-150 ${
                active === cat.key
                  ? 'bg-amber-500 text-[#0d2749]'
                  : 'bg-[#f8f9fc] text-gray-600 hover:bg-gray-100'
              }`}
            >
              {cat.icon} {cat.label} ({count})
            </button>
          )
        })}
      </div>

      <div className="space-y-3">
        {filtered.map((item) => (
          <FaqCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
