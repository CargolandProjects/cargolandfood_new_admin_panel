"use client";

import { ChevronDown } from "lucide-react";

export default function AddNewRestaurantPage() {
  return (
    <>
      <style jsx global>{`
        input,
        select,
        textarea {
          color: #000 !important;
        }

        input::placeholder,
        textarea::placeholder {
          color: #9ca3af;
        }
      `}</style>

      <div className="p-6 w-full">
        <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-8">
          <form className="space-y-10">
            {/* Section 1: Restaurant Details */}
            <section className="space-y-6">
              <h2 className="text-[16px] font-bold text-black">Restaurant Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {/* Restaurant Name */}
                <div className="space-y-2 max-w-[500px]">
                  <label className="text-[13px] text-gray-400">
                    Restaurant Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter restaurant name"
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#F16622]/40"
                  />
                </div>

                {/* Cuisine Type */}
                <div className="space-y-2 max-w-[500px]">
                  <label className="text-[13px] text-gray-400">Cuisine Type</label>
                  <div className="relative">
                    <select className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#F16622]/40">
                      <option value="">Select cuisine type</option>
                      <option value="italian">Italian</option>
                      <option value="chinese">Chinese</option>
                      <option value="indian">Indian</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Zone */}
                <div className="space-y-2 max-w-[500px]">
                  <label className="text-[13px] text-gray-400">Zone</label>
                  <div className="relative">
                    <select className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#F16622]/40">
                      <option value="">Select zone</option>
                      <option value="zone1">Zone 1</option>
                      <option value="zone2">Zone 2</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-2 max-w-[500px]">
                  <label className="text-[13px] text-gray-400">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#F16622]/40"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2 max-w-[500px]">
                  <label className="text-[13px] text-gray-400">Email</label>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#F16622]/40"
                  />
                </div>

                {/* Address */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[13px] text-gray-400">Address</label>
                  <textarea
                    placeholder="Enter restaurant address"
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#F16622]/40 resize-none"
                    rows={3}
                  />
                </div>
              </div>
            </section>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 pt-4">
              <button
                type="reset"
                className="px-10 py-3 border border-gray-200 rounded-xl text-[14px] font-bold text-black hover:bg-gray-50 transition-colors"
              >
                Reset
              </button>
              <button
                type="submit"
                className="px-10 py-3 bg-[#FFF0E6] text-[#F16622] rounded-xl text-[14px] font-bold hover:bg-[#ffe6d5] transition-colors"
              >
                Add Restaurant
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
