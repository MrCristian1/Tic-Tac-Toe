import React from 'react';
import { Cell } from '../types/game';
import { useAudio } from '../hooks/useAudio';
import { GameSettings } from '../types/game';

interface GameCellProps {
  value: Cell;
  onClick: () => void;
  disabled: boolean;
  index: number;
  timeLeft: number;
  isWinningCell: boolean;
  settings: GameSettings;
}

const GameCell: React.FC<GameCellProps> = ({ 
  value, 
  onClick, 
  disabled, 
  index, 
  timeLeft, 
  isWinningCell,
  settings 
}) => {
  const isCritical = timeLeft <= 3;
  const isWarning = timeLeft <= 5;
  const { playHoverSound } = useAudio(settings);

  const handleMouseEnter = () => {
    if (!disabled && !value) {
      playHoverSound();
    }
  };

  const getCellStyles = () => {
    let baseStyles = "w-20 h-20 sm:w-24 sm:h-24 rounded-xl flex items-center justify-center text-3xl font-light transition-all duration-300 transform relative overflow-hidden ";
    
    if (disabled) {
      baseStyles += "cursor-not-allowed ";
    } else {
      baseStyles += "cursor-pointer hover:scale-105 hover:shadow-lg ";
      if (isCritical) {
        baseStyles += "hover:shadow-red-500/30 ";
      } else {
        baseStyles += "hover:shadow-gray-500/20 ";
      }
    }

    if (value === 'X') {
      baseStyles += `text-blue-600 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 shadow-lg ${
        isWinningCell ? 'animate-pulse ring-4 ring-blue-400 ring-opacity-75' : ''
      }`;
    } else if (value === 'O') {
      baseStyles += `text-purple-600 bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 shadow-lg ${
        isWinningCell ? 'animate-pulse ring-4 ring-purple-400 ring-opacity-75' : ''
      }`;
    } else {
      baseStyles += `bg-gradient-to-br from-gray-50 to-white border-2 hover:from-gray-100 hover:to-gray-50 ${
        isCritical ? 'border-red-300 shadow-red-500/20' : 
        isWarning ? 'border-yellow-300' : 'border-gray-200'
      } shadow-md `;
    }

    return baseStyles;
  };

  return (
    <button
      className={getCellStyles()}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      disabled={disabled}
      aria-label={`Cell ${index + 1}${value ? `, contains ${value}` : ', empty'}`}
    >
      {!value && isCritical && (
        <div className="absolute inset-0 bg-red-500/5 animate-pulse rounded-xl"></div>
      )}
      
      {value && (
        <span className={`select-none drop-shadow-sm ${
          isWinningCell ? 'animate-bounce' : 'animate-scale-in'
        }`}>
          {value}
        </span>
      )}
      
      {!value && !disabled && (
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-100/50 opacity-0 hover:opacity-100 transition-opacity duration-200 rounded-xl"></div>
      )}
    </button>
  );
};

export default GameCell;