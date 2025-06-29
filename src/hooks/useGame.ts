import { useState, useCallback, useEffect, useRef } from 'react';
import { GameState, Player, GameSettings } from '../types/game';
import { createEmptyBoard, getGameStatus } from '../utils/gameLogic';
import { AIPlayer } from '../utils/aiPlayer';
import { useAudio } from './useAudio';

export const useGame = (settings: GameSettings, onGameEnd: (winner: Player | null, moves: number, duration: number) => void) => {
  const [gameState, setGameState] = useState<GameState>({
    board: createEmptyBoard(),
    currentPlayer: 'X',
    status: 'playing',
    winner: null,
    timeLeft: settings.turnTime,
    totalTime: settings.turnTime,
    winningLine: null,
    mode: settings.gameMode,
    difficulty: settings.difficulty,
    isAiTurn: false,
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const aiTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningPlayedRef = useRef<boolean>(false);
  const gameStartTimeRef = useRef<number>(Date.now());
  const movesCountRef = useRef<number>(0);
  const aiPlayerRef = useRef<AIPlayer | null>(null);
  
  const { 
    playClickSound, 
    playTimeWarningSound,
    playTensionTick,
    playTimeUpSound, 
    playWinSound, 
    playDrawSound, 
    playNewGameSound 
  } = useAudio(settings);

  // Initialize AI player when needed
  useEffect(() => {
    if (settings.gameMode === 'pvc') {
      aiPlayerRef.current = new AIPlayer(settings.difficulty, 'O');
    } else {
      aiPlayerRef.current = null;
    }
  }, [settings.gameMode, settings.difficulty]);

  const makeMove = useCallback((index: number) => {
    if (gameState.board[index] !== null || gameState.status !== 'playing' || gameState.isAiTurn) {
      return;
    }

    playClickSound();
    movesCountRef.current += 1;

    const newBoard = [...gameState.board];
    newBoard[index] = gameState.currentPlayer;

    const { winner, isDraw, winningLine } = getGameStatus(newBoard);
    
    setGameState(prev => ({
      ...prev,
      board: newBoard,
      currentPlayer: prev.currentPlayer === 'X' ? 'O' : 'X',
      status: winner ? 'won' : isDraw ? 'draw' : 'playing',
      winner,
      timeLeft: settings.turnTime,
      winningLine,
      isAiTurn: settings.gameMode === 'pvc' && !winner && !isDraw && prev.currentPlayer === 'X',
    }));

    // Handle game end
    if (winner || isDraw) {
      const gameDuration = Math.round((Date.now() - gameStartTimeRef.current) / 1000);
      onGameEnd(winner, movesCountRef.current, gameDuration);
      
      if (winner) {
        setTimeout(() => playWinSound(), 200);
      } else if (isDraw) {
        setTimeout(() => playDrawSound(), 200);
      }
    }

    warningPlayedRef.current = false;
  }, [gameState, settings.turnTime, settings.gameMode, playClickSound, playWinSound, playDrawSound, onGameEnd]);

  // AI move logic
  useEffect(() => {
    if (gameState.isAiTurn && gameState.status === 'playing' && aiPlayerRef.current) {
      // Add delay to make AI moves feel more natural
      const aiDelay = settings.difficulty === 'easy' ? 800 : settings.difficulty === 'medium' ? 1200 : 1500;
      
      aiTimeoutRef.current = setTimeout(() => {
        const aiMove = aiPlayerRef.current!.makeMove(gameState.board);
        
        if (aiMove !== -1) {
          playClickSound();
          movesCountRef.current += 1;

          const newBoard = [...gameState.board];
          newBoard[aiMove] = 'O';

          const { winner, isDraw, winningLine } = getGameStatus(newBoard);
          
          setGameState(prev => ({
            ...prev,
            board: newBoard,
            currentPlayer: 'X',
            status: winner ? 'won' : isDraw ? 'draw' : 'playing',
            winner,
            timeLeft: settings.turnTime,
            winningLine,
            isAiTurn: false,
          }));

          // Handle game end
          if (winner || isDraw) {
            const gameDuration = Math.round((Date.now() - gameStartTimeRef.current) / 1000);
            onGameEnd(winner, movesCountRef.current, gameDuration);
            
            if (winner) {
              setTimeout(() => playWinSound(), 200);
            } else if (isDraw) {
              setTimeout(() => playDrawSound(), 200);
            }
          }
        }
      }, aiDelay);
    }

    return () => {
      if (aiTimeoutRef.current) {
        clearTimeout(aiTimeoutRef.current);
        aiTimeoutRef.current = null;
      }
    };
  }, [gameState.isAiTurn, gameState.board, gameState.status, settings.difficulty, settings.turnTime, playClickSound, playWinSound, playDrawSound, onGameEnd]);

  const restartGame = useCallback(() => {
    playNewGameSound();
    warningPlayedRef.current = false;
    gameStartTimeRef.current = Date.now();
    movesCountRef.current = 0;
    
    if (aiTimeoutRef.current) {
      clearTimeout(aiTimeoutRef.current);
      aiTimeoutRef.current = null;
    }
    
    setGameState({
      board: createEmptyBoard(),
      currentPlayer: 'X',
      status: 'playing',
      winner: null,
      timeLeft: settings.turnTime,
      totalTime: settings.turnTime,
      winningLine: null,
      mode: settings.gameMode,
      difficulty: settings.difficulty,
      isAiTurn: false,
    });
  }, [playNewGameSound, settings.turnTime, settings.gameMode, settings.difficulty]);

  // Update game state when settings change
  useEffect(() => {
    setGameState(prev => ({
      ...prev,
      timeLeft: prev.status === 'playing' ? settings.turnTime : prev.timeLeft,
      totalTime: settings.turnTime,
      mode: settings.gameMode,
      difficulty: settings.difficulty,
    }));
  }, [settings.turnTime, settings.gameMode, settings.difficulty]);

  // Timer effect with progressive tension audio (only for human players)
  useEffect(() => {
    if (gameState.status === 'playing' && !gameState.isAiTurn) {
      timerRef.current = setInterval(() => {
        setGameState(prev => {
          // Play warning sound at 5 seconds
          if (prev.timeLeft === 6 && !warningPlayedRef.current) {
            playTimeWarningSound();
            warningPlayedRef.current = true;
          }

          // Play progressive tension ticks from 4 seconds down to 1
          if (prev.timeLeft <= 5 && prev.timeLeft > 1) {
            playTensionTick(prev.timeLeft - 1);
          }

          if (prev.timeLeft <= 1) {
            playTimeUpSound();
            warningPlayedRef.current = false;
            
            // In PvC mode, if it's player's turn and time runs out, AI gets the turn
            const nextPlayer = prev.currentPlayer === 'X' ? 'O' : 'X';
            const isNextAiTurn = settings.gameMode === 'pvc' && nextPlayer === 'O';
            
            return {
              ...prev,
              currentPlayer: nextPlayer,
              timeLeft: settings.turnTime,
              isAiTurn: isNextAiTurn,
            };
          }
          return {
            ...prev,
            timeLeft: prev.timeLeft - 1,
          };
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [gameState.status, gameState.currentPlayer, gameState.isAiTurn, settings.turnTime, settings.gameMode, playTimeWarningSound, playTensionTick, playTimeUpSound]);

  return {
    gameState,
    makeMove,
    restartGame,
  };
};