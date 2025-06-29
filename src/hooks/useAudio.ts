import { useCallback, useRef } from 'react';
import { GameSettings } from '../types/game';

interface AudioContextType {
  context: AudioContext | null;
  gainNode: GainNode | null;
}

export const useAudio = (settings: GameSettings) => {
  const audioContextRef = useRef<AudioContextType>({ context: null, gainNode: null });

  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current.context && settings.soundEnabled) {
      try {
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        const gainNode = context.createGain();
        gainNode.connect(context.destination);
        gainNode.gain.value = settings.soundVolume;
        
        audioContextRef.current = { context, gainNode };
      } catch (error) {
        console.warn('Audio context not supported:', error);
      }
    }
  }, [settings.soundEnabled, settings.soundVolume]);

  // Update volume when settings change
  useCallback(() => {
    const { gainNode } = audioContextRef.current;
    if (gainNode) {
      gainNode.gain.value = settings.soundVolume;
    }
  }, [settings.soundVolume]);

  const createTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine') => {
    if (!settings.soundEnabled) return;
    
    const { context, gainNode } = audioContextRef.current;
    if (!context || !gainNode) return;

    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    
    oscillator.connect(envelope);
    envelope.connect(gainNode);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    // Envelope for smooth sound
    envelope.gain.setValueAtTime(0, context.currentTime);
    envelope.gain.linearRampToValueAtTime(0.1, context.currentTime + 0.01);
    envelope.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);
    
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + duration);
  }, [settings.soundEnabled]);

  const createTensionTone = useCallback((frequency: number, duration: number, intensity: number = 1) => {
    if (!settings.soundEnabled) return;
    
    const { context, gainNode } = audioContextRef.current;
    if (!context || !gainNode) return;

    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    
    oscillator.connect(envelope);
    envelope.connect(gainNode);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'triangle'; // Triangle wave for more tension
    
    // More aggressive envelope for tension
    const volume = 0.15 * intensity;
    envelope.gain.setValueAtTime(0, context.currentTime);
    envelope.gain.linearRampToValueAtTime(volume, context.currentTime + 0.005);
    envelope.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);
    
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + duration);
  }, [settings.soundEnabled]);

  const playClickSound = useCallback(() => {
    initAudioContext();
    createTone(800, 0.1, 'square');
  }, [initAudioContext, createTone]);

  const playHoverSound = useCallback(() => {
    initAudioContext();
    createTone(600, 0.05, 'sine');
  }, [initAudioContext, createTone]);

  const playTimeWarningSound = useCallback(() => {
    initAudioContext();
    // Initial warning sound at 5 seconds
    createTensionTone(400, 0.3, 0.8);
  }, [initAudioContext, createTensionTone]);

  const playTensionTick = useCallback((secondsLeft: number) => {
    initAudioContext();
    
    // Progressive tension system
    const baseFreq = 600;
    const intensity = (6 - secondsLeft) / 5; // 0.2 to 1.0
    const frequency = baseFreq + (intensity * 400); // 600Hz to 1000Hz
    const duration = Math.max(0.08, 0.15 - (intensity * 0.07)); // Shorter as time runs out
    
    // Create double beep for extra tension on last 3 seconds
    if (secondsLeft <= 3) {
      createTensionTone(frequency, duration, intensity);
      setTimeout(() => {
        createTensionTone(frequency * 1.2, duration * 0.7, intensity * 0.8);
      }, duration * 1000 * 0.6);
    } else {
      createTensionTone(frequency, duration, intensity);
    }
  }, [initAudioContext, createTensionTone]);

  const playTimeUpSound = useCallback(() => {
    initAudioContext();
    // Dramatic time up sequence
    createTensionTone(800, 0.15, 1.2);
    setTimeout(() => createTensionTone(700, 0.15, 1.1), 100);
    setTimeout(() => createTensionTone(600, 0.2, 1.0), 200);
  }, [initAudioContext, createTensionTone]);

  const playWinSound = useCallback(() => {
    initAudioContext();
    const notes = [523, 659, 784, 1047];
    notes.forEach((note, index) => {
      setTimeout(() => createTone(note, 0.3, 'triangle'), index * 100);
    });
  }, [initAudioContext, createTone]);

  const playDrawSound = useCallback(() => {
    initAudioContext();
    createTone(440, 0.4, 'sine');
    setTimeout(() => createTone(440, 0.4, 'sine'), 200);
  }, [initAudioContext, createTone]);

  const playNewGameSound = useCallback(() => {
    initAudioContext();
    createTone(523, 0.15, 'triangle');
    setTimeout(() => createTone(659, 0.15, 'triangle'), 150);
  }, [initAudioContext, createTone]);

  return {
    playClickSound,
    playHoverSound,
    playTimeWarningSound,
    playTensionTick,
    playTimeUpSound,
    playWinSound,
    playDrawSound,
    playNewGameSound,
  };
};