import * as THREE from "three";
import "./style.css";

type Pattern = "ISO" | "SAE" | "Arcade";
type ResponseMode = "slow" | "medium" | "fast";
type CameraMode = "orbit" | "cab" | "bucket" | "task";

type ActionName = "swing" | "boom" | "stick" | "bucket";

interface Actions {
  swing: number;
  boom: number;
  stick: number;
  bucket: number;
}

interface ExcavatorAngles {
  swing: number;
  boom: number;
  stick: number;
  bucket: number;
}

interface ExcavatorVelocities {
  swing: number;
  boom: number;
  stick: number;
  bucket: number;
}

interface Limits {
  min: number;
  max: number;
}

interface JoystickAxes {
  leftX: number;
  leftY: number;
  rightX: number;
  rightY: number;
  leftTrack: number;
  rightTrack: number;
}

type MobileJoystickSide = "left" | "right";
type MobileDriveMode = "forward" | "reverse" | "turn-left" | "turn-right";

interface ActiveMobileJoystick {
  side: MobileJoystickSide;
  element: HTMLElement;
  knob: HTMLElement;
  centerX: number;
  centerY: number;
  radius: number;
}

interface SoilParticle {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  volume: number;
  life: number;
  settles: boolean;
  target?: THREE.Vector3;
  toBucket?: boolean;
}

type WorldColliderKind = "fence" | "boulder" | "rock" | "clod" | "twig" | "cone";

interface WorldCollider {
  mesh: THREE.Object3D;
  kind: WorldColliderKind;
  radius: number;
  mass: number;
  immovable: boolean;
  crushable: boolean;
  restitution: number;
  friction: number;
  groundOffset: number;
  velocity: THREE.Vector3;
  sleeping: boolean;
  initialPosition: THREE.Vector3;
  initialQuaternion: THREE.Quaternion;
  initialScale: THREE.Vector3;
}

interface TrackSupportSample {
  supportHeight: number;
  averageHeight: number;
  lowHeight: number;
  highHeight: number;
  disturbedDepth: number;
}

interface TerrainSurfaceCondition {
  wetness: number;
  gravel: number;
  hardpack: number;
  compaction: number;
  trackSinkMultiplier: number;
  trackDragMultiplier: number;
  bucketResistanceMultiplier: number;
  reposeTan: number;
}

interface TruckPhysicsState {
  loadRatio: number;
  suspensionSag: number;
  pitch: number;
  roll: number;
  supportSpread: number;
  tireCompacted: number;
  tireRutDrop: number;
  bodyY: number;
}

interface ArmCollisionSample {
  action: "boom" | "stick" | "bucket";
  point: THREE.Vector3;
  radius: number;
}

interface ArmTerrainResistanceSample extends ArmCollisionSample {
  key: string;
}

interface ExcavatorDebugApi {
  snapshot: () => {
    bucketLoad: number;
    bucketTransitLoad: number;
    truckLoad: number;
    totalExcavated: number;
    digHeight: number;
    bucketAngle: number;
    bucketVisualLoad: number;
    trackSoilWork: number;
    mobileAxes: JoystickAxes;
    orbit: { azimuth: number; elevation: number; distance: number };
    particleCount: number;
    settlingParticleCount: number;
    flowParticleCount: number;
    fineGrainCount: number;
    activeFineGrainVolume: number;
    settledFineGrainVolume: number;
    chassisSinkage: number;
    chassisPitch: number;
    chassisRoll: number;
    supportHeight: number;
    truckSag: number;
    truckPitch: number;
    truckRoll: number;
    truckTireRutDrop: number;
    collisionCount: number;
    terrainVolumeDelta: number;
  };
  forceDigPass: () => { removed: number; beforeHeight: number; afterHeight: number; bucketLoad: number; airborneFines: number };
  forcePlayableDigPass: () => {
    removed: number;
    beforeHeight: number;
    afterHeight: number;
    bucketLoad: number;
    bucketTransitLoad: number;
    blocked: boolean;
    velocityAfter: number;
    pressure: number;
  };
  forceTruckDump: () => {
    dumped: number;
    emitted: number;
    truckLoad: number;
    bucketLoad: number;
    activeAfter: number;
    gravityDelta: number;
    terrainGain: number;
  };
  forceFullBucketPush: () => { displaced: number; bucketLoad: number; centerDrop: number; bermRise: number };
  forceCuttingFlowPhysics: () => {
    spawnedVolume: number;
    capturedVolume: number;
    transitRemaining: number;
    gravityDelta: number;
    activeFlowAfter: number;
  };
  forceBucketKinematics: () => {
    edgeWidth: number;
    pocketBehindEdge: number;
    tipBelowPocket: number;
    sideOrthogonality: number;
    cylinderDelta: number;
    linkSymmetry: number;
  };
  forceTrackPass: () => { compacted: number; rutDrop: number; bermRise: number; trackSoilWork: number };
  forceTruckCollision: () => { beforeX: number; afterX: number; blocked: boolean; collisionCount: number; pressure: number };
  forceArmTruckCollision: () => {
    collided: boolean;
    angleBlocked: boolean;
    beforeStick: number;
    afterStick: number;
    velocityAfter: number;
    pressure: number;
    collisionCount: number;
    penetration: number;
    blockedActions: ActionName[];
  };
  forceArmSubsoilResistance: () => {
    resisted: boolean;
    blocked: boolean;
    beforeStick: number;
    afterStick: number;
    velocityAfter: number;
    maxSubmerged: number;
    averageSubmerged: number;
    pressure: number;
    blockedActions: ActionName[];
  };
  forceArmWorldObjectPhysics: () => {
    movableHit: boolean;
    movableTravel: number;
    liftedObject: boolean;
    liftHeight: number;
    carriedMass: number;
    heavyLifted: boolean;
    heavyLiftHeight: number;
    heavyCarriedMass: number;
    immovableBlocked: boolean;
    beforeStick: number;
    afterStick: number;
    velocityAfter: number;
    pressure: number;
    collisionCount: number;
    penetration: number;
    blockedActions: ActionName[];
  };
  forceTruckLoadPhysics: () => {
    accepted: number;
    loadRatio: number;
    sag: number;
    pitch: number;
    roll: number;
    compacted: number;
    rutDrop: number;
    bodyYDrop: number;
    supportSpread: number;
  };
  forceTerrainMaterialPhysics: () => {
    mudWetness: number;
    mudSinkMultiplier: number;
    mudDragMultiplier: number;
    gravelHardpack: number;
    gravelBucketMultiplier: number;
    mudCompacted: number;
    dryCompacted: number;
    mudRutDrop: number;
    dryRutDrop: number;
    hardResistance: number;
    softResistance: number;
  };
  forceRoughTrackSupport: () => { roll: number; pitch: number; sinkage: number; pressure: number; supportDrop: number };
  forceWorldObjectPhysics: () => {
    debrisTravel: number;
    hardTravel: number;
    railTravel: number;
    collisionCount: number;
    pressure: number;
  };
  forceMapDiversity: () => {
    terrainSize: number;
    spacing: number;
    heightRange: number;
    wetlandWetness: number;
    gravelFan: number;
    hardBench: number;
    haulRoadCompaction: number;
    materialZones: number;
    roughSlope: number;
    farColliderCount: number;
    colliderKinds: number;
  };
  forceFineGrainSettlement: () => {
    spawnedVolume: number;
    settledVolume: number;
    activeAfter: number;
    terrainGain: number;
    truckLoad: number;
  };
  forceExcavatorPitSink: () => {
    lowered: number;
    beforeY: number;
    afterY: number;
    beforeGround: number;
    afterGround: number;
    chassisSinkage: number;
  };
}

declare global {
  interface Window {
    __excavatorSim?: ExcavatorDebugApi;
  }
}

interface UiRefs {
  patternSelect: HTMLSelectElement;
  responseSelect: HTMLSelectElement;
  resetButton: HTMLButtonElement;
  cameraButtons: HTMLButtonElement[];
  truckLoadText: HTMLElement;
  truckLoadBar: HTMLElement;
  missionState: HTMLElement;
  pressureMeter: HTMLMeterElement;
  bucketMeter: HTMLMeterElement;
  stabilityMeter: HTMLMeterElement;
  timeText: HTMLElement;
  soilText: HTMLElement;
  limitText: HTMLElement;
  safetyText: HTMLElement;
  idleText: HTMLElement;
  travelText: HTMLElement;
  travelDirectionText: HTMLElement;
  swingText: HTMLElement;
  boomText: HTMLElement;
  stickText: HTMLElement;
  bucketText: HTMLElement;
  fpsText: HTMLElement;
  warningStrip: HTMLElement;
  leftStickLabelY: HTMLElement;
  leftStickLabelX: HTMLElement;
  rightStickLabelY: HTMLElement;
  rightStickLabelX: HTMLElement;
  keyCaps: HTMLElement[];
  mobileControls: HTMLElement;
  mobileJoysticks: HTMLElement[];
  mobileDriveButtons: HTMLButtonElement[];
  mobileMenuPanel: HTMLElement;
  mobileMenuButtons: HTMLButtonElement[];
  mobileMenuSections: HTMLElement[];
  mobileResetButtons: HTMLButtonElement[];
}

const BOOM_LEN = 3.65;
const STICK_LEN = 2.85;
const BUCKET_LEN = 1.18;
const BUCKET_CAPACITY = 1.55;
const TRUCK_CAPACITY = 7.5;
const TRACK_GAUGE = 1.48;
const TRACK_LENGTH = 3.65;
const TRACK_WIDTH = 0.5;
const TRACK_MAX_SPEED = 1.25;
const SOIL_REPOSE_TAN = Math.tan(THREE.MathUtils.degToRad(34));
const SOIL_BEDROCK_FLOOR = -3.2;
const DIG_SITE = new THREE.Vector3(-4.1, 0, 2.3);
const TRUCK_CENTER = new THREE.Vector3(7.2, 0, -3.8);
const WORKER_ZONE = new THREE.Vector3(2.0, 0, 2.15);
const BUCKET_OBJECT_LIFT_LIMIT = 2000;
const ARM_WORLD_BROADPHASE_PADDING = 0.82;

const ANGLE_LIMITS: Record<ActionName, Limits> = {
  swing: { min: -Infinity, max: Infinity },
  boom: { min: 0.08, max: 1.32 },
  stick: { min: -2.38, max: -0.12 },
  bucket: { min: -2.62, max: 0.68 },
};

const MAX_RATES: Record<ActionName, number> = {
  swing: 0.78,
  boom: 0.42,
  stick: 0.58,
  bucket: 2.35,
};

const RESPONSE_GAIN: Record<ResponseMode, number> = {
  slow: 2.1,
  medium: 4.2,
  fast: 7.5,
};

const initialAngles: ExcavatorAngles = {
  swing: 0.16,
  boom: 0.72,
  stick: -1.08,
  bucket: -1.0,
};

function byId<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Missing element #${id}`);
  }
  return element as T;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function smoothTo(current: number, target: number, gain: number, dt: number): number {
  return current + (target - current) * (1 - Math.exp(-gain * dt));
}

function radToDeg(value: number): number {
  return Math.round(THREE.MathUtils.radToDeg(value));
}

function fmtTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function makeMat(color: number, roughness = 0.78, metalness = 0.08): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness });
}

function fract(value: number): number {
  return value - Math.floor(value);
}

function hash2(x: number, y: number): number {
  return fract(Math.sin(x * 127.1 + y * 311.7) * 43758.5453123);
}

function valueNoise(x: number, y: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = fract(x);
  const fy = fract(y);
  const sx = fx * fx * (3 - 2 * fx);
  const sy = fy * fy * (3 - 2 * fy);
  const a = hash2(ix, iy);
  const b = hash2(ix + 1, iy);
  const c = hash2(ix, iy + 1);
  const d = hash2(ix + 1, iy + 1);
  return THREE.MathUtils.lerp(THREE.MathUtils.lerp(a, b, sx), THREE.MathUtils.lerp(c, d, sx), sy);
}

function fbm(x: number, y: number): number {
  let sum = 0;
  let amp = 0.5;
  let freq = 1;
  for (let octave = 0; octave < 5; octave += 1) {
    sum += valueNoise(x * freq, y * freq) * amp;
    freq *= 2.03;
    amp *= 0.52;
  }
  return sum;
}

function createCanvasTexture(
  size: number,
  draw: (data: Uint8ClampedArray, width: number, height: number) => void,
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Canvas 2D context unavailable");
  }
  const image = context.createImageData(size, size);
  draw(image.data, size, size);
  context.putImageData(image, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 4;
  texture.repeat.set(9.5, 9.5);
  return texture;
}

function createSoilMaps(): { color: THREE.CanvasTexture; bump: THREE.CanvasTexture; roughness: THREE.CanvasTexture } {
  const color = createCanvasTexture(512, (data, width, height) => {
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const nx = x / width;
        const ny = y / height;
        const coarse = fbm(nx * 8.0, ny * 8.0);
        const fine = fbm(nx * 38.0 + 12.5, ny * 38.0 - 7.3);
        const pebble = valueNoise(nx * 115.0, ny * 115.0) > 0.88 ? 0.18 : 0;
        const shade = clamp(0.52 + coarse * 0.34 + fine * 0.18 + pebble, 0, 1);
        const wet = clamp(1 - fine * 0.65, 0, 1);
        const i = (y * width + x) * 4;
        data[i] = Math.round(82 + shade * 92 + pebble * 55);
        data[i + 1] = Math.round(61 + shade * 55 + wet * 16);
        data[i + 2] = Math.round(38 + shade * 34);
        data[i + 3] = 255;
      }
    }
  });

  const bump = createCanvasTexture(512, (data, width, height) => {
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const nx = x / width;
        const ny = y / height;
        const grit = fbm(nx * 55.0, ny * 55.0);
        const clump = fbm(nx * 13.0 + 4.2, ny * 13.0 - 2.1);
        const v = Math.round(clamp(70 + grit * 82 + clump * 75, 0, 255));
        const i = (y * width + x) * 4;
        data[i] = v;
        data[i + 1] = v;
        data[i + 2] = v;
        data[i + 3] = 255;
      }
    }
  });

  const roughness = createCanvasTexture(256, (data, width, height) => {
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const r = Math.round(195 + fbm((x / width) * 21.0, (y / height) * 21.0) * 48);
        const i = (y * width + x) * 4;
        data[i] = r;
        data[i + 1] = r;
        data[i + 2] = r;
        data[i + 3] = 255;
      }
    }
  });

  roughness.colorSpace = THREE.NoColorSpace;
  bump.colorSpace = THREE.NoColorSpace;
  return { color, bump, roughness };
}

function makeBox(
  size: [number, number, number],
  material: THREE.Material,
  position: [number, number, number],
): THREE.Mesh {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(size[0], size[1], size[2]), material);
  mesh.position.set(position[0], position[1], position[2]);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function setCylinderBetween(
  mesh: THREE.Mesh,
  start: THREE.Vector3,
  end: THREE.Vector3,
  radiusScale = 1,
): void {
  const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  const direction = new THREE.Vector3().subVectors(end, start);
  const length = Math.max(direction.length(), 0.001);
  mesh.position.copy(midpoint);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  mesh.scale.set(radiusScale, length, radiusScale);
}

class HeightfieldTerrain {
  readonly size = 96;
  readonly segments = 224;
  readonly spacing = this.size / this.segments;
  readonly mesh: THREE.Mesh;
  readonly heights: Float32Array;
  private readonly geometry: THREE.BufferGeometry;
  private readonly colors: Float32Array;

  constructor(scene: THREE.Scene) {
    this.heights = new Float32Array((this.segments + 1) * (this.segments + 1));
    const positions: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];
    const colors: number[] = [];

    for (let iz = 0; iz <= this.segments; iz += 1) {
      for (let ix = 0; ix <= this.segments; ix += 1) {
        const x = -this.size / 2 + ix * this.spacing;
        const z = -this.size / 2 + iz * this.spacing;
        const idx = this.index(ix, iz);
        this.heights[idx] = this.initialHeight(x, z);
        positions.push(x, this.heights[idx], z);
        normals.push(0, 1, 0);
        uvs.push(ix / this.segments, iz / this.segments);
        colors.push(...this.colorForHeight(this.heights[idx], x, z));
      }
    }

    for (let iz = 0; iz < this.segments; iz += 1) {
      for (let ix = 0; ix < this.segments; ix += 1) {
        const a = this.index(ix, iz);
        const b = this.index(ix + 1, iz);
        const c = this.index(ix, iz + 1);
        const d = this.index(ix + 1, iz + 1);
        indices.push(a, c, b, b, c, d);
      }
    }

    this.colors = new Float32Array(colors);
    this.geometry = new THREE.BufferGeometry();
    this.geometry.setIndex(indices);
    this.geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    this.geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
    this.geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
    this.geometry.setAttribute("color", new THREE.Float32BufferAttribute(this.colors, 3));
    this.geometry.computeVertexNormals();
    (this.geometry.attributes.position as THREE.BufferAttribute).setUsage(THREE.DynamicDrawUsage);
    (this.geometry.attributes.normal as THREE.BufferAttribute).setUsage(THREE.DynamicDrawUsage);
    (this.geometry.attributes.color as THREE.BufferAttribute).setUsage(THREE.DynamicDrawUsage);

    const soilMaps = createSoilMaps();
    const material = new THREE.MeshStandardMaterial({
      map: soilMaps.color,
      bumpMap: soilMaps.bump,
      bumpScale: 0.075,
      roughnessMap: soilMaps.roughness,
      vertexColors: true,
      roughness: 0.96,
      metalness: 0.02,
    });
    this.mesh = new THREE.Mesh(this.geometry, material);
    this.mesh.receiveShadow = true;
    scene.add(this.mesh);

