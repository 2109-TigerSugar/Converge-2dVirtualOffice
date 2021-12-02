import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { socket } from '..';
import runWebRTC from '../webcam';

const Office = () => {
  const userData = JSON.parse(window.localStorage.getItem('userData'));
  useEffect(() => {
    document.getElementById('mygame').style.display = 'block';
    document.querySelector('.webcam-panel').style.display = 'flex';

    (async () => {
      await runWebRTC(socket);
    })();
    if (userData && userData.roomKey) {
      socket.emit('doesKeyExist', userData.roomKey);
      socket.on('roomKeyExists', (exists) => {
        if(exists) {
          socket.emit('joinRoom', userData.roomKey);
        } else {
          alert(`room ${userData.roomKey} is invalid. Please join with another key.`);
        }
      })
    }

    return () =>{
      // when going to another page, hide the webcam panel and phaser game
      alert('unmounting office react component')
      document.getElementById('mygame').style.display = 'none';
    document.querySelector('.webcam-panel').style.display = 'none';

    }


  }, []);

  return (
    <div>
      <Link to="/">Back Home</Link>
    </div>
  );
};

export default Office;
