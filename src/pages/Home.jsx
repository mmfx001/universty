
import React, { useEffect, useState } from 'react'
import { Coins, Search } from 'lucide-react'
import Slider from 'react-slick'
import axios from 'axios'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import SwipperBanner from './SwigerBAnner'
import Reyting from './Reyting'

function Home() {
  const [news, setNews] = useState([])
  const [users, setUsers] = useState([])
  const [userData, setUserData] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([]) // Filtered users
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('') // Search input
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [Events, setEvents] = useState([])
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{"tokens": [{"quantity": 0}]}')
  const accessToken = localStorage.getItem('accessToken')
  const [isEventModalOpen, setIsEventModalOpen] = useState(false) // Event modal
  const [selectedEvent, setSelectedEvent] = useState(null) // Selected event
    useEffect(() => {
    const fetchUserInfo = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) return;

      try {
        const response = await axios.get("http://37.140.216.178/api/v1/users/userinfo/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setUserData(Array.isArray(response.data) ? response.data[0] : response.data);
      } catch (error) {
      }
    };
    fetchUserInfo();
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('http://37.140.216.178/api/v1/events/newslist/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        const data = await response.json()
        setNews(data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching news:', error)
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  const handleRegisterClick = (event) => {
    setSelectedEvent(event)
    setIsEventModalOpen(true)
  }


  const handleConfirmRegister = async () => {
    try {
      await axios.post(
        'http://37.140.216.178/api/v1/events/registerevent/',
        { event_id: selectedEvent.id },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )

      setIsEventModalOpen(false)
      alert('Successfully registered for the event!')
    } catch (error) {
      // console.error('Error registering for the event:', error);
      if (error.response.data.error === "User is already registered for this event") {
        alert("Siz allaqachon tadbirga yozilgansiz");
      }
      else {
        alert("serverda xatolik")
      }

    }
  }

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://37.140.216.178/api/v1/events/getactiveevents/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        const Events = response.data
        setEvents(Events)

      } catch (error) {
        console.error('Error fetching user ratings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])
  {

  }





  const handleRegister = async (eventId) => {
    try {
      await axios.post(
        'http://37.140.216.178/api/v1/events/registerevent/',
        { event_id: eventId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      alert('Successfully registered for the event!');
    } catch (error) {
      console.error('Error registering for the event:', error.response.data.error);
      if (error.response.data.error === "User is already registered for this event") {
        alert("Siz allaqachon tadbirga yozilgansiz");
      }
      else {
        alert("serverda xatolik")
      }

    }
  };


  useEffect(() => {
    if (searchQuery === '') {
      setFilteredUsers(users)
    } else {
      const filtered = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredUsers(filtered)
    }
  }, [searchQuery, users])

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    className: 'carousel-wrapper',
  }

  const openModal = (user) => {
    setSelectedUser(user)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedUser(null)
  }



  return (
    <div className="min-h-screen bg-gradient-to-br bg-indigo-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <header className="flex sm:flex-row justify-between items-center mb-12 gap-5 space-y-0 sm:space-x-4">
          {/* Search Input */}
          <div className="relative w-full sm:w-[250px] flex items-center gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border-2 border-indigo-300 rounded-full py-3 px-5 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg shadow-sm transition duration-300 hover:shadow-md"
              placeholder="Search"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-500" size={22} />
          </div>

          {/* Token Display */}
          <div className="bg-indigo-600 text-white rounded-full flex items-center gap-2 py-3 px-5 font-semibold cursor-pointer hover:bg-indigo-700 transition duration-300 shadow-md">
            <span>{userData.active_tokens}</span>
            <Coins size={18} />
          </div>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8 flex flex-col gap-12">
            {/* News Slider */}
            <SwipperBanner />



            {/* Events Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
              {Events.map((event) => (
                <div
                  key={event.id}
                  className="relative bg-gray-100 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:scale-105"
                >
                  {/* Event Image */}
                  <img
                    src={
                      event.img && event.img.trim()
                        ? event.img
                        : "https://media.istockphoto.com/id/1396814518/vector/image-coming-soon-no-photo-no-thumbnail-image-available-vector-illustration.jpg?s=612x612&w=0&k=20&c=hnh2OZgQGhf0b46-J2z7aHbIWwq8HNlSDaNp2wn_iko="
                    }
                    alt={event.title || "Event Image"}
                    className="w-full h-52 object-cover"
                  />

                  {/* Club Logo and Name */}
                  <div className="absolute top-2 left-2 flex items-center bg-black bg-opacity-50 text-white rounded-lg px-2 py-1">
                    <img
                      src={event.club_id.logo}
                      alt={event.club_id.name}
                      className="w-8 h-8 rounded-full border-2 border-white"
                    />
                    <p className="ml-2 text-sm font-medium">{event.club_id.name}</p>
                  </div>

                  {/* Event Details */}
                  <div className="p-4">
                    <h4 className="text-lg font-bold text-gray-900 truncate">{event.title}</h4>
                    <p className="text-sm text-gray-600 mt-2">
                      Deadline: {new Date(event.deadline).toLocaleString()}
                    </p>
                    <p className="mt-3 text-gray-800 text-sm">
                      Students Registered: {event.registrated_students_count}
                    </p>
                    <a
                      href={event.url || "#"}
                      className="block mt-4 text-indigo-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {event.url ? "View More" : "Details Coming Soon"}
                    </a>
                    <button
                      onClick={() => handleRegisterClick(event)}
                      className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-lg mt-4 transition-colors"
                    >
                      Register
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Event Modal */}
          {isEventModalOpen && selectedEvent && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white rounded-lg p-6 w-96">
                <h2 className="text-2xl font-bold">Confirm Registration</h2>
                <p>Event: {selectedEvent.title}</p>
                <p>Deadline: {new Date(selectedEvent.deadline).toLocaleString()}</p>
                <div className="mt-4 flex justify-end space-x-4">
                  <button
                    onClick={() => setIsEventModalOpen(false)}
                    className="bg-gray-300 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmRegister}
                    className="bg-indigo-500 text-white px-4 py-2 rounded"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}



          {/* Users List */}
          <div className='-mt-10'>
            <Reyting />
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl p-6 w-96">
              <button
                className="absolute top-4 right-4 text-lg font-bold text-gray-700"
                onClick={closeModal}
              >
                X
              </button>
              <h2 className="text-2xl font-bold text-indigo-800 mb-4">
                User Profile
              </h2>
              <div className="text-left">
                <img
                  src={selectedUser.image}
                  alt={selectedUser.name}
                  className="w-24 h-24 rounded-full object-cover mb-4 mx-auto"
                />
                <h3 className="text-xl font-semibold text-indigo-700">
                  {selectedUser.name}
                </h3>
                <p className="text-sm text-gray-600">
                  Faculty: {selectedUser.faculty?.faculty_name || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  Grade: {selectedUser.grade?.grade_name || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  Coins: {selectedUser.token_count}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div >
  )
}

export default Home