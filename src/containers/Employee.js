import Phaser from 'phaser';
import { socket } from '../socket';

class Employee extends Phaser.GameObjects.Container {
  constructor(scene, employeeInfo) {
    super(
      scene,
      employeeInfo.x,
      employeeInfo.y,
      getChildren(scene, employeeInfo)
    );
    this.scene = scene; // so we can have reference to main scene outside of constructor
    this.setSize(48, 60); //container needs a size to enable physics
    this.speed = 275; //easily change our walking speed
    scene.physics.world.enable(this); //now we can use this.body

    this.employeeId = employeeInfo.employeeId;
    this.employeeName = employeeInfo.name;
    this.roomKey = employeeInfo.roomKey;

    // All animation setup!
    this.list.forEach((sprite) => {
      if (sprite.type === 'Sprite') {
        const spriteName = sprite.texture.key;

        //Left/Right
        sprite.anims.create({
          key: 'walkLeftRight',
          frames: sprite.anims.generateFrameNumbers(spriteName, {
            start: 114,
            end: 117,
          }),
          frameRate: 10,
          repeat: 0,
        });
        sprite.anims.create({
          key: 'walkUp',
          frames: sprite.anims.generateFrameNumbers(spriteName, {
            start: 118,
            end: 123,
          }),
          frameRate: 10,
          repeat: 0,
        });
        sprite.anims.create({
          key: 'walkDown',
          frames: sprite.anims.generateFrameNumbers(spriteName, {
            start: 130,
            end: 135,
          }),
          frameRate: 10,
          repeat: 0,
        });
      }
    });

    scene.add.existing(this); // will add our container to our scene
  }

  left() {
    this.body.setVelocityX(-this.speed);
    this.animate('left');
    emitMovement('left', this);
  }

  right() {
    this.body.setVelocityX(this.speed);
    this.animate('right');
    emitMovement('right', this);
  }

  up() {
    this.body.setVelocityY(-this.speed);
    this.animate('up');
    emitMovement('up', this);
  }

  down() {
    this.body.setVelocityY(this.speed);
    this.animate('down');
    emitMovement('down', this);
  }

  animate(direction) {
    this.list.forEach((sprite) => {
      if (sprite.type === 'Sprite') {
        //Left Or Right
        if (direction === 'left' || direction === 'right') {
          sprite.anims.play('walkLeftRight', true);
          sprite.flipX = direction === 'left' ? true : false;
        } else {
          const animationName = direction === 'up' ? 'walkUp' : 'walkDown';
          sprite.anims.play(animationName, true);
        }
      }
    });
  }
}

function getChildren(scene, employeeInfo) {
  let {
    hairStyle,
    hairColor,
    skinColor,
    eyeColor,
    proximityColor,
    outfit,
    name,
  } = employeeInfo;

  //body (applying tint to the one spritesheet)
  const body = scene.add.sprite(0, 0, 'employeeBody');
  body.setTintFill(skinColor);

  const eye = scene.add.sprite(0, 0, 'eye');
  eye.setTintFill(eyeColor);

  //hair (x number of hairstyles, apply tint to whichever they choose)
  const hair = scene.add.sprite(0, 0, hairStyle);
  hair.setTintFill(hairColor);

  //outfit (x number of outfits)
  const outfitStyle = scene.add.sprite(0, 0, outfit);

  const userName = scene.add
    .text(0, -50, name, {
      font: '30px Courier',
      fill: '#FFFFFF',
    })
    .setOrigin(0.5)
    .setBackgroundColor('#000000');

  const circle = scene.add.circle(0, 0, 160);
  circle.setStrokeStyle(2, proximityColor);
  circle.employeeId = employeeInfo.employeeId;
  circle.setVisible(false);

  //return all sprites in children array
  return [body, eye, hair, outfitStyle, userName, circle];
}

// take in direction
// emit employeeMovement event : x, y, roomKey, direction

function emitMovement(direction, employee) {
  let { x, y, roomKey } = employee;

  socket.emit('employeeMovement', {
    x,
    y,
    roomKey,
    direction,
  });
}

export default Employee;
