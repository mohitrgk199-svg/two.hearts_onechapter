import { useState } from 'react';
import { Pencil, Trash2, X, Check } from 'lucide-react';
import Reveal from './Reveal';
import PhotoPlaceholder from './PhotoPlaceholder';
import { useCardText, type CardText } from '@/hooks/useCardText';

const DEFAULT_MEMORIES = [
  { date: 'Add a date', title: 'Our First Photo', message: 'Add the story behind this moment here…', tag: 'Photo' },
  { date: 'Add a date', title: 'A Special Day', message: 'Describe a day you never want to forget…', tag: 'Moment' },
  { date: 'Add a date', title: 'Something You Said', message: 'Write down the words that stayed with you…', tag: 'Words' },
  { date: 'Add a date', title: 'Just Us Laughing', message: "Remember that time we couldn't stop laughing?…", tag: 'Inside Joke' },
  { date: 'Add a date', title: 'A Quiet Moment', message: 'A memory where nothing happened, but everything did…', tag: 'Memory' },
  { date: 'Add a date', title: 'Missing You', message: 'A moment when distance felt heavy, but love felt stronger…', tag: 'Missing' },
];

const ROTATIONS = [-3, 2, -1.5, 3, -2.5, 1];

function MemoryCard({
  index,
  defaults,
  rotation,
}: {
  index: number;
  defaults: { date: string; title: string; message: string; tag: string };
  rotation: number;
}) {
  const cardId = `memories-card-${index}`;
  const { text, saveText, deleteText } = useCardText(cardId, defaults);
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [draft, setDraft] = useState<CardText>(text);

  const startEdit = () => {
    setDraft(text);
    setEditing(true);
  };

  const saveEdit = () => {
    saveText(draft);
    setEditing(false);
  };

  const handleDelete = async () => {
    await deleteText();
    setConfirmDelete(false);
    // Reset to defaults in UI
    saveText(defaults);
  };

  return (
    <>
      <div
        className="group relative rounded-lg p-4 transition-all duration-500 hover:scale-[1.05] hover:rotate-0 hover:z-10"
        style={{
          background: 'rgba(255,245,247,0.05)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,169,192,0.12)',
          transform: `rotate(${rotation}deg)`,
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

        {/* Photo / Video placeholder */}
        <PhotoPlaceholder
          cardId={cardId}
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
            {text.tag}
          </span>
          <p className="font-script text-base text-blush-300 mb-1">{text.date}</p>
          <h3 className="font-serif text-xl text-white font-medium mb-2">{text.title}</h3>
          <p className="font-serif text-sm text-white/60 italic leading-relaxed">{text.message}</p>
        </div>

        {/* Edit + Delete buttons (appear on hover) */}
        <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <button
            onClick={startEdit}
            className="flex h-7 w-7 items-center justify-center rounded-full text-white/60 transition-colors hover:text-blush-300"
            style={{ background: 'rgba(26,19,37,0.7)' }}
            aria-label="Edit card text"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex h-7 w-7 items-center justify-center rounded-full text-white/60 transition-colors hover:text-rose-400"
              style={{ background: 'rgba(26,19,37,0.7)' }}
              aria-label="Delete card content"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          ) : (
            <div
              className="flex items-center gap-1 rounded-full px-2 py-1"
              style={{ background: 'rgba(26,19,37,0.95)', border: '1px solid rgba(244,63,94,0.4)' }}
            >
              <span className="font-sans text-[9px] text-white/90 whitespace-nowrap">Delete?</span>
              <button
                onClick={handleDelete}
                className="flex h-5 w-5 items-center justify-center rounded-full text-rose-400 transition-colors hover:bg-rose-500/20"
                aria-label="Confirm delete"
              >
                <Check className="h-3 w-3" />
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex h-5 w-5 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10"
                aria-label="Cancel delete"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Edit modal */}
      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-5"
          style={{ animation: 'fadeIn 0.3s ease forwards' }}
          onClick={() => setEditing(false)}
        >
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(26,19,37,0.85)', backdropFilter: 'blur(8px)' }}
            aria-hidden="true"
          />
          <div
            className="relative w-full max-w-sm max-h-[90vh] overflow-y-auto rounded-3xl p-6"
            style={{
              background: 'rgba(42,26,61,0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,169,192,0.2)',
              boxShadow: '0 8px 40px rgba(187,42,91,0.2)',
              animation: 'scaleIn 0.3s ease forwards',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5 sticky top-0" style={{ background: 'rgba(42,26,61,0.95)', zIndex: 10, paddingBottom: '8px' }}>
              <h3 className="font-serif text-xl text-white">Edit This Memory 💗</h3>
              <button
                onClick={() => setEditing(false)}
                className="rounded-full p-1.5 text-blush-300/60 hover:text-white transition-colors"
                aria-label="Close edit modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-sans text-xs text-blush-300/70 mb-2">Tag</label>
                <input
                  type="text"
                  value={draft.tag}
                  onChange={(e) => setDraft({ ...draft, tag: e.target.value })}
                  placeholder="e.g. Photo, Moment, Inside Joke"
                  className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,169,192,0.15)' }}
                />
              </div>

              <div>
                <label className="block font-sans text-xs text-blush-300/70 mb-2">Date</label>
                <input
                  type="text"
                  value={draft.date}
                  onChange={(e) => setDraft({ ...draft, date: e.target.value })}
                  placeholder="e.g. 21 August 2025"
                  className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,169,192,0.15)' }}
                />
              </div>

              <div>
                <label className="block font-sans text-xs text-blush-300/70 mb-2">Title</label>
                <input
                  type="text"
                  value={draft.title}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                  placeholder="e.g. Our First Movie Date"
                  className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,169,192,0.15)' }}
                />
              </div>

              <div>
                <label className="block font-sans text-xs text-blush-300/70 mb-2">Description / Story</label>
                <textarea
                  value={draft.message}
                  onChange={(e) => setDraft({ ...draft, message: e.target.value })}
                  placeholder="Write the story behind this moment…"
                  rows={4}
                  className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none resize-none"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,169,192,0.15)' }}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setEditing(false)}
                  className="flex-1 rounded-full py-3 font-sans text-sm font-medium text-white/70 transition-all hover:text-white"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,169,192,0.15)',
                  }}
                  aria-label="Cancel edit"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  className="flex-1 rounded-full py-3 font-sans text-sm font-medium text-white transition-all"
                  style={{
                    background: 'linear-gradient(135deg, #ff7aa6, #e23f73)',
                    boxShadow: '0 0 20px rgba(255,122,166,0.3)',
                  }}
                  aria-label="Save changes"
                >
                  Save Changes 💖
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

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
        {DEFAULT_MEMORIES.map((m, i) => (
          <Reveal key={i} delay={(i % 3) * 150} threshold={0.15}>
            <MemoryCard
              index={i}
              defaults={m}
              rotation={ROTATIONS[i % ROTATIONS.length]}
            />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
