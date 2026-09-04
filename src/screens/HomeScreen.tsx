import React from 'react';
import { Play, Grid, HelpCircle, Settings as SettingsIcon, Star, Trophy, Car } from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  latestUnlockedLevel: number;
  totalStars: number;
  maxStars: number;
  highScore: number;
  onPlay: () => void;
  onOpenLevels: () => void;
  onOpenHowToPlay: () => void;
  onOpenSettings: () => void;
}

export const HomeScreen: React.FC<Props> = ({
  latestUnlockedLevel,
  totalStars,
  maxStars,
  highScore,
  onPlay,
  onOpenLevels,
  onOpenHowToPlay,
  onOpenSettings,
}) => {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-6 bg-[#1A1F26] text-white select-none overflow-hidden">
      {/* Top Bar Stats */}
      <div className="w-full max-w-sm flex items-center justify-between pt-6">
        {/* Stars Badge */}
        <div className="flex items-center gap-1.5 bg-slate-800/90 border border-[#2C333D] px-3.5 py-1.5 rounded-2xl shadow-sm">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span className="text-xs font-bold text-slate-200">
            {totalStars} <span className="text-slate-500 font-normal">/ {maxStars}</span>
          </span>
        </div>

        {/* High Score Badge */}
        <div className="flex items-center gap-1.5 bg-slate-800/90 border border-[#2C333D] px-3.5 py-1.5 rounded-2xl shadow-sm">
          <Trophy className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono font-bold text-cyan-400">
            {highScore.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Game Header Identity */}
      <div className="flex flex-col items-center text-center my-auto">
        <div className="relative mb-4">
          <div className="w-20 h-20 rounded-3xl bg-slate-800 border-2 border-[#2C333D] p-1 shadow-xl flex items-center justify-center">
            <div className="w-full h-full bg-[#13171D] rounded-2xl flex items-center justify-center">
              <Car className="w-10 h-10 text-emerald-400" />
            </div>
          </div>
          {/* Pulsing signal dot */}
          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#1A1F26] shadow-[0_0_8px_#34d399] animate-pulse" />
        </div>

        <h1 className="text-3xl font-black tracking-tighter text-white leading-none">
          TRAFFIC<br />
          <span className="text-emerald-500">CONTROL</span>
        </h1>
        <h2 className="text-2xl font-black tracking-wider text-slate-200 mt-1">
          ESCAPE
        </h2>
        <p className="mt-2 text-xs text-slate-400 max-w-[240px] leading-relaxed">
          Manage intersections, time the lights, and clear the city grid.
        </p>
      </div>

      {/* Menu Actions */}
      <div className="w-full max-w-xs flex flex-col gap-3 pb-6">
        {/* Main PLAY Button */}
        <button
          id="btn-play-now"
          onClick={() => {
            sound.playButton();
            onPlay();
          }}
          className="w-full h-14 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:scale-95 transition-all font-black text-sm uppercase tracking-widest text-white shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>PLAY LEVEL {latestUnlockedLevel}</span>
        </button>

        {/* Level Select Button */}
        <button
          id="btn-level-select"
          onClick={() => {
            sound.playButton();
            onOpenLevels();
          }}
          className="w-full h-12 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-95 transition-all font-bold text-xs uppercase tracking-wider text-slate-200 shadow border border-[#2C333D] flex items-center justify-center gap-2"
        >
          <Grid className="w-4 h-4 text-cyan-400" />
          <span>LEVELS (1 - 30)</span>
        </button>

        {/* Secondary Row: How to Play & Settings */}
        <div className="flex items-center gap-3">
          <button
            id="btn-how-to-play"
            onClick={() => {
              sound.playButton();
              onOpenHowToPlay();
            }}
            className="flex-1 h-12 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-95 transition-all text-xs font-bold text-slate-300 border border-[#2C333D] flex items-center justify-center gap-1.5 shadow"
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>TUTORIAL</span>
          </button>

          <button
            id="btn-settings"
            onClick={() => {
              sound.playButton();
              onOpenSettings();
            }}
            className="flex-1 h-12 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-95 transition-all text-xs font-bold text-slate-300 border border-[#2C333D] flex items-center justify-center gap-1.5 shadow"
          >
            <SettingsIcon className="w-4 h-4 text-slate-400" />
            <span>SETTINGS</span>
          </button>
        </div>
      </div>
    </div>
  );
};
