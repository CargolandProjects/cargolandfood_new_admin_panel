"use client";

import StatCard from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/vendor/Pagination";
import VendorsTable from "@/components/vendor/VendorsTable";
import { formatIncome } from "@/lib/api/dashboard";
import {
  useDashboard,
  useVendors,
  useVendorStat,
} from "@/lib/hooks/queries/useVendor";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { useSession } from "@/lib/providers/SessionProvider";
import { Download, Search, SlidersHorizontal, SortDesc } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export type VendorAction = "view" | "createMenu" | "delete";

export default function VendorManagementPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery);
  const router = useRouter();

  const {
    data: vendors,
    isFetching: isLoadingVendors,
    refetch,
    isError,
    isSuccess,
  } = useVendors(currentPage, 10, debouncedSearch);
  const { data: stats, isLoading } = useVendorStat();
  const { data: dashboard, isLoading: isDashboardLoading } = useDashboard();

  const session = useSession();

  const totalPages = 5;

  // reset to page 1 whenever the search term changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [debouncedSearch]);

  const onRowClick = (vendorId: string) => {
    router.push(`/vendor-management/${vendorId}`);
  };
  const onAction = (action: VendorAction, vendorId: string) => {
    if (action === "view") router.push(`/vendor-management/${vendorId}`);
    if (action === "createMenu")
      router.push(`/vendor-management/${vendorId}/create-menu`);
    if (action === "delete") {
    }
  };

  return (
    <div>
      {/*  Stat cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          title="Total Vendors"
          loading={isLoading}
          value={String(stats?.totalVendor ?? 0)}
          subtext={"Vendors"}
          trend={`+${0}%`}
          color="text-green-500"
          footerLabel="Total Size"
        />
        <StatCard
          title="Active Vendors"
          loading={isLoading}
          value={String(stats?.totalActiveVendor ?? 0)}
          subtext={"Active"}
          trend={`+${0}%`}
          color="text-green-500"
          footerLabel="Joined this month"
        />
        <StatCard
          title="Pending Approvals"
          loading={isLoading}
          value={String(stats?.pendingVendor ?? 0)}
          subtext={"Pending"}
          trend={`+${0}`}
          color="text-green-500"
          footerLabel="Total Size"
        />
        <StatCard
          title="Total Income"
          loading={isDashboardLoading}
          value={formatIncome(dashboard?.stats?.totalIncome.amount ?? 0)}
          subtext={dashboard?.stats?.totalIncome.label ?? ""}
          trend={`+${dashboard?.stats?.totalIncome.change ?? 0}%`}
          color="text-green-500"
          footerLabel="Total Size"
        />
      </div>

      <h2 className="my-5 pl-4 text-base font-bold">All Vendors</h2>

      <div className="border rounded-[16px]">
        <div className="p-4 flex gap-2 max-md:flex-col justify-between md:items-center">
          <div className="relative w-full md:max-w-[364px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/60" />
            <input
              type="text"
              placeholder="Search by name, email or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-black/20 rounded-full text-[13px] text-black placeholder:text-black/40 focus:outline-none focus:border-black/40 shadow-sm"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              className="p-2 text-[10px] font-medium gap-1.5 border border-gray-100"
            >
              <SlidersHorizontal className="size-4" />
              Filter
            </Button>
            <Button
              variant="ghost"
              className="p-2 text-[10px] font-medium gap-1.5 border border-gray-100"
            >
              <SortDesc className="size-4" />
              Sort By
            </Button>
            <Button
              variant="ghost"
              className="p-2 text-[10px] font-medium gap-1.5 border border-gray-100"
            >
              <Download className="size-4" />
              Export
            </Button>
          </div>
        </div>

        <div>
          <VendorsTable
            vendors={vendors || []}
            isLoading={isLoadingVendors}
            isError={isError}
            isSuccess={isSuccess}
            onRetry={refetch}
            onAction={onAction}
            onRowClick={onRowClick}
          />

          <div className="px-4 py-3">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
