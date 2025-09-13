import {WebSocketServer,WebSocket} from "ws"
interface User {
socket:WebSocket,
room:number
}
const ws = new WebSocketServer({port:4000})
const arr:User[]= [];
ws.on("connection",function(socket){
console.log("connected")
    socket.on("message",function(msg){
    // console.log(msg.toString())
     const data = JSON.parse(msg.toString());

     if(data.type === 'join'){
        //make him join the room
        arr.push({socket:socket,room:data.room})
        console.log(`You joined room ${data.room} `)
     }
     else if(data.type === 'chat'){
        //now send a message
        const message = data.payload.message;
        const room = data.room
        arr.forEach(function(e){
             if(e.room === room){
                e.socket.send(message);
             }
        })
     }
    })
    
    socket.on("close",()=>{
        console.log("1 user disconnected")
    })
})

// import {WebSocketServer,WebSocket} from "ws"
// let user=0
// const ws = new WebSocketServer({port:4000})
// let arr:WebSocket[]= [];
// ws.on("connection",function(socket){
//     arr.push(socket)
//     user++;
//     console.log("connected Users #",user)
//     socket.on("message",function(msg){
//         //send this to everyone except the sender
//       arr.forEach((s)=> s!==socket?s.send(msg.toString()):null)
//     })
//     socket.on("close",function(){
//         user--;
//        arr= arr.filter((e)=>e!=socket)
//         console.log(`User left #${user} | sending to ${arr.length-1} people`)

//     })
// })

