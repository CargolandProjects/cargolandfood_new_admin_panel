import { image } from "@/lib/services/image.service";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUploadImage = () => {
  return useMutation({
    mutationFn: image.uploadImageToCloudinary,
    onSuccess: () => toast.success("Image upload successful"),
    onError: () => toast.error("Image upload failed"),
  });
};
