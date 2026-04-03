import { useState, useEffect } from 'react'
<<<<<<< HEAD
=======
import { AlertTriangle, X, ChevronDown, ChevronUp } from 'lucide-react'
>>>>>>> 0df11b4b1dd14f34b1975cee0a720d8ae5d57227

export default function ConflictBanner({ conflict }) {
  const [visible, setVisible] = useState(true)
  const [expanded, setExpanded] = useState(false)
<<<<<<< HEAD
  const [key, setKey] = useState(0)
=======
  const [shake, setShake] = useState(false)
>>>>>>> 0df11b4b1dd14f34b1975cee0a720d8ae5d57227

  useEffect(() => {
    setVisible(true)
    setExpanded(false)
<<<<<<< HEAD
    setKey(k => k + 1)
=======
    setShake(true)
    const t = setTimeout(() => setShake(false), 500)
    return () => clearTimeout(t)
>>>>>>> 0df11b4b1dd14f34b1975cee0a720d8ae5d57227
  }, [conflict])

  if (!conflict?.detected || !visible) return null

  return (
<<<<<<< HEAD
    <div key={key} className="conflict-enter" style={{ margin: '0 16px 12px', flexShrink: 0 }}>
      <div style={{
        borderRadius: 10,
        border: '1px solid rgba(255,92,92,0.3)',
        background: 'rgba(74,21,21,0.5)',
        overflow: 'hidden',
        backdropFilter: 'blur(12px)',
      }}>
        {/* Header bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '9px 12px',
          borderBottom: expanded ? '1px solid rgba(255,92,92,0.15)' : 'none',
        }}>
          {/* Warning icon */}
          <div style={{
            width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
            background: 'var(--coral-dim)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="syne font-semibold" style={{ fontSize: 12, color: 'var(--coral)', lineHeight: 1.3 }}>
              Conflict detected
            </div>
            <div className="mono" style={{ fontSize: 10, color: 'rgba(255,92,92,0.6)', marginTop: 1 }}>
              {conflict.doc_a} vs {conflict.doc_b}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              onClick={() => setExpanded(v => !v)}
              className="mono"
              style={{
                fontSize: 10, color: 'var(--coral)', background: 'none', border: 'none',
                cursor: 'pointer', padding: '2px 6px', borderRadius: 4,
                transition: 'background 0.15s',
              }}
            >
              {expanded ? 'Hide ↑' : 'Show ↓'}
            </button>
            <button
              onClick={() => setVisible(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,92,92,0.5)', lineHeight: 1 }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        {expanded && (
          <div style={{ padding: '10px 12px' }}>
            <div style={{
              fontSize: 12, color: 'rgba(255,200,200,0.8)', lineHeight: 1.6, marginBottom: 8,
            }}>
              <span style={{ color: 'rgba(255,92,92,0.7)' }}>Topic: </span>
              {conflict.topic}
            </div>
            {conflict.resolution && (
              <div style={{
                background: 'rgba(255,92,92,0.07)',
                border: '1px solid rgba(255,92,92,0.15)',
                borderRadius: 6, padding: '8px 10px',
                fontSize: 12, color: 'rgba(255,200,200,0.7)', lineHeight: 1.6,
              }}>
                <span className="mono" style={{ fontSize: 10, color: 'var(--coral)', display: 'block', marginBottom: 3 }}>
                  RESOLUTION
                </span>
                {conflict.resolution}
              </div>
            )}
          </div>
        )}
=======
    <div className={`mx-4 mb-2 rounded-xl border border-red-200 bg-red-50 overflow-hidden ${shake ? 'shake' : ''}`}>
      <div className="flex items-start gap-2.5 px-3 py-2.5">
        <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
          <AlertTriangle size={11} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold text-red-800 mb-0.5">Conflict detected</div>
          <div className="text-xs text-red-700 leading-relaxed">
            {conflict.doc_a} and {conflict.doc_b} disagree on: <em>{conflict.topic}</em>
          </div>
          {expanded && conflict.resolution && (
            <div className="mt-2 text-xs text-red-600 bg-red-100 rounded-lg px-2.5 py-2 leading-relaxed">
              <span className="font-medium">Resolution:</span> {conflict.resolution}
            </div>
          )}
          <button
            className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1 hover:text-red-800 transition-colors"
            onClick={() => setExpanded(v => !v)}
          >
            {expanded ? <><ChevronUp size={11} /> Hide resolution</> : <><ChevronDown size={11} /> Show resolution</>}
          </button>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0"
        >
          <X size={14} />
        </button>
>>>>>>> 0df11b4b1dd14f34b1975cee0a720d8ae5d57227
      </div>
    </div>
  )
}
