'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface PauseResumeButtonProps {
  monitorId: number
  currentlyActive: boolean
}

export default function PauseResumeButton({ monitorId, currentlyActive }: PauseResumeButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleToggle() {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/monitors/${monitorId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: currentlyActive ? 0 : 1 }),
      })

      if (res.ok) {
        router.refresh()
      } else {
        const data = await res.json() as { error?: string }
        alert(data.error ?? 'เกิดข้อผิดพลาด กรุณาลองใหม่')
      }
    } catch {
      alert('เกิดข้อผิดพลาด กรุณาลองใหม่')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      style={{
        background: 'transparent',
        color: loading ? '#9ca3af' : '#0d2749',
        border: '1px solid #d1d5db',
        borderRadius: 8,
        padding: '10px 24px',
        fontWeight: 500,
        fontSize: 14,
        fontFamily: 'inherit',
        cursor: loading ? 'not-allowed' : 'pointer',
      }}
    >
      {loading ? 'กำลังอัปเดต...' : currentlyActive ? 'Pause Monitor' : 'Resume Monitor'}
    </button>
  )
}
