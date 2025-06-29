import { Board, Player, Cell } from '../types/game';
import { checkWinner, checkDraw } from './gameLogic';

export class AIPlayer {
  private difficulty: 'easy' | 'medium' | 'hard';
  private player: Player;
  private opponent: Player;

  constructor(difficulty: 'easy' | 'medium' | 'hard', player: Player = 'O') {
    this.difficulty = difficulty;
    this.player = player;
    this.opponent = player === 'X' ? 'O' : 'X';
  }

  public makeMove(board: Board): number {
    const availableMoves = this.getAvailableMoves(board);
    
    if (availableMoves.length === 0) {
      return -1;
    }

    switch (this.difficulty) {
      case 'easy':
        return this.makeRandomMove(availableMoves);
      case 'medium':
        return this.makeMediumMove(board, availableMoves);
      case 'hard':
        return this.makeOptimalMove(board);
      default:
        return this.makeRandomMove(availableMoves);
    }
  }

  private getAvailableMoves(board: Board): number[] {
    return board.map((cell, index) => cell === null ? index : -1).filter(index => index !== -1);
  }

  private makeRandomMove(availableMoves: number[]): number {
    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    return availableMoves[randomIndex];
  }

  private makeMediumMove(board: Board, availableMoves: number[]): number {
    // 70% strategic, 30% random
    if (Math.random() < 0.7) {
      // Try to win first
      const winMove = this.findWinningMove(board, this.player);
      if (winMove !== -1) return winMove;

      // Block opponent's winning move
      const blockMove = this.findWinningMove(board, this.opponent);
      if (blockMove !== -1) return blockMove;

      // Take center if available
      if (board[4] === null) return 4;

      // Take corners
      const corners = [0, 2, 6, 8].filter(pos => board[pos] === null);
      if (corners.length > 0) {
        return corners[Math.floor(Math.random() * corners.length)];
      }
    }

    return this.makeRandomMove(availableMoves);
  }

  private makeOptimalMove(board: Board): number {
    // Use minimax algorithm for optimal play
    const bestMove = this.minimax(board, 0, true, -Infinity, Infinity);
    return bestMove.index;
  }

  private findWinningMove(board: Board, player: Player): number {
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        const testBoard = [...board];
        testBoard[i] = player;
        const { winner } = checkWinner(testBoard);
        if (winner === player) {
          return i;
        }
      }
    }
    return -1;
  }

  private minimax(board: Board, depth: number, isMaximizing: boolean, alpha: number, beta: number): { score: number; index: number } {
    const { winner } = checkWinner(board);
    const isDraw = checkDraw(board);

    // Terminal states
    if (winner === this.player) return { score: 10 - depth, index: -1 };
    if (winner === this.opponent) return { score: depth - 10, index: -1 };
    if (isDraw) return { score: 0, index: -1 };

    const availableMoves = this.getAvailableMoves(board);
    let bestMove = { score: isMaximizing ? -Infinity : Infinity, index: -1 };

    for (const move of availableMoves) {
      const newBoard = [...board];
      newBoard[move] = isMaximizing ? this.player : this.opponent;

      const result = this.minimax(newBoard, depth + 1, !isMaximizing, alpha, beta);

      if (isMaximizing) {
        if (result.score > bestMove.score) {
          bestMove = { score: result.score, index: move };
        }
        alpha = Math.max(alpha, result.score);
      } else {
        if (result.score < bestMove.score) {
          bestMove = { score: result.score, index: move };
        }
        beta = Math.min(beta, result.score);
      }

      // Alpha-beta pruning
      if (beta <= alpha) {
        break;
      }
    }

    return bestMove;
  }
}