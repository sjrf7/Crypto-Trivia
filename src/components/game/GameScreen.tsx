'use client';

import { useState, useEffect } from 'react';
import { TriviaQuestion } from '@/lib/types';
import { QuestionCard } from './QuestionCard';
import { Progress } from '@/components/ui/progress';
import { Timer, Trophy, CheckCircle } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { AnimatedScore } from './AnimatedScore';

const GAME_TIME_SECONDS = 60;

interface GameScreenProps {
  questions: TriviaQuestion[];
  onGameEnd: (score: number, questionsAnswered: number) => void;
}

export function GameScreen({ questions, onGameEnd }: GameScreenProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME_SECONDS);

  useEffect(() => {
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
  }, [onGameEnd, score, currentQuestionIndex]);

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore((prevScore) => prevScore + 100);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      onGameEnd(score + (isCorrect ? 100 : 0), questions.length);
    }
  };

  const progress = ((currentQuestionIndex) / questions.length) * 100;

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="flex items-center justify-center gap-2 bg-card p-4 rounded-lg">
          <Trophy className="h-6 w-6 text-primary drop-shadow-glow-primary" />
          <span className="text-xl font-bold">
            <AnimatedScore score={score} />
          </span>
        </div>
        <div className="flex items-center justify-center gap-2 bg-card p-4 rounded-lg">
           <CheckCircle className="h-6 w-6 text-accent drop-shadow-glow-accent" />
           <span className="text-xl font-bold">{currentQuestionIndex} / {questions.length}</span>
        </div>
        <div className="flex items-center justify-center gap-2 bg-card p-4 rounded-lg">
          <Timer className="h-6 w-6 text-destructive" />
          <span className="text-xl font-bold">{timeLeft}s</span>
        </div>
      </div>
      
      <div>
        <Progress value={progress} className="w-full" />
      </div>

      <AnimatePresence mode="wait">
        <QuestionCard
          key={currentQuestionIndex}
          question={questions[currentQuestionIndex]}
          onAnswer={handleAnswer}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
        />
      </AnimatePresence>
    </div>
  );
}
