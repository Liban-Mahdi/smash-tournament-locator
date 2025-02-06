import React from 'react';
import { Link } from 'react-router-dom';


const Navbar = () => {
  return (
    <nav className="navbar">
      
      <Link to="/" className="logo"> <img src="/logo.png" alt="Smash Tournament Locator Logo" className="nav-logo" /> </Link>
      
      <div className="nav-links">
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </div>
      
    </nav>
  );
};

export default Navbar;
