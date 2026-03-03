// 'use client'
// import SliderModalPrime from "./components/SliderModal"
// import { useState } from "react";
// import Meta from "./components/Meta"
// import EduTradeHero from "./components/newBanner"
// import WhyAttendIBEvent from "./components/whyNeed"
// import EventFitSection from "./components/event"
// import Image from "next/image"
// import IbAgendaSection from "./components/IBEvent"
// import MeetSpeakersSection from "./components/meetSpeakSection"
// import IbEventDetails from "./components/IbEventDetails"
// import IbCtaBanner from "./components/IBBanner"
// import EduTradeFooterBar from "./components/footer";

// const page = () => {
//     const [isOpen, setIsOpen] = useState(false);

//     return (
//         <>
//             <Meta title='Edu.trade Introducing Brokers Growth Event 11th October 2025' description='Join Edu.trade at The Museum of the Future and discover how GCC Introducing Brokers can scale their business with exclusive events, insights, and opportunities.' />
//             <EduTradeHero setIsOpen={setIsOpen}/>
//             <WhyAttendIBEvent setIsOpen={setIsOpen} />
//             <EventFitSection setIsOpen={setIsOpen} />
//             <div>
//                 <Image
//                     src="/sectionimg.svg"
//                     width={200}
//                     height={72}
//                     alt="GTCFX"
//                     className="w-full h-[350px] object-cover cursor-pointer"
//                 />
//             </div>
//             <IbAgendaSection setIsOpen={setIsOpen}/>
           
//             <IbEventDetails setIsOpen={setIsOpen}/>
//             <IbCtaBanner setIsOpen={setIsOpen}/>
//             <EduTradeFooterBar setIsOpen={setIsOpen}/>
//             <SliderModalPrime setIsOpen={setIsOpen} isOpen={isOpen} />
//         </>
//     )
// }

// export default page

"use client"
import React, { useMemo, useRef, useState } from "react";

/**
 * Tailwind notes:
 * - This component expects Tailwind set up with the default config.
 * - The "gold" brand color in your screenshot is approximated with #B48755.
 *   We reference it via inline style on a few elements for a pixel-closer match.
 * - Replace logo / bg images as needed. The layout will hold with/without them.
 */

const LANGS = [
  { code: "EN", label: "English", flag: "https://flagcdn.com/w20/us.png" },
  { code: "AR", label: "Arabic", flag: "https://flagcdn.com/w20/ae.png" },
  { code: "ES", label: "Spanish", flag: "https://flagcdn.com/w20/es.png" },
  { code: "CHS", label: "Chinese (S)", flag: "https://flagcdn.com/w20/cn.png" },
  { code: "CHT", label: "Chinese (T)", flag: "https://flagcdn.com/w20/hk.png" },
  { code: "IN", label: "Hindi", flag: "https://flagcdn.com/w20/in.png" },
  { code: "DE", label: "German", flag: "https://flagcdn.com/w20/de.png" },
  { code: "FR", label: "French", flag: "https://flagcdn.com/w20/fr.png" },
  { code: "JP", label: "Japanese", flag: "https://flagcdn.com/w20/jp.png" },
  { code: "KR", label: "Korean", flag: "https://flagcdn.com/w20/kr.png" },
  { code: "TH", label: "Thai", flag: "https://flagcdn.com/w20/th.png" },
  { code: "VI", label: "Vietnamese", flag: "https://flagcdn.com/w20/vn.png" },
  { code: "RU", label: "Russian", flag: "https://flagcdn.com/w20/ru.png" },
  { code: "MY", label: "Malay", flag: "https://flagcdn.com/w20/my.png" },
  { code: "PT", label: "Portuguese", flag: "https://flagcdn.com/w20/pt.png" },
  { code: "TR", label: "Turkish", flag: "https://flagcdn.com/w20/tr.png" },
];

