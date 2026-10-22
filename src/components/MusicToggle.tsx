import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

type MusicToggleProps = {
  autoPlay: boolean;
};

// Spotify track: "Pal" by Arijit Singh & Shreya Ghoshal
const SPOTIFY_TRACK_ID = '5G7pZ8G8NFvS1MQ9H4L7dC';
const SPOTIFY_EMBED_URL = `https://open.spotify.com/embed/track/${SPOTIFY_TRACK_ID}?utm_source=generator&theme=0`;
const VOLUME = 0.32; // 32% — soft romantic level

// Fallback instrumental audio sources (CORS-friendly), used if Spotify unavailable
const FALLBACK_SOURCES = [
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
];

export default function MusicToggle({ autoPlay }: MusicToggleProps) {
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const controllerRef = useRef<{ play: () => void; pause: () => void; setVolume: (v: number) => void } | null>(null);
  const fallbackRef = useRef<HTMLAudioElement | null>(null);
  const fallbackIdxRef = useRef(0);
  const playingRef = useRef(false);

  // Load Spotify Embed API and create controller for the iframe
  useEffect(() => {
    const handleApiReady = (IFrameAPI: {
      createController: (
        el: HTMLIFrameElement,
        opts: Record<string, unknown>,
        cb: (ctrl: { play: () => void; pause: () => void; setVolume: (v: number) => void }) => void
      ) => void;
    }) => {
      // Store globally so re-mounts can reuse it
      (window as unknown as Record<string, unknown>).__spotifyIframeAPI = IFrameAPI;
      if (iframeRef.current && !controllerRef.current) {
        IFrameAPI.createController(iframeRef.current, {}, (ctrl) => {
          controllerRef.current = ctrl;
          ctrl.setVolume(VOLUME);
        });
      }
    };

    const stored = (window as unknown as Record<string, unknown>).__spotifyIframeAPI;
    if (stored) {
      handleApiReady(stored as Parameters<typeof handleApiReady>[0]);
    } else {
      (window as unknown as Record<string, unknown>).onSpotifyIframeApiReady = handleApiReady;
      const existing = document.querySelector('script[src*="spotify.com/embed/iframe-api"]');
      if (!existing) {
        const script = document.createElement('script');
        script.src = 'https://open.spotify.com/embed/iframe-api/v1';
        script.async = true;
        document.body.appendChild(script);
      }
    }

    return () => {
      if ((window as unknown as Record<string, unknown>).onSpotifyIframeApiReady === handleApiReady) {
        delete (window as unknown as Record<string, unknown>).onSpotifyIframeApiReady;
      }
    };
  }, []);

  // Initialize fallback audio element
  useEffect(() => {
    const audio = new Audio();
    audio.src = FALLBACK_SOURCES[0];
    audio.loop = true;
    audio.volume = VOLUME;
    audio.preload = 'auto';
    fallbackRef.current = audio;

    const handleError = () => {
      const next = fallbackIdxRef.current + 1;
      if (next < FALLBACK_SOURCES.length) {
        fallbackIdxRef.current = next;
        audio.src = FALLBACK_SOURCES[next];
        audio.load();
        if (playingRef.current) audio.play().catch(() => {});
      }
    };
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('error', handleError);
      audio.pause();
      audio.src = '';
      fallbackRef.current = null;
    };
  }, []);

  const startMusic = async () => {
    setLoading(true);
    let usedFallback = false;

    if (controllerRef.current) {
      try {
        controllerRef.current.setVolume(VOLUME);
        controllerRef.current.play();
        playingRef.current = true;
        setStarted(true);
        setPlaying(true);
      } catch {
        usedFallback = true;
      }
    } else {
      usedFallback = true;
    }

    if (usedFallback) {
      try {
        const audio = fallbackRef.current;
        if (audio) {
          audio.volume = VOLUME;
          await audio.play();
          playingRef.current = true;
          setStarted(true);
          setPlaying(true);
        }
      } catch {
        playingRef.current = false;
        setPlaying(false);
      }
    }

    setLoading(false);
  };

  const stopMusic = () => {
    if (controllerRef.current) {
      try {
        controllerRef.current.pause();
      } catch {
        // ignore
      }
    }
    fallbackRef.current?.pause();
    playingRef.current = false;
    setPlaying(false);
  };

  // Auto-play when unlocked
  useEffect(() => {
    if (autoPlay && !started) {
      const timer = setTimeout(() => startMusic(), 800);
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
    <>
      {/* Spotify embed iframe — kept in DOM but visually hidden */}
      <iframe
        ref={iframeRef}
        src={SPOTIFY_EMBED_URL}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        style={{ position: 'absolute', width: '1px', height: '1px', opacity: 0, pointerEvents: 'none', border: 'none', top: '0', left: '0' }}
        title="Spotify Player"
      />

      {/* Floating toggle button */}
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
    </>
  );
}
