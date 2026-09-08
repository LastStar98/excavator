import { Vector3 } from "three";

// Reach and the chase camera are relative to the chassis, wherever it travels.
export function horizontalReach(point: Vector3, chassis: Vector3): number {
  return Math.hypot(point.x - chassis.x, point.z - chassis.z);
}

export function orbitTarget(chassis: Vector3, bucketTip: Vector3): Vector3 {
  return new Vector3(chassis.x, chassis.y + 0.9, chassis.z).lerp(bucketTip, 0.25);
}
