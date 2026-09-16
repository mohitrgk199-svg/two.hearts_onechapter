import Reveal from './Reveal';

const QUOTES = [
  'Distance tests love in a way that being together never can; every day, you choose the same person without being able to reach them.',
  "True love isn't about doing something reckless for someone. It is about being willing to sacrifice comfort, time, pride, and countless easy choices just to protect what you share.",
  "Maybe our story was never meant to be easy. Maybe its meaning lies in how two people keep believing in each other when everything around them says to give up ❤️",
];

export default function DistanceQuotes() {
  return (
    <section className="relative py-24 px-5">
      <Reveal>
        <h2 className="text-center font-serif text-4xl sm:text-5xl font-medium text-white mb-3 glow-text">
          Across the Distance
        </h2>
        <p className="text-center font-serif italic text-blush-200/70 text-lg mb-16">
          What our love has taught me about being far apart
        </p>
      </Reveal>

      <div className="mx-auto max-w-3xl space-y-8">
        {QUOTES.map((q, i) => (
          <Reveal key={i} delay={i * 200} threshold={0.15}>
            <div
              className="relative rounded-2xl p-8 sm:p-10"
              style={{
                background: i === 1
                  ? 'rgba(244,63,94,0.06)'
                  : 'rgba(255,122,166,0.07)',
                backdropFilter: 'blur(18px)',
                WebkitBackdropFilter: 'blur(18px)',
                border: '1px solid rgba(255,169,192,0.15)',
                boxShadow: '0 4px 30px rgba(0,0,0,0.15)',
              }}
            >
              {/* Quote mark */}
              <span
                className="absolute -top-3 left-6 font-serif text-6xl text-blush-400/30 select-none"
                aria-hidden="true"
              >
                "
              </span>

              <p className="relative font-serif text-lg sm:text-xl text-white/90 italic leading-relaxed pt-3">
                {q}
              </p>

              <div
                className="mt-5 h-px w-20"
                style={{ background: 'linear-gradient(to right, #ff7aa6, transparent)' }}
              />
              <p className="mt-3 font-sans text-xs text-blush-300/50 tracking-wide">
                — for my Angel, across every mile
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
