"use client";

import { Search, Bell, ShoppingCart, ChevronDown, Menu } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserFromCookie } from "@/lib/api/auth";
import type { User } from "@/lib/api/auth";
import { getCachedOrder, fetchOrderStatusCounts } from "@/lib/api/orders";
import { getCachedRider } from "@/lib/api/riders";

export default function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [orderCounts, setOrderCounts] = useState<Record<string, number>>({});

  const displayName =
    user?.name ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.email?.split("@")[0] ||
    "User";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const profile = await getUserFromCookie();
        setUser(profile);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    const onAuthUpdated = () => {
      fetchUser();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("auth:updated", onAuthUpdated);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("auth:updated", onAuthUpdated);
      }
    };
  }, []);

  // Fetch order counts for dynamic badge display
  useEffect(() => {
    const loadCounts = async () => {
      try {
        const counts = await fetchOrderStatusCounts();
        setOrderCounts(counts);
      } catch (error) {
        console.error("Failed to fetch order counts:", error);
      }
    };
    loadCounts();
  }, []);

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
      const countKeyMap: Record<string, string> = {
        all: "all",
        failed: "payment-failed",
        refunded: "payment-failed",
      };
      const countKey = countKeyMap[subpage];
      const dynamicCount = countKey ? orderCounts[countKey] : 0;

      return {
        title: "Order Management",
        subtitle: "Orders",
        badge: subpage.charAt(0).toUpperCase() + subpage.slice(1),
        badgeCount: dynamicCount?.toString() || "0",
        showBadge: true,
      };
    }

    // For order_management pages
    if (segments[0] === "order_management") {
      const subpage = segments[1] || "all";
      const cachedOrder = getCachedOrder(subpage);
      const isOrderDetailsRoute = Boolean(cachedOrder);
      const orderSubpageLabelMap: Record<string, string> = {
        all: "All",
        pending: "New",
        accepted: "Accepted",
        processing: "Preparing",
        ready: "Ready",
        arrived: "Arrived",
        assign: "Assign",
        "in-transit": "In transit",
        delivered: "Delivered",
        cancelled: "Cancelled",
      };

      // Mapping for count keys
      const countKeyMap: Record<string, string> = {
        all: "all",
        pending: "new",
        accepted: "accepted",
        processing: "processing",
        ready: "ready",
        arrived: "arrived",
        assign: "assign",
        "in-transit": "in-transit",
        delivered: "delivered",
        cancelled: "cancelled",
      };

      const isUuidLike =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          subpage
        );

      // Get dynamic count for current page
      const countKey = countKeyMap[subpage];
      const dynamicCount = countKey ? orderCounts[countKey] : 0;

      return {
        title: "Order Management",
        subtitle: "Orders",
        badge: isOrderDetailsRoute
          ? cachedOrder?.orderNumber || "Order"
          : isUuidLike
            ? "Order Details"
            : orderSubpageLabelMap[subpage] ??
              subpage
                .replace(/-/g, " ")
                .replace(/\b\w/g, (l) => l.toUpperCase()),
        badgeCount: isOrderDetailsRoute ? "" : dynamicCount?.toString() || "0",
        showBadge: true,
      };
    }

    // For restaurant_management pages
    if (segments[0] === "restaurant_management") {
      const subpage = segments[1] || "overview";
      const subtitleMap: Record<string, string> = {
        "cuisine": "Cuisine",
        "add-new-restaurant": "Add New Restaurant",
        "request": "Request",
        "restaurant-list": "Restaurant List",
        "zone-setup": "Zone Setup",
      };
      return {
        title: "Restaurant Management",
        subtitle: subtitleMap[subpage] || subpage.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
        showBadge: false,
      };
    }

    // For delivery management pages
    if (segments[0] === "delivery_management") {
      const subpage = segments[1] || "overview";
      const detailId = segments[2];
      const cachedRider =
        subpage === "personnel-list" && detailId
          ? getCachedRider(detailId)
          : undefined;

      const isPersonnelRoute = subpage === "personnel-list";

      return {
        title: "Delivery Management",
        subtitle: isPersonnelRoute ? "Personnel" : subpage.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        badge: cachedRider
          ? cachedRider.fullName
          : isPersonnelRoute
            ? "Personnel List"
            : undefined,
        badgeCount: "",
        showBadge: isPersonnelRoute,
      };
    }

    // For employees pages
    if (segments[0] === "employees") {
      const subpage = segments[1] || "overview";
      const subtitleMap: Record<string, string> = {
        "list": "Employee List",
        "add": "Add New Employee",
      };
      return {
        title: "Employee Management",
        subtitle: subtitleMap[subpage] || subpage.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
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
    <header className="h-[72px] bg-white border-b border-gray-100 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30 font-satoshi">
      {/* Hamburger — mobile only */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors mr-2 flex-shrink-0"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5 text-[#00302E]" />
      </button>

      {/* 1. LEFT: TITLE */}
      <div className="flex-shrink-0">
        <h1 className="text-[#00302E] text-xl font-bold">{title}</h1>
        <p className="text-sm text-gray-500 mt-0.5 font-bold">{subtitle}</p>
        {showBadge && (
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[#F16622] font-bold text-sm">{badge}</span>
            {badgeCount ? (
              <span className="bg-[#FFF0E6] text-[#F16622] px-3 py-1 rounded-lg text-xs font-bold">
                {badgeCount}
              </span>
            ) : null}
          </div>
        )}
      </div>

      {/* 2. MIDDLE: SEARCH BAR (hidden on mobile) */}
      <div className="hidden md:flex flex-1 max-w-[620px] px-12">
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
     {/* RIGHT SECTION */}
<div className="flex items-center gap-4 flex-shrink-0">

  {/* ICONS — desktop only */}
  <div className="hidden md:flex items-center gap-3">
    {/* Notification */}
    <button className="relative w-10 h-10 flex items-center justify-center bg-[#E6EDED] rounded-full">
      <Bell className="w-5 h-5 text-[#00302E]" />
      <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#D02F1B] text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
        1
      </span>
    </button>

    {/* Cart */}
    <button className="relative w-10 h-10 flex items-center justify-center bg-[#E6EDED] rounded-full">
      <ShoppingCart className="w-5 h-5 text-[#00302E]" />
      <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#D02F1B] text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
        1
      </span>
    </button>
  </div>

  {/* PROFILE / DROPDOWN */}
  <div className="relative flex items-center gap-3 pl-4 md:pl-6 border-l border-gray-100 cursor-pointer group">

    {/* Avatar */}
    <div className="relative w-9 h-9 shrink-0">
      <Image
        src="/images/icons/logo.png"
        alt="User"
        fill
        sizes="36px"
        className="rounded-full bg-[#FFF2ED] p-1 object-contain"
      />
    </div>

    {/* Name + email (desktop only) */}
    <div className="hidden md:flex flex-col leading-tight min-w-0">
      <span className="text-sm font-bold text-[#00302E] truncate max-w-[160px]">
        {loading ? "Loading..." : displayName}
      </span>
      <span className="text-[11px] text-gray-500 font-medium truncate max-w-[160px]">
        {loading ? "..." : user?.email || "email@example.com"}
      </span>
    </div>

    <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
  </div>
</div>
    </header>
  );
}
