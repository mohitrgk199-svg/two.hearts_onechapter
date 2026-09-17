import { useEffect, useState } from 'react';
import { Lock, Heart } from 'lucide-react';
import StarField from './StarField';

type PasswordGatewayProps = {
  onUnlock: () => void;
};

const ACCEPTED_PASSWORDS = [
  '21 august 2025',
  '21august2025',
  '21/08/2025',
  '21-08-2025',
  '21082025',
];

function normalizePassword(s: string): string {
  return s.trim().toLowerCase().replace(/[\s.\-/]/g, '');
}

function isPasswordCorrect(input: string): boolean {
  const normalized = normalizePassword(input);
  return ACCEPTED_PASSWORDS.some((p) => normalizePassword(p) === normalized);
}

export default function PasswordGateway({ onUnlock }: PasswordGatewayProps) {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowHint(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isPasswordCorrect(input)) {
      setError(false);
      setUnlocking(true);
      setTimeout(onUnlock, 1200);
    } else {
      setError(true);
      setInput('');
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center px-6 transition-all duration-1000 ${
        unlocking ? 'opacity-0 scale-105' : 'opacity-100'
      }`}
      style={{
        background:
          'radial-gradient(ellipse at 30% 20%, #52306e 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, #bb2a5b 0%, transparent 50%), linear-gradient(135deg, #2a1a3d 0%, #3d2456 40%, #1a1325 100%)',
      }}
    >
      <StarField count={60} />

      {/* Floating hearts */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="absolute"
            style={{
              left: `${(i * 37) % 95}%`,
              bottom: '-20px',
              fontSize: `${10 + (i % 4) * 5}px`,
              animation: `floatUp ${10 + (i % 5) * 3}s linear ${i * 0.8}s infinite`,
            }}
          >
            <span
              className="inline-block"
              style={{
                color: '#ff7aa6',
                opacity: 0.4,
                filter: 'drop-shadow(0 0 4px rgba(255,122,166,0.5))',
                animation: `floatSide ${4 + (i % 3)}s ease-in-out ${i * 0.5}s infinite`,
              }}
            >
              {['♡', '♥', '💗', '💕', '❤️'][i % 5]}
            </span>
          </span>
        ))}
      </div>

      <div
        className="relative z-10 w-full max-w-sm text-center"
        style={{ animation: 'fadeInUp 1s ease forwards' }}
      >
        {/* Lock icon */}
        <div
          className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full"
          style={{
            background: 'linear-gradient(135deg, rgba(255,122,166,0.2), rgba(187,42,91,0.15))',
            border: '1px solid rgba(255,169,192,0.25)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <Lock className="h-7 w-7 text-blush-300" style={{ animation: 'breathe 3s ease-in-out infinite' }} />
        </div>

        <h1 className="font-serif text-2xl sm:text-3xl text-white font-medium mb-2 glow-text">
          Password de be pgl insaan 😜
        </h1>
        <p className="font-script text-lg text-blush-300/80 mb-8">
          Ye duniya sirf ek pgl ki hai
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError(false);
            }}
            placeholder="Enter the magic words…"
            autoFocus
            className="w-full rounded-full px-6 py-3.5 text-center font-serif text-lg text-white placeholder-white/30 outline-none transition-all"
            style={{
              background: 'rgba(255,255,255,0.06)',
              backdropFilter: 'blur(12px)',
              border: error ? '1px solid rgba(244,63,94,0.6)' : '1px solid rgba(255,169,192,0.2)',
            }}
          />

          {error && (
            <p
              className="font-serif text-rose-400 text-base"
              style={{ animation: 'fadeIn 0.3s ease forwards' }}
            >
              Galat password! Dobara try karo 🙈
            </p>
          )}

          <button
            type="submit"
            className="group relative w-full overflow-hidden rounded-full py-3.5 font-sans text-base font-medium text-white transition-all duration-500"
            style={{
              background: 'linear-gradient(135deg, #ff7aa6, #e23f73)',
              boxShadow: '0 0 25px rgba(255,122,166,0.4)',
            }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Unlock Our World
              <Heart className="h-4 w-4 fill-white/80" style={{ animation: 'breathe 1.5s ease-in-out infinite' }} />
            </span>
          </button>
        </form>

        {showHint && !error && (
          <p
            className="mt-6 font-sans text-xs text-blush-300/40"
            style={{ animation: 'fadeIn 1s ease forwards' }}
          >
            Hint: Think about the day we became us… 💌
          </p>
        )}
      </div>
    </div>
  );
}
