import { z } from "zod";

export const addonSchema = z.object({
  name: z.string().min(1, "Add-on name is required"),
  price: z.string().min(2, "Price is required"),
});

export const sizeSchema = z.object({
  name: z.string().min(1, "Size name is required"),
  price: z.string().min(2, "Price is required"),
});

export const createMenuSchema = z.object({
  category: z.string().min(1, "Category is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.string().min(2, "Price is required"),
  //   price: z.coerce
  //     .number({ invalid_type_error: "Price must be a number" })
  //     .positive("Price must be greater than 0"),
  imageUrl: z.string().url("Image is required").or(z.literal("")),
  publicId: z.string().min(1, "Image is required"),
  addons: z.array(addonSchema).default([]).optional(),
  sizes: z.array(sizeSchema).default([]).optional(),
});

export type CreateMenuFormData = z.infer<typeof createMenuSchema>;
