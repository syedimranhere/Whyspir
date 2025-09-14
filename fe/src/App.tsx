import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [messages, setMessages] = useState([])
  const WS = useRef()
  const msg = useRef();
  const [joined, setjoined] = useState();
  const [userID, setId] = useState();
  const sendMessage = () => {


    if (msg.current.value.trim() !== "") {
      WS.current.send(JSON.stringify({
        type: "chat",
        message: msg.current.value
      }))

    }
    msg.current.value = ""

  }


  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4000")
    ws.onopen = () => {

      WS.current = ws
      alert("connected")
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
    <div className="flex flex-col min-h-screen bg-black text-white">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => {
          const isMe = m.id === userID; // compare sender id with mine
          return (
            <div
              key={i}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-md border text-sm
            ${isMe
                    ? "bg-blue-600 text-white border-blue-500" // my messages 
                    : "bg-zinc-900 text-zinc-200 border-zinc-800" // others' messages
                  }`}
              >
                {m.message}
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Section (fixed bottom) */}
      <div className="sticky bottom-0 bg-black border-t border-zinc-800 p-3 flex items-center gap-2">
        <input
          ref={msg}
          type="text"
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
        />
        <button className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 transition font-semibold"
          onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );

}

export default App
