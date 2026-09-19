import { useMemo } from 'react';

const EMOJIS = ['💖', '✨', '💕', '🌸', '😚'];

type FloatingEmoji = {
  left: number;
  size: number;
  duration: number;
  delay: number;
  emoji: string;
  drift: number;
};

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export default function FloatingEmojis({ count = 18 }: { count?: number }) {
  const emojis = useMemo(() => {
    const rand = seededRandom(12321);
    return Array.from({ length: count }, () => ({
      left: rand() * 100,
      size: 14 + rand() * 18,
      duration: 14 + rand() * 12,
      delay: rand() * 15,
      emoji: EMOJIS[Math.floor(rand() * EMOJIS.length)],
      drift: -20 + rand() * 40,
    }));
  }, [count]);

  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {emojis.map((e, i) => (
        <span
          key={i}
          className="absolute select-none"
          style={{
            left: `${e.left}%`,
            bottom: '-40px',
            fontSize: `${e.size}px`,
            opacity: 0.35,
            animation: `floatUp ${e.duration}s linear ${e.delay}s infinite`,
            ['--tw-drift' as string]: `${e.drift}px`,
          }}
        >
          {e.emoji}
        </span>
      ))}
    </div>
  );
}
