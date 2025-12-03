"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const EditFoodItem = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    img_path: "",
    description: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (id) {
      loadFoodItem();
    }
  }, [id]);

  const loadFoodItem = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:3000/api/restaurant/foods/edit/${id}`
      );
      const data = await response.json();

      if (data.success && data.result) {
        setFormData({
          name: data.result.name || "",
          price: data.result.price?.toString() || "",
          img_path: data.result.img_path || data.result.path || "",
          description: data.result.description || "",
        });
      } else {
        alert("Failed to load food item");
        router.push("/restaurant/dashboard");
      }
    } catch (error) {
      console.error("Error loading food item:", error);
      alert("Error loading food item");
      router.push("/restaurant/dashboard");
    } finally {
      setLoading(false);
    }
  };

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

    setUpdating(true);

    try {
      const response = await fetch(
        `http://localhost:3000/api/restaurant/foods/edit/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json", // Fixed typo: was "applicaton"
          },
          body: JSON.stringify({
            name: formData.name,
            price: formData.price,
            img_path: formData.img_path,
            description: formData.description,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Food item updated successfully!");
        router.push("/restaurant/dashboard");
      } else {
        alert(data.message || "Failed to update food item");
      }
    } catch (error) {
      console.error("Error updating food item:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white shadow-lg p-8 rounded-xl">
          <p className="text-center text-xl text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white shadow-lg p-8 rounded-xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Update Food Item
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
            {formData.img_path && (
              <div className="mt-2">
                <img
                  src={formData.img_path}
                  alt="Preview"
                  className="h-32 w-32 object-cover rounded-lg border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
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
              disabled={updating}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {updating ? "Updating..." : "Update Food Item"}
            </button>
            <button
              onClick={() => router.push("/restaurant/dashboard")}
              className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditFoodItem;
