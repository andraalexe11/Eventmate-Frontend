import React from "react";
import { useNavigate } from "react-router-dom";

function HeroSection() {
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate("/events"); // Navigăm către pagina "/events"
  };


    return (
      <section className="hero">
        <h2>Descoperă evenimente noi în orașul tău!</h2>
        <p>Găsește oameni cu interese comune și participă la activități locale.</p>
        <button onClick={handleNavigate}>Vezi Evenimente</button>
      </section>
    );
  }
  export default HeroSection;