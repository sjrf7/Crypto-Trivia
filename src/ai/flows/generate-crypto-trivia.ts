
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
  options: z.array(z.string()).min(4).max(4).describe('A list of exactly 4 possible answers.'),
  answer: z.string().describe('The correct answer from the options list.'),
});
export type TriviaQuestion = z.infer<typeof TriviaQuestionSchema>;


// Define the input schema for the trivia generation flow.
const GenerateCryptoTriviaInputSchema = z.object({
  topic: z.string().describe('The cryptocurrency topic for the trivia questions (e.g., Bitcoin, Ethereum, DeFi).'),
  numQuestions: z.number().describe('The number of questions to generate.'),
  difficulty: z.enum(['easy', 'medium', 'hard']).describe('The difficulty level of the questions.'),
  language: z.enum(['en', 'es']).describe('The language for the questions (ISO 639-1 code).'),
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
    You are an expert in cryptocurrency, blockchain, and web3 technology. 
    Your task is to generate a set of trivia questions based on the user's request.

    It is very important that you ONLY generate questions about topics related to cryptocurrency, blockchain, or web3.
    If the user provides a topic that is NOT related to these subjects, you MUST return an empty list of questions.

    Please generate exactly {{numQuestions}} trivia questions about the topic: "{{topic}}".
    The questions should be in the language specified by the code: {{language}}.
    The difficulty of the questions should be {{difficulty}}.

    For each question, you must provide:
    1. The original topic requested ('{{topic}}').
    2. The question text.
    3. A list of exactly 4 answer options.
    4. The correct answer, which must be one of the 4 options.

    Ensure the questions are accurate, interesting, and cover specific aspects of the topic.
    Format the output as a valid JSON object that adheres to the defined schema.
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

    // Add robust validation to ensure the output is usable.
    if (!output || !output.questions || output.questions.length === 0) {
        console.error('AI model returned empty or invalid questions for topic:', input.topic);
        throw new Error('The AI model could not generate questions for the given topic. Please try a different one.');
    }
    
    return output;
  }
);

// Export an async wrapper function to be called from the client.
export async function generateCryptoTrivia(input: GenerateCryptoTriviaInput): Promise<GenerateCryptoTriviaOutput> {
  return generateCryptoTriviaFlow(input);
}
