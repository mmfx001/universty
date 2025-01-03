import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import User from '../assets/user.png';

// Function to check if the image URL is valid
const isValidImageUrl = (url) => {
    const img = new Image();
    img.src = url;
    return img.complete && img.naturalHeight !== 0;
};

const Reyting = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const accessToken = localStorage.getItem('accessToken');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    'http://37.140.216.178/api/v1/users/rating/',
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
                setUsers(response.data.results || []);
            } catch (error) {
                console.error('Error fetching data:', error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [accessToken]);

    // Open modal and select a user
    const openModal = (user) => {
        setSelectedUser(user);
        setModalIsOpen(true);
    };

    // Close modal
    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedUser(null);
    };

    // Skeleton loader component
    const SkeletonLoader = () => (
        <div className="animate-pulse mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 p-4 rounded-xl bg-white shadow-md">
                <div className="w-14 h-14 rounded-full bg-gray-300"></div>
                <div className="h-5 bg-gray-300 rounded col-span-1"></div>
                <div className="h-5 bg-gray-300 rounded col-span-1"></div>
                <div className="h-5 bg-gray-300 rounded col-span-1"></div>
                <div className="h-5 bg-gray-300 rounded col-span-1"></div>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col min-h-screen bg-indigo-50">
            <p className="text-3xl font-bold text-center text-indigo-600 mt-5"></p>

            <div className="overflow-x-auto mt-6 px-6 w-[100%] mx-auto">
                <div>
                    {loading ? (
                        Array.from({ length: 5 }).map((_, index) => (
                            <SkeletonLoader key={index} />
                        ))
                    ) : (
                        users.map((user, index) => (
                            <div
                                key={index}
                                className="grid grid-cols-1 sm:grid-cols-5 gap-4 p-4 rounded-2xl bg-gradient-to-b from-indigo-500 to-indigo-700 text-white mb-4 hover:bg-gray-200 transition-colors"
                            >
                                <div className="flex flex-col items-center">
                                    <img
                                        src={`http://37.140.216.178${user.image|| "https://via.placeholder.com/120"}`}
                                        alt={user.name}
                                        className="w-16 h-16 rounded-full border-4 border-indigo-600 bg-slate-50 object-cover bg-transparent"
                                    />
                                </div>
                                <button onClick={() => openModal(user)} className="flex flex-col items-center justify-center">
                                    <p className="text-center text-sm">{user.name || 'Noma\'lum'}</p>
                                </button>
                                <button onClick={() => openModal(user)} className="flex flex-col items-center justify-center">
                                    <p className="text-center text-sm">
                                        {user.faculty?.faculty_name || 'Noma\'lum'}
                                    </p>
                                </button>
                                <button onClick={() => openModal(user)} className="flex flex-col items-center justify-center">
                                    <p className="text-center text-sm">
                                        {user.grade?.grade_name || 'Noma\'lum'}
                                    </p>
                                </button>
                                <button onClick={() => openModal(user)} className="flex flex-col items-center justify-center">
                                    <p className="text-center text-sm">{user.inactive_tokens || 0} Coin</p>
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                className="p-6 rounded-3xl shadow-2xl w-[35%] mx-auto mt-10 bg-white"
                overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center"
                contentLabel="Foydalanuvchi Ma'lumotlari"
            >
                {selectedUser && (
                    <div className="space-y-3">
                        <div>
                            <h2 className="text-xl font-semibold text-indigo-600">
                                {selectedUser.name || 'Ma\'lumot mavjud emas'}
                            </h2>
                            <p className="text-gray-500 text-sm">
                                Fakultet nomi: {selectedUser.faculty?.faculty_name || 'Ma\'lumot mavjud emas'}
                            </p>
                            <p className="text-gray-500 text-sm">
                                Umumiy Coini: {selectedUser.inactive_tokens || '0'}
                            </p>
                        </div>
                        <button
                            onClick={closeModal}
                            className="mt-4 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg shadow-lg"
                        >
                            Yopish
                        </button>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Reyting;
