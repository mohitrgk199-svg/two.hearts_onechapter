import Reveal from './Reveal';
import PhotoPlaceholder from './PhotoPlaceholder';

const MEMORIES = [
  { date: 'Add a date', title: 'Our First Photo', message: 'Add the story behind this moment here…', tag: 'Photo' },
  { date: 'Add a date', title: 'A Special Day', message: 'Describe a day you never want to forget…', tag: 'Moment' },
  { date: 'Add a date', title: 'Something You Said', message: 'Write down the words that stayed with you…', tag: 'Words' },
  { date: 'Add a date', title: 'Just Us Laughing', message: "Remember that time we couldn't stop laughing?…", tag: 'Inside Joke' },
  { date: 'Add a date', title: 'A Quiet Moment', message: 'A memory where nothing happened, but everything did…', tag: 'Memory' },
  { date: 'Add a date', title: 'Missing You', message: 'A moment when distance felt heavy, but love felt stronger…', tag: 'Missing' },
];

const ROTATIONS = [-3, 2, -1.5, 3, -2.5, 1];

export default function Memories() {
  return (
    <section className="relative py-24 px-5">
      <Reveal>
        <h2 className="text-center font-serif text-4xl sm:text-5xl font-medium text-white mb-3 glow-text">
          Our Little Memories
        </h2>
        <p className="text-center font-serif italic text-blush-200/70 text-lg mb-4">
          A scrapbook for the moments I never want to forget
        </p>
        <p className="text-center font-sans text-xs text-blush-300/50 mb-16 max-w-md mx-auto">
          (Each card is a placeholder — you can replace these with your own photos and stories anytime)
        </p>
      </Reveal>

      <div className="mx-auto max-w-4xl grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {MEMORIES.map((m, i) => (
          <Reveal key={i} delay={(i % 3) * 150} threshold={0.15}>
            <div
              className="group relative rounded-lg p-4 transition-all duration-500 hover:scale-[1.05] hover:rotate-0 hover:z-10"
              style={{
                background: 'rgba(255,245,247,0.05)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,169,192,0.12)',
                transform: `rotate(${ROTATIONS[i % ROTATIONS.length]}deg)`,
                boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
              }}
            >
              {/* Tape */}
              <div
                className="absolute -top-2 left-1/2 -translate-x-1/2 h-4 w-16 rounded-sm opacity-70"
                style={{
                  background: 'rgba(255,201,219,0.4)',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }}
                aria-hidden="true"
              />

              {/* Photo placeholder */}
              <PhotoPlaceholder
                cardId={`memories-card-${i}`}
                className="relative mb-4 flex min-h-40 items-center justify-center overflow-hidden"
                containerStyle={{
                  background: 'linear-gradient(135deg, rgba(82,48,110,0.3), rgba(187,42,91,0.15))',
                  border: '1px dashed rgba(255,169,192,0.25)',
                }}
                emptyIcon="📷"
                emptyText="Add your photo/video here"
                allowVideo
              />

              {/* Content */}
              <div className="px-1">
                <span
                  className="inline-block rounded-full px-3 py-0.5 text-[10px] font-sans uppercase tracking-wide text-blush-200/80 mb-2"
                  style={{ background: 'rgba(255,122,166,0.15)' }}
                >
                  {m.tag}
                </span>
                <p className="font-script text-base text-blush-300 mb-1">{m.date}</p>
                <h3 className="font-serif text-xl text-white font-medium mb-2">{m.title}</h3>
                <p className="font-serif text-sm text-white/60 italic leading-relaxed">{m.message}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
