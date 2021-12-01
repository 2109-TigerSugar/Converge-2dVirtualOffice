import React from 'react'
import { Link } from 'react-router-dom';
import { socket } from '..';
import runWebRTC from '../webcam';

const Office = () => {
  document.getElementById('mygame').style.display = 'block';
  document.querySelector('.webcam-panel').style.display = 'flex';



  return (

    <div>
      <Link to='/'>Back Home</Link>
    </div>
  )
}

export default Office
