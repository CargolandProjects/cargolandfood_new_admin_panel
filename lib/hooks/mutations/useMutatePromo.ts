import { promo } from "@/lib/services/promo.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type TogglePayload = {
  vendorId: string;
  promoId: string;
  currentStatus: "ACTIVE" | "INACTIVE";
};

export const useCreatePromo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: promo.createPromo,
    onSuccess: (res, { vendorId }) => {
      toast.success(res.message || "Promo created");
      queryClient.removeQueries({
        queryKey: ["vendor-promos", vendorId],
      });
    },
    onError: (res) => {
      toast.error(res.message || "Promo creation failed");
    },
  });
};

export const useUpdatePromo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: promo.updatePromo,
    onSuccess: (res, { vendorId }) => {
      toast.success(res.message || "Promo created");
      queryClient.removeQueries({
        queryKey: ["vendor-promos", vendorId],
      });
    },
    onError: (res) => {
      toast.error(res.message || "Promo creation failed");
    },
  });
};

export const useTogglePromoStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ vendorId, promoId, currentStatus }: TogglePayload) => {
      return currentStatus === "ACTIVE"
        ? promo.deactivatePromo({ vendorId, promoId })
        : promo.activatePromo({ vendorId, promoId });
    },
    onSuccess: (res, { vendorId }) => {
      toast.success(res.message || "Promo activated");
      queryClient.invalidateQueries({
        queryKey: ["vendor-promos", vendorId],
      });
    },
    onError: (res, { currentStatus }) => {
      toast.error(
        res.message || currentStatus === "ACTIVE"
          ? "Failed to deactivate promotion"
          : "Failed to activate promotion",
      );
    },
  });
};

export const useDeletePromo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: promo.deletePromo,
    onSuccess: (res, { vendorId }) => {
      toast.success("promo deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["vendor-promos", vendorId],
      });
    },
    onError: () => {
      toast.error("Failed to delete promo");
    },
  });
};
