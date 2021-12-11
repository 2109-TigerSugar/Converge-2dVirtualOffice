import Peer from 'peerjs';
import adapter from 'webrtc-adapter';
import { addVideo, createPeer } from './helperFunctions';

const runWebRTC = async (socket, myName) => {
  socket.on('newEmployee', ({ employeeInfo }) => {
    if (window.peer === undefined) {
      console.log('missed calls', employeeInfo.employeeId);
    }
  });

  const callList = {};
  let stream;

  if (window.myStream) {
    stream = window.myStream;
    console.log('stream exists', stream);
  } else {
    //Dakota: Ask for permission to use webcam :) We await because we have no clue when they will accept it!
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      window.myStream = stream;
    } catch (err) {
      console.log('error in getting stream', err);
    }
  }

  // attach stream to window so we can use in Office.js

  //Build our webcam
  addVideo(stream, false, socket.id, myName);

  //Dakota: Setup new peer object! Yay!
  const peer = createPeer(socket.id);

  // when peer is open, make a call and receive a call
  peer.on('open', id => {
    window.peer = peer;
    console.log('My peer ID is: ' + id);

    //Answer calls :)
    peer.on('call', call => {
      //Getting called  so answer
      call.answer(stream);
      //Got called and answered so build webcam panel
      call.on('stream', remoteStream => {
        if (callList[call.peer] === undefined) {
          addVideo(remoteStream, true, call.peer);
          callList[call.peer] = true;
        }
      });
    });

    //Call new user when they join
    socket.on('newEmployee', ({ employeeInfo }) => {
      const socketId = employeeInfo.employeeId;
      let count = 0;
      let timer = setInterval(() => {
        // call the new employee
        let call = peer.call(socketId, stream);
        if (call || count >= 10) {
          //will only call 10 times max
          clearInterval(timer);
          call.on('stream', remoteStream => {
            if (callList[socketId] === undefined) {
              addVideo(remoteStream, true, socketId, employeeInfo.name);
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

    // when someone leave the office, remove that video
    socket.on('coworker disconnected', ({ coworkerId: socketId }) => {
      let videoToRemove = document.querySelectorAll(
        `div#${CSS.escape(socketId)}`
      );
      videoToRemove.forEach(video => video.remove());
      delete callList[socketId];
    });
  });

  // peer.on('error', err => {
  //   console.log('peer connection error', err);
  //   peer.reconnect();
  // });
};

export default runWebRTC;
