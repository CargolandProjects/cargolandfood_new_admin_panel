"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ImageUploadField from "@/components/vendor/menu/ImageUploadField";
import { NewCategoryDialog } from "@/components/vendor/menu/NewCategoryModal";
import {
  CreateAddonDialog,
  type AddonFormValues,
} from "@/components/vendor/menu/AddonModal";
import { createMenuSchema, type CreateMenuFormData } from "@/lib/schema/menu";

const DEFAULT_CATEGORIES = [
  "Restaurant",
  "Groceries",
  "Market",
  "Food Ingredients",
];

export default function CreateMenuPageContent({
  vendorId,
}: {
  vendorId: string;
}) {
  const router = useRouter();

  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [addonDialogOpen, setAddonDialogOpen] = useState(false);
  const [sizeDialogOpen, setSizeDialogOpen] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateMenuFormData>({
    resolver: zodResolver(createMenuSchema),
    defaultValues: {
      category: "",
      name: "",
      description: "",
      price: 0,
      image: "",
      addons: [],
      sizes: [],
    },
  });

  const addonsArray = useFieldArray({ control, name: "addons" });
  const sizesArray = useFieldArray({ control, name: "sizes" });

  const watchedAddons = watch("addons") || [];
  const watchedSizes = watch("sizes") || [];

  const onSubmit = async (data: CreateMenuFormData) => {
    console.log(data);
    // router.push(`/vendor-management/${vendorId}/menu`);
  };

  const handleCreateCategory = (name: string) => {
    setCategories((prev) => [name, ...prev]);
    setValue("category", name);
  };

  const handleAddAddon = (values: AddonFormValues) => {
    addonsArray.append(values);
  };

  const handleAddSize = (values: AddonFormValues) => {
    sizesArray.append(values);
  };

  return (
    <div className="mx-auto max-w-[1100px] pb-10">
      {/* Top bar */}
      <div className="mb-6 flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.back()}
          className="h-9 w-9 rounded-lg border-gray-200"
          aria-label="Go back"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-bold text-gray-900">Create Menu</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <h2 className="text-base font-bold text-gray-900">
          General information
        </h2>

        <div className="grid grid-cols-1 gap-x-8 gap-y-6 lg:grid-cols-2">
          {/* ── Left column ──────────────────────────────── */}
          <div className="space-y-6">
            {/* Category */}
            <Field data-invalid={!!errors.category}>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="menu-category">Category</FieldLabel>
                <button
                  type="button"
                  onClick={() => setCategoryDialogOpen(true)}
                  className="text-xs font-medium text-[#F16622] hover:underline"
                >
                  + New
                </button>
              </div>
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="menu-category"
                      aria-invalid={!!errors.category}
                      className="h-12 w-full rounded-xl border-gray-200 text-sm text-gray-700"
                    >
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError
                errors={
                  errors.category ? [errors.category.message ?? ""] : undefined
                }
              />
            </Field>

            {/* Description */}
            <Field data-invalid={!!errors.description}>
              <FieldLabel htmlFor="menu-description">Description</FieldLabel>
              <Controller
                control={control}
                name="description"
                render={({ field }) => (
                  <Textarea
                    {...field}
                    id="menu-description"
                    placeholder="Select a e.g Fish fried with flour"
                    aria-invalid={!!errors.description}
                    className="min-h-[120px] rounded-xl border-gray-200 text-sm"
                  />
                )}
              />
              <FieldError
                errors={
                  errors.description
                    ? [errors.description.message ?? ""]
                    : undefined
                }
              />
            </Field>

            {/* Upload Image */}
            <Field data-invalid={!!errors.image}>
              <FieldLabel>Upload Image</FieldLabel>
              <Controller
                control={control}
                name="image"
                render={({ field, fieldState }) => (
                  <ImageUploadField
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    invalid={fieldState.invalid}
                  />
                )}
              />
              <FieldError
                errors={errors.image ? [errors.image.message ?? ""] : undefined}
              />
            </Field>
          </div>

          {/* ── Right column ─────────────────────────────── */}
          <div className="space-y-6">
            {/* Name */}
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="menu-name">Name</FieldLabel>
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <Input
                    {...field}
                    id="menu-name"
                    placeholder="e.g Fish biscuits"
                    aria-invalid={!!errors.name}
                    className="h-12 rounded-xl border-gray-200 text-sm"
                  />
                )}
              />
              <FieldError
                errors={errors.name ? [errors.name.message ?? ""] : undefined}
              />
            </Field>

            {/* Price */}
            <Field data-invalid={!!errors.price}>
              <FieldLabel htmlFor="menu-price">Price</FieldLabel>
              <Controller
                control={control}
                name="price"
                render={({ field }) => (
                  <Input
                    id="menu-price"
                    type="number"
                    inputMode="decimal"
                    placeholder="₦0"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                    aria-invalid={!!errors.price}
                    className="h-12 rounded-xl border-gray-200 text-sm"
                  />
                )}
              />
              <FieldError
                errors={errors.price ? [errors.price.message ?? ""] : undefined}
              />
            </Field>

            {/* Create add-ons */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-800">
                  Create add-ons
                </span>
                <button
                  type="button"
                  onClick={() => setAddonDialogOpen(true)}
                  className="text-[#F16622] hover:opacity-80"
                  aria-label="Add add-on"
                >
                  <Plus className="h-5 w-5" strokeWidth={2.5} />
                </button>
              </div>

              {watchedAddons.length > 0 && (
                <ul className="mt-2 space-y-1.5">
                  {watchedAddons.map((addon, index) => (
                    <li
                      key={addonsArray.fields[index]?.id}
                      className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm"
                    >
                      <span className="text-gray-700">
                        {addon.name} — ₦{addon.price}
                      </span>
                      <button
                        type="button"
                        onClick={() => addonsArray.remove(index)}
                        className="text-gray-400 hover:text-red-500"
                        aria-label={`Remove ${addon.name}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Sizes */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-800">Sizes</span>
                <button
                  type="button"
                  onClick={() => setSizeDialogOpen(true)}
                  className="text-[#F16622] hover:opacity-80"
                  aria-label="Add size"
                >
                  <Plus className="h-5 w-5" strokeWidth={2.5} />
                </button>
              </div>

              {watchedSizes.length > 0 && (
                <ul className="mt-2 space-y-1.5">
                  {watchedSizes.map((size, index) => (
                    <li
                      key={sizesArray.fields[index]?.id}
                      className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm"
                    >
                      <span className="text-gray-700">
                        {size.name} — ₦{size.price}
                      </span>
                      <button
                        type="button"
                        onClick={() => sizesArray.remove(index)}
                        className="text-gray-400 hover:text-red-500"
                        aria-label={`Remove ${size.name}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => reset()}
            className="h-11 rounded-xl border-gray-200 px-8 text-sm font-medium"
          >
            Reset
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-11 rounded-xl bg-[#FDE3D3] px-10 text-sm font-medium text-[#8B4513] hover:bg-[#fcd5be]"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>

      {/* Modals */}
      <NewCategoryDialog
        open={categoryDialogOpen}
        onOpenChange={setCategoryDialogOpen}
        onCreate={handleCreateCategory}
      />
      <CreateAddonDialog
        open={addonDialogOpen}
        onOpenChange={setAddonDialogOpen}
        onAdd={handleAddAddon}
      />
      <CreateAddonDialog
        open={sizeDialogOpen}
        onOpenChange={setSizeDialogOpen}
        onAdd={handleAddSize}
        title="Add Size"
        submitLabel="Add"
      />
    </div>
  );
}
