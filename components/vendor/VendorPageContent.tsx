"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Copy,
  Download,
  Search,
  SlidersHorizontal,
  SortDesc,
  Star,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import StatCard from "@/components/dashboard/StatCard";
import TransactionHistory, {
  type VendorTransaction,
} from "@/components/vendor/VendorTxHistory";
import { useVendor } from "@/lib/hooks/queries/useVendor";
import { cn, getInitials } from "@/lib/utils";
import Pagination from "./Pagination";

export default function VendorDetailPage({ vendorId }: { vendorId: string }) {
  const router = useRouter();
  const { data: vendor, isLoading, isFetching } = useVendor(vendorId);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const transactions: VendorTransaction[] = []; // wire to real API when available
  const totalTxnPages = 1;

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
    // toast.success("Copied") — replace with your toast util
  };

  const ownerName = [vendor?.firstName, vendor?.lastName]
    .filter(Boolean)
    .join(" ");

  const totalPages = 5;

  console.log("VENDOR:", vendor);

  return (
    <div>
      {/* ── Top bar  */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="p-2 gap-1 border-gray-200 text-neutral-500 text-xs rounded-md"
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="p-2.5 h-auto text-base font-medium leading-5 rounded-md border-2 border-gray-100"
          >
            <Link href={`/vendor-management/${vendorId}/menu`}>View Menu</Link>
          </Button>
          <Button
            size="sm"
            className="p-2.5 h-auto text-base font-medium leading-5 rounded-md bg-primary"
          >
            <Link href={`/vendor-management/${vendorId}/menu/new`}>
              Create Menu
            </Link>
          </Button>
        </div>
      </div>

      {/* Vendor info card */}
      <div className="p-4 mt-6 rounded-[12px] border-8 border-gray-100 bg-white">
        <div className="px-2.5 py-3 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            {isLoading ? (
              <Skeleton className="h-16 w-16 rounded-full" />
            ) : (
              <Avatar className="size-15 shrink-0">
                <AvatarImage
                  src={vendor?.profileImg}
                  alt={vendor?.businessName}
                />
                <AvatarFallback className="bg-orange-100 text-orange-600">
                  {getInitials(vendor?.businessName ?? "")}
                </AvatarFallback>
              </Avatar>
            )}

            <div className="min-w-0 space-y-1">
              {isLoading ? (
                <>
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-3.5 w-64" />
                  <Skeleton className="h-3.5 w-72" />
                </>
              ) : (
                <>
                  <div className="flex flex-wrap items-center gap-4">
                    <h1 className="text-base font-bold">
                      {vendor?.businessName}
                    </h1>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-[4px] px-1 py-0.5 text-[10px] font-medium",
                        vendor?.isActive
                          ? "bg-[#16A34A]/10 text-[#16A34A]"
                          : "bg-gray-100 text-gray-600",
                      )}
                    >
                      <span
                        className={cn(
                          "size-2 rounded-full",
                          vendor?.isActive ? "bg-emerald-500" : "bg-gray-400",
                        )}
                      />
                      {vendor?.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                    <span>{ownerName}</span>
                    <span className="size-1.5 rounded-full bg-gray-300" />
                    <span>{vendor?.businessCategory}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                    <span>{vendor?.businessEmail}</span>
                    <span className="size-1.5 rounded-full bg-gray-300" />
                    <span>{vendor?.mobileNumber}</span>
                    <span className="size-1.5 rounded-full bg-gray-300" />
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {(0).toFixed(1)}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          <Button
            variant="outline"
            className="px-6 py-2 h-auto text-[10px] font-medium leading-3.5 rounded-md border-primary text-primary hover:text-primary bg-[#FDE7DA] hover:bg-[#FDE7DA]/80"
          >
            Payout
          </Button>
        </div>
      </div>

      {/* ── Stats grid ──────────────────────────────────── */}
      <div className="mt-6 grid grid-cols-1 gap-x-3 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Orders"
          loading={isLoading}
          value={String(vendor?.totalOrder ?? 0)}
          subtext="Order"
          trend="+2%"
          color="text-green-500"
          footerLabel="Total Size"
        />
        <StatCard
          title="Total Revenue"
          loading={isLoading}
          value="₦0"
          subtext="Revenue"
          trend="+2%"
          color="text-green-500"
          footerLabel="Joined this month"
        />
        <StatCard
          title="Successful Orders"
          loading={isLoading}
          value="10"
          subtext="Successful"
          trend="-4"
          color="text-red-500"
          footerLabel="Faulty vehicles"
        />
        <StatCard
          title="Pending Payout"
          loading={isLoading}
          value="₦0"
          subtext="Payout"
          trend="+4"
          color="text-green-500"
          footerLabel="Awaiting"
        />
      </div>

      {/* ── Second row: Total Payouts + Bank Details ──── */}
      <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
        <StatCard
          title="Total Payouts"
          loading={isLoading}
          value="₦0"
          subtext="Order"
          trend="+2%"
          color="text-green-500"
          footerLabel="Total Size"
        />

        <div className="p-4 rounded-[12px] border-2 border-gray-100 bg-white">
          <div className="flex items-start justify-between">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500">
                Bank Details
              </h3>

              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-3.5 w-40" />
                  <Skeleton className="h-3.5 w-44" />
                  <Skeleton className="h-3.5 w-48" />
                </div>
              ) : (
                <div className="space-y-2 text-sm">
                  <p className="text-gray-800">
                    <span className="text-xs font-medium text-gray-500">
                      Bank Name: -
                    </span>{" "}
                    <span className="text-xs font-bold">
                      {vendor?.bankName || "—"}
                    </span>
                  </p>
                  <p className="text-gray-800">
                    <span className="text-xs font-medium text-gray-500">
                      Account Number: -
                    </span>{" "}
                    <span className="text-xs font-bold">
                      {vendor?.accountNumber || "—"}
                    </span>
                  </p>
                  <p className="text-gray-800">
                    <span className="text-xs font-medium text-gray-500">
                      Account Name: -
                    </span>{" "}
                    <span className="text-xs font-bold">
                      {vendor?.accountName || "—"}
                    </span>
                  </p>
                </div>
              )}
            </div>

            <Button
              variant="outline"
              onClick={() => handleCopy(vendor?.accountNumber ?? "")}
              disabled={!vendor?.accountNumber}
              className="px-2 py-1 h-auto gap-1 rounded-[4px] border-gray-200 text-primary hover:bg-primary/6 hover:text-primary"
            >
              <Copy className="size-3.5" />
              Copy
            </Button>
          </div>
        </div>
      </div>

      <h2 className="my-5 pl-4 text-base font-bold">Transaction History</h2>

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
        {/* Transaction history */}
        <TransactionHistory
          transactions={transactions}
          isLoading={isFetching}
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
  );
}
