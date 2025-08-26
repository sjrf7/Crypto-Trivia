
'use server';
/**
 * @fileOverview A flow for generating a crypto trivia game.
 */

import { z } from 'zod';
// import { ai } from '@/ai/genkit';
import { AITriviaGame, AITriviaGameSchema } from '@/lib/types/ai';

const TriviaGameRequestSchema = z.object({
  topic: z.string(),
});

/*
const generateTriviaPrompt = ai.definePrompt({
    name: 'generateTriviaPrompt',
    input: { schema: TriviaGameRequestSchema },
    output: { schema: AITriviaGameSchema },
    prompt: `
You are an expert in creating fun and engaging trivia games. Your task is to generate a trivia game based on the topic of: {{{topic}}}.

The game should have a clear topic and a set of questions. Each question must have exactly 4 options, and one of them must be the correct answer.

Please generate a game with 10 questions. Ensure the questions are interesting, cover a range of difficulties, and are directly related to the specified topic.
Return the output as a valid JSON object that conforms to the output schema.
`,
});
*/

export async function generateCryptoTrivia(topic: string): Promise<AITriviaGame> {
  // const { output } = await generateTriviaPrompt({ topic });
  // if (!output) {
  //   throw new Error('Failed to generate trivia game. The AI model did not return a valid output.');
  // }
  // return output;
  throw new Error('AI functionality is temporarily disabled due to technical issues. We are working on a fix.');
}
