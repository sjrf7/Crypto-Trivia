
'use client';

import React, { createContext, useContext, useState, useRef, ReactNode, useCallback, useEffect } from 'react';

interface MusicContextType {
  isPlaying: boolean;
  toggleMusic: () => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const BackgroundMusicProvider = ({ children }: { children: ReactNode }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.1;
      if (isPlaying) {
        audio.play().catch(err => {
          console.error("Audio autoplay failed:", err);
          // If autoplay fails, we set isPlaying to false so the UI is correct.
          setIsPlaying(false);
        });
      }
    }
    
    const handleFirstUserInteraction = () => {
        if (audio && audio.paused && isPlaying) {
            audio.play().catch(console.error);
        }
        window.removeEventListener('click', handleFirstUserInteraction);
        window.removeEventListener('keydown', handleFirstUserInteraction);
    };

    window.addEventListener('click', handleFirstUserInteraction);
    window.addEventListener('keydown', handleFirstUserInteraction);

    return () => {
        window.removeEventListener('click', handleFirstUserInteraction);
        window.removeEventListener('keydown', handleFirstUserInteraction);
    };

  }, [isPlaying]);

  const toggleMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.1;

    if (audio.paused) {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error("Failed to play audio:", err);
        setIsPlaying(false);
      });
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, []);
  
  return (
    <MusicContext.Provider value={{ isPlaying, toggleMusic }}>
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
