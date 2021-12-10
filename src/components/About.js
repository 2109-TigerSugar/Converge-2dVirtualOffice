import React from 'react';
import { hidePanels } from '../helperFunctions';

const About = () => {
  hidePanels();
  return (
    <div className="about">
      <div id="team-header">
        <div className="about-gif">
          <img src="../assets/player_walk.gif" />
          <h4>Working remotely doesn't have to be boring.</h4>
          <img src="../assets/chair.gif" />
        </div>
      </div>

      <div id="team-container">
        <div className="team-member">
          <div className="member-photo">
            <img src="../assets/about.png" />
            <p>
              {' '}
              Different work environments allows you to signal to coworkers your
              availability.
            </p>
          </div>
        </div>

        <div id="team-container">
          <div className="team-member">
            <div className="member-photo">
              <p>
                Converge allows you have all the good things about working in
                person, and still enjoy not dealing with the cons.
              </p>
              <p>
                <img src="../assets/traffic.jpg" />
                No more hassle with your commute.
              </p>
            </div>
          </div>
        </div>
        <div id="team-container">
          <div className="team-member">
            <div className="member-photo">
              <video autoPlay muted loop>
                <source src="assets/howto.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
        <div className="team-member">
          <div className="member-photo">
            <img src="assets/instruction2.jpg" />
          </div>
        </div>
        <div id="team-container">
          <div className="team-member">
            <div className="member-video">
              <video autoPlay muted loop>
                <source src="assets/walkaway.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
