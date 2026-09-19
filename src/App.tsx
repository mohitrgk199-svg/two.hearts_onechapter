import { useEffect, useState } from 'react';
import PasswordGateway from '@/components/PasswordGateway';
import OpeningScreen from '@/components/OpeningScreen';
import HeartField from '@/components/HeartField';
import Timeline from '@/components/Timeline';
import BraceletCard from '@/components/BraceletCard';
import DressCard from '@/components/DressCard';
import Quotes from '@/components/Quotes';
import LyricsCard from '@/components/LyricsCard';
import Letter from '@/components/Letter';
import NightSky from '@/components/NightSky';
import DistanceQuotes from '@/components/DistanceQuotes';
import Memories from '@/components/Memories';
import MemoriesAlbum from '@/components/MemoriesAlbum';
import FinalPage from '@/components/FinalPage';
import SecretHeart from '@/components/SecretHeart';
import MusicToggle from '@/components/MusicToggle';
import FloatingEmojis from '@/components/FloatingEmojis';

export default function App() {
  const [unlocked, setUnlocked] = useState(false);
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('no-scroll', !opened);
  }, [opened]);

  return (
    <div
      className="relative min-h-screen w-full overflow-x-hidden"
      style={{
        background:
          'linear-gradient(180deg, #1a1325 0%, #2a1a3d 20%, #3d2456 40%, #2a1a3d 70%, #1a1325 100%)',
      }}
    >
      {/* Stage 1: Password Gateway */}
      {!unlocked && <PasswordGateway onUnlock={() => setUnlocked(true)} />}

      {/* Stage 2: Opening cinematic (after password) */}
      {unlocked && !opened && <OpeningScreen onOpen={() => setOpened(true)} />}

      {/* Music toggle — visible after unlock */}
      {unlocked && <MusicToggle autoPlay={opened} />}

      {/* Continuous heart animation across the whole site */}
      {opened && <HeartField count={14} seed={77} />}

      {/* Floating romantic emojis across the full screen */}
      {opened && <FloatingEmojis count={18} />}

      {/* Main content */}
      {opened && (
        <main className="relative z-10">
          <Timeline />
          <BraceletCard />
          <DressCard />
          <Quotes />
          <LyricsCard />
          <Letter />
          <NightSky />
          <DistanceQuotes />
          <Memories />
          <MemoriesAlbum />
          <FinalPage />

          {/* Footer */}
          <footer className="relative py-12 text-center px-5">
            <div className="mx-auto max-w-md glass rounded-2xl p-6">
              <p className="font-script text-xl text-blush-300 mb-2">
                Made with love, for Angel
              </p>
              <p className="font-serif text-sm text-white/40 italic">
                16 August 2025 — forever
              </p>
              <div className="mt-4 flex justify-center gap-2">
                <span className="text-blush-400" style={{ animation: 'breathe 2s ease-in-out infinite' }}>♡</span>
                <span className="text-blush-400" style={{ animation: 'breathe 2s ease-in-out 0.5s infinite' }}>♥</span>
                <span className="text-blush-400" style={{ animation: 'breathe 2s ease-in-out 1s infinite' }}>♡</span>
              </div>
            </div>
          </footer>
        </main>
      )}

      {/* Secret heart — always available once opened */}
      {opened && <SecretHeart />}
    </div>
  );
}
