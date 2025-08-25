
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
import { useI18n } from '@/hooks/use-i18n';

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
  const { t } = useI18n();
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

  const questionOptions = [5, 10, 20, 40, 80];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="h-full">
        <Card className="w-full h-full shadow-2xl flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Wand2 className="h-6 w-6 text-primary drop-shadow-glow-primary" />
              <CardTitle className="font-headline text-2xl">{t('game.setup.title')}</CardTitle>
            </div>
            <CardDescription>
              {t('game.setup.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 flex-grow">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('game.setup.topic.label')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('game.setup.topic.placeholder')} {...field} />
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
                  <FormLabel>{t('game.setup.num_questions.label')}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('game.setup.num_questions.placeholder')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {questionOptions.map((num) => (
                        <SelectItem key={num} value={`${num}`}>
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
                  <FormLabel>{t('game.setup.difficulty.label')}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('game.setup.difficulty.placeholder')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="easy">{t('game.setup.difficulty.easy')}</SelectItem>
                      <SelectItem value="medium">{t('game.setup.difficulty.medium')}</SelectItem>
                      <SelectItem value="hard">{t('game.setup.difficulty.hard')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <div className="p-6 pt-0">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t('game.setup.loading_button') : t('game.setup.start_button')}
            </Button>
          </div>
        </Card>
      </form>
    </Form>
  );
}
