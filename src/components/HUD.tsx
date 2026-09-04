import React from 'react';
import { Heart, Pause, Trophy, Flame, HelpCircle } from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  levelNumber: number;
  levelTitle?: string;
  score: number;
  lives: number;
  coins: number;
  freeHints: number;
  exitedCount: number;
  totalVehicles: number;
  streak: number;
  onPause: () => void;
  onOpenHint: () => void;
}

export const HUD: React.FC<Props> = ({
  levelNumber,
  levelTitle,
  score,
  lives,
  coins,
  freeHints,
  exitedCount,
  totalVehicles,
  streak,
  onPause,
  onOpenHint,
}) => {
  return (
    <header className="w-full bg-[#1A1F26]/95 backdrop-blur-xl border-b border-[#2C333D] z-30 flex flex-col select-none shrink-0">
      {/* Top Row: Level & Coins & Hints & Lives */}
      <div className="px-3 sm:px-5 pt-[max(0.45rem,env(safe-area-inset-top))] sm:pt-3.5 pb-1 flex justify-between items-center gap-2">
        <div className="flex flex-col min-w-0 shrink">
          <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-slate-400 font-bold leading-none truncate">
            Level {levelNumber}
          </span>
          <span className="text-sm sm:text-base font-black text-white tracking-tight leading-tight mt-0.5 truncate">
            {(levelTitle || 'City Grid').toUpperCase()}
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Hint Button */}
          <button
            id="btn-hint-hud"
            onClick={() => {
              sound.playButton();
              onOpenHint();
            }}
            className="h-7 px-2 sm:px-2.5 rounded-full bg-slate-800 hover:bg-slate-700 active:scale-95 border border-amber-500/40 flex items-center gap-1 text-xs font-bold text-amber-300 transition shadow"
            title="Get a Hint"
          >
            <span className="font-black text-amber-400">?</span>
            <span className="text-[11px] font-mono font-bold text-amber-200">
              {freeHints}
            </span>
          </button>

          {/* Coins Display */}
          <div
            className="h-7 px-2 sm:px-2.5 rounded-full bg-slate-800/90 border border-amber-500/20 flex items-center gap-1 text-xs font-bold text-amber-300 shadow-sm"
            title="Coins"
          >
            <span className="text-xs">💰</span>
            <span className="text-[11px] font-mono font-bold text-amber-200">
              {coins}
            </span>
          </div>

          {/* Lives (Hearts) */}
          <div className="flex items-center gap-0.5 sm:gap-1 text-[#FF4444] ml-0.5">
            {[1, 2, 3].map((heartIndex) => (
              <span
                key={heartIndex}
                className={`text-xs sm:text-sm transition-transform duration-300 ${
                  heartIndex <= lives
                    ? 'opacity-100 scale-100'
                    : 'opacity-20 grayscale scale-75'
                }`}
              >
                ❤️
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Score & Exited Counters */}
      <div className="px-4 sm:px-5 pb-2 flex justify-between items-end">
        <div className="flex flex-col">
          <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold leading-none">
            Score
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-sm sm:text-base font-mono text-cyan-400 font-bold tracking-wider">
              {score.toString().padStart(5, '0')}
            </span>
            {streak > 1 && (
              <span className="text-[9px] font-black text-rose-400 bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.5 rounded-md uppercase tracking-wider animate-pulse">
                x{streak} Combo
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold leading-none">
            Exited
          </span>
          <span className="text-sm sm:text-base font-bold text-white mt-0.5">
            {exitedCount} <span className="text-slate-500 font-normal">/ {totalVehicles}</span>
          </span>
        </div>
      </div>
    </header>
  );
};
