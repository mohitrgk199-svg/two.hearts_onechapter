import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

type MusicToggleProps = {
  autoPlay: boolean;
};

// Romantic instrumental — direct MP3 stream (CORS-friendly)
const AUDIO_SRC = 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-piano-112199.mp3';
const VOLUME = 0.32; // 32% — soft romantic level

export default function MusicToggle({ autoPlay }: MusicToggleProps) {
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element on mount
  useEffect(() => {
    const audio = new Audio();
    audio.src = AUDIO_SRC;
    audio.loop = true;
    audio.volume = VOLUME;
    audio.preload = 'auto';
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, []);

  const startMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    setLoading(true);
    try {
      audio.volume = VOLUME;
      await audio.play();
      setStarted(true);
      setPlaying(true);
    } catch {
      // Autoplay blocked or network error — user can retry via toggle
      setPlaying(false);
    } finally {
      setLoading(false);
    }
  };

  const stopMusic = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
    }
    setPlaying(false);
  };

  // Auto-play when unlocked
  useEffect(() => {
    if (autoPlay && !started) {
      const timer = setTimeout(() => startMusic(), 600);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, started]);

  const toggle = () => {
    if (loading) return;
    if (playing) {
      stopMusic();
    } else {
      startMusic();
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      aria-label={playing ? 'Pause music' : 'Play music'}
      className="group fixed top-5 right-5 z-30 flex h-12 w-12 items-center justify-center rounded-full transition-all duration-500 hover:scale-110"
      style={{
        background: 'rgba(255,122,166,0.12)',
        border: '1px solid rgba(255,169,192,0.25)',
        backdropFilter: 'blur(12px)',
        boxShadow: playing ? '0 0 20px rgba(255,122,166,0.3)' : 'none',
      }}
      title={playing ? 'Pause music' : 'Play music'}
    >
      {playing ? (
        <Volume2 className="h-5 w-5 text-blush-300 transition-all" />
      ) : (
        <VolumeX className={`h-5 w-5 text-blush-300/70 transition-all group-hover:text-blush-300 ${loading ? 'animate-pulse' : ''}`} />
      )}
      {playing && (
        <span
          className="absolute inset-0 rounded-full"
          style={{
            border: '2px solid rgba(255,122,166,0.4)',
            animation: 'breathe 2s ease-in-out infinite',
          }}
          aria-hidden="true"
        />
      )}
    </button>
  );
}
