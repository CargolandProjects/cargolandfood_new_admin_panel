"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface NewCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (name: string) => void;
}

export function NewCategoryDialog({
  open,
  onOpenChange,
  onCreate,
}: NewCategoryDialogProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "" },
  });

  // Reset the form every time the dialog opens
  useEffect(() => {
    if (open) reset({ name: "" });
  }, [open, reset]);

  const onSubmit = (values: CategoryFormValues) => {
    onCreate(values.name);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[400px] p-6">
        <DialogTitle className="text-xl font-bold text-gray-900">
          New Category
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-5">
          <Field data-invalid={!!errors.name}>
            <FieldLabel htmlFor="category-name">Name</FieldLabel>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <Input
                  {...field}
                  id="category-name"
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

          <div className="grid grid-cols-2 gap-3 pt-1">
            <Button
              type="submit"
              className="h-11 rounded-xl bg-[#F16622] text-white hover:bg-[#d95b1c]"
            >
              Create
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
