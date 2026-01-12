"use client";

import { Calendar, ChevronDown, MoreVertical, Star } from "lucide-react";
import DataTable from "@/components/dashboard/DataTable";
import { Badge } from "@/components/dashboard/Badge";

// Mock bonus transaction data
const mockBonusData = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  personnel: `Personnel ${i + 1}`,
  transactionId: `TXN-${String(i + 1).padStart(5, "0")}`,
  reference: `REF-${String(i + 1).padStart(4, "0")}`,
  extraCharges: Math.floor(Math.random() * 10) + 1,
  depositDate: `12 Oct, 202${i % 6}`,
  status: ["Approved", "Pending", "Declined"][Math.floor(Math.random() * 3)],
  rating: (Math.random() * 5).toFixed(1),
}));

export default function BonusPage() {
  const getStatusBadge = (value: string) => {
    if (value === "Approved") {
      return <Badge value="Active" showDot={true} />;
    } else if (value === "Pending") {
      return <Badge value="On Probation" showDot={true} />;
    } else if (value === "Declined") {
      return <Badge value="Terminated" showDot={true} />;
    }
    return <Badge value={value} showDot={true} />;
  };

  const columns = [
    {
      key: "personnel",
      label: "Delivery Personnel",
      render: (value: string, row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#1A1A1A] rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden">
            <div className="w-4 h-4 bg-blue-400 rounded-full blur-[2px] translate-y-2" />
          </div>
          <div>
            <div className="font-bold text-[#1A1A1A]">{value}</div>
            <div className="flex items-center gap-1 text-[11px] text-gray-400">
              <Star className="w-3 h-3 text-yellow-400 fill-current" /> {row.rating}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "transactionId",
      label: "Transaction ID",
      render: (value: string) => (
        <span className="text-gray-500 font-medium">{value}</span>
      ),
    },
    {
      key: "reference",
      label: "Reference",
      render: (value: string) => (
        <span className="text-gray-500 font-medium">{value}</span>
      ),
    },
    {
      key: "extraCharges",
      label: "Extra Charges",
      align: "center" as const,
      render: (value: number) => (
        <span className="font-bold text-[#1A1A1A]">{value}</span>
      ),
    },
    {
      key: "depositDate",
      label: "Deposit Date",
      render: (value: string) => (
        <span className="text-gray-500">{value}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => getStatusBadge(value),
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
    <>
      <style jsx global>{`
        input,
        select,
        textarea {
          color: #000 !important;
        }

        input::placeholder,
        textarea::placeholder {
          color: #9ca3af;
        }
      `}</style>

      <div className="p-6 w-full space-y-6">
        {/* Form Card */}
        <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-8">
          <form className="space-y-10">
            {/* Section 1: Vehicle Details */}
            <section className="space-y-6">
              <h2 className="text-[16px] font-bold text-black">Bonus </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {/* Vehicle Type */}
                <div className="space-y-2 max-w-[500px]">
                  <label className="text-[13px] text-gray-400">
                    Delivery Personnel
                  </label>
                  <div className="relative">
                    <select className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#F16622]/40">
                      <option value="">Select vehicle type</option>
                      <option value="motorcycle">Motorcycle</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2 max-w-[500px]">
                  <label className="text-[13px] text-gray-400">Amount</label>
                  <input
                    type="text"
                    placeholder="Amount "
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#F16622]/40"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-[13px] text-gray-400">Reference</label>
                  <input
                    type="text"
                    placeholder="Enter reference"
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-black focus:outline-none focus:border-[#F16622]/40"
                  />
                </div>
              </div>
            </section>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 pt-4">
              <button
                type="reset"
                className="px-10 py-3 border border-gray-200 rounded-xl text-[14px] font-bold text-black hover:bg-gray-50 transition-colors"
              >
                Reset
              </button>
              <button
                type="submit"
                className="px-10 py-3 bg-[#FFF0E6] text-[#F16622] rounded-xl text-[14px] font-bold hover:bg-[#ffe6d5] transition-colors"
              >
                Save
              </button>
            </div>
          </form>
        </div>

        {/* Transactions Title with Count */}
        <div className="flex items-center gap-3">
          <h2 className="text-[18px] font-bold text-black">Transactions</h2>
          <span className="w-6 h-6 bg-[#F16622] text-white rounded-full flex items-center justify-center text-[12px] font-bold">
            {mockBonusData.length}
          </span>
        </div>

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={mockBonusData}
          searchPlaceholder="Search by personnel or transaction ID..."
          itemsPerPage={10}
          showCheckbox={true}
          showExport={true}
        />
      </div>
    </>
  );
}
