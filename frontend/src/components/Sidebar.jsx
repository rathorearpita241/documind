import { useState, useEffect } from "react";

export default function Sidebar() {
  const [file, setFile] = useState(null);
  const [docs, setDocs] = useState([]);

  const fetchDocs = async () => {
    const res = await fetch("/api/documents/");
    const data = await res.json();
    setDocs(data);
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const upload = async () => {
    if (!file) return alert("Select file");

    const form = new FormData();
    form.append("file", file);

    await fetch("/api/documents/upload", {
      method: "POST",
      body: form,
    });

    setFile(null);
    fetchDocs();
  };

  return (
    <div className="sidebar">
      <h3>📂 Documents</h3>

      <div>
        {docs.map((d) => (
          <div key={d.id} className="docItem">
            📄 {d.name}
            <div className="meta">{d.chunk_count} chunks</div>
          </div>
        ))}
      </div>

      <div className="uploadBox">
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={upload}>Upload</button>
      </div>
    </div>
  );
}