import React from 'react';
import { ArrowLeft, Lock, Star, Check } from 'lucide-react';
import { LevelDefinition, LevelProgress } from '../types/game';
import { sound } from '../utils/audio';

interface Props {
  levels: LevelDefinition[];
  progress: Record<number, LevelProgress>;
  currentLevelId: number;
  onSelectLevel: (levelId: number) => void;
  onBack: () => void;
}

export const LevelSelectScreen: React.FC<Props> = ({
  levels,
  progress,
  currentLevelId,
  onSelectLevel,
  onBack,
}) => {
  return (
    <div className="relative w-full h-full flex flex-col bg-[#13171D] text-white select-none overflow-hidden">
      {/* Top Header */}
      <header className="px-5 pt-8 pb-3 bg-[#1A1F26] border-b border-[#2C333D] flex items-center justify-between shrink-0">
        <button
          onClick={() => {
            sound.playButton();
            onBack();
          }}
          className="w-10 h-10 rounded-2xl bg-slate-800 hover:bg-slate-750 active:scale-95 flex items-center justify-center text-slate-300 border border-[#2C333D] transition"
          title="Back to Home"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center">
          <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Campaign</span>
          <h1 className="text-sm font-black tracking-wider text-white">
            SELECT LEVEL (30)
          </h1>
        </div>

        <div className="w-10" />
      </header>

      {/* Grid of 30 Level Cards */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-700">
        <div className="max-w-md mx-auto grid grid-cols-5 gap-2.5">
          {levels.map((lvl) => {
            const lvlProgress = progress[lvl.id] || {
              unlocked: lvl.id === 1,
              completed: false,
              stars: 0,
              highScore: 0,
            };

            const isCurrent = lvl.id === currentLevelId;
            const isUnlocked = lvlProgress.unlocked;

            return (
              <button
                key={lvl.id}
                id={`level-card-${lvl.id}`}
                disabled={!isUnlocked}
                onClick={() => {
                  sound.playButton();
                  onSelectLevel(lvl.id);
                }}
                className={`relative aspect-square rounded-2xl flex flex-col items-center justify-between p-2 transition-all duration-150 active:scale-95 border ${
                  !isUnlocked
                    ? 'bg-[#1A1F26]/40 border-[#2C333D]/50 text-slate-600 cursor-not-allowed opacity-50'
                    : isCurrent
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 border-emerald-300 text-white shadow-lg shadow-emerald-950/40 scale-105'
                    : lvlProgress.completed
                    ? 'bg-slate-800 border-[#2C333D] text-slate-200 hover:border-slate-600'
                    : 'bg-slate-800/80 border-[#2C333D] text-slate-300'
                }`}
              >
                {/* Top Status Icon */}
                <div className="w-full flex items-center justify-between">
                  <span className="text-xs font-black">{lvl.id}</span>
                  {!isUnlocked ? (
                    <Lock className="w-3 h-3 text-slate-600" />
                  ) : lvlProgress.completed ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : null}
                </div>

                {/* Stars Display */}
                <div className="flex items-center gap-0.5 my-auto">
                  {isUnlocked ? (
                    [1, 2, 3].map((s) => (
                      <Star
                        key={s}
                        className={`w-2.5 h-2.5 ${
                          s <= lvlProgress.stars
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-700 fill-slate-800'
                        }`}
                      />
                    ))
                  ) : (
                    <span className="text-[8px] text-slate-600 font-bold">LOCKED</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
