"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Upload } from "lucide-react";
import { createVendor, type CreateVendorPayload } from "@/lib/api/vendors";

const EMPTY_FORM: CreateVendorPayload = {
  businessName: "",
  firstName: "",
  lastName: "",
  country: "",
  businessEmail: "",
  mobileNumber: "",
  businessAddress: "",
  businessCategory: "",
  cuisineType: "",
  socialAccount: "",
  profileImg: "",
};

export default function AddNewRestaurantPage() {
  const router = useRouter();
  const [form, setForm] = useState<CreateVendorPayload>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function set(field: keyof CreateVendorPayload, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await createVendor(form);
      setSuccess(true);
      setTimeout(() => router.push("/restaurant_management/list"), 1500);
    } catch (err: any) {
      setError(err.message ?? "Failed to create restaurant. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-black focus:outline-none focus:border-[#F16622]/60 placeholder:text-gray-400";

  return (
    <>
      <style jsx global>{`
        input, select, textarea { color: #000 !important; }
        input::placeholder, textarea::placeholder { color: #9ca3af; }
      `}</style>

      <div className="p-6 w-full">
        <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-8">

          {success && (
            <div className="mb-6 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700 font-medium">
              Restaurant created successfully. Redirecting…
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-10">

            {/* ── Section 1: Owner Details ─────────────────────────────── */}
            <section className="space-y-6">
              <h2 className="text-[16px] font-bold text-black">Owner Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                {/* First Name */}
                <div className="space-y-2 max-w-[500px]">
                  <label className="text-[13px] text-gray-400">First Name</label>
                  <input
                    type="text"
                    placeholder="Enter first name"
                    value={form.firstName}
                    onChange={(e) => set("firstName", e.target.value)}
                    required
                    className={inputClass}
                  />
                </div>

                {/* Last Name */}
                <div className="space-y-2 max-w-[500px]">
                  <label className="text-[13px] text-gray-400">Last Name</label>
                  <input
                    type="text"
                    placeholder="Enter last name"
                    value={form.lastName}
                    onChange={(e) => set("lastName", e.target.value)}
                    required
                    className={inputClass}
                  />
                </div>

                {/* Country */}
                <div className="space-y-2 max-w-[500px]">
                  <label className="text-[13px] text-gray-400">Country</label>
                  <input
                    type="text"
                    placeholder="e.g. NG"
                    value={form.country}
                    onChange={(e) => set("country", e.target.value)}
                    required
                    className={inputClass}
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-2 max-w-[500px]">
                  <label className="text-[13px] text-gray-400">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    value={form.mobileNumber}
                    onChange={(e) => set("mobileNumber", e.target.value)}
                    required
                    className={inputClass}
                  />
                </div>

              </div>
            </section>

            {/* ── Section 2: Restaurant Details ────────────────────────── */}
            <section className="space-y-6">
              <h2 className="text-[16px] font-bold text-black">Restaurant Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                {/* Restaurant Name */}
                <div className="space-y-2 max-w-[500px]">
                  <label className="text-[13px] text-gray-400">Restaurant Name</label>
                  <input
                    type="text"
                    placeholder="Enter restaurant name"
                    value={form.businessName}
                    onChange={(e) => set("businessName", e.target.value)}
                    required
                    className={inputClass}
                  />
                </div>

                {/* Business Category */}
                <div className="space-y-2 max-w-[500px]">
                  <label className="text-[13px] text-gray-400">Business Category</label>
                  <div className="relative">
                    <select
                      value={form.businessCategory}
                      onChange={(e) => set("businessCategory", e.target.value)}
                      required
                      className={`${inputClass} appearance-none`}
                    >
                      <option value="">Select category</option>
                      <option value="Food & Beverages">Food &amp; Beverages</option>
                      <option value="food_beverages">food_beverages</option>
                      <option value="restaurant">Restaurant</option>
                      <option value="grocery">Grocery</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Cuisine Type */}
                <div className="space-y-2 max-w-[500px]">
                  <label className="text-[13px] text-gray-400">Cuisine Type</label>
                  <input
                    type="text"
                    placeholder="e.g. fast food, Italian"
                    value={form.cuisineType}
                    onChange={(e) => set("cuisineType", e.target.value)}
                    className={inputClass}
                  />
                </div>

                {/* Email */}
                <div className="space-y-2 max-w-[500px]">
                  <label className="text-[13px] text-gray-400">Business Email</label>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={form.businessEmail}
                    onChange={(e) => set("businessEmail", e.target.value)}
                    required
                    className={inputClass}
                  />
                </div>

                {/* Social Account */}
                <div className="space-y-2 max-w-[500px]">
                  <label className="text-[13px] text-gray-400">Social Account</label>
                  <input
                    type="text"
                    placeholder="e.g. @restaurant on Instagram"
                    value={form.socialAccount}
                    onChange={(e) => set("socialAccount", e.target.value)}
                    className={inputClass}
                  />
                </div>

                {/* Profile Image URL */}
                <div className="space-y-2 max-w-[500px]">
                  <label className="text-[13px] text-gray-400">Profile Image URL</label>
                  <div className="relative">
                    <input
                      type="url"
                      placeholder="https://example.com/logo.jpg"
                      value={form.profileImg}
                      onChange={(e) => set("profileImg", e.target.value)}
                      className={inputClass}
                    />
                    {form.profileImg && (
                      <img
                        src={form.profileImg}
                        alt="preview"
                        className="mt-2 w-14 h-14 rounded-xl object-cover border border-gray-200"
                        onError={(e) => (e.currentTarget.style.display = "none")}
                      />
                    )}
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[13px] text-gray-400">Business Address</label>
                  <textarea
                    placeholder="Enter restaurant address"
                    value={form.businessAddress}
                    onChange={(e) => set("businessAddress", e.target.value)}
                    required
                    className={`${inputClass} resize-none`}
                    rows={3}
                  />
                </div>

              </div>
            </section>

            {/* ── Action Buttons ───────────────────────────────────────── */}
            <div className="flex items-center gap-4 pt-4">
              <button
                type="button"
                onClick={() => { setForm(EMPTY_FORM); setError(null); }}
                className="px-10 py-3 border border-gray-200 rounded-xl text-[14px] font-bold text-black hover:bg-gray-50 transition-colors"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={submitting || success}
                className="px-10 py-3 bg-[#FFF0E6] text-[#F16622] rounded-xl text-[14px] font-bold hover:bg-[#ffe6d5] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submitting && (
                  <div className="w-4 h-4 border-2 border-[#F16622] border-t-transparent rounded-full animate-spin" />
                )}
                {submitting ? "Creating…" : "Add Restaurant"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  );
}
