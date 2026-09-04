import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  LevelDefinition,
  VehicleDefinition,
  TrafficLightDefinition,
  BarrierDefinition,
  GameSettings,
  Point,
  HintResult,
} from '../types/game';
import { VehicleRenderer } from './VehicleRenderer';
import { TrafficLightRenderer } from './TrafficLightRenderer';
import { BarrierRenderer } from './BarrierRenderer';
import { ExitRenderer } from './ExitRenderer';
import { sound, triggerHaptic } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Sparkles, AlertOctagon, Play } from 'lucide-react';

interface Props {
  level: LevelDefinition;
  settings: GameSettings;
  lives: number;
  score: number;
  streak: number;
  onVehicleExit: (vehicle: VehicleDefinition) => void;
  onCollision: () => void;
  onLevelComplete: (stars: number, finalScore: number) => void;
  onGameOver: () => void;
  isPaused: boolean;
  isReadyToStart?: boolean;
  onStartLevel?: () => void;
  activeHint?: HintResult | null;
  onClearHint?: () => void;
  onStateUpdate?: (state: {
    vehicles: VehicleDefinition[];
    trafficLights: TrafficLightDefinition[];
    barriers: BarrierDefinition[];
  }) => void;
  undoTrigger?: number;
  onCanUndoChange?: (canUndo: boolean) => void;
}

