import React from 'react';
import { ExitDefinition } from '../types/game';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface Props {
  exit: ExitDefinition;
  cellSize: number;
  colorblindMode: boolean;
}

export const ExitRenderer: React.FC<Props> = ({ exit, cellSize, colorblindMode }) => {
  const x = exit.position.x * cellSize + cellSize / 2;
  const y = exit.position.y * cellSize + cellSize / 2;

  const getColorConfig = () => {
    switch (exit.color) {
      case 'red':
        return { bg: 'bg-red-500/20', border: 'border-red-500', glow: '#ef4444', text: 'text-red-400', label: 'RED EXIT' };
      case 'blue':
        return { bg: 'bg-blue-500/20', border: 'border-blue-500', glow: '#3b82f6', text: 'text-blue-400', label: 'BLUE EXIT' };
      case 'yellow':
        return { bg: 'bg-yellow-500/20', border: 'border-yellow-500', glow: '#eab308', text: 'text-yellow-400', label: 'YELLOW EXIT' };
      case 'green':
        return { bg: 'bg-emerald-500/20', border: 'border-emerald-500', glow: '#10b981', text: 'text-emerald-400', label: 'GREEN EXIT' };
      case 'orange':
        return { bg: 'bg-orange-500/20', border: 'border-orange-500', glow: '#f97316', text: 'text-orange-400', label: 'ORANGE EXIT' };
      default:
        return { bg: 'bg-teal-500/20', border: 'border-teal-400', glow: '#14b8a6', text: 'text-teal-300', label: 'ANY EXIT' };
    }
  };

  const config = getColorConfig();

  const renderArrow = () => {
    switch (exit.direction) {
      case 'north': return <ChevronUp className="w-4 h-4 animate-bounce" />;
      case 'south': return <ChevronDown className="w-4 h-4 animate-bounce" />;
      case 'east': return <ChevronRight className="w-4 h-4 animate-pulse" />;
      case 'west': return <ChevronLeft className="w-4 h-4 animate-pulse" />;
    }
  };

  return (
    <div
      id={`exit-${exit.id}`}
      className="absolute pointer-events-none select-none"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -50%)',
        width: `${cellSize * 0.9}px`,
        height: `${cellSize * 0.9}px`,
        zIndex: 10,
      }}
    >
      {/* Target Exit Zone */}
      <div
        className={`w-full h-full rounded-xl border border-dashed ${config.border} ${config.bg} flex flex-col items-center justify-center p-1 transition-all relative overflow-hidden`}
        style={{
          boxShadow: `0 0 12px ${config.glow}30`,
        }}
      >
        {/* Glowing exit indicator bar */}
        <div
          className="w-8 h-1 rounded-full mb-0.5"
          style={{
            backgroundColor: config.glow,
            boxShadow: `0 0 8px ${config.glow}`,
          }}
        />
        <div className={config.text}>{renderArrow()}</div>
        <span className={`text-[8px] font-bold tracking-tighter ${config.text} uppercase leading-none mt-0.5`}>
          {exit.name || config.label}
        </span>
      </div>
    </div>
  );
};
