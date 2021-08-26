const socket = io();

const welcome = document.querySelector("#welcome");
const form = welcome.querySelector("form");

form.addEventListener("submit",(event)=>{
    event.preventDefault();
    const input = form.querySelector("input");
    socket.emit("enter_room",{ payload : input.value }, ()=>{
        console.log("프론트엔드에서 백엔드에 함수를 보냈습니다!");
    });
    input.value = "";
});