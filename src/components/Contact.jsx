import React from "react";
import "./Contact.css";

const Contact = () => (
  <div className="contact-container">
    <h2>Let's Connect!</h2>
    <p className="contact-message">
      Ready to turn ideas into reality? Feel free to message me for collaboration, project inquiries, or just to connect!
    </p>
    <div className="contact-info">
      <div className="contact-item">
        <strong>Email:</strong>
        <a href="mailto:jheazelllawas@gmail.com"> jheazelllawas@gmail.com</a>
      </div>
      <div className="contact-item">
        <strong>Facebook:</strong>
        <a href="https://www.facebook.com/share/1CaKDyc5eN/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer"> Jheazell Lawas</a>
      </div>
    </div>
  </div>
);

export default Contact;
