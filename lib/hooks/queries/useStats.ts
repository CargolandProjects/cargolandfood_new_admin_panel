import { stats } from "@/lib/services/stats.service";
import { useQuery } from "@tanstack/react-query";

export const useVendorStat = () => {
  return useQuery({
    queryKey: ["vendor-stats"],
    queryFn: stats.getVendorStats,
  });
};
