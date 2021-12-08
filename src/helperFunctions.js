import Peer from 'peerjs';

// to show and hide webcam panels and game panels
export const hidePanels = () => {
  document.getElementById('mygame').style.display = 'none';
  document.querySelector('.webcam-panel').style.display = 'none';
};

export const showPanels = () => {
  document.getElementById('mygame').style.display = 'block';
  document.querySelector('.webcam-panel').style.display = 'flex';
};

// For webcam.js + Peer
export const createPeer = socketId => {
  const peer = new Peer(socketId, {
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
  return peer;
};

export const addVideo = (stream, hide, socketId, name = '') => {
  const webcamPanel = document.querySelector('.webcam-panel');
  const webcamController = document.querySelector('.webcam-controller');

  const videoElement = document.createElement('video');
  videoElement.addEventListener('loadedmetadata', function (e) {
    videoElement.play();
  });
  videoElement.srcObject = stream;
  videoElement.setAttribute('id', socketId);
  videoElement.muted = true;
  webcamPanel.appendChild(videoElement);

  videoElement.style.display = hide ? 'none' : 'inline';
  if (hide) console.log('coworker stream created', stream);
  else {
    // show the controller my stream is loaded
    webcamController.style.display = 'flex';
    console.log('my stream created', stream);
  }
};
