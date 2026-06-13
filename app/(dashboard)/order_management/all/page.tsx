"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MoreVertical } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import DataTable from "@/components/dashboard/DataTable";
import { Badge } from "@/components/dashboard/Badge";
import { fetchOrders, type OrderRow } from "@/lib/api/orders";

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
  if (status === "Cancelled") return <Badge value="Cancelled" showDot />;
  return <Badge value={status} showDot />;
};

export default function AllOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchOrders()
      .then(({ orders: rows, meta }) => {
        setOrders(rows);
        setTotalCount(meta.total);
      })
      .catch((err) => setError(err.message ?? "Failed to load orders"))
      .finally(() => setLoading(false));
  }, []);

  const ongoing = orders.filter(
    (o) => o.deliveryStatus !== "Delivered" && o.deliveryStatus !== "Cancelled"
  ).length;
  const cancelled = orders.filter((o) => o.deliveryStatus === "Cancelled").length;
  const completed = orders.filter((o) => o.deliveryStatus === "Delivered").length;

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
      render: (value: OrderRow["customer"]) => (
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
      render: (_: string, row: OrderRow) => (
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
      render: (_: string, row: OrderRow) => (
        <button
          onClick={(event) => {
            event.stopPropagation();
            router.push(`/order_management/${row.id}`);
          }}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <MoreVertical className="w-4 h-4 text-gray-400" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-6 bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Orders"
          value={loading ? "—" : String(totalCount)}
          subtext="Orders"
          trend="+2%"
          color="text-green-500"
          footerLabel="New orders"
        />
        <StatCard
          title="Ongoing Orders"
          value={loading ? "—" : String(ongoing)}
          subtext="Orders"
          trend="+2"
          color="text-green-500"
          footerLabel="20 mins ago"
        />
        <StatCard
          title="Cancelled Orders"
          value={loading ? "—" : String(cancelled)}
          subtext="Orders"
          trend="-4%"
          color="text-red-500"
          footerLabel="Cancelled recently"
        />
        <StatCard
          title="Completed Orders"
          value={loading ? "—" : String(completed)}
          subtext="Orders"
          trend="-2"
          color="text-red-500"
          footerLabel="Completed recently"
        />
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400 text-sm gap-2">
          <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          Loading orders…
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={orders}
          onRowClick={(row: OrderRow) => router.push(`/order_management/${row.id}`)}
          searchPlaceholder="Search by order ID or customer..."
          itemsPerPage={10}
          showCheckbox
          showExport
        />
      )}
    </div>
  );
}
