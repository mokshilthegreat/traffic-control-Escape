/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  GameScreenState,
  GameplayStatus,
  GameSettings,
  LevelProgress,
  VehicleDefinition,
  TrafficLightDefinition,
  BarrierDefinition,
  HintResult,
} from './types/game';
import { ALL_LEVELS } from './data/levels';
import {
  loadSettings,
  saveSettings,
  loadLevelProgress,
  saveLevelProgress,
  loadHighScore,
  saveHighScore,
  loadCoins,
  saveCoins,
  loadFreeHints,
  saveFreeHints,
} from './utils/storage';
import { sound } from './utils/audio';
import { getNextGameHint } from './utils/hintSolver';

// Screens & Modals
import { SplashScreen } from './screens/SplashScreen';
import { HomeScreen } from './screens/HomeScreen';
import { LevelSelectScreen } from './screens/LevelSelectScreen';
import { GameBoard } from './components/GameBoard';
import { HUD } from './components/HUD';
import { PauseModal } from './components/PauseModal';
import { LevelCompleteModal } from './components/LevelCompleteModal';
import { GameOverModal } from './components/GameOverModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { SettingsModal } from './components/SettingsModal';
import { FirstTimeTutorialModal } from './components/FirstTimeTutorialModal';
import { HintModal } from './components/HintModal';

