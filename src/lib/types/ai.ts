
import { z } from 'zod';

export const TriviaQuestionSchema = z.object({
    question: z.string().describe('The trivia question.'),
    options: z.array(z.string()).length(4).describe('An array of 4 possible answers.'),
    answer: z.string().describe('The correct answer, which must be one of the strings in the options array.'),
});

export const GenerateCryptoTriviaInputSchema = z.object({
  topic: z.string().describe('The specific crypto or blockchain topic for the trivia. e.g., "Ethereum", "Solana", "NFTs"'),
  numQuestions: z.number().min(3).max(20).describe('The number of questions to generate.'),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']).describe('The difficulty level of the questions.'),
});
export type GenerateCryptoTriviaInput = z.infer<typeof GenerateCryptoTriviaInputSchema>;


export const GenerateCryptoTriviaOutputSchema = z.object({
    questions: z.array(TriviaQuestionSchema).describe('The array of generated trivia questions.')
});
export type GenerateCryptoTriviaOutput = z.infer<typeof GenerateCryptoTriviaOutputSchema>;
