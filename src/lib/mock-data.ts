
import type { Player, LeaderboardEntry, TriviaQuestion, Achievement } from './types';
import { Award, BookOpen, BrainCircuit, FirstAid, Medal, Rocket, Sparkles, Star, TrendingUp } from 'lucide-react';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-game',
    name: 'First Game',
    description: 'Played your first game of trivia.',
    icon: Sparkles,
  },
  {
    id: 'novice-quizzer',
    name: 'Novice Quizzer',
    description: 'Answered 50 questions correctly.',
    icon: BookOpen,
  },
  {
    id: 'crypto-enthusiast',
    name: 'Crypto Enthusiast',
    description: 'Scored over 5,000 total points.',
    icon: TrendingUp,
  },
  {
    id: 'brainiac',
    name: 'Brainiac',
    description: 'Achieve 90% accuracy in a game.',
    icon: BrainCircuit,
  },
  {
    id: 'top-player',
    name: 'Top Player',
    description: 'Reached the #1 spot on the leaderboard.',
    icon: Award,
  },
  {
    id: 'hot-streak',
    name: 'Hot Streak',
    description: 'Answered 10 questions correctly in a row.',
    icon: Rocket,
  },
];


export const PLAYERS: Player[] = [
  {
    id: 'vitalik',
    name: 'VitalikButerin',
    avatar: 'https://i.imgur.com/vH9J9a9.jpeg',
    stats: {
      totalScore: 9850,
      gamesPlayed: 15,
      questionsAnswered: 150,
      correctAnswers: 138,
      accuracy: '92.00%',
      topRank: 1,
    },
    achievements: ['first-game', 'novice-quizzer', 'crypto-enthusiast', 'brainiac', 'top-player']
  },
  {
    id: 'satoshi',
    name: 'SatoshiNakamoto',
    avatar: 'https://i.imgur.com/s65W4sH.jpeg',
    stats: {
      totalScore: 9500,
      gamesPlayed: 12,
      questionsAnswered: 120,
      correctAnswers: 114,
      accuracy: '95.00%',
      topRank: 2,
    },
    achievements: ['first-game', 'novice-quizzer', 'crypto-enthusiast', 'brainiac']
  },
  {
    id: 'cz',
    name: 'CZ_Binance',
    avatar: 'https://i.imgur.com/J32tcfT.jpeg',
    stats: {
      totalScore: 8700,
      gamesPlayed: 20,
      questionsAnswered: 200,
      correctAnswers: 174,
      accuracy: '87.00%',
      topRank: 3,
    },
    achievements: ['first-game', 'novice-quizzer', 'crypto-enthusiast']
  },
  {
    id: 'dwr',
    name: 'dwr.eth',
    avatar: 'https://i.imgur.com/L4p6Tdl.jpeg',
    stats: {
      totalScore: 8200,
      gamesPlayed: 18,
      questionsAnswered: 180,
      correctAnswers: 160,
      accuracy: '88.89%',
      topRank: 4,
    },
    achievements: ['first-game', 'novice-quizzer']
  },
  {
    id: 'cobie',
    name: 'Cobie',
    avatar: 'https://i.imgur.com/1b4s33J.jpeg',
    stats: {
      totalScore: 7800,
      gamesPlayed: 25,
      questionsAnswered: 250,
      correctAnswers: 195,
      accuracy: '78.00%',
      topRank: 5,
    },
    achievements: ['first-game']
  },
];

export const LEADERBOARD_DATA: LeaderboardEntry[] = PLAYERS.map(
  (player, index) => ({
    rank: index + 1,
    player,
  })
).sort((a, b) => b.player.stats.totalScore - a.player.stats.totalScore)
 .map((entry, index) => ({ ...entry, rank: index + 1 }));

export const TRIVIA_QUESTIONS: TriviaQuestion[] = [];
