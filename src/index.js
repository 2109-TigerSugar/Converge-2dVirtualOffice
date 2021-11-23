import Phaser from 'phaser';

class MyGame extends Phaser.Scene {
  constructor() {
    super();
  }

  preload() {
    this.load.image('office', './assets/office2.png');
    this.load.image('avatar', './assets/maddie.png');
  }

  create() {
    //Kelsey:adding our office background -- feel free to change
    this.add.image(0, 0, 'office').setOrigin(0);
    //Kelsey:adding our avatar -- feel free to change
    this.avatar = this.add.image(200, 300, 'avatar'); // Setting position X Y
    this.avatar.setScale(0.2); // Setting size scale
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);

    this.keyD = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.RIGHT
    );

    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);

    this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
  }
  update(delta) {
    if (this.keyA.isDown) {
      this.avatar.x -= 2;
    }
    if (this.keyD.isDown) {
      this.avatar.x += 2;
    }
    if (this.keyW.isDown) {
      this.avatar.y -= 2;
    }
    if (this.keyS.isDown) {
      this.avatar.y += 2;
    }
  }
}

const config = {
  type: Phaser.AUTO,
  parent: 'mygame',
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: MyGame,
};

const game = new Phaser.Game(config);
