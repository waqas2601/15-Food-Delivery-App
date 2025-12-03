"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";

interface RestaurantUser {
  _id: string;
  name: string;
  email: string;
  restoName: string;
}

const Header = () => {
  const [details, setDetails] = useState<RestaurantUser | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    const data = localStorage.getItem("restaurantUser");

    if (!data && pathName === "/restaurant/dashboard") {
      router.push("/restaurant");
    } else if (data && pathName === "/restaurant") {
      router.push("/restaurant/dashboard");
    }

    if (data) {
      try {
        setDetails(JSON.parse(data));
      } catch (error) {
        console.error("Error parsing restaurant user:", error);
      }
    }
  }, [pathName, router]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logout = () => {
    localStorage.removeItem("restaurantUser");
    setDetails(null);
    setShowDropdown(false);
    router.push("/restaurant");
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <span className="text-2xl">🍴</span>
          <span className="text-xl font-bold text-red-600">Foodie Partner</span>
        </Link>

        <nav>
          <ul className="flex items-center gap-8 text-gray-700 font-medium">
            <li className="hover:text-red-500 transition">
              <Link href="/">Customer View</Link>
            </li>

            {details ? (
              <>
                <li className="hover:text-red-500 transition">
                  <Link href="/restaurant/dashboard">Dashboard</Link>
                </li>

                <li className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 hover:text-red-500 transition"
                  >
                    <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                      {details.restoName?.charAt(0).toUpperCase()}
                    </span>
                    <span>{details.restoName}</span>
                    <span className="text-xs">▼</span>
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border py-2 z-50">
                      <div className="px-4 py-2 border-b">
                        <p className="font-semibold text-gray-800">
                          {details.name}
                        </p>
                        <p className="text-sm text-gray-500">{details.email}</p>
                      </div>
                      <Link
                        href="/restaurant/orders"
                        className="block px-4 py-2 hover:bg-gray-100 transition"
                        onClick={() => setShowDropdown(false)}
                      >
                        📦 Orders
                      </Link>
                      <Link
                        href="/restaurant/profile"
                        className="block px-4 py-2 hover:bg-gray-100 transition"
                        onClick={() => setShowDropdown(false)}
                      >
                        Restaurant Profile
                      </Link>
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 transition text-red-600"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </li>
              </>
            ) : (
              <li className="hover:text-red-500 transition">
                <Link href="/restaurant">Login / Signup</Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
