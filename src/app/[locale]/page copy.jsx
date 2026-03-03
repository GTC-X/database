// "use client"
// // GTCRegister.jsx
// import React, { useMemo, useState } from "react";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";

// /** ---------- Flags: Language dropdown (online PNGs via flagcdn.com) ---------- */
// const LANGS = [
//   { code: "EN", label: "English", flag: "https://flagcdn.com/w20/us.png" },
//   { code: "AR", label: "Arabic", flag: "https://flagcdn.com/w20/ae.png" },
//   { code: "ES", label: "Spanish", flag: "https://flagcdn.com/w20/es.png" },
//   { code: "CHS", label: "Chinese (S)", flag: "https://flagcdn.com/w20/cn.png" },
//   { code: "CHT", label: "Chinese (T)", flag: "https://flagcdn.com/w20/hk.png" },
//   { code: "IN", label: "Hindi", flag: "https://flagcdn.com/w20/in.png" },
//   { code: "DE", label: "German", flag: "https://flagcdn.com/w20/de.png" },
//   { code: "FR", label: "French", flag: "https://flagcdn.com/w20/fr.png" },
//   { code: "JP", label: "Japanese", flag: "https://flagcdn.com/w20/jp.png" },
//   { code: "KR", label: "Korean", flag: "https://flagcdn.com/w20/kr.png" },
//   { code: "TH", label: "Thai", flag: "https://flagcdn.com/w20/th.png" },
//   { code: "VI", label: "Vietnamese", flag: "https://flagcdn.com/w20/vn.png" },
//   { code: "RU", label: "Russian", flag: "https://flagcdn.com/w20/ru.png" },
//   { code: "MY", label: "Malay", flag: "https://flagcdn.com/w20/my.png" },
//   { code: "PT", label: "Portuguese", flag: "https://flagcdn.com/w20/pt.png" },
//   { code: "TR", label: "Turkish", flag: "https://flagcdn.com/w20/tr.png" },
// ];

// /** ---------- Country list for phone + residence (includes flags) ---------- */
// const COUNTRIES = [
//   { iso: "pk", name: "Pakistan", dial: "+92", flag: "https://flagcdn.com/w20/pk.png" },
//   { iso: "us", name: "United States", dial: "+1", flag: "https://flagcdn.com/w20/us.png" },
//   { iso: "gb", name: "United Kingdom", dial: "+44", flag: "https://flagcdn.com/w20/gb.png" },
//   { iso: "in", name: "India", dial: "+91", flag: "https://flagcdn.com/w20/in.png" },
//   { iso: "ae", name: "United Arab Emirates", dial: "+971", flag: "https://flagcdn.com/w20/ae.png" },
//   { iso: "br", name: "Brazil", dial: "+55", flag: "https://flagcdn.com/w20/br.png" },
//   { iso: "ar", name: "Argentina", dial: "+54", flag: "https://flagcdn.com/w20/ar.png" },
// ];

// /** ---------- Helpers ---------- */
// const ErrorText = ({ name }) => (
//   <ErrorMessage
//     name={name}
//     render={(msg) => <div className="mt-1 text-xs text-red-500">{msg}</div>}
//   />
// );

// const Label = ({ children }) => (
//   <p className="mb-1 text-sm font-medium text-slate-100/90">{children}</p>
// );

// /** ---------- O T P 6-digit input (Formik field: verificationCode) ---------- */
// const OtpInput = ({ value, onChange }) => {
//   const chars = (value || "").split("");
//   return (
//     <div className="flex items-center gap-3">
//       <div className="flex gap-2">
//         {Array.from({ length: 6 }).map((_, i) => (
//           <input
//             key={i}
//             inputMode="numeric"
//             maxLength={1}
//             value={chars[i] || ""}
//             onChange={(e) => {
//               const v = e.target.value.replace(/\D/g, "").slice(0, 1);
//               const arr = Array.from({ length: 6 }).map((__, j) =>
//                 j === i ? v : chars[j] || ""
//               );
//               onChange(arr.join(""));
//             }}
//             className="h-10 w-10 rounded-md border border-white/15 bg-white/5 text-center text-base text-white outline-none focus:ring-2 focus:ring-indigo-400"
//           />
//         ))}
//       </div>
//       <button
//         type="button"
//         className="rounded-md bg-white/10 px-3 py-2 text-sm text-white ring-1 ring-white/15 hover:bg-white/20"
//         onClick={() => alert("OTP checked (demo)")}
//       >
//         Check OTP
//       </button>
//     </div>
//   );
// };

