'use client';

import { useState, useEffect } from 'react';
import { TriviaQuestion } from '@/lib/types';
import { TRIVIA_QUESTIONS } from '@/lib/mock-data';

import { GameScreen } from './GameScreen';
import { SummaryScreen } from './SummaryScreen';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Bitcoin, Gamepad2 } from 'lucide-react';
import Link from 'next/link';

type GameState = 'start' | 'playing' | 'summary';

export function GameClient() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [finalScore, setFinalScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  useEffect(() => {
    // Pre-load questions when the component mounts
    setQuestions(TRIVIA_QUESTIONS);
  }, []);

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
  
  const handleStart = () => {
    setGameState('playing');
  }

  const renderGameState = () => {
    switch (gameState) {
      case 'start':
        return (
            <div className="flex justify-center items-center flex-grow">
                <Card className="w-full max-w-md shadow-2xl">
                    <CardHeader className="text-center items-center">
                        <div className="flex items-center space-x-2 mb-4">
                            <Bitcoin className="h-8 w-8 text-primary drop-shadow-glow-primary" />
                            <span className="font-bold font-headline text-2xl">
                            Crypto Trivia Showdown
                            </span>
                        </div>
                        <CardTitle className="font-headline text-3xl">Ready to Play?</CardTitle>
                        <CardDescription>
                            Test your crypto knowledge and climb the leaderboard!
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={handleStart} className="w-full" size="lg">
                            <Gamepad2 className="mr-2"/>
                            Start Game
                        </Button>
                    </CardContent>
                </Card>
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
