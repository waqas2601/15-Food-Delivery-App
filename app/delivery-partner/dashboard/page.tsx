"use client";

import DeliveryPartnerHeader from "@/app/_components/DeliveryPartnerHeader";
import Footer from "@/app/_components/Footer";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface OrderItem {
  name: string;
  quantity: number;
}

interface Order {
  _id: string;
  restaurantId: {
    restoName: string;
    adress: string;
    phone: string;
    city: string;
  };
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  city: string;
  items: OrderItem[];
  total: number;
  status: string;
  deliveryEarnings: number;
  createdAt: string;
}

const DeliveryPartnerDashboard = () => {
  const router = useRouter();
  const [partner, setPartner] = useState<any>(null);
  const [availableOrders, setAvailableOrders] = useState<Order[]>([]);
  const [myDeliveries, setMyDeliveries] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [acceptingOrder, setAcceptingOrder] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"available" | "my-deliveries">(
    "available"
  );

  useEffect(() => {
    const savedPartner = localStorage.getItem("deliveryPartner");
    if (!savedPartner) {
      router.push("/delivery-partner");
      return;
    }

    try {
      const partnerData = JSON.parse(savedPartner);
      setPartner(partnerData);
      loadOrders(partnerData._id, partnerData.city);
    } catch (error) {
      console.error("Error loading partner:", error);
      router.push("/delivery-partner");
    }
  }, [router]);

  const loadOrders = async (partnerId: string, city: string) => {
    try {
      setLoading(true);

      // Load available orders (ready for pickup in partner's city)
      const availableResponse = await fetch(
        `http://localhost:3000/api/delivery-partner/available-orders?city=${city}`
      );
      const availableData = await availableResponse.json();

      if (availableData.success) {
        setAvailableOrders(availableData.orders);
      }

      // Load my active deliveries
      const myDeliveriesResponse = await fetch(
        `http://localhost:3000/api/delivery-partner/my-deliveries?partnerId=${partnerId}`
      );
      const myDeliveriesData = await myDeliveriesResponse.json();

      if (myDeliveriesData.success) {
        setMyDeliveries(myDeliveriesData.orders);
      }
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const acceptOrder = async (orderId: string) => {
    if (!partner) return;

    setAcceptingOrder(orderId);

    try {
      const response = await fetch(
        `http://localhost:3000/api/delivery-partner/accept-order`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId,
            partnerId: partner._id,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        // Show success message
        alert("Order accepted successfully!");

        // Reload orders to update the lists
        await loadOrders(partner._id, partner.city);

        // Switch to My Deliveries tab
        setActiveTab("my-deliveries");
      } else {
        alert(data.message || "Failed to accept order");
      }
    } catch (error) {
      console.error("Error accepting order:", error);
      alert("Something went wrong");
    } finally {
      setAcceptingOrder(null);
    }
  };

  const updateDeliveryStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/orders/${orderId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await response.json();

      if (data.success) {
        // Show success message
        const messages: Record<string, string> = {
          "on-the-way": "Order picked up! On the way to customer",
          delivered: "Order delivered successfully! 🎉",
        };
        alert(messages[newStatus] || "Status updated");

        // If order is delivered, update partner stats
        if (newStatus === "delivered" && partner) {
          const updatedPartner = {
            ...partner,
            totalDeliveries: (partner.totalDeliveries || 0) + 1,
            totalEarnings: (partner.totalEarnings || 0) + 50, // Add delivery fee
          };
          setPartner(updatedPartner);
          localStorage.setItem(
            "deliveryPartner",
            JSON.stringify(updatedPartner)
          );
        }

        if (partner) {
          loadOrders(partner._id, partner.city);
        }
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Something went wrong");
    }
  };

  // Auto-refresh orders every 30 seconds
  useEffect(() => {
    if (!partner) return;

    const interval = setInterval(() => {
      loadOrders(partner._id, partner.city);
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [partner]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 60) return `${diffMins} mins ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DeliveryPartnerHeader />
        <div className="flex items-center justify-center h-96">
          <p className="text-xl text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DeliveryPartnerHeader />

      <div className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <p className="text-sm opacity-90">Total Deliveries</p>
            <p className="text-3xl font-bold">
              {partner?.totalDeliveries || 0}
            </p>
          </div>
          <div className="bg-linear-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <p className="text-sm opacity-90">Total Earnings</p>
            <p className="text-3xl font-bold">
              Rs {partner?.totalEarnings || 0}
            </p>
          </div>
          <div
            className={`bg-linear-to-br rounded-xl shadow-lg p-6 text-white ${
              myDeliveries.length > 0
                ? "from-orange-500 to-orange-600 animate-pulse"
                : "from-purple-500 to-purple-600"
            }`}
          >
            <p className="text-sm opacity-90">Active Deliveries</p>
            <p className="text-3xl font-bold">{myDeliveries.length}</p>
            {myDeliveries.length > 0 && (
              <p className="text-xs mt-1">🔥 Delivery in progress</p>
            )}
          </div>
          <div className="bg-linear-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white">
            <p className="text-sm opacity-90">Rating</p>
            <p className="text-3xl font-bold">⭐ {partner?.rating || 5.0}</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("available")}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                activeTab === "available"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              📦 Available Orders ({availableOrders.length})
            </button>
            <button
              onClick={() => setActiveTab("my-deliveries")}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                activeTab === "my-deliveries"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              🚀 My Deliveries ({myDeliveries.length})
            </button>
          </div>

          <button
            onClick={() => partner && loadOrders(partner._id, partner.city)}
            className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition font-medium flex items-center gap-2"
            disabled={loading}
          >
            <span className={loading ? "animate-spin" : ""}>🔄</span>
            Refresh
          </button>
        </div>

        {/* Orders List */}
        {activeTab === "available" ? (
          <div className="space-y-4">
            {availableOrders.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <div className="text-6xl mb-4">📦</div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  No available orders
                </h2>
                <p className="text-gray-500">
                  New delivery requests will appear here
                </p>
              </div>
            ) : (
              availableOrders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-500 hover:shadow-lg transition"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatTime(order.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        Rs {order.deliveryEarnings || 50}
                      </p>
                      <p className="text-xs text-gray-500">Delivery Fee</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-xs font-semibold text-blue-800 mb-2">
                        📍 PICKUP
                      </p>
                      <p className="font-semibold text-gray-800">
                        {order.restaurantId?.restoName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.restaurantId?.adress}
                      </p>
                      <p className="text-sm text-gray-600">
                        📍 {order.restaurantId?.city}
                      </p>
                      <p className="text-sm text-gray-600">
                        📞 {order.restaurantId?.phone}
                      </p>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-xs font-semibold text-green-800 mb-2">
                        🏠 DROP-OFF
                      </p>
                      <p className="font-semibold text-gray-800">
                        {order.customerName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.deliveryAddress}
                      </p>
                      <p className="text-sm text-gray-600">📍 {order.city}</p>
                      <p className="text-sm text-gray-600">
                        📞 {order.customerPhone}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      Order Items:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {order.items.map((item, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                        >
                          {item.quantity}x {item.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => acceptOrder(order._id)}
                    disabled={acceptingOrder === order._id}
                    className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {acceptingOrder === order._id
                      ? "Accepting..."
                      : "Accept Delivery"}
                  </button>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {myDeliveries.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <div className="text-6xl mb-4">🚀</div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  No active deliveries
                </h2>
                <p className="text-gray-500">
                  Accept orders from the Available Orders tab
                </p>
              </div>
            ) : (
              myDeliveries.map((order) => (
                <div
                  key={order._id}
                  className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium mt-1">
                        {order.status.replace("-", " ").toUpperCase()}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        Rs {order.deliveryEarnings || 50}
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-xs font-semibold text-blue-800 mb-2">
                        📍 PICKUP
                      </p>
                      <p className="font-semibold text-gray-800">
                        {order.restaurantId?.restoName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.restaurantId?.adress}
                      </p>
                      <p className="text-sm text-gray-600">
                        📍 {order.restaurantId?.city}
                      </p>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-xs font-semibold text-green-800 mb-2">
                        🏠 DROP-OFF
                      </p>
                      <p className="font-semibold text-gray-800">
                        {order.customerName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.deliveryAddress}
                      </p>
                      <p className="text-sm text-gray-600">📍 {order.city}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {order.status === "ready-for-pickup" && (
                      <button
                        onClick={() =>
                          updateDeliveryStatus(order._id, "on-the-way")
                        }
                        className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                      >
                        🏍️ Picked Up - Start Delivery
                      </button>
                    )}
                    {order.status === "on-the-way" && (
                      <button
                        onClick={() =>
                          updateDeliveryStatus(order._id, "delivered")
                        }
                        className="flex-1 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                      >
                        ✓ Mark as Delivered
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryPartnerDashboard;
