
'use server';

import { ai } from '@/ai/genkit';
import {
  GenerateCryptoTriviaInput,
  GenerateCryptoTriviaInputSchema,
  GenerateCryptoTriviaOutputSchema,
} from '@/lib/types/ai';
import { gemini15Flash } from '@genkit-ai/googleai';
import { generate } from 'genkit/generate';

const triviaPrompt = `
      You are an expert in cryptocurrency and blockchain technology.
      Generate a list of {{numQuestions}} trivia questions about {{topic}}.
      The difficulty of the questions should be {{difficulty}}.
      Each question must have exactly 4 possible options, and one of them must be the correct answer.

      VERY IMPORTANT: Your output must be a valid JSON object that strictly adheres to the output schema.
      The output should be a single JSON object with a "questions" key, which holds an array of question objects.
      Do not output any text or formatting other than the required JSON object.
    `;

export async function generateCryptoTrivia(input: GenerateCryptoTriviaInput): Promise<{ questions: any[] }> {
  console.log('Generating AI trivia with input:', input);
  try {
    const llmResponse = await generate({
        model: gemini15Flash,
        prompt: triviaPrompt,
        input: input,
        output: {
            schema: GenerateCryptoTriviaOutputSchema,
        },
    });

    const output = llmResponse.output();
    
    if (!output || !output.questions || output.questions.length === 0) {
      throw new Error('The AI model returned no questions. Please try a different topic.');
    }
    console.log(`Successfully generated ${output.questions.length} questions.`);
    return output;
  } catch (error) {
    console.error('Error generating AI trivia:', error);
    throw new Error('The AI model could not generate valid questions for the given topic. Please try a different one.');
  }
}
