'use client';

import { GameClient } from '@/components/game/GameClient';
import { AITriviaGame } from '@/lib/types/ai';
import { TriviaQuestion } from '@/lib/types';
import { notFound } from 'next/navigation';
import { useI18n } from '@/hooks/use-i18n';
import pako from 'pako';
import { Buffer } from 'buffer';

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
    const parts = decodedData.split('|');
    const type = parts[0];

    if (type === 'classic') {
        const [_, questionIndicesStr, scoreToBeatStr, wagerStr, challenger] = parts;

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
        // For AI challenges, the structure is ai|{compressedGameData}|{score}|{wager}|{challenger}
        const [_, compressedGameData, scoreToBeatStr, wagerStr, challenger] = parts;

        if (!compressedGameData || !scoreToBeatStr) {
            notFound();
        }

        const compressedBuffer = Buffer.from(compressedGameData, 'base64');
        const decompressed = pako.inflate(compressedBuffer, { to: 'string' });
        const gameData = JSON.parse(decompressed) as AITriviaGame;
        
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
        console.error('Invalid challenge type or old format');
        notFound();
    }

  } catch (error) {
    console.error('Failed to decode challenge data:', error);
    notFound();
  }
}
