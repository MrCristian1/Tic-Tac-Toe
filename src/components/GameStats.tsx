import React from 'react';
import { GameStats as GameStatsType, GameHistory } from '../types/game';
import { Trophy, Target, Clock, TrendingUp, RotateCcw, Bot, User } from 'lucide-react';

interface GameStatsProps {
  stats: GameStatsType;
  history: GameHistory[];
  onReset: () => void;
  theme: 'light' | 'dark';
}

const GameStats: React.FC<GameStatsProps> = ({ stats, history, onReset, theme }) => {
  const winRate = stats.totalGames > 0 
    ? Math.round(((stats.playerXWins + stats.playerOWins) / stats.totalGames) * 100)
    : 0;

  const aiWinRate = stats.gamesVsAi > 0
    ? Math.round((stats.playerWins / stats.gamesVsAi) * 100)
    : 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const cardClass = theme === 'dark' 
    ? 'bg-gray-800/70 border-gray-700/50 text-white' 
    : 'bg-white/70 border-white/50 text-gray-900';

  return (
    <div className={`backdrop-blur-sm rounded-2xl p-6 shadow-lg border ${cardClass} animate-slide-in-left`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-light flex items-center gap-2">
          <Trophy size={20} className="text-yellow-500" />
          Estadísticas
        </h3>
        <button
          onClick={onReset}
          className={`p-2 rounded-lg transition-colors ${
            theme === 'dark' 
              ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
              : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
          }`}
          title="Reiniciar estadísticas"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-light text-blue-600">{stats.playerXWins}</div>
          <div className="text-sm opacity-70">Victorias X</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-light text-purple-600">{stats.playerOWins}</div>
          <div className="text-sm opacity-70">Victorias O</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-light text-gray-600">{stats.draws}</div>
          <div className="text-sm opacity-70">Empates</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-light">{stats.totalGames}</div>
          <div className="text-sm opacity-70">Total</div>
        </div>
      </div>

      {/* AI Stats Section */}
      {stats.gamesVsAi > 0 && (
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200/50">
          <h4 className="text-sm font-medium text-purple-800 mb-3 flex items-center gap-2">
            <Bot size={16} />
            Estadísticas vs IA
          </h4>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-lg font-light text-green-600">{stats.playerWins}</div>
              <div className="text-xs text-purple-700">Ganaste</div>
            </div>
            <div>
              <div className="text-lg font-light text-red-600">{stats.aiWins}</div>
              <div className="text-xs text-purple-700">IA ganó</div>
            </div>
            <div>
              <div className="text-lg font-light text-purple-600">{aiWinRate}%</div>
              <div className="text-xs text-purple-700">Tu ratio</div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target size={16} className="text-green-500" />
            <span className="text-sm">Tasa de victoria</span>
          </div>
          <span className="font-light">{winRate}%</span>
        </div>

        {stats.currentStreak.count > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-orange-500" />
              <span className="text-sm">Racha actual</span>
            </div>
            <span className="font-light">
              {stats.currentStreak.count} ({stats.currentStreak.player})
            </span>
          </div>
        )}

        {stats.averageGameTime > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-blue-500" />
              <span className="text-sm">Tiempo promedio</span>
            </div>
            <span className="font-light">{formatTime(stats.averageGameTime)}</span>
          </div>
        )}
      </div>

      {history.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200/20">
          <h4 className="text-sm font-light mb-3 opacity-70">Últimas partidas</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {history.slice(0, 5).map((game) => (
              <div key={game.id} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded flex items-center gap-1 ${
                    game.winner === 'X' ? 'bg-blue-100 text-blue-700' :
                    game.winner === 'O' ? 'bg-purple-100 text-purple-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {game.mode === 'pvc' && (
                      <>
                        {game.winner === 'X' ? <User size={10} /> : game.winner === 'O' ? <Bot size={10} /> : null}
                      </>
                    )}
                    {game.winner ? `${game.winner} ganó` : 'Empate'}
                  </span>
                  {game.mode === 'pvc' && game.difficulty && (
                    <span className="text-xs opacity-50 capitalize">
                      {game.difficulty === 'easy' ? 'Fácil' : game.difficulty === 'medium' ? 'Medio' : 'Difícil'}
                    </span>
                  )}
                </div>
                <span className="opacity-50">{formatTime(game.duration)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GameStats;