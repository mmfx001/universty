import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
  </div>
);

function Clubs() {
  const [clubs, setClubs] = useState([]);
  const [filteredClubs, setFilteredClubs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    axios
      .get("http://37.140.216.178/api/v1/clubs/getallclubs/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((response) => {
        setClubs(response.data);
        setFilteredClubs(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = clubs.filter(
      (club) => club.name?.toLowerCase().includes(query)
    );
    setFilteredClubs(filtered);
  };

  const handleDetail = (club) => {
    navigate(`/clubprofile`, { state: { club } });
  };

  return (
    <div className="relative bg-indigo-50 min-h-screen">
      {loading && <LoadingSpinner />}
      <div
        className={`container mx-auto px-4 py-8 transition-opacity duration-300 ${
          loading ? "opacity-30 pointer-events-none" : "opacity-100"
        }`}
      >
        {error && <div className="text-center text-red-500">{error}</div>}
        {!loading && (
          <>
            <div className="flex justify-center mb-8">
              <input
                type="text"
                className="w-full max-w-md bg-white border border-gray-300 rounded-full py-2 px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                placeholder="Nom bo'yicha qidirish"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            <h1 className="text-4xl font-bold text-center mb-12 text-blue-600">
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredClubs.length > 0 ? (
                filteredClubs.map((club) => (
                  <div
                    key={club.id}
                    className="bg-gradient-to-b from-indigo-500 to-indigo-700 rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform duration-200"
                  >
                    <div className="flex justify-center mb-4">
                      <img
                        src={club.logo || "https://via.placeholder.com/150"}
                        alt={club.name || "Klub logosi"}
                        className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                      />
                    </div>
                    <h2 className="text-2xl font-semibold mb-2 text-white">
                      {club.name || "Nom berilmagan"}
                    </h2>
                    <p className="text-white mb-4">
                      <span className="font-bold">Lider:</span>{" "}
                      {`${club.leader?.name || ""} ${club.leader?.surname || ""}` ||
                        "Keltirilmagan"}
                    </p>
                    <p className="text-white mb-4">
                      <span className="font-bold">Kategoriya:</span>{" "}
                      {club.category?.name || "Keltirilmagan"}
                    </p>
                    <button
                      onClick={() => handleDetail(club)}
                      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-md shadow-md transition-colors duration-200"
                    >
                      Batafsil
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center text-gray-500">
                  no data
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Clubs;
