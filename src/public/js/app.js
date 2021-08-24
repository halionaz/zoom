const button = document.querySelector("button");

button.addEventListener("click",()=>{
    alert("Click!");
});

const socket = new WebSocket(`ws://${window.location.host}`);