import Phaser from "phaser";
import { socket } from "../index";

export default class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
    this.state = {};
  }

  preload() {
    this.load.image("avatar", "assets/maddie.png");
    this.load.image("office", "assets/office2.png");
  }

  create() {
    const scene = this;

    this.add.image(0, 0, "office").setOrigin(0);

    //CREATE SOCKET HERE//
    this.socket = socket;

    //THIS WILL LAUNCH THE LOBBY
    scene.scene.launch("Lobby", { socket: scene.socket });

    // CREATE OTHER EMPLOYEES AKA COWORKERS
    this.coworkers = this.physics.add.group();

    //WHEN EMPLOYEE JOINS A ROOM -- SET STATE HERE
    this.socket.on("setState", function (state) {
      const { roomKey, employees, numEmployees } = state;
      scene.physics.resume();

      // STATE FOR OFFICE
      scene.state.roomKey = roomKey;
      scene.state.employees = employees;
      scene.state.numEmployees = numEmployees;
    });

    // SOCKET LISTENER FOR CURRENT EMPLOYEES
    this.socket.on("currentEmployees", function (arg) {
      const { employees, numEmployees } = arg;

      scene.state.numEmployees = numEmployees;

      Object.keys(employees).forEach(function (id) {
        if (employees[id].employeeId === scene.socket.id) {
          scene.addEmployee(scene, employees[id]);
        } else {
          scene.addCoworkers(scene, employees[id]);
        }
      });
    });

    // SOCKET LISTENER FOR NEW EMPLOYEE

    this.socket.on("newEmployee", function (arg) {
      const { employeeInfo, numEmployees } = arg;
      scene.addCoworkers(scene, employeeInfo);
      scene.state.numEmployees = numEmployees;
    });

    // SOCKET LISTENER FOR EMPLOYEE MOVEMENT
    this.socket.on("employeeMoved", function (employeeInfo) {
      scene.coworkers.getChildren().forEach(function (coworker) {
        if (employeeInfo.employeeId === coworker.employeeId) {
          const oldX = coworker.x;
          const oldY = coworker.y;
          coworker.setPosition(employeeInfo.x, employeeInfo.y);
        }
      });
    });

    this.socket.on("coworkerStopped", function (employeeInfo) {
      scene.coworkers.getChildren().forEach(function (coworker) {
        if (employeeInfo.employeeId === coworker.employeeId) {
          coworker.anims.stop(null, true);
        }
      });
    });
    this.cursors = this.input.keyboard.createCursorKeys();
    // DISCONNECT
    this.socket.on("disconnected", function (arg) {
      const { employeeId, numEmployees } = arg;
      scene.state.numEmployees = numEmployees;
      scene.coworkers.getChildren().forEach(function (coworker) {
        if (employeeId === coworker.employeeId) {
          coworker.destroy();
        }
      });
    });
  }

  //place all movement in here so actions can be recognized
  update(delta, time) {
    //delta - change in ms since last frame rendered - could be used with speed
    const scene = this;

    //checking delta -- proximity

    //employee movement
    if (this.avatar) {
      const speed = 100;

      this.avatar.body.setVelocity(0);

      // left to right movements
      if (this.cursors.left.isDown) {
        this.avatar.body.setVelocityX(-speed);
      } else if (this.cursors.right.isDown) {
        this.avatar.body.setVelocityX(speed);
      }

      //up and down movements
      if (this.cursors.up.isDown) {
        this.avatar.body.setVelocityY(-speed);
      } else if (this.cursors.down.isDown) {
        this.avatar.body.setVelocityY(speed);
      }

      this.avatar.body.velocity.normalize().scale(speed);

      //emitting the movement with SOCKETS
      let x = this.avatar.x;
      let y = this.avatar.y;

      if (
        this.avatar.oldPosition &&
        (x !== this.avatar.oldPosition.x || y !== this.avatar.oldPosition.y)
      ) {
        this.moving = true;
        this.socket.emit("employeeMovement", {
          x: this.avatar.x,
          y: this.avatar.y,
          roomKey: scene.state.roomKey,
        });
      }

      // we have store the prior location of the avatar data
      this.avatar.oldPosition = {
        x: this.avatar.x,
        y: this.avatar.y,
        rotation: this.avatar.rotation,
      };
    }
  }

  //have to add a method on mainscene to add an employee --- used it in our create method

  addEmployee(scene, employeeInfo) {
    scene.joined = true;
    scene.avatar = scene.physics.add
      .sprite(employeeInfo.x, employeeInfo.y, "avatar")
      .setScale(0.2);
  }

  //adding this method here if the socket id is not our own aka its another employee/coworker we need to use a different method to add them ---- need to look into if this where we could choose different avatars --- maybe store a bunch in an array and randomly generate image??
  addCoworkers(scene, employeeInfo) {
    const coworker = scene.add
      .sprite(employeeInfo.x + 40, employeeInfo.y + 40, "avatar")
      .setScale(0.2);

    coworker.employeeId = employeeInfo.employeeId;
    scene.coworkers.add(coworker);
  }
}
