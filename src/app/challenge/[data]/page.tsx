
'use client';

import { GameClient } from '@/components/game/GameClient';
import { TRIVIA_QUESTIONS } from '@/lib/mock-data';
import { TriviaQuestion } from '@/lib/types';
import { notFound } from 'next/navigation';
import { useI18n } from '@/hooks/use-i18n';

interface ChallengePageProps {
  params: {
    data: string;
  };
}

// This page will handle duel challenges.
// The challenge data is encoded in the URL.
export default function ChallengePage({ params }: ChallengePageProps) {
  const { t } = useI18n();
  const classicQuestions = t('classic_questions', {}, { returnObjects: true }) as TriviaQuestion[];

  try {
    const decodedData = atob(params.data);
    const [questionIndicesStr, scoreToBeatStr, wagerStr, challenger] = decodedData.split('|');

    if (!questionIndicesStr || !scoreToBeatStr) {
        // Data is malformed
        notFound();
    }
    
    const questionIndices = questionIndicesStr.split(',').map(Number);
    const scoreToBeat = parseInt(scoreToBeatStr, 10);
    const wager = wagerStr ? parseFloat(wagerStr) : 0;

    const challengeQuestions: TriviaQuestion[] = questionIndices.map(index => classicQuestions[index]);
    
    return <GameClient 
                challengeQuestions={challengeQuestions} 
                scoreToBeat={scoreToBeat} 
                wager={wager}
                challenger={challenger}
            />;

  } catch (error) {
    console.error('Failed to decode challenge data:', error);
    notFound();
  }
}
