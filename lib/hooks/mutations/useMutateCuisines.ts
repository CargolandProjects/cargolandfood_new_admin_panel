import { cuisines } from "@/lib/services/cuisines.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreateCuisines = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cuisines.createCuisines,
    onSuccess: () => {
      toast.success("Cuisine created successfully");
      queryClient.invalidateQueries({ queryKey: ["cuisines"] });
    },
    onError: () => {
      toast.error("Failed to create Cuisine");
    },
  });
};
