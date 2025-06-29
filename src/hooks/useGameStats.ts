import { useState, useCallback, useEffect } from 'react';
import { GameStats, Player, GameHistory } from '../types/game';

const STORAGE_KEY = 'tic-tac-toe-stats';
const HISTORY_KEY = 'tic-tac-toe-history';

const defaultStats: GameStats = {
  playerXWins: 0,
  playerOWins: 0,
  draws: 0,
  totalGames: 0,
  currentStreak: { player: null, count: 0 },
  averageGameTime: 0,
  aiWins: 0,
  playerWins: 0,
  gamesVsAi: 0,
};

export const useGameStats = () => {
  const [stats, setStats] = useState<GameStats>(defaultStats);
  const [history, setHistory] = useState<GameHistory[]>([]);

  // Load stats from localStorage on mount
  useEffect(() => {
    const savedStats = localStorage.getItem(STORAGE_KEY);
    const savedHistory = localStorage.getItem(HISTORY_KEY);
    
    if (savedStats) {
      setStats({ ...defaultStats, ...JSON.parse(savedStats) });
    }
    
    if (savedHistory) {
      const parsedHistory = JSON.parse(savedHistory).map((game: any) => ({
        ...game,
        timestamp: new Date(game.timestamp),
      }));
      setHistory(parsedHistory);
    }
  }, []);

  // Save stats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  const updateStats = useCallback((winner: Player | null, moves: number, duration: number, mode: 'pvp' | 'pvc' = 'pvp', difficulty?: 'easy' | 'medium' | 'hard') => {
    const gameId = Date.now().toString();
    const newGame: GameHistory = {
      id: gameId,
      winner,
      moves,
      duration,
      timestamp: new Date(),
      mode,
      difficulty,
    };

    setHistory(prev => [newGame, ...prev.slice(0, 9)]); // Keep last 10 games

    setStats(prev => {
      const newStats = { ...prev };
      newStats.totalGames += 1;

      // Update win counts
      if (winner === 'X') {
        newStats.playerXWins += 1;
        if (mode === 'pvc') {
          newStats.playerWins += 1;
        }
      } else if (winner === 'O') {
        newStats.playerOWins += 1;
        if (mode === 'pvc') {
          newStats.aiWins += 1;
        }
      } else {
        newStats.draws += 1;
      }

      // Update AI-specific stats
      if (mode === 'pvc') {
        newStats.gamesVsAi += 1;
      }

      // Update streak
      if (winner && prev.currentStreak.player === winner) {
        newStats.currentStreak.count += 1;
      } else if (winner) {
        newStats.currentStreak = { player: winner, count: 1 };
      } else {
        newStats.currentStreak = { player: null, count: 0 };
      }

      // Update average game time
      const totalTime = prev.averageGameTime * (prev.totalGames - 1) + duration;
      newStats.averageGameTime = Math.round(totalTime / newStats.totalGames);

      return newStats;
    });
  }, []);

  const resetStats = useCallback(() => {
    setStats(defaultStats);
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(HISTORY_KEY);
  }, []);

  return {
    stats,
    history,
    updateStats,
    resetStats,
  };
};