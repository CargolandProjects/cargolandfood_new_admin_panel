"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { ArrowLeft, Plus, PlusCircle, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
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
import { CreateExtraModal, type AddonFormValues } from "@/components/vendor/menu/CreateExtraModal";
import { createMenuSchema, type CreateMenuFormData } from "@/lib/schema/menu";
import { useIsMutating } from "@tanstack/react-query";
import { UploadedImage } from "@/lib/services/image.service";
import { formatNumber } from "@/lib/utils";

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
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [addonDialogOpen, setAddonDialogOpen] = useState(false);
  const [sizeDialogOpen, setSizeDialogOpen] = useState(false);

  const isUploading = useIsMutating({ mutationKey: ["upload-image"] }) > 0;
  const router = useRouter();
  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    setError,
    clearErrors,
    formState: { isSubmitting },
  } = useForm<CreateMenuFormData>({
    resolver: zodResolver(createMenuSchema),
    defaultValues: {
      category: "",
      name: "",
      description: "",
      price: "",
      imageUrl: "",
      publicId: "",
      addons: [],
      sizes: [],
    },
  });

  const addonsArray = useFieldArray({ control, name: "addons" });
  const sizesArray = useFieldArray({ control, name: "sizes" });

  const watchedAddons = watch("addons") || [];
  const watchedSizes = watch("sizes") || [];
  const publicId = watch("publicId");

  const onSubmit = async (data: CreateMenuFormData) => {
    console.log(data);
    // router.push(`/vendor-management/${vendorId}/menu`);
  };

  const handleError = useCallback((message: string | null) => {
    if (message) {
      setError("imageUrl", { type: "manual", message });
    } else {
      clearErrors("imageUrl");
    }
  }, []);

  const handleUpload = (image: UploadedImage | undefined) => {
    setValue("imageUrl", image?.imageUrl ?? "", {
      shouldValidate: true,
    });
    setValue("publicId", image?.publicId ?? "", {
      shouldValidate: true,
    });
  };

  const handleCreateCategory = (name: string) => {
    console.log("CATEGORY SELECTED: ", name);
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
      <div className="mb-6 flex items-center gap-6">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="p-2 gap-1 border-gray-200 text-neutral-500 text-xs rounded-md"
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>
        <h1 className="text-base font-bold">Create Menu</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <FieldSet className="p-4">
          <FieldLegend className="pt-4 text-base font-bold">
            General information
          </FieldLegend>

          <FieldGroup className="grid md:grid-cols-2 gap-6">
            {/* Category */}
            <Controller
              name="category"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="field">
                  <div className="flex items-center justify-between">
                    <FieldLabel htmlFor={field.name} className="form-label">
                      Category
                    </FieldLabel>
                    <button
                      type="button"
                      onClick={() => setCategoryDialogOpen(true)}
                      className="text-xs font-medium text-primary hover:underline underline-offset-2"
                    >
                      + New
                    </button>
                  </div>

                  <Select
                    name={field.name}
                    value={field.value ?? ""}
                    onValueChange={field.onChange ?? ""}
                  >
                    <SelectTrigger
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      className="form-input "
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
                  {fieldState.invalid && (
                    <FieldError
                      errors={[fieldState.error]}
                      className="form-error"
                    />
                  )}
                </Field>
              )}
            />

            {/* Name */}
            <Controller
              control={control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="field">
                  <FieldLabel htmlFor={field.name} className="form-label">
                    Name
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    placeholder="e.g Fish biscuits"
                    aria-invalid={fieldState.invalid}
                    className="form-input"
                  />
                  {fieldState.invalid && (
                    <FieldError
                      errors={[fieldState.error]}
                      className="form-error"
                    />
                  )}
                </Field>
              )}
            />

            {/* Description */}
            <Controller
              control={control}
              name="description"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="field">
                  <FieldLabel htmlFor={field.name} className="form-label">
                    Description
                  </FieldLabel>

                  <Input
                    {...field}
                    id={field.name}
                    placeholder="Select a e.g Fish fried with flour"
                    aria-invalid={fieldState.invalid}
                    className="form-input"
                  />

                  {fieldState.invalid && (
                    <FieldError
                      errors={[fieldState.error]}
                      className="form-error"
                    />
                  )}
                </Field>
              )}
            />

            {/* Price */}
            <Controller
              control={control}
              name="price"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="field">
                  <FieldLabel htmlFor={field.name} className="form-label">
                    Price
                  </FieldLabel>

                  <Input
                    {...field}
                    id={field.name}
                    value={formatNumber(field.value)}
                    onChange={(e) =>
                      field.onChange(e.target.value.replace(/\D/g, ""))
                    }
                    placeholder="₦0"
                    aria-invalid={fieldState.invalid}
                    className="form-input"
                  />

                  {fieldState.invalid && (
                    <FieldError
                      errors={[fieldState.error]}
                      className="form-error"
                    />
                  )}
                </Field>
              )}
            />

            {/* Upload Image */}
            <Controller
              control={control}
              name="imageUrl"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="field">
                  <FieldLabel htmlFor={field.name} className="form-label">
                    Upload Image
                  </FieldLabel>
                  <ImageUploadField
                    value={field.value}
                    onChange={handleUpload}
                    onBlur={field.onBlur}
                    onError={handleError}
                    invalid={fieldState.invalid}
                    publicId={publicId}
                  />
                  {fieldState.invalid && (
                    <FieldError
                      errors={[fieldState.error]}
                      className="form-error"
                    />
                  )}
                </Field>
              )}
            />

            {/* Right column */}
            <div className="space-y-6">
              {/* Create add-ons */}
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Create add-ons</h3>
                  <button
                    type="button"
                    onClick={() => setAddonDialogOpen(true)}
                    className="text-primary hover:opacity-80"
                    aria-label="Add add-on"
                  >
                    <PlusCircle className="size-5" strokeWidth={2.5} />
                  </button>
                </div>

                {watchedAddons.length > 0 && (
                  <ul className="mt-3 space-y-1.5">
                    {watchedAddons.map((addon, index) => (
                      <li
                        key={addonsArray.fields[index]?.id}
                        className="p-2.5 flex items-center justify-between text-xs font-medium border-2 border-gray-100 rounded-sm"
                      >
                        <span className="text-gray-700">{addon.name}</span>
                        <div className="flex gap-1 items-center">
                          <span className="text-gray-500">
                            ₦{formatNumber(addon.price)}
                          </span>
                          <button
                            type="button"
                            onClick={() => addonsArray.remove(index)}
                            className="text-gray-400 hover:text-red-500"
                            aria-label={`Remove ${addon.name}`}
                          >
                            <X className="size-4 text-neutral-300" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Sizes */}
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Sizes</h3>
                  <button
                    type="button"
                    onClick={() => setSizeDialogOpen(true)}
                    className="text-primary  hover:opacity-80"
                    aria-label="Add size"
                  >
                    <PlusCircle className="size-5" strokeWidth={2.5} />
                  </button>
                </div>

                {watchedSizes.length > 0 && (
                  <ul className="mt-3 space-y-1.5">
                    {watchedSizes.map((size, index) => (
                      <li
                        key={sizesArray.fields[index]?.id}
                        className="p-2.5 flex items-center justify-between text-xs font-medium border-2 border-gray-100 rounded-sm"
                      >
                        <span className="text-gray-700">{size.name}</span>
                        <div className="flex gap-1 items-center">
                          <span className="text-gray-500">
                            ₦{formatNumber(size.price)}
                          </span>
                          <button
                            type="button"
                            onClick={() => sizesArray.remove(index)}
                            className="text-gray-400 hover:text-red-500"
                            aria-label={`Remove ${size.name}`}
                          >
                            <X className="size-4 text-neutral-300" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </FieldGroup>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
              className="px-10 py-2.5 h-auto border-gray-200 text-sm font-medium rounded-sm "
            >
              Reset
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="px-10 py-2.5 h-auto text-sm font-medium rounded-sm bg-primary/15 text-[#8B4513] hover:bg-[#fcd5be]"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </FieldSet>
      </form>

      {/* Modals */}
      <NewCategoryDialog
        open={categoryDialogOpen}
        onOpenChange={setCategoryDialogOpen}
        onCreate={handleCreateCategory}
      />
      <CreateExtraModal
        open={addonDialogOpen}
        onOpenChange={setAddonDialogOpen}
        onAdd={handleAddAddon}
      />
      <CreateExtraModal
        open={sizeDialogOpen}
        onOpenChange={setSizeDialogOpen}
        onAdd={handleAddSize}
        title="Add Size"
        submitLabel="Add"
      />
    </div>
  );
}
