"use client";

import { useEffect, useRef, useState } from "react";
import { ImageIcon, Loader2, X } from "lucide-react";

import { useDeleteImage, useUploadImage } from "@/lib/hooks/mutations/useImage";
import { cn } from "@/lib/utils";
import { type UploadedImage } from "@/lib/services/image.service";
import { toast } from "sonner";
import { useSession } from "@/lib/providers/SessionProvider";

interface ImageUploadFieldProps {
  value?: string;
  publicId?: string;
  onChange: (image: UploadedImage | undefined) => void;
  onError?: (message: string | null) => void;
  onBlur?: () => void;
  invalid?: boolean;
}

const ALLOWED = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024;

export default function ImageUploadField({
  value,
  publicId,
  onChange,
  onError,
  onBlur,
  invalid,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const { mutate, isPending, error, reset } = useUploadImage();
  const { mutate: removeFromStorage, isPending: isDeleting } = useDeleteImage();

  const displayUrl = localPreview ?? value ?? null;
  const errorMessage = validationError ?? error?.message ?? null;
  const session = useSession();

  const isAction = isPending || isDeleting;
  // Report the merged error up to the parent whenever it changes
  useEffect(() => {
    onError?.(errorMessage);
  }, [errorMessage, onError]);

  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  const handleFile = (file: File | undefined) => {
    setValidationError(null);
    reset();
    if (!file || !session?.email) return;

    if (!ALLOWED.includes(file.type)) {
      setValidationError("Only JPG, PNG and WEBP formats are allowed");
      return;
    }
    if (file.size > MAX_SIZE) {
      setValidationError("Image must be less than 5MB");
      return;
    }

    setFileName(file.name);

    const previewUrl = URL.createObjectURL(file);
    setLocalPreview(previewUrl);

    mutate(
      { file: file, userEmail: session.email },
      {
        onSuccess: (image) => {
          URL.revokeObjectURL(previewUrl);
          setLocalPreview(null);
          onChange(image.data);
        },
        onError: () => {
          URL.revokeObjectURL(previewUrl);
          setLocalPreview(null);
          setFileName(null);
        },
      },
    );
  };
  const handleRemove = () => {
    console.log("DELETING_PUBLIC_ID", publicId);
    if (inputRef.current) inputRef.current.value = "";

    if (publicId) {
      removeFromStorage(publicId, {
        onSuccess: () => {
          onChange(undefined);
          setLocalPreview(null);
          setFileName(null);
          setValidationError(null);
          reset();
        },
        onError: () => {
          toast.error("Failed to delete image");
        },
      });
    }
  };

  return (
    <>
      {displayUrl && (
        <div className="space-y-2">
          <div
            className={cn(
              "relative flex items-center gap-3 rounded-lg border border-gray-200 p-3",
              isPending && "opacity-70",
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={displayUrl}
              alt={fileName ?? "Preview"}
              className="h-14 w-14 rounded-md object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-900">
                {isPending ? "Uploading..." : (fileName ?? "Image")}
              </p>
              <p className="text-xs text-gray-500">
                {isPending ? "Please wait" : "Ready to save"}
              </p>
            </div>
            {isAction ? (
              <Loader2 className="h-4 w-4 animate-spin text-[#F16622]" />
            ) : (
              <button
                type="button"
                onClick={handleRemove}
                className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                aria-label="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {!displayUrl && (
        <div className="px-10 lg:px-12.5 py-8 lg:py-11.25 border border-[#FDE7DA] rounded-sm">
          <div
            onClick={() => !isPending && inputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFile(e.dataTransfer.files?.[0]);
              onBlur?.();
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
            className={cn(
              "px-6.5 py-6.25 flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-gray-200 bg-gray-200/90 text-center transition-colors duration-200 hover:border-gray-300 hover:bg-gray-100",
              invalid || errorMessage ? "border-red-400 bg-red-50/40" : "",
            )}
          >
            <div className="flex gap-2 items-center">
              <div className="size-9 flex items-center justify-center rounded-full bg-white">
                <ImageIcon className="size-5" />
              </div>
              <p className="text-xs">Upload document</p>
            </div>
            <p className="text-xs text-gray-500">
              Allowed formats include .png & .jpg less than 5 mb
            </p>
            <input
              ref={inputRef}
              type="file"
              // accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={(e) => {
                handleFile(e.target.files?.[0]);
                onBlur?.();
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
