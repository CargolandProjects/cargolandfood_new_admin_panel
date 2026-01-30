"use client";

import { MoreVertical } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import DataTable from "@/components/dashboard/DataTable";

// Mock zone data
const mockZones = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  zoneName: `Zone ${i + 1}`,
  zoneCode: `Z-${String(i + 1).padStart(3, "0")}`,
  restaurants: Math.floor(Math.random() * 50) + 5,
  deliveryTime: Math.floor(Math.random() * 45) + 15,
  status: i % 3 === 0 ? "Active" : "Inactive",
  createdDate: `12 Oct, 202${i % 6}`,
}));

export default function ZoneSetupPage() {
  const columns = [
    {
      key: "zoneName",
      label: "Zone Name",
      render: (value: string) => (
        <span className="font-bold text-[#1A1A1A]">{value}</span>
      ),
    },
    {
      key: "zoneCode",
      label: "Zone Code",
      render: (value: string) => (
        <span className="text-gray-500 font-medium">{value}</span>
      ),
    },
    {
      key: "restaurants",
      label: "Restaurants",
      align: "center" as const,
      render: (value: number) => (
        <span className="font-bold text-[#1A1A1A]">{value}</span>
      ),
    },
    {
      key: "deliveryTime",
      label: "Avg Delivery Time",
      render: (value: number) => (
        <span className="text-gray-500">{value} mins</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => (
        <span
          className={`px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 w-fit ${
            value === "Active"
              ? "bg-[#E7F7EF] text-[#0D894F]"
              : "bg-[#F2F4F7] text-[#344054]"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              value === "Active" ? "bg-[#0D894F]" : "bg-[#344054]"
            }`}
          />
          {value}
        </span>
      ),
    },
    {
      key: "createdDate",
      label: "Created Date",
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
          title="Total Zones"
          value="12"
          subtext="Zones"
          trend="+2"
          color="text-green-500"
          footerLabel="Total Size"
        />
        <StatCard
          title="Active Zones"
          value="10"
          subtext="Zones"
          trend="+1"
          color="text-green-500"
          footerLabel="Total Size"
        />
        <StatCard
          title="Total Restaurants"
          value="450"
          subtext="Restaurants"
          trend="+15"
          color="text-green-500"
          footerLabel="Total Size"
        />
        <StatCard
          title="Avg Delivery Time"
          value="28"
          subtext="Minutes"
          trend="-2"
          color="text-green-500"
          footerLabel="Total Size"
        />
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={mockZones}
        searchPlaceholder="Search by zone name or code..."
        itemsPerPage={10}
        showCheckbox={true}
        showExport={true}
      />
    </div>
  );
}
