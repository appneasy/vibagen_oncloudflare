'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginForm() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Login failed' })) as { error?: string }
        setError(data.error || 'Login failed')
        setLoading(false)
        return
      }

      router.refresh()
    } catch {
      setError('Network error')
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f8f9fc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: '#fff',
          borderRadius: 14,
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          border: '1px solid #e5e9f0',
          padding: '40px 36px',
          width: '100%',
          maxWidth: 380,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <img
            src="/images/logosquare.png"
            alt="VIBAGEN"
            style={{ width: 120, height: 'auto', objectFit: 'contain', marginBottom: 6 }}
          />
          <div style={{ fontSize: 13, color: '#737373' }}>
            Admin Panel
          </div>
        </div>

        {/* Password field */}
        <div style={{ marginBottom: 20 }}>
          <label
            htmlFor="admin-password"
            style={{
              display: 'block',
              fontSize: 13,
              fontWeight: 500,
              color: '#0d2749',
              marginBottom: 6,
            }}
          >
            Password
          </label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            autoFocus
            required
            style={{
              width: '100%',
              padding: '10px 14px',
              fontSize: 14,
              border: '1px solid #e5e9f0',
              borderRadius: 8,
              outline: 'none',
              boxSizing: 'border-box',
              color: '#0d2749',
            }}
          />
        </div>

        {/* Error message */}
        {error && (
          <div
            style={{
              background: '#fee2e2',
              color: '#991b1b',
              padding: '8px 12px',
              borderRadius: 6,
              fontSize: 13,
              marginBottom: 16,
            }}
          >
            {error}
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading || !password}
          style={{
            width: '100%',
            padding: '11px 0',
            background: loading ? '#9ca3af' : '#ff6c01',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontSize: 15,
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'var(--font-prompt)',
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  )
}
