import { useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatArea from "./components/ChatArea";
import SourcePanel from "./components/SourcePanel";

export default function App() {
  const [sources, setSources] = useState([]);
  const [conflict, setConflict] = useState(null);
  const [activeDoc, setActiveDoc] = useState(null);

  return (
    <div className="app-shell">
      {/* Ambient background orbs */}
      <div className="ambient-orb orb-1" />
      <div className="ambient-orb orb-2" />
      <div className="ambient-orb orb-3" />

      {/* HEADER */}
      <header className="topbar">
        <div className="topbar-brand">
          <div className="brand-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M9 12h6M9 16h6M9 8h6M5 4h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              <circle cx="19" cy="19" r="4" fill="#6EE7B7" stroke="none"/>
            </svg>
          </div>
          <span className="brand-name">DocuMind</span>
          <span className="brand-badge">AI</span>
        </div>

        <div className="topbar-center">
          <div className="topbar-status">
            <span className="status-dot" />
            <span>Intelligence Active</span>
          </div>
        </div>

        <div className="topbar-right">
          <div className="topbar-stat">
            <span className="stat-label">Model</span>
            <span className="stat-value">GPT-4o</span>
          </div>
          <div className="divider-v" />
          <div className="topbar-stat">
            <span className="stat-label">Docs</span>
            <span className="stat-value">Ready</span>
          </div>
          <div className="avatar">AM</div>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <main className="main-layout">
        <Sidebar activeDoc={activeDoc} setActiveDoc={setActiveDoc} />
        <ChatArea setSources={setSources} setConflict={setConflict} />
        <SourcePanel sources={sources} conflict={conflict} />
      </main>
    </div>
  );
}
