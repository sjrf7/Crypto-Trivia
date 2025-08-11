
'use client';

import { useEffect, useState } from 'react';
import { TriviaQuestion } from '@/lib/types';
import { AnimatePresence, motion } from 'framer-motion';

import { GameScreen } from './GameScreen';
import { SummaryScreen } from './SummaryScreen';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wand2 } from 'lucide-react';
import { TRIVIA_QUESTIONS } from '@/lib/mock-data';
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

export function GameClient({ challengeQuestions, scoreToBeat, wager, challenger, onRestart, onGameStatusChange }: GameClientProps) {
  const [gameStatus, setGameStatus] = useState<GameStatus>('setup');
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [finalScore, setFinalScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [isChallenge, setIsChallenge] = useState(false);
  const [isAiGame, setIsAiGame] = useState(false);

  useEffect(() => {
    if (challengeQuestions) {
        onGameStatusChange?.(true);
        setIsChallenge(!!scoreToBeat);
        setIsAiGame(!scoreToBeat);
        setQuestions(challengeQuestions);
        if (wager && wager > 0 && challenger) {
            setGameStatus('wager');
        } else {
            setGameStatus('playing');
        }
    }
  }, [challengeQuestions, scoreToBeat, wager, challenger, onGameStatusChange])

  const handleStartClassic = () => {
    onGameStatusChange?.(true);
    const questionIndices = [...Array(TRIVIA_QUESTIONS.length).keys()].sort(() => Math.random() - 0.5);
    const selectedQuestions = questionIndices.map(i => ({...TRIVIA_QUESTIONS[i], originalIndex: i}));
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
          Crypto Trivia Showdown
        </motion.h2>
        <motion.p 
          className="text-muted-foreground max-w-md mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Test your crypto knowledge with our classic trivia questions, or generate a new quiz with AI!
        </motion.p>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button onClick={handleStartClassic} size="lg">Start Classic Game</Button>
        </motion.div>
    </motion.div>
  );

  const renderGameContent = () => {
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
