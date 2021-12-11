import Phaser from 'phaser';
import { socket } from '../socket';
import Employee from '../containers/Employee';

let officeLayer;
export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
    this.state = {};
    this.overlappingSprites = {};
  }

  preload() {
    //PNG of Tilemap (The image of the tilemap that you used to build the map in Tiled application)
    //passed into this.load.image(phaserKey, pathToFile)
    const TILEMAP_PNG = 'assets/newmap.png';
    ///JSON file of exported Tilemap from Tiled
    //passed into this.load.tilemapTiledJSON(phaserKey, pathToFile)
    const TILEMAP_JSON = 'assets/newmap.json';
    this.load.image('office', TILEMAP_PNG);
    this.load.tilemapTiledJSON('map', TILEMAP_JSON);

    loadSpriteSheets(this);
  }

  create() {
    this.state.active = true;

    const scene = this;

    buildMap(scene);

    //CREATE SOCKET HERE//
    this.socket = socket;

    // CREATE OTHER PLAYERS GROUP
    this.coworkers = this.physics.add.group();

    //WHEN EMPLOYEE JOINS A ROOM -- SET STATE HERE
    this.socket.on('setState', function (state) {
      const { roomKey, employees, numEmployees } = state;

      scene.physics.world.enable(this);
      // scene.physics.world.setBounds(0, 0, 800, 600);

      // STATE FOR OFFICE
      scene.state.roomKey = roomKey;
      scene.state.employees = employees;
      scene.state.numEmployees = numEmployees;
    });

    // SOCKET LISTENER FOR CURRENT EMPLOYEES
    this.socket.on('currentEmployees', function (arg) {
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

    this.socket.on('newEmployee', function (arg) {
      const { employeeInfo, numEmployees } = arg;
      console.log('new employee', employeeInfo);
      scene.addCoworkers(scene, employeeInfo);
      scene.state.numEmployees = numEmployees;
    });

    // SOCKET LISTENER FOR EMPLOYEE MOVEMENT
    this.socket.on('coworkerMoved', function (employeeInfo) {
      scene.coworkers.getChildren().forEach(function (coworker) {
        if (employeeInfo.employeeId === coworker.employeeId) {
          coworker.setPosition(employeeInfo.x, employeeInfo.y);
          coworker.animate(employeeInfo.direction);
        }
      });
    });

    this.socket.on('coworkerStopped', function (employeeInfo) {
      scene.coworkers.getChildren().forEach(function (coworker) {
        if (employeeInfo.employeeId === coworker.employeeId) {
          coworker.anims.stop(null, true);
        }
      });
    });

    // LEAVE ROOM (not socket disconnection)
    this.socket.on('leftRoom', arg => {
      //remove all coworker avatars
      if (this.sprite) this.sprite.destroy();
      scene.coworkers.clear(true, true);
    });

    // DISCONNECT
    this.socket.on('coworker disconnected', function (arg) {
      const { coworkerId, numEmployees } = arg;
      scene.state.numEmployees = numEmployees;
      scene.coworkers.getChildren().forEach(function (coworker) {
        if (coworkerId === coworker.employeeId) {
          coworker.destroy();
        }
      });
    });

    ///////////////////////////////////////////////
    //set movement keys to arrow keys
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.physics.world.enable(this);
    this.physics.world.setBounds(0, 0, 800, 600);
    /************************ OVERLAP **************************/
  }

  //place all movement in here so actions can be recognized
  update(delta, time) {
    //delta - change in ms since last frame rendered - could be used with speed
    const scene = this;

    //employee movement
    if (this.sprite && this.sprite.body) {
      this.sprite.body.setVelocity(0);

      // left to right movements
      if (this.cursors.left.isDown) {
        this.sprite.left();
      } else if (this.cursors.right.isDown) {
        this.sprite.right();
      }

      //up and down movements
      if (this.cursors.up.isDown) {
        this.sprite.up();
      } else if (this.cursors.down.isDown) {
        this.sprite.down();
      }

      this.sprite.body.velocity.normalize().scale(this.sprite.speed);

      //iterates over children and add overlap
      //stange bug causing the callback to happen twice at each of the overlap
      this.coworkers.children.iterate(coworker =>
        // scene.addEmployeeOverlap(scene, coworker)
        scene.testOverlap(scene, coworker)
      );
      // check the coworkers we were previously overlapping with
      // remove any where that's no longer the case
      // this.checkOverlap(scene);
    }
  }
  //have to add a method on mainscene to add an employee --- used it in our create method

  addEmployee(scene, employeeInfo) {
    scene.joined = true;
    //the line below adds the sprite to the game map.
    scene.sprite = new Employee(scene, employeeInfo);
    // .setCollideWorldBounds(true);

    //Cameraplsworkthx
    const camera = this.cameras.main;
    camera.zoomX = 0.5;
    camera.zoomY = 0.5;
    camera.startFollow(this.sprite);

    //Set collision plsworkthx
    scene.physics.add.collider(scene.sprite, officeLayer);
  }
  addCoworkers(scene, employeeInfo) {
    employeeInfo.x += 30;
    employeeInfo.y += 30;

    const coworker = new Employee(scene, employeeInfo);

    coworker.employeeId = employeeInfo.employeeId;
    setTimeout(() => {
      let circleVisibility = scene.sprite.list[5].visible;
      coworker.list[5].setVisible(circleVisibility);
    }, 50);

    scene.coworkers.add(coworker);
  }

  testOverlap(scene, coworker) {
    // check if circles on my sprite and coworker's sprite is overlapping
    let myCircle = scene.sprite.getAt(5).getBounds();
    let coworkerCircle = coworker.getAt(5).getBounds();

    let overlapping = Phaser.Geom.Intersects.RectangleToRectangle(
      myCircle,
      coworkerCircle
    );

    //if overlapping -> add to overlappingSprite and show video
    if (overlapping) {
      this.overlappingSprites[coworker.employeeId] = coworker;
      const showVideoContainer = document.querySelector(
        `div#${CSS.escape(coworker.employeeId)}`
      );
      const showVideo = document.querySelector(
        `video#${CSS.escape(coworker.employeeId)}`
      );
      const nameElement = document.querySelector(
        `div#${CSS.escape(coworker.employeeId)} span`
      );
      // console.log(nameElement);
      if (showVideoContainer) {
        showVideoContainer.style.display = 'flex';
        showVideo.muted = false;
        nameElement.innerText === ''
          ? (nameElement.innerText = coworker.employeeName)
          : null;
      }
    } else {
      //if not overlapping -> remove from overlappingSprite and hide video
      delete this.overlappingSprites[coworker.employeeId];
      const hideVideoContainer = document.querySelector(
        `div#${CSS.escape(coworker.employeeId)}`
      );
      const hideVideo = document.querySelector(
        `video#${CSS.escape(coworker.employeeId)}`
      );
      if (hideVideoContainer) {
        hideVideoContainer.style.display = 'none';
        hideVideo.muted = true;
      }
    }
  }
}

function buildMap(scene) {
  //Dakota: Load map JSON from tiled we preloaded just above
  const map = scene.make.tilemap({ key: 'map' });
  //Add image of tileset using map.addTileSetImage(tilesetName, phaserKey)
  //Note: The tilesetName can be found in the JSON file exported from Tiled (likely in our assets folder)
  const tileset = map.addTilesetImage('newmap', 'office', 48, 48);

  //Below we create each layer just as they were created in tiled. By default tiled names layers things like "Tile Layer 1", but we can change this in Tiled!
  //map.createStaticLayer(layerNameFromTiled, tileset, x, y)

  officeLayer = map.createLayer('Tile Layer 1', tileset, 0, 0);

  //Set collision property (in this case I called it collide in tiled and set collision tiles to true)
  officeLayer.setCollisionByProperty({ collide: true });
}

function loadSpriteSheets(scene) {
  scene.load.spritesheet('employeeBody', 'assets/avatars/body.png', {
    frameWidth: 48,
    frameHeight: 96,
  });

  //All hairstyles are named hairstyle# like hairstyle1, hairstyle2, etc
  const hairstyleCount = 29;
  for (let i = 1; i <= hairstyleCount; i++) {
    scene.load.spritesheet(
      `hairStyle${i}`,
      `assets/avatars/hairstyles/hairstyle${i}.png`,
      {
        frameWidth: 48,
        frameHeight: 96,
      }
    );
  }

  //All outfits are named outfit# like outfit1, outfit2, etc
  const outfitCount = 10;
  for (let i = 1; i <= outfitCount; i++) {
    scene.load.spritesheet(
      `outfit${i}`,
      `assets/avatars/outfits/outfit${i}.png`,
      {
        frameWidth: 48,
        frameHeight: 96,
      }
    );
  }

  scene.load.spritesheet('eye', 'assets/avatars/eye.png', {
    frameWidth: 48,
    frameHeight: 96,
  });
}
