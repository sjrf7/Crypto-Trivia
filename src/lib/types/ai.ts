
import { z } from 'zod';

// Define the schema for a single trivia question.
export const TriviaQuestionSchema = z.object({
  question: z.string().describe('The trivia question text.'),
  options: z.array(z.string()).min(4).max(4).describe('A list of exactly 4 possible answers.'),
  answer: z.string().describe('The correct answer from the options list.'),
});
export type TriviaQuestion = z.infer<typeof TriviaQuestionSchema>;


// Define the input schema for the trivia generation flow.
export const GenerateCryptoTriviaInputSchema = z.object({
  topic: z.string().describe('The cryptocurrency topic for the trivia questions (e.g., Bitcoin, Ethereum, DeFi).'),
  numQuestions: z.number().describe('The number of questions to generate.'),
  difficulty: z.enum(['easy', 'medium', 'hard']).describe('The difficulty level of the questions.'),
  language: z.enum(['en', 'es']).describe('The language for the questions (ISO 639-1 code).'),
});
export type GenerateCryptoTriviaInput = z.infer<typeof GenerateCryptoTriviaInputSchema>;

// Define the output schema for the trivia generation flow.
export const GenerateCryptoTriviaOutputSchema = z.array(TriviaQuestionSchema);
export type GenerateCryptoTriviaOutput = z.infer<typeof GenerateCryptoTriviaOutputSchema>;
