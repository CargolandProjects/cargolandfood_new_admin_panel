"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutGrid,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Truck,
  RotateCcw,
  LayoutTemplate,
  X,
  Loader2,
} from "lucide-react";
import { logoutAdmin } from "@/lib/api/auth";
import { fetchOrderStatusCounts } from "@/lib/api/orders";

const sidebarData = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutGrid },

  {
    name: "Order Management",
    icon: "/images/icons/Receipt.png",
    children: [
      {
        name: "Orders",
        subChildren: [
          {
            name: "All",
            href: "/order_management/all",
            count: 2,
            color: "bg-blue-100 text-blue-600",
          },
          {
            name: "New",
            href: "/order_management/pending",
            count: 2,
            color: "bg-orange-100 text-orange-600",
          },
          {
            name: "Accepted",
            href: "/order_management/accepted",
            count: 2,
            color: "bg-green-100 text-green-600",
          },
          {
            name: "Preparing",
            href: "/order_management/processing",
            count: 2,
            color: "bg-blue-100 text-blue-600",
          },
            {
            name: "Ready",
              href: "/order_management/ready",
            count: 2,
            color: "bg-blue-100 text-blue-600",
          },
            {
            name: "Assign",
              href: "/order_management/assign",
            count: 2,
            color: "bg-blue-100 text-blue-600",
          },
          {
            name: "In transit",
            href: "/order_management/in-transit",
            count: 2,
            color: "bg-orange-100 text-orange-600",
          },
          {
            name: "Delivered",
            href: "/order_management/delivered",
            count: 2,
            color: "bg-green-100 text-green-600",
          },
          {
            name: "Cancelled",
            href: "/order_management/cancelled",
            count: 2,
            color: "bg-red-100 text-red-600",
          },
          {
            name: "Payment failed",
            // href: "/orders/failed",
            count: 2,
            color: "bg-red-100 text-red-600",
          },
          {
            name: "Refunded",
            // href: "/orders/refunded",
            count: 2,
            color: "bg-orange-100 text-orange-600",
          },
          {
            name: "Offline payment",
            // href: "/orders/offline",
            count: 2,
            color: "bg-blue-100 text-blue-600",
          },
        ],
      },
      {
        name: "Subscription orders",
        // href: "/",
        // icon: RotateCcw,
      },

      {
        name: "Dispatch Management",
        // icon: Truck,
        subChildren: [
          {
            name: "Accepted",
            href: "/order_management/accepted",
            count: 2,
          },
            {
            name: "Pick up",
            href: "/order_management/ready",
            count: 2,
          },
            {
            name: "Arrived",
            href: "/order_management/arrived",
            count: 2,
          },
            {
            name: "Delivered",
            href: "/order_management/delivered",
            count: 2,
          },
        ],
      },

      {
        name: "Refunds",
        // href: "/refunds",
        subChildren: [
          {
            name: "Refund requests",
            href: "#",
            count: 2,
            color: "bg-blue-100 text-blue-600",
          },
        ],
      },
    ],
  },

  {
    name: "Restaurant Management",
    icon: "/images/icons/CallBell.png",
    children: [
      { name: "Zone setup", href: "/restaurant_management/zones" },
      { name: "Cuisine", href: "/restaurant_management/cuisine" },
      {
        name: "Restaurants",
        subChildren: [
          { name: "Add new restaurant", href: "/restaurant_management/add" },
          { name: "Restaurant list", href: "/restaurant_management/list" },
          { name: "Request", href: "/restaurant_management/request" },
          { name: "Bulk import", href: "#" },
          { name: "Bulk export", href: "#" },
        ],
      },
    ],
  },

  {
    name: "Food Management",
    icon: "/images/icons/Hamburger.png",
    children: [
      { name: "Categories", href: "#" },
      { name: "Addons", href: "#" },
      {
        name: "Food",
        subChildren: [
          { name: "Add new", href: "#" },
          { name: "Food list", href: "#" },
          { name: "List", href: "#" },
          { name: "Review", href: "#" },
          { name: "Bulk import", href: "#" },
          { name: "Bulk export", href: "#" },
        ],
      },
    ],
  },

  {
    name: "Customer Management",
    icon: "/images/icons/User.png",
    children: [
      { name: "Customers", href: "#" },

      {
        name: "Wallet",
        subChildren: [
          { name: "Add funds", href: "#" },
          { name: "Bonus", href: "#" },
        ],
      },

      {
        name: "Loyalty point",
        subChildren: [{ name: "Report", href: "#" }],
      },

      { name: "Subscribed mail list", href: "#" },
    ],
  },

  {
    name: "Employees",
    icon: "/images/icons/UsersThree.png",
    children: [
      { name: "Add new employee", href: "#" },
      { name: "Employee list", href: "/employees/list" },
    ],
  },

  {
    name: "Transaction Management",
    icon: "/images/icons/Calculator.png",
    children: [
      { name: "Collect cash" },
      { name: "Request withdrawals" },
      { name: "Delivery Payments" },
      { name: "Withdrawal method" },
    ],
  },

  {
    name: "Report Management",
    icon: "/images/icons/ChartPieSlice.png",
    children: [
      { name: "Transaction report" },
      { name: "Expense report" },

      {
        name: "Disbursement report",
        subChildren: [{ name: "Restaurant" }, { name: "Delivery personnel" }],
      },

      {
        name: "Customer report",
        subChildren: [{ name: "Wallet report" }],
      },

      {
        name: "Restaurant report",
        subChildren: [{ name: "Restaurant report" }],
      },

      {
        name: "Order report",
        subChildren: [
          { name: "Regular order report" },
          { name: "campaign order report" },
        ],
      },

      { name: "Food report" },
      { name: "Tax report" },
      { name: "Restaurant VAT report" },
    ],
  },

  {
    name: "Promos",
    icon: "/images/icons/Ticket.png",
    children: [
      {
        name: "Campaigns report",
        subChildren: [{ name: "Basic campaign" }, { name: "Food campaign" }],
      },

      { name: "Coupons" },
      { name: "Cashback" },
      { name: "Banners" },
      { name: "Promotions" },

      {
        name: "Advertisements",
        subChildren: [
          { name: "Create ad" },
          { name: "Ad request" },
          { name: "Ad list" },
        ],
      },

      { name: "Push notifications" },
    ],
  },

  {
    name: "Delivery management",
    icon: "/images/icons/Moped.png",
    children: [
      { name: "Shift setup", href: "/delivery_management/shift-setup" },
      {
        name: "Vehicle categoory setup",
        href: "/delivery_management/vehicle-category",
      },
      {
        name: "Delivery personnel",
        subChildren: [
          { name: "Request", href: "/delivery_management/request" },
          {
            name: "Add new personnel",
            href: "/delivery_management/add-personnel",
          },
          {
            name: "Personnel list",
            href: "/delivery_management/personnel-list",
          },
          {
            name: "Bonus",
            href: "/delivery_management/bonus",
          },
          { name: "Inactive requests" },
          { name: "Incentives history" },
        ],
      },

      { name: "Coupons", href: "/delivery_management/coupons" },
    ],
  },

  {
    name: "Bussiness Settings",
    icon: "/images/icons/Nut.png",
    children: [
      {
        name: "Campaigns report",
        subChildren: [{ name: "Basic campaign" }, { name: "Food campaign" }],
      },

      { name: "Coupons" },
    ],
  },

  {
    name: "Help & Support",
    icon: "/images/icons/Chats.png",
    children: [
      {
        name: "Campaigns report",
        subChildren: [{ name: "Basic campaign" }, { name: "Food campaign" }],
      },

      { name: "Coupons" },
    ],
  },

  {
    name: "Log Out",
    icon: "/images/icons/Power.png",
    href: "#logout",
  },
];

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [orderCounts, setOrderCounts] = useState<Record<string, number>>({
    all: 0,
    new: 0,
    accepted: 0,
    processing: 0,
    ready: 0,
    arrived: 0,
    assign: 0,
    "in-transit": 0,
    delivered: 0,
    cancelled: 0,
    "payment-failed": 0,
  });

  // Fetch order status counts on mount
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

  const toggleMenu = (name: string) => {
    setOpenMenus((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name],
    );
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      // Call logout API
      await logoutAdmin();

      // Redirect to login
      router.push("/auth/admin");
    } catch (error) {
      console.error("Logout error:", error);
      // Still redirect even if API call fails
      router.push("/auth/admin");
    }
  };

  return (
    <>
      {isLoggingOut && (
        <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-[1px] flex items-center justify-center">
          <div className="inline-flex items-center gap-2 rounded-xl bg-white/95 px-4 py-3 text-sm font-medium text-[#00302E] shadow-lg">
            <Loader2 className="h-4 w-4 animate-spin text-[#F16622]" />
            Logging out...
          </div>
        </div>
      )}
      <aside
        className="w-72 bg-[#F8F9FA] border-r border-gray-200 flex flex-col h-screen overflow-y-auto font-satoshi"
        aria-busy={isLoggingOut}
      >
      {/* Header */}
      <div className="p-4 bg-white flex items-center justify-between sticky top-0 z-10 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Image
            src="/images/icons/logo.png"
            alt="Logo"
            width={32}
            height={32}
          />
          <span className="text-[#F16622] font-bold text-lg">
            Cargoland Food
          </span>
        </div>
        <LayoutTemplate className="w-5 h-5 text-gray-400 cursor-pointer" />
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {sidebarData.map((item) => (
          <NavItem
            key={item.name}
            item={item}
            pathname={pathname}
            openMenus={openMenus}
            toggleMenu={toggleMenu}
            level={0}
            onLogout={handleLogout}
            isLoggingOut={isLoggingOut}
            orderCounts={orderCounts}
          />
        ))}
      </nav>
      </aside>
    </>
  );
}

