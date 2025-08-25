
'use server';
/**
 * @fileOverview A flow for generating crypto trivia questions.
 *
 * This file defines a Genkit flow that uses an AI model to generate a set of
 * trivia questions about a specified cryptocurrency topic. The flow takes the
 * topic, number of questions, and difficulty as input and returns a structured
 * array of questions, each with a question, a list of options, and the correct
 * answer.
 *
 * - generateCryptoTrivia - The main function that triggers the trivia generation flow.
 * - GenerateCryptoTriviaInput - The type definition for the input of the generation flow.
 * - GenerateCryptoTriviaOutput - The type definition for the output of the generation flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Define the schema for a single trivia question.
const TriviaQuestionSchema = z.object({
  topic: z.string().describe('The cryptocurrency topic for this question.'),
  question: z.string().describe('The trivia question text.'),
  options: z.array(z.string()).describe('A list of 4 possible answers.'),
  answer: z.string().describe('The correct answer from the options list.'),
});
export type TriviaQuestion = z.infer<typeof TriviaQuestionSchema>;


// Define the input schema for the trivia generation flow.
const GenerateCryptoTriviaInputSchema = z.object({
  topic: z.string().describe('The cryptocurrency topic for the trivia questions (e.g., Bitcoin, Ethereum, DeFi).'),
  numQuestions: z.number().describe('The number of questions to generate.'),
  difficulty: z.enum(['easy', 'medium', 'hard']).describe('The difficulty level of the questions.'),
  language: z.enum(['en', 'es']).describe('The language for the questions.'),
});
export type GenerateCryptoTriviaInput = z.infer<typeof GenerateCryptoTriviaInputSchema>;

// Define the output schema for the trivia generation flow.
const GenerateCryptoTriviaOutputSchema = z.object({
    questions: z.array(TriviaQuestionSchema),
});
export type GenerateCryptoTriviaOutput = z.infer<typeof GenerateCryptoTriviaOutputSchema>;

// Define the prompt for the AI model.
const triviaPrompt = ai.definePrompt({
  name: 'cryptoTriviaPrompt',
  input: { schema: GenerateCryptoTriviaInputSchema },
  output: { schema: GenerateCryptoTriviaOutputSchema },
  prompt: `
    You are an expert in cryptocurrency, blockchain, and web3 technology. Your task is to generate a set of trivia questions.
    It is very important that you ONLY generate questions about a topic related to cryptocurrency, blockchain, or web3.
    If the user provides a topic that is NOT related to these subjects, you MUST return an error.

    Generate {{numQuestions}} trivia questions about {{topic}}.
    The questions should be in {{language}}.
    For each question, also include the topic '{{topic}}' in the response.
    The questions should be of {{difficulty}} difficulty.
    For each question, provide 4 options and clearly indicate the correct answer.
    Ensure the questions are accurate, interesting, and cover specific aspects of the topic.
  `,
});

// Define the main flow for generating crypto trivia.
const generateCryptoTriviaFlow = ai.defineFlow(
  {
    name: 'generateCryptoTriviaFlow',
    inputSchema: GenerateCryptoTriviaInputSchema,
    outputSchema: GenerateCryptoTriviaOutputSchema,
  },
  async (input) => {
    const { output } = await triviaPrompt(input);
    if (!output?.questions || output.questions.length === 0) {
        throw new Error('Generated questions are empty or invalid.');
    }
    return output;
  }
);

// Export an async wrapper function to be called from the client.
export async function generateCryptoTrivia(input: GenerateCryptoTriviaInput): Promise<GenerateCryptoTriviaOutput> {
  return generateCryptoTriviaFlow(input);
}
