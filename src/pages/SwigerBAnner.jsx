import React, { useEffect, useState } from 'react';

const SwipperBanner = () => {
  const [banners, setBanners] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch('http://37.140.216.178/api/v1/events/newslist/', {
          headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM1OTEzMDA2LCJpYXQiOjE3MzQ2MTcwMDYsImp0aSI6IjE3MTE3MmIyZjZiOTRkYzk5NzFmMWI5MmNkNWJhNjI1IiwiaWQiOjF9.-7aoKZGcZ1WenYhEvDlEeLhXjfjn3dyzCobskfPFJaY', // Replace with your actual token
          },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch banners: ${response.statusText}`);
        }
        const data = await response.json();
        setBanners(data);
        setCurrentSlide(0);
      } catch (error) {
        console.error('Error fetching banners:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, [banners]);

  const nextSlide = () => setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1));

  return (
    <div className="carousel w-[100%] h-[40vh] rounded-3xl relative">
      {loading ? (
        <div className="w-full h-[40vh] bg-gray-300 animate-pulse rounded-3xl"></div>
      ) : error ? (
        <div className="text-red-500 text-center">Failed to load banners: {error}</div>
      ) : (
        banners.map((banner, index) => (
          <div
            key={index}
            className={`carousel-item absolute w-full ${
              currentSlide === index ? 'block' : 'hidden'
            }`}
          >
            <img
              src={banner.imgUrl}
              alt={banner.name}
              className="w-full rounded-3xl h-[40vh] object-cover"
            />
          </div>
        ))
      )}

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 mb-3 gap-8">
        <button
          onClick={prevSlide}
          className="bg-white p-2 rounded-full shadow-md w-10 h-10 text-center font-bold"
        >
          &lt;
        </button>

        <div className="flex space-x-2">
          {banners.map((_, index) => (
            <span
              key={index}
              className={`w-2 h-2 rounded-full ${
                currentSlide === index ? 'bg-gray-400' : 'bg-white'
              }`}
            ></span>
          ))}
        </div>

        <button
          onClick={nextSlide}
          className="bg-white p-2 rounded-full shadow-md w-10 h-10 text-center font-bold"
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default SwipperBanner;
