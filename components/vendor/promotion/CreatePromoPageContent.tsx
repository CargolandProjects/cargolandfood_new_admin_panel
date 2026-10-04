"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { ArrowLeft, X } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import ImageUploadField from "@/components/vendor/menu/ImageUploadField";
import LoadingOverlay from "@/components/LoadingOverlay";
import { useIsMutating } from "@tanstack/react-query";
import { UploadedImage } from "@/lib/services/image.service";
import { useSession } from "@/lib/providers/SessionProvider";
import { toast } from "sonner";
import z from "zod";
import { useCreateVendorMenu } from "@/lib/hooks/mutations/useVendorMenu";
import { useVendorMenu } from "@/lib/hooks/queries/useVendor";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { MenuItem } from "@/lib/services/vendor.service";
import MenuItemCombobox from "./MenuItemCombobox";
import { formatNumber } from "@/lib/utils";
import { useCreatePromo } from "@/lib/hooks/mutations/useMutatePromo";
import PromoDetailsModal from "./PromoDetailsModal";
import { Promotion } from "@/lib/services/promo.service";

export const promotionMenuItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  uploadImageUrl: z.string(),
});

export const createPromotionSchema = z
  .object({
    campaignName: z.string().min(1, "Campaign name is required"),
    discountValue: z.string().min(1, "Discount value is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    appliedTo: z.array(promotionMenuItemSchema).default([]).optional(),
    campaignImgUrl: z.string().min(1, "Image is required"),
    publicImgUrl: z.string().min(1, "Image is required"),
  })
  .superRefine((data, ctx) => {
    // Wait until all four pieces are present before cross-field checks
    if (!data.startDate || !data.startTime || !data.endDate || !data.endTime) {
      return;
    }

    const start = new Date(`${data.startDate}T${data.startTime}`);
    const end = new Date(`${data.endDate}T${data.endTime}`);
    const now = new Date();

    if (Number.isNaN(start.getTime())) {
      ctx.addIssue({
        code: "custom",
        path: ["startDate"],
        message: "Invalid start date or time",
      });
      return;
    }

    if (Number.isNaN(end.getTime())) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "Invalid end date or time",
      });
      return;
    }

    if (start <= now) {
      ctx.addIssue({
        code: "custom",
        path: ["startDate"],
        message: "Start date and time must be in the future",
      });
    }

    if (end <= start) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "End date and time must be after the start",
      });
    }
  });

export type CreatePromotionFormData = z.infer<typeof createPromotionSchema>;
export type PromotionMenuItem = z.infer<typeof promotionMenuItemSchema>;

