import React, { useEffect, useState } from 'react';
import { Coins, Search, X, User } from 'lucide-react';
import Reyting from './Reyting';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Home() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{"tokens": [{"quantity": 0}]}');
  const [events, setEvents] = useState([]);
  const [displayedEvents, setDisplayedEvents] = useState([]);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('https://unversty-2.onrender.com/clubevents');
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        setEvents(data);
        setDisplayedEvents(data.slice(-4));
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Fetch news
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('https://unversty-2.onrender.com/news');
        const data = await response.json();
        setNews(data);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Event toggle
  const handleToggleEvents = () => {
    if (showAll) {
      setDisplayedEvents(events.slice(-4));
    } else {
      setDisplayedEvents(events);
    }
    setShowAll(!showAll);
  };

  // Close modal
  const closeModal = () => setSelectedEvent(null);

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    className: 'carousel-wrapper',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-12 space-y-4 sm:space-y-0">
          <div className="relative w-full sm:w-[250px]">
            <input
              type="text"
              className="w-full bg-white border-2 border-indigo-300 rounded-full py-3 px-5 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg shadow-sm transition duration-300 hover:shadow-md"
              placeholder="Search"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-500" size={22} />
          </div>
          <div className="bg-indigo-600 text-white rounded-full flex items-center gap-2 py-3 px-5 font-semibold cursor-pointer hover:bg-indigo-700 transition duration-300 shadow-md">
            <span>{loggedInUser.tokens[0].quantity}</span>
            <Coins size={18} />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <h2 className="text-3xl font-bold text-indigo-800 mb-6">Yangiliklar</h2>
              {loading ? (
                <div className="h-60 bg-indigo-200 rounded-lg animate-pulse"></div>
              ) : (
                <Slider {...sliderSettings}>
                  {news.map((item, index) => (
                    <div key={index} className="pb-4">
                      <img
                        src={item.img}
                        alt="News"
                        className="w-full h-60 object-cover rounded-lg shadow-md"
                      />
                    </div>
                  ))}
                </Slider>
              )}
            </div>
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-violet-800">EVENTS</h3>
                <button
                  onClick={handleToggleEvents}
                  className="py-2 px-4 bg-violet-500 text-white rounded-full hover:bg-violet-600 transition"
                >
                  {showAll ? 'Close' : 'All Events'}
                </button>
              </div>
              {loading ? (
                <div>Loading...</div>
              ) : error ? (
                <p className="text-red-500">Error: {error}</p>
              ) : displayedEvents.length === 0 ? (
                <p className="text-gray-500">No events available</p>
              ) : (
                <ul className="flex flex-wrap gap-4">
                {displayedEvents.map((event) => (
                  <li
                    key={event._id}
                    onClick={() => setSelectedEvent(event)}
                    className="flex flex-col bg-violet-100 rounded-lg p-4 shadow-sm hover:shadow-md cursor-pointer transition w-[22%]" // 22% kenglik bilan to'rt qatorni sig'dirish
                  >
                    <img
                      src={event.img}
                      alt={event.name}
                      className="w-16 h-16 object-cover mb-4 rounded"
                    />
                    <h4 className="text-lg font-bold text-violet-800">{event.name}</h4>
                  </li>
                ))}
              </ul>
              
              )}
            </div>

          </div>

          <div>
            <h3 className="text-xl font-bold text-violet-800">Reyting</h3>
            <Reyting />
          </div>
        </div>

        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-8 w-[90%] md:w-[50%]">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-violet-800">{selectedEvent.name}</h2>
                <button onClick={closeModal}>
                  <X size={24} className="text-violet-800" />
                </button>
              </div>
              <img
                src={selectedEvent.img}
                alt={selectedEvent.name}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <p className="text-gray-600">{selectedEvent.description}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
