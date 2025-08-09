'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { TriviaQuestion } from '@/lib/types';
import { getTriviaQuestions } from '@/app/actions';

import { StartScreen } from './StartScreen';
import { GameScreen } from './GameScreen';
import { SummaryScreen } from './SummaryScreen';

type GameState = 'start' | 'playing' | 'summary';

export function GameClient() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const { toast } = useToast();

  const handleStart = async (topic: string, numQuestions: number, difficulty: string) => {
    setLoading(true);
    try {
      const { questions: fetchedQuestions } = await getTriviaQuestions({ topic, numQuestions, difficulty });
      if (fetchedQuestions.length === 0) {
        throw new Error('No questions were generated.');
      }
      setQuestions(fetchedQuestions);
      setGameState('playing');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
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
    setQuestions([]);
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
