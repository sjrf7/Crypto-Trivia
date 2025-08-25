
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
 * - generateSingleCryptoQuestion - The main function that triggers the trivia generation flow for a single question.
 * - GenerateSingleCryptoQuestionInput - The type definition for the input of the generation flow.
 * - GenerateSingleCryptoQuestionOutput - The type definition for the output of the generation flow.
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
const GenerateSingleCryptoQuestionInputSchema = z.object({
  topic: z.string().describe('The cryptocurrency topic for the trivia questions (e.g., Bitcoin, Ethereum, DeFi).'),
  difficulty: z.enum(['easy', 'medium', 'hard']).describe('The difficulty level of the questions.'),
  language: z.enum(['en', 'es']).describe('The language for the questions.'),
  exclude: z.array(z.string()).optional().describe('A list of questions to exclude to avoid duplicates.'),
});
export type GenerateSingleCryptoQuestionInput = z.infer<typeof GenerateSingleCryptoQuestionInputSchema>;

// Define the output schema for the trivia generation flow.
const GenerateSingleCryptoQuestionOutputSchema = TriviaQuestionSchema;
export type GenerateSingleCryptoQuestionOutput = z.infer<typeof GenerateSingleCryptoQuestionOutputSchema>;

// Define the prompt for the AI model.
const triviaPrompt = ai.definePrompt({
  name: 'cryptoTriviaPrompt',
  input: { schema: GenerateSingleCryptoQuestionInputSchema },
  output: { schema: GenerateSingleCryptoQuestionOutputSchema },
  prompt: `
    You are an expert in cryptocurrency, blockchain, and web3 technology. Your task is to generate ONE trivia question.
    It is very important that you ONLY generate a question about a topic related to cryptocurrency, blockchain, or web3.
    If the user provides a topic that is NOT related to these subjects, you MUST return an error.
    
    Do not generate a question from this list: {{#if exclude}} {{exclude}} {{/if}}

    Generate ONE trivia question about {{topic}}.
    The question should be in {{language}}.
    For the question, also include the topic '{{topic}}' in the response.
    The question should be of {{difficulty}} difficulty.
    Provide 4 options and clearly indicate the correct answer.
    Ensure the question is accurate, interesting, and covers a specific aspect of the topic.
  `,
});

// Define the main flow for generating crypto trivia.
const generateCryptoTriviaFlow = ai.defineFlow(
  {
    name: 'generateSingleCryptoQuestionFlow',
    inputSchema: GenerateSingleCryptoQuestionInputSchema,
    outputSchema: GenerateSingleCryptoQuestionOutputSchema,
  },
  async (input) => {
    const { output } = await triviaPrompt(input);
    if (!output?.question) {
        throw new Error('Generated question is empty or invalid.');
    }
    return output;
  }
);

// Export an async wrapper function to be called from the client.
export async function generateSingleCryptoQuestion(input: GenerateSingleCryptoQuestionInput): Promise<GenerateSingleCryptoQuestionOutput> {
  return generateCryptoTriviaFlow(input);
}
