import Phaser from 'phaser';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import config from './config/config';
import MainScene from './scenes/MainScene';
import Lobby from './scenes/Lobby';

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

  //Dakota: Get our socket ID to use in peer connection. I added our socket to window in MainScene.js! :o
  const socketId = window.socket.id;
  console.log(socketId);

  //Dakota: Setup new peer object! Yay!
  const peer = new Peer(socketId);

  peer.on('open', id => {
    console.log('My peer ID is: ' + id);
  });
};

ReactDOM.render(<App />, document.getElementById('root'));
