// import Image from "next/image";
// import { EyeIcon } from "@heroicons/react/24/outline";

// export default function LoginPage() {
//   return (
//     <main className="relative min-h-screen w-full font-satoshi overflow-hidden bg-black">
//       {/* 1. GLOBAL BACKGROUND: This spans the whole screen so there are no gaps */}
//       <div className="absolute inset-0 z-0">
//         <Image
//           src="/images/pictures/food.jpg"
//           alt="Background"
//           fill
//           className="object-cover brightness-[0.4]" // Darkened to make text pop
//           priority
//         />
//       </div>

//       <div className="relative z-10 grid min-h-screen grid-cols-1 lg:grid-cols-2">
//         {/* LEFT SECTION: BRANDING */}
//         <section className="relative hidden lg:flex flex-col justify-center px-16 xl:px-24">
//           {/* Background Rectangle SVG */}
//           <div className="absolute inset-0 z-0 pointer-events-none">
//             <Image
//               src="/images/svg/Rectangles.svg"
//               alt=""
//               fill
//               className="object-cover object-top" // Aligns image to top
//               style={{ objectPosition: "left 0% top 20%" }} // Fine-tune top visibility
//             />
//           </div>

//           {/* Optional: Semi-transparent overlay to improve text contrast */}
//           {/* <div className="absolute inset-0 z-10 bg-[#F16622]/20 pointer-events-none" /> */}

//           {/* Content */}
//           <div className="relative z-20 -mt-16">
//             {/* -mt-16 moves the whole block upwards */}
//             <h1 className="font-black tracking-tight flex flex-col">
//               <span className="text-6xl sm:text-7xl xl:text-8xl text-white leading-[1.1]">
//                 Cargoland
//               </span>
//               <span className="text-6xl sm:text-7xl xl:text-8xl text-white leading-[1.1] mt-4">
//                 Food
//               </span>
//             </h1>
//             <p className="mt-8 max-w-[477px] text-[31px] leading-[31px] font-satoshi font-bold tracking-normal text-white">
//               Manage your digital presence
//               <br className="hidden sm:block" />
//               with confidence
//             </p>
//           </div>
//         </section>

//         {/* RIGHT SECTION: LOGIN FORM */}
//         <section className="relative flex flex-col items-center justify-center p-8">
//           {/* Decorative Circles (Top Right) */}
//           <div className="absolute top-0 right-0 w-48 h-48 z-10 p-6">
//             <Image
//               src="/images/svg/circles.svg"
//               alt=""
//               width={150}
//               height={150}
//               className="ml-auto"
//             />
//           </div>

//           {/* Form Container */}
//           <div className="relative z-20 w-full max-w-[445px] flex flex-col items-center">
//             {/* Logo */}
//             <div className="mb-10">
//               <Image
//                 src="/images/icons/logo.png"
//                 alt="Cargoland logo"
//                 width={80}
//                 height={91}
//               />
//             </div>

//             <h2 className="text-4xl md:text-5xl font-bold text-white mb-10 text-center tracking-tight">
//               Sign into your panel
//             </h2>

//             <form className="w-full space-y-6">
//               <div className="space-y-2">
//                 <label className="text-sm font-normal text-white block">
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   className="w-full h-[70px] px-6 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F16622] transition-all placeholder:text-gray-400"
//                   placeholder="email@example.com"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <label className="text-sm font-normal text-white block">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="password"
//                     className="w-full h-[70px] px-6 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F16622] transition-all"
//                     placeholder="********"
//                   />
//                   <button
//                     type="button"
//                     className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                   >
//                     <EyeIcon className="w-6 h-6" />
//                   </button>
//                 </div>
//               </div>

//               <button
//                 type="submit"
//                 className="w-full h-[60px] bg-[#F16622] text-white font-bold rounded-lg hover:bg-[#d8551b] transition-colors mt-4"
//               >
//                 Sign In
//               </button>
//             </form>
//           </div>

//           {/* Bottom Right Orange Accent Shape */}
//           <div className="absolute bottom-0 right-0 w-64 h-80 bg-[#F16622] rounded-tl-[240px] z-10 hidden lg:block" />
//         </section>
//       </div>
//     </main>
//   );
// }
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  return (
    <main className="relative min-h-screen w-full font-satoshi overflow-hidden bg-black">
      {/* 1. SEAMLESS BACKGROUND 
          The 'floor' layer ensures no black gaps are visible through SVG transparency. */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/pictures/food.jpg"
          alt="Background"
          fill
          className="object-cover brightness-[0.4]"
          priority
        />
      </div>

      <div className="relative z-10 grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* LEFT SECTION: BRANDING */}
        <section className="relative hidden lg:flex flex-col justify-center px-16 xl:px-24 bg-white/10 lg:bg-transparent">
          {/* TRIANGLES SVG 
              Optimized: Adjusted via object-position to maintain 'white space' at the top 
              without extra divs. */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <Image
              src="/images/svg/Rectangles.svg"
              alt=""
              fill
              className="object-cover"
              style={{ objectPosition: "left 0% top 15%" }}
            />
          </div>

          <div className="relative z-20">
            <h1 className="font-black tracking-tight flex flex-col">
              <span className="text-7xl xl:text-8xl text-white leading-[0.9]">
                Cargoland
              </span>
              <span className="text-7xl xl:text-8xl text-white leading-[0.9] mt-6">
                Food
              </span>
            </h1>
            <p className="mt-8 max-w-[477px] text-2xl xl:text-3xl leading-tight font-bold text-white opacity-90">
              Manage your digital presence with confidence
            </p>
          </div>
        </section>

        {/* RIGHT SECTION: LOGIN FORM */}
        <section className="relative flex flex-col items-center justify-center p-8">
          {/* DECORATIVE CIRCLES */}
          <div className="absolute top-0 right-0 w-48 h-48 z-10">
            <Image
              src="/images/svg/circles.svg"
              alt=""
              width={150}
              height={150}
              className="ml-auto"
            />
          </div>

          <div className="relative z-20 w-full max-w-[445px] flex flex-col items-center">
            {/* LOGO */}
            <div className="mb-10">
              <Image
                src="/images/icons/logo.png"
                alt="Logo"
                width={80}
                height={91}
              />
            </div>

            <h2 className="text-4xl xl:text-5xl font-bold text-white mb-10 text-center tracking-tight">
              Sign into your panel
            </h2>
            <form
              className="w-full flex flex-col items-center space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                router.push("/dashboard");
              }}
            >
              {/* Email Field */}
              <div className="space-y-2 w-full max-w-[445px]">
                <label className="text-sm font-medium text-white block">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full h-[39px] px-3 rounded-[6px] border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-[#F16622] outline-none transition-all"
                  placeholder="email@example.com"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2 w-full max-w-[445px]">
                <label className="text-sm font-medium text-white block">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full h-[39px] px-3 rounded-[6px] border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-[#F16622] outline-none transition-all"
                    placeholder="********"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#F16622]"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                className="w-[417px] h-[49px] bg-[#F16622] text-white font-bold rounded-[10px] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center whitespace-nowrap"
                style={{
                  marginTop: "60px", // Increased to push it down further
                }}
              >
                Sign In
              </button>
            </form>
          </div>

          {/* Bottom Right Icon */}
          <div className="absolute bottom-0 right-0 z-10 hidden lg:block">
            <Image
              src="/images/pictures/icon o.png"
              alt=""
              width={192}
              height={256}
              className="object-contain"
            />
          </div>
        </section>
      </div>
    </main>
  );
}
