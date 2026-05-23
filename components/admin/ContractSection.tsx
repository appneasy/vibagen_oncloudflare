'use client'

import { Fragment, useEffect, useState, useCallback, useRef } from 'react'

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
  const [files, setFiles] = useState<ContractFile[]>([])
  const [filesLoading, setFilesLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadLabel, setUploadLabel] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Expand state — single row expanded at a time
  const [expandedId, setExpandedId] = useState<number | null>(null)

  // Preview modal
  const [previewFile, setPreviewFile] = useState<ContractFile | null>(null)

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

  function toggleExpand(contractId: number) {
    if (expandedId === contractId) {
      setExpandedId(null)
      setFiles([])
    } else {
      setExpandedId(contractId)
      fetchFiles(contractId)
    }
  }

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
    setUploadError(null)
    setUploadLabel('')
  }

  async function handleSave() {
    setSaving(true)
    setSaveError(null)
    try {
      const body = {
        customerSlug,
        title:      form.title      || null,
        type:       form.type       || 'contract',
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
      if (expandedId === id) {
        setExpandedId(null)
        setFiles([])
      }
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
            uploadName = file.name.replace(/\.[^.]+$/, '.jpg')
          } catch {
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

  // Shared expanded content for both desktop and mobile layouts
  function renderExpandedContent(contract: Contract) {
    return (
      <div style={{ padding: '14px 16px', background: '#f8fafc' }}>
        {/* Notes */}
        {contract.notes && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#737373', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
              Notes
            </div>
            <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>
              {contract.notes}
            </div>
          </div>
        )}

        {/* Attached Files */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#737373', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
            Attached Files
          </div>

          {filesLoading ? (
            <div style={{ fontSize: 13, color: '#737373', padding: '4px 0' }}>กำลังโหลด...</div>
          ) : files.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
              {files.map((f) => (
                <div
                  key={f.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    background: '#fff',
                    borderRadius: 8,
                    padding: '8px 12px',
                    border: '1px solid #e5e9f0',
                    flexWrap: 'wrap',
                  }}
                >
                  <span style={{ fontSize: 18, flexShrink: 0 }}>
                    {f.fileType.startsWith('image/') ? '\u{1F5BC}' : f.fileType === 'application/pdf' ? '\u{1F4C4}' : '\u{1F4CE}'}
                  </span>
                  <div style={{ flex: 1, minWidth: 100 }}>
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
                  {/* Eye/Preview icon — only for images and PDFs */}
                  {(isImageFile(f.fileType) || isPdfFile(f.fileType)) && (
                    <button
                      onClick={() => setPreviewFile(f)}
                      title="Preview"
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: '2px 6px',
                        color: '#3b82f6',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteFile(f.id, f.fileName, contract.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: '2px 6px',
                      fontSize: 16,
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
          ) : (
            <div style={{ fontSize: 13, color: '#9ca3af', marginBottom: 12 }}>ยังไม่มีไฟล์แนบ</div>
          )}

          {/* Upload area */}
          <div style={{
            border: '2px dashed #d1d5db',
            borderRadius: 8,
            padding: '12px 14px',
            background: '#fff',
          }}>
            {uploadError && (
              <div style={{ fontSize: 12, color: '#dc2626', marginBottom: 8 }}>{uploadError}</div>
            )}
            <div style={{ marginBottom: 8 }}>
              <input
                type="text"
                value={uploadLabel}
                onChange={(e) => setUploadLabel(e.target.value)}
                placeholder="กำกับเอกสาร เช่น สัญญาหน้า 1-5, ใบเสนอราคา..."
                style={{ ...inputStyle, fontSize: 13, padding: '6px 10px' }}
              />
            </div>
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
      </div>
    )
  }

  const chevronRight = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 18l6-6-6-6" />
    </svg>
  )
  const chevronDown = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9l6 6 6-6" />
    </svg>
  )

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
      <style>{`
        .contract-table-desktop { display: block; }
        .contract-card-mobile { display: none; }
        .contract-tr-data:hover td { background: #f8fafc; }
        @media (max-width: 767px) {
          .contract-table-desktop { display: none !important; }
          .contract-card-mobile { display: block !important; }
        }
      `}</style>

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
        <>
          {/* ── Desktop Table (≥768px) ── */}
          <div className="contract-table-desktop">
            <table style={{ width: '100%', borderCollapse: 'collapse', borderRadius: 8, overflow: 'hidden' }}>
              <thead>
                <tr>
                  <th style={{ background: '#0d2749', color: '#fff', padding: '10px 12px', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', textAlign: 'left', width: 32 }}></th>
                  <th style={{ background: '#0d2749', color: '#fff', padding: '10px 12px', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', textAlign: 'left' }}>Type</th>
                  <th style={{ background: '#0d2749', color: '#fff', padding: '10px 12px', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', textAlign: 'left' }}>Title</th>
                  <th style={{ background: '#0d2749', color: '#fff', padding: '10px 12px', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', textAlign: 'left' }}>Status</th>
                  <th style={{ background: '#0d2749', color: '#fff', padding: '10px 12px', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', textAlign: 'left' }}>Signed</th>
                  <th style={{ background: '#0d2749', color: '#fff', padding: '10px 12px', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', textAlign: 'left' }}>Expires</th>
                  <th style={{ background: '#0d2749', color: '#fff', padding: '10px 12px', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {contracts.map((contract) => {
                  const typeBadge   = getTypeBadge(contract.type)
                  const statusBadge = getStatusBadge(contract.status)
                  const isExpanded  = expandedId === contract.id

                  return (
                    <Fragment key={contract.id}>
                      <tr
                        className="contract-tr-data"
                        style={{ cursor: 'pointer' }}
                      >
                        {/* Chevron toggle */}
                        <td
                          style={{ padding: '10px 12px', fontSize: 13, color: '#374151', borderBottom: isExpanded ? 'none' : '1px solid #e5e9f0', verticalAlign: 'middle' }}
                          onClick={() => toggleExpand(contract.id)}
                        >
                          <span style={{ color: '#6b7280', display: 'flex', alignItems: 'center' }}>
                            {isExpanded ? chevronDown : chevronRight}
                          </span>
                        </td>
                        {/* Type */}
                        <td
                          style={{ padding: '10px 12px', fontSize: 13, color: '#374151', borderBottom: isExpanded ? 'none' : '1px solid #e5e9f0', verticalAlign: 'middle' }}
                          onClick={() => toggleExpand(contract.id)}
                        >
                          <span style={{ padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: typeBadge.bg, color: typeBadge.color, whiteSpace: 'nowrap' }}>
                            {typeBadge.label}
                          </span>
                        </td>
                        {/* Title */}
                        <td
                          style={{ padding: '10px 12px', fontSize: 13, color: '#0d2749', borderBottom: isExpanded ? 'none' : '1px solid #e5e9f0', verticalAlign: 'middle', fontWeight: 600 }}
                          onClick={() => toggleExpand(contract.id)}
                        >
                          {contract.title ?? '—'}
                        </td>
                        {/* Status */}
                        <td
                          style={{ padding: '10px 12px', fontSize: 13, color: '#374151', borderBottom: isExpanded ? 'none' : '1px solid #e5e9f0', verticalAlign: 'middle' }}
                          onClick={() => toggleExpand(contract.id)}
                        >
                          <span style={{ padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: statusBadge.bg, color: statusBadge.color, whiteSpace: 'nowrap' }}>
                            {statusBadge.label}
                          </span>
                        </td>
                        {/* Signed */}
                        <td
                          style={{ padding: '10px 12px', fontSize: 13, color: '#374151', borderBottom: isExpanded ? 'none' : '1px solid #e5e9f0', verticalAlign: 'middle' }}
                          onClick={() => toggleExpand(contract.id)}
                        >
                          {contract.signedDate ?? '—'}
                        </td>
                        {/* Expires */}
                        <td
                          style={{ padding: '10px 12px', fontSize: 13, color: '#374151', borderBottom: isExpanded ? 'none' : '1px solid #e5e9f0', verticalAlign: 'middle' }}
                          onClick={() => toggleExpand(contract.id)}
                        >
                          {contract.expiryDate ?? '—'}
                        </td>
                        {/* Actions */}
                        <td style={{ padding: '10px 12px', fontSize: 13, color: '#374151', borderBottom: isExpanded ? 'none' : '1px solid #e5e9f0', verticalAlign: 'middle', textAlign: 'right' }}>
                          <button
                            onClick={(e) => { e.stopPropagation(); openEdit(contract) }}
                            style={{ background: 'none', border: 'none', padding: '0 6px', fontSize: 13, fontWeight: 600, color: '#ff6c01', cursor: 'pointer', fontFamily: 'inherit' }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDelete(contract.id, contract.title) }}
                            style={{ background: 'none', border: 'none', padding: '0 6px', fontSize: 13, fontWeight: 600, color: '#dc2626', cursor: 'pointer', fontFamily: 'inherit' }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>

                      {/* Expanded row */}
                      {isExpanded && (
                        <tr>
                          <td
                            colSpan={7}
                            style={{ padding: 0, borderBottom: '1px solid #e5e9f0' }}
                          >
                            {renderExpandedContent(contract)}
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* ── Mobile Cards (<768px) ── */}
          <div className="contract-card-mobile" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {contracts.map((contract) => {
              const typeBadge   = getTypeBadge(contract.type)
              const statusBadge = getStatusBadge(contract.status)
              const isExpanded  = expandedId === contract.id

              return (
                <div
                  key={contract.id}
                  style={{
                    border: '1px solid #e5e9f0',
                    borderRadius: 10,
                    background: '#fafbfc',
                    overflow: 'hidden',
                  }}
                >
                  {/* Card header: type + title + status */}
                  <div style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                      <span style={{ padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: typeBadge.bg, color: typeBadge.color }}>
                        {typeBadge.label}
                      </span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#0d2749', fontFamily: 'var(--font-prompt)', flex: 1, minWidth: 100 }}>
                        {contract.title ?? '—'}
                      </span>
                      <span style={{ padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: statusBadge.bg, color: statusBadge.color }}>
                        {statusBadge.label}
                      </span>
                    </div>

                    {/* Dates */}
                    <div style={{ display: 'flex', gap: 16, marginBottom: 10, flexWrap: 'wrap' }}>
                      <div style={{ fontSize: 12, color: '#737373' }}>
                        <span style={{ fontWeight: 600 }}>Signed:</span> {contract.signedDate ?? '—'}
                      </div>
                      <div style={{ fontSize: 12, color: '#737373' }}>
                        <span style={{ fontWeight: 600 }}>Expires:</span> {contract.expiryDate ?? '—'}
                      </div>
                    </div>

                    {/* Actions row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button
                        onClick={() => openEdit(contract)}
                        style={{ background: 'none', border: 'none', padding: 0, fontSize: 13, fontWeight: 600, color: '#ff6c01', cursor: 'pointer', fontFamily: 'inherit' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(contract.id, contract.title)}
                        style={{ background: 'none', border: 'none', padding: 0, fontSize: 13, fontWeight: 600, color: '#dc2626', cursor: 'pointer', fontFamily: 'inherit' }}
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => toggleExpand(contract.id)}
                        style={{
                          marginLeft: 'auto',
                          background: 'none',
                          border: '1px solid #e5e9f0',
                          borderRadius: 6,
                          padding: '4px 8px',
                          cursor: 'pointer',
                          color: '#6b7280',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          fontSize: 12,
                        }}
                      >
                        {isExpanded ? chevronDown : chevronRight}
                        {isExpanded ? 'Close' : 'Files'}
                      </button>
                    </div>
                  </div>

                  {/* Expanded area */}
                  {isExpanded && (
                    <div style={{ borderTop: '1px solid #e5e9f0' }}>
                      {renderExpandedContent(contract)}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* ── Modal (form fields only, no file section) ── */}
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

      {/* ── Preview Modal ── */}
      {previewFile && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setPreviewFile(null) }}
        >
          <div style={{
            position: 'relative',
            background: '#fff',
            borderRadius: 12,
            overflow: 'hidden',
            maxWidth: '90vw',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          }}>
            {/* Header bar */}
            <div style={{
              padding: '10px 16px',
              borderBottom: '1px solid #e5e9f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#f8fafc',
              flexShrink: 0,
            }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#0d2749' }}>
                {previewFile.fileName}
                {previewFile.label && (
                  <span style={{ fontWeight: 400, color: '#737373', marginLeft: 8 }}>— {previewFile.label}</span>
                )}
              </span>
              <button
                onClick={() => setPreviewFile(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 22,
                  cursor: 'pointer',
                  color: '#9ca3af',
                  lineHeight: 1,
                  padding: '0 4px',
                }}
              >
                ×
              </button>
            </div>
            {/* Content */}
            <div style={{ overflow: 'auto', flex: 1 }}>
              {isImageFile(previewFile.fileType) ? (
                <img
                  src={`/api/admin/contracts/files/${previewFile.id}`}
                  alt={previewFile.fileName}
                  style={{ maxWidth: '100%', maxHeight: '80vh', display: 'block', margin: '0 auto' }}
                />
              ) : isPdfFile(previewFile.fileType) ? (
                <iframe
                  src={`/api/admin/contracts/files/${previewFile.id}`}
                  style={{ width: '80vw', maxWidth: 900, height: '80vh', border: 'none' }}
                  title={previewFile.fileName}
                />
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
