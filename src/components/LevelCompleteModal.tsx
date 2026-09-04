import React from 'react';
import { motion } from 'motion/react';
import { Star, Play, RotateCcw, Grid, Trophy } from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  levelNumber: number;
  stars: number;
  score: number;
  coinsAwarded?: number;
  hasNextLevel: boolean;
  onNextLevel: () => void;
  onReplay: () => void;
  onOpenLevels: () => void;
}

export const LevelCompleteModal: React.FC<Props> = ({
  levelNumber,
  stars,
  score,
  coinsAwarded = 50,
  hasNextLevel,
  onNextLevel,
  onReplay,
  onOpenLevels,
}) => {
  return (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn select-none">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 18 }}
        className="w-full max-w-xs bg-[#1A1F26] border border-[#2C333D] rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-4 text-center"
      >
        {/* Banner */}
        <div>
          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
            ROAD CLEARED
          </span>
          <h2 className="text-xl font-black text-white tracking-wide mt-0.5">
            LEVEL {levelNumber} COMPLETE
          </h2>
        </div>

        {/* 3 Stars Container */}
        <div className="flex items-center gap-2.5 my-1">
          {[1, 2, 3].map((starIdx) => {
            const isEarned = starIdx <= stars;
            return (
              <motion.div
                key={starIdx}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15 * starIdx, type: 'spring' }}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow ${
                  isEarned
                    ? 'bg-amber-400/20 border-amber-400 text-amber-400 shadow-amber-500/20'
                    : 'bg-slate-800/40 border-[#2C333D] text-slate-700'
                }`}
              >
                <Star
                  className={`w-6 h-6 ${isEarned ? 'fill-amber-400' : 'fill-slate-800'}`}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Score & Coins Box */}
        <div className="w-full bg-slate-800 border border-[#2C333D] rounded-2xl p-3.5 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-slate-300 font-bold">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Score:</span>
            </div>
            <span className="text-base font-mono font-black text-emerald-400">
              +{score.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-[#2C333D] pt-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-300 font-bold">
              <span className="text-sm">💰</span>
              <span>Coins Earned:</span>
            </div>
            <span className="text-base font-mono font-black text-amber-300">
              +{coinsAwarded}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="w-full flex flex-col gap-2.5 mt-1">
          {hasNextLevel && (
            <button
              onClick={() => {
                sound.playButton();
                onNextLevel();
              }}
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-900/20 active:scale-95 flex items-center justify-center gap-2"
            >
              <span>NEXT LEVEL</span>
              <Play className="w-4 h-4 fill-white" />
            </button>
          )}

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                sound.playButton();
                onReplay();
              }}
              className="flex-1 h-11 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold text-xs border border-[#2C333D] active:scale-95 flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>REPLAY</span>
            </button>

            <button
              onClick={() => {
                sound.playButton();
                onOpenLevels();
              }}
              className="flex-1 h-11 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold text-xs border border-[#2C333D] active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Grid className="w-3.5 h-3.5 text-cyan-400" />
              <span>LEVELS</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
