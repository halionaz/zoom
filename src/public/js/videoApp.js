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
let myPeerConnection;

// 카메라 전환
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

async function getMedia() {
    try {
        myStream = await navigator.mediaDevices.getUserMedia({
            // audio: true,
            video: true,
        });
        myFace.srcObject = myStream;
        // await getCameras();
        // console.log(myStream);
    } catch (e) {
        console.log(e);
    }
}

async function startMedia() {
    welcome.hidden = true;
    call.hidden = false;
    await getMedia();
    makeConnection();
}

muteBtn.addEventListener("click", () => {
    if (!muted) {
        muteBtn.innerText = "음소거 해제";
        muted = true;
    } else {
        muteBtn.innerText = "음소거";
        muted = false;
    }
    myStream.getAudioTracks().forEach((track) => {
        track.enabled = !muted;
    });
});
cameraBtn.addEventListener("click", () => {
    if (!cameraOff) {
        cameraBtn.innerText = "카메라 켜기";
        cameraOff = true;
    } else {
        cameraBtn.innerText = "카메라 끄기";
        cameraOff = false;
    }
    myStream.getVideoTracks().forEach((track) => {
        track.enabled = !cameraOff;
    });
});

welcome.querySelector("form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const input = welcome.querySelector("input");
    await startMedia();
    roomName = input.value;
    socket.emit("enter_videoRoom", roomName);
    input.value = "";
});

// Socket Code

socket.on("videoWelcome", async () => {
    const offer = await myPeerConnection.createOffer();
    myPeerConnection.setLocalDescription(offer);
    socket.emit("offer", offer, roomName);
});

socket.on("offer", async (offer) => {
    myPeerConnection.setRemoteDescription(offer);
    const answer = await myPeerConnection.createAnswer();
    myPeerConnection.setLocalDescription(answer);
    socket.emit("answer", answer, roomName);
});

socket.on("answer", (answer) => {
    myPeerConnection.setRemoteDescription(answer);
});

socket.on("ice",(ice) => {
    myPeerConnection.addIceCandidate(ice);
})

// WebRTC Code

function makeConnection() {
    myPeerConnection = new RTCPeerConnection();
    myPeerConnection.addEventListener("icecandidate", handleIce);
    myPeerConnection.addEventListener("addstream",handleAddStream);
    myStream.getTracks().forEach((track) => {
        myPeerConnection.addTrack(track, myStream);
    });
}

function handleIce(data) {
    socket.emit("ice", data.candidate, roomName);
}

function handleAddStream(data){
    const peerFace = document.querySelector("#peerFace");
    peerFace.srcObject = data.stream;
}