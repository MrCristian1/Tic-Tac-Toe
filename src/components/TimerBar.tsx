import React from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface TimerBarProps {
  timeLeft: number;
  totalTime: number;
  currentPlayer: 'X' | 'O';
  theme: 'light' | 'dark';
}

const TimerBar: React.FC<TimerBarProps> = ({ timeLeft, totalTime, currentPlayer, theme }) => {
  const percentage = (timeLeft / totalTime) * 100;
  const isWarning = timeLeft <= 5;
  const isCritical = timeLeft <= 3;

  const getBarColor = () => {
    if (isCritical) return 'bg-gradient-to-r from-red-500 to-red-600';
    if (isWarning) return 'bg-gradient-to-r from-yellow-500 to-orange-500';
    return currentPlayer === 'X' 
      ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
      : 'bg-gradient-to-r from-purple-500 to-purple-600';
  };

  const getGlowColor = () => {
    if (isCritical) return 'shadow-red-500/50';
    if (isWarning) return 'shadow-yellow-500/50';
    return currentPlayer === 'X' ? 'shadow-blue-500/50' : 'shadow-purple-500/50';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Clock size={20} className={`${
            isCritical ? 'text-red-500 animate-pulse' : 
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          } transition-colors duration-300`} />
          <span className={`font-light transition-colors duration-300 ${
            isCritical ? 'text-red-600' : 
            theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
          }`}>
            Tiempo restante
          </span>
        </div>
        <div className={`flex items-center gap-2 ${isCritical ? 'animate-bounce' : ''}`}>
          {isWarning && <AlertTriangle size={16} className="text-yellow-500 animate-pulse" />}
          <span className={`text-2xl font-light transition-all duration-300 ${
            isCritical ? 'text-red-600 animate-pulse scale-110' : 
            isWarning ? 'text-yellow-600' : 
            theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
          }`}>
            {timeLeft}s
          </span>
        </div>
      </div>
      
      <div className={`relative h-3 rounded-full overflow-hidden shadow-inner ${
        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
      }`}>
        <div 
          className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-linear rounded-full ${getBarColor()} ${
            isCritical ? `animate-pulse shadow-lg ${getGlowColor()}` : ''
          }`}
          style={{ width: `${percentage}%` }}
        />
        {isCritical && (
          <div className="absolute inset-0 bg-red-500/10 animate-ping rounded-full" />
        )}
      </div>
      
      <div className="flex justify-center gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              percentage > (i + 1) * 20 
                ? isCritical ? 'bg-red-500' : isWarning ? 'bg-yellow-500' : currentPlayer === 'X' ? 'bg-blue-500' : 'bg-purple-500'
                : theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default TimerBar;