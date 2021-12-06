import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { socket } from '../socket';


const initialUserData = {
  name: '',
  roomKey: '',
  officeType: '',
  avatar: 'avatar',
}

export const JoinOrCreateForm = (props) => {
  // to make the form controlled, have a state to keep track of input values
  const [userData, setUserData] = useState(initialUserData);
  const [err, setErr] = useState(''); //if we need to show an error
  const navigate = useNavigate(); //to let us navigate to other pages

  useEffect(() => {
    if (props.formType === 'join') {
      // only fetch from localStorage if formType is 'join'
      let storedData = window.localStorage.getItem('userData');
      if (storedData) {
        setUserData(JSON.parse(storedData));
      }
    } else {
      setUserData(initialUserData);
    }

    return () => setUserData(initialUserData);
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
      socket.on('roomUniqueCheck', (unique) => {
        // key is unique so user will join the room
        if (unique) validKey(userData);
        // key is not unique, cannot create room with same key
        else
          setErr(
            `room ${userData.roomKey} is taken. Please join with another key.`
          );
      });
    }

    // pressing join bottom
    if (props.formType === 'join') {
      socket.emit('doesKeyExist', userData.roomKey);
      socket.on('roomExistCheck', (exists) => {
        // room is created, user can join room
        if (exists) validKey(userData);
        else {
          // room is not created yet
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

    // join the office

    navigate('/office');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">
          Your Name
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
      <label htmlFor="avatar">Avatar:</label>
      <select name="avatar" id="avatar" value={userData.avatar} onChange={handleChange}>
        <option value="avatar">avatar1</option>
        <option value="sprite2">avatar2</option>
      </select>
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
      {/* Error div that wil show if err (state) is not an empty string */}
      {err && <p style={{ color: 'red' }}>{err}</p>}
    </form>
  );
};
