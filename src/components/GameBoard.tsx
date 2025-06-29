import React from 'react';
import { Board } from '../types/game';
import GameCell from './GameCell';
import { GameSettings } from '../types/game';

interface GameBoardProps {
  board: Board;
  onCellClick: (index: number) => void;
  disabled: boolean;
  timeLeft: number;
  winningLine: number[] | null;
  settings: GameSettings;
}

const GameBoard: React.FC<GameBoardProps> = ({ 
  board, 
  onCellClick, 
  disabled, 
  timeLeft, 
  winningLine,
  settings 
}) => {
  const isCritical = timeLeft <= 3;
  
  return (
    <div className={`relative transition-all duration-500 ${isCritical ? 'animate-pulse' : ''}`}>
      {isCritical && (
        <div className="absolute -inset-4 bg-red-500/10 rounded-3xl animate-ping"></div>
      )}
      
      <div className={`relative backdrop-blur-lg rounded-3xl p-8 shadow-2xl border transition-all duration-300 ${
        settings.theme === 'dark' 
          ? 'bg-gray-800/80 border-gray-700/50' 
          : 'bg-white/80 border-white/50'
      }`}>
        <div className="grid grid-cols-3 gap-3">
          {board.map((cell, index) => (
            <GameCell
              key={index}
              value={cell}
              onClick={() => onCellClick(index)}
              disabled={disabled || cell !== null}
              index={index}
              timeLeft={timeLeft}
              isWinningCell={winningLine?.includes(index) || false}
              settings={settings}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameBoard;