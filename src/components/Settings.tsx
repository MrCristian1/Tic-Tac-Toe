import React from 'react';
import { GameSettings } from '../types/game';
import { Settings as SettingsIcon, Volume2, VolumeX, Sun, Moon, Sparkles, Users, Bot, Zap, Brain, Target } from 'lucide-react';

interface SettingsProps {
  settings: GameSettings;
  onUpdateSetting: <K extends keyof GameSettings>(key: K, value: GameSettings[K]) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onUpdateSetting, isOpen, onToggle }) => {
  const cardClass = settings.theme === 'dark' 
    ? 'bg-gray-800/90 border-gray-700/50 text-white' 
    : 'bg-white/90 border-white/50 text-gray-900';

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return <Zap size={14} className="text-green-500" />;
      case 'medium': return <Brain size={14} className="text-yellow-500" />;
      case 'hard': return <Target size={14} className="text-red-500" />;
      default: return null;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-600';
      case 'medium': return 'bg-yellow-600';
      case 'hard': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={`p-3 rounded-xl transition-all duration-300 ${
          settings.theme === 'dark' 
            ? 'bg-gray-800/70 hover:bg-gray-700 text-white' 
            : 'bg-white/70 hover:bg-gray-50 text-gray-700'
        } shadow-lg border ${settings.theme === 'dark' ? 'border-gray-700/50' : 'border-white/50'}`}
        title="Configuración"
      >
        <SettingsIcon size={20} className={isOpen ? 'rotate-90' : ''} />
      </button>

      {isOpen && (
        <div className={`absolute top-16 right-0 w-80 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border ${cardClass} animate-slide-in-right z-50`}>
          <h3 className="text-lg font-light mb-6">Configuración</h3>

          <div className="space-y-6">
            {/* Game Mode */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                {settings.gameMode === 'pvp' ? <Users size={16} /> : <Bot size={16} />}
                <span className="text-sm font-medium">Modo de juego</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onUpdateSetting('gameMode', 'pvp')}
                  className={`p-3 rounded-lg text-sm transition-all ${
                    settings.gameMode === 'pvp'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : settings.theme === 'dark'
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Users size={16} className="mx-auto mb-1" />
                  2 Jugadores
                </button>
                <button
                  onClick={() => onUpdateSetting('gameMode', 'pvc')}
                  className={`p-3 rounded-lg text-sm transition-all ${
                    settings.gameMode === 'pvc'
                      ? 'bg-purple-600 text-white shadow-lg'
                      : settings.theme === 'dark'
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Bot size={16} className="mx-auto mb-1" />
                  vs IA
                </button>
              </div>
            </div>

            {/* AI Difficulty (only show in PvC mode) */}
            {settings.gameMode === 'pvc' && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  {getDifficultyIcon(settings.difficulty)}
                  <span className="text-sm font-medium">Dificultad IA</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(['easy', 'medium', 'hard'] as const).map((difficulty) => (
                    <button
                      key={difficulty}
                      onClick={() => onUpdateSetting('difficulty', difficulty)}
                      className={`p-2 rounded-lg text-xs transition-all ${
                        settings.difficulty === difficulty
                          ? `${getDifficultyColor(difficulty)} text-white shadow-lg`
                          : settings.theme === 'dark'
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        {getDifficultyIcon(difficulty)}
                        <span className="capitalize">{difficulty === 'easy' ? 'Fácil' : difficulty === 'medium' ? 'Medio' : 'Difícil'}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Theme Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {settings.theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
                <span className="text-sm">Tema</span>
              </div>
              <button
                onClick={() => onUpdateSetting('theme', settings.theme === 'light' ? 'dark' : 'light')}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                  settings.theme === 'dark' ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>

            {/* Sound Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {settings.soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                <span className="text-sm">Sonidos</span>
              </div>
              <button
                onClick={() => onUpdateSetting('soundEnabled', !settings.soundEnabled)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.soundEnabled ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                  settings.soundEnabled ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>

            {/* Volume Slider */}
            {settings.soundEnabled && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Volumen</span>
                  <span className="text-xs opacity-70">{Math.round(settings.soundVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={settings.soundVolume}
                  onChange={(e) => onUpdateSetting('soundVolume', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            )}

            {/* Turn Time (only for human players) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Tiempo por turno</span>
                <span className="text-xs opacity-70">{settings.turnTime}s</span>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                step="5"
                value={settings.turnTime}
                onChange={(e) => onUpdateSetting('turnTime', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            {/* Particles Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={16} />
                <span className="text-sm">Efectos visuales</span>
              </div>
              <button
                onClick={() => onUpdateSetting('showParticles', !settings.showParticles)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.showParticles ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              >
                <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                  settings.showParticles ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;