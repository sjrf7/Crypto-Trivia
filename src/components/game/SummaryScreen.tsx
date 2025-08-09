
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, RotateCw, BarChart2, Share2, ClipboardCheck } from 'lucide-react';
import Link from 'next/link';
import { TriviaQuestion } from '@/lib/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from '../ui/input';
import { useToast } from '@/hooks/use-toast';
import { useProfile } from '@farcaster/auth-kit';
import { Label } from '../ui/label';

interface SummaryScreenProps {
  score: number;
  questionsAnswered: number;
  onRestart: () => void;
  questions: TriviaQuestion[];
}

export function SummaryScreen({ score, questionsAnswered, onRestart, questions }: SummaryScreenProps) {
    const { toast } = useToast();
    const [challengeUrl, setChallengeUrl] = useState('');
    const [wager, setWager] = useState('');
    const { profile } = useProfile();

    const generateChallenge = () => {
        const challenger = profile?.data?.displayName ?? 'A friend';
        const questionIndices = questions.map(q => q.originalIndex).join(',');
        const data = `${questionIndices}|${score}|${wager}|${challenger}`;
        const encodedData = btoa(data); 
        const url = `${window.location.origin}/challenge/${encodedData}`;
        setChallengeUrl(url);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(challengeUrl);
        toast({
            title: "Copied to clipboard!",
            description: "Challenge link is ready to be shared.",
        });
    }

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
        <CardFooter className="flex-col gap-4">
            <div className="flex justify-center gap-4">
                <Button onClick={onRestart} variant="outline">
                    <RotateCw className="mr-2 h-4 w-4" />
                    Play Again
                </Button>
                <Button asChild>
                    <Link href="/leaderboard">
                        <BarChart2 className="mr-2 h-4 w-4" />
                        Leaderboard
                    </Link>
                </Button>
            </div>
            <AlertDialog onOpenChange={(open) => {
                // Generate link when dialog opens
                if (open) generateChallenge();
            }}>
              <AlertDialogTrigger asChild>
                <Button variant="secondary" className="w-full">
                    <Share2 className="mr-2 h-4 w-4" />
                    Challenge a Friend
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Share Your Challenge</AlertDialogTitle>
                  <AlertDialogDescription>
                    Send this link to a friend. They will play with the same questions and try to beat your score! Add an optional wager for fun.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="wager">Wager (ETH on Base Sepolia)</Label>
                        <Input 
                            id="wager"
                            type="number"
                            placeholder="e.g., 0.01"
                            value={wager}
                            onChange={(e) => {
                                setWager(e.target.value);
                                // Regenerate link on wager change
                                setTimeout(generateChallenge, 100);
                            }}
                        />
                    </div>
                    <div className="space-y-2">
                         <Label>Challenge Link</Label>
                        <div className="flex items-center space-x-2">
                            <Input value={challengeUrl} readOnly />
                            <Button onClick={copyToClipboard} size="icon">
                                <ClipboardCheck className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Close</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
        </CardFooter>
      </Card>
    </div>
  );
}
