
'use client';

import { useEffect, useState } from 'react';
import { TriviaQuestion } from '@/lib/types';
import { AnimatePresence, motion } from 'framer-motion';

import { GameScreen } from './GameScreen';
import { SummaryScreen } from './SummaryScreen';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wand2 } from 'lucide-react';
import { useI18n } from '@/hooks/use-i18n';
import { WagerCard } from './WagerCard';

type GameStatus = 'setup' | 'wager' | 'playing' | 'summary';

interface GameClientProps {
    challengeQuestions?: TriviaQuestion[];
    scoreToBeat?: number;
    wager?: number;
    challenger?: string;
    onRestart?: () => void;
    onGameStatusChange?: (isActive: boolean) => void;
}

const screenVariants = {
  initial: { opacity: 0, scale: 0.95 },
  in: { opacity: 1, scale: 1 },
  out: { opacity: 0, scale: 0.95 },
};

const screenTransition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
};

export function GameClient({ 
    challengeQuestions, 
    scoreToBeat, 
    wager, 
    challenger, 
    onRestart, 
    onGameStatusChange,
}: GameClientProps) {
  const [gameStatus, setGameStatus] = useState<GameStatus>('setup');
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [finalScore, setFinalScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [isChallenge, setIsChallenge] = useState(false);
  const [isAiGame, setIsAiGame] = useState(false);
  const { t } = useI18n();

  const classicQuestions = t('classic_questions', undefined, { returnObjects: true }) as TriviaQuestion[];

  useEffect(() => {
    if (challengeQuestions) {
        onGameStatusChange?.(true);
        if (challengeQuestions.length > 0) {
            setIsChallenge(!!scoreToBeat);
            setIsAiGame(!scoreToBeat); // It's an AI game if there's no score to beat
            setQuestions(challengeQuestions.map((q, i) => ({...q, originalIndex: q.originalIndex ?? i})));
             if (wager && wager > 0 && challenger) {
                setGameStatus('wager');
            } else {
                setGameStatus('playing');
            }
        }
    }
  }, [challengeQuestions, scoreToBeat, wager, challenger, onGameStatusChange])

  const handleStartClassic = () => {
    onGameStatusChange?.(true);
    const shuffled = [...classicQuestions]
      .map((q, i) => ({ ...q, originalIndex: i }))
      .sort(() => 0.5 - Math.random());
    
    const selectedQuestions = shuffled.slice(0, 20);

    setQuestions(selectedQuestions);
    setGameStatus('playing');
    setIsAiGame(false);
    setIsChallenge(false);
  };

  const handleGameEnd = (score: number, numAnswered: number) => {
    setFinalScore(score);
    setQuestionsAnswered(numAnswered);
    setGameStatus('summary');
  };

  const handleRestart = () => {
    onGameStatusChange?.(false);
    if (onRestart) {
        onRestart();
    } else {
        setGameStatus('setup');
        setFinalScore(0);
        setQuestionsAnswered(0);
        setIsChallenge(false);
        setIsAiGame(false);
        setQuestions([]);
    }
  };
  
  const handleWagerAccept = () => {
    console.log('Wager accepted. Starting game.');
    setGameStatus('playing');
  }

  const renderWelcomeScreen = () => (
    <motion.div 
      className="flex flex-col items-center justify-center h-full text-center"
      key="welcome"
      variants={screenVariants}
      initial="initial"
      animate="in"
      exit="out"
      transition={screenTransition}
    >
        <motion.div 
          className="mx-auto bg-primary/10 p-4 rounded-full mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 10 }}
        >
          <Wand2 className="h-12 w-12 text-primary drop-shadow-glow-primary" />
        </motion.div>
        <motion.h2 
          className="text-3xl font-headline mb-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {t('game.client.title')}
        </motion.h2>
        <motion.p 
          className="text-muted-foreground max-w-md mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {t('game.client.description')}
        </motion.p>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button onClick={handleStartClassic} size="lg">{t('game.client.start_classic_button')}</Button>
        </motion.div>
    </motion.div>
  );

  const renderGameContent = () => {
    if (questions.length === 0 && (gameStatus === 'playing' || gameStatus === 'wager')) {
        return renderWelcomeScreen();
    }
    
    switch (gameStatus) {
      case 'wager':
        return <WagerCard 
                    wager={wager!} 
                    challenger={challenger!} 
                    onAccept={handleWagerAccept}
                    onDecline={handleRestart}
                />;
      case 'playing':
        return <GameScreen 
                  questions={questions} 
                  onGameEnd={handleGameEnd} 
                  scoreToBeat={scoreToBeat} 
                  isChallenge={isChallenge}
                  isAiGame={isAiGame}
               />;
      case 'summary':
        return <SummaryScreen 
                  score={finalScore} 
                  questionsAnswered={questionsAnswered} 
                  onRestart={handleRestart} 
                  questions={questions} 
               />;
      case 'setup':
      default:
        return renderWelcomeScreen();
    }
  };

  return (
    <Card className="h-full min-h-[500px]">
      <CardContent className="h-full flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {renderGameContent()}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
