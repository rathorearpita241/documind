import { useState, useRef } from 'react'
import { Upload, FileText, Table2, Mail, Plus, Loader2 } from 'lucide-react'
import { uploadDocument } from '../utils/api'

const TYPE_CONFIG = {
  pdf:  { icon: FileText, label: 'PDF',  cls: 'badge-pdf' },
  xlsx: { icon: Table2,   label: 'XLS',  cls: 'badge-xlsx' },
  eml:  { icon: Mail,     label: 'EML',  cls: 'badge-eml' },
}

function DocBadge({ type }) {
  const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.eml
  return (
    <span className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-semibold flex-shrink-0 ${cfg.cls}`}>
      {cfg.label}
    </span>
  )
}

export default function Sidebar({ documents, onDocumentAdded, activeDocId, onSelectDoc }) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef()

  async function handleFiles(files) {
    if (!files.length) return
    setUploading(true)
    try {
      for (const file of Array.from(files)) {
        const today = new Date().toISOString().split('T')[0]
        await uploadDocument(file, today)
      }
      await onDocumentAdded()
    } catch (e) {
      console.error('Upload failed', e)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-gray-50/80 border-r border-gray-100">
      {/* Header */}
      <div className="px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">K</span>
          </div>
          <div>
            <div className="font-semibold text-gray-900 text-sm leading-tight">
              Know<span className="text-brand-600">Desk</span>
            </div>
            <div className="text-xs text-gray-400">SME Knowledge Agent</div>
          </div>
        </div>
      </div>

      {/* Doc list */}
      <div className="flex-1 overflow-y-auto px-2 py-3">
        <div className="text-xs text-gray-400 uppercase tracking-wide px-2 mb-2 font-medium">
          Knowledge Base
        </div>
        {documents.length === 0 && (
          <div className="text-xs text-gray-400 text-center py-8 px-3">
            Upload a PDF, Excel, or email file to get started
          </div>
        )}
        {documents.map(doc => (
          <div
            key={doc.id}
            className={`doc-item ${activeDocId === doc.id ? 'active' : ''}`}
            onClick={() => onSelectDoc(doc.id)}
          >
            <DocBadge type={doc.source_type} />
            <div className="min-w-0">
              <div className="text-sm text-gray-800 font-medium truncate leading-tight">
                {doc.name}
              </div>
              <div className="text-xs text-gray-400">
                {doc.chunk_count} chunks · {doc.date_uploaded}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload zone */}
      <div className="p-3 border-t border-gray-100">
        <div
          className={`border border-dashed rounded-xl p-3 text-center cursor-pointer transition-all
            ${dragOver ? 'border-brand-400 bg-brand-50' : 'border-gray-200 hover:border-brand-300 hover:bg-brand-50/50'}`}
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files) }}
          onClick={() => fileRef.current?.click()}
        >
          <input
            ref={fileRef}
            type="file"
            multiple
            className="hidden"
            accept=".pdf,.xlsx,.eml,.txt"
            onChange={e => handleFiles(e.target.files)}
          />
          {uploading ? (
            <div className="flex items-center justify-center gap-2 text-brand-600 text-xs">
              <Loader2 size={14} className="animate-spin" />
              Ingesting…
            </div>
          ) : (
            <>
              <Upload size={14} className="mx-auto text-gray-400 mb-1" />
              <div className="text-xs text-gray-500 font-medium">Drop files or click</div>
              <div className="text-xs text-gray-400">PDF · Excel · Email</div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
