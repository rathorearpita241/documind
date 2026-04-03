import { useState, useRef, useEffect } from 'react'
import { sendChat } from '../utils/api'
import ConflictBanner from './ConflictBanner'

const QUICK_ASKS = [
  'What is our refund policy for bulk orders?',
  'What discount applies to Acme Corp?',
  'Show all SLA breach clauses',
  'Compare pricing across our clients',
  'What are the return terms for international orders?',
]

const SRC_CHIP = { pdf: 'src-chip-pdf', xlsx: 'src-chip-xlsx', eml: 'src-chip-eml' }

function TypingBubble() {
  return (
    <div className="msg-enter" style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 14 }}>
      <div className="bubble-ai" style={{ padding: '12px 16px', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
        {[1, 2, 3].map(i => (
          <span key={i} className={`d${i}`} style={{
            width: 6, height: 6, borderRadius: '50%', background: 'var(--amber)',
            display: 'inline-block', flexShrink: 0,
          }} />
        ))}
      </div>
    </div>
  )
}

function SourceChips({ sources }) {
  if (!sources?.length) return null
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 8 }}>
      {sources.map((s, i) => (
        <span key={i} className={`src-chip ${SRC_CHIP[s.source_type] || 'src-chip-eml'}`}>
          {s.doc_name}
          {s.section && <span style={{ opacity: 0.55 }}> · {s.section}</span>}
        </span>
      ))}
    </div>
  )
}

