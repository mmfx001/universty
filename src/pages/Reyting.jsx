import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { Star } from 'lucide-react';

const Reyting = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // Fetch user data from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://unversty-2.onrender.com/users');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false); // Stop loading after data is fetched
            }
        };

        fetchData();
    }, []);

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
        <div className="flex flex-col min-h-screen bg-gray-100">
            <p className="text-3xl font-bold text-center text-indigo-600 mt-10">O'quvchilar Reytingi</p>

            <div className="overflow-x-auto mt-6 px-6 max-w-7xl mx-auto">
                {/* Table headers */}
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-4 text-indigo-600 font-medium text-lg">
                    <p className="text-center">Rasm</p>
                    <p className="text-center">Ism</p>
                    <p className="text-center">Fakultet</p>
                    <p className="text-center">Kurs</p>
                    <p className="text-center">Umumiy Coin</p>
                </div>



                <div>
                    {/* Show skeleton loader if data is loading */}
                    {loading ? (
                        Array.from({ length: 5 }).map((_, index) => (
                            <SkeletonLoader key={index} />
                        ))
                    ) : (
                        users.map((user, index) => (
                            <div key={index} className="grid grid-cols-1 sm:grid-cols-5 gap-4 p-4 rounded-xl bg-gradient-to-b from-indigo-500 to-indigo-700 text-white mb-4 hover:bg-gray-200 transition-colors">
                                {/* Profile Image */}
                                <button onClick={() => openModal(user)} className="flex flex-col items-center justify-center">
                                    <img
                                        src={user.img || 'https://joybox.uz/wp-content/uploads/default-user.png'}
                                        alt="Profile"
                                        className="w-14 h-14 rounded-full object-cover"
                                    />
                                </button>
                                {/* Name */}
                                <button onClick={() => openModal(user)} className="flex flex-col items-center justify-center">
                                    <p className="text-center text-sm">{user.name} {user.surname}</p>
                                </button>
                                {/* Faculty */}
                                <button onClick={() => openModal(user)} className="flex flex-col items-center justify-center">
                                    <p className="text-center text-sm">{user.faculty}</p>
                                </button>
                                {/* Course */}
                                <button onClick={() => openModal(user)} className="flex flex-col items-center justify-center">
                                    <p className="text-center text-sm">{user.course || 'Ma\'lumot mavjud emas'}</p>
                                </button>
                                {/* Coins */}
                                <button onClick={() => openModal(user)} className="flex flex-col items-center justify-center">
                                    <p className="text-center text-sm">{user.tokens.length > 0 ? user.tokens[0].quantity : 0} Coin</p>
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Modal for user details */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                className="p-6 rounded-3xl shadow-2xl max-w-lg mx-auto mt-10 bg-white"
                overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center"
                contentLabel="Foydalanuvchi Ma'lumotlari"
            >
                {selectedUser && (
                    <div className="space-y-3">
                        <div>
                            <h2 className="text-xl font-semibold text-indigo-600">
                                {selectedUser.name} {selectedUser.surname}
                            </h2>
                            <p className="text-gray-500 text-sm">
                                Umumiy Coini: {selectedUser.tokens.length > 0 ? selectedUser.tokens[0].quantity : 0}
                            </p>
                        </div>



                        <div>
                            <h3 className="text-lg font-semibold text-indigo-600">Coin Tarixi:</h3>
                            <ul className="list-disc pl-6">
                                {selectedUser.tokens && selectedUser.tokens.length > 0 ? (
                                    selectedUser.tokens.map((item, idx) => (
                                        <><li key={idx} className="text-gray-600 text-sm">
                                            Token ID: {item._id}
                                        </li>
                                            <li key={idx} className="text-gray-600 text-sm">
                                                Miqdor: {item.quantity}
                                            </li></>
                                    ))
                                ) : (
                                    <li className="text-gray-500 text-sm">Ma'lumot mavjud emas</li>
                                )}
                            </ul>
                        </div>

                        <div>
                            <button onClick={closeModal} className="mt-4 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg shadow-lg">
                                Yopish
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Reyting;