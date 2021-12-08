import React, { useState } from 'react';
import { hidePanels } from '../helperFunctions';
import { JoinOrCreateForm } from './Forms';

const LandingPage = () => {
  const [formType, setFormType] = useState('');
  const [isActive, setActive] = useState('false');
  hidePanels();
  const handleClick = (e) => {
    let chosen = e.target.id;
    formType !== chosen ? setFormType(chosen) : setFormType('');
    setActive(!isActive);
  };

  return (
    // 2 buttons: 1 for create 1 for join

    <div className="landing-page">
      <div className="companyName">
        <div className="nameLogo">
          <img src="../assets/convergemockup.png" />
          <h1>CONVERGE</h1>
          <br />
          <hr />
          <h2>
            {' '}
            <br />
            <h6 className="tagline">{'-> communicate connectively <-'}</h6>
          </h2>
        </div>

        <p>
          A virtual office that allows you to <strong>SEE </strong>when
          coworkers are online and video conference with them through walking up
          to them with custom avatars.
        </p>

        <p>
          Converge, connect and communicate like you are really in the office.{' '}
        </p>
        <p>
          <hr />
          Create an office and invite your team, or join with a key from a
          previous invite.
        </p>
      </div>
      <div className="button-hero">
        {/* <img src="../assets/mapcrop.png" /> */}
        <div className="buttonsAndForm">
          <div className={isActive ? 'buttons' : 'noButtons'}>
            <button onClick={handleClick} type="button" id="create">
              Create
            </button>
            <button onClick={handleClick} type="button" id="join">
              Join
            </button>
          </div>
        </div>
        <div className="joinOrCreateForm">
          {formType === '' ? null : <JoinOrCreateForm formType={formType} />}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
