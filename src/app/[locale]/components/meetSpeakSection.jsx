import React from 'react';

/**
 * Meet the Speakers — Pixel‑perfect JSX with TailwindCSS
 * Matches the provided mock: left intro copy + CTA, right 2×2 speaker cards
 * with image placeholder, name (purple), job title (muted), and short bio.
 */

const COLOR = {
  purple: '#662D91',        // heading + CTA color
  name: '#662D91',          // speaker name purple
  body: '#525252',          // paragraph/bio text
  title: '#909090',         // job title muted gray-purple
  border: '#98A2B3',        // card border
};

export default function MeetSpeakersSection({ setIsOpen }) {
  const speakers = [
    { name: 'Full name', title: 'Job title', bio: sampleBio() },
    { name: 'Full name', title: 'Job title', bio: sampleBio() },
    { name: 'Full name', title: 'Job title', bio: sampleBio() },
    { name: 'Full name', title: 'Job title', bio: sampleBio() },
  ];

  return (
    <section className="w-full bg-white">
      <div className="mx-auto container py-12 md:py-20">
        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-12 md:gap-10">
          {/* LEFT: Heading + copy */}
          <div className="md:col-span-4">
            <h2 className="text-[32px] font-semibold leading-[1.1] text-[color:var(--purple)] md:text-[40px]" style={{ ['--purple']: COLOR.purple }}>
              Meet the Speakers
            </h2>
            <p className="mt-3 text-[14.5px] leading-[1.75] text-[color:var(--body)] md:mt-3.5 md:text-[16px]" style={{ ['--body']: COLOR.body }}>
              At Edu.trade, we’re bringing together some of the most influential voices in Forex, finance, and the GCC business world. From keynote speakers who’ll set the vision to panelists who’ve built thriving IB networks, each expert will share practical insights you can apply to your own growth journey.
            </p>
            <p className="mt-3 text-[14.5px] leading-[1.75] text-[color:var(--body)] md:text-[16px]" style={{ ['--body']: COLOR.body }}>
              Unlike other events, you’re actually going to be shown how to grow your Introducing Broker business!
            </p>

          </div>

          {/* RIGHT: Cards 2×2 */}
          <div className="md:col-span-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {speakers.map((s, i) => (
                <SpeakerCard key={i} {...s} />)
              )}
            </div>
            <button
              className="mt-8 w-full sm:w-fit inline-flex items-center justify-center rounded-full bg-[color:var(--gold)] px-8 py-2.5 text-[15px] font-semibold text-[#fff] transition-transform duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[color:var(--gold)]/50"
              style={{ backgroundColor: COLOR.purple }}
              onClick={() => {
                setIsOpen(true)
              }}
            >
              Book My Seat
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function SpeakerCard({ name, title, bio }) {
  return (
    <div className="rounded-[8px] border-[#98A2B3] border bg-white p-4 md:p-5" style={{ borderColor: COLOR.border }}>
      <div className=" gap-4">
        <div
          className="h-24 w-22 rounded-md "
          style={{
            // light checker placeholder
            backgroundImage:
              'repeating-linear-gradient(45deg, #EEEAF8 0 10px, #F7F4FC 10px 20px)',
            backgroundSize: '20px 20px',
            ringColor: COLOR.border,
          }}
        />
        <div className="flex-1">
          <div className="text-[16px] mt-3 font-semibold leading-tight text-[color:var(--name)]" style={{ ['--name']: COLOR.name }}>
            {name}
          </div>
          <div className="text-[16px] leading-tight text-[color:var(--title)]" style={{ ['--title']: COLOR.title }}>
            {title}
          </div>
          <p className="mt-4 text-[16px] leading-[1.7] text-[color:var(--body)]" style={{ ['--body']: COLOR.body }}>
            {bio}
          </p>
        </div>
      </div>
    </div>
  );
}

function sampleBio() {
  return 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.';
}
