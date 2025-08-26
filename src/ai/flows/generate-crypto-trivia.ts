
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
// By providing an output schema, Genkit will automatically handle the JSON parsing and validation.
// If the model's output doesn't conform to the schema, Genkit will throw an error,
// which will be caught by the calling function.
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

// Export an async wrapper function to be called from the client.
// This function now directly calls the prompt and handles errors.
export async function generateCryptoTrivia(input: GenerateCryptoTriviaInput): Promise<{ questions: GenerateCryptoTriviaOutput }> {
  try {
    const questions = await triviaPrompt(input);
    
    // Genkit's `definePrompt` with an output schema automatically validates the output.
    // If the output doesn't match the schema, it will throw an error which is caught below.
    
    return { questions };

  } catch (e) {
    console.error(`Failed to generate trivia for topic "${input.topic}":`, e);
    // Throw a user-friendly error after a failure.
    throw new Error('The AI model could not generate valid questions for the given topic. Please try a different one.');
  }
}
