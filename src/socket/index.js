export const socket = io();

//  start the game once socket is connected
socket.on('connect', () => {
  console.log('socket connection ', socket.id)
  window.game.scene.start('MainScene');
  console.log('game started');
})
