import type { Player, LeaderboardEntry } from './types';

export const PLAYERS: Player[] = [
  {
    id: 'vitalik',
    name: 'VitalikButerin',
    avatar: 'https://placehold.co/100x100.png',
    stats: {
      totalScore: 9850,
      gamesPlayed: 15,
      questionsAnswered: 150,
      correctAnswers: 138,
      accuracy: '92.00%',
      topRank: 1,
    },
  },
  {
    id: 'satoshi',
    name: 'SatoshiNakamoto',
    avatar: 'https://placehold.co/100x100.png',
    stats: {
      totalScore: 9500,
      gamesPlayed: 12,
      questionsAnswered: 120,
      correctAnswers: 114,
      accuracy: '95.00%',
      topRank: 2,
    },
  },
  {
    id: 'cz',
    name: 'CZ_Binance',
    avatar: 'https://placehold.co/100x100.png',
    stats: {
      totalScore: 8700,
      gamesPlayed: 20,
      questionsAnswered: 200,
      correctAnswers: 174,
      accuracy: '87.00%',
      topRank: 3,
    },
  },
  {
    id: 'dwr',
    name: 'dwr.eth',
    avatar: 'https://placehold.co/100x100.png',
    stats: {
      totalScore: 8200,
      gamesPlayed: 18,
      questionsAnswered: 180,
      correctAnswers: 160,
      accuracy: '88.89%',
      topRank: 4,
    },
  },
  {
    id: 'cobie',
    name: 'Cobie',
    avatar: 'https://placehold.co/100x100.png',
    stats: {
      totalScore: 7800,
      gamesPlayed: 25,
      questionsAnswered: 250,
      correctAnswers: 195,
      accuracy: '78.00%',
      topRank: 5,
    },
  },
];

export const LEADERBOARD_DATA: LeaderboardEntry[] = PLAYERS.map(
  (player, index) => ({
    rank: index + 1,
    player,
  })
).sort((a, b) => b.player.stats.totalScore - a.player.stats.totalScore)
 .map((entry, index) => ({ ...entry, rank: index + 1 }));
