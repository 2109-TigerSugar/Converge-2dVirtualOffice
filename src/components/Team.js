import React from 'react';
import { hidePanels } from '../helperFunctions';
import TeamMember from './TeamMember';

const Team = () => {
  hidePanels();

  const kelsey = {
    imageSrc: 'assets/kelsey.png',
    name: 'Kelsey Smith',
    linkedIn: 'https://www.linkedin.com/in/kelseyspaige/',
    github: 'https://github.com/paigekelsey',
    avatarSrc: 'assets/kelsey-avatar.png',
  };

  const lydia = {
    imageSrc: 'assets/lydia.jpeg',
    name: 'Lydia Rees',
    linkedIn: 'https://www.linkedin.com/in/lydia-rees/',
    github: 'https://github.com/lydiairis76',
    avatarSrc: 'assets/lydia-avatar.png',
  };

  const hyo = {
    imageSrc: 'assets/hyo.jpeg',
    name: 'Hyo Kim',
    linkedIn: 'https://www.linkedin.com/in/hyo-kim/',
    github: 'https://github.com/hik010',
    avatarSrc: 'assets/hyo-avatar.png',
  };

  const dakota = {
    imageSrc: 'assets/dakota.jpeg',
    name: 'Dakota Leonard',
    linkedIn: 'https://www.linkedin.com/in/dakota-leonard/',
    github: 'https://github.com/Dakota-Leonard',
    avatarSrc: 'assets/dakota-avatar.png',
  };

  return (
    <div className="team">
      <div id="team-header">Meet the team!</div>
      <div id="team-container">
        <TeamMember info={kelsey} />
        <TeamMember info={lydia} />
        <TeamMember info={hyo} />
        <TeamMember info={dakota} />
      </div>
    </div>
  );
};
export default Team;
