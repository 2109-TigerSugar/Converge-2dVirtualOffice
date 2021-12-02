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
  const [err, setErr] = useState('');
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

    return () => setUserData({});
  }, [props.formType]);

  const handleChange = (event) => {
    setUserData({ ...userData, [event.target.name]: event.target.value });
    setErr('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // pressing create
    if (props.formType === 'create') {
      socket.emit('isKeyUnique', userData.roomKey);
      // key is unique so user will join the room
      socket.on('roomUniqueCheck', (unique) => {
        console.log('create here')
        if (unique) validKey(userData);
        else
          setErr(
            `room ${userData.roomKey} is taken. Please join with another key.`
          );
      });

      // socket.on('unique-key', () => {
      //   validKey(userData);
      // });
      // // user did not input a unique key
      // socket.on('duplicate-key', () => {
      //   setErr(
      //     `room ${userData.roomKey} is taken. Please join with another key.`
      //   );
      // });
    }
    if (props.formType === 'join')
    {
      //pressing the join button
      socket.emit('doesKeyExist', userData.roomKey);
      socket.on('roomExistCheck', (exists) => {
        if (exists) validKey(userData);
        else {
          setErr(
            `room ${userData.roomKey} is invalid. Please join with another key.`
          );
        }
      });
    }
  };

  const validKey = (userData) => {
    // user data is saved on local storage
    window.localStorage.setItem('userData', JSON.stringify(userData));

    // join the room
    socket.emit('joinRoom', userData.roomKey);
    navigate('/office');
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
      <button type="submit" disabled={!userData.name || !userData.roomKey}>
        {props.formType}
      </button>
      {err && <p style={{ color: 'red' }}>{err}</p>}
    </form>
  );
};
