"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { fetchRider, approveOrRejectRider, type Rider } from "@/lib/api/riders";

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
}: {
  label: string;
  imageUrl?: string | null;
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
          View full image
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

export default function PersonnelDetailsPage() {
  const params = useParams<{ riderId: string }>();
  const router = useRouter();
  const riderId = params?.riderId;

  const [rider, setRider] = useState<Rider | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [actioning, setActioning] = useState<"APPROVE" | "REJECT" | null>(null);

  useEffect(() => {
    if (!riderId) {
      setLoading(false);
      return;
    }
    fetchRider(riderId)
      .then(setRider)
      .catch(() => setRider(undefined))
      .finally(() => setLoading(false));
  }, [riderId]);

  async function handleAction(action: "APPROVE" | "REJECT") {
    if (!riderId || actioning) return;
    setActioning(action);
    try {
      await approveOrRejectRider(riderId, action);
      router.push("/delivery_management/personnel-list");
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "Action failed. Please try again.";
      alert(message);
    } finally {
      setActioning(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8F9FA]">
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          Loading personnel details…
        </div>
      </div>
    );
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
          <h1 className="text-2xl font-bold text-[#00302E]">Personnel Details</h1>
        </div>

        {rider && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-[#1A1A1A]">
              {displayValue(rider.fullName)}
            </span>
            <span
              className={`px-3 py-1 rounded-lg text-[11px] font-bold ${statusTheme(
                rider.isActive
              )}`}
            >
              {rider.isActive ? "Active" : "Inactive"}
            </span>

            {rider.adminApproved === "PENDING" && (
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
            )}
          </div>
        )}
      </div>

      {!rider ? (
        <div className="rounded-lg bg-white border border-gray-200 px-4 py-8 text-center text-sm text-gray-500">
          <p>Personnel data unavailable.</p>
          <p>Please return to Personnel List page.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <SectionCard title="Profile">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                  {rider.profileImg ? (
                    <img
                      src={rider.profileImg}
                      alt={rider.fullName}
                      className="w-12 h-12 object-cover"
                    />
                  ) : (
                    <span className="text-sm font-bold text-gray-500">
                      {rider.fullName?.slice(0, 1) || "R"}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-base font-bold text-[#1A1A1A]">
                    {displayValue(rider.fullName)}
                  </p>
                  <p className="text-xs text-gray-500">{displayValue(rider.emailAddress)}</p>
                </div>
              </div>
              <InfoRow label="Phone Number" value={displayValue(rider.phoneNumber)} />
              <InfoRow label="Gender" value={displayValue(rider.gender)} />
              <InfoRow label="Role" value={displayValue(rider.role)} />
              <InfoRow label="Referral Code" value={displayValue(rider.referralCode)} />
            </SectionCard>

            <SectionCard title="Identification">
              <InfoRow label="ID Type" value={displayValue(rider.identification)} />
              <InfoRow
                label="ID Number"
                value={displayValue(rider.identificationNumber)}
              />
              <DocumentPreviewRow
                label="ID Image"
                imageUrl={rider.identificationImg}
              />
              <InfoRow label="Vehicle Type" value={displayValue(rider.vehicleType)} />
              <InfoRow label="Zone ID" value={displayValue(rider.zoneId)} />
            </SectionCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <SectionCard title="Guarantor">
              <InfoRow label="Guarantor Name" value={displayValue(rider.guarantorName)} />
              <InfoRow
                label="Guarantor Number"
                value={displayValue(rider.guarantorNumber)}
              />
            </SectionCard>

            <SectionCard title="Bank Details">
              <InfoRow label="Bank" value={displayValue(rider.selectBank)} />
              <InfoRow label="Account Name" value={displayValue(rider.accountName)} />
              <InfoRow label="Account Number" value={displayValue(rider.accountNumber)} />
            </SectionCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <SectionCard title="Operations & Status">
              <InfoRow
                label="Total Deliveries"
                value={displayValue(rider.totalDeliveredOrder)}
              />
              <InfoRow label="Active" value={displayValue(rider.isActive ? "Yes" : "No")} />
              <InfoRow label="Online" value={displayValue(rider.isOnline ? "Yes" : "No")} />
              <InfoRow
                label="Location Set"
                value={displayValue(rider.isLocationSet ? "Yes" : "No")}
              />
              <InfoRow
                label="System Notifications"
                value={displayValue(rider.systemNotification ? "Yes" : "No")}
              />
              <InfoRow
                label="Admin Approval"
                value={displayValue(rider.adminApproved)}
              />
              <InfoRow
                label="Rejection Reason"
                value={displayValue(rider.rejectionReason)}
              />
            </SectionCard>

            <SectionCard title="Technical & Timestamps">
              <InfoRow label="Rider ID" value={displayValue(rider.id)} />
              <InfoRow label="Admin ID" value={displayValue(rider.adminId)} />
              <InfoRow label="Created At" value={formatDateTime(rider.createdAt)} />
              <InfoRow label="Updated At" value={formatDateTime(rider.updatedAt)} />
            </SectionCard>
          </div>
        </>
      )}
    </div>
  );
}
