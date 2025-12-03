"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const RestaurantLogin = () => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const router = useRouter();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    if (!pass) {
      newErrors.pass = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    setApiError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/restaurant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, pass, login: true }),
      });

      const data = await response.json();

      if (data.success) {
        const { result } = data;
        delete result.pass;
        localStorage.setItem("restaurantUser", JSON.stringify(result));
        router.push("/restaurant/dashboard");
      } else {
        setApiError(data.message || "Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setApiError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Restaurant Login
      </h2>
      <p className="text-gray-500 mb-6">Access your restaurant dashboard</p>

      {apiError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
          {apiError}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="restaurant@example.com"
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors({ ...errors, email: "" });
            }}
            value={email}
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
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
            type="password"
            placeholder="••••••••"
            onChange={(e) => {
              setPass(e.target.value);
              if (errors.pass) setErrors({ ...errors, pass: "" });
            }}
            value={pass}
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          {errors.pass && (
            <span className="text-red-700 text-sm block mt-1">
              {errors.pass}
            </span>
          )}
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
};

export default RestaurantLogin;
