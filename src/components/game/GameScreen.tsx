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
  const [is5050Used, setIs5050Used] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState<TriviaQuestion[]>([]);

  useEffect(() => {
    // Shuffle questions and options once at the beginning of the game
    const shuffled = questions.map(q => ({
        ...q,
        options: [...q.options].sort(() => Math.random() - 0.5)
    })).sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
  }, [questions]);

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

    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      onGameEnd(score + (isCorrect ? 100 : 0), shuffledQuestions.length);
    }
  };
  
  const handleUse5050 = () => {
    if (is5050Used) return;

    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    const correctAnswer = currentQuestion.answer;
    const incorrectOptions = currentQuestion.options.filter(opt => opt !== correctAnswer);
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

  const progress = ((currentQuestionIndex) / shuffledQuestions.length) * 100;
  
  if (shuffledQuestions.length === 0) {
    return <div>Loading questions...</div>
  }

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
           <span className="text-xl font-bold">{currentQuestionIndex} / {shuffledQuestions.length}</span>
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
          question={shuffledQuestions[currentQuestionIndex]}
          onAnswer={handleAnswer}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={shuffledQuestions.length}
          onUse5050={handleUse5050}
          is5050Used={is5050Used}
        />
      </AnimatePresence>
    </div>
  );
}
