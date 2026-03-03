import React from 'react';

/** Same layout/design — content updated per your list (JS version) */

const PALETTE = {
  bg: '#F3E3FF',
  purple: '#662D91',
  purpleCard: '#6E4CCB',
  line: '#E1D6F6',
  textMain: '#662D91',
  textBody: '#525252',
};

export default function IbAgendaSection({ setIsOpen }) {
  // Your 6 items split into two columns (3 | 3)
  const items = [
    {
      start: '13:00',
      end: '13:05',
      title: 'Welcome & Intro',
      body:
        'A quick warm-up to set the stage, introduce the theme, and get everyone energised for an afternoon of insight and opportunity.',
    },
    {
      start: '13:05',
      end: '13:35',
      title: 'Keynote: From Logo to Legacy – Building IB Brands that Last',
      body:
        'Discover how branding shapes trust, loyalty, and long-term success, with practical lessons on standing out in a crowded IB world.',
    },
    {
      start: '13:35',
      end: '13:55',
      title: 'Data is the New Commission',
      body:
        'Learn how trader behaviour, funnel metrics, and lifetime value can unlock smarter growth strategies and bigger rewards for IBs.',
    },
    {
      start: '13:55',
      end: '14:15',
      title: 'Beyond Rebates. Building a Value-Added IB Business',
      body:
        'Explore how IBs can go further than rebates by offering education, tools, and community to win lasting trader loyalty.',
    },
    {
      start: '14:15',
      end: '14:45',
      title: 'The Q&A You Don’t Want To Miss',
      body:
        "An open floor with experts where no question is off-limits. It's your chance to get clarity, insights, and real-world answers.",
    },
    {
      start: '14:45',
      end: '15:30',
      title: 'Eating & Networking',
      body:
        'Fuel up, relax, and connect with fellow IBs, partners, and fintech pros, because the best deals often start over lunch.',
    },
  ];

  const left = items.slice(0, 3);
  const right = items.slice(3);

  return (
    <section className="relative w-full overflow-hidden">
      <BackdropWave />
      <CandlesBackdrop />

      <div className="relative mx-auto max-w-7xl px-4 py-10 md:py-14">
        {/* Heading */}
        <div className="text-center">
          <h2
            className="text-[32px] text-center md:text-center font-extrabold leading-tight tracking-tight md:text-[40px]"
            style={{ color: PALETTE.textMain }}
          >
            The IB Event Agenda of All Agendas
          </h2>
          <p
            className="mx-auto mt-2 max-w-[720px] leading-[1.7] text-[16px]"
            style={{ color: PALETTE.textBody }}
          >
            Here’s what you’re going to experience at the world’s biggest Introducing Broker event that’s being
            held at the world’s most iconic building!
          </p>
        </div>

        {/* Timeline */}
        <div className="relative mt-12">
          <div className="grid grid-cols-1 gap-y-8 md:grid-cols-2 md:gap-x-10">
            {/* LEFT COLUMN */}
            <div className="relative md:pr-10">
              <div className="space-y-5">
                {left.map((item, i) => (
                  <AgendaItemCard key={`left-${i}`} {...item} />
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="relative md:pl-10">
              <div className="space-y-5">
                {right.map((item, i) => (
                  <AgendaItemCard key={`right-${i}`} {...item} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ———————————————— Item ———————————————— */
function AgendaItemCard({ title, body, start, end }) {
  return (
    <div className="flex items-stretch">
      {/* Times */}
      <div className="mr-4 mt-2 w-[60px] text-right">
        <div className="text-[16px] font-semibold leading-[1.1] text-[#662D91]">{start}</div>
        <div className="mt-1 text-[16px] font-normal leading-[1.1] text-[#76469A]">{end}</div>
      </div>

      {/* Card */}
      <div className="relative flex-1">
        <div className="rounded-[14px] bg-[#76469A] text-white border border-[#B888DB] p-4 md:p-5">
          <div className="text-[20px] font-semibold leading-tight">{title}</div>
          <p className="mt-1.5 text-[14px] leading-[1.65] text-white/95">{body}</p>
        </div>
      </div>
    </div>
  );
}

/* ———————————————— Backdrops ———————————————— */
function BackdropWave() {
  return (
    <svg
      className="pointer-events-none md:h-[55%] h-[75%] absolute left-0 top-0 w-full"
      viewBox="0 0 1440 160"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d="M0 80 C 180 140, 420 40, 720 110 C 980 170, 1180 120, 1440 160 L 1440 0 L 0 0 Z"
        fill={PALETTE.bg}
      />
      <path
        d="M0 110 C 260 180, 560 40, 780 120 C 960 180, 1140 150, 1440 170 L 1440 160 L 0 160 Z"
        fill="#FFFFFF"
        opacity="0.9"
      />
    </svg>
  );
}

function CandlesBackdrop() {
  return (
    <svg
      className="pointer-events-none hidden md:block absolute bottom-[5%] right-0 w-full max-w-[1200px]"
      viewBox="0 0 1000 420"
      preserveAspectRatio="none"
      aria-hidden
    >
      <g opacity="0.5">
        {/* kept your original candle paths; include all as in your file */}
        <path d="M971.37 66.6836H982.53V130.698H971.37V66.6836Z" fill="#76469A" />
        <path d="M976.117 40.7229H977.766V66.6997H976.117V40.7229Z" fill="#76469A" />
        <path d="M976.117 130.698H977.766V156.675H976.117V130.698Z" fill="#76469A" />
        {/* …rest of paths unchanged… */}
      </g>
    </svg>
  );
}