// /** ---------- Language selector with flags ---------- */
// const LanguageSelect = () => {
//   const [open, setOpen] = useState(false);
//   const [current, setCurrent] = useState(LANGS[0]);
//   return (
//     <div className="relative">
//       <button
//         onClick={() => setOpen((s) => !s)}
//         className="flex items-center gap-2 rounded-md bg-white/10 px-3 py-1.5 text-sm text-white ring-1 ring-white/10 hover:bg-white/20"
//       >
//         <img src={current.flag} alt={current.code} className="h-5 w-7 rounded-sm" />
//         {current.code}
//         <svg className="h-4 w-4 opacity-80" viewBox="0 0 20 20" fill="currentColor">
//           <path
//             fillRule="evenodd"
//             d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.062l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.08z"
//             clipRule="evenodd"
//           />
//         </svg>
//       </button>
//       {open && (
//         <div className="absolute right-0 z-30 mt-2 max-h-72 w-56 overflow-auto rounded-lg bg-white p-2 text-slate-900 shadow-xl">
//           {LANGS.map((l) => (
//             <button
//               key={l.code}
//               onClick={() => {
//                 setCurrent(l);
//                 setOpen(false);
//               }}
//               className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-slate-100 ${
//                 current.code === l.code ? "bg-slate-50" : ""
//               }`}
//             >
//               <img src={l.flag} alt={l.code} className="h-4 w-6 rounded-sm" />
//               <span className="font-medium">{l.code}</span>
//               <span className="ml-auto text-xs opacity-70">{l.label}</span>
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// /** ---------- Country Select (flag + dial or name) ---------- */
// const CountryDialSelect = ({ value, onChange }) => {
//   const current = useMemo(
//     () => COUNTRIES.find((c) => c.dial === value) || COUNTRIES[0],
//     [value]
//   );
//   const [open, setOpen] = useState(false);
//   return (
//     <div className="relative w-[160px]">
//       <button
//         type="button"
//         onClick={() => setOpen((s) => !s)}
//         className="flex h-10 w-full items-center justify-between gap-2 rounded-md border border-white/15 bg-white/5 px-3 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-400"
//       >
//         <span className="flex items-center gap-2">
//           <img src={current.flag} className="h-4 w-6 rounded-sm" alt={current.iso} />
//           {current.dial}
//         </span>
//         <svg className="h-4 w-4 opacity-70" viewBox="0 0 20 20" fill="currentColor">
//           <path
//             fillRule="evenodd"
//             d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.062l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.08z"
//             clipRule="evenodd"
//           />
//         </svg>
//       </button>
//       {open && (
//         <div className="absolute z-20 mt-2 max-h-64 w-64 overflow-auto rounded-lg bg-white p-2 text-slate-900 shadow-lg">
//           {COUNTRIES.map((c) => (
//             <button
//               key={c.iso}
//               type="button"
//               onClick={() => {
//                 onChange(c.dial);
//                 setOpen(false);
//               }}
//               className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-slate-100 ${
//                 c.dial === current.dial ? "bg-slate-50" : ""
//               }`}
//             >
//               <img src={c.flag} alt={c.name} className="h-4 w-6 rounded-sm" />
//               <span className="font-medium">{c.name}</span>
//               <span className="ml-auto text-xs opacity-70">{c.dial}</span>
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// const CountryResidenceSelect = ({ value, onChange }) => {
//   const current = useMemo(
//     () => COUNTRIES.find((c) => c.iso === value) || COUNTRIES[0],
//     [value]
//   );
//   const [open, setOpen] = useState(false);
//   return (
//     <div className="relative">
//       <button
//         type="button"
//         onClick={() => setOpen((s) => !s)}
//         className="flex h-10 w-full items-center justify-between gap-2 rounded-md border border-white/15 bg-white/5 px-3 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-400"
//       >
//         <span className="flex items-center gap-2">
//           <img src={current.flag} className="h-4 w-6 rounded-sm" alt={current.iso} />
//           {current.name}
//         </span>
//         <svg className="h-4 w-4 opacity-70" viewBox="0 0 20 20" fill="currentColor">
//           <path
//             fillRule="evenodd"
//             d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.062l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.08z"
//             clipRule="evenodd"
//           />
//         </svg>
//       </button>
//       {open && (
//         <div className="absolute z-20 mt-2 max-h-64 w-full overflow-auto rounded-lg bg-white p-2 text-slate-900 shadow-lg">
//           {COUNTRIES.map((c) => (
//             <button
//               key={c.iso}
//               type="button"
//               onClick={() => {
//                 onChange(c.iso);
//                 setOpen(false);
//               }}
//               className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-slate-100 ${
//                 c.iso === current.iso ? "bg-slate-50" : ""
//               }`}
//             >
//               <img src={c.flag} alt={c.name} className="h-4 w-6 rounded-sm" />
//               <span className="font-medium">{c.name}</span>
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// /** ---------- Validation (Yup) ---------- */
// const Schema = Yup.object({
//   firstname: Yup.string().required("First name is required"),
//   lastname: Yup.string().required("Last name is required"),
//   dial: Yup.string().required("Country dial code is required"),
//   phone: Yup.string()
//     .matches(/^\d+$/, "Digits only")
//     .min(6, "Too short")
//     .required("Mobile number is required"),
//   email: Yup.string().email("Invalid email").required("Email is required"),
//   verificationCode: Yup.string()
//     .matches(/^\d{6}$/, "Enter 6 digits")
//     .required("Verification code is required"),
//   country: Yup.string().required("Country is required"),
//   password: Yup.string().min(6, "At least 6 characters").required("Password is required"),
//   confirmPassword: Yup.string()
//     .oneOf([Yup.ref("password")], "Passwords must match")
//     .required("Confirm your password"),
//   accept: Yup.boolean().oneOf([true], "You must accept the terms"),
//   invitation: Yup.string().nullable(), // optional
// });

