
'use client';

import { GameClient } from '@/components/game/GameClient';
import { TRIVIA_QUESTIONS } from '@/lib/mock-data';
import { TriviaQuestion } from '@/lib/types';
import { notFound } from 'next/navigation';

interface ChallengePageProps {
  params: {
    data: string;
  };
}

// This page will handle duel challenges.
// The challenge data is encoded in the URL.
export default function ChallengePage({ params }: ChallengePageProps) {
  try {
    const decodedData = atob(params.data);
    const [questionIndicesStr, scoreToBeatStr] = decodedData.split('|');

    if (!questionIndicesStr || !scoreToBeatStr) {
        // Data is malformed
        notFound();
    }
    
    const questionIndices = questionIndicesStr.split(',').map(Number);
    const scoreToBeat = parseInt(scoreToBeatStr, 10);

    const challengeQuestions: TriviaQuestion[] = questionIndices.map(index => TRIVIA_QUESTIONS[index]);
    
    return <GameClient challengeQuestions={challengeQuestions} scoreToBeat={scoreToBeat} />;

  } catch (error) {
    console.error('Failed to decode challenge data:', error);
    notFound();
  }
}
