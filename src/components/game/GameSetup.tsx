'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wand2 } from 'lucide-react';

const formSchema = z.object({
  topic: z.string().min(2, 'Topic must be at least 2 characters.'),
  numQuestions: z.string(),
  difficulty: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

interface GameSetupProps {
  onStart: (topic: string, numQuestions: number, difficulty: string) => void;
  loading: boolean;
}

export function GameSetup({ onStart, loading }: GameSetupProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: 'Bitcoin',
      numQuestions: '5',
      difficulty: 'medium',
    },
  });

  const onSubmit = (values: FormValues) => {
    onStart(values.topic, parseInt(values.numQuestions, 10), values.difficulty);
  };

  return (
    <Card className="w-full h-full shadow-2xl">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Wand2 className="h-6 w-6 text-primary drop-shadow-glow-primary" />
          <CardTitle className="font-headline text-2xl">AI Trivia Setup</CardTitle>
        </div>
        <CardDescription>
          Customize your trivia game.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Crypto Topic</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Ethereum, NFTs, DeFi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="numQuestions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Questions</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select number of questions" />
                      </Trigger>
                    </FormControl>
                    <SelectContent>
                      {[...Array(10)].map((_, i) => (
                        <SelectItem key={i + 1} value={`${i + 1}`}>
                          {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulty</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </Trigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Generating Questions...' : 'Start Game'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
