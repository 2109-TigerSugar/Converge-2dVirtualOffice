import Phaser from 'phaser';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import config from './config/config';
import MainScene from './scenes/MainScene';
import Lobby from './scenes/Lobby';


//Create socket to import elsewhere instead of attaching to window
export const socket = io();

// import { socket } from './components/Office';

// const webcamPanel = document.querySelector('.webcam-panel');
// const callList = {};

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

  // //Dakota: Ask for permission to use webcam :) We await because we have no clue when they will accept it!
  // navigator.getUserMedia =
  //   navigator.mediaDevices.getUserMedia ||
  //   navigator.webkitGetUserMedia ||
  //   navigator.mozGetUserMedia;
  // const stream = await navigator.mediaDevices.getUserMedia({
  //   video: true,
  //   audio: true,
  // });

  // //Build our webcam
  // addVideo(stream, true, socket.id);

  // //Dakota: Setup new peer object! Yay!
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

  // peer.on('open', (id) => {
  //   console.log('My peer ID is: ' + id);
  // });

  // //Answer calls :)
  // peer.on('call', (call) => {
  //   //Getting called  so answer
  //   call.answer(stream);

  //   //Got called and answered so build webcam panel
  //   call.on('stream', (remoteStream) => {
  //     if (callList[call.peer] === undefined) {
  //       addVideo(remoteStream, false, call.peer);
  //       callList[call.peer] = true;
  //     }
  //   });
  // });

  // //Dakota; Socket stuff

  // //Call new user when they join
  // socket.on('someoneJoined', (socketId) => {
  //   const call = peer.call(socketId, stream);

  //   //Other end answered call so build webcam panel
  //   call.on('stream', (remoteStream) => {
  //     if (callList[socketId] === undefined) {
  //       addVideo(remoteStream, false, socketId);
  //       callList[socketId] = true;
  //     }
  //   });
  // });

  // socket.on('socket disconnected', (socketId) => {
  //   // console.log(`${socketId} disconnected`);
  //   let videoToRemove = document.querySelectorAll(`#${socketId}`);
  //   videoToRemove.forEach((video) => video.remove());
  // });
};

// function addVideo(stream, mute, socketId) {
//   const videoElement = document.createElement('video');
//   // console.dir(stream);
//   videoElement.addEventListener('loadedmetadata', function (e) {
//     // console.log('onloadmetadata fired');
//     videoElement.play();
//     webcamPanel.appendChild(videoElement);
//     callList[socketId] = true;
//   });
//   videoElement.srcObject = stream;
//   videoElement.setAttribute('id', socketId);
//   videoElement.muted = mute;
// }

ReactDOM.render(<App />, document.getElementById('root'));
