import Peer from 'peerjs';
import { addVideo, createPeer } from './helperFunctions';

const runWebRTC = async (socket, myName) => {
  const webcamController = document.querySelector('.webcam-controller');

  const callList = {};
  let stream;

  if (window.myStream) {
    stream = window.myStream;
    console.log('stream exists', stream);
  } else {
    //Dakota: Ask for permission to use webcam :) We await because we have no clue when they will accept it!
    navigator.getUserMedia =
      navigator.mediaDevices.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;
    stream = await navigator.getUserMedia({
      video: true,
      audio: true,
    });
    window.myStream = stream;
  }

  // attach stream to window so we can use in Office.js

  //Build our webcam
  addVideo(stream, false, socket.id, myName);

  // show the controller my stream is loaded
  webcamController.style.display = 'flex';

  //Dakota: Setup new peer object! Yay!
  const peer = createPeer(socket.id);

  // when peer is open, make a call and receive a call
  peer.on('open', id => {
    console.log('My peer ID is: ' + id);
    window.peer = peer;

    //Answer calls :)
    peer.on('call', call => {
      //Getting called  so answer
      call.answer(stream);
      //Got called and answered so build webcam panel
      call.on('stream', remoteStream => {
        if (callList[call.peer] === undefined) {
          addVideo(remoteStream, true, call.peer, remoteStream.name);
          callList[call.peer] = true;
        }
      });
    });

    //Call new user when they join
    socket.on('newEmployee', ({ employeeInfo }) => {
      const socketId = employeeInfo.employeeId;
      let count = 0;
      let timer = setInterval(() => {
        let call = peer.call(socketId, stream);
        if (call || count >= 10) { //will only call 10 times max
          clearInterval(timer);
          call.on('stream', remoteStream => {
            if (callList[socketId] === undefined) {
              addVideo(remoteStream, true, socketId, remoteStream.name);
              callList[socketId] = true;
            }
          });
          console.log('timer stopped');
        } else {
          console.log(`calling again (${count})`, socketId);
          count++;
        }
      }, 500);
    });

    socket.on('coworker disconnected', ({ coworkerId: socketId }) => {
      let videoToRemove = document.querySelectorAll(`#${CSS.escape(socketId)}`);
      videoToRemove.forEach(video => video.remove());
      delete callList[socketId];
    });
  });
};

export default runWebRTC;
