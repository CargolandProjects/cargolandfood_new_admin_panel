import { z } from "zod";

export const addonSchema = z.object({
  name: z.string().min(1, "Add-on name is required"),
  price: z.string().min(2, "Price is required"),
  addonImage: z.string().url("Addon image is required"),
});

export const sizeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  size: z.string().min(1, "Size name is required"),
  price: z.string().min(2, "Price is required"),
});

export const createMenuSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  // createdBy: z.string().min(1, "Creator Name is required"),
  categoryId: z.string().min(1, "Category is required"),
  price: z.string().min(2, "Price is required"),
  //   price: z.coerce
  //     .number({ invalid_type_error: "Price must be a number" })
  //     .positive("Price must be greater than 0"),
  uploadImageUrl: z.string().min(1, "Image is required"),
  publicUrl: z.string().min(1, "Image is required"),
  addons: z.array(addonSchema).default([]).optional(),
  sizes: z.array(sizeSchema).default([]).optional(),
});

export type CreateMenuFormData = z.infer<typeof createMenuSchema>;
export type AddonFormValues = z.infer<typeof addonSchema>;
export type sizeFormValues = z.infer<typeof sizeSchema>;
