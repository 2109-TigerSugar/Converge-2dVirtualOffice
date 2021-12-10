import React, { useEffect, useState } from 'react';
import Popup from './Popup';
import { Link } from 'react-router-dom';
import { socket, makePeer } from '../socket';
import runWebRTC from '../webcam';
import { hidePanels, showPanels } from '../helperFunctions';
import NameDisplay from './NameDisplay';
import { useLocation } from 'react-router';
import NameList from './NameList';

const Office = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const { state: userData } = useLocation();

  const toggleVideo = () => {
    const stopVideo = document.querySelector('#stopVideo');
    const myStream = window.myStream;
    const enabled = myStream.getVideoTracks()[0].enabled;
    let newHTML;
    if (enabled) {
      myStream.getVideoTracks()[0].enabled = false;
      newHTML = `<i class="fas fa-video-slash"></i>`;
      stopVideo.classList.toggle('background__red');
      stopVideo.innerHTML = newHTML;
    } else {
      myStream.getVideoTracks()[0].enabled = true;
      newHTML = `<i class="fas fa-video"></i>`;
      stopVideo.classList.toggle('background__red');
      stopVideo.innerHTML = newHTML;
    }
  };
  const toggleMute = () => {
    const muteButton = document.querySelector('#muteButton');
    const myStream = window.myStream;
    const enabled = myStream.getAudioTracks()[0].enabled;
    let newHTML;
    if (enabled) {
      myStream.getAudioTracks()[0].enabled = false;
      newHTML = `<i class="fas fa-microphone-slash"></i>`;
      muteButton.classList.toggle('background__red');
      muteButton.innerHTML = newHTML;
    } else {
      myStream.getAudioTracks()[0].enabled = true;
      newHTML = `<i class="fas fa-microphone"></i>`;
      muteButton.classList.toggle('background__red');
      muteButton.innerHTML = newHTML;
    }
  };

  const togglePopup = event => {
    let id = event.target.id;
    switch (id) {
      case 'how-to':
        setIsOpen(true);
        break;
      case 'map':
        setMapOpen(true);
        break;
      case 'close-icon':
        setIsOpen(false);
        setMapOpen(false);
        break;
      default:
        break;
    }
  };

  const toggleCircle = () => {

    if (window.game) {
      const mainScene = window.game.scene.scenes[0];
      let current =  mainScene.sprite.list[5].visible;
      mainScene.sprite.list[5].setVisible(!current);
      mainScene.coworkers.getChildren().forEach(coworker => {
        coworker.list[5].setVisible(!current);
      });
    }

  };

  useEffect(() => {
    showPanels();

    //starts peerjs code for video
    (async () => {

      await runWebRTC(socket, userData.name);
    })();
    // when the user refreshes the page, make them join the room again if key exists
    if (userData && userData.roomKey) {
      socket.emit('doesKeyExist', userData.roomKey);
      socket.once('roomExistCheck', exists => {
        if (exists) {
          setTimeout(() => {
            socket.emit('joinRoom', userData); //
          }, 100);
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
      hidePanels();

      // should disconnect peerJS so others can't see you anymore
      // if (window.peer) window.peer.disconnect();
      if (window.peer) {
        window.peer.destroy();
      }
      let allWebCams = document.querySelectorAll(`div.peerjs-video`);
      if (allWebCams) allWebCams.forEach(video => video.remove());

      // leave the room when going office page unmounts
      socket.emit('leaveRoom', userData.roomKey);
    };
  }, []);

  return (
    <div>
      <div id="header">
        <section>
          <div className="webcam-controller" style={{ display: 'none' }}>
            <p>{userData.name}</p>
            <div
              id="stopVideo"
              className="controller_buttons"
              onClick={toggleVideo}
            >
              <i className="fa fa-video-camera"></i>
            </div>
            <div
              id="muteButton"
              className="controller_buttons"
              onClick={toggleMute}
            >
              <i className="fa fa-microphone"></i>
            </div>
          </div>
          <div id="nav">
            <ul>
              <li className="button-three tooltip" onClick={toggleCircle}>
                <i className="fas fa-circle"></i>
                <span className="tooltipText">Proximity</span>
              </li>
              <li
                className="button-three tooltip"
                onClick={togglePopup}
                id="how-to"
              >
                <i className="fas fa-question" id="how-to"></i>
                <span className="tooltipText">how to play</span>
              </li>

              <li
                className="button-four tooltip"
                id="map"
                onClick={togglePopup}
              >
                <i className="fas fa-map" id="map"></i>
                <span className="tooltipText">map</span>
              </li>

              <li className="button-two tooltip">
                <Link to="/">
                  {' '}
                  <i className="fas fa-door-open"></i>{' '}
                  <span className="tooltipText">leave room</span>
                </Link>
              </li>
            </ul>
          </div>
        </section>
      </div>

      {isOpen && (
        <Popup
          content={
            <>
              <div className="instructions">
                <video autoPlay muted loop>
                  <source src="assets/howto.mp4" type="video/mp4" />
                </video>

                <img src="assets/instruction2.jpg" />
                <video autoPlay muted loop>
                  <source src="assets/walkaway.mp4" type="video/mp4" />
                </video>
              </div>
            </>
          }
          handleClose={togglePopup}
        />
      )}
      {mapOpen && (
        <Popup
          content={
            <>
              <div className="map">
                <img src="assets/mapclick.png"></img>
              </div>
            </>
          }
          handleClose={togglePopup}
        />
      )}
      <div className="top-panel">
        <NameDisplay />
        <NameList roomKey={userData.roomKey} />
      </div>
    </div>
  );
};

export default Office;
