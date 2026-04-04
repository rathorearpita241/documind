import { useState, useRef, useEffect } from "react";

const SUGGESTIONS = [
  "Summarize the key findings",
  "What are the main risks?",
  "Compare these documents",
  "Extract all action items",
];

export default function ChatArea({ setSources, setConflict }) {
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hello! I've analyzed your documents and I'm ready to answer questions.",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const BASE_URL = "http://127.0.0.1:8000";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    const userText = text || input;
    if (!userText.trim() || loading) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    setMessages((prev) => [...prev, { role: "user", text: userText, time: timestamp }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/chat/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: userText }),
      });

      const data = await res.json();
      console.log("API RESPONSE:", data);

      const aiTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: data.answer || "No answer returned.",
          time: aiTime,
        },
      ]);
    } catch (error) {
      console.error(error);

      const aiTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Backend connection failed",
          time: aiTime,
          error: true,
        },
      ]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <section className="chat-panel">
      <div className="messages-area">
        {messages.map((m, i) => (
          <div key={i}>
            <b>{m.role === "user" ? "You: " : "AI: "}</b>
            {m.text}
          </div>
        ))}
        {loading && <p>Loading...</p>}
        <div ref={messagesEndRef} />
      </div>

      <textarea
        placeholder="Ask something..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <button onClick={() => sendMessage()} disabled={!input.trim() || loading}>
        Send
      </button>
    </section>
  );
}