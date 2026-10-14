"use client";

import { useState } from "react";
import { MoreVertical } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate3, formatTime2 } from "@/lib/utils";
import Image from "next/image";
import { MenuAction } from "../menu/VendorMenuPageContent";
import MenuRowSkeleton from "../menu/MenuRowSkeleton";
import { Promotion, PromotionStatus } from "@/lib/services/promo.service";
import menuImg from "@/assets/images/menuImg.jpg";
import { Switch } from "@/components/ui/switch";
import { useTogglePromoStatus } from "@/lib/hooks/mutations/useMutatePromo";

interface VendorPromoTableProps {
  items: Promotion[];
  isLoading?: boolean;
  deletingId?: string;
  isSuccess?: boolean;
  isError?: boolean;
  onRetry: () => void;
  onAction?: (action: MenuAction, promo: Promotion) => void;
}

const statusStyles = {
  ACTIVE: {
    indicator: "bg-emerald-500 ",
    styles: "bg-emerald-50 text-emerald-500",
  },
  INACTIVE: {
    indicator: "bg-gray-500",
    styles: "bg-gray-100 text-gray-500",
  },
};

export default function VendorPromoTable({
  items,
  isLoading,
  deletingId,
  isSuccess,
  isError,
  onRetry,
  onAction,
}: VendorPromoTableProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [actionId, setActionId] = useState<string | null>(null);

  const { mutate: toggleStatus, isPending: isToggling } =
    useTogglePromoStatus();

  const allSelected = items.length > 0 && selected.size === items.length;
  const someSelected = selected.size > 0 && !allSelected;
  const isActionId = actionId || deletingId || "";

  const toggleAll = () => {
    setSelected(allSelected ? new Set() : new Set(items.map((i) => i.id)));
  };

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleToggleStatus = (
    vendorId: string,
    promoId: string,
    currentStatus: PromotionStatus,
  ) => {
    setActionId(promoId);
    toggleStatus(
      { vendorId, promoId, currentStatus },
      {
        onSettled: () => setActionId(null),
      },
    );
  };

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-b border-gray-100 bg-gray-100">
          <TableHead className="w-12 pl-6">
            <Checkbox
              checked={allSelected}
              indeterminate={someSelected}
              onCheckedChange={toggleAll}
              aria-label="Select all menu items"
              className="border-neutral-400!"
            />
          </TableHead>
          <TableHead className="py-3 text-xs font-medium text-gray-500">
            Name
          </TableHead>
          <TableHead className="text-xs font-medium text-gray-500">
            Category
          </TableHead>
          <TableHead className="text-xs font-medium text-gray-500">
            Time Duration
          </TableHead>
          <TableHead className="text-xs font-medium text-gray-500">
            Date Duration
          </TableHead>
          <TableHead className="text-xs font-medium text-gray-500">
            Discount Value
          </TableHead>
          <TableHead className="text-xs font-medium text-gray-500">
            Status
          </TableHead>
          <TableHead className="w-12 pr-6 text-right text-xs font-medium text-gray-500">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {isLoading &&
          Array.from({ length: 6 }).map((_, i) => (
            <MenuRowSkeleton key={`skeleton-${i}`} />
          ))}

        {isError && (
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={8} className="h-40 text-center">
              <p className="text-sm text-red-500">
                Failed to load menu items.{" "}
                <button
                  type="button"
                  onClick={onRetry}
                  className="font-medium underline underline-offset-2"
                >
                  Retry
                </button>
              </p>
            </TableCell>
          </TableRow>
        )}

        {isSuccess && items.length === 0 && (
          <TableRow className="hover:bg-transparent">
            <TableCell
              colSpan={8}
              className="h-40 text-center text-sm text-gray-500"
            >
              No menu items yet.
            </TableCell>
          </TableRow>
        )}

        {!isLoading &&
          isSuccess &&
          items.map((promo) => {
            const isSelected = selected.has(promo.id);
            const isActive = promo.status === "ACTIVE";
            const isActionPending = isActionId === promo.id;
            return (
              <TableRow
                key={promo.id}
                data-state={isSelected ? "selected" : undefined}
                className={`${isActionId === promo.id ? "animate-pulse duration-200" : ""} border-b border-gray-50 align-top hover:bg-gray-50/60`}
              >
                <TableCell
                  className="pl-6 pt-5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleOne(promo.id)}
                    aria-label={`Select ${promo.campaignName}`}
                    className="border-neutral-400!"
                  />
                </TableCell>
                {/* image/name */}
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative size-12">
                      <Image
                        src={promo?.campaignImgUrl ?? menuImg}
                        alt={promo.campaignName}
                        className="size-full rounded-lg object-cover"
                        fill
                      />
                    </div>
                    <div className="min-w-0 leading-tight">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {promo.campaignName}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-400">
                        {promo.id.slice(-6).toUpperCase()}
                      </p>
                    </div>
                  </div>
                </TableCell>
                {/* Category badge */}
                <TableCell className="py-4">
                  <span className="inline-flex items-center px-1 py-0.5 text-xs font-medium text-[#144D68] rounded-[4px] bg-[#DCEFF7]">
                    {/* {item.category?.name ?? "—"} */}
                  </span>
                </TableCell>
                {/* Time Duration */}
                <TableCell className="max-w-55 py-4">
                  <p className="line-clamp-2 text-sm whitespace-normal truncate font-medium text-gray-500">
                    {formatTime2(promo.startTime ?? "")} -{" "}
                    {formatTime2(promo.endTime ?? "")}
                  </p>
                </TableCell>
                {/* Date duration */}
                <TableCell className="py-4">
                  <p className="line-clamp-2 text-sm whitespace-normal truncate font-medium text-gray-500">
                    {formatDate3(promo.startDate)} -{" "}
                    {formatDate3(promo.endDate)}
                  </p>
                </TableCell>
                {/* Discount Valye */}
                <TableCell className="py-4">{promo.percentageValue}%</TableCell>
                {/* Status */}
                <TableCell className="py-4">
                  {/* <div
                    className={`${statusStyles[promo.status].styles} py-0.5 px-1 flex items-center gap-1 rounded-[4px]`}
                  >
                    <div
                      className={` ${statusStyles[promo.status].indicator} size-2 rounded-full`}
                    />
                    <p className="text-xs font-medium capitalize">
                      {promo.status.toLowerCase()}
                    </p>
                  </div> */}

                  <Switch
                    checked={isActive}
                    disabled={isActionPending && isToggling}
                    onCheckedChange={() =>
                      handleToggleStatus(promo.vendorId, promo.id, promo.status)
                    }
                    className="data-checked:bg-green-400"
                    aria-label={`Toggle promo ${promo.campaignName}`}
                  />
                </TableCell>
                {/* Actions */}
                <TableCell
                  className="pr-6 pt-5 text-right"
                  onClick={(e) => e.stopPropagation()}
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                      >
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-23.5!">
                      <DropdownMenuItem
                        className="text-xs font-medium cursor-pointer"
                        onClick={() => onAction?.("view", promo)}
                      >
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-xs font-medium cursor-pointer"
                        onClick={() => onAction?.("edit", promo)}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-xs font-medium text-red-600 hover:text-red-600! cursor-pointer"
                        onClick={() => onAction?.("delete", promo)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  );
}
