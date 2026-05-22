'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { ManagedCustomer } from '@/lib/db/schema'

interface CustomerFormProps {
  mode: 'create' | 'edit'
  initialData?: Partial<ManagedCustomer>
  slug?: string
}

function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

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

export default function CustomerForm({ mode, initialData, slug }: CustomerFormProps) {
  const router = useRouter()
  const slugManuallyEdited = useRef(false)

  const [name, setName]               = useState(initialData?.name ?? '')
  const [slugVal, setSlugVal]         = useState(initialData?.slug ?? '')
  const [subdomain, setSubdomain]     = useState(initialData?.subdomain ?? '')
  const [vpsIp, setVpsIp]             = useState(initialData?.vpsIp ?? '')
  const [vpsPlan, setVpsPlan]         = useState(initialData?.vpsPlan ?? 'CPX22')
  const [vpsLocation, setVpsLocation] = useState(initialData?.vpsLocation ?? 'nbg1')
  const [r2Bucket, setR2Bucket]       = useState(initialData?.r2Bucket ?? '')
  const [status, setStatus]           = useState(initialData?.status ?? 'setup')
  const [startDate, setStartDate]     = useState(initialData?.startDate ?? '')
  const [lineOaName, setLineOaName]   = useState(initialData?.lineOaName ?? '')
  const [liffId, setLiffId]           = useState(initialData?.liffId ?? '')
  const [notes, setNotes]             = useState(initialData?.notes ?? '')

  const [loading, setLoading]   = useState(false)
  const [errors, setErrors]     = useState<Record<string, string>>({})
  const [apiError, setApiError] = useState<string | null>(null)

  function handleNameChange(val: string) {
    setName(val)
    if (mode === 'create' && !slugManuallyEdited.current) {
      const auto = toSlug(val)
      setSlugVal(auto)
      setSubdomain(auto ? `${auto}.vibagen.com` : '')
    }
  }

  function handleSlugChange(val: string) {
    slugManuallyEdited.current = true
    setSlugVal(val)
    if (mode === 'create') {
      setSubdomain(val ? `${val}.vibagen.com` : '')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    setApiError(null)

    const body = {
      name,
      slug: slugVal,
      subdomain,
      vpsIp: vpsIp || null,
      vpsPlan: vpsPlan || 'CPX22',
      vpsLocation: vpsLocation || 'nbg1',
      r2Bucket: r2Bucket || null,
      status,
      startDate: startDate || null,
      lineOaName: lineOaName || null,
      liffId: liffId || null,
      notes: notes || null,
    }

    try {
      const url =
        mode === 'create'
          ? '/api/admin/customers'
          : `/api/admin/customers/${slug}`

      const res = await fetch(url, {
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
        router.push('/admin/customers')
      } else {
        router.push(`/admin/customers/${slug}`)
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
          padding: '24px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          border: '1px solid #e5e9f0',
        }}
      >
        {/* 2-column grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 20,
          }}
        >
          {/* Name */}
          <div style={fieldStyle}>
            <label style={labelStyle}>
              Name <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input
              style={{ ...inputStyle, borderColor: errors.name ? '#dc2626' : '#d1d5db' }}
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
              placeholder="AutoCar Care"
            />
            {errors.name && (
              <span style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>{errors.name}</span>
            )}
          </div>

          {/* Slug */}
          <div style={fieldStyle}>
            <label style={labelStyle}>
              Slug <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input
              style={{ ...inputStyle, borderColor: errors.slug ? '#dc2626' : '#d1d5db' }}
              type="text"
              value={slugVal}
              onChange={(e) => handleSlugChange(e.target.value)}
              required
              placeholder="autocar-care"
            />
            {errors.slug && (
              <span style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>{errors.slug}</span>
            )}
          </div>

          {/* Subdomain */}
          <div style={fieldStyle}>
            <label style={labelStyle}>
              Subdomain <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input
              style={{ ...inputStyle, borderColor: errors.subdomain ? '#dc2626' : '#d1d5db' }}
              type="text"
              value={subdomain}
              onChange={(e) => setSubdomain(e.target.value)}
              required
              placeholder="autocar-care.vibagen.com"
            />
            {errors.subdomain && (
              <span style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>{errors.subdomain}</span>
            )}
          </div>

          {/* VPS IP */}
          <div style={fieldStyle}>
            <label style={labelStyle}>VPS IP</label>
            <input
              style={inputStyle}
              type="text"
              value={vpsIp}
              onChange={(e) => setVpsIp(e.target.value)}
              placeholder="1.2.3.4"
            />
          </div>

          {/* VPS Plan */}
          <div style={fieldStyle}>
            <label style={labelStyle}>VPS Plan</label>
            <input
              style={inputStyle}
              type="text"
              value={vpsPlan}
              onChange={(e) => setVpsPlan(e.target.value)}
              placeholder="CPX22"
            />
          </div>

          {/* VPS Location */}
          <div style={fieldStyle}>
            <label style={labelStyle}>VPS Location</label>
            <input
              style={inputStyle}
              type="text"
              value={vpsLocation}
              onChange={(e) => setVpsLocation(e.target.value)}
              placeholder="nbg1"
            />
          </div>

          {/* R2 Bucket */}
          <div style={fieldStyle}>
            <label style={labelStyle}>R2 Bucket</label>
            <input
              style={inputStyle}
              type="text"
              value={r2Bucket}
              onChange={(e) => setR2Bucket(e.target.value)}
              placeholder="autocar-backups"
            />
          </div>

          {/* Status */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Status</label>
            <select
              style={inputStyle}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="setup">Setup</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="terminated">Terminated</option>
            </select>
          </div>

          {/* Start Date */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Start Date</label>
            <input
              style={inputStyle}
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          {/* LINE OA Name */}
          <div style={fieldStyle}>
            <label style={labelStyle}>LINE OA Name</label>
            <input
              style={inputStyle}
              type="text"
              value={lineOaName}
              onChange={(e) => setLineOaName(e.target.value)}
              placeholder="@autocar"
            />
          </div>

          {/* LIFF ID */}
          <div style={fieldStyle}>
            <label style={labelStyle}>LIFF ID</label>
            <input
              style={inputStyle}
              type="text"
              value={liffId}
              onChange={(e) => setLiffId(e.target.value)}
              placeholder="1234567890-AbCdEfGh"
            />
          </div>
        </div>

        {/* Notes — full width */}
        <div style={{ ...fieldStyle, marginTop: 20 }}>
          <label style={labelStyle}>Notes</label>
          <textarea
            style={{
              ...inputStyle,
              minHeight: 100,
              resize: 'vertical',
            }}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="หมายเหตุ..."
          />
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
          {loading ? 'กำลังบันทึก...' : mode === 'create' ? 'Add Customer' : 'Save Changes'}
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
