import { apiCall } from "./client";

// ── Types ────────────────────────────────────────────────────────────────────

/** Raw shape returned by the API for a single vendor */
export interface Vendor {
  id: string;
  country?: string;
  businessName: string;
  businessCategory: string;
  businessEmail?: string;
  businessAddress?: string;
  cuisineType: string;
  zoneId: string;
  latitude?: string;
  longitude?: string;
  profileImg?: string;
  totalOrder: number;
  isActive: boolean;
  isOpenNow?: boolean;
  isOnline?: boolean;
  verified?: boolean;
  adminApproved?: string;
  role?: string;
  golive?: boolean;
  isSuspended?: boolean;
  suspensionReason?: string | null;
  rejectionReason?: string | null;
  bankName?: string;
  accountNumber?: string;
  bankVerificationNumber?: string;
  personalId?: string;
  fileUrl?: string;
  isProfileCompleted?: boolean;
  isMenuSet?: boolean;
  isGrocerySet?: boolean;
  isOperationsConfigured?: boolean;
  isBankAdded?: boolean;
  isLocationSet?: boolean;
  isPreorder?: boolean;
  isFavourite?: boolean;
  socialAccount?: string;
  businessType?: string;
  companyRegistrationNumber?: string;
  taxId?: string;
  createdAt: string;
  updatedAt?: string;
  firstName?: string;
  lastName?: string;
  mobileNumber?: string;
}

/** Full API response envelope */
export interface VendorsResponse {
  status: string;
  message: string;
  data: Vendor[];
}

/** Shape the DataTable expects */
export interface RestaurantRow {
  id: string;
  restaurantName: string;
  ownerName: string;
  mobileNumber: string;
  cuisine: string;
  zone: string;
  rating: string;
  orders: number;
  status: "Active" | "Inactive";
  joinDate: string;
}

export const vendorsCache = new Map<string, Vendor>();

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function mapVendorToRow(vendor: Vendor): RestaurantRow {
  return {
    id: vendor.id,
    restaurantName: vendor.businessName,
    ownerName: [vendor.firstName, vendor.lastName].filter(Boolean).join(" ") || "—",
    mobileNumber: vendor.mobileNumber || "—",
    cuisine: vendor.cuisineType || vendor.businessCategory,
    zone: vendor.zoneId,
    rating: "4.5",
    orders: vendor.totalOrder,
    status: vendor.isActive ? "Active" : "Inactive",
    joinDate: formatDate(vendor.createdAt),
  };
}

// ── API calls ────────────────────────────────────────────────────────────────

/**
 * Fetch all active/live vendors (restaurant list page).
 */
export async function fetchVendors(): Promise<RestaurantRow[]> {
  const data = await apiCall<VendorsResponse>("/admin/vendors", {
    method: "GET",
  });
  const vendors = data.data ?? [];
  vendors.forEach((vendor) => {
    vendorsCache.set(vendor.id, vendor);
  });
  return vendors.map(mapVendorToRow);
}

/**
 * Fetch vendors whose join request is still pending (not yet approved/declined).
 */
export async function fetchPendingVendors(): Promise<RestaurantRow[]> {
  const data = await apiCall<VendorsResponse>("/admin/vendors/pending", {
    method: "GET",
  });
  const vendors = data.data ?? [];
  vendors.forEach((vendor) => {
    vendorsCache.set(vendor.id, vendor);
  });
  return vendors.map(mapVendorToRow);
}

/**
 * Fetch vendors whose join request was declined.
 */
export async function fetchDeclinedVendors(): Promise<RestaurantRow[]> {
  const data = await apiCall<VendorsResponse>("/admin/vendors/declined", {
    method: "GET",
  });
  const vendors = data.data ?? [];
  vendors.forEach((vendor) => {
    vendorsCache.set(vendor.id, vendor);
  });
  return vendors.map(mapVendorToRow);
}

/**
 * Fetch vendors whose join request was approved.
 */
export async function fetchApprovedVendors(): Promise<RestaurantRow[]> {
  const data = await apiCall<VendorsResponse>("/admin/vendors/approved", {
    method: "GET",
  });
  const vendors = data.data ?? [];
  vendors.forEach((vendor) => {
    vendorsCache.set(vendor.id, vendor);
  });
  return vendors.map(mapVendorToRow);
}

export function getCachedVendor(vendorId: string): Vendor | undefined {
  return vendorsCache.get(vendorId);
}

/**
 * Create a new vendor/restaurant.
 */
export interface CreateVendorPayload {
  businessEmail: string;
  businessAddress: string;
  businessName: string;
  firstName: string;
  lastName: string;
  country: string;
  businessCategory: string;
  mobileNumber: string;
  cuisineType: string;
  socialAccount: string;
  profileImg: string;
}

export async function createVendor(payload: CreateVendorPayload): Promise<void> {
  await apiCall("/admin/vendors/create", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Toggle a vendor's active status (PATCH /admin/vendors/:id/toggle-status).
 * Returns the new isActive value from the API response.
 */
export async function toggleVendorStatus(vendorId: string): Promise<boolean> {
  const data = await apiCall<{ status: string; data: { isActive: boolean } }>(
    `/admin/vendors/${vendorId}/toggle-status`,
    { method: "PATCH" }
  );
  return data.data.isActive;
}

/**
 * Approve or reject a vendor's join request.
 * @param vendorId  - ID of the vendor to action
 * @param action    - "APPROVE" or "REJECT"
 * @param rejectionReason - Required when action is "REJECT"
 */
export async function approveOrRejectVendor(
  vendorId: string,
  action: "APPROVE" | "REJECT",
  rejectionReason = ""
): Promise<void> {
  // Get the logged-in admin's ID from their profile
  const { getProfile } = await import("@/lib/api/auth");
  const profile = await getProfile();

  await apiCall("/admin/vendors/approve-or-reject", {
    method: "POST",
    body: JSON.stringify({
      vendorId,
      approveOrReject: action,
      adminId: profile.id,
      rejectionReason,
    }),
  });
}
