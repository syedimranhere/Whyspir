import { useState, useEffect, useRef } from 'react'
import './App.css'
import { Send } from 'lucide-react';
function App() {
  interface Message {
    type: string;
    message?: string;
    id?: string;
  }
  const [messages, setMessages] = useState<Message[]>([])
  const WS = useRef<WebSocket>(null)
  const msg = useRef<HTMLInputElement>(null);
  const [userID, setId] = useState<string>();
  const endMessageRef = useRef<HTMLInputElement>(null);
  const sendMessage = (e) => {
    e.preventDefault();
    if (msg.current.value.trim() !== "") {
      WS.current.send(JSON.stringify({
        type: "chat",
        message: msg.current.value
      }))
    }
    msg.current.value = ""

  }
  useEffect(() => {
    endMessageRef.current.scrollIntoView({ behavior: "smooth" });
    // endMessageRef.current.scrollIntoView();
  }, [messages])

  useEffect(() => {
    const ws = new WebSocket("wss://websockets-production-0087.up.railway.app");
    ws.onopen = () => {
      WS.current = ws
      ws.send(JSON.stringify({
        type: "join",
        room: 1
      }))
    }
    ws.onmessage = (e) => {
      console.log(e.data)
      const response = JSON.parse(e.data);
      if (response.type === "welcome") {
        setId(response.id);

      }
      else {
        setMessages((prev) => [...prev, response])
      }
    }

  }, [])
  return (
    <div
      className="flex flex-col min-h-screen bg-black text-white"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Ccircle cx='2' cy='2' r='1' fill='%23444'/%3E%3C/svg%3E")`,
        backgroundSize: "20px 20px",
      }}
    >
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => {
          if (m.type === "join") {
            return (
              <div key={i} className="flex justify-center">
                <div className="text-xs text-zinc-400 italic">
                  User: {m.id} joined the chat
                </div>
              </div>
            );
          }

          const isMe = m.id === userID;

          return (
            <div
              key={i}
              className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"
                }`}
            >
              {!isMe && (
                <div className="w-8 h-8 rounded-full bg-red-700 flex-shrink-0"></div>
              )}

              <div
                className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-md border text-sm
              ${isMe
                    ? "bg-blue-700 text-white border-blue-800"
                    : "bg-neutral-800 text-zinc-200 border-zinc-800"
                  }`}
              >
                {m.message}
              </div>

              {isMe && (
                <div className="w-8 h-8 rounded-full bg-blue-400 flex-shrink-0"></div>
              )}
            </div>
          );
        })}
      </div>
      <div ref={endMessageRef} />


      <div className="sticky bottom-0 bg-black/90 border-t border-zinc-700 p-3">
        <form
          onSubmit={sendMessage}
          className="flex items-center gap-2 max-w-4xl mx-auto"
        >
          <input
            ref={msg}
            type="text"
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 rounded-xl bg-neutral-900/80 border border-zinc-700 
                     focus:outline-none focus:ring-2 focus:ring-blue-900 text-white placeholder-zinc-400"
          />
          <button
            type="submit"
            className=" 
                     transition font-semibold flex items-center justify-center"
          >
            <Send className="w-8 h-5" />
          </button>
        </form>
      </div>
    </div>
  );

}

export default App


