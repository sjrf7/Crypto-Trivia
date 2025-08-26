
'use client';

import { useState } from 'react';
import { GameClient } from '@/components/game/GameClient';

export default function PlayPage() {
  const [gameKey, setGameKey] = useState(0);

  const handleRestart = () => {
    setGameKey(prev => prev + 1);
  }

  return (
    <div className="flex justify-center">
      <div className="w-full lg:w-3/5">
        <GameClient 
          key={gameKey}
          onRestart={handleRestart}
        />
      </div>
    </div>
  );
}
