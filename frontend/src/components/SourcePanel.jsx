import { useState } from 'react'
import { FileText, Table2, Mail, CheckCircle2, Loader2 } from 'lucide-react'
import { createCRMTicket } from '../utils/api'

const TYPE_STYLE = {
  pdf:  'chip-pdf',
  xlsx: 'chip-xlsx',
  eml:  'chip-eml',
}

const TYPE_ICON = { pdf: FileText, xlsx: Table2, eml: Mail }

function SourceCard({ source, index }) {
  const Icon = TYPE_ICON[source.source_type] || FileText
  const pct = Math.round(source.relevance * 100)
  return (
    <div className="border border-gray-100 rounded-xl p-3 mb-2.5 hover:border-brand-200 transition-colors bg-white">
      <div className="flex items-center gap-2 mb-2">
        <span className={`source-chip ${TYPE_STYLE[source.source_type] || 'chip-eml'} !py-0 !px-1.5`}>
          <Icon size={10} />
          {source.source_type?.toUpperCase()}
        </span>
        <span className="text-xs font-medium text-gray-700 truncate flex-1">{source.doc_name}</span>
        <span className="text-xs text-brand-600 font-semibold flex-shrink-0">{pct}%</span>
      </div>
      {source.section && (
        <div className="text-xs text-gray-400 mb-1.5">{source.section}</div>
      )}
      <div className="text-xs text-gray-600 leading-relaxed border-l-2 border-brand-200 pl-2.5 line-clamp-3">
        {source.excerpt}
      </div>
      {/* Relevance bar */}
      <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-400 rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

function CRMPanel({ lastQuery, lastResponse }) {
  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function generateTicket() {
    if (!lastQuery || !lastResponse) return
    setLoading(true)
    try {
      const res = await createCRMTicket(lastQuery, lastResponse)
      setTicket(res.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  if (!lastQuery) {
    return (
      <div className="text-xs text-gray-400 text-center py-10 px-4">
        Ask a question first, then generate a CRM ticket from the answer.
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle2 size={24} className="text-green-600" />
        </div>
        <div className="text-sm font-medium text-gray-700">Ticket created!</div>
        <div className="text-xs text-gray-400">ID: TKT-{Math.floor(Math.random()*90000)+10000}</div>
        <button
          onClick={() => { setSubmitted(false); setTicket(null) }}
          className="text-xs text-brand-600 hover:underline mt-2"
        >
          Create another
        </button>
      </div>
    )
  }

  return (
    <div>
      {!ticket ? (
        <div className="p-4">
          <p className="text-xs text-gray-500 mb-3 leading-relaxed">
            Auto-fill a support ticket from the last AI answer.
          </p>
          <button
            onClick={generateTicket}
            disabled={loading}
            className="w-full py-2 bg-brand-600 hover:bg-brand-800 text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? <><Loader2 size={12} className="animate-spin" /> Extracting fields…</> : 'Generate ticket →'}
          </button>
        </div>
      ) : (
        <div className="p-3">
          <div className="border border-gray-100 rounded-xl overflow-hidden bg-white">
            <div className="bg-brand-50 px-3 py-2 border-b border-brand-100">
              <div className="text-xs font-semibold text-brand-800">Support ticket — draft</div>
            </div>
            <div className="p-3 space-y-2.5">
              {[
                { label: 'Customer', value: ticket.customer },
                { label: 'Type', value: ticket.query_type },
                { label: 'Resolution', value: ticket.resolution },
                { label: 'Sources', value: ticket.sources_cited?.join(', ') },
              ].map(({ label, value }) => value && (
                <div key={label}>
                  <div className="text-xs text-gray-400 mb-0.5">{label}</div>
                  <div className="text-xs text-gray-800 bg-gray-50 rounded-lg px-2.5 py-1.5 leading-relaxed">
                    {value}
                  </div>
                </div>
              ))}
              {ticket.conflict_flag && (
                <div>
                  <div className="text-xs text-gray-400 mb-0.5">Conflict note</div>
                  <div className="text-xs text-red-700 bg-red-50 rounded-lg px-2.5 py-1.5 leading-relaxed border border-red-100">
                    {ticket.conflict_flag}
                  </div>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => setSubmitted(true)}
            className="w-full mt-3 py-2 bg-brand-600 hover:bg-brand-800 text-white rounded-lg text-xs font-medium transition-colors"
          >
            Submit to CRM ↗
          </button>
          <button
            onClick={() => setTicket(null)}
            className="w-full mt-1.5 py-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Discard
          </button>
        </div>
      )}
    </div>
  )
}

export default function SourcePanel({ sources, lastQuery, lastResponse }) {
  const [tab, setTab] = useState('sources')

  return (
    <div className="flex flex-col h-full border-l border-gray-100">
      {/* Tabs */}
      <div className="flex border-b border-gray-100 flex-shrink-0">
        {['sources', 'crm'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 text-xs font-medium transition-colors border-b-2 
              ${tab === t
                ? 'text-brand-600 border-brand-600'
                : 'text-gray-400 border-transparent hover:text-gray-600'
              }`}
          >
            {t === 'sources' ? 'Sources' : 'CRM Draft'}
            {t === 'sources' && sources.length > 0 && (
              <span className="ml-1.5 bg-brand-100 text-brand-700 text-xs rounded-full px-1.5 py-0.5">
                {sources.length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {tab === 'sources' ? (
          <div className="p-3">
            {sources.length === 0 ? (
              <div className="text-xs text-gray-400 text-center py-10">
                Sources will appear here after you ask a question.
              </div>
            ) : (
              <>
                <div className="text-xs text-gray-400 mb-2.5">
                  {sources.length} source{sources.length > 1 ? 's' : ''} used
                </div>
                {sources.map((s, i) => <SourceCard key={i} source={s} index={i} />)}
              </>
            )}
          </div>
        ) : (
          <CRMPanel lastQuery={lastQuery} lastResponse={lastResponse} />
        )}
      </div>
    </div>
  )
}
