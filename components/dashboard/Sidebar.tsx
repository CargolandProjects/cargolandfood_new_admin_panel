"use client";

import { useState } from "react";
import Link from "next/link";
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
} from "lucide-react";

const sidebarData = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutGrid },

  {
    name: "Order Management",
    icon: "/images/icons/Receipt.png",
    children: [
      {
        name: "Orders",
        href: "/orders",
        subChildren: [
          {
            name: "All",
            href: "/orders/all",
            count: 2,
            color: "bg-blue-100 text-blue-600",
          },
          {
            name: "Scheduled",
            href: "/orders/scheduled",
            count: 2,
            color: "bg-blue-100 text-blue-600",
          },
          {
            name: "Pending",
            href: "/orders/pending",
            count: 2,
            color: "bg-orange-100 text-orange-600",
          },
          {
            name: "Accepted",
            href: "/orders/accepted",
            count: 2,
            color: "bg-green-100 text-green-600",
          },
          {
            name: "Processing",
            href: "/orders/processing",
            count: 2,
            color: "bg-blue-100 text-blue-600",
          },
          {
            name: "In transit",
            href: "/orders/transit",
            count: 2,
            color: "bg-orange-100 text-orange-600",
          },
          {
            name: "Delivered",
            href: "/orders/delivered",
            count: 2,
            color: "bg-green-100 text-green-600",
          },
          {
            name: "Cancelled",
            href: "/orders/cancelled",
            count: 2,
            color: "bg-red-100 text-red-600",
          },
          {
            name: "Payment failed",
            href: "/orders/failed",
            count: 2,
            color: "bg-red-100 text-red-600",
          },
          {
            name: "Refunded",
            href: "/orders/refunded",
            count: 2,
            color: "bg-orange-100 text-orange-600",
          },
          {
            name: "Dine in",
            href: "/orders/dine-in",
            count: 2,
            color: "bg-blue-100 text-blue-600",
          },
          {
            name: "Offline payment",
            href: "/orders/offline",
            count: 2,
            color: "bg-blue-100 text-blue-600",
          },
        ],
      },
      {
        name: "Subscription orders",
        href: "/",
        // icon: RotateCcw,
      },

      {
        name: "Dispatch Management",
        // icon: Truck,
        subChildren: [
          {
            name: "Available deliveryman",
            href: "/dispatch/available",
            count: 2,
          },
          { name: "Orders in transit", href: "/dispatch/transit", count: 2 },
        ],
      },

      {
        name: "Refunds",
        href: "/refunds",
        subChildren: [
          {
            name: "Refund requests",
            href: "/refunds/requests",
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
      { name: "Zone setup", href: "/restaurant/zones" },
      { name: "Cuisine", href: "/restaurant/cuisine" },
      {
        name: "Restaurants",
        subChildren: [
          { name: "Add new restaurant", href: "/restaurant/add" },
          { name: "Restaurant list", href: "/restaurant/list" },
          { name: "Request", href: "/restaurant/list" },
          { name: "Bulk import", href: "/restaurant/list" },
          { name: "Bulk export", href: "/restaurant/list" },
        ],
      },
    ],
  },

  {
    name: "Food Management",
    icon: "/images/icons/Hamburger.png",
    children: [
      { name: "Categories", href: "/food/categories" },
      { name: "Addons", href: "/food/addons" },
      {
        name: "Food",
        subChildren: [
          { name: "Add new", href: "/food/add" },
          { name: "Food list", href: "/food/list" },
          { name: "List", href: "/food/list" },
          { name: "Review", href: "/food/list" },
          { name: "Bulk import", href: "/food/list" },
          { name: "Bulk export", href: "/food/list" },
        ],
      },
    ],
  },

  {
    name: "Customer Management",
    icon: "/images/icons/user.png",
    children: [
      { name: "Customers", href: "/customers" },

      {
        name: "Wallet",
        subChildren: [
          { name: "Add funds", href: "/customers/wallet/add-funds" },
          { name: "Bonus", href: "/customers/wallet/bonus" },
        ],
      },

      {
        name: "Loyalty point",
        subChildren: [{ name: "Report", href: "/customers/loyalty/report" }],
      },

      { name: "Subscribed mail list", href: "/customers/subscribed-mails" },
    ],
  },

  {
    name: "Employees",
    icon: "/images/icons/usersThree.png",
    children: [
      { name: "Add new employee", href: "/employees/add" },
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
];

export default function Sidebar() {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<string[]>([]); // <-- Start with nothing open

  const toggleMenu = (name: string) => {
    setOpenMenus((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]
    );
  };

  return (
    <aside className="w-72 bg-[#F8F9FA] border-r border-gray-200 flex flex-col h-screen overflow-y-auto font-satoshi">
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
          />
        ))}
      </nav>
    </aside>
  );
}

function isDescendantActive(item, pathname) {
  if (item.href && pathname === item.href) return true;

  const children = item.children || item.subChildren;
  if (!children) return false;

  return children.some((child) => isDescendantActive(child, pathname));
}

function NavItem({ item, pathname, openMenus, toggleMenu, level }) {
  const hasChildren = item.children || item.subChildren;
  const isOpen = openMenus.includes(item.name);
  const isActive = isDescendantActive(item, pathname);

  // Text and weight become black/bold if the menu is open or the route is active
  const isHighlighted = isActive || isOpen;

  const ContentWrapper = item.href ? Link : "div";

  return (
    <div className="w-full">
      <ContentWrapper
        {...(item.href ? { href: item.href } : {})}
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
                  className="shrink-0" // Removed brightness-0 and grayscale filters
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
          {item.count !== undefined && (
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                item.color || "bg-blue-100 text-blue-600"
              }`}
            >
              {item.count}
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
      </ContentWrapper>

      {/* Nested Children */}
      {hasChildren && isOpen && (
        <div className="mt-1 space-y-1 ml-6">
          {(item.children || item.subChildren).map((child) => (
            <NavItem
              key={child.name}
              item={child}
              pathname={pathname}
              openMenus={openMenus}
              toggleMenu={toggleMenu}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
