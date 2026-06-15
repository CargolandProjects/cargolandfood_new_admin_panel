import { apiCall } from "./client";

const CACHE_TTL_MS = 2 * 60 * 1000;
const STORAGE_PREFIX = "dashboard_cache_v1";

type CacheEntry<T> = { data: T; at: number };

function readCache<T>(entry: CacheEntry<T> | null | undefined): T | null {
  if (!entry) return null;
  if (Date.now() - entry.at > CACHE_TTL_MS) return null;
  return entry.data;
}

function writeCache<T>(data: T): CacheEntry<T> {
  return { data, at: Date.now() };
}

function getStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function storageKey(key: string): string {
  return `${STORAGE_PREFIX}:${key}`;
}

function readStorageEntry<T>(key: string): CacheEntry<T> | null {
  const storage = getStorage();
  if (!storage) return null;

  try {
    const raw = storage.getItem(storageKey(key));
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<CacheEntry<T>>;
    if (!parsed || typeof parsed.at !== "number" || !("data" in parsed)) {
      return null;
    }

    return { data: parsed.data as T, at: parsed.at };
  } catch {
    return null;
  }
}

function writeStorageEntry<T>(key: string, entry: CacheEntry<T>): void {
  const storage = getStorage();
  if (!storage) return;

  try {
    storage.setItem(storageKey(key), JSON.stringify(entry));
  } catch {
    // Ignore storage quota/access errors.
  }
}

let dashboardCache: CacheEntry<DashboardData> | null = null;
let pendingApprovalsCache: CacheEntry<PendingApprovalRow[]> | null = null;
let riderActivityCache: CacheEntry<RiderActivityData> | null = null;
const keyMetricsCache = new Map<string, CacheEntry<KeyMetricsData>>();
const schedulesCache = new Map<string, CacheEntry<ScheduleItem[]>>();

let dashboardInFlight: Promise<DashboardData> | null = null;
let pendingApprovalsInFlight: Promise<PendingApprovalRow[]> | null = null;
let riderActivityInFlight: Promise<RiderActivityData> | null = null;
const keyMetricsInFlight = new Map<string, Promise<KeyMetricsData>>();
const schedulesInFlight = new Map<string, Promise<ScheduleItem[]>>();

export function getCachedDashboard(): DashboardData | null {
  const inMemory = readCache(dashboardCache);
  if (inMemory) return inMemory;

  const persisted = readStorageEntry<DashboardData>("dashboard");
  if (persisted) {
    dashboardCache = persisted;
    return persisted.data;
  }

  return null;
}

export function getCachedPendingApprovals(): PendingApprovalRow[] | null {
  const inMemory = readCache(pendingApprovalsCache);
  if (inMemory) return inMemory;

  const persisted = readStorageEntry<PendingApprovalRow[]>("pendingApprovals");
  if (persisted) {
    pendingApprovalsCache = persisted;
    return persisted.data;
  }

  return null;
}

export function getCachedRiderActivity(): RiderActivityData | null {
  const inMemory = readCache(riderActivityCache);
  if (inMemory) return inMemory;

  const persisted = readStorageEntry<RiderActivityData>("riderActivity");
  if (persisted) {
    riderActivityCache = persisted;
    return persisted.data;
  }

  return null;
}

export function getCachedKeyMetrics(
  startDate: string,
  endDate: string
): KeyMetricsData | null {
  const cacheKey = `${startDate}_${endDate}`;
  const inMemory = readCache(keyMetricsCache.get(cacheKey));
  if (inMemory) return inMemory;

  const persisted = readStorageEntry<KeyMetricsData>(`keyMetrics:${cacheKey}`);
  if (persisted) {
    keyMetricsCache.set(cacheKey, persisted);
    return persisted.data;
  }

  return null;
}

export function getCachedSchedules(
  startDate: string,
  endDate: string,
  page = 1,
  limit = 20
): ScheduleItem[] | null {
  const cacheKey = `${startDate}_${endDate}_${page}_${limit}`;
  const inMemory = readCache(schedulesCache.get(cacheKey));
  if (inMemory) return inMemory;

  const persisted = readStorageEntry<ScheduleItem[]>(`schedules:${cacheKey}`);
  if (persisted) {
    schedulesCache.set(cacheKey, persisted);
    return persisted.data;
  }

  return null;
}

export function invalidateDashboardCache(): void {
  dashboardCache = null;
  pendingApprovalsCache = null;
  riderActivityCache = null;
  keyMetricsCache.clear();
  schedulesCache.clear();

  dashboardInFlight = null;
  pendingApprovalsInFlight = null;
  riderActivityInFlight = null;
  keyMetricsInFlight.clear();
  schedulesInFlight.clear();

  const storage = getStorage();
  if (!storage) return;
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < storage.length; i += 1) {
      const key = storage.key(i);
      if (key?.startsWith(`${STORAGE_PREFIX}:`)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => storage.removeItem(key));
  } catch {
    // Ignore storage errors.
  }
}

