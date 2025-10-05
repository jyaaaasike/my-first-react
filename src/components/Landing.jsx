import React from 'react';
import './Landing.css';

const Landing = ({ artistName = "Jheazell" }) => {
  return (
    <main className="landing-hero-section">
      <div className="hero-content">
        <h1 className="hero-headline">
          The Digital Canvas
          <br />
          Art Portfolio of <span className="artist-name">{artistName}</span>
        </h1>
        <p className="hero-subtext">
          Exploring the intersection of tradition and technology through vivid color 
          and complex forms.
        </p>
        {/* === START OF CHANGE === */}
        <a 
          href="#gallery" 
          className="hero-cta-button"
          style={{ textDecoration: 'none' }} // Prevents default link underline
        >
          View Gallery
        </a>
        {/* === END OF CHANGE === */}
      </div>
    </main>
  );
};

export default Landing;