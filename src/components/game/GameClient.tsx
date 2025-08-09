'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { TriviaQuestion } from '@/lib/types';
import { getTriviaQuestions } from '@/app/actions';

import { GameScreen } from './GameScreen';
import { SummaryScreen } from './SummaryScreen';
import { Skeleton } from '@/components/ui/skeleton';

type GameState = 'loading' | 'playing' | 'summary';

export function GameClient() {
  const [gameState, setGameState] = useState<GameState>('loading');
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [finalScore, setFinalScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const startGame = async () => {
      try {
        const { questions: fetchedQuestions } = await getTriviaQuestions({ topic: 'Bitcoin', numQuestions: 5, difficulty: 'medium' });
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
        // If it fails, maybe allow restarting? For now, we'll just show the error.
        // To prevent a loop, we don't set state back to loading here.
      }
    };

    if (gameState === 'loading') {
      startGame();
    }
  }, [gameState, toast]);


  const handleGameEnd = (score: number, numAnswered: number) => {
    setFinalScore(score);
    setQuestionsAnswered(numAnswered);
    setGameState('summary');
  };

  const handleRestart = () => {
    setGameState('loading');
    setQuestions([]);
    setFinalScore(0);
    setQuestionsAnswered(0);
  };

  const renderGameState = () => {
    switch (gameState) {
      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <p className="text-2xl font-headline">Generating Trivia Questions...</p>
            <Skeleton className="w-full max-w-md h-96" />
          </div>
        );
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
