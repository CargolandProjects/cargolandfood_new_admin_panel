import { apiCall } from "../api/client";
import { API_ROUTES } from "../api/endpoints";

export const stats = {
  async getVendorStats() {
    const res = await apiCall(API_ROUTES.stats.vendor, { method: "GET" });
    return res;
  },
};
