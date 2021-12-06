import React, { useEffect, useState } from 'react';
import Popup from './Popup';
import { Link } from 'react-router-dom';
import { socket } from '../socket';
import runWebRTC from '../webcam';

const Office = () => {
  const userData = JSON.parse(window.localStorage.getItem('userData'));
  console.log(socket);

  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

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
      socket.on('roomExistCheck', (exists) => {
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
      socket.emit('leaveRoom', userData.roomKey);
    };
  });

  return (
    <div>
      <div id="header">
        <div id="nav">
          <ul>
            <li className="button-two">
              <Link to="/"> Switch Room </Link>
            </li>

            <li className="button-three">
              <a onClick={togglePopup}> How To Play </a>
            </li>

            <li className="button-four">
              <a href="assets/potentialcropped.png">Map</a>
            </li>
          </ul>
        </div>
      </div>

      {isOpen && (
        <Popup
          content={
            <>
              <b>Instructions</b>
              <div>
                <div id="arrows-container">
                  <img className="arrows" src="assets/keys.png" />
                </div>
                <div id="arrow-instructions">
                  <p>Walk around your office with your arrow keys!</p>
                </div>
                <div id="coworker-container">
                  <img className="coworkers" src="assets/coworkers.png" />
                </div>
              </div>
            </>
          }
          handleClose={togglePopup}
        />
      )}
    </div>
  );
};

export default Office;
