import React from "react";
import { useNavigate } from "react-router-dom";
import "./Hero.css"; // Asigură-te că ai un fișier CSS pentru stilizare

function HeroSection() {
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate("/events"); // Navigăm către pagina "/events"
  };


    return (
      <section className="hero">
        <h2>Găsește-ți oamenii. Creează momente. Trăiește clipa.</h2>
        <p>Aplicația care te ajută să descoperi evenimentele perfecte și să întâlnești oameni cu interese comune</p>
        <button onClick={handleNavigate}>Vezi Evenimente</button>
      </section>
    );
  }
  export default HeroSection;