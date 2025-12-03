"use client";
import { useEffect, useState, useRef } from "react";
import CustomerHeader from "./_components/CustomerHeader";
import Footer from "./_components/Footer";
import { useRouter } from "next/navigation";
import { useCart } from "./hooks/useCart";

interface Restaurant {
  _id: string;
  restoName: string;
  city: string;
  adress: string;
  phone: string;
  email: string;
}

export default function Home() {
  const [locations, setLocations] = useState<string[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [searchLocation, setSearchLocation] = useState("");
  const [searchRestaurant, setSearchRestaurant] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const { cartData, addToCart } = useCart();

  const router = useRouter();

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadLocations();
    loadRestaurants();

    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadRestaurants = async (location?: string, restaurant?: string) => {
    // Build query params
    const params = new URLSearchParams();
    if (location) params.append("location", location);
    if (restaurant) params.append("restaurant", restaurant);

    const url = `http://localhost:3000/api/customer${
      params.toString() ? `?${params.toString()}` : ""
    }`;

    const response = await fetch(url);
    const data = await response.json();
    if (data.success) {
      setRestaurants(data.result);
    }
  };

  const loadLocations = async () => {
    const response = await fetch(
      "http://localhost:3000/api/customer/locations"
    );
    const data = await response.json();
    if (data.success) {
      setLocations(data.data);
    }
  };

  const handleSearch = () => {
    loadRestaurants(searchLocation, searchRestaurant);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClearFilters = () => {
    setSearchLocation("");
    setSearchRestaurant("");
    loadRestaurants();
  };

  return (
    <>
      <CustomerHeader cartData={cartData} />

      {/* HERO SECTION */}
      <section className="relative h-[70vh] w-full">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80')",
          }}
        ></div>
        <div className="absolute inset-0 bg-black opacity-50"></div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Find the best <span className="text-red-400">food</span> near you
          </h1>
          <p className="text-gray-200 text-lg max-w-xl mb-8">
            Order fresh meals from top-rated restaurants near your location.
          </p>

          {/* SEARCH BAR */}
          <div className="relative bg-white w-full max-w-3xl shadow-lg rounded-xl p-4 flex flex-col md:flex-row gap-4 md:gap-2">
            <div className="relative w-full" ref={dropdownRef}>
              <input
                type="text"
                placeholder="Enter your location"
                value={searchLocation}
                onChange={(e) => {
                  setSearchLocation(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              />

              {showDropdown && (
                <ul className="absolute left-0 right-0 bg-white border rounded-lg mt-1 shadow-lg max-h-48 overflow-y-auto z-20">
                  {locations
                    .filter((loc) =>
                      loc.toLowerCase().includes(searchLocation.toLowerCase())
                    )
                    .map((loc, index) => (
                      <li
                        key={index}
                        onClick={() => {
                          setSearchLocation(loc);
                          setShowDropdown(false);
                        }}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {loc}
                      </li>
                    ))}

                  {locations.filter((loc) =>
                    loc.toLowerCase().includes(searchLocation.toLowerCase())
                  ).length === 0 && (
                    <li className="px-4 py-2 text-gray-500">
                      No locations found
                    </li>
                  )}
                </ul>
              )}
            </div>

            <input
              type="text"
              placeholder="Search food or restaurant"
              value={searchRestaurant}
              onChange={(e) => setSearchRestaurant(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
            />

            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
            >
              Search
            </button>
          </div>
        </div>
      </section>

      {/* RESTAURANTS SECTION */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
            Popular Restaurants
          </h2>
          <p className="text-gray-500 text-center mb-6">
            Discover the best restaurants in your area
          </p>

          {/* Active Filters */}
          {(searchLocation || searchRestaurant) && (
            <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
              <span className="text-gray-600">Filters:</span>
              {searchLocation && (
                <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm">
                  📍 {searchLocation}
                </span>
              )}
              {searchRestaurant && (
                <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm">
                  🍽️ {searchRestaurant}
                </span>
              )}
              <button
                onClick={handleClearFilters}
                className="px-3 py-1 bg-gray-200 text-gray-600 rounded-full text-sm hover:bg-gray-300 transition"
              >
                Clear all ✕
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((item: Restaurant) => (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >
                {/* Restaurant Image Placeholder */}
                <div className="h-40 bg-linear-to-r from-red-400 to-orange-400 flex items-center justify-center">
                  <span className="text-white text-4xl font-bold">
                    {item.restoName?.charAt(0).toUpperCase()}
                  </span>
                </div>

                {/* Restaurant Info */}
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {item.restoName}
                  </h3>

                  <div className="space-y-2 text-sm text-gray-600">
                    <p className="flex items-center gap-2">
                      <span className="text-red-500">📍</span>
                      {item.city}
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-red-500">🏠</span>
                      {item.adress}
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-red-500">📞</span>
                      {item.phone}
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-red-500">✉️</span>
                      {item.email}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      router.push(
                        `explore/${encodeURIComponent(item.restoName)}?id=${
                          item._id
                        }`
                      )
                    }
                    className="mt-4 w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    View Menu
                  </button>
                </div>
              </div>
            ))}
          </div>

          {restaurants.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500 text-lg mb-4">No restaurants found</p>
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Show all restaurants
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
