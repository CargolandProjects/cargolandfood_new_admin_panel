import { CreatePromotionFormData } from "@/components/vendor/promotion/CreatePromoPageContent";
import { apiCall } from "../api/client";
import { API_ROUTES } from "../api/endpoints";
import { ApiResponse } from "./vendor.service";

export type DiscountType = "PERCENTAGE";
export type ApplyType = "MENU_ITEMS";
export type PromotionStatus = "ACTIVE" | "INACTIVE";

interface PromotionMenuItemSummary {
  name: string;
  price: string;
  uploadImageUrl: string;
  publicUrl: string | null;
  categoryId: string;
}

export interface PromotionItem {
  menuItemId: string;
  menuItem: PromotionMenuItemSummary;
}

export interface Promotion {
  id: string;
  isDiscount: boolean;
  discountType: DiscountType;
  percentageValue: number;
  applyType: ApplyType;
  startDate: string;
  endDate: string;
  startTime: string | null;
  endTime: string | null;
  vendorId: string;
  zoneId: string;
  campaignImgUrl: string;
  publicImgUrl: string;
  campaignName: string;
  createdById: string;
  status: PromotionStatus;
  activatedAt: string | null;
  deactivatedAt: string | null;
  createdAt: string;
  updatedAt: string;
  items: PromotionItem[];
}

type CreatePromoRes = ApiResponse<Promotion>;
type CreatePromoData = Omit<CreatePromotionFormData, "appliedTo"> & {
  appliedTo: string[];
  zoneId: string;
};
type VendorPromotionsRes = ApiResponse<Promotion[]>;

export const promo = {
  async createPromo({
    vendorId,
    data,
  }: {
    vendorId: string;
    data: CreatePromoData;
  }) {
    const res = apiCall<CreatePromoRes>(
      API_ROUTES.promo.createPromo(vendorId),
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );

    return res;
  },

  async updatePromo({
    vendorId,
    promoId,
    data,
  }: {
    vendorId: string;
    promoId: string;
    data: CreatePromoData;
  }) {
    const res = apiCall<CreatePromoRes>(
      API_ROUTES.promo.updatePromo(vendorId, promoId),
      {
        method: "PATCH",
        body: JSON.stringify(data),
      },
    );
    return res;
  },

  async activatePromo({
    vendorId,
    promoId,
  }: {
    vendorId: string;
    promoId: string;
  }) {
    const res = apiCall<CreatePromoRes>(
      API_ROUTES.promo.activatePromo(vendorId, promoId),
      {
        method: "POST",
      },
    );
    return res;
  },

  async deactivatePromo({
    vendorId,
    promoId,
  }: {
    vendorId: string;
    promoId: string;
  }) {
    const res = apiCall<CreatePromoRes>(
      API_ROUTES.promo.deactivatePromo(vendorId, promoId),
      {
        method: "POST",
      },
    );
    return res;
  },

  async getVendorPromotions(vendorId: string) {
    const res = apiCall<VendorPromotionsRes>(
      API_ROUTES.promo.vendorPromotions(vendorId),
      {
        method: "GET",
      },
    );
    return res;
  },

  async getPromoById(vendorId: string, promoId: string) {
    const res = apiCall<CreatePromoRes>(
      API_ROUTES.promo.getPromoById(vendorId, promoId),
      {
        method: "GET",
      },
    );
    return res;
  },

  async deletePromo({
    vendorId,
    promoId,
  }: {
    vendorId: string;
    promoId: string;
  }) {
    const res = apiCall(API_ROUTES.promo.deletePromotion(vendorId, promoId), {
      method: "DELETE",
    });
    return res;
  },
};
