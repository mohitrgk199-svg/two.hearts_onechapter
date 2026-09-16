import { useEffect, useRef, useState } from 'react';
import { Play, Pause, Music } from 'lucide-react';

type MusicToggleProps = {
  autoPlay: boolean;
};

// Soft romantic melody generated with Web Audio API — no external file needed
export default function MusicToggle({ autoPlay }: MusicToggleProps) {
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const noteIndexRef = useRef(0);

  // A gentle, looping romantic melody in A minor / C major
  // Format: [frequency, duration in beats]
  const MELODY: [number, number][] = [
    [440.0, 1], [523.25, 1], [659.25, 2],
    [587.33, 1], [523.25, 1], [440.0, 2],
    [392.0, 1], [440.0, 1], [523.25, 2],
    [659.25, 1], [587.33, 1], [523.25, 2],
    [440.0, 1], [523.25, 1], [659.25, 1], [880.0, 1],
    [783.99, 2], [659.25, 2],
    [523.25, 1], [587.33, 1], [659.25, 2],
    [523.25, 1], [440.0, 1], [392.0, 2],
  ];

  const BPM = 70;
  const beatDuration = 60 / BPM;

  function playNote(ctx: AudioContext, destination: GainNode, freq: number, startTime: number, duration: number) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.value = freq;

    // Soft attack and release envelope
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.15, startTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration * 0.9);

    // Add a soft second harmonic for warmth
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.value = freq * 2;
    gain2.gain.setValueAtTime(0, startTime);
    gain2.gain.linearRampToValueAtTime(0.04, startTime + 0.05);
    gain2.gain.exponentialRampToValueAtTime(0.001, startTime + duration * 0.8);

    osc.connect(gain).connect(destination);
    osc2.connect(gain2).connect(destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
    osc2.start(startTime);
    osc2.stop(startTime + duration);
  }

  function startMusic() {
    const ctx = audioCtxRef.current;
    const master = masterGainRef.current;
    if (!ctx || !master) return;

    if (ctx.state === 'suspended') ctx.resume();

    setStarted(true);
    setPlaying(true);
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(0, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.8, ctx.currentTime + 2);

    const playNext = () => {
      const note = MELODY[noteIndexRef.current % MELODY.length];
      const dur = note[1] * beatDuration;
      playNote(ctx, master, note[0], ctx.currentTime, dur);
      noteIndexRef.current++;
    };

    playNext();
    intervalRef.current = setInterval(playNext, beatDuration * 1000);
  }

  function stopMusic() {
    const ctx = audioCtxRef.current;
    const master = masterGainRef.current;
    if (ctx && master) {
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setPlaying(false);
  }

  // Initialize AudioContext on mount
  useEffect(() => {
    const ctx = new AudioContext();
    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    audioCtxRef.current = ctx;
    masterGainRef.current = master;

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      ctx.close();
    };
  }, []);

  // Auto-play when unlocked
  useEffect(() => {
    if (autoPlay && !started) {
      // Browsers require user interaction for audio — small delay then attempt
      const timer = setTimeout(() => startMusic(), 500);
      return () => clearTimeout(timer);
    }
  }, [autoPlay, started]);

  const toggle = () => {
    if (playing) {
      stopMusic();
    } else {
      startMusic();
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label={playing ? 'Pause music' : 'Play music'}
      className="group fixed top-5 right-5 z-30 flex h-12 w-12 items-center justify-center rounded-full transition-all duration-500 hover:scale-110"
      style={{
        background: 'rgba(255,122,166,0.12)',
        border: '1px solid rgba(255,169,192,0.25)',
        backdropFilter: 'blur(12px)',
        boxShadow: playing ? '0 0 20px rgba(255,122,166,0.3)' : 'none',
      }}
    >
      {playing ? (
        <Pause className="h-5 w-5 text-blush-300 transition-all" />
      ) : (
        <Music className="h-5 w-5 text-blush-300/70 transition-all group-hover:text-blush-300" />
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
