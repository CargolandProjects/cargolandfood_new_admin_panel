"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircle, ImageIcon, Loader2, X } from "lucide-react";

import { useUploadImage } from "@/lib/hooks/mutations/useImage";
import { cn } from "@/lib/utils";

interface ImageUploadFieldProps {
  value?: string;
  onChange: (url: string | undefined) => void;
  onBlur?: () => void;
  onUploadingChange?: (uploading: boolean) => void;
  invalid?: boolean;

}

const ALLOWED = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024;

export default function ImageUploadField({
  value,
  onChange,
  onBlur,
  onUploadingChange,
  invalid,

}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const { mutate, isPending, error, reset } = useUploadImage();

  useEffect(() => {
    onUploadingChange?.(isPending);
  }, [isPending, onUploadingChange]);

  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  const handleFile = (file: File | undefined) => {
    setValidationError(null);
    reset();
    if (!file) return;

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

    mutate(file, {
      onSuccess: (url) => {
        URL.revokeObjectURL(previewUrl);
        setLocalPreview(null);
        onChange(url);
        // fileName stays — we want it after upload completes
      },
      onError: () => {
        URL.revokeObjectURL(previewUrl);
        setLocalPreview(null);
        setFileName(null);
      },
    });
  };

  const handleRemove = () => {
    onChange(undefined);
    setLocalPreview(null);
    setFileName(null);
    setValidationError(null);
    reset();
    if (inputRef.current) inputRef.current.value = "";
  };

  const displayUrl = localPreview ?? value ?? null;
  const errorMessage = validationError ?? error?.message ?? null;

  if (displayUrl) {
    return (
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
          {isPending ? (
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
        {errorMessage && <ErrorLine message={errorMessage} />}
      </div>
    );
  }

  return (
    <div className="space-y-2">
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
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50/60 px-6 py-10 text-center transition-colors hover:border-gray-300 hover:bg-gray-50",
          (invalid || errorMessage) && "border-red-400 bg-red-50/40",
        )}
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm">
          <ImageIcon className="h-4 w-4 text-gray-500" />
        </div>
        <p className="text-sm font-medium text-gray-700">Upload document</p>
        <p className="text-xs text-gray-500">
          Allowed formats include .png & .jpg less than 1 mb
        </p>
        <input
          ref={inputRef}
          type="file"
          accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(e) => {
            handleFile(e.target.files?.[0]);
            onBlur?.();
          }}
        />
      </div>
      {errorMessage && <ErrorLine message={errorMessage} />}
    </div>
  );
}

function ErrorLine({ message }: { message: string }) {
  return (
    <p className="flex items-center gap-1 text-xs text-red-500">
      <AlertCircle className="h-3 w-3" />
      {message}
    </p>
  );
}
