import Reveal from './Reveal';

export default function LyricsCard() {
  return (
    <section className="relative py-20 px-5">
      <Reveal threshold={0.15}>
        <div className="mx-auto max-w-2xl">
          <div
            className="relative overflow-hidden rounded-3xl p-8 sm:p-12 text-center"
            style={{
              background: 'rgba(255,169,192,0.06)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,169,192,0.18)',
              boxShadow: '0 8px 40px rgba(187,42,91,0.12)',
            }}
          >
            {/* Blurred couple silhouette background */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage: 'url(https://images.pexels.com/photos/10099212/pexels-photo-10099212.jpeg?auto=compress&cs=tinysrgb&h=650&w=940)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.18,
                filter: 'blur(8px)',
                transform: 'scale(1.1)',
              }}
              aria-hidden="true"
            />
            {/* Floating hearts decoration */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
              {Array.from({ length: 6 }).map((_, i) => (
                <span
                  key={i}
                  className="absolute text-blush-400"
                  style={{
                    left: `${(i * 17 + 5) % 90}%`,
                    top: `${(i * 23 + 10) % 80}%`,
                    fontSize: `${10 + (i % 3) * 5}px`,
                    opacity: 0.18,
                    filter: 'drop-shadow(0 0 4px rgba(255,122,166,0.5))',
                    animation: `floatSide ${4 + (i % 3)}s ease-in-out ${i * 0.5}s infinite`,
                  }}
                >
                  {['♡', '♥', '💗', '💕'][i % 4]}
                </span>
              ))}
            </div>

            <div className="relative z-10">
              {/* Ornament */}
              <div className="flex justify-center mb-6">
                <div className="flex items-center gap-2">
                  <div className="h-px w-12 bg-blush-400/40" />
                  <span className="text-blush-400/60 text-sm">♪</span>
                  <div className="h-px w-12 bg-blush-400/40" />
                </div>
              </div>

              <p className="font-script text-base text-blush-300/60 mb-6">
                Pal — Arijit Singh & Shreya Ghoshal 🎶🥰
              </p>

              <div className="space-y-3">
                <p className="font-serif text-xl sm:text-2xl text-white/90 italic leading-relaxed">
                  Har lamha baahon mein teri ho, 🥰
                </p>
                <p className="font-serif text-xl sm:text-2xl text-white/90 italic leading-relaxed">
                  palkon mein tu ho, saansom mein tu... 💗
                </p>
                <p className="font-serif text-xl sm:text-2xl text-blush-200 italic leading-relaxed glow-text">
                  Pal bhar thahar jaao, dil ko sukoon mile 🩷✨
                </p>
              </div>

              {/* Bottom ornament */}
              <div className="flex justify-center mt-8">
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
