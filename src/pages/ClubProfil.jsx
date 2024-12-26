import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { FaUsers, FaRegStar, FaPlus, FaMinus } from "react-icons/fa"; // FontAwesome ikonalarini import qilish

function ClubProfile() {
    const location = useLocation();
    const club = location.state?.club;

    const [followers, setFollowers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);

    // Simulating user ID retrieval from localStorage
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    const userId = user?.id;

    useEffect(() => {
        const fetchClubData = async () => {
            if (!club?.id) return;

            try {
                setLoading(true);

                const response = await axios.get(
                    `http://37.140.216.178/api/v1/clubs/getallclubs/${club.id}/`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                        },
                    }
                );

                const clubData = response.data;
                setFollowers(clubData.followers || []);

                // Check if the user is following
                const followerIds = clubData.followers.map(follower => follower.id);
                setIsFollowing(followerIds.includes(userId));
            } catch (error) {
                console.error("Error fetching club data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchClubData();
    }, [club?.id, userId]);

    const handleFollowUnfollow = async () => {
        if (!userId) {
            alert("Please log in to follow/unfollow.");
            return;
        }
    
        try {
            let response;
            setLoading(true); // Add loading state for immediate UI feedback
    
            if (isFollowing) {
                // Unfollow the club
                response = await axios.delete(
                    `http://37.140.216.178/api/v1/users/joinclub/`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                        },
                        data: { club_id: club.id },
                    }
                );
    
                if (response.status === 200 || response.status === 204) {
                    setIsFollowing(false);
                    setFollowers(prevFollowers => 
                        prevFollowers.filter(follower => follower.id !== userId)
                    );
                }
            } else {
                // Follow the club
                response = await axios.post(
                    `http://37.140.216.178/api/v1/users/joinclub/`,
                    { club_id: club.id },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                        },
                    }
                );
    
                if (response.status === 201 || response.status === 200) {
                    setIsFollowing(true);
                    setFollowers(prevFollowers => [
                        ...prevFollowers,
                        {
                            id: userId,
                            name: user.name,
                            surname: user.surname || "",
                            image: user.image || null, // Ensure compatibility with backend data
                        },
                    ]);
                }
            }
        } catch (error) {
            console.error("Error updating follow status:", error);
            alert("An error occurred while updating your follow status. Please try again.");
        } finally {
            setLoading(false); // Stop loading indicator
        }
    };
    
    if (!club) {
        return (
            <div className="text-center text-red-500 mt-20">
                Club information not found
            </div>
        );
    }

    return (
        <div className="w-full bg-indigo-50 py-4 px-4 sm:px-6 lg:px-12">
            <div className="bg-indigo-500 shadow-xl rounded-lg p-2 sm:p-10 mb-4">
                <div className="flex flex-col sm:flex-row items-center sm:ml-16 gap-6 sm:gap-14">
                    <img
                        src={club.logo || "https://via.placeholder.com/150"}
                        alt={club.name || "Club Logo"}
                        className="w-24 h-24 sm:w-36 sm:h-36 rounded-full border-4 p-1 border-white shadow-lg"
                    />
                    <div className="text-center sm:text-left">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                            {club.name || "No name available"}
                        </h1>
                        <p className="text-lg sm:text-xl text-white mt-2">
                            {club.category?.name || "No category available"}
                        </p>
                        <button
                            onClick={handleFollowUnfollow}
                            className={`mt-4 px-6 py-2 rounded-full text-white ${isFollowing ? "bg-red-500" : "bg-blue-500"} hover:${isFollowing ? "bg-red-600" : "bg-blue-600"}`}
                        >
                            {isFollowing ? <><FaMinus /> Unfollow</> : <><FaPlus /> Follow</>}
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start justify-center gap-8">
                <div className="bg-white w-full sm:w-3/4 lg:w-2/3 p-2 h-[550px] rounded-lg shadow-lg mx-auto">
                    {/* Club posts component can be rendered here */}
                </div>

                <div className="bg-white w-full sm:w-3/4 lg:w-1/3 p-6 rounded-lg shadow-lg mx-auto">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                        <FaUsers className="inline mr-2" /> Followers
                    </h2>
                    {loading ? (
                        <p className="text-gray-600">Loading...</p>
                    ) : followers.length > 0 ? (
                        <ul className="space-y-4">
                            {followers.map(follower => (
                                <li
                                    key={follower.id}
                                    className="flex items-center p-4 border rounded-lg bg-gray-50 shadow-sm"
                                >
                                    <img
                                        src={`http://37.140.216.178${follower.image}`}
                                        alt={`${follower.name} ${follower.surname}`}
                                        className="w-12 h-12 rounded-full border-2 mr-4"
                                    />
                                    <div>
                                        <p className="font-semibold text-gray-700">
                                            {follower.name} {follower.surname}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-600">No followers yet</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ClubProfile;