function Message({ msg }) {
  const time = msg.time
  if (msg.typing) return <TypingBubble />

  if (msg.role === 'user') return (
    <div className="msg-enter" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
      <div style={{ maxWidth: '76%' }}>
        <div className="bubble-user">{msg.content}</div>
        <div className="mono" style={{ fontSize: 10, color: 'var(--ink-400)', marginTop: 3, textAlign: 'right' }}>{time}</div>
      </div>
    </div>
  )

  return (
    <div className="msg-enter" style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 14 }}>
      <div style={{ maxWidth: '84%' }}>
        {/* AI avatar */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
          <div style={{
            width: 26, height: 26, borderRadius: 7, flexShrink: 0, marginBottom: 2,
            background: 'linear-gradient(135deg, var(--amber-deep), rgba(245,166,35,0.15))',
            border: '1px solid rgba(245,166,35,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
            </svg>
          </div>
          <div>
            <div className="bubble-ai" style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
            <SourceChips sources={msg.sources} />
          </div>
        </div>
        <div className="mono" style={{ fontSize: 10, color: 'var(--ink-400)', marginTop: 4, marginLeft: 34 }}>{time}</div>
      </div>
    </div>
  )
}

function WelcomeScreen({ onAsk }) {
  return (
    <div className="fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 32px' }}>
      {/* Central logo */}
      <div style={{ marginBottom: 28, textAlign: 'center' }}>
        <div style={{
          width: 64, height: 64, borderRadius: 18, margin: '0 auto 16px',
          background: 'linear-gradient(135deg, rgba(245,166,35,0.2), rgba(245,166,35,0.05))',
          border: '1px solid rgba(245,166,35,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 60px rgba(245,166,35,0.12)',
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="1.5" strokeLinecap="round">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
          </svg>
        </div>
        <div className="syne font-bold" style={{ fontSize: 22, color: 'var(--ink-50)', marginBottom: 6 }}>
          Ask your knowledge base
        </div>
        <div className="mono" style={{ fontSize: 11, color: 'var(--ink-400)', lineHeight: 1.8 }}>
          Upload documents · Ask anything · Sources cited · Conflicts flagged
        </div>
      </div>

      {/* Feature pills */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 28 }}>
        {[
          { icon: '⬡', label: 'RAG pipeline', color: 'var(--amber)' },
          { icon: '⚠', label: 'Conflict detection', color: 'var(--coral)' },
          { icon: '◎', label: 'Source attribution', color: 'var(--teal)' },
          { icon: '◈', label: 'CRM auto-fill', color: 'var(--ink-200)' },
        ].map(({ icon, label, color }) => (
          <div key={label} style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '5px 12px', borderRadius: 100,
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(22,22,31,0.7)',
            fontSize: 11, color: 'var(--ink-300)', fontFamily: 'DM Mono, monospace',
          }}>
            <span style={{ color }}>{icon}</span>
            {label}
          </div>
        ))}
      </div>

      {/* Sample questions */}
      <div style={{ width: '100%', maxWidth: 480 }}>
        <div className="label" style={{ textAlign: 'center', marginBottom: 12 }}>Try asking</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {QUICK_ASKS.slice(0, 4).map(q => (
            <div key={q} className="welcome-card" onClick={() => onAsk(q)}>
              <div style={{ fontSize: 11, color: 'var(--ink-200)', lineHeight: 1.5 }}>"{q}"</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ChatArea({ onNewResponse }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeConflict, setActiveConflict] = useState(null)
  const bottomRef = useRef()
  const textareaRef = useRef()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function now() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  async function submit(query) {
    const q = (query || input).trim()
    if (!q || loading) return
    setInput('')
    if (textareaRef.current) { textareaRef.current.style.height = 'auto' }

    setMessages(prev => [...prev, { role: 'user', content: q, time: now() }])
    setMessages(prev => [...prev, { role: 'ai', typing: true }])
    setLoading(true)

    try {
      const res = await sendChat(q)
      const data = res.data
      setMessages(prev => [
        ...prev.filter(m => !m.typing),
        { role: 'ai', content: data.answer, sources: data.sources, time: now() }
      ])
      setActiveConflict(data.conflict?.detected ? data.conflict : null)
      onNewResponse({ query: q, response: data, sources: data.sources })
    } catch {
      setMessages(prev => [
        ...prev.filter(m => !m.typing),
        { role: 'ai', content: 'Connection error. Is the backend running on port 8000?', time: now() }
      ])
    } finally { setLoading(false) }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit() }
  }

  function autoResize() {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 120) + 'px'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* Header */}
      <div style={{
        padding: '14px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div>
          <div className="syne font-semibold" style={{ fontSize: 14, color: 'var(--ink-50)' }}>
            Knowledge Assistant
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 2 }}>
            <div className="pulse-dot" />
            <div className="mono" style={{ fontSize: 10, color: 'var(--teal)' }}>
              RAG · Conflict Detection · Claude claude-sonnet-4-5
            </div>
          </div>
        </div>
        {/* Session indicator */}
        <div className="mono" style={{
          fontSize: 10, color: 'var(--ink-500)',
          background: 'var(--ink-800)', border: '1px solid var(--ink-700)',
          padding: '4px 10px', borderRadius: 6,
        }}>
          {messages.filter(m => m.role === 'user').length} queries
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 8px', display: 'flex', flexDirection: 'column' }}>
        {messages.length === 0
          ? <WelcomeScreen onAsk={q => submit(q)} />
          : messages.map((m, i) => <Message key={i} msg={m} />)
        }
        <div ref={bottomRef} />
      </div>

      {/* Conflict banner */}
      {activeConflict && <ConflictBanner conflict={activeConflict} />}

      {/* Quick pills - shown after first message */}
      {messages.length > 0 && (
        <div style={{
          padding: '6px 16px 0',
          display: 'flex', gap: 6, overflowX: 'auto', flexShrink: 0,
        }}>
          {QUICK_ASKS.slice(0, 4).map(q => (
            <button key={q} className="quick-pill" onClick={() => submit(q)}>
              {q.length > 36 ? q.slice(0, 36) + '…' : q}
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div style={{ padding: '12px 16px 16px', flexShrink: 0 }}>
        <div style={{
          display: 'flex', alignItems: 'flex-end', gap: 10,
          background: 'var(--ink-800)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 14, padding: '10px 12px',
          transition: 'border-color 0.2s',
          boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
        }}
          onFocus={e => e.currentTarget.style.borderColor = 'rgba(245,166,35,0.3)'}
          onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
        >
          {/* Command prompt symbol */}
          <div className="mono" style={{ color: 'var(--amber-muted)', fontSize: 14, paddingBottom: 1, flexShrink: 0 }}>›</div>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => { setInput(e.target.value); autoResize() }}
            onKeyDown={handleKey}
            placeholder="Ask anything across your documents…"
            rows={1}
            className="cmd-input"
            style={{ minHeight: 24, maxHeight: 120 }}
          />
          <button
            className="send-btn"
            onClick={() => submit()}
            disabled={!input.trim() || loading}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--ink-950)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
        <div className="mono" style={{ fontSize: 10, color: 'var(--ink-500)', textAlign: 'center', marginTop: 6 }}>
          ↵ Send · Shift+↵ Newline · Powered by Claude claude-sonnet-4-5 + ChromaDB
        </div>
      </div>
    </div>
  )
}
