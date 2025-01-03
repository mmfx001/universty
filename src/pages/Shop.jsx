import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Komponent: Kartochka
function Card({ children, className }) {
  return (
    <div className={`w-full overflow-hidden rounded-lg border bg-white shadow-md hover:shadow-lg transition-shadow ${className}`}>
      {children}
    </div>
  );
}

// Komponent: Skeleton yuklanish holati
function SkeletonCard() {
  return (
    <div className="w-full overflow-hidden rounded-lg border bg-indigo-50 shadow-md animate-pulse">
      <div className="h-40 sm:h-48 bg-gray-200"></div>
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-300 rounded"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        <div className="h-10 bg-gray-300 rounded mt-4"></div>
      </div>
    </div>
  );
}

// Shop komponenti
export default function Shop() {
  const [userData, setUserData] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Foydalanuvchi ma'lumotlarini olish
  useEffect(() => {
    const fetchUserInfo = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) return;

      try {
        const response = await axios.get("http://37.140.216.178/api/v1/users/userinfo/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setUserData(Array.isArray(response.data) ? response.data[0] : response.data);
      } catch (error) {
      }a  
    };
    fetchUserInfo();
  }, []);

  // Mahsulotlarni olish
  useEffect(() => {
    const fetchProducts = async () => {
      const accessToken = localStorage.getItem('accessToken');
      try {
        const response = await axios.get("http://37.140.216.178/api/v1/shop/getproducts/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setProducts(response.data);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Tasdiqlash oynasini ochish
  const openConfirmationModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Tasdiqlash oynasini yopish
  const closeConfirmationModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Xarid qilish
  const handlePurchase = async () => {
    if (userData.active_tokens >= selectedProduct.cost && selectedProduct.quantity > 0) {
      try {
        const updatedUser = {
          ...userData,
          active_tokens: userData.active_tokens - selectedProduct.cost,
        };

        // Mahsulotni xarid qilishni qayd etish
        const purchase = { product_id: selectedProduct.id };
        await axios.post("http://37.140.216.178/api/v1/shop/buyproduct/", purchase, {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        });

        setUserData(updatedUser);
        closeConfirmationModal();
      } catch (error) {
        console.error("Xaridni amalga oshirishda xato:", error);
      }
    } else {
    }
  };

  // Guest foydalanuvchini tekshirish
  const isGuestUser = userData && userData.email === "guest@example.com";

  return (
    <div className="min-h-screen pb-24 md:pb-6 bg-indigo-50">
      <div className="sticky top-0 bg-indigo-50 z-10 shadow-md">
        <div className="container mx-auto flex h-16 md:h-20 items-center justify-between px-4 sm:px-6">
          <div className="text-base md:text-lg lg:text-xl font-bold text-[#4A66D3]">Shop</div>
          <div className="flex items-center gap-7 md:gap-4 lg:gap-6">
            <Link to="/history" className="hidden md:flex items-center text-[#4A66D3] hover:text-[#3a51a6] transition-colors">
              <Clock className="mr-2 h-4 w-4 md:h-5 md:w-5" />
              <span className="text-sm md:text-base">Purchase History</span>
            </Link>
            <div className="text-[#4A66D3] font-semibold text-sm md:text-base">
              Tokens: {isGuestUser ? 0 : userData?.active_tokens || 0}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-4 md:py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {isLoading
            ? Array.from({ length: 8 }, (_, i) => <SkeletonCard key={i} />)
            : products.map((product) => (
                <Card key={product.id} className="flex flex-col">
                  <div className="relative flex-grow">
                    <img
                      src={product.img}
                      alt={product.name}
                      className="h-40 sm:h-48 w-full object-contain p-2"
                    />
                  </div>
                  <div className="p-4 flex flex-col justify-between flex-grow">
                    <div>
                      <h3 className="text-base md:text-lg font-semibold">{product.name}</h3>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-base md:text-lg font-bold text-[#1e3a8a]">
                          {product.cost} token
                        </span>
                        <span className="text-xs md:text-sm text-gray-600">
                          {product.quantity} quantity
                        </span>
                      </div>
                    </div>
                    <button
                      className="w-full bg-[#4A66D3] text-white py-2 px-4 rounded text-sm md:text-base hover:bg-[#3a51a6] transition-colors mt-4"
                      onClick={() => openConfirmationModal(product)}
                      disabled={
                        !userData ||
                        userData.active_tokens < product.cost ||
                        product.quantity === 0 ||
                        isGuestUser
                      }
                    >
                      {userData?.active_tokens < product.cost || product.quantity === 0
                        ? "Not enough tokens"
                        : "buy"}
                    </button>
                  </div>
                </Card>
              ))}
        </div>
      </div>

      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-[90%]">
            <h2 className="text-xl font-bold mb-4">Purchase confirmation</h2>
            <p className="mb-4">Would you like to buy this product?</p>
            <div className="mb-4">
              <img
                src={selectedProduct.img}
                alt={selectedProduct.name}
                className="h-40 sm:h-48 w-full object-contain p-2"
              />
              <div className="mt-2 flex justify-between">
                <span className="font-semibold text-lg">{selectedProduct.name}</span>
                <span className="font-bold text-lg">{selectedProduct.cost} token</span>
              </div>
            </div>
            <div className="flex justify-between mt-4">
              <button
                onClick={handlePurchase}
                className="px-6 py-2 bg-green-500 text-white rounded-md"
              >
                buy
              </button>
              <button
                onClick={closeConfirmationModal}
                className="px-6 py-2 bg-red-500 text-white rounded-md"
              >
                cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
