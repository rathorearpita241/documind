import { useState } from "react";

export default function SourcePanel({ sources, conflict }) {
  const [expanded, setExpanded] = useState(null);

  const uniqueSources = [];
  const seen = new Set();
  sources.forEach((s) => {
    const key = s.doc_name + s.excerpt;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueSources.push(s);
    }
  });

  const relevanceColor = (score) => {
    if (!score) return "#6EE7B7";
    if (score > 0.85) return "#6EE7B7";
    if (score > 0.65) return "#FCD34D";
    return "#F87171";
  };

  return (
    <aside className="source-panel">
      {/* Header */}
      <div className="source-header">
        <div className="section-eyebrow">Citations</div>
        {uniqueSources.length > 0 && (
          <div className="source-count-badge">{uniqueSources.length}</div>
        )}
      </div>

      {/* Conflict banner */}
      {conflict?.detected && (
        <div className="conflict-alert">
          <div className="conflict-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <div className="conflict-body">
            <div className="conflict-title">Conflict Detected</div>
            <div className="conflict-topic">{conflict.topic}</div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {uniqueSources.length === 0 ? (
        <div className="source-empty">
          <div className="source-empty-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 12h6M9 16h6M9 8h6M5 4h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"/>
            </svg>
          </div>
          <div className="source-empty-text">Sources will appear here after each query</div>
        </div>
      ) : (
        <div className="source-list">
          {uniqueSources.map((s, i) => (
            <div
              key={i}
              className={`source-card ${expanded === i ? "source-card--expanded" : ""}`}
              onClick={() => setExpanded(expanded === i ? null : i)}
            >
              <div className="source-card-header">
                <div className="source-doc-name">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                  </svg>
                  {s.doc_name}
                </div>
                <div className="source-relevance" style={{ color: relevanceColor(s.score) }}>
                  {s.score ? `${Math.round(s.score * 100)}%` : "—"}
                </div>
              </div>
              <div className={`source-excerpt ${expanded === i ? "" : "source-excerpt--clamped"}`}>
                {s.excerpt}
              </div>
              {s.page && (
                <div className="source-page-tag">Page {s.page}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Insight strip */}
      {uniqueSources.length > 0 && (
        <div className="insight-strip">
          <div className="insight-row">
            <span className="insight-label">Sources found</span>
            <span className="insight-value">{uniqueSources.length}</span>
          </div>
          <div className="insight-row">
            <span className="insight-label">Avg relevance</span>
            <span className="insight-value">
              {uniqueSources.some((s) => s.score)
                ? Math.round((uniqueSources.reduce((a, s) => a + (s.score || 0.8), 0) / uniqueSources.length) * 100) + "%"
                : "—"}
            </span>
          </div>
        </div>
      )}
    </aside>
  );
}
