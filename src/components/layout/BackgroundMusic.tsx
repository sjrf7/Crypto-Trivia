
'use client';

import React, { createContext, useContext, useState, useRef, ReactNode, useCallback } from 'react';

interface MusicContextType {
  isPlaying: boolean;
  toggleMusic: () => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const BackgroundMusicProvider = ({ children }: { children: ReactNode }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // The logic is simplified to directly control play/pause and state,
  // avoiding complex useEffects and event listeners that were causing sync issues.
  const toggleMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play().catch(e => console.error("Error playing audio:", e));
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, []);
  
  return (
    <MusicContext.Provider value={{ isPlaying, toggleMusic }}>
      {/* The audio element is preloaded and ready to be played on user interaction. */}
      <audio ref={audioRef} src="/sounds/background-music.mp3" loop preload="auto" />
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a BackgroundMusicProvider');
  }
  return context;
};
