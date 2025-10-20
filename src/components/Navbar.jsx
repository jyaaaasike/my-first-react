import React, { useState } from "react";
import "./Navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="navbar-header">
      <nav className="navbar-container">
        {/* Logo replaced with text */}
        <div className="navbar-logo">
          <span className="logo-text">MY PORTFOLIO</span>
        </div>

        {/* Desktop Links */}
        <div className="navbar-links">
          <a href="#profile" className="nav-link">Profile</a>
          <a href="#about" className="nav-link">About</a>
          <a href="#contact" className="nav-link">Contact</a>
        </div>

        {/* Mobile Menu Button */}
        <button className="navbar-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "✖" : "☰"}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isOpen ? "open" : ""}`}>
        <a href="#profile" className="mobile-link" onClick={() => setIsOpen(false)}>Profile</a>
        <a href="#about" className="mobile-link" onClick={() => setIsOpen(false)}>About</a>
        <a href="#contact" className="mobile-link" onClick={() => setIsOpen(false)}>Contact</a>
      </div>
    </header>
  );
};

export default Navbar;
