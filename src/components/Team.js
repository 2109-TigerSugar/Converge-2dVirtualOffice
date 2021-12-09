import React from 'react';
import { hidePanels } from '../helperFunctions';
import TeamMember from './TeamMember';

const Team = () => {
  hidePanels();

  return (
    <div className="team">
      <div id="team-header">Meet the team!</div>
      <div id="team-container">
        <TeamMember></TeamMember>
        <TeamMember></TeamMember>
        <TeamMember></TeamMember>
        <TeamMember></TeamMember>
      </div>
    </div>
  );
};
export default Team;
