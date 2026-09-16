import { useEffect, useMemo, useState } from 'react';
import Reveal from './Reveal';

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

type DriftHeart = {
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
  char: string;
};

export default function NightSky() {
  const [showMoon, setShowMoon] = useState(false);
  const [visible, setVisible] = useState(false);

  const stars = useMemo(() => {
    const rand = seededRandom(777);
    return Array.from({ length: 50 }, () => ({
      left: rand() * 100,
      top: rand() * 100,
      size: 1 + rand() * 2,
      duration: 2 + rand() * 5,
      delay: rand() * 5,
    }));
  }, []);

  const driftHearts = useMemo(() => {
    const rand = seededRandom(333);
    const chars = ['♡', '♥', '💗', '💕'];
    return Array.from({ length: 8 }, () => ({
      left: -10,
      top: rand() * 100,
      size: 10 + rand() * 10,
      duration: 12 + rand() * 8,
      delay: rand() * 10,
      char: chars[Math.floor(rand() * chars.length)],
    }));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowMoon(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      ref={(el) => {
        if (el) {
          const obs = new IntersectionObserver(
            ([e]) => e.isIntersecting && setVisible(true),
            { threshold: 0.2 }
          );
          obs.observe(el);
        }
      }}
      className="relative py-24 px-5 overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse at 50% 100%, #2a1a3d 0%, transparent 70%), linear-gradient(180deg, #1a1325 0%, #241a33 50%, #1a1325 100%)',
      }}
    >
      {/* Stars */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {stars.map((s, i) => (
          <span
            key={`star-${i}`}
            className="absolute rounded-full bg-white"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              opacity: visible ? 1 : 0,
              transition: 'opacity 2s ease',
              animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
              boxShadow: '0 0 4px rgba(255,255,255,0.5)',
            }}
          />
        ))}
      </div>

      {/* Drifting hearts */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {driftHearts.map((h, i) => (
          <span
            key={`dh-${i}`}
            className="absolute text-blush-400"
            style={{
              left: 0,
              top: `${h.top}%`,
              fontSize: `${h.size}px`,
              opacity: 0.5,
              filter: 'drop-shadow(0 0 6px rgba(255,122,166,0.6))',
              animation: `drift ${h.duration}s ease-in-out ${h.delay}s infinite`,
            }}
          >
            {h.char}
          </span>
        ))}
      </div>

      {/* Moon */}
      <div
        className="relative z-10 flex flex-col items-center text-center mx-auto max-w-xl"
      >
        <div
          className={`relative mb-8 transition-all duration-2000 ${
            showMoon ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          }`}
        >
          <div
            className="h-32 w-32 sm:h-40 sm:w-40 rounded-full"
            style={{
              background: 'radial-gradient(circle at 35% 35%, #fff5f7 0%, #ffc9db 50%, #ff7aa6 100%)',
              boxShadow: '0 0 40px rgba(255,201,219,0.4), 0 0 80px rgba(255,122,166,0.2)',
              animation: 'breathe 5s ease-in-out infinite',
            }}
          >
            {/* Moon craters */}
            <div className="absolute top-6 left-8 h-3 w-3 rounded-full bg-blush-300/30" />
            <div className="absolute top-12 right-6 h-2 w-2 rounded-full bg-blush-300/30" />
            <div className="absolute bottom-8 left-10 h-2.5 w-2.5 rounded-full bg-blush-300/25" />
          </div>
        </div>

        <Reveal delay={400}>
          <h2 className="font-serif text-4xl sm:text-5xl font-medium text-white mb-6 glow-text">
            If You Ever Miss Me…
          </h2>
        </Reveal>

        <Reveal delay={600}>
          <div className="glass-pink rounded-2xl p-8 glow-pink">
            <p className="font-serif text-lg sm:text-xl text-white/85 italic leading-relaxed">
              Look at the sky for a moment. Maybe we're looking at the same moon, and even when
              we're far apart, a little part of my heart is always with you.
            </p>
          </div>
        </Reveal>

        <Reveal delay={800}>
          <p className="font-script text-2xl text-blush-300 mt-8">
            Same sky. Same moon. Same love. 🌙
          </p>
        </Reveal>
      </div>
    </section>
  );
}
