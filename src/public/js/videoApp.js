const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.querySelector("#mute");
const cameraBtn = document.querySelector("#camera");

let myStream;
let muted = false;
let cameraOff = false;

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

getMedia();

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