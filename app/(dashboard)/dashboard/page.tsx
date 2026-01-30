"use client";

import {
  Plus,
  Search,
  Filter,
  ArrowUpRight,
  MoreVertical,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";

export default function DashboardPage() {
  return (
    <div className="space-y-6 font-satoshi p-4 bg-white min-h-screen">
      {/* 1. TOP METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Vendors"
          value="212"
          subtext="Restaurants"
          trend="+2%"
          color="text-green-500"
          footerLabel="Total Size"
        />
        <StatCard
          title="Total Riders"
          value="212"
          subtext="Riders"
          trend="+2%"
          color="text-green-500"
          footerLabel="Total Size"
        />
        <StatCard
          title="Pending Approvals"
          value="5"
          subtext="Requests"
          trend="+2"
          color="text-green-500"
          footerLabel="Total Size"
        />
        <StatCard
          title="Total Income"
          value="N5.2M"
          subtext="Total balance"
          trend="+2%"
          color="text-green-500"
          footerLabel="Total Size"
        />
      </div>

      {/* 2. MAIN CONTENT GRID (3 Columns: [Left + Center Combined] and [Right]) */}
      <div className="grid grid-cols-12 gap-6">
        {/* LEFT + CENTER WRAPPER (9 out of 12 columns) */}
        <div className="col-span-12 lg:col-span-9 space-y-6">
          {/* Row 1: Quick Links + Metrics */}
          <div className="grid grid-cols-12 gap-6 items-stretch">
            {/* Quick Links & Riders Activity */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <h3 className="text-[#000000] font-medium">Quick Links</h3>
                  <button className="flex items-center justify-center w-6 h-6 border border-gray-100 rounded-lg bg-white shadow-sm">
                    <Plus className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {["View Riders", "Create New Category", "Add New Vendor"].map(
                    (link) => (
                      <button
                        key={link}
                        className="px-4 py-2.5 text-[12px] font-medium bg-white border border-gray-100 rounded-[12px] text-[#4D4D4D] shadow-sm"
                      >
                        {link}
                      </button>
                    ),
                  )}
                </div>
              </div>
              <RidersActivityCard onTime={70} late={24} absent={6} />
            </div>

            {/* Key Metrics Chart */}
            <div className="col-span-12 lg:col-span-8">
              <KeyMetrics />
            </div>
          </div>

          {/* Pending Approvals Table */}
          <div className="bg-white rounded-[24px] border border-gray-100 overflow-hidden shadow-sm">
            {/* Header Row: Title & View All */}
            <div className="p-6 pb-4 flex justify-between items-center">
              <h3 className="font-bold text-[#00302E] text-[18px]">
                Pending Approvals{" "}
                <span className="text-gray-400 font-normal ml-1">(12)</span>
              </h3>
              <button className="text-[#3B82F6] text-sm font-medium hover:underline">
                View All
              </button>
            </div>

            {/* Toolbar Row: Search, Filter, Sort */}
            <div className="px-6 pb-6 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  placeholder="Search"
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl 
             text-sm text-black placeholder-black outline-none 
             focus:ring-1 focus:ring-blue-100"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-100 rounded-xl text-sm text-[#4D4D4D] hover:bg-gray-50">
                  <Filter className="w-4 h-4" /> Filter
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-100 rounded-xl text-sm text-[#4D4D4D] hover:bg-gray-50">
                  <div className="flex flex-col gap-0.5">
                    <div className="w-3 h-0.5 bg-gray-400" />
                    <div className="w-3 h-0.5 bg-gray-400" />
                  </div>
                  Sort By
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500 font-medium">
                  <tr>
                    <th className="px-6 py-4 w-10">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Employee</th>
                    <th className="px-6 py-4">Details</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  <TableRow
                    type="New Rider"
                    name="Joseph Ajayi"
                    detail="3 days (Nov 8-10)"
                    date="Nov 1, 2025"
                    status="Approved"
                  />
                  <TableRow
                    type="New Rider"
                    name="Jane Sandra"
                    detail="3 days (Nov 8-10)"
                    date="Nov 1, 2025"
                    status="Pending"
                  />
                  <TableRow
                    type="Rider Payment"
                    name="Bill Robert"
                    detail="N200 transport"
                    date="Nov 2, 2025"
                    status="Approved"
                  />
                  <TableRow
                    type="Rider Payment"
                    name="Bill Robert"
                    detail="N200 transport"
                    date="Nov 2, 2025"
                    status="Rejected"
                  />
                  <TableRow
                    type="New Rider"
                    name="Johan Liebert"
                    detail="N200 transport"
                    date="Nov 3, 2025"
                    status="Rejected"
                  />
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 3. RIGHT COLUMN (Schedule - Spans full height of the wrapper) */}
        <div className="col-span-12 lg:col-span-3 h-full">
          <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-[#00302E]">
                Schedule <span className="text-gray-400 font-normal">(12)</span>
              </h3>
              <button className="flex items-center gap-1 text-[10px] border px-2 py-1 rounded-md text-gray-500">
                <Calendar className="w-3 h-3" /> View Calendar
              </button>
            </div>

            <div className="flex bg-gray-50 p-1 rounded-xl gap-1 mb-6">
              {["All", "Meetings", "Promotions"].map((tab, i) => (
                <button
                  key={tab}
                  className={`flex-1 py-2 text-[11px] rounded-lg ${
                    i === 0 ? "bg-white shadow-sm font-bold" : "text-gray-400"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto">
              <ScheduleCard
                title="Setup Banner for Rodo's Kitchen"
                time="01:30 pm - 02:00 pm"
                btnText="Create Banner"
              />
              <ScheduleCard
                title="Menu Clarification - Beema's Bites"
                time="01:30 pm - 02:00 pm"
                isMeet
              />
              <ScheduleCard
                title="Assign 40% Discount Promo"
                time="01:30 pm - 02:00 pm"
                btnText="Promote"
              />
              <ScheduleCard
                title="Interview Candidate"
                time="01:30 pm - 02:00 pm"
                isMeet
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type ScheduleCardProps = {
  title: string;
  time: string;
  btnText?: string;
  isMeet?: boolean;
};

function ScheduleCard({ title, time, btnText, isMeet }: ScheduleCardProps) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 space-y-3">
      <h4 className="text-[13px] font-bold text-[#00302E]">{title}</h4>

      <p className="text-[10px] text-gray-400 font-medium">
        10 Nov, 2025 • {time}
      </p>

      {btnText && (
        <button className="w-full py-2 bg-[#F16622] text-white text-[11px] font-bold rounded-xl">
          {btnText}
        </button>
      )}

      {isMeet && (
        <div className="flex items-center justify-between border-t pt-3 mt-3">
          <div className="flex items-center gap-1 text-[10px] text-blue-600 font-bold">
            <div className="w-4 h-4 bg-blue-100 rounded flex items-center justify-center">
              G
            </div>
            Google Meet
          </div>

          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full border-2 border-white bg-gray-200"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// --- RIDERS ACTIVITY COMPONENT WITH VISIBLE GAPS ---
function RidersActivityCard({ onTime = 70, late = 20, absent = 10 }) {
  const totalLength = 125.6; // Full semicircle arc length
  const gap = 3; // Gap size between segments

  // Segment lengths (gap subtracted)
  const onTimeL = (onTime / 100) * totalLength - gap;
  const lateL = (late / 100) * totalLength - gap;
  const absentL = (absent / 100) * totalLength - gap;

  // Total Attendance (On time + Late)
  const totalAttendance = onTime + late;

  return (
    <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className=" font-medium text-black">Riders activity</h3>

        <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-100 rounded-[12px] text-[12px] text-[#4D4D4D] shadow-sm font-medium">
          Today
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Chart */}
      <div className="relative flex flex-col items-center justify-center pt-2">
        <div className="relative w-48 h-24 overflow-hidden">
          <svg viewBox="0 0 100 50" className="w-full h-full">
            {/* ON TIME */}
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke="#F16622"
              strokeWidth="10"
              strokeLinecap="butt"
              strokeDasharray={`${onTimeL} ${totalLength}`}
              strokeDashoffset="0"
              className="transition-all duration-1000"
            />

            {/* LATE */}
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke="#FBCCB2"
              strokeWidth="10"
              strokeLinecap="butt"
              strokeDasharray={`${lateL} ${totalLength}`}
              strokeDashoffset={-((onTime / 100) * totalLength)}
              className="transition-all duration-1000"
            />

            {/* ABSENT */}
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke="#FEEFE6"
              strokeWidth="10"
              strokeLinecap="butt"
              strokeDasharray={`${absentL} ${totalLength}`}
              strokeDashoffset={-(((onTime + late) / 100) * totalLength)}
              className="transition-all duration-1000"
            />
          </svg>
        </div>

        {/* Center Text */}
        <div className="absolute top-[65%] flex flex-col items-center">
          <span className="text-[28px] font-black text-[#1A1A1A] leading-none">
            {totalAttendance}%
          </span>
          <span className="text-[12px] text-[#6E6E6E] font-medium mt-1">
            Total Attendance
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 mt-8">
        <LegendItem color="bg-[#F16622]" label="On time" />
        <LegendItem color="bg-[#FBCCB2]" label="Late" />
        <LegendItem color="bg-[#FEEFE6]" label="Absent" />
      </div>
    </div>
  );
}

type LegendItemProps = {
  color: string;
  label: string;
};

function LegendItem({ color, label }: LegendItemProps) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
      <span className="text-[12px] text-[#6E6E6E] font-medium">{label}</span>
    </div>
  );
}

type TableRowProps = {
  type: string;
  name: string;
  detail: string;
  date: string;
  status: Status;
};
type Status = "Approved" | "Pending" | "Rejected";

const statusStyles: Record<Status, string> = {
  Approved: "bg-green-50 text-green-600 border-green-100",
  Pending: "bg-orange-50 text-orange-600 border-orange-100",
  Rejected: "bg-red-50 text-red-600 border-red-100",
};

const dotColors: Record<Status, string> = {
  Approved: "bg-green-600",
  Pending: "bg-orange-600",
  Rejected: "bg-red-600",
};

function TableRow({ type, name, detail, date, status }: TableRowProps) {
  const statusStyles = {
    Approved: "bg-green-50 text-green-600 border-green-100",
    Pending: "bg-orange-50 text-orange-600 border-orange-100",
    Rejected: "bg-red-50 text-red-600 border-red-100",
  };

  const dotColors = {
    Approved: "bg-green-600",
    Pending: "bg-orange-600",
    Rejected: "bg-red-600",
  };

  return (
    <tr className="hover:bg-gray-50/50 transition-colors">
      <td className="px-6 py-4">
        <input
          type="checkbox"
          className="rounded border-gray-300 text-blue-600"
        />
      </td>
      <td className="px-6 py-4 text-[#4D4D4D]">{type}</td>
      <td className="px-6 py-4 font-medium text-[#1A1A1A]">{name}</td>
      <td className="px-6 py-4 text-[#6E6E6E]">{detail}</td>
      <td className="px-6 py-4 text-[#6E6E6E]">{date}</td>
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium border ${statusStyles[status]}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${dotColors[status]}`} />
          {status}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <button className="p-1 hover:bg-gray-100 rounded-lg text-gray-400">
          <MoreVertical className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
}

function KeyMetrics() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  const data = [
    { income: 5800, paid: 1100 },
    { income: 3300, paid: 1100 },
    { income: 3900, paid: 1500 },
    { income: 4200, paid: 1200 },
    { income: 2300, paid: 600 },
    { income: 3100, paid: 1100 },
  ];

  const MAX_VALUE = 5000;
  const getHeight = (value: number) => `${(value / MAX_VALUE) * 100}%`;

  return (
    <div className="col-span-12 lg:col-span-6 bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden min-h-[450px] h-full flex flex-col">
      {/* Header */}
      <div className="p-6 pb-0">
        <h3 className="text-[18px] font-bold text-[#1A1A1A] mb-3">
          Key Metrics
        </h3>
        <div className="flex items-center gap-3 mb-4">
          <button className="p-1.5 rounded-full border border-gray-100 hover:bg-gray-50 transition-colors">
            <ChevronLeft className="w-4 h-4 text-gray-400" />
          </button>
          <span className="text-[14px] font-medium text-[#4D4D4D]">
            Jan, 2025 - Dec, 2025
          </span>
          <button className="p-1.5 rounded-full border border-gray-100 hover:bg-gray-50 transition-colors">
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      <div className="border-b border-gray-100 w-full" />

      {/* Content Area */}
      <div className="p-6 pt-5 flex-1 flex flex-col">
        {/* Tabs */}
        <div className="flex gap-8 border-b border-gray-100 mb-6 text-[14px]">
          <span className="pb-3 border-b-2 border-[#3B82F6] text-[#3B82F6] font-bold cursor-pointer">
            Total Restaurant Sales
          </span>
          <span className="pb-3 text-[#6E6E6E] font-medium cursor-pointer">
            Vendors Activity
          </span>
          <span className="pb-3 text-[#6E6E6E] font-medium cursor-pointer">
            Riders Performance
          </span>
        </div>

        {/* Legend */}
        <div className="flex gap-6 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#F16622]" />
            <span className="text-[12px] text-[#6E6E6E] font-medium">
              Total Income
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FFD5C2]" />
            <span className="text-[12px] text-[#6E6E6E] font-medium">
              Amount Paid
            </span>
          </div>
        </div>

        {/* Chart Container */}
        <div className="relative flex-1 w-full flex items-end pb-12">
          {/* Y-axis & Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between text-[14px] text-gray-400 font-medium pointer-events-none pb-12">
            {[5000, 4000, 3000, 2000, 1000, 0].map((val) => (
              <div key={val} className="flex items-center gap-4 w-full h-0">
                <span className="w-12 text-right">${val}</span>
                <div className="flex-1 border-t border-gray-100/50" />
              </div>
            ))}
          </div>

          {/* Bars Section */}
          <div className="flex-1 flex items-end justify-between ml-16 h-full z-10">
            {data.map((item, i) => (
              <div
                key={i}
                className="relative flex flex-col items-center w-12 h-full justify-end group"
              >
                {/* Visual Bar Container */}
                <div className="relative w-full h-full flex flex-col justify-end">
                  {/* Total Income Bar (Orange - bottom) with rounded top */}
                  <div
                    className="absolute bottom-0 w-full bg-[#F16622] rounded-t-[10px] transition-all duration-700"
                    style={{ height: getHeight(item.income) }}
                  />

                  {/* Amount Paid Bar (Peach - top) flat, straight boundary */}
                  <div
                    className="absolute bottom-0 w-full bg-[#FFD5C2] transition-all duration-700"
                    style={{ height: getHeight(item.paid) }}
                  />
                </div>

                {/* Month Label */}
                <span className="absolute -bottom-8 text-[12px] text-[#6E6E6E] font-medium whitespace-nowrap">
                  {months[i]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
