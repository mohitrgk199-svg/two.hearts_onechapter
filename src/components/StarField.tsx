import { useEffect, useMemo, useState } from 'react';

const STAR_COUNT = 60;

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

type StarFieldProps = {
  count?: number;
  className?: string;
  seed?: number;
};

export default function StarField({ count = STAR_COUNT, className = '', seed = 100 }: StarFieldProps) {
  const stars = useMemo(() => {
    const rand = seededRandom(seed);
    return Array.from({ length: count }, () => ({
      left: rand() * 100,
      top: rand() * 100,
      size: 1 + rand() * 2.5,
      duration: 2 + rand() * 4,
      delay: rand() * 5,
    }));
  }, [count, seed]);

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
            boxShadow: '0 0 4px rgba(255,255,255,0.6)',
          }}
        />
      ))}
    </div>
  );
}
