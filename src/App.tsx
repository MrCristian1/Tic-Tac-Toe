import React, { useState } from 'react';
import { useGame } from './hooks/useGame';
import { useGameStats } from './hooks/useGameStats';
import { useSettings } from './hooks/useSettings';
import GameBoard from './components/GameBoard';
import GameStatus from './components/GameStatus';
import TimerBar from './components/TimerBar';
import GameStats from './components/GameStats';
import Settings from './components/Settings';
import Particles from './components/Particles';
import { Play, Volume2, VolumeX, Users, Bot } from 'lucide-react';

function App() {
  const { settings, updateSetting } = useSettings();
  const { stats, history, updateStats, resetStats } = useGameStats();
  const [showSettings, setShowSettings] = useState(false);
  
  const { gameState, makeMove, restartGame } = useGame(
    settings, 
    (winner, moves, duration) => updateStats(winner, moves, duration, settings.gameMode, settings.difficulty)
  );

  const themeClasses = settings.theme === 'dark' 
    ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white' 
    : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900';

  const getParticleColor = () => {
    if (gameState.status === 'won' && gameState.winner === 'X') return '#3B82F6';
    if (gameState.status === 'won' && gameState.winner === 'O') return '#8B5CF6';
    return '#6B7280';
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${themeClasses} flex items-center justify-center p-8 relative overflow-hidden`}>
      {/* Particles Effect */}
      <Particles 
        isActive={settings.showParticles && gameState.status === 'won'} 
        color={getParticleColor()} 
      />

      <div className="w-full max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Play size={32} className={`${settings.theme === 'dark' ? 'text-white' : 'text-gray-800'} animate-pulse`} />
            <h1 className={`text-4xl font-extralight tracking-wide ${settings.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Tic Tac Toe
            </h1>
            {settings.gameMode === 'pvc' ? (
              <Bot size={24} className={settings.theme === 'dark' ? 'text-purple-300' : 'text-purple-600'} />
            ) : (
              <Users size={24} className={settings.theme === 'dark' ? 'text-blue-300' : 'text-blue-600'} />
            )}
            {settings.soundEnabled ? (
              <Volume2 size={24} className={settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} />
            ) : (
              <VolumeX size={24} className={settings.theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} />
            )}
          </div>
          <div className={`w-24 h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto`}></div>
          <p className={`text-sm mt-2 font-light ${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            {settings.gameMode === 'pvc' 
              ? `Modo IA • Dificultad: ${settings.difficulty === 'easy' ? 'Fácil' : settings.difficulty === 'medium' ? 'Medio' : 'Difícil'}`
              : 'Modo 2 Jugadores • Experiencia completa con sonidos y estadísticas'
            }
          </p>
        </div>

        {/* Settings Button */}
        <div className="fixed top-8 right-8 z-50">
          <Settings
            settings={settings}
            onUpdateSetting={updateSetting}
            isOpen={showSettings}
            onToggle={() => setShowSettings(!showSettings)}
          />
        </div>

        {/* Main Game Layout */}
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Left Side - Game Information */}
          <div className="space-y-6 order-2 lg:order-1">
            {/* Timer Bar - Only show for human players */}
            {gameState.status === 'playing' && !gameState.isAiTurn && (
              <div className={`backdrop-blur-sm rounded-2xl p-6 shadow-lg border animate-slide-in-left ${
                settings.theme === 'dark' 
                  ? 'bg-gray-800/70 border-gray-700/50' 
                  : 'bg-white/70 border-white/50'
              }`}>
                <TimerBar
                  timeLeft={gameState.timeLeft}
                  totalTime={gameState.totalTime}
                  currentPlayer={gameState.currentPlayer}
                  theme={settings.theme}
                />
              </div>
            )}

            {/* Game Status */}
            <div className={`backdrop-blur-sm rounded-2xl p-8 shadow-lg border animate-slide-in-left animation-delay-200 ${
              settings.theme === 'dark' 
                ? 'bg-gray-800/70 border-gray-700/50' 
                : 'bg-white/70 border-white/50'
            }`}>
              <GameStatus
                currentPlayer={gameState.currentPlayer}
                status={gameState.status}
                winner={gameState.winner}
                onRestart={restartGame}
                theme={settings.theme}
                gameMode={settings.gameMode}
                isAiTurn={gameState.isAiTurn}
              />
            </div>

            {/* Game Instructions */}
            <div className={`backdrop-blur-sm rounded-xl p-6 shadow-md border animate-slide-in-left animation-delay-400 ${
              settings.theme === 'dark' 
                ? 'bg-gray-800/50 border-gray-700/30' 
                : 'bg-white/50 border-white/30'
            }`}>
              <h3 className={`text-lg font-light mb-3 ${settings.theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                Cómo jugar
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                  <span className={settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                    Conecta tres símbolos en línea
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                  <span className={settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                    {settings.gameMode === 'pvc' 
                      ? 'Juega contra la IA inteligente'
                      : `Tienes ${settings.turnTime} segundos por turno`
                    }
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                  <span className={settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                    {settings.gameMode === 'pvc' 
                      ? `Dificultad: ${settings.difficulty === 'easy' ? 'Fácil' : settings.difficulty === 'medium' ? 'Medio' : 'Difícil'}`
                      : 'El tiempo se reinicia cada jugada'
                    }
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                  <span className={settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                    Sonidos y efectos incluidos
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Center - Game Board */}
          <div className="flex justify-center order-1 lg:order-2">
            <div className="animate-slide-in-right">
              <GameBoard
                board={gameState.board}
                onCellClick={makeMove}
                disabled={gameState.status !== 'playing' || gameState.isAiTurn}
                timeLeft={gameState.timeLeft}
                winningLine={gameState.winningLine}
                settings={settings}
              />
            </div>
          </div>

          {/* Right Side - Statistics */}
          <div className="order-3">
            <GameStats
              stats={stats}
              history={history}
              onReset={resetStats}
              theme={settings.theme}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 animate-fade-in animation-delay-600">
          <p className={`text-sm font-light ${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Diseñado con React y Tailwind CSS • IA con algoritmo Minimax • Audio Web API • Estadísticas persistentes
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;