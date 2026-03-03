"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useEffect, useState } from "react";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import "react-phone-number-input/style.css";
import OtpInput from "react-otp-input";
import { countryList } from "../context/useCountriesDetails";
import { useLocationDetail } from "../context/useLocationDetail";
import { toast } from "react-toastify";
import Select from "react-select";
import { useTranslations, useLocale } from "next-intl";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { dialCodeByAlpha2 } from "../context/useDialCodes";

// Blocked countries for OTP and MT5 server (CN=China, PK=Pakistan, ID=Indonesia, TR=Turkey)
const BLOCKED_COUNTRIES = ["CN", "PK", "ID", "TR"];

// Blocked fake/temporary email domains
const BLOCKED_EMAIL_DOMAINS = [
  "yopmail.com",
  "yopmail.fr",
  "yopmail.net",
  "mailinator.com",
  "guerrillamail.com",
  "guerrillamailblock.com",
  "10minutemail.com",
  "tempmail.com",
  "throwaway.email",
  "temp-mail.org",
  "mohmal.com",
  "trashmail.com",
  "maildrop.cc",
  "tempail.com",
  "getnada.com",
  "mintemail.com",
  "mytrashmail.com",
  "sharklasers.com",
  "spamgourmet.com",
  "mailnesia.com",
  "meltmail.com",
  "mailcatch.com",
  "emailondeck.com",
  "fakeinbox.com",
  "dispostable.com",
  "emailfake.com",
  "getairmail.com",
  "mailin8r.com",
  "mailme.lv",
  "tempr.email",
  "tmpmail.org",
  "mail.tm",
  "emailnator.com",
];

// put above your return()
const selectStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "#fff",
    color: "#000",
    borderColor: state.isFocused ? "#666684" : "#d1d5db",
    boxShadow: "none",
    ":hover": { borderColor: "#666684" },
    minHeight: 42,
  }),
  valueContainer: (base) => ({ ...base, color: "#000" }),
  singleValue: (base) => ({ ...base, color: "#000" }),
  input: (base) => ({ ...base, color: "#000" }),
  placeholder: (base) => ({ ...base, color: "#6b7280" }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#fff",
    color: "#000",
    zIndex: 9999,
  }),
  menuList: (base) => ({ ...base, backgroundColor: "#fff" }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#e5e7eb"
      : state.isFocused
      ? "#f3f4f6"
      : "#fff",
    color: "#000",
    ":active": { backgroundColor: "#e5e7eb" },
  }),
  indicatorSeparator: (base) => ({ ...base, backgroundColor: "#e5e7eb" }),
  dropdownIndicator: (base, state) => ({
    ...base,
    color: state.isFocused ? "#666684" : "#9ca3af",
    ":hover": { color: "#666684" },
  }),
};

