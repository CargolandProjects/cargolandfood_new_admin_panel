"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Star } from "lucide-react";
import Image from "next/image";
import {
  fetchPendingVendors,
  fetchDeclinedVendors,
  fetchApprovedVendors,
  approveOrRejectVendor,
  type RestaurantRow,
} from "@/lib/api/vendors";

// ── Tab type ──────────────────────────────────────────────────────────────────
type Tab = "pending" | "approved" | "declined";

export default function RestaurantRequestPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("pending");

  const [pendingData, setPendingData] = useState<RestaurantRow[]>([]);
  const [approvedData, setApprovedData] = useState<RestaurantRow[]>([]);
  const [declinedData, setDeclinedData] = useState<RestaurantRow[]>([]);

  const [loadingPending, setLoadingPending] = useState(true);
  const [loadingApproved, setLoadingApproved] = useState(false);
  const [loadingDeclined, setLoadingDeclined] = useState(false);

  const [errorPending, setErrorPending] = useState<string | null>(null);
  const [errorApproved, setErrorApproved] = useState<string | null>(null);
  const [errorDeclined, setErrorDeclined] = useState<string | null>(null);

  // tracks which vendor ID is currently being actioned
  const [actioningId, setActioningId] = useState<string | null>(null);

  const [search, setSearch] = useState("");

  // Load pending on mount
  useEffect(() => {
    fetchPendingVendors()
      .then(setPendingData)
      .catch((e) => setErrorPending(e.message ?? "Failed to load"))
      .finally(() => setLoadingPending(false));
  }, []);

  // Load approved only when that tab is first opened
  useEffect(() => {
    if (activeTab !== "approved" || approvedData.length > 0 || loadingApproved)
      return;
    setLoadingApproved(true);
    fetchApprovedVendors()
      .then(setApprovedData)
      .catch((e) => setErrorApproved(e.message ?? "Failed to load"))
      .finally(() => setLoadingApproved(false));
  }, [activeTab]);

  // Load declined only when that tab is first opened
  useEffect(() => {
    if (activeTab !== "declined" || declinedData.length > 0 || loadingDeclined)
      return;
    setLoadingDeclined(true);
    fetchDeclinedVendors()
      .then(setDeclinedData)
      .catch((e) => setErrorDeclined(e.message ?? "Failed to load"))
      .finally(() => setLoadingDeclined(false));
  }, [activeTab]);

  // ── Action handler ──────────────────────────────────────────────────────────
  async function handleAction(vendorId: string, action: "APPROVE" | "REJECT") {
    setActioningId(vendorId);
    try {
      await approveOrRejectVendor(vendorId, action);
      // Optimistically remove from pending list
      setPendingData((prev) => prev.filter((r) => r.id !== vendorId));
      // Invalidate the destination cache so it reloads fresh on next visit
      if (action === "REJECT") setDeclinedData([]);
      if (action === "APPROVE") setApprovedData([]);
    } catch (e: any) {
      alert(e.message ?? "Action failed. Please try again.");
    } finally {
      setActioningId(null);
    }
  }

  // ── Derived data ────────────────────────────────────────────────────────────
  const rows =
    activeTab === "pending"
      ? pendingData
      : activeTab === "approved"
      ? approvedData
      : declinedData;

  const loading =
    activeTab === "pending"
      ? loadingPending
      : activeTab === "approved"
      ? loadingApproved
      : loadingDeclined;

  const error =
    activeTab === "pending"
      ? errorPending
      : activeTab === "approved"
      ? errorApproved
      : errorDeclined;

  const filtered = rows.filter(
    (r) =>
      r.restaurantName.toLowerCase().includes(search.toLowerCase()) ||
      r.ownerName.toLowerCase().includes(search.toLowerCase()) ||
      r.mobileNumber.includes(search)
  );

  // ── Columns ─────────────────────────────────────────────────────────────────
  const columns: {
    key: string;
    label: string;
    align?: "left" | "center";
  }[] = [
    { key: "restaurantName", label: "Restaurant Name" },
    { key: "owner", label: "Owner" },
    { key: "cuisine", label: "Cuisine" },
    { key: "zone", label: "Zone" },
    { key: "joinDate", label: "Request Date" },
    { key: "status", label: "Status", align: "center" },
  ];

  // ── Tab config ───────────────────────────────────────────────────────────────
  const tabs: {
    id: Tab;
    label: string;
    count: number | null;
    loading: boolean;
    activeColor: string;
    badgeColor: string;
  }[] = [
    {
      id: "pending",
      label: "Pending request",
      count: pendingData.length,
      loading: loadingPending,
      activeColor: "bg-orange-100 text-orange-500",
      badgeColor: "bg-orange-500 text-white",
    },
    {
      id: "approved",
      label: "Approved request",
      count: approvedData.length,
      loading: loadingApproved,
      activeColor: "bg-green-100 text-green-600",
      badgeColor: "bg-green-500 text-white",
    },
    {
      id: "declined",
      label: "Declined request",
      count: declinedData.length,
      loading: loadingDeclined,
      activeColor: "bg-red-100 text-red-500",
      badgeColor: "bg-red-500 text-white",
    },
  ];

  return (
    <div className="space-y-6 p-6 bg-white min-h-screen">

      {/* ── Tab switcher ──────────────────────────────────────────────────── */}
      <div className="w-full overflow-hidden">
  <div className="flex gap-3 flex-nowrap overflow-x-auto pb-2 scrollbar-hide">
    {tabs.map((tab) => {
      const isActive = activeTab === tab.id;

      return (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center gap-2 whitespace-nowrap shrink-0 px-4 lg:px-6 py-2.5 lg:py-3 rounded-xl text-sm font-semibold transition-colors ${
            isActive
              ? tab.activeColor
              : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
          }`}
        >
          {tab.label}

          {!tab.loading && (tab.count ?? 0) > 0 && (
            <span
              className={`inline-flex items-center justify-center w-5 h-5 lg:w-6 lg:h-6 rounded-full text-[10px] lg:text-[11px] font-bold ${
                isActive ? tab.badgeColor : "bg-gray-200 text-gray-600"
              }`}
            >
              {tab.count}
            </span>
          )}
        </button>
      );
    })}
  </div>
</div>

      {/* ── Table card ────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-[20px] border border-gray-200 shadow-sm overflow-hidden">

        {/* Search bar */}
        <div className="p-6 pb-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
            <input
              type="text"
              placeholder="Search by name, email or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-black/20 rounded-full text-[13px] placeholder:text-black/40 focus:outline-none focus:border-black/40 shadow-sm"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[12px] text-gray-400 uppercase font-semibold border-b border-gray-200">
                <th className="px-6 py-4 w-10">
                  <input
                    type="checkbox"
                    onClick={(event) => event.stopPropagation()}
                    className="rounded border-gray-300"
                  />
                </th>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`px-6 py-4 ${col.align === "center" ? "text-center" : ""}`}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={columns.length + 1} className="py-16 text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                      <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                      Loading…
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={columns.length + 1} className="py-16 text-center text-red-500 text-sm">
                    {error}
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="py-16 text-center text-gray-400 text-sm">
                    No {activeTab} requests found.
                  </td>
                </tr>
              ) : (
                filtered.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => router.push(`/restaurant_management/list/${row.id}`)}
                    className="hover:bg-gray-50 transition-colors text-sm cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        onClick={(event) => event.stopPropagation()}
                        className="rounded border-gray-300"
                      />
                    </td>

                    {/* Restaurant Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#1A1A1A] rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden">
                          <div className="w-4 h-4 bg-orange-400 rounded-full blur-[2px] translate-y-2" />
                        </div>
                        <div>
                          <div className="font-bold text-[#1A1A1A]">{row.restaurantName}</div>
                          <div className="flex items-center gap-1 text-[11px] text-gray-400">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            {row.rating}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Owner */}
                    <td className="px-6 py-4">
                      <div className="font-medium text-[#1A1A1A] text-sm">{row.ownerName}</div>
                      <div className="text-[11px] text-gray-400">{row.mobileNumber}</div>
                    </td>

                    {/* Cuisine */}
                    <td className="px-6 py-4">
                      <span className="text-gray-500 font-medium">{row.cuisine}</span>
                    </td>

                    {/* Zone */}
                    <td className="px-6 py-4">
                      <span className="text-gray-500 font-medium">{row.zone}</span>
                    </td>

                    {/* Request Date */}
                    <td className="px-6 py-4">
                      <span className="text-gray-500">{row.joinDate}</span>
                    </td>

                    {/* Status column */}
                    <td className="px-6 py-4">
                      {activeTab === "pending" ? (
                        // Pending → approve + decline action buttons
                        <div className="flex items-center justify-center gap-2">
                          <button
                            title="Approve"
                            disabled={actioningId === row.id}
                            onClick={(event) => {
                              event.stopPropagation();
                              handleAction(row.id, "APPROVE");
                            }}
                            className="w-10 h-10 rounded-xl bg-green-100 hover:bg-green-200 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {actioningId === row.id ? (
                              <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Image
                                src="/images/icons/approve-icon.png"
                                alt="Approve"
                                width={22}
                                height={22}
                              />
                            )}
                          </button>
                          <button
                            title="Decline"
                            disabled={actioningId === row.id}
                            onClick={(event) => {
                              event.stopPropagation();
                              handleAction(row.id, "REJECT");
                            }}
                            className="w-10 h-10 rounded-xl bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {actioningId === row.id ? (
                              <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Image
                                src="/images/icons/decline-icon.png"
                                alt="Decline"
                                width={22}
                                height={22}
                              />
                            )}
                          </button>
                        </div>
                      ) : activeTab === "approved" ? (
                        // Approved → show green "Approved" badge
                        <div className="flex items-center justify-center">
                          <span className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-green-50 text-green-600 font-semibold text-sm">
                            <Image
                              src="/images/icons/approve-icon.png"
                              alt=""
                              width={18}
                              height={18}
                            />
                            Approved
                          </span>
                        </div>
                      ) : (
                        // Declined → show red "Declined" badge
                        <div className="flex items-center justify-center">
                          <span className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 text-red-500 font-semibold text-sm">
                            <Image
                              src="/images/icons/decline-icon.png"
                              alt=""
                              width={18}
                              height={18}
                            />
                            Declined
                          </span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
