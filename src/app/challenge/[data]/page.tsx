
'use client';

import { GameClient } from '@/components/game/GameClient';
import { AITriviaGame } from '@/lib/types/ai';
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
    const type = decodedData.substring(0, decodedData.indexOf('|'));
    const restOfData = decodedData.substring(decodedData.indexOf('|') + 1);

    if (type === 'classic') {
        const parts = restOfData.split('|');
        const [questionIndicesStr, scoreToBeatStr, wagerStr, challenger] = parts;

        if (!questionIndicesStr || !scoreToBeatStr) {
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
    } else if (type === 'ai') {
        // For AI challenges, the structure is ai|{gameJson}|{score}|{wager}|{challenger}
        // We need to parse this carefully as the JSON can contain '|'
        const scoreToBeatIndex = restOfData.lastIndexOf('|');
        const wagerIndex = restOfData.lastIndexOf('|', scoreToBeatIndex - 1);
        const challengerIndex = restOfData.lastIndexOf('|', wagerIndex - 1);

        const gameJson = restOfData.substring(0, challengerIndex);
        const scoreToBeatStr = restOfData.substring(challengerIndex + 1, wagerIndex);
        const wagerStr = restOfData.substring(wagerIndex + 1, scoreToBeatIndex);
        const challenger = restOfData.substring(scoreToBeatIndex + 1);

        if (!gameJson || !scoreToBeatStr) {
            notFound();
        }
        
        const gameData = JSON.parse(gameJson) as AITriviaGame;
        
        if (!gameData) {
            console.error(`AI Challenge data could not be parsed.`);
            notFound();
        }

        const scoreToBeat = parseInt(scoreToBeatStr, 10);
        const wager = wagerStr ? parseFloat(wagerStr) : 0;

        return <GameClient 
            challengeQuestions={gameData.questions} 
            scoreToBeat={scoreToBeat} 
            wager={wager}
            challenger={challenger}
            isAiGame={true}
            aiGameTopic={gameData.topic}
        />;
    } else {
       // Fallback for old format without type (pre-AI challenges)
        const parts = decodedData.split('|');
        const [questionIndicesStr, scoreToBeatStr, wagerStr, challenger] = parts;
        if (!questionIndicesStr || !scoreToBeatStr) {
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
    }

  } catch (error) {
    console.error('Failed to decode challenge data:', error);
    notFound();
  }
}
