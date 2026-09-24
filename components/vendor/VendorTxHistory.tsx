"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import TransactionRowSkeleton from "./TransactionRowSkeleton";

export type TransactionType = "Withdraw" | "Payout" | "Refund" | "Deposit";
export type TransactionStatus = "Successful" | "Pending" | "Failed";
export type TransactionMethod = "Mobile money" | "Bank transfer" | "Cash";

export interface VendorTransaction {
  id: string;
  details: string;
  type: TransactionType;
  amount: number;
  dateTime: string;
  method: TransactionMethod;
  status: TransactionStatus;
}

interface TransactionHistoryProps {
  transactions: VendorTransaction[];
  isLoading?: boolean;
}

const typeStyles: Record<TransactionType, string> = {
  Withdraw: "bg-emerald-50 text-emerald-700",
  Payout: "bg-sky-50 text-sky-700",
  Refund: "bg-orange-50 text-orange-700",
  Deposit: "bg-violet-50 text-violet-700",
};

const statusStyles: Record<TransactionStatus, { pill: string; dot: string }> = {
  Successful: { pill: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
  Pending: { pill: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
  Failed: { pill: "bg-red-50 text-red-700", dot: "bg-red-500" },
};

const formatNaira = (v: number) => `₦${v.toLocaleString()}`;

const VendorTxHistory = ({
  transactions,
  isLoading,
}: TransactionHistoryProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const allSelected =
    transactions.length > 0 && selected.size === transactions.length;
  const someSelected = selected.size > 0 && !allSelected;

  const toggleAll = () =>
    setSelected(
      allSelected ? new Set() : new Set(transactions.map((t) => t.id)),
    );

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <section className="">
      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow className="border-b border-gray-100 bg-gray-100">
            <TableHead className="w-12 pl-6">
              <Checkbox
                checked={allSelected}
                indeterminate={someSelected}
                onCheckedChange={toggleAll}
                aria-label="Select all"
              />
            </TableHead>
            <TableHead className="py-3 text-xs font-medium text-gray-500">
              ID
            </TableHead>
            <TableHead className="text-xs font-medium text-gray-500">
              Details
            </TableHead>
            <TableHead className="text-xs font-medium text-gray-500">
              Type
            </TableHead>
            <TableHead className="text-xs font-medium text-gray-500">
              Amount
            </TableHead>
            <TableHead className="text-xs font-medium text-gray-500">
              Date/Time
            </TableHead>
            <TableHead className="text-xs font-medium text-gray-500">
              Method
            </TableHead>
            <TableHead className="pr-6 text-xs font-medium text-gray-500">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading &&
            Array.from({ length: 6 }).map((_, i) => (
              <TransactionRowSkeleton key={`sk-${i}`} />
            ))}

          {!isLoading && transactions.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={8}
                className="h-40 text-center text-sm text-gray-500"
              >
                No transactions yet.
              </TableCell>
            </TableRow>
          )}

          {!isLoading &&
            transactions.map((txn) => (
              <TableRow
                key={txn.id}
                data-state={selected.has(txn.id) ? "selected" : undefined}
                className="border-b border-gray-50 hover:bg-gray-50/60"
              >
                <TableCell className="pl-6">
                  <Checkbox
                    checked={selected.has(txn.id)}
                    onCheckedChange={() => toggleOne(txn.id)}
                    aria-label={`Select ${txn.id}`}
                  />
                </TableCell>
                <TableCell className="text-sm font-medium text-gray-900">
                  {txn.id}
                </TableCell>
                <TableCell className="text-sm text-gray-700">
                  {txn.details}
                </TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
                      typeStyles[txn.type],
                    )}
                  >
                    {txn.type}
                  </span>
                </TableCell>
                <TableCell className="text-sm font-semibold text-gray-900">
                  {formatNaira(txn.amount)}
                </TableCell>
                <TableCell className="whitespace-pre-line text-sm text-gray-700">
                  {txn.dateTime}
                </TableCell>
                <TableCell className="text-sm text-gray-700">
                  {txn.method}
                </TableCell>
                <TableCell className="pr-6">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                      statusStyles[txn.status].pill,
                    )}
                  >
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        statusStyles[txn.status].dot,
                      )}
                    />
                    {txn.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </section>
  );
};

export default VendorTxHistory;
