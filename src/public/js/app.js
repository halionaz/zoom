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
    const msgform = room.querySelector("form");
    msgform.addEventListener("submit",(event)=>{
        event.preventDefault();
        const message = room.querySelector("input");
        socket.emit("new_message",message.value, roomname, ()=>{
            addMessage(`You : ${message.value}`);
            message.value = "";
        });
    })
}

form.addEventListener("submit",(event)=>{
    event.preventDefault();
    const input = form.querySelector("input");
    roomname = input.value;
    socket.emit("enter_room",input.value, showRoom);
    input.value = "";
});

socket.on("welcome", ()=> {
    addMessage("Someone joined!");
})
socket.on("bye", ()=>{
    addMessage("someone say bye!");
})
socket.on("new_message", addMessage)