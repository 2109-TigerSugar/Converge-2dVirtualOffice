import Peer from 'peerjs';

const runWebRTC = async socket => {
  const webcamPanel = document.querySelector('.webcam-panel');
  const callList = {};

  //Dakota: Ask for permission to use webcam :) We await because we have no clue when they will accept it!
  navigator.getUserMedia =
    navigator.mediaDevices.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });

  //Build our webcam
  addVideo(stream, true, socket.id);

  //Dakota: Setup new peer object! Yay!
  const peer = new Peer(socket.id, {
    config: {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        {
          url: 'turn:numb.viagenie.ca',
          credential: 'muazkh',
          username: 'webrtc@live.com',
        },
      ],
      sdpSemantics: 'unified-plan',
    },
  });

  peer.on('open', id => {
    console.log('My peer ID is: ' + id);
  });

  //Answer calls :)
  peer.on('call', call => {
    //Getting called  so answer
    call.answer(stream);

    //Got called and answered so build webcam panel
    call.on('stream', remoteStream => {
      console.log('stream after call.answer ');
      if (callList[call.peer] === undefined) {
        addVideo(remoteStream, false, call.peer);
        callList[call.peer] = true;
      }
    });
  });

  //Call new user when they join
  socket.on('newEmployee', ({ employeeInfo }) => {
    const socketId = employeeInfo.employeeId;
    const call = peer.call(socketId, stream);
    console.log('Call just happened');

    //Other end answered call so build webcam panel
    call.on('stream', remoteStream => {
      console.log('stream after peer.cal ');
      if (callList[socketId] === undefined) {
        addVideo(remoteStream, false, socketId);
        callList[socketId] = true;
      }
    });
  });

  socket.on('socket disconnected', socketId => {
    // console.log(`${socketId} disconnected`);
    let videoToRemove = document.querySelectorAll(`#${CSS.escape(socketId)}`);
    videoToRemove.forEach(video => video.remove());
  });

  function addVideo(stream, mute, socketId) {
    const videoElement = document.createElement('video');
    // console.dir(stream);
    videoElement.addEventListener('loadedmetadata', function (e) {
      // console.log('onloadmetadata fired');
      videoElement.play();
      // webcamPanel.appendChild(videoElement);
    });
    webcamPanel.appendChild(videoElement);
    videoElement.srcObject = stream;
    videoElement.setAttribute('id', socketId);
    videoElement.muted = mute;
  }
  console.log('done running webcam.js');
};

export default runWebRTC;
