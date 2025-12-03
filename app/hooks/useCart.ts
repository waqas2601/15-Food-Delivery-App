import { useState, useEffect } from "react";

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  img_path?: string;
  resto_id?: string;
}

// Accept FoodItem (without quantity) and add quantity automatically
export interface FoodItemInput {
  _id: string;
  name: string;
  price: number;
  img_path?: string;
  resto_id?: string;
  description?: string;
}

export const useCart = () => {
  const [cartData, setCartData] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCartData(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error loading cart:", error);
      }
    }
  }, []);

  const addToCart = (item: FoodItemInput) => {
    setCartData((prevCart) => {
      const existingItem = prevCart.find(
        (cartItem) => cartItem._id === item._id
      );

      let newCart;
      if (existingItem) {
        newCart = prevCart.map((cartItem) =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        // Add quantity: 1 for new items
        newCart = [
          ...prevCart,
          {
            _id: item._id,
            name: item.name,
            price: item.price,
            img_path: item.img_path,
            resto_id: item.resto_id,
            quantity: 1,
          },
        ];
      }

      localStorage.setItem("cart", JSON.stringify(newCart));
      return newCart;
    });
  };

  const removeFromCart = (itemId: string) => {
    setCartData((prevCart) => {
      const newCart = prevCart.filter((item) => item._id !== itemId);
      localStorage.setItem("cart", JSON.stringify(newCart));
      return newCart;
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(itemId);
      return;
    }

    setCartData((prevCart) => {
      const newCart = prevCart.map((item) =>
        item._id === itemId ? { ...item, quantity } : item
      );
      localStorage.setItem("cart", JSON.stringify(newCart));
      return newCart;
    });
  };

  const clearCart = () => {
    setCartData([]);
    localStorage.removeItem("cart");
  };

  const cartCount = cartData.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartData.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Check if item is in cart
  const isInCart = (itemId: string) => {
    return cartData.some((item) => item._id === itemId);
  };

  // Get current restaurant in cart (if any)
  const currentRestaurant = cartData.length > 0 ? cartData[0].resto_id : null;

  // Check if adding from different restaurant
  const isDifferentRestaurant = (restoId: string) => {
    return currentRestaurant && currentRestaurant !== restoId;
  };

  return {
    cartData,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,
    isInCart,
    currentRestaurant,
    isDifferentRestaurant,
  };
};
