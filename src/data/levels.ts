import { LevelDefinition, VehicleDefinition, TrafficLightDefinition, BarrierDefinition, ExitDefinition } from '../types/game';

export const VEHICLE_COLORS = {
  red_car: { name: 'Crimson Cruiser', hex: '#ef4444', text: 'Red' },
  blue_car: { name: 'Cobalt Sedan', hex: '#3b82f6', text: 'Blue' },
  yellow_car: { name: 'Amber Hatch', hex: '#eab308', text: 'Yellow' },
  green_car: { name: 'Emerald Compact', hex: '#10b981', text: 'Green' },
  orange_car: { name: 'Sunset Coupe', hex: '#f97316', text: 'Orange' },
  ambulance: { name: 'City Ambulance', hex: '#f43f5e', text: 'Ambulance' },
  police: { name: 'Metro Police', hex: '#2563eb', text: 'Police' },
  delivery: { name: 'Express Van', hex: '#8b5cf6', text: 'Delivery' },
  bus: { name: 'Transit Bus', hex: '#06b6d4', text: 'Transit' },
  taxi: { name: 'City Taxi', hex: '#facc15', text: 'Taxi' },
};

// Standard grid size: 6 cols (0..5), 8 rows (0..7)
// Helper to build straight and cross paths
export const LEVELS: LevelDefinition[] = [
  // ==========================================
  // LEVEL 1: FIRST GREEN (Tutorial)
  // ==========================================
  {
    id: 1,
    title: 'First Green',
    subtitle: 'Learn signal control and vehicle dispatch',
    gridWidth: 6,
    gridHeight: 8,
    tutorialHint: 'Tap the traffic light to turn GREEN for the red car, then tap the car to move!',
    targetScore: 400,
    parTimeSeconds: 20,
    roads: [
      { type: 'v-road', x: 2, y: 0 },
      { type: 'v-road', x: 2, y: 1 },
      { type: 'v-road', x: 2, y: 2 },
      { type: 'intersection', x: 2, y: 3 },
      { type: 'v-road', x: 2, y: 4 },
      { type: 'v-road', x: 2, y: 5 },
      { type: 'v-road', x: 2, y: 6 },
      { type: 'v-road', x: 2, y: 7 },
      { type: 'h-road', x: 0, y: 3 },
      { type: 'h-road', x: 1, y: 3 },
      { type: 'h-road', x: 3, y: 3 },
      { type: 'h-road', x: 4, y: 3 },
      { type: 'h-road', x: 5, y: 3 },
    ],
    intersections: [{ id: 'int-1', position: { x: 2, y: 3 }, hasTrafficLight: true, lightId: 'tl-1' }],
    trafficLights: [{ id: 'tl-1', intersectionId: 'int-1', position: { x: 2, y: 3 }, state: 'EW_GREEN' }],
    barriers: [],
    exits: [
      { id: 'exit-south', name: 'South Exit', position: { x: 2, y: 7 }, direction: 'south', color: 'red' },
      { id: 'exit-east', name: 'East Exit', position: { x: 5, y: 3 }, direction: 'east', color: 'blue' },
    ],
    vehicles: [
      {
        id: 'v-red-1',
        type: 'red_car',
        colorName: 'red',
        displayColor: '#ef4444',
        length: 1,
        speed: 2.5,
        startPos: { x: 2, y: 1 },
        currentPos: { x: 2, y: 1 },
        direction: 'south',
        targetExitId: 'exit-south',
        path: [{ x: 2, y: 1 }, { x: 2, y: 2 }, { x: 2, y: 3 }, { x: 2, y: 4 }, { x: 2, y: 5 }, { x: 2, y: 6 }, { x: 2, y: 7 }],
        isMoving: false,
        hasExited: false,
        isCollided: false,
        pathIndex: 0,
        pathProgress: 0,
      },
      {
        id: 'v-blue-1',
        type: 'blue_car',
        colorName: 'blue',
        displayColor: '#3b82f6',
        length: 1,
        speed: 2.5,
        startPos: { x: 0, y: 3 },
        currentPos: { x: 0, y: 3 },
        direction: 'east',
        targetExitId: 'exit-east',
        path: [{ x: 0, y: 3 }, { x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 4, y: 3 }, { x: 5, y: 3 }],
        isMoving: false,
        hasExited: false,
        isCollided: false,
        pathIndex: 0,
        pathProgress: 0,
      },
    ],
  },

  // ==========================================
  // LEVEL 2: CROSSROADS TIMING
  // ==========================================
  {
    id: 2,
    title: 'Crossroads Timing',
    subtitle: 'Control the traffic light and let each vehicle pass safely.',
    gridWidth: 6,
    gridHeight: 8,
    tutorialHint: 'Traffic lights protect the intersection. Red cars must wait until NS is green!',
    targetScore: 600,
    parTimeSeconds: 30,
    roads: [
      { type: 'v-road', x: 2, y: 0 }, { type: 'v-road', x: 2, y: 1 }, { type: 'v-road', x: 2, y: 2 },
      { type: 'intersection', x: 2, y: 3 },
      { type: 'v-road', x: 2, y: 4 }, { type: 'v-road', x: 2, y: 5 }, { type: 'v-road', x: 2, y: 6 }, { type: 'v-road', x: 2, y: 7 },
      { type: 'h-road', x: 0, y: 3 }, { type: 'h-road', x: 1, y: 3 }, { type: 'h-road', x: 3, y: 3 }, { type: 'h-road', x: 4, y: 3 }, { type: 'h-road', x: 5, y: 3 },
    ],
    intersections: [{ id: 'int-1', position: { x: 2, y: 3 }, hasTrafficLight: true, lightId: 'tl-1' }],
    trafficLights: [{ id: 'tl-1', intersectionId: 'int-1', position: { x: 2, y: 3 }, state: 'EW_GREEN' }],
    barriers: [],
    exits: [
      { id: 'exit-south', name: 'South Exit', position: { x: 2, y: 7 }, direction: 'south', color: 'red' },
      { id: 'exit-east', name: 'East Exit', position: { x: 5, y: 3 }, direction: 'east', color: 'blue' },
      { id: 'exit-north', name: 'North Exit', position: { x: 2, y: 0 }, direction: 'north', color: 'green' },
    ],
    vehicles: [
      {
        id: 'v-1',
        type: 'red_car',
        colorName: 'red',
        displayColor: '#ef4444',
        length: 1,
        speed: 2.5,
        startPos: { x: 2, y: 1 },
        currentPos: { x: 2, y: 1 },
        direction: 'south',
        targetExitId: 'exit-south',
        path: [{ x: 2, y: 1 }, { x: 2, y: 2 }, { x: 2, y: 3 }, { x: 2, y: 4 }, { x: 2, y: 5 }, { x: 2, y: 6 }, { x: 2, y: 7 }],
        isMoving: false,
        hasExited: false,
        isCollided: false,
        pathIndex: 0,
        pathProgress: 0,
      },
      {
        id: 'v-2',
        type: 'blue_car',
        colorName: 'blue',
        displayColor: '#3b82f6',
        length: 1,
        speed: 2.5,
        startPos: { x: 1, y: 3 },
        currentPos: { x: 1, y: 3 },
        direction: 'east',
        targetExitId: 'exit-east',
        path: [{ x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 4, y: 3 }, { x: 5, y: 3 }],
        isMoving: false,
        hasExited: false,
        isCollided: false,
        pathIndex: 0,
        pathProgress: 0,
      },
      {
        id: 'v-3',
        type: 'green_car',
        colorName: 'green',
        displayColor: '#10b981',
        length: 1,
        speed: 2.5,
        startPos: { x: 0, y: 3 },
        currentPos: { x: 0, y: 3 },
        direction: 'east',
        targetExitId: 'exit-north',
        path: [{ x: 0, y: 3 }, { x: 1, y: 3 }, { x: 2, y: 3 }, { x: 2, y: 2 }, { x: 2, y: 1 }, { x: 2, y: 0 }],
        isMoving: false,
        hasExited: false,
        isCollided: false,
        pathIndex: 0,
        pathProgress: 0,
      },
    ],
  },

  // ==========================================
  // LEVEL 3: COLOR MATCH
  // ==========================================
  {
    id: 3,
    title: 'Color Match',
    subtitle: 'Each car has a matching color exit sign',
    gridWidth: 6,
    gridHeight: 8,
    tutorialHint: 'Check the vehicle color and its destination exit sign.',
    targetScore: 750,
    parTimeSeconds: 25,
    roads: [
      { type: 'v-road', x: 1, y: 0 }, { type: 'v-road', x: 1, y: 1 }, { type: 'v-road', x: 1, y: 2 }, { type: 'intersection', x: 1, y: 3 }, { type: 'v-road', x: 1, y: 4 }, { type: 'v-road', x: 1, y: 5 }, { type: 'v-road', x: 1, y: 6 }, { type: 'v-road', x: 1, y: 7 },
      { type: 'v-road', x: 4, y: 0 }, { type: 'v-road', x: 4, y: 1 }, { type: 'v-road', x: 4, y: 2 }, { type: 'intersection', x: 4, y: 3 }, { type: 'v-road', x: 4, y: 4 }, { type: 'v-road', x: 4, y: 5 }, { type: 'v-road', x: 4, y: 6 }, { type: 'v-road', x: 4, y: 7 },
      { type: 'h-road', x: 0, y: 3 }, { type: 'h-road', x: 2, y: 3 }, { type: 'h-road', x: 3, y: 3 }, { type: 'h-road', x: 5, y: 3 },
    ],
    intersections: [
      { id: 'int-1', position: { x: 1, y: 3 }, hasTrafficLight: true, lightId: 'tl-1' },
      { id: 'int-2', position: { x: 4, y: 3 }, hasTrafficLight: true, lightId: 'tl-2' },
    ],
    trafficLights: [
      { id: 'tl-1', intersectionId: 'int-1', position: { x: 1, y: 3 }, state: 'NS_GREEN' },
      { id: 'tl-2', intersectionId: 'int-2', position: { x: 4, y: 3 }, state: 'EW_GREEN' },
    ],
    barriers: [],
    exits: [
      { id: 'exit-s1', name: 'Red South', position: { x: 1, y: 7 }, direction: 'south', color: 'red' },
      { id: 'exit-s2', name: 'Yellow South', position: { x: 4, y: 7 }, direction: 'south', color: 'yellow' },
      { id: 'exit-e', name: 'Blue East', position: { x: 5, y: 3 }, direction: 'east', color: 'blue' },
    ],
    vehicles: [
      {
        id: 'v-red',
        type: 'red_car',
        colorName: 'red',
        displayColor: '#ef4444',
        length: 1,
        speed: 2.5,
        startPos: { x: 1, y: 1 },
        currentPos: { x: 1, y: 1 },
        direction: 'south',
        targetExitId: 'exit-s1',
        path: [{ x: 1, y: 1 }, { x: 1, y: 2 }, { x: 1, y: 3 }, { x: 1, y: 4 }, { x: 1, y: 5 }, { x: 1, y: 6 }, { x: 1, y: 7 }],
        isMoving: false,
        hasExited: false,
        isCollided: false,
        pathIndex: 0,
        pathProgress: 0,
      },
      {
        id: 'v-yellow',
        type: 'yellow_car',
        colorName: 'yellow',
        displayColor: '#eab308',
        length: 1,
        speed: 2.5,
        startPos: { x: 4, y: 1 },
        currentPos: { x: 4, y: 1 },
        direction: 'south',
        targetExitId: 'exit-s2',
        path: [{ x: 4, y: 1 }, { x: 4, y: 2 }, { x: 4, y: 3 }, { x: 4, y: 4 }, { x: 4, y: 5 }, { x: 4, y: 6 }, { x: 4, y: 7 }],
        isMoving: false,
        hasExited: false,
        isCollided: false,
        pathIndex: 0,
        pathProgress: 0,
      },
      {
        id: 'v-blue',
        type: 'blue_car',
        colorName: 'blue',
        displayColor: '#3b82f6',
        length: 1,
        speed: 2.5,
        startPos: { x: 0, y: 3 },
        currentPos: { x: 0, y: 3 },
        direction: 'east',
        targetExitId: 'exit-e',
        path: [{ x: 0, y: 3 }, { x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 4, y: 3 }, { x: 5, y: 3 }],
        isMoving: false,
        hasExited: false,
        isCollided: false,
        pathIndex: 0,
        pathProgress: 0,
      },
    ],
  },

  // ==========================================
  // LEVEL 4: THE BOOM GATE
  // ==========================================
  {
    id: 4,
    title: 'The Boom Gate',
    subtitle: 'Tap the barrier switch to open the railway road gate',
    gridWidth: 6,
    gridHeight: 8,
    tutorialHint: 'Tap the boom barrier to raise it before tapping the car!',
    targetScore: 800,
    parTimeSeconds: 25,
    roads: [
      { type: 'v-road', x: 3, y: 0 }, { type: 'v-road', x: 3, y: 1 }, { type: 'v-road', x: 3, y: 2 }, { type: 'intersection', x: 3, y: 3 }, { type: 'v-road', x: 3, y: 4 }, { type: 'v-road', x: 3, y: 5 }, { type: 'v-road', x: 3, y: 6 }, { type: 'v-road', x: 3, y: 7 },
      { type: 'h-road', x: 0, y: 3 }, { type: 'h-road', x: 1, y: 3 }, { type: 'h-road', x: 2, y: 3 }, { type: 'h-road', x: 4, y: 3 }, { type: 'h-road', x: 5, y: 3 },
    ],
    intersections: [{ id: 'int-1', position: { x: 3, y: 3 }, hasTrafficLight: true, lightId: 'tl-1' }],
    trafficLights: [{ id: 'tl-1', intersectionId: 'int-1', position: { x: 3, y: 3 }, state: 'EW_GREEN' }],
    barriers: [
      { id: 'gate-1', position: { x: 3, y: 5 }, orientation: 'horizontal', state: 'closed', triggerType: 'manual', label: 'Gate A' },
    ],
    exits: [
      { id: 'exit-south', name: 'South Exit', position: { x: 3, y: 7 }, direction: 'south', color: 'red' },
      { id: 'exit-east', name: 'East Exit', position: { x: 5, y: 3 }, direction: 'east', color: 'orange' },
    ],
    vehicles: [
      {
        id: 'v-red',
        type: 'red_car',
        colorName: 'red',
        displayColor: '#ef4444',
        length: 1,
        speed: 2.5,
        startPos: { x: 3, y: 1 },
        currentPos: { x: 3, y: 1 },
        direction: 'south',
        targetExitId: 'exit-south',
        path: [{ x: 3, y: 1 }, { x: 3, y: 2 }, { x: 3, y: 3 }, { x: 3, y: 4 }, { x: 3, y: 5 }, { x: 3, y: 6 }, { x: 3, y: 7 }],
        isMoving: false,
        hasExited: false,
        isCollided: false,
        pathIndex: 0,
        pathProgress: 0,
      },
      {
        id: 'v-orange',
        type: 'orange_car',
        colorName: 'orange',
        displayColor: '#f97316',
        length: 1,
        speed: 2.5,
        startPos: { x: 0, y: 3 },
        currentPos: { x: 0, y: 3 },
        direction: 'east',
        targetExitId: 'exit-east',
        path: [{ x: 0, y: 3 }, { x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 4, y: 3 }, { x: 5, y: 3 }],
        isMoving: false,
        hasExited: false,
        isCollided: false,
        pathIndex: 0,
        pathProgress: 0,
      },
    ],
  },

  // ==========================================
  // LEVEL 5: SWIFT TAXI
  // ==========================================
  {
    id: 5,
    title: 'Swift Taxi',
    subtitle: 'Taxis drive at higher velocity!',
    gridWidth: 6,
    gridHeight: 8,
    tutorialHint: 'Clear the north road first, then switch the light to let the blue car cross!',
    targetScore: 900,
    parTimeSeconds: 20,
    roads: [
      { type: 'v-road', x: 2, y: 0 }, { type: 'v-road', x: 2, y: 1 }, { type: 'v-road', x: 2, y: 2 }, { type: 'v-road', x: 2, y: 3 }, { type: 'intersection', x: 2, y: 4 }, { type: 'v-road', x: 2, y: 5 }, { type: 'v-road', x: 2, y: 6 }, { type: 'v-road', x: 2, y: 7 },
      { type: 'h-road', x: 0, y: 4 }, { type: 'h-road', x: 1, y: 4 }, { type: 'h-road', x: 3, y: 4 }, { type: 'h-road', x: 4, y: 4 }, { type: 'h-road', x: 5, y: 4 },
    ],
    intersections: [{ id: 'int-1', position: { x: 2, y: 4 }, hasTrafficLight: true, lightId: 'tl-1' }],
    trafficLights: [{ id: 'tl-1', intersectionId: 'int-1', position: { x: 2, y: 4 }, state: 'NS_GREEN' }],
    barriers: [],
    exits: [
      { id: 'exit-n', name: 'North Exit', position: { x: 2, y: 0 }, direction: 'north', color: 'green' },
      { id: 'exit-e', name: 'East Exit', position: { x: 5, y: 4 }, direction: 'east', color: 'blue' },
      { id: 'exit-s', name: 'South Exit', position: { x: 2, y: 7 }, direction: 'south', color: 'yellow' },
    ],
    vehicles: [
      {
        id: 'v-green',
        type: 'green_car',
        colorName: 'green',
        displayColor: '#10b981',
        length: 1,
        speed: 2.5,
        startPos: { x: 2, y: 2 },
        currentPos: { x: 2, y: 2 },
        direction: 'north',
        targetExitId: 'exit-n',
        path: [{ x: 2, y: 2 }, { x: 2, y: 1 }, { x: 2, y: 0 }],
        isMoving: false,
        hasExited: false,
        isCollided: false,
        pathIndex: 0,
        pathProgress: 0,
      },
      {
        id: 'v-blue',
        type: 'blue_car',
        colorName: 'blue',
        displayColor: '#3b82f6',
        length: 1,
        speed: 2.5,
        startPos: { x: 0, y: 4 },
        currentPos: { x: 0, y: 4 },
        direction: 'east',
        targetExitId: 'exit-e',
        path: [{ x: 0, y: 4 }, { x: 1, y: 4 }, { x: 2, y: 4 }, { x: 3, y: 4 }, { x: 4, y: 4 }, { x: 5, y: 4 }],
        isMoving: false,
        hasExited: false,
        isCollided: false,
        pathIndex: 0,
        pathProgress: 0,
      },
      {
        id: 'v-taxi',
        type: 'taxi',
        colorName: 'yellow',
        displayColor: '#facc15',
        length: 1,
        speed: 3.8, // Extra fast
        startPos: { x: 2, y: 6 },
        currentPos: { x: 2, y: 6 },
        direction: 'north',
        targetExitId: 'exit-n',
        path: [{ x: 2, y: 6 }, { x: 2, y: 5 }, { x: 2, y: 4 }, { x: 2, y: 3 }, { x: 2, y: 2 }, { x: 2, y: 1 }, { x: 2, y: 0 }],
        isMoving: false,
        hasExited: false,
        isCollided: false,
        pathIndex: 0,
        pathProgress: 0,
      },
    ],
  },

  // ==========================================
  // LEVEL 6: EMERGENCY SIREN
  // ==========================================
  {
    id: 6,
    title: 'Emergency Siren',
    subtitle: 'Ambulance requires immediate right-of-way',
    gridWidth: 6,
    gridHeight: 8,
    tutorialHint: 'Priority vehicle: Clear the ambulance lane first so emergency response is swift!',
    targetScore: 1000,
    parTimeSeconds: 24,
    roads: [
      { type: 'v-road', x: 1, y: 0 }, { type: 'v-road', x: 1, y: 1 }, { type: 'v-road', x: 1, y: 2 }, { type: 'intersection', x: 1, y: 3 }, { type: 'v-road', x: 1, y: 4 }, { type: 'v-road', x: 1, y: 5 }, { type: 'v-road', x: 1, y: 6 }, { type: 'v-road', x: 1, y: 7 },
      { type: 'h-road', x: 0, y: 3 }, { type: 'h-road', x: 2, y: 3 }, { type: 'h-road', x: 3, y: 3 }, { type: 'intersection', x: 4, y: 3 }, { type: 'h-road', x: 5, y: 3 },
      { type: 'v-road', x: 4, y: 0 }, { type: 'v-road', x: 4, y: 1 }, { type: 'v-road', x: 4, y: 2 }, { type: 'v-road', x: 4, y: 4 }, { type: 'v-road', x: 4, y: 5 }, { type: 'v-road', x: 4, y: 6 }, { type: 'v-road', x: 4, y: 7 },
    ],
    intersections: [
      { id: 'int-1', position: { x: 1, y: 3 }, hasTrafficLight: true, lightId: 'tl-1' },
      { id: 'int-2', position: { x: 4, y: 3 }, hasTrafficLight: true, lightId: 'tl-2' },
    ],
    trafficLights: [
      { id: 'tl-1', intersectionId: 'int-1', position: { x: 1, y: 3 }, state: 'EW_GREEN' },
      { id: 'tl-2', intersectionId: 'int-2', position: { x: 4, y: 3 }, state: 'EW_GREEN' },
    ],
    barriers: [],
    exits: [
      { id: 'exit-e', name: 'Hospital East', position: { x: 5, y: 3 }, direction: 'east', color: 'red' },
      { id: 'exit-s1', name: 'South 1', position: { x: 1, y: 7 }, direction: 'south', color: 'blue' },
      { id: 'exit-s2', name: 'South 2', position: { x: 4, y: 7 }, direction: 'south', color: 'orange' },
    ],
    vehicles: [
      {
        id: 'v-amb',
        type: 'ambulance',
        colorName: 'red',
        displayColor: '#f43f5e',
        length: 1.2,
        speed: 3.2,
        isPriority: true,
        startPos: { x: 0, y: 3 },
        currentPos: { x: 0, y: 3 },
        direction: 'east',
        targetExitId: 'exit-e',
        path: [{ x: 0, y: 3 }, { x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 4, y: 3 }, { x: 5, y: 3 }],
        isMoving: false,
        hasExited: false,
        isCollided: false,
        pathIndex: 0,
        pathProgress: 0,
      },
      {
        id: 'v-blue',
        type: 'blue_car',
        colorName: 'blue',
        displayColor: '#3b82f6',
        length: 1,
        speed: 2.5,
        startPos: { x: 1, y: 1 },
        currentPos: { x: 1, y: 1 },
        direction: 'south',
        targetExitId: 'exit-s1',
        path: [{ x: 1, y: 1 }, { x: 1, y: 2 }, { x: 1, y: 3 }, { x: 1, y: 4 }, { x: 1, y: 5 }, { x: 1, y: 6 }, { x: 1, y: 7 }],
        isMoving: false,
        hasExited: false,
        isCollided: false,
        pathIndex: 0,
        pathProgress: 0,
      },
      {
        id: 'v-orange',
        type: 'orange_car',
        colorName: 'orange',
        displayColor: '#f97316',
        length: 1,
        speed: 2.5,
        startPos: { x: 4, y: 1 },
        currentPos: { x: 4, y: 1 },
        direction: 'south',
        targetExitId: 'exit-s2',
        path: [{ x: 4, y: 1 }, { x: 4, y: 2 }, { x: 4, y: 3 }, { x: 4, y: 4 }, { x: 4, y: 5 }, { x: 4, y: 6 }, { x: 4, y: 7 }],
        isMoving: false,
        hasExited: false,
        isCollided: false,
        pathIndex: 0,
        pathProgress: 0,
      },
    ],
  },

  // ==========================================
  // LEVEL 7: HEAVY CARGO
  // ==========================================
  {
    id: 7,
    title: 'Heavy Cargo',
    subtitle: 'Delivery van needs extra clearance time',
    gridWidth: 6,
    gridHeight: 8,
    tutorialHint: 'Delivery van is long; ensure the intersection stays clear while it passes.',
    targetScore: 1100,
    parTimeSeconds: 26,
    roads: [
      { type: 'v-road', x: 2, y: 0 }, { type: 'v-road', x: 2, y: 1 }, { type: 'v-road', x: 2, y: 2 }, { type: 'intersection', x: 2, y: 3 }, { type: 'v-road', x: 2, y: 4 }, { type: 'intersection', x: 2, y: 5 }, { type: 'v-road', x: 2, y: 6 }, { type: 'v-road', x: 2, y: 7 },
      { type: 'h-road', x: 0, y: 3 }, { type: 'h-road', x: 1, y: 3 }, { type: 'h-road', x: 3, y: 3 }, { type: 'h-road', x: 4, y: 3 }, { type: 'h-road', x: 5, y: 3 },
      { type: 'h-road', x: 0, y: 5 }, { type: 'h-road', x: 1, y: 5 }, { type: 'h-road', x: 3, y: 5 }, { type: 'h-road', x: 4, y: 5 }, { type: 'h-road', x: 5, y: 5 },
    ],
    intersections: [
      { id: 'int-1', position: { x: 2, y: 3 }, hasTrafficLight: true, lightId: 'tl-1' },
      { id: 'int-2', position: { x: 2, y: 5 }, hasTrafficLight: true, lightId: 'tl-2' },
    ],
    trafficLights: [
      { id: 'tl-1', intersectionId: 'int-1', position: { x: 2, y: 3 }, state: 'NS_GREEN' },
      { id: 'tl-2', intersectionId: 'int-2', position: { x: 2, y: 5 }, state: 'NS_GREEN' },
    ],
    barriers: [],
    exits: [
      { id: 'exit-s', name: 'Logistics South', position: { x: 2, y: 7 }, direction: 'south', color: 'any' },
      { id: 'exit-e1', name: 'East 1', position: { x: 5, y: 3 }, direction: 'east', color: 'blue' },
      { id: 'exit-e2', name: 'East 2', position: { x: 5, y: 5 }, direction: 'east', color: 'yellow' },
    ],
    vehicles: [
      {
        id: 'v-deliv',
        type: 'delivery',
        colorName: 'purple',
        displayColor: '#8b5cf6',
        length: 1.5,
        speed: 2.1,
        startPos: { x: 2, y: 0 },
        currentPos: { x: 2, y: 0 },
        direction: 'south',
        targetExitId: 'exit-s',
        path: [{ x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 2, y: 3 }, { x: 2, y: 4 }, { x: 2, y: 5 }, { x: 2, y: 6 }, { x: 2, y: 7 }],
        isMoving: false,
        hasExited: false,
        isCollided: false,
        pathIndex: 0,
        pathProgress: 0,
      },
      {
        id: 'v-blue',
        type: 'blue_car',
        colorName: 'blue',
        displayColor: '#3b82f6',
        length: 1,
        speed: 2.5,
        startPos: { x: 0, y: 3 },
        currentPos: { x: 0, y: 3 },
        direction: 'east',
        targetExitId: 'exit-e1',
        path: [{ x: 0, y: 3 }, { x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 4, y: 3 }, { x: 5, y: 3 }],
        isMoving: false,
        hasExited: false,
        isCollided: false,
        pathIndex: 0,
        pathProgress: 0,
      },
      {
        id: 'v-yellow',
        type: 'yellow_car',
        colorName: 'yellow',
        displayColor: '#eab308',
        length: 1,
        speed: 2.5,
        startPos: { x: 0, y: 5 },
        currentPos: { x: 0, y: 5 },
        direction: 'east',
        targetExitId: 'exit-e2',
        path: [{ x: 0, y: 5 }, { x: 1, y: 5 }, { x: 2, y: 5 }, { x: 3, y: 5 }, { x: 4, y: 5 }, { x: 5, y: 5 }],
        isMoving: false,
        hasExited: false,
        isCollided: false,
        pathIndex: 0,
        pathProgress: 0,
      },
    ],
  },

  // ==========================================
  // LEVEL 8: DUAL BOULEVARD
  // ==========================================
  {
    id: 8,
    title: 'Dual Boulevard',
    subtitle: 'Synchronize 2 signals along the avenue',
    gridWidth: 6,
    gridHeight: 8,
    targetScore: 1200,
    parTimeSeconds: 28,
    roads: [
      { type: 'v-road', x: 2, y: 0 }, { type: 'v-road', x: 2, y: 1 }, { type: 'intersection', x: 2, y: 2 }, { type: 'v-road', x: 2, y: 3 }, { type: 'intersection', x: 2, y: 5 }, { type: 'v-road', x: 2, y: 6 }, { type: 'v-road', x: 2, y: 7 },
      { type: 'h-road', x: 0, y: 2 }, { type: 'h-road', x: 1, y: 2 }, { type: 'h-road', x: 3, y: 2 }, { type: 'h-road', x: 4, y: 2 }, { type: 'h-road', x: 5, y: 2 },
      { type: 'h-road', x: 0, y: 5 }, { type: 'h-road', x: 1, y: 5 }, { type: 'h-road', x: 3, y: 5 }, { type: 'h-road', x: 4, y: 5 }, { type: 'h-road', x: 5, y: 5 },
    ],
    intersections: [
      { id: 'int-1', position: { x: 2, y: 2 }, hasTrafficLight: true, lightId: 'tl-1' },
      { id: 'int-2', position: { x: 2, y: 5 }, hasTrafficLight: true, lightId: 'tl-2' },
    ],
    trafficLights: [
      { id: 'tl-1', intersectionId: 'int-1', position: { x: 2, y: 2 }, state: 'EW_GREEN' },
      { id: 'tl-2', intersectionId: 'int-2', position: { x: 2, y: 5 }, state: 'NS_GREEN' },
    ],
    barriers: [],
    exits: [
      { id: 'exit-s', name: 'South End', position: { x: 2, y: 7 }, direction: 'south', color: 'red' },
      { id: 'exit-e1', name: 'East Upper', position: { x: 5, y: 2 }, direction: 'east', color: 'blue' },
      { id: 'exit-w2', name: 'West Lower', position: { x: 0, y: 5 }, direction: 'west', color: 'green' },
    ],
    vehicles: [
      {
        id: 'v-red',
        type: 'red_car',
        colorName: 'red',
        displayColor: '#ef4444',
        length: 1,
        speed: 2.5,
        startPos: { x: 2, y: 0 },
        currentPos: { x: 2, y: 0 },
        direction: 'south',
        targetExitId: 'exit-s',
        path: [{ x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 2, y: 3 }, { x: 2, y: 4 }, { x: 2, y: 5 }, { x: 2, y: 6 }, { x: 2, y: 7 }],
        isMoving: false,
        hasExited: false,
        isCollided: false,
        pathIndex: 0,
        pathProgress: 0,
      },
      {
        id: 'v-blue',
        type: 'blue_car',
        colorName: 'blue',
        displayColor: '#3b82f6',
        length: 1,
        speed: 2.5,
        startPos: { x: 0, y: 2 },
        currentPos: { x: 0, y: 2 },
        direction: 'east',
        targetExitId: 'exit-e1',
        path: [{ x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 }, { x: 5, y: 2 }],
        isMoving: false,
        hasExited: false,
        isCollided: false,
        pathIndex: 0,
        pathProgress: 0,
      },
      {
        id: 'v-green',
        type: 'green_car',
        colorName: 'green',
        displayColor: '#10b981',
        length: 1,
        speed: 2.5,
        startPos: { x: 5, y: 5 },
        currentPos: { x: 5, y: 5 },
        direction: 'west',
        targetExitId: 'exit-w2',
        path: [{ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 3, y: 5 }, { x: 2, y: 5 }, { x: 1, y: 5 }, { x: 0, y: 5 }],
        isMoving: false,
        hasExited: false,
        isCollided: false,
        pathIndex: 0,
        pathProgress: 0,
      },
      {
        id: 'v-orange',
        type: 'orange_car',
        colorName: 'orange',
        displayColor: '#f97316',
        length: 1,
        speed: 2.5,
        startPos: { x: 0, y: 5 },
        currentPos: { x: 0, y: 5 },
        direction: 'east',
        targetExitId: 'exit-e1',
        path: [{ x: 0, y: 5 }, { x: 1, y: 5 }, { x: 2, y: 5 }, { x: 2, y: 4 }, { x: 2, y: 3 }, { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 }, { x: 5, y: 2 }],
        isMoving: false,
        hasExited: false,
        isCollided: false,
        pathIndex: 0,
        pathProgress: 0,
      }
    ],
  },

  // ==========================================
  // LEVEL 9: POLICE ESCORT
  // ==========================================
  {
    id: 9,
    title: 'Police Escort',
    subtitle: 'Metro Police has right to override signals',
    gridWidth: 6,
    gridHeight: 8,
    targetScore: 1300,
    parTimeSeconds: 26,
    roads: [
      { type: 'v-road', x: 3, y: 0 }, { type: 'v-road', x: 3, y: 1 }, { type: 'intersection', x: 3, y: 3 }, { type: 'v-road', x: 3, y: 4 }, { type: 'v-road', x: 3, y: 5 }, { type: 'v-road', x: 3, y: 6 }, { type: 'v-road', x: 3, y: 7 },
      { type: 'h-road', x: 0, y: 3 }, { type: 'h-road', x: 1, y: 3 }, { type: 'h-road', x: 2, y: 3 }, { type: 'h-road', x: 4, y: 3 }, { type: 'h-road', x: 5, y: 3 },
    ],
    intersections: [{ id: 'int-1', position: { x: 3, y: 3 }, hasTrafficLight: true, lightId: 'tl-1' }],
    trafficLights: [{ id: 'tl-1', intersectionId: 'int-1', position: { x: 3, y: 3 }, state: 'EW_GREEN' }],
    barriers: [{ id: 'gate-1', position: { x: 3, y: 5 }, orientation: 'horizontal', state: 'closed', triggerType: 'manual', label: 'Security' }],
    exits: [
      { id: 'exit-s', name: 'HQ South', position: { x: 3, y: 7 }, direction: 'south', color: 'blue' },
      { id: 'exit-e', name: 'Metro East', position: { x: 5, y: 3 }, direction: 'east', color: 'yellow' },
      { id: 'exit-w', name: 'District West', position: { x: 0, y: 3 }, direction: 'west', color: 'red' },
    ],
    vehicles: [
      {
        id: 'v-police',
        type: 'police',
        colorName: 'blue',
        displayColor: '#2563eb',
        length: 1,
        speed: 3.3,
        canIgnoreRed: true,
        isPriority: true,
        startPos: { x: 3, y: 0 },
        currentPos: { x: 3, y: 0 },
        direction: 'south',
        targetExitId: 'exit-s',
        path: [{ x: 3, y: 0 }, { x: 3, y: 1 }, { x: 3, y: 2 }, { x: 3, y: 3 }, { x: 3, y: 4 }, { x: 3, y: 5 }, { x: 3, y: 6 }, { x: 3, y: 7 }],
        isMoving: false,
        hasExited: false,
        isCollided: false,
        pathIndex: 0,
        pathProgress: 0,
      },
      {
        id: 'v-yellow',
        type: 'yellow_car',
        colorName: 'yellow',
        displayColor: '#eab308',
        length: 1,
        speed: 2.5,
        startPos: { x: 0, y: 3 },
        currentPos: { x: 0, y: 3 },
        direction: 'east',
        targetExitId: 'exit-e',
        path: [{ x: 0, y: 3 }, { x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 4, y: 3 }, { x: 5, y: 3 }],
        isMoving: false,
        hasExited: false,
        isCollided: false,
        pathIndex: 0,
        pathProgress: 0,
      },
      {
        id: 'v-red',
        type: 'red_car',
        colorName: 'red',
        displayColor: '#ef4444',
        length: 1,
        speed: 2.5,
        startPos: { x: 5, y: 3 },
        currentPos: { x: 5, y: 3 },
        direction: 'west',
        targetExitId: 'exit-w',
        path: [{ x: 5, y: 3 }, { x: 4, y: 3 }, { x: 3, y: 3 }, { x: 2, y: 3 }, { x: 1, y: 3 }, { x: 0, y: 3 }],
        isMoving: false,
        hasExited: false,
        isCollided: false,
        pathIndex: 0,
        pathProgress: 0,
      },
    ],
  },

  // ==========================================
  // LEVEL 10: CITY SQUARE
  // ==========================================
  {
    id: 10,
    title: 'City Square',
    subtitle: 'A full 4-way grid with 4 vehicles and dual gates',
    gridWidth: 6,
    gridHeight: 8,
    targetScore: 1500,
    parTimeSeconds: 30,
    roads: [
      { type: 'v-road', x: 1, y: 0 }, { type: 'v-road', x: 1, y: 1 }, { type: 'intersection', x: 1, y: 2 }, { type: 'v-road', x: 1, y: 3 }, { type: 'v-road', x: 1, y: 4 }, { type: 'intersection', x: 1, y: 5 }, { type: 'v-road', x: 1, y: 6 }, { type: 'v-road', x: 1, y: 7 },
      { type: 'v-road', x: 4, y: 0 }, { type: 'v-road', x: 4, y: 1 }, { type: 'intersection', x: 4, y: 2 }, { type: 'v-road', x: 4, y: 3 }, { type: 'v-road', x: 4, y: 4 }, { type: 'intersection', x: 4, y: 5 }, { type: 'v-road', x: 4, y: 6 }, { type: 'v-road', x: 4, y: 7 },
      { type: 'h-road', x: 0, y: 2 }, { type: 'h-road', x: 2, y: 2 }, { type: 'h-road', x: 3, y: 2 }, { type: 'h-road', x: 5, y: 2 },
      { type: 'h-road', x: 0, y: 5 }, { type: 'h-road', x: 2, y: 5 }, { type: 'h-road', x: 3, y: 5 }, { type: 'h-road', x: 5, y: 5 },
    ],
    intersections: [
      { id: 'int-1', position: { x: 1, y: 2 }, hasTrafficLight: true, lightId: 'tl-1' },
      { id: 'int-2', position: { x: 4, y: 2 }, hasTrafficLight: true, lightId: 'tl-2' },
      { id: 'int-3', position: { x: 1, y: 5 }, hasTrafficLight: true, lightId: 'tl-3' },
      { id: 'int-4', position: { x: 4, y: 5 }, hasTrafficLight: true, lightId: 'tl-4' },
    ],
    trafficLights: [
      { id: 'tl-1', intersectionId: 'int-1', position: { x: 1, y: 2 }, state: 'NS_GREEN' },
      { id: 'tl-2', intersectionId: 'int-2', position: { x: 4, y: 2 }, state: 'EW_GREEN' },
      { id: 'tl-3', intersectionId: 'int-3', position: { x: 1, y: 5 }, state: 'EW_GREEN' },
      { id: 'tl-4', intersectionId: 'int-4', position: { x: 4, y: 5 }, state: 'NS_GREEN' },
    ],
    barriers: [
      { id: 'gate-1', position: { x: 1, y: 4 }, orientation: 'horizontal', state: 'closed', triggerType: 'manual', label: 'Gate North' },
    ],
    exits: [
      { id: 'exit-s1', name: 'South 1', position: { x: 1, y: 7 }, direction: 'south', color: 'red' },
      { id: 'exit-s2', name: 'South 2', position: { x: 4, y: 7 }, direction: 'south', color: 'blue' },
      { id: 'exit-e1', name: 'East 1', position: { x: 5, y: 2 }, direction: 'east', color: 'yellow' },
      { id: 'exit-e2', name: 'East 2', position: { x: 5, y: 5 }, direction: 'east', color: 'green' },
    ],
    vehicles: [
      {
        id: 'v-1',
        type: 'red_car',
        colorName: 'red',
        displayColor: '#ef4444',
        length: 1,
        speed: 2.5,
        startPos: { x: 1, y: 0 },
        currentPos: { x: 1, y: 0 },
        direction: 'south',
        targetExitId: 'exit-s1',
        path: [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 1, y: 3 }, { x: 1, y: 4 }, { x: 1, y: 5 }, { x: 1, y: 6 }, { x: 1, y: 7 }],
        isMoving: false,
        hasExited: false,
        isCollided: false,
        pathIndex: 0,
        pathProgress: 0,
      },
      {
        id: 'v-2',
        type: 'blue_car',
        colorName: 'blue',
        displayColor: '#3b82f6',
        length: 1,
        speed: 2.5,
        startPos: { x: 4, y: 0 },
        currentPos: { x: 4, y: 0 },
        direction: 'south',
        targetExitId: 'exit-s2',
        path: [{ x: 4, y: 0 }, { x: 4, y: 1 }, { x: 4, y: 2 }, { x: 4, y: 3 }, { x: 4, y: 4 }, { x: 4, y: 5 }, { x: 4, y: 6 }, { x: 4, y: 7 }],
        isMoving: false,
        hasExited: false,
        isCollided: false,
        pathIndex: 0,
        pathProgress: 0,
      },
      {
        id: 'v-3',
        type: 'yellow_car',
        colorName: 'yellow',
        displayColor: '#eab308',
        length: 1,
        speed: 2.5,
        startPos: { x: 0, y: 2 },
        currentPos: { x: 0, y: 2 },
        direction: 'east',
        targetExitId: 'exit-e1',
        path: [{ x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 }, { x: 5, y: 2 }],
        isMoving: false,
        hasExited: false,
        isCollided: false,
        pathIndex: 0,
        pathProgress: 0,
      },
      {
        id: 'v-4',
        type: 'green_car',
        colorName: 'green',
        displayColor: '#10b981',
        length: 1,
        speed: 2.5,
        startPos: { x: 0, y: 5 },
        currentPos: { x: 0, y: 5 },
        direction: 'east',
        targetExitId: 'exit-e2',
        path: [{ x: 0, y: 5 }, { x: 1, y: 5 }, { x: 2, y: 5 }, { x: 3, y: 5 }, { x: 4, y: 5 }, { x: 5, y: 5 }],
        isMoving: false,
        hasExited: false,
        isCollided: false,
        pathIndex: 0,
        pathProgress: 0,
      },
    ],
  },
];

