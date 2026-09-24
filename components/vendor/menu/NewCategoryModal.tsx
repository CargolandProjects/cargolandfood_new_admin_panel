"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useCreateCuisines } from "@/lib/hooks/mutations/useMutateCuisines";
import { useSession } from "@/lib/providers/SessionProvider";

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface NewCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewCategoryDialog({
  open,
  onOpenChange,
}: NewCategoryDialogProps) {
  const { mutate, isPending } = useCreateCuisines();
  const { control, handleSubmit, reset } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "" },
  });

  const session = useSession();

  // Reset the form every time the dialog opens
  useEffect(() => {
    if (open) reset({ name: "" });
  }, [open, reset]);

  const onSubmit = (data: CategoryFormValues) => {
    if (!session?.id) return;

    const payload = { ...data, createdBy: session?.id };
    mutate(payload, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[400px] py-6! px-7! gap-6!">
        <DialogTitle className="text-2xl font-bold">New Category</DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            control={control}
            name="name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-1">
                <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="e.g. Burgers"
                  aria-invalid={fieldState.invalid}
                  className="h-10! focus-visible:ring-1! focus-visible:ring-primary! border-none! rounded-[6px]! placeholder:text-xs placeholder:font-medium placeholder:text-neutral-300! bg-gray-100/70!"
                />
              </Field>
            )}
          />

          <div className="mt-6 grid grid-cols-2 gap-4">
            <Button
              type="submit"
              disabled={isPending}
              className="py-3 h-auto bg-primary font-bold text-white hover:bg-primary/90 duration-200 rounded-lg"
            >
              Create
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
