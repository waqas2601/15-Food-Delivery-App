"use client";

import CustomerHeader from "@/app/_components/CustomerHeader";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Footer from "../_components/Footer";

interface OrderItem {
  foodId: string;
  name: string;
  price: number;
  quantity: number;
  img_path?: string;
}

interface Order {
  _id: string;
  restaurantId: {
    _id: string;
    restoName: string;
  };
  customerName: string;
  deliveryAddress: string;
  city: string;
  items: OrderItem[];
  total: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
}

const OrdersPage = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      router.push("/user-auth");
      return;
    }

    try {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      loadOrders(userData._id);
    } catch (error) {
      console.error("Error loading user:", error);
      router.push("/user-auth");
    }
  }, [router]);

  const loadOrders = async (userId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/orders?userId=${userId}`);
      const data = await response.json();

      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      preparing: "bg-purple-100 text-purple-800",
      "on-the-way": "bg-indigo-100 text-indigo-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <CustomerHeader />
        <div className="flex items-center justify-center h-96">
          <p className="text-xl text-gray-500">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <CustomerHeader />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              No orders yet
            </h2>
            <p className="text-gray-500 mb-6">
              Start ordering delicious food from your favorite restaurants!
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Browse Restaurants
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
              >
                <div className="p-6">
                  {/* Order Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">🍴</span>
                        <h3 className="text-lg font-bold text-gray-800">
                          {order.restaurantId?.restoName || "Restaurant"}
                        </h3>
                      </div>
                      <p className="text-xs text-gray-500">Order ID</p>
                      <p className="font-mono font-semibold text-sm">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status.replace("-", " ")}
                    </span>
                  </div>

                  {/* Order Items */}
                  <div className="mb-4">
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-gray-700">
                            {item.name} x {item.quantity}
                          </span>
                          <span className="font-medium">
                            Rs {item.price * item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Delivery Address</p>
                      <p className="text-sm font-medium">
                        {order.deliveryAddress}, {order.city}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Order Date</p>
                      <p className="text-sm font-medium">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="border-t mt-4 pt-4 flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Payment: {order.paymentMethod.replace("-", " ")}
                    </span>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Total</p>
                      <p className="text-xl font-bold text-red-600">
                        Rs {order.total}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
