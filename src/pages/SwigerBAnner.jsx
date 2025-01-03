import React, { useEffect, useState } from 'react';

const SwipperBanner = () => {
  const [banners, setBanners] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch('http://37.140.216.178/api/v1/events/newslist/', {
          headers: { Authorization: `Bearer ${accessToken}` },
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
    <div className="relative w-full h-[50vh] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl overflow-hidden shadow-xl">
      {loading ? (
        <div className="w-full h-full bg-gray-300 animate-pulse rounded-3xl"></div>
      ) : error ? (
        <div className="text-red-500 text-center">Failed to load banners: {error}</div>
      ) : (
        banners.map((banner, index) => (
          <div
            key={index}
            className={`absolute w-full h-full transition-opacity duration-1000 ${
              currentSlide === index ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={banner.banner}
              alt={banner.name}
              className="w-full h-full object-cover rounded-3xl"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-end p-6 space-y-2 text-white">
              <h2 className="text-2xl font-bold">{banner.title}</h2>
              <p className="text-sm">{banner.description}</p>
            </div>
          </div>
        ))
      )}

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
        <button
          onClick={prevSlide}
          className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-200 transition duration-300"
        >
          <span className="text-lg font-bold text-gray-700">&lt;</span>
        </button>
        <div className="flex space-x-2">
          {banners.map((_, index) => (
            <span
              key={index}
              className={`w-3 h-3 rounded-full ${
                currentSlide === index ? 'bg-pink-500' : 'bg-gray-300'
              }`}
            ></span>
          ))}
        </div>
        <button
          onClick={nextSlide}
          className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-200 transition duration-300"
        >
          <span className="text-lg font-bold text-gray-700">&gt;</span>
        </button>
      </div>
    </div>
  );
};

export default SwipperBanner;
