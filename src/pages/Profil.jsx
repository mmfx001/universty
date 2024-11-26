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

    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    let id = loggedInUser._id;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get("https://unversty-2.onrender.com/users");
                const user = response.data.find((u) => u._id === id);

                if (user) {
                    setUserData(user); // Set userData after finding the user
                } else {
                    setError("User not found");
                }
            } catch (err) {
                setError("Ma'lumotlarni olib kelishda xatolik yuz berdi.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [id]);

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
        <div className="w-full bg-white from-blue-500 to-blue-600 py-8 px-4 sm:px-6 lg:px-12">
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
                            src={userData.img}
                            alt={userData.name}
                            className="w-32 h-32 sm:w-48 sm:h-48 rounded-full border-4 p-1 border-white shadow-lg"
                        />
                    )}
                    <div className="text-center sm:text-left">
                        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
                            {loading ? <Skeleton width={200} /> : `${userData.name} ${userData.surname}`}
                        </h1>
                        <p className="text-lg sm:text-2xl text-white mt-2">
                            {loading ? <Skeleton width={150} /> : userData.role}
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
                            {loading ? <Skeleton /> : userData.faculty || "No Faculty Information"}
                        </p>
                        {!loading && userData.faculty && (
                            <button
                                onClick={() => copyToClipboard(userData.faculty)}
                                className="w-5 mt-3 sm:mt-5"
                            >
                                <img src="https://cdn-icons-png.flaticon.com/512/1621/1621635.png" alt="" />
                            </button>
                        )}
                    </div>
                    <div className="p-4 sm:p-6 border-l-4 border-green-500 bg-gray-50 rounded-lg shadow-md">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-700">Coins</h3>
                        <p className="text-green-600 mt-2 sm:mt-3 text-2xl sm:text-3xl font-bold">
                            {loading ? <Skeleton /> : userData.tokens[0]?.quantity || 0}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profil;