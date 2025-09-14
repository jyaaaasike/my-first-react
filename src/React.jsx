// src/React.jsx
import React from "react";

export default function ReactComponent() {
  return (
    <div style={{ padding: 16 }}>
      <h1>My First React.jsx Component</h1>
      <p>This is my first component for the assignment.</p>
      <button onClick={() => alert("Hello from React.jsx!")}>
        Click me
      </button>
    </div>
  );
}
