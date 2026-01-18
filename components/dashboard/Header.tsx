"use client";

import { Search, Bell, ShoppingCart, ChevronDown } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  // Generate page info from pathname
  const getPageInfo = () => {
    if (pathname === "/dashboard") {
      return {
        title: "Welcome Back",
        subtitle: "Here's what's happening today",
        showBadge: false,
      };
    }

    const segments = pathname.split("/").filter(Boolean);

    // For orders pages
    if (segments[0] === "orders") {
      const subpage = segments[1] || "all";
      return {
        title: "Order Management",
        subtitle: "Orders",
        badge: subpage.charAt(0).toUpperCase() + subpage.slice(1),
        badgeCount: "21",
        showBadge: true,
      };
    }

    // For order_management pages
    if (segments[0] === "order_management") {
      const subpage = segments[1] || "all";
      return {
        title: "Order Management",
        subtitle: "Orders",
        badge: subpage.charAt(0).toUpperCase() + subpage.slice(1),
        badgeCount: "21",
        showBadge: true,
      };
    }

    // For delivery management pages
    if (segments[0] === "delivery_management") {
      const subpage = segments[1] || "overview";
      return {
        title: "Delivery Management",
        subtitle: subpage === "personnel-list" ? "Personnel List" : subpage.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
        showBadge: false,
      };
    }

    if (segments.length === 1) {
      const title = segments[0]
        .replace(/_/g, " ")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      return { title, subtitle: "Personnel List", showBadge: false };
    }

    // For nested routes, first segment is title, rest is subtitle
    const title = segments[0]
      .replace(/_/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    const subtitle = segments
      .slice(1)
      .map((segment) =>
        segment
          .replace(/_/g, " ")
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      )
      .join(" > ");

    return { title, subtitle, showBadge: false };
  };

  const { title, subtitle, badge, badgeCount, showBadge } = getPageInfo();

  return (
    <header className="h-[72px] bg-white border-b border-gray-100 px-8 flex items-center justify-between sticky top-0 z-30 font-satoshi">
      {/* 1. LEFT: TITLE */}
      <div className="flex-shrink-0">
        <h1 className="text-[#00302E] text-xl font-bold">{title}</h1>
        <p className="text-sm text-gray-500 mt-0.5 font-bold">{subtitle}</p>
        {showBadge && (
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[#F16622] font-bold text-sm">{badge}</span>
            <span className="bg-[#FFF0E6] text-[#F16622] px-3 py-1 rounded-lg text-xs font-bold">
              {badgeCount}
            </span>
          </div>
        )}
      </div>

      {/* 2. MIDDLE: SEARCH BAR (Centered & Stylized) */}
      <div className="flex-1 max-w-[620px] px-12">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#F16622] transition-colors" />

          <input
            type="text"
            placeholder="Search"
            className="w-full h-[48px] pl-12 pr-4 bg-[#F7FAFC] border border-gray-100 rounded-xl
                 text-sm text-[#282828]
                 placeholder:text-[#282828] placeholder:text-sm
                 focus:outline-none focus:ring-2 focus:ring-[#F16622]/20 focus:bg-white
                 transition-all"
          />
        </div>
      </div>

      {/* 3. RIGHT: ACTIONS & PROFILE */}
      <div className="flex items-center gap-6 flex-shrink-0">
        {/* ICON BUTTONS WITH BADGES */}
        <div className="flex items-center gap-3">
          {/* Notification */}
          <button className="relative w-10 h-10 flex items-center justify-center bg-[#E6EDED] rounded-full hover:bg-gray-200 transition-colors">
            <Bell className="w-5 h-5 text-[#00302E]" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#D02F1B] text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
              1
            </span>
          </button>

          {/* Cart */}
          <button className="relative w-10 h-10 flex items-center justify-center bg-[#E6EDED] rounded-full hover:bg-gray-200 transition-colors">
            <ShoppingCart className="w-5 h-5 text-[#00302E]" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#D02F1B] text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
              1
            </span>
          </button>
        </div>

        {/* USER PROFILE DROPDOWN */}
        <div className="flex items-center gap-3 pl-6 border-l border-gray-100 cursor-pointer group">
          <div className="relative w-10 h-10">
            {/* Using the logo as the avatar per your screenshot */}
            <Image
              src="/images/icons/logo.png"
              alt="User"
              fill
              className="rounded-full bg-[#FFF2ED] p-1 object-contain"
            />
          </div>
          <div className="hidden xl:flex flex-col text-left">
            <span className="text-sm font-bold text-[#00302E]">Username</span>
            <span className="text-[11px] text-gray-500 font-medium">
              username@gmail.com
            </span>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-[#F16622] transition-colors" />
        </div>
      </div>
    </header>
  );
}
