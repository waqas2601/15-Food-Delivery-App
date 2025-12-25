"use client";

import { useState } from "react";

interface AddFoodItemProps {
  setAddItem: (value: boolean) => void;
  onSuccess?: () => void;
}

const AddFoodItem: React.FC<AddFoodItemProps> = ({ setAddItem, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    img_path: "",
    description: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Food name is required";
    if (!formData.price.trim()) {
      newErrors.price = "Price is required";
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "Price must be a valid number";
    }
    if (!formData.img_path.trim()) newErrors.img_path = "Image URL is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const restaurantString = localStorage.getItem("restaurantUser");
    if (!restaurantString) {
      alert("Session expired. Please login again.");
      return;
    }

    setLoading(true);

    try {
      const restaurantData = JSON.parse(restaurantString);

      const response = await fetch("/api/restaurant/foods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          resto_id: restaurantData._id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Food item added successfully!");
        setAddItem(false);
        if (onSuccess) onSuccess();
      } else {
        alert(data.message || "Failed to add food item");
      }
    } catch (error) {
      console.error("Error adding food item:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-lg p-8 rounded-xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Add New Food Item
      </h1>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Food Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="e.g., Chicken Karahi"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          {errors.name && (
            <span className="text-red-600 text-sm block mt-1">
              {errors.name}
            </span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price (Rs)
          </label>
          <input
            type="number"
            name="price"
            placeholder="e.g., 1200"
            value={formData.price}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          {errors.price && (
            <span className="text-red-600 text-sm block mt-1">
              {errors.price}
            </span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image URL
          </label>
          <input
            type="url"
            name="img_path"
            placeholder="https://example.com/image.jpg"
            value={formData.img_path}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          {errors.img_path && (
            <span className="text-red-600 text-sm block mt-1">
              {errors.img_path}
            </span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            placeholder="Describe your dish..."
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full border p-3 rounded-lg resize-none focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          {errors.description && (
            <span className="text-red-600 text-sm block mt-1">
              {errors.description}
            </span>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Adding..." : "Add Food Item"}
          </button>
          <button
            onClick={() => setAddItem(false)}
            className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFoodItem;
