'use client';

import { useState } from 'react';
import { TriviaQuestion } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

import { GameScreen } from './GameScreen';
import { SummaryScreen } from './SummaryScreen';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wand2 } from 'lucide-react';
import { TRIVIA_QUESTIONS } from '@/lib/mock-data';

type GameStatus = 'setup' | 'playing' | 'summary';

export function GameClient() {
  const [gameStatus, setGameStatus] = useState<GameStatus>('setup');
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [finalScore, setFinalScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  const handleStart = () => {
    setQuestions(TRIVIA_QUESTIONS);
    setGameStatus('playing');
  };

  const handleGameEnd = (score: number, numAnswered: number) => {
    setFinalScore(score);
    setQuestionsAnswered(numAnswered);
    setGameStatus('summary');
  };

  const handleRestart = () => {
    setGameStatus('setup');
    setFinalScore(0);
    setQuestionsAnswered(0);
  };

  const renderGameContent = () => {
    switch (gameStatus) {
      case 'playing':
        return <GameScreen questions={questions} onGameEnd={handleGameEnd} />;
      case 'summary':
        return <SummaryScreen score={finalScore} questionsAnswered={questionsAnswered} onRestart={handleRestart} />;
      case 'setup':
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
              <Wand2 className="h-12 w-12 text-primary drop-shadow-glow-primary" />
            </div>
            <h2 className="text-3xl font-headline mb-2">Crypto Trivia Showdown</h2>
            <p className="text-muted-foreground max-w-md mb-6">
              Test your crypto knowledge with our classic trivia questions.
            </p>
            <Button onClick={handleStart} size="lg">Start Game</Button>
          </div>
        );
    }
  };

  return (
    <Card className="h-full">
      <CardContent className="h-full flex flex-col justify-center">
        {renderGameContent()}
      </CardContent>
    </Card>
  );
}
