import Phaser from 'phaser';

class Employee extends Phaser.GameObjects.Container {
  constructor(scene, employeeInfo) {
    super(
      scene,
      employeeInfo.x,
      employeeInfo.y,
      getChildren(scene, employeeInfo)
    );
    this.scene = scene; // so we can have reference to main scene outside of constructor
    this.setSize(48, 96); //container needs a size to enable physics
    this.speed = 275; //easily change our walking speed
    scene.physics.world.enable(this); //now we can use this.body
    console.log(this.body); //can be used later on: this.body.setVelocity..etc

    // All animation setup!
    this.list.forEach(sprite => {
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
    console.log(this);
  }

  left() {
    this.body.setVelocityX(-this.speed);
    this.list.forEach(sprite => {
      if (sprite.type === 'Sprite') {
        sprite.anims.play('walkLeftRight', true);
        sprite.flipX = true;
      }
    });
  }
  right() {
    this.body.setVelocityX(this.speed);
    this.list.forEach(sprite => {
      if (sprite.type === 'Sprite') {
        sprite.anims.play('walkLeftRight', true);
        sprite.flipX = false;
      }
    });
  }
  up() {
    this.body.setVelocityY(-this.speed);
    this.list.forEach(sprite => {
      if (sprite.type === 'Sprite') {
        sprite.anims.play('walkUp', true);
      }
    });
  }
  down() {
    this.body.setVelocityY(this.speed);
    this.list.forEach(sprite => {
      if (sprite.type === 'Sprite') {
        sprite.anims.play('walkDown', true);
      }
    });
  }

  // ...
}

function getChildren(scene, employeeInfo) {
  let { hairStyle, hairColor, skinColor, eyeColor, outfitStyle, name } =
    employeeInfo;

  //body (applying tint to the one spritesheet)
  const body = scene.add.sprite(0, 0, 'employeeBody');
  body.setTintFill(skinColor);

  const eye = scene.add.sprite(0, 0, 'eye');
  eye.setTintFill(eyeColor);

  //hair (x number of hairstyles, apply tint to whichever they choose)
  const hair = scene.add.sprite(0, 0, hairStyle);
  hair.setTintFill(hairColor);

  //outfit (x number of outfits)
  const outfit = scene.add.sprite(0, 0, outfitStyle);

  const userName = scene.add.text(-25, -50, name, {
    font: '16px Courier',
    fill: '#0f0f',
  });

  //return all sprites in children array
  return [body, eye, hair, outfit, userName];
}

export default Employee;
