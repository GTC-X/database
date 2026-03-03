
'use client';

import React, { useMemo, useState, useEffect, useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useLocationDetail } from "@/app/context/useLocationDetail";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import OtpInput from 'react-otp-input';
import Select from 'react-select';
import { countryList } from "@/app/context/useCountriesDetails";
// import { countries as phoneAllowed } from './defaultCountries';
import Link from 'next/link';
import { toast } from 'react-toastify';

const EmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Step1Schema = Yup.object({
    first_name: Yup.string()
        .matches(/^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi, 'Only contain letters.')
        .required('First name is required'),
    last_name: Yup.string()
        .matches(/^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi, 'Only contain letters.')
        .required('Last name is required'),
    email: Yup.string().matches(EmailRegex, 'Invalid email').required('Email is required'),
    phone: Yup.string().required('Phone is required'),
    country: Yup.string().required('Country is required'),
    // otp required but validated by UI before advancing
    otp: Yup.string().length(6, 'Enter 6 digits'),
});


const PrimeForm = ({ title = 'Register Now', subtitle = '' }) => {
    const searchParams = useSearchParams();
    const path = usePathname();
    const { countryCode: originCountry, ip: originIp, countryData } = useLocationDetail("en");
    const router = useRouter()

    // Stepper & OTP state
    const [otpOpen, setOtpOpen] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);
    const [storedEmailOtp, setStoredEmailOtp] = useState('');
    const [emailVerified, setEmailVerified] = useState(false);

    // Build country options with flag (react-select)
    const countryOptions = useMemo(
        () =>
            countryList?.map((c) => ({
                value: c.en_short_name,
                code: c.alpha_2_code,
                label: (
                    <div className="flex items-center gap-2">
                        <img
                            src={`https://flagcdn.com/w40/${c.alpha_2_code.toLowerCase()}.png`}
                            alt={c.en_short_name}
                            className="w-5 h-4 object-cover"
                        />
                        <span>{c.en_short_name}</span>
                    </div>
                ),
            })),
        []
    );

    const defaultCountryName =
        countryList?.find((n) => n.alpha_2_code == originCountry)?.en_short_name ||
        'UAE (United Arab Emirates)';

    useEffect(() => {
        if (countryData?.country) {
            const filterData = countryList.find(
                (item) => item?.alpha_2_code == countryData.country
            );
            formik.setFieldValue(
                "country",
                filterData ? filterData?.en_short_name : ""
            );
        }
    }, [countryData?.country, countryList]);

    const formik = useFormik({
        initialValues: {
            // meta / utm
            ip: '',
            fbclid: '',
            utm_campain: '',
            utm_source: '',
            // step1
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            country: defaultCountryName,
            otp: '',

        },
        validateOnBlur: true,
        validateOnChange: false,
        validationSchema: Step1Schema,
        onSubmit: async (values) => {
            try {
                 await axios.post("https://hooks.zapier.com/hooks/catch/16420445/udnjn1o/", JSON.stringify(values));
            } catch (error) {
            } finally {
                sendDataToDb(values, formik)
            }
        },
    });

    // Set UTM + IP after mount
    useEffect(() => {
        formik.setFieldValue('ip', originIp || '');
        formik.setFieldValue('utm_campain', path || '');
        formik.setFieldValue('utm_source', searchParams.get('utm_source') || '');
        formik.setFieldValue('fbclid', searchParams.get('fbclid') || '');
    }, [originIp, path, searchParams]);

    // ====== OTP: Email ======
    const sendEmailOtp = async () => {
        if (!EmailRegex.test(formik.values.email)) { 
            toast.error('Invalid email');
            return;
        }
        setOtpLoading(true);
        try {
            const res = await axios.post(`/api/otp-smtp`, {
                email: formik.values.email,
                first_name: formik.values.first_name,
                locale: "en",
                type: '0',
            });
            if (res?.data?.message) {
                setStoredEmailOtp(res.data.message.slice(4, -3)); // same as your backend
                setOtpOpen(true);
                toast.success(` ${formik.values.email}`);
            } else {
                toast.error("Error");
            }
        } catch {
            toast.error("Error");
        } finally {
            setOtpLoading(false);
        }
    };

    const verifyEmailOtp = () => {
        if (formik.values.otp && storedEmailOtp && formik.values.otp === storedEmailOtp) {
            setEmailVerified(true);
            toast.success("Varified");
            setOtpOpen(false);
        } else {
            setEmailVerified(false);
            toast.error("Not Verified");
        }
    };


    const sendDataToDb = async (data) => {
        try {
            await axios.post(`/api/email`, JSON.stringify(data));
            toast.success('Data inserted successfully');
            localStorage.setItem('user', JSON.stringify(data));
            formik.resetForm();
            router.push('/thank-you');
        } catch (err) {
            toast.error('Error inserting data: ' + (err?.response?.data?.message || err.message));
        } finally {
         }
    };


    // ====== UI (Pixel-perfect like the screenshots) ======
    const cardShadow = 'shadow-[0_12px_36px_rgba(13,13,13,0.10)]';
    const labelCls = 'block text-[14px] font-normal text-left text-[#04417B] mb-1.5';
    const inputBase =
        'w-full h-[48px] rounded-[8px] border border-[#CCCCD6] bg-white px-3 placeholder:text-[#B8C6D5] text-[14px] text-[#0F2742] outline-none focus:border-[#14A0DB] transition';
    const selectBase =
        'w-full h-[48px] rounded-[8px] border border-[#CCCCD6] bg-white text-[14px] text-[#0F2742] outline-none focus:border-[#14A0DB] transition px-3 text-left';
    const errorCls = 'mt-1 text-[12px] text-left text-[#E5484D] ';

    return (
        <div className=" py-10 mx-auto flex w-full max-w-[600px] flex-col items-center justify-center px-4 text-center">
            <div className="w-full max-w-100%">
                <div className="relative w-full">
                    <img
                        src='/logo-white.svg'
                        alt="GTCFX"
                        className="h-12 w-auto mx-auto"
                    />
                </div>


                <div className={`rounded-[18px] bg-white ${cardShadow} border border-[#E6EEF6] mt-10`}>
                    <div className="px-6 pt-7 pb-6">
                        <h2 className="text-[24px] font-extrabold text-[#662D91] text-center mb-1">
                            {'Register Now'}
                        </h2>
                        {subtitle ? (
                            <p className="text-center text-sm text-[#6B7A8B] mb-5">{subtitle}</p>
                        ) : (
                            <div className="mb-6" />
                        )}

                        {/* STEP 1 */}
                        <form
                            onSubmit={formik.handleSubmit}
                            className="space-y-4"
                            noValidate
                            autoComplete="off"
                        >
                            {/* First / Last */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className={labelCls}>First Name</label>
                                    <input
                                        className={inputBase}
                                        name="first_name"
                                        placeholder="First Name (e.g., John)"
                                        value={formik.values.first_name}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.first_name && formik.errors.first_name && (
                                        <div className={errorCls}>{formik.errors.first_name}</div>
                                    )}
                                </div>
                                <div>
                                    <label className={labelCls}>Last Name</label>
                                    <input
                                        className={inputBase}
                                        name="last_name"
                                        placeholder="Last Name (e.g., Doe)"
                                        value={formik.values.last_name}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.last_name && formik.errors.last_name && (
                                        <div className={errorCls}>{formik.errors.last_name}</div>
                                    )}
                                </div>
                            </div>

                            {/* Phone */}
                            <div>
                                <label className={labelCls}>Mobile Number</label>
                                <div className="gtc-phone flex items-center h-[50px] rounded-[12px] border border-[#DDE6F0] bg-white px-2">
                                    <PhoneInput
                                        name="phone"
                                        international
                                        countryCallingCodeEditable={false}
                                        defaultCountry={originCountry || 'AE'}
                                        value={formik.values.phone}
                                        onChange={(v) => formik.setFieldValue('phone', v)}
                                        //   countries={phoneAllowed}
                                        className="flex-1"
                                    />
                                </div>
                                {formik.touched.phone && formik.errors.phone && (
                                    <div className={errorCls}>{formik.errors.phone}</div>
                                )}
                            </div>

                            {/* Email + OTP (or Phone OTP for EUS) */}
                            <div>
                                <label className={labelCls}>Email</label>
                                <div className="relative">
                                    <input
                                        className={inputBase}
                                        type="email"
                                        name="email"
                                        placeholder="example@mail.com"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {originCountry !== 'EUS' && (
                                        <button
                                            type="button"
                                            onClick={sendEmailOtp}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 h-[36px] px-3 rounded-[10px] bg-[#662D91] text-white text-[12px] font-semibold"
                                        >
                                            {otpLoading ? 'Sending…' : 'Get Code'}
                                        </button>
                                    )}
                                </div>
                                {formik.touched.email && formik.errors.email && (
                                    <div className={errorCls}>{formik.errors.email}</div>
                                )}

                                {/* Email OTP block */}
                                {originCountry !== 'EUS' && otpOpen && (
                                    <div className="mt-3">
                                        <div className={labelCls}>OTP</div>
                                        <div className=' flex justify-between items-center'>
                                            <OtpInput
                                                value={formik.values.otp}
                                                onChange={(v) => formik.setFieldValue('otp', v)}
                                                numInputs={6}
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
                                                    width: 54,
                                                    height: 46,
                                                    borderRadius: 10,
                                                    border: '1px solid #DDE6F0',
                                                    background: '#fff',
                                                    color: '#0F2742',
                                                    fontWeight: 600,
                                                    fontSize: 16,
                                                    outline: 'none',
                                                }}
                                                containerStyle={{ display: 'flex', gap: 10 }}
                                            />
                                            <div className="">
                                                <button
                                                    type="button"
                                                    onClick={verifyEmailOtp}
                                                    className="h-[46px] px-4 rounded-[10px] border border-[#DDE6F0] text-[#0F2742] hover:bg-[#F6FAFE]"
                                                >
                                                    Verify Code
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}


                            </div>

                            {/* Country of Residence */}
                            <div>
                                <label className={labelCls}>Country of Residence</label>
                                <Select
                                    instanceId="country-select"
                                    name="country"
                                    options={countryOptions}
                                    value={countryOptions.find((o) => o.value === formik.values.country)}
                                    onChange={(opt) => formik.setFieldValue('country', opt?.value)}
                                    onBlur={() => formik.setFieldTouched('country', true)}
                                    classNamePrefix="react-select"
                                    styles={{
                                        control: (base, state) => ({
                                            ...base,
                                            minHeight: 50,
                                            height: 50,
                                            borderRadius: 12,
                                            borderColor:
                                                formik.touched.country && formik.errors.country
                                                    ? '#E5484D'
                                                    : '#DDE6F0',
                                            boxShadow: 'none',
                                            ':hover': { borderColor: state.isFocused ? '#14A0DB' : '#DDE6F0' },
                                        }),
                                        valueContainer: (base) => ({ ...base, paddingLeft: 12, paddingRight: 40 }),
                                        singleValue: (base) => ({ ...base, color: '#0F2742', fontSize: 14 }),
                                        placeholder: (base) => ({ ...base, color: '#B8C6D5' }),
                                        dropdownIndicator: (base) => ({ ...base, color: '#5B6B7C', paddingRight: 12 }),
                                        menu: (base) => ({ ...base, zIndex: 50 }),
                                    }}
                                    placeholder="Select country"
                                />
                                {formik.touched.country && formik.errors.country && (
                                    <div className={errorCls}>{formik.errors.country}</div>
                                )}
                            </div>

                            {/* Next */}
                            <div className="pt-2">
                                <button
                                    type="submit"

                                    className={`w-full h-[44px] rounded-[12px] bg-[#662D91] text-white font-semibold tracking-wide flex items-center justify-center gap-2 transition`}
                                >
                                    Book a Call
                                    <svg width="18" height="18" viewBox="0 0 24 24" className="opacity-90">
                                        <path
                                            fill="currentColor"
                                            d="M13.172 12L8.222 7.05l1.414-1.414L16 12l-6.364 6.364-1.414-1.414z"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            </div>


        </div>
    );
};

export default PrimeForm;
