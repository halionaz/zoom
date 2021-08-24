const button = document.querySelector("button");

button.addEventListener("click",()=>{
    alert("Click!");
});

const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", ()=> {
    console.log("Connected to Server ✅");
});

socket.addEventListener("message",(message) => {
    console.log(`New message : "${message.data}"`);
});

socket.addEventListener("close",()=>{
    console.log("Disconnected from Server ❌");
} );

setTimeout(()=>{
    console.log("Send Message to Server");
    socket.send("Yallo, It's me mario!");
},5000);