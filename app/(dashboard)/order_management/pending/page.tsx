"use client";

import { MoreVertical, Star } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import DataTable from "@/components/dashboard/DataTable";
import { Badge } from "@/components/dashboard/Badge";

// Mock order data - all pending
const mockOrders = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  orderId: `ORD-${String(i + 1).padStart(5, "0")}`,
  customer: `Customer ${i + 1}`,
  restaurant: `Restaurant ${i + 1}`,
  amount: (Math.random() * 50000 + 5000).toFixed(2),
  orderDate: `12 Oct, 202${i % 6}`,
  status: "Pending",
  rating: (Math.random() * 5).toFixed(1),
}));

export default function PendingOrdersPage() {
  const columns = [
    {
      key: "orderId",
      label: "Order ID",
      render: (value: string, row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#1A1A1A] rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden">
            <div className="w-4 h-4 bg-blue-400 rounded-full blur-[2px] translate-y-2" />
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
      key: "customer",
      label: "Customer",
      render: (value: string) => (
        <span className="text-gray-500 font-medium">{value}</span>
      ),
    },
    {
      key: "restaurant",
      label: "Restaurant",
      render: (value: string) => (
        <span className="text-gray-500 font-medium">{value}</span>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      align: "center" as const,
      render: (value: string) => (
        <span className="font-bold text-[#1A1A1A]">₦{value}</span>
      ),
    },
    {
      key: "orderDate",
      label: "Order Date",
      render: (value: string) => <span className="text-gray-500">{value}</span>,
    },
    {
      key: "status",
      label: "Status",
      render: () => <Badge value="Pending" showDot={true} />,
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

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={mockOrders}
        searchPlaceholder="Search by order ID or customer..."
        itemsPerPage={10}
        showCheckbox={true}
        showExport={true}
      />
    </div>
  );
}
