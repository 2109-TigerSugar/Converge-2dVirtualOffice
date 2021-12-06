import React from 'react';

const About = () => {
  document.getElementById('mygame').style.display = 'none';
  document.querySelector('.webcam-panel').style.display = 'none';
  return (
    <div className="about">
      <span>
        {' '}
        <p className="about-left">
          Different work environments allows you to signal to coworkers your
          availability.{' '}
        </p>
        <img className="sample" src="assets/about.png" />
      </span>
    </div>
  );
};

export default About;
