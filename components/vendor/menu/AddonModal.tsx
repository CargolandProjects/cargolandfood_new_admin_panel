"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const addonSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.coerce
    .number({ invalid_type_error: "Price must be a number" })
    .positive("Price must be greater than 0"),
});

export type AddonFormValues = z.infer<typeof addonSchema>;

interface CreateAddonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (values: AddonFormValues) => void;
  title?: string;
  submitLabel?: string;
}

export function CreateAddonDialog({
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
    formState: { errors },
  } = useForm<AddonFormValues>({
    resolver: zodResolver(addonSchema),
    defaultValues: { name: "", price: undefined as unknown as number },
  });

  useEffect(() => {
    if (open) reset({ name: "", price: undefined as unknown as number });
  }, [open, reset]);

  const onSubmit = (values: AddonFormValues) => {
    onAdd(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[400px] p-6">
        <DialogTitle className="text-xl font-bold text-gray-900">
          {title}
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-5">
          <Field data-invalid={!!errors.name}>
            <FieldLabel htmlFor="addon-name">Name</FieldLabel>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <Input
                  {...field}
                  id="addon-name"
                  placeholder="e.g. Burgers"
                  aria-invalid={!!errors.name}
                  className="h-12 rounded-xl bg-gray-50"
                />
              )}
            />
            <FieldError
              errors={errors.name ? [errors.name.message ?? ""] : undefined}
            />
          </Field>

          <Field data-invalid={!!errors.price}>
            <FieldLabel htmlFor="addon-price">Price</FieldLabel>
            <Controller
              control={control}
              name="price"
              render={({ field }) => (
                <Input
                  id="addon-price"
                  type="number"
                  inputMode="decimal"
                  placeholder="₦0"
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                  aria-invalid={!!errors.price}
                  className="h-12 rounded-xl bg-gray-50"
                />
              )}
            />
            <FieldError
              errors={errors.price ? [errors.price.message ?? ""] : undefined}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <Button
              type="submit"
              className="h-11 rounded-xl bg-[#F16622] text-white hover:bg-[#d95b1c]"
            >
              {submitLabel}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-11 rounded-xl border-gray-200 text-gray-700"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
