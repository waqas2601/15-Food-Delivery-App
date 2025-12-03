"use client";

import CustomerHeader from "@/app/_components/CustomerHeader";
import { useCart } from "../hooks/useCart";
import { useRouter } from "next/navigation";
import Footer from "../_components/Footer";

const CartPage = () => {
  const router = useRouter();
  const { cartData, removeFromCart, updateQuantity, clearCart, cartTotal } =
    useCart();

  if (cartData.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <CustomerHeader cartData={cartData} />

        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Your cart is empty
          </h1>
          <p className="text-gray-500 mb-6">
            Add some delicious food to get started!
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Browse Restaurants
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <CustomerHeader cartData={cartData} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Cart</h1>

        {/* Cart Items */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          {cartData.map((item) => (
            <div
              key={item._id}
              className="flex items-center gap-4 p-4 border-b last:border-b-0"
            >
              {/* Image */}
              {item.img_path ? (
                <img
                  src={item.img_path}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              ) : (
                <div className="w-20 h-20 bg-linear-to-r from-red-400 to-orange-400 rounded-lg flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    {item.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}

              {/* Details */}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{item.name}</h3>
                <p className="text-red-600 font-medium">Rs {item.price}</p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold"
                >
                  -
                </button>
                <span className="w-8 text-center font-medium">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold"
                >
                  +
                </button>
              </div>

              {/* Item Total */}
              <div className="text-right min-w-24">
                <p className="font-semibold text-gray-800">
                  Rs {item.price * item.quantity}
                </p>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeFromCart(item._id)}
                className="text-red-500 hover:text-red-700 text-xl"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">Rs {cartTotal}</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Delivery Fee</span>
            <span className="font-medium">Rs 100</span>
          </div>
          <div className="border-t pt-4 flex justify-between items-center mb-6">
            <span className="text-lg font-bold text-gray-800">Total</span>
            <span className="text-lg font-bold text-red-600">
              Rs {cartTotal + 100}
            </span>
          </div>

          <button
            onClick={() => router.push("/checkout")}
            className="w-full py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition mb-3"
          >
            Proceed to Checkout
          </button>

          <button
            onClick={clearCart}
            className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
