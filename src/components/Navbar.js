import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="links">
      <div className="navLink">
        <Link to='/'>Logo</Link>
      </div>
      <div className="navLink">
        <Link to='/about'>About</Link>
      </div>
    </nav>
  );
};

export default Navbar;
