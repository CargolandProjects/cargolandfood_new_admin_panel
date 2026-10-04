"use client";

import StatCard from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/vendor/Pagination";
import PromosTable from "@/components/vendor/promotion/PromoTable";
import { useDeleteMenuItem } from "@/lib/hooks/mutations/useVendorMenu";
import { useVendors } from "@/lib/hooks/queries/useVendor";
import { VendorListVendor } from "@/lib/services/vendor.service";
import { Download, Search, SlidersHorizontal, SortDesc } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export type PromoAction = "view" | "create" | "generate" | "delete";

export default function PromotionManagementPage() {
  const [activeTab, setActiveTab] = useState<"Promo" | "Coupons">("Promo");
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, isError, isSuccess, refetch } = useVendors();
  // currentPage,
  // 10,
  // searchQuery || undefined,
  // activeTab === "all" ? undefined : activeTab,
  const { mutate: deleteMenu } = useDeleteMenuItem();

  const router = useRouter();

  const items = data?.data ?? [];
  const pagination = data?.pagination;
  const totalPages = pagination?.totalPages ?? 5;

  const handleAction = (action: PromoAction, vendor?: VendorListVendor) => {
    if (action === "view") {
      router.push(`#`);
    }
    if (action === "create") {
      if (!vendor?.id) return;
      router.push(
        `/promotion-management/${vendor?.id}/create-promo?zoneId=${vendor.zoneId}`,
      );
    }

    if (action === "delete") {
      if (!vendor?.id) return;
      setDeletingId(vendor.id);
      deleteMenu(
        { vendorId: vendor.id, menuId: vendor.id },
        {
          onSettled: () => {
            setDeletingId("");
          },
        },
      );
    }
  };

  return (
    <div>
      {/* ── Top bar For DIspatch */}
      {/* <div className="flex items-center justify-end">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="p-2.5 h-auto gap-2.5 text-base font-medium leading-5 rounded-md border-2 border-gray-200"
          >
            Pending request
            <span className="inline-flex h-5 min-w-5 text-[10px] font-medium items-center justify-center rounded-full px-1.5 bg-gray-200 text-gray-600">
              {16}
            </span>
          </Button>
          <Button
            onClick={() =>
              router.push(`/promotion-management/${vendorId}/create-promo`)
            }
            size="sm"
            className="p-2.5 h-auto text-base font-medium leading-5 rounded-md bg-primary"
          >
            Add Dispatcher Rider
          </Button>
        </div>
      </div> */}

      {/*  Stat cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          title="Total Dispatchers"
          loading={isLoading}
          value={String(212)}
          subtext={"Dispatchers"}
          trend={`+${0}%`}
          color="text-green-500"
          footerLabel="Total Size"
        />
        <StatCard
          title="Active Dispatchers"
          loading={isLoading}
          value={String(156)}
          subtext={"Active"}
          trend={`+${0}%`}
          color="text-green-500"
          footerLabel="Joined this month"
        />
        <StatCard
          title="On Delivery"
          loading={isLoading}
          value={String(48)}
          subtext={"On Delivery"}
          trend={`+${0}`}
          color="text-green-500"
          footerLabel="Currently Running Delivery"
        />
        <StatCard
          title="Total Income"
          loading={isLoading}
          value={String(20)}
          subtext={"Currently employed and active"}
          trend={`+4%`}
          color="text-green-500"
          footerLabel="Total Size"
        />
      </div>

      {/* Tabs */}
      <div className="mt-5 flex w-[296px] border-2 border-gray-100 rounded-[8px]">
        <Button
          onClick={() => setActiveTab("Promo")}
          className={`${activeTab === "Promo" ? " bg-primary/10 hover:bg-primary/10" : "bg-transparent text-black! hover:bg-gray-50"} flex-1 py-2.5 h-auto text-base font-medium text-primary leading-5.5 rounded-sm`}
        >
          Promo
        </Button>
        <Button
          onClick={() => setActiveTab("Coupons")}
          className={`${activeTab === "Coupons" ? " bg-primary/10 hover:bg-primary/10" : "bg-transparent text-black! hover:bg-gray-50"} flex-1 py-2.5 h-auto text-base font-medium text-primary leading-5.5 rounded-sm`}
        >
          Coupons
        </Button>
      </div>

      {/* Search & Table */}
      <div className="mt-5 border rounded-[16px]">
        {/* search & action buttons */}
        <div className="p-4 flex gap-2 max-md:flex-col justify-between md:items-center">
          <div className="relative w-full md:max-w-91">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/60" />
            <input
              type="text"
              placeholder="Search by name, email or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-black/20 rounded-full text-[13px] text-black placeholder:text-black/40 focus:outline-none focus:border-black/40"
            />
          </div>

          {/* Toolbar */}
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

        {/* Table */}
        <div>
          <PromosTable
            vendors={items}
            isLoading={isLoading}
            // deletingId={deletingId}
            isSuccess={isSuccess}
            isError={isError}
            onRetry={refetch}
            onAction={handleAction}
          />

          {totalPages > 1 && (
            <div className="px-4 py-3">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