export default function App() {
  const [screenState, setScreenState] = useState<GameScreenState>('splash');
  const [gameplayStatus, setGameplayStatus] = useState<GameplayStatus>('ready');

  // Persistence State
  const [settings, setSettings] = useState<GameSettings>(() => loadSettings());
  const [levelProgress, setLevelProgress] = useState<Record<number, LevelProgress>>(() =>
    loadLevelProgress(ALL_LEVELS.length)
  );
  const [highScore, setHighScore] = useState<number>(() => loadHighScore());
  const [coins, setCoins] = useState<number>(() => loadCoins());
  const [freeHints, setFreeHints] = useState<number>(() => loadFreeHints());

  // Tutorial and Ready State
  const [hasSeenTutorial, setHasSeenTutorial] = useState<boolean>(() => {
    try {
      return localStorage.getItem('tce_tutorial_seen') === 'true';
    } catch {
      return false;
    }
  });
  const [showFirstTimeTutorial, setShowFirstTimeTutorial] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [isReadyToStartLevel, setIsReadyToStartLevel] = useState<boolean>(false);

  // Hint & Restart Modals State
  const [showHintModal, setShowHintModal] = useState<boolean>(false);
  const [activeHint, setActiveHint] = useState<HintResult | null>(null);
  const [hintExpiresAt, setHintExpiresAt] = useState<number>(0);
  const [levelAttempt, setLevelAttempt] = useState<number>(0);
  const [earnedCoinsReward, setEarnedCoinsReward] = useState<number>(50);

  // Latest board state snapshot ref for hint calculations
  const gameStateRef = useRef<{
    vehicles: VehicleDefinition[];
    trafficLights: TrafficLightDefinition[];
    barriers: BarrierDefinition[];
  }>({
    vehicles: [],
    trafficLights: [],
    barriers: [],
  });

  // Current Level State
  const [currentLevelId, setCurrentLevelId] = useState<number>(1);
  const [lives, setLives] = useState<number>(3);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [exitedCount, setExitedCount] = useState<number>(0);

  // Completed Level Modal Results
  const [completedStars, setCompletedStars] = useState<number>(3);
  const [completedBonus, setCompletedBonus] = useState<number>(500);

  // Undo System State
  const [undoTrigger, setUndoTrigger] = useState<number>(0);
  const [canUndo, setCanUndo] = useState<boolean>(false);

  // Sync sound settings with audio system
  useEffect(() => {
    sound.setSoundEnabled(settings.soundEnabled);
    sound.setMusicEnabled(settings.musicEnabled);
  }, [settings.soundEnabled, settings.musicEnabled]);

  // Derived state: latest unlocked level and total stars
  const latestUnlockedLevel = useMemo(() => {
    let latest = 1;
    for (let i = 1; i <= ALL_LEVELS.length; i++) {
      if (levelProgress[i]?.unlocked) latest = i;
    }
    return latest;
  }, [levelProgress]);

  const totalStars = useMemo(() => {
    return (Object.values(levelProgress) as LevelProgress[]).reduce(
      (sum, p) => sum + (p.stars || 0),
      0
    );
  }, [levelProgress]);

  const maxStars = ALL_LEVELS.length * 3;

  const currentLevel = useMemo(() => {
    return ALL_LEVELS.find((l) => l.id === currentLevelId) || ALL_LEVELS[0];
  }, [currentLevelId]);

  // Start Playing a Level
  const startLevel = useCallback(
    (levelId: number) => {
      setCurrentLevelId(levelId);
      setLives(3);
      setStreak(0);
      setExitedCount(0);
      setActiveHint(null);
      setCanUndo(false);
      setLevelAttempt((prev) => prev + 1);
      setGameplayStatus('playing');
      setScreenState('gameplay');

      // Check if first-time tutorial should be shown (for Level 1)
      let tutorialSeen = false;
      try {
        tutorialSeen = localStorage.getItem('tce_tutorial_seen') === 'true';
      } catch {
        tutorialSeen = false;
      }

      if (levelId === 1 && !tutorialSeen) {
        setShowFirstTimeTutorial(true);
        setIsReadyToStartLevel(true);
      } else {
        setShowFirstTimeTutorial(false);
        setIsReadyToStartLevel(false);
      }
    },
    []
  );

  // Complete First-Time Tutorial
  const handleCompleteTutorial = useCallback(() => {
    try {
      localStorage.setItem('tce_tutorial_seen', 'true');
    } catch {}
    setHasSeenTutorial(true);
    setShowFirstTimeTutorial(false);
    setIsReadyToStartLevel(false);
    setGameplayStatus('playing');
  }, []);

  // Restart the CURRENT level and immediately return to active gameplay.
  // This intentionally closes every in-game overlay so the player never gets
  // stuck on a black/paused/modal state.
  const restartCurrentLevel = useCallback(() => {
    sound.playButton();

    // Reset current-attempt gameplay state.
    setLives(3);
    setStreak(0);
    setExitedCount(0);
    setScore(0);
    setActiveHint(null);
    setHintExpiresAt(0);
    setCanUndo(false);

    // Force GameBoard to remount and rebuild the current level.
    setLevelAttempt((prev) => prev + 1);

    // Close ALL gameplay overlays/modals.
    setShowHintModal(false);
    setShowHelpModal(false);
    setShowFirstTimeTutorial(false);
    setIsReadyToStartLevel(false);

    // Stay on the same level and resume immediately.
    setScreenState('gameplay');
    setGameplayStatus('playing');
  }, []);

  // Trigger Undo of the Last Valid Move (vehicles, lights, barriers)
  const handleTriggerUndo = useCallback(() => {
    sound.playButton();
    setUndoTrigger((prev) => prev + 1);
  }, []);

  // Use Free Hint
  const handleUseFreeHint = useCallback(() => {
    if (freeHints <= 0) return;
    const newCount = freeHints - 1;
    setFreeHints(newCount);
    saveFreeHints(newCount);
    setShowHintModal(false);

    const hint = getNextGameHint(
      currentLevel,
      gameStateRef.current.vehicles.length > 0 ? gameStateRef.current.vehicles : currentLevel.vehicles,
      gameStateRef.current.trafficLights.length > 0 ? gameStateRef.current.trafficLights : currentLevel.trafficLights,
      gameStateRef.current.barriers.length > 0 ? gameStateRef.current.barriers : currentLevel.barriers
    );
    setActiveHint(hint);
    setHintExpiresAt(Date.now() + 8500);
  }, [freeHints, currentLevel]);

  // Use Coin Hint (100 coins)
  const handleUseCoinHint = useCallback(() => {
    if (coins < 100) return;
    const newCoins = coins - 100;
    setCoins(newCoins);
    saveCoins(newCoins);
    setShowHintModal(false);

    const hint = getNextGameHint(
      currentLevel,
      gameStateRef.current.vehicles.length > 0 ? gameStateRef.current.vehicles : currentLevel.vehicles,
      gameStateRef.current.trafficLights.length > 0 ? gameStateRef.current.trafficLights : currentLevel.trafficLights,
      gameStateRef.current.barriers.length > 0 ? gameStateRef.current.barriers : currentLevel.barriers
    );
    setActiveHint(hint);
    setHintExpiresAt(Date.now() + 8500);
  }, [coins, currentLevel]);

  // Auto clear hint when duration expires
  useEffect(() => {
    if (!activeHint || hintExpiresAt === 0) return;
    const remaining = Math.max(100, hintExpiresAt - Date.now());
    const timer = setTimeout(() => {
      setActiveHint(null);
    }, remaining);
    return () => clearTimeout(timer);
  }, [activeHint, hintExpiresAt]);

  // Handle Vehicle Reached Exit
  const handleVehicleExit = useCallback(
    (vehicle: VehicleDefinition) => {
      setExitedCount((prev) => prev + 1);
      setStreak((prev) => {
        const nextStreak = prev + 1;
        if (nextStreak > 1) {
          sound.playCombo();
        }
        return nextStreak;
      });

      const exitPoints = 100 * Math.max(1, streak + 1);
      setScore((prev) => {
        const newScore = prev + exitPoints;
        if (newScore > highScore) {
          setHighScore(newScore);
          saveHighScore(newScore);
        }
        return newScore;
      });
    },
    [streak, highScore]
  );

  // Handle Collision (Loss of Life)
  const handleCollision = useCallback(() => {
    setStreak(0); // Reset combo streak on mistake
    setLives((prev) => {
      const nextLives = prev - 1;
      if (nextLives <= 0) {
        sound.playGameOver();
        setGameplayStatus('game_over');
        return 0;
      }
      return nextLives;
    });
  }, []);

  // Handle Level Complete
  const handleLevelComplete = useCallback(
    (starsAwarded: number, finalScore: number) => {
      setCompletedStars(starsAwarded);
      setCompletedBonus(500);
      setGameplayStatus('level_complete');
      setActiveHint(null);

      // Award Coins: 50 base + 25 for 3-star + 100 for milestone levels (every 5 levels)
      let reward = 50;
      if (starsAwarded === 3) reward += 25;
      if (currentLevelId % 5 === 0) reward += 100;

      setEarnedCoinsReward(reward);
      setCoins((prev) => {
        const next = prev + reward;
        saveCoins(next);
        return next;
      });

      // Update progress record
      setLevelProgress((prev) => {
        const currentRecord = prev[currentLevelId] || {
          unlocked: true,
          completed: false,
          stars: 0,
          highScore: 0,
        };

        const updated: Record<number, LevelProgress> = {
          ...prev,
          [currentLevelId]: {
            ...currentRecord,
            completed: true,
            stars: Math.max(currentRecord.stars, starsAwarded),
            highScore: Math.max(currentRecord.highScore, finalScore),
          },
        };

        // Unlock next level if exists
        const nextId = currentLevelId + 1;
        if (nextId <= ALL_LEVELS.length) {
          updated[nextId] = {
            stars: prev[nextId]?.stars || 0,
            completed: prev[nextId]?.completed || false,
            highScore: prev[nextId]?.highScore || 0,
            unlocked: true,
          };
        }

        saveLevelProgress(updated);
        return updated;
      });
    },
    [currentLevelId]
  );

  // Handle Next Level
  const handleNextLevel = useCallback(() => {
    const nextId = currentLevelId + 1;
    if (nextId <= ALL_LEVELS.length) {
      startLevel(nextId);
    } else {
      setScreenState('level_select');
    }
  }, [currentLevelId, startLevel]);

  // Handle Settings Update
  const handleUpdateSettings = useCallback((newSettings: GameSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  }, []);

  // Handle Progress Reset
  const handleResetProgress = useCallback(() => {
    const fresh = loadLevelProgress(ALL_LEVELS.length);
    for (let i = 1; i <= ALL_LEVELS.length; i++) {
      fresh[i] = { unlocked: i === 1, completed: false, stars: 0, highScore: 0 };
    }
    setLevelProgress(fresh);
    saveLevelProgress(fresh);
    setScore(0);
    setHighScore(0);
    saveHighScore(0);
    setCurrentLevelId(1);
  }, []);

  return (
    <div className="w-full h-[100dvh] max-h-[100dvh] bg-[#0F1218] flex items-center justify-center p-0 sm:p-2 lg:p-4 font-sans text-white select-none overflow-hidden box-border">
      {/* Mobile Device Frame Container */}
      <main
        id="app-container"
        className="w-full max-w-[420px] h-[100dvh] max-h-[100dvh] sm:h-[min(calc(100dvh-1rem),840px)] sm:max-h-[min(calc(100dvh-1rem),840px)] bg-[#1A1F26] rounded-none sm:rounded-[36px] shadow-2xl border-0 sm:border-[8px] border-[#2C333D] relative flex flex-col overflow-hidden box-border shrink-0"
      >
        {/* Top Speaker/Camera Notch */}
        <div className="hidden sm:block absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-[#2C333D] rounded-full z-50 pointer-events-none" />

        {/* Screen 1: Splash */}
        {screenState === 'splash' && (
          <SplashScreen onStart={() => setScreenState('home')} />
        )}

        {/* Screen 2: Home */}
        {screenState === 'home' && (
          <HomeScreen
            latestUnlockedLevel={latestUnlockedLevel}
            totalStars={totalStars}
            maxStars={maxStars}
            highScore={highScore}
            onPlay={() => startLevel(latestUnlockedLevel)}
            onOpenLevels={() => setScreenState('level_select')}
            onOpenHowToPlay={() => setScreenState('how_to_play')}
            onOpenSettings={() => setScreenState('settings')}
          />
        )}

        {/* Screen 3: Level Select */}
        {screenState === 'level_select' && (
          <LevelSelectScreen
            levels={ALL_LEVELS}
            progress={levelProgress}
            currentLevelId={latestUnlockedLevel}
            onSelectLevel={(id) => startLevel(id)}
            onBack={() => setScreenState('home')}
          />
        )}

        {/* Screen 4: Gameplay */}
        {screenState === 'gameplay' && (
          <div className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-[#13171D]">
            {/* Top HUD with Level Title, Lives, Score, Coins, and Hint */}
            <HUD
              levelNumber={currentLevel.id}
              levelTitle={currentLevel.title}
              score={score}
              lives={lives}
              coins={coins}
              freeHints={freeHints}
              exitedCount={exitedCount}
              totalVehicles={currentLevel.vehicles.length}
              streak={streak}
              onPause={() => setGameplayStatus('paused')}
              onOpenHint={() => setShowHintModal(true)}
            />

            {/* Active Hint Banner */}
            {activeHint && (
              <div className="w-full px-3.5 py-1.5 bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-amber-500/20 border-b border-amber-500/40 flex items-center justify-between text-xs text-amber-300 z-30 shrink-0 select-none animate-fadeIn">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm shrink-0">💡</span>
                  <span className="font-extrabold uppercase tracking-wide truncate text-[11px]">
                    {activeHint.message}
                  </span>
                </div>
                <button
                  onClick={() => setActiveHint(null)}
                  className="text-slate-400 hover:text-white text-xs px-1.5 py-0.5 rounded hover:bg-white/10 shrink-0 ml-2"
                  title="Dismiss Hint"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Main Interactive Road Game Board */}
            <div className="flex-1 min-h-0 w-full relative overflow-hidden flex items-center justify-center bg-[#13171D] p-1">
              <GameBoard
                key={`${currentLevel.id}-attempt-${levelAttempt}`}
                level={currentLevel}
                settings={settings}
                lives={lives}
                score={score}
                streak={streak}
                onVehicleExit={handleVehicleExit}
                onCollision={handleCollision}
                onLevelComplete={handleLevelComplete}
                onGameOver={() => setGameplayStatus('game_over')}
                isPaused={
                  gameplayStatus !== 'playing' ||
                  showFirstTimeTutorial ||
                  showHelpModal ||
                  showHintModal
                }
                isReadyToStart={isReadyToStartLevel}
                onStartLevel={() => {
                  setIsReadyToStartLevel(false);
                  setGameplayStatus('playing');
                }}
                activeHint={activeHint}
                onClearHint={() => setActiveHint(null)}
                onStateUpdate={(st) => {
                  gameStateRef.current = st;
                }}
                undoTrigger={undoTrigger}
                onCanUndoChange={setCanUndo}
              />
            </div>

            {/* Instruction strip */}
            <div className="w-full px-3 py-1.5 bg-[#171C23] border-t border-b border-[#2C333D]/70 flex items-center justify-center text-center shrink-0 z-20">
              <span className="text-[11px] sm:text-xs font-semibold text-slate-300 tracking-wide select-none">
                Tap a car to move • Tap traffic lights to control traffic
              </span>
            </div>

            {/* Control Buttons */}
            <div className="w-full px-3 sm:px-4 py-2 sm:py-2.5 pb-[max(0.6rem,env(safe-area-inset-bottom))] bg-[#1A1F26] border-t border-[#2C333D] flex justify-between items-center z-20 gap-2 sm:gap-3 select-none shrink-0">
              {/* Pause Button */}
              <button
                id="btn-pause-bottom"
                onClick={() => {
                  sound.playButton();
                  setGameplayStatus('paused');
                }}
                className="w-10 h-10 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700/60 flex items-center justify-center text-base text-slate-200 transition-all shadow shrink-0"
                title="Pause"
              >
                ⏸
              </button>

              {/* Center Controls: Undo and Restart */}
              <div className="flex items-center gap-2">
                <button
                  id="btn-undo-bottom"
                  disabled={!canUndo}
                  onClick={handleTriggerUndo}
                  className={`h-10 px-3 sm:px-3.5 rounded-2xl border text-xs font-bold flex items-center gap-1.5 transition-all shadow shrink-0 active:scale-95 ${
                    canUndo
                      ? 'bg-slate-800 hover:bg-slate-700 border-amber-500/50 text-amber-300 cursor-pointer'
                      : 'bg-slate-800/40 border-slate-700/40 text-slate-600 cursor-not-allowed opacity-50'
                  }`}
                  title="Undo Last Action"
                >
                  <span className="text-base leading-none">↶</span>
                  <span className="text-[11px] uppercase tracking-wider font-extrabold">Undo</span>
                </button>

                <button
                  id="btn-restart-bottom"
                  onClick={() => {
                    restartCurrentLevel();
                  }}
                  className="h-10 px-3 sm:px-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700/60 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-all shadow shrink-0"
                  title="Restart Level"
                >
                  <span className="text-base leading-none">↻</span>
                  <span className="text-[11px] uppercase tracking-wider font-extrabold">Restart</span>
                </button>
              </div>

              {/* Settings Button */}
              <button
                id="btn-settings-bottom"
                onClick={() => {
                  sound.playButton();
                  setScreenState('settings');
                }}
                className="w-10 h-10 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700/60 flex items-center justify-center text-base text-slate-200 transition-all shadow shrink-0"
                title="Settings"
              >
                ⚙️
              </button>
            </div>

            {/* In-Game Help Modal */}
            {showHelpModal && (
              <HowToPlayModal onClose={() => setShowHelpModal(false)} />
            )}

            {/* Hint Modal */}
            {showHintModal && (
              <HintModal
                freeHints={freeHints}
                coins={coins}
                onUseFreeHint={handleUseFreeHint}
                onUseCoinHint={handleUseCoinHint}
                onOpenHowToPlay={() => setShowHelpModal(true)}
                onClose={() => setShowHintModal(false)}
              />
            )}

            {/* First Time / Interactive Tutorial Modal */}
            {showFirstTimeTutorial && (
              <FirstTimeTutorialModal onComplete={handleCompleteTutorial} />
            )}

            {/* Overlays / Modals */}
            {gameplayStatus === 'paused' && (
              <PauseModal
                soundEnabled={settings.soundEnabled}
                musicEnabled={settings.musicEnabled}
                onResume={() => setGameplayStatus('playing')}
                onRestart={() => {
                  restartCurrentLevel();
                }}
                onOpenHowToPlay={() => {
                  setShowHelpModal(true);
                }}
                onToggleSound={() =>
                  handleUpdateSettings({ ...settings, soundEnabled: !settings.soundEnabled })
                }
                onToggleMusic={() =>
                  handleUpdateSettings({ ...settings, musicEnabled: !settings.musicEnabled })
                }
                onHome={() => {
                  setGameplayStatus('ready');
                  setScreenState('home');
                }}
              />
            )}

            {gameplayStatus === 'level_complete' && (
              <LevelCompleteModal
                levelNumber={currentLevel.id}
                stars={completedStars}
                score={completedBonus}
                coinsAwarded={earnedCoinsReward}
                hasNextLevel={currentLevel.id < ALL_LEVELS.length}
                onNextLevel={handleNextLevel}
                onReplay={() => restartCurrentLevel()}
                onOpenLevels={() => setScreenState('level_select')}
              />
            )}

            {gameplayStatus === 'game_over' && (
              <GameOverModal
                levelNumber={currentLevel.id}
                score={score}
                onRetry={() => restartCurrentLevel()}
                onOpenLevels={() => setScreenState('level_select')}
                onHome={() => {
                  setGameplayStatus('ready');
                  setScreenState('home');
                }}
              />
            )}
          </div>
        )}

        {/* Modal: How to Play */}
        {screenState === 'how_to_play' && (
          <HowToPlayModal
            onClose={() => {
              if (gameplayStatus === 'paused') {
                setScreenState('gameplay');
              } else {
                setScreenState('home');
              }
            }}
          />
        )}

        {/* Modal: Settings */}
        {screenState === 'settings' && (
          <SettingsModal
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onResetProgress={handleResetProgress}
            onClose={() => {
              // If Settings was opened from active/paused gameplay,
              // return to the gameplay screen instead of Home.
              if (gameplayStatus === 'playing' || gameplayStatus === 'paused') {
                setScreenState('gameplay');
              } else {
                setScreenState('home');
              }
            }}
          />
        )}
      </main>

      {/* Desktop Companion Sidebar from Clean Minimalism Design */}
      <aside className="hidden lg:flex flex-col ml-12 w-80 text-left shrink-0">
        <h1 className="text-4xl font-black tracking-tighter mb-4 leading-none text-white">
          TRAFFIC<br />
          <span className="text-emerald-500">CONTROL</span><br />
          ESCAPE
        </h1>
        <p className="text-slate-400 text-sm mb-8 leading-relaxed">
          A strategy-based road network puzzle. Manage intersections, time the lights, and clear the city grid without collisions.
        </p>
        <div className="space-y-4">
          <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-2xl border border-white/5">
            <div className="w-10 h-10 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-400 text-lg">
              🚕
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-200">TAXI UNIT</h3>
              <p className="text-[10px] text-slate-500 uppercase">Fast Acceleration</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-2xl border border-white/5">
            <div className="w-10 h-10 rounded-full bg-blue-400/20 flex items-center justify-center text-blue-400 text-lg">
              🚌
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-200">CITY BUS</h3>
              <p className="text-[10px] text-slate-500 uppercase">Slow • Heavy Length</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-2xl border border-white/5">
            <div className="w-10 h-10 rounded-full bg-red-400/20 flex items-center justify-center text-red-400 text-lg">
              🚑
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-200">EMERGENCY UNIT</h3>
              <p className="text-[10px] text-slate-500 uppercase">Priority Clearance</p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
