
'use client';

import { useState, useEffect, useCallback } from 'react';
import { PlayerStats } from '@/lib/types';

const XP_PER_LEVEL = 1000;

const getInitialStats = (): PlayerStats => ({
  totalScore: 0,
  gamesPlayed: 0,
  questionsAnswered: 0,
  correctAnswers: 0,
  accuracy: '0%',
  topRank: null,
  level: 1,
  xp: 0,
});

export function useUserStats(fid: string | undefined) {
  const [stats, setStats] = useState<PlayerStats>(getInitialStats());
  const storageKey = `user_stats_${fid}`;

  useEffect(() => {
    if (!fid) {
      setStats(getInitialStats());
      return;
    }

    try {
      const item = window.localStorage.getItem(storageKey);
      if (item) {
        const parsedStats = JSON.parse(item);
        // Basic validation to prevent corrupted data
        if (typeof parsedStats.totalScore === 'number') {
           setStats({ ...getInitialStats(), ...parsedStats });
        } else {
           setStats(getInitialStats());
        }
      } else {
        setStats(getInitialStats());
      }
    } catch (error) {
      console.error("Failed to read user stats from localStorage", error);
      setStats(getInitialStats());
    }
  }, [fid, storageKey]);

  const addGameResult = useCallback((gameResult: {
    score: number;
    questionsAnswered: number;
    correctAnswers: number;
  }) => {
    if (!fid) return;

    setStats(prevStats => {
      const newGamesPlayed = prevStats.gamesPlayed + 1;
      const newTotalScore = prevStats.totalScore + gameResult.score;
      const newQuestionsAnswered = prevStats.questionsAnswered + gameResult.questionsAnswered;
      const newCorrectAnswers = prevStats.correctAnswers + gameResult.correctAnswers;
      const newAccuracy = newQuestionsAnswered > 0
        ? ((newCorrectAnswers / newQuestionsAnswered) * 100).toFixed(2) + '%'
        : '0%';

      // XP and Level Calculation
      let newXp = prevStats.xp + gameResult.score;
      let newLevel = prevStats.level;
      while (newXp >= XP_PER_LEVEL) {
        newXp -= XP_PER_LEVEL;
        newLevel += 1;
      }

      const newStats: PlayerStats = {
        ...prevStats,
        gamesPlayed: newGamesPlayed,
        totalScore: newTotalScore,
        questionsAnswered: newQuestionsAnswered,
        correctAnswers: newCorrectAnswers,
        accuracy: newAccuracy,
        level: newLevel,
        xp: newXp,
      };

      try {
        window.localStorage.setItem(storageKey, JSON.stringify(newStats));
      } catch (error) {
        console.error("Failed to save user stats to localStorage", error);
      }

      return newStats;
    });
  }, [fid, storageKey]);

  return { stats, addGameResult };
}
