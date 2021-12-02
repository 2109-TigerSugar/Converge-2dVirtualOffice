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

    // pressing create
    if (props.formType === 'create') {
      socket.emit('isKeyUnique', userData.roomKey);
      // key is unique so user will join the room
      socket.on('unique-key', () => {
        // user data is saved on local storage
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
      });
      // user did not input a unique key
      socket.on('duplicate-key', () => {
        alert(`room ${userData.roomKey} is taken. Please try another one.`);
      });
    } else {
      //pressing the join button
      socket.emit('doesKeyExist', userData.roomKey);
      socket.on('roomKeyExists', (exists) => {
        if (exists) {
          socket.emit('joinRoom', userData.roomKey);
          navigate('/office');
        } else {
          console.log('bads');
          alert(
            `room ${userData.roomKey} is invalid. Please join with another key.`
          );
        }
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">
          Name
          <span
            style={{
              display: !userData.name ? 'inline' : 'none',
              color: 'red',
            }}
          >
            *
          </span>
        </label>
        <input
          type="text"
          name="name"
          id="name"
          value={userData.name}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="officeKey">
          Room Key
          <span
            style={{
              display: !userData.roomKey ? 'inline' : 'none',
              color: 'red',
            }}
          >
            *
          </span>
        </label>
        <input
          type="text"
          name="roomKey"
          id="officeKey"
          value={userData.roomKey}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="officeType">Office Type</label>
        <input
          type="text"
          name="officeType"
          id="officeType"
          value={userData.officeType}
          onChange={handleChange}
        />
      </div>
      <button type="submit" disabled={!userData.name || !userData.roomKey}>{props.formType}</button>
    </form>
  );
};
