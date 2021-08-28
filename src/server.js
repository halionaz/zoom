// Backend using express.js & socket protocol

import express from "express";
import http from "http";
import socketIO from "socket.io";
// import WebSocket from "ws";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.use('/public',express.static(__dirname + '/public'));

app.get("/", (req,res) => {
    res.render("home");
});
app.get("/*",(req,res)=>{
    // 다른 모든 경로를 홈으로 돌려보냄
    res.redirect("/");
});

const server = http.createServer(app);
const io = socketIO(server);

function findPublicRooms(){
    const {
        sockets:{
            adapter: {sids, rooms},
        },
    } = io;
    const publicRooms = [];
    rooms.forEach((_,key) => {
        if(sids.get(key) === undefined){
            publicRooms.push(key);
        }
    });
    return publicRooms;
}

io.on("connection", (socket) => {
    console.log(`User Connect! ✅`);
    socket.nickname = "익명";
    socket.onAny((event) => {
        // console.log(io.sockets.adapter);
    })
    socket.on("enter_room", (roomname,done) =>{
        socket.join(roomname);
        done();
        socket.to(roomname).emit("welcome",socket.nickname);
        io.sockets.emit("room_change", findPublicRooms());
    })
    socket.on("disconnecting", ()=>{
        socket.rooms.forEach((room)=>{
            socket.to(room).emit("bye",socket.nickname);
        });
    })
    socket.on("disconnect",()=>{
        io.sockets.emit("room_change", findPublicRooms());
    })
    socket.on("new_message",(msg,roomname,done)=>{
        msg = `${socket.nickname} : ${msg}`;
        socket.to(roomname).emit("new_message",msg);
        done();
    })
    socket.on("nickname",(nickname) => {
        socket["nickname"] = nickname;
    })
})

// const websocketServer = new WebSocket.Server({ server });
// const sockets = [];
// websocketServer.on("connection",(socket) => {
//     sockets.push(socket);
//     socket.nickname = "익명";
//     //사용자를 sockets 배열에 추가
//     console.log("Connected to Browser ✅");
//     socket.on("close", ()=>{
//         console.log(`Disconnected from the Browser`);
//     });
//     socket.on("message",(message)=>{
//         const parsed = JSON.parse(message);
//         switch(parsed.type){
//             case "message" :
//                 sockets.forEach(eachsocket => {
//                     eachsocket.send(`${socket.nickname} : ${parsed.payload}`);
//                 });
//                 break;
//             case "nickname" :
//                 socket["nickname"] = parsed.payload;
//                 break;
//         }
//     });
// });

server.listen(3000, () => {
    console.log(`Listening on http://localhost:3000/`);
});
