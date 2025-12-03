"use client";

import AddFoodItem from "@/app/_components/AddFoodItem";
import FoodItemList from "@/app/_components/FoodItemList";
import Footer from "@/app/_components/Footer";
import Header from "@/app/_components/Header";
import { useState } from "react";

const Dashboard = () => {
  const [addItem, setAddItem] = useState(false);
  const [refresh, setRefresh] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-5xl mx-auto p-6">
        {/* Dashboard Buttons */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setAddItem(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Add Food
          </button>

          <button
            onClick={() => setAddItem(false)}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
          >
            Dashboard
          </button>
        </div>

        {/* Conditional Content */}
        {addItem ? (
          <AddFoodItem
            setAddItem={setAddItem}
            onSuccess={() => setRefresh((prev) => prev + 1)}
          />
        ) : (
          <div className="bg-white shadow-lg p-8 rounded-xl mt-6">
            <h1 className="text-3xl font-semibold">Restaurant Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Welcome to your restaurant dashboard
            </p>

            <FoodItemList key={refresh} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
