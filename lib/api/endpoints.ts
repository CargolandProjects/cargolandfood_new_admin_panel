export const API_ROUTES = {
  stats: {
    dashboard: "/dashboard",
  },

  vendor: {
    allVendorStats: "/vendors/stats",
    vendorStats: (vendorId: string) =>
      `/vendors/get-vendor-dashboard-management/${vendorId}`,
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
    updatePromo: (vendorId: string, promoId: string) =>
      `/promotions/${vendorId}/${promoId}`,
    vendorPromotions: (vendorId: string) =>
      `/promotions/get-all/promotions/${vendorId}`,
    activePromoVendors: "/promotions/get-all/active-promotions",
    getPromoById: (vendorId: string, promoId: string) =>
      `/promotions/get/promotions/${vendorId}/${promoId}`,
    activatePromo: (vendorId: string, promoId: string) =>
      `/promotions/activate/${vendorId}/${promoId}`,
    deactivatePromo: (vendorId: string, promoId: string) =>
      `/promotions/deactivate/${vendorId}/${promoId}`,
    deletePromotion: (vendorId: string, promoId: string) =>
      `/promotions/get-all/promotions/${vendorId}/${promoId}`,
  },
};