// Helper to generate remaining progressive levels 11 through 30 dynamically with curated distinct puzzle themes
export const generateFullLevelSet = (): LevelDefinition[] => {
  const fullLevels = [...LEVELS];

  for (let i = 11; i <= 30; i++) {
    const isEven = i % 2 === 0;
    const hasAmbulance = i % 5 === 0;
    const hasBus = i % 4 === 0;
    const hasPolice = i % 6 === 0;
    const autoCycle = i >= 15 && i % 3 === 0;

    // Grid layout: alternate between 2-corridor and 3-corridor layouts
    const is3Corridor = i >= 20;
    const gridCols = 6;
    const gridRows = 8;

    const roads: LevelDefinition['roads'] = [];
    // Main vertical arteries
    const vCols = is3Corridor ? [1, 3, 4] : [2, 4];
    const hRows = [2, 5];

    vCols.forEach((x) => {
      for (let y = 0; y < gridRows; y++) {
        const isIntersection = hRows.includes(y);
        roads.push({
          type: isIntersection ? 'intersection' : 'v-road',
          x,
          y,
        });
      }
    });

    hRows.forEach((y) => {
      for (let x = 0; x < gridCols; x++) {
        if (!vCols.includes(x)) {
          roads.push({ type: 'h-road', x, y });
        }
      }
    });

    // Intersections and lights
    const intersections: LevelDefinition['intersections'] = [];
    const trafficLights: LevelDefinition['trafficLights'] = [];

    vCols.forEach((vx, idx) => {
      hRows.forEach((hy, hidx) => {
        const intId = `int-${i}-${vx}-${hy}`;
        const lightId = `tl-${i}-${vx}-${hy}`;
        intersections.push({
          id: intId,
          position: { x: vx, y: hy },
          hasTrafficLight: true,
          lightId,
        });
        trafficLights.push({
          id: lightId,
          intersectionId: intId,
          position: { x: vx, y: hy },
          state: (idx + hidx) % 2 === 0 ? 'NS_GREEN' : 'EW_GREEN',
          isAuto: autoCycle,
          cycleSeconds: autoCycle ? 5 : undefined,
        });
      });
    });

    // Barriers
    const barriers: BarrierDefinition[] = [];
    if (i >= 12 && i % 2 === 0) {
      barriers.push({
        id: `gate-${i}-1`,
        position: { x: vCols[0], y: 3 },
        orientation: 'horizontal',
        state: 'closed',
        triggerType: 'manual',
        label: 'Security Gate',
      });
    }

    // Exits
    const exits: ExitDefinition[] = [
      { id: `exit-${i}-s1`, name: 'South Terminus', position: { x: vCols[0], y: 7 }, direction: 'south', color: 'red' },
      { id: `exit-${i}-e1`, name: 'East Highway', position: { x: 5, y: hRows[0] }, direction: 'east', color: 'blue' },
      { id: `exit-${i}-e2`, name: 'East Boulevard', position: { x: 5, y: hRows[1] }, direction: 'east', color: 'yellow' },
    ];
    if (vCols[1]) {
      exits.push({ id: `exit-${i}-s2`, name: 'South Harbor', position: { x: vCols[1], y: 7 }, direction: 'south', color: 'green' });
    }

    // Vehicles
    const vehicles: VehicleDefinition[] = [];
    const vehicleTypes = ['red_car', 'blue_car', 'yellow_car', 'green_car', 'orange_car', 'taxi'];
    if (hasAmbulance) vehicleTypes.push('ambulance');
    if (hasBus) vehicleTypes.push('bus');
    if (hasPolice) vehicleTypes.push('police');

    const carCount = Math.min(4 + Math.floor((i - 10) / 4), 7);

    // Car 1: Southbound on vCols[0]
    vehicles.push({
      id: `v-${i}-1`,
      type: (hasAmbulance ? 'ambulance' : 'red_car') as any,
      colorName: 'red',
      displayColor: hasAmbulance ? '#f43f5e' : '#ef4444',
      length: 1,
      speed: hasAmbulance ? 3.2 : 2.5,
      isPriority: hasAmbulance,
      startPos: { x: vCols[0], y: 0 },
      currentPos: { x: vCols[0], y: 0 },
      direction: 'south',
      targetExitId: `exit-${i}-s1`,
      path: [0, 1, 2, 3, 4, 5, 6, 7].map((y) => ({ x: vCols[0], y })),
      isMoving: false,
      hasExited: false,
      isCollided: false,
      pathIndex: 0,
      pathProgress: 0,
    });

    // Car 2: Eastbound on hRows[0]
    vehicles.push({
      id: `v-${i}-2`,
      type: (hasBus ? 'bus' : 'blue_car') as any,
      colorName: 'blue',
      displayColor: hasBus ? '#06b6d4' : '#3b82f6',
      length: hasBus ? 1.8 : 1,
      speed: hasBus ? 1.9 : 2.6,
      startPos: { x: 0, y: hRows[0] },
      currentPos: { x: 0, y: hRows[0] },
      direction: 'east',
      targetExitId: `exit-${i}-e1`,
      path: [0, 1, 2, 3, 4, 5].map((x) => ({ x, y: hRows[0] })),
      isMoving: false,
      hasExited: false,
      isCollided: false,
      pathIndex: 0,
      pathProgress: 0,
    });

    // Car 3: Eastbound on hRows[1]
    vehicles.push({
      id: `v-${i}-3`,
      type: (isEven ? 'taxi' : 'yellow_car') as any,
      colorName: 'yellow',
      displayColor: isEven ? '#facc15' : '#eab308',
      length: 1,
      speed: isEven ? 3.6 : 2.5,
      startPos: { x: 0, y: hRows[1] },
      currentPos: { x: 0, y: hRows[1] },
      direction: 'east',
      targetExitId: `exit-${i}-e2`,
      path: [0, 1, 2, 3, 4, 5].map((x) => ({ x, y: hRows[1] })),
      isMoving: false,
      hasExited: false,
      isCollided: false,
      pathIndex: 0,
      pathProgress: 0,
    });

    // Car 4: Southbound on vCols[1]
    if (vCols[1]) {
      vehicles.push({
        id: `v-${i}-4`,
        type: (hasPolice ? 'police' : 'green_car') as any,
        colorName: 'green',
        displayColor: hasPolice ? '#2563eb' : '#10b981',
        length: 1,
        speed: 2.6,
        isPriority: hasPolice,
        canIgnoreRed: hasPolice,
        startPos: { x: vCols[1], y: 1 },
        currentPos: { x: vCols[1], y: 1 },
        direction: 'south',
        targetExitId: `exit-${i}-s2`,
        path: [1, 2, 3, 4, 5, 6, 7].map((y) => ({ x: vCols[1], y })),
        isMoving: false,
        hasExited: false,
        isCollided: false,
        pathIndex: 0,
        pathProgress: 0,
      });
    }

    // Car 5 (for level 15+)
    if (carCount >= 5) {
      vehicles.push({
        id: `v-${i}-5`,
        type: 'orange_car',
        colorName: 'orange',
        displayColor: '#f97316',
        length: 1,
        speed: 2.5,
        startPos: { x: vCols[0], y: 4 },
        currentPos: { x: vCols[0], y: 4 },
        direction: 'south',
        targetExitId: `exit-${i}-s1`,
        path: [4, 5, 6, 7].map((y) => ({ x: vCols[0], y })),
        isMoving: false,
        hasExited: false,
        isCollided: false,
        pathIndex: 0,
        pathProgress: 0,
      });
    }

    // Car 6 (for level 20+)
    if (carCount >= 6) {
      vehicles.push({
        id: `v-${i}-6`,
        type: 'delivery',
        colorName: 'purple',
        displayColor: '#8b5cf6',
        length: 1.4,
        speed: 2.2,
        startPos: { x: 1, y: hRows[0] },
        currentPos: { x: 1, y: hRows[0] },
        direction: 'east',
        targetExitId: `exit-${i}-e1`,
        path: [1, 2, 3, 4, 5].map((x) => ({ x, y: hRows[0] })),
        isMoving: false,
        hasExited: false,
        isCollided: false,
        pathIndex: 0,
        pathProgress: 0,
      });
    }

    const subtitles = [
      'Master metropolitan junction timing',
      'High-capacity transport route',
      'Dual corridor flow coordination',
      'Priority emergency dispatch',
      'Complex city center gridlock release',
    ];

    fullLevels.push({
      id: i,
      title: `District Route ${i}`,
      subtitle: subtitles[i % subtitles.length],
      gridWidth: gridCols,
      gridHeight: gridRows,
      targetScore: 1000 + i * 150,
      parTimeSeconds: 25 + Math.floor(i * 1.5),
      roads,
      intersections,
      trafficLights,
      barriers,
      exits,
      vehicles,
    });
  }

  return fullLevels;
};

export const ALL_LEVELS: LevelDefinition[] = generateFullLevelSet();
