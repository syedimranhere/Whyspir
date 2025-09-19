import { WebSocketServer, WebSocket } from "ws";
import { v4 as uuidv4 } from "uuid";
const ws = new WebSocketServer({ port: 4000 });
//create a map where room : their members
const rooms = new Map();
let room;
const users = new Map();
ws.on("connection", function (socket) {
    const userId = uuidv4();
    console.log("Connected");
    socket.send(JSON.stringify({
        type: "welcome",
        id: userId
    }));
    socket.on("message", function (msg) {
        // console.log(msg.toString())
        console.log("mesage recieved");
        const data = JSON.parse(msg.toString());
        room = data.room;
        if (data.type === 'join') {
            if (!rooms.has(room)) {
                rooms.set(room, new Set());
            }
            //add the person in the room 
            users.set(socket, room);
            rooms.get(room)?.add(socket);
            //send joining message to every1
            rooms.get(room).forEach((s) => {
                s.send(JSON.stringify({
                    type: "join",
                    id: userId
                }));
            });
        }
        else {
            const message = data.message;
            const userRoom = users.get(socket);
            rooms.get(userRoom)?.forEach((r) => {
                r.send(JSON.stringify({
                    id: userId,
                    message: message
                }));
            });
        }
    });
    socket.on("close", () => {
        //remove user from the room
        const r = users.get(socket);
        //now remove the socket from the room also 
        rooms.get(r)?.delete(socket);
        if (rooms.get(r)?.size === 0) {
            rooms.delete(r);
        }
        users.delete(socket);
        console.log(`A User disconnected/left room ${room}`);
    });
});
//below is v.basic chat backend
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
//# sourceMappingURL=index.js.map