    const grid = new THREE.GridHelper(this.size, 48, 0x6e796c, 0x495045);
    grid.position.y = 0.018;
    grid.material.transparent = true;
    grid.material.opacity = 0.28;
    scene.add(grid);
  }

  getHeightAt(x: number, z: number): number {
    const fx = clamp((x + this.size / 2) / this.spacing, 0, this.segments - 0.001);
    const fz = clamp((z + this.size / 2) / this.spacing, 0, this.segments - 0.001);
    const ix = Math.floor(fx);
    const iz = Math.floor(fz);
    const tx = fx - ix;
    const tz = fz - iz;
    const h00 = this.heights[this.index(ix, iz)];
    const h10 = this.heights[this.index(ix + 1, iz)];
    const h01 = this.heights[this.index(ix, iz + 1)];
    const h11 = this.heights[this.index(ix + 1, iz + 1)];
    const hx0 = THREE.MathUtils.lerp(h00, h10, tx);
    const hx1 = THREE.MathUtils.lerp(h01, h11, tx);
    return THREE.MathUtils.lerp(hx0, hx1, tz);
  }

  getReferenceHeightAt(x: number, z: number): number {
    const fx = clamp((x + this.size / 2) / this.spacing, 0, this.segments - 0.001);
    const fz = clamp((z + this.size / 2) / this.spacing, 0, this.segments - 0.001);
    const ix = Math.floor(fx);
    const iz = Math.floor(fz);
    const tx = fx - ix;
    const tz = fz - iz;
    const x0 = -this.size / 2 + ix * this.spacing;
    const x1 = x0 + this.spacing;
    const z0 = -this.size / 2 + iz * this.spacing;
    const z1 = z0 + this.spacing;
    const h00 = this.initialHeight(x0, z0);
    const h10 = this.initialHeight(x1, z0);
    const h01 = this.initialHeight(x0, z1);
    const h11 = this.initialHeight(x1, z1);
    const hx0 = THREE.MathUtils.lerp(h00, h10, tx);
    const hx1 = THREE.MathUtils.lerp(h01, h11, tx);
    return THREE.MathUtils.lerp(hx0, hx1, tz);
  }

  getSlopeAt(x: number, z: number): number {
    const hL = this.getHeightAt(x - this.spacing, z);
    const hR = this.getHeightAt(x + this.spacing, z);
    const hD = this.getHeightAt(x, z - this.spacing);
    const hU = this.getHeightAt(x, z + this.spacing);
    const dx = (hR - hL) / (this.spacing * 2);
    const dz = (hU - hD) / (this.spacing * 2);
    return Math.hypot(dx, dz);
  }

  getDisturbedDepthAt(x: number, z: number): number {
    return Math.max(0, this.getReferenceHeightAt(x, z) - this.getHeightAt(x, z));
  }

  getSubsoilResistanceAt(x: number, z: number): number {
    const height = this.getHeightAt(x, z);
    const disturbedDepth = this.getDisturbedDepthAt(x, z);
    const bedrockPressure = clamp((height - SOIL_BEDROCK_FLOOR) / 0.75, 0, 1);
    const hardLayer = 1 - bedrockPressure;
    const surface = this.getSurfaceConditionAt(x, z);
    return clamp(
      (0.18 + disturbedDepth * 0.36 + hardLayer * 0.72 + this.getSlopeAt(x, z) * 0.16) *
        surface.bucketResistanceMultiplier,
      0.05,
      1.85,
    );
  }

  getSurfaceConditionAt(x: number, z: number): TerrainSurfaceCondition {
    const mudFlat =
      0.95 *
      Math.exp(-((x - 9.8) ** 2 / 15.5 + (z + 8.8) ** 2 / 7.5));
    const drainageMud =
      0.7 *
      Math.exp(-((x - 11.0) ** 2 / 22.0 + (z - 7.2) ** 2 / 35.0));
    const gravelRidge =
      0.9 *
      Math.exp(-((x + 13.2) ** 2 / 16.0 + (z + 9.6) ** 2 / 6.8));
    const haulRoad =
      Math.exp(-((z + 6.2) ** 2 / 1.15)) *
      clamp(1 - Math.abs(x - 0.5) / 20.0, 0, 1);
    const hardBench =
      0.72 *
      Math.exp(-((x + 15.0) ** 2 / 18.0 + (z - 8.0) ** 2 / 12.0));
    const outerWetland =
      0.88 *
      Math.exp(-((x - 28.0) ** 2 / 62.0 + (z + 24.0) ** 2 / 32.0));
    const gravelFan =
      0.82 *
      Math.exp(-((x + 30.0) ** 2 / 58.0 + (z - 25.0) ** 2 / 34.0));
    const limestoneBench =
      0.78 *
      Math.exp(-((x - 27.0) ** 2 / 48.0 + (z - 26.0) ** 2 / 42.0));
    const farHaulRoad =
      Math.exp(-((z - 20.5) ** 2 / 1.85)) *
      clamp(1 - Math.abs(x + 8.0) / 34.0, 0, 1);
    const wetness = clamp(mudFlat + drainageMud + outerWetland + 0.16 * (1 - Math.max(haulRoad, farHaulRoad)), 0, 1);
    const gravel = clamp(gravelRidge + gravelFan + hardBench * 0.45 + limestoneBench * 0.36, 0, 1);
    const hardpack = clamp(haulRoad * 0.82 + farHaulRoad * 0.78 + gravel * 0.5 + hardBench + limestoneBench, 0, 1);
    const compaction = clamp(Math.max(haulRoad, farHaulRoad) * 0.9 + hardpack * 0.5 - wetness * 0.22, 0, 1);
    return {
      wetness,
      gravel,
      hardpack,
      compaction,
      trackSinkMultiplier: clamp(1 + wetness * 1.1 - hardpack * 0.42, 0.52, 2.15),
      trackDragMultiplier: clamp(1 + wetness * 0.9 + gravel * 0.22 - compaction * 0.28, 0.72, 2.05),
      bucketResistanceMultiplier: clamp(1 + gravel * 0.55 + hardpack * 0.38 + wetness * 0.18, 0.82, 1.9),
      reposeTan: SOIL_REPOSE_TAN * clamp(1 - wetness * 0.22 + gravel * 0.18 + hardpack * 0.08, 0.64, 1.28),
    };
  }

  terrainVolumeDelta(): number {
    let delta = 0;
    const cellArea = this.spacing * this.spacing;
    for (let iz = 0; iz <= this.segments; iz += 1) {
      for (let ix = 0; ix <= this.segments; ix += 1) {
        const x = -this.size / 2 + ix * this.spacing;
        const z = -this.size / 2 + iz * this.spacing;
        delta += (this.heights[this.index(ix, iz)] - this.initialHeight(x, z)) * cellArea;
      }
    }
    return delta;
  }

  sampleTrackSupport(center: THREE.Vector3, forward: THREE.Vector3, sideways: THREE.Vector3, length: number, width: number): TrackSupportSample {
    const f = forward.clone();
    f.y = 0;
    if (f.lengthSq() < 0.0001) {
      f.set(1, 0, 0);
    }
    f.normalize();

    const s = sideways.clone();
    s.y = 0;
    if (s.lengthSq() < 0.0001) {
      s.set(-f.z, 0, f.x);
    }
    s.normalize();

    const halfLength = length * 0.5;
    const halfWidth = width * 0.5;
    const rangeRadius = halfLength + halfWidth + this.spacing * 2;
    const range = this.gridRange(center.x, center.z, rangeRadius);
    const heights: number[] = [];
    let heightSum = 0;
    let referenceSum = 0;

    for (let iz = range.minZ; iz <= range.maxZ; iz += 1) {
      for (let ix = range.minX; ix <= range.maxX; ix += 1) {
        const idx = this.index(ix, iz);
        const x = -this.size / 2 + ix * this.spacing;
        const z = -this.size / 2 + iz * this.spacing;
        const relX = x - center.x;
        const relZ = z - center.z;
        const longitudinal = relX * f.x + relZ * f.z;
        const lateral = relX * s.x + relZ * s.z;
        if (Math.abs(longitudinal) > halfLength || Math.abs(lateral) > halfWidth) {
          continue;
        }

        const h = this.heights[idx];
        heights.push(h);
        heightSum += h;
        referenceSum += this.initialHeight(x, z);
      }
    }

    if (heights.length === 0) {
      const height = this.getHeightAt(center.x, center.z);
      const reference = this.getReferenceHeightAt(center.x, center.z);
      return {
        supportHeight: height,
        averageHeight: height,
        lowHeight: height,
        highHeight: height,
        disturbedDepth: Math.max(0, reference - height),
      };
    }

    heights.sort((a, b) => a - b);
    const lowCount = clamp(Math.ceil(heights.length * 0.42), 1, heights.length);
    let lowSum = 0;
    for (let i = 0; i < lowCount; i += 1) {
      lowSum += heights[i];
    }
    const lowAverage = lowSum / lowCount;
    const averageHeight = heightSum / heights.length;
    const referenceHeight = referenceSum / heights.length;

    return {
      supportHeight: averageHeight * 0.38 + lowAverage * 0.62,
      averageHeight,
      lowHeight: heights[0],
      highHeight: heights[heights.length - 1],
      disturbedDepth: Math.max(0, referenceHeight - averageHeight),
    };
  }

  lowerAt(center: THREE.Vector3, radius: number, depth: number): number {
    const range = this.gridRange(center.x, center.z, radius);
    let removed = 0;

    for (let iz = range.minZ; iz <= range.maxZ; iz += 1) {
      for (let ix = range.minX; ix <= range.maxX; ix += 1) {
        const idx = this.index(ix, iz);
        const x = -this.size / 2 + ix * this.spacing;
        const z = -this.size / 2 + iz * this.spacing;
        const dist = Math.hypot(x - center.x, z - center.z);
        if (dist <= radius) {
          const falloff = (1 - dist / radius) ** 2;
          const maxLower = Math.max(0, this.heights[idx] - SOIL_BEDROCK_FLOOR);
          const delta = Math.min(depth * falloff, maxLower);
          this.heights[idx] -= delta;
          removed += delta * this.spacing * this.spacing;
        }
      }
    }

    if (removed > 0) {
      this.relaxSlopes(range, 2);
    }
    return removed;
  }

  excavateSweptBucket(
    start: THREE.Vector3,
    end: THREE.Vector3,
    sideways: THREE.Vector3,
    width: number,
    depth: number,
    volumeLimit: number,
  ): number {
    if (depth <= 0 || volumeLimit <= 0) {
      return 0;
    }

    const sx = start.x;
    const sz = start.z;
    const ex = end.x;
    const ez = end.z;
    const dx = ex - sx;
    const dz = ez - sz;
    const lengthSq = dx * dx + dz * dz;
    const segmentLength = Math.sqrt(lengthSq);
    const sideX = sideways.x;
    const sideZ = sideways.z;
    const sideLength = Math.hypot(sideX, sideZ) || 1;
    const halfWidth = width * 0.5;
    const centerX = (sx + ex) * 0.5;
    const centerZ = (sz + ez) * 0.5;
    const rangeRadius = segmentLength * 0.5 + halfWidth + this.spacing * 3;
    const range = this.gridRange(centerX, centerZ, rangeRadius);
    const cellArea = this.spacing * this.spacing;
    const candidates: Array<{ idx: number; delta: number }> = [];
    let requestedVolume = 0;

    for (let iz = range.minZ; iz <= range.maxZ; iz += 1) {
      for (let ix = range.minX; ix <= range.maxX; ix += 1) {
        const idx = this.index(ix, iz);
        const x = -this.size / 2 + ix * this.spacing;
        const z = -this.size / 2 + iz * this.spacing;
        const t =
          lengthSq > 0.0001
            ? clamp(((x - sx) * dx + (z - sz) * dz) / lengthSq, 0, 1)
            : 0.5;
        const nearestX = sx + dx * t;
        const nearestZ = sz + dz * t;
        const lateralDistance = Math.hypot(x - nearestX, z - nearestZ);
        const sideProjection = Math.abs(((x - nearestX) * sideX + (z - nearestZ) * sideZ) / sideLength);
        const effectiveDistance = Math.max(lateralDistance * 0.72, sideProjection);
        if (effectiveDistance > halfWidth + this.spacing * 0.8) {
          continue;
        }

        const edgeFalloff = clamp(1 - effectiveDistance / (halfWidth + this.spacing * 0.8), 0, 1);
        const strokeFalloff = lengthSq > 0.0001 ? 0.7 + t * 0.3 : 1;
        const desiredDelta = depth * Math.pow(edgeFalloff, 1.35) * strokeFalloff;
        const maxLower = Math.max(0, this.heights[idx] - SOIL_BEDROCK_FLOOR);
        const delta = Math.min(desiredDelta, maxLower);
        if (delta <= 0) {
          continue;
        }

        candidates.push({ idx, delta });
        requestedVolume += delta * cellArea;
      }
    }

    if (requestedVolume <= 0) {
      return 0;
    }

    const scale = Math.min(1, volumeLimit / requestedVolume);
    let removed = 0;
    for (const candidate of candidates) {
      const delta = candidate.delta * scale;
      this.heights[candidate.idx] -= delta;
      removed += delta * cellArea;
    }

    if (removed > 0) {
      this.relaxSlopes(range, 3);
    }
    return removed;
  }

  displaceSweptBucket(
    start: THREE.Vector3,
    end: THREE.Vector3,
    sideways: THREE.Vector3,
    width: number,
    depth: number,
    volumeLimit: number,
  ): number {
    const moved = this.excavateSweptBucket(start, end, sideways, width, depth, volumeLimit);
    if (moved <= 0) {
      return 0;
    }

    const side = sideways.clone();
    side.y = 0;
    if (side.lengthSq() < 0.0001) {
      side.set(0, 0, 1);
    }
    side.normalize();

    const center = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    const lateral = width * 0.62;
    const left = center.clone().addScaledVector(side, lateral);
    const right = center.clone().addScaledVector(side, -lateral);
    this.raiseAt(left, width * 0.34, moved * 0.5);
    this.raiseAt(right, width * 0.34, moved * 0.5);
    return moved;
  }

  compactTrackStrip(
    center: THREE.Vector3,
    forward: THREE.Vector3,
    sideways: THREE.Vector3,
    length: number,
    width: number,
    depth: number,
  ): { compacted: number; rutDrop: number; bermRise: number } {
    if (depth <= 0) {
      return { compacted: 0, rutDrop: 0, bermRise: 0 };
    }

    const f = forward.clone();
    f.y = 0;
    if (f.lengthSq() < 0.0001) {
      f.set(1, 0, 0);
    }
    f.normalize();

    const s = sideways.clone();
    s.y = 0;
    if (s.lengthSq() < 0.0001) {
      s.set(-f.z, 0, f.x);
    }
    s.normalize();

    const halfLength = length * 0.5;
    const halfWidth = width * 0.5;
    const rangeRadius = halfLength + halfWidth + this.spacing * 2;
    const range = this.gridRange(center.x, center.z, rangeRadius);
    const cellArea = this.spacing * this.spacing;
    let compacted = 0;
    let weightedDrop = 0;
    let weightTotal = 0;

    for (let iz = range.minZ; iz <= range.maxZ; iz += 1) {
      for (let ix = range.minX; ix <= range.maxX; ix += 1) {
        const idx = this.index(ix, iz);
        const x = -this.size / 2 + ix * this.spacing;
        const z = -this.size / 2 + iz * this.spacing;
        const relX = x - center.x;
        const relZ = z - center.z;
        const longitudinal = relX * f.x + relZ * f.z;
        const lateral = relX * s.x + relZ * s.z;
        if (Math.abs(longitudinal) > halfLength || Math.abs(lateral) > halfWidth) {
          continue;
        }

        const sideFalloff = 1 - Math.abs(lateral) / halfWidth;
        const endFalloff = 1 - Math.abs(longitudinal) / halfLength;
        const padNoise = 0.72 + hash2(ix * 13 + iz * 7, Math.round(center.x * 31 + center.z * 17)) * 0.28;
        const delta = depth * (0.42 + sideFalloff * 0.58) * (0.76 + endFalloff * 0.24) * padNoise;
        const maxLower = Math.max(0, this.heights[idx] - SOIL_BEDROCK_FLOOR);
        const applied = Math.min(delta, maxLower);
        this.heights[idx] -= applied;
        compacted += applied * cellArea;
        weightedDrop += applied * (0.25 + sideFalloff);
        weightTotal += 0.25 + sideFalloff;
      }
    }

    if (compacted <= 0) {
      return { compacted: 0, rutDrop: 0, bermRise: 0 };
    }

    this.relaxSlopes(range, 1);
    const leftBerm = center.clone().addScaledVector(s, halfWidth + 0.2);
    const rightBerm = center.clone().addScaledVector(s, -halfWidth - 0.2);
    const beforeBerm = Math.max(this.getHeightAt(leftBerm.x, leftBerm.z), this.getHeightAt(rightBerm.x, rightBerm.z));
    this.raiseAt(leftBerm, width * 0.48, compacted * 0.32, 1);
    this.raiseAt(rightBerm, width * 0.48, compacted * 0.32, 1);
    const afterBerm = Math.max(this.getHeightAt(leftBerm.x, leftBerm.z), this.getHeightAt(rightBerm.x, rightBerm.z));

    return {
      compacted,
      rutDrop: weightTotal > 0 ? weightedDrop / weightTotal : 0,
      bermRise: Math.max(0, afterBerm - beforeBerm),
    };
  }

  settleAt(center: THREE.Vector3, radius: number, passes = 1): void {
    this.relaxSlopes(this.gridRange(center.x, center.z, radius), passes);
  }

  raiseAt(center: THREE.Vector3, radius: number, volume: number, relaxPasses = 7): number {
    const range = this.gridRange(center.x, center.z, radius);
    const weights: Array<[number, number]> = [];
    let totalWeight = 0;

    for (let iz = range.minZ; iz <= range.maxZ; iz += 1) {
      for (let ix = range.minX; ix <= range.maxX; ix += 1) {
        const idx = this.index(ix, iz);
        const x = -this.size / 2 + ix * this.spacing;
        const z = -this.size / 2 + iz * this.spacing;
        const dist = Math.hypot(x - center.x, z - center.z);
        if (dist <= radius) {
          const weight = (1 - dist / radius) ** 2 + 0.04;
          weights.push([idx, weight]);
          totalWeight += weight;
        }
      }
    }

    if (totalWeight <= 0) {
      return 0;
    }

    let deposited = 0;
    for (const [idx, weight] of weights) {
      const addHeight = (volume * weight) / totalWeight / (this.spacing * this.spacing);
      this.heights[idx] += addHeight;
      deposited += addHeight * this.spacing * this.spacing;
    }
    if (relaxPasses > 0) {
      this.relaxSlopes(range, relaxPasses);
    } else {
      this.commitRange(range);
    }
    return deposited;
  }

  reset(): void {
    for (let iz = 0; iz <= this.segments; iz += 1) {
      for (let ix = 0; ix <= this.segments; ix += 1) {
        const x = -this.size / 2 + ix * this.spacing;
        const z = -this.size / 2 + iz * this.spacing;
        this.heights[this.index(ix, iz)] = this.initialHeight(x, z);
      }
    }
    this.commitRange({ minX: 0, maxX: this.segments, minZ: 0, maxZ: this.segments });
  }

  private index(ix: number, iz: number): number {
    return iz * (this.segments + 1) + ix;
  }

  private initialHeight(x: number, z: number): number {
    const digMound =
      0.82 *
      Math.exp(-((x - DIG_SITE.x) ** 2 / 8.0 + (z - DIG_SITE.z) ** 2 / 4.6));
    const lowCut =
      -0.12 *
      Math.exp(-((x - 1.5) ** 2 / 32.0 + (z + 1.0) ** 2 / 20.0));
    const farRidge =
      0.26 *
      Math.exp(-((x + 12.5) ** 2 / 38.0 + (z + 9.5) ** 2 / 18.0));
    const drainage =
      -0.18 *
      Math.exp(-((x - 10.5) ** 2 / 18.0 + (z - 7.4) ** 2 / 42.0));
    const oldTrack =
      -0.055 *
      Math.exp(-((z + 6.2) ** 2 / 1.4)) *
      (0.5 + 0.5 * Math.sin(x * 0.48 + 0.7));
    const wetBasin =
      -0.16 *
      Math.exp(-((x - 9.8) ** 2 / 15.5 + (z + 8.8) ** 2 / 7.5));
    const gravelPad =
      0.12 *
      Math.exp(-((x + 13.2) ** 2 / 16.0 + (z + 9.6) ** 2 / 6.8));
    const hardBench =
      0.18 *
      Math.exp(-((x + 15.0) ** 2 / 18.0 + (z - 8.0) ** 2 / 12.0));
    const outerWetland =
      -0.2 *
      Math.exp(-((x - 28.0) ** 2 / 62.0 + (z + 24.0) ** 2 / 32.0));
    const gravelFan =
      0.18 *
      Math.exp(-((x + 30.0) ** 2 / 58.0 + (z - 25.0) ** 2 / 34.0));
    const limestoneBench =
      0.24 *
      Math.exp(-((x - 27.0) ** 2 / 48.0 + (z - 26.0) ** 2 / 42.0));
    const farHaulRoad =
      -0.075 *
      Math.exp(-((z - 20.5) ** 2 / 1.85)) *
      clamp(1 - Math.abs(x + 8.0) / 34.0, 0, 1);
    const outerRidge =
      0.28 *
      Math.exp(-((x + 36.0) ** 2 / 70.0 + (z + 27.0) ** 2 / 38.0));
    const spoilWindrow =
      0.16 *
      Math.exp(-((x - 33.5) ** 2 / 18.0 + (z - 4.0) ** 2 / 95.0)) *
      (0.72 + 0.28 * Math.sin(z * 0.42));
    const undulation = 0.075 * (fbm(x * 0.11 + 4.2, z * 0.11 - 2.8) - 0.5);
    const broadRoughness = 0.052 * (fbm(x * 0.23 - 8.4, z * 0.19 + 5.8) - 0.5);
    const ripple = 0.035 * Math.sin(x * 0.72) * Math.cos(z * 0.48);
    return (
      digMound +
      lowCut +
      farRidge +
      drainage +
      oldTrack +
      wetBasin +
      gravelPad +
      hardBench +
      outerWetland +
      gravelFan +
      limestoneBench +
      farHaulRoad +
      outerRidge +
      spoilWindrow +
      undulation +
      broadRoughness +
      ripple
    );
  }

  private colorForHeight(height: number, x: number, z: number): [number, number, number] {
    const base = new THREE.Color(0x826846);
    const high = new THREE.Color(0xb1844d);
    const low = new THREE.Color(0x453e32);
    const damp = new THREE.Color(0x5d4a37);
    const wetMud = new THREE.Color(0x3d4037);
    const gravelColor = new THREE.Color(0x7a7568);
    const roadColor = new THREE.Color(0x5f5748);
    const noise = fbm(x * 0.55 + 20, z * 0.55 - 11);
    const grit = fbm(x * 3.4, z * 3.4);
    const surface = this.getSurfaceConditionAt(x, z);
    const color = height > 0.15 ? base.clone().lerp(high, clamp(height / 1.0, 0, 1)) : base.clone().lerp(low, 0.22);
    if (height < -0.18) {
      color.lerp(damp, clamp((-height - 0.18) * 1.8, 0, 0.45));
    }
    color.lerp(wetMud, surface.wetness * 0.52);
    color.lerp(gravelColor, surface.gravel * 0.48);
    color.lerp(roadColor, surface.compaction * 0.28);
    color.offsetHSL(0.012 * (noise - 0.5), 0.08 * (grit - 0.5), (noise - 0.5) * 0.12);
    return [color.r, color.g, color.b];
  }

  private gridRange(x: number, z: number, radius: number): { minX: number; maxX: number; minZ: number; maxZ: number } {
    const minX = clamp(Math.floor((x - radius + this.size / 2) / this.spacing), 0, this.segments);
    const maxX = clamp(Math.ceil((x + radius + this.size / 2) / this.spacing), 0, this.segments);
    const minZ = clamp(Math.floor((z - radius + this.size / 2) / this.spacing), 0, this.segments);
    const maxZ = clamp(Math.ceil((z + radius + this.size / 2) / this.spacing), 0, this.segments);
    return { minX, maxX, minZ, maxZ };
  }

  private expandRange(
    range: { minX: number; maxX: number; minZ: number; maxZ: number },
    amount: number,
  ): { minX: number; maxX: number; minZ: number; maxZ: number } {
    return {
      minX: clamp(range.minX - amount, 0, this.segments),
      maxX: clamp(range.maxX + amount, 0, this.segments),
      minZ: clamp(range.minZ - amount, 0, this.segments),
      maxZ: clamp(range.maxZ + amount, 0, this.segments),
    };
  }

  private relaxSlopes(range: { minX: number; maxX: number; minZ: number; maxZ: number }, passes: number): void {
    const relaxedRange = this.expandRange(range, passes + 2);
    const maxDelta = this.spacing * SOIL_REPOSE_TAN;

    for (let pass = 0; pass < passes; pass += 1) {
      for (let iz = relaxedRange.minZ; iz < relaxedRange.maxZ; iz += 1) {
        for (let ix = relaxedRange.minX; ix < relaxedRange.maxX; ix += 1) {
          this.transferIfTooSteep(this.index(ix, iz), this.index(ix + 1, iz), maxDelta);
          this.transferIfTooSteep(this.index(ix, iz), this.index(ix, iz + 1), maxDelta);
        }
      }
    }

    this.commitRange(relaxedRange);
  }

  private transferIfTooSteep(a: number, b: number, maxDelta: number): void {
    const diff = this.heights[a] - this.heights[b];
    const excess = Math.abs(diff) - maxDelta;
    if (excess <= 0) {
      return;
    }
    const transfer = excess * 0.22;
    if (diff > 0) {
      this.heights[a] -= transfer;
      this.heights[b] += transfer;
    } else {
      this.heights[a] += transfer;
      this.heights[b] -= transfer;
    }
  }

  private commitRange(range: { minX: number; maxX: number; minZ: number; maxZ: number }): void {
    const position = this.geometry.attributes.position as THREE.BufferAttribute;
    const color = this.geometry.attributes.color as THREE.BufferAttribute;

    for (let iz = range.minZ; iz <= range.maxZ; iz += 1) {
      for (let ix = range.minX; ix <= range.maxX; ix += 1) {
        const idx = this.index(ix, iz);
        const x = -this.size / 2 + ix * this.spacing;
        const z = -this.size / 2 + iz * this.spacing;
        const h = this.heights[idx];
        position.setY(idx, h);
        const nextColor = this.colorForHeight(h, x, z);
        color.setXYZ(idx, nextColor[0], nextColor[1], nextColor[2]);
      }
    }

    position.needsUpdate = true;
    color.needsUpdate = true;
    this.geometry.computeVertexNormals();
    this.geometry.attributes.normal.needsUpdate = true;
  }
}

class WorkTruck {
  readonly group = new THREE.Group();
  readonly loadMesh: THREE.Mesh;
  private readonly loadGeometry: THREE.BufferGeometry;
  private readonly loadHeights: Float32Array;
  private readonly baseYaw = -0.07;
  private readonly bedLength = 3.75;
  private readonly bedWidth = 1.72;
  private readonly bedFloorY = 0.72;
  private readonly bedCenterX = 0.54;
  private readonly solidBoxes = [
    { center: new THREE.Vector3(0, 0.45, 0), half: new THREE.Vector3(2.2, 0.11, 0.98) },
    { center: new THREE.Vector3(-2.12, 1.03, 0), half: new THREE.Vector3(0.53, 0.48, 0.86) },
    { center: new THREE.Vector3(0.54, 0.72, 0), half: new THREE.Vector3(1.93, 0.08, 0.86) },
    { center: new THREE.Vector3(0.54, 1.12, -0.86), half: new THREE.Vector3(1.93, 0.45, 0.06) },
    { center: new THREE.Vector3(0.54, 1.12, 0.86), half: new THREE.Vector3(1.93, 0.45, 0.06) },
    { center: new THREE.Vector3(-1.38, 1.12, 0), half: new THREE.Vector3(0.07, 0.45, 0.86) },
    { center: new THREE.Vector3(2.46, 1.12, 0), half: new THREE.Vector3(0.07, 0.45, 0.86) },
  ];
  private readonly loadSegmentsX = 10;
  private readonly loadSegmentsZ = 6;
  private readonly wheelLocals = [
    new THREE.Vector3(-1.7, 0, -1.02),
    new THREE.Vector3(-1.7, 0, 1.02),
    new THREE.Vector3(1.45, 0, -1.02),
    new THREE.Vector3(1.45, 0, 1.02),
  ];
  private truckPhysics: TruckPhysicsState = {
    loadRatio: 0,
    suspensionSag: 0,
    pitch: 0,
    roll: 0,
    supportSpread: 0,
    tireCompacted: 0,
    tireRutDrop: 0,
    bodyY: TRUCK_CENTER.y,
  };

