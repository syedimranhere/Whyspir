import { useState,useEffect } from 'react'
import './App.css'

function App() {
  const [messages, setMessages] = useState([])
  const [ws, setWs] = useState()

  useEffect(()=>{
    const ws = new WebSocket("ws://localhost:4000")
    ws.onopen=()  =>{
console.log("connected")
setWs(ws)
ws.onmessage = (e) => {
    setMessages((prev) => [...prev, e.data]);
  
  };

  }
  },[])
 return (
  <div className="chat-container">
    {messages.map((m, i) => (
      <div key={i} >
        {m}
      </div>
    ))}
  </div>
);

}

export default App
