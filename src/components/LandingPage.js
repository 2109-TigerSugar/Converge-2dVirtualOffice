import React from 'react';
import { CreateForm, JoinForm } from './Forms';

const LandingPage = () => {
  return (
    // 2 buttons: 1 for create 1 for join
    <div className="landing-page">
      <div className="buttons">
        <button type="button">Create</button>
        <button type="button">Join</button>
      </div>
      <div className="form">
        <CreateForm />
        <JoinForm />
      </div>
    </div>
  );
};

export default LandingPage;
