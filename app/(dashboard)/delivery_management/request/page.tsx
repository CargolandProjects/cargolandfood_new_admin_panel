"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle } from "lucide-react";
import DataTable from "@/components/dashboard/DataTable";
import { Badge } from "@/components/dashboard/Badge";
import {
  fetchRiders,
  approveOrRejectRider,
  type RiderRow,
} from "@/lib/api/riders";

type Tab = "Pending" | "Approved" | "Declined";

function tabToApproval(tab: Tab): RiderRow["approvalStatus"] {
  if (tab === "Pending") return "PENDING";
  if (tab === "Approved") return "APPROVE";
  return "REJECT";
}

export default function RequestPage() {
  const router = useRouter();
  const [riders, setRiders] = useState<RiderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("Pending");
  const [actioningId, setActioningId] = useState<string | null>(null);

  useEffect(() => {
    fetchRiders()
      .then(setRiders)
      .catch((err) => setError(err.message ?? "Failed to load riders"))
      .finally(() => setLoading(false));
  }, []);

  async function handleAction(riderId: string, action: "APPROVE" | "REJECT") {
    setActioningId(riderId);
    try {
      await approveOrRejectRider(riderId, action);
      setRiders((prev) =>
        prev.map((r) =>
          r.id === riderId
            ? {
                ...r,
                approvalStatus: action === "APPROVE" ? "APPROVE" : "REJECT",
              }
            : r
        )
      );
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "Action failed. Please try again.";
      setError(message);
    } finally {
      setActioningId(null);
    }
  }

  const filteredRiders = riders.filter(
    (r) => r.approvalStatus === tabToApproval(activeTab)
  );

  const columns = [
    {
      key: "riderName",
      label: "Rider Name",
      render: (value: string, row: RiderRow) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-black rounded-full flex items-center justify-center overflow-hidden">
            {row.profileImg ? (
              <img
                src={row.profileImg}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src="/images/icons/profile_picture.png"
                alt=""
                className="w-4 h-4"
              />
            )}
          </div>
          <div>
            <div className="font-bold text-black">{value}</div>
            <div className="text-[11px] text-gray-400">{row.mobileNumber}</div>
          </div>
        </div>
      ),
    },
    {
      key: "vehicleType",
      label: "Vehicle Type",
      render: (value: string) => <Badge value={value} />,
    },
    {
      key: "zone",
      label: "Zone",
      render: (value: string) => (
        <span className="text-gray-500 font-medium">{value}</span>
      ),
    },
    {
      key: "totalOrders",
      label: "Total Orders",
      align: "center" as const,
      render: (value: number) => (
        <span className="font-bold text-black">{value}</span>
      ),
    },
    {
      key: "joinDate",
      label: "Join Date",
      render: (value: string) => <span className="text-gray-500">{value}</span>,
    },
    {
      key: "status",
      label: "Account Status",
      render: (value: string) => <Badge value={value} showDot />,
    },
    ...(activeTab === "Pending"
      ? [
          {
            key: "action",
            label: "Action",
            render: (_: unknown, row: RiderRow) => (
              <div className="flex items-center gap-3">
                <button
                  disabled={actioningId === row.id}
                  onClick={(event) => {
                    event.stopPropagation();
                    handleAction(row.id, "APPROVE");
                  }}
                  className="flex items-center gap-2 px-8 py-2.5 bg-[#E7F7EF] text-[#039855] rounded-xl font-bold text-[13px] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Approve
                </button>
                <button
                  disabled={actioningId === row.id}
                  onClick={(event) => {
                    event.stopPropagation();
                    handleAction(row.id, "REJECT");
                  }}
                  className="flex items-center gap-2 px-8 py-2.5 bg-[#FFF0E6] text-[#F16622] rounded-xl font-bold text-[13px] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <XCircle className="w-4 h-4" />
                  Decline
                </button>
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="p-6 w-full min-h-screen bg-[#FBFBFB] space-y-4">
      <div className="flex overflow-x-auto">
        <div className="flex flex-shrink-0 bg-gray-50/50 p-1 rounded-xl border border-gray-100">
          {(["Pending", "Approved", "Declined"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 sm:px-6 py-2 rounded-lg text-[13px] sm:text-[14px] font-bold transition-all whitespace-nowrap ${
                activeTab === tab
                  ? "bg-[#FFF0E6] text-[#F16622] shadow-sm"
                  : "text-gray-500"
              }`}
            >
              {tab}
              <span className={`ml-1.5 text-[12px] opacity-80 ${loading ? "invisible" : ""}`}>
                (
                {
                  riders.filter(
                    (r) => r.approvalStatus === tabToApproval(tab)
                  ).length
                }
                )
              </span>
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-400 text-sm gap-2">
            <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            Loading riders…
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredRiders}
            onRowClick={(row: RiderRow) =>
              router.push(`/delivery_management/personnel-list/${row.id}`)
            }
            searchPlaceholder="Search by name, phone or ID..."
            itemsPerPage={10}
            showCheckbox
            showExport
          />
        )}
      </div>
    </div>
  );
}
