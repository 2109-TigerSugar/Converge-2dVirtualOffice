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
    const TILEMAP_PNG = 'assets/potential.png';
    ///JSON file of exported Tilemap from Tiled
    //passed into this.load.tilemapTiledJSON(phaserKey, pathToFile)
    const TILEMAP_JSON = 'assets/potential.json';
    this.load.image('office', TILEMAP_PNG);
    this.load.tilemapTiledJSON('map', TILEMAP_JSON);

    this.load.spritesheet('employeeBody', 'assets/body.png', {
      frameWidth: 48,
      frameHeight: 96,
    });
    this.load.spritesheet('hairstyle1', 'assets/hair.png', {
      frameWidth: 48,
      frameHeight: 96,
    });

    this.load.spritesheet('outfit1', 'assets/outfit.png', {
      frameWidth: 48,
      frameHeight: 96,
    });
    this.load.spritesheet('eye', 'assets/eye.png', {
      frameWidth: 48,
      frameHeight: 96,
    });
  }

  create() {
    this.state.active = true;
    const scene = this;

    //Dakota: Load map JSON from tiled we preloaded just above
    const map = this.make.tilemap({ key: 'map' });
    //Add image of tileset using map.addTileSetImage(tilesetName, phaserKey)
    //Note: The tilesetName can be found in the JSON file exported from Tiled (likely in our assets folder)
    const tileset = map.addTilesetImage('potential', 'office', 48, 48);

    //Below we create each layer just as they were created in tiled. By default tiled names layers things like "Tile Layer 1", but we can change this in Tiled!
    //map.createStaticLayer(layerNameFromTiled, tileset, x, y)

    officeLayer = map.createLayer('Tile Layer 1', tileset, 0, 0);

    //Set collision property (in this case I called it collide in tiled and set collision tiles to true)
    officeLayer.setCollisionByProperty({ collide: true });

    // this.add.image(0, 0, 'office').setOrigin(0);

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
    this.coworkers = this.physics.add.group();
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
      scene.addCoworkers(scene, employeeInfo);
      scene.state.numEmployees = numEmployees;
    });

    // SOCKET LISTENER FOR EMPLOYEE MOVEMENT
    this.socket.on('employeeMoved', function (employeeInfo) {
      scene.coworkers.getChildren().forEach(function (coworker) {
        if (employeeInfo.employeeId === coworker.employeeId) {
          coworker.setPosition(employeeInfo.x, employeeInfo.y);
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

    // this.cursors = this.input.keyboard.createCursorKeys();

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
    const keys = scene.input.keyboard.createCursorKeys({
      // up: 'up',
      // down: 'down',
      // left: 'left',
      // right: 'right',
    }); // keys.up, keys.down, keys.left, keys.right
    this.cursors = keys;
    // this.cursors = this.input.keyboard.createCursorKeys();
    this.physics.world.enable(this);
    this.physics.world.setBounds(0, 0, 800, 600);
    /************************ OVERLAP **************************/
  }

  //place all movement in here so actions can be recognized
  update(delta, time) {
    //delta - change in ms since last frame rendered - could be used with speed
    const scene = this;

    //checking delta -- proximity

    //employee movement
    if (this.sprite) {
      const speed = 275;

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

      this.sprite.body.velocity.normalize().scale(speed);

      //emitting the movement with SOCKETS
      let x = this.sprite.x;
      let y = this.sprite.y;

      if (
        this.sprite.oldPosition &&
        (x !== this.sprite.oldPosition.x || y !== this.sprite.oldPosition.y)
      ) {
        this.moving = true;
        this.socket.emit('employeeMovement', {
          x: this.sprite.x,
          y: this.sprite.y,
          roomKey: scene.state.roomKey,
        });
      }

      // we have store the prior location of the sprite data
      this.sprite.oldPosition = {
        x: this.sprite.x,
        y: this.sprite.y,
        rotation: this.sprite.rotation,
      };

      //iterates over children and add overlap
      //look into coworkers.children.iterate()
      //stange bug causing the callback to happen twice at each of the overlap
      this.coworkers.children.iterate(coworker =>
        scene.addEmployeeOverlap(scene, coworker)
      );
      // check the coworkers we were previously overlapping with
      // remove any where that's no longer the case
      this.checkOverlap(scene);
    }
  }
  //have to add a method on mainscene to add an employee --- used it in our create method

  addEmployee(scene, employeeInfo) {
    scene.joined = true;
    //the line below adds the sprite to the game map.

    let testEmployeeInfo = {
      name: 'Kelsey',
      skinColor: 0xf0ddd7,
      eyeColor: 0x000000,
      hairStyle: 'hairstyle1',
      hairColor: 0xf1cc8f,
      outfitStyle: 'outfit1',
      x: 3400,
      y: 3600,
    };

    scene.sprite = new Employee(this, testEmployeeInfo);
    // .setCollideWorldBounds(true);
    console.log('employee Info', employeeInfo);

    scene.sprite.employeeId = employeeInfo.employeeId;
    //Cameraplsworkthx
    const camera = this.cameras.main;
    camera.zoomX = 0.5;
    camera.zoomY = 0.5;
    camera.startFollow(this.sprite);

    //Set collision plsworkthx
    this.physics.add.collider(this.sprite, officeLayer);
  }
  addCoworkers(scene, employeeInfo) {
    const coworker = scene.physics.add
      .sprite(employeeInfo.x + 40, employeeInfo.y + 40, employeeInfo.avatar)
      .setVisible(true);
    // .setCollideWorldBounds(true);
    coworker.employeeId = employeeInfo.employeeId;
    scene.coworkers.add(coworker);
  }
  // Add overlap for a pair of players
  addEmployeeOverlap(scene, coworker) {
    if (!coworker.collider) {
      coworker.collider = scene.physics.add.overlap(
        scene.sprite,
        coworker,
        scene.employeeOverlap,
        null,
        this
      );
    }
  }
  //callback for overlap
  employeeOverlap(employee, coworker) {
    const employeeBounds = employee.getBounds();

    const coworkerBounds = coworker.getBounds();

    if (
      !this.overlappingSprites[coworker.employeeId] &&
      Phaser.Geom.Intersects.RectangleToRectangle(
        employeeBounds,
        coworkerBounds
      )
    ) {
      this.overlappingSprites[coworker.employeeId] = coworker;

      const showId =
        this.socket.id === coworker.employeeId
          ? employee.employeeId
          : coworker.employeeId;

      const showVideo = document.querySelector(`#${CSS.escape(showId)}`);
      console.log(showVideo);
      if (showVideo) {
        showVideo.style.display = 'inline';
        showVideo.muted = false;
      }
    }
  }

  checkOverlap(scene) {
    const spriteBounds = scene.sprite.getBounds();
    Object.keys(scene.overlappingSprites).forEach(employeeId => {
      const coworker = scene.overlappingSprites[employeeId];
      const coworkerBounds = coworker.getBounds();
      // https://phaser.io/examples/v3/view/geom/intersects/get-rectangle-intersection
      // https://photonstorm.github.io/phaser3-docs/Phaser.Geom.Intersects.html
      if (
        !Phaser.Geom.Intersects.RectangleToRectangle(
          spriteBounds,
          coworkerBounds
        )
      ) {
        delete scene.overlappingSprites[employeeId];
        // console.log('NO LONGER OVERLAPPING');
        const hideVideo = document.querySelector(
          `#${CSS.escape(coworker.employeeId)}`
        );
        if (hideVideo) {
          hideVideo.style.display = 'none';
          hideVideo.muted = true;
        }
      }
    });
  }
}
