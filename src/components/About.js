import React from 'react';
import { hidePanels } from '../helperFunctions';

const About = () => {
  hidePanels();
  return (
    <div>
      <div className="intro">
        <h4>Working remotely doesn't have to be boring.</h4>
      </div>
      <div className="about">
        <p>
          Converge allows you have all the good things about working in person,
          and still enjoy not dealing with the cons.
        </p>
        <p className="about-right">
          No more hassle with your commute.
          <img src="../assets/traffic.gif" />
        </p>
        <span>
          {' '}
          <p className="about-left">
            Different work environments allows you to signal to coworkers your
            availability. <img src="../assets/about.png" />
          </p>
        </span>
        <span> </span>
      </div>
    </div>
  );
};

export default About;
