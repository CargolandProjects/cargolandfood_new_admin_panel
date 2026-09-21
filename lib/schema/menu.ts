import { z } from "zod";

const addonSchema = z.object({
  name: z.string().min(1, "Add-on name is required"),
  price: z.coerce
    .number({ invalid_type_error: "Price must be a number" })
    .positive("Price must be greater than 0"),
});

const sizeSchema = z.object({
  name: z.string().min(1, "Size name is required"),
  price: z.coerce
    .number({ invalid_type_error: "Price must be a number" })
    .positive("Price must be greater than 0"),
});

export const createMenuSchema = z.object({
  category: z.string().min(1, "Category is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce
    .number({ invalid_type_error: "Price must be a number" })
    .positive("Price must be greater than 0"),
  //   price: z.coerce
  //     .number({ invalid_type_error: "Price must be a number" })
  //     .positive("Price must be greater than 0"),
  image: z.string().url().min(1, "Image is required").optional(),
  addons: z.array(addonSchema).default([]).optional(),
  sizes: z.array(sizeSchema).default([]).optional(),
});

export type CreateMenuFormData = z.infer<typeof createMenuSchema>;
