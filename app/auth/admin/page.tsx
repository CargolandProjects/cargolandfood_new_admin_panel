"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { loginAdmin } from "@/lib/api/auth";
import Modal from "@/components/Modal";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showSessionToast, setShowSessionToast] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const reason = new URLSearchParams(window.location.search).get("reason");
    if (reason === "session-expired") {
      setShowSessionToast(true);

      const url = new URL(window.location.href);
      url.searchParams.delete("reason");
      window.history.replaceState({}, "", url.toString());

      const timer = window.setTimeout(() => {
        setShowSessionToast(false);
      }, 5000);

      return () => window.clearTimeout(timer);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await loginAdmin({ email, password });
      
      if (response.success) {
        const callbackUrl = new URLSearchParams(window.location.search).get(
          "callbackUrl"
        );
        const destination =
          callbackUrl?.startsWith("/") && !callbackUrl.startsWith("/auth")
            ? callbackUrl
            : "/dashboard";
        router.push(destination);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed. Please try again.";
      setModalMessage(errorMessage);
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full font-satoshi overflow-hidden bg-black">
      {/* BACKGROUND */}
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
              onSubmit={handleSubmit}
            >
              {/* Email Field */}
              <div className="space-y-2 w-full max-w-[445px]">
                <label className="text-sm font-medium text-white block">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-[39px] px-3 rounded-[6px] border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-[#F16622] outline-none transition-all"
                  placeholder="email@example.com"
                  required
                  disabled={loading}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-[39px] px-3 rounded-[6px] border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-[#F16622] outline-none transition-all"
                    placeholder="********"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#F16622]"
                    disabled={loading}
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
                disabled={loading}
                className="w-full max-w-[320px] lg:max-w-[417px] h-[49px] bg-[#F16622] text-white font-bold rounded-[10px] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  marginTop: "60px",
                }}
              >
                {loading ? "Signing in..." : "Sign In"}
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

      {showSessionToast && (
        <div className="fixed top-4 right-4 z-50 max-w-sm rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 shadow-lg">
          Session expired. Please log in again.
        </div>
      )}

      {/* Error Modal */}
      <Modal
        isOpen={showModal}
        title="Login Failed"
        message={modalMessage}
        type="error"
        actionLabel="Try Again"
        onClose={() => setShowModal(false)}
      />
    </main>
  );
}
