
'use client';

import { useState, useCallback, useEffect } from 'react';
import { GameClient } from '@/components/game/GameClient';
import { GameSetup } from '@/components/game/GameSetup';
import { TriviaQuestion } from '@/lib/types';
import { generateSingleCryptoQuestion } from '@/ai/flows/generate-crypto-trivia';
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
  const { t, language } = useI18n();

  // Store game settings to fetch next questions
  const [gameSettings, setGameSettings] = useState<{topic: string, numQuestions: number, difficulty: string} | null>(null);

  const fetchNextQuestion = useCallback(async (currentQuestions: TriviaQuestion[]) => {
    if (!gameSettings || currentQuestions.length >= gameSettings.numQuestions) {
      return;
    }
    
    try {
      const existingQuestions = currentQuestions.map(q => q.question);
      const nextQuestion = await generateSingleCryptoQuestion({
        ...gameSettings,
        language,
        exclude: existingQuestions,
      });

      if (nextQuestion) {
        setAiQuestions(prev => prev ? [...prev, nextQuestion] : [nextQuestion]);
      }
    } catch (error) {
       console.error('Failed to fetch next AI trivia question:', error);
       // Optional: Notify user that the next question failed to load
    }
  }, [gameSettings, language]);


  const handleStartAIGame = async (
    topic: string,
    numQuestions: number,
    difficulty: string
  ) => {
    setLoading(true);
    setIsGameActive(true);
    setAiQuestions(null);
    setGameSettings({ topic, numQuestions, difficulty });

    try {
      // Fetch the first question to start the game immediately
      const firstQuestion = await generateSingleCryptoQuestion({
        topic,
        difficulty,
        language,
        exclude: [],
      });
      
      if (firstQuestion) {
        setAiQuestions([firstQuestion]);
        setGameKey(prev => prev + 1);
      } else {
         toast({
          title: t('play.toast.invalid_topic.title'),
          description: t('play.toast.invalid_topic.description'),
          variant: 'destructive',
        });
        setIsGameActive(false);
      }
    } catch (error) {
      console.error('Failed to generate AI trivia:', error);
      toast({
        title: t('play.toast.error.title'),
        description: t('play.toast.error.description'),
        variant: 'destructive',
      });
      setIsGameActive(false);
    } finally {
      setLoading(false);
    }
  };
  
  const handleGameEnd = () => {
    setAiQuestions(null);
    setIsGameActive(false);
    setGameSettings(null);
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
          onNextQuestionNeeded={fetchNextQuestion}
          totalAiQuestions={gameSettings?.numQuestions}
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

