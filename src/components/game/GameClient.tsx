
'use client';

import { useEffect, useState } from 'react';
import { TriviaQuestion } from '@/lib/types';

import { GameScreen } from './GameScreen';
import { SummaryScreen } from './SummaryScreen';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wand2, Swords } from 'lucide-react';
import { TRIVIA_QUESTIONS } from '@/lib/mock-data';

type GameStatus = 'setup' | 'playing' | 'summary';

interface GameClientProps {
    challengeQuestions?: TriviaQuestion[];
    scoreToBeat?: number;
}

export function GameClient({ challengeQuestions, scoreToBeat }: GameClientProps) {
  const [gameStatus, setGameStatus] = useState<GameStatus>('setup');
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [finalScore, setFinalScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [isChallenge, setIsChallenge] = useState(false);

  useEffect(() => {
    if (challengeQuestions && typeof scoreToBeat !== 'undefined') {
        setIsChallenge(true);
        setQuestions(challengeQuestions);
        setGameStatus('playing');
    }
  }, [challengeQuestions, scoreToBeat])

  const handleStart = () => {
    // We need to pass the indices to the summary screen to generate a challenge link.
    const questionIndices = [...Array(TRIVIA_QUESTIONS.length).keys()].sort(() => Math.random() - 0.5).slice(0, 5);
    const selectedQuestions = questionIndices.map(i => ({...TRIVIA_QUESTIONS[i], originalIndex: i}));
    setQuestions(selectedQuestions);
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
    setIsChallenge(false);
  };
  
  const renderWelcomeScreen = () => (
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

  const renderGameContent = () => {
    switch (gameStatus) {
      case 'playing':
        return <GameScreen questions={questions} onGameEnd={handleGameEnd} scoreToBeat={scoreToBeat} isChallenge={isChallenge} />;
      case 'summary':
        return <SummaryScreen score={finalScore} questionsAnswered={questionsAnswered} onRestart={handleRestart} questions={questions} />;
      case 'setup':
      default:
        return renderWelcomeScreen();
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
