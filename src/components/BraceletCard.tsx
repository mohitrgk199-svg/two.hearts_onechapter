import Reveal from './Reveal';
import { Heart } from 'lucide-react';

export default function BraceletCard() {
  return (
    <section className="relative py-16 px-5">
      <Reveal threshold={0.15}>
        <div className="mx-auto max-w-2xl">
          <div
            className="relative overflow-hidden rounded-3xl p-8 sm:p-10 text-center"
            style={{
              background: 'rgba(255,169,192,0.06)',
              backdropFilter: 'blur(18px)',
              WebkitBackdropFilter: 'blur(18px)',
              border: '1px solid rgba(255,169,192,0.18)',
              boxShadow: '0 8px 40px rgba(187,42,91,0.12)',
            }}
          >
            {/* Decorative floating hearts */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
              {Array.from({ length: 6 }).map((_, i) => (
                <span
                  key={i}
                  className="absolute text-blush-400"
                  style={{
                    left: `${(i * 17 + 5) % 90}%`,
                    top: `${(i * 23 + 10) % 80}%`,
                    fontSize: `${10 + (i % 3) * 5}px`,
                    opacity: 0.2,
                    filter: 'drop-shadow(0 0 4px rgba(255,122,166,0.5))',
                    animation: `floatSide ${4 + (i % 3)}s ease-in-out ${i * 0.5}s infinite`,
                  }}
                >
                  {['♡', '♥', '💗', '💕'][i % 4]}
                </span>
              ))}
            </div>

            <div className="relative z-10">
              {/* Heart ornament */}
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,122,166,0.2), rgba(187,42,91,0.1))',
                  border: '1px solid rgba(255,169,192,0.2)',
                }}
              >
                <Heart className="h-6 w-6 text-blush-300 fill-blush-400/40" style={{ animation: 'breathe 2s ease-in-out infinite' }} />
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl text-white font-medium mb-6 glow-text">
                The Bracelet I Gave You 💖
              </h2>

              {/* Photo placeholder */}
              <div
                className="relative mx-auto mb-6 flex h-56 w-full max-w-xs items-center justify-center rounded-2xl overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(82,48,110,0.3), rgba(187,42,91,0.12))',
                  border: '1px dashed rgba(255,169,192,0.25)',
                }}
              >
                <div className="text-center">
                  <div className="text-4xl mb-2 opacity-60">📿</div>
                  <p className="font-sans text-xs text-blush-300/50">Add the bracelet photo here</p>
                </div>
              </div>

              <p className="font-serif text-lg sm:text-xl text-white/80 italic leading-relaxed max-w-lg mx-auto">
                A little piece of my love that stays on your wrist, reminding you every second
                that I am always with you ✨
              </p>

              <div className="mt-6 flex justify-center">
                <div className="flex items-center gap-2">
                  <div className="h-px w-12 bg-blush-400/40" />
                  <span className="text-blush-400/60 text-sm">❦</span>
                  <div className="h-px w-12 bg-blush-400/40" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
