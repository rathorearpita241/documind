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
    } catch (e) {
      console.error('Failed to load documents', e)
    }
  }, [])

  useEffect(() => { fetchDocs() }, [fetchDocs])

  function handleNewResponse({ query, response, sources: srcs }) {
    setSources(srcs || [])
    setLastQuery(query)
    setLastResponse(response)
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Sidebar — 220px fixed */}
      <div className="w-56 flex-shrink-0 h-full">
        <Sidebar
          documents={documents}
          onDocumentAdded={fetchDocs}
          activeDocId={activeDocId}
          onSelectDoc={setActiveDocId}
        />
      </div>

      {/* Chat — fills remaining space */}
      <div className="flex-1 h-full min-w-0">
        <ChatArea onNewResponse={handleNewResponse} />
      </div>

      {/* Source panel — 260px fixed */}
      <div className="w-64 flex-shrink-0 h-full">
        <SourcePanel
          sources={sources}
          lastQuery={lastQuery}
          lastResponse={lastResponse}
        />
      </div>
    </div>
  )
}