export interface DashboardStats {
  totalVendors: {
    count: number;
    label: string;
    change: number;
    trend: string;
  };

  totalRiders: {
    count: number;
    label: string;
    change: number;
    trend: string;
  };

  pendingApprovals: {
    count: number;
    label: string;
    breakdown: string;
    change?: number;
  };

  totalIncome: {
    amount: number;
    currency: string;
    label: string;
    change: number;
    repayment?: number;
    repaymentLabel?: string;
    trend?: string;
  };
}

export interface DashboardSchedule {
  totalCount: number;
  upcoming: any[];
}

export interface ScheduleAttendee {
  id: string;
  scheduleId: string;
  staffId: string | null;
  name: string;
  email: string;
  avatarUrl: string | null;
  createdAt: string;
}

export interface ScheduleItem {
  id: string;
  title: string;
  description: string | null;
  type: "BANNER" | "MEETING" | "PROMOTION" | "OTHER";
  status: "UPCOMING" | "COMPLETED" | "CANCELLED";
  startTime: string;
  endTime: string;
  platform: "GOOGLE_MEET" | "ZOOM" | null;
  meetingLink: string | null;
  vendorId: string | null;
  vendorName: string | null;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  attendees: ScheduleAttendee[];
  createdBy: { id: string; name: string };
}

interface SchedulesApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: ScheduleItem[];
}

export interface DashboardCampaigns {
  activeBanners: number;
  draftBanners: number;
  activePromotions: number;
  draftPromotions: number;
}

export interface DashboardData {
  stats: DashboardStats;
  schedule: DashboardSchedule;
  campaigns: DashboardCampaigns;
}

export interface DashboardResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: DashboardData;
}

/** Dashboard is on the auth host (adminpanel), not the dev data API. */
export async function fetchDashboard(): Promise<DashboardData> {
  const cached = getCachedDashboard();
  if (cached) return cached;

  if (dashboardInFlight) return dashboardInFlight;

  dashboardInFlight = apiCall<DashboardResponse>("/dashboard", {
    method: "GET",
    authBase: true,
  })
    .then((response) => {
      if (!response.data) {
        throw new Error("Dashboard response missing data");
      }

      const entry = writeCache(response.data);
      dashboardCache = entry;
      writeStorageEntry("dashboard", entry);
      return response.data;
    })
    .finally(() => {
      dashboardInFlight = null;
    });

  return dashboardInFlight;
}

export type ApprovalStatus = "Approved" | "Pending" | "Rejected";

export interface PendingApprovalRow {
  id: string;
  type: string;
  name: string;
  detail: string;
  date: string;
  status: ApprovalStatus;
}

/** Raw item from GET /dashboard/pending-approvals (flexible field names). */
interface PendingApprovalApiItem {
  id?: string;
  type?: string;
  requestType?: string;
  entityType?: string;
  employee?: string;
  employeeName?: string;
  name?: string;
  fullName?: string;
  details?: string;
  detail?: string;
  description?: string;
  date?: string;
  createdAt?: string;
  requestDate?: string;
  status?: string;
}

interface PendingApprovalsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: PendingApprovalApiItem[] | { items?: PendingApprovalApiItem[] };
}

function formatApprovalDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function mapApprovalStatus(status: string): ApprovalStatus {
  const upper = status.toUpperCase();
  if (upper.includes("APPROVE")) return "Approved";
  if (upper.includes("REJECT") || upper.includes("DECLINE")) return "Rejected";
  return "Pending";
}

function normalizePendingList(
  data: PendingApprovalsResponse["data"]
): PendingApprovalApiItem[] {
  if (Array.isArray(data)) return data;
  if (data?.items && Array.isArray(data.items)) return data.items;
  return [];
}

function mapPendingToRow(
  item: PendingApprovalApiItem,
  index: number
): PendingApprovalRow {
  const dateSource = item.date ?? item.createdAt ?? item.requestDate;

  return {
    id: item.id ?? `pending-${index}`,
    type: item.type ?? item.requestType ?? item.entityType ?? "Request",
    name:
      item.employee ??
      item.employeeName ??
      item.name ??
      item.fullName ??
      "—",
    detail: item.details ?? item.detail ?? item.description ?? "—",
    date: dateSource ? formatApprovalDate(dateSource) : "—",
    status: mapApprovalStatus(item.status ?? "PENDING"),
  };
}

export async function fetchPendingApprovals(): Promise<PendingApprovalRow[]> {
  const cached = getCachedPendingApprovals();
  if (cached) return cached;

  if (pendingApprovalsInFlight) return pendingApprovalsInFlight;

  pendingApprovalsInFlight = apiCall<PendingApprovalsResponse>(
    "/dashboard/pending-approvals",
    { method: "GET", authBase: true }
  )
    .then((response) => {
      const rows = normalizePendingList(response.data).map(mapPendingToRow);
      const entry = writeCache(rows);
      pendingApprovalsCache = entry;
      writeStorageEntry("pendingApprovals", entry);
      return rows;
    })
    .finally(() => {
      pendingApprovalsInFlight = null;
    });

  return pendingApprovalsInFlight;
}

