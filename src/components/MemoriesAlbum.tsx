import { useEffect, useState, useCallback } from 'react';
import { Plus, Trash2, X, Heart, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Reveal from './Reveal';

type Memory = {
  id: string;
  image_url: string;
  date: string;
  caption: string;
  created_at: string;
};



export default function MemoriesAlbum() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [date, setDate] = useState('');
  const [caption, setCaption] = useState('');
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const loadMemories = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('memories')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setError('Could not load memories. Please try again.');
    } else if (data) {
      setMemories(data as Memory[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadMemories();
  }, [loadMemories]);

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    setError('');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `memory-${Date.now()}.${fileExt}`;
      const filePath = `memories/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('memories')
        .upload(filePath, file);

      if (uploadError) {
        // Fallback: use file as data URL
        const reader = new FileReader();
        reader.onload = () => {
          setImageUrl(reader.result as string);
          setUploading(false);
        };
        reader.readAsDataURL(file);
        return;
      }

      const { data: urlData } = supabase.storage
        .from('memories')
        .getPublicUrl(filePath);

      setImageUrl(urlData.publicUrl);
      setUploading(false);
    } catch {
      // Fallback to data URL
      const reader = new FileReader();
      reader.onload = () => {
        setImageUrl(reader.result as string);
        setUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) {
      setError('Please add a photo first 💗');
      return;
    }
    if (!date.trim() || !caption.trim()) {
      setError('Please fill in the date and caption 💗');
      return;
    }

    setError('');
    const { data, error: insertError } = await supabase
      .from('memories')
      .insert({
        image_url: imageUrl.trim(),
        date: date.trim(),
        caption: caption.trim(),
      })
      .select()
      .single();

    if (insertError) {
      setError('Could not save this memory. Please try again.');
      return;
    }

    if (data) {
      setMemories((prev) => [data as Memory, ...prev]);
    }
    setImageUrl('');
    setDate('');
    setCaption('');
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    const { error: deleteError } = await supabase.from('memories').delete().eq('id', id);
    if (!deleteError) {
      setMemories((prev) => prev.filter((m) => m.id !== id));
    }
  };

  const allCards = memories.map((m) => ({
    id: m.id,
    image_url: m.image_url,
    date: m.date,
    caption: m.caption,
    isSaved: true,
  }));

  return (
    <section className="relative py-24 px-5">
      <Reveal>
        <h2 className="text-center font-serif text-4xl sm:text-5xl font-medium text-white mb-3 glow-text">
          Our Memories Album
        </h2>
        <p className="text-center font-serif italic text-blush-200/70 text-lg mb-4">
          Every photo, every moment, every memory — all in one place
        </p>
        <p className="text-center font-sans text-xs text-blush-300/50 mb-10 max-w-md mx-auto">
          Add your video call screenshots, photos, and special moments here. They'll be saved forever.
        </p>
      </Reveal>

      {/* Add button */}
      <Reveal delay={100}>
        <div className="flex justify-center mb-12">
          <button
            onClick={() => setShowForm(true)}
            className="group relative flex items-center gap-2 overflow-hidden rounded-full px-6 py-3 font-sans text-sm font-medium text-white transition-all duration-500 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #ff7aa6, #e23f73)',
              boxShadow: '0 0 20px rgba(255,122,166,0.35)',
            }}
          >
            <Plus className="h-4 w-4" />
            Add New Memory
          </button>
        </div>
      </Reveal>

      {/* Upload form modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center px-5"
          style={{ animation: 'fadeIn 0.4s ease forwards' }}
          onClick={() => setShowForm(false)}
        >
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(26,19,37,0.85)', backdropFilter: 'blur(8px)' }}
            aria-hidden="true"
          />
          <div
            className="relative w-full max-w-md rounded-3xl p-6 sm:p-8"
            style={{
              background: 'rgba(42,26,61,0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,169,192,0.2)',
              boxShadow: '0 8px 40px rgba(187,42,91,0.2)',
              animation: 'scaleIn 0.4s ease forwards',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-2xl text-white">Add a Memory 💗</h3>
              <button
                onClick={() => setShowForm(false)}
                className="rounded-full p-1.5 text-blush-300/60 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Photo upload */}
              <div>
                <label className="block font-sans text-xs text-blush-300/70 mb-2">Photo</label>
                <div className="flex flex-col gap-3">
                  <label
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-blush-400/30 py-6 text-sm text-blush-300/60 transition-all hover:border-blush-400/50 hover:text-blush-300"
                  >
                    {uploading ? (
                      <span>Uploading…</span>
                    ) : (
                      <>
                        <ImageIcon className="h-4 w-4" />
                        <span>Upload from your phone</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file);
                      }}
                    />
                  </label>
                  <div className="text-center text-blush-300/40 text-xs">or paste an image URL below</div>
                  <input
                    type="url"
                    value={imageUrl.startsWith('data:') ? '' : imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://…"
                    className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,169,192,0.15)',
                    }}
                  />
                  {imageUrl && (
                    <div className="mx-auto h-24 w-full max-w-[200px] overflow-hidden rounded-lg">
                      <img src={imageUrl} alt="Preview" className="h-full w-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block font-sans text-xs text-blush-300/70 mb-2">Date</label>
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="e.g. 14 Sept 2025"
                  className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,169,192,0.15)',
                  }}
                />
              </div>

              {/* Caption */}
              <div>
                <label className="block font-sans text-xs text-blush-300/70 mb-2">Caption</label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Write a sweet 2-line caption…"
                  rows={2}
                  className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none resize-none"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,169,192,0.15)',
                  }}
                />
              </div>

              {error && (
                <p className="font-sans text-sm text-rose-400">{error}</p>
              )}

              <button
                type="submit"
                className="w-full rounded-full py-3.5 font-sans text-sm font-medium text-white transition-all"
                style={{
                  background: 'linear-gradient(135deg, #ff7aa6, #e23f73)',
                  boxShadow: '0 0 20px rgba(255,122,166,0.3)',
                }}
              >
                Save This Memory 💕
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Gallery */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <Heart className="h-6 w-6 text-blush-400/60" style={{ animation: 'breathe 1.5s ease-in-out infinite' }} />
            <p className="font-sans text-sm text-blush-300/50">Loading our memories…</p>
          </div>
        </div>
      ) : allCards.length === 0 ? (
        <div className="flex justify-center py-16">
          <div className="flex flex-col items-center gap-4 text-center">
            <Heart className="h-10 w-10 text-blush-400/40" style={{ animation: 'breathe 2.5s ease-in-out infinite' }} />
            <p className="font-serif text-lg text-blush-200/60 italic max-w-xs">
              No memories yet — tap "Add New Memory" above to start filling our album 💗
            </p>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-4xl grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {allCards.map((card, i) => (
            <Reveal key={card.id} delay={(i % 3) * 120} threshold={0.1}>
              <div
                className="group relative overflow-hidden rounded-2xl"
                style={{
                  background: 'rgba(255,245,247,0.04)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,169,192,0.12)',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
                }}
              >
                {/* Photo */}
                <div className="relative h-48 overflow-hidden">
                  {card.image_url ? (
                    <img
                      src={card.image_url}
                      alt={card.caption}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div
                      className="flex h-full items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, rgba(82,48,110,0.3), rgba(187,42,91,0.12))' }}
                    >
                      <div className="text-center">
                        <ImageIcon className="mx-auto h-8 w-8 text-blush-300/30 mb-2" />
                        <p className="font-sans text-[10px] text-blush-300/40">Add your photo here</p>
                      </div>
                    </div>
                  )}
                  {/* Overlay gradient */}
                  <div
                    className="absolute inset-0 opacity-60"
                    style={{ background: 'linear-gradient(to top, rgba(26,19,37,0.9), transparent 60%)' }}
                    aria-hidden="true"
                  />
                </div>

                {/* Content */}
                <div className="p-5">
                  <p className="font-script text-base text-blush-300 mb-2">{card.date}</p>
                  <p className="font-serif text-sm text-white/80 italic leading-relaxed">{card.caption}</p>
                </div>

                {/* Delete button for saved memories */}
                {card.isSaved && (
                  <button
                    onClick={() => handleDelete(card.id)}
                    className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white/60 opacity-0 transition-all hover:text-rose-400 group-hover:opacity-100"
                    aria-label="Delete memory"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
