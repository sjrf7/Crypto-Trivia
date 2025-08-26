
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
    1. The question text.
    2. A list of exactly 4 answer options.
    3. The correct answer, which must be one of the 4 options.

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
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
        attempts++;
        try {
            const { output } = await triviaPrompt(input, { model: 'googleai/gemini-1.5-flash' });
            
            // Add robust validation to ensure the output is usable.
            if (output && Array.isArray(output.questions)) {
                // If the topic is not crypto-related, the model should return an empty array.
                // We pass this along to the frontend to handle.
                if (output.questions.length === 0 && input.numQuestions > 0) {
                  return output;
                }
              
                // Further validation to prevent malformed questions from crashing the app
                const allQuestionsValid = output.questions.every(q => 
                    q &&
                    q.question && 
                    q.options && 
                    q.options.length === 4 && 
                    q.answer && 
                    q.options.includes(q.answer)
                );
                
                if (allQuestionsValid && output.questions.length > 0) {
                  // Add the original topic back to each question for context if needed by the frontend.
                  const questionsWithTopic = output.questions.map(q => ({...q, topic: input.topic}));
                  return { questions: questionsWithTopic }; // Success
                }
                
                console.warn(`Attempt ${attempts}: AI model returned malformed or empty questions for topic:`, input.topic);
            } else {
                console.warn(`Attempt ${attempts}: AI model returned invalid data structure for topic:`, input.topic, output);
            }

        } catch (e) {
            console.error(`Attempt ${attempts} failed with an error:`, e);
        }
        
        if (attempts < maxAttempts) {
            // Wait for a short period before retrying
            await new Promise(resolve => setTimeout(resolve, 1000 * attempts)); // Increase delay on each attempt
        }
    }

    // If all attempts fail, throw an error.
    throw new Error('The AI model could not generate questions for the given topic after multiple attempts. Please try a different one.');
  }
);

// Export an async wrapper function to be called from the client.
export async function generateCryptoTrivia(input: GenerateCryptoTriviaInput): Promise<GenerateCryptoTriviaOutput> {
  return generateCryptoTriviaFlow(input);
}
