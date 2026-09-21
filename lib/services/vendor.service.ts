import { apiCall } from "../api/client";
import { DashboardData } from "../api/dashboard";
import { API_ROUTES } from "../api/endpoints";

export type ApiResponse<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
};

export interface VendorStats {
  totalVendor: number;
  totalActiveVendor: number;
  totalInactiveVendor: number;
  newlyJoinedVendor: number;
  pendingVendor: number;
}

export interface Vendor {
  id: string;
  country: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  businessCategory: string;
  businessEmail: string;
  businessAddress: string;
  businessName: string;
  role: string;
  vendorType: string;
  verified: boolean;
  isBusinessDocumentCompleted: boolean;
  isPersonalIdCompleted: boolean;
  personalId: string;
  fileUrl: string;
  businessType: string;
  companyRegistrationNumber: string;
  taxId: string;
  isPreorder: boolean;
  isFavourite: boolean;
  isOpenNow: boolean;
  bankName: string;
  accountNumber: string;
  accountName: string;
  bankVerificationNumber: string;
  isProfileCompleted: boolean;
  isMenuSet: boolean;
  isGrocerySet: boolean;
  isOperationsConfigured: boolean;
  isBankAdded: boolean;
  golive: boolean;
  isLocationSet: boolean;
  isOnline: boolean;
  isActive: boolean;
  adminId: string | null;
  rejectionReason: string | null;
  isSuspended: boolean;
  suspensionReason: string | null;
  cuisineType: string;
  socialAccount: string;
  profileImg: string;
  zoneId: string | null;
  latitude: number | null;
  longitude: number | null;
  totalOrder: number;
  adminApproved: string;
  createdAt: string;
  updatedAt: string;
}

export type VendorStatsResponse = ApiResponse<{
  status: string;
  message: string;
  data: VendorStats;
}>;

export type VendorListRes = ApiResponse<{
  status: string;
  message: string;
  data: Vendor[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}>;

export const vendor = {
  async getDashboard() {
    const res = await apiCall<ApiResponse<DashboardData>>(
      API_ROUTES.stats.dashboard,
      {
        method: "GET",
      },
    );
    return res;
  },
  async getVendorStats() {
    const res = await apiCall<VendorStatsResponse>(
      API_ROUTES.vendor.vendorStats,
      {
        method: "GET",
      },
    );
    return res;
  },
  async getVendorList(
    page: number = 1,
    limit: number = 10,
    search?: string,
    status?: string,
    zoneId?: string,
  ) {
    const searchParams = search ? `&search=${search}` : "";
    const statusParams = status ? `&status=${status}` : "";
    const zoneIdParams = zoneId ? `&zoneId=${zoneId}` : "";
    const params = `${searchParams}${statusParams}${zoneIdParams}`;

    const res = await apiCall<VendorListRes>(
      `${API_ROUTES.vendor.getVendors}?page=${page}&limit=${limit}${params}`,
      {
        method: "GET",
      },
    );
    return res;
  },
};
