export const API_ROUTES = {
  stats: {
    dashboard: "/dashboard",
  },

  vendor: {
    vendorStats: "/vendors/stats",
    getVendors: "/vendors",
    getVendor: (vendorId: string) => `/vendors/${vendorId}`,
    CreateVendorMenu: (vendorId: string) => `/vendors/create-menu/${vendorId}`,
    getVendorMenu: (vendorId: string) => `/vendors/get-menus/${vendorId}`,
  },
  cuisines: {
    getOrAddCuisines: "/cuisines",
  },
  image: {
    upload: "/upload",
    delete: (publicId: string) => `/upload/${publicId}`,
  },
};
