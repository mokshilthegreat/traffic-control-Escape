import {
  LevelDefinition,
  VehicleDefinition,
  TrafficLightDefinition,
  BarrierDefinition,
  HintResult,
} from '../types/game';

/**
 * Evaluates the actual current state of the game board and determines
 * the single next correct/safe action to help the player.
 */
export function getNextGameHint(
  level: LevelDefinition,
  vehicles: VehicleDefinition[],
  trafficLights: TrafficLightDefinition[],
  barriers: BarrierDefinition[]
): HintResult {
  // === LEVEL 1 SPECIFIC EXACT HINTS ===
  if (level.id === 1) {
    const redCar = vehicles.find((v) => v.id === 'v-1') || vehicles[0];
    const light = trafficLights[0];

    if (light && light.state !== 'NS_GREEN') {
      return {
        id: 'l1_light',
        message: 'TAP THE TRAFFIC LIGHT',
        targetType: 'traffic_light',
        targetId: light.id,
        position: light.position,
      };
    }

    if (redCar && !redCar.hasExited && !redCar.isMoving) {
      return {
        id: 'l1_red_car',
        message: 'MOVE THE RED CAR',
        targetType: 'vehicle',
        targetId: redCar.id,
        position: redCar.currentPos,
      };
    }

    if (redCar && redCar.isMoving && !redCar.hasExited) {
      return {
        id: 'l1_exit',
        message: 'FOLLOW THE EXIT',
        targetType: 'exit',
        position: { x: 2, y: 7 },
      };
    }
  }

  // === LEVEL 2 SPECIFIC CONTEXTUAL HINTS ===
  if (level.id === 2) {
    const v1 = vehicles.find((v) => v.id === 'v-1'); // Red car (North)
    const v2 = vehicles.find((v) => v.id === 'v-2'); // Blue car (West front)
    const v3 = vehicles.find((v) => v.id === 'v-3'); // Green car (West rear)
    const light = trafficLights.find((tl) => tl.id === 'tl-1') || trafficLights[0];

    // 1. Red car hasn't exited yet
    if (v1 && !v1.hasExited) {
      if (light && light.state !== 'NS_GREEN') {
        return {
          id: 'l2_light_ns',
          message: 'LET NORTH/SOUTH TRAFFIC GO',
          targetType: 'traffic_light',
          targetId: light.id,
          position: light.position,
        };
      }
      if (!v1.isMoving) {
        return {
          id: 'l2_red_car',
          message: 'MOVE THE RED CAR',
          targetType: 'vehicle',
          targetId: v1.id,
          position: v1.currentPos,
        };
      }
      return {
        id: 'l2_wait_intersection',
        message: 'WAIT FOR THE INTERSECTION TO CLEAR',
        targetType: 'wait',
        position: light ? light.position : { x: 2, y: 3 },
      };
    }

    // 2. Red car exited, now handle East-West traffic
    if (v1?.hasExited) {
      if (light && light.state !== 'EW_GREEN') {
        return {
          id: 'l2_light_ew',
          message: 'SWITCH TRAFFIC TO E/W',
          targetType: 'traffic_light',
          targetId: light.id,
          position: light.position,
        };
      }

      // Blue car is in front
      if (v2 && !v2.hasExited) {
        if (!v2.isMoving) {
          return {
            id: 'l2_blue_car',
            message: 'MOVE THE BLUE CAR',
            targetType: 'vehicle',
            targetId: v2.id,
            position: v2.currentPos,
          };
        }
        return {
          id: 'l2_wait_blue',
          message: 'WAIT FOR THE BLUE CAR TO CLEAR',
          targetType: 'wait',
          position: v2.currentPos,
        };
      }

      // Green car is trailing
      if (v3 && !v3.hasExited) {
        if (!v3.isMoving) {
          return {
            id: 'l2_green_car',
            message: 'MOVE THE GREEN CAR',
            targetType: 'vehicle',
            targetId: v3.id,
            position: v3.currentPos,
          };
        }
      }
    }
  }

  // === LEVEL 5 SPECIFIC CONTEXTUAL HINTS ===
  if (level.id === 5) {
    const greenCar = vehicles.find((v) => v.id === 'v-green');
    const blueCar = vehicles.find((v) => v.id === 'v-blue');
    const taxi = vehicles.find((v) => v.id === 'v-taxi');
    const light = trafficLights.find((tl) => tl.id === 'tl-1') || trafficLights[0];

    // Step 1: Green car clears the north route
    if (greenCar && !greenCar.hasExited) {
      if (!greenCar.isMoving) {
        return {
          id: 'l5_green_north',
          message: 'Start by clearing the NORTH route.',
          targetType: 'vehicle',
          targetId: greenCar.id,
          position: greenCar.currentPos,
        };
      }
      return {
        id: 'l5_wait_north',
        message: 'Wait for the north route to clear.',
        targetType: 'wait',
        position: greenCar.currentPos,
      };
    }

    // Step 2 & 3: Green has exited, now handle Blue car crossing East
    if (blueCar && !blueCar.hasExited) {
      if (light && light.state !== 'EW_GREEN') {
        return {
          id: 'l5_light_ew',
          message: 'Switch traffic to EAST/WEST.',
          targetType: 'traffic_light',
          targetId: light.id,
          position: light.position,
        };
      }
      if (!blueCar.isMoving) {
        return {
          id: 'l5_blue_move',
          message: 'Move the BLUE vehicle now.',
          targetType: 'vehicle',
          targetId: blueCar.id,
          position: blueCar.currentPos,
        };
      }
      return {
        id: 'l5_wait_blue',
        message: 'Wait for the intersection to clear.',
        targetType: 'wait',
        position: light ? light.position : { x: 2, y: 4 },
      };
    }

    // Step 4 & 5: Blue has exited, now let the Taxi cross North
    if (taxi && !taxi.hasExited) {
      if (light && light.state !== 'NS_GREEN') {
        return {
          id: 'l5_light_ns',
          message: 'Switch traffic to NORTH/SOUTH.',
          targetType: 'traffic_light',
          targetId: light.id,
          position: light.position,
        };
      }
      if (!taxi.isMoving) {
        return {
          id: 'l5_taxi_move',
          message: 'Move the swift TAXI now.',
          targetType: 'vehicle',
          targetId: taxi.id,
          position: taxi.currentPos,
        };
      }
      return {
        id: 'l5_wait_taxi',
        message: 'Wait for the taxi to reach the exit.',
        targetType: 'wait',
        position: taxi.currentPos,
      };
    }
  }

  // === GENERAL DYNAMIC SOLVER FOR ALL OTHER LEVELS ===
  const unexitedVehicles = vehicles.filter((v) => !v.hasExited);
  const activeMoving = unexitedVehicles.filter((v) => v.isMoving);

  // 1. Check if an unexited vehicle is currently blocked by a closed barrier
  for (const v of unexitedVehicles) {
    const nextWaypoint = v.path[v.pathIndex + 1] || v.path[v.pathIndex];
    if (nextWaypoint) {
      const blockingBarrier = barriers.find(
        (b) =>
          b.state === 'closed' &&
          Math.abs(b.position.x - nextWaypoint.x) < 0.3 &&
          Math.abs(b.position.y - nextWaypoint.y) < 0.3
      );
      if (blockingBarrier) {
        return {
          id: `barrier_${blockingBarrier.id}`,
          message: 'OPEN THE ROAD GATE',
          targetType: 'barrier',
          targetId: blockingBarrier.id,
          position: blockingBarrier.position,
        };
      }
    }
  }

  // 2. Check if a stationary vehicle has a red traffic light right ahead
  for (const v of unexitedVehicles) {
    if (v.isMoving) continue;
    // Check if path is blocked by another vehicle directly in front
    const isBlockedByCar = unexitedVehicles.some((other) => {
      if (other.id === v.id) return false;
      const dx = other.currentPos.x - v.currentPos.x;
      const dy = other.currentPos.y - v.currentPos.y;
      return Math.sqrt(dx * dx + dy * dy) < 1.2;
    });
    if (isBlockedByCar) continue;

    // Check next intersection
    const nextWaypoint = v.path[v.pathIndex + 1];
    if (nextWaypoint) {
      const nextLight = trafficLights.find(
        (tl) =>
          Math.abs(tl.position.x - nextWaypoint.x) < 0.2 &&
          Math.abs(tl.position.y - nextWaypoint.y) < 0.2
      );

      if (nextLight) {
        const isNS = v.direction === 'north' || v.direction === 'south';
        const isGreen =
          (isNS && nextLight.state === 'NS_GREEN') ||
          (!isNS && nextLight.state === 'EW_GREEN');

        if (!isGreen) {
          // Check if cross traffic is actively traversing
          const hasCrossTraffic = activeMoving.some((other) => {
            const otherIsNS = other.direction === 'north' || other.direction === 'south';
            return otherIsNS !== isNS;
          });

          if (hasCrossTraffic) {
            return {
              id: 'wait_cross_traffic',
              message: 'WAIT FOR THE INTERSECTION TO CLEAR',
              targetType: 'wait',
              position: nextLight.position,
            };
          }

          return {
            id: `light_${nextLight.id}`,
            message: isNS ? 'Switch traffic to N/S' : 'Switch traffic to E/W',
            targetType: 'traffic_light',
            targetId: nextLight.id,
            position: nextLight.position,
          };
        }
      }
    }
  }

  // 3. Find any stationary vehicle with clear path and green light
  for (const v of unexitedVehicles) {
    if (v.isMoving) continue;
    // Check if blocked by another car ahead
    const isBlockedByCar = unexitedVehicles.some((other) => {
      if (other.id === v.id) return false;
      const dx = other.currentPos.x - v.currentPos.x;
      const dy = other.currentPos.y - v.currentPos.y;
      return Math.sqrt(dx * dx + dy * dy) < 1.2;
    });
    if (isBlockedByCar) continue;

    return {
      id: `car_${v.id}`,
      message: `Move the ${v.colorName.toUpperCase()} CAR`,
      targetType: 'vehicle',
      targetId: v.id,
      position: v.currentPos,
    };
  }

  // 4. If all stationary vehicles are blocked by moving vehicles, instruct to wait
  if (activeMoving.length > 0) {
    return {
      id: 'wait_moving',
      message: 'WAIT FOR THE INTERSECTION TO CLEAR',
      targetType: 'wait',
      position: activeMoving[0]?.currentPos,
    };
  }

  // 5. Fallback to first unexited vehicle
  const fallback = unexitedVehicles[0];
  if (fallback) {
    return {
      id: `fallback_${fallback.id}`,
      message: `Move the ${fallback.colorName.toUpperCase()} CAR`,
      targetType: 'vehicle',
      targetId: fallback.id,
      position: fallback.currentPos,
    };
  }

  // All cleared
  return {
    id: 'cleared',
    message: 'ROAD IS CLEAR!',
    targetType: 'wait',
  };
}
