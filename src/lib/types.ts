import type { GenerateCryptoTriviaOutput } from "@/ai/flows/generate-crypto-trivia";

export type TriviaQuestion = GenerateCryptoTriviaOutput['questions'][0];

export interface Player {
  id: string;
  name: string;
  avatar: string;
  stats: {
    totalScore: number;
    gamesPlayed: number;
    questionsAnswered: number;
    correctAnswers: number;
    accuracy: string;
    topRank: number | null;
  };
}

export interface LeaderboardEntry {
  rank: number;
  player: Player;
}
