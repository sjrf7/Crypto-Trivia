
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { TriviaQuestion } from '@/lib/types';
import { QuestionCard } from './QuestionCard';
import { Progress } from '@/components/ui/progress';
import { Timer, Trophy, CheckCircle, Swords, SkipForward, Target, Hourglass, Wand2, Loader } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { AnimatedScore } from './AnimatedScore';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { useI18n } from '@/hooks/use-i18n';

const GAME_TIME_SECONDS = 120;

interface GameScreenProps {
  questions: TriviaQuestion[];
  onGameEnd: (score: number, questionsAnswered: number) => void;
  scoreToBeat?: number;
  isChallenge?: boolean;
  isAiGame?: boolean;
  onNextQuestionNeeded?: (currentQuestions: TriviaQuestion[]) => void;
  totalAiQuestions?: number;
}

export function GameScreen({ 
    questions, 
    onGameEnd, 
    scoreToBeat, 
    isChallenge = false, 
    isAiGame = false,
    onNextQuestionNeeded,
    totalAiQuestions
}: GameScreenProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME_SECONDS);
  const [shuffledQuestions, setShuffledQuestions] = useState<TriviaQuestion[]>([]);
  const { t } = useI18n();
  
  // Power-up states
  const [is5050Used, setIs5050Used] = useState(false);
  const [isTimeBoostUsed, setIsTimeBoostUsed] = useState(false);

  useEffect(() => {
    if (questions && questions.length > 0) {
      const shuffleOptions = (questionsToShuffle: TriviaQuestion[]) => {
        return questionsToShuffle
          .filter(q => q && q.options)
          .map(q => ({
            ...q,
            options: [...q.options].sort(() => Math.random() - 0.5)
          }));
      };
      
      const optionsShuffled = shuffleOptions(questions);

      if (isAiGame) {
        setShuffledQuestions(optionsShuffled);
      } else {
        setShuffledQuestions([...optionsShuffled].sort(() => Math.random() - 0.5));
      }
    } else {
        setShuffledQuestions([]);
    }
  }, [questions, isAiGame]);


  useEffect(() => {
    if (shuffledQuestions.length === 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          onGameEnd(score, currentQuestionIndex);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onGameEnd, score, currentQuestionIndex, shuffledQuestions.length]);

  const handleNextQuestion = () => {
    const isLastQuestion = isAiGame 
        ? currentQuestionIndex >= (totalAiQuestions ?? 0) -1
        : currentQuestionIndex >= shuffledQuestions.length - 1;

    if (!isLastQuestion) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        // For AI games, if we're approaching the last loaded question, fetch the next one.
        if (isAiGame && onNextQuestionNeeded && currentQuestionIndex === questions.length - 2) {
            onNextQuestionNeeded(questions);
        }
    } else {
        onGameEnd(score, currentQuestionIndex + 1);
    }
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      const points = 100;
      setScore((prevScore) => prevScore + points);
    }
    
    // For AI games, pre-fetch the next question as soon as an answer is given.
    if (isAiGame && onNextQuestionNeeded) {
        onNextQuestionNeeded(questions);
    }

    // Delay before moving to the next question to show feedback
    setTimeout(() => {
      const isLastQuestion = isAiGame 
        ? currentQuestionIndex >= (totalAiQuestions ?? 0) - 1
        : currentQuestionIndex >= shuffledQuestions.length - 1;

      if (!isLastQuestion) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      } else {
        const finalScore = score + (isCorrect ? 100 : 0);
        onGameEnd(finalScore, currentQuestionIndex + 1);
      }
    }, 1500);
  };
  
  const handleSkipQuestion = () => {
    handleNextQuestion();
  };

  const handleUse5050 = () => {
    if (is5050Used) return;
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    const correctAnswer = currentQuestion.answer;
    const incorrectOptions = currentQuestion.options.filter(opt => opt !== correctAnswer);
    if (incorrectOptions.length < 2) return;
    
    const optionsToKeep = [correctAnswer, incorrectOptions[0]];
    
    const newQuestions = [...shuffledQuestions];
    newQuestions[currentQuestionIndex] = {
        ...currentQuestion,
        options: currentQuestion.options.map(opt => optionsToKeep.includes(opt) ? opt : ''),
        hiddenOptions: currentQuestion.options.filter(opt => !optionsToKeep.includes(opt))
    };
    
    setShuffledQuestions(newQuestions);
    setIs5050Used(true);
  };
  
  const handleUseTimeBoost = () => {
      if(isTimeBoostUsed) return;
      setTimeLeft(prev => prev + 15);
      setIsTimeBoostUsed(true);
  }

  const totalQuestions = isAiGame ? (totalAiQuestions ?? questions.length) : questions.length;
  const progress = ((currentQuestionIndex) / totalQuestions) * 100;
  
  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  if (!currentQuestion) {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <Loader className="animate-spin h-8 w-8 text-primary" />
            <p className="mt-4 text-muted-foreground">{t('game.screen.loading')}</p>
        </div>
    )
  }

  return (
    <motion.div 
        className="flex flex-col gap-8 w-full"
        key="playing"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
        <AnimatePresence>
            {isChallenge && (
                <motion.div 
                    className="text-center bg-card p-3 rounded-lg border-2 border-primary"
                    initial={{y: -20, opacity: 0}}
                    animate={{y: 0, opacity: 1}}
                    exit={{y: -20, opacity: 0}}
                >
                    <h3 className="font-headline text-lg flex items-center justify-center gap-2"><Swords className="h-5 w-5 text-primary"/>{t('game.screen.challenge_mode.title')}</h3>
                    <p className="text-muted-foreground">{t('game.screen.challenge_mode.description')} <span className="font-bold text-accent">{scoreToBeat}</span>!</p>
                </motion.div>
            )}
            {isAiGame && (
                 <motion.div 
                    className="text-center bg-card p-3 rounded-lg border-2 border-accent"
                    initial={{y: -20, opacity: 0}}
                    animate={{y: 0, opacity: 1}}
                    exit={{y: -20, opacity: 0}}
                >
                    <h3 className="font-headline text-lg flex items-center justify-center gap-2"><Wand2 className="h-5 w-5 text-accent"/>{t('game.screen.ai_trivia.title')}</h3>
                    <p className="text-muted-foreground">{t('game.screen.ai_trivia.topic')}: <span className="font-bold text-accent">{currentQuestion.topic}</span></p>
                </motion.div>
            )}
        </AnimatePresence>
      <div className="grid grid-cols-3 gap-4 text-center">
        <motion.div 
            className="flex items-center justify-center gap-2 bg-card p-4 rounded-lg"
            initial={{y: -20, opacity: 0}}
            animate={{y: 0, opacity: 1}}
            transition={{delay: 0.1}}
        >
          <Trophy className="h-6 w-6 text-primary drop-shadow-glow-primary" />
          <span className="text-xl font-bold">
            <AnimatedScore score={score} />
          </span>
        </motion.div>
        <motion.div 
            className="flex items-center justify-center gap-2 bg-card p-4 rounded-lg"
            initial={{y: -20, opacity: 0}}
            animate={{y: 0, opacity: 1}}
            transition={{delay: 0.2}}
        >
           <Target className="h-6 w-6 text-accent drop-shadow-glow-accent" />
           <span className="text-xl font-bold">{currentQuestionIndex + 1} / {totalQuestions}</span>
        </motion.div>
        <motion.div 
            className="flex items-center justify-center gap-2 bg-card p-4 rounded-lg"
            initial={{y: -20, opacity: 0}}
            animate={{y: 0, opacity: 1}}
            transition={{delay: 0.3}}
        >
          <Hourglass className="h-6 w-6 text-destructive" />
          <span className="text-xl font-bold">{timeLeft}s</span>
        </motion.div>
      </div>
      
      <div>
        <Progress value={progress} className="w-full" />
      </div>

      <AnimatePresence mode="wait">
        <QuestionCard
          key={currentQuestionIndex}
          question={currentQuestion}
          onAnswer={handleAnswer}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={totalQuestions}
          onUse5050={handleUse5050}
          is5050Used={is5050Used}
          onUseTimeBoost={handleUseTimeBoost}
          isTimeBoostUsed={isTimeBoostUsed}
        />
      </AnimatePresence>
    </motion.div>
  );
}
