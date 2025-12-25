"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const RestaurantSignup = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    pass: "",
    c_pass: "",
    restoName: "",
    city: "",
    adress: "",
    phone: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.pass) {
      newErrors.pass = "Password is required";
    } else if (formData.pass.length < 6) {
      newErrors.pass = "Password must be at least 6 characters";
    }

    if (formData.pass !== formData.c_pass) {
      newErrors.c_pass = "Passwords do not match";
    }

    if (!formData.restoName.trim())
      newErrors.restoName = "Restaurant name is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.adress.trim()) newErrors.adress = "Address is required";

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/[-\s]/g, ""))) {
      newErrors.phone = "Phone number is invalid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    setApiError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/restaurant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          pass: formData.pass,
          restoName: formData.restoName,
          city: formData.city,
          adress: formData.adress,
          phone: formData.phone,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const { result } = data;
        delete result.pass;
        localStorage.setItem("restaurantUser", JSON.stringify(result));
        router.push("/restaurant/dashboard");
      } else {
        setApiError(data.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setApiError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Register Your Restaurant
      </h2>
      <p className="text-gray-500 mb-6">
        Join our platform and start receiving orders
      </p>

      {apiError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
          {apiError}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Owner Name
          </label>
          <input
            name="name"
            type="text"
            placeholder="John Doe"
            onChange={handleChange}
            value={formData.name}
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
          />
          {errors.name && (
            <span className="text-red-700 text-sm block mt-1">
              {errors.name}
            </span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            name="email"
            type="email"
            placeholder="restaurant@example.com"
            onChange={handleChange}
            value={formData.email}
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
          />
          {errors.email && (
            <span className="text-red-700 text-sm block mt-1">
              {errors.email}
            </span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            name="pass"
            type="password"
            placeholder="••••••••"
            onChange={handleChange}
            value={formData.pass}
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
          />
          {errors.pass && (
            <span className="text-red-700 text-sm block mt-1">
              {errors.pass}
            </span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            name="c_pass"
            type="password"
            placeholder="••••••••"
            onChange={handleChange}
            value={formData.c_pass}
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
          />
          {errors.c_pass && (
            <span className="text-red-700 text-sm block mt-1">
              {errors.c_pass}
            </span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Restaurant Name
          </label>
          <input
            name="restoName"
            type="text"
            placeholder="The Food House"
            onChange={handleChange}
            value={formData.restoName}
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
          />
          {errors.restoName && (
            <span className="text-red-700 text-sm block mt-1">
              {errors.restoName}
            </span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <input
            name="city"
            type="text"
            placeholder="Lahore"
            onChange={handleChange}
            value={formData.city}
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
          />
          {errors.city && (
            <span className="text-red-700 text-sm block mt-1">
              {errors.city}
            </span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Address
          </label>
          <input
            name="adress"
            type="text"
            placeholder="Street 123, Block A, Gulberg"
            onChange={handleChange}
            value={formData.adress}
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
          />
          {errors.adress && (
            <span className="text-red-700 text-sm block mt-1">
              {errors.adress}
            </span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            name="phone"
            type="tel"
            placeholder="0300-1234567"
            onChange={handleChange}
            value={formData.phone}
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
          />
          {errors.phone && (
            <span className="text-red-700 text-sm block mt-1">
              {errors.phone}
            </span>
          )}
        </div>

        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
      </div>
    </div>
  );
};

export default RestaurantSignup;
