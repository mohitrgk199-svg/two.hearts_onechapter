import { useEffect, useState } from 'react';
import StarField from './StarField';
import { Heart } from 'lucide-react';

type OpeningScreenProps = {
  onOpen: () => void;
};

const PHASES = [
  { text: 'Hey Angel… ❤️', delay: 800 },
  { text: 'I made a little world for you.', delay: 2800 },
  { text: 'I Love You, My Wife Angel ❤️', delay: 5200 },
];

export default function OpeningScreen({ onOpen }: OpeningScreenProps) {
  const [phase, setPhase] = useState(-1);
  const [showKiss, setShowKiss] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    PHASES.forEach((p, i) => {
      timers.push(setTimeout(() => setPhase(i), p.delay));
    });
    timers.push(setTimeout(() => setShowKiss(true), 7800));
    timers.push(setTimeout(() => setShowDate(true), 9200));
    timers.push(setTimeout(() => setShowButton(true), 10800));
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleOpen = () => {
    setExiting(true);
    setTimeout(onOpen, 1200);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center px-6 transition-opacity duration-1000 ${
        exiting ? 'opacity-0 scale-105' : 'opacity-100'
      }`}
      style={{
        background:
          'radial-gradient(ellipse at 30% 20%, #52306e 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, #bb2a5b 0%, transparent 50%), linear-gradient(135deg, #2a1a3d 0%, #3d2456 40%, #1a1325 100%)',
      }}
    >
      <StarField count={80} />
      {/* Floating hearts */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {Array.from({ length: 20 }).map((_, i) => (
          <span
            key={i}
            className="absolute"
            style={{
              left: `${(i * 37) % 95}%`,
              bottom: '-20px',
              fontSize: `${10 + (i % 4) * 6}px`,
              animation: `floatUp ${10 + (i % 5) * 3}s linear ${i * 0.8}s infinite`,
            }}
          >
            <span
              className="inline-block"
              style={{
                color: '#ff7aa6',
                opacity: 0.5,
                filter: 'drop-shadow(0 0 4px rgba(255,122,166,0.6))',
                animation: `floatSide ${4 + (i % 3)}s ease-in-out ${i * 0.5}s infinite`,
              }}
            >
              {['♡', '♥', '💗', '💕', '❤️'][i % 5]}
            </span>
          </span>
        ))}
      </div>

      {/* Soft glowing orbs */}
      <div
        className="pointer-events-none absolute top-1/4 left-1/4 h-64 w-64 rounded-full"
        style={{ background: 'rgba(255,122,166,0.15)', filter: 'blur(80px)', animation: 'glowPulse 6s ease-in-out infinite' }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full"
        style={{ background: 'rgba(187,42,91,0.12)', filter: 'blur(90px)', animation: 'glowPulse 8s ease-in-out 2s infinite' }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col items-center text-center">
        {PHASES.map((p, i) => (
          <div
            key={i}
            className={`transition-all duration-1500 ${
              phase >= i
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-6 absolute'
            }`}
            style={{ minHeight: phase === i ? 'auto' : 0 }}
          >
            {phase === i && (
              <h1
                className={`font-serif ${
                  i === 0
                    ? 'text-3xl sm:text-4xl font-light text-white/90'
                    : i === 1
                    ? 'text-xl sm:text-2xl font-light text-blush-200 italic'
                    : 'text-3xl sm:text-5xl font-medium text-shimmer glow-text'
                }`}
                style={{ animation: 'fadeInUp 1.2s ease forwards' }}
              >
                {p.text}
              </h1>
            )}
          </div>
        ))}

        {/* Kiss emoji */}
        <div
          className={`transition-all duration-1000 ${showKiss ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
          style={{ marginTop: '1.5rem' }}
        >
          <span
            className="text-5xl sm:text-6xl inline-block"
            style={{ animation: 'breathe 2s ease-in-out infinite', filter: 'drop-shadow(0 0 12px rgba(255,122,166,0.6))' }}
          >
            😚😚
          </span>
        </div>

        {/* Date text */}
        <p
          className={`font-serif text-base sm:text-lg text-blush-200/80 italic transition-all duration-1000 ${
            showDate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ marginTop: '2rem' }}
        >
          Our story started on 16 August 2025…
        </p>

        {/* Button */}
        <button
          onClick={handleOpen}
          className={`group relative mt-10 overflow-hidden rounded-full px-8 py-4 font-sans text-base sm:text-lg font-medium text-white transition-all duration-700 ${
            showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
          }`}
          style={{
            background: 'linear-gradient(135deg, #ff7aa6, #e23f73)',
            boxShadow: '0 0 30px rgba(255,122,166,0.5), 0 0 60px rgba(255,122,166,0.25)',
          }}
        >
          <span className="relative z-10 flex items-center gap-2">
            Open Our Story
            <Heart
              className="h-5 w-5 fill-white/80 transition-transform group-hover:scale-125"
              style={{ animation: 'breathe 1.5s ease-in-out infinite' }}
            />
          </span>
          <span
            className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-700 group-hover:translate-x-0"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  );
}
