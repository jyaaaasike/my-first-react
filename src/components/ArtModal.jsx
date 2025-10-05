import React from "react";
import "./ArtModal.css";

const ArtModal = ({ art, closeModal }) => {
  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <img src={art.image} alt={art.title} />
        <h3>{art.title}</h3>
        <p>{art.description}</p>
        <button onClick={closeModal}>Close</button>
      </div>
    </div>
  );
};

export default ArtModal;
