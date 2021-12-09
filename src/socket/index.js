import Peer from 'peerjs';
import { Game } from '..';
export const socket = io();

//  start the game once socket is connected
socket.on('connect', () => {
  console.log('socket connection ', socket.id);

  let buttons = document.querySelector('.buttonsAndForm');
  if (buttons) buttons.style.display = 'flex';
  // console.log('buttons shown');
  if (window.location.pathname === '/office') {
    window.location.replace(window.location.origin);
  } else window.game = new Game();
});

// socket.on('newEmployee', ({ employeeInfo }) => {
//   console.log('current peer', window.peer);
// });
