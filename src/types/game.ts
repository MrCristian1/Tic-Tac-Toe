export type Player = 'X' | 'O';
export type Cell = Player | null;
export type Board = Cell[];
export type GameStatus = 'playing' | 'won' | 'draw';
export type Theme = 'light' | 'dark';
export type GameMode = 'pvp' | 'pvc';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface GameState {
  board: Board;
  currentPlayer: Player;
  status: GameStatus;
  winner: Player | null;
  timeLeft: number;
  totalTime: number;
  winningLine: number[] | null;
  mode: GameMode;
  difficulty: Difficulty;
  isAiTurn: boolean;
}

export interface GameStats {
  playerXWins: number;
  playerOWins: number;
  draws: number;
  totalGames: number;
  currentStreak: { player: Player | null; count: 0 };
  averageGameTime: number;
  // New AI stats
  aiWins: number;
  playerWins: number;
  gamesVsAi: number;
}

export interface GameSettings {
  turnTime: number;
  soundEnabled: boolean;
  soundVolume: number;
  theme: Theme;
  showParticles: boolean;
  gameMode: GameMode;
  difficulty: Difficulty;
}

export interface GameHistory {
  id: string;
  winner: Player | null;
  moves: number;
  duration: number;
  timestamp: Date;
  mode: GameMode;
  difficulty?: Difficulty;
}