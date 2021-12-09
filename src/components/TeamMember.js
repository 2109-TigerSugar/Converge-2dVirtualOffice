import React from 'react';

//Image
//Name
//LinkedIn | GitHub
//Custom Avatar

const TeamMember = props => {
  const { imageSrc, name, linkedIn, github, avatarSrc } = props;
  return (
    <div className="team-member">
      <div className="member-photo">
        <img src={imageSrc} />
      </div>
      <div className="member-name">FirstName LastName</div>

      <div className="member-avatar">
        <img src="assets/kelsey-avatar.png" />
      </div>
    </div>
  );
};

export default TeamMember;
