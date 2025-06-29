import React from 'react';
import { Player, GameStatus as GameStatusType } from '../types/game';
import { Trophy, Users, RotateCcw, Bot, Brain } from 'lucide-react';

interface GameStatusProps {
  currentPlayer: Player;
  status: GameStatusType;
  winner: Player | null;
  onRestart: () => void;
  theme: 'light' | 'dark';
  gameMode: 'pvp' | 'pvc';
  isAiTurn: boolean;
}

const GameStatus: React.FC<GameStatusProps> = ({ 
  currentPlayer, 
  status, 
  winner, 
  onRestart, 
  theme, 
  gameMode,
  isAiTurn 
}) => {
  const getStatusMessage = () => {
    if (status === 'won' && winner) {
      const isPlayerWin = gameMode === 'pvc' && winner === 'X';
      const isAiWin = gameMode === 'pvc' && winner === 'O';
      
      return (
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            {isAiWin ? (
              <Bot size={48} className="text-purple-500 animate-bounce" />
            ) : (
              <Trophy size={48} className="text-yellow-500 animate-bounce" />
            )}
          </div>
          <div>
            <h2 className={`text-3xl font-light mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {gameMode === 'pvc' ? (
                isPlayerWin ? '¡Has ganado!' : '¡La IA gana!'
              ) : (
                `¡Jugador ${winner} gana!`
              )}
            </h2>
            <div className={`w-16 h-px bg-gradient-to-r from-transparent to-transparent mx-auto ${
              isAiWin ? 'via-purple-400' : 'via-yellow-400'
            }`}></div>
          </div>
          <p className={`font-light ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            {isPlayerWin ? '¡Excelente estrategia!' : isAiWin ? 'La IA fue superior esta vez' : '¡Excelente partida!'}
          </p>
        </div>
      );
    }
    
    if (status === 'draw') {
      return (
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <Users size={48} className="text-blue-500 animate-pulse" />
          </div>
          <div>
            <h2 className={`text-3xl font-light mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              ¡Empate!
            </h2>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent mx-auto"></div>
          </div>
          <p className={`font-light ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            {gameMode === 'pvc' ? 'Igualaste a la IA' : 'Ambos jugaron muy bien'}
          </p>
        </div>
      );
    }

    // Show AI thinking state
    if (isAiTurn) {
      return (
        <div className="text-center space-y-6">
          <h2 className={`text-xl font-light ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            IA pensando...
          </h2>
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-2xl border-3 border-purple-400 bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Brain size={24} className="text-purple-600 animate-pulse" />
            </div>
          </div>
          <p className={`text-sm font-light ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Calculando la mejor jugada...
          </p>
        </div>
      );
    }

    return (
      <div className="text-center space-y-6">
        <h2 className={`text-xl font-light ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          {gameMode === 'pvc' ? (
            currentPlayer === 'X' ? 'Tu turno' : 'Turno de la IA'
          ) : (
            'Turno actual'
          )}
        </h2>
        <div className="flex justify-center">
          <div className={`w-16 h-16 rounded-2xl border-3 flex items-center justify-center text-2xl font-light transition-all duration-500 transform hover:scale-110 ${
            currentPlayer === 'X' 
              ? 'border-blue-400 text-blue-600 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg shadow-blue-500/20 animate-pulse' 
              : 'border-purple-400 text-purple-600 bg-gradient-to-br from-purple-50 to-purple-100 shadow-lg shadow-purple-500/20 animate-pulse'
          }`}>
            {gameMode === 'pvc' && currentPlayer === 'O' ? (
              <Bot size={24} className="text-purple-600" />
            ) : (
              currentPlayer
            )}
          </div>
        </div>
        <p className={`text-sm font-light ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          {gameMode === 'pvc' ? (
            currentPlayer === 'X' ? 'Es tu momento de brillar' : 'La IA está evaluando...'
          ) : (
            'Es tu momento de brillar'
          )}
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {getStatusMessage()}
      
      <div className="text-center">
        <button
          onClick={onRestart}
          className={`inline-flex items-center gap-3 px-8 py-3 border-2 rounded-xl transition-all duration-300 transform hover:scale-105 font-light shadow-md hover:shadow-lg ${
            theme === 'dark'
              ? 'text-gray-300 border-gray-600 hover:bg-white hover:text-gray-900 hover:border-white'
              : 'text-gray-700 border-gray-300 hover:bg-gray-900 hover:text-white hover:border-gray-900'
          }`}
          aria-label="Reiniciar juego"
        >
          <RotateCcw size={20} className="transition-transform duration-300 group-hover:rotate-180" />
          Nuevo Juego
        </button>
      </div>
    </div>
  );
};

export default GameStatus;