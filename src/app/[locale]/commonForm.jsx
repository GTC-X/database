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
import { useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { dialCodeByAlpha2 } from "../context/useDialCodes";

// helper: returns true if today in Dubai is the 6th or 7th
const isDubaiDaySixOrSeven = () => {
    const now = new Date();
    const dayDubai = Number(
        new Intl.DateTimeFormat("en-GB", {
            timeZone: "Asia/Dubai",
            day: "2-digit",
        }).format(now)
    );
    return dayDubai === 6 || dayDubai === 7;
    // If you want ONLY October 6–7, use month check too:
    // const monthDubai = Number(new Intl.DateTimeFormat("en-GB", { timeZone:"Asia/Dubai", month:"2-digit"}).format(now));
    // return monthDubai === 10 && (dayDubai === 6 || dayDubai === 7);
};


// put above your return()
const selectStyles = {
    control: (base, state) => ({
        ...base,
        backgroundColor: '#fff',
        color: '#000',
        borderColor: state.isFocused ? '#666684' : '#d1d5db',
        boxShadow: 'none',
        ':hover': { borderColor: '#666684' },
        minHeight: 42,
    }),
    valueContainer: (base) => ({ ...base, color: '#000' }),
    singleValue: (base) => ({ ...base, color: '#000' }),
    input: (base) => ({ ...base, color: '#000' }),
    placeholder: (base) => ({ ...base, color: '#6b7280' }),
    menu: (base) => ({
        ...base,
        backgroundColor: '#fff',
        color: '#000',
        zIndex: 9999,
    }),
    menuList: (base) => ({ ...base, backgroundColor: '#fff' }),
    option: (base, state) => ({
        ...base,
        backgroundColor: state.isSelected
            ? '#e5e7eb'
            : state.isFocused
                ? '#f3f4f6'
                : '#fff',
        color: '#000',
        ':active': { backgroundColor: '#e5e7eb' },
    }),
    indicatorSeparator: (base) => ({ ...base, backgroundColor: '#e5e7eb' }),
    dropdownIndicator: (base, state) => ({
        ...base,
        color: state.isFocused ? '#666684' : '#9ca3af',
        ':hover': { color: '#666684' },
    }),
};


const CommonMainForm = ({ zapierUrl, successPath, isMobile = false }) => {
    const { countryData } = useLocationDetail();
    const [otpLoading, setOtpLoading] = useState(false);
    const [phoneOtpLoading, setPhoneOtpLoading] = useState(false);
    const params = useSearchParams()
    const token = params.get("token")
    const [showOtp, setShowOtp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [storedOtp, setStoredOtp] = useState("");
    const [isDisable, setIsDisable] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    useEffect(() => {
        if (countryData?.country) {
            const filterData = countryList.find(
                (item) => item?.en_short_name == countryData.country || item?.alpha_2_code == countryData.country
            );
            formik.setFieldValue(
                "country",
                filterData ? filterData?.alpha_2_code : ""
            );
        }
        formik.setFieldValue(
            "invitation",
            token || "8owwwwwwzcowwwww"
        );
    }, [countryData?.country, countryList, params]);

    const getIso2ByCountryName = (name) => {
        const hit = countryList.find((c) => c.en_short_name === name);
        return hit?.alpha_2_code;
    };

    const api = axios.create({
        baseURL: "https://mygtcportal.com",
        timeout: 15000,
    });

    // generate password
    const generatePassword = (length = 12) => {
        const chars =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
        return Array.from(
            { length },
            () => chars[Math.floor(Math.random() * chars.length)]
        ).join("");
    };

    console.log({ countryData })

    // formik setup
    const formik = useFormik({
        initialValues: {
            nickname: "",
            last_name: "",
            email: "",
            phone: "",
            country: "",
            otp: "",
            password: "",
            confirmPassword: "",
            invitation: token,
            terms: false,
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
            password: Yup.string()
                .min(6, ("Min Password"))
                .required(t("errors.passwordRequired")),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref("password")], t("errors.passwordMatch")) 
                .required(t("errors.confirmPasswordRequired")),
            terms: Yup.bool().oneOf([true], t("errors.termsRequired")),
        }),
        onSubmit: async (values) => {
            const areaCode = dialCodeByAlpha2[values?.country]
            setLoading(true)
            try {
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
                        area_code: areaCode ?? values?.country ?? "92",   // use dial code, not country ISO
                        phone: values?.phone,
                        pwd: values?.password,
                        token: values?.invitation
                    }),
                });

                const createData = await res.json();
                if (!res.ok || createData?.ret_code !== 0) {
                    console.error("Create client failed:", createData);
                    toast.error(createData?.ret_msg || "Create client failed");
                    return
                }

                const client_id =
                    createData?.ret_msg?.client_id ??
                    createData?.client_id;

                // 2) create MT account
                const payloadAddUser = {
                    client_id,
                    name: values?.nickname,
                    comment: "Forex Expo Dubai 2025",
                    account_type: 0,           // 0=trading, 2=agent
                    manager_id: 3,             // 1=MT4, 3=MT5
                    // ESCAPE backslashes in JS string:
                    account_group: "real\\OZ\\MKT\\USC-XSCP00000-V",
                    leverage: 100,             // confirm format (100 vs "1:100")
                    // master_pwd: values?.password,      // optional
                    // investor_pwd: "ViewOnly123",       // optional
                };

                const res2 = await fetch("/api/create-mt", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payloadAddUser),
                });

                const mtData = await res2.json();
                if (!res2.ok || mtData?.ret_code !== 0) {
                    console.error("Create MT account failed:", mtData);
                    toast.error(mtData?.ret_msg || "Create MT account failed");
                    return
                }

                if (countryData?.country == "AE" && isDubaiDaySixOrSeven() && countryData?.country == values?.country) {
                    const userUpdate = await axios.post(`/api/mt5-server`, {
                        Login: mtData?.ret_msg?.login,
                        Comment: "Forex Expo Dubai 2025"
                    })
                }

                // 3) continue your flow
                await axios.post("/api/email", JSON.stringify({
                    name: values?.nickname,
                    invest_password: mtData?.ret_msg?.investor_pwd,
                    password: mtData?.ret_msg?.master_pwd,
                    user: mtData?.ret_msg?.login,
                    email: values?.email,
                    locale
                }));
                await axios.post(zapierUrl, JSON.stringify(values));
                toast.success(t("thankYou1"));
                localStorage.setItem("user", JSON.stringify(values));
                router.push(successPath);
                formik.resetForm();
            } catch (err) {
                console.error(err);
                toast.error(err || "Something went wrong");
            } finally {
                setLoading(false);
            }

        },
    });

    // send OTP
    const sendVerificationCode = () => {
        if (!formik.values.email) {
            toast.error(t("errors.emailRequired"));
            return;
        }
        setOtpLoading(true);
        axios
            .post(`/api/otp-smtp`, {
                email: formik.values.email,
                first_name: formik.values.nickname,
                type: "0",
                locale,
            })
            .then((res) => {
                if (res?.data?.message) {
                    setShowOtp(true);
                    setStoredOtp(res?.data?.message?.slice(4, -3));
                    formik.setFieldValue("otp", "");
                    setIsDisable(true);
                    toast.success(t("otpSent"));
                } else {
                    toast.error(res?.data?.message);
                }
            })
            .finally(() => setOtpLoading(false));
    };

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
            .post(`/api/otp-smtp`, {
                phone: formik.values.phone,
                first_name: formik.values.nickname,
                locale,
                channel: "whatsapp",
            })
            .then((res) => {
                if (res?.data?.message) {
                    setShowOtp(true);
                    setStoredOtp(res?.data?.message?.slice(4, -3));
                    formik.setFieldValue("otp", "");
                    setIsDisable(true);
                    toast.success(t("otpSent"));
                } else {
                    toast.error(res?.data?.message || t("otpFail"));
                }
            })
            .catch((error) => {
                console.error(error);
                toast.error(t("otpFail"));
            })
            .finally(() => setPhoneOtpLoading(false));
    };

    // verify OTP
    const verifyOtpCode = (otp) => {
        if (otp === storedOtp) {
            toast.success(t("otpSuccess"));
            setShowOtp(false);
            setIsDisable(false);
        } else {
            toast.error(t("otpFail"));
        }
    };

    const color = isMobile ? "text-[#fff]" : "text-[#666684]"

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-4">
            {/* First + Last Name */}
            <div className="grid sm:grid-cols-2 gap-4">
                <div>
                    <label className={`text-sm ${color} mb-1`}>{t("firstName")}</label>
                    <input
                        type="text"
                        placeholder={t("firstName")}
                        {...formik.getFieldProps("nickname")}
                        className={`w-full border px-3 py-2 ${isMobile ? "bg-[#33335b]" : ""} rounded-md ${formik.touched.nickname && formik.errors.nickname
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
                        className={`w-full border px-3 py-2 rounded-md ${isMobile ? "bg-[#33335b]" : ""} ${formik.touched.last_name && formik.errors.last_name
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
                        className={`w-full border px-3 py-2 rounded-md ${isMobile ? "bg-[#33335b]" : ""} ${formik.touched.email && formik.errors.email
                            ? "border-red-500"
                            : "border-gray-300"
                            }`}
                    />
                    <button
                        type="button"
                        onClick={sendVerificationCode}
                        className={`absolute min-h-[41px] top-0 ${locale == "ar" ? "left-0" : "right-0"} bg-[#666684] text-white px-3 py-1 rounded-md text-xs`}
                    >
                        {otpLoading ? t("sending") : t("getCode")}
                    </button>
                </div>
                {formik.touched.email && formik.errors.email && (
                    <p className="text-xs text-red-500">{formik.errors.email}</p>
                )}
            </div>

            {showOtp && (
                <div>
                    <p className="text-sm mb-2">{t("otp")}</p>
                    <div className=" flex gap-3 items-center">
                        <OtpInput
                            value={formik.values.otp}
                            onChange={(otp) => {
                                formik.setFieldValue("otp", otp)
                                if (otp?.length == 6) {
                                    verifyOtpCode(otp)
                                }

                            }}
                            numInputs={6}
                            containerStyle={{
                                display: "flex",
                                justifyContent: "space-between",
                                gap: "3px"
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

            {/* Phone */}
            <div>
                <label className={`text-sm ${color} mb-1`}>{t("phone")}</label>
                <div className="flex flex-col sm:flex-row gap-2">
                    <PhoneInput
                        international
                        defaultCountry={countryData?.country_code || countryData?.country || "AE"}
                        value={formik.values.phone}
                        onChange={(phone) => formik.setFieldValue("phone", phone)}
                        className={`flex-1 border px-3 py-2 ${isMobile ? "bg-[#33335b]" : ""} rounded-md ${formik.touched.phone && formik.errors.phone
                            ? "border-red-500"
                            : "border-gray-300"
                            }`}
                    />
                    <button
                        type="button"
                        onClick={sendPhoneVerificationCode}
                        disabled={phoneOtpLoading}
                        className="min-h-[41px] bg-[#666684] text-white px-4 py-2 rounded-md text-xs sm:text-sm disabled:opacity-70"
                    >
                        {phoneOtpLoading ? t("sending") : t("getCode")}
                    </button>
                </div>
                {formik.touched.phone && formik.errors.phone && (
                    <p className="text-xs text-red-500">{formik.errors.phone}</p>
                )}
            </div>

            {/* Country */}
            <div>
                <label className={`text-sm ${color} mb-1`}>{t("country")}</label>
                <Select
                    name="country"
                    options={options}
                    styles={selectStyles}
                    onChange={(opt, e) => {
                        console.log({ opt, e })
                        formik.setFieldValue("country", opt?.value)

                    }}
                    onBlur={() => formik.setFieldTouched("country", true)}
                    value={options.find((opt) => opt.value === formik.values.country)}
                />
                {formik.touched.country && formik.errors.country && (
                    <p className="text-xs text-red-500">{formik.errors.country}</p>
                )}
            </div>

            {/* Password + Confirm Password */}
            <div className="grid sm:grid-cols-1 gap-4">
                {/* Password */}
                <div className="relative">
                    <label className={`text-sm ${color} mb-1`}>{t("password")}</label>
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder={t("password")}
                        {...formik.getFieldProps("password")}
                        className={`w-full border px-3 py-2 ${isMobile ? "bg-[#33335b]" : ""} rounded-md pr-10 ${formik.touched.password && formik.errors.password
                            ? "border-red-500"
                            : "border-gray-300"
                            }`}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-9 text-gray-500"
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                    {formik.touched.password && formik.errors.password && (
                        <p className="text-xs text-red-500">{formik.errors.password}</p>
                    )}
                </div>

                {/* Confirm Password */}
                <div className="relative">
                    <label className={`text-sm ${color} mb-1`}>{t("confirmPassword")}</label>
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        {...formik.getFieldProps("confirmPassword")}
                        placeholder={t("confirmPassword")}
                        className={`w-full border px-3 py-2 ${isMobile ? "bg-[#33335b]" : ""} rounded-md pr-10 ${formik.touched.confirmPassword && formik.errors.confirmPassword
                            ? "border-red-500"
                            : "border-gray-300"
                            }`}
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-9 text-gray-500"
                    >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                    {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                        <p className="text-xs text-red-500">{formik.errors.confirmPassword}</p>
                    )}
                </div>

            </div>

            {/* Invitation */}
            <div>
                <label className={`text-sm ${color} mb-1`}>{t("code")}</label>
                <input
                    disabled
                    type="text"
                    {...formik.getFieldProps("invitation")}
                    className={`w-full border px-3 py-2 ${isMobile ? "bg-[#33335b]" : ""}  rounded-md border-gray-300`}
                />
            </div>

            {/* Terms */}
            <div className="flex items gap-2">
                <input
                    type="checkbox"
                    id="terms"
                    {...formik.getFieldProps("terms")}
                    className="h-5 w-5"
                />
                <label htmlFor="terms" className="text-xs">
                    By submitting your application you confirm that you have read, understood and agreed to all the <a className="text-secondary" data-v-30779926="" href="https://www.gtcfx.com/terms-and-conditions" target="_blank">Terms And Conditions</a>, <a  className="text-secondary" data-v-30779926="" href="https://gtcfx-bucket.s3.ap-southeast-1.amazonaws.com/pdf-files/Lucky+Terms+And+Conditions.pdf" target="_blank" class="link">Bonus Terms and Conditions</a> and <a  className="text-secondary" data-v-30779926="" href="https://www.gtcfx.com/legal-policies-client-agreements" target="_blank" class="link">Client Agreement .</a>
                </label>
            </div>
            {formik.touched.terms && formik.errors.terms && (
                <p className="text-xs text-red-500">{formik.errors.terms}</p>
            )}

            {/* Submit */}
            <button 
                type="submit"
                disabled={loading}
                className={`w-full  ${isMobile ? "text-[#000032]" : "text-white"} py-3 rounded-xl font-medium cursor-pointer text-sm disabled:opacity-50`}
                style={{ background: isMobile ? "#fff" : "linear-gradient(135deg, #293794 0%, #000021 100%)" }}
            >
                {loading ? "Submitting.." : t("btnText")}
            </button>
        </form>
    );
};

export default CommonMainForm;
