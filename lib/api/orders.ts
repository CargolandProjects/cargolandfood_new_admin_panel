import { apiCall } from "./client";

// ── Types ────────────────────────────────────────────────────────────────────

export interface OrderItem {
  id: string;
  orderId?: string;
  menuId?: string;
  menuImg?: string;
  menuName: string;
  description?: string | null;
  unitPrice?: string;
  quantity: number;
  discountApplied?: string;
  totalPrice: string;
  createdAt?: string;
  addonItem?: Array<{
    id?: string;
    name?: string;
    price?: string;
    quantity?: number;
  }>;
}

export interface AddressSnapshot {
  id: string;
  city: string | null;
  state: string | null;
  userId: string;
  zoneId: string | null;
  country: string | null;
  placeId: string | null;
  latitude: string | null;
  provider: string | null;
  createdAt: string;
  longitude: string | null;
  updatedAt: string;
  newAddress: string | null;
  postalCode: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  instructions: string | null;
  setAddressDefault: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  userName: string;
  userImg?: string;
  vendorId?: string;
  riderId?: string | null;
  userContact: string;
  vendorName: string;
  vendorAddress?: string | null;
  vendorAddress2?: string | null;
  noteToRider?: string | null;
  noteToRestaurant?: string | null;
  cartId?: string;
  deliveryType?: string;
  addressSnapshot?: AddressSnapshot | null;
  paymentReference?: string | null;
  couponCode?: string | null;
  isCoupon?: boolean;
  isAssignedToRider?: boolean;
  status: string;
  paymentStatus: string;
  checkoutSessionId?: string;
  subtotal?: string;
  discountTotal?: string;
  deliveryFee?: string;
  serviceFee?: string;
  total: string;
  appliedDiscounts?: unknown;
  estimationTime?: string | null;
  acceptedAt?: string | null;
  preparedAt?: string | null;
  readyAt?: string | null;
  assignedAt?: string | null;
  pickedupAt?: string | null;
  riderOutsideAt?: string | null;
  deliveredAt?: string | null;
  cancelledAt?: string | null;
  createdAt: string;
  items?: OrderItem[];
}

export interface OrdersMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface OrdersResponse {
  status: string;
  message: string;
  data: Order[];
  meta?: OrdersMeta;
}

export const ordersCache = new Map<string, Order>();

export interface OrderRow {
  id: string;
  orderId: string;
  orderDate: string;
  customer: { name: string; phone: string };
  restaurant: string;
  amount: string;
  paymentStatus: "Paid" | "Unpaid";
  deliveryStatus: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatAmount(value: string): string {
  return Number(value || 0).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function mapPaymentStatus(status: string): "Paid" | "Unpaid" {
  return status === "PAID" ? "Paid" : "Unpaid";
}

function mapDeliveryStatus(status: string): string {
  const labels: Record<string, string> = {
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
    NEW: "New",
    ACCEPTED: "Accepted",
    PREPARING: "Preparing",
    PICKUP_ORDER: "Pick up",
    RIDER_OUTSIDE: "Arrived",
    ASSIGN_TO_RIDER: "Assigned",
    RIDER_ACCEPTED: "Rider Accepted",
  };
  return labels[status] ?? status.replace(/_/g, " ");
}

function mapOrderToRow(order: Order): OrderRow {
  return {
    id: order.id,
    orderId: order.orderNumber,
    orderDate: formatDate(order.createdAt),
    customer: {
      name: order.userName,
      phone: order.userContact,
    },
    restaurant: order.vendorName,
    amount: formatAmount(order.total),
    paymentStatus: mapPaymentStatus(order.paymentStatus),
    deliveryStatus: mapDeliveryStatus(order.status),
  };
}

// ── Status mapping for sidebar tabs ──────────────────────────────────────────

export const STATUS_MAP: Record<string, string> = {
  all: "",
  new: "NEW",
  accepted: "ACCEPTED",
  preparing: "PREPARING",
  processing: "PREPARING",
  ready: "PICKUP_ORDER",
  arrived: "RIDER_OUTSIDE",
  assign: "ASSIGN_TO_RIDER",
  "in-transit": "IN_TRANSIT",
  delivered: "DELIVERED",
  cancelled: "CANCELLED",
  "payment-failed": "FAILED",
};

// ── API call ─────────────────────────────────────────────────────────────────

export interface FetchOrdersParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  paymentStatus?: string;
  restaurantId?: string;
  customerId?: string;
  startDate?: string;
  endDate?: string;
}

export async function fetchOrders(params?: FetchOrdersParams): Promise<{ orders: OrderRow[]; meta: OrdersMeta }> {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 20;

  const queryParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (params?.status) queryParams.append("status", params.status);
  if (params?.search) queryParams.append("search", params.search);
  if (params?.paymentStatus) queryParams.append("paymentStatus", params.paymentStatus);
  if (params?.restaurantId) queryParams.append("restaurantId", params.restaurantId);
  if (params?.customerId) queryParams.append("customerId", params.customerId);
  if (params?.startDate) queryParams.append("startDate", params.startDate);
  if (params?.endDate) queryParams.append("endDate", params.endDate);

  const data = await apiCall<OrdersResponse>(
    `/orders?${queryParams.toString()}`,
    { method: "GET" }
  );

    const orders = data.data?.data ?? [];
  orders.forEach((order) => {
    ordersCache.set(order.id, order);
  });

  return {
    orders: orders.map(mapOrderToRow),
      meta: data.data?.meta ?? { total: 0, page, limit, totalPages: 0 },
  };
}

export function getCachedOrder(orderId: string): Order | undefined {
  return ordersCache.get(orderId);
}

// ── Status counts cache ──────────────────────────────────────────────────────

let statusCountsCache: Record<string, number> = {};
let countsCacheTimestamp = 0;
const COUNTS_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function fetchOrderStatusCounts(): Promise<Record<string, number>> {
  // Return cached counts if still fresh
  if (countsCacheTimestamp && Date.now() - countsCacheTimestamp < COUNTS_CACHE_TTL) {
    return statusCountsCache;
  }

  const counts: Record<string, number> = {
    all: 0,
    new: 0,
    accepted: 0,
    processing: 0,
    ready: 0,
    arrived: 0,
    assign: 0,
    "in-transit": 0,
    delivered: 0,
    cancelled: 0,
    "payment-failed": 0,
  };

  try {
    // Fetch count for each status (limit=1 to just get meta.total)
    for (const [statusKey, apiStatus] of Object.entries(STATUS_MAP)) {
      try {
        const { meta } = await fetchOrders({
          status: apiStatus,
          limit: 1,
        });
        counts[statusKey] = meta?.total ?? 0;
      } catch {
        counts[statusKey] = 0;
      }
    }
  } catch {
    return statusCountsCache || counts;
  }

  statusCountsCache = counts;
  countsCacheTimestamp = Date.now();
  return counts;
}
