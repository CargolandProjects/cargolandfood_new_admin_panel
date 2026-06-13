"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCachedOrder } from "@/lib/api/orders";

function formatDateTime(value?: string | null): string {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatMoney(value?: string | null): string {
  const amount = Number(value ?? 0);
  if (Number.isNaN(amount)) return "₦0.00";
  return `₦${amount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function displayValue(value?: string | number | boolean | null): string {
  if (value === null || value === undefined || value === "") return "N/A";
  return String(value);
}

function statusTheme(status: string): string {
  const upper = status.toUpperCase();
  if (upper.includes("DELIVERED") || upper.includes("PAID")) {
    return "bg-green-100 text-green-700";
  }
  if (upper.includes("CANCELLED") || upper.includes("FAILED")) {
    return "bg-red-100 text-red-700";
  }
  if (upper.includes("PENDING") || upper.includes("UNPAID")) {
    return "bg-yellow-100 text-yellow-700";
  }
  return "bg-blue-100 text-blue-700";
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 py-2 border-b border-gray-100 last:border-b-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-semibold text-[#1A1A1A] text-right">{value}</span>
    </div>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
      <h2 className="text-base font-bold text-[#00302E] mb-3">{title}</h2>
      {children}
    </section>
  );
}

export default function OrderDetailsPage() {
  const params = useParams<{ orderId: string }>();
  const orderId = params?.orderId;
  const order = orderId ? getCachedOrder(orderId) : undefined;

  const timeline = useMemo(
    () => [
      { label: "Created", value: formatDateTime(order?.createdAt) },
      { label: "Accepted", value: formatDateTime(order?.acceptedAt) },
      { label: "Prepared", value: formatDateTime(order?.preparedAt) },
      { label: "Ready", value: formatDateTime(order?.readyAt) },
      { label: "Assigned", value: formatDateTime(order?.assignedAt) },
      { label: "Picked Up", value: formatDateTime(order?.pickedupAt) },
      { label: "Rider Outside", value: formatDateTime(order?.riderOutsideAt) },
      { label: "Delivered", value: formatDateTime(order?.deliveredAt) },
      { label: "Cancelled", value: formatDateTime(order?.cancelledAt) },
    ],
    [order]
  );

  return (
    <div className="p-6 space-y-6 bg-[#F8F9FA] min-h-screen">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/order_management/all"
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <h1 className="text-2xl font-bold text-[#00302E]">Order Details</h1>
        </div>

        {order && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-[#1A1A1A]">{order.orderNumber}</span>
            <span
              className={`px-3 py-1 rounded-lg text-[11px] font-bold ${statusTheme(order.status)}`}
            >
              {order.status.replace(/_/g, " ")}
            </span>
            <span
              className={`px-3 py-1 rounded-lg text-[11px] font-bold ${statusTheme(order.paymentStatus)}`}
            >
              {order.paymentStatus}
            </span>
          </div>
        )}
      </div>

      {!order ? (
        <div className="rounded-lg bg-white border border-gray-200 px-4 py-8 text-center text-sm text-gray-500">
          <p>Order data unavailable.</p>
          <p>Please return to Orders page.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <SectionCard title="Customer">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                  {order.userImg ? (
                    <img
                      src={order.userImg}
                      alt={order.userName}
                      className="w-12 h-12 object-cover"
                    />
                  ) : (
                    <span className="text-sm font-bold text-gray-500">
                      {order.userName?.slice(0, 1) || "U"}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-base font-bold text-[#1A1A1A]">{displayValue(order.userName)}</p>
                  <p className="text-xs text-gray-500">{displayValue(order.userContact)}</p>
                </div>
              </div>
              <InfoRow label="User ID" value={displayValue(order.userId)} />
            </SectionCard>

            <SectionCard title="Vendor">
              <InfoRow label="Vendor Name" value={displayValue(order.vendorName)} />
              <InfoRow label="Address 1" value={displayValue(order.vendorAddress)} />
              <InfoRow label="Address 2" value={displayValue(order.vendorAddress2)} />
              <InfoRow label="Vendor ID" value={displayValue(order.vendorId)} />
            </SectionCard>

            <SectionCard title="Delivery">
              <InfoRow label="Delivery Type" value={displayValue(order.deliveryType)} />
              <InfoRow
                label="Assigned To Rider"
                value={displayValue(order.isAssignedToRider ? "Yes" : "No")}
              />
              <InfoRow label="Rider ID" value={displayValue(order.riderId)} />
              <InfoRow label="Note To Rider" value={displayValue(order.noteToRider)} />
              <InfoRow
                label="Note To Restaurant"
                value={displayValue(order.noteToRestaurant)}
              />
            </SectionCard>

            <SectionCard title="Payment & Totals">
              <InfoRow label="Subtotal" value={formatMoney(order.subtotal)} />
              <InfoRow label="Delivery Fee" value={formatMoney(order.deliveryFee)} />
              <InfoRow label="Service Fee" value={formatMoney(order.serviceFee)} />
              <InfoRow label="Discount" value={formatMoney(order.discountTotal)} />
              <InfoRow label="Total" value={formatMoney(order.total)} />
              <InfoRow label="Payment Reference" value={displayValue(order.paymentReference)} />
              <InfoRow
                label="Checkout Session ID"
                value={displayValue(order.checkoutSessionId)}
              />
              <InfoRow label="Coupon Code" value={displayValue(order.couponCode)} />
            </SectionCard>
          </div>

          <SectionCard title="Address Snapshot">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <InfoRow label="Address Line 1" value={displayValue(order.addressSnapshot?.addressLine1)} />
              <InfoRow label="Address Line 2" value={displayValue(order.addressSnapshot?.addressLine2)} />
              <InfoRow label="City" value={displayValue(order.addressSnapshot?.city)} />
              <InfoRow label="State" value={displayValue(order.addressSnapshot?.state)} />
              <InfoRow label="Country" value={displayValue(order.addressSnapshot?.country)} />
              <InfoRow label="Postal Code" value={displayValue(order.addressSnapshot?.postalCode)} />
              <InfoRow label="Latitude" value={displayValue(order.addressSnapshot?.latitude)} />
              <InfoRow label="Longitude" value={displayValue(order.addressSnapshot?.longitude)} />
              <InfoRow label="Place ID" value={displayValue(order.addressSnapshot?.placeId)} />
              <InfoRow label="Provider" value={displayValue(order.addressSnapshot?.provider)} />
              <InfoRow
                label="Instructions"
                value={displayValue(order.addressSnapshot?.instructions)}
              />
              <InfoRow
                label="Default Address"
                value={displayValue(order.addressSnapshot?.setAddressDefault ? "Yes" : "No")}
              />
            </div>
          </SectionCard>

          <SectionCard title="Items Ordered">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs text-gray-500 uppercase border-b border-gray-100">
                    <th className="py-2">Item</th>
                    <th className="py-2">Unit Price</th>
                    <th className="py-2">Qty</th>
                    <th className="py-2">Discount</th>
                    <th className="py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {(order.items ?? []).map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 last:border-b-0">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden">
                            {item.menuImg ? (
                              <img
                                src={item.menuImg}
                                alt={item.menuName}
                                className="object-cover w-10 h-10"
                              />
                            ) : null}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[#1A1A1A]">
                              {displayValue(item.menuName)}
                            </p>
                            <p className="text-xs text-gray-500">{displayValue(item.description)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-sm text-gray-700">{formatMoney(item.unitPrice)}</td>
                      <td className="py-3 text-sm text-gray-700">{displayValue(item.quantity)}</td>
                      <td className="py-3 text-sm text-gray-700">
                        {formatMoney(item.discountApplied)}
                      </td>
                      <td className="py-3 text-sm font-semibold text-right text-[#1A1A1A]">
                        {formatMoney(item.totalPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <SectionCard title="Order Timeline">
              {timeline.map((event) => (
                <InfoRow key={event.label} label={event.label} value={event.value} />
              ))}
            </SectionCard>

            <SectionCard title="Technical Identifiers">
              <InfoRow label="Order ID" value={displayValue(order.id)} />
              <InfoRow label="User ID" value={displayValue(order.userId)} />
              <InfoRow label="Vendor ID" value={displayValue(order.vendorId)} />
              <InfoRow label="Rider ID" value={displayValue(order.riderId)} />
              <InfoRow label="Cart ID" value={displayValue(order.cartId)} />
              <InfoRow label="Zone ID" value={displayValue(order.addressSnapshot?.zoneId)} />
            </SectionCard>
          </div>
        </>
      )}
    </div>
  );
}
