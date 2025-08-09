'use server';

import {
  generateCryptoTrivia,
  type GenerateCryptoTriviaInput,
  type GenerateCryptoTriviaOutput,
} from '@/ai/flows/generate-crypto-trivia';

export async function getTriviaQuestions(
  input: GenerateCryptoTriviaInput
): Promise<GenerateCryptoTriviaOutput> {
  try {
    const result = await generateCryptoTrivia(input);
    return result;
  } catch (error) {
    console.error('Error generating trivia questions:', error);
    // You can customize the error response as needed
    throw new Error('Failed to generate new trivia questions. Please try again.');
  }
}
