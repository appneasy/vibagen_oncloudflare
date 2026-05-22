'use client'

import { useEffect, useState, useCallback } from 'react'

interface Subscription {
  id: number
  customerSlug: string
  provider: string | null
  serviceName: string | null
  plan: string | null
  priceThb: number | null
  startDate: string | null
  nextDueDate: string | null
  autoRenew: number | null
  status: string | null
  notes: string | null
  createdAt: string | null
}

interface FormData {
  provider: string
  serviceName: string
  plan: string
  priceThb: string
  startDate: string
  nextDueDate: string
  autoRenew: boolean
  status: string
  notes: string
}

const EMPTY_FORM: FormData = {
  provider: 'cloudflare',
  serviceName: '',
  plan: 'monthly',
  priceThb: '',
  startDate: '',
  nextDueDate: '',
  autoRenew: true,
  status: 'active',
  notes: '',
}

function formatPrice(price: number | null, plan: string | null): string {
  if (price === null) return '—'
  const formatted = price.toLocaleString('th-TH')
  if (plan === 'monthly') return `฿${formatted}/เดือน`
  if (plan === 'yearly') return `฿${formatted}/ปี`
  return `฿${formatted}`
}

function getDueDateStyle(nextDueDate: string | null): { color: string } {
  if (!nextDueDate) return { color: '#737373' }
  const diff = new Date(nextDueDate).getTime() - Date.now()
  const days = diff / (1000 * 60 * 60 * 24)
  if (days < 0) return { color: '#dc2626' }
  if (days <= 7) return { color: '#f59e0b' }
  return { color: '#737373' }
}

function getProviderBadge(provider: string | null): { bg: string; color: string; label: string } {
  switch (provider) {
    case 'cloudflare': return { bg: '#dbeafe', color: '#1d4ed8', label: 'Cloudflare' }
    case 'hetzner':    return { bg: '#fee2e2', color: '#b91c1c', label: 'Hetzner' }
    default:           return { bg: '#f3f4f6', color: '#4b5563', label: provider ?? 'Other' }
  }
}

