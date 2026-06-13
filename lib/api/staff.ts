import { apiCall } from "./client";

export interface CreateStaffPayload {
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "EMPLOYEE";
  permissions: string[];
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface StaffResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data?: {
    id: string;
    name: string;
    email: string;
    role: string;
    permissions: string[];
  };
  timestamp: string;
}

export interface StaffListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Staff[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  timestamp: string;
}

export interface FetchStaffListParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
}

export async function createStaff(payload: CreateStaffPayload): Promise<StaffResponse> {
  try {
    const data = await apiCall<StaffResponse>("/staff", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return data;
  } catch (error) {
    console.error("Failed to create staff:", error);
    throw error;
  }
}

export async function fetchStaffList(params: FetchStaffListParams = {}): Promise<Staff[]> {
  try {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.role) queryParams.append("role", params.role);
    if (params.status) queryParams.append("status", params.status);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/staff?${queryString}` : "/staff";

    const data = await apiCall<StaffListResponse>(endpoint, {
      method: "GET",
    });
    return data.data || [];
  } catch (error) {
    console.error("Failed to fetch staff list:", error);
    throw error;
  }
}