export interface KeyMetricsMonth {
  label: string;
  income: number;
  paid: number;
}

export interface KeyMetricsData {
  monthly: KeyMetricsMonth[];
  totalIncome: number;
  totalPaid: number;
}

interface KeyMetricsMonthlyApiItem {
  month?: string;
  monthLabel?: string;
  label?: string;
  name?: string;
  income?: number;
  totalIncome?: number;
  paid?: number;
  totalPaid?: number;
  amountPaid?: number;
}

interface KeyMetricsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    monthly?: KeyMetricsMonthlyApiItem[];
    totalIncome: number;
    totalPaid: number;
  };
}

function formatMonthLabel(raw: string): string {
  if (/^\d{4}-\d{2}$/.test(raw)) {
    const d = new Date(`${raw}-01`);
    return d.toLocaleDateString("en-GB", { month: "short" });
  }
  return raw;
}

function mapMonthlyItem(item: KeyMetricsMonthlyApiItem): KeyMetricsMonth {
  const labelSource = item.monthLabel ?? item.label ?? item.month ?? item.name ?? "—";

  return {
    label: formatMonthLabel(labelSource),
    income: Number(item.income ?? item.totalIncome ?? 0),
    paid: Number(item.paid ?? item.totalPaid ?? item.amountPaid ?? 0),
  };
}

export async function fetchKeyMetrics(
  startDate: string,
  endDate: string
): Promise<KeyMetricsData> {
  const cacheKey = `${startDate}_${endDate}`;
  const cached = getCachedKeyMetrics(startDate, endDate);
  if (cached) return cached;

  const existingRequest = keyMetricsInFlight.get(cacheKey);
  if (existingRequest) return existingRequest;

  const params = new URLSearchParams({ startDate, endDate });
  const request = apiCall<KeyMetricsResponse>(
    `/dashboard/key-metrics?${params.toString()}`,
    { method: "GET", authBase: true }
  )
    .then((response) => {
      const monthly = (response.data?.monthly ?? []).map(mapMonthlyItem);

      const data: KeyMetricsData = {
        monthly,
        totalIncome: Number(response.data?.totalIncome ?? 0),
        totalPaid: Number(response.data?.totalPaid ?? 0),
      };

      const entry = writeCache(data);
      keyMetricsCache.set(cacheKey, entry);
      writeStorageEntry(`keyMetrics:${cacheKey}`, entry);
      return data;
    })
    .finally(() => {
      keyMetricsInFlight.delete(cacheKey);
    });

  keyMetricsInFlight.set(cacheKey, request);
  return request;
}

export interface RiderActivityData {
  totalAttendance: number;
  onTime: number;
  late: number;
  absent: number;
}

interface RiderActivityResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: RiderActivityData;
}

export async function fetchRiderActivity(): Promise<RiderActivityData> {
  const cached = getCachedRiderActivity();
  if (cached) return cached;

  if (riderActivityInFlight) return riderActivityInFlight;

  riderActivityInFlight = apiCall<RiderActivityResponse>(
    "/dashboard/rider-activity",
    { method: "GET", authBase: true }
  )
    .then((response) => {
      const data: RiderActivityData = {
        totalAttendance: Number(response.data?.totalAttendance ?? 0),
        onTime: Number(response.data?.onTime ?? 0),
        late: Number(response.data?.late ?? 0),
        absent: Number(response.data?.absent ?? 0),
      };

      const entry = writeCache(data);
      riderActivityCache = entry;
      writeStorageEntry("riderActivity", entry);
      return data;
    })
    .finally(() => {
      riderActivityInFlight = null;
    });

  return riderActivityInFlight;
}

export function formatIncome(amount: number): string {
  if (amount >= 1_000_000) {
    return `₦${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `₦${(amount / 1_000).toFixed(1)}K`;
  }
  return `₦${amount.toLocaleString("en-NG")}`;
}

export async function fetchSchedules(
  startDate: string,
  endDate: string,
  page = 1,
  limit = 20
): Promise<ScheduleItem[]> {
  const cacheKey = `${startDate}_${endDate}_${page}_${limit}`;
  const cached = getCachedSchedules(startDate, endDate, page, limit);
  if (cached) return cached;

  const existingRequest = schedulesInFlight.get(cacheKey);
  if (existingRequest) return existingRequest;

  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    startDate,
    endDate,
  });

  const request = apiCall<SchedulesApiResponse>(
    `/schedules?${params.toString()}`,
    { method: "GET", authBase: true }
  )
    .then((response) => {
      const data = Array.isArray(response.data) ? response.data : [];
      const entry = writeCache(data);
      schedulesCache.set(cacheKey, entry);
      writeStorageEntry(`schedules:${cacheKey}`, entry);
      return data;
    })
    .finally(() => {
      schedulesInFlight.delete(cacheKey);
    });

  schedulesInFlight.set(cacheKey, request);
  return request;
}