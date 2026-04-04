import { useState } from "react";

export default function Sidebar({ activeDoc, setActiveDoc }) {
  const [file, setFile] = useState(null);
  const [docs, setDocs] = useState([
    { name: "Annual Report 2024.pdf", size: "2.4 MB", pages: 48, status: "indexed" },
    { name: "Product Roadmap.docx", size: "892 KB", pages: 12, status: "indexed" },
  ]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const uploadFile = async (f) => {
    const targetFile = f || file;
    if (!targetFile) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("file", targetFile);

    try {
      await fetch("/api/documents/upload", { method: "POST", body: formData });
      const newDoc = {
        name: targetFile.name,
        size: (targetFile.size / 1024 / 1024).toFixed(1) + " MB",
        pages: "—",
        status: "indexed",
      };
      setDocs((prev) => {
        const exists = prev.find((d) => d.name === targetFile.name);
        return exists ? prev : [...prev, newDoc];
      });
    } catch {}

    setFile(null);
    setUploading(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) uploadFile(dropped);
  };

  return (
    <aside className="sidebar">
      {/* Section header */}
      <div className="sidebar-header">
        <div className="section-eyebrow">Knowledge Base</div>
        <div className="doc-count">{docs.length} documents</div>
      </div>

      {/* Search */}
      <div className="search-bar">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <input placeholder="Search documents..." className="search-input" />
      </div>

      {/* Document list */}
      <div className="doc-list">
        {docs.map((doc, i) => (
          <div
            key={i}
            className={`doc-card ${activeDoc === i ? "doc-card--active" : ""}`}
            onClick={() => setActiveDoc(i === activeDoc ? null : i)}
          >
            <div className="doc-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
              </svg>
            </div>
            <div className="doc-info">
              <div className="doc-name">{doc.name}</div>
              <div className="doc-meta">{doc.size} · {doc.pages} pages</div>
            </div>
            <div className={`doc-status ${doc.status}`}>
              <span className="status-pip" />
            </div>
          </div>
        ))}
      </div>

      {/* Upload zone */}
      <div
        className={`upload-zone ${dragOver ? "upload-zone--over" : ""} ${uploading ? "upload-zone--loading" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {uploading ? (
          <div className="upload-loading">
            <div className="spinner" />
            <span>Processing…</span>
          </div>
        ) : (
          <>
            <div className="upload-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                <polyline points="17,8 12,3 7,8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <div className="upload-label">Drop file or <label className="upload-browse">browse<input type="file" hidden onChange={(e) => { setFile(e.target.files[0]); uploadFile(e.target.files[0]); }} /></label></div>
            <div className="upload-hint">PDF, DOCX, TXT up to 50MB</div>
          </>
        )}
      </div>

      {/* Stats strip */}
      <div className="sidebar-stats">
        <div className="stat-pill">
          <span className="stat-pill-value">{docs.length * 31}</span>
          <span className="stat-pill-label">Chunks</span>
        </div>
        <div className="stat-pill">
          <span className="stat-pill-value">98%</span>
          <span className="stat-pill-label">Indexed</span>
        </div>
        <div className="stat-pill">
          <span className="stat-pill-value">Fast</span>
          <span className="stat-pill-label">Retrieval</span>
        </div>
      </div>
    </aside>
  );
}
