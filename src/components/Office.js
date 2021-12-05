import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { socket } from '../socket';
import runWebRTC from '../webcam';

const Office = () => {
  const userData = JSON.parse(window.localStorage.getItem('userData'));

  useEffect(() => {
    // will show video panel and game panel
    document.getElementById('mygame').style.display = 'block';
    document.querySelector('.webcam-panel').style.display = 'flex';

    //starts peerjs code for video
    (async () => {
      if (window.peer) window.peer.reconnect();
      else await runWebRTC(socket);
    })();
    // when the user refreshes the page, make them join the room again if key exists
    if (userData && userData.roomKey) {
      socket.emit('doesKeyExist', userData.roomKey);
      socket.on('roomExistCheck', exists => {
        if (exists) {
          socket.emit('joinRoom', userData); //
        } else {
          alert(
            `room ${userData.roomKey} is invalid. Please join with another key.`
          );
        }
      });
    } else {
      alert(`Please create or join a room first.`);
    }

    // cleanup function
    return () => {
      // when going to another page, hide the webcam panel and phaser game
      document.getElementById('mygame').style.display = 'none';
      document.querySelector('.webcam-panel').style.display = 'none';
      // should disconnect peerJS so others can't see you anymore
      window.peer.disconnect();

      // leave the room when going office page unmounts
      socket.emit('leaveRoom', userData.roomKey);
    };
  });

  return (
    <div>
      <Link to="/">Back Home</Link>
    </div>
  );
};

export default Office;
