'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface DeleteCustomerButtonProps {
  slug: string
  name: string
}

export default function DeleteCustomerButton({ slug, name }: DeleteCustomerButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!window.confirm(`ต้องการลบ ${name} ?`)) return

    setLoading(true)
    try {
      const res = await fetch(`/api/admin/customers/${slug}`, { method: 'DELETE' })
      if (res.ok) {
        router.push('/admin/customers')
      } else {
        const data = await res.json() as { error?: string }
        alert(data.error ?? 'เกิดข้อผิดพลาด กรุณาลองใหม่')
        setLoading(false)
      }
    } catch {
      alert('เกิดข้อผิดพลาด กรุณาลองใหม่')
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      style={{
        background: 'transparent',
        color: loading ? '#fca5a5' : '#dc2626',
        border: `1px solid ${loading ? '#fca5a5' : '#dc2626'}`,
        borderRadius: 8,
        padding: '10px 24px',
        fontWeight: 500,
        fontSize: 14,
        fontFamily: 'inherit',
        cursor: loading ? 'not-allowed' : 'pointer',
      }}
    >
      {loading ? 'กำลังลบ...' : 'Delete'}
    </button>
  )
}
