"use client";

import { useState } from "react";
import { MoreVertical, Star } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { cn, getInitials } from "@/lib/utils";
import type { VendorListVendor } from "@/lib/services/vendor.service";
import TableError from "./VendorTableError";
import VendorRowSkeleton from "./VendorRowSkeleton";
import { VendorAction } from "@/app/(dashboard)/vendor-management/page";

interface VendorsTableProps {
  vendors: VendorListVendor[];
  isLoading?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  onRetry: () => void;
  onAction?: (action: VendorAction, vendorId: string) => void;
  onRowClick?: (vendorId: string) => void;
}

const formatNaira = (value: number) => `₦${value.toLocaleString()}`;

export default function VendorsTable({
  vendors,
  isLoading,
  isSuccess,
  isError,
  onRetry,
  onAction,
  onRowClick,
}: VendorsTableProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const allSelected = vendors.length > 0 && selected.size === vendors.length;
  const someSelected = selected.size > 0 && !allSelected;

  const toggleAll = () => {
    setSelected(allSelected ? new Set() : new Set(vendors.map((v) => v.id)));
  };

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const StatusBadge = ({ active }: { active: boolean }) => {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
          active
            ? "bg-emerald-50 text-emerald-700"
            : "bg-gray-100 text-gray-600",
        )}
      >
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            active ? "bg-emerald-500" : "bg-gray-400",
          )}
        />
        {active ? "Active" : "Inactive"}
      </span>
    );
  };

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-b border-gray-100 bg-gray-100">
          <TableHead className="w-12 pl-6">
            <Checkbox
              checked={
                allSelected ? true : someSelected ? "indeterminate" : false
              }
              onCheckedChange={toggleAll}
              aria-label="Select all vendors"
            />
          </TableHead>
          <TableHead className="py-3 text-xs font-medium text-gray-500">
            Vendors
          </TableHead>
          <TableHead className="text-xs font-medium text-gray-500">
            Mobile Number
          </TableHead>
          <TableHead className="text-xs font-medium text-gray-500">
            Category
          </TableHead>
          <TableHead className="text-xs font-medium text-gray-500">
            Revenue
          </TableHead>
          <TableHead className="text-xs font-medium text-gray-500">
            Pending Payout
          </TableHead>
          <TableHead className="text-xs font-medium text-gray-500">
            Rating
          </TableHead>
          <TableHead className="text-xs font-medium text-gray-500">
            Status
          </TableHead>
          <TableHead className="w-12 pr-6 text-right text-xs font-medium text-gray-500">
            Action
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {isLoading &&
          Array.from({ length: 6 }).map((_, i) => (
            <VendorRowSkeleton key={`skeleton-${i}`} />
          ))}

        {isError && (
          <TableError colSpan={10} onRetry={onRetry} isRetrying={isLoading} />
        )}

        {isSuccess && vendors.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={9}
              className="h-40 text-center text-sm text-gray-500"
            >
              No vendors found.
            </TableCell>
          </TableRow>
        )}

        {!isLoading &&
          isSuccess &&
          vendors.length > 0 &&
          vendors.map((vendor) => {
            const fullName = [vendor.firstName, vendor.lastName]
              .filter(Boolean)
              .join(" ");
            const isSelected = selected.has(vendor.id);

            return (
              <TableRow
                key={vendor.id}
                data-state={isSelected ? "selected" : undefined}
                onClick={() => onRowClick?.(vendor.id)}
                className="cursor-pointer border-b border-gray-50 hover:bg-gray-50/60"
              >
                <TableCell
                  className="pl-6"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleOne(vendor.id)}
                    aria-label={`Select ${vendor.businessName}`}
                  />
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarImage
                        src={vendor.profileImg}
                        alt={vendor.businessName}
                      />
                      <AvatarFallback className="bg-orange-100 text-orange-600">
                        {getInitials(vendor.businessName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 leading-tight">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {vendor.businessName}
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {vendor.businessEmail}
                      </p>
                      <p className="truncate text-xs text-gray-400">
                        {fullName}
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="text-sm text-gray-700">
                  {vendor.mobileNumber}
                </TableCell>
                <TableCell className="text-sm text-gray-700">
                  {vendor.businessCategory}
                </TableCell>
                <TableCell className="text-sm font-semibold text-gray-900">
                  {formatNaira(0)}
                </TableCell>
                <TableCell className="text-sm font-semibold text-gray-900">
                  {formatNaira(0)}
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-1 text-sm text-gray-700">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    {(0).toFixed(1)}
                  </span>
                </TableCell>
                <TableCell>
                  <StatusBadge active={vendor.isActive} />
                </TableCell>
                <TableCell
                  className="pr-6 text-right"
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
                        onClick={() => onAction?.("view", vendor.id)}
                      >
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-xs font-medium cursor-pointer"
                        onClick={() => onAction?.("createMenu", vendor.id)}
                      >
                        Create Menu
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-xs font-medium text-red-600 hover:text-red-600! cursor-pointer"
                        onClick={() => onAction?.("delete", vendor.id)}
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