  constructor(scene: THREE.Scene) {
    const tireMat = makeMat(0x151817, 0.85, 0.12);
    const bodyMat = makeMat(0x38474a, 0.68, 0.16);
    const cabMat = makeMat(0xb4bfc2, 0.48, 0.1);
    const soilMat = makeMat(0x7d5b32, 0.9, 0.02);

    this.group.position.copy(TRUCK_CENTER);
    this.group.rotation.y = this.baseYaw;
    this.group.add(makeBox([4.4, 0.22, 1.95], bodyMat, [0, 0.45, 0]));
    this.group.add(makeBox([1.05, 0.95, 1.72], cabMat, [-2.12, 1.03, 0]));
    this.group.add(makeBox([3.85, 0.16, 1.72], bodyMat, [0.54, this.bedFloorY, 0]));
    this.group.add(makeBox([3.85, 0.9, 0.12], bodyMat, [0.54, 1.12, -0.86]));
    this.group.add(makeBox([3.85, 0.9, 0.12], bodyMat, [0.54, 1.12, 0.86]));
    this.group.add(makeBox([0.14, 0.9, 1.72], bodyMat, [-1.38, 1.12, 0]));
    this.group.add(makeBox([0.14, 0.9, 1.72], bodyMat, [2.46, 1.12, 0]));

    for (const x of [-1.7, 1.45]) {
      for (const z of [-1.02, 1.02]) {
        const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.28, 24), tireMat);
        tire.rotation.x = Math.PI / 2;
        tire.position.set(x, 0.32, z);
        tire.castShadow = true;
        tire.receiveShadow = true;
        this.group.add(tire);
      }
    }

    this.loadGeometry = this.createLoadGeometry();
    this.loadHeights = new Float32Array((this.loadSegmentsX + 1) * (this.loadSegmentsZ + 1));
    this.loadMesh = new THREE.Mesh(this.loadGeometry, soilMat);
    this.loadMesh.visible = false;
    this.loadMesh.castShadow = true;
    this.loadMesh.receiveShadow = true;
    this.group.add(this.loadMesh);
    scene.add(this.group);
  }

  reset(terrain: HeightfieldTerrain): void {
    this.group.position.copy(TRUCK_CENTER);
    this.group.rotation.set(0, this.baseYaw, 0);
    this.loadHeights.fill(0);
    this.loadMesh.visible = false;
    this.commitLoadSurface();
    this.truckPhysics = {
      loadRatio: 0,
      suspensionSag: 0,
      pitch: 0,
      roll: 0,
      supportSpread: 0,
      tireCompacted: 0,
      tireRutDrop: 0,
      bodyY: this.group.position.y,
    };
    this.updatePhysics(terrain, 0, 1, false);
  }

  physicsState(): TruckPhysicsState {
    return { ...this.truckPhysics };
  }

  wheelWorldPoints(): THREE.Vector3[] {
    return this.wheelLocals.map((local) => this.localWheelToWorld(local));
  }

  updatePhysics(terrain: HeightfieldTerrain, load: number, dt: number, compactTires = true): TruckPhysicsState {
    const samples = this.wheelLocals.map((local) => {
      const world = this.localWheelToWorld(local);
      return { local, world, ground: terrain.getHeightAt(world.x, world.z) };
    });
    const loadRatio = clamp(load / TRUCK_CAPACITY, 0, 1);
    const groundAverage = samples.reduce((sum, sample) => sum + sample.ground, 0) / samples.length;
    const groundHigh = Math.max(...samples.map((sample) => sample.ground));
    const groundLow = Math.min(...samples.map((sample) => sample.ground));
    const supportSpread = groundHigh - groundLow;
    const frontAverage = this.averageGround(samples, (local) => local.x > 0);
    const rearAverage = this.averageGround(samples, (local) => local.x < 0);
    const leftAverage = this.averageGround(samples, (local) => local.z < 0);
    const rightAverage = this.averageGround(samples, (local) => local.z > 0);
    const loadCenter = this.loadCenterOffset();
    const wheelBase = 3.15;
    const axleWidth = 2.04;
    const targetSag = clamp(loadRatio * 0.22 + supportSpread * 0.1, 0, 0.28);
    const targetPitch = clamp((rearAverage - frontAverage) / wheelBase + loadCenter.x * loadRatio * 0.045, -0.16, 0.16);
    const targetRoll = clamp((leftAverage - rightAverage) / axleWidth + loadCenter.z * loadRatio * 0.055, -0.14, 0.14);
    const response = dt <= 0 ? 1 : 1 - Math.exp(-5.2 * dt);
    const targetY = groundAverage - targetSag;
    this.group.position.y = THREE.MathUtils.lerp(this.group.position.y, targetY, response);
    this.group.rotation.x = THREE.MathUtils.lerp(this.group.rotation.x, targetRoll, response);
    this.group.rotation.y = this.baseYaw;
    this.group.rotation.z = THREE.MathUtils.lerp(this.group.rotation.z, targetPitch, response);

    let tireCompacted = 0;
    let tireRutDrop = 0;
    if (compactTires && loadRatio > 0.025 && dt > 0) {
      const forward = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.baseYaw).normalize();
      const side = new THREE.Vector3(-forward.z, 0, forward.x).normalize();
      const depth = clamp((0.0018 + loadRatio * 0.0115 + supportSpread * 0.007) * clamp(dt * 2.4, 0.12, 1), 0.0005, 0.014);
      for (const sample of samples) {
        const before = terrain.getHeightAt(sample.world.x, sample.world.z);
        const surface = terrain.getSurfaceConditionAt(sample.world.x, sample.world.z);
        const axleBias = sample.local.x > 0 ? 0.96 : 1.04;
        const result = terrain.compactTrackStrip(sample.world, forward, side, 0.56, 0.38, depth * axleBias * surface.trackSinkMultiplier);
        const after = terrain.getHeightAt(sample.world.x, sample.world.z);
        tireCompacted += result.compacted;
        tireRutDrop += Math.max(result.rutDrop, before - after);
      }
      tireRutDrop /= samples.length;
    }

    this.truckPhysics = {
      loadRatio,
      suspensionSag: targetSag,
      pitch: this.group.rotation.z,
      roll: this.group.rotation.x,
      supportSpread,
      tireCompacted,
      tireRutDrop,
      bodyY: this.group.position.y,
    };
    return this.physicsState();
  }

  containsWorldPoint(point: THREE.Vector3): boolean {
    const local = this.group.worldToLocal(point.clone());
    return (
      local.x > -1.34 &&
      local.x < 2.44 &&
      local.z > -this.bedWidth / 2 &&
      local.z < this.bedWidth / 2 &&
      point.y > this.group.position.y + this.bedFloorY - 0.1
    );
  }

  resolveBodyCollision(worldCenter: THREE.Vector3, radius: number): { normal: THREE.Vector3; penetration: number } | null {
    const local = this.group.worldToLocal(worldCenter.clone());
    const minX = -2.58;
    const maxX = 2.72;
    const minZ = -1.22;
    const maxZ = 1.22;
    const closestX = clamp(local.x, minX, maxX);
    const closestZ = clamp(local.z, minZ, maxZ);
    const dx = local.x - closestX;
    const dz = local.z - closestZ;
    const distanceSq = dx * dx + dz * dz;

    let localNormal = new THREE.Vector3();
    let penetration = 0;

    if (distanceSq > 0.000001) {
      const distance = Math.sqrt(distanceSq);
      if (distance >= radius) {
        return null;
      }
      localNormal.set(dx / distance, 0, dz / distance);
      penetration = radius - distance;
    } else {
      const distances = [
        { value: local.x - minX, normal: new THREE.Vector3(-1, 0, 0) },
        { value: maxX - local.x, normal: new THREE.Vector3(1, 0, 0) },
        { value: local.z - minZ, normal: new THREE.Vector3(0, 0, -1) },
        { value: maxZ - local.z, normal: new THREE.Vector3(0, 0, 1) },
      ].sort((a, b) => a.value - b.value);
      localNormal = distances[0].normal;
      penetration = radius + distances[0].value;
    }

    const normal = localNormal.applyQuaternion(this.group.quaternion).normalize();
    return { normal, penetration };
  }

  resolveSolidCollision(worldPoint: THREE.Vector3, radius: number): { normal: THREE.Vector3; penetration: number } | null {
    const local = this.group.worldToLocal(worldPoint.clone());
    let best: { normal: THREE.Vector3; penetration: number } | null = null;

    for (const box of this.solidBoxes) {
      const delta = local.clone().sub(box.center);
      const closest = new THREE.Vector3(
        clamp(delta.x, -box.half.x, box.half.x),
        clamp(delta.y, -box.half.y, box.half.y),
        clamp(delta.z, -box.half.z, box.half.z),
      );
      const separation = delta.clone().sub(closest);
      const distanceSq = separation.lengthSq();
      let localNormal: THREE.Vector3 | null = null;
      let penetration = 0;

      if (distanceSq > 0.000001) {
        const distance = Math.sqrt(distanceSq);
        if (distance >= radius) {
          continue;
        }
        localNormal = separation.divideScalar(distance);
        penetration = radius - distance;
      } else if (
        Math.abs(delta.x) <= box.half.x &&
        Math.abs(delta.y) <= box.half.y &&
        Math.abs(delta.z) <= box.half.z
      ) {
        const faceDistances = [
          { value: box.half.x - Math.abs(delta.x), normal: new THREE.Vector3(Math.sign(delta.x || 1), 0, 0) },
          { value: box.half.y - Math.abs(delta.y), normal: new THREE.Vector3(0, Math.sign(delta.y || 1), 0) },
          { value: box.half.z - Math.abs(delta.z), normal: new THREE.Vector3(0, 0, Math.sign(delta.z || 1)) },
        ].sort((a, b) => a.value - b.value);
        localNormal = faceDistances[0].normal;
        penetration = radius + faceDistances[0].value;
      }

      if (!localNormal || penetration <= 0) {
        continue;
      }
      const normal = localNormal.applyQuaternion(this.group.quaternion).normalize();
      if (!best || penetration > best.penetration) {
        best = { normal, penetration };
      }
    }

    return best;
  }

  updateLoad(load: number): void {
    const ratio = clamp(load / TRUCK_CAPACITY, 0, 1);
    this.loadMesh.visible = ratio > 0.01;
    if (load <= 0) {
      this.loadHeights.fill(0);
      this.commitLoadSurface();
    }
  }

  settleLoad(passes = 1): void {
    if (!this.loadMesh.visible) {
      return;
    }
    this.relaxLoad(passes);
    this.commitLoadSurface();
  }

  depositSoilAt(point: THREE.Vector3, volume: number, availableVolume: number): number {
    if (volume <= 0 || availableVolume <= 0 || !this.containsWorldPoint(point)) {
      return 0;
    }

    const accepted = Math.min(volume, availableVolume);
    const local = this.group.worldToLocal(point.clone());
    this.addLoadMound(local.x, local.z, accepted);
    this.loadMesh.visible = true;
    return accepted;
  }

  private localWheelToWorld(local: THREE.Vector3): THREE.Vector3 {
    const yaw = this.baseYaw;
    const cos = Math.cos(yaw);
    const sin = Math.sin(yaw);
    return new THREE.Vector3(
      this.group.position.x + local.x * cos + local.z * sin,
      this.group.position.y + local.y,
      this.group.position.z - local.x * sin + local.z * cos,
    );
  }

  private averageGround(
    samples: Array<{ local: THREE.Vector3; ground: number }>,
    predicate: (local: THREE.Vector3) => boolean,
  ): number {
    const filtered = samples.filter((sample) => predicate(sample.local));
    return filtered.reduce((sum, sample) => sum + sample.ground, 0) / Math.max(1, filtered.length);
  }

  private loadCenterOffset(): { x: number; z: number } {
    let total = 0;
    let weightedX = 0;
    let weightedZ = 0;
    for (let iz = 0; iz <= this.loadSegmentsZ; iz += 1) {
      for (let ix = 0; ix <= this.loadSegmentsX; ix += 1) {
        const idx = this.loadIndex(ix, iz);
        const height = this.loadHeights[idx];
        if (height <= 0) {
          continue;
        }
        const x = this.bedCenterX - this.bedLength / 2 + (ix / this.loadSegmentsX) * this.bedLength;
        const z = -this.bedWidth / 2 + (iz / this.loadSegmentsZ) * this.bedWidth;
        total += height;
        weightedX += x * height;
        weightedZ += z * height;
      }
    }

    if (total <= 0) {
      return { x: 0, z: 0 };
    }
    return { x: weightedX / total - this.bedCenterX, z: weightedZ / total };
  }

  private createLoadGeometry(): THREE.BufferGeometry {
    const positions: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    for (let iz = 0; iz <= this.loadSegmentsZ; iz += 1) {
      for (let ix = 0; ix <= this.loadSegmentsX; ix += 1) {
        const x = this.bedCenterX - this.bedLength / 2 + (ix / this.loadSegmentsX) * this.bedLength;
        const z = -this.bedWidth / 2 + (iz / this.loadSegmentsZ) * this.bedWidth;
        positions.push(x, this.bedFloorY + 0.045, z);
        uvs.push(ix / this.loadSegmentsX, iz / this.loadSegmentsZ);
      }
    }

    for (let iz = 0; iz < this.loadSegmentsZ; iz += 1) {
      for (let ix = 0; ix < this.loadSegmentsX; ix += 1) {
        const a = this.loadIndex(ix, iz);
        const b = this.loadIndex(ix + 1, iz);
        const c = this.loadIndex(ix, iz + 1);
        const d = this.loadIndex(ix + 1, iz + 1);
        indices.push(a, c, b, b, c, d);
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setIndex(indices);
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
    geometry.computeVertexNormals();
    (geometry.attributes.position as THREE.BufferAttribute).setUsage(THREE.DynamicDrawUsage);
    (geometry.attributes.normal as THREE.BufferAttribute).setUsage(THREE.DynamicDrawUsage);
    return geometry;
  }

  private addLoadMound(localX: number, localZ: number, volume: number): void {
    const clampedX = clamp(localX, this.bedCenterX - this.bedLength * 0.48, this.bedCenterX + this.bedLength * 0.48);
    const clampedZ = clamp(localZ, -this.bedWidth * 0.46, this.bedWidth * 0.46);
    const weights: Array<[number, number]> = [];
    const radius = 0.48 + Math.cbrt(volume) * 0.34;
    let totalWeight = 0;

    for (let iz = 0; iz <= this.loadSegmentsZ; iz += 1) {
      for (let ix = 0; ix <= this.loadSegmentsX; ix += 1) {
        const x = this.bedCenterX - this.bedLength / 2 + (ix / this.loadSegmentsX) * this.bedLength;
        const z = -this.bedWidth / 2 + (iz / this.loadSegmentsZ) * this.bedWidth;
        const dist = Math.hypot(x - clampedX, z - clampedZ);
        if (dist <= radius) {
          const weight = (1 - dist / radius) ** 2 + 0.05;
          weights.push([this.loadIndex(ix, iz), weight]);
          totalWeight += weight;
        }
      }
    }

    if (totalWeight <= 0) {
      return;
    }

    const visualCellArea = (this.bedLength / this.loadSegmentsX) * (this.bedWidth / this.loadSegmentsZ);
    for (const [idx, weight] of weights) {
      this.loadHeights[idx] += ((volume * weight) / totalWeight / visualCellArea) * 0.72;
    }
    this.relaxLoad(6);
    this.commitLoadSurface();
  }

  private relaxLoad(passes: number): void {
    const maxDelta = 0.13;
    for (let pass = 0; pass < passes; pass += 1) {
      for (let iz = 0; iz < this.loadSegmentsZ; iz += 1) {
        for (let ix = 0; ix < this.loadSegmentsX; ix += 1) {
          this.transferLoadIfTooSteep(this.loadIndex(ix, iz), this.loadIndex(ix + 1, iz), maxDelta);
          this.transferLoadIfTooSteep(this.loadIndex(ix, iz), this.loadIndex(ix, iz + 1), maxDelta);
        }
      }
    }
  }

  private transferLoadIfTooSteep(a: number, b: number, maxDelta: number): void {
    const diff = this.loadHeights[a] - this.loadHeights[b];
    const excess = Math.abs(diff) - maxDelta;
    if (excess <= 0) {
      return;
    }
    const transfer = excess * 0.2;
    if (diff > 0) {
      this.loadHeights[a] -= transfer;
      this.loadHeights[b] += transfer;
    } else {
      this.loadHeights[a] += transfer;
      this.loadHeights[b] -= transfer;
    }
  }

  private commitLoadSurface(): void {
    const position = this.loadGeometry.attributes.position as THREE.BufferAttribute;
    for (let iz = 0; iz <= this.loadSegmentsZ; iz += 1) {
      for (let ix = 0; ix <= this.loadSegmentsX; ix += 1) {
        const idx = this.loadIndex(ix, iz);
        position.setY(idx, this.bedFloorY + 0.045 + this.loadHeights[idx]);
      }
    }
    position.needsUpdate = true;
    this.loadGeometry.computeVertexNormals();
    this.loadGeometry.attributes.normal.needsUpdate = true;
  }

  private loadIndex(ix: number, iz: number): number {
    return iz * (this.loadSegmentsX + 1) + ix;
  }
}

class ExcavatorModel {
  readonly group = new THREE.Group();
  readonly upperGroup = new THREE.Group();
  readonly boomPivot = new THREE.Group();
  readonly boomGroup = new THREE.Group();
  readonly stickGroup = new THREE.Group();
  readonly bucketGroup = new THREE.Group();
  readonly bucketLoadMesh: THREE.Mesh;
  readonly boomCylinder: THREE.Mesh;
  readonly stickCylinder: THREE.Mesh;
  readonly bucketCylinder: THREE.Mesh;
  readonly bucketRockerLeft: THREE.Mesh;
  readonly bucketRockerRight: THREE.Mesh;
  readonly bucketLinkLeft: THREE.Mesh;
  readonly bucketLinkRight: THREE.Mesh;
  private readonly bucketLoadGeometry: THREE.BufferGeometry;
  private readonly bucketLoadHeights: Float32Array;
  private readonly bucketLoadSegmentsX = 7;
  private readonly bucketLoadSegmentsZ = 6;
  private bucketLoadRenderedRatio = -1;

  private readonly mats = {
    yellow: makeMat(0xf1a51d, 0.62, 0.16),
    dark: makeMat(0x222724, 0.72, 0.22),
    glass: new THREE.MeshPhysicalMaterial({
      color: 0x6f9eaa,
      roughness: 0.18,
      metalness: 0.02,
      transmission: 0.25,
      opacity: 0.74,
      transparent: true,
    }),
    hydraulic: makeMat(0xcfd2cc, 0.34, 0.36),
    rod: makeMat(0xe7e9e1, 0.24, 0.58),
    soil: makeMat(0x7a542e, 0.93, 0.02),
  };

  constructor(scene: THREE.Scene) {
    this.group.position.set(0, 0, 0);
    scene.add(this.group);
    this.buildLower();
    this.buildUpper();
    this.buildArm();

    this.boomCylinder = this.makeHydraulicCylinder(scene, 0.055, this.mats.hydraulic);
    this.stickCylinder = this.makeHydraulicCylinder(scene, 0.046, this.mats.hydraulic);
    this.bucketCylinder = this.makeHydraulicCylinder(scene, 0.038, this.mats.rod);
    this.bucketRockerLeft = this.makeHydraulicCylinder(scene, 0.032, this.mats.dark);
    this.bucketRockerRight = this.makeHydraulicCylinder(scene, 0.032, this.mats.dark);
    this.bucketLinkLeft = this.makeHydraulicCylinder(scene, 0.028, this.mats.rod);
    this.bucketLinkRight = this.makeHydraulicCylinder(scene, 0.028, this.mats.rod);

    this.bucketLoadGeometry = this.createBucketLoadGeometry();
    this.bucketLoadHeights = new Float32Array((this.bucketLoadSegmentsX + 1) * (this.bucketLoadSegmentsZ + 1));
    this.bucketLoadMesh = new THREE.Mesh(this.bucketLoadGeometry, this.mats.soil);
    this.bucketLoadMesh.visible = false;
    this.bucketLoadMesh.castShadow = true;
    this.bucketLoadMesh.receiveShadow = true;
    this.bucketGroup.add(this.bucketLoadMesh);
  }

  applyAngles(angles: ExcavatorAngles): void {
    this.upperGroup.rotation.y = angles.swing;
    this.boomGroup.rotation.z = angles.boom;
    this.stickGroup.rotation.z = angles.stick;
    this.bucketGroup.rotation.z = angles.bucket + Math.PI;
    this.group.updateMatrixWorld(true);
    this.updateCylinders();
  }

  setBucketLoad(load: number): void {
    const ratio = clamp(load / BUCKET_CAPACITY, 0, 1);
    if (Math.abs(ratio - this.bucketLoadRenderedRatio) < 0.001) {
      return;
    }
    this.bucketLoadRenderedRatio = ratio;
    this.bucketLoadMesh.visible = ratio > 0.02;
    if (ratio <= 0.02) {
      this.bucketLoadHeights.fill(0);
    } else {
      this.shapeBucketLoad(ratio);
    }
    this.commitBucketLoadSurface();
  }

  bucketLoadVisualRatio(): number {
    if (!this.bucketLoadMesh.visible) {
      return 0;
    }
    let total = 0;
    for (const height of this.bucketLoadHeights) {
      total += height;
    }
    return clamp(total / this.bucketLoadHeights.length / 0.42, 0, 1);
  }

  bucketTipWorld(): THREE.Vector3 {
    return this.bucketGroup.localToWorld(new THREE.Vector3(-BUCKET_LEN, -0.5, 0));
  }

  bucketCuttingEdgeWorld(): THREE.Vector3[] {
    return [-0.46, -0.23, 0, 0.23, 0.46].map((z) =>
      this.bucketGroup.localToWorld(new THREE.Vector3(-BUCKET_LEN, -0.5, z)),
    );
  }

  bucketPocketWorld(): THREE.Vector3 {
    return this.bucketGroup.localToWorld(new THREE.Vector3(-0.46, -0.28, 0));
  }

  bucketForwardWorld(): THREE.Vector3 {
    const origin = this.bucketGroup.localToWorld(new THREE.Vector3(0, 0, 0));
    const tip = this.bucketTipWorld();
    return tip.sub(origin).normalize();
  }

  bucketSidewaysWorld(): THREE.Vector3 {
    const origin = this.bucketGroup.localToWorld(new THREE.Vector3(0, 0, 0));
    return this.bucketGroup.localToWorld(new THREE.Vector3(0, 0, 1)).sub(origin).normalize();
  }

  bucketPinWorld(): THREE.Vector3 {
    return this.bucketGroup.localToWorld(new THREE.Vector3(0, 0, 0));
  }

  bucketLinkageDiagnostics(): {
    edgeWidth: number;
    pocketBehindEdge: number;
    tipBelowPocket: number;
    sideOrthogonality: number;
    cylinderLength: number;
    leftLinkLength: number;
    rightLinkLength: number;
  } {
    const edge = this.bucketCuttingEdgeWorld();
    const forward = this.bucketForwardWorld();
    const side = this.bucketSidewaysWorld();
    const tip = this.bucketTipWorld();
    const pocket = this.bucketPocketWorld();
    const left = this.bucketLinkageWorldPoints(-0.32);
    const right = this.bucketLinkageWorldPoints(0.32);
    const cylinder = this.bucketLinkageWorldPoints(-0.24);
    return {
      edgeWidth: edge[0].distanceTo(edge[edge.length - 1]),
      pocketBehindEdge: -pocket.clone().sub(tip).dot(forward),
      tipBelowPocket: pocket.y - tip.y,
      sideOrthogonality: Math.abs(forward.dot(side)),
      cylinderLength: cylinder.cylinderBase.distanceTo(cylinder.rockerInput),
      leftLinkLength: left.rockerOutput.distanceTo(left.bucketEar),
      rightLinkLength: right.rockerOutput.distanceTo(right.bucketEar),
    };
  }

  armCollisionSamples(): ArmCollisionSample[] {
    const samples: ArmCollisionSample[] = [];
    for (const t of [0.18, 0.38, 0.58, 0.78, 0.94]) {
      samples.push({
        action: "boom",
        point: this.boomGroup.localToWorld(new THREE.Vector3(BOOM_LEN * t, 0, 0)),
        radius: 0.24,
      });
    }
    for (const t of [0.16, 0.36, 0.58, 0.8, 0.96]) {
      samples.push({
        action: "stick",
        point: this.stickGroup.localToWorld(new THREE.Vector3(STICK_LEN * t, 0, 0)),
        radius: 0.2,
      });
    }
    samples.push(
      { action: "bucket", point: this.bucketPinWorld(), radius: 0.24 },
      { action: "bucket", point: this.bucketPocketWorld(), radius: 0.28 },
      ...this.bucketCuttingEdgeWorld().map((point) => ({ action: "bucket" as const, point, radius: 0.16 })),
    );
    return samples;
  }

  armSubsoilSamples(): ArmTerrainResistanceSample[] {
    const samples: ArmTerrainResistanceSample[] = [];
    for (const t of [0.18, 0.38, 0.58, 0.78, 0.94]) {
      samples.push({
        key: `boom-${t}`,
        action: "boom",
        point: this.boomGroup.localToWorld(new THREE.Vector3(BOOM_LEN * t, 0, 0)),
        radius: 0.22,
      });
    }
    for (const t of [0.16, 0.36, 0.58, 0.8, 0.96]) {
      samples.push({
        key: `stick-${t}`,
        action: "stick",
        point: this.stickGroup.localToWorld(new THREE.Vector3(STICK_LEN * t, 0, 0)),
        radius: 0.18,
      });
    }
    for (const z of [-0.28, 0, 0.28]) {
      samples.push({
        key: `bucket-shell-${z}`,
        action: "bucket",
        point: this.bucketGroup.localToWorld(new THREE.Vector3(-0.58, -0.2, z)),
        radius: 0.24,
      });
    }
    samples.push(
      { key: "bucket-pin", action: "bucket", point: this.bucketPinWorld(), radius: 0.2 },
      { key: "bucket-pocket", action: "bucket", point: this.bucketPocketWorld(), radius: 0.3 },
    );
    return samples;
  }

  stickPinWorld(): THREE.Vector3 {
    return this.stickGroup.localToWorld(new THREE.Vector3(0, 0, 0));
  }

  boomPinWorld(): THREE.Vector3 {
    return this.boomGroup.localToWorld(new THREE.Vector3(0, 0, 0));
  }

  cabCameraWorld(): THREE.Vector3 {
    return this.upperGroup.localToWorld(new THREE.Vector3(0.05, 1.16, -0.72));
  }

  cabLookWorld(): THREE.Vector3 {
    return this.upperGroup.localToWorld(new THREE.Vector3(5.5, 0.55, 0));
  }

  private createBucketLoadGeometry(): THREE.BufferGeometry {
    const positions: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];
    const minX = -1.02;
    const maxX = -0.18;
    const minZ = -0.43;
    const maxZ = 0.43;

    for (let iz = 0; iz <= this.bucketLoadSegmentsZ; iz += 1) {
      for (let ix = 0; ix <= this.bucketLoadSegmentsX; ix += 1) {
        const x = THREE.MathUtils.lerp(minX, maxX, ix / this.bucketLoadSegmentsX);
        const z = THREE.MathUtils.lerp(minZ, maxZ, iz / this.bucketLoadSegmentsZ);
        positions.push(x, this.bucketLoadBaseY(x, z), z);
        uvs.push(ix / this.bucketLoadSegmentsX, iz / this.bucketLoadSegmentsZ);
      }
    }

    for (let iz = 0; iz < this.bucketLoadSegmentsZ; iz += 1) {
      for (let ix = 0; ix < this.bucketLoadSegmentsX; ix += 1) {
        const a = this.bucketLoadIndex(ix, iz);
        const b = this.bucketLoadIndex(ix + 1, iz);
        const c = this.bucketLoadIndex(ix, iz + 1);
        const d = this.bucketLoadIndex(ix + 1, iz + 1);
        indices.push(a, c, b, b, c, d);
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setIndex(indices);
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
    geometry.computeVertexNormals();
    (geometry.attributes.position as THREE.BufferAttribute).setUsage(THREE.DynamicDrawUsage);
    (geometry.attributes.normal as THREE.BufferAttribute).setUsage(THREE.DynamicDrawUsage);
    return geometry;
  }

  private shapeBucketLoad(ratio: number): void {
    const minX = -1.02;
    const maxX = -0.18;
    const minZ = -0.43;
    const maxZ = 0.43;
    for (let iz = 0; iz <= this.bucketLoadSegmentsZ; iz += 1) {
      for (let ix = 0; ix <= this.bucketLoadSegmentsX; ix += 1) {
        const x = THREE.MathUtils.lerp(minX, maxX, ix / this.bucketLoadSegmentsX);
        const z = THREE.MathUtils.lerp(minZ, maxZ, iz / this.bucketLoadSegmentsZ);
        const nx = (x - minX) / (maxX - minX);
        const nz = Math.abs(z) / Math.max(Math.abs(minZ), Math.abs(maxZ));
        const pocketMound = Math.exp(-((x + 0.48) ** 2 / 0.18 + z ** 2 / 0.22));
        const retainedTowardBack = 0.58 + nx * 0.32;
        const sideLoss = nz ** 2 * 0.16;
        const ripple = (hash2(ix * 17 + iz * 5, Math.round(ratio * 100)) - 0.5) * 0.025;
        const height = clamp(
          ratio * (0.16 + ratio * 0.3) * retainedTowardBack + pocketMound * ratio * 0.18 + ripple - sideLoss * ratio,
          0.015,
          0.54,
        );
        this.bucketLoadHeights[this.bucketLoadIndex(ix, iz)] = height;
      }
    }
    this.relaxBucketLoad(2);
  }

  private relaxBucketLoad(passes: number): void {
    const maxDelta = 0.095;
    for (let pass = 0; pass < passes; pass += 1) {
      for (let iz = 0; iz < this.bucketLoadSegmentsZ; iz += 1) {
        for (let ix = 0; ix < this.bucketLoadSegmentsX; ix += 1) {
          this.transferBucketLoadIfTooSteep(this.bucketLoadIndex(ix, iz), this.bucketLoadIndex(ix + 1, iz), maxDelta);
          this.transferBucketLoadIfTooSteep(this.bucketLoadIndex(ix, iz), this.bucketLoadIndex(ix, iz + 1), maxDelta);
        }
      }
    }
  }

  private transferBucketLoadIfTooSteep(a: number, b: number, maxDelta: number): void {
    const diff = this.bucketLoadHeights[a] - this.bucketLoadHeights[b];
    const excess = Math.abs(diff) - maxDelta;
    if (excess <= 0) {
      return;
    }
    const transfer = excess * 0.2;
    if (diff > 0) {
      this.bucketLoadHeights[a] -= transfer;
      this.bucketLoadHeights[b] += transfer;
    } else {
      this.bucketLoadHeights[a] += transfer;
      this.bucketLoadHeights[b] -= transfer;
    }
  }

  private commitBucketLoadSurface(): void {
    const position = this.bucketLoadGeometry.attributes.position as THREE.BufferAttribute;
    const minX = -1.02;
    const maxX = -0.18;
    const minZ = -0.43;
    const maxZ = 0.43;
    for (let iz = 0; iz <= this.bucketLoadSegmentsZ; iz += 1) {
      for (let ix = 0; ix <= this.bucketLoadSegmentsX; ix += 1) {
        const idx = this.bucketLoadIndex(ix, iz);
        const x = THREE.MathUtils.lerp(minX, maxX, ix / this.bucketLoadSegmentsX);
        const z = THREE.MathUtils.lerp(minZ, maxZ, iz / this.bucketLoadSegmentsZ);
        position.setY(idx, this.bucketLoadBaseY(x, z) + this.bucketLoadHeights[idx]);
      }
    }
    position.needsUpdate = true;
    this.bucketLoadGeometry.computeVertexNormals();
    this.bucketLoadGeometry.attributes.normal.needsUpdate = true;
  }

  private bucketLoadBaseY(x: number, z: number): number {
    const nx = clamp((x + 1.02) / 0.84, 0, 1);
    const sideLift = (Math.abs(z) / 0.43) ** 2 * 0.025;
    return -0.48 + nx * 0.14 + sideLift;
  }

  private bucketLoadIndex(ix: number, iz: number): number {
    return iz * (this.bucketLoadSegmentsX + 1) + ix;
  }

  private buildLower(): void {
    const trackMat = this.mats.dark;
    const padMat = makeMat(0x111412, 0.82, 0.24);
    this.group.add(makeBox([3.2, 0.28, 1.95], trackMat, [0, 0.36, 0]));
    this.group.add(makeBox([3.75, 0.52, 0.52], trackMat, [0, 0.28, -0.72]));
    this.group.add(makeBox([3.75, 0.52, 0.52], trackMat, [0, 0.28, 0.72]));

    for (let i = 0; i < 14; i += 1) {
      const x = -1.7 + i * 0.26;
      this.group.add(makeBox([0.18, 0.06, 0.6], padMat, [x, 0.58, -0.72]));
      this.group.add(makeBox([0.18, 0.06, 0.6], padMat, [x, 0.58, 0.72]));
    }

    const turntable = new THREE.Mesh(new THREE.CylinderGeometry(1.02, 1.02, 0.24, 40), this.mats.dark);
    turntable.position.y = 0.74;
    turntable.castShadow = true;
    turntable.receiveShadow = true;
    this.group.add(turntable);

    this.upperGroup.position.y = 0.86;
    this.group.add(this.upperGroup);
  }

  private buildUpper(): void {
    this.upperGroup.add(makeBox([2.45, 0.74, 1.3], this.mats.yellow, [-0.24, 0.3, 0]));
    this.upperGroup.add(makeBox([0.9, 0.82, 1.22], this.mats.dark, [-1.0, 0.38, 0]));
    this.upperGroup.add(makeBox([0.84, 0.9, 0.72], this.mats.glass, [0.54, 0.62, -0.46]));
    this.upperGroup.add(makeBox([0.96, 0.16, 0.82], this.mats.dark, [0.55, 1.13, -0.46]));

    const exhaust = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.62, 16), this.mats.dark);
    exhaust.position.set(-1.1, 0.96, 0.47);
    exhaust.castShadow = true;
    this.upperGroup.add(exhaust);
  }

  private buildArm(): void {
    this.boomPivot.position.set(0.8, 0.7, 0);
    this.upperGroup.add(this.boomPivot);
    this.boomPivot.add(this.boomGroup);

    const boom = makeBox([BOOM_LEN, 0.28, 0.34], this.mats.yellow, [BOOM_LEN / 2, 0, 0]);
    boom.rotation.x = 0.02;
    this.boomGroup.add(boom);
    this.addPin(this.boomGroup, [0, 0, 0], 0.22);
    this.addPin(this.boomGroup, [BOOM_LEN, 0, 0], 0.2);

    this.stickGroup.position.set(BOOM_LEN, 0, 0);
    this.boomGroup.add(this.stickGroup);
    const stick = makeBox([STICK_LEN, 0.22, 0.28], this.mats.yellow, [STICK_LEN / 2, 0, 0]);
    this.stickGroup.add(stick);
    this.addPin(this.stickGroup, [0, 0, 0], 0.18);
    this.addPin(this.stickGroup, [STICK_LEN, 0, 0], 0.17);
    this.addPin(this.stickGroup, [STICK_LEN - 0.36, 0.24, 0], 0.13);

    this.bucketGroup.position.set(STICK_LEN, 0, 0);
    this.stickGroup.add(this.bucketGroup);
    this.buildBucket();
  }

  private buildBucket(): void {
    const bucketMat = this.mats.dark.clone();
    bucketMat.side = THREE.DoubleSide;
    const wearMat = makeMat(0x111412, 0.82, 0.32);
    const sideA = this.makeBucketSide(-0.54, bucketMat);
    const sideB = this.makeBucketSide(0.54, bucketMat);
    const shell = this.makeBucketShell(bucketMat);
    const back = makeBox([0.18, 0.74, 1.08], bucketMat, [0.2, -0.18, 0]);
    back.rotation.z = -0.18;
    const floor = makeBox([1.1, 0.12, 1.02], bucketMat, [-0.56, -0.5, 0]);
    floor.rotation.z = 0.18;
    const lip = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 1.12, 16), wearMat);
    lip.rotation.x = Math.PI / 2;
    lip.position.set(-1.17, -0.52, 0);
    lip.castShadow = true;
    const cuttingBar = makeBox([0.18, 0.08, 1.12], wearMat, [-1.2, -0.5, 0]);
    cuttingBar.rotation.z = 0.14;
    this.bucketGroup.add(shell, back, floor, sideA, sideB, lip, cuttingBar);
    this.addPin(this.bucketGroup, [-0.18, -0.18, 0], 0.11);

    for (const z of [-0.36, -0.12, 0.12, 0.36]) {
      const tooth = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.36, 4), wearMat);
      tooth.rotation.z = Math.PI / 2;
      tooth.rotation.y = Math.PI / 4;
      tooth.position.set(-1.32, -0.54, z);
      tooth.castShadow = true;
      this.bucketGroup.add(tooth);
    }
  }

  private makeBucketShell(material: THREE.Material): THREE.Mesh {
    const profile = [
      [0.14, 0.04],
      [0.0, -0.22],
      [-0.32, -0.43],
      [-0.74, -0.54],
      [-1.1, -0.5],
      [-1.24, -0.4],
    ] as const;
    const zValues = [-0.48, -0.3, -0.12, 0.12, 0.3, 0.48];
    const positions: number[] = [];
    const indices: number[] = [];

    for (let iz = 0; iz < zValues.length; iz += 1) {
      const z = zValues[iz];
      const sideT = Math.abs(z) / 0.48;
      for (const [x, y] of profile) {
        positions.push(x, y + sideT * sideT * 0.035, z);
      }
    }

    const row = profile.length;
    for (let iz = 0; iz < zValues.length - 1; iz += 1) {
      for (let ix = 0; ix < profile.length - 1; ix += 1) {
        const a = iz * row + ix;
        const b = a + 1;
        const c = (iz + 1) * row + ix;
        const d = c + 1;
        indices.push(a, c, b, b, c, d);
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setIndex(indices);
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.computeVertexNormals();
    const shell = new THREE.Mesh(geometry, material);
    shell.castShadow = true;
    shell.receiveShadow = true;
    return shell;
  }

  private makeBucketSide(z: number, material: THREE.Material): THREE.Mesh {
    const vertices = new Float32Array([
      0.05, 0.18, z,
      0.22, -0.52, z,
      -1.12, -0.58, z,
      -1.22, -0.38, z,
      -0.76, 0.02, z,
    ]);
    const indices = z < 0 ? [0, 1, 4, 1, 2, 4, 2, 3, 4] : [0, 4, 1, 1, 4, 2, 2, 4, 3];
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    const side = new THREE.Mesh(geometry, material);
    side.castShadow = true;
    side.receiveShadow = true;
    return side;
  }

  private addPin(parent: THREE.Group, pos: [number, number, number], radius: number): void {
    const pin = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, 0.54, 24), this.mats.hydraulic);
    pin.rotation.x = Math.PI / 2;
    pin.position.set(pos[0], pos[1], pos[2]);
    pin.castShadow = true;
    parent.add(pin);
  }

  private makeHydraulicCylinder(scene: THREE.Scene, radius: number, material: THREE.Material): THREE.Mesh {
    const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, 1, 18), material);
    cylinder.castShadow = true;
    scene.add(cylinder);
    return cylinder;
  }

  private bucketLinkageWorldPoints(z: number): {
    cylinderBase: THREE.Vector3;
    rockerInput: THREE.Vector3;
    rockerOutput: THREE.Vector3;
    bucketEar: THREE.Vector3;
  } {
    const bucketAngle = this.bucketGroup.rotation.z - Math.PI;
    const rockerAngle = -0.62 - bucketAngle * 0.62;
    const pivot = new THREE.Vector3(STICK_LEN - 0.36, 0.24, z);
    const input = pivot.clone().add(new THREE.Vector3(Math.cos(rockerAngle) * 0.36, Math.sin(rockerAngle) * 0.36, 0));
    const output = pivot.clone().add(new THREE.Vector3(Math.cos(rockerAngle + 2.32) * 0.36, Math.sin(rockerAngle + 2.32) * 0.36, 0));
    return {
      cylinderBase: this.stickGroup.localToWorld(new THREE.Vector3(STICK_LEN - 1.08, 0.58, z)),
      rockerInput: this.stickGroup.localToWorld(input),
      rockerOutput: this.stickGroup.localToWorld(output),
      bucketEar: this.bucketGroup.localToWorld(new THREE.Vector3(-0.18, -0.18, z)),
    };
  }

  private updateCylinders(): void {
    const boomStart = this.upperGroup.localToWorld(new THREE.Vector3(0.26, 0.35, -0.28));
    const boomEnd = this.boomGroup.localToWorld(new THREE.Vector3(1.65, -0.14, -0.28));
    const stickStart = this.boomGroup.localToWorld(new THREE.Vector3(2.55, 0.12, 0.27));
    const stickEnd = this.stickGroup.localToWorld(new THREE.Vector3(1.55, -0.1, 0.27));
    const bucketCenter = this.bucketLinkageWorldPoints(-0.24);
    const bucketLeft = this.bucketLinkageWorldPoints(-0.32);
    const bucketRight = this.bucketLinkageWorldPoints(0.32);
    setCylinderBetween(this.boomCylinder, boomStart, boomEnd);
    setCylinderBetween(this.stickCylinder, stickStart, stickEnd);
    setCylinderBetween(this.bucketCylinder, bucketCenter.cylinderBase, bucketCenter.rockerInput);
    setCylinderBetween(this.bucketRockerLeft, bucketLeft.rockerInput, bucketLeft.rockerOutput);
    setCylinderBetween(this.bucketRockerRight, bucketRight.rockerInput, bucketRight.rockerOutput);
    setCylinderBetween(this.bucketLinkLeft, bucketLeft.rockerOutput, bucketLeft.bucketEar);
    setCylinderBetween(this.bucketLinkRight, bucketRight.rockerOutput, bucketRight.bucketEar);
  }
}

