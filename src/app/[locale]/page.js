"use client";

import { useState, useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import Meta from "./components/Meta";
import { validateCredentials, setLoggedIn, isLoggedIn, STATIC_EMAIL } from "./auth";
import Image from "next/image";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) {
      router.replace("/user");
    }
  }, [router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email.trim() || !password) {  
      setError("Please enter email and password.");
      setLoading(false);
      return;
    }

    if (validateCredentials(email, password)) {
      setLoggedIn(email.trim());
      router.push("/user");
      return;
    }

    setError("Invalid email or password.");
    setLoading(false);
  };

  return (
    <>
      <Meta
        title="For Client Information - GTCFX"
        description="Login to access your GTCFX account and manage your client, view market insights, and stay updated with the latest financial news."
      />
      <div className="min-h-screen bg-[#0F143A] text-white flex items-center justify-center px-4">
        <div className="w-full max-w-md">
           <div className="flex md:justify-center justify-center mb-14">
           <Image
                    src="https://gtcfx-bucket.s3.ap-southeast-1.amazonaws.com/img/footer-logo.webp"
                    width={200}
                    height={72}
                    alt="GTCFX"
                    className="lg:w-[200px] lg:h-[72px] md:w-[120px] md:h-[53px] w-[130px] h-[47px] cursor-pointer"
                  />
        </div>
          <div className="rounded-xl border border-[#293794]/80 bg-[#1a1f4a]/60 p-8 shadow-lg backdrop-blur">
            <h1 className="text-2xl font-bold text-white tracking-tight mb-2 text-center">
              Sign In
            </h1>
            <p className="text-sm text-gray-400 mb-6 text-center">
              Enter your email and password to continue
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-xs font-medium uppercase tracking-wider text-[#B48755]"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  placeholder={STATIC_EMAIL}
                  autoComplete="email"
                  className="w-full rounded-lg border border-[#293794] bg-[#0F143A] px-4 py-3 text-white placeholder-gray-500 focus:border-[#B48755] focus:outline-none focus:ring-1 focus:ring-[#B48755]"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-xs font-medium uppercase tracking-wider text-[#B48755]"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full rounded-lg border border-[#293794] bg-[#0F143A] px-4 py-3 text-white placeholder-gray-500 focus:border-[#B48755] focus:outline-none focus:ring-1 focus:ring-[#B48755]"
                />
              </div>

              {error && (
                <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[#B48755] px-5 py-3 font-semibold text-white shadow-md transition hover:bg-[#c99a66] focus:outline-none focus:ring-2 focus:ring-[#B48755] focus:ring-offset-2 focus:ring-offset-[#0F143A] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
