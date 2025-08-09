
'use client';

import { useState } from 'react';
import { GameClient } from '@/components/game/GameClient';
import { GameSetup } from '@/components/game/GameSetup';
import { TriviaQuestion } from '@/lib/types';
import { generateCryptoTrivia } from '@/ai/flows/generate-crypto-trivia';
import { useToast } from '@/hooks/use-toast';
import { Loader } from 'lucide-react';

export default function Home() {
  const [aiQuestions, setAiQuestions] = useState<TriviaQuestion[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [gameKey, setGameKey] = useState(0); // Add a key to force re-mount
  const { toast } = useToast();

  const handleStartAIGame = async (
    topic: string,
    numQuestions: number,
    difficulty: string
  ) => {
    setLoading(true);
    setAiQuestions(null);
    try {
      const result = await generateCryptoTrivia({
        topic,
        numQuestions,
        difficulty,
      });
      if (result.questions && result.questions.length > 0) {
        // Add originalIndex to each question for challenge mode link generation
        const questionsWithIndex = result.questions.map((q, i) => ({ ...q, originalIndex: i }));
        setAiQuestions(questionsWithIndex);
        setGameKey(prev => prev + 1); // Increment key to re-mount GameClient
      } else {
        toast({
          title: 'Error',
          description: 'La IA no pudo generar preguntas. Por favor, intenta de nuevo.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Failed to generate AI trivia:', error);
      toast({
        title: 'Error',
        description: 'Hubo un problema al generar las preguntas. Por favor, intenta de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGameEnd = () => {
    setAiQuestions(null);
    setGameKey(prev => prev + 1); // Reset for a new game
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <div className="lg:col-span-3">
        <GameClient 
          key={gameKey} // Use key to force re-render
          challengeQuestions={aiQuestions || undefined} 
          onRestart={handleGameEnd}
        />
      </div>
      <div className="lg:col-span-2">
        {loading ? (
           <Card className="h-full flex items-center justify-center">
             <div className="text-center">
               <Loader className="h-12 w-12 animate-spin mx-auto mb-4" />
               <p className="text-muted-foreground">Generando tu trivia...</p>
             </div>
           </Card>
        ) : (
          <GameSetup onStart={handleStartAIGame} loading={loading} />
        )}
      </div>
    </div>
  );
}

// Add a simple Card component for the loading state, as it might not be available
// in this scope otherwise.
const Card = ({ className, children }: { className?: string, children: React.ReactNode }) => (
    <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}>
        {children}
    </div>
);