class Simulator {
  private readonly canvas = byId<HTMLCanvasElement>("sim-canvas");
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(58, 1, 0.05, 140);
  private readonly clock = new THREE.Clock();
  private readonly terrain: HeightfieldTerrain;
  private readonly excavator: ExcavatorModel;
  private readonly truck: WorkTruck;
  private readonly ui: UiRefs;
  private readonly keys = new Set<string>();
  private readonly touchAxes: JoystickAxes = { leftX: 0, leftY: 0, rightX: 0, rightY: 0, leftTrack: 0, rightTrack: 0 };
  private readonly activeMobileJoysticks = new Map<number, ActiveMobileJoystick>();
  private readonly pressedDriveControls = new Set<MobileDriveMode>();
  private readonly activeDrivePointers = new Map<number, MobileDriveMode>();
  private readonly canvasPointers = new Map<number, { x: number; y: number }>();
  private readonly soilParticles: SoilParticle[] = [];
  private readonly worldColliders: WorldCollider[] = [];
  private readonly carriedWorldColliders = new Map<WorldCollider, THREE.Vector3>();
  private readonly carriedWorldPreviousPositions = new Map<WorldCollider, THREE.Vector3>();
  private readonly looseSoilMats = [
    makeMat(0x6d4c2c, 0.95, 0.02),
    makeMat(0x855f36, 0.94, 0.02),
    makeMat(0x5a4734, 0.96, 0.02),
  ];
  private readonly pooledSoilGeometry = new THREE.DodecahedronGeometry(1, 0);
  private readonly soilParticlePool: THREE.Mesh[] = [];
  private readonly soilParticlePoolLimit = 170;
  private readonly fineGrainMax = 300;
  private readonly fineGrainPositions = new Float32Array(this.fineGrainMax * 3);
  private readonly fineGrainVelocities = new Float32Array(this.fineGrainMax * 3);
  private readonly fineGrainLife = new Float32Array(this.fineGrainMax);
  private readonly fineGrainMaxLife = new Float32Array(this.fineGrainMax);
  private readonly fineGrainVolumes = new Float32Array(this.fineGrainMax);
  private readonly fineGrainSettles = new Uint8Array(this.fineGrainMax);
  private readonly fineGrainGeometry = new THREE.BufferGeometry();
  private readonly fineGrainMaterial = new THREE.PointsMaterial({
    color: 0x9a7043,
    size: 0.032,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.78,
    depthWrite: false,
  });
  private readonly fineGrainCloud = new THREE.Points(this.fineGrainGeometry, this.fineGrainMaterial);
  private readonly targetActions: Actions = { swing: 0, boom: 0, stick: 0, bucket: 0 };
  private readonly velocities: ExcavatorVelocities = { swing: 0, boom: 0, stick: 0, bucket: 0 };
  private readonly angles: ExcavatorAngles = { ...initialAngles };
  private readonly orbit = { azimuth: -0.95, elevation: 0.48, distance: 9.0, dragging: false, lastX: 0, lastY: 0 };
  private readonly cameraLookTarget = new THREE.Vector3(0.8, 1.1, 0);
  private readonly previousBucketTip = new THREE.Vector3();
  private pinchDistance = 0;
  private cameraMode: CameraMode = "orbit";
  private activeMobileMenu: string | null = null;
  private pattern: Pattern = "ISO";
  private responseMode: ResponseMode = "medium";
  private elapsed = 0;
  private truckLoad = 0;
  private bucketLoad = 0;
  private bucketTransitLoad = 0;
  private totalExcavated = 0;
  private limitImpacts = 0;
  private safetyViolations = 0;
  private limitCooldown = 0;
  private safetyCooldown = 0;
  private collisionCooldown = 0;
  private idleSeconds = 0;
  private pressure = 0;
  private stability = 1;
  private leftTrackVelocity = 0;
  private rightTrackVelocity = 0;
  private travelDistance = 0;
  private trackSoilWork = 0;
  private soilSettleAccumulator = 0;
  private chassisSinkage = 0;
  private chassisPitch = 0;
  private chassisRoll = 0;
  private supportHeight = 0;
  private collisionCount = 0;
  private fineGrainCursor = 0;
  private fineGrainSettledVolume = 0;
  private fpsAccumulator = 0;
  private fpsFrames = 0;
  private fps = 0;
  private lastWarning = "";

  constructor() {
    this.ui = this.readUi();
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: "high-performance",
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.scene.background = new THREE.Color(0x9fb4b6);
    this.scene.fog = new THREE.Fog(0x9fb4b6, 34, 118);

    this.buildFineGrainCloud();
    this.buildWorld();
    this.terrain = new HeightfieldTerrain(this.scene);
    this.truck = new WorkTruck(this.scene);
    this.truck.reset(this.terrain);
    this.excavator = new ExcavatorModel(this.scene);
    this.excavator.applyAngles(this.angles);
    this.supportHeight = this.terrain.getHeightAt(0, 0);
    this.excavator.group.position.y = this.supportHeight;
    this.previousBucketTip.copy(this.excavator.bucketTipWorld());
    this.buildWorksiteMarkers();
    this.scatterSoilDetails();
    this.bindEvents();
    this.resize();
    this.updatePatternLabels();
    this.updateCamera(1);
    this.updateUi(0);
    this.installDebugApi();
    this.renderer.setAnimationLoop(() => this.tick());
  }

  private buildFineGrainCloud(): void {
    for (let i = 0; i < this.fineGrainMax; i += 1) {
      this.fineGrainPositions[i * 3] = 0;
      this.fineGrainPositions[i * 3 + 1] = -999;
      this.fineGrainPositions[i * 3 + 2] = 0;
      this.fineGrainVolumes[i] = 0;
    }
    this.fineGrainGeometry.setAttribute("position", new THREE.BufferAttribute(this.fineGrainPositions, 3));
    (this.fineGrainGeometry.attributes.position as THREE.BufferAttribute).setUsage(THREE.DynamicDrawUsage);
    this.fineGrainCloud.frustumCulled = false;
    this.scene.add(this.fineGrainCloud);
  }

  reset(): void {
    this.terrain.reset();
    Object.assign(this.angles, initialAngles);
    Object.assign(this.velocities, { swing: 0, boom: 0, stick: 0, bucket: 0 });
    this.truckLoad = 0;
    this.bucketLoad = 0;
    this.bucketTransitLoad = 0;
    this.totalExcavated = 0;
    this.limitImpacts = 0;
    this.safetyViolations = 0;
    this.idleSeconds = 0;
    this.elapsed = 0;
    this.pressure = 0;
    this.stability = 1;
    this.collisionCooldown = 0;
    this.leftTrackVelocity = 0;
    this.rightTrackVelocity = 0;
    this.travelDistance = 0;
    this.trackSoilWork = 0;
    this.soilSettleAccumulator = 0;
    this.chassisSinkage = 0;
    this.chassisPitch = 0;
    this.chassisRoll = 0;
    this.supportHeight = this.terrain.getHeightAt(0, 0);
    this.collisionCount = 0;
    this.fineGrainSettledVolume = 0;
    this.resetWorldColliders();
    this.clearFineGrains();
    this.clearMobileInput();
    this.excavator.group.position.set(0, this.terrain.getHeightAt(0, 0), 0);
    this.excavator.group.rotation.set(0, 0, 0);
    this.truck.reset(this.terrain);
    for (const particle of this.soilParticles) {
      this.recycleSoilParticle(particle);
    }
    this.soilParticles.length = 0;
    this.excavator.setBucketLoad(0);
    this.excavator.applyAngles(this.angles);
    this.previousBucketTip.copy(this.excavator.bucketTipWorld());
  }

  private registerWorldCollider(
    mesh: THREE.Object3D,
    kind: WorldColliderKind,
    radius: number,
    options: Partial<Pick<WorldCollider, "mass" | "immovable" | "crushable" | "restitution" | "friction" | "groundOffset">> = {},
  ): WorldCollider {
    const collider: WorldCollider = {
      mesh,
      kind,
      radius,
      mass: options.mass ?? 1,
      immovable: options.immovable ?? false,
      crushable: options.crushable ?? false,
      restitution: options.restitution ?? 0.08,
      friction: options.friction ?? 0.82,
      groundOffset: options.groundOffset ?? radius * 0.45,
      velocity: new THREE.Vector3(),
      sleeping: !(options.immovable ?? false),
      initialPosition: mesh.position.clone(),
      initialQuaternion: mesh.quaternion.clone(),
      initialScale: mesh.scale.clone(),
    };
    this.worldColliders.push(collider);
    return collider;
  }

  private resetWorldColliders(): void {
    this.carriedWorldColliders.clear();
    this.carriedWorldPreviousPositions.clear();
    for (const collider of this.worldColliders) {
      collider.mesh.position.copy(collider.initialPosition);
      collider.mesh.quaternion.copy(collider.initialQuaternion);
      collider.mesh.scale.copy(collider.initialScale);
      collider.velocity.set(0, 0, 0);
      collider.sleeping = !collider.immovable;
      if (!collider.immovable) {
        const ground = this.terrain.getHeightAt(collider.mesh.position.x, collider.mesh.position.z);
        collider.mesh.position.y = ground + collider.groundOffset;
      }
    }
  }

  private clearMobileInput(): void {
    Object.assign(this.touchAxes, { leftX: 0, leftY: 0, rightX: 0, rightY: 0, leftTrack: 0, rightTrack: 0 });
    this.activeMobileJoysticks.clear();
    this.pressedDriveControls.clear();
    this.activeDrivePointers.clear();
    this.canvasPointers.clear();
    this.pinchDistance = 0;
    this.ui.mobileJoysticks.forEach((element) => {
      element.classList.remove("active");
      element.querySelector<HTMLElement>("[data-joystick-knob]")?.style.setProperty("transform", "translate(-50%, -50%)");
    });
    this.ui.mobileDriveButtons.forEach((button) => button.classList.remove("active"));
  }

  private readUi(): UiRefs {
    return {
      patternSelect: byId<HTMLSelectElement>("pattern-select"),
      responseSelect: byId<HTMLSelectElement>("response-select"),
      resetButton: byId<HTMLButtonElement>("reset-button"),
      cameraButtons: Array.from(document.querySelectorAll<HTMLButtonElement>("[data-camera]")),
      truckLoadText: byId("truck-load-text"),
      truckLoadBar: byId("truck-load-bar"),
      missionState: byId("mission-state"),
      pressureMeter: byId<HTMLMeterElement>("pressure-meter"),
      bucketMeter: byId<HTMLMeterElement>("bucket-meter"),
      stabilityMeter: byId<HTMLMeterElement>("stability-meter"),
      timeText: byId("time-text"),
      soilText: byId("soil-text"),
      limitText: byId("limit-text"),
      safetyText: byId("safety-text"),
      idleText: byId("idle-text"),
      travelText: byId("travel-text"),
      travelDirectionText: byId("travel-direction-text"),
      swingText: byId("swing-text"),
      boomText: byId("boom-text"),
      stickText: byId("stick-text"),
      bucketText: byId("bucket-text"),
      fpsText: byId("fps-text"),
      warningStrip: byId("warning-strip"),
      leftStickLabelY: byId("left-stick-label-y"),
      leftStickLabelX: byId("left-stick-label-x"),
      rightStickLabelY: byId("right-stick-label-y"),
      rightStickLabelX: byId("right-stick-label-x"),
      keyCaps: Array.from(document.querySelectorAll<HTMLElement>("kbd[data-key]")),
      mobileControls: byId("mobile-controls"),
      mobileJoysticks: Array.from(document.querySelectorAll<HTMLElement>("[data-joystick]")),
      mobileDriveButtons: Array.from(document.querySelectorAll<HTMLButtonElement>("[data-drive]")),
      mobileMenuPanel: byId("mobile-menu-panel"),
      mobileMenuButtons: Array.from(document.querySelectorAll<HTMLButtonElement>("[data-mobile-menu]")),
      mobileMenuSections: Array.from(document.querySelectorAll<HTMLElement>("[data-mobile-panel]")),
      mobileResetButtons: Array.from(document.querySelectorAll<HTMLButtonElement>("[data-mobile-reset]")),
    };
  }

  private buildWorld(): void {
    const hemi = new THREE.HemisphereLight(0xeef7ff, 0x423723, 1.35);
    this.scene.add(hemi);

    const sun = new THREE.DirectionalLight(0xfff1ca, 3.2);
    sun.position.set(-8, 13, 7);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 72;
    sun.shadow.camera.left = -30;
    sun.shadow.camera.right = 30;
    sun.shadow.camera.top = 30;
    sun.shadow.camera.bottom = -30;
    this.scene.add(sun);

    const yardMat = makeMat(0x3d453d, 0.86, 0.03);
    for (let i = 0; i < 22; i += 1) {
      const post = makeBox([0.08, 0.92, 0.08], yardMat, [-10.5 + i, 0.46, -8.4]);
      this.scene.add(post);
      this.registerWorldCollider(post, "fence", 0.22, { mass: 2.4, restitution: 0.05, friction: 0.88, groundOffset: 0.46 });
    }
    for (let i = 0; i < 21; i += 1) {
      const rail = makeBox([0.92, 0.08, 0.08], yardMat, [-10 + i, 0.86, -8.4]);
      this.scene.add(rail);
      this.registerWorldCollider(rail, "fence", 0.48, { mass: 3.2, restitution: 0.04, friction: 0.9, groundOffset: 0.86 });
    }
  }

