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

export const useVendorList = (
  page: number = 1,
  limit: number = 10,
  search?: string,
  status?: string,
  zoneId?: string,
) => {
  return useQuery({
    queryKey: ["vendor-list", { page, limit, search, status, zoneId }],
    queryFn: () => vendor.getVendorList(page, limit, search, status, zoneId),
    select: (res) => res.data.data,
    placeholderData: (prev) => prev
  });
};
