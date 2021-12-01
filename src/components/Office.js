import React from 'react'

const Office = () => {
  console.log('show game canvas')
  document.getElementById('mygame').style.display = 'block';
  document.querySelector('.webcam-panel').style.display = 'flex';
  return 'office'
}

export default Office
