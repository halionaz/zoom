const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.querySelector("#mute");
const cameraBtn = document.querySelector("#camera");
const welcome = document.querySelector("#welcome");
const call = document.querySelector("#call");

call.hidden = true;

let myStream;
let muted = false;
let cameraOff = false;
let roomName;

// async function getCameras(){
//     try{
//         const devices = await navigator.mediaDevices.enumerateDevices();
//         const cameras = devices.filter((device)=>{
//             return device.kind === "videoinput"
//         })
//         console.log(cameras);
//     } catch(e){
//         console.log(e);
//     }
// }

async function getMedia(){
    try {
        myStream = await navigator.mediaDevices.getUserMedia({
            // audio: true,
            video: true,
        });
        myFace.srcObject = myStream;
        // await getCameras();
        // console.log(myStream);
    } catch(e){
        console.log(e);
    }
}

function startMedia(){
    welcome.hidden = true;
    call.hidden = false;
    getMedia();
}


muteBtn.addEventListener("click",()=>{
    if(!muted){
        muteBtn.innerText = "음소거 해제";
        muted = true;
    } else {
        muteBtn.innerText = "음소거";
        muted = false;
    }
    myStream.getAudioTracks().forEach((track) => {
        track.enabled = !muted
    });
})
cameraBtn.addEventListener("click",()=>{
    if(!cameraOff){
        cameraBtn.innerText = "카메라 켜기";
        cameraOff = true;
    } else {
        cameraBtn.innerText = "카메라 끄기";
        cameraOff = false;
    }
    myStream.getVideoTracks().forEach((track) => {
        track.enabled = !cameraOff;
    });
})

welcome.querySelector("form").addEventListener("submit",(event)=>{
    event.preventDefault();
    const input = welcome.querySelector("input");
    roomName = input.value;
    socket.emit("enter_videoRoom",roomName, startMedia);
    input.value = "";
})

socket.on("videoWelcome", () =>{
    console.log("Someone Join");
})