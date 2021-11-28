import Phaser from 'phaser';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import config from './config/config';
import MainScene from './scenes/MainScene';
import Lobby from './scenes/Lobby';
import Peer from 'peerjs';

//Create socket to import elsewhere instead of attaching to window
export const socket = io();

class Game extends Phaser.Game {
  constructor() {
    super(config);
    // << ADD ALL SCENES HERE >>
    this.scene.add('MainScene', MainScene);
    this.scene.add('Lobby', Lobby);
    // Start the game with the mainscene
    // << START GAME WITH MAIN SCENE HERE >>
    this.scene.start('MainScene');
  }
}
// Create new instance of game
window.onload = async function () {
  window.game = new Game();

  //Dakota: Ask for permission to use webcam :) We await because we have no clue when they will accept it!
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });

  //Build our webcam
  const video = document.createElement('video');
  const webcamPanel = document.querySelector('.webcam-panel');
  const displayVideo = webcamPanel.appendChild(video);
  displayVideo.autoplay = true;
  displayVideo.muted = true;
  if (stream) {
    displayVideo.srcObject = stream;
  }

  //Dakota: Setup new peer object! Yay!
  const peer = new Peer(socket.id);

  peer.on('open', id => {
    console.log('My peer ID is: ' + id);
  });

  //Answer calls :)
  peer.on('call', call => {
    //Getting called  so answer
    call.answer(stream);

    //Got called and answered so build webcam panel
    call.on('stream', remoteStream => {
      const remoteVideo = document.createElement('video');
      const displayRemoteVideo = webcamPanel.appendChild(remoteVideo);
      displayRemoteVideo.autoplay = true;
      displayRemoteVideo.srcObject = remoteStream;
    });
  });

  //ngrok http

  //Dakota; Socket stuff

  //Call new user when they join
  socket.on('someoneJoined', async socketId => {
    const call = await peer.call(socketId, stream);

    //Other end answered call so build webcam panel
    call.on('stream', remoteStream => {
      const remoteVideo = document.createElement('video');
      const displayRemoteVideo = webcamPanel.appendChild(remoteVideo);
      displayRemoteVideo.autoplay = true;
      displayRemoteVideo.srcObject = remoteStream;
    });
  });
};

ReactDOM.render(<App />, document.getElementById('root'));
