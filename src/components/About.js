import React from 'react';
import { hidePanels } from '../helperFunctions';

const About = () => {
  hidePanels();
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
