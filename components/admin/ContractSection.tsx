'use client'

import { useEffect, useState, useCallback, useRef } from 'react'

interface Contract {
  id: number
  customerSlug: string
  title: string | null
  type: string | null
  r2Key: string | null
  fileSize: number | null
  status: string | null
  signedDate: string | null
  expiryDate: string | null
  notes: string | null
  createdAt: string | null
}

interface ContractFile {
  id: number
  contractId: number
  fileName: string
  r2Key: string
  fileSize: number
  fileType: string
  label: string | null
  createdAt: string | null
}

interface FormData {
  title: string
  type: string
  r2Key: string
  fileSize: string
  status: string
  signedDate: string
  expiryDate: string
  notes: string
}

const EMPTY_FORM: FormData = {
  title: '',
  type: 'contract',
  r2Key: '',
  fileSize: '',
  status: 'draft',
  signedDate: '',
  expiryDate: '',
  notes: '',
}

function formatFileSize(bytes: number | null): string {
  if (bytes === null || bytes === 0) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getTypeBadge(type: string | null): { bg: string; color: string; label: string } {
  switch (type) {
    case 'contract':    return { bg: '#dbeafe', color: '#1d4ed8', label: 'Contract' }
    case 'quotation':   return { bg: '#fef3c7', color: '#92400e', label: 'Quotation' }
    case 'invoice':     return { bg: '#d1fae5', color: '#065f46', label: 'Invoice' }
    case 'requirement': return { bg: '#f3e8ff', color: '#7c3aed', label: 'Requirement' }
    default:            return { bg: '#f3f4f6', color: '#4b5563', label: type ?? 'Other' }
  }
}

function getStatusBadge(status: string | null): { bg: string; color: string; label: string } {
  switch (status) {
    case 'draft':   return { bg: '#f3f4f6', color: '#4b5563', label: 'Draft' }
    case 'signed':  return { bg: '#d1fae5', color: '#065f46', label: 'Signed' }
    case 'expired': return { bg: '#fee2e2', color: '#991b1b', label: 'Expired' }
    default:        return { bg: '#f3f4f6', color: '#4b5563', label: status ?? '—' }
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

function compressImage(file: File, quality: number = 0.8): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')
      if (!ctx) { reject(new Error('Canvas not supported')); return }
      ctx.drawImage(img, 0, 0)
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob)
          else reject(new Error('Compression failed'))
        },
        'image/jpeg',
        quality,
      )
      URL.revokeObjectURL(img.src)
    }
    img.onerror = () => { URL.revokeObjectURL(img.src); reject(new Error('Invalid image')) }
    img.src = URL.createObjectURL(file)
  })
}

function isImageFile(type: string): boolean {
  return type.startsWith('image/')
}

function isPdfFile(type: string): boolean {
  return type === 'application/pdf'
}

