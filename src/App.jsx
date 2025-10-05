import React from "react";
import Navbar from "./components/Navbar";
import Landing from "./components/Landing";
import About from "./components/About";
import Gallery from "./components/Gallery";
import "./App.css";

function App() {
  return (
    <div className="day-mode">
      <Navbar />
      <Landing />
      <About />
      <Gallery />
    </div>
  );
}

export default App;
