"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface DeliveryPartner {
  _id: string;
  name: string;
  email: string;
  vehicleType: string;
  isAvailable: boolean;
}

const DeliveryPartnerHeader = () => {
  const [partner, setPartner] = useState<DeliveryPartner | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    const data = localStorage.getItem("deliveryPartner");

    if (!data && pathName === "/delivery-partner/dashboard") {
      router.push("/delivery-partner");
    } else if (data && pathName === "/delivery-partner") {
      router.push("/delivery-partner/dashboard");
    }

    if (data) {
      try {
        setPartner(JSON.parse(data));
      } catch (error) {
        console.error("Error parsing delivery partner:", error);
      }
    }
  }, [pathName, router]);

  const logout = () => {
    localStorage.removeItem("deliveryPartner");
    setPartner(null);
    setShowDropdown(false);
    router.push("/delivery-partner");
  };

  const getVehicleEmoji = (vehicleType: string) => {
    const emojis: Record<string, string> = {
      bike: "🏍️",
      car: "🚗",
      bicycle: "🚲",
      scooter: "🛴",
    };
    return emojis[vehicleType] || "🛵";
  };

  return (
    <header className="bg-linear-to-r from-indigo-600 to-purple-600 shadow-lg sticky top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* LOGO */}
        <Link
          href="/delivery-partner/dashboard"
          className="flex items-center gap-2 cursor-pointer"
        >
          <span className="text-3xl">🛵</span>
          <div>
            <span className="text-xl font-bold text-white">
              Foodie Delivery
            </span>
            <p className="text-xs text-indigo-100">Partner Portal</p>
          </div>
        </Link>

        {/* NAV LINKS */}
        <nav>
          <ul className="flex items-center gap-8 text-white font-medium">
            {partner ? (
              <>
                <li className="hover:text-indigo-200 transition">
                  <Link href="/">Customer</Link>
                </li>

                {/* Partner Dropdown */}
                <li className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 hover:text-indigo-200 transition"
                  >
                    <span className="w-10 h-10 bg-white text-indigo-600 rounded-full flex items-center justify-center font-semibold text-lg">
                      {getVehicleEmoji(partner.vehicleType)}
                    </span>
                    <div className="text-left hidden md:block">
                      <p className="text-sm font-semibold">{partner.name}</p>
                      <p className="text-xs text-indigo-200">
                        {partner.isAvailable ? "🟢 Available" : "🔴 Offline"}
                      </p>
                    </div>
                    <span className="text-xs">▼</span>
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border py-2 z-50 text-gray-700">
                      <div className="px-4 py-2 border-b">
                        <p className="font-semibold text-gray-800">
                          {partner.name}
                        </p>
                        <p className="text-sm text-gray-500">{partner.email}</p>
                      </div>
                      <Link
                        href="/delivery-partner/earnings"
                        className="block px-4 py-2 hover:bg-gray-100 transition"
                        onClick={() => setShowDropdown(false)}
                      >
                        💰 Earnings
                      </Link>
                      <Link
                        href="/delivery-partner/history"
                        className="block px-4 py-2 hover:bg-gray-100 transition"
                        onClick={() => setShowDropdown(false)}
                      >
                        📦 Delivery History
                      </Link>
                      <Link
                        href="/delivery-partner/profile"
                        className="block px-4 py-2 hover:bg-gray-100 transition"
                        onClick={() => setShowDropdown(false)}
                      >
                        ⚙️ Profile Settings
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
              <li className="hover:text-indigo-200 transition">
                <Link href="/delivery-partner">Login / Signup</Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default DeliveryPartnerHeader;
