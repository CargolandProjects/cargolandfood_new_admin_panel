import { vendor } from "@/lib/services/vendor.service";
import { useQuery } from "@tanstack/react-query";

export const useDashboard = () => {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: vendor.getDashboard,
    select: (res) => res.data,
  });
};

export const useVendorStat = () => {
  return useQuery({
    queryKey: ["vendor-stats"],
    queryFn: vendor.getVendorStats,
    select: (res) => res.data.data,
  });
};

export const useVendors = (
  page: number = 1,
  limit: number = 10,
  search?: string,
  status?: string,
  zoneId?: string,
) => {
  return useQuery({
    queryKey: ["vendor-list", { page, limit, search, status, zoneId }],
    queryFn: () => vendor.getVendors(page, limit, search, status, zoneId),
    select: (res) => res.data,
    placeholderData: (prev) => prev,
  });
};

export const useVendor = (id: string) => {
  return useQuery({
    queryKey: ["vendor", id],
    queryFn: () => vendor.getVendor(id),
    select: (res) => res.data,
    enabled: Boolean(id),
  });
};

export const useVendorMenu = (id: string) => {
  return useQuery({
    queryKey: ["vendor-menu", id],
    queryFn: () => vendor.getVendorMenu(id),
    select: (res) => res.data,  
    enabled: Boolean(id),
  });
};
