import Phaser from 'phaser';

// class Employee extends Phaser.GameObjects.Container {
//   constructor(scene, x, y, children) {
//     super(scene, x, y, children);
//     this.x = x;
//     this.y = y;
//     scene.add.existing(this);
//   }

//   //employee stuff
// }

function buildEmployee(skinTone, hairStyle, hairColor, outfit) {
  const employee = this.add.container(0, 0);

  //body (applying tint to the one spritesheet)
  const body = this.add.sprite(0, 0, 'employeeBody');
  body.setTintFill(skinTone);

  //hair (x number of hairstyles, apply tint to whichever they choose)
  const hair = this.add.sprite(0, 0, hairStyle);
  hair.setTintFill(hairColor);

  //outfit (x number of outfits)
  const outfit = this.add.sprite(0, 0, outfit);

  //Add all sprites as children
  employee.add([body, hair, outfit]);
}

export default buildEmployee;
