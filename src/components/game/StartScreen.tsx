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

interface StartScreenProps {
  onStart: (topic: string, numQuestions: number, difficulty: string) => void;
  loading: boolean;
}

export function StartScreen({ onStart, loading }: StartScreenProps) {
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
    <div className="flex justify-center items-center flex-grow">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 p-3 rounded-full mb-4">
                <Wand2 className="h-8 w-8 text-primary drop-shadow-glow-primary" />
            </div>
            <CardTitle className="font-headline text-3xl">AI Trivia Setup</CardTitle>
            <CardDescription>
            Choose a topic and number of questions to start the game.
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
    </div>
  );
}
