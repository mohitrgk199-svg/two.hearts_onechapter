import Reveal from './Reveal';

const QUOTES = [
  'Somewhere between ordinary days, you became my favourite part of life.',
  "Maybe forever isn't a place. Maybe it's simply choosing the same person again and again.",
  'I have loved you in moments I was too shy to name — and in every silence between them.',
  'You are the thought that keeps my quiet hours warm.',
  'If love is a language, then you are every word I ever wanted to learn.',
  'Some people search a lifetime for what I found in five days with you.',
  'Distance is just space filled with the ache of missing someone worth waiting for.',
  'You did not just enter my life — you became the reason it feels like a story.',
  'I would choose you in a hundred lifetimes, in a hundred worlds, in any version of reality that has you in it.',
  'Home was never a place for me. It was the sound of your voice saying my name.',
];

const ACCENTS = [
  'rgba(255,122,166,0.12)',
  'rgba(244,63,94,0.10)',
  'rgba(255,169,192,0.12)',
  'rgba(187,42,91,0.08)',
];

export default function Quotes() {
  return (
    <section className="relative py-24 px-5">
      <Reveal>
        <h2 className="text-center font-serif text-4xl sm:text-5xl font-medium text-white mb-3 glow-text">
          Lines That Remind Me of You
        </h2>
        <p className="text-center font-serif italic text-blush-200/70 text-lg mb-16">
          Words I'd underline if our story were a book
        </p>
      </Reveal>

      <div className="mx-auto max-w-4xl grid gap-6 sm:grid-cols-2">
        {QUOTES.map((q, i) => (
          <Reveal key={i} delay={(i % 2) * 150} threshold={0.15}>
            <div
              className="group relative h-full rounded-2xl p-8 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1"
              style={{
                background: ACCENTS[i % ACCENTS.length],
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,169,192,0.15)',
                boxShadow: '0 4px 30px rgba(0,0,0,0.2)',
              }}
            >
              {/* Decorative corner */}
              <span
                className="absolute top-3 left-4 font-serif text-5xl text-blush-400/30 select-none"
                aria-hidden="true"
              >
                "
              </span>
              <span
                className="absolute bottom-1 right-4 font-serif text-5xl text-blush-400/20 select-none rotate-180"
                aria-hidden="true"
              >
                "
              </span>
              <p className="relative font-serif text-lg sm:text-xl text-white/90 italic leading-relaxed pt-4">
                {q}
              </p>
              <div
                className="mt-5 h-px w-16"
                style={{ background: 'linear-gradient(to right, #ff7aa6, transparent)' }}
              />
              <p className="mt-3 font-sans text-xs text-blush-300/50 tracking-wide">
                — for Angel, always
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
