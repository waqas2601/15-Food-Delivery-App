"use client";

import CustomerHeader from "@/app/_components/CustomerHeader";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const OrderConfirmationPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    if (!orderId) {
      router.push("/");
    }
  }, [orderId, router]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <CustomerHeader />

      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">✓</span>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-600 mb-6">
            Thank you for your order. We've received it and will start preparing
            soon.
          </p>

          {/* Order ID */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500 mb-1">Order ID</p>
            <p className="text-lg font-mono font-semibold text-gray-800">
              #{orderId?.slice(-8).toUpperCase()}
            </p>
          </div>

          {/* What's Next */}
          <div className="text-left bg-blue-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">
              What happens next?
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">1.</span>
                <span>Restaurant confirms your order</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">2.</span>
                <span>Your food is being prepared</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">3.</span>
                <span>Driver picks up and delivers to you</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => router.push("/orders")}
              className="flex-1 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
            >
              View My Orders
            </button>
            <button
              onClick={() => router.push("/")}
              className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Back to Home
            </button>
          </div>

          {/* Contact Info */}
          <p className="text-sm text-gray-500 mt-6">
            Need help? Contact us at{" "}
            <a
              href="mailto:support@foodie.com"
              className="text-red-600 hover:underline"
            >
              support@foodie.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