const toISODate = (d: Date) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const CreatePromotion = ({ vendorId }: { vendorId: string }) => {
  const router = useRouter();
  const session = useSession();
  const [menuSearch, setMenuSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [promoDetails, setPromoDetails] = useState<Promotion | null>(null);
  const debouncedMenuSearch = useDebounce(menuSearch, 400);

  const { mutate: createPromotion, isPending } = useCreatePromo();
  const { data: vendorMenu, isFetching } = useVendorMenu(vendorId);

  const isUploading = useIsMutating({ mutationKey: ["upload-image"] }) > 0;
  const isDeleting = useIsMutating({ mutationKey: ["delete-image"] }) > 0;
  const isImageAction = isUploading || isDeleting;
  const menuItems =
    vendorMenu?.data.map((i) => ({
      id: i.id,
      name: i.name,
      description: i.description,
      uploadImageUrl: i.uploadImageUrl,
    })) ?? [];

  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    setError,
    clearErrors,
    formState,
  } = useForm<CreatePromotionFormData>({
    resolver: zodResolver(createPromotionSchema),
    defaultValues: {
      campaignName: "",
      discountValue: "",
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
      appliedTo: [],
      campaignImgUrl: "",
      publicImgUrl: "",
    },
  });

  // Log form errors during development
  useEffect(() => {
    console.log("FORM_STATE: ", formState.errors);
  }, [formState.errors]);

  const watchedMenuItems = watch("appliedTo") ?? [];
  const publicId = watch("publicImgUrl");
  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const startTime = watch("startTime");

  const todayISO = toISODate(new Date()); // YYYY-MM-DD in local time
  const now = new Date();
  const currentTimeHHMM = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  // Start time is only bounded by "now" when the start date is today
  const startTimeMin = startDate === todayISO ? currentTimeHHMM : undefined;

  // End time is only bounded by start time when both dates match
  const endTimeMin =
    endDate && startDate && endDate === startDate ? startTime : undefined;

  const handleToggleMenuItem = (item: PromotionMenuItem) => {
    const current = watch("appliedTo") ?? [];
    const exists = current.some((i) => i.id === item.id);
    const next = exists
      ? current.filter((i) => i.id !== item.id)
      : [
          ...current,
          {
            id: item.id,
            name: item.name,
            uploadImageUrl: item.uploadImageUrl,
          },
        ];

    setValue("appliedTo", next, { shouldValidate: true, shouldDirty: true });
  };

  const handleRemoveMenuItem = (item: MenuItem) => {
    handleToggleMenuItem(item);
  };

  const onSubmit = async (data: CreatePromotionFormData) => {
    if (!session) return;
    if (!vendorId) {
      toast.error("Vendor id not found");
      return;
    }

    const payload = {
      ...data,
      appliedTo: (data.appliedTo ?? []).map((item) => item.id),
    };

    console.log("CREATE PROMOTION PAYLOAD: ", payload);

    createPromotion(
      { vendorId, data: payload },
      {
        onSuccess: (res) => {
          setOpen(true);
          setPromoDetails(res.data);
          reset();
        },
      },
    );
  };

  const handleError = useCallback(
    (message: string | null) => {
      if (message) {
        setError("campaignImgUrl", { type: "manual", message });
      } else {
        clearErrors("campaignImgUrl");
      }
    },
    [setError, clearErrors],
  );

  const handleUpload = (image: UploadedImage | undefined) => {
    setValue("campaignImgUrl", image?.url ?? "", { shouldValidate: true });
    setValue("publicImgUrl", image?.publicId ?? "", { shouldValidate: true });
  };

  return (
    <>
      <LoadingOverlay loading={false} />

      <div className="mx-auto max-w-275 pb-10">
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
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <FieldSet className="p-4">
            <FieldGroup className="grid md:grid-cols-2 gap-6">
              {/* Campaign name */}
              <Controller
                control={control}
                name="campaignName"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="field">
                    <FieldLabel htmlFor={field.name} className="form-label">
                      Campaign name
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      placeholder="Weekend 20% off"
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

              {/* Discount value */}
              <Controller
                control={control}
                name="discountValue"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="field">
                    <FieldLabel htmlFor={field.name} className="form-label">
                      Discount value
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      value={formatNumber(field.value)}
                      onChange={(e) =>
                        field.onChange(e.target.value.replace(/\D/g, ""))
                      }
                      placeholder="20%"
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

              {/* Start date */}
              <Controller
                control={control}
                name="startDate"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="field">
                    <FieldLabel htmlFor={field.name} className="form-label">
                      Start date
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type="date"
                      min={todayISO}
                      placeholder="mm/dd/yyyy"
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

              {/* End date */}
              <Controller
                control={control}
                name="endDate"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="field">
                    <FieldLabel htmlFor={field.name} className="form-label">
                      End date
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type="date"
                      min={startDate || todayISO}
                      placeholder="mm/dd/yyyy"
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

              {/* Start time */}
              <Controller
                control={control}
                name="startTime"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="field">
                    <FieldLabel htmlFor={field.name} className="form-label">
                      Start time
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type="time"
                      min={startTimeMin}
                      placeholder="00:00 AM"
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

              {/* End time */}
              <Controller
                control={control}
                name="endTime"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="field">
                    <FieldLabel htmlFor={field.name} className="form-label">
                      End time
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type="time"
                      min={endTimeMin}
                      placeholder="11:59 PM"
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
            </FieldGroup>
          </FieldSet>

          <FieldSet className="p-4">
            <FieldGroup className="grid md:grid-cols-2 gap-6">
              {/* Applies to — combobox coming next */}
              <Controller
                control={control}
                name="appliedTo"
                render={({ fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="field">
                    <FieldLabel className="form-label">Applies to</FieldLabel>

                    {/* TODO: replace with MenuItemCombobox */}
                    <MenuItemCombobox
                      items={menuItems}
                      selected={watchedMenuItems}
                      onToggle={handleToggleMenuItem}
                      search={menuSearch}
                      onSearchChange={setMenuSearch}
                      isLoading={isFetching}
                      placeholder="All menu items"
                    />

                    {/* Selected menu items thumbnails */}
                    {watchedMenuItems.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-4">
                        {watchedMenuItems.map((item) => (
                          <div key={item.id} className="relative size-15">
                            <Image
                              src={item.uploadImageUrl}
                              alt={item.name}
                              fill
                              sizes="60px"
                              className="rounded-[6px] object-cover"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveMenuItem(item as MenuItem)
                              }
                              className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-white shadow-md transition-colors hover:bg-gray-50"
                              aria-label={`Remove ${item.name}`}
                            >
                              <X
                                className="size-3 text-[#F16622]"
                                strokeWidth={3}
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

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
                name="campaignImgUrl"
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
            </FieldGroup>
          </FieldSet>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="px-10 py-2.5 h-auto border-gray-200 text-sm font-medium rounded-sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || isImageAction}
              className="px-10 py-2.5 h-auto text-sm font-medium rounded-sm bg-primary/15 text-[#8B4513] hover:bg-[#fcd5be]"
            >
              {isPending ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>

        <PromoDetailsModal
          open={open}
          onOpenChange={setOpen}
          promotion={promoDetails}
        />
      </div>
    </>
  );
};

export default CreatePromotion;
