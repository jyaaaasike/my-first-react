import React from "react";
import "./Profile.css";
import ProfilePhoto from "../assets/profile-photo.jpg";

const Profile = () => (
  <div className="profile-content">
    <img src={ProfilePhoto} alt="Jheazell Lawas" className="profile-photo" />
    <div className="profile-text">
      <h1>Hello, I'm <span>Jheazell Lawas</span></h1>
      <h2>UI/UX Designer & Front-End Developer</h2>
      <p>
        I am a passionate UI/UX Designer and Front-End Developer who specializes in crafting visually stunning, user-centric digital experiences. My goal is to transform complex ideas into intuitive and delightful products.
      </p>
    </div>
  </div>
);

export default Profile;
