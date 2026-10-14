import { promo } from "@/lib/services/promo.service";
import { useQuery } from "@tanstack/react-query";

export const useVendorPromotions = (vendorId: string) => {
  return useQuery({
    queryKey: ["vendor-promos", vendorId],
    queryFn: () => promo.getVendorPromotions(vendorId),
    enabled: !!vendorId,
    select: (res) => ({
      ...res,
      data: [...res.data].sort((a, b) => {
        // ACTIVE first
        if (a.status !== b.status) {
          return a.status === "ACTIVE" ? -1 : 1;
        }
        // then most recently updated
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      }),
    }),
  });
};

export const usePromoById = (vendorId: string, promoId: string) => {
  return useQuery({
    queryKey: ["vendor-promo", vendorId, promoId],
    queryFn: () => promo.getPromoById(vendorId, promoId),
    select: (res) => res.data,
    enabled: !!(vendorId && promoId),
  });
};
