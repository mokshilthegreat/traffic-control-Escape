export type VehicleType =
  | 'red_car'
  | 'blue_car'
  | 'yellow_car'
  | 'green_car'
  | 'orange_car'
  | 'ambulance'
  | 'police'
  | 'delivery'
  | 'bus'
  | 'taxi';

export type ExitColor = 'red' | 'blue' | 'yellow' | 'green' | 'orange' | 'any';

export type LightState = 'NS_GREEN' | 'EW_GREEN';

export type BarrierState = 'open' | 'closed';

export type BarrierTrigger = 'manual' | 'auto_timer' | 'vehicle_exit';

export interface Point {
  x: number;
  y: number;
}

export interface ExitDefinition {
  id: string;
  name: string;
  position: Point; // Grid cell or coordinate
  direction: 'north' | 'south' | 'east' | 'west';
  color: ExitColor;
  label?: string;
}

export interface TrafficLightDefinition {
  id: string;
  intersectionId: string;
  position: Point;
  state: LightState;
  isAuto?: boolean;
  cycleSeconds?: number;
}

export interface BarrierDefinition {
  id: string;
  position: Point;
  orientation: 'horizontal' | 'vertical';
  state: BarrierState;
  triggerType: BarrierTrigger;
  linkedExitId?: string;
  label?: string;
}

export interface VehicleDefinition {
  id: string;
  type: VehicleType;
  colorName: string;
  displayColor: string;
  length: number; // 1 = standard, 1.4 = delivery, 1.8 = bus
  speed: number; // grid units per second (e.g. 2.5)
  isPriority?: boolean; // ambulance / police
  canIgnoreRed?: boolean; // police
  currentPos: Point;
  startPos: Point;
  direction: 'north' | 'south' | 'east' | 'west';
  targetExitId: string;
  path: Point[]; // Sequence of grid waypoints from start to exit
  isMoving: boolean;
  hasExited: boolean;
  isCollided: boolean;
  pathIndex: number;
  pathProgress: number; // 0 to 1 between current waypoint and next
}

export interface IntersectionDefinition {
  id: string;
  position: Point;
  hasTrafficLight: boolean;
  lightId?: string;
}

export interface LevelDefinition {
  id: number;
  title: string;
  subtitle: string;
  gridWidth: number;
  gridHeight: number;
  tutorialHint?: string;
  targetScore: number;
  parTimeSeconds: number;
  roads: {
    // Road segments defined by row/col spans
    type: 'h-road' | 'v-road' | 'intersection' | 'curve' | 'decor';
    x: number;
    y: number;
    subType?: string;
  }[];
  intersections: IntersectionDefinition[];
  trafficLights: TrafficLightDefinition[];
  barriers: BarrierDefinition[];
  exits: ExitDefinition[];
  vehicles: VehicleDefinition[];
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  hapticsEnabled: boolean;
  reducedMotion: boolean;
  colorblindMode: boolean;
}

export interface LevelProgress {
  stars: number; // 0 to 3
  unlocked: boolean;
  completed: boolean;
  highScore: number;
}

export type GameScreenState =
  | 'splash'
  | 'home'
  | 'level_select'
  | 'gameplay'
  | 'how_to_play'
  | 'settings';

export type GameplayStatus =
  | 'ready'
  | 'playing'
  | 'paused'
  | 'level_complete'
  | 'game_over';

export type HintTargetType = 'traffic_light' | 'vehicle' | 'barrier' | 'wait' | 'exit';

export interface HintResult {
  id: string;
  message: string;
  targetType: HintTargetType;
  targetId?: string;
  position?: Point;
}

