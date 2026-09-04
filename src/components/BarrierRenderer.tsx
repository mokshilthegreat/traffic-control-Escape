import React from 'react';
import { BarrierDefinition } from '../types/game';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';

interface Props {
  barrier: BarrierDefinition;
  cellSize: number;
  onToggle: (barrier: BarrierDefinition) => void;
}

export const BarrierRenderer: React.FC<Props> = ({ barrier, cellSize, onToggle }) => {
  const x = barrier.position.x * cellSize + cellSize / 2;
  const y = barrier.position.y * cellSize + cellSize / 2;
  const isOpen = barrier.state === 'open';

  return (
    <div
      id={`barrier-${barrier.id}`}
      onClick={(e) => {
        e.stopPropagation();
        onToggle(barrier);
      }}
      className="absolute cursor-pointer select-none group"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -50%)',
        zIndex: 22,
      }}
    >
      <div className="relative flex items-center justify-center">
        {/* Arm / Gate Bar */}
        <div
          className={`h-3 rounded-full border border-slate-900 shadow-md transition-all duration-300 origin-left flex items-center justify-center overflow-hidden ${
            isOpen
              ? '-rotate-75 opacity-70 bg-emerald-600 w-8'
              : 'rotate-0 opacity-100 bg-amber-400 w-12'
          }`}
          style={{
            backgroundImage: isOpen
              ? 'none'
              : 'repeating-linear-gradient(45deg, #ef4444, #ef4444 6px, #ffffff 6px, #ffffff 12px)',
          }}
        />

        {/* Pivot Stand */}
        <div className="absolute -left-2 w-5 h-5 rounded-full bg-[#1A1F26] border-2 border-[#2C333D] flex items-center justify-center shadow-lg group-hover:scale-105">
          <div
            className={`w-2 h-2 rounded-full transition-colors ${
              isOpen ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]' : 'bg-red-500 shadow-[0_0_6px_#ef4444]'
            }`}
          />
        </div>

        {/* Status text badge */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#1A1F26]/95 border border-[#2C333D] px-1 py-0.5 rounded text-[7px] font-bold text-slate-300 flex items-center gap-0.5 shadow-sm">
          {isOpen ? (
            <>
              <CheckCircle2 className="w-2 h-2 text-emerald-400" />
              <span className="text-emerald-400">OPEN</span>
            </>
          ) : (
            <>
              <ShieldAlert className="w-2 h-2 text-amber-400" />
              <span>TAP TO OPEN</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
