import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const formRef = useRef(null);



    const clearMessage = () => {
        setTimeout(() => {
            setMessage('');
        }, 5000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('http://37.140.216.178/api/v1/users/login/', {
                email,
                password,
            });

            if (response.status === 200) {
                const { access_token, refresh_token, ...userData } = response.data;

                // Tokenlarni localStoragega saqlash
                localStorage.setItem('accessToken', access_token);
                localStorage.setItem('refreshToken', refresh_token);

                // Foydalanuvchi ma'lumotlarini konsolga chiqarish
                console.log('Foydalanuvchi Ma\'lumotlari:', userData);
                localStorage.setItem('loggedInUser', JSON.stringify(userData));

                // Foydalanuvchini bosh sahifaga yo'naltirish
                navigate('/home');
            } else {
                setMessage('Login qilishda xatolik yuz berdi.');
                clearMessage();
            }
        } catch (error) {
            console.error('Xato:', error);
            setMessage("Tarmoq xatosi. Iltimos qayta urinib ko'ring.");
            clearMessage();
        } finally {
            setLoading(false);
        }
    };

    const handleGuestLogin = () => {
        const guestUser = { email: 'guest@example.com', name: 'Guest', role: 'guest' };
        localStorage.setItem('loggedInUser', JSON.stringify(guestUser));
        navigate('/home');
    };

    return (
        <div ref={formRef} className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">Kirish</h1>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                <input
                    type="password"
                    placeholder="Parol"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    autocomplete="current-password" 
                />
                {message && (
                    <p
                        className={`block mb-4 ${
                            message.includes('muvaffaqiyatli') ? 'text-green-500' : 'text-red-500'
                        }`}
                    >
                        {message}
                    </p>
                )}
                <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                >
                    {loading ? 'Yuklanmoqda...' : 'Kirish'}
                </button>
                <button
                    type="button"
                    className="w-full bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 mt-4"
                    onClick={handleGuestLogin}
                >
                    Guest Login
                </button>
            </form>
        </div>
    );
};

export default Login;