const COUNTRIES = [
  { code: "pk", dial: "+92", name: "Pakistan", icon: "#icon-pk" },
  { code: "ae", dial: "+971", name: "United Arab Emirates", icon: "#icon-ae" },
  { code: "gb", dial: "+44", name: "United Kingdom", icon: "#icon-uk" },
  { code: "us", dial: "+1", name: "United States", icon: "#icon-us" },
];

const brandGold = { color: "#B48755" };
const brandGoldBg = { backgroundColor: "#B48755" };
const brandGoldBorder = { borderColor: "#B48755" };

export default function GTCSignupPage() {
  const [langOpen, setLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(LANGS[0]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [country, setCountry] = useState(COUNTRIES[0]);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [pwd, setPwd] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [invite, setInvite] = useState("");
  const [agree, setAgree] = useState(true);

  const otpRefs = useRef([]);

  const handleOtpChange = (i, v) => {
    if (!/^\d?$/.test(v)) return;
    const next = [...otp];
    next[i] = v;
    setOtp(next);
    if (v && i < 5) {
      otpRefs.current[i + 1]?.focus();
    }
  };

  const phoneMask = useMemo(() => phone.replace(/[^\d]/g, ""), [phone]);

  // fake submit
  const submit = (e) => {
    e?.preventDefault?.();
    if (!agree) return alert("Please accept the terms to continue.");
    // hook your real submit here
    alert("Submitted (mock).");
  };

  const Form = (
    <div className="w-full max-w-md rounded-2xl bg-white shadow-xl ring-1 ring-black/5">
      <div className="px-6 py-5 border-b border-slate-100">
        <h2 className="text-xl font-semibold text-slate-900">Register Now</h2>
      </div>

      <form onSubmit={submit} className="px-6 pb-6 pt-4">
        {/* Name row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-[13px] font-medium text-slate-700 mb-1">First Name</p>
            <input
              type="text"
              placeholder="Enter first name"
              className="h-8 w-full rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-slate-400"
            />
          </div>
          <div>
            <p className="text-[13px] font-medium text-slate-700 mb-1">Last Name</p>
            <input
              type="text"
              placeholder="Enter last name"
              className="h-8 w-full rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-slate-400"
            />
          </div>
        </div>

        {/* Mobile */}
        <div className="mt-4">
          <p className="text-[13px] font-medium text-slate-700 mb-1">Mobile Number</p>
          <div className="flex gap-2">
            <div className="min-w-[140px] w-[30%]">
              <button
                type="button"
                className="h-8 w-full rounded-md border border-slate-300 px-2 text-left text-sm flex items-center gap-2"
              >
                <svg aria-hidden="true" className="w-5 h-5">
                  <use xlinkHref={country.icon} />
                </svg>
                <span>{country.dial}</span>
              </button>
              {/* simple select below the button (hidden natively in your site; replace if you need a custom list) */}
              <select
                className="sr-only"
                onChange={(e) =>
                  setCountry(COUNTRIES.find((c) => c.code === e.target.value) || COUNTRIES[0])
                }
                value={country.code}
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Please enter your Mobile Number"
              className="h-8 flex-1 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-slate-400"
            />
          </div>
        </div>

        {/* Email + send OTP */}
        <div className="mt-4">
          <p className="text-[13px] font-medium text-slate-700 mb-1">Email</p>
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Please enter your email"
              className="h-8 flex-1 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-slate-400"
            />
            <button
              type="button"
              style={brandGoldBg}
              className="h-8 shrink-0 rounded-md px-3 text-sm font-medium text-white"
              onClick={() => alert("Send OTP (mock)")}
            >
              Send OTP
            </button>
          </div>
        </div>

        {/* Verification Code */}
        <div className="mt-4">
          <p className="text-[13px] font-medium text-slate-700 mb-1">Verification Code</p>
          <div className="flex items-center gap-2">
            <div className="flex gap-2">
              {otp.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => (otpRefs.current[i] = el)}
                  type="tel"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  className="h-9 w-9 rounded-md border border-slate-300 text-center text-base outline-none focus:border-slate-400"
                />
              ))}
            </div>
            <button
              type="button"
              style={brandGoldBg}
              className="h-9 rounded-md px-3 text-sm font-medium text-white"
              onClick={() => alert(`Check OTP (mock): ${otp.join("")}`)}
            >
              Check OTP
            </button>
          </div>
        </div>

        {/* Country */}
        <div className="mt-4">
          <p className="text-[13px] font-medium text-slate-700 mb-1">Country of Residence</p>
          <div className="relative">
            <select
              className="h-8 w-full appearance-none rounded-md border border-slate-300 bg-white pl-9 pr-8 text-sm outline-none focus:border-slate-400"
              defaultValue="Pakistan"
            >
              {COUNTRIES.map((c) => (
                <option key={c.code}>{c.name}</option>
              ))}
            </select>
            <svg aria-hidden="true" className="absolute left-2 top-1.5 w-5 h-5">
              <use xlinkHref={country.icon} />
            </svg>
            <svg
              className="pointer-events-none absolute right-2 top-2.5 h-4 w-4 text-slate-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.062l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.08z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {/* Passwords */}
        <div className="mt-4">
          <p className="text-[13px] font-medium text-slate-700 mb-1">Password</p>
          <input
            type="password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            placeholder="Please enter your password"
            className="h-8 w-full rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-slate-400"
          />
        </div>
        <div className="mt-4">
          <p className="text-[13px] font-medium text-slate-700 mb-1">Confirm Password</p>
          <input
            type="password"
            value={pwd2}
            onChange={(e) => setPwd2(e.target.value)}
            placeholder="Please enter your password again"
            className="h-8 w-full rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-slate-400"
          />
        </div>

        {/* Invitation code */}
        <div className="mt-4">
          <p className="text-[13px] font-medium text-slate-700 mb-1">Invitation Code(Optional)</p>
          <input
            type="text"
            value={invite}
            onChange={(e) => setInvite(e.target.value)}
            placeholder="Please select your invitation code"
            className="h-8 w-full rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-slate-400"
          />
        </div>

        {/* Terms */}
        <label className="mt-4 flex gap-2 text-[12px] leading-5 text-slate-600">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 rounded border-slate-300"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
          />
          <span>
            By submitting your application you confirm that you have read, understood and agreed to
            all the{" "}
            <a
              href="https://www.gtcfx.com/terms-and-conditions"
              target="_blank"
              rel="noreferrer"
              className="underline text-slate-700"
            >
              Terms And Conditions
            </a>
            ,{" "}
            <a
              href="https://gtcfx-bucket.s3.ap-southeast-1.amazonaws.com/pdf-files/%2450-Bonus-T%26Cs.pdf"
              target="_blank"
              rel="noreferrer"
              className="underline text-slate-700"
            >
              Bonus Terms and Conditions
            </a>{" "}
            and{" "}
            <a
              href="https://www.gtcfx.com/client-agreement-VU"
              target="_blank"
              rel="noreferrer"
              className="underline text-slate-700"
            >
              Client Agreement
            </a>
            .
          </span>
        </label>

        {/* CTA */}
        <button
          type="submit"
          className="group mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-white"
          style={brandGoldBg}
        >
          <span className="font-medium">Get my Bonus</span>
          <svg width="24" height="24" viewBox="0 0 25 24" fill="none">
            <path d="M9.5 6L15.5 12L9.5 18" stroke="#fff" strokeWidth="2" />
          </svg>
        </button>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0f1f4a] via-[#101c44] to-[#0a1536] text-white">
      {/* Top bar */}
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-4">
        {/* language selector */}
        <div className="relative">
         <div className="relative">
  <button
    className="flex items-center gap-2 rounded-md bg-white/5 px-3 py-1.5 text-sm ring-1 ring-white/10 hover:bg-white/10"
    onClick={() => setLangOpen((s) => !s)}
  >
    <img src={currentLang.flag} alt={currentLang.code} className="h-5 w-7 rounded-sm" />
    {currentLang.code}
    <svg className="h-4 w-4 opacity-80" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.062l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.08z"
        clipRule="evenodd"
      />
    </svg>
  </button>

  {langOpen && (
    <div className="absolute z-20 mt-2 max-h-72 w-48 overflow-auto rounded-lg bg-white p-2 text-slate-900 shadow-lg">
      {LANGS.map((l) => (
        <button
          key={l.code}
          className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-slate-100 ${
            currentLang.code === l.code ? "bg-slate-50" : ""
          }`}
          onClick={() => {
            setCurrentLang(l);
            setLangOpen(false);
          }}
        >
          <img src={l.flag} alt={l.code} className="h-4 w-6 rounded-sm" />
          <span>{l.label}</span>
        </button>
      ))}
    </div>
  )}
</div>

        </div>

        {/* logo placeholder (replace src) */}
        <img
          src="/assets/pc-logo.png"
          alt="GTC"
          className="h-7 w-auto opacity-90"
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
      </div>

      {/* Main content */}
      <div className="relative mx-auto grid max-w-[1200px] grid-cols-1 gap-10 px-4 pb-20 pt-6 lg:grid-cols-2">
        {/* fancy bg shapes (optional) */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          {/* place chart/bg image on the right if you have it */}
        </div>

        {/* Left column */}
        <div className="pt-3">
          <h1 className="text-4xl font-extrabold leading-tight">
            Get <span style={brandGold}>5,000 USC</span> to Trade.
          </h1>
          <p className="mt-2 text-2xl font-semibold">No Deposit Needed!</p>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-200">
            Fill in your details, activate your GTC Cent trading account, and start trading with a
            $50 bonus today. Peace of mind trading at its best, only with GTC, South America’s
            fastest-growing brokerage.
          </p>

          {/* feature cards */}
          <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:gap-6">
            <FeatureCard
              title="Real funds, Real Trading Power"
              desc="Use your 5,000 USC to trade real markets & not demo simulations. Trade the real financial markets."
            />
            <FeatureCard
              title="No risk to your own capital"
              desc="Test strategies or explore our trading platform. Your funds stay untouched while using your $50 tradable bonus."
            />
            <FeatureCard
              title="Instant Withdrawals"
              desc="And we mean instant! Trade with peace of mind On a Cent Account with a multi-regulated brokerage."
            />
          </div>

          {/* Mobile "Register" drawer trigger */}
          <div className="mt-10 lg:hidden">
            <button
              onClick={() => setDrawerOpen(true)}
              className="w-full rounded-xl px-4 py-3 text-base font-medium text-white shadow-lg"
              style={brandGoldBg}
            >
              Register Now
            </button>
          </div>
        </div>

        {/* Right column (desktop form) */}
        <div className="hidden lg:block">{Form}</div>
      </div>

      {/* Drawer (mobile) */}
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Register Now">
        {Form}
      </Drawer>
    </div>
  );
}

/* ------------------------- helpers / subcomponents ------------------------ */

function FeatureCard({ title, desc }) {
  return (
    <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10 backdrop-blur-sm">
      <div
        className="mb-3 inline-flex h-20 w-20 items-center justify-center rounded-full"
        style={{ border: "1.5px solid #B48755" }}
      >
        {/* minimal placeholder icon to match circular stroke */}
        <div className="h-10 w-10 rounded-full" style={{ border: "1.5px solid #B48755" }} />
      </div>
      <div className="text-sm font-semibold" style={{ color: "#B48755" }}>
        {title}
      </div>
      <p className="mt-1 text-[13px] leading-6 text-slate-200">{desc}</p>
    </div>
  );
}

function Drawer({ open, onClose, title, children }) {
  return (
    <>
      {/* overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />
      {/* panel */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-md transform bg-slate-50 transition-transform lg:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b bg-white px-4 py-3">
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-md p-2 text-slate-600 hover:bg-slate-100"
            aria-label="Close"
          >
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <div className="h-[calc(100%-52px)] overflow-y-auto p-4">{children}</div>
      </div>
    </>
  );
}


// "use client"

// import React, { useMemo, useState } from "react";

// const BRAND = {
//   purple: "#241436",
//   gold: "#B48755",
//   beige: "#EEDBC3",
// };

// /**
//  * Tailwind-only recreation of the given markup (no AntD).
//  * - Fully static copy with basic interactions (language dropdown / OTP inputs focus).
//  * - Replace image src paths as needed.
//  */
// export default function LandingLangForm() {
//   const [langOpen, setLangOpen] = useState(false);
//   const [lang, setLang] = useState("Ru");
//   const languages = useMemo(
//     () => [
//       "EN","AR","ES","CHS","CHT","In","De","Fr","Jp","Kr","Th","Vi","Ru","My","Pt","Tr",
//     ],
//     []
//   );

//   // OTP inputs focus handling
//   const [otp, setOtp] = useState(Array(6).fill(""));
//   const otpRefs = useMemo(() => Array.from({ length: 6 }, () => React.createRef()), []);
//   const onOtpChange = (i, v) => {
//     if (/^\d?$/.test(v)) {
//       const next = [...otp];
//       next[i] = v;
//       setOtp(next);
//       if (v && i < 5) otpRefs[i + 1].current?.focus();
//     }
//   };

//   return (
//     <div className="min-h-screen w-full bg-white text-[#1F2D3D]">
//       {/* Top bar */}
//       <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
//         {/* Language selector */}
//         <div className="relative">
//           <button
//             type="button"
//             onClick={() => setLangOpen((s) => !s)}
//             className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm shadow-sm hover:bg-slate-50"
//           >
//             <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-xs">{lang}</span>
//             <span>{lang}</span>
//             <svg className="h-4 w-4 opacity-70" viewBox="0 0 1024 1024" fill="currentColor"><path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z"/></svg>
//           </button>
//           {langOpen && (
//             <div className="absolute left-0 z-20 mt-2 w-44 rounded-md border border-slate-200 bg-white p-1 shadow-lg">
//               {languages.map((l) => (
//                 <button
//                   key={l}
//                   onClick={() => {
//                     setLang(l); setLangOpen(false);
//                   }}
//                   className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-slate-50 ${l===lang?"bg-slate-100":``}`}
//                 >
//                   <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-slate-100 text-[10px]">{l}</span>
//                   <span className="capitalize">{l}</span>
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Logo */}
//         <img src="/assets/pc-logo-Ce0FT6k-.png" alt="logo" className="h-9 w-auto" />
//       </div>

//       {/* Main content */}
//       <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 pb-16 md:grid-cols-2 md:pb-24">
//         {/* Left column */}
//         <div className="order-2 md:order-1">
//           <h1 className="text-2xl font-semibold md:text-3xl" style={{color: BRAND.purple}}>Получите 5,000 USC для торговли.</h1>
//           <p className="mt-1 text-lg font-semibold" style={{color: BRAND.purple}}>Депозит не требуется!</p>
//           <p className="mt-3 max-w-xl text-slate-600">
//             Заполните ваши данные, активируйте ваш торговый счет GTC Cent и начните торговать с бонусом в $50 сегодня. Торговля с душевным спокойствием в лучшем виде, только с GTC, самым быстрорастущим брокером в Южной Америке.
//           </p>

//           {/* Feature cards */}
//           <div className="mt-6 space-y-4">
//             <FeatureCard
//               title="Реальные средства, реальная торговая сила"
//               desc="Используйте ваши 5,000 USC для торговли на реальных рынках, а не демо-симуляциях. Торгуйте на реальных финансовых рынках."
//             />
//             <FeatureCard
//               title="Никакого риска для вашего собственного капитала"
//               desc="Тестируйте стратегии или исследуйте нашу торговую платформу. Ваши средства остаются нетронутыми при использовании вашего $50 торгового бонуса."
//             />
//             <FeatureCard
//               title="Мгновенные выводы"
//               desc="И мы имеем в виду мгновенно! Торгуйте с душевным спокойствием на Cent-счете с многорегулируемым брокером."
//             />
//           </div>
//         </div>

//         {/* Right column: Form */}
//         <div className="order-1 md:order-2">
//           <div className="rounded-2xl border border-slate-200 p-5 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
//             <h3 className="mb-4 text-center text-xl font-semibold" style={{color: BRAND.purple}}>Зарегистрироваться сейчас</h3>

//             <FormRow label="Имя">
//               <input type="text" placeholder="Пожалуйста, введите ваше имя" className="h-8 w-full rounded border border-slate-300 px-3 text-sm outline-none focus:border-slate-400"/>
//             </FormRow>

//             <FormRow label="Фамилия">
//               <input type="text" placeholder="Пожалуйста, введите вашу фамилию" className="h-8 w-full rounded border border-slate-300 px-3 text-sm outline-none focus:border-slate-400"/>
//             </FormRow>

//             {/* Phone */}
//             <div className="mb-4">
//               <p className="mb-1 text-[13px] font-medium text-slate-700">Мобильный номер</p>
//               <div className="flex gap-2">
//                 <select className="h-8 min-w-[140px] rounded border border-slate-300 px-2 text-sm focus:border-slate-400">
//                   <option>+974 (Qatar)</option>
//                   <option>+971 (UAE)</option>
//                   <option>+966 (KSA)</option>
//                 </select>
//                 <input type="tel" placeholder="Пожалуйста, введите ваш мобильный номер" className="h-8 flex-1 rounded border border-slate-300 px-3 text-sm outline-none focus:border-slate-400"/>
//               </div>
//             </div>

//             {/* Email + Send OTP */}
//             <div className="mb-4">
//               <p className="mb-1 text-[13px] font-medium text-slate-700">Электронная почта</p>
//               <div className="flex items-center gap-2">
//                 <input type="email" placeholder="Пожалуйста, введите вашу электронную почту" className="h-8 flex-1 rounded border border-slate-300 px-3 text-sm outline-none focus:border-slate-400"/>
//                 <button type="button" className="h-8 flex-shrink-0 rounded border border-slate-300 px-3 text-sm hover:bg-slate-50">Отправить OTP</button>
//               </div>
//             </div>

//             {/* OTP */}
//             <div className="mb-1">
//               <p className="mb-1 text-[13px] font-medium text-slate-700">Код подтверждения</p>
//               <div className="flex items-center gap-2">
//                 <div className="flex gap-2">
//                   {otp.map((d, i) => (
//                     <input
//                       key={i}
//                       ref={otpRefs[i]}
//                       type="tel"
//                       maxLength={1}
//                       value={d}
//                       onChange={(e) => onOtpChange(i, e.target.value)}
//                       className="h-10 w-10 rounded border border-slate-300 text-center text-sm outline-none focus:border-slate-400"
//                     />
//                   ))}
//                 </div>
//                 <button type="button" className="h-8 flex-shrink-0 rounded border border-slate-300 px-3 text-sm hover:bg-slate-50">Проверить OTP</button>
//               </div>
//             </div>

//             {/* Country */}
//             <FormRow label="Страна проживания">
//               <select className="h-8 w-full rounded border border-slate-300 px-2 text-sm focus:border-slate-400">
//                 <option>Qatar</option>
//                 <option>UAE</option>
//                 <option>Saudi Arabia</option>
//                 <option>Kuwait</option>
//               </select>
//             </FormRow>

//             {/* Passwords */}
//             <FormRow label="Пароль">
//               <input type="password" placeholder="Пожалуйста, введите ваш пароль" className="h-8 w-full rounded border border-slate-300 px-3 text-sm outline-none focus:border-slate-400"/>
//             </FormRow>
//             <FormRow label="Подтвердить пароль">
//               <input type="password" placeholder="Пожалуйста, введите ваш пароль еще раз" className="h-8 w-full rounded border border-slate-300 px-3 text-sm outline-none focus:border-slate-400"/>
//             </FormRow>

//             {/* Invitation code (optional) */}
//             <FormRow label="Код приглашения (Необязательно)">
//               <select className="h-8 w-full rounded border border-slate-300 px-2 text-sm focus:border-slate-400">
//                 <option value="">Пожалуйста, выберите ваш код приглашения</option>
//                 <option>GTC50</option>
//                 <option>PROMO25</option>
//               </select>
//             </FormRow>

//             {/* Terms */}
//             <label className="mt-3 flex items-start gap-2 text-xs text-slate-700">
//               <input defaultChecked type="checkbox" className="mt-0.5 h-4 w-4 rounded border-slate-300" />
//               <span>
//                 Отправляя заявку, вы подтверждаете, что прочитали, поняли и согласились со всеми {" "}
//                 <a href="https://www.gtcfx.com/terms-and-conditions" target="_blank" rel="noreferrer" className="text-blue-600 underline">Условиями и положениями</a>, {" "}
//                 <a href="https://gtcfx-bucket.s3.ap-southeast-1.amazonaws.com/pdf-files/%2450-Bonus-T%26Cs.pdf" target="_blank" rel="noreferrer" className="text-blue-600 underline">Условиями и положениями бонуса</a> {" "}
//                 и {" "}
//                 <a href="https://www.gtcfx.com/client-agreement-VU" target="_blank" rel="noreferrer" className="text-blue-600 underline">Соглашением клиента</a>.
//               </span>
//             </label>

//             <button
//               type="button"
//               className="mt-5 flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:brightness-105"
//               style={{ backgroundColor: BRAND.gold }}
//             >
//               <span>Получить мой бонус</span>
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 25 24" fill="none"><path d="M9.5 6L15.5 12L9.5 18" stroke="#fff" strokeWidth="2"></path></svg>
//             </button>
//           </div>
//         </div>

//         {/* Decorative BGs (optional) */}
//         <img src="/assets/k-pc-kSBpN9yc.png" alt="bg" className="pointer-events-none absolute -right-16 top-4 hidden w-[420px] md:block"/>
//         <img src="data:image/png;base64,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" alt="bg2" className="pointer-events-none absolute -right-10 bottom-0 hidden w-[520px] md:block"/>
//       </div>
//     </div>
//   );
// }

// function FormRow({ label, children }) {
//   return (
//     <div className="mb-4">
//       <p className="mb-1 text-[13px] font-medium text-slate-700">{label}</p>
//       {children}
//     </div>
//   );
// }

// function FeatureCard({ title, desc }) {
//   return (
//     <div className="flex gap-3 rounded-xl border border-[rgba(180,135,85,0.5)] p-4 shadow-[0_8px_20px_rgba(0,0,0,0.06)]">
//       {/* Circle line icon (simplified) */}
//       <div className="flex h-16 w-16 flex-none items-center justify-center rounded-full border" style={{ borderColor: BRAND.gold }}>
//         <div className="h-10 w-10 rounded-full" style={{ backgroundColor: BRAND.gold }} />
//       </div>
//       <div>
//         <div className="text-base font-semibold" style={{ color: BRAND.purple }}>{title}</div>
//         <div className="mt-1 text-sm text-slate-600">{desc}</div>
//       </div>
//     </div>
//   );
// }
