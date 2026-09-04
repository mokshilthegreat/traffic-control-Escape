import React from 'react';
import { X, ArrowUpDown, Car, Clock, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  onClose: () => void;
}

const RULES = [
  {
    num: 1,
    text: 'Choose a traffic direction.',
    icon: <ArrowUpDown className="w-4 h-4 text-emerald-400 shrink-0" />,
  },
  {
    num: 2,
    text: 'Move a vehicle when its path is clear.',
    icon: <Car className="w-4 h-4 text-cyan-400 shrink-0" />,
  },
  {
    num: 3,
    text: 'Wait when the intersection is blocked.',
    icon: <Clock className="w-4 h-4 text-amber-400 shrink-0" />,
  },
  {
    num: 4,
    text: 'Avoid collisions.',
    icon: <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />,
  },
  {
    num: 5,
    text: 'Get every vehicle to its correct exit.',
    icon: <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />,
  },
];

export const HowToPlayModal: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="absolute inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn select-none">
      <div className="w-full max-w-sm bg-[#1A1F26] border border-[#2C333D] rounded-3xl p-5 shadow-2xl flex flex-col items-center gap-3.5 text-center relative">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playButton();
            onClose();
          }}
          className="absolute top-4 right-4 w-8 h-8 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-95 flex items-center justify-center text-slate-400 hover:text-white border border-[#2C333D] transition shadow"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center mt-1">
          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
            GUIDE
          </span>
          <h2 className="text-xl font-black text-white tracking-tight">
            HOW TO PLAY
          </h2>
        </div>

        {/* 5 Gameplay Rules */}
        <div className="w-full space-y-2 text-left">
          {RULES.map((rule) => (
            <div
              key={rule.num}
              className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-800/60 border border-white/5"
            >
              <div className="w-6 h-6 rounded-full bg-slate-700/80 border border-white/10 flex items-center justify-center text-xs font-black text-slate-200 shrink-0">
                {rule.num}
              </div>
              <span className="text-xs font-semibold text-slate-200 leading-snug flex-1">
                {rule.text}
              </span>
              {rule.icon}
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="w-full flex items-center gap-2 pt-1">
          <button
            onClick={() => {
              sound.playButton();
              onClose();
            }}
            className="w-full h-11 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-900/20 active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <span>GOT IT</span>
          </button>
        </div>
      </div>
    </div>
  );
};

