import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpDown, Car, CheckCircle2, ChevronLeft, ChevronRight, Compass, ShieldAlert, X } from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  onGotIt: () => void;
  onClose?: () => void;
}

const STEPS = [
  {
    stepNumber: 1,
    title: 'HOW TO PLAY',
    subtitle: 'Welcome Controller',
    text: 'Control traffic and get every vehicle to its exit.',
    icon: <Compass className="w-10 h-10 text-emerald-400" />,
    badgeColor: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
  },
  {
    stepNumber: 2,
    title: 'TRAFFIC LIGHTS',
    subtitle: 'Signal Control',
    text: 'Tap the traffic light to change the traffic direction.',
    icon: <ArrowUpDown className="w-10 h-10 text-cyan-400" />,
    badgeColor: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10',
  },
  {
    stepNumber: 3,
    title: 'MOVE VEHICLES',
    subtitle: 'Dispatch',
    text: 'When the light is green, tap the vehicle to let it move.',
    icon: <Car className="w-10 h-10 text-amber-400" />,
    badgeColor: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
  },
  {
    stepNumber: 4,
    title: 'MATCHING EXITS',
    subtitle: 'Destination Bay',
    text: 'Send every vehicle to its correct exit.',
    icon: <CheckCircle2 className="w-10 h-10 text-teal-400" />,
    badgeColor: 'text-teal-400 border-teal-500/40 bg-teal-500/10',
  },
  {
    stepNumber: 5,
    title: 'SAFETY FIRST',
    subtitle: 'Collision Avoidance',
    text: 'Avoid collisions and clear the road.',
    icon: <ShieldAlert className="w-10 h-10 text-rose-400" />,
    badgeColor: 'text-rose-400 border-rose-500/40 bg-rose-500/10',
  },
];

export const FirstTimeTutorialModal: React.FC<Props> = ({ onGotIt, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const step = STEPS[currentStep];

  return (
    <div className="absolute inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn select-none">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-sm bg-[#1A1F26] border border-[#2C333D] rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-4 text-center relative"
      >
        {/* Optional Close button */}
        {onClose && (
          <button
            onClick={() => {
              sound.playButton();
              onClose();
            }}
            className="absolute top-4 right-4 w-8 h-8 rounded-2xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white border border-[#2C333D]"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Step Indicator Header */}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Tutorial Step {currentStep + 1} of {STEPS.length}
          </span>
        </div>

        {/* Animated Step Card */}
        <div className="min-h-[190px] w-full flex flex-col items-center justify-center py-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.18 }}
              className="flex flex-col items-center gap-3 w-full"
            >
              <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-[#2C333D] flex items-center justify-center shadow-lg">
                {step.icon}
              </div>

              <div>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${step.badgeColor}`}>
                  {step.subtitle}
                </span>
                <h3 className="text-xl font-black text-white mt-1">
                  {step.title}
                </h3>
              </div>

              <p className="text-sm text-slate-300 font-medium leading-relaxed px-4">
                {step.text}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Step Progress Dots */}
        <div className="flex items-center gap-1.5 my-1">
          {STEPS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                sound.playButton();
                setCurrentStep(idx);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentStep ? 'w-6 bg-emerald-400' : 'w-1.5 bg-slate-700 hover:bg-slate-500'
              }`}
            />
          ))}
        </div>

        {/* Step Navigation Controls */}
        <div className="w-full flex items-center gap-2.5 mt-1">
          {currentStep > 0 && (
            <button
              onClick={() => {
                sound.playButton();
                setCurrentStep((p) => Math.max(0, p - 1));
              }}
              className="h-12 px-4 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold text-xs border border-[#2C333D] flex items-center justify-center gap-1 active:scale-95 transition"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>PREV</span>
            </button>
          )}

          {currentStep < STEPS.length - 1 ? (
            <button
              onClick={() => {
                sound.playButton();
                setCurrentStep((p) => Math.min(STEPS.length - 1, p + 1));
              }}
              className="flex-1 h-12 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-[#2C333D] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1 active:scale-95 transition"
            >
              <span>NEXT STEP</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : null}

          {/* Large prominent GOT IT button */}
          <button
            id="btn-tutorial-got-it"
            onClick={() => {
              sound.playButton();
              onGotIt();
            }}
            className={`${
              currentStep === STEPS.length - 1 ? 'w-full' : 'flex-1'
            } h-12 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-950/40 active:scale-95 transition flex items-center justify-center gap-1.5`}
          >
            <span>GOT IT</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
