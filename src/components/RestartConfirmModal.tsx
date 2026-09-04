import React from 'react';
import { motion } from 'motion/react';
import { RotateCcw } from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  levelNumber: number;
  onConfirmRestart: () => void;
  onCancel: () => void;
}

export const RestartConfirmModal: React.FC<Props> = ({
  levelNumber,
  onConfirmRestart,
  onCancel,
}) => {
  const handleConfirm = () => {
    sound.playButton();
    onConfirmRestart();
  };

  const handleCancel = () => {
    sound.playButton();
    onCancel();
  };

  return (
    <div
      className="absolute inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleCancel();
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 20 }}
        className="w-full max-w-xs bg-[#1A1F26] border border-[#2C333D] rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-4 text-center"
      >
        {/* Top Icon Badge */}
        <div className="w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-lg shadow-rose-500/10">
          <RotateCcw className="w-7 h-7 text-rose-400" />
        </div>

        <div>
          <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest">
            LEVEL {levelNumber}
          </span>
          <h2 className="text-xl font-black text-white tracking-wide mt-0.5">
            RESTART LEVEL?
          </h2>
          <p className="mt-1.5 text-xs text-slate-300 leading-relaxed font-medium">
            Your current progress on this level will be reset.
          </p>
        </div>

        <div className="w-full flex flex-col gap-2.5 mt-1">
          <button
            id="btn-confirm-restart"
            onClick={handleConfirm}
            className="w-full h-12 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-rose-950/40 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>RESTART</span>
          </button>

          <button
            id="btn-cancel-restart"
            onClick={handleCancel}
            className="w-full h-11 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase tracking-wider border border-[#2C333D] active:scale-95 transition-all"
          >
            CANCEL
          </button>
        </div>
      </motion.div>
    </div>
  );
};
