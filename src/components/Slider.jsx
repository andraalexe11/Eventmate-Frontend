import React, { useState, useEffect, useRef } from 'react';
import './Slider.css'; 

const Slider = ({ slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const sliderRef = useRef(null);
  const intervalRef = useRef(null);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    resetInterval();
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    resetInterval();
  };

  const resetInterval = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(nextSlide, 5000);
  };

  useEffect(() => {
    intervalRef.current = setInterval(nextSlide, 5000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  useEffect(() => {
    if (isPaused) {
      clearInterval(intervalRef.current);
    } else {
      resetInterval();
    }
  }, [isPaused]);

  return (
    <div 
      className="slider-container"
      ref={sliderRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        className="slider-track"
        style={{ 
          transform: `translateX(-${currentSlide * 100}%)`,
          width: `${slides.length * 100}%`
        }}
      >
        {slides.map((slide, index) => (
          <div 
            key={index}
            className="slide"
            
          >
            <img src={slide.image} alt={slide.title} className="slide-image" />
            <div className="slide-content">
              <h3>{slide.title}</h3>
              <p>{slide.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="slider-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;