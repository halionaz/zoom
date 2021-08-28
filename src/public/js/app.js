const socket = io();

const welcome = document.querySelector("#welcome");
const form = welcome.querySelector("form"); 
const room = document.querySelector("#room");
room.hidden = true;

let roomname;

function addMessage(msg){
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = msg;
    ul.appendChild(li);

}

function showRoom(){
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomname}`;
    const msgform = room.querySelector("#msg");
    const nameform = room.querySelector("#nickname");
    msgform.addEventListener("submit",(event)=>{
        event.preventDefault();
        const message = msgform.querySelector("input");
        socket.emit("new_message",message.value, roomname, ()=>{
            addMessage(`You : ${message.value}`);
            message.value = "";
        });
    });
    nameform.addEventListener("submit",(event)=>{
        event.preventDefault();
        const nickname = nameform.querySelector("input");
        socket.emit("nickname", nickname.value);
        nickname.value = "";
    });
}

form.addEventListener("submit",(event)=>{
    event.preventDefault();
    const input = form.querySelector("input");
    roomname = input.value;
    socket.emit("enter_room",input.value, showRoom);
    input.value = "";
});

socket.on("welcome", (nickname)=> {
    addMessage(`${nickname} joined!`);
})
socket.on("bye", (nickname)=>{
    addMessage(`${nickname} say bye!`);
})
socket.on("new_message", addMessage);
socket.on("room_change", (rooms) => {
    const roomList = welcome.querySelector("ul");
    roomList.innerHTML = "";
    rooms.forEach((room) => {
        const li = document.createElement("li");
        li.innerText = room;
        roomList.append(li);
    });
});