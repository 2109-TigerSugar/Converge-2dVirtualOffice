import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { socket } from '..';

// export const CreateForm = () => {
//   const [roomKey, setRoomKey] = useState('')

//   const handleChange = (event) => {
//     setRoomKey(event.target.value)
//   }

//   const handleSubmit = (event) => {
//     event.preventDefault()
//     console.log(roomKey)
//   }

//   return (
//     <form onSubmit= {handleSubmit}>
//       <label>Name</label>

//       <label htmlFor="officeKey">Enter Room Key</label>
//       <input type="text" name="officeKey" id= "officeKey" value={ roomKey } onChange= {handleChange}/>
//       <button type="submit">create</button>
//     </form>
//   )
// }

/*

create form (onSubmit)
  check if key is unique (isKeyUnique socket) => check the response => create room + join room => /office
  if not unique => alert and make them input a new key


join form (onSubmit)

  check if roomKey exists, if yes => join => navigate to /office
  if no -> room does not exists, please check your key or create a room first
 */

export const JoinOrCreateForm = (props) => {
  console.log('render')
  const [userData, setUserData] = useState({
    name: '',
    roomKey: '',
    officeType: '',
  });
  const navigate = useNavigate();

  // only fetch from localStorage if formType is 'join'

  useEffect(() => {
    if (props.formType === 'join') {
      let storedData = window.localStorage.getItem('userData');
      if (storedData) {
        setUserData(JSON.parse(storedData));
      }
    } else {
      setUserData({
        name: '',
        roomKey: '',
        officeType: '',
      });
    }
  }, [props.formType]);

  const handleChange = (event) => {
    setUserData({ ...userData, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // checks
    if (props.formType === 'create') {
      socket.emit('isKeyUnique', userData.roomKey);
      socket.on('unique-key', () => {

        window.localStorage.setItem('userData', JSON.stringify(userData));
        setUserData({
          name: '',
          roomKey: '',
          officeType: '',
        });
        console.log(
          'local storage set to',
          window.localStorage.getItem('userData')
        );

        // join the room
        socket.emit('joinRoom', userData.roomKey);
        navigate('/office');

        // see the phaser canvas with the office
      });
      socket.on('duplicate-key', () => {
        alert(`room ${userData.roomKey} is taken. Please try another one.`);
      });
    } else {
      socket.emit('doesKeyExist', userData.roomKey);
      socket.on('roomKeyExists', (exists) => {
        if(exists) {
          socket.emit('joinRoom', userData.roomKey);
          navigate('/office');
        } else {
          console.log('bads')
          alert(`room ${userData.roomKey} is invalid. Please join with another key.`);
        }
      })
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Name</label>
      <input
        type="text"
        name="name"
        id="name"
        value={userData.name}
        onChange={handleChange}
      />
      <label htmlFor="officeKey">Room Key</label>
      <input
        type="text"
        name="roomKey"
        id="officeKey"
        value={userData.roomKey}
        onChange={handleChange}
      />
      <label htmlFor="officeType">Office Type</label>
      <input
        type="text"
        name="officeType"
        id="officeType"
        value={userData.officeType}
        onChange={handleChange}
      />
      <button type="submit">{props.formType}</button>
    </form>
  );
};
