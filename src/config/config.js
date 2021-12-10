// here is where we are initializing our Phaser game settings //

export default {
  type: Phaser.AUTO, // Specify the underlying browser rendering engine (AUTO, CANVAS, WEBGL)
  // AUTO will attempt to use WEBGL, but if not available it'll default to CANVAS
  width: 1280, // Game width in pixels
  height: 720, // Game height in pixels
  render: {
    pixelArt: true,
  },
  scale: {
    parent: 'mygame',
    autoCenter: true,
  },
  //  We will be expanding physics later
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 }, // Game objects will be pulled down along the y-axis
      // The number 1500 is arbitrary. The higher, the stronger the pull.
      // A negative value will pull game objects up along the y-axis
      debug: false, // Whether physics engine should run in debug mode
    },
  },
  dom: {
    createContainer: true,
  },
  scene: [],
};
