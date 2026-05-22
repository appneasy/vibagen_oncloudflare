'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface MonitorFormProps {
  mode: 'create' | 'edit'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: any
  monitorId?: number
}

interface CustomerOption {
  slug: string
  name: string
}

const CHECK_INTERVAL_OPTIONS = [
  { value: 60,   label: '1 min' },
  { value: 120,  label: '2 min' },
  { value: 300,  label: '5 min' },
  { value: 600,  label: '10 min' },
  { value: 900,  label: '15 min' },
  { value: 1800, label: '30 min' },
  { value: 3600, label: '1 hour' },
]

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  borderRadius: 8,
  border: '1px solid #d1d5db',
  fontSize: 14,
  fontFamily: 'inherit',
  boxSizing: 'border-box',
  outline: 'none',
  background: '#fff',
  color: '#0d2749',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  color: '#0d2749',
  marginBottom: 4,
}

const fieldStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
}

export default function MonitorForm({ mode, initialData, monitorId }: MonitorFormProps) {
  const router = useRouter()

  const [label,           setLabel]           = useState<string>(initialData?.label           ?? '')
  const [url,             setUrl]             = useState<string>(initialData?.url             ?? '')
  const [customerSlug,    setCustomerSlug]    = useState<string>(initialData?.customerSlug    ?? '')
  const [checkInterval,   setCheckInterval]   = useState<number>(initialData?.checkInterval   ?? 300)
  const [expectedStatus,  setExpectedStatus]  = useState<number>(initialData?.expectedStatus  ?? 200)
  const [expectedKeyword, setExpectedKeyword] = useState<string>(initialData?.expectedKeyword ?? '')
  const [isActive,        setIsActive]        = useState<boolean>((initialData?.isActive ?? 1) === 1)
  const [alertEmails,     setAlertEmails]     = useState<string>(initialData?.alertEmails     ?? '')
  const [telegramChatId,  setTelegramChatId]  = useState<string>(initialData?.telegramChatId  ?? '')

  const [customers,  setCustomers]  = useState<CustomerOption[]>([])
  const [loading,    setLoading]    = useState(false)
  const [errors,     setErrors]     = useState<Record<string, string>>({})
  const [apiError,   setApiError]   = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/customers')
      .then((r) => r.json())
      .then((data: unknown) => {
        if (Array.isArray(data)) {
          setCustomers(data as CustomerOption[])
        }
      })
      .catch(() => {
        // silently fail — customer select just shows empty
      })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    setApiError(null)

    const body = {
      label,
      url,
      customerSlug:    customerSlug    || undefined,
      checkInterval,
      expectedStatus,
      expectedKeyword: expectedKeyword || undefined,
      isActive:        isActive ? 1 : 0,
      alertEmails:     alertEmails     || undefined,
      telegramChatId:  telegramChatId  || undefined,
    }

    try {
      const apiUrl =
        mode === 'create'
          ? '/api/admin/monitors'
          : `/api/admin/monitors/${monitorId}`

      const res = await fetch(apiUrl, {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (res.status === 422) {
        const data = await res.json() as { details?: Record<string, string[]>; error?: string }
        if (data.details) {
          const flat: Record<string, string> = {}
          for (const [k, v] of Object.entries(data.details)) flat[k] = v[0]
          setErrors(flat)
        } else {
          setApiError(data.error ?? 'Validation error')
        }
        return
      }

      if (!res.ok) {
        const data = await res.json() as { error?: string }
        setApiError(data.error ?? `Error ${res.status}`)
        return
      }

      if (mode === 'create') {
        router.push('/admin/uptime')
      } else {
        router.push(`/admin/uptime/${monitorId}`)
      }
    } catch {
      setApiError('เกิดข้อผิดพลาด กรุณาลองใหม่')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* API-level error banner */}
      {apiError && (
        <div
          style={{
            background: '#fee2e2',
            border: '1px solid #fca5a5',
            borderRadius: 8,
            padding: '10px 14px',
            marginBottom: 20,
            fontSize: 13,
            color: '#991b1b',
          }}
        >
          {apiError}
        </div>
      )}

      <div
        style={{
          background: '#fff',
          borderRadius: 12,
          padding: '20px 16px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          border: '1px solid #e5e9f0',
        }}
      >
        {/* 2-column grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 20,
          }}
        >
          {/* Monitor Name */}
          <div style={fieldStyle}>
            <label style={labelStyle}>
              Monitor Name <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input
              style={{ ...inputStyle, borderColor: errors.label ? '#dc2626' : '#d1d5db' }}
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              required
              placeholder="My Website"
            />
            {errors.label && (
              <span style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>{errors.label}</span>
            )}
          </div>

          {/* URL */}
          <div style={fieldStyle}>
            <label style={labelStyle}>
              URL <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input
              style={{ ...inputStyle, borderColor: errors.url ? '#dc2626' : '#d1d5db' }}
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              placeholder="https://example.com"
            />
            {errors.url && (
              <span style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>{errors.url}</span>
            )}
          </div>

          {/* Linked Customer */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Linked Customer</label>
            <select
              style={inputStyle}
              value={customerSlug}
              onChange={(e) => setCustomerSlug(e.target.value)}
            >
              <option value="">— None —</option>
              {customers.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Check Interval */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Check Interval</label>
            <select
              style={inputStyle}
              value={checkInterval}
              onChange={(e) => setCheckInterval(Number(e.target.value))}
            >
              {CHECK_INTERVAL_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Expected Status */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Expected HTTP Status</label>
            <input
              style={{ ...inputStyle, borderColor: errors.expectedStatus ? '#dc2626' : '#d1d5db' }}
              type="number"
              value={expectedStatus}
              onChange={(e) => setExpectedStatus(Number(e.target.value))}
              min={100}
              max={599}
            />
            {errors.expectedStatus && (
              <span style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>{errors.expectedStatus}</span>
            )}
          </div>

          {/* Expected Keyword */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Expected Keyword</label>
            <input
              style={inputStyle}
              type="text"
              value={expectedKeyword}
              onChange={(e) => setExpectedKeyword(e.target.value)}
              placeholder="Welcome"
            />
            <span style={{ fontSize: 11, color: '#737373', marginTop: 4 }}>
              ตรวจสอบว่า response มีคำนี้หรือไม่
            </span>
          </div>

          {/* Alert Emails */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Alert Emails</label>
            <input
              style={inputStyle}
              type="text"
              value={alertEmails}
              onChange={(e) => setAlertEmails(e.target.value)}
              placeholder="email1@example.com, email2@example.com"
            />
          </div>

          {/* Telegram Chat ID */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Telegram Chat ID</label>
            <input
              style={inputStyle}
              type="text"
              value={telegramChatId}
              onChange={(e) => setTelegramChatId(e.target.value)}
              placeholder="-100123456789"
            />
          </div>
        </div>

        {/* Active toggle — full width */}
        <div style={{ marginTop: 20 }}>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              style={{ width: 16, height: 16, accentColor: '#ff6c01', cursor: 'pointer' }}
            />
            <span style={{ fontSize: 14, fontWeight: 600, color: '#0d2749' }}>
              Active (เปิดใช้งาน Monitor)
            </span>
          </label>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
        <button
          type="submit"
          disabled={loading}
          style={{
            background: loading ? '#ffad76' : '#ff6c01',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '10px 24px',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: 14,
            fontFamily: 'inherit',
          }}
        >
          {loading ? 'กำลังบันทึก...' : mode === 'create' ? 'Add Monitor' : 'Save Changes'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          style={{
            background: 'transparent',
            color: '#737373',
            border: '1px solid #d1d5db',
            borderRadius: 8,
            padding: '10px 24px',
            fontWeight: 500,
            cursor: 'pointer',
            fontSize: 14,
            fontFamily: 'inherit',
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
