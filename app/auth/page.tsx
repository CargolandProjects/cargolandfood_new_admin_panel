import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2 font-satoshi">
      {/* ----------------------------------------------------------------------
          LEFT SECTION: THE BRANDING AREA
          ---------------------------------------------------------------------- */}
      <section className="relative min-h-screen overflow-hidden bg-white flex flex-col justify-center">
        {/* Background SVG */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/svg/Rectangles.svg"
            alt=""
            fill
            priority
            className="object-cover"
            style={{ objectPosition: "left 25%" }}
          />
        </div>

        {/* You can add left section content here if needed */}
        {/* CONTENT LAYER: Positioned to sit on top of the background SVG */}
        <div className="relative z-20 max-w-[477px] pl-16">
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

      {/* ----------------------------------------------------------------------
          RIGHT SECTION: THE LOGIN PANEL
          ---------------------------------------------------------------------- */}
      <section className="relative flex flex-col items-center justify-center bg-white p-8 md:p-12 lg:p-16">
        {/* Decorative Circles SVG */}
        <div className="absolute -top-5 right-0 w-56 h-64 select-none pointer-events-none z-0">
          <Image
            src="/images/svg/circles.svg"
            alt=""
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Center Content */}
        <div className="w-full max-w-sm text-center z-10">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <Image
              src="/images/icons/logo.png"
              alt="Cargoland logo"
              width={80}
              height={80}
            />
          </div>

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 tracking-tight leading-snug md:leading-tight whitespace-nowrap">
            Sign into your panel
          </h2>

          {/* Subtext */}
          <p className="mt-3 text-xl md:text-2xl text-black font-medium">
            Sign in as
          </p>

          {/* Role selectors */}
          <div className="mt-8 md:mt-12 flex justify-center gap-12 md:gap-16">
            {/* ADMIN BUTTON */}
            <Link
              href="/auth/admin"
              className="group flex flex-col items-center gap-3 md:gap-4 focus:outline-none focus-visible:outline-none"
            >
              <div className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden relative -mt-1">
                <Image
                  src="/images/icons/adminIcon.png"
                  alt="Admin icon"
                  fill
                  className="object-cover"
                  style={{ objectPosition: "left 10% top 0%" }}
                />
              </div>

              {/* <span className="font-semibold text-gray-800 text-lg group-hover:text-[#F16622]">
                Admin
              </span> */}
              <span className="font-satoshi font-medium text-[1.5625rem] leading-[1.2] text-center text-gray-800 group-hover:text-[#F16622]">
                Admin
              </span>
            </Link>
            {/* EMPLOYEE BUTTON */}
            <Link
              href="/auth/employee"
              className="group flex flex-col items-center gap-3 md:gap-4"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center overflow-hidden transition-all relative">
                <Image
                  src="/images/icons/employeeIcon.png"
                  alt="Employee icon"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="font-satoshi font-medium text-[1.5625rem] leading-[1.2] text-center text-gray-800 group-hover:text-[#F16622]">
                Employee
              </span>
            </Link>
          </div>
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
  );
}
