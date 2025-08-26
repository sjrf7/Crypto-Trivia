
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { AITriviaGameSchema } from '@/lib/types/ai';

const MODEL_NAME = "gemini-1.5-flash";
const API_KEY = process.env.GEMINI_API_KEY || '';

export async function POST(req: NextRequest) {
  if (!API_KEY) {
    return NextResponse.json({ error: 'API key is missing.' }, { status: 500 });
  }

  try {
    const { topic } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required.' }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const generationConfig = {
      temperature: 1,
      topK: 64,
      topP: 0.95,
      maxOutputTokens: 8192,
    };

    const safetySettings = [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    ];
    
    const prompt = `
      You are an expert in creating fun and engaging trivia games. Your task is to generate a trivia game based on the topic of: ${topic}.

      The game should have a clear topic and a set of questions. Each question must have exactly 4 options, and one of them must be the correct answer.

      Please generate a game with 10 questions. Ensure the questions are interesting, cover a range of difficulties, and are directly related to the specified topic.
      
      Your output MUST be a valid JSON object that strictly conforms to the following Zod schema:
      
      \`\`\`json
      ${JSON.stringify(AITriviaGameSchema.shape, null, 2)}
      \`\`\`
    `;

    const result = await model.generateContentStream([prompt]);
    
    let text = '';
    for await (const chunk of result.stream) {
      text += chunk.text();
    }
    
    // Clean the response to ensure it's a valid JSON string
    const cleanedJsonString = text.replace(/```json\n|```/g, '').trim();

    const gameData = JSON.parse(cleanedJsonString);

    // Validate the parsed data against the schema
    const validationResult = AITriviaGameSchema.safeParse(gameData);

    if (!validationResult.success) {
      console.error("AI response validation error:", validationResult.error);
      return NextResponse.json({ error: 'The AI returned data in an invalid format.', details: validationResult.error.flatten() }, { status: 500 });
    }

    return NextResponse.json(validationResult.data, { status: 200 });

  } catch (error: any) {
    console.error('Error generating trivia:', error);
    return NextResponse.json({ error: error.message || 'An unexpected error occurred.' }, { status: 500 });
  }
}
