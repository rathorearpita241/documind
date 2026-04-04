import ChatArea from "./components/ChatArea";
import Sidebar from "./components/Sidebar";
import SourcePanel from "./components/SourcePanel";
import TicketPanel from "./components/TicketPanel";
import { useState } from "react";

export default function App() {
  const [sources, setSources] = useState([]);
  const [conflict, setConflict] = useState(null);
  const [ticket, setTicket] = useState(null);

  return (
    <>
      <div className="header">🚀 DocuMind AI</div>

      <div className="app">
        <Sidebar />

        <ChatArea
          setSources={setSources}
          setConflict={setConflict}
          setTicket={setTicket}
        />

        <div className="rightPanel">
          <TicketPanel ticket={ticket} />
          <SourcePanel sources={sources} conflict={conflict} />
        </div>
      </div>
    </>
  );
}