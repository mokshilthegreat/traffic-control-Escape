import { GameSettings, LevelProgress } from '../types/game';

const SETTINGS_KEY = 'tce_game_settings';
const PROGRESS_KEY = 'tce_level_progress';
const HIGH_SCORE_KEY = 'tce_high_score';
const COINS_KEY = 'tce_coins';
const FREE_HINTS_KEY = 'tce_free_hints';

export const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  musicEnabled: true,
  hapticsEnabled: true,
  reducedMotion: false,
  colorblindMode: false,
};

export const loadSettings = (): GameSettings => {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Failed to load settings', e);
  }
  return DEFAULT_SETTINGS;
};

export const saveSettings = (settings: GameSettings): void => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
};

export const loadLevelProgress = (totalLevels: number): Record<number, LevelProgress> => {
  const initial: Record<number, LevelProgress> = {};
  for (let i = 1; i <= totalLevels; i++) {
    initial[i] = {
      stars: 0,
      unlocked: i === 1,
      completed: false,
      highScore: 0,
    };
  }

  try {
    const saved = localStorage.getItem(PROGRESS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...initial, ...parsed };
    }
  } catch (e) {
    console.error('Failed to load level progress', e);
  }

  return initial;
};

export const saveLevelProgress = (progress: Record<number, LevelProgress>): void => {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save level progress', e);
  }
};

export const loadHighScore = (): number => {
  try {
    const saved = localStorage.getItem(HIGH_SCORE_KEY);
    if (saved) {
      return parseInt(saved, 10) || 0;
    }
  } catch (e) {
    console.error('Failed to load high score', e);
  }
  return 0;
};

export const saveHighScore = (score: number): void => {
  try {
    localStorage.setItem(HIGH_SCORE_KEY, score.toString());
  } catch (e) {
    console.error('Failed to save high score', e);
  }
};

export const loadCoins = (): number => {
  try {
    const saved = localStorage.getItem(COINS_KEY);
    if (saved !== null) {
      const parsed = parseInt(saved, 10);
      return isNaN(parsed) ? 100 : parsed;
    }
  } catch (e) {
    console.error('Failed to load coins', e);
  }
  return 100;
};

export const saveCoins = (coins: number): void => {
  try {
    localStorage.setItem(COINS_KEY, Math.max(0, coins).toString());
  } catch (e) {
    console.error('Failed to save coins', e);
  }
};

export const loadFreeHints = (): number => {
  try {
    const saved = localStorage.getItem(FREE_HINTS_KEY);
    if (saved !== null) {
      const parsed = parseInt(saved, 10);
      return isNaN(parsed) ? 3 : parsed;
    }
  } catch (e) {
    console.error('Failed to load free hints', e);
  }
  return 3;
};

export const saveFreeHints = (hints: number): void => {
  try {
    localStorage.setItem(FREE_HINTS_KEY, Math.max(0, hints).toString());
  } catch (e) {
    console.error('Failed to save free hints', e);
  }
};

