import { useState, useEffect } from 'react'
import { AlertTriangle, X, ChevronDown, ChevronUp } from 'lucide-react'

export default function ConflictBanner({ conflict }) {
  const [visible, setVisible] = useState(true)
  const [expanded, setExpanded] = useState(false)
  const [shake, setShake] = useState(false)

  useEffect(() => {
    setVisible(true)
    setExpanded(false)
    setShake(true)
    const t = setTimeout(() => setShake(false), 500)
    return () => clearTimeout(t)
  }, [conflict])

  if (!conflict?.detected || !visible) return null

  return (
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
      </div>
    </div>
  )
}
