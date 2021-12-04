import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="links">
      <div className="navLink">
     <img src="../assets/convergelogowhite.png" />
      </div>
      <div className="navLink">
        <Link to='/'>Home</Link>
      </div>
      <div className="navLink">
        <Link to='/about'>About</Link>
      </div>
    </nav>
  );
};

export default Navbar;
