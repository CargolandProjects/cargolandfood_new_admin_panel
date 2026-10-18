"use client";

import React, { useState } from "react";
import { MoreVertical, Search } from "lucide-react";

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
import { formatNumber } from "@/lib/utils";
import type { MenuItem } from "@/lib/services/vendor.service";
import MenuRowSkeleton from "./MenuRowSkeleton";
import Image from "next/image";
import { MenuAction } from "./VendorMenuPageContent";
import MenuDetailsModal from "./MenuDetailsModal";
import TableError from "../VendorTableError";

interface MenuTableProps {
  items: MenuItem[];
  isLoading?: boolean;
  deletingId?: string;
  selectedId?: string | null;
  isSuccess?: boolean;
  isError?: boolean;
  onRetry: () => void;
  setSelectedId: (v: string | null) => void;
  onAction?: (action: MenuAction, id: string) => void;
}

const getMenuCode = (id: string) => `CLF-${id.slice(-4).toUpperCase()}`;

export default function MenuTable({
  items,
  isLoading,
  deletingId,
  selectedId,
  isSuccess,
  isError,
  onRetry,
  onAction,
  setSelectedId,
}: MenuTableProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const allSelected = items.length > 0 && selected.size === items.length;
  const someSelected = selected.size > 0 && !allSelected;

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

  const handleSelect = (id: string) => {
    setSelectedId(id === selectedId ? null : id);
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
            />
          </TableHead>
          <TableHead className="py-3 text-xs font-medium text-gray-500">
            Name
          </TableHead>
          <TableHead className="text-xs font-medium text-gray-500">
            Category
          </TableHead>
          <TableHead className="text-xs font-medium text-gray-500">
            Description
          </TableHead>
          <TableHead className="text-xs font-medium text-gray-500">
            Price
          </TableHead>
          <TableHead className="text-xs font-medium text-gray-500">
            Add-ons
          </TableHead>
          <TableHead className="text-xs font-medium text-gray-500">
            Size
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
          <TableError
            colSpan={8}
            description="Failed to load menu items."
            onRetry={onRetry}
            isRetrying={isLoading}
          />
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
          items.map((item) => {
            const isSelected = selected.has(item.id);
            const addons = item.addons || [];
            const sizes = item.sizes || [];
            return (
              <React.Fragment key={item.id}>
                <TableRow
                  onClick={() => handleSelect(item.id)}
                  data-state={isSelected ? "selected" : undefined}
                  className={`${deletingId === item.id ? "animate-pulse duration-200" : ""} border-b border-gray-50 align-top hover:bg-gray-50/60 cursor-pointer`}
                >
                  <TableCell
                    className="pl-6 pt-5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleOne(item.id)}
                      aria-label={`Select ${item.name}`}
                    />
                  </TableCell>
                  {/* image/name */}
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative size-12">
                        <Image
                          src={item.uploadImageUrl}
                          alt={item.name}
                          className="size-full rounded-lg object-cover"
                          fill
                        />
                      </div>
                      <div className="min-w-0 leading-tight">
                        <p className="truncate text-sm font-semibold text-gray-900">
                          {item.name}
                        </p>
                        <p className="mt-0.5 text-xs text-gray-400">
                          {getMenuCode(item.id)}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  {/* Category badge */}
                  <TableCell className="py-4">
                    <span className="inline-flex items-center px-1 py-0.5 text-xs font-medium text-[#144D68] rounded-[4px] bg-[#DCEFF7]">
                      {item.category?.name ?? "—"}
                    </span>
                  </TableCell>
                  {/* Description */}
                  {/* if ever line-clamp doesn't work, add whitespace-normal it likely inhenrited no-wrap from the parent*/}
                  <TableCell className="max-w-55 py-4">
                    <p className="line-clamp-2 text-xs whitespace-normal truncate font-medium text-gray-500">
                      {item.description || "—"}
                    </p>
                  </TableCell>
                  {/* Price */}
                  <TableCell className="py-4 text-sm font-semibold text-gray-900">
                    ₦{formatNumber(item.price)}
                  </TableCell>
                  {/* Add-ons */}
                  <TableCell className="py-4">
                    {addons.length === 0 && (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                    {addons.length > 0 && (
                      <ul className="space-y-1">
                        {addons.slice(0, 2).map((addon, idx, adns) => {
                          const showExCount =
                            idx === adns.length - 1 && addons.length > 2;
                          return (
                            <li
                              key={addon.id}
                              className="flex items-center gap-0.5"
                            >
                              <p className="text-[10px] font-medium px-1 py-0.5 w-fit rounded-[4px] bg-gray-100 text-gray-600">
                                {addon.name}
                              </p>{" "}
                              {showExCount && (
                                <p className="ml-0.5 text-[10px] font-medium text-gray-600">
                                  +{addons.length - 2}
                                </p>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </TableCell>
                  {/* Sizes */}
                  <TableCell className="py-4">
                    {sizes.length === 0 && (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                    {sizes.length > 0 && (
                      <ul className="space-y-1">
                        {sizes.slice(0, 2).map((size, idx, adns) => {
                          const showSzsCount =
                            idx === adns.length - 1 && sizes.length > 2;
                          return (
                            <li
                              key={size.id}
                              className="flex items-center gap-0.5"
                            >
                              <p className="px-2.5 py-0.5 w-fit text-[10px] font-medium text-rose-600 bg-rose-50 rounded-sm">
                                {size.name}
                              </p>{" "}
                              {showSzsCount && (
                                <p className="ml-0.5 text-[10px] font-medium text-gray-600">
                                  +{sizes.length - 2}
                                </p>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    )}
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
                          onClick={() => onAction?.("view", item.id)}
                        >
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-xs font-medium cursor-pointer"
                          onClick={() => onAction?.("edit", item.id)}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-xs font-medium text-red-600 hover:text-red-600! cursor-pointer"
                          onClick={() => onAction?.("delete", item.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>

                <MenuDetailsModal
                  open={selectedId === item.id}
                  onOpenChange={handleSelect}
                  menu={item}
                />
              </React.Fragment>
            );
          })}
      </TableBody>
    </Table>
  );
}
