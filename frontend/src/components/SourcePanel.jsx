export default function SourcePanel({ sources, conflict }) {
  return (
    <div className="sources">
      <h3>📚 Sources</h3>

      {conflict?.detected && (
        <div className="conflictBanner">
          ⚠ Conflict detected: {conflict.topic}
        </div>
      )}

      {sources.length === 0 ? (
        <p>No sources yet</p>
      ) : (
        sources.map((s, i) => (
          <div key={i} className="sourceCard">
            <b>{s.doc_name}</b>
            <p>{s.excerpt}</p>
            <small>{s.section}</small>
          </div>
        ))
      )}
    </div>
  );
}