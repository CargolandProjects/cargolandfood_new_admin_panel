"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Download,
  MoreVertical,
  Search,
  SlidersHorizontal,
  SortDesc,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import Pagination from "@/components/vendor/Pagination";
import MenuTabs, { type MenuTab } from "@/components/vendor/menu/MenuTabs";
import MenuTable from "@/components/vendor/menu/MenuTable";
import { useVendor, useVendorMenu } from "@/lib/hooks/queries/useVendor";
import { useDeleteMenuItem } from "@/lib/hooks/mutations/useVendorMenu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import VendorPromoTable from "./VendorPromoTable";
import { useVendorPromotions } from "@/lib/hooks/queries/usePromo";
import { Promotion } from "@/lib/services/promo.service";
import { useDeletePromo } from "@/lib/hooks/mutations/useMutatePromo";

export type MenuAction = "view" | "edit" | "delete";
export type ActiveFlow = "Promo" | "Coupons";

export default function VendorPromoManagement({
  vendorId,
}: {
  vendorId: string;
}) {
  const router = useRouter();

  const [activeFlow, setActiveFlow] = useState<ActiveFlow>("Promo");
  // const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState("");

  const { data, isLoading, isError, isSuccess, refetch } = useVendorPromotions(
    vendorId,
    // currentPage,
    // 10,
    // searchQuery || undefined,
    // activeTab === "all" ? undefined : activeTab,
  );
  const { data: vendor } = useVendor(vendorId);
  const { mutate: deletePromo } = useDeletePromo();

  const items = data?.data ?? [];
  //   const pagination = data?.pagination;
  const totalPages = 5;

  const handleAction = (action: MenuAction, promo?: Promotion) => {
    // if (action === "view") {
    //   router.push(`/vendor-management/${vendorId}/menu/create-menu`);
    // }

    if (action === "edit") {
      if (!promo?.id) return;
      router.push(
        `/vendor-management/${vendorId}/promotion/create-promotion?action=Edit&zoneId=${promo.zoneId}&promoId=${promo.id}`,
      );
    }

    if (action === "delete") {
      if (!promo?.id) return;
      setDeletingId(promo.id);
      deletePromo(
        { vendorId, promoId: promo.id },
        {
          onSettled: () => {
            setDeletingId("");
          },
        },
      );
    }
  };

  const routeToCreate = (flow: ActiveFlow) => {
    if (!vendor?.zoneId) {
      toast.error("zoneId not found");
      return;
    }

    if (flow === "Promo")
      router.push(
        `/vendor-management/${vendorId}/promotion/create-promotion?zoneId=${vendor.zoneId}`,
      );

    if (flow === "Coupons") router.push(`#`);
  };

  return (
    <div className="space-y-4 md:space-y-6 pb-10">
      {/* Top bar */}
      <div className="flex items-center justify-between ">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="h-auto gap-1 rounded-md border-gray-200 p-2 text-xs text-neutral-500"
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>
          <h1 className="text-base font-bold">All Promotions</h1>
        </div>

        {/* Desktop screens flow actions */}
        <div className="flex max-md:hidden gap-2">
          <div className="flex w-[296px] border-2 border-gray-100 rounded-[8px]">
            <button
              onClick={() => setActiveFlow("Promo")}
              className={`m-0! ${activeFlow === "Promo" ? " bg-primary/10 hover:bg-primary/10" : "bg-transparent text-black! hover:bg-gray-50"} flex-1 py-2.5 h-auto text-base font-medium text-primary leading-5.5 rounded-sm`}
            >
              Promo
            </button>
            <button
              onClick={() => setActiveFlow("Coupons")}
              className={`${activeFlow === "Coupons" ? " bg-primary/10 hover:bg-primary/10" : "bg-transparent text-black! hover:bg-gray-50"} flex-1 py-2.5 h-auto text-base font-medium text-primary leading-5.5 rounded-sm`}
            >
              Coupons
            </button>
          </div>
          {activeFlow === "Promo" && (
            <Button
              onClick={() => routeToCreate("Promo")}
              className="p-2.5 h-fit text-base font-medium leading-6 rounded-sm bg-primary"
            >
              Create Promo
            </Button>
          )}
          {activeFlow === "Coupons" && (
            <Button
              onClick={() => routeToCreate("Coupons")}
              className="p-2.5 h-fit text-base font-medium leading-6 rounded-sm bg-primary"
            >
              Create Coupon
            </Button>
          )}
        </div>

        {/* Mobile screens flow actions */}
        <DropdownMenu>
          <DropdownMenuTrigger className="md:hidden">
            <Button
              variant="outline"
              className="size-10 hover:bg-gray-100 text-gray-700 rounded-[8px]"
            >
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="md:hidden w-23.5! px-2 min-w-[110px] rounded-[8px]"
          >
            <DropdownMenuItem
              className="text-xs font-medium cursor-pointer text-gray-500"
              onClick={() => setActiveFlow("Promo")}
            >
              Promo
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-xs font-medium cursor-pointer text-gray-500"
              onClick={() => setActiveFlow("Coupons")}
            >
              Coupons
            </DropdownMenuItem>
            {activeFlow === "Promo" && (
              <DropdownMenuItem
                className="text-xs font-medium cursor-pointer  text-gray-500"
                onClick={() => routeToCreate("Promo")}
              >
                Create Promo
              </DropdownMenuItem>
            )}
            {activeFlow === "Coupons" && (
              <DropdownMenuItem
                className="text-xs font-medium cursor-pointer  text-gray-500"
                onClick={() => routeToCreate("Coupons")}
              >
                Create Coupon
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

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
          <VendorPromoTable
            items={items}
            isLoading={isLoading}
            deletingId={deletingId}
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
