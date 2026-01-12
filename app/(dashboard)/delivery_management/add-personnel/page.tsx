"use client";

import { Calendar, ChevronDown } from "lucide-react";

export default function AddPersonnelPage() {
  return (
    <>
      {/* Global input text color fix */}
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
            {/* Section 1: Vehicle Details */}
            <section className="space-y-6">
              <h2 className="text-[16px] font-bold text-black">
                General Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                {/* Vehicle Type */}
                <div className="space-y-2 max-w-[500px]">
                  <label className="text-[13px] text-gray-400">
                    First Name
                  </label>
                  <input
                    type="text"
                    // placeholder="Enter license plate"
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#F16622]/40"
                  />
                </div>

                {/* Fuel Type */}
                <div className="space-y-2 max-w-[500px]">
                  <label className="text-[13px] text-gray-400">Last Name</label>
                  <input
                    type="text"
                    // placeholder="Enter license plate"
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#F16622]/40"
                  />
                </div>

                {/* License Plate */}
                <div className="space-y-2 max-w-[500px]">
                  <label className="text-[13px] text-gray-400">Email </label>
                  <input
                    type="text"
                    // placeholder="Enter license plate"
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#F16622]/40"
                  />
                </div>

                {/* Insurance Expiry */}
                <div className="space-y-2 max-w-[500px]">
                  <label className="text-[13px] text-gray-400">
                    Mobile Number{" "}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      // placeholder="DD/MM/YYYY"
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#F16622]/40"
                    />
                  </div>
                </div>

                {/* Colour */}
                <div className="space-y-2 max-w-[500px]">
                  <label className="text-[13px] text-gray-400">
                    Delivery type
                  </label>
                  <input
                    type="text"
                    // placeholder="Enter colour"
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#F16622]/40"
                  />
                </div>
              </div>
            </section>

            {/* Section 2: Delivery Coverage Area */}
            <section className="space-y-6">
              <h2 className="text-[16px] font-bold text-black">
                Identification Information{" "}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-2 max-w-[400px]">
                  <label className="text-[13px] text-gray-400">Id type </label>
                  <div className="relative">
                    <select className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#F16622]/40">
                      <option value="">Select ID type</option>
                      <option value="motorcycle">Motorcycle</option>
                      <option value="bicycle">Bicycle</option>
                      <option value="scooter">Electric Scooter</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2 max-w-[500px]">
                  <label className="text-[13px] text-gray-400">
                    ID number{" "}
                  </label>
                  <input
                    type="number"
                    defaultValue={0}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#F16622]/40"
                  />
                </div>
              </div>

              <div className="space-y-4 max-w-[500px]">
                <label className="text-[13px] text-gray-400">
                  Identity image
                </label>

                <div
                  className="border-2 border-dashed border-gray-300 rounded-[20px] p-6 bg-gray-100 flex items-center gap-4 cursor-pointer hover:bg-gray-200 transition-colors group"
                  onClick={() =>
                    document.getElementById("identity-upload")?.click()
                  }
                >
                  {/* Hidden file input */}
                  <input
                    type="file"
                    id="identity-upload"
                    accept=".png,.jpg,.jpeg"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        console.log("Selected file:", file);
                        // You can also store it in state to preview or submit later
                      }
                    }}
                  />

                  {/* White circular icon container */}
                  <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
                    <img
                      src="/images/icons/picture_frame.png"
                      alt=""
                      className="w-6 h-6 opacity-50"
                    />
                  </div>

                  {/* Upload Text and Helper Text */}
                  <div className="flex flex-col">
                    <div className="text-[14px] font-bold text-gray-600">
                      Upload document
                    </div>
                    <p className="text-[12px] text-gray-400 mt-1">
                      Allowed formats include .png & .jpg less than 1 mb
                    </p>
                  </div>
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
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
