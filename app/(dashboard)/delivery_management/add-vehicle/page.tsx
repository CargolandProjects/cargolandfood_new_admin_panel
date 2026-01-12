// "use client";

// import { Calendar, ChevronDown } from "lucide-react";

// export default function AddVehiclePage() {
//   return (
//     <div className="p-6 w-full">
//       <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-8">
//         <form className="space-y-10">
//           {/* Section 1: Vehicle Details */}
//           <section className="space-y-6">
//             <h2 className="text-[16px] font-bold text-black">
//               Vehicle details
//             </h2>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
//               {/* Vehicle Type */}
//               <div className="space-y-2">
//                 <label className="text-[13px] text-gray-400">
//                   Vehicle type
//                 </label>
//                 <div className="relative">
//                   <select className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#F16622]/40">
//                     <option value="">Select vehicle type</option>
//                     <option value="motorcycle">Motorcycle</option>
//                     <option value="bicycle">Bicycle</option>
//                     <option value="scooter">Electric Scooter</option>
//                   </select>
//                   <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
//                 </div>
//               </div>

//               {/* Fuel Type */}
//               <div className="space-y-2">
//                 <label className="text-[13px] text-gray-400">Fuel type</label>
//                 <div className="relative">
//                   <select className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#F16622]/40">
//                     <option value="">Select fuel type</option>
//                     <option value="petrol">Petrol</option>
//                     <option value="electric">Electric</option>
//                   </select>
//                   <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
//                 </div>
//               </div>

//               {/* License Plate */}
//               <div className="space-y-2">
//                 <label className="text-[13px] text-gray-400">
//                   License plate number
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Enter license plate"
//                   className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#F16622]/40"
//                 />
//               </div>

//               {/* Insurance Expiry */}
//               <div className="space-y-2">
//                 <label className="text-[13px] text-gray-400">
//                   Insurance expiry date
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="text"
//                     placeholder="DD/MM/YYYY"
//                     className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#F16622]/40"
//                   />
//                   <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//                 </div>
//               </div>

//               {/* Colour */}
//               <div className="space-y-2">
//                 <label className="text-[13px] text-gray-400">Colour</label>
//                 <input
//                   type="text"
//                   placeholder="Enter colour"
//                   className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#F16622]/40"
//                 />
//               </div>
//             </div>
//           </section>

//           {/* Section 2: Delivery Coverage Area */}
//           <section className="space-y-6">
//             <h2 className="text-[16px] font-bold text-black">
//               Delivery coverage area
//             </h2>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
//               {/* Starting Coverage */}
//               <div className="space-y-2">
//                 <label className="text-[13px] text-gray-400">
//                   Starting coverage area (KM)
//                 </label>
//                 <input
//                   type="number"
//                   defaultValue={0}
//                   className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#F16622]/40"
//                 />
//               </div>

//               {/* Maximum Coverage */}
//               <div className="space-y-2">
//                 <label className="text-[13px] text-gray-400">
//                   Maximum coverage area (KM)
//                 </label>
//                 <input
//                   type="number"
//                   defaultValue={0}
//                   className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#F16622]/40"
//                 />
//               </div>
//             </div>

//             {/* Extra Charges */}
//             <div className="space-y-2">
//               <label className="text-[13px] text-gray-400">
//                 Extra charges (Optional)
//               </label>
//               <div className="flex items-center bg-white border border-[#F16622]/20 rounded-xl overflow-hidden focus-within:border-[#F16622]/40 transition-colors">
//                 <span className="px-4 text-gray-500 text-[14px]">₦</span>
//                 <input
//                   type="text"
//                   defaultValue="0.00"
//                   className="flex-1 py-3 text-[14px] focus:outline-none"
//                 />
//                 <span className="px-4 text-gray-400 text-[13px] border-l border-gray-100">
//                   per delivery
//                 </span>
//               </div>
//             </div>
//           </section>

//           {/* Action Buttons */}
//           <div className="flex items-center gap-4 pt-4">
//             <button
//               type="reset"
//               className="px-10 py-3 border border-gray-200 rounded-xl text-[14px] font-bold text-black hover:bg-gray-50 transition-colors"
//             >
//               Reset
//             </button>
//             <button
//               type="submit"
//               className="px-10 py-3 bg-[#FFF0E6] text-[#F16622] rounded-xl text-[14px] font-bold hover:bg-[#ffe6d5] transition-colors"
//             >
//               Save
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

"use client";

import { Calendar, ChevronDown } from "lucide-react";

export default function AddVehiclePage() {
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
                Vehicle details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {/* Vehicle Type */}
                <div className="space-y-2 max-w-[500px]">
                  <label className="text-[13px] text-gray-400">
                    Vehicle type
                  </label>
                  <div className="relative">
                    <select className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#F16622]/40">
                      <option value="">Select vehicle type</option>
                      <option value="motorcycle">Motorcycle</option>
                      <option value="bicycle">Bicycle</option>
                      <option value="scooter">Electric Scooter</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Fuel Type */}
                <div className="space-y-2 max-w-[500px]">
                  <label className="text-[13px] text-gray-400">Fuel type</label>
                  <div className="relative">
                    <select className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#F16622]/40">
                      <option value="">Select fuel type</option>
                      <option value="petrol">Petrol</option>
                      <option value="electric">Electric</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* License Plate */}
                <div className="space-y-2 max-w-[500px]">
                  <label className="text-[13px] text-gray-400">
                    License plate number
                  </label>
                  <input
                    type="text"
                    placeholder="Enter license plate"
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#F16622]/40"
                  />
                </div>

                {/* Insurance Expiry */}
                <div className="space-y-2 max-w-[500px]">
                  <label className="text-[13px] text-gray-400">
                    Insurance expiry date
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="DD/MM/YYYY"
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#F16622]/40"
                    />
                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                {/* Colour */}
                <div className="space-y-2 max-w-[500px]">
                  <label className="text-[13px] text-gray-400">Colour</label>
                  <input
                    type="text"
                    placeholder="Enter colour"
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#F16622]/40"
                  />
                </div>
              </div>
            </section>

            {/* Section 2: Delivery Coverage Area */}
            <section className="space-y-6 max-w-[500px]">
              <h2 className="text-[16px] font-bold text-black">
                Delivery coverage area
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {/* Starting Coverage */}
                <div className="space-y-2 max-w-[500px]">
                  <label className="text-[13px] text-gray-400">
                    Starting coverage area (KM)
                  </label>
                  <input
                    type="number"
                    defaultValue={0}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#F16622]/40"
                  />
                </div>

                {/* Maximum Coverage */}
                <div className="space-y-2 max-w-[500px]">
                  <label className="text-[13px] text-gray-400">
                    Maximum coverage area (KM)
                  </label>
                  <input
                    type="number"
                    defaultValue={0}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#F16622]/40"
                  />
                </div>
              </div>

              {/* Extra Charges */}
              <div className="space-y-2 max-w-[500px]">
                <label className="text-[13px] text-gray-400">
                  Extra charges (Optional)
                </label>
                <div className="flex items-center bg-white border border-[#F16622]/20 rounded-xl overflow-hidden focus-within:border-[#F16622]/40 transition-colors max-w-[420px]">
                  <span className="px-4 text-gray-500 text-[14px]">₦</span>
                  <input
                    type="text"
                    defaultValue="0.00"
                    className="flex-1 py-3 text-[14px] focus:outline-none"
                  />
                  <span className="px-4 text-gray-400 text-[13px] border-l border-gray-100">
                    per delivery
                  </span>
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
