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

    // this.children = getChildren(scene, employeeInfo);

    this.spriteParts = {};
    //[body, eye, hair, outfit, userName];
    // this.spriteParts.body = this.children[0];
    // this.spriteParts.eye = this.children[1];
    // this.spriteParts.hair = this.children[2];
    // this.spriteParts.outfit = this.children[3];
    // this.spriteParts.userName = this.children[4];

    // let config;
    // config = {
    //   key: 'walkLeftRight',
    //   frames: this.spriteParts.body.anims.generateFrameNumbers('employeeBody', {
    //     start: 112,
    //     end: 117,
    //   }),
    //   frameRate: 10,
    //   repeat: 0,
    // };
    // console.log(config);
    // scene.anims.create(config);
    this.list.forEach(sprite => {
      if (sprite.type === 'Sprite') {
        const spriteName = sprite.texture.key;
        //Left/Right
        scene.anims.create({
          key: 'walkLeftRight',
          frames: sprite.anims.generateFrameNumbers(spriteName, {
            start: 112,
            end: 117,
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
    // this.spriteParts.body.anims.play('walkLeftRight', true);
    this.list.forEach(sprite => {
      if (sprite.type === 'Sprite') {
        sprite.anims.play('walkLeftRight', true);
      }
    });
    this.flipX = false;
  }
  // ...

  // All animation setup!

  // this.scene.anims.create({
  //   key: 'walkUp',
  //   frames: this.anims.generateFrameNumbers(avatarChoice, {
  //     start: 118,
  //     end: 123,
  //   }),
  //   frameRate: 10,
  //   repeat: 0,
  // });

  // this.scene.anims.create({
  //   key: 'walkDown',
  //   frames: this.anims.generateFrameNumbers(avatarChoice, {
  //     start: 130,
  //     end: 135,
  //   }),
  //   frameRate: 10,
  //   repeat: 0,
  // });
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
