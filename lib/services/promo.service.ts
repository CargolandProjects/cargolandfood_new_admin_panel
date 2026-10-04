import { apiCall } from "../api/client";
import { API_ROUTES } from "../api/endpoints";
import { ApiResponse } from "./vendor.service";

export type PromotionType = "PERCENTAGE_DISCOUNT";
export type PromotionStatus = "ACTIVE" | "INACTIVE";

export interface Promotion {
  id: string;
  vendorId: string;
  campaignName: string;
  discountValue: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  appliedTo: string[];
  campaignImgUrl: string;
  publicImgUrl: string;
  type: PromotionType;
  status: PromotionStatus;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

type CreatePromoRes = ApiResponse<Promotion>;

export const promo = {
  async createPromo({ vendorId, data }: { vendorId: string; data: unknown }) {
    const res = apiCall<CreatePromoRes>(
      API_ROUTES.promo.createPromo(vendorId),
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );

    return res;
  },
};
