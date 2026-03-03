'use client';
import { useTranslations } from 'next-intl'; // for localization
import { useState } from "react";
import Image from "next/image";
import PrimeForm from './primeForm';
import { RxCross2 } from "react-icons/rx";



const SliderModalPrime = ({ isOpen, setIsOpen }) => {
    const t = useTranslations("partner.form"); // adjust namespace if needed

    return (
        <>
            <div className={`fixed inset-0 z-[99] transition-all duration-700 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
                <div className="absolute inset-0 bg-black/60" />
                <div
                    aria-hidden="true"
                    className="fixed inset-x-0 bottom-0 z-10 pointer-events-none select-none"
                >
                      <div
                        className="w-full min-h-screen  bg-top bg-cover opacity-80 bg-[url('/bg-last.png')]"
                    />
                </div>

                {/* Page content */}
                <section className="relative bg-[#F2F6F9]">
                    {/* Keep content above the overlay */}
                    <button
                        className=" text-2xl cursor-pointer absolute top-4 right-4 md:top-8 md:right-10 z-50 text-[#003651]"
                        onClick={()=>{
                            setIsOpen(false);
                        }}
                    >
                        <RxCross2 className="w-6 h-6" />
                    </button>
                    <div className="relative z-20 container min-h-screen mx-auto py-10">
                        <PrimeForm />
                    </div>
                </section >
            </div >
        </>
        // <div className={`fixed inset-0 z-[99] transition-all duration-700 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
        //     {/* Backdrop */}
        //     <div className="absolute inset-0 bg-black/60" />
        //     <div className="absolute inset-0 z-10 opacity-20 pointer-events-none">
        //         <img
        //             src="/ib/lp.webp"
        //             alt="Decorative background"
        //             className="w-full h-full object-cover object-bottom"
        //         />
        //     </div>

        //     {/* Sliding Panel */}
        //     <div className={`absolute top-0 right-0 h-full w-full bg-[#0F1035] text-white shadow-lg transition-transform duration-700 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        //         <div className="container flex-col mx-auto flex justify-center items-center h-full w-full">
        //             <div className="flex justify-end w-full pb-4">
        //                 <button
        //                     className="text-white text-2xl cursor-pointer"
        //                     onClick={onClose}
        //                     aria-label={t('closeAlt')}
        //                 >
        //                     <RxCross2 className="w-6 h-6" />
        //                 </button>
        //             </div>

        //             <div className="max-w-3xl mx-auto flex flex-col items-center justify-center text-center px-4">
        //                 <Image
        //                     src="https://gtcfx-bucket.s3.ap-southeast-1.amazonaws.com/img/footer-logo.webp"
        //                     width={200}
        //                     height={72}
        //                     alt="GTCFX"
        //                     className="lg:w-[200px] lg:h-[72px] md:w-[120px] md:h-[53px] w-[130px] h-[47px] cursor-pointer"
        //                 />

        //                 <h2 className="text-center text-2xl md:text-3xl font-medium my-5 md:my-8">
        //                     {t("heading")}
        //                 </h2>

        //                 <PrimeForm />
        //             </div>
        //         </div>
        //     </div>
        // </div >
    );
};

export default SliderModalPrime;
