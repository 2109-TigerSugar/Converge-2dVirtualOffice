import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { socket } from '../socket';
import runWebRTC from '../webcam';

const Office = () => {
  const userData = JSON.parse(window.localStorage.getItem('userData'));
  console.log(socket)

  useEffect(() => {
    // will show the webcam panel and phaser game
    document.getElementById('mygame').style.display = 'block';
    document.querySelector('.webcam-panel').style.display = 'flex';
    (async () => {
      console.log('running webrtc');
      await runWebRTC(socket); //starts peerjs code for video
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
    }

    // cleanup function
    return () => {
      // when going to another page, hide the webcam panel and phaser game
      document.getElementById('mygame').style.display = 'none';
      document.querySelector('.webcam-panel').style.display = 'none';
      let myVideo = document.querySelector(`#${CSS.escape(socket.id)}`);
      myVideo.remove();

      // leave the room when going office page unmounts
      socket.emit('leaveRoom', userData.roomKey )



    };
  });

  return (
    <div>
      <Link to="/">Back Home</Link>
    </div>
  );
};

export default Office;
