
'use client';

import React, { createContext, useContext, useState, useRef, ReactNode, useCallback, useEffect } from 'react';

interface MusicContextType {
  isPlaying: boolean;
  toggleMusic: () => void;
  volume: number;
  setVolume: (volume: number) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const BackgroundMusicProvider = ({ children }: { children: ReactNode }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolumeState] = useState(0.1);
  const audioRef = useRef<HTMLAudioElement>(null);

  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  }, []);
  
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
      if (isPlaying) {
        audio.play().catch(err => {
          console.error("Audio autoplay failed:", err);
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
  }, []);

  const toggleMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;

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
  }, [volume]);
  
  return (
    <MusicContext.Provider value={{ isPlaying, toggleMusic, volume, setVolume }}>
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
