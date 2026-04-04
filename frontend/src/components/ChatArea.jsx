import { useState } from "react";

export default function ChatArea({ setSources, setConflict, setTicket }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input;

    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: userText }),
      });

      const data = await res.json();

      setSources(data.sources || []);
      setConflict(data.conflict || null);
      setTicket(data.ticket || null);

      setMessages((prev) => [
        ...prev,
        { role: "ai", text: data.answer || "No response" },
      ]);
    } catch (err) {
      console.error(err);
      alert("❌ Backend not reachable");
    }

    setLoading(false);
  };

  return (
    <div className="chat">
      <div className="messages">
        {messages.map((m, i) => (
          <div key={i} className={`message ${m.role}`}>
            {m.text}
          </div>
        ))}

        {loading && <div className="loader">🤖 Thinking...</div>}
      </div>

      <div className="inputBox">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your document..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}