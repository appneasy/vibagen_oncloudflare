'use client'

import { useEffect, useState, useCallback } from 'react'

interface App {
  id: number
  customerSlug: string
  appType: string | null
  appName: string | null
  version: string | null
  deployUrl: string | null
  techStack: string | null
  status: string | null
  launchDate: string | null
  notes: string | null
  createdAt: string | null
}

interface FormData {
  appType: string
  appName: string
  version: string
  deployUrl: string
  techStack: string
  status: string
  launchDate: string
  notes: string
}

const EMPTY_FORM: FormData = {
  appType:    'pos',
  appName:    '',
  version:    '',
  deployUrl:  '',
  techStack:  '',
  status:     'development',
  launchDate: '',
  notes:      '',
}

function getTypeBadge(appType: string | null): { bg: string; color: string; label: string } {
  switch (appType) {
    case 'pos':       return { bg: '#fef3c7', color: '#92400e', label: 'POS' }
    case 'crm':       return { bg: '#dbeafe', color: '#1d4ed8', label: 'CRM' }
    case 'hr':        return { bg: '#f3e8ff', color: '#7c3aed', label: 'HR' }
    case 'inventory': return { bg: '#d1fae5', color: '#065f46', label: 'Inventory' }
    case 'liff':      return { bg: '#d1fae5', color: '#065f46', label: 'LIFF' }
    case 'website':   return { bg: '#e0e7ff', color: '#3730a3', label: 'Website' }
    case 'custom':    return { bg: '#f3f4f6', color: '#4b5563', label: 'Custom' }
    default:          return { bg: '#f3f4f6', color: '#4b5563', label: appType ?? '—' }
  }
}

