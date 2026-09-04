import React from 'react';
import { X, Volume2, VolumeX, Music, Vibrate, Eye, Sparkles, Trash2 } from 'lucide-react';
import { GameSettings } from '../types/game';
import { sound } from '../utils/audio';

interface Props {
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onResetProgress: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<Props> = ({
  settings,
  onUpdateSettings,
  onResetProgress,
  onClose,
}) => {
  const toggle = (key: keyof GameSettings) => {
    sound.playButton();
    const updated = { ...settings, [key]: !settings[key] };
    onUpdateSettings(updated);
  };

  return (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn select-none">
      <div className="w-full max-w-sm bg-[#1A1F26] border border-[#2C333D] rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-4 relative">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playButton();
            onClose();
          }}
          className="absolute top-4 right-4 w-8 h-8 rounded-2xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white border border-[#2C333D]"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="text-center mt-1">
          <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Preferences</span>
          <h2 className="text-xl font-black text-white tracking-wide mt-0.5">
            SETTINGS
          </h2>
        </div>

        {/* Options List */}
        <div className="w-full flex flex-col gap-2.5">
          {/* Sound Effects */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800 border border-[#2C333D]">
            <div className="flex items-center gap-2.5">
              {settings.soundEnabled ? (
                <Volume2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <VolumeX className="w-5 h-5 text-slate-500" />
              )}
              <span className="text-xs font-bold text-slate-200">Sound Effects</span>
            </div>
            <button
              onClick={() => toggle('soundEnabled')}
              className={`w-12 h-7 rounded-full transition-colors relative p-1 ${
                settings.soundEnabled ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.soundEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Music */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800 border border-[#2C333D]">
            <div className="flex items-center gap-2.5">
              <Music className={`w-5 h-5 ${settings.musicEnabled ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span className="text-xs font-bold text-slate-200">Music</span>
            </div>
            <button
              onClick={() => toggle('musicEnabled')}
              className={`w-12 h-7 rounded-full transition-colors relative p-1 ${
                settings.musicEnabled ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.musicEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Haptics */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800 border border-[#2C333D]">
            <div className="flex items-center gap-2.5">
              <Vibrate className={`w-5 h-5 ${settings.hapticsEnabled ? 'text-amber-400' : 'text-slate-500'}`} />
              <span className="text-xs font-bold text-slate-200">Vibration / Haptics</span>
            </div>
            <button
              onClick={() => toggle('hapticsEnabled')}
              className={`w-12 h-7 rounded-full transition-colors relative p-1 ${
                settings.hapticsEnabled ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.hapticsEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Reduced Motion */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800 border border-[#2C333D]">
            <div className="flex items-center gap-2.5">
              <Sparkles className={`w-5 h-5 ${settings.reducedMotion ? 'text-cyan-400' : 'text-slate-500'}`} />
              <span className="text-xs font-bold text-slate-200">Reduced Motion</span>
            </div>
            <button
              onClick={() => toggle('reducedMotion')}
              className={`w-12 h-7 rounded-full transition-colors relative p-1 ${
                settings.reducedMotion ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.reducedMotion ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Colorblind Mode */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800 border border-[#2C333D]">
            <div className="flex items-center gap-2.5">
              <Eye className={`w-5 h-5 ${settings.colorblindMode ? 'text-teal-400' : 'text-slate-500'}`} />
              <div>
                <span className="text-xs font-bold text-slate-200 block">Colorblind Mode</span>
                <span className="text-[10px] text-slate-400">High-contrast symbols on vehicles</span>
              </div>
            </div>
            <button
              onClick={() => toggle('colorblindMode')}
              className={`w-12 h-7 rounded-full transition-colors relative p-1 ${
                settings.colorblindMode ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.colorblindMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Reset Progress Button */}
        <button
          onClick={() => {
            if (window.confirm('Reset all completed levels and scores?')) {
              onResetProgress();
            }
          }}
          className="mt-1 text-[11px] text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 opacity-80 hover:opacity-100 transition"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Reset Saved Progress</span>
        </button>
      </div>
    </div>
  );
};
