import React, { useState } from 'react';
import ArtLogo from '../assets/Art Logo.png'; 
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'; 
import './Navbar.css';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="navbar-container">
      
      {/* Logo */}
      <div className="navbar-logo">
        <img src={ArtLogo} alt="Art Logo" className="logo-image" />
      </div>
      
      {/* Main Navigation Links */}
      <div className="navbar-center-links">
        <a href="#home" className="nav-link">Home</a>
        <a href="#about" className="nav-link">About</a>
        <a href="#gallery" className="nav-link">Gallery</a>
         <a href="#gallery" className="nav-link">Contact</a>
      </div>

      {/* Categories Dropdown */}
      <div className="navbar-right-menu">
        <div 
          className="nav-dropdown-toggle" 
          onClick={toggleDropdown}
          aria-expanded={isDropdownOpen}
        >
          Categories 
          {isDropdownOpen ? <FaChevronUp className="dropdown-icon" /> : <FaChevronDown className="dropdown-icon" />}
        </div>
        
        {isDropdownOpen && (
          <div className="dropdown-menu">
            <a href="#all" className="dropdown-item">All</a>
            <a href="#sketches" className="dropdown-item">Sketches</a>
            <a href="#fan-art" className="dropdown-item">Fan Art</a>
            <a href="#poster-making" className="dropdown-item">Poster Making</a>
            <a href="#soap-sculpture" className="dropdown-item">Soap Sculpture</a>
            <a href="#painting" className="dropdown-item">Painting</a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;