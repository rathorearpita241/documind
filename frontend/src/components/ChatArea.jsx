import { useState, useRef, useEffect } from 'react'
import { Send, FileText, Table2, Mail, Sparkles } from 'lucide-react'
import { sendChat } from '../utils/api'
import ConflictBanner from './ConflictBanner'

const QUICK_ASKS = [
  'What is our refund policy for bulk orders?',
  'What discount applies to Acme Corp?',
  'Show all SLA breach clauses',
  'What is our current stock count?',
  'Compare pricing across clients',
]

const TYPE_ICON = { pdf: FileText, xlsx: Table2, eml: Mail }
const TYPE_CHIP = { pdf: 'chip-pdf', xlsx: 'chip-xlsx', eml: 'chip-eml' }

function TypingDots() {
  return (
    <div className="msg-bubble-ai inline-flex items-center gap-1.5 px-4 py-3">
      <span className="w-1.5 h-1.5 rounded-full bg-brand-300 dot1" />
      <span className="w-1.5 h-1.5 rounded-full bg-brand-300 dot2" />
      <span className="w-1.5 h-1.5 rounded-full bg-brand-300 dot3" />
    </div>
  )
}

function SourceChips({ sources }) {
  if (!sources?.length) return null
  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {sources.map((s, i) => {
        const Icon = TYPE_ICON[s.source_type] || FileText
        return (
          <span key={i} className={`source-chip ${TYPE_CHIP[s.source_type] || 'chip-eml'}`}>
            <Icon size={10} />
            {s.doc_name}
            {s.section && <span className="opacity-70"> · {s.section}</span>}
          </span>
        )
      })}
    </div>
  )
}

function Message({ msg }) {
  if (msg.role === 'user') {
    return (
      <div className="flex justify-end mb-3">
        <div className="max-w-[78%]">
          <div className="msg-bubble-user">{msg.content}</div>
          <div className="text-xs text-gray-400 mt-1 text-right">{msg.time}</div>
        </div>
      </div>
    )
  }

  if (msg.typing) {
    return (
      <div className="flex justify-start mb-3">
        <TypingDots />
      </div>
    )
  }

  return (
    <div className="flex justify-start mb-3">
      <div className="max-w-[85%]">
        <div className="msg-bubble-ai whitespace-pre-wrap">{msg.content}</div>
        {msg.sources?.length > 0 && <SourceChips sources={msg.sources} />}
        <div className="text-xs text-gray-400 mt-1">{msg.time}</div>
      </div>
    </div>
  )
}

function WelcomeScreen({ onQuickAsk }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 py-12">
      <div className="w-14 h-14 rounded-2xl bg-brand-600 flex items-center justify-center mb-4 shadow-lg">
        <Sparkles size={24} className="text-white" />
      </div>
      <h2 className="text-lg font-semibold text-gray-800 mb-1">Ask your knowledge base</h2>
      <p className="text-sm text-gray-500 text-center mb-8 max-w-xs leading-relaxed">
        Upload PDFs, spreadsheets, or emails — then ask anything. I'll cite my sources and flag conflicts.
      </p>
      <div className="w-full max-w-sm space-y-2">
        {QUICK_ASKS.map(q => (
          <button
            key={q}
            onClick={() => onQuickAsk(q)}
            className="w-full text-left text-sm px-3.5 py-2.5 rounded-xl border border-gray-100 bg-white hover:border-brand-200 hover:bg-brand-50/50 text-gray-600 transition-all"
          >
            {q}
          </button>
        ))}
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
    const q = query || input.trim()
    if (!q || loading) return
    setInput('')

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

      if (data.conflict?.detected) setActiveConflict(data.conflict)
      else setActiveConflict(null)

      onNewResponse({ query: q, response: data, sources: data.sources })
    } catch (e) {
      setMessages(prev => [
        ...prev.filter(m => !m.typing),
        { role: 'ai', content: 'Sorry, something went wrong. Is the backend running?', time: now() }
      ])
    } finally {
      setLoading(false)
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  function autoResize() {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 120) + 'px'
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 flex-shrink-0">
        <div>
          <div className="font-semibold text-gray-800 text-sm">Knowledge Assistant</div>
          <div className="text-xs text-gray-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
            Ready · RAG + Conflict Detection
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {messages.length === 0
          ? <WelcomeScreen onQuickAsk={q => submit(q)} />
          : messages.map((m, i) => <Message key={i} msg={m} />)
        }
        <div ref={bottomRef} />
      </div>

      {/* Conflict banner */}
      {activeConflict && <ConflictBanner conflict={activeConflict} />}

      {/* Quick asks (shown after first message) */}
      {messages.length > 0 && (
        <div className="px-4 pb-1 flex gap-2 overflow-x-auto scrollbar-none">
          {QUICK_ASKS.slice(0, 3).map(q => (
            <button
              key={q}
              onClick={() => submit(q)}
              className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-500 hover:border-brand-300 hover:text-brand-600 bg-white transition-all whitespace-nowrap"
            >
              {q.length > 32 ? q.slice(0, 32) + '…' : q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="px-4 pb-4 pt-2 border-t border-gray-100 flex-shrink-0">
        <div className="flex items-end gap-2 bg-white border border-gray-200 rounded-2xl px-3 py-2 focus-within:border-brand-400 transition-colors shadow-sm">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => { setInput(e.target.value); autoResize() }}
            onKeyDown={handleKey}
            placeholder="Ask anything across your documents…"
            rows={1}
            className="flex-1 resize-none text-sm text-gray-800 placeholder-gray-400 outline-none bg-transparent leading-relaxed"
            style={{ minHeight: '24px', maxHeight: '120px' }}
          />
          <button
            onClick={() => submit()}
            disabled={!input.trim() || loading}
            className="w-8 h-8 rounded-xl bg-brand-600 hover:bg-brand-800 disabled:opacity-40 flex items-center justify-center flex-shrink-0 transition-colors"
          >
            <Send size={13} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}
