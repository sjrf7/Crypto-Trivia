import type { Player, LeaderboardEntry, TriviaQuestion } from './types';

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

export const TRIVIA_QUESTIONS: TriviaQuestion[] = [
    {
        question: "Who is the anonymous creator of Bitcoin?",
        answer: "Satoshi Nakamoto",
        options: ["Vitalik Buterin", "Satoshi Nakamoto", "Charlie Lee", "Elon Musk"]
    },
    {
        question: "What is the name of the process that adds new transactions to the blockchain?",
        answer: "Mining",
        options: ["Forging", "Staking", "Mining", "Minting"]
    },
    {
        question: "Which cryptocurrency is known for its smart contract capabilities?",
        answer: "Ethereum",
        options: ["Bitcoin", "Litecoin", "Dogecoin", "Ethereum"]
    },
    {
        question: "What does 'DeFi' stand for?",
        answer: "Decentralized Finance",
        options: ["Digital Finance", "Decentralized Finance", "Distributed Finance", "Decentralized Funding"]
    },
    {
        question: "What is the maximum supply of Bitcoin?",
        answer: "21 million",
        options: ["100 million", "21 million", "42 million", "Unlimited"]
    }
];
