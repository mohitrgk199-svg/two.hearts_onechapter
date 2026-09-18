import { useEffect, useRef, useState } from 'react';

const SEQUENCE = [
  { text: 'If our story were a book… 📖✨', delay: 500 },
  { text: "I'd still choose you as my favourite chapter. 🥰💕", delay: 3500 },
  { text: "And I'd never want the story to end. 💗❤️", delay: 7000 },
];

export default function FinalPage() {
  const [step, setStep] = useState(-1);
  const [showHeart, setShowHeart] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  const [showDates, setShowDates] = useState(false);
  const [showKiss, setShowKiss] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
          const timers: ReturnType<typeof setTimeout>[] = [];
          SEQUENCE.forEach((s, i) => {
            timers.push(setTimeout(() => setStep(i), s.delay));
          });
          timers.push(setTimeout(() => setShowHeart(true), 10000));
          timers.push(setTimeout(() => setShowFinal(true), 12500));
          timers.push(setTimeout(() => setShowDates(true), 15000));
          timers.push(setTimeout(() => setShowKiss(true), 17000));
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center px-5 py-32 overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse at center, #3d2456 0%, #2a1a3d 40%, #1a1325 100%)',
      }}
    >
      {/* Fading ambient glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: step >= 0 ? 'transparent' : 'rgba(26,19,37,0.3)',
          transition: 'background 3s ease',
        }}
        aria-hidden="true"
      />

      {/* Glowing heart */}
      <div
        className={`relative flex items-center justify-center transition-all duration-2000 ${
          showHeart ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
        }`}
      >
        <div
          className="relative"
          style={{ animation: 'breathe 4s ease-in-out infinite' }}
        >
          {/* Outer glow */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255,122,166,0.4) 0%, transparent 70%)',
              filter: 'blur(30px)',
              animation: 'glowPulse 3s ease-in-out infinite',
              width: '200px',
              height: '200px',
              left: '-50px',
              top: '-50px',
            }}
            aria-hidden="true"
          />
          {/* Heart shape */}
          <div
            className="text-8xl sm:text-9xl"
            style={{
              filter: 'drop-shadow(0 0 20px rgba(255,122,166,0.8)) drop-shadow(0 0 40px rgba(255,122,166,0.4))',
              animation: 'breathe 2s ease-in-out infinite',
            }}
          >
            ❤️
          </div>
        </div>
      </div>

      {/* Sequence text */}
      <div className="relative z-10 text-center mt-12 max-w-2xl">
        {SEQUENCE.map((s, i) => (
          <div
            key={i}
            className={`transition-all duration-1500 ${
              step >= i ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 absolute'
            }`}
          >
            {step === i && (
              <p
                className="font-serif text-2xl sm:text-3xl text-white/90 italic"
                style={{ animation: 'fadeInUp 1.5s ease forwards' }}
              >
                {s.text}
              </p>
            )}
          </div>
        ))}

        {/* Final declaration */}
        {showFinal && (
          <div style={{ animation: 'scaleIn 1.5s ease forwards' }}>
            <h1
              className="font-serif text-4xl sm:text-6xl font-medium text-shimmer glow-text mt-8"
            >
              I LOVE YOU, ANGEL ❤️🥰💕
            </h1>
          </div>
        )}

        {/* Dates */}
        {showDates && (
          <div
            className="mt-8 space-y-2"
            style={{ animation: 'fadeInUp 1.5s ease forwards' }}
          >
            <p className="font-script text-xl text-blush-300">
              16 August 2025 — The beginning of our story ✨
            </p>
            <p className="font-script text-xl text-blush-300">
              21 August 2025 — The day we became us 💗🥰
            </p>
          </div>
        )}

        {/* Final kiss */}
        {showKiss && (
          <div
            className="mt-10 text-3xl"
            style={{ animation: 'scaleIn 1s ease forwards' }}
          >
            <span
              className="inline-block"
              style={{ animation: 'breathe 2s ease-in-out infinite' }}
            >
              💋 ❤️ 💗
            </span>
          </div>
        )}
      </div>

      {/* Burst hearts on final reveal */}
      {showKiss && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          {Array.from({ length: 15 }).map((_, i) => (
            <span
              key={i}
              className="absolute"
              style={{
                left: `${(i * 13) % 90 + 5}%`,
                bottom: '0',
                fontSize: `${10 + (i % 4) * 6}px`,
                animation: `floatUp ${8 + (i % 4) * 2}s linear ${i * 0.3}s infinite`,
              }}
            >
              <span
                className="inline-block text-blush-400"
                style={{
                  opacity: 0.6,
                  filter: 'drop-shadow(0 0 5px rgba(255,122,166,0.7))',
                  animation: `softRotate ${3 + (i % 2)}s ease-in-out infinite`,
                }}
              >
                {['♡', '♥', '💗', '💕', '❤️'][i % 5]}
              </span>
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
