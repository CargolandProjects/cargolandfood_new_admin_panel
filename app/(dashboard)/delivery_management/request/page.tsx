"use client";

import { useEffect, useState } from "react";
import { Star, CheckCircle2, XCircle } from "lucide-react";
import DataTable from "@/components/dashboard/DataTable";
import { Badge } from "@/components/dashboard/Badge";

type Status = "Pending" | "Approved" | "Declined";

type Vehicle = {
  id: number;
  owner: string;
  type: string;
  coverageArea: number;
  extraCharges: string;
  joinDate: string;
  status: Status;
  rating: string;
};

export default function RequestPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [activeTab, setActiveTab] = useState<Status | "All">("Pending");

  /* ✅ client-only mock data (no hydration error) */
  useEffect(() => {
    const data: Vehicle[] = Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      owner: i % 2 === 0 ? "John Doe" : "Sarah Smith",
      type:
        i % 3 === 0
          ? "Motorcycle"
          : i % 3 === 1
          ? "Bicycle"
          : "Electric Scooter",
      coverageArea: Math.floor(Math.random() * 500) + 100,
      extraCharges: (Math.random() * 5000 + 1000).toFixed(2),
      joinDate: `12 Oct, 202${i % 6}`,
      status: "Pending",
      rating: (Math.random() * 5).toFixed(1),
    }));

    setVehicles(data);
  }, []);

  /* ================= ACTIONS ================= */

  const updateStatus = (id: number, status: Status) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status } : v))
    );
  };

  /* ================= FILTER ================= */

  const filteredVehicles =
    activeTab === "All"
      ? vehicles
      : vehicles.filter((v) => v.status === activeTab);

  /* ================= COLUMNS ================= */

  const columns = [
    {
      key: "owner",
      label: "Vehicle Owner",
      render: (value: string, row: Vehicle) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-black rounded-full flex items-center justify-center">
            <img
              src="/images/icons/profile_picture.png"
              alt=""
              className="w-4 h-4"
            />
          </div>
          <div>
            <div className="font-bold text-black">{value}</div>
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
      render: (value: string) => <Badge value={value} />,
    },
    {
      key: "coverageArea",
      label: "Max Coverage (km)",
      align: "center" as const,
      render: (value: number) => (
        <span className="font-bold text-black">{value} km</span>
      ),
    },
    {
      key: "extraCharges",
      label: "Extra Charges",
      render: (value: string) => (
        <span className="text-gray-500 font-medium">₦{value}</span>
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
      render: (value: Status) => {
        const styles = {
          Pending: "bg-gray-200 text-gray-700",
          Approved: "bg-green-100 text-green-700",
          Declined: "bg-red-100 text-red-700",
        };

        return (
          <div
            className={`px-6 py-2 rounded-xl font-bold text-[13px] w-fit ${styles[value]}`}
          >
            {value}
          </div>
        );
      },
    },
    {
      key: "action",
      label: "Action",
      render: (_: any, row: Vehicle) => (
        <div className="flex items-center gap-3">
          <button
            onClick={() => updateStatus(row.id, "Approved")}
            className="flex items-center gap-2 px-8 py-2.5 bg-[#E7F7EF] text-[#039855] rounded-xl font-bold text-[13px]"
          >
            <CheckCircle2 className="w-4 h-4" />
            Approve
          </button>

          <button
            onClick={() => updateStatus(row.id, "Declined")}
            className="flex items-center gap-2 px-8 py-2.5 bg-[#FFF0E6] text-[#F16622] rounded-xl font-bold text-[13px]"
          >
            <XCircle className="w-4 h-4" />
            Decline
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 w-full min-h-screen bg-[#FBFBFB] space-y-4">
      {/* ===== HEADER TABS (RESTORED) ===== */}
      <div className="flex">
        <div className="flex bg-gray-50/50 p-1 rounded-xl border border-gray-100">
          {(["Pending", "Approved", "Declined"] as Status[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg text-[14px] font-bold transition-all ${
                activeTab === tab
                  ? "bg-[#FFF0E6] text-[#F16622] shadow-sm"
                  : "text-gray-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ===== TABLE CARD ===== */}
      <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm">
        <DataTable
          columns={columns}
          data={filteredVehicles}
          searchPlaceholder="Search by name, email or ID..."
          itemsPerPage={10}
          showCheckbox
          showExport
        />
      </div>
    </div>
  );
}
