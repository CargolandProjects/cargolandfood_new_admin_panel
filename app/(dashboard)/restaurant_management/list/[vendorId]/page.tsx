"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { approveOrRejectVendor, getCachedVendor } from "@/lib/api/vendors";

function displayValue(value?: string | number | boolean | null): string {
  if (value === null || value === undefined || value === "") return "N/A";
  return String(value);
}

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

function statusTheme(value?: boolean): string {
  return value ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600";
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 py-2 border-b border-gray-100 last:border-b-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-semibold text-[#1A1A1A] text-right">{value}</span>
    </div>
  );
}

function DocumentPreviewRow({
  label,
  imageUrl,
  linkLabel = "View full image",
}: {
  label: string;
  imageUrl?: string | null;
  linkLabel?: string;
}) {
  if (!imageUrl) {
    return <InfoRow label={label} value="N/A" />;
  }

  return (
    <div className="flex items-start justify-between gap-3 py-2 border-b border-gray-100 last:border-b-0">
      <span className="text-sm text-gray-500">{label}</span>
      <div className="flex flex-col items-end gap-2">
        <img
          src={imageUrl}
          alt={label}
          className="w-24 h-24 rounded-lg object-cover border border-gray-200"
        />
        <a
          href={imageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold text-[#F16622] hover:underline"
        >
          {linkLabel}
        </a>
      </div>
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

export default function RestaurantDetailsPage() {
  const router = useRouter();
  const params = useParams<{ vendorId: string }>();
  const vendorId = params?.vendorId;
  const vendor = vendorId ? getCachedVendor(vendorId) : undefined;
  const [actioning, setActioning] = useState<"APPROVE" | "REJECT" | null>(null);

  async function handleAction(action: "APPROVE" | "REJECT") {
    if (!vendorId || actioning) return;

    setActioning(action);
    try {
      await approveOrRejectVendor(vendorId, action);
      router.push("/restaurant_management/request");
    } catch (e: any) {
      alert(e.message ?? "Action failed. Please try again.");
    } finally {
      setActioning(null);
    }
  }

  return (
    <div className="p-6 space-y-6 bg-[#F8F9FA] min-h-screen">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-[#00302E]">Restaurant Details</h1>
        </div>

        {vendor && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-[#1A1A1A]">
              {displayValue(vendor.businessName)}
            </span>
            <span
              className={`px-3 py-1 rounded-lg text-[11px] font-bold ${statusTheme(
                vendor.isActive
              )}`}
            >
              {vendor.isActive ? "Active" : "Inactive"}
            </span>
            <div className="flex items-center gap-2 ml-2">
              <button
                title="Approve"
                disabled={actioning !== null}
                onClick={() => handleAction("APPROVE")}
                className="w-10 h-10 rounded-xl bg-green-100 hover:bg-green-200 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actioning === "APPROVE" ? (
                  <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Image
                    src="/images/icons/approve-icon.png"
                    alt="Approve"
                    width={22}
                    height={22}
                  />
                )}
              </button>
              <button
                title="Decline"
                disabled={actioning !== null}
                onClick={() => handleAction("REJECT")}
                className="w-10 h-10 rounded-xl bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actioning === "REJECT" ? (
                  <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Image
                    src="/images/icons/decline-icon.png"
                    alt="Decline"
                    width={22}
                    height={22}
                  />
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {!vendor ? (
        <div className="rounded-lg bg-white border border-gray-200 px-4 py-8 text-center text-sm text-gray-500">
          <p>Restaurant data unavailable.</p>
          <p>Please return to Restaurant Request page.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <SectionCard title="Business Profile">
              <InfoRow label="Business Name" value={displayValue(vendor.businessName)} />
              <InfoRow
                label="Business Category"
                value={displayValue(vendor.businessCategory)}
              />
              <InfoRow label="Cuisine Type" value={displayValue(vendor.cuisineType)} />
              <InfoRow label="Business Email" value={displayValue(vendor.businessEmail)} />
              <InfoRow
                label="Business Address"
                value={displayValue(vendor.businessAddress)}
              />
              <InfoRow label="Country" value={displayValue(vendor.country)} />
              <InfoRow label="Role" value={displayValue(vendor.role)} />
            </SectionCard>

            <SectionCard title="Owner & Contact">
              <InfoRow
                label="Owner Name"
                value={displayValue(
                  [vendor.firstName, vendor.lastName].filter(Boolean).join(" ")
                )}
              />
              <InfoRow label="Mobile Number" value={displayValue(vendor.mobileNumber)} />
              <InfoRow label="Personal ID" value={displayValue(vendor.personalId)} />
              <DocumentPreviewRow label="Profile Image" imageUrl={vendor.profileImg} />
              <InfoRow label="Social Account" value={displayValue(vendor.socialAccount)} />
              <DocumentPreviewRow
                label="Verification Document"
                imageUrl={vendor.fileUrl}
                linkLabel="View document"
              />
            </SectionCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <SectionCard title="Operations & Status">
              <InfoRow label="Go Live" value={displayValue(vendor.golive ? "Yes" : "No")} />
              <InfoRow label="Verified" value={displayValue(vendor.verified ? "Yes" : "No")} />
              <InfoRow
                label="Admin Approval"
                value={displayValue(vendor.adminApproved)}
              />
              <InfoRow label="Open Now" value={displayValue(vendor.isOpenNow ? "Yes" : "No")} />
              <InfoRow label="Online" value={displayValue(vendor.isOnline ? "Yes" : "No")} />
              <InfoRow label="Active" value={displayValue(vendor.isActive ? "Yes" : "No")} />
              <InfoRow
                label="Suspended"
                value={displayValue(vendor.isSuspended ? "Yes" : "No")}
              />
              <InfoRow
                label="Suspension Reason"
                value={displayValue(vendor.suspensionReason)}
              />
              <InfoRow
                label="Rejection Reason"
                value={displayValue(vendor.rejectionReason)}
              />
              <InfoRow
                label="Total Orders"
                value={displayValue(vendor.totalOrder)}
              />
              <InfoRow
                label="Pre-order Enabled"
                value={displayValue(vendor.isPreorder ? "Yes" : "No")}
              />
              <InfoRow
                label="Favourite"
                value={displayValue(vendor.isFavourite ? "Yes" : "No")}
              />
            </SectionCard>

            <SectionCard title="Configuration & Bank">
              <InfoRow
                label="Profile Completed"
                value={displayValue(vendor.isProfileCompleted ? "Yes" : "No")}
              />
              <InfoRow label="Menu Set" value={displayValue(vendor.isMenuSet ? "Yes" : "No")} />
              <InfoRow
                label="Grocery Set"
                value={displayValue(vendor.isGrocerySet ? "Yes" : "No")}
              />
              <InfoRow
                label="Operations Configured"
                value={displayValue(vendor.isOperationsConfigured ? "Yes" : "No")}
              />
              <InfoRow
                label="Bank Added"
                value={displayValue(vendor.isBankAdded ? "Yes" : "No")}
              />
              <InfoRow
                label="Location Set"
                value={displayValue(vendor.isLocationSet ? "Yes" : "No")}
              />
              <InfoRow label="Bank Name" value={displayValue(vendor.bankName)} />
              <InfoRow label="Account Number" value={displayValue(vendor.accountNumber)} />
              <InfoRow
                label="Bank Verification Number"
                value={displayValue(vendor.bankVerificationNumber)}
              />
              <InfoRow label="Zone ID" value={displayValue(vendor.zoneId)} />
              <InfoRow label="Latitude" value={displayValue(vendor.latitude)} />
              <InfoRow label="Longitude" value={displayValue(vendor.longitude)} />
            </SectionCard>
          </div>

          <SectionCard title="Technical & Timestamps">
            <InfoRow label="Vendor ID" value={displayValue(vendor.id)} />
            <InfoRow
              label="Business Type"
              value={displayValue(vendor.businessType)}
            />
            <InfoRow
              label="Company Registration Number"
              value={displayValue(vendor.companyRegistrationNumber)}
            />
            <InfoRow label="Tax ID" value={displayValue(vendor.taxId)} />
            <InfoRow label="Created At" value={formatDateTime(vendor.createdAt)} />
            <InfoRow label="Updated At" value={formatDateTime(vendor.updatedAt)} />
          </SectionCard>
        </>
      )}
    </div>
  );
}
