"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
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
  Video,
} from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import LoadingSpinner from "@/components/dashboard/LoadingSpinner";
import {
  fetchDashboard,
  fetchKeyMetrics,
  fetchPendingApprovals,
  fetchRiderActivity,
  fetchSchedules,
  formatIncome,
  getCachedDashboard,
  getCachedKeyMetrics,
  getCachedPendingApprovals,
  getCachedRiderActivity,
  getCachedSchedules,
  type ApprovalStatus,
  type DashboardData,
  type KeyMetricsData,
  type PendingApprovalRow,
  type RiderActivityData,
  type ScheduleItem,
} from "@/lib/api/dashboard";

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [pendingApprovals, setPendingApprovals] = useState<PendingApprovalRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingPending, setLoadingPending] = useState(true);
  const [error, setError] = useState("");
  const [pendingError, setPendingError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const cachedDashboard = getCachedDashboard();
    const cachedPending = getCachedPendingApprovals();

    if (cachedDashboard) {
      setDashboard(cachedDashboard);
      setLoading(false);
    }

    if (cachedPending) {
      setPendingApprovals(cachedPending);
      setLoadingPending(false);
    }

    fetchDashboard()
      .then((data) => {
        if (!cancelled) {
          setDashboard(data);
          setError("");
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || "Failed to load dashboard");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    fetchPendingApprovals()
      .then((rows) => {
        if (!cancelled) {
          setPendingApprovals(rows);
          setPendingError("");
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setPendingApprovals([]);
          setPendingError(
            err.message || "Failed to load pending approvals"
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingPending(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const stats = dashboard?.stats;

  return (
    <div className="space-y-6 font-satoshi p-4 bg-white min-h-screen">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* 1. TOP METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Vendors"
          loading={loading}
          value={String(stats?.totalVendors.count ?? 0)}
          subtext={stats?.totalVendors.label ?? ""}
          trend={`+${stats?.totalVendors.change ?? 0}%`}
          color="text-green-500"
          footerLabel="Total Size"
        />
        <StatCard
          title="Total Riders"
          loading={loading}
          value={String(stats?.totalRiders.count ?? 0)}
          subtext={stats?.totalRiders.label ?? ""}
          trend={`+${stats?.totalRiders.change ?? 0}%`}
          color="text-green-500"
          footerLabel="Total Size"
        />
        <StatCard
          title="Pending Approvals"
          loading={loading}
          value={String(stats?.pendingApprovals.count ?? 0)}
          subtext={stats?.pendingApprovals.label ?? ""}
          trend={`+${stats?.pendingApprovals.change ?? stats?.pendingApprovals.count ?? 0}`}
          color="text-green-500"
          footerLabel="Total Size"
        />
        <StatCard
          title="Total Income"
          loading={loading}
          value={formatIncome(stats?.totalIncome.amount ?? 0)}
          subtext={stats?.totalIncome.label ?? ""}
          trend={`+${stats?.totalIncome.change ?? 0}%`}
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
              <RidersActivityCard />
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
                <span className="text-gray-400 font-normal ml-1">
                  ({loadingPending ? "…" : pendingApprovals.length})
                </span>
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

            {pendingError && (
              <p className="px-6 pb-4 text-sm text-red-500">{pendingError}</p>
            )}

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
                  {loadingPending ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12">
                        <div className="flex items-center justify-center">
                          <LoadingSpinner size="md" />
                        </div>
                      </td>
                    </tr>
                  ) : pendingApprovals.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-12 text-center text-gray-400"
                      >
                        No pending approvals found.
                      </td>
                    </tr>
                  ) : (
                    pendingApprovals.map((row) => (
                      <TableRow key={row.id} {...row} />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 3. RIGHT COLUMN (Schedule - Spans full height of the wrapper) */}
        <div className="col-span-12 lg:col-span-3 h-full">
          <ScheduleSection />
        </div>
      </div>
    </div>
  );
}

// ─── SCHEDULE SECTION ────────────────────────────────────────────────────────

type ScheduleTab = "All" | "Meetings" | "Promotions";

function getScheduleWindow() {
  const start = new Date();
  start.setFullYear(start.getFullYear() - 1);
  const end = new Date();
  end.setFullYear(end.getFullYear() + 1);
  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
}

function ScheduleSection() {
  const { startDate, endDate } = getScheduleWindow();
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<ScheduleTab>("All");
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    let cancelled = false;
    const cachedSchedules = getCachedSchedules(startDate, endDate, 1, 50);

    if (cachedSchedules) {
      setSchedules(cachedSchedules);
      setLoading(false);
    }

    fetchSchedules(startDate, endDate, 1, 50)
      .then((data) => {
        if (!cancelled) {
          setSchedules(data);
          setError("");
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setSchedules([]);
          setError(err?.message || "Failed to load schedules");
        }
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = schedules.filter((s) => {
    if (activeTab === "Meetings") return s.type === "MEETING";
    if (activeTab === "Promotions") return s.type === "PROMOTION";
    return true;
  });

  const visibleSchedules = filtered.slice(0, visibleCount);
  const hasMoreSchedules = filtered.length > visibleCount;

  useEffect(() => {
    setVisibleCount(3);
  }, [activeTab]);

  return (
    <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-[#00302E]">
          Schedule{" "}
          <span className="text-gray-400 font-normal">
            ({loading ? "…" : schedules.length})
          </span>
        </h3>
        <button className="flex items-center gap-1 text-[10px] border px-2 py-1 rounded-md text-gray-500">
          <Calendar className="w-3 h-3" /> View Calendar
        </button>
      </div>

      <div className="flex bg-gray-50 p-1 rounded-xl gap-1 mb-6">
        {(["All", "Meetings", "Promotions"] as ScheduleTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-[11px] rounded-lg transition-all ${
              activeTab === tab
                ? "bg-white shadow-sm font-bold text-[#00302E]"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="md" />
          </div>
        ) : error ? (
          <p className="text-center text-red-400 text-xs py-8 px-2">{error}</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-8">No schedules found.</p>
        ) : (
          visibleSchedules.map((s) => <ScheduleCard key={s.id} item={s} />)
        )}
      </div>

      {!loading && !error && hasMoreSchedules && (
        <button
          type="button"
          onClick={() => setVisibleCount((count) => count + 3)}
          className="mt-4 w-full py-2 rounded-xl border border-gray-200 text-sm font-medium text-[#4D4D4D] hover:bg-gray-50 transition-colors"
        >
          Load more
        </button>
      )}
    </div>
  );
}

// ─── SCHEDULE CARD ────────────────────────────────────────────────────────────

function formatScheduleTime(startIso: string, endIso: string): string {
  const fmt = (iso: string) =>
    new Date(iso).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).toLowerCase();
  return `${fmt(startIso)} - ${fmt(endIso)}`;
}

function formatScheduleDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getScheduleBtnText(type: ScheduleItem["type"]): string | null {
  if (type === "BANNER") return "Create Banner";
  if (type === "PROMOTION") return "Promote";
  return null;
}

function ScheduleCard({ item }: { item: ScheduleItem }) {
  const btnText = getScheduleBtnText(item.type);
  const isMeeting = item.type === "MEETING" || item.type === "OTHER";
  const isGoogleMeet = item.platform === "GOOGLE_MEET";
  const isZoom = item.platform === "ZOOM";

  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 space-y-3">
      <h4 className="text-[13px] font-bold text-[#00302E]">{item.title}</h4>

      <p className="text-[10px] text-gray-400 font-medium">
        {formatScheduleDate(item.startTime)} •{" "}
        {formatScheduleTime(item.startTime, item.endTime)}
      </p>

      {btnText && (
        <button className="w-full py-2 bg-[#F16622] text-white text-[11px] font-bold rounded-xl">
          {btnText}
        </button>
      )}

      {isMeeting && (
        <div className="flex items-center justify-between border-t pt-3 mt-3">
          {/* Platform badge */}
          {isGoogleMeet ? (
            item.meetingLink ? (
              <a
                href={item.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[10px] text-blue-600 font-bold hover:underline"
              >
                <Image
                  src="/images/icons/google-meet-logo.png"
                  alt="Google Meet"
                  width={16}
                  height={16}
                  className="rounded"
                />
                Google Meet
              </a>
            ) : (
              <span className="flex items-center gap-1 text-[10px] text-blue-600 font-bold">
                <Image
                  src="/images/icons/google-meet-logo.png"
                  alt="Google Meet"
                  width={16}
                  height={16}
                  className="rounded"
                />
                Google Meet
              </span>
            )
          ) : isZoom ? (
            <span className="flex items-center gap-1 text-[10px] text-blue-600 font-bold">
              <Video className="w-4 h-4" />
              Zoom
            </span>
          ) : (
            <span className="text-[10px] text-gray-400">Virtual</span>
          )}

          {/* Attendee avatars */}
          {item.attendees.length > 0 && (
            <div className="flex -space-x-2">
              {item.attendees.slice(0, 3).map((a) =>
                a.avatarUrl ? (
                  <img
                    key={a.id}
                    src={a.avatarUrl}
                    alt={a.name}
                    title={a.name}
                    className="w-6 h-6 rounded-full border-2 border-white object-cover"
                  />
                ) : (
                  <div
                    key={a.id}
                    title={a.name}
                    className="w-6 h-6 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[8px] font-bold text-gray-500"
                  >
                    {a.name.charAt(0).toUpperCase()}
                  </div>
                )
              )}
              {item.attendees.length > 3 && (
                <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[8px] font-medium text-gray-500">
                  +{item.attendees.length - 3}
                </div>
              )}
            </div>
          )}

          {/* Fallback avatar row when no attendees */}
          {item.attendees.length === 0 && (
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full border-2 border-white bg-gray-200"
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const emptyRiderActivity: RiderActivityData = {
  totalAttendance: 0,
  onTime: 0,
  late: 0,
  absent: 0,
};

// --- RIDERS ACTIVITY COMPONENT WITH VISIBLE GAPS ---
function RidersActivityCard() {
  const [activity, setActivity] = useState<RiderActivityData>(emptyRiderActivity);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const cachedActivity = getCachedRiderActivity();
    if (cachedActivity) {
      setActivity(cachedActivity);
      setLoading(false);
    }

    fetchRiderActivity()
      .then((data) => {
        if (!cancelled) setActivity(data);
      })
      .catch(() => {
        if (!cancelled) {
          setActivity(emptyRiderActivity);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const { onTime, late, absent } = activity;
  const total = onTime + late + absent;

  const onTimePct = total > 0 ? (onTime / total) * 100 : 0;
  const latePct = total > 0 ? (late / total) * 100 : 0;
  const absentPct = total > 0 ? (absent / total) * 100 : 0;

  const centerPercent =
    activity.totalAttendance > 0 && activity.totalAttendance <= 100
      ? Math.round(activity.totalAttendance)
      : Math.round(onTimePct + latePct);

  const totalLength = 125.6;
  const gap = 3;

  const onTimeL = Math.max((onTimePct / 100) * totalLength - gap, 0);
  const lateL = Math.max((latePct / 100) * totalLength - gap, 0);
  const absentL = Math.max((absentPct / 100) * totalLength - gap, 0);

  return (
    <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-medium text-black">Riders activity</h3>

        <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-100 rounded-[12px] text-[12px] text-[#4D4D4D] shadow-sm font-medium">
          Today
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {loading ? (
        <div className="py-16 flex items-center justify-center">
          <LoadingSpinner size="md" />
        </div>
      ) : (
      <>
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
              strokeDashoffset={-((onTimePct / 100) * totalLength)}
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
              strokeDashoffset={-(((onTimePct + latePct) / 100) * totalLength)}
              className="transition-all duration-1000"
            />
          </svg>
        </div>

        {/* Center Text */}
        <div className="absolute top-[65%] flex flex-col items-center">
          <span className="text-[28px] font-black text-[#1A1A1A] leading-none">
            {centerPercent}%
          </span>
          <span className="text-[12px] text-[#6E6E6E] font-medium mt-1">
            Total Attendance
          </span>
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-8">
        <LegendItem color="bg-[#F16622]" label={`On time (${onTime})`} />
        <LegendItem color="bg-[#FBCCB2]" label={`Late (${late})`} />
        <LegendItem color="bg-[#FEEFE6]" label={`Absent (${absent})`} />
      </div>
      </>
      )}
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

type TableRowProps = PendingApprovalRow;

const statusStyles: Record<ApprovalStatus, string> = {
  Approved: "bg-green-50 text-green-600 border-green-100",
  Pending: "bg-orange-50 text-orange-600 border-orange-100",
  Rejected: "bg-red-50 text-red-600 border-red-100",
};

const dotColors: Record<ApprovalStatus, string> = {
  Approved: "bg-green-600",
  Pending: "bg-orange-600",
  Rejected: "bg-red-600",
};

function TableRow({ type, name, detail, date, status }: TableRowProps) {

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

function keyMetricsRange(year: number) {
  return { startDate: `${year}-01-01`, endDate: `${year}-12-31` };
}

function KeyMetrics() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [metrics, setMetrics] = useState<KeyMetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const { startDate, endDate } = keyMetricsRange(year);
    const cached = getCachedKeyMetrics(startDate, endDate);

    if (cached) {
      setMetrics(cached);
      setLoading(false);
    } else {
      setLoading(true);
    }

    fetchKeyMetrics(startDate, endDate)
      .then((data) => {
        if (!cancelled) {
          setMetrics(data);
          setError("");
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setMetrics({ monthly: [], totalIncome: 0, totalPaid: 0 });
          setError(err.message || "Failed to load key metrics");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [year]);

  const monthly = metrics?.monthly ?? [];
  const totalIncome = metrics?.totalIncome ?? 0;
  const totalPaid = metrics?.totalPaid ?? 0;

  const maxBar = Math.max(
    ...monthly.flatMap((m) => [m.income, m.paid]),
    1
  );
  const ySteps = 5;
  const yMax = Math.ceil(maxBar / 1000) * 1000 || 1000;
  const yLabels = Array.from({ length: ySteps + 1 }, (_, i) =>
    Math.round((yMax / ySteps) * (ySteps - i))
  );

  const getHeight = (value: number) =>
    `${Math.min((value / yMax) * 100, 100)}%`;

  const formatCompact = (n: number) => {
    if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `₦${(n / 1_000).toFixed(1)}K`;
    return `₦${n.toLocaleString("en-NG")}`;
  };

  return (
    <div className="col-span-12 lg:col-span-6 bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden min-h-[450px] h-full flex flex-col">
      <div className="p-6 pb-0">
        <h3 className="text-[18px] font-bold text-[#1A1A1A] mb-3">Key Metrics</h3>
        <div className="flex items-center gap-3 mb-4">
          <button
            type="button"
            onClick={() => setYear((y) => y - 1)}
            className="p-1.5 rounded-full border border-gray-100 hover:bg-gray-50 transition-colors"
            aria-label="Previous year"
          >
            <ChevronLeft className="w-4 h-4 text-gray-400" />
          </button>
          <span className="text-[14px] font-medium text-[#4D4D4D]">
            Jan, {year} - Dec, {year}
          </span>
          <button
            type="button"
            onClick={() => setYear((y) => y + 1)}
            disabled={year >= currentYear}
            className="p-1.5 rounded-full border border-gray-100 hover:bg-gray-50 transition-colors disabled:opacity-40"
            aria-label="Next year"
          >
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      <div className="border-b border-gray-100 w-full" />

      <div className="p-6 pt-5 flex-1 flex flex-col min-h-0">
        <div className="flex gap-8 border-b border-gray-100 mb-6 text-[14px]">
          <span className="pb-3 border-b-2 border-[#3B82F6] text-[#3B82F6] font-bold">
            Total Restaurant Sales
          </span>
          <span className="pb-3 text-[#6E6E6E] font-medium">Vendors Activity</span>
          <span className="pb-3 text-[#6E6E6E] font-medium">
            Riders Performance
          </span>
        </div>

        <div className="flex flex-wrap gap-6 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#F16622] shrink-0" />
            <span className="text-[12px] text-[#6E6E6E] font-medium">
              Total Income
            </span>
            <span className="text-[11px] font-bold text-[#1A1A1A]">
              {formatCompact(totalIncome)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FFD5C2] shrink-0" />
            <span className="text-[12px] text-[#6E6E6E] font-medium">
              Amount Paid
            </span>
            <span className="text-[11px] font-bold text-[#1A1A1A]">
              {formatCompact(totalPaid)}
            </span>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-500 mb-4">{error}</p>
        )}

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <LoadingSpinner size="md" />
          </div>
        ) : monthly.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-sm text-center px-4">
            No monthly data for {year}.
          </div>
        ) : (
          <div className="relative flex-1 min-h-[220px] pb-12">
            <div className="absolute inset-0 flex flex-col justify-between text-[12px] text-gray-400 font-medium pointer-events-none pb-12 pr-2">
              {yLabels.map((val) => (
                <div key={val} className="flex items-center gap-2 w-full h-0">
                  <span className="w-10 text-right shrink-0">
                    {formatCompact(val)}
                  </span>
                  <div className="flex-1 border-t border-gray-100/50" />
                </div>
              ))}
            </div>

            <div className="ml-12 h-full overflow-x-auto overflow-y-hidden">
              <div
                className="flex items-end gap-3 h-full min-h-[180px] px-2"
                style={{ minWidth: `${monthly.length * 56}px` }}
              >
                {monthly.map((item, i) => (
                  <div
                    key={`${item.label}-${i}`}
                    className="relative flex flex-col items-center w-12 shrink-0 h-full justify-end"
                  >
                    <div className="relative w-full h-[calc(100%-2rem)] flex flex-col justify-end">
                      <div
                        className="absolute bottom-0 w-full bg-[#F16622] rounded-t-[10px] transition-all duration-500 min-h-[2px]"
                        style={{ height: getHeight(item.income) }}
                        title={`Income: ${formatCompact(item.income)}`}
                      />
                      <div
                        className="absolute bottom-0 w-full bg-[#FFD5C2] transition-all duration-500 min-h-[2px]"
                        style={{ height: getHeight(item.paid) }}
                        title={`Paid: ${formatCompact(item.paid)}`}
                      />
                    </div>
                    <span className="absolute -bottom-8 text-[11px] text-[#6E6E6E] font-medium whitespace-nowrap">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
