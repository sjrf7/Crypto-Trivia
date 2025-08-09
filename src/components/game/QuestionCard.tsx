'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { TriviaQuestion } from '@/lib/types';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Star, Clock } from 'lucide-react';

interface QuestionCardProps {
  question: TriviaQuestion;
  onAnswer: (isCorrect: boolean) => void;
  questionNumber: number;
  totalQuestions: number;
  onUse5050: () => void;
  is5050Used: boolean;
  onUseTimeBoost: () => void;
  isTimeBoostUsed: boolean;
}

export function QuestionCard({ 
    question, 
    onAnswer, 
    questionNumber, 
    totalQuestions, 
    onUse5050, 
    is5050Used,
    onUseTimeBoost,
    isTimeBoostUsed,
}: QuestionCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleOptionClick = (option: string) => {
    if (isAnswered) return;
    setIsAnswered(true);
    setSelectedOption(option);
    const isCorrect = option === question.answer;

    setTimeout(() => {
      onAnswer(isCorrect);
      setIsAnswered(false);
      setSelectedOption(null);
    }, 1500);
  };
  
  const getButtonClass = (option: string) => {
    if (!isAnswered) return 'bg-secondary hover:bg-secondary/80';
    if (option === question.answer) return 'bg-accent text-accent-foreground hover:bg-accent/90';
    if (option === selectedOption) return 'bg-destructive text-destructive-foreground hover:bg-destructive/90';
    return 'bg-secondary opacity-50';
  };

  return (
    <motion.div
      key={questionNumber}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full max-w-2xl mx-auto border-primary shadow-lg shadow-primary/10">
        <CardHeader>
          <p className="text-sm text-muted-foreground">Question {questionNumber} of {totalQuestions}</p>
          <CardTitle className="font-headline text-2xl leading-tight">{question.question}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {question.options.map((option, index) => {
                if(option === '') return <div key={index} />; // Render empty div for hidden options
                return (
                    <Button
                        key={index}
                        onClick={() => handleOptionClick(option)}
                        disabled={isAnswered}
                        className={cn('h-auto py-4 text-base whitespace-normal justify-start', getButtonClass(option))}
                    >
                        <span className="mr-4 font-bold text-accent">{String.fromCharCode(65 + index)}</span>
                        <span>{option}</span>
                    </Button>
                )
            })}
          </div>
        </CardContent>
        <CardFooter className="justify-center gap-4">
            <Button onClick={onUse5050} disabled={is5050Used || isAnswered} variant="outline">
                <Star className="mr-2 h-4 w-4" />
                50/50
            </Button>
            <Button onClick={onUseTimeBoost} disabled={isTimeBoostUsed || isAnswered} variant="outline">
                <Clock className="mr-2 h-4 w-4" />
                +15s
            </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
