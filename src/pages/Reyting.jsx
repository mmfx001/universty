import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { Star } from 'lucide-react';

const Reyting = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // Foydalanuvchi ma'lumotlarini API dan olish
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://unversty-2.onrender.com/users');
                setUsers(response.data);
            } catch (error) {
                console.error('Ma\'lumotni olishda xato:', error);
            } finally {
                setLoading(false); // Ma'lumotlar olingandan so'ng loading holatini o'chirish
            }
        };

        fetchData();
    }, []);

    // Modal oynasini ochish va foydalanuvchini tanlash
    const openModal = (user) => {
        setSelectedUser(user);
        setModalIsOpen(true);
    };

    // Modal oynasini yopish
    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedUser(null);
    };

    // Skeleton loader komponenti
    const SkeletonLoader = () => (
        <div className="animate-pulse mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 p-6 rounded-xl bg-white shadow-md">
                <div className="w-16 h-16 rounded-full bg-gray-300"></div>
                <div className="h-6 bg-gray-300 rounded col-span-1"></div>
                <div className="h-6 bg-gray-300 rounded col-span-1"></div>
                <div className="h-6 bg-gray-300 rounded col-span-1"></div>
                <div className="h-6 bg-gray-300 rounded col-span-1"></div>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <p className="text-2xl font-semibold text-center text-indigo-600 mt-4">O'quvchilar Reytingi</p>

            <div className="overflow-x-auto mt-6 px-6 max-w-7xl mx-auto"> {/* Slightly larger max width */}
                {/* Jadval sarlavhalari */}
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-4 text-indigo-600 font-medium text-lg">
                    <p>Rasm</p>
                    <p>Ism</p>
                    <p>Fakultet</p>
                    <p>Kurs</p>
                    <p>Umumiy Coin</p>
                </div>



                <div>
                    {/* Ma'lumotlar yuklanayotgan bo'lsa skeleton loader ko'rsatish */}
                    {loading ? (
                        Array.from({ length: 5 }).map((_, index) => (
                            <SkeletonLoader key={index} />
                        ))
                    ) : (
                        users.map((user, index) => (
                            <div key={index} className="grid grid-cols-1 sm:grid-cols-5 gap-4 p-6 rounded-xl bg-white shadow-md mb-4 hover:bg-gray-200 transition-colors">
                                <button onClick={() => openModal(user)} className="flex items-center justify-center">
                                    <img
                                        src={user.img || 'https://joybox.uz/wp-content/uploads/default-user.png'}
                                        alt="Profile"
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                </button>
                                <button onClick={() => openModal(user)} className="flex items-center justify-center">
                                    <p>{user.name} {user.surname}</p>
                                </button>
                                <button onClick={() => openModal(user)} className="flex items-center justify-center">
                                    <p>{user.faculty}</p>
                                </button>
                                <button onClick={() => openModal(user)} className="flex items-center justify-center">
                                    <p>{user.course || 'Ma\'lumot mavjud emas'}</p>
                                </button>
                                <button onClick={() => openModal(user)} className="flex items-center justify-center">
                                    <p>{user.tokens.length > 0 ? user.tokens[0].quantity : 0} Coin</p>
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Modal oynasi foydalanuvchi ma'lumotlari */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                className="p-10 rounded-3xl shadow-2xl max-w-lg mx-auto mt-20 bg-white"
                overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center"
                contentLabel="Foydalanuvchi Ma'lumotlari"
            >
                {selectedUser && (
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-xl font-semibold text-indigo-600">
                                {selectedUser.name} {selectedUser.surname}
                            </h2>
                            <p className="text-gray-500">
                                Umumiy Coini: {selectedUser.tokens.length > 0 ? selectedUser.tokens[0].quantity : 0}
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-indigo-600">Coin Tarixi:</h3>
                            <ul className="list-disc pl-6">
                                {selectedUser.tokens && selectedUser.tokens.length > 0 ? (
                                    selectedUser.tokens.map((item, idx) => (
                                        <li key={idx} className="text-gray-600">
                                            Token ID: {item._id}, Miqdor: {item.quantity}
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-gray-500">Ma'lumot mavjud emas</li>
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