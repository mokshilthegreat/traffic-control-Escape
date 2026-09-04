import React from 'react';
import { TrafficLightDefinition } from '../types/game';
import { ArrowUpDown, ArrowLeftRight } from 'lucide-react';

interface Props {
  light: TrafficLightDefinition;
  cellSize: number;
  colorblindMode: boolean;
  onToggle: (light: TrafficLightDefinition) => void;
}

export const TrafficLightRenderer: React.FC<Props> = ({
  light,
  cellSize,
  colorblindMode,
  onToggle,
}) => {
  const x = light.position.x * cellSize + cellSize / 2;
  const y = light.position.y * cellSize + cellSize / 2;

  const isNSGreen = light.state === 'NS_GREEN';
  const isEWGreen = light.state === 'EW_GREEN';

  return (
    <div
      id={`light-${light.id}`}
      onClick={(e) => {
        e.stopPropagation();
        onToggle(light);
      }}
      className="absolute z-50 cursor-pointer select-none"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -50%)',
        touchAction: 'manipulation',
      }}
    >
      {/* Large invisible touch target */}
      <div className="absolute -inset-4 rounded-full" />

      {/* SMALL FLOATING TRAFFIC CONTROL */}
      <div
        className={`
          relative flex items-center gap-1.5
          rounded-xl
          border
          px-1.5 py-1.5
          backdrop-blur-[3px]
          shadow-md
          ${
            isNSGreen
              ? 'border-emerald-400/50 bg-slate-900/45'
              : 'border-cyan-400/40 bg-slate-900/40'
          }
        `}
      >
        {/* N/S */}
        <div
          className={`
            flex flex-col items-center justify-center
            rounded-lg
            px-1.5 py-1
            min-w-[28px]
            ${
              isNSGreen
                ? 'bg-emerald-400/20'
                : 'bg-red-500/10'
            }
          `}
        >
          <div
            className={`
              h-4 w-4 rounded-full
              flex items-center justify-center
              ${
                isNSGreen
                  ? 'bg-emerald-400 shadow-[0_0_9px_rgba(52,211,153,0.95)]'
                  : 'bg-red-500/90 shadow-[0_0_6px_rgba(239,68,68,0.7)]'
              }
            `}
          >
            <ArrowUpDown className="h-2.5 w-2.5 text-white" />
          </div>

          <span className="mt-0.5 text-[6px] font-black text-white">
            N/S
          </span>
        </div>

        {/* E/W */}
        <div
          className={`
            flex flex-col items-center justify-center
            rounded-lg
            px-1.5 py-1
            min-w-[28px]
            ${
              isEWGreen
                ? 'bg-emerald-400/20'
                : 'bg-red-500/10'
            }
          `}
        >
          <div
            className={`
              h-4 w-4 rounded-full
              flex items-center justify-center
              ${
                isEWGreen
                  ? 'bg-emerald-400 shadow-[0_0_9px_rgba(52,211,153,0.95)]'
                  : 'bg-red-500/90 shadow-[0_0_6px_rgba(239,68,68,0.7)]'
              }
            `}
          >
            <ArrowLeftRight className="h-2.5 w-2.5 text-white" />
          </div>

          <span className="mt-0.5 text-[6px] font-black text-white">
            E/W
          </span>
        </div>
      </div>

      {/* SMALL STATUS LABEL */}
      <div
        className={`
          absolute left-1/2 top-full mt-0.5
          -translate-x-1/2
          whitespace-nowrap
          rounded-full
          px-1.5 py-[2px]
          text-[5px]
          font-black
          ${
            isNSGreen
              ? 'bg-emerald-400/80 text-slate-950'
              : 'bg-cyan-400/80 text-slate-950'
          }
        `}
      >
        {isNSGreen ? 'N/S GO' : 'E/W GO'}
      </div>

      {/* Short pole */}
      <div
        className="absolute left-1/2 top-[calc(100%+11px)] h-2.5 w-1 -translate-x-1/2 rounded-full bg-slate-400/60"
        aria-hidden="true"
      />

      {/* Colorblind text */}
      {colorblindMode && (
        <div className="absolute left-1/2 top-[calc(100%+22px)] -translate-x-1/2 whitespace-nowrap text-[5px] font-black text-yellow-300">
          {isNSGreen ? 'N/S ACTIVE' : 'E/W ACTIVE'}
        </div>
      )}

      {/* Auto label */}
      {light.isAuto && (
        <div className="absolute left-1/2 top-[calc(100%+22px)] -translate-x-1/2 rounded-full bg-amber-400/90 px-1.5 py-0.5 text-[5px] font-black text-slate-950">
          AUTO
        </div>
      )}
    </div>
  );
};