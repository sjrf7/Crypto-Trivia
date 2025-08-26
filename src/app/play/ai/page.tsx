
'use client';

import { useState } from 'react';
import { GameClient } from '@/components/game/GameClient';
import { GameSetup } from '@/components/game/GameSetup';
import { TriviaQuestion } from '@/lib/types';
import { AnimatePresence } from 'framer-motion';
import { generateCryptoTrivia } from '@/ai/flows/generate-crypto-trivia';
import { AITriviaGame } from '@/lib/types/ai';

export default function AiPlayPage() {
  const [game, setGame] = useState<AITriviaGame | null>(null);
  const [gameKey, setGameKey] = useState(0);

  const handleGameStart = async (topic: string) => {
    const aiGame = await generateCryptoTrivia(topic);
    setGame(aiGame);
  };

  const handleRestart = () => {
    setGame(null);
    setGameKey(prev => prev + 1);
  };

  const formattedQuestions: TriviaQuestion[] | undefined = game?.questions.map((q, i) => ({ ...q, originalIndex: i }));

  return (
    <div className="flex justify-center items-center h-full">
      <AnimatePresence mode="wait">
        {!game ? (
          <GameSetup key="setup" onGameStart={handleGameStart} />
        ) : (
          <div className="w-full lg:w-4/5">
             <GameClient
                key={gameKey}
                challengeQuestions={formattedQuestions}
                onRestart={handleRestart}
                isAiGame={true}
                aiGameTopic={game.topic}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
