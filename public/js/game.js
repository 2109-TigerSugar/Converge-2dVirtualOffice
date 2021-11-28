const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
      gravity: { y: 0 },
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

const game = new Phaser.Game(config);

function preload() {
  this.load.image("avatar", "assets/maddie.png");
  this.load.image("otherPlayer", "assets/maddie.png");
  this.load.image("star", "assets/star_gold.png");
  this.load.image("office", "assets/office2.png");
}

function create() {
  const self = this;
  this.socket = io();
  this.add.image(0, 0, "office").setOrigin(0);
  this.otherPlayers = this.physics.add.group();

  this.socket.on("currentPlayers", function (players) {
    Object.keys(players).forEach(function (id) {
      if (players[id].playerId === self.socket.id) {
        addPlayer(self, players[id]);
      } else {
        addOtherPlayers(self, players[id]);
      }
      console.log("inside add players");
    });
  });
  this.socket.on("newPlayer", function (playerInfo) {
    addOtherPlayers(self, playerInfo);
  });
  this.socket.on("disconnected", function (playerId) {
    self.otherPlayers.getChildren().forEach(function (otherPlayer) {
      if (playerId === otherPlayer.playerId) {
        otherPlayer.destroy();
      }
    });
  });
  this.socket.on("playerMoved", function (playerInfo) {
    self.otherPlayers.getChildren().forEach(function (otherPlayer) {
      if (playerInfo.playerId === otherPlayer.playerId) {
        otherPlayer.setRotation(playerInfo.rotation);
        otherPlayer.setPosition(playerInfo.x, playerInfo.y);
      }
    });
  });
  this.cursors = this.input.keyboard.createCursorKeys();
}

function update() {
  if (this.avatar) {
    const speed = 100;
    this.avatar.body.setVelocity(0);

    if (this.cursors.left.isDown) {
      this.avatar.setVelocityX(-speed);
    } else if (this.cursors.right.isDown) {
      this.avatar.setVelocityX(speed);
    }

    if (this.cursors.up.isDown) {
      this.avatar.setVelocityY(-speed);
    } else if (this.cursors.down.isDown) {
      this.avatar.setVelocityY(speed);
    }

    // this.physics.world.wrap(this.avatar, 5);

    // emit player movement
    const x = this.avatar.x;
    const y = this.avatar.y;
    if (
      this.avatar.oldPosition &&
      (x !== this.avatar.oldPosition.x || y !== this.avatar.oldPosition.y)
    )
      this.socket.emit("playerMovement", {
        x: this.avatar.x,
        y: this.avatar.y,
      });

    // save old position data
    this.avatar.oldPosition = {
      x: this.avatar.x,
      y: this.avatar.y,
    };
  }
}

function addPlayer(self, playerInfo) {
  console.log("inside add player func");
  self.avatar = self.physics.add
    .image(playerInfo.x, playerInfo.y, "avatar")
    .setOrigin(0.5, 0.5)
    .setDisplaySize(53, 40);
}

function addOtherPlayers(self, playerInfo) {
  const otherPlayer = self.add
    .sprite(playerInfo.x, playerInfo.y, "otherPlayer")
    .setOrigin(0.5, 0.5)
    .setDisplaySize(53, 40);
  if (playerInfo.team === "blue") {
    otherPlayer.setTint(0x0000ff);
  } else {
    otherPlayer.setTint(0xff0000);
  }
  otherPlayer.playerId = playerInfo.playerId;
  self.otherPlayers.add(otherPlayer);
}
