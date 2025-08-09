
export interface TriviaQuestion {
  question: string;
  answer: string;
  options: string[];
}

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
