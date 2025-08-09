

export interface TriviaQuestion {
  question: string;
  answer: string;
  options: string[];
  originalIndex?: number;
  // Allow for other properties like the ones we'll add for powerups
  [key: string]: any;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
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
  achievements: string[]; // Array of achievement IDs
}

export interface LeaderboardEntry {
  rank: number;
  player: Player;
}
