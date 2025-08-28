
'use client';

import { GameClient } from '@/components/game/GameClient';
import { TriviaQuestion } from '@/lib/types';
import { notFound } from 'next/navigation';
import { useI18n } from '@/hooks/use-i18n';

interface ClassicChallengePageProps {
  params: {
    data: string;
  };
}

export default function ClassicChallengePage({ params }: ClassicChallengePageProps) {
  const { t } = useI18n();
  const classicQuestions = t('classic_questions', {}, { returnObjects: true }) as TriviaQuestion[];

  try {
    const decodedData = atob(params.data);
    const parts = decodedData.split('|');
    const type = parts[0];

    // This page only handles 'classic' challenges now.
    if (type !== 'classic') {
        console.error('Invalid challenge type for this page:', type);
        notFound();
    }

    const [_, questionIndicesStr, scoreToBeatStr, wagerStr, challenger, encodedMessage] = parts;

    if (!questionIndicesStr || !scoreToBeatStr) {
        notFound();
    }
    
    const questionIndices = questionIndicesStr.split(',').map(Number);
    const scoreToBeat = parseInt(scoreToBeatStr, 10);
    const wager = wagerStr ? parseFloat(wagerStr) : 0;
    const challengeMessage = encodedMessage ? decodeURIComponent(encodedMessage) : '';
    
    const challengeQuestions: TriviaQuestion[] = questionIndices.map(index => classicQuestions[index]);

    if(challengeQuestions.some(q => q === undefined)) {
        console.error('One or more classic questions could not be found from indices.');
        notFound();
    }

    return <GameClient 
        challengeQuestions={challengeQuestions} 
        scoreToBeat={scoreToBeat} 
        wager={wager}
        challenger={challenger}
        challengeMessage={challengeMessage}
    />;

  } catch (error) {
    console.error('Failed to decode classic challenge data:', error);
    notFound();
  }
}

