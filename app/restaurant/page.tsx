"use client";

import { useState } from "react";
import Footer from "../_components/Footer";
import Header from "../_components/Header";

// Import your fixed components
import RestaurantLogin from "../_components/Login";
import RestaurantSignup from "../_components/Signup";

const Restaurant = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-md mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Restaurant Partner Portal
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Manage your restaurant and receive orders
        </p>

        {/* Tab Switcher */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex border-b">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 font-semibold transition ${
                isLogin
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 font-semibold transition ${
                !isLogin
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Content */}
          <div className="p-8">
            {isLogin ? <RestaurantLogin /> : <RestaurantSignup />}
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm mb-2">
            Need help getting started?
          </p>
          <a
            href="#"
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default Restaurant;
