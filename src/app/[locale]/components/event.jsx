import React from 'react';

/**
 * Pixel‑perfect JSX (TailwindCSS)
 * Section: "Is This Event for You?" — built to match the provided image
 * - Top purple divider
 * - Left heading in brand purple
 * - Right copy with bullet list + bold confirmation line
 * - Small rounded purple CTA
 * - Subtle chart/candlestick backdrop behind content
 */

const COLOR = {
  purple: '#662D91',        // heading + CTA + divider
  body: '#525252',          // paragraph and bullets
  bold: '#3C3750',          // stronger paragraph text (then yes...)
  chart: '#C9B2E6',         // backdrop strokes/fills (very light purple)
};

export default function EventFitSection({ setIsOpen }) {
  return (
    <section className="relative w-full overflow-hidden" style={{ borderColor: COLOR.purple }}>
      <div
        className="pointer-events-none absolute right-0 bottom-[-12px] w-full "
        style={{
          backgroundImage: "url('/bg-for-you.svg')",
          backgroundSize: "cover",
          height: "380px",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "bottom",
        }}
      />
      {/* Background chart */}

      <div className="relative mx-auto container py-10 md:py-14">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-12">
          {/* LEFT: Heading */}
          <div className="md:col-span-5 lg:col-span-5">
            <h2
              className="text-[32px] font-extrabold leading-tight tracking-tight md:text-[40px]"
              style={{ color: COLOR.purple }}
            >
              Is This Event for You?
            </h2>
          </div>

          {/* RIGHT: Copy + bullets + CTA */}
          <div className="md:col-span-7 lg:col-span-7">
            <p className="text-[16px] leading-[1.75] md:text-[18px]" style={{ color: COLOR.body }}>
              If you’re an Introducing Broker in the UAE or wider GCC who’s ready to:
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-10 text-[16px] leading-[1.75] md:text-[18px]" style={{ color: COLOR.body }}>
              <li>Grow your network of traders and attract higher volumes.</li>
              <li>Boost your rebates and commissions with smarter strategies.</li>
              <li>Simplify client management using tools built for IB success.</li>
              <li>Stand out in your region and position yourself as a leading IB.</li>
            </ul>

            <p className="mt-4 text-[16px] leading-[1.75] md:text-[22px]" style={{ color: COLOR.bold }}>
              <span className="font-bold">Then yes, this IB event has been designed for you.</span>
            </p>

            <div className="mt-8 flex justify-center md:justify-start">
              <button
                onClick={() => {
                  setIsOpen(true)
                }}
                className="inline-flex w-full sm:w-fit items-center justify-center rounded-full bg-[color:var(--gold)] px-8 py-2.5 text-[15px] font-semibold text-[#fff] shadow-[0_8px_18px_rgba(0,0,0,.10)] transition-transform duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[color:var(--gold)]/50"
                style={{ backgroundColor: COLOR.purple }}
              >
                Book My Seat
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ————————— Backdrop ————————— */
function ChartBackdrop() {
  const bars = Array.from({ length: 18 }).map((_, i) => ({
    x: 40 + i * 55,
    body: 40 + ((i * 17) % 70),
    top: 8 + ((i * 11) % 18),
    bottom: 12 + ((i * 7) % 22),
  }));

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 1200 360"
      preserveAspectRatio="none"
      aria-hidden
    >
      {/* soft diagonal lines */}
      <g opacity="0.10" stroke={COLOR.chart} strokeWidth="3" fill="none">
        <path d="M0 320 C 240 220, 360 260, 520 180 C 720 80, 920 180, 1200 60" />
        <path d="M0 340 C 200 260, 420 200, 640 240 C 820 280, 980 220, 1200 140" />
      </g>

      {/* candlestick row */}
      <g opacity="0.22">
        {bars.map((b, idx) => (
          <g key={idx} transform={`translate(${b.x},0)`}>
            {/* top wick */}
            <rect x="10" y={180 - b.top} width="2" height={b.top} fill={COLOR.chart} />
            {/* body */}
            <rect x="3" y={180} width="18" height={b.body} rx="4" fill={COLOR.chart} />
            {/* bottom wick */}
            <rect x="10" y={180 + b.body} width="2" height={b.bottom} fill={COLOR.chart} />
          </g>
        ))}
      </g>
    </svg>
  );
}