// /** ---------- Main Component ---------- */
// export default function GTCRegister() {
//   const [drawerOpen, setDrawerOpen] = useState(false);

//   const initialValues = {
//     firstname: "",
//     lastname: "",
//     dial: COUNTRIES[0].dial,
//     phone: "",
//     email: "",
//     verificationCode: "",
//     country: COUNTRIES[0].iso,
//     password: "",
//     confirmPassword: "",
//     invitation: "",
//     accept: true,
//   };

//   const handleSubmit = (values, { setSubmitting, resetForm }) => {
//     // demo submit
//     setTimeout(() => {
//       alert("Submitted!\n\n" + JSON.stringify(values, null, 2));
//       setSubmitting(false);
//       // resetForm();
//     }, 300);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#0d1b3d] via-[#0a1a3a] to-[#0d1b3d] text-white">
//       {/* Top bar */}
//       <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
//         <img
//           src="https://dummyimage.com/120x36/1c2a52/ffffff&text=GTC"
//           alt="GTC"
//           className="h-9 w-auto"
//         />
//         <LanguageSelect />
//       </header>

//       {/* Main content */}
//       <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-4 pb-20 pt-6 md:grid-cols-2">
//         {/* Left */}
//         <section>
//           <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
//             Get 5,000 USC to Trade.
//           </h1>
//           <p className="mt-2 text-2xl font-semibold text-indigo-200">No Deposit Needed!</p>
//           <p className="mt-4 max-w-xl text-slate-200">
//             Fill in your details, activate your GTC Cent trading account, and start trading with a
//             $50 bonus today. Peace of mind trading at its best, only with GTC, South America’s
//             fastest-growing brokerage.
//           </p>

//           {/* Feature cards */}
//           <div className="mt-10 grid gap-4 sm:grid-cols-3">
//             {[
//               {
//                 title: "Real funds, Real Trading Power",
//                 desc: "Use your 5,000 USC to trade real markets & not demo simulations. Trade the real financial markets.",
//               },
//               {
//                 title: "No risk to your own capital",
//                 desc: "Test strategies or explore our trading platform. Your funds stay untouched while using your $50 tradable bonus.",
//               },
//               {
//                 title: "Instant Withdrawals",
//                 desc: "And we mean instant! Trade with peace of mind On a Cent Account with a multi-regulated brokerage.",
//               },
//             ].map((c, i) => (
//               <div
//                 key={i}
//                 className="rounded-2xl border border-amber-400/30 bg-white/5 p-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]"
//               >
//                 <div className="mb-3 h-14 w-14 rounded-full border border-amber-400/70 p-3" />
//                 <h3 className="text-sm font-semibold">{c.title}</h3>
//                 <p className="mt-2 text-xs text-slate-200">{c.desc}</p>
//               </div>
//             ))}
//           </div>

