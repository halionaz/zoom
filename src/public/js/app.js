// Vanilla JS Frontend

const messageList = document.querySelector("ul");
const messageForm = document.querySelector("#message");
const nickForm = document.querySelector("#nickName");

const socket = new WebSocket(`ws://${window.location.host}`);

function makeMessage(type, payload){
    const rocket = {type, payload};
    return JSON.stringify(rocket);
}

socket.addEventListener("open", ()=> {
    console.log("Connected to Server ✅");
});

socket.addEventListener("message",(message) => {
    const li = document.createElement("li");
    li.innerText = message.data;
    messageList.append(li);
});

socket.addEventListener("close",()=>{
    console.log("Disconnected from Server ❌");
} );


messageForm.addEventListener("submit",(event) => {
    event.preventDefault();
    const input = messageForm.querySelector("input");
    socket.send(makeMessage('message',input.value));
    input.value = "";
})

nickForm.addEventListener("submit",(event)=>{
    event.preventDefault();
    const input = nickForm.querySelector("input");
    socket.send(makeMessage('nickname',input.value));
    input.value = "";
})