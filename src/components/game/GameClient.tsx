'use client';

import { useState } from 'react';
import { TriviaQuestion } from '@/lib/types';
import { generateCryptoTrivia, GenerateCryptoTriviaOutput } from '@/ai/flows/generate-crypto-trivia';
import { useToast } from '@/hooks/use-toast';

import { GameScreen } from './GameScreen';
import { SummaryScreen } from './SummaryScreen';
import { GameSetup } from './GameSetup';
import { Card, CardContent } from '@/components/ui/card';
import { Wand2 } from 'lucide-react';

type GameStatus = 'setup' | 'playing' | 'summary';

export function GameClient() {
  const [gameStatus, setGameStatus] = useState<GameStatus>('setup');
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [finalScore, setFinalScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleStart = async (topic: string, numQuestions: number, difficulty: string) => {
    setLoading(true);
    setGameStatus('setup'); // Stay on setup view while loading
    try {
      const response: GenerateCryptoTriviaOutput = await generateCryptoTrivia({ topic, numQuestions, difficulty });
      if (response.questions && response.questions.length > 0) {
        setQuestions(response.questions);
        setGameStatus('playing');
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
            <p className="text-muted-foreground max-w-md">
              Configure your game on the left panel and click &quot;Start Game&quot; to begin.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-8 h-full">
      <div className="md:col-span-1">
        <GameSetup onStart={handleStart} loading={loading} />
      </div>
      <div className="md:col-span-2">
        <Card className="h-full">
          <CardContent className="h-full flex flex-col justify-center">
            {renderGameContent()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
