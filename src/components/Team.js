import React from 'react';
import { hidePanels } from '../helperFunctions';
import TeamMember from './TeamMember';

const Team = () => {
  hidePanels();

  const kelsey = {
    imageSrc: '',
    name: 'Kelsey Smith',
    linkedIn: 'https://www.linkedin.com/in/kelseyspaige/',
    github: 'https://github.com/paigekelsey',
    avatarSrc: 'assets/kelsey-avatar.png',
  };

  return (
    <div className="team">
      <div id="team-header">Meet the team!</div>
      <div id="team-container">
        <TeamMember info={kelsey}></TeamMember>
      </div>
    </div>
  );
};
export default Team;
