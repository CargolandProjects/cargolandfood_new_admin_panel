import { apiCall } from "../api/client";
import { DashboardData } from "../api/dashboard";
import { API_ROUTES } from "../api/endpoints";
import { CreateMenuFormData } from "../schema/menu";

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

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  uploadImageUrl: string;
  publicUrl: string;
  categoryId: string;
  vendorId: string;
  isMenuSet: boolean;
  outOfStock: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

interface Address {
  id: string;
  zoneId: string;
  vendorId: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude: string;
  longitude: string;
  placeId: string;
  provider: string;
  instructions: string;
  setAddressDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

interface WorkingHours {
  preparationTime: string;
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
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
  review: [];
  address: Address[];
  workingHours: WorkingHours[];
}

type CreateMenuData = CreateMenuFormData & { createdBy: string };

export type VendorListVendor = Omit<
  Vendor,
  " review" | "address" | "workingHours"
>;

export type VendorStatsResponse = ApiResponse<{
  status: string;
  message: string;
  data: VendorStats;
}>;

export type VendorListRes = ApiResponse<{
  status: string;
  message: string;
  data: VendorListVendor[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}>;

type CreateMenuRes = ApiResponse<{
  message: string;
  data: MenuItem;
}>;

export type GetVendorRes = ApiResponse<Vendor>;

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

  async getVendors(
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

  async getVendor(vendorId: string) {
    const res = await apiCall<GetVendorRes>(
      API_ROUTES.vendor.getVendor(vendorId),
      {
        method: "GET",
      },
    );
    return res;
  },

  async createVendorMenu({
    vendorId,
    data,
  }: {
    vendorId: string;
    data: CreateMenuData;
  }) {
    const res = apiCall<CreateMenuRes>(API_ROUTES.vendor.CreateVendorMenu(vendorId), {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res;
  },
};
