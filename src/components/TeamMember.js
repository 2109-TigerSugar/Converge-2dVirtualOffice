import React from 'react';

//Image
//Name
//LinkedIn | GitHub
//Custom Avatar

const TeamMember = props => {
  console.log(props);
  const { imageSrc, name, linkedIn, github, avatarSrc } = props.info;
  return (
    <div className="team-member">
      <div className="member-photo">
        <img src={imageSrc || ''} />
      </div>
      <div className="member-name">{name}</div>
      <ul className="member-button-list">
        <li>
          <a href={linkedIn} className="fa fa-linkedin" target="_blank" />
        </li>
        <li>
          <a href={github} className="fa fa-github" target="_blank" />
        </li>
      </ul>
      <div className="member-avatar no-mobile">
        <img src={avatarSrc} />
      </div>
    </div>
  );
};

export default TeamMember;
