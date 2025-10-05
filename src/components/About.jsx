import React from 'react';
import './About.css';
// NEW: The path now goes UP one level (..) to find the assets folder,
// matching the structure used successfully in your Navbar.
import artistPhoto from '../assets/Artist_Photo.jpg'; 

const About = () => {
    return (
        <section id="about" className="about-section">
            <div className="about-container">
                <div className="about-grid">
                    {/* Artist Photo */}
                    <div className="about-photo-wrapper">
                        <img 
                            src={artistPhoto} // <-- Using the correctly imported image
                            alt="Artist Portrait" 
                            className="about-photo" 
                        />
                    </div>
                    
                    {/* Background Content */}
                    <div className="about-content">
                        <h2 className="about-title">The Artist's Journey</h2>
                        <p className="about-paragraph">
                            Hello! I'm Jheazell C. Lawas, a multimedia artist based in Dungga, Danao City. My journey began with traditional Poster Making, but over the last three years, I've primarily focused more on Fan Art. I believe art should evoke a visceral reaction, whether through the chaos of abstraction or the sharp clarity of geometric design.
                        </p>
                        <p className="about-paragraph">
                            My work is heavily influenced by Poster Making and some Animies and the natural world's complex patterns. This portfolio is a collection of my favorite projects from the last few years, organized into categories. Thank you for taking the time to explore my creations.
                        </p>
                        <a href="jheazelllawas@gmail.com" className="about-contact-link">
                            Get in Touch &rarr;
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;