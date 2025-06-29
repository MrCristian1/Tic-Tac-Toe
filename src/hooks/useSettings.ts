import { useState, useCallback, useEffect } from 'react';
import { GameSettings, Theme, GameMode, Difficulty } from '../types/game';

const SETTINGS_KEY = 'tic-tac-toe-settings';

const defaultSettings: GameSettings = {
  turnTime: 15,
  soundEnabled: true,
  soundVolume: 0.3,
  theme: 'light',
  showParticles: true,
  gameMode: 'pvp',
  difficulty: 'medium',
};

export const useSettings = () => {
  const [settings, setSettings] = useState<GameSettings>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    if (savedSettings) {
      setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSetting = useCallback(<K extends keyof GameSettings>(
    key: K,
    value: GameSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
    localStorage.removeItem(SETTINGS_KEY);
  }, []);

  return {
    settings,
    updateSetting,
    resetSettings,
  };
};