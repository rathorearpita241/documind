import { useState, useEffect, useCallback } from 'react'
import Sidebar from './components/Sidebar'
import ChatArea from './components/ChatArea'
import SourcePanel from './components/SourcePanel'
import { getDocuments } from './utils/api'

export default function App() {
  const [documents, setDocuments] = useState([])
  const [activeDocId, setActiveDocId] = useState(null)
  const [sources, setSources] = useState([])
  const [lastQuery, setLastQuery] = useState(null)
  const [lastResponse, setLastResponse] = useState(null)

  const fetchDocs = useCallback(async () => {
    try {
      const res = await getDocuments()
      setDocuments(res.data)
    } catch (e) { console.error('Failed to load documents', e) }
  }, [])

  useEffect(() => { fetchDocs() }, [fetchDocs])

  function handleNewResponse({ query, response, sources: srcs }) {
    setSources(srcs || [])
    setLastQuery(query)
    setLastResponse(response)
  }

  return (
    <div style={{ height: '100vh', display: 'flex', overflow: 'hidden', background: 'var(--ink-950)', position: 'relative' }}>

      {/* Ambient background glows */}
      <div style={{
        position: 'absolute', top: -120, left: -120,
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245,166,35,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: -100, right: 200,
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(46,202,160,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Sidebar — 220px */}
      <div style={{ width: 220, flexShrink: 0, height: '100%', position: 'relative', zIndex: 1 }}>
        <Sidebar
          documents={documents}
          onDocumentAdded={fetchDocs}
          activeDocId={activeDocId}
          onSelectDoc={setActiveDocId}
        />
      </div>

      {/* Chat — flex 1 */}
      <div style={{ flex: 1, height: '100%', minWidth: 0, position: 'relative', zIndex: 1 }}>
        <ChatArea onNewResponse={handleNewResponse} />
      </div>

      {/* Source panel — 256px */}
      <div style={{ width: 256, flexShrink: 0, height: '100%', position: 'relative', zIndex: 1 }}>
        <SourcePanel
          sources={sources}
          lastQuery={lastQuery}
          lastResponse={lastResponse}
        />
      </div>
    </div>
  )
}
