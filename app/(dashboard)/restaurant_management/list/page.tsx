"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MoreVertical, Star } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import DataTable from "@/components/dashboard/DataTable";
import { Badge } from "@/components/dashboard/Badge";
import { fetchVendors, toggleVendorStatus, type RestaurantRow } from "@/lib/api/vendors";

export default function RestaurantListPage() {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<RestaurantRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVendors()
      .then(setRestaurants)
      .catch((err) => setError(err.message ?? "Failed to load restaurants"))
      .finally(() => setLoading(false));
  }, []);

  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Toggle a vendor's active status — optimistic update, reverts on error
  async function toggleStatus(id: string) {
    setTogglingId(id);
    // Optimistic flip
    setRestaurants((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: r.status === "Active" ? "Inactive" : "Active" } : r
      )
    );
    try {
      const newIsActive = await toggleVendorStatus(id);
      // Sync with actual API response
      setRestaurants((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status: newIsActive ? "Active" : "Inactive" } : r
        )
      );
    } catch {
      // Revert on failure
      setRestaurants((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status: r.status === "Active" ? "Inactive" : "Active" } : r
        )
      );
    } finally {
      setTogglingId(null);
    }
  }

  // ── Derived stats ──────────────────────────────────────────────────────────
  const total = restaurants.length;
  const active = restaurants.filter((r) => r.status === "Active").length;
  const inactive = restaurants.filter((r) => r.status === "Inactive").length;

  // ── Columns ────────────────────────────────────────────────────────────────
  const columns = [
    {
      key: "restaurantName",
      label: "Restaurant Name",
      render: (value: string, row: RestaurantRow) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#1A1A1A] rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden">
            <div className="w-4 h-4 bg-orange-400 rounded-full blur-[2px] translate-y-2" />
          </div>
          <div>
            <div className="font-bold text-[#1A1A1A]">{value}</div>
            <div className="flex items-center gap-1 text-[11px] text-gray-400">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              {row.rating}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "ownerName",
      label: "Owner",
      render: (value: string, row: RestaurantRow) => (
        <div>
          <div className="font-medium text-[#1A1A1A] text-sm">{value}</div>
          <div className="text-[11px] text-gray-400">{row.mobileNumber}</div>
        </div>
      ),
    },
    {
      key: "cuisine",
      label: "Cuisine",
      render: (value: string) => (
        <span className="text-gray-500 font-medium">{value}</span>
      ),
    },
    {
      key: "zone",
      label: "Zone",
      render: (value: string) => (
        <span className="text-gray-500 font-medium">{value}</span>
      ),
    },
    {
      key: "orders",
      label: "Total Orders",
      align: "center" as const,
      render: (value: number) => (
        <span className="font-bold text-[#1A1A1A]">{value}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value: string, row: RestaurantRow) => {
        const isActive = value === "Active";
        const isToggling = togglingId === row.id;
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleStatus(row.id)}
              disabled={isToggling}
              className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed ${
                isActive ? "bg-green-500" : "bg-gray-300"
              }`}
              aria-label={`Toggle ${row.restaurantName} status`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
                  isActive ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
            <Badge value={isActive ? "Active" : "Inactive"} />
          </div>
        );
      },
    },
    {
      key: "joinDate",
      label: "Join Date",
      render: (value: string) => (
        <span className="text-gray-500">{value}</span>
      ),
    },
    {
      key: "action",
      label: "Action",
      render: (_: string, row: RestaurantRow) => (
        <button
          onClick={(event) => {
            event.stopPropagation();
            router.push(`/restaurant_management/list/${row.id}`);
          }}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <MoreVertical className="w-4 h-4 text-gray-400" />
        </button>
      ),
    },
  ];

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 p-6 bg-white">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Restaurants"
          value={loading ? "—" : String(total)}
          subtext="Restaurants"
          trend="+12"
          color="text-green-500"
          footerLabel="Total Size"
        />
        <StatCard
          title="Active"
          value={loading ? "—" : String(active)}
          subtext="Restaurants"
          trend="+10"
          color="text-green-500"
          footerLabel="Total Size"
        />
        <StatCard
          title="Inactive"
          value={loading ? "—" : String(inactive)}
          subtext="Restaurants"
          trend="+2"
          color="text-orange-500"
          footerLabel="Total Size"
        />
        <StatCard
          title="Avg Rating"
          value="4.5"
          subtext="Stars"
          trend="+0.2"
          color="text-green-500"
          footerLabel="Total Size"
        />
      </div>

      {/* Error banner */}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Data Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400 text-sm gap-2">
          <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          Loading restaurants…
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={restaurants}
          onRowClick={(row: RestaurantRow) =>
            router.push(`/restaurant_management/list/${row.id}`)
          }
          searchPlaceholder="Search by restaurant name..."
          itemsPerPage={10}
          showCheckbox={true}
          showExport={true}
        />
      )}
    </div>
  );
}
