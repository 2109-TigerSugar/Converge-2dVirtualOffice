import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="links">
      <div className="navLink">
        <Link to="/">
          <img src="../assets/convergelogowhite.png" />{' '}
        </Link>
      </div>
      <div className="navLink">
        <Link to="/">Home </Link>
      </div>
      <div className="navLink">
        <Link to="/about">About</Link>
      </div>
      <div className="navLink">
        <Link to="/team">Team</Link>
      </div>
    </nav>
  );
};

export default Navbar;
