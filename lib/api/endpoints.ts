export const API_ROUTES = {
  stats: {
    dashboard: "/dashboard",
  },

  vendor: {
    vendorStats: "/vendors/stats",
    getVendors: "/vendors/approved-requests",
    getVendor: (vendorId: string) => `/vendors/${vendorId}`,
    CreateVendorMenu: (vendorId: string) => `/vendors/create-menu/${vendorId}`,
    editVendorMenu: (vendorId: string, menuId: string) =>
      `/vendors/edit-menu/${vendorId}/${menuId}`,
    getVendorMenu: (vendorId: string) => `/vendors/get-menus/${vendorId}`,
    getVendorMenuItem: (vendorId: string, menuId: string) =>
      `/vendors/get-menu/${vendorId}/${menuId}`,
    deleteVendorMenuItem: (vendorId: string, menuId: string) =>
      `/vendors/delete-menu/${vendorId}/${menuId}`,
  },
  cuisines: {
    getOrAddCuisines: "/cuisines",
  },
  image: {
    upload: "/upload",
    delete: (publicId: string) => `/upload/${publicId}`,
  },
  promo: {
    createPromo: (vendorId: string) => `/promotions/${vendorId}`,
  },
};
