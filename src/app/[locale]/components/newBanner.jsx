
import React, { useEffect, useMemo, useState } from 'react';

const BRAND = {
    purple: '#662D91',
    body: '#221E1F',
    gold: '#C49A6C',
    goldLight: '#D6B086',
    goldText: '#FFF',
};

export default function EduTradeHero({ ringSrc = '/banner-img.svg', setIsOpen }) {
    const eventDate = useMemo(() => new Date('2025-10-11T10:00:00.000Z'), []);
    const [t, setT] = useState(diff(eventDate));
    useEffect(() => { const id = setInterval(() => setT(diff(eventDate)), 1000); return () => clearInterval(id); }, [eventDate]);

    return (
        <section className="w-full relative bg-white font-sans text-[#2E2B3A]">
            {/* Header: centered logo */}
            <div className="mx-auto container px-4 pt-6">
                <div className="flex items-center justify-center"><Logo /></div>
            </div>

            {/* HERO */}
            <div className=" mx-auto container pt-6 pb-16 md:pt-16 md:pb-24">
                <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12">
                    {/* Left copy */}
                    <div className="md:pr-6">
                        <h1 className="text-[50px] text-center md:text-left leading-[50px] font-extrabold tracking-tight text-[color:var(--h)] md:text-[50px] md:leading-[64px]" style={{ ['--h']: BRAND.purple }}>
                            Turn Your IB Business into
                            <span className="block">a Revenue Machine</span>
                        </h1>
                        <p className="mt-8 hidden md:block max-w-[620px] text-[14.5px] leading-[1.75] text-[color:var(--body)] md:mt-5 md:text-[16px] md:leading-[20px]" style={{ ['--body']: BRAND.body }}>
                            At Edu.trade’s premier Introducing Broker event at The Museum of the Future in Dubai, you’ll learn how top GCC Introducing Brokers are multiplying their commissions, winning more traders, and locking in long‑term growth. If you’re serious about scaling your IB business, this is where it starts.
                        </p>
                        <button
                            onClick={() => {
                                setIsOpen(true)
                            }}
                            className="mt-8 hidden md:block items-center justify-center rounded-full bg-[color:var(--gold)] px-8 py-2.5 text-[15px] font-semibold text-[color:var(--goldText)] transition-transform duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[color:var(--gold)]/50"
                            style={{ ['--gold']: BRAND.gold, ['--goldText']: BRAND.goldText }}
                        >
                            Book My Seat
                        </button>
                    </div>

                    {/* Right visual (above wave) */}
                    <div className=" z-0 md:flex h-[580px] top-0 absolute right-0 ml-auto hidden justify-end">
                        <img src={ringSrc} alt="Museum of the Future" className="h-full w-full object-cover" style={{ objectPosition: 'right center' }} />
                    </div>
                    <div className=" z-0 md:hidden -ml-4  -mr-4 -mb-6 flex justify-end">
                        <img src='/banner-mobile.svg' alt="Museum of the Future" className="h-full w-full object-cover" />
                    </div>
                </div>
            </div>

            {/* PURPLE BAND with integrated curved top */}
            <section className="relative text-white">
                {/* The curved top edge (purple under the path) */}
                <svg className="pointer-events-none absolute -top-[120px] left-0 h-[180px] w-full" viewBox="0 0 1440 230" preserveAspectRatio="none" aria-hidden>
                    {/* curve tuned to screenshot: higher near center-right, smooth from left */}
                    <path d="M853.5 27.5731C1160.59 -33.4456 1408.87 20.7462 1513 56.5389V486H-65V66.0765C81.287 90.3361 453.5 107.053 853.5 27.5731Z" fill="#662D91" />
                </svg>

                {/* Purple body */}
                <div className="w-full relative bg-[color:var(--purple)] pb-12 md:pb-16" style={{ ['--purple']: BRAND.purple }}>
                    <div className="mx-auto max-w-6xl px-4 text-center">
                        <p className="block md:hidden max-w-[620px] text-[16px] leading-[1.75] text-[#fff] md:mt-5 md:text-[16px] md:leading-[20px]" >
                            At Edu.trade’s premier Introducing Broker event at The Museum of the Future in Dubai, you’ll learn how top GCC Introducing Brokers are multiplying their commissions, winning more traders, and locking in long‑term growth. If you’re serious about scaling your IB business, this is where it starts.
                        </p>
                        <button
                            className="my-8 block md:hidden w-full items-center justify-center rounded-full bg-[color:var(--gold)] px-8 py-2.5 text-[15px] font-semibold text-[color:var(--goldText)] transition-transform duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[color:var(--gold)]/50"
                            style={{ ['--gold']: BRAND.gold, ['--goldText']: BRAND.goldText }}
                            onClick={() => {
                                setIsOpen(true)
                            }}
                        >
                            Book My Seat
                        </button>
                        <h2 className="text-[24px] pt-5 md:pt-0 font-bold md:text-[40px]">Till the Biggest Introducing Broker Event of 2025!</h2>
                        <p className="mt-1.5  text-white text-[16px]">At the Museum of the Future, Saturday, 11th October 2025</p>

                        <div className="mt-10 grid grid-cols-4 gap-8 md:mt-12 md:gap-12">
                            <TimeStat value={t.days} label="DAYS" />
                            <TimeStat value={t.hours} label="HOURS" />
                            <TimeStat value={t.minutes} label="MINUTES" />
                            <TimeStat value={t.seconds} label="SECONDS" />
                        </div>
                    </div>
                </div>
            </section>
        </section>
    );
}

/* ————— atoms ————— */
function TimeStat({ value, label }) {
    return (
        <div className="text-center">
            <div className="text-[40px] font-extrabold leading-none text-[color:var(--goldLight)] md:text-[60px]" style={{ ['--goldLight']: BRAND.goldLight }}>
                {String(value).padStart(2, '0')}
            </div>
            <div className="mt-2 text-[11px] uppercase tracking-[0.35em] text-[#F3E3FF] md:text-[20px]">{label}</div>
        </div>
    );
}

function Logo() {
    return (
        <div className="py-3 flex justify-center md:justify-center">
            <img src="/logo.svg" alt="etu logo" className="h-8 w-auto" />
        </div>
    );
}

/* ————— util ————— */
function diff(target) {
    const now = Date.now();
    const t = Math.max(0, target.getTime() - now);
    const days = Math.floor(t / (1000 * 60 * 60 * 24));
    const hours = Math.floor((t / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((t / (1000 * 60)) % 60);
    const seconds = Math.floor((t / 1000) % 60);
    return { days, hours, minutes, seconds };
}
