import { apiCall } from "../api/client";
import { API_ROUTES } from "../api/endpoints";

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_FORMATS = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export interface UploadedImage {
  imageUrl: string; // Cloudinary secure_url
  publicId: string; // Cloudinary public_id — required for delete
}

export const image = {
  async uploadImageToCloudinary(file: File): Promise<UploadedImage> {
    // Validate environment variables
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      throw new Error(
        "Cloudinary configuration is missing. Please check environment variables.",
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      throw new Error("Image size must be less than 5MB");
    }

    // Validate file format
    if (!ALLOWED_IMAGE_FORMATS.includes(file.type)) {
      throw new Error(
        "Invalid image format. Please use JPG, PNG, WEBP, or GIF",
      );
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("cloud_name", CLOUDINARY_CLOUD_NAME);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
          // No headers needed - fetch will set Content-Type automatically for FormData
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.error?.message ||
            `Upload failed with status ${response.status}`,
        );
      }

      const data = await response.json();
      return {
        imageUrl: data.secure_url, // Cloudinary secure_url
        publicId: data.public_id, // Cloudinary public_id — required for delete
      };
    } catch (error) {
      console.error("Cloudinary upload error:", error);

      // Handle other errors
      if (error instanceof Error) {
        throw error;
      }

      throw new Error("Image upload failed. Please try again");
    }
  },

  async deleteImageFromStorage(publicId: string): Promise<void> {
    await apiCall(API_ROUTES.image.delete(publicId), {
      method: "DELETE",
      body: JSON.stringify({ publicId }),
    });
  },
};
