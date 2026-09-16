import { useMemo } from 'react';

type HeartConfig = {
  left: number;
  size: number;
  duration: number;
  delay: number;
  drift: boolean;
  rotate: boolean;
  glow: boolean;
  char: string;
  opacity: number;
};

const HEART_CHARS = ['♡', '♥', '💗', '💕', '❤️'];

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function generateHearts(count: number, seed: number): HeartConfig[] {
  const rand = seededRandom(seed);
  return Array.from({ length: count }, () => {
    const r = rand();
    return {
      left: rand() * 100,
      size: 12 + rand() * 20,
      duration: 8 + rand() * 12,
      delay: rand() * 12,
      drift: r > 0.4,
      rotate: r > 0.6,
      glow: r > 0.75,
      char: HEART_CHARS[Math.floor(rand() * HEART_CHARS.length)],
      opacity: 0.4 + rand() * 0.4,
    };
  });
}

type HeartFieldProps = {
  count?: number;
  className?: string;
  seed?: number;
};

export default function HeartField({ count = 18, className = '', seed = 42 }: HeartFieldProps) {
  const hearts = useMemo(() => generateHearts(count, seed), [count, seed]);

  return (
    <div
      className={`pointer-events-none fixed inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {hearts.map((h, i) => (
        <span
          key={i}
          className="absolute"
          style={{
            left: `${h.left}%`,
            bottom: '-30px',
            fontSize: `${h.size}px`,
            animation: `floatUp ${h.duration}s linear ${h.delay}s infinite`,
          }}
        >
          <span
            style={{
              display: 'inline-block',
              opacity: h.opacity,
              color: '#ff7aa6',
              animation: h.drift
                ? `floatSide ${4 + (i % 3)}s ease-in-out ${h.delay}s infinite`
                : undefined,
            }}
          >
            <span
              style={{
                display: 'inline-block',
                animation: h.rotate ? `softRotate ${3 + (i % 2)}s ease-in-out infinite` : undefined,
                filter: h.glow
                  ? 'drop-shadow(0 0 6px rgba(255,122,166,0.8))'
                  : 'drop-shadow(0 0 2px rgba(255,122,166,0.3))',
              }}
            >
              {h.char}
            </span>
          </span>
        </span>
      ))}
    </div>
  );
}
