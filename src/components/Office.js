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
    console.log(userData)
    if (userData && userData.roomKey) {
      console.log(socket)
      socket.emit('doesKeyExist', userData.roomKey);
      socket.on('roomKeyExists', (exists) => {
        if(exists) {
          socket.emit('joinRoom', userData.roomKey);
        } else {
          alert(`room ${userData.roomKey} is invalid. Please join with another key.`);
        }
      })
    }
  }, []);

  return (
    <div>
      <Link to="/">Back Home</Link>
    </div>
  );
};

export default Office;
