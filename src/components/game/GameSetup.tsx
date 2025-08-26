
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Wand2, Loader } from 'lucide-react';
import { GenerateCryptoTriviaInputSchema } from '@/lib/types/ai';

const FormSchema = GenerateCryptoTriviaInputSchema;

interface GameSetupProps {
  onStartGame: (values: z.infer<typeof FormSchema>) => void;
  isGenerating: boolean;
}

export function GameSetup({ onStartGame, isGenerating }: GameSetupProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      topic: '',
      numQuestions: 5,
      difficulty: 'Medium',
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    onStartGame(data);
  }

  return (
    <div className="w-full max-w-lg mx-auto">
        <div className="text-center mb-6">
            <div className="inline-block bg-primary/10 p-3 rounded-full mb-2">
                <Wand2 className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-headline">AI-Powered Trivia</h2>
            <p className="text-muted-foreground">Describe any crypto topic and the AI will generate a custom quiz for you.</p>
        </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Topic</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 'Solana Ecosystem' or 'History of Dogecoin'" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="numQuestions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Questions</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    defaultValue={String(field.value)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select number of questions" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[3, 5, 10, 15, 20].map((num) => (
                        <SelectItem key={num} value={String(num)}>
                          {num}
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader className="animate-spin mr-2" />
                Generating...
              </>
            ) : (
                "Generate Quiz"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
