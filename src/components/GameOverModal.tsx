import React from 'react';
import { motion } from 'motion/react';
import { AlertOctagon, RotateCcw, Grid, Home } from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  levelNumber: number;
  score: number;
  onRetry: () => void;
  onOpenLevels: () => void;
  onHome: () => void;
}

export const GameOverModal: React.FC<Props> = ({
  levelNumber,
  score,
  onRetry,
  onOpenLevels,
  onHome,
}) => {
  return (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn select-none">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 18 }}
        className="w-full max-w-xs bg-[#1A1F26] border border-[#2C333D] rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-4 text-center"
      >
        {/* Warning Icon */}
        <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center text-rose-400 shadow-lg shadow-rose-500/20">
          <AlertOctagon className="w-8 h-8" />
        </div>

        <div>
          <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest">
            3 MISTAKES OCCURRED
          </span>
          <h2 className="text-xl font-black text-white tracking-wide mt-0.5">
            TRAFFIC JAM
          </h2>
          <p className="mt-1 text-xs text-slate-400 leading-relaxed">
            Intersection blocked. Plan your release order carefully.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2.5 mt-1">
          <button
            onClick={() => {
              sound.playButton();
              onRetry();
            }}
            className="w-full h-12 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-rose-950/40 active:scale-95 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4 text-white" />
            <span>RETRY LEVEL {levelNumber}</span>
          </button>

          <div className="flex items-center gap-2.5">
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

            <button
              onClick={() => {
                sound.playButton();
                onHome();
              }}
              className="flex-1 h-11 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold text-xs border border-[#2C333D] active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Home className="w-3.5 h-3.5 text-slate-400" />
              <span>HOME</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