//           {/* Mobile: open drawer button */}
//           <div className="mt-8 md:hidden">
//             <button
//               onClick={() => setDrawerOpen(true)}
//               className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 text-base font-semibold text-white shadow-lg hover:bg-indigo-600"
//             >
//               Register Now
//               <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
//                 <path d="M9 6l6 6-6 6" stroke="#fff" strokeWidth="2" />
//               </svg>
//             </button>
//           </div>
//         </section>

//         {/* Right (desktop form card) */}
//         <aside className="hidden md:block">
//           <div className="rounded-2xl bg-white/5 p-6 shadow-2xl ring-1 ring-white/10">
//             <h3 className="mb-4 text-xl font-semibold">Register Now</h3>
//             <FormCard initialValues={initialValues} onSubmit={handleSubmit} />
//           </div>
//         </aside>
//       </div>

//       {/* Mobile Drawer */}
//       {drawerOpen && (
//         <div className="fixed inset-0 z-40">
//           <div
//             className="absolute inset-0 bg-black/60 backdrop-blur-sm"
//             onClick={() => setDrawerOpen(false)}
//           />
//           <div className="absolute bottom-0 left-0 right-0 z-50 max-h-[88vh] overflow-auto rounded-t-2xl bg-[#0f214d] p-5 shadow-2xl ring-1 ring-white/10">
//             <div className="mb-2 flex items-center justify-between">
//               <h3 className="text-lg font-semibold">Register Now</h3>
//               <button
//                 onClick={() => setDrawerOpen(false)}
//                 className="rounded-md p-2 text-white/80 hover:bg-white/10"
//               >
//                 ✕
//               </button>
//             </div>
//             <FormCard initialValues={initialValues} onSubmit={handleSubmit} />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// /** ---------- Form Card (Formik) ---------- */
// function FormCard({ initialValues, onSubmit }) {
//   return (
//     <Formik initialValues={initialValues} validationSchema={Schema} onSubmit={onSubmit}>
//       {({ values, setFieldValue, isSubmitting }) => (
//         <Form className="space-y-4">
//           {/* Names */}
//           <div className="grid gap-4 sm:grid-cols-2">
//             <div>
//               <Label>First Name</Label>
//               <Field
//                 name="firstname"
//                 type="text"
//                 placeholder="Enter first name"
//                 className="h-10 w-full rounded-md border border-white/15 bg-white/5 px-3 text-sm text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-indigo-400"
//               />
//               <ErrorText name="firstname" />
//             </div>
//             <div>
//               <Label>Last Name</Label>
//               <Field
//                 name="lastname"
//                 type="text"
//                 placeholder="Enter last name"
//                 className="h-10 w-full rounded-md border border-white/15 bg-white/5 px-3 text-sm text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-indigo-400"
//               />
//               <ErrorText name="lastname" />
//             </div>
//           </div>

//           {/* Mobile number (dial + phone) */}
//           <div>
//             <Label>Mobile Number</Label>
//             <div className="flex gap-2">
//               <CountryDialSelect
//                 value={values.dial}
//                 onChange={(v) => setFieldValue("dial", v)}
//               />
//               <Field
//                 name="phone"
//                 type="tel"
//                 placeholder="Please enter your Mobile Number"
//                 className="h-10 flex-1 rounded-md border border-white/15 bg-white/5 px-3 text-sm text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-indigo-400"
//               />
//             </div>
//             <div className="mt-1 grid grid-cols-[1fr_auto] items-center gap-2">
//               <ErrorText name="dial" />
//               <button
//                 type="button"
//                 className="rounded-md bg-white/10 px-3 py-2 text-sm text-white ring-1 ring-white/15 hover:bg-white/20"
//                 onClick={() => alert("OTP sent (demo)")}
//               >
//                 Send OTP
//               </button>
//             </div>
//             <ErrorText name="phone" />
//           </div>