export const GameBoard: React.FC<Props> = ({
  level,
  settings,
  lives,
  score,
  streak,
  onVehicleExit,
  onCollision,
  onLevelComplete,
  onGameOver,
  isPaused,
  isReadyToStart = false,
  onStartLevel,
  activeHint,
  onClearHint,
  onStateUpdate,
  undoTrigger,
  onCanUndoChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cellSize, setCellSize] = useState<number>(54);
  const [boardWidth, setBoardWidth] = useState<number>(360);
  const [boardHeight, setBoardHeight] = useState<number>(480);

  // Active level runtime state
  const [vehicles, setVehicles] = useState<VehicleDefinition[]>(() =>
    level.vehicles.map((v) => ({ ...v, currentPos: { ...v.startPos }, isMoving: false, hasExited: false, isCollided: false, pathIndex: 0, pathProgress: 0 }))
  );
  const [trafficLights, setTrafficLights] = useState<TrafficLightDefinition[]>(() =>
    level.trafficLights.map((tl) => ({ ...tl }))
  );
  const [barriers, setBarriers] = useState<BarrierDefinition[]>(() =>
    level.barriers.map((b) => ({ ...b }))
  );

  const [screenShake, setScreenShake] = useState(false);
  const [collisionWarning, setCollisionWarning] = useState<string | null>(null);

  // Level 1 Interactive Tutorial Guide: 'tap_light' | 'tap_car' | 'reach_exit' | 'done'
  const [guideStep, setGuideStep] = useState<'tap_light' | 'tap_car' | 'reach_exit' | 'done'>('tap_light');

  // Level 2 Interactive Tutorial Guide: 'tap_light_ns' | 'move_red_car' | 'tap_light_ew' | 'move_blue_car' | 'move_green_car' | 'done'
  const [l2GuideStep, setL2GuideStep] = useState<
    'tap_light_ns' | 'move_red_car' | 'tap_light_ew' | 'move_blue_car' | 'move_green_car' | 'done'
  >('tap_light_ns');

  const hasTriggeredWinRef = useRef(false);

  // Undo System History Stack (stores last 15 actions)
  const undoStackRef = useRef<
    Array<{
      vehicles: VehicleDefinition[];
      trafficLights: TrafficLightDefinition[];
      barriers: BarrierDefinition[];
    }>
  >([]);

  const pushUndoSnapshot = useCallback(() => {
    const snapshot = {
      vehicles: vehiclesRef.current.map((v) => ({
        ...v,
        currentPos: { ...v.currentPos },
      })),
      trafficLights: trafficLightsRef.current.map((tl) => ({ ...tl })),
      barriers: barriersRef.current.map((b) => ({ ...b })),
    };
    undoStackRef.current.push(snapshot);
    if (undoStackRef.current.length > 15) {
      undoStackRef.current.shift();
    }
    onCanUndoChange?.(true);
  }, [onCanUndoChange]);

  // Sync state when level changes
  useEffect(() => {
    setVehicles(
      level.vehicles.map((v) => ({
        ...v,
        currentPos: { ...v.startPos },
        isMoving: false,
        hasExited: false,
        isCollided: false,
        pathIndex: 0,
        pathProgress: 0,
      }))
    );
    setTrafficLights(level.trafficLights.map((tl) => ({ ...tl })));
    setBarriers(level.barriers.map((b) => ({ ...b })));
    setCollisionWarning(null);
    setGuideStep('tap_light');
    setL2GuideStep('tap_light_ns');
    hasTriggeredWinRef.current = false;
    undoStackRef.current = [];
    onCanUndoChange?.(false);
  }, [level.id, onCanUndoChange]);

  // Handle Undo Request from HUD / Bottom Bar
  useEffect(() => {
    if (!undoTrigger) return;
    if (undoStackRef.current.length === 0) return;

    const snapshot = undoStackRef.current.pop();
    if (!snapshot) return;

    // Immediately restore refs for zero-latency physics loop
    vehiclesRef.current = snapshot.vehicles.map((v) => ({
      ...v,
      currentPos: { ...v.currentPos },
    }));
    trafficLightsRef.current = snapshot.trafficLights.map((tl) => ({ ...tl }));
    barriersRef.current = snapshot.barriers.map((b) => ({ ...b }));

    // Restore state
    setVehicles(
      snapshot.vehicles.map((v) => ({
        ...v,
        currentPos: { ...v.currentPos },
      }))
    );
    setTrafficLights(snapshot.trafficLights.map((tl) => ({ ...tl })));
    setBarriers(snapshot.barriers.map((b) => ({ ...b })));
    setCollisionWarning(null);

    onCanUndoChange?.(undoStackRef.current.length > 0);
  }, [undoTrigger, onCanUndoChange]);

  // Keep parent in sync with latest game state for hints
  useEffect(() => {
    onStateUpdate?.({ vehicles, trafficLights, barriers });
  }, [vehicles, trafficLights, barriers, onStateUpdate]);

  // Measure container and adapt cellSize dynamically using ResizeObserver
  useEffect(() => {
    if (!containerRef.current) return;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width <= 0 || height <= 0) return;

        // Ensure board fits inside available dimensions with breathing room
        const availableWidth = Math.max(width - 16, 120);
        const availableHeight = Math.max(height - 16, 120);

        const calculatedCell = Math.floor(
          Math.min(availableWidth / level.gridWidth, availableHeight / level.gridHeight)
        );
        // Dynamic clamp between 26px (compact viewports) and 64px (larger displays)
        const finalCell = Math.max(26, Math.min(calculatedCell, 64));

        setCellSize(finalCell);
        setBoardWidth(finalCell * level.gridWidth);
        setBoardHeight(finalCell * level.gridHeight);
      }
    });

    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [level.gridWidth, level.gridHeight]);

  // Automatic traffic light cycling timer (for levels with auto lights)
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setTrafficLights((prev) =>
        prev.map((light) => {
          if (!light.isAuto) return light;
          return {
            ...light,
            state: light.state === 'NS_GREEN' ? 'EW_GREEN' : 'NS_GREEN',
          };
        })
      );
    }, 4500);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Toggle Traffic Light
  const handleToggleLight = useCallback(
    (light: TrafficLightDefinition) => {
      pushUndoSnapshot();
      sound.playLightSwitch();
      triggerHaptic('light', settings.hapticsEnabled);

      const nextState = light.state === 'NS_GREEN' ? 'EW_GREEN' : 'NS_GREEN';
      // Immediate synchronous update to ref for zero-latency physics response
      const target = trafficLightsRef.current.find((tl) => tl.id === light.id);
      if (target) {
        target.state = nextState;
      }

      setTrafficLights((prev) =>
        prev.map((tl) =>
          tl.id === light.id ? { ...tl, state: nextState } : tl
        )
      );

      // Advance tutorial in level 1
      if (level.id === 1) {
        setGuideStep((curr) => (curr === 'tap_light' ? 'tap_car' : curr));
      }

      // Advance tutorial in level 2
      if (level.id === 2) {
        if (l2GuideStep === 'tap_light_ns' && nextState === 'NS_GREEN') {
          setL2GuideStep('move_red_car');
        } else if (l2GuideStep === 'tap_light_ew' && nextState === 'EW_GREEN') {
          setL2GuideStep('move_blue_car');
        }
      }

      if (activeHint?.targetType === 'traffic_light') {
        onClearHint?.();
      }
    },
    [level.id, l2GuideStep, settings.hapticsEnabled, activeHint, onClearHint, pushUndoSnapshot]
  );

  // Toggle Barrier
  const handleToggleBarrier = useCallback(
    (barrier: BarrierDefinition) => {
      pushUndoSnapshot();
      sound.playBarrierMove();
      triggerHaptic('light', settings.hapticsEnabled);

      const nextState = barrier.state === 'open' ? 'closed' : 'open';
      const target = barriersRef.current.find((b) => b.id === barrier.id);
      if (target) {
        target.state = nextState;
      }

      setBarriers((prev) =>
        prev.map((b) =>
          b.id === barrier.id ? { ...b, state: nextState } : b
        )
      );

      if (activeHint?.targetType === 'barrier') {
        onClearHint?.();
      }
    },
    [settings.hapticsEnabled, activeHint, onClearHint, pushUndoSnapshot]
  );

  // Tap Vehicle to Start Moving
  const handleTapVehicle = useCallback(
    (vehicle: VehicleDefinition) => {
      if (vehicle.isMoving || vehicle.hasExited || vehicle.isCollided || isPaused || isReadyToStart) return;

      const nextWaypoint = vehicle.path[vehicle.pathIndex + 1] || vehicle.path[vehicle.pathIndex];

      // 1. Safety Check: Check if path is blocked immediately ahead by a stationary vehicle
      const isBlockedAhead = vehiclesRef.current.some((other) => {
        if (other.id === vehicle.id || other.hasExited) return false;
        const dx = other.currentPos.x - vehicle.currentPos.x;
        const dy = other.currentPos.y - vehicle.currentPos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 1.3) return false;
        if (!nextWaypoint) return false;
        const toNextX = nextWaypoint.x - vehicle.currentPos.x;
        const toNextY = nextWaypoint.y - vehicle.currentPos.y;
        return dx * toNextX + dy * toNextY > 0.1;
      });

      if (isBlockedAhead) {
        sound.playButton();
        triggerHaptic('light', settings.hapticsEnabled);
        setCollisionWarning('WAIT — THIS ROUTE IS BLOCKED.');
        setTimeout(() => setCollisionWarning(null), 1800);
        return;
      }

      // 2. Safety Check: Check if a closed barrier is immediately ahead
      if (nextWaypoint) {
        const isBarrierClosedAhead = barriersRef.current.some(
          (b) =>
            b.state === 'closed' &&
            Math.abs(b.position.x - nextWaypoint.x) < 0.4 &&
            Math.abs(b.position.y - nextWaypoint.y) < 0.4
        );
        if (isBarrierClosedAhead) {
          sound.playButton();
          triggerHaptic('light', settings.hapticsEnabled);
          setCollisionWarning('WAIT — THIS ROUTE IS BLOCKED.');
          setTimeout(() => setCollisionWarning(null), 1800);
          return;
        }
      }

      // 3. Safety Check: Check if a traffic light is red or another cross vehicle is actively occupying intersection
      const nextIntersection = trafficLightsRef.current.find((tl) =>
        vehicle.path.some((p) => Math.abs(p.x - tl.position.x) < 0.1 && Math.abs(p.y - tl.position.y) < 0.1)
      );

      if (nextIntersection) {
        const isNorthSouth = vehicle.direction === 'north' || vehicle.direction === 'south';
        const distToIntersection = Math.sqrt(
          Math.pow(vehicle.currentPos.x - nextIntersection.position.x, 2) +
          Math.pow(vehicle.currentPos.y - nextIntersection.position.y, 2)
        );

        // Check if traffic light is RED for this car
        const isGreen = (isNorthSouth && nextIntersection.state === 'NS_GREEN') ||
                        (!isNorthSouth && nextIntersection.state === 'EW_GREEN');

        if (!isGreen && distToIntersection < 2.2) {
          sound.playButton();
          triggerHaptic('light', settings.hapticsEnabled);
          setCollisionWarning('WAIT — THIS ROUTE IS BLOCKED.');
          setTimeout(() => setCollisionWarning(null), 1800);
          return;
        }

        const isOccupiedByCrossTraffic = vehiclesRef.current.some((other) => {
          if (other.id === vehicle.id || other.hasExited) return false;
          const otherIsNS = other.direction === 'north' || other.direction === 'south';
          if (otherIsNS === isNorthSouth) return false;
          const dX = Math.abs(other.currentPos.x - nextIntersection.position.x);
          const dY = Math.abs(other.currentPos.y - nextIntersection.position.y);
          return dX < 0.95 && dY < 0.95;
        });

        if (isOccupiedByCrossTraffic && distToIntersection < 2.0) {
          sound.playButton();
          triggerHaptic('light', settings.hapticsEnabled);
          setCollisionWarning('NOT SAFE YET.');
          setTimeout(() => setCollisionWarning(null), 1800);
          return;
        }
      }

      pushUndoSnapshot();
      sound.playCarStart();
      triggerHaptic('light', settings.hapticsEnabled);

      // Immediate synchronous update to ref for zero-latency dispatch
      const target = vehiclesRef.current.find((v) => v.id === vehicle.id);
      if (target) {
        target.isMoving = true;
      }

      setVehicles((prev) =>
        prev.map((v) => (v.id === vehicle.id ? { ...v, isMoving: true } : v))
      );

      if (activeHint?.targetType === 'vehicle') {
        onClearHint?.();
      }

      // Advance tutorial in level 1
      if (level.id === 1) {
        setGuideStep((curr) => (curr === 'tap_car' || curr === 'tap_light' ? 'reach_exit' : curr));
      }
    },
    [level.id, isPaused, isReadyToStart, settings.hapticsEnabled, activeHint, onClearHint, pushUndoSnapshot]
  );

  // Main Simulation / Physics Loop
  const vehiclesRef = useRef(vehicles);
  vehiclesRef.current = vehicles;
  const trafficLightsRef = useRef(trafficLights);
  trafficLightsRef.current = trafficLights;
  const barriersRef = useRef(barriers);
  barriersRef.current = barriers;
  const isPausedRef = useRef(isPaused || isReadyToStart);
  isPausedRef.current = isPaused || isReadyToStart;

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05); // cap delta time
      lastTime = now;

      if (!isPausedRef.current) {
        const currentVehicles = [...vehiclesRef.current];
        let hasChanges = false;
        let collisionDetected = false;

        for (let i = 0; i < currentVehicles.length; i++) {
          const v = currentVehicles[i];
          if (!v.isMoving || v.hasExited || v.isCollided) continue;

          const currentWaypoint = v.path[v.pathIndex];
          const nextWaypoint = v.path[v.pathIndex + 1];

          if (!nextWaypoint) {
            // Reached destination exit!
            v.isMoving = false;
            v.hasExited = true;
            hasChanges = true;
            sound.playCarExit();
            triggerHaptic('success', settings.hapticsEnabled);
            onVehicleExit(v);
            if (level.id === 1) {
              setGuideStep('done');
            }
            if (level.id === 2) {
              if (v.id === 'v-1') {
                setL2GuideStep('tap_light_ew');
              } else if (v.id === 'v-2') {
                setL2GuideStep('move_green_car');
              } else if (v.id === 'v-3') {
                setL2GuideStep('done');
              }
            }
            continue;
          }

          // Check if entering an intersection with a RED light
          const isEnteringIntersection = trafficLightsRef.current.find(
            (tl) =>
              Math.abs(tl.position.x - nextWaypoint.x) < 0.1 &&
              Math.abs(tl.position.y - nextWaypoint.y) < 0.1
          );

          if (isEnteringIntersection && !v.canIgnoreRed) {
            const isNorthSouthMovement = v.direction === 'north' || v.direction === 'south';
            const isGreen =
              (isNorthSouthMovement && isEnteringIntersection.state === 'NS_GREEN') ||
              (!isNorthSouthMovement && isEnteringIntersection.state === 'EW_GREEN');

            if (!isGreen && v.pathProgress > 0.85) {
              // Wait at red light
              continue;
            }
          }

          // Check if blocked by a closed barrier
          const isBlockedByBarrier = barriersRef.current.find(
            (b) =>
              b.state === 'closed' &&
              Math.abs(b.position.x - nextWaypoint.x) < 0.2 &&
              Math.abs(b.position.y - nextWaypoint.y) < 0.2
          );

          if (isBlockedByBarrier && v.pathProgress > 0.85) {
            // Wait at barrier
            continue;
          }

          // Check collision with other vehicles ahead
          let blockedByVehicle = false;
          for (let j = 0; j < currentVehicles.length; j++) {
            if (i === j) continue;
            const other = currentVehicles[j];
            if (other.hasExited) continue;

            const dx = (v.currentPos.x - other.currentPos.x);
            const dy = (v.currentPos.y - other.currentPos.y);
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Safe following / stopping distance
            if (dist < 0.8) {
              if (other.isMoving) {
                // Real collision impact!
                collisionDetected = true;
                v.isCollided = true;
                v.isMoving = false;
                other.isCollided = true;
                other.isMoving = false;
                hasChanges = true;
                break;
              } else {
                // Other car is waiting ahead - stop behind it cleanly
                blockedByVehicle = true;
                break;
              }
            }
          }

          if (collisionDetected) {
            break;
          }

          if (blockedByVehicle) {
            continue;
          }

          // Advance vehicle progress
          const progressStep = (v.speed * dt);
          let newProgress = v.pathProgress + progressStep;

          if (newProgress >= 1) {
            v.pathIndex += 1;
            v.pathProgress = 0;

            if (v.pathIndex >= v.path.length - 1) {
              // Exited!
              v.isMoving = false;
              v.hasExited = true;
              sound.playCarExit();
              triggerHaptic('success', settings.hapticsEnabled);
              onVehicleExit(v);
              if (level.id === 1) {
                setGuideStep('done');
              }
              if (level.id === 2) {
                if (v.id === 'v-1') {
                  setL2GuideStep('tap_light_ew');
                } else if (v.id === 'v-2') {
                  setL2GuideStep('move_green_car');
                } else if (v.id === 'v-3') {
                  setL2GuideStep('done');
                }
              }
            } else {
              // Update facing direction
              const pA = v.path[v.pathIndex];
              const pB = v.path[v.pathIndex + 1];
              if (pB.x > pA.x) v.direction = 'east';
              else if (pB.x < pA.x) v.direction = 'west';
              else if (pB.y > pA.y) v.direction = 'south';
              else if (pB.y < pA.y) v.direction = 'north';

              v.currentPos = { ...pA };
            }
          } else {
            v.pathProgress = newProgress;
            // Interpolate position
            v.currentPos = {
              x: currentWaypoint.x + (nextWaypoint.x - currentWaypoint.x) * newProgress,
              y: currentWaypoint.y + (nextWaypoint.y - currentWaypoint.y) * newProgress,
            };
          }

          hasChanges = true;
        }

        if (collisionDetected) {
          sound.playCollision();
          triggerHaptic('error', settings.hapticsEnabled);
          setScreenShake(true);
          setCollisionWarning('UNSAFE MOVE');
          setTimeout(() => {
            setCollisionWarning('-1 LIFE');
          }, 500);
          setTimeout(() => setScreenShake(false), 350);

          onCollision();

          // Reset collided cars after a brief moment so user can keep trying
          setTimeout(() => {
            setVehicles((prev) =>
              prev.map((veh) =>
                veh.isCollided
                  ? {
                      ...veh,
                      isCollided: false,
                      isMoving: false,
                      currentPos: { ...veh.startPos },
                      pathIndex: 0,
                      pathProgress: 0,
                    }
                  : veh
              )
            );
            setCollisionWarning(null);
          }, 1200);
        }

        if (hasChanges) {
          setVehicles([...currentVehicles]);

          // Check if all vehicles have successfully exited
          const allExited = currentVehicles.length > 0 && currentVehicles.every((veh) => veh.hasExited);
          if (allExited && !hasTriggeredWinRef.current) {
            hasTriggeredWinRef.current = true;
            // Level win!
            sound.playLevelWin();
            triggerHaptic('success', settings.hapticsEnabled);
            confetti({
              particleCount: 75,
              spread: 60,
              origin: { y: 0.6 },
            });
            const starsAwarded = lives >= 3 ? 3 : lives === 2 ? 2 : 1;
            onLevelComplete(starsAwarded, score + 500);
          }
        }
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, [level.id, lives, score, settings.hapticsEnabled, onCollision, onLevelComplete, onVehicleExit]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full flex flex-col items-center justify-center p-2 bg-[#13171D] transition-transform duration-100 ${
        screenShake && !settings.reducedMotion ? 'animate-wobble' : ''
      }`}
    >
      {/* Collision Warning Banner */}
      {collisionWarning && (
        <div className="absolute top-2 z-50 bg-red-600/95 text-white font-black text-xs px-4 py-1.5 rounded-full shadow-lg border border-red-400 flex items-center gap-1.5 animate-bounce">
          <AlertOctagon className="w-4 h-4 text-amber-300" />
          <span>{collisionWarning}</span>
        </div>
      )}

      {/* Main Game Surface / Asphalt Board */}
      <div
        id="game-road-board"
        className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-4 border-[#2C333D] bg-[#13171D]"
        style={{
          width: `${boardWidth}px`,
          height: `${boardHeight}px`,
        }}
      >
        {/* Minimalist Grid Underlay */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(#475569 1px, transparent 1px)',
            backgroundSize: `${cellSize}px ${cellSize}px`,
          }}
        />

        {/* Road Tiles */}
        {level.roads.map((road, idx) => {
          const rx = road.x * cellSize;
          const ry = road.y * cellSize;
          const isIntersection = road.type === 'intersection';
          const isVertical = road.type === 'v-road';
          const isHorizontal = road.type === 'h-road';

          return (
            <div
              key={`road-${idx}`}
              className={`absolute bg-[#232A35] border border-slate-700/30 ${
                isIntersection ? 'bg-[#28313e]' : ''
              }`}
              style={{
                left: `${rx}px`,
                top: `${ry}px`,
                width: `${cellSize}px`,
                height: `${cellSize}px`,
              }}
            >
              {/* Road Divider Markings */}
              {isVertical && (
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 border-r-2 border-dashed border-slate-500/30" />
              )}
              {isHorizontal && (
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 border-b-2 border-dashed border-slate-500/30" />
              )}
              {isIntersection && (
                <div className="absolute inset-1.5 border border-dashed border-slate-500/20 rounded-md pointer-events-none" />
              )}
            </div>
          );
        })}

        {/* Exits */}
        {level.exits.map((exit) => (
          <ExitRenderer
            key={exit.id}
            exit={exit}
            cellSize={cellSize}
            colorblindMode={settings.colorblindMode}
          />
        ))}

        {/* Barriers */}
        {barriers.map((barrier) => (
          <BarrierRenderer
            key={barrier.id}
            barrier={barrier}
            cellSize={cellSize}
            onToggle={handleToggleBarrier}
          />
        ))}

        {/* Traffic Lights */}
        {trafficLights.map((light) => (
          <TrafficLightRenderer
            key={light.id}
            light={light}
            cellSize={cellSize}
            colorblindMode={settings.colorblindMode}
            onToggle={handleToggleLight}
          />
        ))}

        {/* Vehicles */}
        {vehicles.map((vehicle) => (
          <VehicleRenderer
            key={vehicle.id}
            vehicle={vehicle}
            cellSize={cellSize}
            colorblindMode={settings.colorblindMode}
            onTap={handleTapVehicle}
          />
        ))}

        {/* Level 1 Interactive Guided Tutorial Overlays */}
        {level.id === 1 && !isReadyToStart && !isPaused && guideStep !== 'done' && (
          <>
            {/* Step 1: TAP THE LIGHT */}
            {guideStep === 'tap_light' && (
              <div
                className="absolute pointer-events-none z-40 transition-all duration-300"
                style={{
                  left: `${2 * cellSize + cellSize / 2}px`,
                  top: `${3 * cellSize + cellSize / 2}px`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {/* Highlight Glow Ring around Traffic Light */}
                <div className="absolute -inset-4 rounded-2xl border-2 border-emerald-400 bg-emerald-500/20 animate-pulse-ring" />
                <div className="absolute -inset-6 rounded-3xl border border-emerald-300/40 animate-ping" />

                {/* Animated Hand Pointing to Light from below */}
                <div className="absolute top-12 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce">
                  <div className="text-3xl filter drop-shadow-lg select-none">
                    👆
                  </div>
                  <div className="bg-emerald-500 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-full shadow-2xl border-2 border-white tracking-widest whitespace-nowrap -mt-1 uppercase animate-pulse">
                    TAP THE LIGHT
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: NOW TAP THE CAR */}
            {guideStep === 'tap_car' && (
              <div
                className="absolute pointer-events-none z-40 transition-all duration-300"
                style={{
                  left: `${2 * cellSize + cellSize / 2}px`,
                  top: `${1 * cellSize + cellSize / 2}px`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {/* Highlight Glow Ring around Red Car */}
                <div className="absolute -inset-4 rounded-2xl border-2 border-amber-400 bg-amber-500/20 animate-pulse-ring" />
                <div className="absolute -inset-6 rounded-3xl border border-amber-300/40 animate-ping" />

                {/* Animated Hand Pointing to Car from below */}
                <div className="absolute top-10 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce">
                  <div className="text-3xl filter drop-shadow-lg select-none">
                    👆
                  </div>
                  <div className="bg-amber-400 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-full shadow-2xl border-2 border-white tracking-widest whitespace-nowrap -mt-1 uppercase animate-pulse">
                    NOW TAP THE CAR
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: REACH THE EXIT */}
            {guideStep === 'reach_exit' && (
              <div
                className="absolute pointer-events-none z-40 transition-all duration-300"
                style={{
                  left: `${2 * cellSize + cellSize / 2}px`,
                  top: `${7 * cellSize + cellSize / 2}px`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {/* Highlight Glow Ring around South Exit */}
                <div className="absolute -inset-4 rounded-2xl border-2 border-teal-400 bg-teal-500/20 animate-pulse-ring" />
                <div className="absolute -inset-6 rounded-3xl border border-teal-300/40 animate-ping" />

                {/* Animated Pointer Pointing to Exit from above */}
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce">
                  <div className="bg-teal-400 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-full shadow-2xl border-2 border-white tracking-widest whitespace-nowrap uppercase animate-pulse">
                    REACH THE EXIT
                  </div>
                  <div className="text-3xl filter drop-shadow-lg select-none -mt-1">
                    👇
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Level 2 Interactive Guided Tutorial Overlays */}
        {level.id === 2 && !isReadyToStart && !isPaused && l2GuideStep !== 'done' && (
          <>
            {/* Step 1: TAP THE LIGHT */}
            {l2GuideStep === 'tap_light_ns' && (
              <div
                className="absolute pointer-events-none z-40 transition-all duration-300"
                style={{
                  left: `${2 * cellSize + cellSize / 2}px`,
                  top: `${3 * cellSize + cellSize / 2}px`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className="absolute -inset-4 rounded-2xl border-2 border-emerald-400 bg-emerald-500/20 animate-pulse-ring" />
                <div className="absolute -inset-6 rounded-3xl border border-emerald-300/40 animate-ping" />
                <div className="absolute top-11 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce">
                  <div className="text-3xl filter drop-shadow-lg select-none">👆</div>
                  <div className="bg-emerald-500 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-full shadow-2xl border-2 border-white tracking-widest whitespace-nowrap -mt-1 uppercase animate-pulse">
                    TAP THE LIGHT
                  </div>
                  <div className="bg-slate-900/95 text-emerald-300 font-bold text-[10px] px-2.5 py-1 rounded-md border border-emerald-500/30 whitespace-nowrap mt-1 shadow">
                    Choose the direction that should get the GREEN LIGHT.
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: GOOD! NOW MOVE THE RED CAR */}
            {l2GuideStep === 'move_red_car' && (
              <div
                className="absolute pointer-events-none z-40 transition-all duration-300"
                style={{
                  left: `${2 * cellSize + cellSize / 2}px`,
                  top: `${1 * cellSize + cellSize / 2}px`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className="absolute -inset-4 rounded-2xl border-2 border-red-400 bg-red-500/20 animate-pulse-ring" />
                <div className="absolute -inset-6 rounded-3xl border border-red-300/40 animate-ping" />
                <div className="absolute top-10 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce">
                  <div className="text-3xl filter drop-shadow-lg select-none">👆</div>
                  <div className="bg-red-500 text-white font-black text-xs px-3.5 py-1.5 rounded-full shadow-2xl border-2 border-white tracking-widest whitespace-nowrap -mt-1 uppercase animate-pulse">
                    GOOD! NOW MOVE THE RED CAR
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: PERFECT! NOW LET THE NEXT VEHICLE PASS -> TAP THE LIGHT */}
            {l2GuideStep === 'tap_light_ew' && (
              <div
                className="absolute pointer-events-none z-40 transition-all duration-300"
                style={{
                  left: `${2 * cellSize + cellSize / 2}px`,
                  top: `${3 * cellSize + cellSize / 2}px`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className="absolute -inset-4 rounded-2xl border-2 border-emerald-400 bg-emerald-500/20 animate-pulse-ring" />
                <div className="absolute -inset-6 rounded-3xl border border-emerald-300/40 animate-ping" />
                <div className="absolute top-11 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce">
                  <div className="text-3xl filter drop-shadow-lg select-none">👆</div>
                  <div className="bg-emerald-500 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-full shadow-2xl border-2 border-white tracking-widest whitespace-nowrap -mt-1 uppercase animate-pulse">
                    TAP THE LIGHT
                  </div>
                  <div className="bg-slate-900/95 text-emerald-300 font-bold text-[10px] px-2.5 py-1 rounded-md border border-emerald-500/30 whitespace-nowrap mt-1 shadow">
                    PERFECT! NOW LET THE NEXT VEHICLE PASS
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: NOW MOVE THE BLUE CAR */}
            {l2GuideStep === 'move_blue_car' && (
              <div
                className="absolute pointer-events-none z-40 transition-all duration-300"
                style={{
                  left: `${1 * cellSize + cellSize / 2}px`,
                  top: `${3 * cellSize + cellSize / 2}px`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className="absolute -inset-4 rounded-2xl border-2 border-blue-400 bg-blue-500/20 animate-pulse-ring" />
                <div className="absolute -inset-6 rounded-3xl border border-blue-300/40 animate-ping" />
                <div className="absolute top-10 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce">
                  <div className="text-3xl filter drop-shadow-lg select-none">👆</div>
                  <div className="bg-blue-500 text-white font-black text-xs px-3.5 py-1.5 rounded-full shadow-2xl border-2 border-white tracking-widest whitespace-nowrap -mt-1 uppercase animate-pulse">
                    NOW MOVE THE BLUE CAR
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: NOW MOVE THE GREEN CAR */}
            {l2GuideStep === 'move_green_car' && (
              <div
                className="absolute pointer-events-none z-40 transition-all duration-300"
                style={{
                  left: `${0 * cellSize + cellSize / 2}px`,
                  top: `${3 * cellSize + cellSize / 2}px`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className="absolute -inset-4 rounded-2xl border-2 border-emerald-400 bg-emerald-500/20 animate-pulse-ring" />
                <div className="absolute -inset-6 rounded-3xl border border-emerald-300/40 animate-ping" />
                <div className="absolute top-10 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce">
                  <div className="text-3xl filter drop-shadow-lg select-none">👆</div>
                  <div className="bg-emerald-500 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-full shadow-2xl border-2 border-white tracking-widest whitespace-nowrap -mt-1 uppercase animate-pulse">
                    NOW MOVE THE GREEN CAR
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Active Player Hint Highlight Overlay */}
        {activeHint && !isReadyToStart && !isPaused && (
          (() => {
            let targetX = 0;
            let targetY = 0;
            let found = false;

            if (activeHint.targetType === 'traffic_light') {
              const tl = trafficLights.find((l) => l.id === activeHint.targetId);
              if (tl) {
                targetX = tl.position.x * cellSize + cellSize / 2;
                targetY = tl.position.y * cellSize + cellSize / 2;
                found = true;
              } else if (activeHint.position) {
                targetX = activeHint.position.x * cellSize + cellSize / 2;
                targetY = activeHint.position.y * cellSize + cellSize / 2;
                found = true;
              }
            } else if (activeHint.targetType === 'vehicle') {
              const v = vehicles.find((car) => car.id === activeHint.targetId);
              if (v) {
                targetX = v.currentPos.x * cellSize + cellSize / 2;
                targetY = v.currentPos.y * cellSize + cellSize / 2;
                found = true;
              } else if (activeHint.position) {
                targetX = activeHint.position.x * cellSize + cellSize / 2;
                targetY = activeHint.position.y * cellSize + cellSize / 2;
                found = true;
              }
            } else if (activeHint.targetType === 'barrier') {
              const b = barriers.find((bar) => bar.id === activeHint.targetId);
              if (b) {
                targetX = b.position.x * cellSize + cellSize / 2;
                targetY = b.position.y * cellSize + cellSize / 2;
                found = true;
              } else if (activeHint.position) {
                targetX = activeHint.position.x * cellSize + cellSize / 2;
                targetY = activeHint.position.y * cellSize + cellSize / 2;
                found = true;
              }
            } else if (activeHint.targetType === 'exit' && activeHint.position) {
              targetX = activeHint.position.x * cellSize + cellSize / 2;
              targetY = activeHint.position.y * cellSize + cellSize / 2;
              found = true;
            }

            if (activeHint.targetType === 'wait') {
              return (
                <div className="absolute inset-0 pointer-events-none z-40 flex items-center justify-center p-4">
                  <div className="bg-[#1A1F26]/95 border-2 border-amber-400 text-amber-300 px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-bounce">
                    <span className="text-xl">⏳</span>
                    <div className="flex flex-col text-left">
                      <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest leading-tight">
                        HINT
                      </span>
                      <span className="text-xs font-black text-white uppercase tracking-wider">
                        {activeHint.message}
                      </span>
                    </div>
                  </div>
                </div>
              );
            }

            if (!found) return null;

            return (
              <div
                className="absolute pointer-events-none z-40 transition-all duration-300"
                style={{
                  left: `${targetX}px`,
                  top: `${targetY}px`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {/* Highlight Glow Ring around target */}
                <div className="absolute -inset-4 rounded-2xl border-2 border-amber-400 bg-amber-400/20 animate-pulse-ring" />
                <div className="absolute -inset-6 rounded-3xl border border-amber-300/40 animate-ping" />

                {/* Animated Pointer with Hint message */}
                <div className="absolute top-10 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce">
                  <div className="text-3xl filter drop-shadow-lg select-none">👆</div>
                  <div className="bg-amber-400 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-full shadow-2xl border-2 border-white tracking-widest whitespace-nowrap -mt-1 uppercase">
                    {activeHint.message}
                  </div>
                </div>
              </div>
            );
          })()
        )}

        {/* Ready to Start Overlay */}
        {isReadyToStart && (
          <div className="absolute inset-0 z-40 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 select-none animate-fadeIn">
            <div className="w-full max-w-xs bg-[#1A1F26] border border-[#2C333D] rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border-2 border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20">
                <Play className="w-7 h-7 fill-emerald-400 text-emerald-400 ml-1" />
              </div>

              <div>
                <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">
                  LEVEL {level.id}
                </span>
                <h2 className="text-xl font-black text-white tracking-wide mt-0.5">
                  {level.title.toUpperCase()}
                </h2>
                <p className="mt-1.5 text-xs text-slate-300 leading-relaxed font-medium">
                  {level.id === 2
                    ? 'Control the traffic light and let each vehicle pass safely.'
                    : level.subtitle || 'Safely dispatch traffic to the matching exits.'}
                </p>
              </div>

              <button
                id="btn-start-level"
                onClick={() => {
                  sound.playButton();
                  onStartLevel?.();
                }}
                className="w-full h-12 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-950/40 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>START LEVEL</span>
              </button>
            </div>
          </div>
        )}

        {/* Safety Feedback / Collision Warning Toast (Requirement 8) */}
        {collisionWarning && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50 pointer-events-none select-none animate-bounce">
            <div className="bg-amber-500 text-slate-950 px-3.5 py-1.5 rounded-full font-black text-xs uppercase tracking-wider shadow-2xl border-2 border-white flex items-center gap-1.5 whitespace-nowrap">
              <span className="text-sm">⚠️</span>
              <span>{collisionWarning}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
