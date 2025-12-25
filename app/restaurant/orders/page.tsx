"use client";

import Footer from "@/app/_components/Footer";
import Header from "@/app/_components/Header";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  city: string;
  items: OrderItem[];
  total: number;
  status: string;
  paymentMethod: string;
  specialInstructions?: string;
  createdAt: string;
}

const RestaurantOrders = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState<any>(null);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    const savedRestaurant = localStorage.getItem("restaurantUser");
    if (!savedRestaurant) {
      router.push("/restaurant");
      return;
    }

    try {
      const restaurantData = JSON.parse(savedRestaurant);
      setRestaurant(restaurantData);
      loadOrders(restaurantData._id);
    } catch (error) {
      console.error("Error loading restaurant:", error);
      router.push("/restaurant");
    }
  }, [router]);

  const loadOrders = async (restaurantId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/orders?restaurantId=${restaurantId}`);
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

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (data.success) {
        // Reload orders
        if (restaurant) {
          loadOrders(restaurant._id);
        }
      } else {
        alert("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Something went wrong");
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      confirmed: "bg-blue-100 text-blue-800 border-blue-300",
      preparing: "bg-purple-100 text-purple-800 border-purple-300",
      "ready-for-pickup": "bg-orange-100 text-orange-800 border-orange-300",
      "on-the-way": "bg-indigo-100 text-indigo-800 border-indigo-300",
      delivered: "bg-green-100 text-green-800 border-green-300",
      cancelled: "bg-red-100 text-red-800 border-red-300",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  const getNextStatus = (currentStatus: string) => {
    const flow: Record<string, string> = {
      pending: "confirmed",
      confirmed: "preparing",
      preparing: "ready-for-pickup",
      "ready-for-pickup": "on-the-way",
      "on-the-way": "delivered",
    };
    return flow[currentStatus];
  };

  const getNextStatusLabel = (currentStatus: string) => {
    const labels: Record<string, string> = {
      pending: "Confirm Order",
      confirmed: "Start Preparing",
      preparing: "Ready for Pickup",
      "ready-for-pickup": "Out for Delivery",
      "on-the-way": "Mark Delivered",
    };
    return labels[currentStatus];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    if (filter === "active")
      return !["delivered", "cancelled"].includes(order.status);
    return order.status === filter;
  });

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header />
        <div className="flex items-center justify-center h-96">
          <p className="text-xl text-gray-500">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Orders</h1>

          {/* Filter Buttons */}
          <div className=" flex gap-2 flex-wrap">
            {[
              "all",
              "active",
              "pending",
              "confirmed",
              "preparing",
              "ready-for-pickup",
              "delivered",
            ].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg capitalize transition ${
                  filter === status
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {status === "ready-for-pickup" ? "Ready" : status}
              </button>
            ))}
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              No {filter !== "all" ? filter : ""} orders
            </h2>
            <p className="text-gray-500">
              Orders will appear here when customers place them
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className={`bg-white rounded-xl shadow-md border-2 overflow-hidden ${getStatusColor(
                  order.status
                )}`}
              >
                <div className="p-6">
                  {/* Order Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Order ID</p>
                      <p className="font-mono font-semibold text-lg">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDate(order.createdAt)}
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

                  {/* Customer Info */}
                  <div className="mb-4 bg-gray-50 rounded-lg p-3">
                    <p className="font-semibold text-gray-800">
                      {order.customerName}
                    </p>
                    <p className="text-sm text-gray-600">
                      📞 {order.customerPhone}
                    </p>
                    <p className="text-sm text-gray-600">
                      📍 {order.deliveryAddress}, {order.city}
                    </p>
                  </div>

                  {/* Order Items */}
                  <div className="mb-4">
                    <p className="font-semibold text-gray-700 mb-2">Items:</p>
                    <div className="space-y-1">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between text-sm"
                        >
                          <span>
                            {item.quantity}x {item.name}
                          </span>
                          <span className="font-medium">
                            Rs {item.price * item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Special Instructions */}
                  {order.specialInstructions && (
                    <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-sm font-semibold text-gray-700">
                        Special Instructions:
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.specialInstructions}
                      </p>
                    </div>
                  )}

                  {/* Total */}
                  <div className="border-t pt-4 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        {order.paymentMethod.replace("-", " ")}
                      </span>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="text-2xl font-bold text-gray-800">
                          Rs {order.total}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {order.status !== "delivered" &&
                      order.status !== "cancelled" &&
                      order.status !== "on-the-way" && (
                        <>
                          <button
                            onClick={() =>
                              updateOrderStatus(
                                order._id,
                                getNextStatus(order.status)
                              )
                            }
                            className="flex-1 py-1 px-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                          >
                            {getNextStatusLabel(order.status)}
                          </button>
                          {order.status === "pending" && (
                            <button
                              onClick={() =>
                                updateOrderStatus(order._id, "cancelled")
                              }
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                            >
                              Cancel
                            </button>
                          )}
                        </>
                      )}
                    {order.status === "ready-for-pickup" && (
                      <div className="w-full text-center py-3 bg-orange-100 border-2 border-orange-300 rounded-lg">
                        <p className="text-orange-800 font-semibold">
                          ⏳ Waiting for Delivery Partner
                        </p>
                      </div>
                    )}
                    {order.status === "on-the-way" && (
                      <div className="w-full text-center py-3 bg-indigo-100 border-2 border-indigo-300 rounded-lg">
                        <p className="text-indigo-800 font-semibold">
                          🚀 Out for Delivery
                        </p>
                      </div>
                    )}
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

export default RestaurantOrders;
