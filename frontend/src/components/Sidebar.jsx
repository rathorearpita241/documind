import { useState, useRef } from 'react'
import { uploadDocument } from '../utils/api'

const BADGE = {
  pdf:  { cls: 'badge-pdf',  label: 'PDF' },
  xlsx: { cls: 'badge-xlsx', label: 'XLS' },
  eml:  { cls: 'badge-eml',  label: 'EML' },
}

function DocRow({ doc, active, onClick }) {
  const b = BADGE[doc.source_type] || BADGE.eml
  return (
    <div className={`doc-row ${active ? 'active' : ''}`} onClick={onClick}>
      <span className={`badge ${b.cls}`}>{b.label}</span>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium truncate" style={{ color: active ? 'var(--amber-glow)' : 'var(--ink-100)' }}>
          {doc.name}
        </div>
        <div className="mono" style={{ fontSize: '10px', color: 'var(--ink-400)', marginTop: '1px' }}>
          {doc.chunk_count} chunks · {doc.date_uploaded}
        </div>
      </div>
    </div>
  )
}

export default function Sidebar({ documents, onDocumentAdded, activeDocId, onSelectDoc }) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef()

  async function handleFiles(files) {
    const arr = Array.from(files)
    if (!arr.length) return
    setUploading(true)
    setProgress(0)
    try {
      for (let i = 0; i < arr.length; i++) {
        const today = new Date().toISOString().split('T')[0]
        await uploadDocument(arr[i], today)
        setProgress(Math.round(((i + 1) / arr.length) * 100))
      }
      await onDocumentAdded()
    } catch (e) { console.error(e) }
    finally { setUploading(false); setProgress(0) }
  }

  return (
    <div className="flex flex-col h-full" style={{ borderRight: '1px solid rgba(255,255,255,0.05)' }}>

      {/* Brand header */}
      <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center gap-2.5 mb-1">
          {/* Logo mark */}
          <div style={{
            width: 30, height: 30, borderRadius: 8, flexShrink: 0,
            background: 'linear-gradient(135deg, var(--amber) 0%, var(--amber-dim) 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 12px rgba(245,166,35,0.4)',
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="5" height="5" rx="1" fill="rgba(0,0,0,0.7)"/>
              <rect x="8" y="1" width="5" height="5" rx="1" fill="rgba(0,0,0,0.5)"/>
              <rect x="1" y="8" width="5" height="5" rx="1" fill="rgba(0,0,0,0.5)"/>
              <rect x="8" y="8" width="5" height="5" rx="1" fill="rgba(0,0,0,0.3)"/>
            </svg>
          </div>
          <div>
            <div className="syne font-bold text-sm tracking-tight" style={{ color: 'var(--ink-50)', lineHeight: 1 }}>
              Know<span style={{ color: 'var(--amber)' }}>Desk</span>
            </div>
            <div className="label" style={{ marginTop: 2 }}>SME Intelligence</div>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: '1px', background: 'rgba(255,255,255,0.04)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        {[
          { label: 'Docs',   val: documents.length },
          { label: 'Chunks', val: documents.reduce((a, d) => a + d.chunk_count, 0) },
        ].map(({ label, val }) => (
          <div key={label} style={{ background: 'var(--ink-900)', padding: '10px 14px' }}>
            <div className="syne font-bold" style={{ fontSize: 18, color: 'var(--amber)', lineHeight: 1 }}>{val}</div>
            <div className="label" style={{ marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Doc list */}
      <div className="flex-1 overflow-y-auto" style={{ padding: '10px 8px' }}>
        <div className="label" style={{ padding: '4px 10px 8px' }}>Knowledge Base</div>
        {documents.length === 0 && (
          <div className="mono text-center" style={{ color: 'var(--ink-400)', fontSize: 11, padding: '24px 12px', lineHeight: 1.6 }}>
            No documents yet.<br/>Upload below to start.
          </div>
        )}
        {documents.map(doc => (
          <DocRow key={doc.id} doc={doc} active={activeDocId === doc.id} onClick={() => onSelectDoc(doc.id)} />
        ))}
      </div>

      {/* Upload zone */}
      <div style={{ padding: '10px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        {uploading ? (
          <div style={{ padding: '12px', borderRadius: 10, background: 'var(--ink-800)', border: '1px solid var(--ink-600)' }}>
            <div className="label" style={{ marginBottom: 8 }}>Ingesting… {progress}%</div>
            <div style={{ height: 3, background: 'var(--ink-700)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 2,
                background: 'linear-gradient(90deg, var(--amber-muted), var(--amber))',
                width: `${progress}%`, transition: 'width 0.3s ease',
              }} />
            </div>
          </div>
        ) : (
          <div
            className={`drop-zone ${dragOver ? 'over' : ''}`}
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files) }}
            onClick={() => fileRef.current?.click()}
          >
            <input ref={fileRef} type="file" multiple accept=".pdf,.xlsx,.eml,.txt" className="hidden"
              onChange={e => handleFiles(e.target.files)} />
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--ink-400)" strokeWidth="1.5"
              strokeLinecap="round" style={{ margin: '0 auto 6px' }}>
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
            </svg>
            <div className="label">Drop files or click</div>
            <div className="mono" style={{ fontSize: 10, color: 'var(--ink-500)', marginTop: 3 }}>PDF · XLSX · EML</div>
          </div>
        )}
      </div>
    </div>
  )
}
