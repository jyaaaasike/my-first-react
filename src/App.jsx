import React from "react";
import "./App.css";

import Navbar from "./components/Navbar";
import Profile from "./components/Profile";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="App">
      <Navbar />

      <section id="profile">
        <Profile />
      </section>

      <section id="about">
        <About />
      </section>

      <section id="contact">
        <Contact />
      </section>

      <Footer />
    </div>
  );
}

export default App;
