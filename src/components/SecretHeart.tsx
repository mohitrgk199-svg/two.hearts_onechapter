import { useEffect, useRef, useState } from 'react';
import { Heart } from 'lucide-react';

type BurstHeart = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  char: string;
  size: number;
};

const HEART_CHARS = ['♡', '♥', '💗', '💕', '❤️'];

export default function SecretHeart() {
  const [revealed, setRevealed] = useState(false);
  const [bursting, setBursting] = useState(false);
  const [hearts, setHearts] = useState<BurstHeart[]>([]);
  const idRef = useRef(0);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (revealed) return;
    setRevealed(true);
    setBursting(true);

    // Generate burst hearts
    const newHearts: BurstHeart[] = Array.from({ length: 30 }, (_, i) => {
      const angle = (i / 30) * Math.PI * 2;
      const speed = 2 + Math.random() * 3;
      return {
        id: idRef.current++,
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        char: HEART_CHARS[Math.floor(Math.random() * HEART_CHARS.length)],
        size: 14 + Math.random() * 16,
      };
    });
    setHearts(newHearts);

    // Animate
    let frame = 0;
    const animate = () => {
      frame++;
      setHearts((prev) =>
        prev.map((h) => ({
          ...h,
          x: h.x + h.vx,
          y: h.y + h.vy,
          vy: h.vy + 0.08,
        }))
      );
      if (frame < 120) {
        requestAnimationFrame(animate);
      } else {
        setBursting(false);
        setHearts([]);
      }
    };
    requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (!revealed) return;
    const timer = setTimeout(() => setRevealed(false), 6000);
    return () => clearTimeout(timer);
  }, [revealed]);

  return (
    <>
      {/* Small heart icon — hidden in the page */}
      <button
        onClick={handleClick}
        aria-label="A little secret"
        className="group fixed bottom-5 right-5 z-30 flex h-10 w-10 items-center justify-center rounded-full transition-all duration-500 hover:scale-125"
        style={{
          background: 'rgba(255,122,166,0.1)',
          border: '1px solid rgba(255,169,192,0.2)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <Heart
          className="h-4 w-4 text-blush-400/40 transition-all duration-500 group-hover:text-blush-300 group-hover:fill-blush-400/60"
          style={{ animation: 'breathe 3s ease-in-out infinite' }}
        />
      </button>

      {/* Surprise modal */}
      {revealed && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center px-6"
          style={{ animation: 'fadeIn 0.8s ease forwards' }}
          onClick={() => setRevealed(false)}
        >
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(26,19,37,0.85)', backdropFilter: 'blur(8px)' }}
            aria-hidden="true"
          />
          <div
            className="relative glass-pink rounded-3xl p-8 sm:p-12 max-w-md text-center glow-pink"
            style={{ animation: 'scaleIn 0.8s ease forwards' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full text-3xl"
              style={{
                background: 'linear-gradient(135deg, #ff7aa6, #bb2a5b)',
                boxShadow: '0 0 25px rgba(255,122,166,0.6)',
                animation: 'breathe 2s ease-in-out infinite',
              }}
            >
              ❤️
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl text-white mb-4 glow-text">
              You found my little secret ❤️
            </h3>
            {bursting && (
              <p
                className="font-serif text-lg sm:text-xl text-blush-200 italic"
                style={{ animation: 'fadeInUp 1s ease 0.5s forwards', opacity: 0 }}
              >
                I love you more than this little website could ever explain.
              </p>
            )}
            <p className="font-sans text-xs text-blush-300/50 mt-6">Tap anywhere to close</p>
          </div>
        </div>
      )}

      {/* Burst hearts overlay */}
      {bursting && (
        <div className="pointer-events-none fixed inset-0 z-40" aria-hidden="true">
          {hearts.map((h) => (
            <span
              key={h.id}
              className="absolute text-blush-400"
              style={{
                left: `${h.x}px`,
                top: `${h.y}px`,
                fontSize: `${h.size}px`,
                opacity: 0.8,
                filter: 'drop-shadow(0 0 6px rgba(255,122,166,0.8))',
                transition: 'opacity 1s ease',
              }}
            >
              {h.char}
            </span>
          ))}
        </div>
      )}
    </>
  );
}
