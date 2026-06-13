import Link from "next/link";

export default function OrderManagement() {
  return (
    <div className="p-6 bg-[#F8F9FA] min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-[#00302E]">Order Management</h1>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <p className="text-gray-600 mb-4">
          Select an order list to view and manage order details.
        </p>
        <Link
          href="/order_management/all"
          className="inline-flex items-center px-4 py-2 rounded-xl bg-[#F16622] text-white text-sm font-semibold hover:bg-[#dd5e1f] transition-colors"
        >
          View All Orders
        </Link>
      </div>
    </div>
  );
}
