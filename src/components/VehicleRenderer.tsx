import React from 'react';
import { VehicleDefinition } from '../types/game';
import { AlertTriangle, Shield, Flame, Compass, Square, Circle, Triangle, Award } from 'lucide-react';

interface Props {
  vehicle: VehicleDefinition;
  cellSize: number;
  colorblindMode: boolean;
  onTap: (vehicle: VehicleDefinition) => void;
}

export const VehicleRenderer: React.FC<Props> = ({ vehicle, cellSize, colorblindMode, onTap }) => {
  if (vehicle.hasExited) return null;

  // Calculate actual pixel coordinates from current interpolated position
  const x = vehicle.currentPos.x * cellSize + cellSize / 2;
  const y = vehicle.currentPos.y * cellSize + cellSize / 2;

  // Calculate rotation angle
  let angle = 0;
  switch (vehicle.direction) {
    case 'north': angle = -90; break;
    case 'south': angle = 90; break;
    case 'east': angle = 0; break;
    case 'west': angle = 180; break;
  }

  const isBus = vehicle.type === 'bus';
  const isDelivery = vehicle.type === 'delivery';
  const isAmbulance = vehicle.type === 'ambulance';
  const isPolice = vehicle.type === 'police';
  const isTaxi = vehicle.type === 'taxi';

  const width = cellSize * (isBus ? 1.6 : isDelivery ? 1.35 : 0.95);
  const height = cellSize * 0.62;

  // Colorblind symbol
  const getSymbol = () => {
    if (!colorblindMode) return null;
    switch (vehicle.colorName) {
      case 'red': return <Circle className="w-3 h-3 text-white fill-white" />;
      case 'blue': return <Square className="w-3 h-3 text-white fill-white" />;
      case 'yellow': return <Triangle className="w-3 h-3 text-white fill-white" />;
      case 'green': return <Compass className="w-3 h-3 text-white" />;
      case 'orange': return <Flame className="w-3 h-3 text-white" />;
      default: return null;
    }
  };

  return (
    <div
      id={`vehicle-${vehicle.id}`}
      onClick={(e) => {
        e.stopPropagation();
        onTap(vehicle);
      }}
      className={`absolute cursor-pointer transition-transform duration-75 select-none ${
        vehicle.isCollided ? 'animate-wobble' : ''
      }`}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
        transform: `translate(-50%, -50%) rotate(${angle}deg)`,
        zIndex: vehicle.isMoving ? 30 : 20,
      }}
    >
      {/* Tap indicator pulse when idle */}
      {!vehicle.isMoving && !vehicle.isCollided && (
        <div
          className="absolute -inset-1.5 rounded-2xl bg-amber-400/25 animate-pulse border border-amber-300/40 pointer-events-none"
          style={{ borderRadius: '14px' }}
        />
      )}

      {/* Vehicle Shadow */}
      <div
        className="absolute inset-0 bg-slate-950/40 rounded-xl blur-[2px] translate-y-1.5 translate-x-0.5"
        style={{ borderRadius: isBus ? '10px' : '12px' }}
      />

      {/* Vehicle Main Body */}
      <div
        className="relative w-full h-full rounded-lg flex items-center justify-between px-1.5 shadow-lg border-b-4 border-black/30 overflow-hidden"
        style={{
          backgroundColor: vehicle.displayColor,
          borderRadius: isBus ? '8px' : isDelivery ? '9px' : '10px',
        }}
      >
        {/* Soft top highlight gradient */}
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />

        {/* Headlights on the right (facing front at angle 0) */}
        <div className="absolute right-0.5 top-1 w-1.5 h-1.5 rounded-full bg-amber-200/90 shadow-[0_0_6px_#fef08a]" />
        <div className="absolute right-0.5 bottom-1 w-1.5 h-1.5 rounded-full bg-amber-200/90 shadow-[0_0_6px_#fef08a]" />

        {/* Tail lights on the left */}
        <div className="absolute left-0.5 top-1 w-1 h-1.5 rounded-sm bg-red-500/80" />
        <div className="absolute left-0.5 bottom-1 w-1 h-1.5 rounded-sm bg-red-500/80" />

        {/* Minimalist Windshield & Cab */}
        <div className="relative z-10 flex items-center justify-between w-full h-full px-1">
          {/* Rear Window subtle */}
          <div className="w-1 h-3 bg-white/20 rounded-full" />

          {/* Roof Center Area */}
          <div className="flex-1 mx-1 flex items-center justify-center relative">
            {/* Special Decals */}
            {isAmbulance && (
              <div className="flex items-center gap-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping absolute -top-1" />
                <span className="text-[8px] font-black text-white tracking-tighter">EMERGENCY</span>
              </div>
            )}
            {isPolice && (
              <div className="flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8] flex items-center justify-center">
                  <Shield className="w-2 h-2 text-slate-950" />
                </div>
              </div>
            )}
            {isTaxi && (
              <div className="bg-slate-950 text-amber-300 text-[7px] font-black px-1 rounded shadow-sm tracking-wider">
                TAXI
              </div>
            )}
            {isBus && (
              <div className="text-[7px] font-black text-slate-950/80 tracking-wider">
                TRANSIT
              </div>
            )}
            {isDelivery && (
              <div className="text-[7px] font-black text-white/90 tracking-wider">
                EXPRESS
              </div>
            )}
            {!isAmbulance && !isPolice && !isTaxi && !isBus && !isDelivery && getSymbol()}
          </div>

          {/* Front Windshield Minimalist White Strip */}
          <div className="w-1.5 h-3.5 bg-white/50 rounded-full shadow-sm" />
        </div>

        {/* Collision Flash Badge */}
        {vehicle.isCollided && (
          <div className="absolute inset-0 bg-red-600/80 flex items-center justify-center animate-bounce z-20">
            <AlertTriangle className="w-4 h-4 text-white" />
          </div>
        )}
      </div>

      {/* Priority Vehicle Siren Pulse */}
      {(isAmbulance || isPolice) && (
        <div className="absolute -inset-1 rounded-full border border-red-400/50 animate-ping pointer-events-none" />
      )}
    </div>
  );
};
