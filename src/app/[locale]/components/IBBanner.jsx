import React from 'react';

/**
 * CTA Banner — Pixel‑perfect JSX (TailwindCSS)
 * Section: "Don’t Miss Out on the Event That Will Transform Your IB Business"
 * - Background photo with purple tint
 * - Left large white headline
 * - Right paragraph + small gold pill CTA
 * - Typography, spacing, and colors tuned to the screenshot
 */

const BRAND = {
    purple: '#5C2D91',        // overlay tint
    gold: '#C49A6C',          // CTA fill
    goldText: '#FFF',      // CTA text
};

export default function IbCtaBanner({
    bgSrc = 'https://images.unsplash.com/photo-1645362163376-3ae3b8ed8c52?q=80&w=1800&auto=format&fit=crop',
    onCta,
    setIsOpen
}) {
    return (
        <section className="relative w-full overflow-hidden min-h-[390px] flex items-center">
            {/* Background image */}
            <div
                className="pointer-events-none absolute right-0 bottom-0 h-full w-full "
                style={{
                    backgroundImage: "url('/bg-last.png')",
                    backgroundSize: "100% 100%",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center bottom",
                }}
            />
            {/* Content */}
            <div className="mx-auto container relative py-12 md:py-12">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 items-center">
                    {/* LEFT: Heading */}
                    <div className="">
                        <h2 className="text-white font-semibold text-center md:text-left md:leading-[1.15] text-[32px] md:text-[40px]">
                            Don’t Miss Out on the
                            <br className="hidden md:block" />
                            Event That Will Transform {" "}
                            <br className="hidden md:block" />
                            Your IB Business
                        </h2>
                    </div>

                    {/* RIGHT: Copy + CTA */}
                    <div className="">
                        <p className="text-white text-[18px] text-center md:text-left leading-[32px] md:text-[22px]">
                            Opportunities like this don’t come often. A chance to
                            network with decision‑makers, gain exclusive IB insights, and walk away with a clear IB roadmap
                            for growth in the GCC. Seats are limited, and once they’re gone, they’re gone.
                        </p>

                        <button
                            onClick={() => {
                                setIsOpen(true)
                            }}
                            className="mt-8 inline-flex w-full sm:w-fit items-center justify-center rounded-full bg-[color:var(--gold)] px-8 py-2.5 text-[15px] font-semibold text-[color:var(--goldText)] transition-transform duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[color:var(--gold)]/50"
                            style={{ backgroundColor: BRAND.gold, color: BRAND.goldText }}
                        >
                            Book My Seat
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
