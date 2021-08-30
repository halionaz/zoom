// Backend using express.js & socket protocol

import express from "express";
import http from "http";
import { Server } from "socket.io";
const { instrument } = require("@socket.io/admin-ui");
// import WebSocket from "ws";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.render("home");
});
app.get("/video_call", (req, res) => {
  res.render("video");
});
// app.get("/*",(req,res)=>{
//     // 다른 모든 경로를 홈으로 돌려보냄
//     res.redirect("/");
// });

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["https://admin.socket.io"],
    credentials: true,
  },
});

instrument(io, {
  auth: false,
});

// Chatting Service

function findPublicRooms() {
  // Private room 을 제외한 public room의 배열 반환
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = io;
  const publicRooms = [];
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
}

function countRoom(roomName) {
  // Room에 들어있는 사람 수 반환
  return io.sockets.adapter.rooms.get(roomName)?.size;
  // ? 옵셔널 체이닝
}

io.on("connection", (socket) => {
  console.log(`User Connect! ✅`);
  socket.nickname = "익명";
  io.sockets.emit("room_change", findPublicRooms());
  socket.onAny((event) => {
    // 어떠한 종류의 신호가 왔을 때든 모두 반응
    // console.log(io.sockets.adapter);
  });

  // 채팅 서비스
  socket.on("enter_room", (roomname, done) => {
    socket.join(roomname);
    done();
    socket.to(roomname).emit("welcome", socket.nickname, countRoom(roomname));
    io.sockets.emit("room_change", findPublicRooms());
  });
  socket.on("disconnecting", () => {
    // 끊어지는 중에 실행
    socket.rooms.forEach((room) => {
      socket.to(room).emit("bye", socket.nickname, countRoom(room) - 1);
      // 아직 떠나는 중이므로 인원 수에서 한명을 빼야 함
    });
  });
  socket.on("disconnect", () => {
    // 끊어진 직후 실행
    io.sockets.emit("room_change", findPublicRooms());
  });
  socket.on("new_message", (msg, roomname, done) => {
    msg = `${socket.nickname} : ${msg}`;
    socket.to(roomname).emit("new_message", msg);
    done();
  });
  socket.on("nickname", (nickname) => {
    socket["nickname"] = nickname;
  });

  //영통 서비스
  socket.on("enter_videoRoom", (roomName, done) => {
    socket.join(roomName);
    done();
    socket.to(roomName).emit("videoWelcome");
  });
  socket.on("offer", (offer, roomName) => {
    socket.to(roomName).emit("offer", offer);
  });
});

server.listen(3000, () => {
  console.log(`Listening on http://localhost:3000/`);
});
