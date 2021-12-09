import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { socket } from '../socket';

const initialUserData = {
  name: '',
  roomKey: '',
  officeType: '',
  hairStyle: 'hairStyle1',
  outfit: 'outfit1',
  skinColor: '#f0ddd7',
  hairColor: '#000000',
  eyeColor: '#000000',
  proximityColor: '#000000',
};

export const JoinOrCreateForm = props => {
  // to make the form controlled, have a state to keep track of input values
  const [userData, setUserData] = useState(initialUserData);
  const [err, setErr] = useState(''); //if we need to show an error
  const navigate = useNavigate(); //to let us navigate to other pages

  useEffect(() => {
    if (props.formType === 'join') {
      // only fetch from localStorage if formType is 'join'
      let storedData = window.localStorage.getItem('userData');
      if (storedData) {
        storedData = JSON.parse(storedData);
        //Wizard stuff
        storedData.hairColor = '#' + storedData.hairColor.toString(16);
        storedData.skinColor = '#' + storedData.skinColor.toString(16);
        storedData.proximityColor = storedData.proximityColor
          ? '#' + storedData.proximityColor.toString(16)
          : initialUserData.proximityColor;
        setUserData(storedData);
      }
    } else {
      setUserData(initialUserData);
    }

    return () => setUserData(initialUserData);
  }, [props.formType]);

  const handleChange = event => {
    setUserData({ ...userData, [event.target.name]: event.target.value });
    setErr('');
  };

  const handleSubmit = event => {
    event.preventDefault();

    // pressing create
    if (props.formType === 'create') {
      socket.emit('isKeyUnique', userData.roomKey);
      socket.once('roomUniqueCheck', unique => {
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
      socket.once('roomExistCheck', exists => {
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

  const validKey = userData => {
    if (window.location.pathname === '/office') return;
    //Correct hair color and skin color
    if (typeof userData.hairColor !== 'number') {
      userData.hairColor = Number('0x' + userData.hairColor.slice(1));
    }

    if (typeof userData.skinColor !== 'number') {
      userData.skinColor = Number('0x' + userData.skinColor.slice(1));
    }

    if (typeof userData.proximityColor !== 'number') {
      userData.proximityColor = Number('0x' + userData.proximityColor.slice(1));
    }

    // user data is saved on local storage
    window.localStorage.setItem('userData', JSON.stringify(userData));

    // join the office
    navigate('/office', { state: userData });
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
          autoComplete="off"
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
          autoComplete="off"
          value={userData.roomKey}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="hairStyle">Hair Style</label>
        <select
          name="hairStyle"
          id="hairStyle"
          value={userData.hairStyle}
          onChange={handleChange}
          autoComplete="off"
        >
          <option value="hairStyle1">Short - Spiked front bangs</option>
          {/* <option value="hairStyle2">2</option>
          <option value="hairStyle3">3</option> */}
          <option value="hairStyle4">Shoulder length - bangs</option>
          <option value="hairStyle5">Justin Bieber</option>
          {/* <option value="hairStyle6">6</option> */}
          <option value="hairStyle7">medium length - side part</option>
          <option value="hairStyle8">afro</option>
          {/* <option value="hairStyle9">9</option> */}
          {/* <option value="hairStyle10">10</option>
          <option value="hairStyle11">11</option>
          <option value="hairStyle12">12</option>
          <option value="hairStyle13"></option> */}
          {/* <option value="hairStyle14">14</option>
          <option value="hairStyle15">15</option>
          <option value="hairStyle16">16</option> */}
          <option value="hairStyle17">boufant</option>
          <option value="hairStyle18">shaggy</option>
          <option value="hairStyle19">short- polished</option>
          <option value="hairStyle20">bowl cut</option>
          {/* <option value="hairStyle21">21</option>
          <option value="hairStyle22">22</option> */}
          <option value="hairStyle23">short bob-bangs</option>
          {/* <option value="hairStyle24">24</option> */}
          <option value="hairStyle25">short bob - no bangs</option>
          {/* <option value="hairStyle26">26</option> */}
          <option value="hairStyle27">long - bangs</option>
          {/* <option value="hairStyle28">28</option> */}
          <option value="hairStyle29">short - spiky</option>
        </select>
      </div>
      <div>
        <label htmlFor="outfit">Outfit</label>
        <select
          name="outfit"
          id="outfit"
          value={userData.outfit}
          onChange={handleChange}
          autoComplete="off"
        >
          <option value="outfit1">aqua shirt/white pants</option>
          <option value="outfit2">grey sweater/white pants</option>
          <option value="outfit3">business suit</option>
          <option value="outfit4">tan jacket/jeans</option>
          <option value="outfit5">white shirt/yellow pants</option>
          <option value="outfit6">white hoodie/green pants</option>
          <option value="outfit7">red blazer/brown pants</option>
          <option value="outfit8">green onesie</option>
          <option value="outfit9">grey suit</option>
          <option value="outfit10">white dress</option>
        </select>
      </div>
      <div>
        <label htmlFor="skinColor">Skin Color</label>
        <input
          type="color"
          id="skinColor"
          name="skinColor"
          value={userData.skinColor}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="hairColor">Hair Color</label>
        <input
          type="color"
          id="hairColor"
          name="hairColor"
          value={userData.hairColor}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="proximityColor">Proximity Color</label>
        <input
          type="color"
          id="proximityColor"
          name="proximityColor"
          value={userData.proximityColor}
          onChange={handleChange}
        />
      </div>

      <div className="submit-buttons">
        <button type="submit" disabled={!userData.name || !userData.roomKey}>
          {props.formType}
        </button>
        <button
          type="button"
          className="back-button"
          onClick={() => props.clickBack('')}
        >
          Back
        </button>
      </div>
      {/* Error div that wil show if err (state) is not an empty string */}
      {err && <p style={{ color: 'red' }}>{err}</p>}
    </form>
  );
};
