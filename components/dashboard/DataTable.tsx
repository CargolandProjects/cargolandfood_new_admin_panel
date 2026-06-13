"use client";

import { useState } from "react";
import {
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Column {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  searchPlaceholder?: string;
  itemsPerPage?: number;
  showCheckbox?: boolean;
  showExport?: boolean;
  onRowClick?: (row: any) => void;
}

export default function DataTable({
  columns,
  data,
  searchPlaceholder = "Search...",
  itemsPerPage = 10,
  showCheckbox = true,
  showExport = true,
  onRowClick,
}: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter data based on search
  const filteredData = data.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-white rounded-[20px] border border-gray-200 overflow-hidden shadow-sm">
      {/* Search and Actions Bar */}
      <div className="p-6 pb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Search Bar */}
          <div className="relative w-full md:max-w-[340px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/60" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-black/20 rounded-full text-[13px] text-black placeholder:text-black/40 focus:outline-none focus:border-black/40 shadow-sm"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-100 rounded-xl text-[13px] font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              <img
                src="/images/icons/SlidersHorizontal.png"
                alt=""
                className="w-4 h-4"
              />
              Filter
            </button>

            <button className="flex items-center gap-2 px-3 py-2 border border-gray-100 rounded-xl text-[13px] font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              <img
                src="/images/icons/SortDescending.png"
                alt=""
                className="w-4 h-4"
              />
              Sort By
            </button>

            {showExport && (
              <button className="flex items-center gap-2 px-3 py-2 border border-gray-100 rounded-xl text-[13px] font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4 text-gray-400" />
                Export
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-4">
        <table className="w-full text-left bg-white">
          <thead>
            <tr className="text-[12px] text-gray-400 uppercase font-semibold border-b border-gray-200">
              {showCheckbox && (
                <th className="px-6 py-4 w-10">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-4 ${
                    column.align === "center"
                      ? "text-center"
                      : column.align === "right"
                      ? "text-right"
                      : ""
                  }`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentData.map((row, index) => (
              <tr
                key={row.id || index}
                onClick={() => onRowClick?.(row)}
                className={`hover:bg-gray-50 transition-colors text-sm bg-white ${
                  onRowClick ? "cursor-pointer" : ""
                }`}
              >
                {showCheckbox && (
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-6 py-4 ${
                      column.align === "center"
                        ? "text-center"
                        : column.align === "right"
                        ? "text-right"
                        : ""
                    }`}
                  >
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-5 flex items-center justify-between border-t border-gray-200">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" /> Prev
        </button>

        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-colors ${
                currentPage === i + 1
                  ? "text-[#F16622] font-semibold"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
