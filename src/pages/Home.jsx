
import React, { useEffect, useState } from 'react'
import { Coins, Search } from 'lucide-react'
import Slider from 'react-slick'
import axios from 'axios'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

function Home() {
  const [news, setNews] = useState([])
  const [users, setUsers] = useState([])
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

  useEffect(() => {
    const fetchUserRating = async () => {
      try {
        const response = await axios.get('http://37.140.216.178/api/v1/events/dashboardtopusers/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        const usersData = response.data.slice(0, 10)
        setUsers(usersData)
        setFilteredUsers(usersData)
      } catch (error) {
        console.error('Error fetching user ratings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserRating()
  }, [])




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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100">
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
            <span>{loggedInUser.active_tokens}</span>
            <Coins size={18} />
          </div>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            {/* News Slider */}
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              {loading ? (
                <div className="h-60 bg-indigo-200 rounded-lg animate-pulse"></div>
              ) : (
                <Slider {...settings}>
                  {news.map((item, index) => (
                    <div key={index}>
                      <img
                        src={item.banner}
                        alt="News"
                        className="w-full h-60 object-cover rounded-lg shadow-md"
                      />
                    </div>
                  ))}
                </Slider>
              )}
            </div>



            {/* Events Section */}
            <h3 className="text-2xl font-bold text-indigo-800 mb-6">EVENTS</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {Events.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105"
                >
                  {event.img ? (
                    <img
                      src={event.img}
                      alt={event.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    null
                  )}
                  <div className="p-4">
                    <h4 className="text-xl font-semibold text-gray-800">{event.title}</h4>
                    <p className="text-gray-600 text-sm">
                      Deadline: {new Date(event.deadline).toLocaleString()}
                    </p>
                    <div className="flex items-center mt-3">
                      <img
                        src={event.club_id.logo}
                        alt={event.club_id.name}
                        className="w-8 h-8 rounded-full border-2 border-indigo-500"
                      />
                      <p className="ml-3 text-indigo-600 font-medium">
                        {event.club_id.name}
                      </p>
                    </div>
                    <p className="mt-3 text-gray-700">
                      Students Registered: {event.registrated_students_count}
                    </p>
                    <a
                      href={event.url || "#"}
                      className="block mt-4 text-indigo-500 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {event.url ? "View More" : "Details Coming Soon"}
                    </a>
                    <button
                      onClick={() => handleRegisterClick(event)}
                      className="w-full bg-indigo-500 text-white py-2 rounded-lg mt-3"
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
          <div className="rounded-3xl">
            {filteredUsers.map((user, index) => (
              <div
                key={index}
                className="mb-4 p-4 border border-indigo-200 rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out"
              >
                {/* User Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-indigo-500"
                    />
                    <div className="ml-4">
                      <h4 className="text-lg font-bold text-gray-800">{user.name}</h4>
                      <p className="text-xs text-gray-600">
                        {user.faculty?.faculty_name || "N/A"} |{" "}
                        {user.grade?.grade_name || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-yellow-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-base font-bold text-gray-800">
                      {user.token_count}
                    </p>
                  </div>
                  <button
                    className="bg-indigo-500 text-white px-4 py-2 rounded-full text-sm hover:bg-indigo-600 transition duration-200"
                    onClick={() => openModal(user)}
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
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