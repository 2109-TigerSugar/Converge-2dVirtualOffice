// need to create a lobby instead of it starting on our Main Scene instance because we can pass it our socket so that we don't create a new one --- aka creating a new socket would tell our server we have another employee instead of connect the same -- it also lets us display the office background while entering

import Phaser from "phaser";

export default class Lobby extends Phaser.Scene {
  constructor() {
    super("Lobby");
    this.state = {};
    this.hasBeenSet = false;
  }

  //because we launched lobby in main scene aka we passed our socket to lobby--- you have to initialize it with phasers init() method
  init(data) {
    this.socket = data.socket;
  }

  preload() {
    //this is how we upload an html element into the phaser interface -- note: kelsey -- look up for react
    this.load.html("codeform", "assets/codeform.html");
  }

  create() {
    const scene = this;
    //we add css styling stuff here for pop up forms for phaser
    scene.popUp = scene.add.graphics();
    scene.boxes = scene.add.graphics();

    // for popup window
    scene.popUp.lineStyle(1, 0xffffff);
    scene.popUp.fillStyle(0xffffff, 0.5);

    // for boxes
    scene.boxes.lineStyle(1, 0xffffff);
    scene.boxes.fillStyle(0x303179, 1);

    // popup window
    scene.popUp.strokeRect(25, 25, 750, 500);
    scene.popUp.fillRect(25, 25, 750, 500);

    //title
    scene.title = scene.add.text(100, 75, "Virtual Office", {
      fill: "#303179",
      fontSize: "66px",
      fontStyle: "bold",
      fontFamily: "geneva",
      align: "center",
    });

    //left popup
    scene.boxes.strokeRect(100, 200, 275, 100);
    scene.boxes.fillRect(100, 200, 275, 100);
    scene.requestButton = scene.add.text(140, 215, "CLICK FOR CODE", {
      fill: "white",
      fontSize: "20px",
      fontFamily: "geneva",
      fontStyle: "bold",
    });

    //below we have a click event listener on the entire html codeform element, this checks to see if it was clicked then saves the input , emits the values from our socket with the identifier "isKeyValid" --- I have added a listener for this method in our server/socket/index.js
    //right popup
    scene.boxes.strokeRect(425, 200, 275, 100);
    scene.boxes.fillRect(425, 200, 275, 100);
    scene.inputElement = scene.add.dom(562.5, 250).createFromCache("codeform");
    scene.inputElement.addListener("click");
    scene.inputElement.on("click", function (event) {
      if (event.target.name === "enterRoom") {
        const input = scene.inputElement.getChildByName("code-form");
        scene.socket.emit("isKeyValid", input.value);
      }
      //another event listener -- ive added a corresponding listener on the socket/index.js -- alot of back and forth between front and backend sheesh
      scene.requestButton.setInteractive();
      scene.requestButton.on("pointerdown", () => {
        scene.socket.emit("getRoomCode");
      });

      scene.notValidText = scene.add.text(275, 330, "", {
        fill: "#ff0000",
        fontSize: "30px",
        fontStyle: "bold",
      });

      scene.roomKeyText = scene.add.text(180, 250, "", {
        fill: "pink",
        fontSize: "30px",
      });

      scene.socket.on("roomCreated", function (roomKey) {
        scene.roomKey = roomKey;
        scene.roomKeyText.setText(scene.roomKey);
      });
      //the below code also corresponds to server/socket/index isKeyValid
      scene.socket.on("keyNotValid", function () {
        scene.notValidText.setText("Invalid Room Key");
      });
      scene.socket.on("keyIsValid", function (input) {
        scene.socket.emit("joinRoom", input);
        scene.scene.stop("Lobby");
      });
    });
  }
  update() {}
}
