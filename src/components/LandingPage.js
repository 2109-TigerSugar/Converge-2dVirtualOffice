import React, {useState} from 'react';
import { JoinOrCreateForm } from './Forms';

const LandingPage = () => {
  const [formType, setFormType] = useState('')

  return (
    // 2 buttons: 1 for create 1 for join
    <div className="landing-page">
      <div className="buttons">
        <button onClick={() => {setFormType('create')}} type="button">Create</button>
        <button onClick={() => {setFormType('join')}} type="button">Join</button>
      </div>
      <div className="form">
        {formType === '' ? null:
        <JoinOrCreateForm formType={formType}/>
        }
      </div>
    </div>
  );
};

export default LandingPage;