//           {/* Email */}
//           <div>
//             <Label>Email</Label>
//             <div className="grid grid-cols-[1fr_auto] items-center gap-2">
//               <Field
//                 name="email"
//                 type="email"
//                 placeholder="Please enter your email"
//                 className="h-10 rounded-md border border-white/15 bg-white/5 px-3 text-sm text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-indigo-400"
//               />
//               <button
//                 type="button"
//                 className="rounded-md bg-white/10 px-3 py-2 text-sm text-white ring-1 ring-white/15 hover:bg-white/20"
//                 onClick={() => alert("Email OTP sent (demo)")}
//               >
//                 Send OTP
//               </button>
//             </div>
//             <ErrorText name="email" />
//           </div>

//           {/* Verification Code */}
//           <div>
//             <Label>Verification Code</Label>
//             <OtpInput
//               value={values.verificationCode}
//               onChange={(v) => setFieldValue("verificationCode", v)}
//             />
//             <ErrorText name="verificationCode" />
//           </div>

//           {/* Country of residence */}
//           <div>
//             <Label>Country of Residence</Label>
//             <CountryResidenceSelect
//               value={values.country}
//               onChange={(v) => setFieldValue("country", v)}
//             />
//             <ErrorText name="country" />
//           </div>

//           {/* Passwords */}
//           <div className="grid gap-4 sm:grid-cols-2">
//             <div>
//               <Label>Password</Label>
//               <Field
//                 name="password"
//                 type="password"
//                 placeholder="Please enter your password"
//                 className="h-10 w-full rounded-md border border-white/15 bg-white/5 px-3 text-sm text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-indigo-400"
//               />
//               <ErrorText name="password" />
//             </div>
//             <div>
//               <Label>Confirm Password</Label>
//               <Field
//                 name="confirmPassword"
//                 type="password"
//                 placeholder="Please enter your password again"
//                 className="h-10 w-full rounded-md border border-white/15 bg-white/5 px-3 text-sm text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-indigo-400"
//               />
//               <ErrorText name="confirmPassword" />
//             </div>
//           </div>

//           {/* Invitation code (optional) */}
//           <div>
//             <Label>Invitation Code (Optional)</Label>
//             <Field
//               name="invitation"
//               as="select"
//               className="h-10 w-full rounded-md border border-white/15 bg-white/5 px-3 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-400"
//             >
//               <option value="">Please select your invitation code</option>
//               <option value="GTC50">GTC50</option>
//               <option value="REF-1234">REF-1234</option>
//             </Field>
//           </div>

//           {/* Terms */}
//           <div className="rounded-md bg-white/5 p-3 ring-1 ring-white/10">
//             <label className="flex items-start gap-3 text-sm">
//               <Field type="checkbox" name="accept" className="mt-1 h-4 w-4" />
//               <span className="text-slate-100">
//                 By submitting your application you confirm that you have read, understood and agreed
//                 to all the{" "}
//                 <a
//                   className="underline underline-offset-2"
//                   href="https://www.gtcfx.com/terms-and-conditions"
//                   target="_blank"
//                   rel="noreferrer"
//                 >
//                   Terms And Conditions
//                 </a>
//                 ,{" "}
//                 <a
//                   className="underline underline-offset-2"
//                   href="https://gtcfx-bucket.s3.ap-southeast-1.amazonaws.com/pdf-files/%2450-Bonus-T%26Cs.pdf"
//                   target="_blank"
//                   rel="noreferrer"
//                 >
//                   Bonus Terms and Conditions
//                 </a>{" "}
//                 and{" "}
//                 <a
//                   className="underline underline-offset-2"
//                   href="https://www.gtcfx.com/client-agreement-VU"
//                   target="_blank"
//                   rel="noreferrer"
//                 >
//                   Client Agreement
//                 </a>
//                 .
//               </span>
//             </label>
//             <ErrorText name="accept" />
//           </div>

//           {/* Submit */}
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 font-semibold text-white shadow-lg ring-1 ring-indigo-400/30 hover:bg-indigo-600 disabled:opacity-60"
//           >
//             Get my Bonus
//             <svg
//               className="transition-transform group-hover:translate-x-1"
//               width="25"
//               height="24"
//               viewBox="0 0 25 24"
//               fill="none"
//             >
//               <path d="M9.5 6L15.5 12L9.5 18" stroke="#fff" strokeWidth="2" />
//             </svg>
//           </button>
//         </Form>
//       )}
//     </Formik>
//   );
// }

