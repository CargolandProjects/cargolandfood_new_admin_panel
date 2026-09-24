import { vendor } from "@/lib/services/vendor.service";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreateVendorMenu = () => {
  return useMutation({
    mutationFn: vendor.createVendorMenu,
    onSuccess: (res) => {
      toast.success(res.data.message);
    },
    onError: () => {
      toast.error("Failed to create Menu");
    },
  });
};
