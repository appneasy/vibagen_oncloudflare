'use client'

import { useState } from 'react'

type FileItem = {
  key: string
  size: number
  lastModified: string  // ISO string (serialized from server)
}

type FolderData = {
  folder: string
  files: FileItem[]
  totalSize: number
}

type Props = {
  folders: FolderData[]
}

// ─── Helpers ──────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

function formatDateTime(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const FOLDER_DOT: Record<string, string> = {
  config: '#3b82f6',
  db:     '#8b5cf6',
  upload: '#f59e0b',
  other:  '#9ca3af',
}

function stripFolderPrefix(key: string, folder: string): string {
  const prefix = `${folder}/`
  return key.startsWith(prefix) ? key.slice(prefix.length) : key
}

// ─── Component ────────────────────────────────────────────

export default function BackupFolderView({ folders }: Props) {
  // Default: db folder expanded, others collapsed
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const state: Record<string, boolean> = {}
    for (const f of folders) {
      state[f.folder] = f.folder === 'db'
    }
    return state
  })

  const toggle = (folder: string) => {
    setExpanded((prev) => ({ ...prev, [folder]: !prev[folder] }))
  }

  if (folders.length === 0) {
    return (
      <div
        style={{
          padding: '60px 20px',
          textAlign: 'center',
          color: '#737373',
          fontSize: 14,
        }}
      >
        No backup files found
      </div>
    )
  }

  return (
    <div>
      {folders.map((folderData) => {
        const isExpanded = expanded[folderData.folder] ?? false
        const dotColor = FOLDER_DOT[folderData.folder] ?? FOLDER_DOT.other
        const folderLabel =
          folderData.folder.charAt(0).toUpperCase() + folderData.folder.slice(1)

        return (
          <div
            key={folderData.folder}
            style={{
              background: '#fff',
              borderRadius: 10,
              border: '1px solid #e5e9f0',
              marginBottom: 12,
              overflow: 'hidden',
            }}
          >
            {/* Folder header — clickable */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => toggle(folderData.folder)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') toggle(folderData.folder)
              }}
              style={{
                padding: '14px 20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                userSelect: 'none',
              }}
            >
              {/* Colored dot */}
              <span
                style={{
                  display: 'inline-block',
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: dotColor,
                  flexShrink: 0,
                }}
              />

              {/* Folder name */}
              <span
                style={{
                  fontFamily: 'var(--font-prompt)',
                  fontWeight: 600,
                  fontSize: 15,
                  color: '#0d2749',
                }}
              >
                {folderLabel}/
              </span>

              {/* File count badge */}
              <span
                style={{
                  padding: '2px 8px',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 600,
                  background: '#f0f4f8',
                  color: '#737373',
                }}
              >
                {folderData.files.length} {folderData.files.length === 1 ? 'file' : 'files'}
              </span>

              {/* Total size */}
              <span style={{ fontSize: 13, color: '#9ca3af' }}>
                {formatBytes(folderData.totalSize)}
              </span>

              {/* Chevron — push to right */}
              <span
                style={{
                  marginLeft: 'auto',
                  fontSize: 14,
                  color: '#9ca3af',
                  lineHeight: 1,
                }}
              >
                {isExpanded ? '▾' : '▸'}
              </span>
            </div>

            {/* File list — shown when expanded */}
            {isExpanded && (
              <div style={{ borderTop: '1px solid #f0f4f8' }}>
                {/* Desktop table */}
                <div className="admin-table-desktop">
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: '#f8fafc' }}>
                        <th
                          style={{
                            padding: '8px 20px',
                            textAlign: 'left',
                            color: '#737373',
                            fontWeight: 500,
                            fontSize: 12,
                          }}
                        >
                          Filename
                        </th>
                        <th
                          style={{
                            padding: '8px 20px',
                            textAlign: 'right',
                            color: '#737373',
                            fontWeight: 500,
                            fontSize: 12,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          Size
                        </th>
                        <th
                          style={{
                            padding: '8px 20px',
                            textAlign: 'left',
                            color: '#737373',
                            fontWeight: 500,
                            fontSize: 12,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          Last Modified
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {folderData.files.map((file) => (
                        <tr
                          key={file.key}
                          style={{
                            borderTop: '1px solid #f0f4f8',
                          }}
                        >
                          <td
                            style={{
                              padding: '10px 20px',
                              color: '#0d2749',
                              fontFamily: 'monospace',
                              fontSize: 12,
                              wordBreak: 'break-all',
                            }}
                          >
                            {stripFolderPrefix(file.key, folderData.folder)}
                          </td>
                          <td
                            style={{
                              padding: '10px 20px',
                              color: '#737373',
                              textAlign: 'right',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {formatBytes(file.size)}
                          </td>
                          <td
                            style={{
                              padding: '10px 20px',
                              color: '#737373',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {formatDateTime(file.lastModified)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile card stack */}
                <div className="admin-card-mobile">
                  {folderData.files.map((file) => (
                    <div
                      key={file.key}
                      style={{ padding: '10px 16px', borderTop: '1px solid #f0f4f8' }}
                    >
                      <div
                        style={{
                          fontFamily: 'monospace',
                          fontSize: 12,
                          color: '#0d2749',
                          wordBreak: 'break-all',
                          marginBottom: 4,
                        }}
                      >
                        {stripFolderPrefix(file.key, folderData.folder)}
                      </div>
                      <div style={{ display: 'flex', gap: 12, fontSize: 12, color: '#737373' }}>
                        <span>{formatBytes(file.size)}</span>
                        <span>{formatDateTime(file.lastModified)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      })}
      <style>{`
        @media (min-width: 769px) { .admin-card-mobile { display: none !important; } }
        @media (max-width: 768px) { .admin-table-desktop { display: none !important; } }
      `}</style>
    </div>
  )
}
