"use client";

import { useCallback, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { formatNumber } from "@/lib/utils";
import ImageUploadField from "./ImageUploadField";
import { UploadedImage } from "@/lib/services/image.service";
import z from "zod";
import { AddonFormValues } from "@/lib/schema/menu";

interface CreateAddonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (values: AddonFormValues) => void;
  title?: string;
  submitLabel?: string;
}

export const addonSchema = z.object({
  name: z.string().min(1, "Add-on name is required"),
  price: z.string().min(2, "Price is required"),
  addonImage: z.string().min(1, "Addon image is required"),
  publicUrl: z.string().min(1, "Image is required"),
});

type AddonFormData = z.infer<typeof addonSchema>;

export function CreateAddonModal({
  open,
  onOpenChange,
  onAdd,
  title = "Create Add-on",
  submitLabel = "Add",
}: CreateAddonDialogProps) {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    setError,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<AddonFormData>({
    resolver: zodResolver(addonSchema),
    defaultValues: { name: "", price: "", addonImage: "", publicUrl: "" },
  });
  const publicId = watch("publicUrl");

  useEffect(() => {
    if (open) reset({ name: "", price: "" });
  }, [open, reset]);

  const onSubmit = (data: AddonFormData) => {
    const { publicUrl, ...values } = data;
    onAdd(values);
    onOpenChange(false);
  };

  const handleUpload = (image: UploadedImage | undefined) => {
    setValue("addonImage", image?.url ?? "", {
      shouldValidate: true,
    });
    setValue("publicUrl", image?.publicId ?? "", {
      shouldValidate: true,
    });
  };
  const handleError = useCallback((message: string | null) => {
    if (message) {
      setError("addonImage", { type: "manual", message });
    } else {
      clearErrors("addonImage");
    }
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-100! px-7! py-6! gap-6">
        <DialogTitle className="text-xl font-bold text-gray-900">
          {title}
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Controller
            control={control}
            name="name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-1">
                <FieldLabel htmlFor={field.name} className="font-medium">
                  Name
                </FieldLabel>

                <Input
                  {...field}
                  id={field.name}
                  placeholder="e.g Burgers"
                  aria-invalid={fieldState.invalid}
                  className="h-10! focus-visible:ring-1! focus-visible:ring-primary! border-none! rounded-[6px]! placeholder:text-xs placeholder:font-medium placeholder:text-neutral-300! bg-gray-100/70!"
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

          <Controller
            control={control}
            name="price"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-1">
                <FieldLabel htmlFor={field.name} className="font-medium">
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
                  className="h-10! focus-visible:ring-1! focus-visible:ring-primary! border-none! rounded-[6px]! placeholder:text-xs placeholder:font-medium placeholder:text-neutral-300! bg-gray-100/70!"
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
            name="addonImage"
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

          <div className="grid grid-cols-2 gap-3 pt-1">
            <Button
              type="submit"
              className="py-3 h-auto bg-primary font-bold text-white hover:bg-primary/90 duration-200 rounded-lg"
            >
              {submitLabel}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="py-3 h-auto font-bold text-gray-500 border-gray-300 rounded-lg"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
