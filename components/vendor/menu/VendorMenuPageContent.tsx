"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Download,
  ListFilter,
  Search,
  ArrowUpDown,
  SlidersHorizontal,
  SortDesc,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import Pagination from "@/components/vendor/Pagination";
import MenuTabs, { type MenuTab } from "@/components/vendor/menu/MenuTabs";
import MenuTable, { type MenuAction } from "@/components/vendor/menu/MenuTable";
import { useVendorMenu } from "@/lib/hooks/queries/useVendor";

export default function VendorMenuPage({ vendorId }: { vendorId: string }) {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError, isSuccess, refetch } = useVendorMenu(
    vendorId,
    // currentPage,
    // 10,
    // searchQuery || undefined,
    // activeTab === "all" ? undefined : activeTab,
  );

  const items = data?.data ?? [];
  const pagination = data?.pagination;
  const totalPages = pagination?.totalPages ?? 5;

  const filteredItems = useMemo(() => {
    if (activeTab === "all") return items;
    return items.filter((item) => item.category?.id === activeTab);
  }, [items, activeTab]);

  // Derive tabs from the current page's items. Swap for a dedicated categories
  // endpoint when it's available — this only reflects what's loaded.
  const tabs: MenuTab[] = useMemo(() => {
    const counts = new Map<string, { name: string; count: number }>();
    let total = 0;
    items.forEach((item) => {
      total += 1;
      if (!item.category) return;
      const existing = counts.get(item.category.id);
      counts.set(item.category.id, {
        name: item.category.name,
        count: (existing?.count ?? 0) + 1,
      });
    });

    return [
      { id: "all", name: "All", count: total },
      ...Array.from(counts.entries()).map(([id, v]) => ({
        id,
        name: v.name,
        count: v.count,
      })),
    ];
  }, [items]);

  const handleAction = (action: MenuAction, id: string) => {
    if (action === "view") {
      router.push(`/vendor-management/${vendorId}/menu/create-menu`);
    } else if (action === "edit") {
      router.push(`/vendor-management/${vendorId}/menu/create-menu/`);
    } else if (action === "delete") {
      // TODO: wire delete mutation + confirm dialog
      console.log("delete", id);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 pb-10">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="h-auto gap-1 rounded-md border-gray-200 p-2 text-xs text-neutral-500"
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>
          <h1 className="text-base font-bold">All Menu</h1>
        </div>

        <Button
          onClick={() =>
            router.push(`/vendor-management/${vendorId}/menu/create-menu?`)
          }
          className="p-2.5 h-auto text-base font-medium leading-5 rounded-md bg-primary"
        >
          Create Menu
        </Button>
      </div>

      {/* Tabs */}
      <MenuTabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={(id) => {
          setActiveTab(id);
          setCurrentPage(1);
        }}
      />

      {/* Toolbar */}
      <div className="border rounded-[16px]">
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
          <MenuTable
            items={filteredItems}
            isLoading={isLoading}
            isSuccess={isSuccess}
            isError={isError}
            onRetry={refetch}
            onAction={handleAction}
          />

          {isSuccess && totalPages > 1 && (
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
