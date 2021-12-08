import Phaser from 'phaser';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import config from './config/config';
import { socket } from './socket';
import MainScene from './scenes/MainScene';
import { hidePanels } from './helperFunctions';

//Create socket to import elsewhere instead of attaching to window
// export const socket = io();

export class Game extends Phaser.Game {
  constructor() {
    super(config);
    // << ADD ALL SCENES HERE >>
    this.scene.add('MainScene', MainScene);

    // Start the game with the mainscene
    // << START GAME WITH MAIN SCENE HERE >>
    this.scene.start('MainScene');
    console.log('MainScene started');
  }
}

// Create new instance of game
window.onload = async function () {
  hidePanels();

  ReactDOM.render(<App />, document.getElementById('root'));

  let buttons = document.querySelector('.buttonsAndForm');
  if (buttons) buttons.style.display = 'none';
};