"use client";
import Image from "next/image";
import CommonMainForm from "./commonForm"; // reuse your form as-is
import { useState } from "react";

export default function GTCRegisterWithDesign() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#1a1a47] text-white [clip-path:none] md:[clip-path:polygon(0%_0%,100%_0,100%_20%,100%_100%,0%_90%)]">
      {/* Top Bar (Logo + Language Switcher placeholder) */}
      <header className="flex justify-between items-center max-w-6xl mx-auto px-4 py-4">
        <div className="container mx-auto text-center flex flex-col md:flex-row justify-center items-center gap-4">
        <Image
          src="https://gtcfx-bucket.s3.ap-southeast-1.amazonaws.com/img/footer-logo.webp"
          width={200}
          height={72}
          alt="GTCFX"
          className="lg:w-[110px] lg:h-[40px] md:w-[110px] md:h-[40px] w-[130px] h-[47px] cursor-pointer"
        />
      </div>
        <LanguageSelect />
        {/* You can drop your language switcher component here */}
      </header>

      {/* Main Layout */}
      <div style={{ background: "linear-gradient(135deg,#293794,#000021)" }}>
        <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 px-4 py-10">
          {/* Left Section */}
          <div>
            <h1 className="text-4xl font-bold text-[#B48755]">
              Get 5,000 USC to Trade.
            </h1>
            <p className="mt-2 text-2xl">No Deposit Needed!</p>
            <p className="mt-4 text-sm text-gray-200 max-w-md">
              Fill in your details, activate your GTC Cent trading account, and
              start trading with a $50 bonus today.
            </p>

            {/* Features */}
            <div className="mt-8 space-y-4">
              <div className="bg-white p-4 rounded-xl text-[#4D4D70]">
                <h3 className="font-semibold text-[#B48755]">
                  Real funds, Real Trading Power
                </h3>
                <p className="text-sm">
                  Use your 5,000 USC to trade real markets.
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl text-[#4D4D70]">
                <h3 className="font-semibold text-[#B48755]">
                  No risk to your own capital
                </h3>
                <p className="text-sm">
                  Test strategies while your funds stay safe.
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl text-[#4D4D70]">
                <h3 className="font-semibold text-[#B48755]">
                  Instant Withdrawals
                </h3>
                <p className="text-sm">Peace of mind with fast withdrawals.</p>
              </div>
            </div>

            {/* Mobile: Drawer Button */}
            <div className="mt-8 lg:hidden">
              <button
                onClick={() => setDrawerOpen(true)}
                className="w-full bg-[#B48755] py-3 rounded-xl text-white font-semibold"
              >
                Register Now
              </button>
            </div>
          </div>

          {/* Right Section (desktop form) */}
          <div className="hidden lg:block">
            <div className="bg-white text-[#4D4D70] p-6 rounded-2xl shadow-lg">
              <h3 className="mb-4 text-xl font-semibold">Register Now</h3>
              <CommonMainForm zapierUrl="/api/zap" successPath="/thank-you" />
            </div>
          </div>
        </div>
      </div>

      {/* Drawer (mobile form) */}
      <div
        className={`fixed inset-0 z-50 flex justify-end bg-black/50 transition-opacity duration-300 ${
          drawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setDrawerOpen(false)} // closes when clicking backdrop
      >
        <div
          className={`w-full sm:w-[480px] h-full bg-white text-[#4D4D70] p-6 overflow-auto transform transition-transform duration-500 ease-in-out ${
            drawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
        >
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-semibold">Register Now</h3>
            <button onClick={() => setDrawerOpen(false)}>✕</button>
          </div>
          <CommonMainForm zapierUrl="/api/zap" successPath="/thank-you" />
        </div>
      </div>
    </div>
  );
}

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

const LanguageSelect = () => {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(LANGS[0]);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((s) => !s)}
        className="flex items-center gap-2 rounded-md bg-white/10 px-3 py-1.5 text-sm text-white ring-1 ring-white/10 hover:bg-white/20"
      >
        <img
          src={current.flag}
          alt={current.code}
          className="h-5 w-7 rounded-sm"
        />
        {current.code}
        <svg
          className="h-4 w-4 opacity-80"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.062l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.08z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 z-30 mt-2 max-h-72 w-32 overflow-auto rounded-lg bg-white p-2 text-slate-900 shadow-xl">
          {LANGS.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setCurrent(l);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-slate-100 ${
                current.code === l.code ? "bg-slate-50" : ""
              }`}
            >
              <img src={l.flag} alt={l.code} className="h-4 w-6 rounded-sm" />
              <span className="font-medium">{l.code}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// "use client"
// // GTCRegisterOriginal.jsx
// import React, { useState } from "react";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";

// // --- Validation Schema ---
// const Schema = Yup.object({
//   firstname: Yup.string().required("First name is required"),
//   lastname: Yup.string().required("Last name is required"),
//   phone: Yup.string().required("Mobile number is required"),
//   email: Yup.string().email("Invalid email").required("Email is required"),
//   verificationCode: Yup.string()
//     .matches(/^\d{6}$/, "Enter 6 digits")
//     .required("Verification code is required"),
//   country: Yup.string().required("Country is required"),
//   password: Yup.string().min(6, "At least 6 characters").required("Password is required"),
//   confirmPassword: Yup.string()
//     .oneOf([Yup.ref("password")], "Passwords must match")
//     .required("Confirm your password"),
//   accept: Yup.boolean().oneOf([true], "You must accept the terms"),
// });

// // --- Component ---
// export default function GTCRegisterOriginal() {
//   const [drawerOpen, setDrawerOpen] = useState(false);

//   const initialValues = {
//     firstname: "",
//     lastname: "",
//     phone: "",
//     email: "",
//     verificationCode: "",
//     country: "",
//     password: "",
//     confirmPassword: "",
//     invitation: "",
//     accept: true,
//   };

//   const handleSubmit = (values, { setSubmitting }) => {
//     alert("Submitted:\n" + JSON.stringify(values, null, 2));
//     setSubmitting(false);
//   };

//   return (
//     <div className="min-h-screen bg-[#0B0E2A] text-white">
//       <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-10 lg:grid-cols-2">
//         {/* Left Content */}
//         <div>
//           <h1 className="text-4xl font-bold text-[#B48755]">Get 5,000 USC to Trade.</h1>
//           <p className="mt-2 text-2xl text-white">No Deposit Needed!</p>
//           <p className="mt-4 text-sm text-gray-200 max-w-md">
//             Fill in your details, activate your GTC Cent trading account, and start trading with a
//             $50 bonus today. Peace of mind trading at its best, only with GTC, South America’s
//             fastest-growing brokerage.
//           </p>

//           {/* Feature Cards */}
//           <div className="mt-8 space-y-6">
//             {[
//               {
//                 title: "Real funds, Real Trading Power",
//                 desc: "Use your 5,000 USC to trade real markets & not demo simulations.",
//               },
//               {
//                 title: "No risk to your own capital",
//                 desc: "Test strategies or explore our trading platform. Your funds stay untouched.",
//               },
//               {
//                 title: "Instant Withdrawals",
//                 desc: "Trade with peace of mind on a Cent Account with a multi-regulated brokerage.",
//               },
//             ].map((c, i) => (
//               <div key={i} className="rounded-xl bg-white p-5 shadow-md text-[#4D4D70]">
//                 <h3 className="font-semibold text-[#B48755]">{c.title}</h3>
//                 <p className="mt-2 text-sm">{c.desc}</p>
//               </div>
//             ))}
//           </div>

//           {/* Mobile: Register Drawer Button */}
//           <div className="mt-8 lg:hidden">
//             <button
//               onClick={() => setDrawerOpen(true)}
//               className="w-full rounded-xl bg-[#B48755] py-3 font-semibold text-white"
//             >
//               Register Now
//             </button>
//           </div>
//         </div>

//         {/* Right Form (Desktop) */}
//         <div className="hidden lg:block">
//           <div className="rounded-2xl bg-white p-6 shadow-lg text-[#4D4D70]">
//             <h3 className="mb-4 text-xl font-semibold">Register Now</h3>
//             <FormCard initialValues={initialValues} onSubmit={handleSubmit} />
//           </div>
//         </div>
//       </div>

//       {/* Drawer (Mobile) */}
//       {drawerOpen && (
//         <div className="fixed inset-0 z-50 flex items-end bg-black/50">
//           <div className="w-full max-h-[90vh] overflow-auto rounded-t-2xl bg-white p-6 text-[#4D4D70]">
//             <div className="mb-4 flex justify-between">
//               <h3 className="text-lg font-semibold">Register Now</h3>
//               <button onClick={() => setDrawerOpen(false)}>✕</button>
//             </div>
//             <FormCard initialValues={initialValues} onSubmit={handleSubmit} />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // --- Form Component with Formik ---
// function FormCard({ initialValues, onSubmit }) {
//   return (
//     <Formik initialValues={initialValues} validationSchema={Schema} onSubmit={onSubmit}>
//       {({ isSubmitting }) => (
//         <Form className="space-y-4">
//           {/* First + Last Name */}
//           <div className="grid gap-4 sm:grid-cols-2">
//             <div>
//               <label className="text-sm font-medium">First Name</label>
//               <Field
//                 name="firstname"
//                 type="text"
//                 className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
//               />
//               <ErrorMessage name="firstname" component="div" className="text-xs text-red-500" />
//             </div>
//             <div>
//               <label className="text-sm font-medium">Last Name</label>
//               <Field
//                 name="lastname"
//                 type="text"
//                 className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
//               />
//               <ErrorMessage name="lastname" component="div" className="text-xs text-red-500" />
//             </div>
//           </div>

//           {/* Phone */}
//           <div>
//             <label className="text-sm font-medium">Mobile Number</label>
//             <Field
//               name="phone"
//               type="tel"
//               className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
//             />
//             <ErrorMessage name="phone" component="div" className="text-xs text-red-500" />
//           </div>

//           {/* Email */}
//           <div>
//             <label className="text-sm font-medium">Email</label>
//             <Field
//               name="email"
//               type="email"
//               className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
//             />
//             <ErrorMessage name="email" component="div" className="text-xs text-red-500" />
//           </div>

//           {/* OTP */}
//           <div>
//             <label className="text-sm font-medium">Verification Code</label>
//             <Field
//               name="verificationCode"
//               type="text"
//               maxLength="6"
//               className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
//             />
//             <ErrorMessage
//               name="verificationCode"
//               component="div"
//               className="text-xs text-red-500"
//             />
//           </div>

//           {/* Country */}
//           <div>
//             <label className="text-sm font-medium">Country of Residence</label>
//             <Field
//               as="select"
//               name="country"
//               className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
//             >
//               <option value="">Select Country</option>
//               <option value="Pakistan">Pakistan</option>
//               <option value="UAE">UAE</option>
//               <option value="USA">USA</option>
//             </Field>
//             <ErrorMessage name="country" component="div" className="text-xs text-red-500" />
//           </div>

//           {/* Password */}
//           <div>
//             <label className="text-sm font-medium">Password</label>
//             <Field
//               name="password"
//               type="password"
//               className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
//             />
//             <ErrorMessage name="password" component="div" className="text-xs text-red-500" />
//           </div>

//           {/* Confirm Password */}
//           <div>
//             <label className="text-sm font-medium">Confirm Password</label>
//             <Field
//               name="confirmPassword"
//               type="password"
//               className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
//             />
//             <ErrorMessage
//               name="confirmPassword"
//               component="div"
//               className="text-xs text-red-500"
//             />
//           </div>

//           {/* Invitation Code */}
//           <div>
//             <label className="text-sm font-medium">Invitation Code (Optional)</label>
//             <Field
//               name="invitation"
//               type="text"
//               className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
//             />
//           </div>

//           {/* Terms */}
//           <div className="flex items-center gap-2">
//             <Field type="checkbox" name="accept" className="h-4 w-4" />
//             <label className="text-sm">
//               I accept the <a href="#" className="text-[#B48755] underline">T&Cs</a>
//             </label>
//           </div>
//           <ErrorMessage name="accept" component="div" className="text-xs text-red-500" />

//           {/* Submit */}
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="w-full rounded-xl bg-[#B48755] py-3 font-semibold text-white"
//           >
//             Get my Bonus →
//           </button>
//         </Form>
//       )}
//     </Formik>
//   );
// }
