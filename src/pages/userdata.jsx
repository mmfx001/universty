import { useState, useEffect } from 'react';
import axios from 'axios';

const Posts = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await axios.get('http://37.140.216.178/api/v1/clubs/getallclubs/');
        console.log('Fetched club data:', response.data); // Ma'lumotlarni konsolga chiqarish
        setClubs(response.data);
      } catch (error) {
        console.error('Error fetching club data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-100 py-8">
      <div className="max-w-4xl w-full space-y-6">
        {clubs.length > 0 ? (
          clubs.map((club) => (
            <div
              key={club._id}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200 flex flex-col items-start space-y-4"
            >
              <img
                src={club.image || 'https://via.placeholder.com/150'}
                alt={club.title}
                className="w-full h-48 object-cover rounded-md"
              />
              <h2 className="text-xl font-semibold text-gray-800">{club.title || 'No Title'}</h2>
              <p className="text-gray-600">{club.description || 'No Description'}</p>
              <div className="text-sm text-gray-500">
                <p>
                  <span className="font-semibold">Club ID:</span> {club.club_id || 'No ID'}
                </p>
                <p>
                  <span className="font-semibold">Date & Time:</span> {club.datetime || 'No Time'}
                </p>
                <p>
                  <span className="font-semibold">Likes:</span> {club.likes || 0}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-lg font-poppins text-gray-600">No club data available.</p>
        )}
      </div>
    </div>
  );
};

export default Posts;