type NavMenuItem = {
  name: string;
  href?: string;
  icon?: string | React.ComponentType<{ className?: string }>;
  count?: number;
  color?: string;
  children?: NavMenuItem[];
  subChildren?: NavMenuItem[];
};

function isDescendantActive(item: NavMenuItem, pathname: string): boolean {
  if (item.href && pathname === item.href) return true;

  const children = item.children || item.subChildren;
  if (!children) return false;

  return children.some((child) => isDescendantActive(child, pathname));
}

type NavItemProps = {
  item: NavMenuItem;
  pathname: string;
  openMenus: string[];
  toggleMenu: (name: string) => void;
  level: number;
  onLogout?: () => void;
  isLoggingOut?: boolean;
  orderCounts?: Record<string, number>;
};

// Helper function to get the dynamic count for a menu item
function getCountForMenuItem(item: NavMenuItem, orderCounts: Record<string, number> = {}): number | undefined {
  const countKeyMap: Record<string, string> = {
    "All": "all",
    "New": "new",
    "Accepted": "accepted",
    "Pick up": "ready",
    "Arrived": "arrived",
    "Preparing": "processing",
    "Ready": "ready",
    "Assign": "assign",
    "In transit": "in-transit",
    "Delivered": "delivered",
    "Cancelled": "cancelled",
    "Payment failed": "payment-failed",
  };

  const countKey = countKeyMap[item.name];
  if (countKey && orderCounts[countKey] !== undefined) {
    return orderCounts[countKey];
  }
  return item.count;
}

