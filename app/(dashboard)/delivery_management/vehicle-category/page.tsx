"use client";
import Link from "next/link";
import { MoreVertical, Star } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import DataTable from "@/components/dashboard/DataTable";
import { Badge } from "@/components/dashboard/Badge";

// 1. Updated mock data: Ensure these keys match the "key" in your columns
const mockVehicles = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  owner: i % 2 === 0 ? "John Doe" : "Sarah Smith",
  // Updated types here
  type:
    i % 3 === 0 ? "Motorcycle" : i % 3 === 1 ? "Bicycle" : "Electric Scooter",
  coverageArea: Math.floor(Math.random() * 500) + 100,
  extraCharges: (Math.random() * 5000 + 1000).toFixed(2),
  joinDate: `12 Oct, 202${i % 6}`,
  status: i % 3 === 0 ? "Active" : i % 3 === 1 ? "Pending" : "Inactive",
  rating: (Math.random() * 5).toFixed(1),
}));

export default function VehicleCategoryPage() {
  const columns = [
    {
      key: "owner", // Matches data.owner
      label: "Vehicle Owner",
      render: (value: string, row: any) => (
        <div className="flex items-center gap-3">
          {/* Profile Picture with orange glow */}
          <div className="w-9 h-9 bg-[#1A1A1A] rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden">
            <img
              src="/images/icons/profile_picture.png"
              alt=""
              className="w-4 h-4"
            />
          </div>
          <div>
            <div className="font-bold text-[#1A1A1A]">{value}</div>
            <div className="flex items-center gap-1 text-[11px] text-gray-400">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              {row.rating}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "type",
      label: "Vehicle Type",
      // CHANGED: Now using the Badge component
      render: (value: string) => <Badge value={value} />,
    },
    {
      key: "coverageArea", // Matches data.coverageArea
      label: "Max Coverage (km)",
      align: "center" as const,
      render: (value: number) => (
        <span className="font-bold text-[#1A1A1A]">{value} km</span>
      ),
    },
    {
      key: "extraCharges", // Matches data.extraCharges
      label: "Extra Charges",
      render: (value: string) => (
        <span className="text-gray-500 font-medium">₦{value}</span>
      ),
    },
    {
      key: "joinDate", // Matches data.joinDate
      label: "Join Date",
      render: (value: string) => <span className="text-gray-500">{value}</span>,
    },
    {
      key: "status", // Matches data.status
      label: "Status",
      render: (value: string) => <Badge value={value} showDot={true} />,
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
      {/* 1. Stats Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Registered vehicles"
          value="212"
          subtext="vehicles"
          trend="+2"
          color="text-green-500"
          footerLabel="Total Size"
        />
        <StatCard
          title="New Vehicles"
          value="5"
          subtext="New Vehicles"
          trend="+2%"
          color="text-green-500"
          footerLabel="Joined this month"
        />
        <StatCard
          title="Under Maintenance"
          value="10"
          subtext="Vehicles"
          trend="-4"
          color="text-red-500"
          footerLabel="Faulty vehicles"
        />
        <StatCard
          title="Unregistered Vehicles"
          value="20"
          subtext="Vehicles"
          trend="+4%"
          color="text-green-500"
          footerLabel="Awaiting registration"
        />
      </div>

      {/* 2. Add Button Bar */}
      <div className="flex justify-end w-full">
        <Link href="/delivery_management/add-vehicle">
          <button className="bg-[#FFF0E6] text-[#F16622] px-6 py-2.5 rounded-xl font-bold text-[14px] hover:bg-[#ffe6d5] transition-colors">
            Add New Vehicle
          </button>
        </Link>
      </div>

      {/* 3. Data Table Section */}
      <DataTable
        columns={columns}
        data={mockVehicles}
        searchPlaceholder="Search owner, type or status..."
        itemsPerPage={10}
        showCheckbox={true}
        showExport={true}
      />
    </div>
  );
}
