'use client';

import { useState } from 'react';
import { TriviaQuestion } from '@/lib/types';
import { generateCryptoTrivia, GenerateCryptoTriviaOutput } from '@/ai/flows/generate-crypto-trivia';
import { useToast } from '@/hooks/use-toast';

import { GameScreen } from './GameScreen';
import { SummaryScreen } from './SummaryScreen';
import { StartScreen } from './StartScreen';

type GameState = 'start' | 'playing' | 'summary';

export function GameClient() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [finalScore, setFinalScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleStart = async (topic: string, numQuestions: number, difficulty: string) => {
    setLoading(true);
    try {
      const response: GenerateCryptoTriviaOutput = await generateCryptoTrivia({ topic, numQuestions, difficulty });
      if (response.questions && response.questions.length > 0) {
        setQuestions(response.questions);
        setGameState('playing');
      } else {
        throw new Error('No questions were generated.');
      }
    } catch (error) {
      console.error('Failed to generate trivia questions:', error);
      toast({
        title: 'Error',
        description: 'Could not generate trivia questions. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGameEnd = (score: number, numAnswered: number) => {
    setFinalScore(score);
    setQuestionsAnswered(numAnswered);
    setGameState('summary');
  };

  const handleRestart = () => {
    setGameState('start');
    setFinalScore(0);
    setQuestionsAnswered(0);
  };

  const renderGameState = () => {
    switch (gameState) {
      case 'start':
        return <StartScreen onStart={handleStart} loading={loading} />;
      case 'playing':
        return <GameScreen questions={questions} onGameEnd={handleGameEnd} />;
      case 'summary':
        return <SummaryScreen score={finalScore} questionsAnswered={questionsAnswered} onRestart={handleRestart} />;
      default:
        return null;
    }
  };

  return <div className="w-full flex-grow flex flex-col">{renderGameState()}</div>;
}
