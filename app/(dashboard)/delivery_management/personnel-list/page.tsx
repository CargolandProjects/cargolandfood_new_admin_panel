"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MoreVertical, Star } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import DataTable from "@/components/dashboard/DataTable";
import { Badge } from "@/components/dashboard/Badge";
import { fetchRiders, type RiderRow } from "@/lib/api/riders";

export default function PersonnelListPage() {
  const router = useRouter();
  const [riders, setRiders] = useState<RiderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRiders()
      .then(setRiders)
      .catch((e) => setError(e.message ?? "Failed to load riders"))
      .finally(() => setLoading(false));
  }, []);

  const total = riders.length;
  const active = riders.filter((r) => r.status === "Active").length;
  const inactive = riders.filter((r) => r.status === "Inactive").length;

  const columns = [
    {
      key: "riderName",
      label: "Rider Name",
      render: (value: string, row: RiderRow) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#1A1A1A] rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden">
            {row.profileImg ? (
              <img src={row.profileImg} alt={value} className="w-full h-full object-cover rounded-full" />
            ) : (
              <img src="/images/icons/profile_picture.png" alt="" className="w-4 h-4" />
            )}
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
      key: "mobileNumber",
      label: "Mobile Number",
      render: (value: string) => (
        <span className="text-gray-500 font-medium">{value}</span>
      ),
    },
    {
      key: "vehicleType",
      label: "Vehicle",
      render: (value: string) => (
        <span className="text-gray-500 font-medium">{value}</span>
      ),
    },
    {
      key: "zone",
      label: "Zone",
      render: (value: string) => (
        <span className="text-gray-500 font-medium text-xs">{value}</span>
      ),
    },
    {
      key: "totalOrders",
      label: "Total Deliveries",
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
      render: (_: string, row: RiderRow) => (
        <button
          onClick={(event) => {
            event.stopPropagation();
            router.push(`/delivery_management/personnel-list/${row.id}`);
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
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Riders"
          value={loading ? "—" : String(total)}
          subtext="Riders"
          trend="+2%"
          color="text-green-500"
          footerLabel="Total Size"
        />
        <StatCard
          title="Active Riders"
          value={loading ? "—" : String(active)}
          subtext="Riders"
          trend="+4%"
          color="text-green-500"
          footerLabel="Total Size"
        />
        <StatCard
          title="Inactive Riders"
          value={loading ? "—" : String(inactive)}
          subtext="Riders"
          trend="-4"
          color="text-red-500"
          footerLabel="Total Size"
        />
        <StatCard
          title="Pending Approval"
          value={loading ? "—" : String(riders.length)}
          subtext="Riders"
          trend="+2"
          color="text-orange-500"
          footerLabel="Total Size"
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
          Loading riders…
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={riders}
          onRowClick={(row: RiderRow) =>
            router.push(`/delivery_management/personnel-list/${row.id}`)
          }
          searchPlaceholder="Search by name, phone or zone..."
          itemsPerPage={10}
          showCheckbox={true}
          showExport={true}
        />
      )}
    </div>
  );
}
