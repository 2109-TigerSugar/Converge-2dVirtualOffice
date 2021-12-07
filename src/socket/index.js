import Peer from 'peerjs';
export const socket = io();


//  start the game once socket is connected
socket.on('connect', () => {
  console.log('socket connection ', socket.id);


  // makes the peer once socket is connected

  window.peer = makePeer(socket.id)

  // start the game scene once once both peer and socket is connected
  window.game.scene.start('MainScene');
  console.log('game started');


});

export const makePeer = (socketId) => {
  const peer = new Peer(socket.id, {
    config: {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        {
          url: 'turn:numb.viagenie.ca',
          credential: 'muazkh',
          username: 'webrtc@live.com',
        },
      ],
      sdpSemantics: 'unified-plan',
    },
  });

  peer.on('open', id => {
    console.log('My peer ID is: ' + id);
    // window.peer = peer;
  });
  return peer;

}
