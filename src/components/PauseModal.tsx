import React from 'react';
import { Play, RotateCcw, Home, Volume2, VolumeX, Music, HelpCircle } from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  soundEnabled: boolean;
  musicEnabled: boolean;
  onResume: () => void;
  onRestart: () => void;
  onOpenHowToPlay: () => void;
  onToggleSound: () => void;
  onToggleMusic: () => void;
  onHome: () => void;
}

export const PauseModal: React.FC<Props> = ({
  soundEnabled,
  musicEnabled,
  onResume,
  onRestart,
  onOpenHowToPlay,
  onToggleSound,
  onToggleMusic,
  onHome,
}) => {
  return (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="w-full max-w-xs bg-[#1A1F26] border border-[#2C333D] rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-4 text-center">
        {/* Title */}
        <div>
          <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Game Control</span>
          <h2 className="text-xl font-black text-white tracking-wide mt-0.5">
            PAUSED
          </h2>
        </div>
        <p className="text-xs text-slate-400">Take a moment to study the road network.</p>

        {/* Audio Toggles Row */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              sound.playButton();
              onToggleSound();
            }}
            className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition ${
              soundEnabled
                ? 'bg-slate-800 border-cyan-500/50 text-cyan-300'
                : 'bg-slate-800/40 border-[#2C333D] text-slate-500'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>SFX</span>
          </button>

          <button
            onClick={() => {
              sound.playButton();
              onToggleMusic();
            }}
            className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition ${
              musicEnabled
                ? 'bg-slate-800 border-emerald-500/50 text-emerald-300'
                : 'bg-slate-800/40 border-[#2C333D] text-slate-500'
            }`}
          >
            <Music className="w-4 h-4" />
            <span>MUSIC</span>
          </button>
        </div>

        {/* Main Action Buttons */}
        <div className="w-full flex flex-col gap-2.5 mt-1">
          {/* Resume */}
          <button
            onClick={() => {
              sound.playButton();
              onResume();
            }}
            className="w-full h-12 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-900/20 active:scale-95 flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>RESUME</span>
          </button>

          {/* Restart */}
          <button
            onClick={() => {
              sound.playButton();
              onRestart();
            }}
            className="w-full h-11 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold text-xs border border-[#2C333D] active:scale-95 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>RESTART LEVEL</span>
          </button>

          {/* Tutorial / Help */}
          <button
            onClick={() => {
              sound.playButton();
              onOpenHowToPlay();
            }}
            className="w-full h-11 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold text-xs border border-[#2C333D] active:scale-95 flex items-center justify-center gap-2"
          >
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>HOW TO PLAY</span>
          </button>

          {/* Home */}
          <button
            onClick={() => {
              sound.playButton();
              onHome();
            }}
            className="w-full py-2 rounded-xl text-slate-400 hover:text-slate-200 font-semibold text-xs transition active:scale-95 flex items-center justify-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5" />
            <span>MAIN MENU</span>
          </button>
        </div>
      </div>
    </div>
  );
};
