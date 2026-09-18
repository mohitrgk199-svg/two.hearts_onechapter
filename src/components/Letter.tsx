import Reveal from './Reveal';

export default function Letter() {
  return (
    <section className="relative py-24 px-5">
      {/* Floating hearts around letter */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {Array.from({ length: 8 }).map((_, i) => (
          <span
            key={i}
            className="absolute text-blush-400"
            style={{
              left: `${10 + (i * 11) % 80}%`,
              top: `${(i * 27) % 90}%`,
              fontSize: `${12 + (i % 3) * 6}px`,
              opacity: 0.25,
              filter: 'drop-shadow(0 0 4px rgba(255,122,166,0.5))',
              animation: `floatSide ${5 + (i % 3)}s ease-in-out ${i * 0.7}s infinite, breathe ${3 + (i % 2)}s ease-in-out infinite`,
            }}
          >
            {['♡', '♥', '💗', '💕'][i % 4]}
          </span>
        ))}
      </div>

      <Reveal>
        <h2 className="text-center font-script text-5xl sm:text-6xl text-blush-300 mb-12" style={{ textShadow: '0 0 20px rgba(255,122,166,0.4)' }}>
          For My Angel ❤️🥰
        </h2>
      </Reveal>

      <Reveal delay={200} threshold={0.1}>
        <div
          className="relative mx-auto max-w-2xl rounded-3xl p-8 sm:p-12 overflow-hidden"
          style={{
            background: 'rgba(255,245,247,0.04)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,169,192,0.18)',
            boxShadow: '0 8px 40px rgba(187,42,91,0.15), inset 0 1px 0 rgba(255,255,255,0.05)',
          }}
        >
          {/* Blurred couple silhouette background */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: 'url(https://images.pexels.com/photos/1024963/pexels-photo-1024963.jpeg?auto=compress&cs=tinysrgb&h=650&w=940)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.15,
              filter: 'blur(8px)',
              transform: 'scale(1.1)',
            }}
            aria-hidden="true"
          />
          {/* Letterhead ornament */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2">
              <div className="h-px w-12 bg-blush-400/40" />
              <span className="text-blush-400/60 text-sm">❦</span>
              <div className="h-px w-12 bg-blush-400/40" />
            </div>
          </div>

          <div className="font-script text-lg sm:text-xl text-white/85 leading-loose space-y-5">
            <p>My dearest Angel, 🥰</p>

            <p>
              I still remember the first time I saw you. It was the 16th of August, and the world
              was going about its business the way it always does — but I didn't know yet that the
              most important day of my life had already begun. You weren't meant to be a grand
              moment. You were meant to be the quiet one that changed everything ✨🫠
            </p>

            <p>
              Five days later, on the 21st, we chose each other. No long speeches, no elaborate
              plan — just two people who somehow understood that what they had found was too rare
              to let pass unnamed. And in that single decision, my entire world rearranged itself
              around you 💗🥰
            </p>

            <p>
              This last year has held more than I knew a year could hold. There have been days of
              laughter so easy it felt like breathing, and days of distance that ached in my chest
              like something physical. There have been conversations that lasted into the small
              hours, silences that said more than words, disagreements that taught us patience, and
              reconciliations that taught us tenderness. Through every one of them — through the
              joy and the missing and everything between — we kept choosing each other. And that
              choosing is the most precious thing I have ever known 🤭💕🩷
            </p>

            <p>
              When the miles stretch between us and I can't reach across to hold your hand, I close
              my eyes and remind myself that the same moon is watching over both of us. Missing you
              is hard, but it is also proof that what we have is real — worth the ache, worth the
              wait, worth every ordinary day until the next time I get to see you 🤧😘💗
            </p>

            <p>
              If I could write our future, I would fill it with slow mornings and shared laughter,
              with all the small, unglamorous moments that make a life feel like home. I don't need
              perfection. I only need you — today, tomorrow, and every ordinary, extraordinary day
              after that 🥰🫠✨
            </p>

            <p className="text-blush-300">
              I love you, Angel. More than I knew how to say before you, and more than I'll ever
              quite manage to put into words even now 💗❤️🩷🥰
            </p>

            <p className="pt-2">Forever yours, 🥰</p>
            <p className="text-blush-300 text-2xl">— your love 💗💕</p>
          </div>

          {/* Letterhead ornament bottom */}
          <div className="flex justify-center mt-8">
            <div className="flex items-center gap-2">
              <div className="h-px w-12 bg-blush-400/40" />
              <span className="text-blush-400/60 text-sm">❦</span>
              <div className="h-px w-12 bg-blush-400/40" />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
