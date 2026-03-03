import React from 'react';

/**
 * Footer Bar — Pixel‑perfect JSX (TailwindCSS)
 * Matches the mock: solid purple strip, left logo (tiny gradient square + "Edu.trade"),
 * right tiny copyright in white.
 */

const BRAND = {
  purple: '#662D91',  // bar background
};

export default function EduTradeFooterBar() {
  return (
    <footer
      className="w-full bg-[color:var(--purple)]"
      style={{ ['--purple']: BRAND.purple }}
      role="contentinfo"
      aria-label="Footer"
    >
      <div className="mx-auto container  py-3">
        {/* Height tuned to mock (~40–44px) */}
        <div className="flex items-center justify-between">
          {/* Left: logo */}
          <div className="py-3 flex justify-center md:justify-center">
            <img src="/logo-white.svg" alt="etu logo" className="h-5" />
          </div>

          {/* Right: copyright */}
          <div className="text-[16px] font-semibold leading-none text-white">
            © {new Date()?.getFullYear()} — Copyright
          </div>
        </div>
      </div>
    </footer>
  );
}