  private buildWorksiteMarkers(): void {
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xf1ad34, transparent: true, opacity: 0.5, side: THREE.DoubleSide });
    const digRing = new THREE.Mesh(new THREE.RingGeometry(1.55, 1.62, 72), ringMat);
    digRing.rotation.x = -Math.PI / 2;
    digRing.position.set(DIG_SITE.x, 0.04, DIG_SITE.z);
    this.scene.add(digRing);

    const safeMat = new THREE.MeshBasicMaterial({ color: 0xdb553f, transparent: true, opacity: 0.2, side: THREE.DoubleSide });
    const safeRing = new THREE.Mesh(new THREE.CircleGeometry(1.08, 48), safeMat);
    safeRing.rotation.x = -Math.PI / 2;
    safeRing.position.set(WORKER_ZONE.x, 0.05, WORKER_ZONE.z);
    this.scene.add(safeRing);

    const coneMat = makeMat(0xe2602d, 0.65, 0.04);
    for (const offset of [
      [-0.95, -0.95],
      [0.95, -0.95],
      [-0.95, 0.95],
      [0.95, 0.95],
    ] as const) {
      const cone = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.46, 18), coneMat);
      cone.position.set(WORKER_ZONE.x + offset[0], 0.24, WORKER_ZONE.z + offset[1]);
      cone.castShadow = true;
      this.scene.add(cone);
      this.registerWorldCollider(cone, "cone", 0.18, { mass: 0.35, restitution: 0.18, friction: 0.9, groundOffset: 0.23 });
    }
  }

  private scatterSoilDetails(): void {
    const rockMat = makeMat(0x4f4638, 0.88, 0.08);
    const dryClodMat = makeMat(0x8a6238, 0.96, 0.02);
    const twigMat = makeMat(0x2f281f, 0.8, 0.06);

    for (let i = 0; i < 330; i += 1) {
      const aroundDig = i < 92;
      const farField = i > 210;
      const radius = aroundDig ? 0.85 + Math.random() * 4.25 : farField ? 18.0 + Math.random() * 25.0 : 4.0 + Math.random() * 21.0;
      const angle = Math.random() * Math.PI * 2;
      const x = (aroundDig ? DIG_SITE.x : 0) + Math.cos(angle) * radius;
      const z = (aroundDig ? DIG_SITE.z : 0) + Math.sin(angle) * radius;
      if (Math.hypot(x - TRUCK_CENTER.x, z - TRUCK_CENTER.z) < 2.6 || Math.hypot(x, z) < 2.35) {
        continue;
      }

      const isRock = Math.random() > 0.72;
      const detailRadius = isRock ? 0.025 + Math.random() * 0.065 : 0.018 + Math.random() * 0.075;
      const geometry = isRock
        ? new THREE.IcosahedronGeometry(detailRadius, 0)
        : new THREE.DodecahedronGeometry(detailRadius, 0);
      const mesh = new THREE.Mesh(geometry, isRock ? rockMat : dryClodMat);
      mesh.position.set(x, this.terrain.getHeightAt(x, z) + 0.035, z);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      mesh.scale.y = 0.45 + Math.random() * 0.55;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.scene.add(mesh);
      this.registerWorldCollider(mesh, isRock ? "rock" : "clod", Math.max(0.055, detailRadius * 1.2), {
        mass: isRock ? 2.6 + detailRadius * 18 : 0.25 + detailRadius * 4.5,
        crushable: !isRock,
        restitution: isRock ? 0.14 : 0.04,
        friction: isRock ? 0.7 : 0.94,
        groundOffset: 0.035,
      });
    }

    const boulderMat = makeMat(0x5b5348, 0.9, 0.06);
    const boulders = [
      [-11.2, -2.8, 0.34],
      [-7.8, 7.2, 0.25],
      [5.8, 5.7, 0.3],
      [11.4, -5.4, 0.28],
      [-13.3, 11.1, 0.32],
      [13.1, 8.6, 0.24],
      [-21.5, -12.6, 0.36],
      [22.4, -14.8, 0.31],
      [-19.2, 18.6, 0.29],
      [18.6, 17.2, 0.34],
      [-35.5, -27.4, 0.42],
      [35.8, -25.2, 0.36],
      [-32.6, 29.5, 0.38],
      [30.4, 28.8, 0.33],
      [39.2, 4.8, 0.3],
      [-41.0, 7.4, 0.28],
    ] as const;
    for (const [x, z, radius] of boulders) {
      const boulder = new THREE.Mesh(new THREE.IcosahedronGeometry(radius, 1), boulderMat);
      boulder.position.set(x, this.terrain.getHeightAt(x, z) + radius * 0.58, z);
      boulder.scale.set(1.12, 0.68 + Math.random() * 0.2, 0.86 + Math.random() * 0.24);
      boulder.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      boulder.castShadow = true;
      boulder.receiveShadow = true;
      this.scene.add(boulder);
      this.registerWorldCollider(boulder, "boulder", radius * 1.05, {
        mass: 5.8 + radius * 12,
        restitution: 0.08,
        friction: 0.88,
        groundOffset: radius * 0.58,
      });
    }

    for (let i = 0; i < 16; i += 1) {
      const x = DIG_SITE.x + (Math.random() - 0.5) * 8.5;
      const z = DIG_SITE.z + (Math.random() - 0.5) * 5.5;
      const twig = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.018, 0.45 + Math.random() * 0.42, 7), twigMat);
      twig.position.set(x, this.terrain.getHeightAt(x, z) + 0.035, z);
      twig.rotation.set(Math.PI / 2 + (Math.random() - 0.5) * 0.35, Math.random() * Math.PI, Math.random() * Math.PI);
      twig.castShadow = true;
      this.scene.add(twig);
      this.registerWorldCollider(twig, "twig", 0.06, { mass: 0.12, crushable: true, restitution: 0.02, friction: 0.96, groundOffset: 0.035 });
    }
  }

  private bindEvents(): void {
    window.addEventListener("resize", () => this.resize());
    window.addEventListener("keydown", (event) => {
      if (this.isSimKey(event.code)) {
        event.preventDefault();
        this.keys.add(event.code);
      }
    });
    window.addEventListener("keyup", (event) => {
      if (this.isSimKey(event.code)) {
        event.preventDefault();
        this.keys.delete(event.code);
      }
    });

    this.ui.patternSelect.addEventListener("change", () => {
      this.pattern = this.ui.patternSelect.value as Pattern;
      this.updatePatternLabels();
    });
    this.ui.responseSelect.addEventListener("change", () => {
      this.responseMode = this.ui.responseSelect.value as ResponseMode;
    });
    this.ui.resetButton.addEventListener("click", () => this.reset());
    this.ui.mobileResetButtons.forEach((button) => button.addEventListener("click", () => this.reset()));
    this.ui.cameraButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this.cameraMode = button.dataset.camera as CameraMode;
        this.ui.cameraButtons.forEach((candidate) => candidate.classList.toggle("active", candidate.dataset.camera === this.cameraMode));
      });
    });

    this.canvas.addEventListener("pointerdown", (event) => this.handleCanvasPointerDown(event));
    this.canvas.addEventListener("pointermove", (event) => this.handleCanvasPointerMove(event));
    this.canvas.addEventListener("pointerup", (event) => this.handleCanvasPointerEnd(event));
    this.canvas.addEventListener("pointercancel", (event) => this.handleCanvasPointerEnd(event));
    this.canvas.addEventListener(
      "wheel",
      (event) => {
        if (this.cameraMode !== "orbit" && this.cameraMode !== "task") {
          return;
        }
        event.preventDefault();
        this.orbit.distance = clamp(this.orbit.distance + event.deltaY * 0.01, 5.0, 26.5);
      },
      { passive: false },
    );
    this.bindMobileControls();
  }

  private bindMobileControls(): void {
    this.ui.mobileJoysticks.forEach((element) => {
      const side = element.dataset.joystick as MobileJoystickSide | undefined;
      const knob = element.querySelector<HTMLElement>("[data-joystick-knob]");
      if (!side || !knob) {
        return;
      }
      element.addEventListener("pointerdown", (event) => this.handleMobileJoystickDown(event, side, element, knob));
    });

    this.ui.mobileDriveButtons.forEach((button) => {
      const mode = button.dataset.drive as MobileDriveMode | undefined;
      if (!mode) {
        return;
      }
      button.addEventListener("pointerdown", (event) => this.handleDrivePointerDown(event, mode, button));
    });

    this.ui.mobileMenuButtons.forEach((button) => {
      const menu = button.dataset.mobileMenu;
      if (!menu) {
        return;
      }
      button.addEventListener("click", (event) => {
        event.preventDefault();
        this.toggleMobileMenu(menu);
      });
    });

    window.addEventListener("pointermove", (event) => this.handleMobilePointerMove(event));
    window.addEventListener("pointerup", (event) => this.handleMobilePointerEnd(event));
    window.addEventListener("pointercancel", (event) => this.handleMobilePointerEnd(event));
  }

  private toggleMobileMenu(menu: string): void {
    this.activeMobileMenu = this.activeMobileMenu === menu ? null : menu;
    this.ui.mobileMenuPanel.classList.toggle("hidden", this.activeMobileMenu === null);
    this.ui.mobileMenuButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.mobileMenu === this.activeMobileMenu);
    });
    this.ui.mobileMenuSections.forEach((section) => {
      section.classList.toggle("hidden", section.dataset.mobilePanel !== this.activeMobileMenu);
    });
  }

  private handleCanvasPointerDown(event: PointerEvent): void {
    if (this.cameraMode !== "orbit" && this.cameraMode !== "task") {
      return;
    }
    event.preventDefault();
    this.canvasPointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    this.orbit.dragging = true;
    this.orbit.lastX = event.clientX;
    this.orbit.lastY = event.clientY;
    if (this.canvasPointers.size >= 2) {
      this.pinchDistance = this.currentPinchDistance();
    }
    try {
      this.canvas.setPointerCapture(event.pointerId);
    } catch {
      // Synthetic test events and some browsers may not allow pointer capture.
    }
  }

  private handleCanvasPointerMove(event: PointerEvent): void {
    if (!this.canvasPointers.has(event.pointerId) || (this.cameraMode !== "orbit" && this.cameraMode !== "task")) {
      return;
    }
    event.preventDefault();
    this.canvasPointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (this.canvasPointers.size >= 2) {
      const nextPinchDistance = this.currentPinchDistance();
      if (this.pinchDistance > 0 && nextPinchDistance > 0) {
        this.orbit.distance = clamp(this.orbit.distance + (this.pinchDistance - nextPinchDistance) * 0.018, 5.0, 26.5);
      }
      this.pinchDistance = nextPinchDistance;
      return;
    }

    if (!this.orbit.dragging) {
      return;
    }
    const dx = event.clientX - this.orbit.lastX;
    const dy = event.clientY - this.orbit.lastY;
    this.orbit.lastX = event.clientX;
    this.orbit.lastY = event.clientY;
    this.orbit.azimuth -= dx * 0.006;
    this.orbit.elevation = clamp(this.orbit.elevation + dy * 0.004, 0.18, 1.12);
  }

  private handleCanvasPointerEnd(event: PointerEvent): void {
    this.canvasPointers.delete(event.pointerId);
    this.orbit.dragging = this.canvasPointers.size > 0;
    this.pinchDistance = this.canvasPointers.size >= 2 ? this.currentPinchDistance() : 0;
    try {
      this.canvas.releasePointerCapture(event.pointerId);
    } catch {
      // Pointer capture may not have been established.
    }
  }

  private currentPinchDistance(): number {
    const points = Array.from(this.canvasPointers.values());
    if (points.length < 2) {
      return 0;
    }
    return Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
  }

  private handleMobileJoystickDown(
    event: PointerEvent,
    side: MobileJoystickSide,
    element: HTMLElement,
    knob: HTMLElement,
  ): void {
    event.preventDefault();
    const pad = element.querySelector<HTMLElement>(".mobile-stick-pad") ?? element;
    const rect = pad.getBoundingClientRect();
    const radius = Math.max(32, Math.min(rect.width, rect.height) * 0.36);
    const active: ActiveMobileJoystick = {
      side,
      element,
      knob,
      centerX: rect.left + rect.width * 0.5,
      centerY: rect.top + rect.height * 0.5,
      radius,
    };
    this.activeMobileJoysticks.set(event.pointerId, active);
    element.classList.add("active");
    try {
      element.setPointerCapture(event.pointerId);
    } catch {
      // Synthetic test events and some mobile browsers may skip pointer capture.
    }
    this.updateMobileJoystickAxis(event.pointerId, event.clientX, event.clientY);
  }

  private handleMobilePointerMove(event: PointerEvent): void {
    if (this.activeMobileJoysticks.has(event.pointerId)) {
      event.preventDefault();
      this.updateMobileJoystickAxis(event.pointerId, event.clientX, event.clientY);
    }
  }

  private handleMobilePointerEnd(event: PointerEvent): void {
    const joystick = this.activeMobileJoysticks.get(event.pointerId);
    if (joystick) {
      this.activeMobileJoysticks.delete(event.pointerId);
      this.setMobileJoystickAxis(joystick.side, 0, 0);
      joystick.knob.style.transform = "translate(-50%, -50%)";
      joystick.element.classList.remove("active");
      try {
        joystick.element.releasePointerCapture(event.pointerId);
      } catch {
        // Pointer capture may not have been established.
      }
    }

    const driveMode = this.activeDrivePointers.get(event.pointerId);
    if (driveMode) {
      this.activeDrivePointers.delete(event.pointerId);
      this.pressedDriveControls.delete(driveMode);
      this.ui.mobileDriveButtons
        .filter((button) => button.dataset.drive === driveMode)
        .forEach((button) => button.classList.remove("active"));
      this.updateMobileTrackAxes();
    }
  }

  private updateMobileJoystickAxis(pointerId: number, clientX: number, clientY: number): void {
    const joystick = this.activeMobileJoysticks.get(pointerId);
    if (!joystick) {
      return;
    }
    const dx = clientX - joystick.centerX;
    const dy = clientY - joystick.centerY;
    const distance = Math.hypot(dx, dy);
    const limited = Math.min(distance, joystick.radius);
    const angle = distance > 0.001 ? Math.atan2(dy, dx) : 0;
    const knobX = Math.cos(angle) * limited;
    const knobY = Math.sin(angle) * limited;
    const axisX = clamp(knobX / joystick.radius, -1, 1);
    const axisY = clamp(-knobY / joystick.radius, -1, 1);
    joystick.knob.style.transform = `translate(calc(-50% + ${knobX.toFixed(1)}px), calc(-50% + ${knobY.toFixed(1)}px))`;
    this.setMobileJoystickAxis(joystick.side, axisX, axisY);
  }

  private setMobileJoystickAxis(side: MobileJoystickSide, x: number, y: number): void {
    if (side === "left") {
      this.touchAxes.leftX = x;
      this.touchAxes.leftY = y;
    } else {
      this.touchAxes.rightX = x;
      this.touchAxes.rightY = y;
    }
  }

  private handleDrivePointerDown(event: PointerEvent, mode: MobileDriveMode, button: HTMLButtonElement): void {
    event.preventDefault();
    this.activeDrivePointers.set(event.pointerId, mode);
    this.pressedDriveControls.add(mode);
    button.classList.add("active");
    try {
      button.setPointerCapture(event.pointerId);
    } catch {
      // Pointer capture may not have been established.
    }
    this.updateMobileTrackAxes();
  }

  private updateMobileTrackAxes(): void {
    const forward = this.pressedDriveControls.has("forward") ? 1 : 0;
    const reverse = this.pressedDriveControls.has("reverse") ? 1 : 0;
    const turnLeft = this.pressedDriveControls.has("turn-left") ? 1 : 0;
    const turnRight = this.pressedDriveControls.has("turn-right") ? 1 : 0;
    this.touchAxes.leftTrack = clamp(forward - reverse + turnRight - turnLeft, -1, 1);
    this.touchAxes.rightTrack = clamp(forward - reverse + turnLeft - turnRight, -1, 1);
  }

  private installDebugApi(): void {
    window.__excavatorSim = {
      snapshot: () => {
        const truckPhysics = this.truck.physicsState();
        return {
          bucketLoad: this.bucketLoad,
          bucketTransitLoad: this.bucketTransitLoad,
          truckLoad: this.truckLoad,
          totalExcavated: this.totalExcavated,
          digHeight: this.terrain.getHeightAt(DIG_SITE.x, DIG_SITE.z),
          bucketAngle: this.angles.bucket,
          bucketVisualLoad: this.excavator.bucketLoadVisualRatio(),
          trackSoilWork: this.trackSoilWork,
          mobileAxes: { ...this.touchAxes },
          orbit: { azimuth: this.orbit.azimuth, elevation: this.orbit.elevation, distance: this.orbit.distance },
          particleCount: this.soilParticles.length,
          settlingParticleCount: this.soilParticles.filter((particle) => particle.settles).length,
          flowParticleCount: this.soilParticles.filter((particle) => !particle.settles).length,
          fineGrainCount: this.fineGrainCount(),
          activeFineGrainVolume: this.activeFineGrainVolume(),
          settledFineGrainVolume: this.fineGrainSettledVolume,
          chassisSinkage: this.chassisSinkage,
          chassisPitch: this.chassisPitch,
          chassisRoll: this.chassisRoll,
          supportHeight: this.supportHeight,
          truckSag: truckPhysics.suspensionSag,
          truckPitch: truckPhysics.pitch,
          truckRoll: truckPhysics.roll,
          truckTireRutDrop: truckPhysics.tireRutDrop,
          collisionCount: this.collisionCount,
          terrainVolumeDelta: this.terrain.terrainVolumeDelta(),
        };
      },
      forceDigPass: () => {
        const beforeHeight = this.terrain.getHeightAt(DIG_SITE.x, DIG_SITE.z);
        const start = new THREE.Vector3(DIG_SITE.x - 0.55, beforeHeight + 0.02, DIG_SITE.z);
        const end = new THREE.Vector3(DIG_SITE.x + 0.55, beforeHeight - 0.18, DIG_SITE.z);
        const removed = this.terrain.excavateSweptBucket(
          start,
          end,
          new THREE.Vector3(0, 0, 1),
          1.08,
          0.24,
          BUCKET_CAPACITY - this.bucketLoad,
        );
        const airborneFines = removed * 0.06;
        const bucketAccepted = Math.min(BUCKET_CAPACITY - this.bucketLoad, Math.max(0, removed - airborneFines));
        const spill = Math.max(0, removed - airborneFines - bucketAccepted);
        this.bucketLoad += bucketAccepted;
        this.totalExcavated += removed;
        if (airborneFines > 0.001) {
          const finesOrigin = end.clone();
          finesOrigin.y = Math.max(finesOrigin.y, this.terrain.getHeightAt(end.x, end.z) + 0.18);
          this.spawnFineGrains(finesOrigin, airborneFines, new THREE.Vector3(1, 0.25, 0), true, 1.25);
        }
        if (spill > 0.001) {
          this.spawnSoilParticles(end, spill, new THREE.Vector3(1, -0.25, 0), 0.35);
        }
        this.excavator.setBucketLoad(this.bucketLoad);
        this.updateUi(0);
        return {
          removed,
          beforeHeight,
          afterHeight: this.terrain.getHeightAt(DIG_SITE.x, DIG_SITE.z),
          bucketLoad: this.bucketLoad,
          airborneFines,
        };
      },
      forcePlayableDigPass: () => {
        this.bucketLoad = 0;
        this.bucketTransitLoad = 0;
        this.excavator.setBucketLoad(this.bucketLoad);
        const beforeHeight = this.terrain.getHeightAt(DIG_SITE.x, DIG_SITE.z);
        const previousAngles: ExcavatorAngles = { swing: 0, boom: 0.24, stick: -1.52, bucket: -1.72 };
        const diggingAngles: ExcavatorAngles = { swing: 0, boom: 0.22, stick: -1.82, bucket: -2.32 };

        Object.assign(this.angles, diggingAngles);
        this.excavator.group.rotation.y = 0;
        this.excavator.group.position.set(0, this.terrain.getHeightAt(0, 0), 0);
        this.excavator.applyAngles(this.angles);
        const tip = this.excavator.bucketTipWorld();
        this.excavator.group.position.x += DIG_SITE.x - tip.x;
        this.excavator.group.position.z += DIG_SITE.z - tip.z;
        this.excavator.group.position.y += beforeHeight - 0.16 - tip.y;

        this.excavator.applyAngles(previousAngles);
        this.previousBucketTip.copy(this.excavator.bucketTipWorld());
        Object.assign(this.angles, diggingAngles);
        this.excavator.applyAngles(this.angles);
        this.velocities.boom = -0.04;
        this.velocities.stick = -0.34;
        this.velocities.bucket = -0.82;
        this.collisionCooldown = 0;
        const beforeTotal = this.totalExcavated;
        const resistance = this.resolveArmTerrainResistance(previousAngles);
        this.updateSoil(0.14);
        this.updateUi(0);

        return {
          removed: this.totalExcavated - beforeTotal,
          beforeHeight,
          afterHeight: this.terrain.getHeightAt(DIG_SITE.x, DIG_SITE.z),
          bucketLoad: this.bucketLoad,
          bucketTransitLoad: this.bucketTransitLoad,
          blocked: resistance.blockedActions.length > 0,
          velocityAfter: this.velocities.bucket,
          pressure: this.pressure,
        };
      },
      forceTruckDump: () => {
        const beforeTruck = this.truckLoad;
        const beforeTerrain = this.terrain.terrainVolumeDelta();
        const emitted = this.bucketLoad;
        const origin = this.truck.group.localToWorld(new THREE.Vector3(0.54, 1.86, 0));
        const direction = new THREE.Vector3(0.18, -0.95, 0.08).normalize();
        const fineVolume = emitted * 0.08;
        const coarseVolume = Math.max(0, emitted - fineVolume);
        this.bucketLoad = 0;
        const particleStart = this.soilParticles.length;
        this.spawnSoilParticles(origin, coarseVolume, direction, 0.82);
        this.spawnFineGrains(origin, fineVolume, direction.clone().add(new THREE.Vector3(0, -0.55, 0)), true, 1.25);
        const first = this.soilParticles.slice(particleStart).find((particle) => particle.settles);
        const initialVy = first?.velocity.y ?? 0;
        this.updateSoilParticles(1 / 45);
        this.updateFineGrains(1 / 45);
        const gravityDelta = first ? initialVy - first.velocity.y : 0;
        for (let step = 0; step < 260; step += 1) {
          this.updateSoilParticles(1 / 60);
          this.updateFineGrains(1 / 60);
        }
        const dumped = this.truckLoad - beforeTruck;
        this.excavator.setBucketLoad(this.bucketLoad);
        this.truck.updateLoad(this.truckLoad);
        this.updateUi(0);
        return {
          dumped,
          emitted,
          truckLoad: this.truckLoad,
          bucketLoad: this.bucketLoad,
          activeAfter: this.soilParticles.length + this.fineGrainCount(),
          gravityDelta,
          terrainGain: this.terrain.terrainVolumeDelta() - beforeTerrain,
        };
      },
      forceFullBucketPush: () => {
        this.bucketLoad = BUCKET_CAPACITY;
        this.excavator.setBucketLoad(this.bucketLoad);
        const centerBefore = this.terrain.getHeightAt(DIG_SITE.x, DIG_SITE.z);
        const bermBefore = this.terrain.getHeightAt(DIG_SITE.x, DIG_SITE.z + 0.78);
        const start = new THREE.Vector3(DIG_SITE.x - 0.55, centerBefore + 0.02, DIG_SITE.z);
        const end = new THREE.Vector3(DIG_SITE.x + 0.55, centerBefore - 0.12, DIG_SITE.z);
        const displaced = this.terrain.displaceSweptBucket(
          start,
          end,
          new THREE.Vector3(0, 0, 1),
          1.16,
          0.16,
          0.22,
        );
        const centerAfter = this.terrain.getHeightAt(DIG_SITE.x, DIG_SITE.z);
        const bermAfter = this.terrain.getHeightAt(DIG_SITE.x, DIG_SITE.z + 0.78);
        this.updateUi(0);
        return {
          displaced,
          bucketLoad: this.bucketLoad,
          centerDrop: centerBefore - centerAfter,
          bermRise: bermAfter - bermBefore,
        };
      },
      forceCuttingFlowPhysics: () => {
        const beforeBucket = this.bucketLoad;
        const beforeTransit = this.bucketTransitLoad;
        const volume = 0.18;
        this.bucketTransitLoad += volume;
        this.spawnCuttingFlow(this.excavator.bucketCuttingEdgeWorld(), this.excavator.bucketPocketWorld(), volume);
        const flowParticles = this.soilParticles.filter((particle) => particle.toBucket);
        const first = flowParticles[0];
        const initialVy = first?.velocity.y ?? 0;
        this.updateSoilParticles(1 / 45);
        const gravityDelta = first ? initialVy - first.velocity.y : 0;
        for (let step = 0; step < 150; step += 1) {
          this.updateSoilParticles(1 / 60);
        }
        this.excavator.setBucketLoad(this.bucketLoad);
        this.updateUi(0);
        return {
          spawnedVolume: volume,
          capturedVolume: this.bucketLoad - beforeBucket,
          transitRemaining: this.bucketTransitLoad - beforeTransit,
          gravityDelta,
          activeFlowAfter: this.soilParticles.filter((particle) => particle.toBucket).length,
        };
      },
      forceBucketKinematics: () => {
        const saved = { ...this.angles };
        this.angles.bucket = ANGLE_LIMITS.bucket.min;
        this.excavator.applyAngles(this.angles);
        const curled = this.excavator.bucketLinkageDiagnostics();
        this.angles.bucket = ANGLE_LIMITS.bucket.max;
        this.excavator.applyAngles(this.angles);
        const dumped = this.excavator.bucketLinkageDiagnostics();
        Object.assign(this.angles, saved);
        this.excavator.applyAngles(this.angles);
        this.previousBucketTip.copy(this.excavator.bucketTipWorld());
        this.updateUi(0);
        const current = this.excavator.bucketLinkageDiagnostics();
        return {
          edgeWidth: current.edgeWidth,
          pocketBehindEdge: current.pocketBehindEdge,
          tipBelowPocket: current.tipBelowPocket,
          sideOrthogonality: current.sideOrthogonality,
          cylinderDelta: Math.abs(dumped.cylinderLength - curled.cylinderLength),
          linkSymmetry: Math.abs(current.leftLinkLength - current.rightLinkLength),
        };
      },
      forceTrackPass: () => {
        const center = new THREE.Vector3(DIG_SITE.x, 0, DIG_SITE.z - 1.6);
        const forward = new THREE.Vector3(1, 0, 0);
        const side = new THREE.Vector3(0, 0, 1);
        const rutBefore = this.terrain.getHeightAt(center.x, center.z);
        const leftBermPoint = center.clone().addScaledVector(side, TRACK_WIDTH * 0.5 + 0.22);
        const rightBermPoint = center.clone().addScaledVector(side, -(TRACK_WIDTH * 0.5 + 0.22));
        const bermBefore = Math.max(
          this.terrain.getHeightAt(leftBermPoint.x, leftBermPoint.z),
          this.terrain.getHeightAt(rightBermPoint.x, rightBermPoint.z),
        );
        const result = this.terrain.compactTrackStrip(center, forward, side, TRACK_LENGTH, TRACK_WIDTH, 0.2);
        this.trackSoilWork += result.compacted;
        const rutAfter = this.terrain.getHeightAt(center.x, center.z);
        const bermAfter = Math.max(
          this.terrain.getHeightAt(leftBermPoint.x, leftBermPoint.z),
          this.terrain.getHeightAt(rightBermPoint.x, rightBermPoint.z),
        );
        this.updateUi(0);
        return {
          compacted: result.compacted,
          rutDrop: Math.max(result.rutDrop, rutBefore - rutAfter),
          bermRise: Math.max(result.bermRise, bermAfter - bermBefore),
          trackSoilWork: this.trackSoilWork,
        };
      },
      forceTruckCollision: () => {
        const localStart = new THREE.Vector3(-3.72, 0, 0);
        const start = this.truck.group.localToWorld(localStart.clone());
        const beforeLocal = this.truck.group.worldToLocal(start.clone());
        this.excavator.group.position.set(start.x, this.terrain.getHeightAt(start.x, start.z), start.z);
        this.excavator.group.rotation.set(0, this.truck.group.rotation.y, 0);
        this.leftTrackVelocity = TRACK_MAX_SPEED;
        this.rightTrackVelocity = TRACK_MAX_SPEED;
        const forward = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.excavator.group.rotation.y);
        this.resolveWorldCollisions(TRACK_MAX_SPEED, 0, forward);
        const afterLocal = this.truck.group.worldToLocal(this.excavator.group.position.clone());
        this.updateExcavatorSupport(0.3, forward);
        this.updateUi(0);
        return {
          beforeX: beforeLocal.x,
          afterX: afterLocal.x,
          blocked: afterLocal.x < -3.74 && Math.abs(this.leftTrackVelocity) < TRACK_MAX_SPEED * 0.55,
          collisionCount: this.collisionCount,
          pressure: this.pressure,
        };
      },
      forceArmTruckCollision: () => {
        const truckYaw = this.truck.group.rotation.y;
        this.truck.group.position.copy(TRUCK_CENTER);
        this.truck.group.rotation.set(0, truckYaw, 0);
        this.truck.updateLoad(this.truckLoad);
        const localBase = new THREE.Vector3(-7.4, 0, 0);
        const base = this.truck.group.localToWorld(localBase.clone());
        this.excavator.group.position.set(base.x, this.truck.group.position.y, base.z);
        this.excavator.group.rotation.set(0, this.truck.group.rotation.y, 0);
        const previousAngles: ExcavatorAngles = { swing: 0, boom: 0.08, stick: -2.05, bucket: -2.2 };
        Object.assign(this.angles, previousAngles, { stick: -1.5 });
        this.velocities.stick = 0.48;
        this.collisionCooldown = 0;
        const beforeStick = this.angles.stick;
        this.excavator.applyAngles(this.angles);
        const result = this.resolveArmTruckCollisions(previousAngles);
        this.previousBucketTip.copy(this.excavator.bucketTipWorld());
        this.updateUi(0);
        return {
          collided: result.collided,
          angleBlocked: this.angles.stick < beforeStick - 0.08 && result.blockedActions.includes("stick"),
          beforeStick,
          afterStick: this.angles.stick,
          velocityAfter: this.velocities.stick,
          pressure: this.pressure,
          collisionCount: this.collisionCount,
          penetration: result.penetration,
          blockedActions: result.blockedActions,
        };
      },
      forceArmSubsoilResistance: () => {
        const baseGround = this.terrain.getHeightAt(DIG_SITE.x - 2.8, DIG_SITE.z);
        this.excavator.group.position.set(DIG_SITE.x - 2.8, baseGround, DIG_SITE.z);
        this.excavator.group.rotation.set(0, 0, 0);
        const previousAngles: ExcavatorAngles = { swing: 0, boom: 0.2, stick: -1.42, bucket: -2.18 };
        Object.assign(this.angles, previousAngles, { stick: -1.88 });
        this.velocities.stick = -0.58;
        this.velocities.boom = -0.22;
        this.velocities.bucket = -0.24;
        this.excavator.applyAngles(this.angles);
        const stickSample = this.excavator
          .armSubsoilSamples()
          .find((sample) => sample.action === "stick" && sample.key === "stick-0.8");
        const buryPoint = stickSample?.point ?? this.excavator.bucketPocketWorld();
        this.terrain.raiseAt(buryPoint, 0.58, 0.86);
        this.collisionCooldown = 0;
        const beforeStick = this.angles.stick;
        const result = this.resolveArmTerrainResistance(previousAngles);
        this.previousBucketTip.copy(this.excavator.bucketTipWorld());
        this.updateUi(0);
        return {
          resisted: result.resisted,
          blocked: result.blockedActions.includes("stick") && this.angles.stick > beforeStick + 0.12,
          beforeStick,
          afterStick: this.angles.stick,
          velocityAfter: this.velocities.stick,
          maxSubmerged: result.maxSubmerged,
          averageSubmerged: result.averageSubmerged,
          pressure: this.pressure,
          blockedActions: result.blockedActions,
        };
      },
      forceArmWorldObjectPhysics: () => {
        const debris =
          this.worldColliders.find((collider) => !collider.immovable && collider.kind === "cone") ??
          this.worldColliders.find((collider) => !collider.immovable && collider.kind === "rock") ??
          this.worldColliders.find((collider) => !collider.immovable && collider.kind === "clod");
        const hard = this.worldColliders.find((collider) => collider.kind === "boulder");
        const forward = new THREE.Vector3(1, 0, 0);
        let movableHit = false;
        let movableTravel = 0;
        let liftedObject = false;
        let liftHeight = 0;
        let carriedMass = 0;
        let heavyLifted = false;
        let heavyLiftHeight = 0;
        let heavyCarriedMass = 0;
        let immovableBlocked = false;
        let beforeStick = 0;
        let afterStick = 0;
        let velocityAfter = 0;
        let penetration = 0;
        let blockedActions: ActionName[] = [];

        this.excavator.group.position.set(0, this.terrain.getHeightAt(0, 0), 0);
        this.excavator.group.rotation.set(0, 0, 0);
        if (debris) {
          const previousAngles: ExcavatorAngles = { swing: 0, boom: 0.42, stick: -1.46, bucket: -2.36 };
          Object.assign(this.angles, previousAngles);
          this.velocities.stick = -0.28;
          this.velocities.bucket = -0.72;
          this.excavator.applyAngles(this.angles);
          const debrisStart = this.excavator.bucketGroup.localToWorld(new THREE.Vector3(-0.56, -0.3, 0));
          debris.mesh.position.copy(debrisStart);
          debris.velocity.set(0, 0, 0);
          debris.sleeping = false;
          this.collisionCooldown = 0;
          const result = this.resolveArmWorldObjectCollisions(previousAngles);
          const carriedAfterHit = this.carriedWorldColliders.has(debris);
          const beforeLiftY = debris.mesh.position.y;
          Object.assign(this.angles, { boom: this.angles.boom + 0.18, stick: this.angles.stick + 0.04 });
          this.velocities.boom = 0.38;
          this.excavator.applyAngles(this.angles);
          this.updateCarriedWorldObjects(0.32);
          movableHit = result.movableHit || carriedAfterHit;
          movableTravel = debris.mesh.position.distanceTo(debrisStart);
          liftHeight = debris.mesh.position.y - beforeLiftY;
          carriedMass = carriedAfterHit ? this.carriedWorldObjectMass() : 0;
          liftedObject = carriedAfterHit && carriedMass > 0 && liftHeight > 0.02;
          penetration = Math.max(penetration, result.penetration);
          this.releaseCarriedWorldObjects();
        }

        if (hard) {
          const previousAngles: ExcavatorAngles = { swing: 0, boom: 0.48, stick: -1.5, bucket: -2.42 };
          Object.assign(this.angles, previousAngles);
          this.velocities.stick = -0.26;
          this.velocities.bucket = -0.58;
          this.excavator.applyAngles(this.angles);
          const hardStart = this.excavator.bucketGroup.localToWorld(new THREE.Vector3(-0.58, -0.31, 0.04));
          hard.mesh.position.copy(hardStart);
          hard.velocity.set(0, 0, 0);
          hard.sleeping = false;
          this.collisionCooldown = 0;
          beforeStick = this.angles.stick;
          const result = this.resolveArmWorldObjectCollisions(previousAngles);
          const carriedAfterHit = this.carriedWorldColliders.has(hard);
          const beforeLiftY = hard.mesh.position.y;
          Object.assign(this.angles, { boom: this.angles.boom + 0.2, stick: this.angles.stick + 0.04 });
          this.velocities.boom = 0.42;
          this.excavator.applyAngles(this.angles);
          this.updateCarriedWorldObjects(0.34);
          afterStick = this.angles.stick;
          velocityAfter = this.velocities.stick;
          blockedActions = result.blockedActions;
          heavyLiftHeight = hard.mesh.position.y - beforeLiftY;
          heavyCarriedMass = carriedAfterHit ? this.carriedWorldObjectMass() : 0;
          heavyLifted = carriedAfterHit && heavyCarriedMass > 0 && heavyLiftHeight > 0.02;
          penetration = Math.max(penetration, result.penetration);
          immovableBlocked = result.immovableBlocked;
          this.releaseCarriedWorldObjects();
        }

        this.previousBucketTip.copy(this.excavator.bucketTipWorld());
        this.updateExcavatorSupport(0.2, forward);
        this.updateUi(0);
        return {
          movableHit,
          movableTravel,
          liftedObject,
          liftHeight,
          carriedMass,
          heavyLifted,
          heavyLiftHeight,
          heavyCarriedMass,
          immovableBlocked,
          beforeStick,
          afterStick,
          velocityAfter,
          pressure: this.pressure,
          collisionCount: this.collisionCount,
          penetration,
          blockedActions,
        };
      },
      forceTruckLoadPhysics: () => {
        this.truck.reset(this.terrain);
        this.truckLoad = 0;
        const beforeY = this.truck.group.position.y;
        const roughWheel = this.truck.wheelWorldPoints()[3];
        this.terrain.raiseAt(roughWheel, 0.52, 0.1);
        const beforeRut = this.terrain.getHeightAt(roughWheel.x, roughWheel.z);
        const dumpPoint = this.truck.group.localToWorld(new THREE.Vector3(1.18, 1.36, 0.58));
        const accepted = this.truck.depositSoilAt(dumpPoint, TRUCK_CAPACITY * 0.74, TRUCK_CAPACITY);
        this.truckLoad = accepted;
        this.truck.updateLoad(this.truckLoad);
        this.truck.settleLoad(2);
        const state = this.truck.updatePhysics(this.terrain, this.truckLoad, 0.95, true);
        const afterRut = this.terrain.getHeightAt(roughWheel.x, roughWheel.z);
        this.truck.updateLoad(this.truckLoad);
        this.updateUi(0);
        return {
          accepted,
          loadRatio: state.loadRatio,
          sag: state.suspensionSag,
          pitch: state.pitch,
          roll: state.roll,
          compacted: state.tireCompacted,
          rutDrop: Math.max(state.tireRutDrop, beforeRut - afterRut),
          bodyYDrop: beforeY - this.truck.group.position.y,
          supportSpread: state.supportSpread,
        };
      },
      forceTerrainMaterialPhysics: () => {
        const mud = new THREE.Vector3(9.8, 0, -8.8);
        const dry = new THREE.Vector3(0.0, 0, 13.5);
        const hard = new THREE.Vector3(-13.2, 0, -9.6);
        const soft = new THREE.Vector3(DIG_SITE.x + 1.4, 0, DIG_SITE.z + 2.7);
        const forward = new THREE.Vector3(1, 0, 0);
        const side = new THREE.Vector3(0, 0, 1);
        const mudSurface = this.terrain.getSurfaceConditionAt(mud.x, mud.z);
        const drySurface = this.terrain.getSurfaceConditionAt(dry.x, dry.z);
        const hardSurface = this.terrain.getSurfaceConditionAt(hard.x, hard.z);
        const beforeMud = this.terrain.getHeightAt(mud.x, mud.z);
        const beforeDry = this.terrain.getHeightAt(dry.x, dry.z);
        const mudResult = this.terrain.compactTrackStrip(
          mud,
          forward,
          side,
          TRACK_LENGTH,
          TRACK_WIDTH,
          0.035 * mudSurface.trackSinkMultiplier,
        );
        const dryResult = this.terrain.compactTrackStrip(
          dry,
          forward,
          side,
          TRACK_LENGTH,
          TRACK_WIDTH,
          0.035 * drySurface.trackSinkMultiplier,
        );
        const afterMud = this.terrain.getHeightAt(mud.x, mud.z);
        const afterDry = this.terrain.getHeightAt(dry.x, dry.z);
        this.updateUi(0);
        return {
          mudWetness: mudSurface.wetness,
          mudSinkMultiplier: mudSurface.trackSinkMultiplier,
          mudDragMultiplier: mudSurface.trackDragMultiplier,
          gravelHardpack: hardSurface.hardpack,
          gravelBucketMultiplier: hardSurface.bucketResistanceMultiplier,
          mudCompacted: mudResult.compacted,
          dryCompacted: dryResult.compacted,
          mudRutDrop: Math.max(mudResult.rutDrop, beforeMud - afterMud),
          dryRutDrop: Math.max(dryResult.rutDrop, beforeDry - afterDry),
          hardResistance: this.terrain.getSubsoilResistanceAt(hard.x, hard.z),
          softResistance: this.terrain.getSubsoilResistanceAt(soft.x, soft.z),
        };
      },
      forceRoughTrackSupport: () => {
        const base = this.excavator.group.position.clone();
        const beforeSupport = this.supportHeight;
        const forward = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.excavator.group.rotation.y);
        const side = new THREE.Vector3(-forward.z, 0, forward.x).normalize();
        this.terrain.lowerAt(base.clone().addScaledVector(side, -0.72), 0.9, 0.42);
        this.terrain.raiseAt(base.clone().addScaledVector(side, 0.72).addScaledVector(forward, 0.65), 0.78, 0.18);
        this.leftTrackVelocity = TRACK_MAX_SPEED * 0.85;
        this.rightTrackVelocity = TRACK_MAX_SPEED * 0.65;
        this.updateTrackSoilInteraction(0.42, forward);
        this.updateExcavatorSupport(0.65, forward);
        this.updateUi(0);
        return {
          roll: this.chassisRoll,
          pitch: this.chassisPitch,
          sinkage: this.chassisSinkage,
          pressure: this.pressure,
          supportDrop: beforeSupport - this.supportHeight,
        };
      },
      forceWorldObjectPhysics: () => {
        const debris = this.worldColliders.find((collider) => !collider.immovable && (collider.kind === "clod" || collider.kind === "cone" || collider.kind === "rock"));
        const hard = this.worldColliders.find((collider) => collider.kind === "boulder");
        const rail = this.worldColliders.find((collider) => collider.kind === "fence" && collider.radius > 0.4);
        const forward = new THREE.Vector3(1, 0, 0);
        let debrisTravel = 0;
        let hardTravel = 0;
        let railTravel = 0;

        this.excavator.group.rotation.set(0, 0, 0);
        if (debris) {
          const debrisStart = new THREE.Vector3(1.54, 0, 1.55);
          debrisStart.y = this.terrain.getHeightAt(debrisStart.x, debrisStart.z) + debris.groundOffset;
          debris.mesh.position.copy(debrisStart);
          debris.velocity.set(0, 0, 0);
          this.excavator.group.position.set(0, this.terrain.getHeightAt(0, 1.55), 1.55);
          this.leftTrackVelocity = TRACK_MAX_SPEED;
          this.rightTrackVelocity = TRACK_MAX_SPEED;
          this.collisionCooldown = 0;
          this.resolveWorldCollisions(TRACK_MAX_SPEED, 0, forward);
          this.updateLooseWorldObjects(0.28);
          debrisTravel = debris.mesh.position.distanceTo(debrisStart);
        }

        if (hard) {
          const hardStart = new THREE.Vector3(2.05, 0, -1.45);
          hardStart.y = this.terrain.getHeightAt(hardStart.x, hardStart.z) + hard.groundOffset;
          hard.mesh.position.copy(hardStart);
          hard.velocity.set(0, 0, 0);
          this.excavator.group.position.set(0.42, this.terrain.getHeightAt(0.42, -1.45), -1.45);
          this.leftTrackVelocity = TRACK_MAX_SPEED;
          this.rightTrackVelocity = TRACK_MAX_SPEED;
          this.collisionCooldown = 0;
          this.resolveWorldCollisions(TRACK_MAX_SPEED, 0, forward);
          this.updateLooseWorldObjects(0.28);
          hardTravel = hard.mesh.position.distanceTo(hardStart);
        }

        if (rail) {
          const railForward = new THREE.Vector3(0, 0, -1);
          const railStart = rail.mesh.position.clone().add(new THREE.Vector3(0, 0, 2.02));
          this.excavator.group.position.set(railStart.x, this.terrain.getHeightAt(railStart.x, railStart.z), railStart.z);
          this.excavator.group.rotation.set(0, Math.PI / 2, 0);
          this.leftTrackVelocity = TRACK_MAX_SPEED;
          this.rightTrackVelocity = TRACK_MAX_SPEED;
          this.collisionCooldown = 0;
          const railBefore = rail.mesh.position.clone();
          this.resolveWorldCollisions(TRACK_MAX_SPEED, 0, railForward);
          this.updateLooseWorldObjects(0.28);
          railTravel = rail.mesh.position.distanceTo(railBefore);
        }

        this.updateExcavatorSupport(0.3, forward);
        this.updateUi(0);
        return {
          debrisTravel,
          hardTravel,
          railTravel,
          collisionCount: this.collisionCount,
          pressure: this.pressure,
        };
      },
      forceMapDiversity: () => {
        const surfacePoints = {
          wetland: new THREE.Vector3(28.0, 0, -24.0),
          gravelFan: new THREE.Vector3(-30.0, 0, 25.0),
          hardBench: new THREE.Vector3(27.0, 0, 26.0),
          haulRoad: new THREE.Vector3(-8.0, 0, 20.5),
          ridge: new THREE.Vector3(-36.0, 0, -27.0),
          windrow: new THREE.Vector3(33.5, 0, -4.0),
        };
        const wetland = this.terrain.getSurfaceConditionAt(surfacePoints.wetland.x, surfacePoints.wetland.z);
        const gravelFan = this.terrain.getSurfaceConditionAt(surfacePoints.gravelFan.x, surfacePoints.gravelFan.z);
        const hardBench = this.terrain.getSurfaceConditionAt(surfacePoints.hardBench.x, surfacePoints.hardBench.z);
        const haulRoad = this.terrain.getSurfaceConditionAt(surfacePoints.haulRoad.x, surfacePoints.haulRoad.z);
        const heights = Object.values(surfacePoints).map((point) => this.terrain.getHeightAt(point.x, point.z));
        const materialZones = [
          wetland.wetness > 0.6,
          gravelFan.gravel > 0.55,
          hardBench.hardpack > 0.58,
          haulRoad.compaction > 0.62,
        ].filter(Boolean).length;
        const farColliderCount = this.worldColliders.filter(
          (collider) => Math.hypot(collider.mesh.position.x, collider.mesh.position.z) > 30,
        ).length;
        return {
          terrainSize: this.terrain.size,
          spacing: this.terrain.spacing,
          heightRange: Math.max(...heights) - Math.min(...heights),
          wetlandWetness: wetland.wetness,
          gravelFan: gravelFan.gravel,
          hardBench: hardBench.hardpack,
          haulRoadCompaction: haulRoad.compaction,
          materialZones,
          roughSlope: Math.max(
            this.terrain.getSlopeAt(-32.5, -27.0),
            this.terrain.getSlopeAt(-39.5, -27.0),
            this.terrain.getSlopeAt(33.5, -9.5),
            this.terrain.getSlopeAt(33.5, 1.5),
            this.terrain.getSlopeAt(24.5, 26.0),
            this.terrain.getSlopeAt(30.5, 26.0),
          ),
          farColliderCount,
          colliderKinds: new Set(this.worldColliders.map((collider) => collider.kind)).size,
        };
      },
      forceFineGrainSettlement: () => {
        const x = DIG_SITE.x - 0.35;
        const z = DIG_SITE.z + 0.62;
        const ground = this.terrain.getHeightAt(x, z);
        const origin = new THREE.Vector3(x, ground + 1.1, z);
        const spawnedVolume = 0.12;
        const beforeSettled = this.fineGrainSettledVolume;
        const beforeTerrain = this.terrain.terrainVolumeDelta();
        this.spawnFineGrains(origin, spawnedVolume, new THREE.Vector3(0.15, -0.72, 0.08), true, 1.25);
        for (let step = 0; step < 180; step += 1) {
          this.updateFineGrains(1 / 45);
        }
        this.updateUi(0);
        return {
          spawnedVolume,
          settledVolume: this.fineGrainSettledVolume - beforeSettled,
          activeAfter: this.fineGrainCount(),
          terrainGain: this.terrain.terrainVolumeDelta() - beforeTerrain,
          truckLoad: this.truckLoad,
        };
      },
      forceExcavatorPitSink: () => {
        const forward = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.excavator.group.rotation.y);
        const base = this.excavator.group.position.clone();
        const beforeY = this.excavator.group.position.y;
        const beforeGround = this.terrain.getHeightAt(base.x, base.z);
        const lowered = this.terrain.lowerAt(base, 2.25, 0.62);
        const afterGround = this.terrain.getHeightAt(base.x, base.z);
        this.updateExcavatorSupport(0.55, forward);
        this.excavator.applyAngles(this.angles);
        this.previousBucketTip.copy(this.excavator.bucketTipWorld());
        this.updateUi(0);
        return {
          lowered,
          beforeY,
          afterY: this.excavator.group.position.y,
          beforeGround,
          afterGround,
          chassisSinkage: this.chassisSinkage,
        };
      },
    };
  }

  private tick(): void {
    const dt = Math.min(this.clock.getDelta(), 0.033);
    this.elapsed += dt;
    this.limitCooldown = Math.max(0, this.limitCooldown - dt);
    this.safetyCooldown = Math.max(0, this.safetyCooldown - dt);
    this.collisionCooldown = Math.max(0, this.collisionCooldown - dt);

    const axes = this.readAxes();
    const actions = this.mapAxesToActions(axes);
    Object.assign(this.targetActions, actions);
    this.updateHydraulics(dt, axes);
    this.updateTravel(dt, axes);
    this.updateLooseWorldObjects(dt);
    const anglesBeforeArmMotion = this.updateAngles(dt);
    this.excavator.applyAngles(this.angles);
    this.updateCarriedWorldObjects(dt);
    this.resolveArmTruckCollisions(anglesBeforeArmMotion);
    this.resolveArmWorldObjectCollisions(anglesBeforeArmMotion);
    this.resolveArmTerrainResistance(anglesBeforeArmMotion);
    this.updateCarriedWorldObjects(dt);
    this.updateSoil(dt);
    this.updateSoilParticles(dt);
    this.updateFineGrains(dt);
    this.updatePassiveSoil(dt);
    this.updateTruckPhysics(dt);
    this.updateSafety(dt);
    this.updateCamera(dt);
    this.updateUi(dt);
    this.renderer.render(this.scene, this.camera);
  }

  private updateTruckPhysics(dt: number): void {
    const state = this.truck.updatePhysics(this.terrain, this.truckLoad, dt, this.truckLoad > 0.02);
    if (state.tireCompacted > 0.001) {
      this.pressure = Math.max(this.pressure, clamp(0.04 + state.loadRatio * 0.18 + state.tireRutDrop * 2.4, 0, 0.42));
    }
  }

  private readAxes(): JoystickAxes {
    const keyboardAxes = {
      leftX: (this.keys.has("KeyD") ? 1 : 0) - (this.keys.has("KeyA") ? 1 : 0),
      leftY: (this.keys.has("KeyW") ? 1 : 0) - (this.keys.has("KeyS") ? 1 : 0),
      rightX: (this.keys.has("ArrowRight") ? 1 : 0) - (this.keys.has("ArrowLeft") ? 1 : 0),
      rightY: (this.keys.has("ArrowUp") ? 1 : 0) - (this.keys.has("ArrowDown") ? 1 : 0),
      leftTrack: (this.keys.has("KeyG") ? 1 : 0) - (this.keys.has("KeyB") ? 1 : 0),
      rightTrack: (this.keys.has("KeyH") ? 1 : 0) - (this.keys.has("KeyN") ? 1 : 0),
    };
    return {
      leftX: clamp(keyboardAxes.leftX + this.touchAxes.leftX, -1, 1),
      leftY: clamp(keyboardAxes.leftY + this.touchAxes.leftY, -1, 1),
      rightX: clamp(keyboardAxes.rightX + this.touchAxes.rightX, -1, 1),
      rightY: clamp(keyboardAxes.rightY + this.touchAxes.rightY, -1, 1),
      leftTrack: clamp(keyboardAxes.leftTrack + this.touchAxes.leftTrack, -1, 1),
      rightTrack: clamp(keyboardAxes.rightTrack + this.touchAxes.rightTrack, -1, 1),
    };
  }

  private mapAxesToActions(axes: JoystickAxes): Actions {
    if (this.pattern === "ISO") {
      return {
        swing: -axes.leftX,
        stick: axes.leftY,
        boom: -axes.rightY,
        bucket: axes.rightX,
      };
    }

    if (this.pattern === "SAE") {
      return {
        swing: -axes.leftX,
        boom: -axes.leftY,
        stick: axes.rightY,
        bucket: axes.rightX,
      };
    }

    return {
      swing: -axes.leftX,
      boom: axes.leftY,
      stick: axes.rightY,
      bucket: axes.rightX,
    };
  }

  private updateHydraulics(dt: number, axes: JoystickAxes): void {
    const gain = RESPONSE_GAIN[this.responseMode];
    let targetPressure = Math.max(Math.abs(axes.leftTrack), Math.abs(axes.rightTrack)) * 0.42;

    for (const action of Object.keys(this.velocities) as ActionName[]) {
      const target = this.targetActions[action] * MAX_RATES[action];
      const actionGain = action === "bucket" ? gain * 1.62 : gain;
      this.velocities[action] = smoothTo(this.velocities[action], target, actionGain, dt);
      if (Math.abs(this.targetActions[action]) < 0.02 && Math.abs(this.velocities[action]) < 0.005) {
        this.velocities[action] = 0;
      }
      targetPressure = Math.max(targetPressure, Math.abs(this.targetActions[action]));
    }

    const loadFactor = clamp(this.bucketLoad / BUCKET_CAPACITY + (this.carriedWorldObjectMass() / BUCKET_OBJECT_LIFT_LIMIT) * 0.38, 0, 1.4);
    this.pressure = smoothTo(this.pressure, clamp(targetPressure * (0.55 + loadFactor * 0.45), 0, 1), 3.8, dt);
    if (targetPressure < 0.03) {
      this.idleSeconds += dt;
    }
  }

  private updateTravel(dt: number, axes: JoystickAxes): void {
    const gain = RESPONSE_GAIN[this.responseMode] * 0.65;
    const leftTarget = axes.leftTrack * TRACK_MAX_SPEED;
    const rightTarget = axes.rightTrack * TRACK_MAX_SPEED;
    const leftGain = leftTarget * this.leftTrackVelocity < -0.01 ? gain * 2.15 : gain;
    const rightGain = rightTarget * this.rightTrackVelocity < -0.01 ? gain * 2.15 : gain;
    this.leftTrackVelocity = smoothTo(this.leftTrackVelocity, leftTarget, leftGain, dt);
    this.rightTrackVelocity = smoothTo(this.rightTrackVelocity, rightTarget, rightGain, dt);

    if (Math.abs(leftTarget) < 0.02 && Math.abs(this.leftTrackVelocity) < 0.01) {
      this.leftTrackVelocity = 0;
    }
    if (Math.abs(rightTarget) < 0.02 && Math.abs(this.rightTrackVelocity) < 0.01) {
      this.rightTrackVelocity = 0;
    }

    const forwardSpeed = (this.leftTrackVelocity + this.rightTrackVelocity) * 0.5;
    const turnRate = (this.rightTrackVelocity - this.leftTrackVelocity) / TRACK_GAUGE;
    this.excavator.group.rotation.y -= turnRate * dt;

    const forward = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.excavator.group.rotation.y);
    const move = forwardSpeed * dt;
    this.excavator.group.position.addScaledVector(forward, move);
    this.resolveWorldCollisions(forwardSpeed, turnRate, forward);
    this.travelDistance += Math.abs(move);
    this.updateTrackSoilInteraction(dt, forward);
    this.updateExcavatorSupport(dt, forward);
  }

  private resolveWorldCollisions(forwardSpeed: number, turnRate: number, forward: THREE.Vector3): void {
    const hasDriveIntent = Math.abs(forwardSpeed) > 0.02 || Math.abs(turnRate) > 0.05;
    const hit = this.truck.resolveBodyCollision(this.excavator.group.position, 1.62);
    if (hit) {
      this.applyCollisionResponse(hit.normal, hit.penetration, forwardSpeed, turnRate, forward, 1.0);
    }

    for (const collider of this.worldColliders) {
      if (this.carriedWorldColliders.has(collider)) {
        continue;
      }
      const obstacleHit = this.resolveColliderHit(collider, this.excavator.group.position, 1.62);
      if (!obstacleHit) {
        continue;
      }

      const approachSpeed = forward.clone().multiplyScalar(forwardSpeed).dot(obstacleHit.normal);
      const severity = clamp(
        obstacleHit.penetration * 2.1 + Math.abs(approachSpeed) * 0.48 + Math.abs(turnRate) * 0.08,
        0,
        1,
      );
      if (collider.immovable) {
        this.applyCollisionResponse(obstacleHit.normal, obstacleHit.penetration, forwardSpeed, turnRate, forward, 0.92);
      } else {
        if (!hasDriveIntent && obstacleHit.penetration < 0.22) {
          continue;
        }
        const movableNormal = obstacleHit.normal.clone();
        const impulse = clamp((severity * 1.4 + Math.max(0, -approachSpeed) * 0.45) / Math.max(collider.mass, 0.1), 0.05, 1.7);
        collider.mesh.position.addScaledVector(movableNormal, -Math.min(obstacleHit.penetration * 0.7, 0.16));
        collider.velocity.addScaledVector(movableNormal, -impulse);
        collider.velocity.y = Math.max(collider.velocity.y, 0.18 * severity);
        collider.sleeping = false;
        this.pressure = Math.max(this.pressure, clamp(0.1 + severity * 0.36 + collider.mass * 0.018, 0, 0.62));
        if (collider.crushable && severity > 0.32) {
          collider.mesh.scale.multiplyScalar(1 - Math.min(severity * 0.04, 0.08));
          this.terrain.raiseAt(collider.mesh.position, Math.max(0.16, collider.radius * 1.7), collider.radius * 0.012 * severity, 0);
        }
      }
    }
  }

  private applyCollisionResponse(
    normal: THREE.Vector3,
    penetration: number,
    forwardSpeed: number,
    turnRate: number,
    forward: THREE.Vector3,
    hardness: number,
  ): void {
    const correction = Math.min((penetration + 0.018) * hardness, 0.44);
    this.excavator.group.position.addScaledVector(normal, correction);
    const approachSpeed = forward.clone().multiplyScalar(forwardSpeed).dot(normal);
    const collisionSeverity = clamp(penetration * 1.8 + Math.abs(approachSpeed) * 0.55 + Math.abs(turnRate) * 0.08, 0, 1);

    if (approachSpeed < 0 || Math.abs(turnRate) > 0.1) {
      const block = clamp(1 - collisionSeverity * (1.35 + hardness * 0.55), 0, 0.46);
      this.leftTrackVelocity *= block;
      this.rightTrackVelocity *= block;
      if (Math.abs(approachSpeed) > 0.04 || penetration > 0.035) {
        this.pressure = Math.max(this.pressure, clamp(0.48 + collisionSeverity * 0.52, 0, 1));
      }
    }

    if (this.collisionCooldown <= 0 && collisionSeverity > 0.08) {
      this.collisionCount += 1;
      this.collisionCooldown = 0.34;
    }
  }

  private resolveColliderHit(collider: WorldCollider, bodyPosition: THREE.Vector3, bodyRadius: number): { normal: THREE.Vector3; penetration: number } | null {
    const obstacle = collider.mesh.position;
    const dx = bodyPosition.x - obstacle.x;
    const dz = bodyPosition.z - obstacle.z;
    const distanceSq = dx * dx + dz * dz;
    const combinedRadius = bodyRadius + collider.radius;
    if (distanceSq >= combinedRadius * combinedRadius) {
      return null;
    }

    if (distanceSq < 0.000001) {
      return { normal: new THREE.Vector3(-1, 0, 0), penetration: combinedRadius };
    }

    const distance = Math.sqrt(distanceSq);
    return {
      normal: new THREE.Vector3(dx / distance, 0, dz / distance),
      penetration: combinedRadius - distance,
    };
  }

  private carriedWorldObjectMass(): number {
    let mass = 0;
    for (const collider of this.carriedWorldColliders.keys()) {
      mass += collider.mass;
    }
    return mass;
  }

  private bucketCarryLocalPoint(collider: WorldCollider): THREE.Vector3 | null {
    const local = this.excavator.bucketGroup.worldToLocal(collider.mesh.position.clone());
    const radius = Math.max(0.08, collider.radius);
    const withinBucket =
      local.x >= -BUCKET_LEN - 0.22 - radius &&
      local.x <= 0.12 + radius &&
      local.y >= -0.74 - radius &&
      local.y <= 0.16 + radius &&
      Math.abs(local.z) <= 0.58 + radius;
    const pocketDx = local.x + 0.46;
    const pocketDy = local.y + 0.28;
    const pocketDz = local.z;
    const nearPocket = pocketDx * pocketDx + pocketDy * pocketDy + pocketDz * pocketDz < (0.42 + radius) * (0.42 + radius);
    if (!withinBucket && !nearPocket) {
      return null;
    }

    return new THREE.Vector3(
      clamp(local.x, -0.92, -0.2),
      clamp(local.y, -0.46, -0.1),
      clamp(local.z, -0.44, 0.44),
    );
  }

  private canCarryWorldCollider(collider: WorldCollider): boolean {
    if (this.carriedWorldColliders.has(collider)) {
      return false;
    }
    return this.carriedWorldObjectMass() + collider.mass <= BUCKET_OBJECT_LIFT_LIMIT;
  }

  private tryCarryWorldCollider(collider: WorldCollider): boolean {
    if (!this.canCarryWorldCollider(collider)) {
      return false;
    }

    const local = this.bucketCarryLocalPoint(collider);
    if (!local) {
      return false;
    }

    const world = this.excavator.bucketGroup.localToWorld(local.clone());
    this.carriedWorldColliders.set(collider, local);
    this.carriedWorldPreviousPositions.set(collider, world.clone());
    collider.mesh.position.copy(world);
    collider.velocity.set(0, 0, 0);
    collider.sleeping = false;
    this.pressure = Math.max(this.pressure, clamp(0.18 + collider.mass / BUCKET_OBJECT_LIFT_LIMIT * 0.34, 0, 0.62));
    return true;
  }

  private updateCarriedWorldObjects(dt: number): void {
    if (this.carriedWorldColliders.size === 0) {
      return;
    }

    for (const [collider, local] of this.carriedWorldColliders) {
      const previous = this.carriedWorldPreviousPositions.get(collider) ?? collider.mesh.position.clone();
      const next = this.excavator.bucketGroup.localToWorld(local.clone());
      collider.velocity.copy(next).sub(previous).divideScalar(Math.max(dt, 0.001));
      collider.mesh.position.copy(next);
      collider.mesh.rotation.x += collider.velocity.z * dt * 0.65;
      collider.mesh.rotation.z -= collider.velocity.x * dt * 0.65;
      this.carriedWorldPreviousPositions.set(collider, next.clone());
    }

    this.pressure = Math.max(
      this.pressure,
      clamp(0.1 + this.carriedWorldObjectMass() / BUCKET_OBJECT_LIFT_LIMIT * 0.34, 0, 0.58),
    );
  }

  private releaseCarriedWorldCollider(collider: WorldCollider, extraVelocity?: THREE.Vector3): void {
    const carriedVelocity = collider.velocity.clone();
    this.carriedWorldColliders.delete(collider);
    this.carriedWorldPreviousPositions.delete(collider);
    collider.velocity.copy(carriedVelocity);
    if (extraVelocity) {
      collider.velocity.add(extraVelocity);
    }
    collider.sleeping = false;
  }

  private releaseCarriedWorldObjects(extraVelocity?: THREE.Vector3): void {
    for (const collider of Array.from(this.carriedWorldColliders.keys())) {
      this.releaseCarriedWorldCollider(collider, extraVelocity);
    }
  }

  private updateLooseWorldObjects(dt: number): void {
    const bucket = this.excavator.bucketPocketWorld();
    const machine = this.excavator.group.position;
    for (const collider of this.worldColliders) {
      if (collider.immovable || this.carriedWorldColliders.has(collider)) {
        continue;
      }

      const pos = collider.mesh.position;
      const dxMachine = pos.x - machine.x;
      const dzMachine = pos.z - machine.z;
      const dxBucket = pos.x - bucket.x;
      const dyBucket = pos.y - bucket.y;
      const dzBucket = pos.z - bucket.z;
      const speedSq = collider.velocity.lengthSq();
      const nearActiveMachine =
        dxMachine * dxMachine + dzMachine * dzMachine < 38 ||
        dxBucket * dxBucket + dyBucket * dyBucket + dzBucket * dzBucket < 10;
      if (collider.sleeping && speedSq < 0.0004 && !nearActiveMachine) {
        continue;
      }
      collider.sleeping = false;

      const sample = Math.max(0.24, collider.radius * 2.2);
      const hx = this.terrain.getHeightAt(pos.x + sample, pos.z) - this.terrain.getHeightAt(pos.x - sample, pos.z);
      const hz = this.terrain.getHeightAt(pos.x, pos.z + sample) - this.terrain.getHeightAt(pos.x, pos.z - sample);
      const slopeAccel = clamp(Math.hypot(hx, hz) / Math.max(sample * 2, 0.001), 0, 0.9) * 3.4;
      if (slopeAccel > 0.02) {
        collider.velocity.x += (-hx / Math.max(sample * 2, 0.001)) * slopeAccel * dt;
        collider.velocity.z += (-hz / Math.max(sample * 2, 0.001)) * slopeAccel * dt;
      }

      collider.velocity.y -= 9.81 * dt;
      const airDrag = 1 - Math.min(dt * 0.18, 0.05);
      collider.velocity.multiplyScalar(airDrag);
      pos.addScaledVector(collider.velocity, dt);

      const ground = this.terrain.getHeightAt(pos.x, pos.z) + collider.groundOffset;
      if (pos.y <= ground) {
        pos.y = ground;
        if (collider.velocity.y < -0.05) {
          collider.velocity.y = -collider.velocity.y * collider.restitution;
        } else {
          collider.velocity.y = 0;
        }
        const groundFriction = 1 - Math.min(dt * (1.2 + collider.friction * 3.4), 0.32);
        collider.velocity.x *= groundFriction;
        collider.velocity.z *= groundFriction;
      }

      const horizontalSpeed = Math.hypot(collider.velocity.x, collider.velocity.z);
      if (horizontalSpeed > 0.01) {
        collider.mesh.rotation.x += collider.velocity.z * dt * 1.7;
        collider.mesh.rotation.z -= collider.velocity.x * dt * 1.7;
      }
      if (pos.y <= ground + 0.001 && horizontalSpeed < 0.008 && Math.abs(collider.velocity.y) < 0.008) {
        collider.velocity.set(0, 0, 0);
        collider.sleeping = true;
      }
    }
  }

  private updateExcavatorSupport(dt: number, forward: THREE.Vector3): void {
    const base = this.excavator.group.position;
    const side = new THREE.Vector3(-forward.z, 0, forward.x).normalize();
    const leftCenter = base.clone().addScaledVector(side, -0.72);
    const rightCenter = base.clone().addScaledVector(side, 0.72);
    const left = this.terrain.sampleTrackSupport(leftCenter, forward, side, TRACK_LENGTH, TRACK_WIDTH);
    const right = this.terrain.sampleTrackSupport(rightCenter, forward, side, TRACK_LENGTH, TRACK_WIDTH);
    const frontPoint = base.clone().addScaledVector(forward, TRACK_LENGTH * 0.42);
    const rearPoint = base.clone().addScaledVector(forward, -TRACK_LENGTH * 0.42);
    const frontHeight = this.terrain.getHeightAt(frontPoint.x, frontPoint.z);
    const rearHeight = this.terrain.getHeightAt(rearPoint.x, rearPoint.z);
    const rawSupportHeight = (left.supportHeight + right.supportHeight) * 0.5;
    const contactSpan = Math.max(left.highHeight, right.highHeight) - Math.min(left.lowHeight, right.lowHeight);
    const disturbedDepth = (left.disturbedDepth + right.disturbedDepth) * 0.5;
    const loadFactor = this.bucketLoad / BUCKET_CAPACITY;
    const targetSinkage = clamp(0.012 + disturbedDepth * 0.13 + contactSpan * 0.035 + loadFactor * 0.022, 0.012, 0.24);
    const targetRoll = clamp(Math.atan2(left.supportHeight - right.supportHeight, TRACK_GAUGE), -0.22, 0.22);
    const targetPitch = clamp(Math.atan2(frontHeight - rearHeight, TRACK_LENGTH * 0.84), -0.18, 0.18);

    this.supportHeight = smoothTo(this.supportHeight, rawSupportHeight, 8.5, dt);
    this.chassisSinkage = smoothTo(this.chassisSinkage, targetSinkage, 3.2, dt);
    this.chassisRoll = smoothTo(this.chassisRoll, targetRoll, 4.8, dt);
    this.chassisPitch = smoothTo(this.chassisPitch, targetPitch, 4.8, dt);
    this.excavator.group.position.y = smoothTo(this.excavator.group.position.y, this.supportHeight - this.chassisSinkage, 8.5, dt);
    this.excavator.group.rotation.x = this.chassisRoll;
    this.excavator.group.rotation.z = this.chassisPitch;
  }

  private updateTrackSoilInteraction(dt: number, forward: THREE.Vector3): void {
    const base = this.excavator.group.position;
    const side = new THREE.Vector3(-forward.z, 0, forward.x).normalize();
    for (const [offset, velocity] of [
      [-0.72, this.leftTrackVelocity],
      [0.72, this.rightTrackVelocity],
    ] as const) {
      const trackMotion = Math.abs(velocity);
      if (trackMotion < 0.035) {
        continue;
      }
      const center = base.clone().addScaledVector(side, offset);
      center.y = this.terrain.getHeightAt(center.x, center.z);
      const slip = Math.abs(this.leftTrackVelocity - this.rightTrackVelocity) / Math.max(TRACK_MAX_SPEED * 2, 0.001);
      const soilResistance = this.terrain.getSubsoilResistanceAt(center.x, center.z);
      const surface = this.terrain.getSurfaceConditionAt(center.x, center.z);
      const support = this.terrain.sampleTrackSupport(center, forward, side, TRACK_LENGTH, TRACK_WIDTH);
      const roughness = clamp((support.highHeight - support.lowHeight) * 0.9 + support.disturbedDepth * 0.24, 0, 0.72);
      const depth = clamp(
        (0.006 + trackMotion * dt * 0.055) *
          (1 + slip * 1.45 + roughness * 0.85) *
          surface.trackSinkMultiplier,
        0.002,
        0.052,
      );
      const result = this.terrain.compactTrackStrip(center, forward, side, TRACK_LENGTH, TRACK_WIDTH, depth);
      this.trackSoilWork += result.compacted;
      if (result.compacted > 0) {
        this.pressure = Math.max(
          this.pressure,
          clamp(0.08 + result.rutDrop * 4.8 + slip * 0.18 + soilResistance * 0.12 + surface.wetness * 0.12, 0, 0.88),
        );
      }
    }
  }

  private updateAngles(dt: number): ExcavatorAngles {
    const previousAngles = { ...this.angles };
    this.angles.swing += this.velocities.swing * dt;

    for (const action of ["boom", "stick", "bucket"] as ActionName[]) {
      const previous = this.angles[action];
      const proposed = previous + this.velocities[action] * dt;
      const limit = ANGLE_LIMITS[action];
      const next = clamp(proposed, limit.min, limit.max);
      this.angles[action] = next;
      if (next !== proposed) {
        this.velocities[action] = 0;
        if (Math.abs(this.targetActions[action]) > 0.25 && this.limitCooldown <= 0) {
          this.limitImpacts += 1;
          this.limitCooldown = 0.42;
        }
      }
    }
    return previousAngles;
  }

  private resolveArmTruckCollisions(previousAngles: ExcavatorAngles): {
    collided: boolean;
    blockedActions: ActionName[];
    penetration: number;
  } {
    const samples = this.excavator.armCollisionSamples();
    let maxPenetration = 0;
    const affected = new Set<"boom" | "stick" | "bucket">();

    for (const sample of samples) {
      const hit = this.truck.resolveSolidCollision(sample.point, sample.radius);
      if (!hit) {
        continue;
      }
      maxPenetration = Math.max(maxPenetration, hit.penetration);
      affected.add(sample.action);
    }

    if (affected.size === 0) {
      return { collided: false, blockedActions: [], penetration: 0 };
    }

    const chain = new Set<ActionName>(["swing"]);
    if (affected.has("boom")) {
      chain.add("boom");
    }
    if (affected.has("stick")) {
      chain.add("boom");
      chain.add("stick");
    }
    if (affected.has("bucket")) {
      chain.add("boom");
      chain.add("stick");
      chain.add("bucket");
    }

    const blockedActions: ActionName[] = [];
    for (const action of chain) {
      const delta = this.angles[action] - previousAngles[action];
      if (Math.abs(delta) < 0.00001) {
        continue;
      }
      this.angles[action] = previousAngles[action];
      this.velocities[action] = 0;
      blockedActions.push(action);
    }

    const severity = clamp(maxPenetration * 2.4 + blockedActions.length * 0.12, 0, 1);
    this.pressure = Math.max(this.pressure, clamp(0.44 + severity * 0.56, 0, 1));
    if (this.collisionCooldown <= 0 && (blockedActions.length > 0 || maxPenetration > 0.025)) {
      this.collisionCount += 1;
      this.collisionCooldown = 0.34;
    }
    if (blockedActions.length > 0) {
      this.excavator.applyAngles(this.angles);
    }

    return { collided: true, blockedActions, penetration: maxPenetration };
  }

  private resolveArmWorldObjectCollisions(previousAngles: ExcavatorAngles): {
    collided: boolean;
    movableHit: boolean;
    immovableBlocked: boolean;
    blockedActions: ActionName[];
    penetration: number;
  } {
    const activeMotion =
      Math.abs(this.velocities.swing) +
        Math.abs(this.velocities.boom) +
        Math.abs(this.velocities.stick) +
        Math.abs(this.velocities.bucket) +
        Math.abs(this.leftTrackVelocity) +
        Math.abs(this.rightTrackVelocity) >
      0.012;
    if (!activeMotion) {
      return { collided: false, movableHit: false, immovableBlocked: false, blockedActions: [], penetration: 0 };
    }

    const currentAngles = { ...this.angles };
    const currentSamples = this.excavator.armCollisionSamples();
    this.excavator.applyAngles(previousAngles);
    const previousSamples = this.excavator.armCollisionSamples();
    this.excavator.applyAngles(currentAngles);

    let minX = Infinity;
    let minY = Infinity;
    let minZ = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    let maxZ = -Infinity;
    for (let i = 0; i < currentSamples.length; i += 1) {
      const current = currentSamples[i];
      const previous = previousSamples[i] ?? current;
      const pad = Math.max(current.radius, previous.radius) + ARM_WORLD_BROADPHASE_PADDING;
      minX = Math.min(minX, current.point.x - pad, previous.point.x - pad);
      minY = Math.min(minY, current.point.y - pad, previous.point.y - pad);
      minZ = Math.min(minZ, current.point.z - pad, previous.point.z - pad);
      maxX = Math.max(maxX, current.point.x + pad, previous.point.x + pad);
      maxY = Math.max(maxY, current.point.y + pad, previous.point.y + pad);
      maxZ = Math.max(maxZ, current.point.z + pad, previous.point.z + pad);
    }

    let maxPenetration = 0;
    let maxSeverity = 0;
    let movableHit = false;
    let immovableHit = false;
    const affectedImmovable = new Set<"boom" | "stick" | "bucket">();

    for (const collider of this.worldColliders) {
      if (this.carriedWorldColliders.has(collider)) {
        continue;
      }

      const obstacle = collider.mesh.position;
      const outerRadius = collider.radius + 0.08;
      if (
        obstacle.x + outerRadius < minX ||
        obstacle.x - outerRadius > maxX ||
        obstacle.y + outerRadius < minY ||
        obstacle.y - outerRadius > maxY ||
        obstacle.z + outerRadius < minZ ||
        obstacle.z - outerRadius > maxZ
      ) {
        continue;
      }

      for (let i = 0; i < currentSamples.length; i += 1) {
        const sample = currentSamples[i];
        const previous = previousSamples[i] ?? sample;
        const dx = sample.point.x - obstacle.x;
        const dy = sample.point.y - obstacle.y;
        const dz = sample.point.z - obstacle.z;
        const combinedRadius = sample.radius + collider.radius;
        const distanceSq = dx * dx + dy * dy + dz * dz;
        if (distanceSq >= combinedRadius * combinedRadius) {
          continue;
        }

        const distance = Math.sqrt(Math.max(distanceSq, 0.000001));
        const normalX = distanceSq < 0.000001 ? 1 : dx / distance;
        const normalY = distanceSq < 0.000001 ? 0 : dy / distance;
        const normalZ = distanceSq < 0.000001 ? 0 : dz / distance;
        const penetration = combinedRadius - distance;
        const motionX = sample.point.x - previous.point.x;
        const motionY = sample.point.y - previous.point.y;
        const motionZ = sample.point.z - previous.point.z;
        const approach = Math.max(0, -(motionX * normalX + motionY * normalY + motionZ * normalZ));
        const severity = clamp(penetration * 2.8 + approach * 5.5 + (collider.immovable ? 0.18 : 0), 0, 1);
        maxPenetration = Math.max(maxPenetration, penetration);
        maxSeverity = Math.max(maxSeverity, severity);

        if (collider.immovable) {
          immovableHit = true;
          affectedImmovable.add(sample.action);
          continue;
        }

        movableHit = true;
        if (sample.action === "bucket" && this.tryCarryWorldCollider(collider)) {
          break;
        }

        let pushX = normalX;
        let pushZ = normalZ;
        let pushLenSq = pushX * pushX + pushZ * pushZ;
        if (pushLenSq < 0.0001) {
          pushX = -motionX;
          pushZ = -motionZ;
          pushLenSq = pushX * pushX + pushZ * pushZ;
        }
        if (pushLenSq < 0.0001) {
          pushX = 1;
          pushZ = 0;
          pushLenSq = 1;
        }
        const pushInvLen = 1 / Math.sqrt(pushLenSq);
        pushX *= pushInvLen;
        pushZ *= pushInvLen;

        const impulse = clamp((penetration * 3.2 + approach * 6.0 + 0.06) / Math.max(collider.mass, 0.12), 0.04, 1.9);
        const correction = Math.min(penetration * 0.85, 0.2);
        collider.mesh.position.x -= pushX * correction;
        collider.mesh.position.z -= pushZ * correction;
        collider.velocity.x -= pushX * impulse;
        collider.velocity.z -= pushZ * impulse;
        collider.velocity.y = Math.max(collider.velocity.y, 0.06 + severity * 0.2);
        collider.sleeping = false;
        this.pressure = Math.max(this.pressure, clamp(0.08 + severity * 0.26 + collider.mass * 0.01, 0, 0.55));
        if (collider.crushable && severity > 0.34) {
          collider.mesh.scale.multiplyScalar(1 - Math.min(severity * 0.035, 0.07));
          this.terrain.raiseAt(collider.mesh.position, Math.max(0.14, collider.radius * 1.4), collider.radius * 0.008 * severity, 0);
        }
      }
    }

    const blockedActions: ActionName[] = [];
    if (immovableHit) {
      const chain = new Set<ActionName>(["swing"]);
      if (affectedImmovable.has("boom")) {
        chain.add("boom");
      }
      if (affectedImmovable.has("stick")) {
        chain.add("boom");
        chain.add("stick");
      }
      if (affectedImmovable.has("bucket")) {
        chain.add("boom");
        chain.add("stick");
        chain.add("bucket");
      }

      for (const action of chain) {
        const delta = this.angles[action] - previousAngles[action];
        if (Math.abs(delta) < 0.00001) {
          continue;
        }
        this.angles[action] = previousAngles[action];
        this.velocities[action] = 0;
        blockedActions.push(action);
      }
      if (blockedActions.length > 0) {
        this.excavator.applyAngles(this.angles);
      }
    }

    if (maxSeverity > 0.08) {
      this.pressure = Math.max(this.pressure, clamp(0.32 + maxSeverity * 0.58, 0, 1));
      if (this.collisionCooldown <= 0 && (blockedActions.length > 0 || movableHit || maxPenetration > 0.025)) {
        this.collisionCount += 1;
        this.collisionCooldown = 0.34;
      }
    }

    return {
      collided: movableHit || immovableHit,
      movableHit,
      immovableBlocked: blockedActions.length > 0,
      blockedActions,
      penetration: maxPenetration,
    };
  }

  private resolveArmTerrainResistance(previousAngles: ExcavatorAngles): {
    resisted: boolean;
    blockedActions: ActionName[];
    maxSubmerged: number;
    averageSubmerged: number;
    drag: number;
  } {
    const currentAngles = { ...this.angles };
    const currentSamples = this.excavator.armSubsoilSamples();
    this.excavator.applyAngles(previousAngles);
    const previousSamples = this.excavator.armSubsoilSamples();
    this.excavator.applyAngles(currentAngles);

    let maxSubmerged = 0;
    let weightedSubmerged = 0;
    let pushingIntoSoil = 0;
    let submergedMotion = 0;
    let materialLoad = 0;
    let contactCount = 0;
    let structuralMaxSubmerged = 0;
    let structuralIntrusion = 0;
    let bucketMaxSubmerged = 0;
    let bucketIntrusion = 0;
    const affected = new Set<"boom" | "stick" | "bucket">();
    const bucketCuttingMotion = Math.max(0, -this.velocities.bucket) > 0.035 || Math.max(0, -this.velocities.stick) > 0.045;

    for (let i = 0; i < currentSamples.length; i += 1) {
      const sample = currentSamples[i];
      const previous = previousSamples[i] ?? sample;
      const ground = this.terrain.getHeightAt(sample.point.x, sample.point.z);
      const submerged = clamp(ground - (sample.point.y - sample.radius * 0.62), 0, 1.35);
      if (submerged <= 0.001) {
        continue;
      }

      const motion = sample.point.clone().sub(previous.point);
      const verticalIntrusion = Math.max(0, -motion.y);
      const horizontalMotion = Math.hypot(motion.x, motion.z);
      const slope = this.terrain.getSlopeAt(sample.point.x, sample.point.z);
      const subsoil = this.terrain.getSubsoilResistanceAt(sample.point.x, sample.point.z);
      const localIntrusion = verticalIntrusion + horizontalMotion * clamp(slope, 0, 1.4) * 0.34;
      const isBucket = sample.action === "bucket";
      const cuttingBucketContact = isBucket && bucketCuttingMotion;
      const yieldingScale = cuttingBucketContact ? 0.42 : 1;
      const weighted = submerged * (1 + subsoil * 0.42) * yieldingScale;
      const intrusionLoad = localIntrusion * yieldingScale;
      const motionLoad = (verticalIntrusion + horizontalMotion) * (cuttingBucketContact ? 0.55 : 1);

      maxSubmerged = Math.max(maxSubmerged, submerged);
      weightedSubmerged += weighted;
      pushingIntoSoil += intrusionLoad;
      submergedMotion += motionLoad;
      materialLoad += subsoil * yieldingScale;
      contactCount += 1;
      affected.add(sample.action);
      if (isBucket) {
        bucketMaxSubmerged = Math.max(bucketMaxSubmerged, submerged);
        bucketIntrusion += localIntrusion;
      } else {
        structuralMaxSubmerged = Math.max(structuralMaxSubmerged, submerged);
        structuralIntrusion += localIntrusion;
      }
    }

    if (contactCount === 0) {
      return { resisted: false, blockedActions: [], maxSubmerged: 0, averageSubmerged: 0, drag: 1 };
    }

    const averageSubmerged = weightedSubmerged / contactCount;
    const averageMaterialLoad = materialLoad / contactCount;
    const severity = clamp(
      maxSubmerged * 1.18 +
        averageSubmerged * 0.58 +
        pushingIntoSoil * 5.4 +
        submergedMotion * 1.2 +
        averageMaterialLoad * 0.08,
      0,
      1,
    );
    const drag = 1;

    const hasSubmergedMotion = submergedMotion > 0.004;
    if (!hasSubmergedMotion) {
      return { resisted: false, blockedActions: [], maxSubmerged, averageSubmerged, drag: 1 };
    }

    const blockedActions: ActionName[] = [];

    this.pressure = Math.max(this.pressure, clamp(0.22 + severity * 0.74, 0, 1));
    if (this.collisionCooldown <= 0 && severity > 0.92) {
      this.collisionCount += 1;
      this.collisionCooldown = 0.34;
    }

    return { resisted: true, blockedActions, maxSubmerged, averageSubmerged, drag };
  }

  private updateSoil(dt: number): void {
    const tip = this.excavator.bucketTipWorld();
    const pocket = this.excavator.bucketPocketWorld();
    const edgePoints = this.excavator.bucketCuttingEdgeWorld();
    const sideways = this.excavator.bucketSidewaysWorld();
    const slope = this.terrain.getSlopeAt(tip.x, tip.z);
    const subsoilResistance = this.terrain.getSubsoilResistanceAt(tip.x, tip.z);
    const tipSpeed = tip.distanceTo(this.previousBucketTip) / Math.max(dt, 0.001);
    const forward = this.excavator.bucketForwardWorld();
    let maxPenetration = 0;
    let contactCount = 0;

    for (const point of edgePoints) {
      const ground = this.terrain.getHeightAt(point.x, point.z);
      const penetration = ground + 0.14 - point.y;
      if (penetration > 0) {
        maxPenetration = Math.max(maxPenetration, penetration);
        contactCount += 1;
      }
    }

    const contactRatio = contactCount / edgePoints.length;
    const attackAngle = Math.asin(clamp(-forward.y, -1, 1));
    const attackEfficiency = clamp((attackAngle - 0.18) / 0.78, 0.08, 1);
    const curlInSpeed = Math.max(0, -this.velocities.bucket);
    const stickPullSpeed = Math.max(0, -this.velocities.stick);
    const isDiggingMotion =
      curlInSpeed > 0.06 ||
      stickPullSpeed > 0.06 ||
      tipSpeed > 0.18;

    if (contactRatio > 0 && isDiggingMotion) {
      const penetration = clamp(maxPenetration, 0.01, 0.72);
      const loadRatio = this.bucketLoad / BUCKET_CAPACITY;
      const resistance = clamp(
        penetration * 2.15 +
          contactRatio * 0.26 +
          slope * 0.36 +
          loadRatio * 0.34 +
          subsoilResistance * 0.42 +
          (1 - attackEfficiency) * 0.22,
        0.1,
        1.35,
      );
      this.pressure = Math.max(this.pressure, clamp(resistance / 1.25, 0, 1));
    }

    if (contactRatio > 0 && isDiggingMotion && this.bucketLoad + this.bucketTransitLoad < BUCKET_CAPACITY) {
      const freeCapacity = BUCKET_CAPACITY - this.bucketLoad - this.bucketTransitLoad;
      const penetration = clamp(maxPenetration, 0.01, 0.9);
      const bite = clamp(
        (curlInSpeed * 0.9 + stickPullSpeed * 0.42 + tipSpeed * 0.32 + 0.22) *
          attackEfficiency *
          (0.5 + contactRatio * 0.5),
        0.05,
        1.55,
      );
      const digDepth = clamp(
        ((penetration * 0.68 + Math.min(tipSpeed, 1.8) * 0.055) * bite * dt * 3.7) / (1 + subsoilResistance * 0.42),
        0.004,
        0.24,
      );
      const removed = this.terrain.excavateSweptBucket(
        this.previousBucketTip,
        tip,
        sideways,
        1.08,
        digDepth,
        freeCapacity,
      );
      const airborneFines = removed * clamp(0.045 + tipSpeed * 0.012 + (1 - attackEfficiency) * 0.02, 0.045, 0.11);
      const bucketAccepted = Math.min(freeCapacity, Math.max(0, removed - airborneFines));
      const spill = Math.max(0, removed - airborneFines - bucketAccepted);
      this.totalExcavated += removed;
      if (removed > 0) {
        this.pressure = Math.max(this.pressure, clamp(0.42 + removed * 1.8 + contactRatio * 0.22, 0, 1));
        if (bucketAccepted > 0.001) {
          const directCaptureRatio = clamp(0.42 + attackEfficiency * 0.22 + curlInSpeed * 0.08 + contactRatio * 0.08, 0.38, 0.72);
          const directCapture = Math.min(bucketAccepted, bucketAccepted * directCaptureRatio);
          const flowVolume = bucketAccepted - directCapture;
          this.bucketLoad += directCapture;
          if (flowVolume > 0.001) {
            this.bucketTransitLoad += flowVolume;
            this.spawnCuttingFlow(edgePoints, pocket, flowVolume);
          }
        } else {
          this.bucketLoad += bucketAccepted;
        }
        if (airborneFines > 0.001) {
          this.spawnFineGrains(edgePoints[0], airborneFines, forward.clone().multiplyScalar(-1).add(new THREE.Vector3(0, 0.35, 0)), true, 1.35);
        }
        if (spill > 0.001) {
          this.spawnSoilParticles(pocket, spill, forward.clone().multiplyScalar(-0.25).add(new THREE.Vector3(0, -0.45, 0)), 0.28);
        }
      }
    }

    if (contactRatio > 0 && isDiggingMotion && this.bucketLoad + this.bucketTransitLoad >= BUCKET_CAPACITY * 0.985) {
      const displacementDepth = clamp(maxPenetration * (0.035 + tipSpeed * 0.025), 0.002, 0.045);
      const displaced = this.terrain.displaceSweptBucket(
        this.previousBucketTip,
        tip,
        sideways,
        1.16,
        displacementDepth,
        0.08 * (0.35 + contactRatio),
      );
      if (displaced > 0) {
        this.pressure = Math.max(this.pressure, clamp(0.72 + displaced * 2.6, 0, 1));
      }
    }

    const openFactor = clamp((this.angles.bucket + 0.58) / (ANGLE_LIMITS.bucket.max + 0.58), 0, 1);
    const dumpIntent = openFactor > 0.02 || this.velocities.bucket > 0.12;
    if ((openFactor > 0.08 || this.velocities.bucket > 0.18) && this.carriedWorldColliders.size > 0) {
      const releaseVelocity = forward
        .clone()
        .multiplyScalar(0.28 + openFactor * 0.86)
        .add(new THREE.Vector3(0, -0.3 - openFactor * 0.72, 0));
      this.releaseCarriedWorldObjects(releaseVelocity);
    }
    if (dumpIntent && this.bucketLoad > 0.002) {
      const dumpRate = (0.1 + openFactor * openFactor * 1.45 + Math.max(0, this.velocities.bucket) * 0.95) * dt;
      const dumped = Math.min(this.bucketLoad, dumpRate);
      this.bucketLoad -= dumped;
      const fineVolume = dumped * clamp(0.035 + openFactor * 0.055, 0.035, 0.1);
      const coarseVolume = Math.max(0, dumped - fineVolume);
      this.spawnSoilParticles(pocket, coarseVolume, forward, openFactor);
      this.spawnFineGrains(pocket, fineVolume, forward.clone().add(new THREE.Vector3(0, -0.35 - openFactor, 0)), true, 1.05 + openFactor);
    }

    this.excavator.setBucketLoad(this.bucketLoad);
    this.truck.updateLoad(this.truckLoad);
    this.previousBucketTip.copy(tip);
  }

  private spawnCuttingFlow(edgePoints: THREE.Vector3[], pocket: THREE.Vector3, volume: number): void {
    if (volume <= 0) {
      return;
    }
    const count = clamp(Math.ceil(volume * 28), 3, 12);
    const perParticle = volume / count;
    for (let i = 0; i < count; i += 1) {
      if (this.soilParticles.length > 140) {
        const oldest = this.soilParticles.shift();
        if (oldest) {
          this.depositParticle(oldest);
        }
      }
      const source = edgePoints[i % edgePoints.length].clone();
      source.add(new THREE.Vector3((Math.random() - 0.5) * 0.16, 0.025 + Math.random() * 0.08, (Math.random() - 0.5) * 0.16));
      const radius = clamp(0.028 + Math.cbrt(perParticle) * 0.055 + Math.random() * 0.018, 0.03, 0.1);
      const mesh = this.acquireSoilParticleMesh(
        radius,
        this.looseSoilMats[(i + this.soilParticles.length) % this.looseSoilMats.length],
        i + Math.round(perParticle * 1000),
      );
      mesh.position.copy(source);
      const target = pocket.clone().add(new THREE.Vector3((Math.random() - 0.5) * 0.18, (Math.random() - 0.5) * 0.08, (Math.random() - 0.5) * 0.28));
      const flightTime = 0.32 + Math.random() * 0.12;
      const velocity = target
        .clone()
        .sub(source)
        .divideScalar(flightTime)
        .add(new THREE.Vector3((Math.random() - 0.5) * 0.18, 0.5 * 9.81 * flightTime, (Math.random() - 0.5) * 0.18));
      this.soilParticles.push({ mesh, velocity, volume: perParticle, life: 0, settles: false, target, toBucket: true });
    }
  }

  private spawnSoilParticles(origin: THREE.Vector3, volume: number, bucketForward: THREE.Vector3, openFactor: number): void {
    if (volume <= 0) {
      return;
    }
    const count = clamp(Math.ceil(volume * 24), 2, 14);
    const perParticle = volume / count;
    const flowDirection =
      bucketForward.lengthSq() > 0.0001 ? bucketForward.clone().normalize() : new THREE.Vector3(0, -1, 0);
    const horizontal = new THREE.Vector3(flowDirection.x, 0, flowDirection.z);
    const sideways =
      horizontal.lengthSq() > 0.0001 ? new THREE.Vector3(-horizontal.z, 0, horizontal.x).normalize() : new THREE.Vector3(1, 0, 0);

    for (let i = 0; i < count; i += 1) {
      if (this.soilParticles.length > 140) {
        const oldest = this.soilParticles.shift();
        if (oldest) {
          this.depositParticle(oldest);
        }
      }
      const radius = clamp(0.04 + Math.cbrt(perParticle) * 0.08, 0.04, 0.13);
      const mesh = this.acquireSoilParticleMesh(
        radius,
        this.looseSoilMats[(i + this.soilParticles.length) % this.looseSoilMats.length],
        i * 7 + Math.round(perParticle * 1000),
      );
      const jitter = new THREE.Vector3((Math.random() - 0.5) * 0.36, (Math.random() - 0.5) * 0.1, (Math.random() - 0.5) * 0.52);
      mesh.position.copy(origin).add(jitter);

      const velocity = flowDirection
        .clone()
        .multiplyScalar(0.24 + openFactor * 0.76)
        .addScaledVector(sideways, (Math.random() - 0.5) * 0.8)
        .add(new THREE.Vector3(0, -0.45 - openFactor * 1.15, 0));
      this.soilParticles.push({ mesh, velocity, volume: perParticle, life: 0, settles: true });
    }
  }

  private acquireSoilParticleMesh(radius: number, material: THREE.Material, seed: number): THREE.Mesh {
    const mesh = this.soilParticlePool.pop() ?? new THREE.Mesh(this.pooledSoilGeometry, material);
    const squash = 0.72 + hash2(seed, 11) * 0.28;
    const stretchX = 0.82 + hash2(seed, 17) * 0.36;
    const stretchZ = 0.82 + hash2(seed, 23) * 0.36;

    mesh.material = material;
    mesh.visible = true;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.scale.set(radius * stretchX, radius * squash, radius * stretchZ);
    mesh.rotation.set(hash2(seed, 31) * Math.PI, hash2(seed, 37) * Math.PI, hash2(seed, 41) * Math.PI);
    this.scene.add(mesh);
    return mesh;
  }

  private recycleSoilParticle(particle: SoilParticle): void {
    const mesh = particle.mesh;
    this.scene.remove(mesh);
    mesh.visible = false;
    mesh.position.set(0, -1000, 0);
    mesh.rotation.set(0, 0, 0);
    mesh.scale.set(1, 1, 1);
    mesh.material = this.looseSoilMats[0];
    if (this.soilParticlePool.length < this.soilParticlePoolLimit) {
      this.soilParticlePool.push(mesh);
    }
  }

  private spawnFineGrains(origin: THREE.Vector3, volume: number, direction: THREE.Vector3, settles: boolean, burst = 1): void {
    if (volume <= 0) {
      return;
    }

    const count = clamp(Math.ceil(volume * 56 * burst), 6, 36);
    const perGrain = volume / count;
    const baseDirection = direction.clone();
    if (baseDirection.lengthSq() < 0.0001) {
      baseDirection.set(1, 0, 0);
    }
    baseDirection.normalize();
    const side = new THREE.Vector3(-baseDirection.z, 0, baseDirection.x).normalize();

    for (let i = 0; i < count; i += 1) {
      const idx = this.fineGrainCursor;
      this.fineGrainCursor = (this.fineGrainCursor + 1) % this.fineGrainMax;
      if (this.fineGrainMaxLife[idx] > 0 && this.fineGrainVolumes[idx] > 0) {
        this.depositFineGrain(idx);
      }
      const p = idx * 3;
      const spray = 0.08 + Math.random() * 0.22;
      this.fineGrainPositions[p] = origin.x + (Math.random() - 0.5) * 0.22;
      this.fineGrainPositions[p + 1] = origin.y + (Math.random() - 0.5) * 0.1;
      this.fineGrainPositions[p + 2] = origin.z + (Math.random() - 0.5) * 0.22;
      this.fineGrainVelocities[p] = baseDirection.x * spray + side.x * (Math.random() - 0.5) * 0.9;
      this.fineGrainVelocities[p + 1] =
        (settles ? -0.08 : 0.22) + baseDirection.y * (0.28 + Math.random() * 0.42) + (Math.random() - 0.5) * 0.34;
      this.fineGrainVelocities[p + 2] = baseDirection.z * spray + side.z * (Math.random() - 0.5) * 0.9;
      this.fineGrainLife[idx] = 0;
      this.fineGrainMaxLife[idx] = settles ? 0.85 + Math.random() * 0.75 : 0.38 + Math.random() * 0.28;
      this.fineGrainSettles[idx] = settles ? 1 : 0;
      this.fineGrainVolumes[idx] = perGrain;
    }

    (this.fineGrainGeometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
  }

  private updateFineGrains(dt: number): void {
    let changed = false;

    for (let i = 0; i < this.fineGrainMax; i += 1) {
      if (this.fineGrainMaxLife[i] <= 0) {
        continue;
      }

      const p = i * 3;
      this.fineGrainLife[i] += dt;
      const settles = this.fineGrainSettles[i] === 1;
      const damping = 1 - Math.min(dt * (settles ? 0.34 : 1.45), 0.12);
      this.fineGrainVelocities[p + 1] -= (settles ? 9.81 : 2.2) * dt;
      this.fineGrainVelocities[p] *= damping;
      this.fineGrainVelocities[p + 1] *= damping;
      this.fineGrainVelocities[p + 2] *= damping;
      this.fineGrainPositions[p] += this.fineGrainVelocities[p] * dt;
      this.fineGrainPositions[p + 1] += this.fineGrainVelocities[p + 1] * dt;
      this.fineGrainPositions[p + 2] += this.fineGrainVelocities[p + 2] * dt;
      changed = true;

      const ground = this.terrain.getHeightAt(this.fineGrainPositions[p], this.fineGrainPositions[p + 2]);
      const inTruck =
        this.fineGrainSettles[i] === 1 &&
        this.truck.containsWorldPoint(new THREE.Vector3(this.fineGrainPositions[p], this.fineGrainPositions[p + 1], this.fineGrainPositions[p + 2])) &&
        this.fineGrainPositions[p + 1] < TRUCK_CENTER.y + 1.72;
      if (
        this.fineGrainLife[i] > this.fineGrainMaxLife[i] ||
        inTruck ||
        (settles && this.fineGrainPositions[p + 1] <= ground + 0.025)
      ) {
        if (this.fineGrainVolumes[i] > 0) {
          this.depositFineGrain(i);
        }
        this.deactivateFineGrain(i);
      }
    }

    if (changed) {
      (this.fineGrainGeometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    }
  }

  private deactivateFineGrain(i: number): void {
    const p = i * 3;
    this.fineGrainMaxLife[i] = 0;
    this.fineGrainLife[i] = 0;
    this.fineGrainVolumes[i] = 0;
    this.fineGrainPositions[p] = 0;
    this.fineGrainPositions[p + 1] = -999;
    this.fineGrainPositions[p + 2] = 0;
    this.fineGrainVelocities[p] = 0;
    this.fineGrainVelocities[p + 1] = 0;
    this.fineGrainVelocities[p + 2] = 0;
  }

  private depositFineGrain(i: number): void {
    const volume = this.fineGrainVolumes[i];
    if (volume <= 0) {
      return;
    }
    const p = i * 3;
    const pos = new THREE.Vector3(this.fineGrainPositions[p], this.fineGrainPositions[p + 1], this.fineGrainPositions[p + 2]);
    const inTruck = this.truck.containsWorldPoint(pos) && pos.y < TRUCK_CENTER.y + 1.72;
    if (inTruck) {
      const accepted = this.truck.depositSoilAt(pos, volume, TRUCK_CAPACITY - this.truckLoad);
      this.truckLoad = Math.min(TRUCK_CAPACITY, this.truckLoad + accepted);
      if (accepted < volume) {
        this.terrain.raiseAt(new THREE.Vector3(pos.x, 0, pos.z), 0.18, volume - accepted, 0);
      }
    } else {
      const ground = this.terrain.getHeightAt(pos.x, pos.z);
      const settleRadius = Math.max(this.terrain.spacing * 0.62, 0.14 + Math.cbrt(volume) * 0.08);
      this.terrain.raiseAt(new THREE.Vector3(pos.x, ground, pos.z), settleRadius, volume, 0);
    }
    this.fineGrainSettledVolume += volume;
    this.truck.updateLoad(this.truckLoad);
    this.fineGrainVolumes[i] = 0;
  }

  private clearFineGrains(): void {
    for (let i = 0; i < this.fineGrainMax; i += 1) {
      this.deactivateFineGrain(i);
    }
    (this.fineGrainGeometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
  }

  private fineGrainCount(): number {
    let count = 0;
    for (let i = 0; i < this.fineGrainMax; i += 1) {
      if (this.fineGrainMaxLife[i] > 0) {
        count += 1;
      }
    }
    return count;
  }

  private activeFineGrainVolume(): number {
    let volume = 0;
    for (let i = 0; i < this.fineGrainMax; i += 1) {
      if (this.fineGrainMaxLife[i] > 0) {
        volume += this.fineGrainVolumes[i];
      }
    }
    return volume;
  }

  private updateSoilParticles(dt: number): void {
    for (let i = this.soilParticles.length - 1; i >= 0; i -= 1) {
      const particle = this.soilParticles[i];
      particle.life += dt;

      if (!particle.settles) {
        if (particle.toBucket) {
          particle.velocity.y -= 9.81 * dt;
          particle.velocity.multiplyScalar(1 - Math.min(dt * 0.36, 0.08));
        } else if (particle.target) {
          const desired = particle.target.clone().sub(particle.mesh.position).multiplyScalar(3.4);
          particle.velocity.lerp(desired, 1 - Math.exp(-8.5 * dt));
        }
        particle.mesh.position.addScaledVector(particle.velocity, dt);
        particle.mesh.rotation.x += particle.velocity.z * dt * 3.2;
        particle.mesh.rotation.z -= particle.velocity.x * dt * 3.2;
        if (!particle.toBucket) {
          particle.mesh.scale.multiplyScalar(1 - Math.min(dt * 1.5, 0.055));
        }
        const pos = particle.mesh.position;
        const ground = this.terrain.getHeightAt(pos.x, pos.z);
        const reached =
          particle.toBucket
            ? this.isBucketParticleCaptured(particle)
            : particle.target
              ? pos.distanceTo(particle.target) < 0.08
              : false;
        const grounded = particle.toBucket && pos.y <= ground + 0.045;
        const expired = particle.life > (particle.toBucket ? 2.2 : 0.7);
        if (reached || grounded || expired) {
          this.soilParticles.splice(i, 1);
          if (particle.toBucket) {
            if (reached) {
              this.captureParticleIntoBucket(particle);
            } else {
              this.releaseTransitParticleToWorld(particle);
            }
          }
          this.recycleSoilParticle(particle);
        }
        continue;
      }

      particle.velocity.y -= 9.81 * dt;
      particle.velocity.multiplyScalar(1 - Math.min(dt * 0.22, 0.08));
      particle.mesh.position.addScaledVector(particle.velocity, dt);
      particle.mesh.rotation.x += particle.velocity.z * dt;
      particle.mesh.rotation.z -= particle.velocity.x * dt;

      const pos = particle.mesh.position;
      const ground = this.terrain.getHeightAt(pos.x, pos.z);
      const inTruck = this.truck.containsWorldPoint(pos) && pos.y < TRUCK_CENTER.y + 1.72;
      const hitGround = pos.y <= ground + 0.05;
      if (inTruck || hitGround || particle.life > 5.5) {
        this.soilParticles.splice(i, 1);
        if (inTruck) {
          const accepted = this.truck.depositSoilAt(pos, particle.volume, TRUCK_CAPACITY - this.truckLoad);
          this.truckLoad = Math.min(TRUCK_CAPACITY, this.truckLoad + accepted);
          if (accepted < particle.volume) {
            this.terrain.raiseAt(new THREE.Vector3(pos.x, 0, pos.z), 0.42, particle.volume - accepted, 1);
          }
        } else {
          this.terrain.raiseAt(new THREE.Vector3(pos.x, 0, pos.z), 0.38 + Math.cbrt(particle.volume) * 0.12, particle.volume, 1);
        }
        this.recycleSoilParticle(particle);
      }
    }
  }

  private isBucketParticleCaptured(particle: SoilParticle): boolean {
    const pos = particle.mesh.position;
    const pocket = this.excavator.bucketPocketWorld();
    return pos.distanceTo(pocket) < 0.42 || Boolean(particle.target && pos.distanceTo(particle.target) < 0.26);
  }

  private captureParticleIntoBucket(particle: SoilParticle): void {
    const volume = Math.max(0, particle.volume);
    this.bucketTransitLoad = Math.max(0, this.bucketTransitLoad - volume);
    if (volume <= 0) {
      return;
    }
    const accepted = Math.min(volume, Math.max(0, BUCKET_CAPACITY - this.bucketLoad));
    this.bucketLoad += accepted;
    if (accepted < volume) {
      const pos = particle.mesh.position;
      this.terrain.raiseAt(new THREE.Vector3(pos.x, 0, pos.z), 0.34 + Math.cbrt(volume - accepted) * 0.1, volume - accepted, 1);
    }
    this.excavator.setBucketLoad(this.bucketLoad);
  }

  private releaseTransitParticleToWorld(particle: SoilParticle): void {
    const volume = Math.max(0, particle.volume);
    this.bucketTransitLoad = Math.max(0, this.bucketTransitLoad - volume);
    if (volume <= 0) {
      return;
    }
    const pos = particle.mesh.position;
    if (this.truck.containsWorldPoint(pos)) {
      const accepted = this.truck.depositSoilAt(pos, volume, TRUCK_CAPACITY - this.truckLoad);
      this.truckLoad = Math.min(TRUCK_CAPACITY, this.truckLoad + accepted);
      if (accepted < volume) {
        this.terrain.raiseAt(new THREE.Vector3(pos.x, 0, pos.z), 0.36, volume - accepted, 1);
      }
    } else {
      this.terrain.raiseAt(new THREE.Vector3(pos.x, 0, pos.z), 0.32 + Math.cbrt(volume) * 0.1, volume, 1);
    }
    this.truck.updateLoad(this.truckLoad);
  }

  private updatePassiveSoil(dt: number): void {
    this.soilSettleAccumulator += dt;
    if (this.soilSettleAccumulator < 0.22) {
      return;
    }
    this.soilSettleAccumulator = 0;
    this.terrain.settleAt(DIG_SITE, 2.6, 1);
    const tip = this.excavator.bucketTipWorld();
    this.terrain.settleAt(tip, 1.15, 1);
    if (this.truckLoad > 0.02) {
      this.truck.settleLoad(1);
    }
  }

  private depositParticle(particle: SoilParticle): void {
    if (particle.toBucket) {
      if (this.isBucketParticleCaptured(particle)) {
        this.captureParticleIntoBucket(particle);
      } else {
        this.releaseTransitParticleToWorld(particle);
      }
      this.recycleSoilParticle(particle);
      return;
    }

    const pos = particle.mesh.position;
    if (this.truck.containsWorldPoint(pos)) {
      const accepted = this.truck.depositSoilAt(pos, particle.volume, TRUCK_CAPACITY - this.truckLoad);
      this.truckLoad = Math.min(TRUCK_CAPACITY, this.truckLoad + accepted);
      if (accepted < particle.volume) {
        this.terrain.raiseAt(new THREE.Vector3(pos.x, 0, pos.z), 0.42, particle.volume - accepted, 1);
      }
    } else {
      this.terrain.raiseAt(new THREE.Vector3(pos.x, 0, pos.z), 0.38 + Math.cbrt(particle.volume) * 0.12, particle.volume, 1);
    }
    this.recycleSoilParticle(particle);
  }

  private updateSafety(dt: number): void {
    const tip = this.excavator.bucketTipWorld();
    const pin = this.excavator.bucketPinWorld();
    const reach = Math.hypot(tip.x, tip.z);
    const loadMoment = reach * (0.4 + this.bucketLoad);
    this.stability = smoothTo(this.stability, clamp(1.15 - loadMoment / 10.0, 0, 1), 2.5, dt);

    const nearWorker =
      Math.hypot(tip.x - WORKER_ZONE.x, tip.z - WORKER_ZONE.z) < 1.1 ||
      Math.hypot(pin.x - WORKER_ZONE.x, pin.z - WORKER_ZONE.z) < 1.1;
    if (nearWorker && Math.min(tip.y, pin.y) < 2.2 && this.safetyCooldown <= 0) {
      this.safetyViolations += 1;
      this.safetyCooldown = 1.2;
    }

    if (nearWorker) {
      this.lastWarning = "작업 반경 안전구역 접근";
    } else if (this.stability < 0.28) {
      this.lastWarning = "장비 안정성 저하: 적재 상태에서 팔을 접거나 붐을 올리세요";
    } else if (this.limitCooldown > 0.25) {
      this.lastWarning = "관절 제한 충격";
    } else if (this.truckLoad >= TRUCK_CAPACITY) {
      this.lastWarning = "트럭 적재 완료";
    } else if (this.bucketLoad >= BUCKET_CAPACITY * 0.96) {
      this.lastWarning = "버킷 만재";
    } else {
      this.lastWarning = "";
    }
  }

  private updateCamera(dt: number): void {
    const bucketTip = this.excavator.bucketTipWorld();
    const target = new THREE.Vector3(0, 0.9, 0).lerp(bucketTip, 0.25);
    const desiredPosition = new THREE.Vector3();
    const desiredLook = new THREE.Vector3();

    if (this.cameraMode === "cab") {
      desiredPosition.copy(this.excavator.cabCameraWorld());
      desiredLook.copy(this.excavator.cabLookWorld()).lerp(bucketTip, 0.22);
    } else if (this.cameraMode === "bucket") {
      const forward = this.excavator.bucketForwardWorld();
      desiredPosition.copy(bucketTip).addScaledVector(forward, -1.6).add(new THREE.Vector3(0, 0.7, 0));
      desiredLook.copy(bucketTip).addScaledVector(forward, 0.8);
    } else if (this.cameraMode === "task") {
      desiredPosition.set(6.7, 6.1, 7.2);
      desiredLook.set(0.7, 0.7, -0.2).lerp(bucketTip, 0.18);
    } else {
      const x = Math.cos(this.orbit.azimuth) * Math.cos(this.orbit.elevation) * this.orbit.distance;
      const y = Math.sin(this.orbit.elevation) * this.orbit.distance + 1.8;
      const z = Math.sin(this.orbit.azimuth) * Math.cos(this.orbit.elevation) * this.orbit.distance;
      desiredPosition.copy(target).add(new THREE.Vector3(x, y, z));
      desiredLook.copy(target);
    }

    const factor = 1 - Math.exp(-7.5 * dt);
    this.camera.position.lerp(desiredPosition, factor);
    this.cameraLookTarget.lerp(desiredLook, factor);
    this.camera.lookAt(this.cameraLookTarget);
  }

  private updateUi(dt: number): void {
    const loadRatio = clamp(this.truckLoad / TRUCK_CAPACITY, 0, 1);
    this.ui.truckLoadText.textContent = `${Math.round(loadRatio * 100)}%`;
    this.ui.truckLoadBar.style.width = `${loadRatio * 100}%`;
    const activeMotion =
      Math.abs(this.leftTrackVelocity) > 0.04 ||
      Math.abs(this.rightTrackVelocity) > 0.04 ||
      Math.max(Math.abs(this.velocities.swing), Math.abs(this.velocities.boom), Math.abs(this.velocities.stick), Math.abs(this.velocities.bucket)) > 0.025;
    this.ui.missionState.textContent =
      loadRatio >= 1
        ? "작업 완료"
        : this.bucketLoad > 0.2
          ? "버킷 적재"
          : activeMotion
            ? "작동 중"
            : "대기";

    this.ui.pressureMeter.value = this.pressure;
    this.ui.bucketMeter.value = clamp(this.bucketLoad / BUCKET_CAPACITY, 0, 1);
    this.ui.stabilityMeter.value = this.stability;
    this.ui.timeText.textContent = fmtTime(this.elapsed);
    this.ui.soilText.textContent = `${this.totalExcavated.toFixed(1)} m³`;
    this.ui.limitText.textContent = String(this.limitImpacts);
    this.ui.safetyText.textContent = String(this.safetyViolations);
    this.ui.idleText.textContent = `${Math.round((this.idleSeconds / Math.max(this.elapsed, 1)) * 100)}%`;
    this.ui.travelText.textContent = `${this.travelDistance.toFixed(1)} m`;
    const travelSpeed = (this.leftTrackVelocity + this.rightTrackVelocity) * 0.5;
    const turnRate = (this.rightTrackVelocity - this.leftTrackVelocity) / TRACK_GAUGE;
    if (Math.abs(travelSpeed) > 0.05 && Math.abs(turnRate) > 0.1) {
      this.ui.travelDirectionText.textContent = travelSpeed > 0 ? "전진 선회" : "후진 선회";
    } else if (travelSpeed > 0.05) {
      this.ui.travelDirectionText.textContent = "전진";
    } else if (travelSpeed < -0.05) {
      this.ui.travelDirectionText.textContent = "후진";
    } else if (turnRate > 0.1) {
      this.ui.travelDirectionText.textContent = "좌피벗";
    } else if (turnRate < -0.1) {
      this.ui.travelDirectionText.textContent = "우피벗";
    } else {
      this.ui.travelDirectionText.textContent = "중립";
    }
    this.ui.swingText.textContent = `${radToDeg(this.angles.swing)}°`;
    this.ui.boomText.textContent = `${radToDeg(this.angles.boom)}°`;
    this.ui.stickText.textContent = `${radToDeg(this.angles.stick)}°`;
    this.ui.bucketText.textContent = `${radToDeg(this.angles.bucket)}°`;

    this.ui.keyCaps.forEach((cap) => {
      const key = cap.dataset.key ?? "";
      cap.classList.toggle("active", this.keys.has(key));
    });

    this.fpsAccumulator += dt;
    this.fpsFrames += 1;
    if (this.fpsAccumulator >= 0.35) {
      this.fps = Math.round(this.fpsFrames / this.fpsAccumulator);
      this.fpsAccumulator = 0;
      this.fpsFrames = 0;
      this.ui.fpsText.textContent = String(this.fps);
    }

    this.ui.warningStrip.textContent = this.lastWarning;
    this.ui.warningStrip.classList.toggle("hidden", this.lastWarning.length === 0);
  }

  private updatePatternLabels(): void {
    if (this.pattern === "ISO") {
      this.ui.leftStickLabelY.textContent = "W/S Stick";
      this.ui.leftStickLabelX.textContent = "A/D Swing";
      this.ui.rightStickLabelY.textContent = "↑/↓ Boom";
      this.ui.rightStickLabelX.textContent = "← Scoop / → Dump";
    } else if (this.pattern === "SAE") {
      this.ui.leftStickLabelY.textContent = "W/S Boom";
      this.ui.leftStickLabelX.textContent = "A/D Swing";
      this.ui.rightStickLabelY.textContent = "↑/↓ Stick";
      this.ui.rightStickLabelX.textContent = "← Scoop / → Dump";
    } else {
      this.ui.leftStickLabelY.textContent = "W/S Boom";
      this.ui.leftStickLabelX.textContent = "A/D Swing";
      this.ui.rightStickLabelY.textContent = "↑/↓ Reach";
      this.ui.rightStickLabelX.textContent = "← Scoop / → Dump";
    }
  }

  private resize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  private isSimKey(code: string): boolean {
    return (
      code === "KeyW" ||
      code === "KeyA" ||
      code === "KeyS" ||
      code === "KeyD" ||
      code === "KeyB" ||
      code === "KeyG" ||
      code === "KeyN" ||
      code === "KeyH" ||
      code === "ArrowUp" ||
      code === "ArrowDown" ||
      code === "ArrowLeft" ||
      code === "ArrowRight"
    );
  }
}

new Simulator();
