import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, X } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Скелетон для загрузки
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-6 animate-pulse flex flex-col gap-2 items-center text-center h-full">
    <div className="w-60 h-48 bg-gray-200 rounded-lg mb-4"></div>
    <div className="w-24 h-6 bg-gray-200 rounded mb-3"></div>
    <div className="w-32 h-8 bg-gray-200 rounded mb-3"></div>
    <div className="w-full h-10 bg-gray-200 rounded mt-auto"></div>
  </div>
);

const PurchaseHistory = () => {
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

  // Check if the user is a guest
  const isGuestUser = loggedInUser && loggedInUser.email === "guest@example.com";

  useEffect(() => {
    if (loggedInUser && !isGuestUser) {
      fetch(`https://unversty-2.onrender.com/users/${loggedInUser._id}`)
        .then(res => res.json())
        .then(data => setUserData(data))
        .catch(error => console.error("Error fetching user data:", error));
    }
  }, [loggedInUser, isGuestUser]);


  // Загрузка истории покупок
  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      if (!userData) return;
      try {
        const response = await axios.get('https://unversty-2.onrender.com/purchases');
        const userPurchases = response.data.filter(purchase => purchase.userId === userData._id);
        const sortedPurchases = userPurchases.sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate));
        setPurchaseHistory(sortedPurchases);
      } catch (error) {
        console.error("Error fetching purchase history:", error);
      } finally {
        setIsLoading(false); // Завершаем загрузку
      }
    };

    fetchPurchaseHistory();
  }, [userData]);

  // Открытие модального окна для отмены покупки
  const openCancelModal = (purchase) => {
    setSelectedPurchase(purchase);
    setIsModalOpen(true);
  };

  // Закрытие модального окна
  const closeCancelModal = () => {
    setSelectedPurchase(null);
    setIsModalOpen(false);
  };

  // Отмена покупки
  const cancelPurchase = async () => {
    if (!selectedPurchase) return;

    try {
      const productResponse = await axios.get(`https://unversty-2.onrender.com/products/${selectedPurchase.productId}`);
      const product = productResponse.data;

      await axios.put(`https://unversty-2.onrender.com/products/${selectedPurchase.productId}`, {
        quantity: product.quantity + 1
      });

      const updatedUser = await axios.put(`https://unversty-2.onrender.com/users/${userData._id}`, {
        tokens: [{ quantity: userData.tokens[0].quantity + selectedPurchase.cost }]
      });

      await axios.put(`https://unversty-2.onrender.com/purchases/${selectedPurchase._id}`, {
        status: "отменен"
      });

      setPurchaseHistory(prevHistory =>
        prevHistory.map(item =>
          item._id === selectedPurchase._id ? { ...item, status: 'отменен' } : item
        )
      );
      setUserData(updatedUser.data);

      closeCancelModal();
      alert("Покупка отменена.");
    } catch (error) {
      console.error("Error canceling purchase:", error);
      alert("Произошла ошибка при отмене покупки.");
    }
  };

  return (
    <div className="min-h-screen pb-24 md:pb-6 bg-gray-50">
      <div className="sticky top-0 bg-white shadow-md z-10">
        <div className="container mx-auto flex items-center justify-between h-16 px-4 sm:px-6">
          <Link to='/shop' className="text-indigo-600 font-semibold ml-10 flex items-center hover:text-indigo-800 transition-colors duration-300">
            <ArrowLeft className="mr-2 h-5 w-5" />
            <span className="text-lg">Magazinga qaytish</span>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />) // Показываем 6 скелетонов
            : purchaseHistory.map((purchase) => (
              <div key={purchase._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 flex flex-col gap-2 items-center text-center h-full">
                  <div className="w-60 h-48 mb-4">
                    <img
                      src={purchase.productImg}
                      alt={purchase.productName}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  <div className="space-y-3 w-full">
                    <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                      purchase.status === 'ожидает выдачи' 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'bg-green-50 text-green-600'
                    }`}>
                      {purchase.status}
                    </span>
                    
                    <h3 className="text-xl font-semibold text-gray-900">
                      {purchase.productName}
                    </h3>
                    
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-2xl font-bold text-indigo-500">{purchase.cost}</span>
                      <span className="text-gray-600">Coins</span>
                    </div>
                    
                    <div className="text-sm text-gray-500">
                      Код покупки <span className="text-gray-900 font-medium">{purchase._id.slice(-5)}</span>
                    </div>
                    
                    <div className="flex items-center justify-center text-sm text-gray-500 gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(purchase.purchaseDate).toLocaleString('ru-RU', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</span>
                    </div>
                  </div>

                  {purchase.status === 'ожидает выдачи' && (
                    <button
                      className="w-full mt-auto bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-green-900 transition-colors duration-300 flex items-center justify-center"
                      onClick={() => openCancelModal(purchase)}
                    >
                      <X className="mr-2 h-5 w-5" />
                      Отменить покупку
                    </button>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Модальное окно для отмены покупки */}
      {isModalOpen && selectedPurchase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl max-w-md w-[90%] shadow-2xl">
            <h2 className="text-2xl font-bold mb-4 text-indigo-600 flex items-center">
              <X className="mr-2 h-6 w-6" />
              Подтверждение отмены
            </h2>
            <p className="mb-6 text-gray-600">Вы действительно хотите отменить эту покупку?</p>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800">{selectedPurchase.productName}</h3>
              <p className="text-sm text-gray-600 mt-1">Стоимость: {selectedPurchase.cost} Монет</p>
              <p className="text-sm text-gray-600 mt-1">Дата покупки: {new Date(selectedPurchase.purchaseDate).toLocaleDateString()}</p>
              <img
                src={selectedPurchase.productImg}
                alt={selectedPurchase.productName}
                className="h-40 w-full object-contain mt-4 rounded-lg shadow-md"
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-300"
                onClick={closeCancelModal}
              >
                Отмена
              </button>
              <button
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300"
                onClick={cancelPurchase}
              >
                Отменить покупку
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseHistory;
