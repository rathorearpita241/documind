import { useState } from 'react'
import { createCRMTicket } from '../utils/api'

const CHIP = { pdf: 'src-chip-pdf', xlsx: 'src-chip-xlsx', eml: 'src-chip-eml' }

function SourceCard({ source }) {
  const pct = Math.round(source.relevance * 100)
  return (
    <div style={{
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 10, padding: '12px', marginBottom: 8,
      background: 'var(--ink-800)',
      transition: 'border-color 0.15s',
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(245,166,35,0.2)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span className={`src-chip ${CHIP[source.source_type] || 'src-chip-eml'}`}>
          {source.source_type?.toUpperCase()}
        </span>
        <span style={{ flex: 1, fontSize: 11, color: 'var(--ink-100)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {source.doc_name}
        </span>
        <span className="syne font-bold" style={{ fontSize: 12, color: 'var(--amber)', flexShrink: 0 }}>
          {pct}%
        </span>
      </div>
      {source.section && (
        <div className="mono" style={{ fontSize: 10, color: 'var(--ink-400)', marginBottom: 6 }}>
          {source.section}
        </div>
      )}
      <div style={{
        fontSize: 11, color: 'var(--ink-300)', lineHeight: 1.6,
        borderLeft: '2px solid var(--amber-muted)',
        paddingLeft: 8,
        display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
      }}>
        {source.excerpt}
      </div>
      <div className="rel-track" style={{ marginTop: 8 }}>
        <div className="rel-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function CRMPanel({ lastQuery, lastResponse }) {
  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function generate() {
    if (!lastQuery || !lastResponse) return
    setLoading(true)
    try {
      const res = await createCRMTicket(lastQuery, lastResponse)
      setTicket(res.data)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  if (!lastQuery) return (
    <div style={{ padding: '20px 16px', textAlign: 'center' }}>
      <div style={{
        width: 40, height: 40, borderRadius: 10, margin: '0 auto 12px',
        background: 'var(--ink-700)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--ink-400)" strokeWidth="1.5" strokeLinecap="round">
          <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
        </svg>
      </div>
      <div className="mono" style={{ fontSize: 10, color: 'var(--ink-400)', lineHeight: 1.7 }}>
        Ask a question first,<br />then auto-fill a CRM ticket.
      </div>
    </div>
  )

  if (submitted) return (
    <div style={{ padding: '32px 16px', textAlign: 'center' }}>
      <div style={{
        width: 48, height: 48, borderRadius: '50%', margin: '0 auto 14px',
        background: 'rgba(46,202,160,0.12)',
        border: '1px solid rgba(46,202,160,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="2" strokeLinecap="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      <div className="syne font-semibold" style={{ fontSize: 13, color: 'var(--teal)', marginBottom: 4 }}>Ticket Created</div>
      <div className="mono" style={{ fontSize: 10, color: 'var(--ink-400)', marginBottom: 16 }}>
        TKT-{Math.floor(Math.random() * 90000) + 10000}
      </div>
      <button onClick={() => { setSubmitted(false); setTicket(null) }}
        className="mono" style={{
          fontSize: 10, color: 'var(--amber)', background: 'none', border: 'none',
          cursor: 'pointer', textDecoration: 'underline',
        }}>
        Create another
      </button>
    </div>
  )

  return (
    <div style={{ padding: '12px' }}>
      {!ticket ? (
        <>
          <div className="mono" style={{ fontSize: 10, color: 'var(--ink-400)', lineHeight: 1.7, marginBottom: 12 }}>
            Extract ticket fields from the last AI answer using Claude.
          </div>
          <button onClick={generate} disabled={loading} style={{
            width: '100%', padding: '9px',
            background: loading ? 'var(--ink-700)' : 'linear-gradient(135deg, var(--amber), var(--amber-dim))',
            border: 'none', borderRadius: 8, cursor: loading ? 'not-allowed' : 'pointer',
            color: loading ? 'var(--ink-300)' : 'var(--ink-950)',
            fontFamily: 'DM Mono, monospace', fontSize: 11, fontWeight: 500,
            letterSpacing: '0.06em', transition: 'all 0.2s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            {loading ? (
              <>
                <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', border: '2px solid var(--ink-400)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
                Extracting…
              </>
            ) : 'Generate Ticket →'}
          </button>
        </>
      ) : (
        <>
          <div style={{
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 10, overflow: 'hidden', marginBottom: 10,
          }}>
            <div style={{
              background: 'rgba(245,166,35,0.08)',
              borderBottom: '1px solid rgba(245,166,35,0.12)',
              padding: '8px 12px',
            }}>
              <div className="syne font-semibold" style={{ fontSize: 11, color: 'var(--amber)' }}>
                Support Ticket — Draft
              </div>
            </div>
            <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8, background: 'var(--ink-800)' }}>
              {[
                { l: 'Customer',   v: ticket.customer },
                { l: 'Type',       v: ticket.query_type },
                { l: 'Resolution', v: ticket.resolution },
                { l: 'Sources',    v: ticket.sources_cited?.join(', ') },
              ].map(({ l, v }) => v && (
                <div key={l}>
                  <div className="label" style={{ marginBottom: 3 }}>{l}</div>
                  <div className="crm-val">{v}</div>
                </div>
              ))}
              {ticket.conflict_flag && (
                <div>
                  <div className="label" style={{ marginBottom: 3, color: 'var(--coral)' }}>Conflict Note</div>
                  <div className="crm-val" style={{ color: 'rgba(255,150,150,0.8)', borderColor: 'rgba(255,92,92,0.2)', background: 'rgba(74,21,21,0.4)' }}>
                    {ticket.conflict_flag}
                  </div>
                </div>
              )}
            </div>
          </div>
          <button onClick={() => setSubmitted(true)} style={{
            width: '100%', padding: '9px',
            background: 'linear-gradient(135deg, var(--teal-dim), var(--teal-muted))',
            border: '1px solid rgba(46,202,160,0.3)', borderRadius: 8, cursor: 'pointer',
            color: 'var(--teal)', fontFamily: 'DM Mono, monospace', fontSize: 11, fontWeight: 500,
            letterSpacing: '0.06em', marginBottom: 6,
          }}>
            Submit to CRM ↗
          </button>
          <button onClick={() => setTicket(null)} style={{
            width: '100%', padding: '6px', background: 'none', border: 'none',
            cursor: 'pointer', color: 'var(--ink-400)',
            fontFamily: 'DM Mono, monospace', fontSize: 10,
          }}>
            Discard
          </button>
        </>
      )}
    </div>
  )
}

export default function SourcePanel({ sources, lastQuery, lastResponse }) {
  const [tab, setTab] = useState('sources')
  return (
    <div className="flex flex-col h-full" style={{ borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
        {[{ k: 'sources', l: 'Sources' }, { k: 'crm', l: 'CRM Draft' }].map(({ k, l }) => (
          <button key={k} className={`tab-btn ${tab === k ? 'active' : ''}`} onClick={() => setTab(k)}>
            {l}
            {k === 'sources' && sources.length > 0 && (
              <span className="mono" style={{
                marginLeft: 5, fontSize: 9, background: 'rgba(245,166,35,0.15)',
                color: 'var(--amber)', padding: '1px 5px', borderRadius: 4,
              }}>{sources.length}</span>
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {tab === 'sources' ? (
          <div style={{ padding: '12px' }}>
            {sources.length === 0 ? (
              <div className="mono" style={{ fontSize: 10, color: 'var(--ink-400)', textAlign: 'center', padding: '32px 12px', lineHeight: 1.8 }}>
                Sources used to<br />answer will appear here.
              </div>
            ) : (
              <>
                <div className="label" style={{ marginBottom: 10 }}>{sources.length} source{sources.length > 1 ? 's' : ''} cited</div>
                {sources.map((s, i) => <SourceCard key={i} source={s} />)}
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
