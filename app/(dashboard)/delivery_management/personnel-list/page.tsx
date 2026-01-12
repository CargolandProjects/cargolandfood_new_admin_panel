"use client";

import { MoreVertical, Star } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import DataTable from "@/components/dashboard/DataTable";
import { Badge } from "@/components/dashboard/Badge";

// Generate mock staff data
const mockStaff = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `Employee ${i + 1}`,
  mobile: `0912345${String(100 + i).slice(-3)}`,
  zone:
    i % 3 === 0
      ? "Alimosho, Lagos"
      : i % 3 === 1
      ? "Ikeja, Lagos"
      : "Victoria Island, Lagos",
  totalOrders: Math.floor(Math.random() * 20),
  joinDate: `12 Oct, 202${i % 6}`,
  status: i % 4 === 0 ? "Active" : i % 4 === 1 ? "On Probation" : "Terminated",
}));

export default function PersonnelListPage() {
  const columns = [
    {
      key: "name",
      label: "Employee Name",
      render: (value: string) => (
        <div className="flex items-center gap-3">
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
              <Star className="w-3 h-3 text-yellow-400 fill-current" /> 0.0
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "mobile",
      label: "Mobile Number",
      render: (value: string) => (
        <span className="text-gray-500 font-medium">{value}</span>
      ),
    },
    {
      key: "zone",
      label: "Zone",
      render: (value: string) => <Badge value={value} />,
    },
    {
      key: "totalOrders",
      label: "Total Orders",
      align: "center" as const,
      render: (value: number) => (
        <span className="font-bold text-[#1A1A1A]">{value}</span>
      ),
    },
    {
      key: "joinDate",
      label: "Join Date",
      render: (value: string) => <span className="text-gray-500">{value}</span>,
    },
    {
      key: "status",
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
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Riders"
          value="212"
          subtext="Riders"
          trend="+2%"
          color="text-green-500"
          footerLabel="Total Size"
        />
        <StatCard
          title="New Hires"
          value="5"
          subtext="New Riders"
          trend="+2"
          color="text-green-500"
          footerLabel="Total Size"
        />
        <StatCard
          title="On Leave"
          value="10"
          subtext="Riders"
          trend="-4"
          color="text-red-500"
          footerLabel="Total Size"
        />
        <StatCard
          title="Active Riders"
          value="20"
          subtext="Riders"
          trend="+4%"
          color="text-green-500"
          footerLabel="Total Size"
        />
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={mockStaff}
        searchPlaceholder="Search by name, email or ID..."
        itemsPerPage={10}
        showCheckbox={true}
        showExport={true}
      />
    </div>
  );
}
