import { Player, Cell, Board } from '../types/game';

export const createEmptyBoard = (): Board => Array(9).fill(null);

export const checkWinner = (board: Board): { winner: Player | null; winningLine: number[] | null } => {
  const winningCombinations = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Diagonal top-left to bottom-right
    [2, 4, 6], // Diagonal top-right to bottom-left
  ];

  for (const combination of winningCombinations) {
    const [a, b, c] = combination;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a] as Player, winningLine: combination };
    }
  }

  return { winner: null, winningLine: null };
};

export const checkDraw = (board: Board): boolean => {
  return board.every(cell => cell !== null);
};

export const getGameStatus = (board: Board): { winner: Player | null; isDraw: boolean; winningLine: number[] | null } => {
  const { winner, winningLine } = checkWinner(board);
  const isDraw = !winner && checkDraw(board);
  
  return { winner, isDraw, winningLine };
};