
'use client';

import { useState } from 'react';
import { GameClient } from '@/components/game/GameClient';
import { GameSetup } from '@/components/game/GameSetup';
import { TriviaQuestion } from '@/lib/types';
import { AnimatePresence } from 'framer-motion';
import { generateCryptoTrivia } from '@/ai/flows/generate-crypto-trivia';

export default function AiPlayPage() {
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [gameTopic, setGameTopic] = useState<string>('');
  const [gameKey, setGameKey] = useState(0);

  const handleGameStart = async (topic: string) => {
    const aiGame = await generateCryptoTrivia(topic);
    const formattedQuestions = aiGame.questions.map((q, i) => ({ ...q, originalIndex: i }));
    setGameTopic(aiGame.topic);
    setQuestions(formattedQuestions);
  };

  const handleRestart = () => {
    setQuestions([]);
    setGameTopic('');
    setGameKey(prev => prev + 1);
  };

  return (
    <div className="flex justify-center items-center h-full">
      <AnimatePresence mode="wait">
        {questions.length === 0 ? (
          <GameSetup key="setup" onGameStart={handleGameStart} />
        ) : (
          <div className="w-full lg:w-4/5">
             <GameClient
                key={gameKey}
                challengeQuestions={questions}
                onRestart={handleRestart}
                isAiGame={true}
                aiGameTopic={gameTopic}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

