import { apiCall } from "../api/client";
import { API_ROUTES } from "../api/endpoints";
import { ApiResponse } from "./vendor.service";

interface Cuisine {
  id: string;
  name: string;
  publishNow: boolean;
  vendorId: string | null;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
}

type GetCuisinesRes = ApiResponse<{
  status: string;
  message: string;
  data: Cuisine[];
}>;

export const cuisines = {
  async getCuisines() {
    const res = apiCall<GetCuisinesRes>(API_ROUTES.cuisines.getOrAddCuisines, {
      method: "GET",
    });
    return res;
  },
  async createCuisines(data: { name: string; createdBy: string }) {
    const res = apiCall(API_ROUTES.cuisines.getOrAddCuisines, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res;
  },
};
