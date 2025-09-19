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
    // endMessageRef.current.scrollIntoView({ behavior: "smooth" });
    endMessageRef.current.scrollIntoView();
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
    <div className="fixed inset-0 w-full h-full bg-black text-white overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Ccircle cx='2' cy='2' r='1' fill='%23444'/%3E%3C/svg%3E")`,
          backgroundSize: "20px 20px",
        }}
      />

      {/* Main Chat Layout */}
      <div className="relative z-10 flex flex-col h-full w-full">
        {/* Header */}
        <div className="flex-shrink-0 bg-black/90 backdrop-blur-sm border-b border-zinc-800 p-3 sm:p-4">
          <div className="flex items-center justify-between max-w-4xl mx-auto w-full">
            <h1 className="text-lg font-semibold">Chat Room</h1>
            <div className="text-sm text-zinc-400">
              {messages.filter((m) => m.type === "message").length} messages
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="min-h-full flex flex-col justify-end">
            <div className="px-3 py-4 sm:px-4 sm:py-6 space-y-3 max-w-4xl mx-auto w-full">
              {messages.map((m, i) => {
                if (m.type === "join") {
                  return (
                    <div key={i} className="flex justify-center py-2">
                      <div className="text-xs text-zinc-400 italic bg-zinc-900/50 px-3 py-1 rounded-full">
                        User {m.id} joined the chat
                      </div>
                    </div>
                  );
                }

                const isMe = m.id === userID;

                return (
                  <div
                    key={i}
                    className={`flex items-end gap-2 sm:gap-3 ${isMe ? "justify-end" : "justify-start"
                      }`}
                  >
                    {/* Left side avatar + message */}
                    {!isMe && (
                      <>
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex-shrink-0 ring-2 ring-red-900/30" />
                        <div
                          className="px-4 py-2.5 sm:px-4 sm:py-3 rounded-2xl shadow-lg border break-words 
              bg-gradient-to-r from-neutral-800 to-neutral-900 text-zinc-100 border-zinc-700/50 rounded-bl-md
              max-w-[80%] sm:max-w-[70%] md:max-w-[60%]"
                        >
                          <p className="text-sm sm:text-base leading-relaxed">{m.message}</p>
                        </div>
                      </>
                    )}

                    {/* Right side avatar + message */}
                    {isMe && (
                      <>
                        <div
                          className="px-4 py-2.5 sm:px-4 sm:py-3 rounded-2xl shadow-lg border break-words 
              bg-gradient-to-r from-blue-600 to-blue-700 text-white border-blue-800/50 rounded-br-md
              max-w-[80%] sm:max-w-[70%] md:max-w-[60%]"
                        >
                          <p className="text-sm sm:text-base leading-relaxed">{m.message}</p>
                        </div>
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex-shrink-0 ring-2 ring-blue-900/30" />
                      </>
                    )}
                  </div>
                );
              })}

              <div ref={endMessageRef} className="h-1" />
            </div>
          </div>
        </div>

        {/* Input */}
        <div className="flex-shrink-0 bg-black/95 backdrop-blur-sm border-t border-zinc-700">
          <form
            onSubmit={sendMessage}
            className="flex items-center gap-2 max-w-4xl mx-auto w-full px-3 py-3 sm:px-4 sm:py-4"
            style={{
              paddingBottom: `calc(0.75rem + env(safe-area-inset-bottom, 0px))`,
            }}
          >
            <input
              ref={msg}
              type="text"
              placeholder="Type a message..."
              className="flex-1 px-3 py-3 rounded-xl bg-neutral-900/80 border border-zinc-700 
              focus:outline-none focus:ring-2 focus:ring-blue-900 text-white placeholder-zinc-400
              text-base sm:text-sm"
            />
            <button
              type="submit"
              className="p-3 sm:p-2 rounded-xl hover:bg-zinc-800 transition flex items-center justify-center"
            >
              <Send className="w-6 h-6 sm:w-5 sm:h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );

}

export default App


