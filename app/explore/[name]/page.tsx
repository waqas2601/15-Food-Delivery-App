"use client";

import CustomerHeader from "@/app/_components/CustomerHeader";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Footer from "@/app/_components/Footer";
import { useCart } from "@/app/hooks/useCart";

interface Restaurant {
  _id: string;
  restoName: string;
  city: string;
  adress: string;
  phone: string;
  email: string;
}

interface FoodItem {
  _id: string;
  name: string;
  price: number;
  description: string;
  img_path: string;
}

const Page = () => {
  const params = useParams();
  const searchParams = useSearchParams();

  const name = params.name as string;
  const id = searchParams.get("id");

  const [restaurantDetails, setRestaurantDetails] = useState<Restaurant | null>(
    null
  );
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [searchFood, setSearchFood] = useState("");
  const [loading, setLoading] = useState(true);
  const [showRestaurantWarning, setShowRestaurantWarning] = useState(false);
  const [pendingItem, setPendingItem] = useState<FoodItem | null>(null);

  const {
    cartData,
    addToCart,
    removeFromCart,
    isInCart,
    isDifferentRestaurant,
    clearCart,
  } = useCart();

  useEffect(() => {
    if (id) {
      loadRestaurantDetails();
    }
  }, [id]);

  const loadRestaurantDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/api/customer/${id}`);
      const data = await response.json();

      if (data.success) {
        setRestaurantDetails(data.details);
        setFoodItems(data.foodItems);
      }
    } catch (error) {
      console.error("Error loading restaurant details:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFoodItems = foodItems.filter((item) =>
    item.name?.toLowerCase().includes(searchFood.toLowerCase())
  );

  const handleAddToCart = (item: FoodItem) => {
    if (!id) return;

    // Check if trying to add from different restaurant
    if (isDifferentRestaurant(id)) {
      setPendingItem(item);
      setShowRestaurantWarning(true);
      return;
    }

    // Add resto_id to item
    addToCart({ ...item, resto_id: id });
  };

  const handleReplaceCart = () => {
    if (!id || !pendingItem) return;
    clearCart();
    addToCart({ ...pendingItem, resto_id: id });
    setShowRestaurantWarning(false);
    setPendingItem(null);
  };

  const handleCancelReplace = () => {
    setShowRestaurantWarning(false);
    setPendingItem(null);
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <CustomerHeader cartData={cartData} />
        <div className="flex items-center justify-center h-96">
          <p className="text-xl text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!restaurantDetails) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <CustomerHeader cartData={cartData} />
        <div className="flex items-center justify-center h-96">
          <p className="text-xl text-gray-500">Restaurant not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <CustomerHeader cartData={cartData} />

      {/* Restaurant Warning Modal */}
      {showRestaurantWarning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Replace cart items?
            </h3>
            <p className="text-gray-600 mb-6">
              Your cart contains items from a different restaurant. Do you want
              to replace them with items from this restaurant?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleCancelReplace}
                className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleReplaceCart}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Replace Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HERO SECTION */}
      <section
        className="relative w-full h-64 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=1200&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold drop-shadow-lg">
            {restaurantDetails.restoName}
          </h1>
          <p className="mt-2 text-lg opacity-90">
            {restaurantDetails.adress}, {restaurantDetails.city} — 📞{" "}
            {restaurantDetails.phone}
          </p>
        </div>
      </section>

      {/* RESTAURANT DETAILS */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white shadow-md rounded-xl p-6 flex flex-col md:flex-row items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {restaurantDetails.restoName}
            </h2>
            <p className="text-gray-600 mt-1">✉️ {restaurantDetails.email}</p>

            <div className="flex gap-4 mt-3 text-sm text-gray-700">
              <span>⭐ 4.8 Rating</span>
              <span>•</span>
              <span>🍽 {foodItems.length} Dishes</span>
              <span>•</span>
              <span>🚚 Fast Delivery</span>
            </div>
          </div>

          <button className="mt-4 md:mt-0 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition">
            Order Now
          </button>
        </div>
      </section>

      {/* SEARCH FOOD */}
      <div className="max-w-6xl mx-auto px-4">
        <input
          type="text"
          placeholder="Search dishes..."
          value={searchFood}
          onChange={(e) => setSearchFood(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none shadow-sm"
        />
      </div>

      {/* FOOD MENU GRID */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Menu</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFoodItems.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
            >
              {item.img_path ? (
                <img
                  src={item.img_path}
                  alt={item.name}
                  className="w-full h-40 object-cover"
                />
              ) : (
                <div className="w-full h-40 bg-linear-to-r from-red-400 to-orange-400 flex items-center justify-center">
                  <span className="text-white text-4xl font-bold">
                    {item.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}

              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                  {item.description}
                </p>

                <div className="flex justify-between items-center mt-3">
                  <span className="text-red-600 font-semibold text-lg">
                    Rs {item.price}
                  </span>

                  {isInCart(item._id) ? (
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="px-4 py-2 bg-gray-400 text-white rounded-lg text-sm hover:bg-gray-500 transition"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition"
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredFoodItems.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg">
              {searchFood
                ? "No dishes found matching your search"
                : "No menu items available"}
            </p>
            {searchFood && (
              <button
                onClick={() => setSearchFood("")}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Page;