const CommonMainFormCopy = ({
  zapierUrl,
  successPath,
  isMobile = false,
  isPreAccount = false,
}) => {
  const { countryData } = useLocationDetail();
  const [otpLoading, setOtpLoading] = useState(false);
  const [phoneOtpLoading, setPhoneOtpLoading] = useState(false);
  const params = useSearchParams();
  const token = params.get("token");
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDisable, setIsDisable] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpPhoneNumber, setOtpPhoneNumber] = useState("");
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const campaign = params.get("utm_source");
  const fbclid = params.get("fbclid");
  const qrCodeId = params.get("id");
  const path = usePathname();

  const router = useRouter();
  const t = useTranslations("home.form");
  const locale = useLocale();

  // prepare country options
  const options = countryList?.map((item) => ({
    value: item.alpha_2_code,
    label: (
      <div className="flex items-center gap-2">
        <img
          src={`https://flagcdn.com/w40/${item.alpha_2_code.toLowerCase()}.png`}
          alt={item.en_short_name}
          className="w-5 h-4 object-cover"
        />
        <span>{item.en_short_name}</span>
      </div>
    ),
  }));

  const getIso2ByCountryName = (name) => {
    const hit = countryList.find((c) => c.en_short_name === name);
    return hit?.alpha_2_code;
  };

  // generate password
  const generatePassword = (length = 12) => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    return Array.from(
      { length },
      () => chars[Math.floor(Math.random() * chars.length)]
    ).join("");
  };

  // make a token like "webword12345"
  const makeToken = () =>
    "web" + String(Math.floor(Math.random() * 100000)).padStart(5, "0");
  const isTokenAvailable = async (t) => {
    const r = await fetch(`/api/sheets?tokenCheck=${encodeURIComponent(t)}`, {
      cache: "no-store",
    });
    const { ok, formatOk, available } = await r.json();
    return !!ok && !!formatOk && !!available;
  };

  const getUniqueToken = async (maxTries = 10) => {
    for (let i = 0; i < maxTries; i++) {
      const candidate = makeToken();
      const ok = await isTokenAvailable(candidate);
      if (ok) return candidate;
    }
    throw new Error(
      "Token check kept failing. Verify /api/sheets GET and 'token' header."
    );
  };

  const genPassword = generatePassword();

  // formik setup
  const formik = useFormik({
    initialValues: {
      nickname: "",
      last_name: "",
      email: "",
      phone: "",
      country: "",
      otp: "",
      password: genPassword,
      confirmPassword: genPassword,
      invitation: token,
      terms: false,
      account_no: "",
    },
    validationSchema: Yup.object({
      nickname: Yup.string().required(t("errors.firstNameRequired")),
      last_name: Yup.string().required(t("errors.lastNameRequired")),
      email: Yup.string()
        .email(t("errors.emailInvalid"))
        .required(t("errors.emailRequired"))
        .test(
          "no-plus-sign",
          "Email address cannot contain '+'",
          (value) => !value || !value.includes("+")
        )
        .test(
          "blocked-domain",
          "This email domain is not allowed. Please use a valid email address.",
          (value) => {
            if (!value) return true;
            const emailDomain = value.split("@")[1]?.toLowerCase();
            return !BLOCKED_EMAIL_DOMAINS.includes(emailDomain);
          }
        ),
      phone: Yup.string()
        .required(t("errors.phoneRequired"))
        .test("is-valid-e164", t("errors.phoneInvalid"), (value) => {
          if (!value) return false;
          return isValidPhoneNumber(value);
        })
        .test(
          "matches-selected-country",
          "Number doesn’t match selected country",
          function (value) {
            const selectedCountryName = this.parent.country;
            if (!value || !selectedCountryName) return true;
            const selectedIso2 = getIso2ByCountryName(selectedCountryName);
            if (!selectedIso2) return true;
            const pn = parsePhoneNumberFromString(value);
            if (!pn) return false;
            return pn.country === selectedIso2;
          }
        ),
      country: Yup.string().required(t("errors.countryRequired")),
      otp: Yup.string()
        .length(6, t("errors.otpLength"))
        .required(t("errors.otpRequired")),
      account_no: isPreAccount
        ? Yup.string().required("Account number is required")
        : Yup.string(),
      terms: Yup.bool().oneOf([true], t("errors.termsRequired")),
    }),
    onSubmit: async (values) => {
      const areaCode = dialCodeByAlpha2[values?.country];
      setLoading(true);
      let mtData = null;

      // Check if country is from blocked countries (China, Pakistan, Indonesia, Turkey)
      const isBlockedCountry = BLOCKED_COUNTRIES.includes(values?.country);
      if (isBlockedCountry) {
        toast.error("Registration is not available for your country. Please contact support.");
        setLoading(false);
        return;
      }

      // Check if OTP is verified before proceeding (state is set after server-side verification)
      if (!isOtpVerified) {
        toast.error("Please verify your phone number with OTP before submitting.");
        setLoading(false);
        return;
      }

      try {
        const token = await getUniqueToken();
        const companionsSummary =
          values.isAnyone === "yes" && values.companions?.length
            ? values.companions
                .slice(0, Number(values.companionsCount) || 0)
                .map((p, i) =>
                  `${i + 1}) ${p.first || ""} ${p.last || ""}`.trim()
                )
                .join(" | ")
            : "";

        // STEP 1: Execute all critical APIs first (before saving to sheet)
        if (isPreAccount == false) {
          // 1) create CRM client
          const res = await fetch("/api/create-client", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_account_type: 0,
              country: values?.country,
              first_name: values?.nickname,
              last_name: values?.last_name,
              email: values?.email,
              area_code: areaCode ?? values?.country ?? "92", // use dial code, not country ISO
              phone: values?.phone,
              pwd: values?.password,
              token: values?.invitation,
            }),
          });

          const createData = await res.json();
          if (!res.ok || createData?.ret_code !== 0) {
            console.error("Create client failed:", createData);
            toast.error(createData?.ret_msg || "Create client failed");
            setLoading(false);
            return;
          }

          const client_id =
            createData?.ret_msg?.client_id ?? createData?.client_id;

          // 2) create MT account
          const payloadAddUser = {
            client_id,
            name: values?.nickname,
            comment: "Falcon Awards 2025",
            account_type: 0, // 0=trading, 2=agent
            manager_id: 3, // 1=MT4, 3=MT5
            // ESCAPE backslashes in JS string:
            account_group: "real\\OZ\\MKT\\USC-XSCP00000-V",
            leverage: 100, // confirm format (100 vs "1:100")
            // master_pwd: values?.password,      // optional
            // investor_pwd: "ViewOnly123",       // optional
          };

          const res2 = await fetch("/api/create-mt", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payloadAddUser),
          });

          mtData = await res2.json();
          if (!res2.ok || mtData?.ret_code !== 0) {
            console.error("Create MT account failed:", mtData);
            toast.error(mtData?.ret_msg || "Create MT account failed");
            setLoading(false);
            return;
          }

          // 3) update MT5 server (skip for blocked countries - check both country and phone number)
          const isBlockedCountry = BLOCKED_COUNTRIES.includes(values?.country);
          const phoneNumber = parsePhoneNumberFromString(values?.phone);
          const isBlockedPhone = phoneNumber?.country && BLOCKED_COUNTRIES.includes(phoneNumber.country);
          
          if (!isBlockedCountry && !isBlockedPhone) {
            try {
              const userUpdate = await axios.post(`/api/mt5-server`, {
                Login: mtData?.ret_msg?.login,
                Comment: "Lucky Draw 2025",
              });
              
              // Check if the response indicates success
              if (userUpdate?.status !== 200 && userUpdate?.status !== 201) {
                throw new Error("MT5 server update failed");
              }
            } catch (mt5Error) {
              console.error("MT5 server update failed:", mt5Error);
              toast.error(
                mt5Error?.response?.data?.message ||
                  mt5Error?.message ||
                  "MT5 server update failed"
              );
              setLoading(false);
              return;
            }
          }
        }

        // STEP 2: If we reach here, all critical APIs succeeded
        // Now save to sheet only after all APIs succeeded
        const row = [
          values.nickname, // firstName
          values.last_name, // lastName
          values.email, // email
          values.phone, // phone
          values.country, // country
          companionsSummary, // companions (6th column)
          token, // token
          path,
          campaign,
          new Date().toISOString(),
        ];

        const resSheet = await fetch("/api/sheets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ withObject: true, values: [row] }),
        });

        const json = await resSheet.json();
        if (!json.ok) {
          toast.error(json.error || "Failed to save to sheet.");
          setLoading(false);
          return;
        }

        // STEP 3: Send emails only after sheet is saved
        try {
          await axios.post(
            "/api/lucky-draw-email",
            JSON.stringify({
              nickname: values?.nickname,
              email: values?.email,
              cPassword: genPassword,
              token: token,
              locale,
            })
          );
        } catch (emailError) {
          console.error("Lucky draw email failed:", emailError);
          // Continue even if email fails, but log it
        }

        if (isPreAccount == false && mtData) {
          try {
            await axios.post(
              "/api/email",
              JSON.stringify({
                name: values?.nickname,
                invest_password: mtData?.ret_msg?.investor_pwd,
                password: mtData?.ret_msg?.master_pwd,
                user: mtData?.ret_msg?.login,
                email: values?.email,
                cPassword: genPassword,
                locale,
              })
            );
          } catch (emailError) {
            console.error("Account email failed:", emailError);
            // Continue even if email fails, but log it
          }
        }

        // STEP 4: Send to Zapier
        try {
          await axios.post(
            zapierUrl,
            JSON.stringify({
              ...values,
              token: token,
              account_no: isPreAccount ? values?.account_no : "",
            })
          );
        } catch (zapierError) {
          console.error("Zapier webhook failed:", zapierError);
          // Continue even if Zapier fails, but log it
        }

        // STEP 5: Success - save to localStorage and redirect
        toast.success(t("thankYou1"));
        localStorage.setItem(
          "user",
          JSON.stringify({ ...values, token: token })
        );
        router.push(successPath);
        formik.resetForm();
        setIsOtpVerified(false); // Reset OTP verification after successful submission
      } catch (err) {
        console.error("Form submission error:", err);
        toast.error(err?.response?.data?.message || err?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    },
  });

  // Set country and invitation after formik is initialized
  useEffect(() => {
    if (countryData?.country) {
      const filterData = countryList.find(
        (item) =>
          item?.en_short_name == countryData.country ||
          item?.alpha_2_code == countryData.country
      );
      formik.setFieldValue(
        "country",
        filterData ? filterData?.alpha_2_code : ""
      );
    }
    formik.setFieldValue("invitation", token || "8owwwwwwzcowwwww");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryData?.country, countryList, params, token]);

  // Reset OTP verification when phone number changes
  useEffect(() => {
    if (otpPhoneNumber && formik.values.phone && formik.values.phone !== otpPhoneNumber) {
      // Phone number changed after OTP was sent, reset OTP state
      setShowOtp(false);
      setIsDisable(true);
      setIsOtpVerified(false); // Reset OTP verified status
      formik.setFieldValue("otp", "");
      setOtpPhoneNumber("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.phone, otpPhoneNumber]);

  const sendPhoneVerificationCode = () => {
    if (!formik.values.phone) {
      toast.error(t("errors.phoneRequired"));
      return;
    }
    if (!isValidPhoneNumber(formik.values.phone)) {
      toast.error(t("errors.phoneInvalid"));
      return;
    }
    setPhoneOtpLoading(true);
    axios
      .post(`/api/send-phone-otp`, {
        phone: formik.values.phone,
        first_name: formik.values.nickname,
        locale,
        channel: "whatsapp",
      })
      .then((res) => {
        if (res?.data?.success || res?.data?.message) {
          setShowOtp(true);
          formik.setFieldValue("otp", "");
          setIsDisable(true);
          setIsOtpVerified(false); // Reset verification status when new OTP is sent
          // Store the phone number that OTP was sent to (for tracking changes)
          setOtpPhoneNumber(formik.values.phone);
          toast.success(t("otpSent"));
        } else {
          toast.error(res?.data?.message || t("otpFail"));
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error(
          error?.response?.data?.message || error?.message || t("otpFail")
        );
      })
      .finally(() => setPhoneOtpLoading(false));
  };

  // Check if country or phone is from blocked countries
  const isBlockedCountryOrPhone =
    BLOCKED_COUNTRIES.includes(formik.values.country) ||
    (formik.values.phone &&
      parsePhoneNumberFromString(formik.values.phone)?.country &&
      BLOCKED_COUNTRIES.includes(parsePhoneNumberFromString(formik.values.phone)?.country));

  // Check if phone number is valid and complete
  const isPhoneValid =
    formik.values.phone && isValidPhoneNumber(formik.values.phone);

  // verify OTP server-side
  const verifyOtpCode = async (otp) => {
    if (!otp || otp.length !== 6) {
      return;
    }

    setVerifyingOtp(true);
    try {
      const res = await axios.post("/api/verify-otp", {
        phone: formik.values.phone,
        otp: otp,
      });

      if (res?.data?.success) {
        toast.success(t("otpSuccess") || "OTP verified successfully");
        setShowOtp(false);
        setIsDisable(false);
        setIsOtpVerified(true); // Mark OTP as verified
      } else {
        toast.error(res?.data?.message || t("otpFail") || "Invalid OTP");
        setIsOtpVerified(false); // Ensure it's false on failure
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error(
        error?.response?.data?.message || error?.message || t("otpFail") || "Failed to verify OTP"
      );
      setIsOtpVerified(false); // Ensure it's false on error
    } finally {
      setVerifyingOtp(false);
    }
  };

  const color = isMobile ? "text-[#fff]" : "text-[#666684]";

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      {/* First + Last Name */}
      <input
        name="fbclid"
        className="hidden"
        type="text"
        onChange={formik.handleChange}
        value={
          !formik.values.fbclid || formik.values.fbclid === ""
            ? (formik.values.fbclid = fbclid)
            : (formik.values.fbclid = fbclid)
        }
      />
      <input
        name="utm_campain"
        className="hidden"
        type="text"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={
          !formik.values.utm_campain || formik.values.utm_campain === ""
            ? (formik.values.utm_campain = path)
            : (formik.values.utm_campain = path)
        }
      />
      <input
        name="utm_source"
        className="hidden"
        type="text"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={
          !formik.values.utm_source || formik.values.utm_source === ""
            ? (formik.values.utm_source = campaign)
            : (formik.values.utm_source = campaign)
        }
      />
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={`text-sm ${color} mb-1`}>{t("firstName")}</label>
          <input
            type="text"
            placeholder={t("firstName")}
            {...formik.getFieldProps("nickname")}
            className={`w-full border px-3 py-2 text-primary ${
              isMobile ? "bg-[#33335b]" : ""
            } rounded-md ${
              formik.touched.nickname && formik.errors.nickname
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          {formik.touched.nickname && formik.errors.nickname && (
            <p className="text-xs text-red-500">{formik.errors.nickname}</p>
          )}
        </div>
        <div>
          <label className={`text-sm ${color} mb-1`}>{t("lastName")}</label>
          <input
            type="text"
            placeholder={t("lastName")}
            {...formik.getFieldProps("last_name")}
            className={`w-full border px-3 py-2 rounded-md text-primary ${
              isMobile ? "bg-[#33335b]" : ""
            } ${
              formik.touched.last_name && formik.errors.last_name
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          {formik.touched.last_name && formik.errors.last_name && (
            <p className="text-xs text-red-500">{formik.errors.last_name}</p>
          )}
        </div>
      </div>

      {/* Email + OTP */}
      <div>
        <label className={`text-sm ${color} mb-1`}>{t("email")}</label>
        <div className="relative">
          <input
            type="email"
            placeholder={t("email")}
            {...formik.getFieldProps("email")}
            className={`w-full border px-3 py-2 rounded-md text-primary ${
              isMobile ? "bg-[#33335b]" : ""
            } ${
              formik.touched.email && formik.errors.email
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          {/* <button
                        type="button"
                        onClick={sendVerificationCode}
                        className={`absolute min-h-[41px] top-0 ${locale == "ar" ? "left-0" : "right-0"} bg-[#666684] text-white px-3 py-1 rounded-md text-xs`}
                    >
                        {otpLoading ? t("sending") : t("getCode")}
                    </button> */}
        </div>
        {formik.touched.email && formik.errors.email && (
          <p className="text-xs text-red-500">{formik.errors.email}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label className={`text-sm ${color} mb-1`}>Enter WhatsApp Number</label>
        <div className="flex flex-col sm:flex-row gap-2">
          <PhoneInput
            international
            defaultCountry={
              countryData?.country_code || countryData?.country || "AE"
            }
            value={formik.values.phone}
            onChange={(phone) => formik.setFieldValue("phone", phone)}
            className={`flex-1 border px-3 text-primary py-2 ${
              isMobile ? "bg-[#33335b]" : ""
            } rounded-md ${
              formik.touched.phone && formik.errors.phone
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          {!isBlockedCountryOrPhone && (
            <button
              type="button"
              onClick={sendPhoneVerificationCode}
              disabled={phoneOtpLoading || !isPhoneValid}
              className="min-h-[41px] bg-[#666684] text-white px-4 py-2 rounded-md text-xs sm:text-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {phoneOtpLoading ? t("sending") : t("getCode")}
            </button>
          )}
        </div>
        {formik.touched.phone && formik.errors.phone && (
          <p className="text-xs text-red-500">{formik.errors.phone}</p>
        )}
      </div>

      {showOtp && (
        <div>
          <p className="text-sm mb-2 text-primary">
            OTP has been sent to given Number
          </p>
          <div className=" flex gap-3 items-center">
            <OtpInput
              value={formik.values.otp}
              onChange={(otp) => {
                formik.setFieldValue("otp", otp);
                if (otp?.length == 6) {
                  verifyOtpCode(otp);
                }
              }}
              numInputs={6}
              containerStyle={{
                display: "flex",
                justifyContent: "space-between",
                gap: "3px",
              }}
              isInputNum
              renderInput={(props) => (
                <input
                  {...props}
                  type="tel" // Triggers number pad
                  inputMode="numeric" // Helps mobile keyboard detect numeric input
                  pattern="[0-9]*" // Optional: enforce numeric
                />
              )}
              inputStyle={{
                fontSize: "16px", // ✅ critical to stop iOS zoom
                borderRadius: "5px",
                paddingBottom: "10px",
                paddingTop: "10px",
                width: "15%",
                backgroundColor: "#fff",
                color: "#666684",
                fontWeight: "700",
                outlineColor: "#666684",
                border:
                  formik.touched.otp && formik.errors.otp
                    ? "1px solid red"
                    : "1px solid #666684",
              }}
            />
            {/* <button
                            type="button"
                            onClick={verifyOtpCode}
                            className=" bg-[#666684] text-white px-3 py-1 rounded-md text-sm"
                        >
                            {t("verifyCode")}
                        </button> */}
          </div>
        </div>
      )}
      {isPreAccount && (
        <div>
          <label className={`text-sm ${color} mb-1`}>Account Number</label>
          <input
            type="text"
            placeholder={"Account Number"}
            {...formik.getFieldProps("account_no")}
            className={`w-full border px-3 py-2 rounded-md text-primary ${
              isMobile ? "bg-[#33335b]" : ""
            } ${
              formik.touched.account_no && formik.errors.account_no
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          {formik.touched.account_no && formik.errors.account_no && (
            <p className="text-xs text-red-500">{formik.errors.account_no}</p>
          )}
        </div>
      )}

      {/* Country */}
      <div>
        <label className={`text-sm ${color} mb-1`}>{t("country")}</label>
        <Select
          name="country"
          options={options}
          styles={selectStyles}
          onChange={(opt, e) => {
            console.log({ opt, e });
            formik.setFieldValue("country", opt?.value);
          }}
          onBlur={() => formik.setFieldTouched("country", true)}
          value={options.find((opt) => opt.value === formik.values.country)}
        />
        {formik.touched.country && formik.errors.country && (
          <p className="text-xs text-red-500">{formik.errors.country}</p>
        )}
      </div>

      {/* Terms */}
      <div className="flex items gap-2">
        <input
          type="checkbox"
          id="terms"
          {...formik.getFieldProps("terms")}
          className="h-5 w-5"
        />
        <label htmlFor="terms" className="text-xs text-primary">
          By submitting your application you confirm that you have read,
          understood and agreed to all the{" "}
          <a
            className="text-secondary link"
            data-v-30779926=""
            href="https://www.gtcfx.com/terms-and-conditions"
            target="_blank"
          >
            Terms And Conditions
          </a>
          ,{" "}
          <a
            className="text-secondary link"
            data-v-30779926=""
            href="https://gtcfx-bucket.s3.ap-southeast-1.amazonaws.com/pdf-files/5000USC-T%26C.pdf"
            target="_blank"
          >
            Bonus Terms and Conditions
          </a>{" "}
          and{" "}
          <a
            className="text-secondary link"
            data-v-30779926=""
            href="https://www.gtcfx.com/legal-policies-client-agreements"
            target="_blank"
          >
            Client Agreement .
          </a>
        </label>
      </div>
      {formik.touched.terms && formik.errors.terms && (
        <p className="text-xs text-red-500">{formik.errors.terms}</p>
      )}

      {/* Submit */}
        <button
          type="submit"
          disabled={loading || !isOtpVerified}
          className={`w-full  ${
            isMobile ? "text-[#000032]" : "text-white"
          } py-3 rounded-xl font-medium cursor-pointer text-sm disabled:opacity-50`}
          style={{
            background: isMobile
              ? "#fff"
              : "linear-gradient(135deg, #293794 0%, #000021 100%)",
          }}
        >
          {loading ? "Submitting.." : t("btnText")}
        </button>
    </form>
  );
};

export default CommonMainFormCopy;
