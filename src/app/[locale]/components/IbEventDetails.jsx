import React from 'react';

/**
 * IB Event Details — Pixel‑perfect JSX (TailwindCSS)
 * Matches the mock: light lavender page background, purple H2, bordered card
 * with three columns (date / details / image), soft divider before the image,
 * and a small pill CTA.
 */

const COLOR = {
    page: '#F3E3FF',        // light lavender backdrop
    purple: '#662D91',      // brand purple (heading, CTA)
    body: '#525252',        // paragraph text
    border: '#98A2B3',      // card border + divider
    label: '#3F3A57',       // small labels (Location, Dress Code, Seats)
    overlay: '#662D91', // image purple tint
};

export default function IbEventDetails({ setIsOpen }) {
    return (
        <section className="w-full" style={{ backgroundColor: COLOR.page }}>
            <div className="mx-auto container py-12 md:py-16">
                {/* Title */}
                <h2
                    className="text-[32px] text-center md:text-left font-semibold leading-tight text-[color:var(--p)] md:text-[40px]"
                    style={{ ['--p']: COLOR.purple }}
                >
                    IB Event Details
                </h2>

                <p className="mt-3  text-center block md:hidden leading-[1.75] text-[color:var(--body)] md:mt-3.5 md:text-[16px]" style={{ ['--body']: COLOR.body }}>
                    At Edu.trade, we’re bringing together some of the most influential voices in Forex, finance, and the GCC business world. From keynote speakers who’ll set the vision to panelists who’ve built thriving IB networks, each expert will share practical insights you can apply to your own growth journey.
                </p>
                <p className="mt-3  text-center block md:hidden leading-[1.75] text-[color:var(--body)] md:text-[16px]" style={{ ['--body']: COLOR.body }}>
                    Unlike other events, you’re actually going to be shown how to grow your Introducing Broker business!
                </p>

                {/* Card */}
                <div
                    className="rounded-[8px] border border-[#98A2B3 mt-9"
                    style={{ borderColor: COLOR.border }}
                >
                    <div className="grid grid-cols-1 text-center md:text-left md:grid-cols-[220px_minmax(0,1fr)_400px] pt-6 md:pt-0">
                        {/* Left: Date */}
                        <div className="px-4 py-6">
                            <div className="text-[20px] font-semibold leading-[1.35] text-[color:var(--p)] md:text-[24px]" style={{ ['--p']: COLOR.purple }}>
                                <span className="block">Saturday, 11th</span>
                                <span className="block">October 2025</span>
                            </div>
                        </div>

                        {/* Middle: Details + CTA */}
                        <div className="px-4 py-6 md:px-6 md:py-6">
                            <dl className="space-y-4">
                                <Item label="Location">
                                    The Museum of the Future, Dubai, UAE
                                </Item>
                                <Item label="Dress Code">Smart Business Attire</Item>
                                <Item label="Seats">Strictly limited. Introducing Brokers only.</Item>
                            </dl>

                            <p className="mt-5 max-w-[560px] text-[16px] leading-[1.75] text-[color:var(--body)] md:text-[16px]" style={{ ['--body']: COLOR.body }}>
                                This event is free to attend, but spaces are highly limited. Entry will be confirmed on a first‑come, first‑served basis, and we will be vetting all Introducing Brokers who want to attend.
                            </p>

                            <button
                                className="mt-8 hidden sm:block items-center justify-center rounded-full bg-[color:var(--gold)] px-8 py-2.5 text-[15px] font-semibold text-[#fff] transition-transform duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[color:var(--gold)]/50"
                                style={{ backgroundColor: COLOR.purple }}
                                onClick={() => {
                                    setIsOpen(true)
                                }}
                            >
                                Book My Seat
                            </button>
                        </div>

                        {/* Right: Image with purple tint & left divider */}
                        <div className="relative min-h-[220px] overflow-hidden rounded-b-[8px] md:rounded-r-[8px] md:rounded-bl-none">
                            {/* divider line */}
                            <div className="absolute left-0 top-0 hidden h-full w-px md:block" style={{ backgroundColor: COLOR.border }} />

                            <img
                                src="/ibdetail.jpg"
                                alt="Museum of the Future"
                                className="h-full w-full object-cover"
                            />
                            {/* purple overlay */}
                            <div className="absolute inset-0 opacity-55" style={{ background: COLOR.overlay }} />
                        </div>
                    </div>
                </div>
                <button
                    className="mt-8 w-full items-center block sm:hidden justify-center rounded-full bg-[color:var(--gold)] px-8 py-2.5 text-[15px] font-semibold text-[#fff] transition-transform duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[color:var(--gold)]/50"
                    style={{ backgroundColor: COLOR.purple }}
                >
                    Book My Seat
                </button>
            </div>
        </section>
    );
}

/* ——— Subcomponents ——— */
function Item({ label, children }) {
    return (
        <div>
            <dt className="text-[16px] font-semibold leading-tight text-[color:var(--label)]" style={{ ['--label']: COLOR.label }}>
                {label}
            </dt>
            <dd className="mt-1 text-[16px] leading-[1.7] text-[color:var(--body)]" style={{ ['--body']: COLOR.body }}>
                {children}
            </dd>
        </div>
    );
}
