import { promo } from "@/lib/services/promo.service";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreatePromo = () => {
  return useMutation({
    mutationFn: promo.createPromo,
    onSuccess: (res) => {
      toast.success(res.message || "Promo created");
    },
    onError: (res) => {
      toast.error(res.message || "Promo creation failed");
    },
  });
};