function getStatusBadge(status: string | null): { bg: string; color: string; label: string } {
  switch (status) {
    case 'active':    return { bg: '#d1fae5', color: '#065f46', label: 'Active' }
    case 'cancelled': return { bg: '#fef3c7', color: '#92400e', label: 'Cancelled' }
    case 'expired':   return { bg: '#fee2e2', color: '#991b1b', label: 'Expired' }
    default:          return { bg: '#f3f4f6', color: '#4b5563', label: status ?? '—' }
  }
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

export default function SubscriptionSection({ customerSlug }: { customerSlug: string }) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState<Subscription | null>(null)
  const [form, setForm] = useState<FormData>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const fetchSubscriptions = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/subscriptions?customerSlug=${encodeURIComponent(customerSlug)}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json() as Subscription[]
      setSubscriptions(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'โหลดข้อมูลไม่สำเร็จ')
    } finally {
      setLoading(false)
    }
  }, [customerSlug])

  useEffect(() => {
    fetchSubscriptions()
  }, [fetchSubscriptions])

  // Close modal on Escape key
  useEffect(() => {
    if (!showModal) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [showModal])

  function openAdd() {
    setEditTarget(null)
    setForm(EMPTY_FORM)
    setSaveError(null)
    setShowModal(true)
  }

  function openEdit(sub: Subscription) {
    setEditTarget(sub)
    setForm({
      provider:    sub.provider    ?? 'cloudflare',
      serviceName: sub.serviceName ?? '',
      plan:        sub.plan        ?? 'monthly',
      priceThb:    sub.priceThb !== null ? String(sub.priceThb) : '',
      startDate:   sub.startDate   ?? '',
      nextDueDate: sub.nextDueDate ?? '',
      autoRenew:   sub.autoRenew === 1,
      status:      sub.status      ?? 'active',
      notes:       sub.notes       ?? '',
    })
    setSaveError(null)
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false)
    setEditTarget(null)
    setSaveError(null)
  }

  async function handleSave() {
    setSaving(true)
    setSaveError(null)
    try {
      const body = {
        customerSlug,
        provider:    form.provider    || null,
        serviceName: form.serviceName || null,
        plan:        form.plan        || null,
        priceThb:    form.priceThb !== '' ? Number(form.priceThb) : null,
        startDate:   form.startDate   || null,
        nextDueDate: form.nextDueDate || null,
        autoRenew:   form.autoRenew ? 1 : 0,
        status:      form.status      || null,
        notes:       form.notes       || null,
      }

      const url = editTarget
        ? `/api/admin/subscriptions/${editTarget.id}`
        : '/api/admin/subscriptions'
      const method = editTarget ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || `HTTP ${res.status}`)
      }
      closeModal()
      await fetchSubscriptions()
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'บันทึกไม่สำเร็จ')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: number, name: string | null) {
    if (!window.confirm(`ลบ subscription "${name ?? id}" ใช่ไหม?`)) return
    try {
      const res = await fetch(`/api/admin/subscriptions/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      await fetchSubscriptions()
    } catch (e) {
      alert(e instanceof Error ? e.message : 'ลบไม่สำเร็จ')
    }
  }

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        padding: '20px 24px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        border: '1px solid #e5e9f0',
      }}
    >
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2
          style={{
            fontFamily: 'var(--font-prompt)',
            fontWeight: 700,
            fontSize: 18,
            color: '#0d2749',
            margin: 0,
          }}
        >
          Subscriptions
        </h2>
        <button
          onClick={openAdd}
          style={{
            background: '#ff6c01',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '7px 16px',
            fontWeight: 600,
            fontSize: 13,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          + Add
        </button>
      </div>

      {/* ── Body ── */}
      {loading ? (
        <div style={{ padding: '16px 0', color: '#737373', fontSize: 14 }}>กำลังโหลด...</div>
      ) : error ? (
        <div style={{ padding: '16px 0', color: '#dc2626', fontSize: 14 }}>{error}</div>
      ) : subscriptions.length === 0 ? (
        <div style={{ padding: '24px 0', textAlign: 'center' }}>
          <div style={{ fontSize: 15, color: '#0d2749', fontWeight: 600, marginBottom: 4 }}>ยังไม่มี Subscription</div>
          <div style={{ fontSize: 13, color: '#9ca3af' }}>คลิก "+ Add" เพื่อเพิ่มรายการแรก</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {subscriptions.map((sub) => {
            const providerBadge = getProviderBadge(sub.provider)
            const statusBadge   = getStatusBadge(sub.status)
            const dueDateStyle  = getDueDateStyle(sub.nextDueDate)

            return (
              <div
                key={sub.id}
                style={{
                  border: '1px solid #e5e9f0',
                  borderRadius: 10,
                  padding: '14px 16px',
                  background: '#fafbfc',
                }}
              >
                {/* Top row: provider badge + service name + status */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                  <span
                    style={{
                      padding: '2px 10px',
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 600,
                      background: providerBadge.bg,
                      color: providerBadge.color,
                    }}
                  >
                    {providerBadge.label}
                  </span>
                  <span
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: '#0d2749',
                      fontFamily: 'var(--font-prompt)',
                      flex: 1,
                      minWidth: 120,
                    }}
                  >
                    {sub.serviceName ?? '—'}
                  </span>
                  <span
                    style={{
                      padding: '2px 10px',
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 600,
                      background: statusBadge.bg,
                      color: statusBadge.color,
                    }}
                  >
                    {statusBadge.label}
                  </span>
                </div>

                {/* Middle row: plan + price */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
                  {sub.plan && (
                    <span style={{ fontSize: 12, color: '#737373', textTransform: 'capitalize' }}>
                      {sub.plan === 'monthly' ? 'Monthly' : sub.plan === 'yearly' ? 'Yearly' : 'One-time'}
                    </span>
                  )}
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#0d2749' }}>
                    {formatPrice(sub.priceThb, sub.plan)}
                  </span>
                </div>

                {/* Bottom row: dates + auto-renew + actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                  <div style={{ fontSize: 12, color: '#737373' }}>
                    <span style={{ fontWeight: 600 }}>เริ่ม:</span>{' '}
                    {sub.startDate ?? '—'}
                  </div>
                  <div style={{ fontSize: 12, ...dueDateStyle }}>
                    <span style={{ fontWeight: 600 }}>ครบกำหนด:</span>{' '}
                    {sub.nextDueDate ?? '—'}
                  </div>
                  <div style={{ fontSize: 12, color: '#737373' }}>
                    {sub.autoRenew === 1 ? 'Auto-renew' : 'Manual'}
                  </div>
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
                    <button
                      onClick={() => openEdit(sub)}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        fontSize: 13,
                        fontWeight: 600,
                        color: '#ff6c01',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(sub.id, sub.serviceName)}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        fontSize: 13,
                        fontWeight: 600,
                        color: '#dc2626',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Modal ── */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal() }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 14,
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
              width: '100%',
              maxWidth: 480,
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            {/* Modal header */}
            <div
              style={{
                padding: '18px 24px 16px',
                borderBottom: '1px solid #e5e9f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <h3
                style={{
                  fontFamily: 'var(--font-prompt)',
                  fontWeight: 700,
                  fontSize: 17,
                  color: '#0d2749',
                  margin: 0,
                }}
              >
                {editTarget ? 'Edit Subscription' : 'Add Subscription'}
              </h3>
              <button
                onClick={closeModal}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 20,
                  cursor: 'pointer',
                  color: '#9ca3af',
                  lineHeight: 1,
                  padding: 0,
                }}
              >
                ×
              </button>
            </div>

            {/* Modal body */}
            <div style={{ padding: '20px 24px' }}>
              {saveError && (
                <div
                  style={{
                    background: '#fee2e2',
                    color: '#991b1b',
                    borderRadius: 8,
                    padding: '10px 14px',
                    fontSize: 13,
                    marginBottom: 16,
                  }}
                >
                  {saveError}
                </div>
              )}

              {/* Form grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: 14,
                }}
              >
                {/* Provider */}
                <div>
                  <label style={labelStyle}>Provider</label>
                  <select
                    value={form.provider}
                    onChange={(e) => setForm((f) => ({ ...f, provider: e.target.value }))}
                    style={inputStyle}
                  >
                    <option value="cloudflare">Cloudflare</option>
                    <option value="hetzner">Hetzner</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Service Name */}
                <div>
                  <label style={labelStyle}>Service Name</label>
                  <input
                    type="text"
                    value={form.serviceName}
                    onChange={(e) => setForm((f) => ({ ...f, serviceName: e.target.value }))}
                    placeholder="e.g. Workers, VPS-CX22"
                    style={inputStyle}
                  />
                </div>

                {/* Plan */}
                <div>
                  <label style={labelStyle}>Plan</label>
                  <select
                    value={form.plan}
                    onChange={(e) => setForm((f) => ({ ...f, plan: e.target.value }))}
                    style={inputStyle}
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                    <option value="one-time">One-time</option>
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label style={labelStyle}>Price (THB)</label>
                  <input
                    type="number"
                    value={form.priceThb}
                    onChange={(e) => setForm((f) => ({ ...f, priceThb: e.target.value }))}
                    placeholder="0"
                    min="0"
                    style={inputStyle}
                  />
                </div>

                {/* Start Date */}
                <div>
                  <label style={labelStyle}>Start Date</label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                    style={inputStyle}
                  />
                </div>

                {/* Next Due Date */}
                <div>
                  <label style={labelStyle}>Next Due Date</label>
                  <input
                    type="date"
                    value={form.nextDueDate}
                    onChange={(e) => setForm((f) => ({ ...f, nextDueDate: e.target.value }))}
                    style={inputStyle}
                  />
                </div>

                {/* Status */}
                <div>
                  <label style={labelStyle}>Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                    style={inputStyle}
                  >
                    <option value="active">Active</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>

                {/* Auto Renew */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 20 }}>
                  <input
                    type="checkbox"
                    id="autoRenew"
                    checked={form.autoRenew}
                    onChange={(e) => setForm((f) => ({ ...f, autoRenew: e.target.checked }))}
                    style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#ff6c01' }}
                  />
                  <label htmlFor="autoRenew" style={{ ...labelStyle, marginBottom: 0, cursor: 'pointer', fontWeight: 500 }}>
                    Auto Renew
                  </label>
                </div>
              </div>

              {/* Notes — full width */}
              <div style={{ marginTop: 14 }}>
                <label style={labelStyle}>Notes</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  placeholder="หมายเหตุเพิ่มเติม..."
                  rows={3}
                  style={{
                    ...inputStyle,
                    resize: 'vertical',
                    lineHeight: 1.6,
                  }}
                />
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
                <button
                  onClick={closeModal}
                  disabled={saving}
                  style={{
                    background: 'transparent',
                    color: '#374151',
                    border: '1px solid #d1d5db',
                    borderRadius: 8,
                    padding: '9px 20px',
                    fontWeight: 500,
                    fontSize: 14,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    background: saving ? '#f97316' : '#ff6c01',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '9px 24px',
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: saving ? 'not-allowed' : 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  {saving ? 'กำลังบันทึก...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
