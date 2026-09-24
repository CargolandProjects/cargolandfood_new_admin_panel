import { apiCall } from "../api/client";
import { API_ROUTES } from "../api/endpoints";
import { ApiResponse } from "./vendor.service";

interface UploadImage {
  message: string;
  url: string;
  publicId: string;
}
type UploadImageRes = ApiResponse<UploadImage>;

export interface UploadedImage {
  url: string; // Cloudinary secure_url
  publicId: string; // Cloudinary public_id — required for delete
}

export const image = {
  async uploadImageToCloudinary({
    file,
    userEmail,
  }: {
    file: File;
    userEmail: string;
  }) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userEmail", userEmail);

    const res = apiCall<UploadImageRes>(API_ROUTES.image.upload, {
      method: "POST",
      body: formData,
    });
    return res;
  },

  async deleteImageFromStorage(publicId: string): Promise<void> {
    await apiCall(API_ROUTES.image.delete(encodeURIComponent(publicId)), {
      method: "DELETE",
    });
  },
};
