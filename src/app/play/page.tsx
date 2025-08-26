
'use client';

import { useState } from 'react';
import { GameClient } from '@/components/game/GameClient';
import { GameSetup } from '@/components/game/GameSetup';
import { generateCryptoTrivia } from '@/ai/flows/generate-crypto-trivia';
import { TriviaQuestion } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { AnimatePresence, motion } from 'framer-motion';

type GameMode = 'welcome' | 'ai-setup' | 'playing';

const GenerateCryptoTriviaInputSchema = z.object({
  topic: z.string(),
  numQuestions: z.number(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
});

export default function PlayPage() {
  const [gameKey, setGameKey] = useState(0);
  const [gameMode, setGameMode] = useState<GameMode>('welcome');
  const [isAiGame, setIsAiGame] = useState(false);
  const [aiQuestions, setAiQuestions] = useState<TriviaQuestion[]>([]);
  const [aiTopic, setAiTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleStartAIGame = async (values: z.infer<typeof GenerateCryptoTriviaInputSchema>) => {
    setIsGenerating(true);
    try {
      const result = await generateCryptoTrivia(values);
      const generatedQuestions = result.questions;

      if (!generatedQuestions || generatedQuestions.length === 0) {
        throw new Error('No questions were generated.');
      }
      
      // Notify user if fewer questions were generated than requested
      if (generatedQuestions.length < values.numQuestions) {
        toast({
            variant: "default",
            title: "Generated Fewer Questions",
            description: `The AI generated ${generatedQuestions.length} out of ${values.numQuestions} questions. Starting game with what we have!`,
        });
      }

      setAiQuestions(generatedQuestions);
      setAiTopic(values.topic);
      setIsAiGame(true);
      setGameMode('playing');
    } catch (error: any) {
      console.error('Failed to generate AI trivia:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to generate AI trivia',
        description: error.message || 'The AI model could not generate valid questions for the given topic. Please try a different one.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRestart = () => {
    setGameKey(prev => prev + 1);
    setGameMode('welcome');
    setIsAiGame(false);
    setAiQuestions([]);
    setAiTopic('');
  };

  const renderContent = () => {
    switch (gameMode) {
      case 'ai-setup':
        return (
          <motion.div
            key="ai-setup"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
          >
            <GameSetup onStartGame={handleStartAIGame} isGenerating={isGenerating} />
          </motion.div>
        );
      case 'playing':
        return (
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
              isAiGame={isAiGame}
              aiQuestions={aiQuestions}
              aiTopic={aiTopic}
            />
          </motion.div>
        );
      case 'welcome':
      default:
        return (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="w-full lg:w-4/5"
          >
            <GameClient
              key={gameKey}
              onRestart={handleRestart}
              onStartAiMode={() => setGameMode('ai-setup')}
            />
          </motion.div>
        );
    }
  };

  return (
    <div className="flex justify-center">
      <AnimatePresence mode="wait">
        {renderContent()}
      </AnimatePresence>
    </div>
  );
}
