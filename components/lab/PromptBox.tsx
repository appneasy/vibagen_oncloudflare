'use client'

import { useState } from 'react'

interface PromptBoxProps {
  prompt: string
}

export default function PromptBox({ prompt }: PromptBoxProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback: ignore
    }
  }

  return (
    <div
      className="rounded-xl border my-6"
      style={{
        background: 'rgba(255,255,255,0.04)',
        borderColor: 'rgba(255,255,255,0.08)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">
          Copy-ready Prompt
        </span>
        <button
          onClick={handleCopy}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
          style={
            copied
              ? { background: 'rgba(34,197,94,0.15)', color: '#22c55e' }
              : { background: 'rgba(255,108,1,0.12)', color: '#ff6c01' }
          }
        >
          {copied ? '✓ Copied!' : 'Copy'}
        </button>
      </div>

      {/* Body */}
      <pre
        className="px-5 py-4 text-sm leading-relaxed overflow-x-auto whitespace-pre-wrap"
        style={{
          fontFamily: "'Fira Code', Consolas, Monaco, monospace",
          color: 'rgba(255,255,255,0.80)',
        }}
      >
        {prompt}
      </pre>
    </div>
  )
}
