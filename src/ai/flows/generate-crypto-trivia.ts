
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

    Ensure the questions are accurate, interesting, and cover specific aspects of the topic.
    Format the output as a valid array of JSON objects that adheres to the defined schema.
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
            const questions = await triviaPrompt(input);
            
            // Case 1: Model returns a valid array.
            if (Array.isArray(questions)) {
                // An empty array is a valid response for non-crypto topics.
                if (questions.length === 0) {
                  return [];
                }
              
                // Validate that all questions in the array are well-formed.
                const allQuestionsValid = questions.every(q => 
                    q &&
                    typeof q.question === 'string' && q.question.length > 0 &&
                    Array.isArray(q.options) &&
                    q.options.length === 4 && 
                    q.options.every(opt => typeof opt === 'string' && opt.length > 0) &&
                    typeof q.answer === 'string' && q.answer.length > 0 &&
                    q.options.includes(q.answer)
                );
                
                // If questions are valid, even if fewer than requested, return them.
                if (allQuestionsValid && questions.length > 0) {
                  return questions; // Success, valid questions received.
                }
                
                console.warn(`Attempt ${attempts}: AI model returned malformed questions for topic:`, input.topic, JSON.stringify(questions, null, 2));
            } else {
                console.warn(`Attempt ${attempts}: AI model returned invalid data structure for topic:`, input.topic, questions);
            }

        } catch (e) {
            console.error(`Attempt ${attempts} failed with an error:`, e);
        }
        
        if (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
        }
    }

    // If all attempts fail, throw an error.
    throw new Error('The AI model could not generate valid questions for the given topic after multiple attempts. Please try a different one.');
  }
);

// Export an async wrapper function to be called from the client.
export async function generateCryptoTrivia(input: GenerateCryptoTriviaInput): Promise<{ questions: GenerateCryptoTriviaOutput }> {
  const questions = await generateCryptoTriviaFlow(input);
  return { questions };
}
