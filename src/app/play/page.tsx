
'use client';

import { useState } from 'react';
import { GameClient } from '@/components/game/GameClient';
import { GameSetup } from '@/components/game/GameSetup';
import { TriviaQuestion } from '@/lib/types';
import { generateCryptoTrivia } from '@/ai/flows/generate-crypto-trivia';
import { useToast } from '@/hooks/use-toast';
import { Loader } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useI18n } from '@/hooks/use-i18n';

export default function PlayPage() {
  const [aiQuestions, setAiQuestions] = useState<TriviaQuestion[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [gameKey, setGameKey] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const { toast } = useToast();
  const { t } = useI18n();

  const handleStartAIGame = async (
    topic: string,
    numQuestions: number,
    difficulty: string
  ) => {
    setLoading(true);
    setIsGameActive(true); // Game starts loading
    setAiQuestions(null);
    try {
      const result = await generateCryptoTrivia({
        topic,
        numQuestions,
        difficulty,
      });
      if (result.questions && result.questions.length > 0) {
        setAiQuestions(result.questions.map(q => ({...q, topic: topic})));
        setGameKey(prev => prev + 1);
      } else {
        toast({
          title: t('play.toast.invalid_topic.title'),
          description: t('play.toast.invalid_topic.description'),
          variant: 'destructive',
        });
        setIsGameActive(false); // Game did not start
      }
    } catch (error) {
      console.error('Failed to generate AI trivia:', error);
      toast({
        title: t('play.toast.error.title'),
        description: t('play.toast.error.description'),
        variant: 'destructive',
      });
      setIsGameActive(false); // Game did not start
    } finally {
      setLoading(false);
    }
  };

  const handleGameEnd = () => {
    setAiQuestions(null);
    setIsGameActive(false);
    setGameKey(prev => prev + 1);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <div className="lg:col-span-3">
        <GameClient 
          key={gameKey}
          challengeQuestions={aiQuestions || undefined} 
          onRestart={handleGameEnd}
          onGameStatusChange={setIsGameActive}
        />
      </div>
      <div className="lg:col-span-2">
        {loading ? (
           <Card className="h-full flex items-center justify-center">
             <div className="text-center">
               <Loader className="h-12 w-12 animate-spin mx-auto mb-4" />
               <p className="text-muted-foreground">{t('play.generating_trivia')}</p>
             </div>
           </Card>
        ) : (
          aiQuestions === null && !isGameActive && <GameSetup onStart={handleStartAIGame} loading={loading} />
        )}
      </div>
    </div>
  );
}
