import { vendor } from "@/lib/services/vendor.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreateVendorMenu = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: vendor.createVendorMenu,
    onSuccess: (res, { vendorId }) => {
      toast.success(res.data.message);
      queryClient.removeQueries({ queryKey: ["vendor-menu", vendorId] });
      console.log("Execution Finished", vendorId);
    },
    onError: () => {
      // console.log("I EXECUTED AND I DON'T KNOW WHY");
      toast.error("Failed to create menu");
    },
  });
};

export const useEditVendorMenu = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: vendor.editVendorMenu,
    onSuccess: (res, { vendorId }) => {
      toast.success(res.data.message);
      queryClient.removeQueries({ queryKey: ["vendor-menu", vendorId] });
    },
    onError: () => {
      toast.error("Failed to edit menu");
    },
  });
};

export const useDeleteMenuItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: vendor.deleteMenuItem,
    onSuccess: (res, { vendorId, menuId }) => {
      toast.success(res.data.message);
      queryClient.invalidateQueries({
        queryKey: ["vendor-menu", vendorId],
      });
    },
    onError: () => {
      toast.error("Failed to delete Menu");
    },
  });
};
