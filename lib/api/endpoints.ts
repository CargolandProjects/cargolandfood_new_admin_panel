export const API_ROUTES = {
  stats: {
    dashboard: "/dashboard",
  },

  vendor: {
    vendorStats: "/vendors/stats",
    getVendors: "/vendors",
    getVendor: (vendorId: string) => `/vendors/${vendorId}`,
  },
};
