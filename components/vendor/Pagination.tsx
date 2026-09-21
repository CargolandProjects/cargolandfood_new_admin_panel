"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface VendorsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const getPageNumbers = (current: number, total: number): (number | "...")[] => {
  // Always show first two and last two pages, plus the current page.
  // Anything in the gaps collapses into an ellipsis.
  const visible = new Set<number>([1, 2, total - 1, total, current]);
  const sorted = [...visible]
    .filter((n) => n >= 1 && n <= total)
    .sort((a, b) => a - b);

  const result: (number | "...")[] = [];
  let previous = 0;
  for (const n of sorted) {
    if (n - previous > 1) result.push("...");
    result.push(n);
    previous = n;
  }
  return result;
};

export default function VendorsPagination({
  currentPage,
  totalPages,
  onPageChange,
}: VendorsPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ArrowLeft className="h-4 w-4" />
        Prev
      </button>

      <div className="flex items-center gap-1">
        {pages.map((page, index) =>
          page === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="px-2 text-sm text-gray-400 select-none"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              aria-current={page === currentPage ? "page" : undefined}
              className={cn(
                "h-8 min-w-8 rounded-md px-2 text-sm font-medium transition-colors",
                page === currentPage
                  ? "text-[#F16622]"
                  : "text-gray-600 hover:bg-gray-100",
              )}
            >
              {page}
            </button>
          ),
        )}
      </div>

      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}
