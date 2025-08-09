// src/ai/flows/generate-crypto-trivia.ts
'use server';

/**
 * @fileOverview Generates crypto trivia questions from diverse sources using an LLM.
 *
 * - generateCryptoTrivia - A function that generates crypto trivia questions.
 * - GenerateCryptoTriviaInput - The input type for the generateCryptoTrivia function.
 * - GenerateCryptoTriviaOutput - The return type for the generateCryptoTrivia function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCryptoTriviaInputSchema = z.object({
  topic: z
    .string()
    .describe('The specific topic for crypto trivia questions. Example: Bitcoin halving, Ethereum 2.0, DeFi protocols.'),
  numQuestions: z
    .number()
    .min(1)
    .max(10)
    .describe('The number of crypto trivia questions to generate.'),
  difficulty: z
    .string()
    .describe('The difficulty level of the trivia questions. Example: easy, medium, hard.'),
});
export type GenerateCryptoTriviaInput = z.infer<typeof GenerateCryptoTriviaInputSchema>;

const GenerateCryptoTriviaOutputSchema = z.object({
  questions: z.array(
    z.object({
      question: z.string().describe('The crypto trivia question.'),
      answer: z.string().describe('The correct answer to the crypto trivia question.'),
      options: z.array(z.string()).describe('The possible answers to the crypto trivia question.'),
    })
  ).describe('The generated crypto trivia questions.'),
});
export type GenerateCryptoTriviaOutput = z.infer<typeof GenerateCryptoTriviaOutputSchema>;

export async function generateCryptoTrivia(input: GenerateCryptoTriviaInput): Promise<GenerateCryptoTriviaOutput> {
  return generateCryptoTriviaFlow(input);
}

const generateCryptoTriviaPrompt = ai.definePrompt({
  name: 'generateCryptoTriviaPrompt',
  input: {schema: GenerateCryptoTriviaInputSchema},
  output: {schema: GenerateCryptoTriviaOutputSchema},
  prompt: `You are an expert in cryptocurrency trivia. Generate {{numQuestions}} trivia questions about {{topic}} with {{difficulty}} difficulty. Each question should have a question, a correct answer, and a list of possible answers (options). Ensure that the correct answer is included in the options. The options should be plausible but only one is correct.

Output the questions in JSON format, with each question having the following structure:
{
  "question": "The trivia question.",
  "answer": "The correct answer to the question.",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"]
}

Make sure the response is a valid JSON array of question objects. The questions should be diverse and come from various sources of crypto knowledge.`, 
});

const generateCryptoTriviaFlow = ai.defineFlow(
  {
    name: 'generateCryptoTriviaFlow',
    inputSchema: GenerateCryptoTriviaInputSchema,
    outputSchema: GenerateCryptoTriviaOutputSchema,
  },
  async input => {
    const {output} = await generateCryptoTriviaPrompt(input);
    return output!;
  }
);
