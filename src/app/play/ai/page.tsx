
'use client';

import { useState } from 'react';
import { z } from 'zod';
import { AnimatePresence, motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

import { generateCryptoTrivia } from '@/ai/flows/generate-crypto-trivia';
import { GenerateCryptoTriviaInput } from '@/lib/types/ai';
import { TriviaQuestion } from '@/lib/types';
import { GameSetup } from '@/components/game/GameSetup';
import { GameClient } from '@/components/game/GameClient';

type AiGameState = 'setup' | 'generating' | 'playing' | 'error';

export default function AiTriviaPage() {
  const [gameState, setGameState] = useState<AiGameState>('setup');
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [gameKey, setGameKey] = useState(0);

  const handleStartGame = async (values: GenerateCryptoTriviaInput) => {
    setGameState('generating');
    setError(null);
    try {
      const result = await generateCryptoTrivia(values);
      if (result.questions && result.questions.length > 0) {
        setQuestions(result.questions);
        setGameState('playing');
        setGameKey(prev => prev + 1); // Reset GameClient
      } else {
        throw new Error("AI failed to generate questions.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unknown error occurred.');
      setGameState('error');
    }
  };

  const handleRestart = () => {
    setGameState('setup');
    setQuestions([]);
    setError(null);
  };
  
  const renderContent = () => {
    switch (gameState) {
      case 'setup':
      case 'generating':
      case 'error':
        return (
          <motion.div
            key="setup"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <GameSetup onStartGame={handleStartGame} isGenerating={gameState === 'generating'} />
            {gameState === 'error' && (
              <Alert variant="destructive" className="mt-4">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error Generating Quiz</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </motion.div>
        );
      case 'playing':
        return (
          <motion.div
            key="playing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full"
          >
            <GameClient
              key={gameKey}
              challengeQuestions={questions}
              onRestart={handleRestart}
            />
          </motion.div>
        );
    }
  };

  return (
    <div className="flex justify-center w-full">
      <Card className="w-full lg:w-4/5 p-4 sm:p-6">
        <CardContent className="p-0">
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
