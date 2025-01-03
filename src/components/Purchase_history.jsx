
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, X } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';


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
  const isGuestUser = loggedInUser && loggedInUser.email === "guest@example.com";
  const access_token = localStorage.getItem('accessToken')




  useEffect(() => {
    if (loggedInUser && !isGuestUser) {
      const user = loggedInUser
      setUserData(user)

    }
  }, []);


  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      if (!userData) return;
      try {
        const response = await axios.get('http://37.140.216.178/api/v1/shop/shophistory/', {
          headers: {
            "authorization": `Bearer ${access_token}`
          }
        });
        const userhistory = response.data

        setPurchaseHistory(userhistory)

      } catch (error) {
        console.error("Error fetching purchase history:", error);
      } finally {
        setIsLoading(false); 
      }
    };

    fetchPurchaseHistory();
  }, [userData]);




  const openCancelModal = (purchase) => {
    setSelectedPurchase(purchase);
    setIsModalOpen(true);
  };

  
  const closeCancelModal = () => {
    setSelectedPurchase(null);
    setIsModalOpen(false);
  };




  return (
    <div className="min-h-screen pb-24 md:pb-6 bg-gray-50">
      <div className="sticky top-0 bg-white shadow-md z-10">
        <div className="container mx-auto flex items-center justify-between h-16 px-4 sm:px-6">
          <Link to='/shop' className="text-indigo-600 font-semibold ml-10 flex items-center hover:text-indigo-800 transition-colors duration-300">
            <ArrowLeft className="mr-2 h-5 w-5" />
            <span className="text-lg">back</span>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />) 
            : purchaseHistory.map((purchase) => (
              <div key={purchase.shop_code} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 flex flex-col gap-2 items-center text-center h-full">
                  <div className="w-60 h-48 mb-4">
                    <img
                      src={purchase.product_id.img}
                      alt={purchase.product_id.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="space-y-3 w-full">
                    <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${purchase.status === 'pending' ? 'bg-blue-50 text-blue-600' : ''} ${purchase.status === 'confirmed' ? 'bg-green-50 text-green-600' : ''} ${purchase.status === 'canceled' ? 'bg-red-50 text-red-600' : ''}`}>
                      {purchase.status}
                    </span>

                    <h3 className="text-xl font-semibold text-gray-900">
                      {purchase.product_id.name}
                    </h3>



                    <div className="flex items-center justify-center gap-1">
                      <span className="text-2xl font-bold text-indigo-500">{purchase.product_id.cost}</span>
                      <span className="text-gray-600">Coins</span>
                    </div>

                    <div className="text-sm text-gray-500">
                      code product <span className="text-gray-900 font-medium">{purchase.shop_code}</span>
                    </div>

                    <div className="flex items-center justify-center text-sm text-gray-500 gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(purchase.time).toLocaleString('ru-RU', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>


      {isModalOpen && selectedPurchase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl max-w-md w-[90%] shadow-2xl">
            <h2 className="text-2xl font-bold mb-4 text-indigo-600 flex items-center">
              <X className="mr-2 h-6 w-6" />
              cancellation product
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