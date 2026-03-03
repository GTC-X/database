import React from 'react';

const BRAND = {
  purple: '#662D91',
  gold: '#C49A6C',
};


export default function WhyAttendIBEvent({ onCta, setIsOpen }) {
  const items = [
    {
      front: 'Unlock Growth Secrets',
      back:
        'Discover proven strategies top IBs use to multiply their earnings and expand their trader base.',
    },
    {
      front: 'Connections That Count',
      back:
        'Build powerful relationships with industry leaders and decision-makers who open doors to bigger opportunities.',

    },
    {
      front: 'Insider GCC Advantage',
      back:
        'Gain exclusive knowledge on scaling your IB business across the GCC, while maximising rebates and commissions.',

    },
    {
      front: 'The Future-Ready Edge',
      back:
        'Get hands-on with advanced tools designed to give IBs an unbeatable competitive advantage.',
    },
  ];

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: BRAND.purple }}
    >
      {/* subtle bg image if you have it */}
      <div
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          backgroundImage: "url('/bg-event.svg')",
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'bottom',
        }}
      />

      <div className="relative mx-auto max-w-5xl px-4 pt-6  pb-10 md:py-16">
        <h2 className="text-center text-[32px] md:text-[40px] font-extrabold text-[#EEDBC3]">
          Why You Need to be at this IB Event
        </h2>

        {/* Grid of flip cards */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:mt-10 md:grid-cols-2 md:gap-8">
          {items.map((it, i) => (
            <FlipCard key={i} front={it.front} back={it.back} />
          ))}
        </div>

        <div className="mt-8 flex justify-center md:mt-10">
          <button
            onClick={() => {
              setIsOpen(true)
            }}
            className="inline-flex w-full sm:w-fit items-center justify-center rounded-full bg-[#C49A6C] px-8 py-2.5 text-[15px] font-semibold text-white shadow-[0_8px_18px_rgba(0,0,0,.10)] transition-transform duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            Book My Seat
          </button>
        </div>
      </div>
    </section>
  );
}

// /* ---------- Flip Card (pure Tailwind) ---------- */
// function FlipCard({ front, back }) {
//   return (
//     <div
//       className="group outline-none"
//       tabIndex={0} // focusable for keyboard flip
//     >
//       <div
//         className="
//           relative h-[200px] md:h-[220px] w-full rounded-[16px]
//           shadow-[0_10px_26px_rgba(0,0,0,0.08)]
//           transition-transform duration-700 transform-gpu
//           [transform-style:preserve-3d]
//           hover:[transform:rotateY(180deg)]
//           focus:[transform:rotateY(180deg)]
//           group-hover:[transform:rotateY(180deg)]
//         "
//          style={{
//           backgroundImage: "url('/flip-1.png')",
//           backgroundSize: "100% 100%",
//           backgroundRepeat: "no-repeat",
//           backgroundPosition: "center bottom",
//         }}
//       >
//         {/* Front */}
//         <div
//           className="
//             absolute inset-0 rounded-[16px]
//              text-center flex items-center justify-center
//             px-8 py-10 md:px-10 md:py-12
//             [backface-visibility:hidden]
//           "
//         >
//           <div className="text-[18px] md:text-[22px] font-semibold leading-tight text-[#662D91]">
//             {front}
//           </div>
//         </div>

//         {/* Back (gold) */}
//         <div
//           className="
//             absolute inset-0 rounded-[16px]
//             bg-[#C49A6C] text-center flex items-center justify-center
//             px-8 py-10 md:px-10 md:py-12
//             [transform:rotateY(180deg)] [backface-visibility:hidden]
//           "
//         >
//           <p className="text-white/95 text-[14.5px] md:text-[16px] leading-[1.55] font-medium">
//             {back}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

function FlipCard({ front, back }) {
  return (
    <div className="group outline-none" tabIndex={0}>
      <div
        className="
          relative h-[200px] md:h-[220px] w-full rounded-[16px] overflow-hidden
          shadow-[0_10px_26px_rgba(0,0,0,0.08)]
          transition-transform duration-700 transform-gpu
          [transform-style:preserve-3d]
          hover:[transform:rotateY(180deg)]
          focus:[transform:rotateY(180deg)]
          group-hover:[transform:rotateY(180deg)]
        "
        style={{
          backgroundImage: "url('/flip-1.png')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        {/* Front with light blue overlay */}
        <div className="absolute inset-0 rounded-[16px] [backface-visibility:hidden]">
          {/* Overlay tint */}
          <div className="absolute inset-0 pointer-events-none bg-sky-100/60 md:bg-sky-100/55" />
          {/* Or use a softer gradient:
             <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-[#E6F3FF]/80 via-[#DDEBFF]/60 to-transparent" />
          */}
          <div className="relative z-10 h-full w-full flex items-center justify-center px-8 py-10 md:px-10 md:py-12 text-center">
            <div className="text-[18px] md:text-[22px] font-semibold leading-tight text-[#662D91]">
              {front}
            </div>
          </div>
        </div>

       {/* Back (gold) */}
        <div
          className="
            absolute inset-0 rounded-[16px]
            bg-[#C49A6C] text-center flex items-center justify-center
            px-8 py-10 md:px-10 md:py-12
            [transform:rotateY(180deg)] [backface-visibility:hidden]
          "
        >
          <p className="text-white/95 text-[14.5px] md:text-[16px] leading-[1.55] font-medium">
            {back}
          </p>
        </div>
      </div>
    </div>
  );
}
