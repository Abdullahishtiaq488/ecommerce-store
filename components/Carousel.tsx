"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const Carousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const totalSlides = 3; // Number of slides in the carousel

  // Automatically change slides every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, []);

  // Move to the next slide
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
  };

  // Move to the previous slide
  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? totalSlides - 1 : prevIndex - 1
    );
  };

  // Handle pointer down event
  const handlePointerDown = (e: React.PointerEvent) => {
    touchStartX.current = e.clientX;
  };

  // Handle pointer up event
  const handlePointerUp = (e: React.PointerEvent) => {
    touchEndX.current = e.clientX;
    handleSwipe();
  };

  // Detect swipe direction
  const handleSwipe = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      handleNext(); // Swipe left, move to the next slide
    } else if (touchStartX.current - touchEndX.current < -50) {
      handlePrevious(); // Swipe right, move to the previous slide
    }
  };

  return (
    <section
      className="w-full h-screen relative overflow-hidden"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      aria-roledescription="carousel"
      aria-live="polite"
    >
      {/* Carousel Indicators */}
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-2 z-5">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`w-3 h-3 rounded-full ${currentIndex === index ? 'bg-white' : 'bg-gray-400'
              }`}
          />
        ))}
      </div>

      {/* Slide Transition */}
      {['/carousel-1.jpg', '/carousel-2.jpg', '/carousel-3.jpg'].map((src, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${currentIndex === index ? 'opacity-100' : 'opacity-0'
            }`}
          aria-hidden={currentIndex !== index}
        >
          <Image
            src={src}
            alt={`Slide ${index + 1}`}
            layout="fill"
            className="object-cover w-full h-full"
            priority={index === 0}
            loading={index === 0 ? 'eager' : 'lazy'}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/0 to-black/40 z-10"></div>
          {/* Optional slide-specific content */}
          {index === 1 && (
            <div className="absolute top-1/4 left-4 md:left-15 text-heading1-bold md:text-[60px] p-4 text-left text-white">
              <p className="text-yellow-400 text-heading3-bold md:text-[30px] mb-2">FLAT 60% OFF</p>
              <h2>WINTER <br /> SALE</h2>
            </div>
          )}
          {index === 2 && (
            <div className="absolute top-1/4 right-4 md:right-10 text-heading1-bold md:text-[70px]  p-4 text-center font-bold text-white">
              <h2 className="text-gray-900">TRENDING <br /> <span className="text-red-700">NOW!</span></h2>
            </div>
          )}
        </div>
      ))}

      {/* Navigation buttons */}
      <button
        onClick={handlePrevious}
        aria-label="Previous slide"
        className="absolute left-4 md:left-5 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-5 hover:bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-white"
      >
        &#8592;
      </button>
      <button
        onClick={handleNext}
        aria-label="Next slide"
        className="absolute right-4 md:right-5 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-5 hover:bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-white"
      >
        &#8594;
      </button>
    </section>
  );
};

export default Carousel;
