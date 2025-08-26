
'use server';
/**
 * @fileOverview A flow for generating crypto trivia questions.
 *
 * This file defines a Genkit flow that uses an AI model to generate a set of
 * trivia questions about a specified cryptocurrency topic.
 *
 * - generateCryptoTrivia - The main function that triggers the trivia generation flow.
 */

import { ai } from '@/ai/genkit';
import { 
  GenerateCryptoTriviaInputSchema, 
  GenerateCryptoTriviaInput, 
  GenerateCryptoTriviaOutputSchema, 
  GenerateCryptoTriviaOutput 
} from '@/lib/types/ai';

// Define the prompt for the AI model.
const triviaPrompt = ai.definePrompt({
  name: 'cryptoTriviaPrompt',
  input: { schema: GenerateCryptoTriviaInputSchema },
  output: { schema: GenerateCryptoTriviaOutputSchema },
  config: {
    model: 'googleai/gemini-1.5-flash',
  },
  prompt: `
    You are an expert in cryptocurrency, blockchain, and web3 technology. 
    Your task is to generate a set of trivia questions based on the user's request.

    It is very important that you ONLY generate questions about topics related to cryptocurrency, blockchain, or web3.
    If the user provides a topic that is NOT related to these subjects, you MUST return an empty array.

    Please generate exactly {{numQuestions}} trivia questions about the topic: "{{topic}}".
    The questions should be in the language specified by the code: {{language}}.
    The difficulty of the questions should be {{difficulty}}.

    For each question, you must provide:
    1. The question text.
    2. A list of exactly 4 answer options.
    3. The correct answer, which must be one of the 4 options.

    Format the output as a valid array of JSON objects that adheres to the defined schema.
  `,
});

// Define the main flow for generating crypto trivia.
// This flow simply calls the prompt. Genkit handles the validation against the output schema automatically.
const generateCryptoTriviaFlow = ai.defineFlow(
  {
    name: 'generateCryptoTriviaFlow',
    inputSchema: GenerateCryptoTriviaInputSchema,
    outputSchema: GenerateCryptoTriviaOutputSchema,
  },
  async (input) => {
    try {
        const questions = await triviaPrompt(input);
        
        // Basic validation in case the model returns something unexpected but parsable.
        if (!Array.isArray(questions)) {
            console.error('AI model returned a non-array response:', questions);
            throw new Error('AI model did not return an array of questions.');
        }

        return questions;

    } catch (e) {
        console.error(`Failed to generate trivia for topic "${input.topic}":`, e);
        // Throw a user-friendly error after a failure.
        throw new Error('The AI model could not generate valid questions for the given topic. Please try a different one.');
    }
  }
);

// Export an async wrapper function to be called from the client.
export async function generateCryptoTrivia(input: GenerateCryptoTriviaInput): Promise<{ questions: GenerateCryptoTriviaOutput }> {
  const questions = await generateCryptoTriviaFlow(input);
  return { questions };
}
