// Metres, seconds, newtons and kPa. Coefficients are gameplay calibration,
// not measured soil data. See docs/soil-physics.md for sources and limits.
export interface BearingSoil {
  wetness: number;
  hardpack: number;
  looseSpoil: number;
}

export function compressionLimit(soil: BearingSoil): number {
  return Math.max(0.025, Math.min(0.22, 0.065 + soil.wetness * 0.12 + soil.looseSpoil * 0.07 - soil.hardpack * 0.04));
}

export function bearingSinkage(forceN: number, area: number, width: number, soil: BearingSoil): number {
  if (forceN <= 0 || area <= 0 || width <= 0) return 0;
  const pressureKPa = forceN / area / 1000;
  const softness = 1 + soil.wetness * 1.9 + soil.looseSpoil * 0.9;
  const kc = 110 * (1 + soil.hardpack * 2) / softness;
  const kphi = 1400 * (1 + soil.hardpack * 2) / softness;
  return Math.min(compressionLimit(soil), (pressureKPa / (kc / width + kphi)) ** (1 / 1.1));
}

// Saturation is exponential, so two half steps equal one full step. Removed
// terrain is deliberately not used as a proxy for compressible pore space.
export function compressionIncrement(used: number, limit: number, demand: number): number {
  if (limit <= 0 || demand <= 0) return 0;
  return Math.max(0, limit - used) * -Math.expm1(-demand / limit);
}

export function shearStrengthKPa(depth: number, cohesionKPa: number, frictionAngle: number): number {
  return Math.max(0, cohesionKPa) + 17 * Math.max(0, depth) * Math.tan(frictionAngle);
}

// Coulomb sliding: downhill gravity must overcome friction. Opening exposes
// the lip; it cannot produce a flow on its own when gravity points into it.
export function granularDischarge(load: number, slope: number, opening: number, dt: number): number {
  if (load <= 0 || dt <= 0) return 0;
  const drive = Math.max(0, Math.sin(slope) - 0.53 * Math.max(0, Math.cos(slope)), -Math.cos(slope));
  const rate = Math.min(1.8, (0.18 + 1.25 * Math.min(1, Math.max(0, opening))) * Math.sqrt(9.81 * drive));
  return Math.min(load, rate * Math.sqrt(Math.min(1, load / 0.2)) * dt);
}
