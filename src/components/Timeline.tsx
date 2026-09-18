import { useEffect, useState, useMemo } from 'react';
import Reveal from './Reveal';

const RELATIONSHIP_START = new Date('2025-08-21T00:00:00');

function useTimeSince(start: Date) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, now.getTime() - start.getTime());
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { days, hours, minutes, seconds };
}

const TIMELINE_ITEMS = [
  {
    date: '16 August 2025',
    title: 'The Day We Met',
    body: `It was just another ordinary day — the kind that usually passes without anyone noticing. But then you walked into it, and something shifted so quietly that I didn't even realise my whole life had started over. I didn't hear bells or see fireworks. I just felt, somewhere deep and unspoken, that I wanted to keep knowing you. That was the day everything I didn't know I was waiting for began.`,
    icon: '✨',
  },
  {
    date: '21 August 2025',
    title: 'The Day We Became Us ❤️',
    body: `21 August 2025 ko mujhe tumhe khone se sabse zyada dar lag raha tha... Isiliye humne Truth or Dare khelte waqt tumhe propose kar diya. Tum meri life me sabse zyada pyaari aur important ho, aur main tumse duniya me sabse zyada pyaar karta hoon ❤️`,
    icon: '💞',
  },
  {
    date: '1+ Year',
    title: 'And somehow… look at us now.',
    body: `Over one year of memories, conversations, arguments, smiles, missing each other, and choosing each other again. We've grown in ways I couldn't have imagined and loved in ways I didn't know I was capable of. Every day with you has been a lesson in patience, in tenderness, in what it means to truly share a life. And somehow, after all this time, I still look at you and think — I'm so glad that ordinary day wasn't ordinary at all.`,
    icon: '🌙',
  },
];

export default function Timeline() {
  const { days, hours, minutes, seconds } = useTimeSince(RELATIONSHIP_START);

  const counterUnits = useMemo(
    () => [
      { label: 'Days', value: days },
      { label: 'Hours', value: hours },
      { label: 'Minutes', value: minutes },
      { label: 'Seconds', value: seconds },
    ],
    [days, hours, minutes, seconds]
  );

  return (
    <section className="relative py-24 px-5">
      <Reveal>
        <h2 className="text-center font-serif text-4xl sm:text-5xl font-medium text-white mb-3 glow-text">
          Our Timeline
        </h2>
        <p className="text-center font-serif italic text-blush-200/70 text-lg mb-16">
          Every day with you is a page worth remembering 🥰✨
        </p>
      </Reveal>

      {/* Timeline */}
      <div className="relative mx-auto max-w-2xl">
        {/* Vertical line */}
        <div
          className="absolute left-5 sm:left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
          style={{
            background: 'linear-gradient(to bottom, transparent, #ff7aa6 10%, #bb2a5b 50%, #ff7aa6 90%, transparent)',
          }}
          aria-hidden="true"
        />

        {TIMELINE_ITEMS.map((item, i) => (
          <Reveal key={i} delay={i * 200} threshold={0.2}>
            <div
              className={`relative mb-16 flex items-start gap-6 ${
                i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'
              }`}
            >
              {/* Node */}
              <div
                className="absolute left-5 sm:left-1/2 -translate-x-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full text-lg"
                style={{
                  background: 'linear-gradient(135deg, #ff7aa6, #bb2a5b)',
                  boxShadow: '0 0 15px rgba(255,122,166,0.6)',
                  animation: 'breathe 3s ease-in-out infinite',
                }}
              >
                {item.icon}
              </div>

              {/* Card */}
              <div
                className={`ml-16 sm:ml-0 sm:w-[calc(50%-2.5rem)] ${
                  i % 2 === 0 ? 'sm:pr-8 sm:text-right' : 'sm:pl-8'
                }`}
              >
                <div className="glass-pink rounded-2xl p-6 glow-pink">
                  <p className="font-script text-xl text-blush-300 mb-1">{item.date}</p>
                  <h3 className="font-serif text-2xl text-white font-medium mb-3">{item.title}</h3>
                  <p className="font-serif text-white/75 leading-relaxed text-[15px] sm:text-base">
                    {item.body}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Live counter */}
      <Reveal delay={200} threshold={0.1}>
        <div className="mx-auto mt-12 max-w-xl text-center">
          <div
            className="glass rounded-3xl p-8 glow-pink"
            style={{ animation: 'breathe 4s ease-in-out infinite' }}
          >
            <p className="font-serif text-lg text-blush-200/80 italic mb-5">
              Together for:
            </p>
            <div className="flex items-center justify-center gap-2 sm:gap-4">
              {counterUnits.map((u, i) => (
                <div key={u.label} className="flex items-center gap-2 sm:gap-4">
                  <div className="flex flex-col items-center">
                    <span
                      className="font-serif text-3xl sm:text-4xl font-medium text-white tabular-nums"
                      style={{ textShadow: '0 0 12px rgba(255,122,166,0.4)' }}
                    >
                      {u.value.toString().padStart(2, '0')}
                    </span>
                    <span className="font-sans text-[10px] sm:text-xs uppercase tracking-wider text-blush-300/70 mt-1">
                      {u.label}
                    </span>
                  </div>
                  {i < counterUnits.length - 1 && (
                    <span className="font-serif text-2xl text-blush-400/50">•</span>
                  )}
                </div>
              ))}
            </div>
            <p className="font-script text-xl text-blush-300 mt-5">and still counting ❤️🥰💕</p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
