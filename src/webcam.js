
const runWebRTC = async (socket, peer) => {
  const webcamPanel = document.querySelector('.webcam-panel');
  const webcamController = document.querySelector('.webcam-controller');

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

  // attach stream to window so we can use in Office.js
  window.myStream = stream;

  //Build our webcam
  addVideo(stream, false, socket.id);

  // show the controller my stream is loaded
  webcamController.style.display = 'flex';


  //Dakota: Setup new peer object! Yay!
  // const peer = new Peer(socket.id, {
  //   config: {
  //     iceServers: [
  //       { urls: 'stun:stun.l.google.com:19302' },
  //       {
  //         url: 'turn:numb.viagenie.ca',
  //         credential: 'muazkh',
  //         username: 'webrtc@live.com',
  //       },
  //     ],
  //     sdpSemantics: 'unified-plan',
  //   },
  // });

  // peer.on('open', id => {
  //   console.log('My peer ID is: ' + id);
  //   window.peer = peer;
  // });

  // const peer = window.peer;
  console.log('peer in webcam.js',peer)

  //Answer calls :)
  peer.on('call', call => {
    //Getting called  so answer
    call.answer(stream);

    //Got called and answered so build webcam panel
    call.on('stream', remoteStream => {
      console.log('stream after call.answer ');
      if (callList[call.peer] === undefined) {
        addVideo(remoteStream, true, call.peer);
        callList[call.peer] = true;
      }
    });
  });

  //Call new user when they join
  socket.on('newEmployee', ({ employeeInfo }) => {
    const socketId = employeeInfo.employeeId;
    console.log('peer', peer)
    console.log('socketid coworker', socketId)
    console.log('stream', stream)
    const call = peer.call(socketId, stream);
    console.log('Call just happened', call);

    //Other end answered call so build webcam panel
    call.on('stream', remoteStream => {
      console.log('stream after peer.call ');
      if (callList[socketId] === undefined) {
        addVideo(remoteStream, true, socketId);
        callList[socketId] = true;
      }
    });
  });

  socket.on('coworker disconnected', ({ coworkerId: socketId }) => {
    let videoToRemove = document.querySelectorAll(`#${CSS.escape(socketId)}`);
    videoToRemove.forEach(video => video.remove());
  });

  function addVideo(stream, hide, socketId) {
    const videoElement = document.createElement('video');
    videoElement.addEventListener('loadedmetadata', function (e) {
      videoElement.play();
    });
    webcamPanel.appendChild(videoElement);
    videoElement.srcObject = stream;
    videoElement.setAttribute('id', socketId);
    videoElement.muted = true;
    // videoElement.srcObject.getAudioTracks()[0].enabled = false;
    videoElement.style.display = hide ? 'none' : 'inline';
    if (hide) console.log('coworker stream created', stream)
    else console.log('my stream created', stream);
  }
};

export default runWebRTC;
