import React from "react";
import "./About.css";
import AboutPhoto from "../assets/about-photo.jpg";

const About = () => (
  <div className="about-container">
    <img src={AboutPhoto} alt="About Jheazell Lawas" className="about-photo" />
    <div className="about-info">
      <h2>My Journey</h2>
      <p>
        I am a dedicated and passionate <strong>UI/UX Designer and Front-End Developer</strong> currently pursuing my <strong>Bachelor of Science in Information Technology (BSIT)</strong> at Cebu Technological University – Danao Campus.
      </p>
      <p>
        My focus is on creating seamless and engaging user experiences. I thrive on blending creativity with technical logic to develop interactive web interfaces that are both beautiful and purposeful.
      </p>
      <div className="about-details">
        <p><span>Course:</span> Bachelor of Science in Information Technology (BSIT)</p>
        <p><span>Role:</span> UI/UX Designer, Front-End Developer</p>
        <p><span>Location:</span> Dungga, Danao City</p>
      </div>
    </div>
  </div>
);

export default About;
