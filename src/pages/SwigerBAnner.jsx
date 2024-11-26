import React, { useEffect, useState } from 'react';

const SwipperBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [loading, setLoading] = useState(true); // New state for image loading

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide === 2 ? 1 : prevSlide + 1));
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide === 2 ? 1 : prevSlide + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide === 1 ? 2 : prevSlide - 1));
  };

  // Handle image load event
  const handleImageLoad = () => {
    setLoading(false); // Set loading to false when images are loaded
  };

  return (
    <div>
      <div className="carousel w-[100%] h-[40vh] rounded-3xl relative">
        {/* Skeleton loader for Slide 1 */}
        <div
          id="slide1"
          className={`carousel-item absolute w-full ${currentSlide === 1 ? 'block' : 'hidden'}`}
        >
          {loading ? (
            <div className="w-full h-[40vh] bg-gray-300 animate-pulse rounded-3xl"></div> // Skeleton loader
          ) : (
            <img
              src="your-image-url-1.jpg" // Replace with actual image URL
              className="w-full rounded-3xl h-[40vh] bg-violet-400"
              alt="Slide 1"
              onLoad={handleImageLoad}
            />
          )}
        </div>

        {/* Skeleton loader for Slide 2 */}
        <div
          id="slide2"
          className={`carousel-item absolute w-full ${currentSlide === 2 ? 'block' : 'hidden'}`}
        >
          {loading ? (
            <div className="w-full h-[40vh] bg-gray-300 animate-pulse rounded-3xl"></div> // Skeleton loader
          ) : (
            <img
              src="your-image-url-2.jpg" // Replace with actual image URL
              className="w-full rounded-3xl h-[40vh] bg-violet-300"
              alt="Slide 2"
              onLoad={handleImageLoad}
            />
          )}
        </div>

        {/* Button Container Positioned at Bottom Center */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 mb-3 gap-8">
          <button
            onClick={prevSlide}
            className="bg-white p-2 rounded-full shadow-md w-10 h-10 text-center font-bold"
          >
            &lt;
          </button>

          {/* Navigation Dots */}
          <div className="flex space-x-2">
            <span
              className={`w-2 h-2 rounded-full ${currentSlide === 1 ? 'bg-gray-400' : 'bg-white'}`}
            ></span>
            <span
              className={`w-2 h-2 rounded-full ${currentSlide === 2 ? 'bg-gray-400' : 'bg-white'}`}
            ></span>
          </div>

          <button
            onClick={nextSlide}
            className="bg-white p-2 rounded-full shadow-md w-10 h-10 text-center font-bold"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default SwipperBanner;