export default function ContractSection({ customerSlug }: { customerSlug: string }) {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState<Contract | null>(null)
  const [form, setForm] = useState<FormData>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  // File management state
  const [expandedFiles, setExpandedFiles] = useState<number | null>(null)
  const [files, setFiles] = useState<ContractFile[]>([])
  const [filesLoading, setFilesLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadLabel, setUploadLabel] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchContracts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/contracts?customerSlug=${encodeURIComponent(customerSlug)}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json() as Contract[]
      setContracts(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'โหลดข้อมูลไม่สำเร็จ')
    } finally {
      setLoading(false)
    }
  }, [customerSlug])

  useEffect(() => {
    fetchContracts()
  }, [fetchContracts])

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

  function openEdit(contract: Contract) {
    setEditTarget(contract)
    setForm({
      title:      contract.title      ?? '',
      type:       contract.type       ?? 'contract',
      r2Key:      contract.r2Key      ?? '',
      fileSize:   contract.fileSize !== null ? String(contract.fileSize) : '',
      status:     contract.status     ?? 'draft',
      signedDate: contract.signedDate ?? '',
      expiryDate: contract.expiryDate ?? '',
      notes:      contract.notes      ?? '',
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
        title:      form.title      || null,
        type:       form.type       || 'contract',
        r2Key:      form.r2Key      || null,
        fileSize:   form.fileSize !== '' ? Number(form.fileSize) : null,
        status:     form.status     || null,
        signedDate: form.signedDate || null,
        expiryDate: form.expiryDate || null,
        notes:      form.notes      || null,
      }

      const url = editTarget
        ? `/api/admin/contracts/${editTarget.id}`
        : '/api/admin/contracts'
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
      await fetchContracts()
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'บันทึกไม่สำเร็จ')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: number, title: string | null) {
    if (!window.confirm(`ลบ contract "${title ?? id}" ใช่ไหม?`)) return
    try {
      const res = await fetch(`/api/admin/contracts/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      await fetchContracts()
    } catch (e) {
      alert(e instanceof Error ? e.message : 'ลบไม่สำเร็จ')
    }
  }

  async function fetchFiles(contractId: number) {
    setFilesLoading(true)
    try {
      const res = await fetch(`/api/admin/contracts/${contractId}/files`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json() as ContractFile[]
      setFiles(data)
    } catch {
      setFiles([])
    } finally {
      setFilesLoading(false)
    }
  }

  function toggleFiles(contractId: number) {
    if (expandedFiles === contractId) {
      setExpandedFiles(null)
      setFiles([])
    } else {
      setExpandedFiles(contractId)
      fetchFiles(contractId)
    }
  }

  async function handleFileUpload(contractId: number, fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return
    setUploading(true)
    setUploadError(null)

    for (const file of Array.from(fileList)) {
      try {
        // Validate PDF size
        if (isPdfFile(file.type) && file.size > 20 * 1024 * 1024) {
          setUploadError(`"${file.name}" เกิน 20MB`)
          continue
        }

        let uploadFile: File | Blob = file
        let uploadName = file.name

        // Compress images to 80% quality
        if (isImageFile(file.type)) {
          try {
            const compressed = await compressImage(file, 0.8)
            uploadFile = compressed
            // Change extension to .jpg if compressed
            uploadName = file.name.replace(/\.[^.]+$/, '.jpg')
          } catch {
            // If compression fails, upload original
            uploadFile = file
          }
        }

        const formData = new FormData()
        formData.append('file', uploadFile, uploadName)
        if (uploadLabel.trim()) {
          formData.append('label', uploadLabel.trim())
        }

        const res = await fetch(`/api/admin/contracts/${contractId}/files`, {
          method: 'POST',
          body: formData,
        })

        if (!res.ok) {
          const data = await res.json() as { error?: string }
          throw new Error(data.error || `HTTP ${res.status}`)
        }
      } catch (e) {
        setUploadError(e instanceof Error ? e.message : 'อัปโหลดไม่สำเร็จ')
      }
    }

    setUploadLabel('')
    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
    await fetchFiles(contractId)
  }

  async function handleDeleteFile(fileId: number, fileName: string, contractId: number) {
    if (!window.confirm(`ลบไฟล์ "${fileName}" ใช่ไหม?`)) return
    try {
      const res = await fetch(`/api/admin/contracts/files/${fileId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      await fetchFiles(contractId)
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
          Contracts
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
      ) : contracts.length === 0 ? (
        <div style={{ padding: '24px 0', textAlign: 'center' }}>
          <div style={{ fontSize: 15, color: '#0d2749', fontWeight: 600, marginBottom: 4 }}>ยังไม่มี Contract</div>
          <div style={{ fontSize: 13, color: '#9ca3af' }}>คลิก &quot;+ Add&quot; เพื่อเพิ่มรายการแรก</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {contracts.map((contract) => {
            const typeBadge   = getTypeBadge(contract.type)
            const statusBadge = getStatusBadge(contract.status)

            return (
              <div
                key={contract.id}
                style={{
                  border: '1px solid #e5e9f0',
                  borderRadius: 10,
                  padding: '14px 16px',
                  background: '#fafbfc',
                }}
              >
                {/* Top row: type badge + title + status badge */}
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
                    {contract.title ?? '—'}
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

                {/* Middle row: R2 key + file size */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8, flexWrap: 'wrap' }}>
                  {contract.r2Key && (
                    <span
                      style={{
                        fontSize: 12,
                        color: '#737373',
                        fontFamily: 'monospace',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: 280,
                      }}
                    >
                      {contract.r2Key}
                    </span>
                  )}
                  <span style={{ fontSize: 12, color: '#737373' }}>
                    {formatFileSize(contract.fileSize)}
                  </span>
                </div>

                {/* Bottom row: signed date + expiry date + actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                  <div style={{ fontSize: 12, color: '#737373' }}>
                    <span style={{ fontWeight: 600 }}>Signed:</span>{' '}
                    {contract.signedDate ?? '—'}
                  </div>
                  <div style={{ fontSize: 12, color: '#737373' }}>
                    <span style={{ fontWeight: 600 }}>Expires:</span>{' '}
                    {contract.expiryDate ?? '—'}
                  </div>
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
                    <button
                      onClick={() => openEdit(contract)}
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
                      onClick={() => handleDelete(contract.id, contract.title)}
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

                {/* Files toggle button */}
                <div style={{ marginTop: 10, borderTop: '1px solid #e5e9f0', paddingTop: 10 }}>
                  <button
                    onClick={() => toggleFiles(contract.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      fontSize: 13,
                      fontWeight: 600,
                      color: expandedFiles === contract.id ? '#0d2749' : '#737373',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <span style={{ fontSize: 11 }}>{expandedFiles === contract.id ? '▼' : '▶'}</span>
                    Files
                  </button>
                </div>

                {/* Expanded files section */}
                {expandedFiles === contract.id && (
                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #f0f4f8' }}>
                    {/* File list */}
                    {filesLoading ? (
                      <div style={{ fontSize: 13, color: '#737373', padding: '8px 0' }}>กำลังโหลด...</div>
                    ) : files.length === 0 ? (
                      <div style={{ fontSize: 13, color: '#9ca3af', padding: '8px 0' }}>ยังไม่มีไฟล์แนบ</div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                        {files.map((f) => (
                          <div
                            key={f.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 10,
                              background: '#f8fafc',
                              borderRadius: 8,
                              padding: '8px 12px',
                              border: '1px solid #e5e9f0',
                              flexWrap: 'wrap',
                            }}
                          >
                            {/* File icon based on type */}
                            <span style={{ fontSize: 18, flexShrink: 0 }}>
                              {f.fileType.startsWith('image/') ? '🖼' : f.fileType === 'application/pdf' ? '📄' : '📎'}
                            </span>
                            {/* File info */}
                            <div style={{ flex: 1, minWidth: 120 }}>
                              <a
                                href={`/api/admin/contracts/files/${f.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ fontSize: 13, color: '#0d2749', fontWeight: 500, textDecoration: 'none' }}
                              >
                                {f.fileName}
                              </a>
                              <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>
                                {formatFileSize(f.fileSize)}
                                {f.label && (
                                  <span style={{ marginLeft: 8, color: '#737373', fontStyle: 'italic' }}>
                                    — {f.label}
                                  </span>
                                )}
                              </div>
                            </div>
                            {/* Delete button */}
                            <button
                              onClick={() => handleDeleteFile(f.id, f.fileName, contract.id)}
                              style={{
                                background: 'none',
                                border: 'none',
                                padding: '2px 6px',
                                fontSize: 13,
                                fontWeight: 600,
                                color: '#dc2626',
                                cursor: 'pointer',
                                fontFamily: 'inherit',
                                flexShrink: 0,
                              }}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Upload area */}
                    <div style={{
                      border: '2px dashed #d1d5db',
                      borderRadius: 8,
                      padding: '12px 14px',
                      background: '#fafbfc',
                    }}>
                      {uploadError && (
                        <div style={{ fontSize: 12, color: '#dc2626', marginBottom: 8 }}>{uploadError}</div>
                      )}
                      {/* Label input */}
                      <div style={{ marginBottom: 8 }}>
                        <input
                          type="text"
                          value={uploadLabel}
                          onChange={(e) => setUploadLabel(e.target.value)}
                          placeholder="กำกับเอกสาร เช่น สัญญาหน้า 1-5, ใบเสนอราคา..."
                          style={{
                            ...inputStyle,
                            fontSize: 13,
                            padding: '6px 10px',
                          }}
                        />
                      </div>
                      {/* File input + upload button */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                          onChange={(e) => handleFileUpload(contract.id, e.target.files)}
                          disabled={uploading}
                          style={{ fontSize: 13, flex: 1, minWidth: 0 }}
                        />
                        {uploading && (
                          <span style={{ fontSize: 12, color: '#ff6c01', fontWeight: 600 }}>กำลังอัปโหลด...</span>
                        )}
                      </div>
                      <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 6 }}>
                        รูปภาพจะถูกบีบอัดอัตโนมัติ (80% quality) · PDF ไม่เกิน 20MB
                      </div>
                    </div>
                  </div>
                )}
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
                {editTarget ? 'Edit Contract' : 'Add Contract'}
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
                {/* Title */}
                <div>
                  <label style={labelStyle}>Title <span style={{ color: '#dc2626' }}>*</span></label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="สัญญาพัฒนาระบบ POS"
                    style={inputStyle}
                  />
                </div>

                {/* Type */}
                <div>
                  <label style={labelStyle}>Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                    style={inputStyle}
                  >
                    <option value="contract">Contract</option>
                    <option value="quotation">Quotation</option>
                    <option value="invoice">Invoice</option>
                    <option value="requirement">Requirement</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* R2 Key */}
                <div>
                  <label style={labelStyle}>R2 Key</label>
                  <input
                    type="text"
                    value={form.r2Key}
                    onChange={(e) => setForm((f) => ({ ...f, r2Key: e.target.value }))}
                    placeholder="contracts/filename.pdf"
                    style={inputStyle}
                  />
                </div>

                {/* File Size */}
                <div>
                  <label style={labelStyle}>File Size (bytes)</label>
                  <input
                    type="number"
                    value={form.fileSize}
                    onChange={(e) => setForm((f) => ({ ...f, fileSize: e.target.value }))}
                    placeholder="0"
                    min="0"
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
                    <option value="draft">Draft</option>
                    <option value="signed">Signed</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>

                {/* Signed Date */}
                <div>
                  <label style={labelStyle}>Signed Date</label>
                  <input
                    type="date"
                    value={form.signedDate}
                    onChange={(e) => setForm((f) => ({ ...f, signedDate: e.target.value }))}
                    style={inputStyle}
                  />
                </div>

                {/* Expiry Date */}
                <div>
                  <label style={labelStyle}>Expiry Date</label>
                  <input
                    type="date"
                    value={form.expiryDate}
                    onChange={(e) => setForm((f) => ({ ...f, expiryDate: e.target.value }))}
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
