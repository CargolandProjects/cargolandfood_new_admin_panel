"use client";

import Image from "next/image";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Promotion } from "@/lib/services/promo.service";
import { formatDate } from "@/lib/utils";

interface PromotionDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  promotion: Promotion | null;
  onEdit?: (promotion: Promotion) => void;
}

const formatTime = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const displayHour = h === 0 ? 0 : h > 12 ? h - 12 : h;
  return `${String(displayHour).padStart(2, "0")}:${String(m).padStart(2, "0")} ${period}`;
};

const formatDiscount = (value: string, type: Promotion["type"]) => {
  if (type === "PERCENTAGE_DISCOUNT") return `${value}%`;
  return `₦${Number(value).toLocaleString()}`;
};

const formatAppliesTo = (appliedTo: string[]) =>
  appliedTo.length === 0
    ? "All menu items"
    : `${appliedTo.length} item${appliedTo.length > 1 ? "s" : ""} selected`;

export default function PromoDetailsModal({
  open,
  onOpenChange,
  promotion,
  onEdit,
}: PromotionDetailsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {promotion && (
        <DialogContent
          showCloseButton={false}
          className="max-w-100! gap-0 overflow-hidden border-none px-7 py-6 shadow-xl"
        >
          {/* Header */}
          <DialogHeader className="gap-0">
            <div className="mb-5 flex items-start justify-between relative">
              <DialogTitle className="text-2xl font-bold">
                Promotion Details
              </DialogTitle>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                aria-label="Close"
                className="absolute -top-2 right-0 flex size-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition-colors hover:bg-gray-200"
              >
                <X className="size-4" />
              </button>
            </div>
          </DialogHeader>

          {/* Hero card */}
          <div className="mt-1 relative min-h-[106px] overflow-hidden rounded-[6px] bg-gray-50">
            <Image
              src={promotion.campaignImgUrl}
              alt={promotion.campaignName}
              fill
              sizes="(max-width: 520px) 100vw, 520px"
              className="object-cover object-right"
            />

            {/* Gradient overlay for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/8 to-transparent" />

            {/* Text content */}
            <div className="relative z-10 flex h-full max-w-[65%] flex-col justify-center px-4 py-2">
              <p className="text-base font-bold leading-tight text-white">
                {promotion.campaignName}
              </p>
              <p className="mt-1 text-xs leading-snug text-white/90">
                We are here with the best Burgers in town.
              </p>
              <Button
                type="button"
                className="mt-1 w-fit rounded-[3px] bg-white h-auto px-5 py-1 text-[10px] font-semibold text-gray-900 shadow-sm transition-colors hover:bg-gray-50"
              >
                Buy Now
              </Button>
            </div>
          </div>

          {/* Campaign name */}
          <div className="mt-6">
            <p className="text-sm text-gray-400">Campaign name</p>
            <p className="mt-1.5 text-base font-medium text-gray-900">
              {promotion.campaignName}
            </p>
          </div>

          {/* Two-column grid */}
          <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5">
            <div>
              <p className="text-sm text-gray-400">Discount value</p>
              <p className="mt-1.5 text-base font-medium text-gray-900">
                {formatDiscount(promotion.discountValue, promotion.type)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Applies to</p>
              <p className="mt-1.5 text-base font-medium text-gray-900">
                {formatAppliesTo(promotion.appliedTo)}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-400">Start date</p>
              <p className="mt-1.5 text-base font-medium text-gray-900">
                {formatDate(promotion.startDate)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">End date</p>
              <p className="mt-1.5 text-base font-medium text-gray-900">
                {formatDate(promotion.endDate)}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-400">Start time</p>
              <p className="mt-1.5 text-base font-medium text-gray-900">
                {formatTime(promotion.startTime)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">End time</p>
              <p className="mt-1.5 text-base font-medium text-gray-900">
                {formatTime(promotion.endTime)}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-7 flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-11 flex-1 rounded-lg border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => onEdit?.(promotion)}
              className="h-11 flex-1 rounded-lg bg-[#F16622] text-sm font-semibold text-white hover:bg-[#d95b1c]"
            >
              Edit
            </Button>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
