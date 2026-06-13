import { apiCall } from "./client";

// ── Types ────────────────────────────────────────────────────────────────────

export interface Rider {
  id: string;
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
  zoneId: string | null;
  gender?: string;
  identification?: string;
  identificationNumber?: string;
  identificationImg?: string;
  vehicleType: string;
  guarantorName?: string;
  guarantorNumber?: string;
  role?: string;
  referralCode?: string | null;
  totalDeliveredOrder: string;
  profileImg: string | null;
  selectBank?: string;
  accountName?: string;
  accountNumber?: string;
  systemNotification?: boolean;
  isActive: boolean;
  isOnline: boolean;
  isLocationSet: boolean;
  adminApproved: "PENDING" | "APPROVE" | "REJECT";
  adminId?: string | null;
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface RidersResponse {
  status: string;
  message: string;
  data: Rider[];
}

export interface RiderRow {
  id: string;
  riderName: string;
  mobileNumber: string;
  vehicleType: string;
  zone: string;
  totalOrders: number;
  status: "Active" | "Inactive";
  approvalStatus: "PENDING" | "APPROVE" | "REJECT";
  joinDate: string;
  profileImg: string | null;
  isOnline: boolean;
}

export const ridersCache = new Map<string, Rider>();

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function mapRiderToRow(rider: Rider): RiderRow {
  return {
    id: rider.id,
    riderName: rider.fullName,
    mobileNumber: rider.phoneNumber,
    vehicleType: rider.vehicleType,
    zone: rider.zoneId || "—",
    totalOrders: Number(rider.totalDeliveredOrder || 0),
    status: rider.isActive ? "Active" : "Inactive",
    approvalStatus: rider.adminApproved,
    joinDate: formatDate(rider.createdAt),
    profileImg: rider.profileImg,
    isOnline: rider.isOnline,
  };
}

// ── API calls ────────────────────────────────────────────────────────────────

export async function fetchRiders(): Promise<RiderRow[]> {
  const data = await apiCall<RidersResponse>("/admin/riders", {
    method: "GET",
  });

  const riders = data.data ?? [];
  riders.forEach((rider) => {
    ridersCache.set(rider.id, rider);
  });

  return riders.map(mapRiderToRow);
}

export function getCachedRider(riderId: string): Rider | undefined {
  return ridersCache.get(riderId);
}

export async function fetchRider(riderId: string): Promise<Rider | undefined> {
  // Return from cache if already populated
  const cached = ridersCache.get(riderId);
  if (cached) return cached;

  // Otherwise fetch all riders (populates cache as a side effect) and return the match
  await fetchRiders();
  return ridersCache.get(riderId);
}

export async function fetchPendingRiders(): Promise<RiderRow[]> {
  const riders = await fetchRiders();

  return riders.filter(
    (r) => r.approvalStatus === "PENDING"
  );
}

export async function fetchDeclinedRiders(): Promise<RiderRow[]> {
  const riders = await fetchRiders();

  return riders.filter(
    (r) => r.approvalStatus === "REJECT"
  );
}

export async function approveOrRejectRider(
  riderId: string,
  action: "APPROVE" | "REJECT",
  rejectionReason = ""
): Promise<void> {
  const { getProfile } = await import("@/lib/api/auth");
  const profile = await getProfile();

  await apiCall("/admin/riders/approve-or-reject", {
    method: "POST",
    body: JSON.stringify({
      riderId,
      approveOrReject: action,
      adminId: profile.id,
      rejectionReason,
    }),
  });
}