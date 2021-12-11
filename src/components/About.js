import React from 'react';
import { hidePanels } from '../helperFunctions';

const About = () => {
  hidePanels();
  return (
    <div className="aboutpagebg">
      <div className="about">
        <h1 id="about-header">
          ABOUT CONVERGE <br />
          <img src="https://i.pinimg.com/originals/6e/3f/47/6e3f47bf33153bd352d684a4d0ddea12.gif" />
          <p>remote working made human</p>
        </h1>
        <br />
        <br />
        <br />
        <div className="about-container">
          <div className="column">
            <img src="assets/about.png" />

            <h3> Map with varying work environments</h3>

            <p>
              Each space allows you to signal to coworkers your availability.
            </p>
          </div>
          <div className="column">
            <img src="assets/traffic.jpg" />

            <h3> Remote work, without the cons</h3>

            <p>
              Being able to work remotely, while still having natural and casual
              interactions is a major benefit of Converge. Plus no traffic!
            </p>
          </div>
          <div className="column">
            <img src="assets/twopic.jpeg" />

            <h3> Be inspired, not burnt out</h3>
            <p>
              Screen fatigue is real. Interacting on converge reduces this by
              offering engaging graphics. No more boring square boxes.
            </p>
          </div>
          <div className="column">
            <img src="assets/onepic.png" />

            <h3> Make virtual interactions more human</h3>
            <p>
              Video chat shouldn’t be awkward. Walking in and out of
              conversations feels natural and seamless.
            </p>
          </div>
          <div className="column">
            <img src="assets/nooverlap.png" />

            <h3> So... exactly what is proximity video chat?</h3>
            <p>
              Calls are only trigged if you are close enough to another
              coworker's avatar.
            </p>
          </div>
          <div className="column">
            <img src="assets/videostart.png" />
            <h3> I just walk up to them?</h3>
            <p>
              YES! It's that easy. Just like in real life. When y ou want to end
              the call, simply walk away.
            </p>
          </div>
          <div className="column">
            <img src="assets/proxbutton.png" />
            <h3> Your proximity circle </h3>
            <p>
              You are able to show and hide your proximity circle as you work.
              It is nice to use in the beginning to get the hang of the distance
              needed to talk to someone.
            </p>
          </div>
          <div className="column">
            <img src="assets/circlecolor.png" />

            <h3> Custom proximity circle</h3>

            <p>
              Why of course we allow you to express yourself at Converge, even
              with the proximity circle. Choose your color on the login screen.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
