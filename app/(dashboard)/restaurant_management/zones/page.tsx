"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Plus, Filter, Download, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { fetchZones, type Zone } from "@/lib/api/zones";
import SearchZoneModal from "@/components/SearchZoneModal";

export default function ZonesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [zones, setZones] = useState<Zone[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    const loadZones = async () => {
      try {
        setLoading(true);
        const data = await fetchZones();
        setZones(data);
        setError(null);
      } catch (err) {
        setError("Failed to load zones");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadZones();
  }, []);

  // Calculate stats from zones data
  const stats = [
    { label: "Total Zones", count: zones.length, color: "text-gray-900" },
    { label: "Active Zones", count: zones.filter(z => z.isActive).length, color: "text-gray-900" },
    { label: "Zones With High Priority", count: zones.filter(z => z.priority >= 3).length, color: "text-gray-900" },
    { label: "Zones with Low Priority", count: zones.filter(z => z.priority <= 2).length, color: "text-gray-900" },
  ];

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      CITY: "bg-blue-100 text-blue-700",
      LOCAL: "bg-green-100 text-green-700",
      EXPRESS: "bg-orange-100 text-orange-700",
      PROMO: "bg-pink-100 text-pink-700",
    };
    return colors[type] || "bg-gray-100 text-gray-700";
  };

  const getStatusColor = (status: boolean) => {
    return status ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700";
  };

  const getPriorityLabel = (priority: number) => {
    const labels: Record<number, string> = {
      1: "Low",
      2: "Medium",
      3: "High",
      4: "Highest",
    };
    return labels[priority] || "Medium";
  };

  const filteredZones = zones.filter((zone) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;

    return [
      zone.id,
      zone.zoneName,
      zone.zoneType,
      String(zone.restaurantCount ?? 0),
      String(zone.personnelCount ?? 0),
      zone.isActive ? "active" : "inactive",
    ]
      .join(" ")
      .toLowerCase()
      .includes(term);
  });

  const totalPages = Math.max(1, Math.ceil(filteredZones.length / itemsPerPage));

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, zones.length]);

  const currentData = filteredZones.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const pageItems: Array<number | string> =
    totalPages <= 5
      ? Array.from({ length: totalPages }, (_, i) => i + 1)
      : currentPage <= 3
      ? [1, 2, 3, "...", totalPages]
      : currentPage >= totalPages - 2
      ? [1, "...", totalPages - 2, totalPages - 1, totalPages]
      : [1, "...", currentPage, "...", totalPages];

  if (loading) {
    return (
      <div className="min-h-screen p-8 font-sans text-[#4B5563] w-full bg-gray-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading zones...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8 font-sans text-[#4B5563] w-full bg-gray-50/30 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 font-sans text-[#4B5563] w-full bg-gray-50/30">
      <div className="w-full space-y-6">
        <h1 className="text-xl font-bold text-gray-900">Zones</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <p className="text-[13px] font-medium text-gray-500 mb-2">{stat.label}</p>
              <div className="flex items-end">
                <div>
                  <p className="text-3xl font-bold text-gray-900">{stat.count}</p>
                  <p className="text-[11px] text-gray-400 mt-1">Zones</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Zone List Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <h2 className="text-[13px] font-bold text-gray-900 uppercase tracking-wider">Zone list</h2>
              <span className="bg-orange-100 text-orange-700 text-[11px] font-bold px-2 py-1 rounded">{filteredZones.length}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
  
  {/* Search Input */}
  <div className="relative w-full lg:flex-1 lg:max-w-md">
    <input
      type="text"
      placeholder="Search by name, email or ID..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-orange-500 outline-none"
    />
  </div>

  {/* Action Buttons */}
  <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
    
    <button
      onClick={() => setShowSearchModal(true)}
      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 border border-orange-200 bg-orange-50 text-orange-600 rounded-lg text-sm font-medium hover:bg-orange-100 transition-colors"
    >
      <Search className="w-4 h-4" />
      Search Zone
    </button>

    <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
      <Filter className="w-4 h-4" />
      Filter
    </button>

    <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
      <Download className="w-4 h-4" />
      Export
    </button>

    <button
      onClick={() =>
        router.push("/restaurant_management/zones/create")
      }
      className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-100 text-orange-600 rounded-lg text-sm font-bold hover:bg-orange-200"
    >
      <Plus className="w-4 h-4" />
      Create New Zone
    </button>

  </div>
</div>

          {/* Table */}
          <div className="w-full overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch]">
            <table className="w-full min-w-[1100px] text-sm">
    <thead>
      <tr className="border-b border-gray-200">
        <th className="text-left py-3 px-3 lg:px-4 font-medium text-gray-600 text-[11px] lg:text-[12px]">
          <input type="checkbox" className="rounded" />
        </th>

        <th className="text-left py-3 px-3 lg:px-4 font-medium text-gray-600 text-[11px] lg:text-[12px]">
          Zone ID
        </th>

        <th className="text-left py-3 px-3 lg:px-4 font-medium text-gray-600 text-[11px] lg:text-[12px]">
          Zone
        </th>

        <th className="text-left py-3 px-3 lg:px-4 font-medium text-gray-600 text-[11px] lg:text-[12px]">
          Zone type
        </th>

        <th className="text-left py-3 px-3 lg:px-4 font-medium text-gray-600 text-[11px] lg:text-[12px]">
          Restaurant
        </th>

        <th className="text-left py-3 px-3 lg:px-4 font-medium text-gray-600 text-[11px] lg:text-[12px]">
          Delivery Personnel
        </th>

        <th className="text-left py-3 px-3 lg:px-4 font-medium text-gray-600 text-[11px] lg:text-[12px]">
          Priority
        </th>

        <th className="text-left py-3 px-3 lg:px-4 font-medium text-gray-600 text-[11px] lg:text-[12px]">
          Status
        </th>

        <th className="text-left py-3 px-3 lg:px-4 font-medium text-gray-600 text-[11px] lg:text-[12px]">
          Action
        </th>
      </tr>
    </thead>

    <tbody>
      {currentData.map((zone) => (
        <tr
          key={zone.id}
          className="border-b border-gray-100 hover:bg-gray-50"
        >
          <td className="py-3 px-3 lg:px-4">
            <input type="checkbox" className="rounded" />
          </td>

          <td className="py-3 px-3 lg:px-4 text-[11px] lg:text-[12px] text-gray-600">
            {zone.id.slice(0, 8)}
          </td>

          <td className="py-3 px-3 lg:px-4 text-[11px] lg:text-[12px] font-medium text-gray-900 whitespace-nowrap">
            {zone.zoneName}
          </td>

          <td className="py-3 px-3 lg:px-4">
            <span
              className={`text-[10px] lg:text-[11px] font-semibold px-3 py-1 rounded-full whitespace-nowrap ${getTypeColor(
                zone.zoneType
              )}`}
            >
              {zone.zoneType}
            </span>
          </td>

          <td className="py-3 px-3 lg:px-4 text-[11px] lg:text-[12px] text-gray-600">
            {zone.restaurantCount || 0}
          </td>

          <td className="py-3 px-3 lg:px-4 text-[11px] lg:text-[12px] text-gray-600">
            {zone.personnelCount || 0}
          </td>

          <td className="py-3 px-3 lg:px-4">
            <select className="text-[11px] lg:text-[12px] border border-gray-200 rounded px-2 py-1 focus:outline-none">
              <option>{getPriorityLabel(zone.priority)}</option>
            </select>
          </td>

          <td className="py-3 px-3 lg:px-4">
            <span
              className={`text-[10px] lg:text-[11px] font-semibold px-3 py-1 rounded-full whitespace-nowrap ${getStatusColor(
                zone.isActive
              )}`}
            >
              {zone.isActive ? "Active" : "Inactive"}
            </span>
          </td>

          <td className="py-3 px-3 lg:px-4 text-center">
            <button className="text-gray-400 hover:text-gray-600">
              •••
            </button>
          </td>
        </tr>
      ))}

      {currentData.length === 0 && (
        <tr>
          <td colSpan={9} className="py-8 text-center text-sm text-gray-500">
            No zones found.
          </td>
        </tr>
      )}
    </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Prev
            </button>
            <div className="flex items-center gap-2">
              {pageItems.map((page, idx) => (
                <button
                  key={idx}
                  disabled={typeof page !== "number"}
                  onClick={() =>
                    typeof page === "number" ? handlePageChange(page) : undefined
                  }
                  className={`w-8 h-8 rounded text-sm font-medium ${
                    page === currentPage
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      {/* Search Zone Modal */}
      <SearchZoneModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        zones={zones}
      />
    </div>
  );
}
