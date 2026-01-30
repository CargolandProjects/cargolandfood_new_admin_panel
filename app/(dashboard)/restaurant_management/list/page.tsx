"use client";

import { MoreVertical, Star } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import DataTable from "@/components/dashboard/DataTable";
import { Badge } from "@/components/dashboard/Badge";

// Mock restaurant data
const mockRestaurants = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  restaurantName: `Restaurant ${i + 1}`,
  cuisine: ["Italian", "Chinese", "Indian", "Mexican", "Japanese"][i % 5],
  zone: `Zone ${(i % 5) + 1}`,
  rating: (Math.random() * 5).toFixed(1),
  orders: Math.floor(Math.random() * 500) + 50,
  status: i % 3 === 0 ? "Active" : "Inactive",
  joinDate: `12 Oct, 202${i % 6}`,
}));

export default function RestaurantListPage() {
  const columns = [
    {
      key: "restaurantName",
      label: "Restaurant Name",
      render: (value: string, row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#1A1A1A] rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden">
            <div className="w-4 h-4 bg-orange-400 rounded-full blur-[2px] translate-y-2" />
          </div>
          <div>
            <div className="font-bold text-[#1A1A1A]">{value}</div>
            <div className="flex items-center gap-1 text-[11px] text-gray-400">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />{" "}
              {row.rating}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "cuisine",
      label: "Cuisine",
      render: (value: string) => (
        <span className="text-gray-500 font-medium">{value}</span>
      ),
    },
    {
      key: "zone",
      label: "Zone",
      render: (value: string) => (
        <span className="text-gray-500 font-medium">{value}</span>
      ),
    },
    {
      key: "orders",
      label: "Total Orders",
      align: "center" as const,
      render: (value: number) => (
        <span className="font-bold text-[#1A1A1A]">{value}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => (
        <Badge value={value === "Active" ? "Active" : "Inactive"} />
      ),
    },
    {
      key: "joinDate",
      label: "Join Date",
      render: (value: string) => <span className="text-gray-500">{value}</span>,
    },
    {
      key: "action",
      label: "Action",
      render: () => (
        <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
          <MoreVertical className="w-4 h-4 text-gray-400" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-6 bg-white">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Restaurants"
          value="450"
          subtext="Restaurants"
          trend="+12"
          color="text-green-500"
          footerLabel="Total Size"
        />
        <StatCard
          title="Active"
          value="420"
          subtext="Restaurants"
          trend="+10"
          color="text-green-500"
          footerLabel="Total Size"
        />
        <StatCard
          title="Inactive"
          value="30"
          subtext="Restaurants"
          trend="+2"
          color="text-orange-500"
          footerLabel="Total Size"
        />
        <StatCard
          title="Avg Rating"
          value="4.5"
          subtext="Stars"
          trend="+0.2"
          color="text-green-500"
          footerLabel="Total Size"
        />
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={mockRestaurants}
        searchPlaceholder="Search by restaurant name..."
        itemsPerPage={10}
        showCheckbox={true}
        showExport={true}
      />
    </div>
  );
}
