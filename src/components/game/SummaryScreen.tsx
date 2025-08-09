'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, RotateCw, BarChart2 } from 'lucide-react';
import Link from 'next/link';

interface SummaryScreenProps {
  score: number;
  questionsAnswered: number;
  onRestart: () => void;
}

export function SummaryScreen({ score, questionsAnswered, onRestart }: SummaryScreenProps) {
  return (
    <div className="flex justify-center items-center h-full">
      <Card className="w-full max-w-md text-center shadow-2xl">
        <CardHeader>
          <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
             <Award className="h-10 w-10 text-primary drop-shadow-glow-primary" />
          </div>
          <CardTitle className="font-headline text-4xl">Game Over!</CardTitle>
          <CardDescription>Here's how you did.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="text-6xl font-bold text-primary">{score}</div>
            <p className="text-muted-foreground">Final Score</p>
            <p className="text-lg">
                You answered <span className="font-bold text-accent">{questionsAnswered}</span> questions.
            </p>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button onClick={onRestart} variant="outline">
            <RotateCw className="mr-2 h-4 w-4" />
            Play Again
          </Button>
          <Button asChild>
            <Link href="/leaderboard">
                <BarChart2 className="mr-2 h-4 w-4" />
                View Leaderboard
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