function getStatusBadge(status: string | null): { bg: string; color: string; label: string } {
  switch (status) {
    case 'development': return { bg: '#dbeafe', color: '#1d4ed8', label: 'Development' }
    case 'staging':     return { bg: '#fef3c7', color: '#92400e', label: 'Staging' }
    case 'production':  return { bg: '#d1fae5', color: '#065f46', label: 'Production' }
    case 'retired':     return { bg: '#f3f4f6', color: '#4b5563', label: 'Retired' }
    default:            return { bg: '#f3f4f6', color: '#4b5563', label: status ?? '—' }
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

export default function AppSection({ customerSlug }: { customerSlug: string }) {
  const [apps, setApps] = useState<App[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState<App | null>(null)
  const [form, setForm] = useState<FormData>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const fetchApps = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/apps?customerSlug=${encodeURIComponent(customerSlug)}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json() as App[]
      setApps(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'โหลดข้อมูลไม่สำเร็จ')
    } finally {
      setLoading(false)
    }
  }, [customerSlug])

  useEffect(() => {
    fetchApps()
  }, [fetchApps])

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

  function openEdit(app: App) {
    setEditTarget(app)
    setForm({
      appType:    app.appType    ?? 'pos',
      appName:    app.appName    ?? '',
      version:    app.version    ?? '',
      deployUrl:  app.deployUrl  ?? '',
      techStack:  app.techStack  ?? '',
      status:     app.status     ?? 'development',
      launchDate: app.launchDate ?? '',
      notes:      app.notes      ?? '',
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
        appType:    form.appType    || null,
        appName:    form.appName    || null,
        version:    form.version    || null,
        deployUrl:  form.deployUrl  || null,
        techStack:  form.techStack  || null,
        status:     form.status     || null,
        launchDate: form.launchDate || null,
        notes:      form.notes      || null,
      }

      const url = editTarget
        ? `/api/admin/apps/${editTarget.id}`
        : '/api/admin/apps'
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
      await fetchApps()
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'บันทึกไม่สำเร็จ')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: number, name: string | null) {
    if (!window.confirm(`ลบ app "${name ?? id}" ใช่ไหม?`)) return
    try {
      const res = await fetch(`/api/admin/apps/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      await fetchApps()
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
          Apps
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
      ) : apps.length === 0 ? (
        <div style={{ padding: '24px 0', textAlign: 'center' }}>
          <div style={{ fontSize: 15, color: '#0d2749', fontWeight: 600, marginBottom: 4 }}>ยังไม่มี App</div>
          <div style={{ fontSize: 13, color: '#9ca3af' }}>คลิก "+ Add" เพื่อเพิ่มรายการแรก</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {apps.map((app) => {
            const typeBadge   = getTypeBadge(app.appType)
            const statusBadge = getStatusBadge(app.status)

            return (
              <div
                key={app.id}
                style={{
                  border: '1px solid #e5e9f0',
                  borderRadius: 10,
                  padding: '14px 16px',
                  background: '#fafbfc',
                }}
              >
                {/* Top row: type badge + app name + status badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                  <span
                    style={{
                      padding: '2px 10px',
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 600,
                      background: typeBadge.bg,
                      color: typeBadge.color,
                    }}
                  >
                    {typeBadge.label}
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
                    {app.appName ?? '—'}
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

                {/* Middle row: version badge + tech stack */}
                {(app.version || app.techStack) && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
                    {app.version && (
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: '#374151',
                          background: '#f0f4f8',
                          border: '1px solid #d1d5db',
                          borderRadius: 6,
                          padding: '1px 8px',
                          fontFamily: 'monospace',
                        }}
                      >
                        {app.version.startsWith('v') ? app.version : `v${app.version}`}
                      </span>
                    )}
                    {app.techStack && (
                      <span style={{ fontSize: 13, color: '#737373' }}>{app.techStack}</span>
                    )}
                  </div>
                )}

                {/* Bottom row: deploy URL + launch date + actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                  {app.deployUrl && (
                    <a
                      href={app.deployUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: 12,
                        color: '#1d4ed8',
                        fontFamily: 'monospace',
                        maxWidth: 220,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        display: 'inline-block',
                        textDecoration: 'none',
                      }}
                      title={app.deployUrl}
                    >
                      {app.deployUrl}
                    </a>
                  )}
                  {app.launchDate && (
                    <div style={{ fontSize: 12, color: '#737373' }}>
                      <span style={{ fontWeight: 600 }}>Launch:</span>{' '}
                      {app.launchDate}
                    </div>
                  )}
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
                    <button
                      onClick={() => openEdit(app)}
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
                      onClick={() => handleDelete(app.id, app.appName)}
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
              maxWidth: 560,
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
                {editTarget ? 'Edit App' : 'Add App'}
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
                {/* App Type */}
                <div>
                  <label style={labelStyle}>App Type</label>
                  <select
                    value={form.appType}
                    onChange={(e) => setForm((f) => ({ ...f, appType: e.target.value }))}
                    style={inputStyle}
                  >
                    <option value="pos">POS</option>
                    <option value="crm">CRM</option>
                    <option value="hr">HR</option>
                    <option value="inventory">Inventory</option>
                    <option value="liff">LIFF</option>
                    <option value="website">Website</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                {/* App Name */}
                <div>
                  <label style={labelStyle}>App Name *</label>
                  <input
                    type="text"
                    value={form.appName}
                    onChange={(e) => setForm((f) => ({ ...f, appName: e.target.value }))}
                    placeholder="e.g. AutoCar POS"
                    style={inputStyle}
                  />
                </div>

                {/* Version */}
                <div>
                  <label style={labelStyle}>Version</label>
                  <input
                    type="text"
                    value={form.version}
                    onChange={(e) => setForm((f) => ({ ...f, version: e.target.value }))}
                    placeholder="v1.0.0"
                    style={inputStyle}
                  />
                </div>

                {/* Deploy URL */}
                <div>
                  <label style={labelStyle}>Deploy URL</label>
                  <input
                    type="text"
                    value={form.deployUrl}
                    onChange={(e) => setForm((f) => ({ ...f, deployUrl: e.target.value }))}
                    placeholder="https://app.example.com"
                    style={inputStyle}
                  />
                </div>

                {/* Tech Stack */}
                <div>
                  <label style={labelStyle}>Tech Stack</label>
                  <input
                    type="text"
                    value={form.techStack}
                    onChange={(e) => setForm((f) => ({ ...f, techStack: e.target.value }))}
                    placeholder="Next.js + PostgreSQL"
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
                    <option value="development">Development</option>
                    <option value="staging">Staging</option>
                    <option value="production">Production</option>
                    <option value="retired">Retired</option>
                  </select>
                </div>

                {/* Launch Date */}
                <div>
                  <label style={labelStyle}>Launch Date</label>
                  <input
                    type="date"
                    value={form.launchDate}
                    onChange={(e) => setForm((f) => ({ ...f, launchDate: e.target.value }))}
                    style={inputStyle}
                  />
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
