import Phaser from "phaser";
import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import config from "./config/config";
import MainScene from "./scenes/MainScene";
import Lobby from "./scenes/Lobby";

class Game extends Phaser.Game {
  constructor() {
    super(config);
    // << ADD ALL SCENES HERE >>
    this.scene.add("MainScene", MainScene);
    this.scene.add("Lobby", Lobby);
    // Start the game with the mainscene
    // << START GAME WITH MAIN SCENE HERE >>
    this.scene.start("MainScene");
  }
}
// Create new instance of game
window.onload = function () {
  window.game = new Game();
};

ReactDOM.render(<App />, document.getElementById("root"));
