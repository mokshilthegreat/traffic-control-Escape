import React, { useState } from 'react';
import { motion } from 'motion/react';
import { HelpCircle, Coins, Sparkles, AlertCircle } from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  freeHints: number;
  coins: number;
  onUseFreeHint: () => void;
  onUseCoinHint: () => void;
  onOpenHowToPlay?: () => void;
  onClose: () => void;
}

export const HintModal: React.FC<Props> = ({
  freeHints,
  coins,
  onUseFreeHint,
  onUseCoinHint,
  onOpenHowToPlay,
  onClose,
}) => {
  const [showEarnCoinsInfo, setShowEarnCoinsInfo] = useState(false);

  const handleUseFree = () => {
    sound.playButton();
    onUseFreeHint();
  };

  const handleUseCoins = () => {
    sound.playButton();
    onUseCoinHint();
  };

  const handleClose = () => {
    sound.playButton();
    onClose();
  };

  const handleOpenHelp = () => {
    sound.playButton();
    onClose();
    if (onOpenHowToPlay) onOpenHowToPlay();
  };

  return (
    <div
      className="absolute inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 20 }}
        className="w-full max-w-xs bg-[#1A1F26] border border-[#2C333D] rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-4 text-center relative"
      >
        {/* Top Icon Badge */}
        <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
          <span className="text-2xl">💡</span>
        </div>

        {/* Info Mode: How to Earn Coins */}
        {showEarnCoinsInfo ? (
          <>
            <div>
              <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">
                HOW TO EARN
              </span>
              <h2 className="text-xl font-black text-white tracking-wide mt-0.5">
                EARN COINS
              </h2>
            </div>

            <div className="w-full bg-slate-800/60 border border-[#2C333D] rounded-2xl p-3.5 flex flex-col gap-2 text-left text-xs text-slate-300">
              <div className="flex items-center justify-between">
                <span>Complete any level:</span>
                <span className="font-mono font-bold text-amber-300">+50 💰</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Complete with 3 stars:</span>
                <span className="font-mono font-bold text-amber-300">+25 💰</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Milestone levels (every 5):</span>
                <span className="font-mono font-bold text-amber-300">+100 💰</span>
              </div>
            </div>

            <button
              onClick={() => setShowEarnCoinsInfo(false)}
              className="w-full h-11 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-xs uppercase tracking-widest active:scale-95 transition-all shadow"
            >
              GOT IT
            </button>
          </>
        ) : (
          <>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
                {freeHints > 0 ? `💡 ${freeHints} FREE HINTS REMAINING` : `💰 BALANCE: ${coins} COINS`}
              </span>
              <h2 className="text-xl font-black text-white tracking-wide mt-0.5">
                NEED A HINT?
              </h2>
              <p className="mt-1 text-xs text-slate-300 leading-relaxed font-medium">
                See the next correct move.
              </p>
            </div>

            <div className="w-full flex flex-col gap-2.5 mt-1">
              {freeHints > 0 ? (
                <button
                  id="btn-use-hint"
                  onClick={handleUseFree}
                  className="w-full h-12 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-widest shadow-lg shadow-amber-950/40 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 fill-slate-950" />
                  <span>USE HINT</span>
                </button>
              ) : coins >= 100 ? (
                <button
                  id="btn-use-coin-hint"
                  onClick={handleUseCoins}
                  className="w-full h-12 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-widest shadow-lg shadow-amber-950/40 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Coins className="w-4 h-4 fill-slate-950" />
                  <span>USE HINT (100 💰)</span>
                </button>
              ) : (
                <button
                  id="btn-earn-coins"
                  onClick={() => setShowEarnCoinsInfo(true)}
                  className="w-full h-12 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-black text-xs uppercase tracking-wider border border-amber-500/40 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>NOT ENOUGH COINS (NEED 100 💰)</span>
                </button>
              )}

              {onOpenHowToPlay && (
                <button
                  id="btn-how-to-play-hint-modal"
                  onClick={handleOpenHelp}
                  className="w-full h-10 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase tracking-wider border border-[#2C333D] active:scale-95 transition-all flex items-center justify-center gap-1.5"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                  <span>HOW TO PLAY</span>
                </button>
              )}

              <button
                id="btn-cancel-hint"
                onClick={handleClose}
                className="w-full h-10 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-400 font-bold text-xs uppercase tracking-wider border border-[#2C333D] active:scale-95 transition-all"
              >
                CANCEL
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};
