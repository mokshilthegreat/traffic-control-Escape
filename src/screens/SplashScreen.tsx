import React from 'react';
import { motion } from 'motion/react';
import { Car, Compass, TrafficCone, ShieldCheck } from 'lucide-react';

interface Props {
  onStart: () => void;
}

export const SplashScreen: React.FC<Props> = ({ onStart }) => {
  return (
    <div
      onClick={onStart}
      className="relative w-full h-full flex flex-col items-center justify-between p-6 bg-[#1A1F26] text-white select-none cursor-pointer overflow-hidden"
    >
      {/* Top Tagline */}
      <div className="pt-8 flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
        <TrafficCone className="w-3.5 h-3.5 text-emerald-400" />
        <span>Strategy Road Puzzler</span>
      </div>

      {/* Center Icon & Title */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex flex-col items-center text-center gap-5"
      >
        {/* Animated Badge */}
        <div className="relative w-28 h-28 rounded-3xl bg-slate-800 border-2 border-[#2C333D] p-1.5 shadow-2xl">
          <div className="w-full h-full bg-[#13171D] rounded-2xl flex items-center justify-center relative overflow-hidden">
            <Car className="w-14 h-14 text-emerald-400 animate-bounce" />
            <div className="absolute top-2.5 right-2.5 w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            <div className="absolute bottom-2.5 left-2.5 w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-black tracking-tighter text-white leading-none">
            TRAFFIC<br />
            <span className="text-emerald-500">CONTROL</span>
          </h1>
          <h2 className="text-2xl font-black tracking-wider text-slate-200 mt-1">
            ESCAPE
          </h2>
          <p className="mt-2 text-xs text-slate-400 font-medium">
            Manage intersections. Clear the city grid.
          </p>
        </div>
      </motion.div>

      {/* Bottom Prompt */}
      <motion.div
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="pb-8 flex flex-col items-center gap-2"
      >
        <button className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-900/25 active:scale-95 transition-transform flex items-center gap-2">
          <span>TAP TO START</span>
          <ShieldCheck className="w-4 h-4 text-emerald-100" />
        </button>
        <span className="text-[10px] text-slate-500">Tap anywhere to enter</span>
      </motion.div>
    </div>
  );
};