function NavItem({
  item,
  pathname,
  openMenus,
  toggleMenu,
  level,
  onLogout,
  isLoggingOut,
  orderCounts,
}: NavItemProps) {
  const hasChildren = item.children || item.subChildren;
  const isOpen = openMenus.includes(item.name);
  const isActive = isDescendantActive(item, pathname);

  // Text and weight become black/bold if the menu is open or the route is active
  const isHighlighted = isActive || isOpen;

  // Handle logout click
  const handleClick = (e: React.MouseEvent) => {
    if (item.name === "Log Out") {
      e.preventDefault();
      if (isLoggingOut) return;
      onLogout?.();
    } else if (hasChildren) {
      toggleMenu(item.name);
    }
  };

  return (
    <div className="w-full">
      {item.href && item.name !== "Log Out" ? (
        <Link
          href={item.href}
          onClick={() => hasChildren && toggleMenu(item.name)}
          className={`
            flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-all
            ${
              isHighlighted
                ? "text-black font-bold"
                : "text-gray-500 hover:bg-gray-100"
            }
          `}
        >
          <div className="flex items-center gap-3">
            {item.icon && (
              <div className="flex items-center justify-center w-5 h-5">
                {typeof item.icon === "string" ? (
                  <img
                    src={item.icon}
                    alt=""
                    width={20}
                    height={20}
                    className="shrink-0"
                  />
                ) : (
                  <item.icon
                    className={`w-5 h-5 shrink-0 ${
                      isHighlighted ? "text-[#F16622]" : "text-gray-400"
                    }`}
                  />
                )}
              </div>
            )}
            <span
              className={`text-[15px] leading-tight ${level > 0 ? "ml-2" : ""}`}
            >
              {item.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {getCountForMenuItem(item, orderCounts) !== undefined && (
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  item.color || "bg-blue-100 text-blue-600"
                }`}
              >
                {getCountForMenuItem(item, orderCounts)}
              </span>
            )}
            {hasChildren && (
              <div className="transition-transform duration-200">
                {isOpen ? (
                  <ChevronUp
                    className={`w-4 h-4 ${
                      isHighlighted ? "text-black" : "text-gray-400"
                    }`}
                  />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </div>
            )}
          </div>
        </Link>
      ) : (
        <div
          onClick={handleClick}
          className={`
            flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-all
            ${
              item.name === "Log Out"
                ? isLoggingOut
                  ? "text-gray-500 bg-gray-100 cursor-not-allowed"
                  : "text-gray-600 hover:bg-red-50 hover:text-red-600"
                : isHighlighted
                  ? "text-black font-bold"
                  : "text-gray-500 hover:bg-gray-100"
            }
          `}
        >
          <div className="flex items-center gap-3">
            {item.icon && (
              <div className="flex items-center justify-center w-5 h-5">
                {typeof item.icon === "string" ? (
                  <img
                    src={item.icon}
                    alt=""
                    width={20}
                    height={20}
                    className="shrink-0"
                  />
                ) : (
                  <item.icon
                    className={`w-5 h-5 shrink-0 ${
                      isHighlighted ? "text-[#F16622]" : "text-gray-400"
                    }`}
                  />
                )}
              </div>
            )}
            <span
              className={`text-[15px] leading-tight ${level > 0 ? "ml-2" : ""}`}
            >
              {item.name === "Log Out" && isLoggingOut ? "Logging out..." : item.name}
            </span>
          </div>

          {item.name === "Log Out" && isLoggingOut && (
            <Loader2 className="w-4 h-4 animate-spin text-[#F16622]" />
          )}

          <div className="flex items-center gap-2">
            {getCountForMenuItem(item, orderCounts) !== undefined && (
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  item.color || "bg-blue-100 text-blue-600"
                }`}
              >
                {getCountForMenuItem(item, orderCounts)}
              </span>
            )}
            {hasChildren && (
              <div className="transition-transform duration-200">
                {isOpen ? (
                  <ChevronUp
                    className={`w-4 h-4 ${
                      isHighlighted ? "text-black" : "text-gray-400"
                    }`}
                  />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Nested Children */}
      {hasChildren && isOpen && (
        <div className="mt-1 space-y-1 ml-6">
          {(item.children || item.subChildren)?.map((child) => (
            <NavItem
              key={child.name}
              item={child}
              pathname={pathname}
              openMenus={openMenus}
              toggleMenu={toggleMenu}
              level={level + 1}
              onLogout={onLogout}
              orderCounts={orderCounts}
            />
          ))}
        </div>
      )}
    </div>
  );
}
