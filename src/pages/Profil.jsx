import React, { useEffect, useState } from "react";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css"; // Skeleton uchun CSS

const Profil = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState(""); // Xabar uchun state

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setNotification("Faculty ID nusxalandi!");
        setTimeout(() => setNotification(""), 3000);
    };

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const fetchUserInfo = async () => {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) return;

        try {
            const response = await axios.get("http://37.140.216.178/api/v1/users/userinfo/", {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            // If response data is an array, pick the first element
            const user = Array.isArray(response.data) ? response.data[0] : response.data;
            setUserData(user);
        } catch (error) {
            console.error("Error fetching user data:", error);
            setError("Data olishda xato yuz berdi.");
        } finally {
            setLoading(false);
        }
    };

    if (error)
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-600 font-semibold">{error}</p>
            </div>
        );

    if (loading)
        return (
            <div className="flex justify-center items-center h-screen">
                <Skeleton width={200} height={50} />
            </div>
        );

    return (
        <div className="w-full bg-indigo-50 from-blue-500 to-blue-600 py-8 px-4 sm:px-6 lg:px-12">
            {notification && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
                    {notification}
                </div>
            )}

            {/* Profil Skeleton */}
            <div className="bg-indigo-500 w-full shadow-xl rounded-lg p-6 sm:p-10 relative mb-8">
                <div className="flex flex-col sm:flex-row items-center sm:ml-16 gap-6 sm:gap-14">
                    {loading ? (
                        <Skeleton circle={true} height={120} width={120} />
                    ) : (
                        <img
                            src={`http://37.140.216.178${userData.image|| "https://via.placeholder.com/120"}`}
                            alt={userData.name}
                            className="w-32 h-32 sm:w-48 sm:h-48 rounded-full border-4 p-1 border-white shadow-lg"
                        />
                    )}
                    <div className="text-center sm:text-left">
                        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
                            {loading ? <Skeleton width={200} /> : `${userData.name} ${userData.surname}`}
                        </h1>
                        <p className="text-lg sm:text-2xl text-white mt-2">
                            {loading ? <Skeleton width={150} /> : userData.grade?.grade_name}
                        </p>
                        <p className="text-md sm:text-lg text-white mt-1">
                            {loading ? <Skeleton width={180} /> : `University ID: ${userData.university_id}`}
                        </p>
                    </div>
                </div>
            </div>

            {/* Profil ma'lumotlari */}
            <div className="bg-indigo-500 shadow-xl rounded-lg p-6 sm:p-10">
                <h2 className="text-2xl sm:text-4xl font-semibold text-white mb-6 sm:mb-8">
                    {loading ? <Skeleton width={300} /> : "Profile Information"}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
                    <div className="p-4 sm:p-6 border-l-4 border-blue-500 bg-gray-50 rounded-lg shadow-md">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-700">Faculty</h3>
                        <p className="text-gray-600 mt-2 sm:mt-3">
                            {loading ? <Skeleton /> : userData.faculty?.faculty_name || "No Faculty Information"}
                        </p>
                        {!loading && userData.faculty && (
                            <button
                                onClick={() => copyToClipboard(userData.faculty.faculty_name)}
                                className="w-5 mt-3 sm:mt-5"
                            >
                                <img
                                    src="https://cdn-icons-png.flaticon.com/512/1621/1621635.png"
                                    alt="copy"
                                    className="w-5 h-5"
                                />
                            </button>
                        )}
                    </div>
                    <div className="p-4 sm:p-6 border-l-4 border-green-500 bg-gray-50 rounded-lg shadow-md">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-700">Coins</h3>
                        <p className="text-green-600 mt-2 sm:mt-3 text-2xl sm:text-3xl font-bold">
                            {loading ? <Skeleton /> : userData.active_tokens || 0}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profil;
