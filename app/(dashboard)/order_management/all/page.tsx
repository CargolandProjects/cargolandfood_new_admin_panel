"use client";

import { useEffect, useState } from "react";
import { MoreVertical } from "lucide-react";

import StatCard from "@/components/dashboard/StatCard";
import DataTable from "@/components/dashboard/DataTable";
import { Badge } from "@/components/dashboard/Badge";

// --------------------
// Mock helpers
// --------------------
const restaurants = [
  "Chicken Republic",
  "KFC",
  "Burger King",
  "Dominos",
  "Cold Stone",
  "Pink Berry",
  "The Place",
  "Nigerian Fast Food",
];

const generateMockOrders = () =>
  Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    orderId: `ORD-${String(i + 1).padStart(5, "0")}`,
    orderDate: `12 Oct, 202${i % 6}`,
    customer: {
      name: `Customer ${i + 1}`,
      phone: `080${Math.floor(10000000 + Math.random() * 90000000)}`,
    },
    restaurant: restaurants[Math.floor(Math.random() * restaurants.length)],
    amount: (Math.random() * 50000 + 5000).toFixed(2),
    paymentStatus: Math.random() > 0.4 ? "Paid" : "Unpaid",
    deliveryStatus: ["Delivered", "Processing", "Cancelled"][i % 3],
  }));

// --------------------
// UI helpers
// --------------------
const PaymentStatus = ({ status }: { status: string }) => {
  const isPaid = status === "Paid";

  return (
    <div
      className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg w-fit mx-auto text-[10px] font-bold ${
        isPaid ? "bg-green-100 text-green-700" : "bg-red-50 text-red-600"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isPaid ? "bg-green-500" : "bg-red-500"
        }`}
      />
      {status}
    </div>
  );
};

const getDeliveryStatusBadge = (status: string) => {
  if (status === "Delivered") return <Badge value="Delivered" showDot />;
  if (status === "Processing") return <Badge value="Processing" showDot />;
  if (status === "Cancelled") return <Badge value="Cancelled" showDot />;

  return <Badge value={status} showDot />;
};

// --------------------
// Page
// --------------------
export default function AllOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    setOrders(generateMockOrders());
  }, []);

  const columns = [
    {
      key: "orderId",
      label: "Order ID",
      render: (value: string) => (
        <span className="font-bold text-[#1A1A1A]">{value}</span>
      ),
    },
    {
      key: "orderDate",
      label: "Order Date",
      render: (value: string) => <span className="text-gray-500">{value}</span>,
    },
    {
      key: "customer",
      label: "Customer",
      render: (value: any) => (
        <div>
          <div className="font-medium text-[#1A1A1A]">{value.name}</div>
          <div className="text-xs text-gray-400">{value.phone}</div>
        </div>
      ),
    },
    {
      key: "restaurant",
      label: "Restaurant",
      render: (value: string) => (
        <span className="font-medium text-gray-600">{value}</span>
      ),
    },
    {
      key: "amount",
      label: "Total Amount",
      align: "center" as const,
      render: (_: string, row: any) => (
        <div className="flex flex-col items-center gap-1">
          <div className="font-bold text-[#1A1A1A]">₦{row.amount}</div>
          <PaymentStatus status={row.paymentStatus} />
        </div>
      ),
    },
    {
      key: "deliveryStatus",
      label: "Delivery Status",
      render: (value: string) => getDeliveryStatusBadge(value),
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
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Orders"
          value="21"
          subtext="Orders"
          trend="+2%"
          color="text-green-500"
          footerLabel="New orders"
        />
        <StatCard
          title="Ongoing Orders"
          value="5"
          subtext="Orders"
          trend="+2"
          color="text-green-500"
          footerLabel="20 mins ago"
        />
        <StatCard
          title="Cancelled Orders"
          value="10"
          subtext="Orders"
          trend="-4%"
          color="text-red-500"
          footerLabel="Cancelled recently"
        />
        <StatCard
          title="Completed Orders"
          value="20"
          subtext="Orders"
          trend="-2"
          color="text-red-500"
          footerLabel="Completed recently"
        />
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={orders}
        searchPlaceholder="Search by order ID or customer..."
        itemsPerPage={10}
        showCheckbox
        showExport
      />
    </div>
  );
}
