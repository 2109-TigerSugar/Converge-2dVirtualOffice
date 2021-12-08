import React, {useState} from 'react';
import { hidePanels } from '../helperFunctions';
import { JoinOrCreateForm } from './Forms';

const LandingPage = () => {
  const [formType, setFormType] = useState('')
  const [isActive, setActive] = useState('false');
  hidePanels();
  const handleClick = (e) => {
    let chosen = e.target.id;
    (formType !== chosen) ? setFormType(chosen) : setFormType('');
    setActive(!isActive);

  }

  return (
    // 2 buttons: 1 for create 1 for join

    <div className="landing-page">
      <div className='companyName'>
        <div className='nameLogo'>
          <img src="../assets/convergemockup.png"/>
          <h1>Converge</h1>
        </div>
          <p>A virtual office where your whole team can converge to work together to do cool things! </p>
          <p>Create an office and invite your team, or join with a key from a previous invite.</p>
      </div>
      <div className='button-hero'>
      <img src="../assets/potentialcropped-min.png"/>
      <div className="buttonsAndForm">
      <div className={isActive ? "buttons" : "noButtons"}>
        <button onClick={handleClick} type="button" id='create'>Create</button>
        <button onClick={handleClick} type="button" id='join'>Join</button>
      </div>
      </div>
      <div className= "joinOrCreateForm">
        {formType === '' ? null:
        <JoinOrCreateForm formType={formType}/>
         }
      </div>
      </div>
      </div>


  );
};

export default LandingPage;
