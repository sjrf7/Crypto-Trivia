
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
import { useI18n } from '@/hooks/use-i18n';

const FormSchema = z.object({
  topic: z.string().min(2, {
    message: 'Topic must be at least 2 characters.',
  }),
  numQuestions: z.coerce.number().min(3).max(20),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
});

interface GameSetupProps {
  onStartGame: (values: z.infer<typeof FormSchema>) => void;
  isGenerating: boolean;
}

export function GameSetup({ onStartGame, isGenerating }: GameSetupProps) {
  const { t } = useI18n();

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
            <h2 className="text-2xl font-headline">{t('game.setup.title')}</h2>
            <p className="text-muted-foreground">{t('game.setup.description')}</p>
        </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="numQuestions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('game.setup.num_questions.label')}</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    defaultValue={String(field.value)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('game.setup.num_questions.placeholder')} />
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
                  <FormLabel>{t('game.setup.difficulty.label')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('game.setup.difficulty.placeholder')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Easy">{t('game.setup.difficulty.easy')}</SelectItem>
                      <SelectItem value="Medium">{t('game.setup.difficulty.medium')}</SelectItem>
                      <SelectItem value="Hard">{t('game.setup.difficulty.hard')}</SelectItem>
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
                <Loader className="animate-spin" />
                {t('game.setup.loading_button')}
              </>
            ) : (
                t('game.setup.start_button')
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
