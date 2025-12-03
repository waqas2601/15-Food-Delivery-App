"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FiMenu, FiX } from "react-icons/fi";

interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CustomerHeaderProps {
  cartData?: CartItem[];
}

interface User {
  _id: string;
  name: string;
  email: string;
}

const CustomerHeader = ({ cartData = [] }: CustomerHeaderProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const cartCount = cartData.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error loading user:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setShowDropdown(false);
    setMobileOpen(false);
    router.push("/");
  };

  // Active link function: supports partial match
  const isActive = (path: string) =>
    pathname.startsWith(path) ? "text-red-600 font-semibold" : "text-gray-700";

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <span className="text-2xl">🍔</span>
          <span className="text-xl font-bold text-red-600">Foodie</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-8 font-medium">
            <li>
              <Link
                href="/"
                className={`${isActive("/")} hover:text-red-500 transition`}
              >
                Home
              </Link>
            </li>

            {!user ? (
              <li>
                <Link
                  href="/user-auth"
                  className={`${isActive(
                    "/user-auth"
                  )} hover:text-red-500 transition`}
                >
                  Login / Sign Up
                </Link>
              </li>
            ) : (
              <li className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 hover:text-red-500 transition"
                >
                  <span className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <span>{user.name}</span>
                  <span className="text-xs">▼</span>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-50">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 hover:bg-gray-100 transition"
                    >
                      My Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="block px-4 py-2 hover:bg-gray-100 transition"
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 transition text-red-600"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </li>
            )}

            <li className="relative">
              <Link
                href="/cart"
                className={`relative flex items-center gap-2 hover:text-red-500 transition ${isActive(
                  "/cart"
                )}`}
              >
                🛒 Cart
                {cartCount > 0 && (
                  <span className="absolute -top-3 -right-4 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </li>

            <li>
              <Link
                href="/restaurant"
                className={`${isActive(
                  "/restaurant/dashboard"
                )} hover:text-red-500 transition`}
              >
                Restaurant
              </Link>
            </li>

            <li>
              <Link
                href="/delivery-partner/dashboard"
                className={`${isActive(
                  "/delivery-partner"
                )} hover:text-red-500 transition`}
              >
                Delivery-Partner
              </Link>
            </li>
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t shadow-md">
          <ul className="flex flex-col px-6 py-4 gap-4 text-lg font-medium">
            <li>
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className={isActive("/")}
              >
                Home
              </Link>
            </li>

            {!user ? (
              <li>
                <Link
                  href="/user-auth"
                  onClick={() => setMobileOpen(false)}
                  className={isActive("/user-auth")}
                >
                  Login / Sign Up
                </Link>
              </li>
            ) : (
              <>
                <li>
                  <Link
                    href="/profile"
                    onClick={() => setMobileOpen(false)}
                    className={isActive("/profile")}
                  >
                    My Profile
                  </Link>
                </li>
                <li>
                  <Link
                    href="/orders"
                    onClick={() => setMobileOpen(false)}
                    className={isActive("/orders")}
                  >
                    My Orders
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="text-red-600 text-left mt-2"
                  >
                    Logout
                  </button>
                </li>
              </>
            )}

            <li>
              <Link
                href="/cart"
                onClick={() => setMobileOpen(false)}
                className={isActive("/cart")}
              >
                Cart ({cartCount})
              </Link>
            </li>

            <li>
              <Link
                href="/restaurant"
                onClick={() => setMobileOpen(false)}
                className={isActive("/restaurant")}
              >
                Restaurant
              </Link>
            </li>

            <li>
              <Link
                href="/delivery-partner/dashboard"
                onClick={() => setMobileOpen(false)}
                className={isActive("/delivery-partner")}
              >
                Delivery-Partner
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default CustomerHeader;
