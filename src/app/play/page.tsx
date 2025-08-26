
'use client';

import { useState } from 'react';
import { GameClient } from '@/components/game/GameClient';
import { AnimatePresence, motion } from 'framer-motion';

export default function PlayPage() {
  const [gameKey, setGameKey] = useState(0);

  const handleRestart = () => {
    setGameKey(prev => prev + 1);
  };

  return (
    <div className="flex justify-center items-center h-full">
      <AnimatePresence mode="wait">
        <motion.div
            key="playing"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full lg:w-4/5"
          >
            <GameClient
              key={gameKey}
              onRestart={handleRestart}
              isAiGame={false}
            />
          </motion.div>
      </AnimatePresence>
    </div>
  );
}
