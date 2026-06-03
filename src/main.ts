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
  radius: number;
  life: number;
  settles: boolean;
  target?: THREE.Vector3;
  toBucket?: boolean;
}

type WorldColliderKind = "fence" | "boulder" | "rock" | "clod" | "twig" | "cone" | "pipe";

interface CrawlerFootprintSample {
  x: number;
  z: number;
  radius: number;
  track: "left" | "right";
  padIndex: number;
  isEnd: boolean;
}

interface WorldColliderCapsule {
  localA: THREE.Vector3;
  localB: THREE.Vector3;
  radius: number;
}

interface WorldCollider {
  id: number;
  mesh: THREE.Object3D;
  kind: WorldColliderKind;
  radius: number;
  capsule?: WorldColliderCapsule;
  mass: number;
  immovable: boolean;
  crushable: boolean;
  restitution: number;
  friction: number;
  groundOffset: number;
  velocity: THREE.Vector3;
  angularVelocity: THREE.Vector3;
  sleeping: boolean;
  groundLoadCooldown: number;
  initialPosition: THREE.Vector3;
  initialQuaternion: THREE.Quaternion;
  initialScale: THREE.Vector3;
  gridStamp: number;
}

interface ObjectFootprintCompaction {
  compacted: number;
  rutDrop: number;
  bermRise: number;
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
  impactImpulse: number;
  impactPitch: number;
  impactRoll: number;
}

interface TruckCrawlerContactResult {
  contact: boolean;
  contactCount: number;
  cornerContacts: number;
  maxPenetration: number;
  minApproachSpeed: number;
  leftBlocked: boolean;
  rightBlocked: boolean;
}

interface CrawlerWorldObjectContactResult {
  contact: boolean;
  contactCount: number;
  trackContactCount: number;
  cornerContacts: number;
  centerContact: boolean;
  maxPenetration: number;
  minApproachSpeed: number;
  movedCount: number;
  movedMass: number;
  leftImpulse: number;
  rightImpulse: number;
}

interface TrackTractionState {
  leftTraction: number;
  rightTraction: number;
  leftSlip: number;
  rightSlip: number;
  leftGroundSpeed: number;
  rightGroundSpeed: number;
  leftRoughness: number;
  rightRoughness: number;
  leftGrade: number;
  rightGrade: number;
}

interface ArmCollisionSample {
  key?: string;
  action: "boom" | "stick" | "bucket";
  point: THREE.Vector3;
  radius: number;
}

interface UpperCollisionSample {
  key: string;
  point: THREE.Vector3;
  radius: number;
}

interface TurntableCollisionShape {
  center: THREE.Vector3;
  radius: number;
  halfHeight: number;
}

interface ArmTerrainResistanceSample extends ArmCollisionSample {
  key: string;
}

interface BucketLoadSurfaceHit {
  normal: THREE.Vector3;
  penetration: number;
  surfacePoint: THREE.Vector3;
  surfaceY: number;
  loadHeight: number;
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
    truckImpactImpulse: number;
    truckImpactPitch: number;
    truckImpactRoll: number;
    trackTraction: TrackTractionState;
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
    soilTruckPenetrationBefore: number;
    soilTruckPenetrationAfter: number;
    soilObjectImpulse: number;
    soilPairDistanceBefore: number;
    soilPairDistanceAfter: number;
    soilPairVelocityDelta: number;
  };
  forceFullBucketPush: () => { displaced: number; bucketLoad: number; centerDrop: number; bermRise: number };
  forceCuttingFlowPhysics: () => {
    spawnedVolume: number;
    capturedVolume: number;
    transitRemaining: number;
    gravityDelta: number;
    excavatorSoilPenetrationBefore: number;
    excavatorSoilPenetrationAfter: number;
    excavatorSoilTravel: number;
    excavatorSoilVelocity: number;
    collisionReleasedVolume: number;
    obstacleImpulse: number;
    obstacleTravel: number;
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
  forceBucketLoadSurfacePhysics: () => {
    bucketLoad: number;
    surfaceHeight: number;
    surfaceNormalY: number;
    loadCenterShiftX: number;
    loadCenterShiftZ: number;
    loadHeightConserved: number;
    loadLipRatio: number;
    loadSlumpMoved: number;
    soilPenetrationBefore: number;
    soilPenetrationAfter: number;
    capturedVolume: number;
    objectPenetrationBefore: number;
    objectPenetrationAfter: number;
    objectTravel: number;
    objectVelocity: number;
    loadBeforeSpill: number;
    spilledVolume: number;
    loadAfterSpill: number;
    spillHeightDrop: number;
    spillVolumeConserved: number;
    pressure: number;
  };
  forceBucketShellPhysics: () => {
    bucketSampleCount: number;
    floorPenetrationBefore: number;
    floorPenetrationAfter: number;
    floorTravel: number;
    sidePenetrationBefore: number;
    sidePenetrationAfter: number;
    sideTravel: number;
    toothPenetrationBefore: number;
    toothPenetrationAfter: number;
    toothTravel: number;
    pressure: number;
  };
  forceHydraulicLinkagePhysics: () => {
    sampleCount: number;
    subsoilSampleCount: number;
    pinSampleCount: number;
    movableHit: boolean;
    pinObjectHit: boolean;
    objectPenetrationBefore: number;
    objectPenetrationAfter: number;
    objectTravel: number;
    objectVelocity: number;
    pinObjectPenetrationBefore: number;
    pinObjectPenetrationAfter: number;
    pinObjectTravel: number;
    pinObjectVelocity: number;
    pressure: number;
    collisionCount: number;
    subsoilResisted: boolean;
    subsoilMaxSubmerged: number;
    subsoilAverageSubmerged: number;
  };
  forceTrackPass: () => { compacted: number; rutDrop: number; bermRise: number; trackSoilWork: number };
  forceTrackTractionPhysics: () => {
    mudTraction: number;
    hardTraction: number;
    mudSlip: number;
    hardSlip: number;
    mudGroundSpeed: number;
    hardGroundSpeed: number;
    mudRutDrop: number;
    hardRutDrop: number;
    mudDragMultiplier: number;
    hardDragMultiplier: number;
  };
  forceTruckCollision: () => {
    beforeX: number;
    afterX: number;
    blocked: boolean;
    sideBeforeZ: number;
    sideAfterZ: number;
    sideBlocked: boolean;
    diagonalBeforeX: number;
    diagonalBeforeZ: number;
    diagonalAfterX: number;
    diagonalAfterZ: number;
    diagonalBlocked: boolean;
    elevatedFalseContact: boolean;
    openBedEnvelopePenetration: number;
    openBedSolidPenetration: number;
    chassisSolidPenetration: number;
    wheelSolidPenetration: number;
    frontContact: TruckCrawlerContactResult;
    sideContact: TruckCrawlerContactResult;
    diagonalContact: TruckCrawlerContactResult;
    collisionCount: number;
    pressure: number;
  };
  forceTruckImpactPhysics: () => {
    crawlerContact: boolean;
    crawlerBlocked: boolean;
    crawlerImpactImpulse: number;
    objectImpactImpulse: number;
    soilImpactImpulse: number;
    bodyPitchDelta: number;
    bodyRollDelta: number;
    impactPitch: number;
    impactRoll: number;
    truckStayedPut: boolean;
  };
  forceTruckWheelPhysics: () => {
    wheelPenetrationBefore: number;
    wheelPenetrationAfter: number;
    solidPenetrationBefore: number;
    objectTravel: number;
    objectImpulse: number;
    objectVelocity: number;
    soilPenetrationBefore: number;
    soilPenetrationAfter: number;
    soilImpactImpulse: number;
    truckImpactImpulse: number;
  };
  forceUpperStructurePhysics: () => {
    truckCollided: boolean;
    truckBlocked: boolean;
    swingBefore: number;
    swingAfter: number;
    velocityAfter: number;
    truckImpactImpulse: number;
    truckPenetration: number;
    objectHit: boolean;
    objectTravel: number;
    objectImpulse: number;
    movedMass: number;
    upperSampleCount: number;
    exhaustSamplePresent: boolean;
    exhaustObjectHit: boolean;
    exhaustObjectTravel: number;
    exhaustObjectImpulse: number;
    pressure: number;
    collisionCount: number;
  };
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
    sweptOnlyCurrentPenetration: number;
    sweptOnlyPenetration: number;
    sweptOnlySteps: number;
    sweptOnlyT: number;
  };
  forceArmSubsoilResistance: () => {
    resisted: boolean;
    blocked: boolean;
    beforeStick: number;
    afterStick: number;
    velocityAfter: number;
    maxSubmerged: number;
    averageSubmerged: number;
    displacedVolume: number;
    surfaceDrop: number;
    bermRise: number;
    terrainDelta: number;
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
    carriedTruckReleased: boolean;
    carriedTruckPenetrationBefore: number;
    carriedTruckPenetrationAfter: number;
    carriedTerrainReleased: boolean;
    carriedTerrainPenetrationBefore: number;
    carriedTerrainPenetrationAfter: number;
    carriedTerrainImpactSpeed: number;
    carriedExcavatorReleased: boolean;
    carriedExcavatorPenetrationBefore: number;
    carriedExcavatorPenetrationAfter: number;
    carriedExcavatorImpactSpeed: number;
    carriedObjectImpulse: number;
    heavyOrientationDelta: number;
    bucketOrientationDelta: number;
    orientationDeltaError: number;
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
    loadCenterShiftX: number;
    loadCenterShiftZ: number;
    loadHeightConserved: number;
    loadSlumpMoved: number;
    loadSurfaceHeight: number;
    loadSurfaceNormalY: number;
    loadSurfacePenetrationBefore: number;
    loadSurfacePenetrationAfter: number;
    loadSurfaceObjectTravel: number;
    loadSurfaceObjectImpulse: number;
    loadSurfaceObjectVelocity: number;
    spilledVolume: number;
    loadAfterSpill: number;
    spillTerrainGain: number;
    loadHeightDropFromSpill: number;
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
  forceExcavatorPayloadSupport: () => {
    unloadedPitch: number;
    loadedPitch: number;
    sideRoll: number;
    unloadedSinkage: number;
    loadedSinkage: number;
    carriedMass: number;
    pressure: number;
  };
  forceWorldObjectPhysics: () => {
    debrisTravel: number;
    hardTravel: number;
    railTravel: number;
    debrisAngularSpeed: number;
    hardAngularSpeed: number;
    railAngularSpeed: number;
    excavatorPenetrationBefore: number;
    excavatorPenetrationAfter: number;
    excavatorObjectTravel: number;
    excavatorObjectVelocity: number;
    turntablePenetrationBefore: number;
    turntablePenetrationAfter: number;
    turntableObjectTravel: number;
    turntableObjectVelocity: number;
    pipeSphereFalsePenetration: number;
    pipeCapsuleFalsePenetration: number;
    pipeCapsuleHitBefore: number;
    pipeCapsuleHitAfter: number;
    pipePairSphereFalsePenetration: number;
    pipePairCapsuleFalsePenetration: number;
    pipePairCapsuleHitBefore: number;
    pipePairCapsuleHitAfter: number;
    pipeTruckCapsuleHitBefore: number;
    pipeTruckCapsuleHitAfter: number;
    pipeExcavatorCapsuleHitBefore: number;
    pipeExcavatorCapsuleHitAfter: number;
    crawlerSampleCount: number;
    trackContactCount: number;
    cornerContacts: number;
    movedMass: number;
    leftImpulse: number;
    rightImpulse: number;
    centerContact: boolean;
    elevatedFalseContact: boolean;
    truckPenetrationBefore: number;
    truckPenetrationAfter: number;
    pairDistanceBefore: number;
    pairDistanceAfter: number;
    pairAngularSpeed: number;
    softGroundDrop: number;
    hardGroundDrop: number;
    softRutDrop: number;
    hardRutDrop: number;
    objectBermRise: number;
    collisionCount: number;
    pressure: number;
  };
  forceTerrainChangeWakesObjects: () => {
    sleptBefore: boolean;
    wokeFromCut: number;
    wokeFromRaise: number;
    groundDrop: number;
    fallDistance: number;
    liftDelta: number;
    capsuleTerrainPenetrationBefore: number;
    capsuleTerrainPenetrationAfter: number;
    capsuleTerrainLift: number;
    capsuleTerrainSlopeKick: number;
    finalSleeping: boolean;
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
    outerWetness: number;
    basaltHardpack: number;
    outerHaulCompaction: number;
    materialZones: number;
    roughSlope: number;
    farColliderCount: number;
    colliderKinds: number;
    pipeCount: number;
  };
  forceFineGrainSettlement: () => {
    spawnedVolume: number;
    settledVolume: number;
    activeAfter: number;
    terrainGain: number;
    fineObjectImpulse: number;
    fineObjectTravel: number;
    fineObjectPenetrationBefore: number;
    fineObjectPenetrationAfter: number;
    excavatorFinePenetrationBefore: number;
    excavatorFinePenetrationAfter: number;
    excavatorFineTravel: number;
    excavatorFineVelocity: number;
    finePairDistanceBefore: number;
    finePairDistanceAfter: number;
    finePairVelocityDelta: number;
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
  forceDeepExcavation: () => {
    beforeHeight: number;
    afterHeight: number;
    removed: number;
    depthReached: number;
    shallowResistance: number;
    deepResistance: number;
    bedrockFloor: number;
    terrainDrag: number;
  };
  forceLiftableObjectAudit: () => {
    worldColliderCount: number;
    liftableCount: number;
    blockedCount: number;
    heaviestLiftableMass: number;
    boulderLifted: boolean;
    boulderLiftHeight: number;
    fenceLifted: boolean;
    fenceLiftHeight: number;
    pipeEndpointLifted: boolean;
    pipeEndpointLiftHeight: number;
    pipeEndpointCenterOffset: number;
    truckStillBlocks: boolean;
  };
  forceLagFreeSoilCycle: () => {
    averageStepMs: number;
    maxStepMs: number;
    particleCount: number;
    fineGrainCount: number;
    worldColliderCount: number;
    nearbyCandidates: number;
    terrainDrag: number;
    bucketLoad: number;
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
const TRACK_CONTACT_HEIGHT = 0.28;
const CRAWLER_BODY_CONTACT_HEIGHT = 0.72;
const TRACK_MAX_SPEED = 1.25;
const TRACK_PAD_COUNT = 14;
const TRACK_PAD_START_X = -1.7;
const TRACK_PAD_SPACING = 0.26;
const TURNTABLE_RADIUS = 1.02;
const TURNTABLE_HEIGHT = 0.24;
const TURNTABLE_CENTER_Y = 0.74;
const SOIL_REPOSE_TAN = Math.tan(THREE.MathUtils.degToRad(34));
const SOIL_BEDROCK_FLOOR = -5.2;
const DIG_SITE = new THREE.Vector3(-4.1, 0, 2.3);
const TRUCK_CENTER = new THREE.Vector3(7.2, 0, -3.8);
const WORKER_ZONE = new THREE.Vector3(2.0, 0, 2.15);
const BUCKET_OBJECT_LOAD_REFERENCE = 24;
const ARM_WORLD_BROADPHASE_PADDING = 0.82;
const WORLD_COLLIDER_GRID_SIZE = 2.4;
const WORLD_COLLIDER_WAKE_LIMIT = 12;
const WORLD_COLLIDER_PAIR_ACTIVE_LIMIT = 18;
const SOIL_PARTICLE_SOFT_LIMIT = 6;
const SOIL_PARTICLE_HARD_LIMIT = 9;
const SOIL_PARTICLE_COLLISION_QUERY_PADDING = 0.28;
const FINE_GRAIN_COLLISION_QUERY_PADDING = 0.18;
const SOIL_DYNAMIC_COLLISION_BUDGET = 1;
const FINE_GRAIN_DYNAMIC_COLLISION_BUDGET = 1;
const MOBILE_SOIL_DYNAMIC_COLLISION_BUDGET = 0;
const MOBILE_FINE_GRAIN_DYNAMIC_COLLISION_BUDGET = 0;
const SOIL_PAIR_GRID_SIZE = 0.34;
const FINE_GRAIN_PAIR_GRID_SIZE = 0.14;
const DESKTOP_PIXEL_RATIO_LIMIT = 1.75;
const MOBILE_PIXEL_RATIO_LIMIT = 1.25;

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
  readonly size = 128;
  readonly segments = 288;
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

    const grid = new THREE.GridHelper(this.size, 64, 0x6e796c, 0x495045);
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
    const bedrockPressure = clamp((height - SOIL_BEDROCK_FLOOR) / 1.35, 0, 1);
    const hardLayer = 1 - bedrockPressure;
    const surface = this.getSurfaceConditionAt(x, z);
    return clamp(
      (0.18 + disturbedDepth * 0.42 + hardLayer * 0.82 + this.getSlopeAt(x, z) * 0.16) *
        surface.bucketResistanceMultiplier,
      0.05,
      2.25,
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
    const farWetland =
      0.92 *
      Math.exp(-((x - 52.0) ** 2 / 78.0 + (z + 42.0) ** 2 / 48.0));
    const basaltShelf =
      0.86 *
      Math.exp(-((x + 52.0) ** 2 / 70.0 + (z - 42.0) ** 2 / 52.0));
    const outerHaulRoad =
      Math.exp(-((z + 38.0) ** 2 / 2.2)) *
      clamp(1 - Math.abs(x - 42.0) / 28.0, 0, 1);
    const roadCompaction = Math.max(haulRoad, farHaulRoad, outerHaulRoad);
    const wetness = clamp(mudFlat + drainageMud + outerWetland + farWetland + 0.16 * (1 - roadCompaction), 0, 1);
    const gravel = clamp(gravelRidge + gravelFan + hardBench * 0.45 + limestoneBench * 0.36 + basaltShelf * 0.74, 0, 1);
    const hardpack = clamp(haulRoad * 0.82 + farHaulRoad * 0.78 + outerHaulRoad * 0.86 + gravel * 0.5 + hardBench + limestoneBench + basaltShelf, 0, 1);
    const compaction = clamp(roadCompaction * 0.9 + hardpack * 0.5 - wetness * 0.22, 0, 1);
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
      this.relaxSlopes(range, 1);
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
      this.relaxSlopes(range, 1);
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

  compactObjectFootprint(center: THREE.Vector3, radius: number, mass: number, impactSpeed: number, dt: number): ObjectFootprintCompaction {
    const footprintRadius = Math.max(0.12, radius);
    const surface = this.getSurfaceConditionAt(center.x, center.z);
    const disturbedDepth = this.getDisturbedDepthAt(center.x, center.z);
    const bearingArea = Math.PI * footprintRadius * footprintRadius;
    const bearingStress = Math.max(0, mass) / Math.max(bearingArea, 0.018);
    const yieldFactor = clamp(
      0.18 + surface.wetness * 1.08 + disturbedDepth * 0.26 + (1 - surface.hardpack) * 0.24 - surface.compaction * 0.26,
      0.05,
      1.45,
    );
    const impactFactor = clamp(0.28 + Math.max(0, impactSpeed) * 0.55 + dt * 0.9, 0.18, 1.15);
    const targetDepth = clamp(bearingStress * yieldFactor * impactFactor * 0.00072, 0, Math.min(0.038, footprintRadius * 0.13));
    if (targetDepth <= 0.00008) {
      return { compacted: 0, rutDrop: 0, bermRise: 0 };
    }

    const bermRadius = footprintRadius * 1.72;
    const range = this.gridRange(center.x, center.z, bermRadius + this.spacing);
    const cellArea = this.spacing * this.spacing;
    const bermWeights: Array<[number, number]> = [];
    let compacted = 0;
    let weightedDrop = 0;
    let dropWeight = 0;
    let bermWeightTotal = 0;

    for (let iz = range.minZ; iz <= range.maxZ; iz += 1) {
      for (let ix = range.minX; ix <= range.maxX; ix += 1) {
        const idx = this.index(ix, iz);
        const x = -this.size / 2 + ix * this.spacing;
        const z = -this.size / 2 + iz * this.spacing;
        const dist = Math.hypot(x - center.x, z - center.z);
        if (dist <= footprintRadius) {
          const falloff = Math.pow(1 - dist / footprintRadius, 1.55);
          const maxLower = Math.max(0, this.heights[idx] - SOIL_BEDROCK_FLOOR);
          const delta = Math.min(targetDepth * (0.35 + falloff * 0.65), maxLower);
          if (delta > 0) {
            this.heights[idx] -= delta;
            compacted += delta * cellArea;
            weightedDrop += delta * (0.35 + falloff);
            dropWeight += 0.35 + falloff;
          }
        } else if (dist <= bermRadius) {
          const ringT = (dist - footprintRadius) / Math.max(bermRadius - footprintRadius, 0.001);
          const weight = Math.pow(Math.sin(Math.PI * ringT), 1.4);
          if (weight > 0.001) {
            bermWeights.push([idx, weight]);
            bermWeightTotal += weight;
          }
        }
      }
    }

    if (compacted <= 0) {
      return { compacted: 0, rutDrop: 0, bermRise: 0 };
    }

    const beforeBermHeight = this.getHeightAt(center.x + footprintRadius * 1.18, center.z);
    const displacedVolume = compacted * clamp(0.1 + surface.wetness * 0.12 + Math.max(0, impactSpeed) * 0.025 - surface.hardpack * 0.06, 0.06, 0.24);
    if (bermWeightTotal > 0 && displacedVolume > 0) {
      for (const [idx, weight] of bermWeights) {
        this.heights[idx] += (displacedVolume * weight) / bermWeightTotal / cellArea;
      }
    }

    this.relaxSlopes(range, 1);
    const afterBermHeight = this.getHeightAt(center.x + footprintRadius * 1.18, center.z);
    return {
      compacted,
      rutDrop: dropWeight > 0 ? weightedDrop / dropWeight : targetDepth,
      bermRise: Math.max(0, afterBermHeight - beforeBermHeight),
    };
  }

  settleAt(center: THREE.Vector3, radius: number, passes = 1): void {
    this.relaxSlopes(this.gridRange(center.x, center.z, radius), passes);
  }

  raiseAt(center: THREE.Vector3, radius: number, volume: number, relaxPasses = 2): number {
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
    const farWetland =
      -0.24 *
      Math.exp(-((x - 52.0) ** 2 / 78.0 + (z + 42.0) ** 2 / 48.0));
    const basaltShelf =
      0.3 *
      Math.exp(-((x + 52.0) ** 2 / 70.0 + (z - 42.0) ** 2 / 52.0));
    const outerHaulRoad =
      -0.085 *
      Math.exp(-((z + 38.0) ** 2 / 2.2)) *
      clamp(1 - Math.abs(x - 42.0) / 28.0, 0, 1);
    const outerCut =
      -0.18 *
      Math.exp(-((x - 47.0) ** 2 / 38.0 + (z - 45.0) ** 2 / 58.0));
    const farSpoilRidge =
      0.2 *
      Math.exp(-((x - 54.0) ** 2 / 30.0 + (z - 18.0) ** 2 / 92.0)) *
      (0.66 + 0.34 * Math.cos(z * 0.36));
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
      farWetland +
      basaltShelf +
      outerHaulRoad +
      outerCut +
      farSpoilRidge +
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
    this.updateNormalsForRange(range);
  }

  private updateNormalsForRange(range: { minX: number; maxX: number; minZ: number; maxZ: number }): void {
    const normal = this.geometry.attributes.normal as THREE.BufferAttribute;
    const normalRange = this.expandRange(range, 1);

    for (let iz = normalRange.minZ; iz <= normalRange.maxZ; iz += 1) {
      for (let ix = normalRange.minX; ix <= normalRange.maxX; ix += 1) {
        const leftIx = Math.max(0, ix - 1);
        const rightIx = Math.min(this.segments, ix + 1);
        const downIz = Math.max(0, iz - 1);
        const upIz = Math.min(this.segments, iz + 1);
        const left = this.heights[this.index(leftIx, iz)];
        const right = this.heights[this.index(rightIx, iz)];
        const down = this.heights[this.index(ix, downIz)];
        const up = this.heights[this.index(ix, upIz)];
        const dx = Math.max((rightIx - leftIx) * this.spacing, this.spacing);
        const dz = Math.max((upIz - downIz) * this.spacing, this.spacing);
        const slopeX = (right - left) / dx;
        const slopeZ = (up - down) / dz;
        const nx = -slopeX;
        const ny = 1;
        const nz = -slopeZ;
        const invLen = 1 / Math.hypot(nx, ny, nz);
        normal.setXYZ(this.index(ix, iz), nx * invLen, ny * invLen, nz * invLen);
      }
    }

    normal.needsUpdate = true;
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
    impactImpulse: 0,
    impactPitch: 0,
    impactRoll: 0,
  };
  private impactImpulse = 0;
  private impactPitch = 0;
  private impactRoll = 0;
  private impactLift = 0;

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
      impactImpulse: 0,
      impactPitch: 0,
      impactRoll: 0,
    };
    this.impactImpulse = 0;
    this.impactPitch = 0;
    this.impactRoll = 0;
    this.impactLift = 0;
    this.updatePhysics(terrain, 0, 1, false);
  }

  physicsState(): TruckPhysicsState {
    return {
      ...this.truckPhysics,
      impactImpulse: this.impactImpulse,
      impactPitch: this.impactPitch,
      impactRoll: this.impactRoll,
    };
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
    const targetPitch = clamp((rearAverage - frontAverage) / wheelBase + loadCenter.x * loadRatio * 0.045 + this.impactPitch, -0.2, 0.2);
    const targetRoll = clamp((leftAverage - rightAverage) / axleWidth + loadCenter.z * loadRatio * 0.055 + this.impactRoll, -0.18, 0.18);
    const response = dt <= 0 ? 1 : 1 - Math.exp(-5.2 * dt);
    const targetY = groundAverage - targetSag + this.impactLift;
    this.group.position.y = THREE.MathUtils.lerp(this.group.position.y, targetY, response);
    this.group.rotation.x = THREE.MathUtils.lerp(this.group.rotation.x, targetRoll, response);
    this.group.rotation.y = this.baseYaw;
    this.group.rotation.z = THREE.MathUtils.lerp(this.group.rotation.z, targetPitch, response);
    if (loadRatio > 0.025 && dt > 0) {
      this.slumpLoadUnderGravity(dt, 0.55 + loadRatio * 0.65 + clamp(Math.abs(this.impactPitch) + Math.abs(this.impactRoll), 0, 0.18) * 2.2);
    }
    const impactDecay = dt <= 0 ? 1 : Math.exp(-3.8 * dt);
    this.impactPitch *= impactDecay;
    this.impactRoll *= impactDecay;
    this.impactLift *= impactDecay;
    this.impactImpulse *= dt <= 0 ? 1 : Math.exp(-5.4 * dt);

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
      impactImpulse: this.impactImpulse,
      impactPitch: this.impactPitch,
      impactRoll: this.impactRoll,
    };
    return this.physicsState();
  }

  applyImpact(worldPoint: THREE.Vector3, worldNormal: THREE.Vector3, impulse: number): TruckPhysicsState {
    const impulseMagnitude = clamp(impulse, 0, 5.5);
    if (impulseMagnitude <= 0) {
      return this.physicsState();
    }
    const localPoint = this.group.worldToLocal(worldPoint.clone());
    const inverseTruckRotation = this.group.quaternion.clone().invert();
    const localNormal = worldNormal.clone().normalize().applyQuaternion(inverseTruckRotation);
    const forceX = -localNormal.x;
    const forceY = -localNormal.y;
    const forceZ = -localNormal.z;
    const pointX = clamp(localPoint.x / 2.7, -1, 1);
    const pointZ = clamp(localPoint.z / 1.28, -1, 1);
    const pitchImpulse = clamp((forceX * 0.035 + pointX * Math.abs(forceY) * 0.026) * impulseMagnitude, -0.11, 0.11);
    const rollImpulse = clamp((forceZ * 0.042 + pointZ * Math.abs(forceY) * 0.03) * impulseMagnitude, -0.12, 0.12);
    this.impactPitch = clamp(this.impactPitch + pitchImpulse, -0.14, 0.14);
    this.impactRoll = clamp(this.impactRoll + rollImpulse, -0.15, 0.15);
    this.impactLift = clamp(Math.max(this.impactLift, Math.abs(forceY) * impulseMagnitude * 0.018), 0, 0.08);
    this.impactImpulse = clamp(this.impactImpulse + impulseMagnitude, 0, 8);
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
    const maxLoadHeight = this.loadMesh.visible ? this.loadDistributionStats().maxHeight : 0;
    const minY = 0.16;
    const maxY = 1.7 + Math.min(maxLoadHeight, 0.95);
    if (local.y + radius < minY || local.y - radius > maxY) {
      return null;
    }
    const verticalPenetration = Math.min(local.y + radius - minY, maxY - (local.y - radius));
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
      penetration = Math.min(radius - distance, verticalPenetration + radius * 0.35);
    } else {
      const distances = [
        { value: local.x - minX, normal: new THREE.Vector3(-1, 0, 0) },
        { value: maxX - local.x, normal: new THREE.Vector3(1, 0, 0) },
        { value: local.z - minZ, normal: new THREE.Vector3(0, 0, -1) },
        { value: maxZ - local.z, normal: new THREE.Vector3(0, 0, 1) },
      ].sort((a, b) => a.value - b.value);
      localNormal = distances[0].normal;
      penetration = Math.min(radius + distances[0].value, verticalPenetration + radius * 0.35);
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

    const wheelHit = this.resolveWheelSolidCollision(local, radius);
    if (wheelHit && (!best || wheelHit.penetration > best.penetration)) {
      best = {
        normal: wheelHit.normal.applyQuaternion(this.group.quaternion).normalize(),
        penetration: wheelHit.penetration,
      };
    }

    const loadHit = this.resolveLoadSolidCollision(local, radius);
    if (loadHit && (!best || loadHit.penetration > best.penetration)) {
      best = {
        normal: loadHit.normal.applyQuaternion(this.group.quaternion).normalize(),
        penetration: loadHit.penetration,
      };
    }

    return best;
  }

  resolveWheelCollision(worldPoint: THREE.Vector3, radius: number): { normal: THREE.Vector3; penetration: number } | null {
    const local = this.group.worldToLocal(worldPoint.clone());
    const wheelHit = this.resolveWheelSolidCollision(local, radius);
    if (!wheelHit) {
      return null;
    }
    return {
      normal: wheelHit.normal.applyQuaternion(this.group.quaternion).normalize(),
      penetration: wheelHit.penetration,
    };
  }

  private resolveWheelSolidCollision(local: THREE.Vector3, radius: number): { normal: THREE.Vector3; penetration: number } | null {
    let best: { normal: THREE.Vector3; penetration: number } | null = null;
    const tireRadius = 0.36;
    const halfTireWidth = 0.18;

    for (const wheel of this.wheelLocals) {
      const center = new THREE.Vector3(wheel.x, 0.32, wheel.z);
      const closest = new THREE.Vector3(center.x, center.y, clamp(local.z, center.z - halfTireWidth, center.z + halfTireWidth));
      const delta = local.clone().sub(closest);
      const distanceSq = delta.lengthSq();
      const combined = tireRadius + radius;
      if (distanceSq >= combined * combined) {
        continue;
      }

      const distance = Math.sqrt(Math.max(distanceSq, 0.000001));
      const normal = distanceSq < 0.000001 ? new THREE.Vector3(0, 1, 0) : delta.divideScalar(distance);
      const penetration = combined - distance;
      if (!best || penetration > best.penetration) {
        best = { normal, penetration };
      }
    }

    return best;
  }

  resolveLoadCollision(
    worldPoint: THREE.Vector3,
    radius: number,
  ): { normal: THREE.Vector3; penetration: number; surfaceY: number; loadHeight: number } | null {
    const local = this.group.worldToLocal(worldPoint.clone());
    const loadHit = this.resolveLoadSolidCollision(local, radius);
    if (!loadHit) {
      return null;
    }
    const surfaceWorld = this.group.localToWorld(new THREE.Vector3(local.x, loadHit.surfaceY, local.z));
    return {
      normal: loadHit.normal.applyQuaternion(this.group.quaternion).normalize(),
      penetration: loadHit.penetration,
      surfaceY: surfaceWorld.y,
      loadHeight: loadHit.loadHeight,
    };
  }

  loadSurfaceAtWorld(worldPoint: THREE.Vector3): { point: THREE.Vector3; normal: THREE.Vector3; loadHeight: number } | null {
    const local = this.group.worldToLocal(worldPoint.clone());
    const sample = this.sampleLoadSurfaceLocal(local.x, local.z);
    if (!sample) {
      return null;
    }
    return {
      point: this.group.localToWorld(new THREE.Vector3(local.x, sample.surfaceY, local.z)),
      normal: sample.normal.applyQuaternion(this.group.quaternion).normalize(),
      loadHeight: sample.loadHeight,
    };
  }

  private resolveLoadSolidCollision(
    local: THREE.Vector3,
    radius: number,
  ): { normal: THREE.Vector3; penetration: number; surfaceY: number; loadHeight: number } | null {
    const sample = this.sampleLoadSurfaceLocal(local.x, local.z);
    if (!sample || sample.loadHeight <= 0.012 || local.y < this.bedFloorY - radius * 0.65) {
      return null;
    }

    const penetration = sample.surfaceY + radius - local.y;
    if (penetration <= 0) {
      return null;
    }
    return {
      normal: sample.normal,
      penetration,
      surfaceY: sample.surfaceY,
      loadHeight: sample.loadHeight,
    };
  }

  private sampleLoadSurfaceLocal(localX: number, localZ: number): { surfaceY: number; loadHeight: number; normal: THREE.Vector3 } | null {
    if (!this.loadMesh.visible) {
      return null;
    }

    const minX = this.bedCenterX - this.bedLength / 2;
    const maxX = this.bedCenterX + this.bedLength / 2;
    const minZ = -this.bedWidth / 2;
    const maxZ = this.bedWidth / 2;
    if (localX < minX || localX > maxX || localZ < minZ || localZ > maxZ) {
      return null;
    }

    const gx = clamp(((localX - minX) / this.bedLength) * this.loadSegmentsX, 0, this.loadSegmentsX - 0.000001);
    const gz = clamp(((localZ - minZ) / this.bedWidth) * this.loadSegmentsZ, 0, this.loadSegmentsZ - 0.000001);
    const ix = Math.floor(gx);
    const iz = Math.floor(gz);
    const fx = gx - ix;
    const fz = gz - iz;
    const ix1 = Math.min(ix + 1, this.loadSegmentsX);
    const iz1 = Math.min(iz + 1, this.loadSegmentsZ);
    const h00 = this.loadHeights[this.loadIndex(ix, iz)];
    const h10 = this.loadHeights[this.loadIndex(ix1, iz)];
    const h01 = this.loadHeights[this.loadIndex(ix, iz1)];
    const h11 = this.loadHeights[this.loadIndex(ix1, iz1)];
    const h0 = THREE.MathUtils.lerp(h00, h10, fx);
    const h1 = THREE.MathUtils.lerp(h01, h11, fx);
    const loadHeight = THREE.MathUtils.lerp(h0, h1, fz);
    const stepX = this.bedLength / this.loadSegmentsX;
    const stepZ = this.bedWidth / this.loadSegmentsZ;
    const dHeightDx = (THREE.MathUtils.lerp(h10 - h00, h11 - h01, fz)) / Math.max(stepX, 0.001);
    const dHeightDz = (THREE.MathUtils.lerp(h01 - h00, h11 - h10, fx)) / Math.max(stepZ, 0.001);
    const normal = new THREE.Vector3(-dHeightDx, 1, -dHeightDz).normalize();
    return { surfaceY: this.bedFloorY + 0.045 + loadHeight, loadHeight, normal };
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

  loadDistributionStats(): { centerX: number; centerZ: number; totalHeight: number; maxHeight: number } {
    let totalHeight = 0;
    let weightedX = 0;
    let weightedZ = 0;
    let maxHeight = 0;
    for (let iz = 0; iz <= this.loadSegmentsZ; iz += 1) {
      for (let ix = 0; ix <= this.loadSegmentsX; ix += 1) {
        const idx = this.loadIndex(ix, iz);
        const height = this.loadHeights[idx];
        if (height <= 0) {
          continue;
        }
        const x = this.bedCenterX - this.bedLength / 2 + (ix / this.loadSegmentsX) * this.bedLength;
        const z = -this.bedWidth / 2 + (iz / this.loadSegmentsZ) * this.bedWidth;
        totalHeight += height;
        weightedX += x * height;
        weightedZ += z * height;
        maxHeight = Math.max(maxHeight, height);
      }
    }

    if (totalHeight <= 0) {
      return { centerX: 0, centerZ: 0, totalHeight: 0, maxHeight: 0 };
    }

    return {
      centerX: weightedX / totalHeight - this.bedCenterX,
      centerZ: weightedZ / totalHeight,
      totalHeight,
      maxHeight,
    };
  }

  slumpLoadUnderGravity(dt: number, intensity = 1): number {
    if (!this.loadMesh.visible || dt <= 0) {
      return 0;
    }

    const inverseTruckRotation = this.group.getWorldQuaternion(new THREE.Quaternion()).invert();
    const localGravity = new THREE.Vector3(0, -1, 0).applyQuaternion(inverseTruckRotation);
    const downhill = new THREE.Vector2(localGravity.x, localGravity.z);
    const downhillLen = downhill.length();
    const verticalSupport = Math.max(Math.abs(localGravity.y), 0.2);
    if (downhillLen < 0.01) {
      return 0;
    }

    downhill.divideScalar(downhillLen);
    const tilt = clamp(downhillLen / verticalSupport, 0, 0.95);
    const passes = Math.max(1, Math.min(5, Math.ceil((1 + tilt * 4) * clamp(intensity, 0.25, 3.5))));
    let moved = 0;

    for (let pass = 0; pass < passes; pass += 1) {
      for (let iz = 0; iz <= this.loadSegmentsZ; iz += 1) {
        for (let ix = 0; ix < this.loadSegmentsX; ix += 1) {
          moved += this.transferLoadDownhill(ix, iz, ix + 1, iz, downhill, tilt, dt, intensity);
        }
      }
      for (let iz = 0; iz < this.loadSegmentsZ; iz += 1) {
        for (let ix = 0; ix <= this.loadSegmentsX; ix += 1) {
          moved += this.transferLoadDownhill(ix, iz, ix, iz + 1, downhill, tilt, dt, intensity);
        }
      }
    }

    if (moved > 0.0001) {
      this.relaxLoad(1);
      this.commitLoadSurface();
    }
    return moved;
  }

  spillLoadOverBed(
    dt: number,
    intensity = 1,
    maxVolume = Infinity,
  ): { spilledVolume: number; worldPoint: THREE.Vector3; localX: number; localZ: number } {
    const fallbackLocal = new THREE.Vector3(this.bedCenterX, this.bedFloorY + 0.04, 0);
    if (!this.loadMesh.visible || dt <= 0 || maxVolume <= 0) {
      const worldPoint = this.group.localToWorld(fallbackLocal.clone());
      return { spilledVolume: 0, worldPoint, localX: fallbackLocal.x, localZ: fallbackLocal.z };
    }

    const inverseTruckRotation = this.group.getWorldQuaternion(new THREE.Quaternion()).invert();
    const localGravity = new THREE.Vector3(0, -1, 0).applyQuaternion(inverseTruckRotation);
    const downhill = new THREE.Vector2(localGravity.x, localGravity.z);
    const downhillLen = downhill.length();
    const verticalSupport = Math.max(Math.abs(localGravity.y), 0.2);
    if (downhillLen < 0.012) {
      const worldPoint = this.group.localToWorld(fallbackLocal.clone());
      return { spilledVolume: 0, worldPoint, localX: fallbackLocal.x, localZ: fallbackLocal.z };
    }

    downhill.divideScalar(downhillLen);
    const impactShake = clamp(Math.abs(this.impactPitch) + Math.abs(this.impactRoll) + this.impactImpulse * 0.012, 0, 0.45);
    const tilt = clamp(downhillLen / verticalSupport + impactShake * 0.6, 0, 1.35);
    const spillDrive = clamp((tilt - 0.045) * clamp(intensity, 0.25, 4.5), 0, 2.1);
    if (spillDrive <= 0.001) {
      const worldPoint = this.group.localToWorld(fallbackLocal.clone());
      return { spilledVolume: 0, worldPoint, localX: fallbackLocal.x, localZ: fallbackLocal.z };
    }

    const cellArea = (this.bedLength / this.loadSegmentsX) * (this.bedWidth / this.loadSegmentsZ);
    const timeScale = clamp(dt * 1.55, 0.08, 1.35);
    const spillThreshold = clamp(0.3 - spillDrive * 0.13, 0.105, 0.3);
    let spilledVolume = 0;
    let weightedX = 0;
    let weightedZ = 0;

    for (let iz = 0; iz <= this.loadSegmentsZ; iz += 1) {
      for (let ix = 0; ix <= this.loadSegmentsX; ix += 1) {
        let edgeAlignment = 0;
        if (ix === 0) {
          edgeAlignment = Math.max(edgeAlignment, -downhill.x);
        }
        if (ix === this.loadSegmentsX) {
          edgeAlignment = Math.max(edgeAlignment, downhill.x);
        }
        if (iz === 0) {
          edgeAlignment = Math.max(edgeAlignment, -downhill.y);
        }
        if (iz === this.loadSegmentsZ) {
          edgeAlignment = Math.max(edgeAlignment, downhill.y);
        }
        if (edgeAlignment <= 0.08) {
          continue;
        }

        const idx = this.loadIndex(ix, iz);
        const sourceHeight = this.loadHeights[idx];
        if (sourceHeight <= 0.001) {
          continue;
        }

        const overflow = Math.max(0, sourceHeight - spillThreshold);
        const shakeOverflow = Math.max(0, spillDrive - 0.55) * 0.018 * edgeAlignment;
        const removeHeight = clamp(
          (overflow * (0.16 + edgeAlignment * 0.24) + shakeOverflow) * timeScale,
          0,
          sourceHeight * 0.36,
        );
        if (removeHeight <= 0) {
          continue;
        }

        const remainingVolume = Math.max(0, maxVolume - spilledVolume);
        const volume = Math.min(remainingVolume, (removeHeight * cellArea) / 0.72);
        const actualRemoveHeight = (volume * 0.72) / cellArea;
        if (actualRemoveHeight <= 0) {
          continue;
        }

        this.loadHeights[idx] = Math.max(0, this.loadHeights[idx] - actualRemoveHeight);
        const localX = this.bedCenterX - this.bedLength / 2 + (ix / this.loadSegmentsX) * this.bedLength;
        const localZ = -this.bedWidth / 2 + (iz / this.loadSegmentsZ) * this.bedWidth;
        const outsideX = localX + downhill.x * 0.44;
        const outsideZ = localZ + downhill.y * 0.38;
        spilledVolume += volume;
        weightedX += outsideX * volume;
        weightedZ += outsideZ * volume;
        if (spilledVolume >= maxVolume - 0.000001) {
          break;
        }
      }
      if (spilledVolume >= maxVolume - 0.000001) {
        break;
      }
    }

    if (spilledVolume <= 0) {
      const worldPoint = this.group.localToWorld(fallbackLocal.clone());
      return { spilledVolume: 0, worldPoint, localX: fallbackLocal.x, localZ: fallbackLocal.z };
    }

    this.commitLoadSurface();
    const localX = weightedX / spilledVolume;
    const localZ = weightedZ / spilledVolume;
    const worldPoint = this.group.localToWorld(new THREE.Vector3(localX, this.bedFloorY + 0.04, localZ));
    return { spilledVolume, worldPoint, localX, localZ };
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
    const stats = this.loadDistributionStats();
    return { x: stats.centerX, z: stats.centerZ };
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

  private transferLoadDownhill(
    ax: number,
    az: number,
    bx: number,
    bz: number,
    downhill: THREE.Vector2,
    tilt: number,
    dt: number,
    intensity: number,
  ): number {
    const stepX = this.bedLength / this.loadSegmentsX;
    const stepZ = this.bedWidth / this.loadSegmentsZ;
    const dx = (bx - ax) * stepX;
    const dz = (bz - az) * stepZ;
    const distance = Math.max(Math.hypot(dx, dz), 0.001);
    const alignment = (dx * downhill.x + dz * downhill.y) / distance;
    if (Math.abs(alignment) < 0.035) {
      return 0;
    }

    const source = alignment > 0 ? this.loadIndex(ax, az) : this.loadIndex(bx, bz);
    const sink = alignment > 0 ? this.loadIndex(bx, bz) : this.loadIndex(ax, az);
    const sourceHeight = this.loadHeights[source];
    if (sourceHeight <= 0.0001) {
      return 0;
    }

    const sinkHeight = this.loadHeights[sink];
    const drive = Math.abs(alignment) * tilt;
    const imbalance = sourceHeight - sinkHeight + drive * 0.24;
    const staticRepose = 0.07;
    if (imbalance <= staticRepose) {
      return 0;
    }

    const timeScale = clamp(dt * 3.2, 0.08, 1);
    const transfer = clamp(
      (imbalance - staticRepose) * (0.11 + drive * 0.24) * clamp(intensity, 0.2, 3.5) * timeScale,
      0,
      sourceHeight * 0.3,
    );
    if (transfer <= 0) {
      return 0;
    }

    this.loadHeights[source] -= transfer;
    this.loadHeights[sink] += transfer;
    return transfer;
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
  private readonly bucketLoadMinX = -1.02;
  private readonly bucketLoadMaxX = -0.18;
  private readonly bucketLoadMinZ = -0.43;
  private readonly bucketLoadMaxZ = 0.43;
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
    const previousRatio = this.bucketLoadRenderedRatio;
    if (Math.abs(ratio - this.bucketLoadRenderedRatio) < 0.001) {
      return;
    }
    this.bucketLoadRenderedRatio = ratio;
    this.bucketLoadMesh.visible = ratio > 0.02;
    if (ratio <= 0.02) {
      this.bucketLoadHeights.fill(0);
    } else if (previousRatio > 0.02) {
      const scale = ratio / Math.max(previousRatio, 0.001);
      for (let i = 0; i < this.bucketLoadHeights.length; i += 1) {
        this.bucketLoadHeights[i] = clamp(this.bucketLoadHeights[i] * scale, 0.004, 0.62);
      }
      this.relaxBucketLoad(1);
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

  bucketLoadDistributionStats(): {
    centerX: number;
    centerZ: number;
    totalHeight: number;
    maxHeight: number;
    lipRatio: number;
  } {
    let totalHeight = 0;
    let lipHeight = 0;
    let weightedX = 0;
    let weightedZ = 0;
    let maxHeight = 0;
    for (let iz = 0; iz <= this.bucketLoadSegmentsZ; iz += 1) {
      for (let ix = 0; ix <= this.bucketLoadSegmentsX; ix += 1) {
        const idx = this.bucketLoadIndex(ix, iz);
        const height = this.bucketLoadHeights[idx];
        if (height <= 0) {
          continue;
        }
        const x = THREE.MathUtils.lerp(this.bucketLoadMinX, this.bucketLoadMaxX, ix / this.bucketLoadSegmentsX);
        const z = THREE.MathUtils.lerp(this.bucketLoadMinZ, this.bucketLoadMaxZ, iz / this.bucketLoadSegmentsZ);
        totalHeight += height;
        weightedX += x * height;
        weightedZ += z * height;
        maxHeight = Math.max(maxHeight, height);
        if (ix <= 1) {
          lipHeight += height;
        }
      }
    }

    if (totalHeight <= 0) {
      return { centerX: 0, centerZ: 0, totalHeight: 0, maxHeight: 0, lipRatio: 0 };
    }

    return {
      centerX: weightedX / totalHeight,
      centerZ: weightedZ / totalHeight,
      totalHeight,
      maxHeight,
      lipRatio: lipHeight / totalHeight,
    };
  }

  slumpBucketLoadUnderGravity(dt: number, intensity = 1): number {
    if (!this.bucketLoadMesh.visible || dt <= 0) {
      return 0;
    }

    const inverseBucketRotation = this.bucketGroup.getWorldQuaternion(new THREE.Quaternion()).invert();
    const localGravity = new THREE.Vector3(0, -1, 0).applyQuaternion(inverseBucketRotation);
    const downhill = new THREE.Vector2(localGravity.x, localGravity.z);
    const downhillLen = downhill.length();
    const verticalSupport = Math.max(Math.abs(localGravity.y), 0.2);
    if (downhillLen < 0.012) {
      return 0;
    }

    downhill.divideScalar(downhillLen);
    const tilt = clamp(downhillLen / verticalSupport, 0, 1.15);
    const passes = Math.max(1, Math.min(5, Math.ceil((1 + tilt * 3.5) * clamp(intensity, 0.25, 3.2))));
    let moved = 0;

    for (let pass = 0; pass < passes; pass += 1) {
      for (let iz = 0; iz <= this.bucketLoadSegmentsZ; iz += 1) {
        for (let ix = 0; ix < this.bucketLoadSegmentsX; ix += 1) {
          moved += this.transferBucketLoadDownhill(ix, iz, ix + 1, iz, downhill, tilt, dt, intensity);
        }
      }
      for (let iz = 0; iz < this.bucketLoadSegmentsZ; iz += 1) {
        for (let ix = 0; ix <= this.bucketLoadSegmentsX; ix += 1) {
          moved += this.transferBucketLoadDownhill(ix, iz, ix, iz + 1, downhill, tilt, dt, intensity);
        }
      }
    }

    if (moved > 0.0001) {
      this.relaxBucketLoad(1);
      this.commitBucketLoadSurface();
    }
    return moved;
  }

  spillBucketLoadOverLip(
    dt: number,
    intensity = 1,
    currentLoad = BUCKET_CAPACITY,
    maxSpillVolume = currentLoad,
    lipBias = 0,
  ): { spilledVolume: number; worldPoint: THREE.Vector3; localX: number; localZ: number; heightRemoved: number } {
    const fallbackLocal = new THREE.Vector3(this.bucketLoadMinX, -0.5, 0);
    if (!this.bucketLoadMesh.visible || dt <= 0 || currentLoad <= 0 || maxSpillVolume <= 0) {
      const worldPoint = this.bucketGroup.localToWorld(fallbackLocal.clone());
      return { spilledVolume: 0, worldPoint, localX: fallbackLocal.x, localZ: fallbackLocal.z, heightRemoved: 0 };
    }

    const stats = this.bucketLoadDistributionStats();
    if (stats.totalHeight <= 0.0001) {
      const worldPoint = this.bucketGroup.localToWorld(fallbackLocal.clone());
      return { spilledVolume: 0, worldPoint, localX: fallbackLocal.x, localZ: fallbackLocal.z, heightRemoved: 0 };
    }

    const inverseBucketRotation = this.bucketGroup.getWorldQuaternion(new THREE.Quaternion()).invert();
    const localGravity = new THREE.Vector3(0, -1, 0).applyQuaternion(inverseBucketRotation);
    const downhill = new THREE.Vector2(localGravity.x, localGravity.z);
    const downhillLen = downhill.length();
    if (downhillLen > 0.0001) {
      downhill.divideScalar(downhillLen);
    } else {
      downhill.set(-1, 0);
    }

    const verticalSupport = Math.max(Math.abs(localGravity.y), 0.2);
    const openLipDrive = clamp(lipBias, 0, 1.8);
    const tilt = clamp(downhillLen / verticalSupport + openLipDrive * 0.54, 0, 1.8);
    const spillDrive = clamp((tilt - 0.035) * clamp(intensity, 0.25, 4.2), 0, 2.4);
    if (spillDrive <= 0.001) {
      const worldPoint = this.bucketGroup.localToWorld(fallbackLocal.clone());
      return { spilledVolume: 0, worldPoint, localX: fallbackLocal.x, localZ: fallbackLocal.z, heightRemoved: 0 };
    }

    const volumePerHeight = currentLoad / stats.totalHeight;
    const timeScale = clamp(dt * 1.8, 0.08, 1.4);
    const spillThreshold = clamp(0.24 - spillDrive * 0.09 - openLipDrive * 0.08, 0.05, 0.24);
    let spilledVolume = 0;
    let heightRemoved = 0;
    let weightedX = 0;
    let weightedZ = 0;

    for (let iz = 0; iz <= this.bucketLoadSegmentsZ; iz += 1) {
      for (let ix = 0; ix <= this.bucketLoadSegmentsX; ix += 1) {
        let edgeAlignment = 0;
        if (ix === 0) {
          edgeAlignment = Math.max(edgeAlignment, -downhill.x, openLipDrive);
        }
        if (iz === 0) {
          edgeAlignment = Math.max(edgeAlignment, -downhill.y * 0.62);
        }
        if (iz === this.bucketLoadSegmentsZ) {
          edgeAlignment = Math.max(edgeAlignment, downhill.y * 0.62);
        }
        if (edgeAlignment <= 0.06) {
          continue;
        }

        const idx = this.bucketLoadIndex(ix, iz);
        const sourceHeight = this.bucketLoadHeights[idx];
        if (sourceHeight <= 0.001) {
          continue;
        }

        const overflow = Math.max(0, sourceHeight - spillThreshold);
        const shakeOverflow = Math.max(0, spillDrive - 0.4) * 0.014 * edgeAlignment;
        const removeHeight = clamp(
          (overflow * (0.18 + edgeAlignment * 0.28) + shakeOverflow) * timeScale,
          0,
          sourceHeight * 0.42,
        );
        const remainingVolume = Math.max(0, maxSpillVolume - spilledVolume);
        const actualRemoveHeight = Math.min(removeHeight, remainingVolume / Math.max(volumePerHeight, 0.000001));
        if (actualRemoveHeight <= 0) {
          continue;
        }

        this.bucketLoadHeights[idx] = Math.max(0, sourceHeight - actualRemoveHeight);
        const volume = actualRemoveHeight * volumePerHeight;
        const localX = THREE.MathUtils.lerp(this.bucketLoadMinX, this.bucketLoadMaxX, ix / this.bucketLoadSegmentsX);
        const localZ = THREE.MathUtils.lerp(this.bucketLoadMinZ, this.bucketLoadMaxZ, iz / this.bucketLoadSegmentsZ);
        const outsideX = localX - 0.34 + Math.min(0, downhill.x) * 0.12;
        const outsideZ = localZ + downhill.y * 0.22;
        spilledVolume += volume;
        heightRemoved += actualRemoveHeight;
        weightedX += outsideX * volume;
        weightedZ += outsideZ * volume;
        if (spilledVolume >= maxSpillVolume - 0.000001) {
          break;
        }
      }
      if (spilledVolume >= maxSpillVolume - 0.000001) {
        break;
      }
    }

    if (spilledVolume <= 0) {
      const worldPoint = this.bucketGroup.localToWorld(fallbackLocal.clone());
      return { spilledVolume: 0, worldPoint, localX: fallbackLocal.x, localZ: fallbackLocal.z, heightRemoved: 0 };
    }

    const remainingRatio = clamp((currentLoad - spilledVolume) / BUCKET_CAPACITY, 0, 1);
    this.bucketLoadRenderedRatio = remainingRatio;
    this.bucketLoadMesh.visible = remainingRatio > 0.02;
    if (!this.bucketLoadMesh.visible) {
      this.bucketLoadHeights.fill(0);
    }
    this.commitBucketLoadSurface();

    const localX = weightedX / spilledVolume;
    const localZ = weightedZ / spilledVolume;
    const worldPoint = this.bucketGroup.localToWorld(new THREE.Vector3(localX, this.bucketLoadBaseY(this.bucketLoadMinX, localZ), localZ));
    return { spilledVolume, worldPoint, localX, localZ, heightRemoved };
  }

  resolveBucketLoadCollision(worldPoint: THREE.Vector3, radius: number): BucketLoadSurfaceHit | null {
    const local = this.bucketGroup.worldToLocal(worldPoint.clone());
    const hit = this.resolveBucketLoadSolidCollision(local, radius);
    if (!hit) {
      return null;
    }

    const surfacePoint = this.bucketGroup.localToWorld(new THREE.Vector3(local.x, hit.surfaceY, local.z));
    return {
      normal: hit.normal.applyQuaternion(this.bucketGroup.getWorldQuaternion(new THREE.Quaternion())).normalize(),
      penetration: hit.penetration,
      surfacePoint,
      surfaceY: surfacePoint.y,
      loadHeight: hit.loadHeight,
    };
  }

  bucketLoadSurfaceAtWorld(worldPoint: THREE.Vector3): { point: THREE.Vector3; normal: THREE.Vector3; surfaceY: number; loadHeight: number } | null {
    const local = this.bucketGroup.worldToLocal(worldPoint.clone());
    const sample = this.sampleBucketLoadSurfaceLocal(local.x, local.z);
    if (!sample) {
      return null;
    }

    const point = this.bucketGroup.localToWorld(new THREE.Vector3(local.x, sample.surfaceY, local.z));
    return {
      point,
      normal: sample.normal.applyQuaternion(this.bucketGroup.getWorldQuaternion(new THREE.Quaternion())).normalize(),
      surfaceY: point.y,
      loadHeight: sample.loadHeight,
    };
  }

  bucketTipWorld(): THREE.Vector3 {
    return this.bucketGroup.localToWorld(new THREE.Vector3(-1.5, -0.54, 0));
  }

  bucketToothTipsWorld(): THREE.Vector3[] {
    return [-0.36, -0.12, 0.12, 0.36].map((z) =>
      this.bucketGroup.localToWorld(new THREE.Vector3(-1.5, -0.54, z)),
    );
  }

  bucketCuttingEdgeWorld(): THREE.Vector3[] {
    return [
      this.bucketGroup.localToWorld(new THREE.Vector3(-1.36, -0.53, -0.46)),
      ...this.bucketToothTipsWorld(),
      this.bucketGroup.localToWorld(new THREE.Vector3(-1.36, -0.53, 0.46)),
    ];
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
    samples.push(...this.bucketShellCollisionSamples(1));
    samples.push(...this.visualPinCollisionSamples(1));
    samples.push(...this.hydraulicCollisionSamples());
    return samples;
  }

  visualPinCollisionSamples(radiusScale = 1): ArmCollisionSample[] {
    const sample = (
      key: string,
      action: "boom" | "stick" | "bucket",
      point: THREE.Vector3,
      radius: number,
    ): ArmCollisionSample => ({
      key,
      action,
      point,
      radius: radius * radiusScale,
    });

    return [
      sample("boom-root-pin", "boom", this.boomGroup.localToWorld(new THREE.Vector3(0, 0, 0)), 0.22),
      sample("boom-tip-pin", "boom", this.boomGroup.localToWorld(new THREE.Vector3(BOOM_LEN, 0, 0)), 0.2),
      sample("stick-root-pin", "stick", this.stickGroup.localToWorld(new THREE.Vector3(0, 0, 0)), 0.18),
      sample("stick-tip-pin", "stick", this.stickGroup.localToWorld(new THREE.Vector3(STICK_LEN, 0, 0)), 0.17),
      sample("stick-link-pin", "stick", this.stickGroup.localToWorld(new THREE.Vector3(STICK_LEN - 0.36, 0.24, 0)), 0.13),
      sample("bucket-ear-pin", "bucket", this.bucketGroup.localToWorld(new THREE.Vector3(-0.18, -0.18, 0)), 0.11),
    ];
  }

  bucketShellCollisionSamples(radiusScale = 1): ArmCollisionSample[] {
    const samples: ArmCollisionSample[] = [];
    const add = (key: string, local: THREE.Vector3, radius: number): void => {
      samples.push({
        key,
        action: "bucket",
        point: this.bucketGroup.localToWorld(local),
        radius: radius * radiusScale,
      });
    };

    for (const x of [-0.96, -0.68, -0.38]) {
      for (const z of [-0.34, 0, 0.34]) {
        add(`bucket-floor-${x}-${z}`, new THREE.Vector3(x, -0.5, z), 0.13);
      }
    }
    for (const z of [-0.52, 0.52]) {
      for (const x of [-0.94, -0.62, -0.28]) {
        add(`bucket-side-${x}-${z}`, new THREE.Vector3(x, -0.34, z), 0.12);
      }
      add(`bucket-side-lip-${z}`, new THREE.Vector3(-1.12, -0.48, z), 0.11);
    }
    for (const z of [-0.34, 0, 0.34]) {
      add(`bucket-back-${z}`, new THREE.Vector3(0.16, -0.2, z), 0.14);
      add(`bucket-lip-${z}`, new THREE.Vector3(-1.18, -0.5, z), 0.13);
    }
    for (const z of [-0.36, -0.12, 0.12, 0.36]) {
      add(`bucket-tooth-tip-${z}`, new THREE.Vector3(-1.5, -0.54, z), 0.07);
      add(`bucket-tooth-shank-${z}`, new THREE.Vector3(-1.36, -0.54, z), 0.08);
      add(`bucket-tooth-root-${z}`, new THREE.Vector3(-1.22, -0.52, z), 0.09);
    }
    return samples;
  }

  hydraulicCollisionSamples(): ArmCollisionSample[] {
    const samples: ArmCollisionSample[] = [];
    const addLine = (key: string, action: "boom" | "stick" | "bucket", start: THREE.Vector3, end: THREE.Vector3, radius: number): void => {
      for (const t of [0.24, 0.5, 0.76]) {
        samples.push({
          key: `${key}-${t.toFixed(2)}`,
          action,
          point: start.clone().lerp(end, t),
          radius,
        });
      }
    };

    const boomStart = this.upperGroup.localToWorld(new THREE.Vector3(0.26, 0.35, -0.28));
    const boomEnd = this.boomGroup.localToWorld(new THREE.Vector3(1.65, -0.14, -0.28));
    const stickStart = this.boomGroup.localToWorld(new THREE.Vector3(2.55, 0.12, 0.27));
    const stickEnd = this.stickGroup.localToWorld(new THREE.Vector3(1.55, -0.1, 0.27));
    const bucketCenter = this.bucketLinkageWorldPoints(-0.24);
    const bucketLeft = this.bucketLinkageWorldPoints(-0.32);
    const bucketRight = this.bucketLinkageWorldPoints(0.32);

    addLine("boom-cylinder", "boom", boomStart, boomEnd, 0.075);
    addLine("stick-cylinder", "stick", stickStart, stickEnd, 0.064);
    addLine("bucket-cylinder", "bucket", bucketCenter.cylinderBase, bucketCenter.rockerInput, 0.054);
    addLine("bucket-rocker-left", "bucket", bucketLeft.rockerInput, bucketLeft.rockerOutput, 0.052);
    addLine("bucket-rocker-right", "bucket", bucketRight.rockerInput, bucketRight.rockerOutput, 0.052);
    addLine("bucket-link-left", "bucket", bucketLeft.rockerOutput, bucketLeft.bucketEar, 0.048);
    addLine("bucket-link-right", "bucket", bucketRight.rockerOutput, bucketRight.bucketEar, 0.048);
    return samples;
  }

  upperCollisionSamples(): UpperCollisionSample[] {
    const sample = (key: string, x: number, y: number, z: number, radius: number): UpperCollisionSample => ({
      key,
      point: this.upperGroup.localToWorld(new THREE.Vector3(x, y, z)),
      radius,
    });
    return [
      sample("counterweight-center", -1.1, 0.38, 0, 0.48),
      sample("counterweight-left", -1.0, 0.38, -0.48, 0.38),
      sample("counterweight-right", -1.0, 0.38, 0.48, 0.38),
      sample("engine-center", -0.22, 0.36, 0, 0.5),
      sample("engine-left", -0.1, 0.34, -0.52, 0.34),
      sample("engine-right", -0.1, 0.34, 0.52, 0.34),
      sample("cab-low", 0.52, 0.62, -0.46, 0.34),
      sample("cab-roof", 0.55, 1.04, -0.46, 0.28),
      sample("front-service", 0.88, 0.34, 0.24, 0.32),
      sample("exhaust-base", -1.1, 0.74, 0.47, 0.105),
      sample("exhaust-mid", -1.1, 0.96, 0.47, 0.105),
      sample("exhaust-top", -1.1, 1.18, 0.47, 0.105),
    ];
  }

  turntableCollisionShape(): TurntableCollisionShape {
    return {
      center: this.group.localToWorld(new THREE.Vector3(0, TURNTABLE_CENTER_Y, 0)),
      radius: TURNTABLE_RADIUS,
      halfHeight: TURNTABLE_HEIGHT * 0.5,
    };
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
    for (const sample of this.bucketShellCollisionSamples(0.9)) {
      samples.push({
        key: sample.key ?? `bucket-shell-${samples.length}`,
        action: "bucket",
        point: sample.point,
        radius: sample.radius,
      });
    }
    samples.push(
      { key: "bucket-pin", action: "bucket", point: this.bucketPinWorld(), radius: 0.2 },
      { key: "bucket-pocket", action: "bucket", point: this.bucketPocketWorld(), radius: 0.3 },
    );
    for (const sample of this.visualPinCollisionSamples(0.9)) {
      samples.push({
        key: sample.key ?? `pin-${samples.length}`,
        action: sample.action,
        point: sample.point,
        radius: sample.radius,
      });
    }
    for (const sample of this.hydraulicCollisionSamples()) {
      samples.push({
        key: sample.key ?? `hydraulic-${samples.length}`,
        action: sample.action,
        point: sample.point,
        radius: sample.radius * 0.86,
      });
    }
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

  private resolveBucketLoadSolidCollision(
    local: THREE.Vector3,
    radius: number,
  ): { normal: THREE.Vector3; penetration: number; surfaceY: number; loadHeight: number } | null {
    const sample = this.sampleBucketLoadSurfaceLocal(local.x, local.z);
    if (!sample || sample.loadHeight <= 0.012) {
      return null;
    }

    const lowerCatchLimit = sample.surfaceY - Math.max(radius * 1.35, 0.18);
    if (local.y < lowerCatchLimit) {
      return null;
    }

    const penetration = sample.surfaceY + radius - local.y;
    if (penetration <= 0) {
      return null;
    }

    return {
      normal: sample.normal,
      penetration,
      surfaceY: sample.surfaceY,
      loadHeight: sample.loadHeight,
    };
  }

  private sampleBucketLoadSurfaceLocal(localX: number, localZ: number): { surfaceY: number; loadHeight: number; normal: THREE.Vector3 } | null {
    if (!this.bucketLoadMesh.visible) {
      return null;
    }

    const minX = this.bucketLoadMinX;
    const maxX = this.bucketLoadMaxX;
    const minZ = this.bucketLoadMinZ;
    const maxZ = this.bucketLoadMaxZ;
    const lengthX = maxX - minX;
    const widthZ = maxZ - minZ;
    if (localX < minX || localX > maxX || localZ < minZ || localZ > maxZ) {
      return null;
    }

    const gx = clamp(((localX - minX) / lengthX) * this.bucketLoadSegmentsX, 0, this.bucketLoadSegmentsX - 0.000001);
    const gz = clamp(((localZ - minZ) / widthZ) * this.bucketLoadSegmentsZ, 0, this.bucketLoadSegmentsZ - 0.000001);
    const ix = Math.floor(gx);
    const iz = Math.floor(gz);
    const fx = gx - ix;
    const fz = gz - iz;
    const ix1 = Math.min(ix + 1, this.bucketLoadSegmentsX);
    const iz1 = Math.min(iz + 1, this.bucketLoadSegmentsZ);

    const x0 = THREE.MathUtils.lerp(minX, maxX, ix / this.bucketLoadSegmentsX);
    const x1 = THREE.MathUtils.lerp(minX, maxX, ix1 / this.bucketLoadSegmentsX);
    const z0 = THREE.MathUtils.lerp(minZ, maxZ, iz / this.bucketLoadSegmentsZ);
    const z1 = THREE.MathUtils.lerp(minZ, maxZ, iz1 / this.bucketLoadSegmentsZ);
    const h00 = this.bucketLoadHeights[this.bucketLoadIndex(ix, iz)];
    const h10 = this.bucketLoadHeights[this.bucketLoadIndex(ix1, iz)];
    const h01 = this.bucketLoadHeights[this.bucketLoadIndex(ix, iz1)];
    const h11 = this.bucketLoadHeights[this.bucketLoadIndex(ix1, iz1)];
    const y00 = this.bucketLoadBaseY(x0, z0) + h00;
    const y10 = this.bucketLoadBaseY(x1, z0) + h10;
    const y01 = this.bucketLoadBaseY(x0, z1) + h01;
    const y11 = this.bucketLoadBaseY(x1, z1) + h11;
    const y0 = THREE.MathUtils.lerp(y00, y10, fx);
    const y1 = THREE.MathUtils.lerp(y01, y11, fx);
    const surfaceY = THREE.MathUtils.lerp(y0, y1, fz);
    const loadHeight0 = THREE.MathUtils.lerp(h00, h10, fx);
    const loadHeight1 = THREE.MathUtils.lerp(h01, h11, fx);
    const loadHeight = THREE.MathUtils.lerp(loadHeight0, loadHeight1, fz);
    const stepX = lengthX / this.bucketLoadSegmentsX;
    const stepZ = widthZ / this.bucketLoadSegmentsZ;
    const dSurfaceDx = THREE.MathUtils.lerp(y10 - y00, y11 - y01, fz) / Math.max(stepX, 0.001);
    const dSurfaceDz = THREE.MathUtils.lerp(y01 - y00, y11 - y10, fx) / Math.max(stepZ, 0.001);
    const normal = new THREE.Vector3(-dSurfaceDx, 1, -dSurfaceDz).normalize();
    return { surfaceY, loadHeight, normal };
  }

  private createBucketLoadGeometry(): THREE.BufferGeometry {
    const positions: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];
    const minX = this.bucketLoadMinX;
    const maxX = this.bucketLoadMaxX;
    const minZ = this.bucketLoadMinZ;
    const maxZ = this.bucketLoadMaxZ;

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
    const minX = this.bucketLoadMinX;
    const maxX = this.bucketLoadMaxX;
    const minZ = this.bucketLoadMinZ;
    const maxZ = this.bucketLoadMaxZ;
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

  private transferBucketLoadDownhill(
    ax: number,
    az: number,
    bx: number,
    bz: number,
    downhill: THREE.Vector2,
    tilt: number,
    dt: number,
    intensity: number,
  ): number {
    const stepX = (this.bucketLoadMaxX - this.bucketLoadMinX) / this.bucketLoadSegmentsX;
    const stepZ = (this.bucketLoadMaxZ - this.bucketLoadMinZ) / this.bucketLoadSegmentsZ;
    const dx = (bx - ax) * stepX;
    const dz = (bz - az) * stepZ;
    const distance = Math.max(Math.hypot(dx, dz), 0.001);
    const alignment = (dx * downhill.x + dz * downhill.y) / distance;
    if (Math.abs(alignment) < 0.035) {
      return 0;
    }

    const source = alignment > 0 ? this.bucketLoadIndex(ax, az) : this.bucketLoadIndex(bx, bz);
    const sink = alignment > 0 ? this.bucketLoadIndex(bx, bz) : this.bucketLoadIndex(ax, az);
    const sourceHeight = this.bucketLoadHeights[source];
    if (sourceHeight <= 0.0001) {
      return 0;
    }

    const sinkHeight = this.bucketLoadHeights[sink];
    const drive = Math.abs(alignment) * tilt;
    const imbalance = sourceHeight - sinkHeight + drive * 0.13;
    const staticRepose = 0.045;
    if (imbalance <= staticRepose) {
      return 0;
    }

    const timeScale = clamp(dt * 4.2, 0.08, 1);
    const transfer = clamp(
      (imbalance - staticRepose) * (0.14 + drive * 0.3) * clamp(intensity, 0.2, 3.2) * timeScale,
      0,
      sourceHeight * 0.34,
    );
    if (transfer <= 0) {
      return 0;
    }

    this.bucketLoadHeights[source] -= transfer;
    this.bucketLoadHeights[sink] += transfer;
    return transfer;
  }

  private commitBucketLoadSurface(): void {
    const position = this.bucketLoadGeometry.attributes.position as THREE.BufferAttribute;
    const minX = this.bucketLoadMinX;
    const maxX = this.bucketLoadMaxX;
    const minZ = this.bucketLoadMinZ;
    const maxZ = this.bucketLoadMaxZ;
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

    for (let i = 0; i < TRACK_PAD_COUNT; i += 1) {
      const x = TRACK_PAD_START_X + i * TRACK_PAD_SPACING;
      this.group.add(makeBox([0.18, 0.06, 0.6], padMat, [x, 0.58, -0.72]));
      this.group.add(makeBox([0.18, 0.06, 0.6], padMat, [x, 0.58, 0.72]));
    }

    const turntable = new THREE.Mesh(new THREE.CylinderGeometry(TURNTABLE_RADIUS, TURNTABLE_RADIUS, TURNTABLE_HEIGHT, 40), this.mats.dark);
    turntable.position.y = TURNTABLE_CENTER_Y;
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
  private readonly carriedWorldLocalQuaternions = new Map<WorldCollider, THREE.Quaternion>();
  private readonly looseSoilMats = [
    makeMat(0x6d4c2c, 0.95, 0.02),
    makeMat(0x855f36, 0.94, 0.02),
    makeMat(0x5a4734, 0.96, 0.02),
  ];
  private readonly pooledSoilGeometry = new THREE.DodecahedronGeometry(1, 0);
  private readonly soilParticlePool: THREE.Mesh[] = [];
  private readonly soilParticlePoolLimit = 40;
  private readonly fineGrainMax = 28;
  private readonly fineGrainPositions = new Float32Array(this.fineGrainMax * 3);
  private readonly fineGrainVelocities = new Float32Array(this.fineGrainMax * 3);
  private readonly fineGrainLife = new Float32Array(this.fineGrainMax);
  private readonly fineGrainMaxLife = new Float32Array(this.fineGrainMax);
  private readonly fineGrainVolumes = new Float32Array(this.fineGrainMax);
  private readonly fineGrainSettles = new Uint8Array(this.fineGrainMax);
  private readonly soilParticlePairGrid = new Map<string, SoilParticle[]>();
  private readonly soilParticlePairCandidates: SoilParticle[] = [];
  private readonly fineGrainPairGrid = new Map<string, number[]>();
  private readonly fineGrainPairCandidates: number[] = [];
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
  private trackTraction: TrackTractionState = {
    leftTraction: 1,
    rightTraction: 1,
    leftSlip: 0,
    rightSlip: 0,
    leftGroundSpeed: 0,
    rightGroundSpeed: 0,
    leftRoughness: 0,
    rightRoughness: 0,
    leftGrade: 0,
    rightGrade: 0,
  };
  private fineGrainCursor = 0;
  private fineGrainSettledVolume = 0;
  private nextWorldColliderId = 1;
  private readonly worldColliderGrid = new Map<string, WorldCollider[]>();
  private readonly colliderQueryResult: WorldCollider[] = [];
  private worldColliderGridDirty = true;
  private worldColliderGridDeferredDirty = false;
  private colliderQueryStamp = 1;
  private fpsAccumulator = 0;
  private fpsFrames = 0;
  private fps = 0;
  private lastWarning = "";

  private isMobilePerformanceProfile(): boolean {
    return window.matchMedia("(max-width: 820px), (pointer: coarse)").matches;
  }

  private pixelRatioLimit(): number {
    return this.isMobilePerformanceProfile() ? MOBILE_PIXEL_RATIO_LIMIT : DESKTOP_PIXEL_RATIO_LIMIT;
  }

  constructor() {
    this.ui = this.readUi();
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: "high-performance",
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.pixelRatioLimit()));
    this.renderer.shadowMap.enabled = !this.isMobilePerformanceProfile();
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
    this.warmWorldColliderGrid();
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
    this.trackTraction = this.emptyTrackTraction();
    this.fineGrainSettledVolume = 0;
    this.resetWorldColliders();
    this.clearFineGrains();
    this.clearMobileInput();
    this.closeMobileMenu();
    this.setCameraMode("orbit");
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
    this.warmWorldColliderGrid();
  }

  private registerWorldCollider(
    mesh: THREE.Object3D,
    kind: WorldColliderKind,
    radius: number,
    options: Partial<Pick<WorldCollider, "mass" | "immovable" | "crushable" | "restitution" | "friction" | "groundOffset">> & {
      capsule?: WorldColliderCapsule;
    } = {},
  ): WorldCollider {
    const collider: WorldCollider = {
      id: this.nextWorldColliderId,
      mesh,
      kind,
      radius,
      capsule: options.capsule
        ? {
            localA: options.capsule.localA.clone(),
            localB: options.capsule.localB.clone(),
            radius: options.capsule.radius,
          }
        : undefined,
      mass: options.mass ?? 1,
      immovable: options.immovable ?? false,
      crushable: options.crushable ?? false,
      restitution: options.restitution ?? 0.08,
      friction: options.friction ?? 0.82,
      groundOffset: options.groundOffset ?? radius * 0.45,
      velocity: new THREE.Vector3(),
      angularVelocity: new THREE.Vector3(),
      sleeping: !(options.immovable ?? false),
      groundLoadCooldown: 0,
      initialPosition: mesh.position.clone(),
      initialQuaternion: mesh.quaternion.clone(),
      initialScale: mesh.scale.clone(),
      gridStamp: 0,
    };
    this.nextWorldColliderId += 1;
    this.worldColliders.push(collider);
    this.worldColliderGridDirty = true;
    return collider;
  }

  private resetWorldColliders(): void {
    this.carriedWorldColliders.clear();
    this.carriedWorldPreviousPositions.clear();
    this.carriedWorldLocalQuaternions.clear();
    for (const collider of this.worldColliders) {
      collider.mesh.position.copy(collider.initialPosition);
      collider.mesh.quaternion.copy(collider.initialQuaternion);
      collider.mesh.scale.copy(collider.initialScale);
      collider.velocity.set(0, 0, 0);
      collider.angularVelocity.set(0, 0, 0);
      collider.groundLoadCooldown = 0;
      collider.sleeping = !collider.immovable;
      if (!collider.immovable) {
        const support = this.worldColliderTerrainSupport(collider);
        collider.mesh.position.y += support.supportDelta;
      }
    }
    this.worldColliderGridDirty = true;
  }

  private worldColliderGridKey(ix: number, iz: number): string {
    return `${ix},${iz}`;
  }

  private rebuildWorldColliderGrid(): void {
    if (!this.worldColliderGridDirty) {
      return;
    }

    this.worldColliderGrid.clear();
    for (const collider of this.worldColliders) {
      if (this.carriedWorldColliders.has(collider)) {
        continue;
      }
      const pos = collider.mesh.position;
      const reach = collider.radius + 0.12;
      const minX = Math.floor((pos.x - reach) / WORLD_COLLIDER_GRID_SIZE);
      const maxX = Math.floor((pos.x + reach) / WORLD_COLLIDER_GRID_SIZE);
      const minZ = Math.floor((pos.z - reach) / WORLD_COLLIDER_GRID_SIZE);
      const maxZ = Math.floor((pos.z + reach) / WORLD_COLLIDER_GRID_SIZE);
      for (let iz = minZ; iz <= maxZ; iz += 1) {
        for (let ix = minX; ix <= maxX; ix += 1) {
          const key = this.worldColliderGridKey(ix, iz);
          let bucket = this.worldColliderGrid.get(key);
          if (!bucket) {
            bucket = [];
            this.worldColliderGrid.set(key, bucket);
          }
          bucket.push(collider);
        }
      }
    }
    this.worldColliderGridDirty = false;
  }

  private nearbyWorldColliders(pos: THREE.Vector3, radius: number): WorldCollider[] {
    this.rebuildWorldColliderGrid();
    this.colliderQueryResult.length = 0;
    this.colliderQueryStamp = this.colliderQueryStamp >= 1_000_000_000 ? 1 : this.colliderQueryStamp + 1;

    const minX = Math.floor((pos.x - radius) / WORLD_COLLIDER_GRID_SIZE);
    const maxX = Math.floor((pos.x + radius) / WORLD_COLLIDER_GRID_SIZE);
    const minZ = Math.floor((pos.z - radius) / WORLD_COLLIDER_GRID_SIZE);
    const maxZ = Math.floor((pos.z + radius) / WORLD_COLLIDER_GRID_SIZE);
    for (let iz = minZ; iz <= maxZ; iz += 1) {
      for (let ix = minX; ix <= maxX; ix += 1) {
        const bucket = this.worldColliderGrid.get(this.worldColliderGridKey(ix, iz));
        if (!bucket) {
          continue;
        }
        for (const collider of bucket) {
          if (collider.gridStamp === this.colliderQueryStamp) {
            continue;
          }
          collider.gridStamp = this.colliderQueryStamp;
          this.colliderQueryResult.push(collider);
        }
      }
    }
    return this.colliderQueryResult;
  }

  private particleGridKey(x: number, y: number, z: number, cellSize: number): string {
    return `${Math.floor(x / cellSize)},${Math.floor(y / cellSize)},${Math.floor(z / cellSize)}`;
  }

  private rebuildSoilParticlePairGrid(): void {
    this.soilParticlePairGrid.clear();
    for (const particle of this.soilParticles) {
      if (particle.toBucket || (!particle.settles && particle.life < 0.08)) {
        continue;
      }
      const pos = particle.mesh.position;
      const key = this.particleGridKey(pos.x, pos.y, pos.z, SOIL_PAIR_GRID_SIZE);
      let bucket = this.soilParticlePairGrid.get(key);
      if (!bucket) {
        bucket = [];
        this.soilParticlePairGrid.set(key, bucket);
      }
      bucket.push(particle);
    }
  }

  private nearbySoilParticlePairCandidates(pos: THREE.Vector3, radius: number): SoilParticle[] {
    this.soilParticlePairCandidates.length = 0;
    const minX = Math.floor((pos.x - radius) / SOIL_PAIR_GRID_SIZE);
    const maxX = Math.floor((pos.x + radius) / SOIL_PAIR_GRID_SIZE);
    const minY = Math.floor((pos.y - radius) / SOIL_PAIR_GRID_SIZE);
    const maxY = Math.floor((pos.y + radius) / SOIL_PAIR_GRID_SIZE);
    const minZ = Math.floor((pos.z - radius) / SOIL_PAIR_GRID_SIZE);
    const maxZ = Math.floor((pos.z + radius) / SOIL_PAIR_GRID_SIZE);
    for (let iz = minZ; iz <= maxZ; iz += 1) {
      for (let iy = minY; iy <= maxY; iy += 1) {
        for (let ix = minX; ix <= maxX; ix += 1) {
          const bucket = this.soilParticlePairGrid.get(`${ix},${iy},${iz}`);
          if (!bucket) {
            continue;
          }
          this.soilParticlePairCandidates.push(...bucket);
        }
      }
    }
    return this.soilParticlePairCandidates;
  }

  private rebuildFineGrainPairGrid(): void {
    this.fineGrainPairGrid.clear();
    for (let i = 0; i < this.fineGrainMax; i += 1) {
      if (this.fineGrainMaxLife[i] <= 0 || this.fineGrainVolumes[i] <= 0 || this.fineGrainSettles[i] !== 1) {
        continue;
      }
      const p = i * 3;
      const key = this.particleGridKey(
        this.fineGrainPositions[p],
        this.fineGrainPositions[p + 1],
        this.fineGrainPositions[p + 2],
        FINE_GRAIN_PAIR_GRID_SIZE,
      );
      let bucket = this.fineGrainPairGrid.get(key);
      if (!bucket) {
        bucket = [];
        this.fineGrainPairGrid.set(key, bucket);
      }
      bucket.push(i);
    }
  }

  private nearbyFineGrainPairCandidates(pos: THREE.Vector3, radius: number): number[] {
    this.fineGrainPairCandidates.length = 0;
    const minX = Math.floor((pos.x - radius) / FINE_GRAIN_PAIR_GRID_SIZE);
    const maxX = Math.floor((pos.x + radius) / FINE_GRAIN_PAIR_GRID_SIZE);
    const minY = Math.floor((pos.y - radius) / FINE_GRAIN_PAIR_GRID_SIZE);
    const maxY = Math.floor((pos.y + radius) / FINE_GRAIN_PAIR_GRID_SIZE);
    const minZ = Math.floor((pos.z - radius) / FINE_GRAIN_PAIR_GRID_SIZE);
    const maxZ = Math.floor((pos.z + radius) / FINE_GRAIN_PAIR_GRID_SIZE);
    for (let iz = minZ; iz <= maxZ; iz += 1) {
      for (let iy = minY; iy <= maxY; iy += 1) {
        for (let ix = minX; ix <= maxX; ix += 1) {
          const bucket = this.fineGrainPairGrid.get(`${ix},${iy},${iz}`);
          if (!bucket) {
            continue;
          }
          this.fineGrainPairCandidates.push(...bucket);
        }
      }
    }
    return this.fineGrainPairCandidates;
  }

  private warmWorldColliderGrid(): void {
    this.worldColliderGridDirty = true;
    this.worldColliderGridDeferredDirty = false;
    this.rebuildWorldColliderGrid();
    this.nearbyWorldColliders(this.excavator.group.position, 2.2);
  }

  private deferWorldColliderGridRefresh(): void {
    this.worldColliderGridDeferredDirty = true;
  }

  private flushWorldColliderGridRefresh(): void {
    if (!this.worldColliderGridDeferredDirty) {
      return;
    }
    this.worldColliderGridDeferredDirty = false;
    this.worldColliderGridDirty = true;
  }

  private wakeWorldCollidersNear(center: THREE.Vector3, radius: number): number {
    let woke = 0;
    const candidates = [...this.nearbyWorldColliders(center, radius + 1.2)]
      .filter((collider) => {
        if (collider.immovable || this.carriedWorldColliders.has(collider)) {
          return false;
        }
        const pos = collider.mesh.position;
        const horizontalDistance = Math.hypot(pos.x - center.x, pos.z - center.z);
        return horizontalDistance <= radius + collider.radius;
      })
      .sort((a, b) => {
        const ap = a.mesh.position;
        const bp = b.mesh.position;
        const adx = ap.x - center.x;
        const adz = ap.z - center.z;
        const bdx = bp.x - center.x;
        const bdz = bp.z - center.z;
        return adx * adx + adz * adz - (bdx * bdx + bdz * bdz);
      })
      .slice(0, WORLD_COLLIDER_WAKE_LIMIT);
    for (const collider of candidates) {
      const pos = collider.mesh.position;
      const support = this.worldColliderTerrainSupport(collider);
      const buriedDepth = support.penetration;
      const unsupportedDrop = support.unsupportedDrop;
      const slope = support.slope;
      const shouldWake = collider.sleeping || buriedDepth > 0.004 || unsupportedDrop > 0.012 || slope > 0.08;
      if (!shouldWake) {
        continue;
      }

      if (collider.sleeping) {
        woke += 1;
      }
      collider.sleeping = false;
      if (buriedDepth > 0.004) {
        pos.addScaledVector(support.normal, Math.min(buriedDepth + 0.002, 0.38));
        collider.velocity.addScaledVector(support.normal, clamp(0.08 + buriedDepth * 3.2, 0.08, 1.15));
      } else if (unsupportedDrop > 0.012) {
        collider.velocity.y = Math.min(collider.velocity.y, -0.04);
      }
      if (slope > 0.08) {
        collider.velocity.x += -support.slopeX * clamp(slope * 0.18, 0.012, 0.12);
        collider.velocity.z += -support.slopeZ * clamp(slope * 0.18, 0.012, 0.12);
      }
      this.pressure = Math.max(this.pressure, clamp(0.06 + Math.max(buriedDepth, unsupportedDrop, slope) * 0.22, 0, 0.5));
    }
    if (woke > 0) {
      this.worldColliderGridDirty = true;
    }
    return woke;
  }

  private excavateTerrainWithWake(
    start: THREE.Vector3,
    end: THREE.Vector3,
    sideways: THREE.Vector3,
    width: number,
    depth: number,
    volumeLimit: number,
  ): number {
    const removed = this.terrain.excavateSweptBucket(start, end, sideways, width, depth, volumeLimit);
    if (removed > 0) {
      const center = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
      center.y = this.terrain.getHeightAt(center.x, center.z);
      this.wakeWorldCollidersNear(center, start.distanceTo(end) * 0.5 + width * 0.5 + 0.9);
    }
    return removed;
  }

  private displaceTerrainWithWake(
    start: THREE.Vector3,
    end: THREE.Vector3,
    sideways: THREE.Vector3,
    width: number,
    depth: number,
    volumeLimit: number,
  ): number {
    const moved = this.terrain.displaceSweptBucket(start, end, sideways, width, depth, volumeLimit);
    if (moved > 0) {
      const center = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
      center.y = this.terrain.getHeightAt(center.x, center.z);
      this.wakeWorldCollidersNear(center, start.distanceTo(end) * 0.5 + width * 1.3);
    }
    return moved;
  }

  private compactTrackStripWithWake(
    center: THREE.Vector3,
    forward: THREE.Vector3,
    side: THREE.Vector3,
    length: number,
    width: number,
    depth: number,
  ): { compacted: number; rutDrop: number; bermRise: number } {
    const result = this.terrain.compactTrackStrip(center, forward, side, length, width, depth);
    if (result.compacted > 0) {
      this.wakeWorldCollidersNear(center, length * 0.5 + width + 0.7);
    }
    return result;
  }

  private compactWorldObjectFootprint(collider: WorldCollider, center: THREE.Vector3, impactSpeed: number, dt: number): ObjectFootprintCompaction {
    if (dt <= 0 || collider.mass <= 0.45) {
      return { compacted: 0, rutDrop: 0, bermRise: 0 };
    }
    const footprintRadius = collider.capsule
      ? Math.max(collider.capsule.radius * 1.65, Math.min(collider.radius * 0.38, 0.62))
      : Math.max(collider.radius * 0.82, 0.14);
    return this.terrain.compactObjectFootprint(center, footprintRadius, collider.mass, impactSpeed, dt);
  }

  private raiseTerrainWithWake(center: THREE.Vector3, radius: number, volume: number, relaxPasses = 2): number {
    const deposited = this.terrain.raiseAt(center, radius, volume, relaxPasses);
    if (deposited > 0) {
      this.wakeWorldCollidersNear(center, radius + 0.55);
    }
    return deposited;
  }

  private settleTerrainWithWake(center: THREE.Vector3, radius: number, passes = 1): void {
    this.terrain.settleAt(center, radius, passes);
    this.wakeWorldCollidersNear(center, radius + 0.45);
  }

  private wakeTruckWheelColliders(): number {
    let woke = 0;
    for (const wheel of this.truck.wheelWorldPoints()) {
      woke += this.wakeWorldCollidersNear(wheel, 0.92);
    }
    return woke;
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
    const shadowMapSize = this.isMobilePerformanceProfile() ? 1024 : 2048;
    sun.shadow.mapSize.set(shadowMapSize, shadowMapSize);
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
      this.registerWorldCollider(rail, "fence", 0.48, {
        mass: 3.2,
        restitution: 0.04,
        friction: 0.9,
        groundOffset: 0.86,
        capsule: {
          localA: new THREE.Vector3(-0.46, 0, 0),
          localB: new THREE.Vector3(0.46, 0, 0),
          radius: 0.075,
        },
      });
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

    for (let i = 0; i < 430; i += 1) {
      const aroundDig = i < 104;
      const farField = i > 250;
      const radius = aroundDig ? 0.85 + Math.random() * 4.25 : farField ? 24.0 + Math.random() * 34.0 : 5.0 + Math.random() * 27.0;
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
      [52.5, -42.8, 0.38],
      [-54.2, 41.6, 0.4],
      [55.0, 28.0, 0.32],
      [-48.4, -45.2, 0.35],
      [47.6, -51.4, 0.34],
      [-55.5, 25.2, 0.31],
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
      const twigLength = 0.45 + Math.random() * 0.42;
      const twig = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.018, twigLength, 7), twigMat);
      twig.position.set(x, this.terrain.getHeightAt(x, z) + 0.035, z);
      twig.rotation.set(Math.PI / 2 + (Math.random() - 0.5) * 0.35, Math.random() * Math.PI, Math.random() * Math.PI);
      twig.castShadow = true;
      this.scene.add(twig);
      this.registerWorldCollider(twig, "twig", Math.max(0.08, twigLength * 0.52), {
        mass: 0.12,
        crushable: true,
        restitution: 0.02,
        friction: 0.96,
        groundOffset: 0.035,
        capsule: {
          localA: new THREE.Vector3(0, -twigLength * 0.5, 0),
          localB: new THREE.Vector3(0, twigLength * 0.5, 0),
          radius: 0.024,
        },
      });
    }

    const pipeMat = makeMat(0x697376, 0.58, 0.32);
    const pipes = [
      [-50.5, -39.2, 1.25, 0.42],
      [-47.8, -37.6, 1.05, -0.18],
      [51.5, 39.0, 1.18, 0.8],
      [54.2, 41.8, 0.95, -0.35],
      [44.8, -44.6, 1.1, 0.15],
      [57.0, -36.2, 0.92, -0.62],
    ] as const;
    for (const [x, z, length, yaw] of pipes) {
      const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, length, 18), pipeMat);
      pipe.position.set(x, this.terrain.getHeightAt(x, z) + 0.14, z);
      pipe.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(Math.cos(yaw), 0, Math.sin(yaw)).normalize());
      pipe.castShadow = true;
      pipe.receiveShadow = true;
      this.scene.add(pipe);
      this.registerWorldCollider(pipe, "pipe", Math.max(0.34, length * 0.42), {
        mass: 12 + length * 10,
        restitution: 0.06,
        friction: 0.78,
        groundOffset: 0.14,
        capsule: {
          localA: new THREE.Vector3(0, -length * 0.5, 0),
          localB: new THREE.Vector3(0, length * 0.5, 0),
          radius: 0.11,
        },
      });
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
        this.setCameraMode(button.dataset.camera as CameraMode);
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
    this.syncMobileMenu();
  }

  private closeMobileMenu(): void {
    this.activeMobileMenu = null;
    this.syncMobileMenu();
  }

  private syncMobileMenu(): void {
    this.ui.mobileMenuPanel.classList.toggle("hidden", this.activeMobileMenu === null);
    this.ui.mobileMenuButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.mobileMenu === this.activeMobileMenu);
    });
    this.ui.mobileMenuSections.forEach((section) => {
      section.classList.toggle("hidden", section.dataset.mobilePanel !== this.activeMobileMenu);
    });
  }

  private setCameraMode(mode: CameraMode): void {
    this.cameraMode = mode;
    this.ui.cameraButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.camera === this.cameraMode);
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
          truckImpactImpulse: truckPhysics.impactImpulse,
          truckImpactPitch: truckPhysics.impactPitch,
          truckImpactRoll: truckPhysics.impactRoll,
          trackTraction: { ...this.trackTraction },
          collisionCount: this.collisionCount,
          terrainVolumeDelta: this.terrain.terrainVolumeDelta(),
        };
      },
      forceDigPass: () => {
        const beforeHeight = this.terrain.getHeightAt(DIG_SITE.x, DIG_SITE.z);
        const start = new THREE.Vector3(DIG_SITE.x - 0.55, beforeHeight + 0.02, DIG_SITE.z);
        const end = new THREE.Vector3(DIG_SITE.x + 0.55, beforeHeight - 0.18, DIG_SITE.z);
        const removed = this.excavateTerrainWithWake(
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
        let soilTruckPenetrationBefore = 0;
        let soilTruckPenetrationAfter = 0;
        let soilObjectImpulse = 0;
        let soilPairDistanceBefore = 0;
        let soilPairDistanceAfter = 0;
        let soilPairVelocityDelta = 0;
        const testRadius = 0.08;
        const testMesh = this.acquireSoilParticleMesh(testRadius, this.looseSoilMats[0], 991);
        const testParticle: SoilParticle = {
          mesh: testMesh,
          velocity: new THREE.Vector3(-0.42, -0.18, 0.12),
          volume: 0.035,
          radius: testRadius,
          life: 0,
          settles: true,
        };
        const truckProbe = this.truck.group.localToWorld(new THREE.Vector3(-2.12, 1.03, 0));
        testMesh.position.copy(truckProbe);
        soilTruckPenetrationBefore = this.truck.resolveSolidCollision(testMesh.position, testRadius)?.penetration ?? 0;
        this.resolveSoilParticleCollisions(testParticle);
        soilTruckPenetrationAfter = this.truck.resolveSolidCollision(testMesh.position, testRadius)?.penetration ?? 0;

        const hard = this.worldColliders.find((collider) => collider.kind === "boulder");
        if (hard) {
          const target = new THREE.Vector3(2.25, 0, 3.1);
          target.y = this.terrain.getHeightAt(target.x, target.z) + Math.max(hard.groundOffset, testRadius) + 0.08;
          const overlap = Math.max(0.06, (hard.radius + testRadius) * 0.46);
          testMesh.position.copy(target);
          testParticle.velocity.set(0.62, -0.08, 0);
          hard.mesh.position.set(target.x + overlap, target.y, target.z);
          hard.velocity.set(0, 0, 0);
          hard.sleeping = false;
          this.worldColliderGridDirty = true;
          this.resolveSoilParticleCollisions(testParticle);
          soilObjectImpulse = hard.velocity.length();
        }
        this.recycleSoilParticle(testParticle);

        const pairRadius = 0.09;
        const pairBase = new THREE.Vector3(5.4, this.terrain.getHeightAt(5.4, -4.8) + 1.2, -4.8);
        const pairMeshA = this.acquireSoilParticleMesh(pairRadius, this.looseSoilMats[0], 992);
        const pairMeshB = this.acquireSoilParticleMesh(pairRadius, this.looseSoilMats[1], 993);
        const pairA: SoilParticle = {
          mesh: pairMeshA,
          velocity: new THREE.Vector3(0.42, -0.05, 0),
          volume: 0.04,
          radius: pairRadius,
          life: 0,
          settles: true,
        };
        const pairB: SoilParticle = {
          mesh: pairMeshB,
          velocity: new THREE.Vector3(-0.28, -0.02, 0),
          volume: 0.035,
          radius: pairRadius,
          life: 0,
          settles: true,
        };
        pairMeshA.position.copy(pairBase);
        pairMeshB.position.copy(pairBase).add(new THREE.Vector3(pairRadius * 1.25, 0.006, 0));
        this.soilParticles.push(pairA, pairB);
        const pairVelocityBeforeA = pairA.velocity.clone();
        const pairVelocityBeforeB = pairB.velocity.clone();
        soilPairDistanceBefore = pairMeshA.position.distanceTo(pairMeshB.position);
        this.rebuildSoilParticlePairGrid();
        this.resolveSoilParticlePairCollision(pairA, pairRadius, Math.max(0.025, pairA.volume * 1.8));
        soilPairDistanceAfter = pairMeshA.position.distanceTo(pairMeshB.position);
        soilPairVelocityDelta = pairA.velocity.distanceTo(pairVelocityBeforeA) + pairB.velocity.distanceTo(pairVelocityBeforeB);
        for (const pairParticle of [pairA, pairB]) {
          const idx = this.soilParticles.indexOf(pairParticle);
          if (idx >= 0) {
            this.soilParticles.splice(idx, 1);
          }
          this.recycleSoilParticle(pairParticle);
        }
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
          soilTruckPenetrationBefore,
          soilTruckPenetrationAfter,
          soilObjectImpulse,
          soilPairDistanceBefore,
          soilPairDistanceAfter,
          soilPairVelocityDelta,
        };
      },
      forceFullBucketPush: () => {
        this.bucketLoad = BUCKET_CAPACITY;
        this.excavator.setBucketLoad(this.bucketLoad);
        const centerBefore = this.terrain.getHeightAt(DIG_SITE.x, DIG_SITE.z);
        const bermBefore = this.terrain.getHeightAt(DIG_SITE.x, DIG_SITE.z + 0.78);
        const start = new THREE.Vector3(DIG_SITE.x - 0.55, centerBefore + 0.02, DIG_SITE.z);
        const end = new THREE.Vector3(DIG_SITE.x + 0.55, centerBefore - 0.12, DIG_SITE.z);
        const displaced = this.displaceTerrainWithWake(
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
        let excavatorSoilPenetrationBefore = 0;
        let excavatorSoilPenetrationAfter = 0;
        let excavatorSoilTravel = 0;
        let excavatorSoilVelocity = 0;
        let collisionReleasedVolume = 0;
        let obstacleImpulse = 0;
        let obstacleTravel = 0;
        const obstacle =
          this.worldColliders.find((collider) => collider.kind === "boulder") ??
          this.worldColliders.find((collider) => collider.kind === "rock");
        if (obstacle) {
          const savedPosition = obstacle.mesh.position.clone();
          const savedQuaternion = obstacle.mesh.quaternion.clone();
          const savedVelocity = obstacle.velocity.clone();
          const savedAngularVelocity = obstacle.angularVelocity.clone();
          const savedSleeping = obstacle.sleeping;
          const source = this.excavator.bucketCuttingEdgeWorld()[0].clone();
          const target = this.excavator.bucketPocketWorld().clone();
          const flight = target.clone().sub(source);
          const collisionPoint = source.clone().addScaledVector(flight, 0.38);
          const collisionVolume = 0.12;
          const radius = 0.12;
          obstacle.mesh.position.copy(collisionPoint);
          obstacle.velocity.set(0, 0, 0);
          obstacle.angularVelocity.set(0, 0, 0);
          obstacle.sleeping = false;
          this.worldColliderGridDirty = true;
          const mesh = this.acquireSoilParticleMesh(radius, this.looseSoilMats[0], 2401);
          mesh.position.copy(source);
          const velocity =
            flight.lengthSq() > 0.0001
              ? flight.clone().normalize().multiplyScalar(2.8).add(new THREE.Vector3(0, 0.18, 0))
              : new THREE.Vector3(1.8, 0.18, 0);
          const collisionParticle: SoilParticle = {
            mesh,
            velocity,
            volume: collisionVolume,
            radius,
            life: 0,
            settles: false,
            target,
            toBucket: true,
          };
          this.bucketTransitLoad += collisionVolume;
          this.soilParticles.push(collisionParticle);
          const obstacleBefore = obstacle.mesh.position.clone();
          const transitBeforeCollision = this.bucketTransitLoad;
          for (let step = 0; step < 20; step += 1) {
            this.updateSoilParticles(1 / 60);
          }
          obstacleImpulse = obstacle.velocity.length();
          obstacleTravel = obstacle.mesh.position.distanceTo(obstacleBefore);
          collisionReleasedVolume = Math.max(0, transitBeforeCollision - this.bucketTransitLoad);
          const collisionParticleIndex = this.soilParticles.indexOf(collisionParticle);
          if (collisionParticleIndex >= 0) {
            this.soilParticles.splice(collisionParticleIndex, 1);
            if (collisionParticle.toBucket) {
              this.bucketTransitLoad = Math.max(0, this.bucketTransitLoad - collisionParticle.volume);
            }
            this.recycleSoilParticle(collisionParticle);
          }
          obstacle.mesh.position.copy(savedPosition);
          obstacle.mesh.quaternion.copy(savedQuaternion);
          obstacle.velocity.copy(savedVelocity);
          obstacle.angularVelocity.copy(savedAngularVelocity);
          obstacle.sleeping = savedSleeping;
          this.worldColliderGridDirty = true;
        }

        const savedAngles = { ...this.angles };
        const savedMachinePosition = this.excavator.group.position.clone();
        const savedMachineRotation = this.excavator.group.rotation.clone();
        this.excavator.group.position.set(0, this.terrain.getHeightAt(0, 0), 0);
        this.excavator.group.rotation.set(0, 0, 0);
        Object.assign(this.angles, { swing: 0, boom: 0.46, stick: -1.16, bucket: -1.9 });
        this.excavator.applyAngles(this.angles);
        const soilRadius = 0.075;
        const soilMesh = this.acquireSoilParticleMesh(soilRadius, this.looseSoilMats[0], 2402);
        const trackNormal = new THREE.Vector3(0, 0, 1);
        const trackPoint = this.excavator.group.position.clone().add(new THREE.Vector3(0, 0, TRACK_GAUGE * 0.5));
        trackPoint.y = this.excavator.group.position.y + 0.34;
        soilMesh.position.copy(trackPoint).addScaledVector(trackNormal, TRACK_WIDTH * 0.72 + soilRadius - 0.09);
        const excavatorSoilParticle: SoilParticle = {
          mesh: soilMesh,
          velocity: trackNormal.clone().multiplyScalar(-0.68),
          volume: 0.04,
          radius: soilRadius,
          life: 0,
          settles: true,
        };
        excavatorSoilPenetrationBefore = this.resolveExcavatorSolidHit(soilMesh.position, soilRadius)?.penetration ?? 0;
        const excavatorSoilBefore = soilMesh.position.clone();
        this.resolveSoilParticleCollisions(excavatorSoilParticle);
        excavatorSoilPenetrationAfter = this.resolveExcavatorSolidHit(soilMesh.position, soilRadius)?.penetration ?? 0;
        excavatorSoilTravel = soilMesh.position.distanceTo(excavatorSoilBefore);
        excavatorSoilVelocity = excavatorSoilParticle.velocity.length();
        this.recycleSoilParticle(excavatorSoilParticle);
        Object.assign(this.angles, savedAngles);
        this.excavator.group.position.copy(savedMachinePosition);
        this.excavator.group.rotation.copy(savedMachineRotation);
        this.excavator.applyAngles(this.angles);

        this.excavator.setBucketLoad(this.bucketLoad);
        this.updateUi(0);
        return {
          spawnedVolume: volume,
          capturedVolume: this.bucketLoad - beforeBucket,
          transitRemaining: this.bucketTransitLoad - beforeTransit,
          gravityDelta,
          excavatorSoilPenetrationBefore,
          excavatorSoilPenetrationAfter,
          excavatorSoilTravel,
          excavatorSoilVelocity,
          collisionReleasedVolume,
          obstacleImpulse,
          obstacleTravel,
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
      forceBucketLoadSurfacePhysics: () => {
        this.bucketLoad = BUCKET_CAPACITY * 0.68;
        this.bucketTransitLoad = 0;
        this.pressure = 0;
        this.excavator.group.position.set(0, this.terrain.getHeightAt(0, 0), 0);
        this.excavator.group.rotation.set(0, 0, 0);
        Object.assign(this.angles, { swing: 0, boom: 0.54, stick: -1.16, bucket: -2.16 });
        this.excavator.applyAngles(this.angles);
        this.excavator.setBucketLoad(this.bucketLoad);
        const loadStatsBeforeSlump = this.excavator.bucketLoadDistributionStats();
        const loadHeightBeforeSlump = loadStatsBeforeSlump.totalHeight;
        Object.assign(this.angles, { swing: 0, boom: 0.54, stick: -1.16, bucket: -1.92 });
        this.excavator.applyAngles(this.angles);
        const loadSlumpMoved = this.excavator.slumpBucketLoadUnderGravity(1.1, 2.2);
        const loadStatsAfterSlump = this.excavator.bucketLoadDistributionStats();

        const probe = this.excavator.bucketGroup.localToWorld(new THREE.Vector3(-0.56, -0.18, 0.02));
        const surface = this.excavator.bucketLoadSurfaceAtWorld(probe);
        let soilPenetrationBefore = 0;
        let soilPenetrationAfter = 0;
        let capturedVolume = 0;
        let objectPenetrationBefore = 0;
        let objectPenetrationAfter = 0;
        let objectTravel = 0;
        let objectVelocity = 0;
        let loadBeforeSpill = 0;
        let spilledVolume = 0;
        let loadAfterSpill = 0;
        let spillHeightDrop = 0;
        let spillVolumeConserved = 0;

        if (surface) {
          const soilRadius = 0.06;
          const soilMesh = this.acquireSoilParticleMesh(soilRadius, this.looseSoilMats[0], 6701);
          const soilLocal = this.excavator.bucketGroup.worldToLocal(surface.point.clone());
          soilLocal.y += soilRadius - 0.055;
          soilMesh.position.copy(this.excavator.bucketGroup.localToWorld(soilLocal));
          soilPenetrationBefore = this.excavator.resolveBucketLoadCollision(soilMesh.position, soilRadius)?.penetration ?? 0;
          const beforeBucket = this.bucketLoad;
          const soilParticle: SoilParticle = {
            mesh: soilMesh,
            velocity: surface.normal.clone().multiplyScalar(-0.42),
            volume: 0.075,
            radius: soilRadius,
            life: 0,
            settles: false,
            toBucket: true,
          };
          if (this.captureParticleOnBucketLoad(soilParticle)) {
            capturedVolume = this.bucketLoad - beforeBucket;
          }
          soilPenetrationAfter = this.excavator.resolveBucketLoadCollision(soilMesh.position, soilRadius)?.penetration ?? 0;
          this.recycleSoilParticle(soilParticle);

          const obstacle =
            this.worldColliders.find((collider) => collider.kind === "boulder") ??
            this.worldColliders.find((collider) => collider.kind === "rock");
          if (obstacle) {
            const savedPosition = obstacle.mesh.position.clone();
            const savedQuaternion = obstacle.mesh.quaternion.clone();
            const savedScale = obstacle.mesh.scale.clone();
            const savedVelocity = obstacle.velocity.clone();
            const savedAngularVelocity = obstacle.angularVelocity.clone();
            const savedSleeping = obstacle.sleeping;
            const refreshedSurface = this.excavator.bucketLoadSurfaceAtWorld(probe) ?? surface;
            const objectLocal = this.excavator.bucketGroup.worldToLocal(refreshedSurface.point.clone());
            objectLocal.y += obstacle.radius - 0.075;
            obstacle.mesh.position.copy(this.excavator.bucketGroup.localToWorld(objectLocal));
            obstacle.velocity.copy(refreshedSurface.normal).multiplyScalar(-0.36);
            obstacle.angularVelocity.set(0, 0, 0);
            obstacle.sleeping = false;
            this.worldColliderGridDirty = true;
            objectPenetrationBefore = this.excavator.resolveBucketLoadCollision(obstacle.mesh.position, obstacle.radius)?.penetration ?? 0;
            const beforePosition = obstacle.mesh.position.clone();
            this.resolveLooseObjectBucketLoadCollision(obstacle);
            objectPenetrationAfter = this.excavator.resolveBucketLoadCollision(obstacle.mesh.position, obstacle.radius)?.penetration ?? 0;
            objectTravel = obstacle.mesh.position.distanceTo(beforePosition);
            objectVelocity = obstacle.velocity.length();
            obstacle.mesh.position.copy(savedPosition);
            obstacle.mesh.quaternion.copy(savedQuaternion);
            obstacle.mesh.scale.copy(savedScale);
            obstacle.velocity.copy(savedVelocity);
            obstacle.angularVelocity.copy(savedAngularVelocity);
            obstacle.sleeping = savedSleeping;
            this.worldColliderGridDirty = true;
          }
        }

        loadBeforeSpill = this.bucketLoad;
        const heightBeforeSpill = this.excavator.bucketLoadDistributionStats().totalHeight;
        Object.assign(this.angles, { swing: 0, boom: 0.54, stick: -1.16, bucket: 0.28 });
        this.excavator.applyAngles(this.angles);
        this.excavator.slumpBucketLoadUnderGravity(0.8, 2.6);
        const spill = this.excavator.spillBucketLoadOverLip(0.85, 3.4, this.bucketLoad, this.bucketLoad * 0.34, 1.05);
        spilledVolume = spill.spilledVolume;
        this.bucketLoad = Math.max(0, this.bucketLoad - spilledVolume);
        loadAfterSpill = this.bucketLoad;
        spillHeightDrop = Math.max(0, heightBeforeSpill - this.excavator.bucketLoadDistributionStats().totalHeight);
        spillVolumeConserved = Math.abs(loadBeforeSpill - loadAfterSpill - spilledVolume);

        this.updateUi(0);
        return {
          bucketLoad: this.bucketLoad,
          surfaceHeight: surface?.loadHeight ?? 0,
          surfaceNormalY: surface?.normal.y ?? 0,
          loadCenterShiftX: loadStatsAfterSlump.centerX - loadStatsBeforeSlump.centerX,
          loadCenterShiftZ: loadStatsAfterSlump.centerZ - loadStatsBeforeSlump.centerZ,
          loadHeightConserved: Math.abs(loadStatsAfterSlump.totalHeight - loadHeightBeforeSlump),
          loadLipRatio: loadStatsAfterSlump.lipRatio,
          loadSlumpMoved,
          soilPenetrationBefore,
          soilPenetrationAfter,
          capturedVolume,
          objectPenetrationBefore,
          objectPenetrationAfter,
          objectTravel,
          objectVelocity,
          loadBeforeSpill,
          spilledVolume,
          loadAfterSpill,
          spillHeightDrop,
          spillVolumeConserved,
          pressure: this.pressure,
        };
      },
      forceBucketShellPhysics: () => {
        const savedAngles = { ...this.angles };
        const savedMachinePosition = this.excavator.group.position.clone();
        const savedMachineRotation = this.excavator.group.rotation.clone();
        const savedBucketLoad = this.bucketLoad;
        const savedTransitLoad = this.bucketTransitLoad;
        const savedPressure = this.pressure;
        const obstacle =
          this.worldColliders.find((collider) => collider.kind === "boulder") ??
          this.worldColliders.find((collider) => collider.kind === "rock");

        this.bucketLoad = 0;
        this.bucketTransitLoad = 0;
        this.pressure = 0;
        this.excavator.group.position.set(0, this.terrain.getHeightAt(0, 0), 0);
        this.excavator.group.rotation.set(0, 0, 0);
        Object.assign(this.angles, { swing: 0, boom: 0.54, stick: -1.16, bucket: -2.16 });
        this.excavator.applyAngles(this.angles);
        this.excavator.setBucketLoad(0);

        const probeShell = (local: THREE.Vector3): { before: number; after: number; travel: number } => {
          if (!obstacle) {
            return { before: 0, after: 0, travel: 0 };
          }
          const savedPosition = obstacle.mesh.position.clone();
          const savedQuaternion = obstacle.mesh.quaternion.clone();
          const savedScale = obstacle.mesh.scale.clone();
          const savedVelocity = obstacle.velocity.clone();
          const savedAngularVelocity = obstacle.angularVelocity.clone();
          const savedSleeping = obstacle.sleeping;

          obstacle.mesh.position.copy(this.excavator.bucketGroup.localToWorld(local.clone()));
          obstacle.velocity.set(0, 0, 0);
          obstacle.angularVelocity.set(0, 0, 0);
          obstacle.sleeping = false;
          this.worldColliderGridDirty = true;
          const before = this.resolveLooseObjectExcavatorHit(obstacle)?.penetration ?? 0;
          const beforePosition = obstacle.mesh.position.clone();
          this.resolveLooseObjectExcavatorCollision(obstacle);
          const after = this.resolveLooseObjectExcavatorHit(obstacle)?.penetration ?? 0;
          const travel = obstacle.mesh.position.distanceTo(beforePosition);

          obstacle.mesh.position.copy(savedPosition);
          obstacle.mesh.quaternion.copy(savedQuaternion);
          obstacle.mesh.scale.copy(savedScale);
          obstacle.velocity.copy(savedVelocity);
          obstacle.angularVelocity.copy(savedAngularVelocity);
          obstacle.sleeping = savedSleeping;
          this.worldColliderGridDirty = true;
          return { before, after, travel };
        };

        const floor = probeShell(new THREE.Vector3(-0.68, -0.5, 0));
        const side = probeShell(new THREE.Vector3(-0.62, -0.34, 0.52));
        const tooth = probeShell(new THREE.Vector3(-1.5, -0.54, 0.36));
        const measuredPressure = this.pressure;
        const bucketSampleCount = this.excavator.armCollisionSamples().filter((sample) => sample.action === "bucket").length;

        this.bucketLoad = savedBucketLoad;
        this.bucketTransitLoad = savedTransitLoad;
        this.pressure = savedPressure;
        this.excavator.group.position.copy(savedMachinePosition);
        this.excavator.group.rotation.copy(savedMachineRotation);
        Object.assign(this.angles, savedAngles);
        this.excavator.applyAngles(this.angles);
        this.excavator.setBucketLoad(this.bucketLoad);
        this.previousBucketTip.copy(this.excavator.bucketTipWorld());
        this.updateUi(0);

        return {
          bucketSampleCount,
          floorPenetrationBefore: floor.before,
          floorPenetrationAfter: floor.after,
          floorTravel: floor.travel,
          sidePenetrationBefore: side.before,
          sidePenetrationAfter: side.after,
          sideTravel: side.travel,
          toothPenetrationBefore: tooth.before,
          toothPenetrationAfter: tooth.after,
          toothTravel: tooth.travel,
          pressure: measuredPressure,
        };
      },
      forceHydraulicLinkagePhysics: () => {
        const previousAngles: ExcavatorAngles = { swing: 0, boom: 0.52, stick: -1.08, bucket: -2.08 };
        Object.assign(this.angles, previousAngles, { stick: -1.36, bucket: -2.32 });
        this.velocities.boom = -0.08;
        this.velocities.stick = -0.62;
        this.velocities.bucket = -0.42;
        this.excavator.group.position.set(0, this.terrain.getHeightAt(0, 0), 0);
        this.excavator.group.rotation.set(0, 0, 0);
        this.excavator.applyAngles(this.angles);
        this.previousBucketTip.copy(this.excavator.bucketTipWorld());

        const samples = this.excavator.hydraulicCollisionSamples();
        const pinSamples = this.excavator.visualPinCollisionSamples();
        const objectSample = samples.find((sample) => sample.key === "stick-cylinder-0.50") ?? samples.find((sample) => sample.action === "stick") ?? samples[0];
        const pinObjectSample = pinSamples.find((sample) => sample.key === "stick-link-pin") ?? pinSamples.find((sample) => sample.action === "stick") ?? pinSamples[0];
        const subsoilSamples = this.excavator.armSubsoilSamples().filter((sample) =>
          sample.key?.includes("cylinder") || sample.key?.includes("rocker") || sample.key?.includes("link"),
        );
        let objectPenetrationBefore = 0;
        let objectPenetrationAfter = 0;
        let objectTravel = 0;
        let objectVelocity = 0;
        let pinObjectPenetrationBefore = 0;
        let pinObjectPenetrationAfter = 0;
        let pinObjectTravel = 0;
        let pinObjectVelocity = 0;
        let movableHit = false;
        let pinObjectHit = false;
        const obstacle =
          this.worldColliders.find((collider) => !collider.immovable && collider.kind === "rock") ??
          this.worldColliders.find((collider) => !collider.immovable && collider.kind === "clod");
        if (objectSample && obstacle) {
          const savedPosition = obstacle.mesh.position.clone();
          const savedQuaternion = obstacle.mesh.quaternion.clone();
          const savedVelocity = obstacle.velocity.clone();
          const savedAngularVelocity = obstacle.angularVelocity.clone();
          const savedSleeping = obstacle.sleeping;
          obstacle.mesh.position.copy(objectSample.point);
          obstacle.velocity.set(0, 0, 0);
          obstacle.angularVelocity.set(0, 0, 0);
          obstacle.sleeping = false;
          this.worldColliderGridDirty = true;
          this.collisionCooldown = 0;
          objectPenetrationBefore = Math.max(0, objectSample.radius + obstacle.radius - objectSample.point.distanceTo(obstacle.mesh.position));
          const beforePosition = obstacle.mesh.position.clone();
          const objectResult = this.resolveArmWorldObjectCollisions(previousAngles);
          const afterSample =
            this.excavator.hydraulicCollisionSamples().find((sample) => sample.key === objectSample.key) ?? objectSample;
          objectPenetrationAfter = Math.max(0, afterSample.radius + obstacle.radius - afterSample.point.distanceTo(obstacle.mesh.position));
          objectTravel = obstacle.mesh.position.distanceTo(beforePosition);
          objectVelocity = obstacle.velocity.length();
          movableHit = objectResult.movableHit;
          obstacle.mesh.position.copy(savedPosition);
          obstacle.mesh.quaternion.copy(savedQuaternion);
          obstacle.velocity.copy(savedVelocity);
          obstacle.angularVelocity.copy(savedAngularVelocity);
          obstacle.sleeping = savedSleeping;
          this.worldColliderGridDirty = true;
        }

        if (pinObjectSample && obstacle) {
          const savedPosition = obstacle.mesh.position.clone();
          const savedQuaternion = obstacle.mesh.quaternion.clone();
          const savedVelocity = obstacle.velocity.clone();
          const savedAngularVelocity = obstacle.angularVelocity.clone();
          const savedSleeping = obstacle.sleeping;
          obstacle.mesh.position.copy(pinObjectSample.point);
          obstacle.velocity.set(0, 0, 0);
          obstacle.angularVelocity.set(0, 0, 0);
          obstacle.sleeping = false;
          this.worldColliderGridDirty = true;
          this.collisionCooldown = 0;
          pinObjectPenetrationBefore = Math.max(
            0,
            pinObjectSample.radius + obstacle.radius - pinObjectSample.point.distanceTo(obstacle.mesh.position),
          );
          const beforePosition = obstacle.mesh.position.clone();
          const pinObjectResult = this.resolveArmWorldObjectCollisions(previousAngles);
          const afterPinSample =
            this.excavator.visualPinCollisionSamples().find((sample) => sample.key === pinObjectSample.key) ?? pinObjectSample;
          pinObjectPenetrationAfter = Math.max(
            0,
            afterPinSample.radius + obstacle.radius - afterPinSample.point.distanceTo(obstacle.mesh.position),
          );
          pinObjectTravel = obstacle.mesh.position.distanceTo(beforePosition);
          pinObjectVelocity = obstacle.velocity.length();
          pinObjectHit = pinObjectResult.movableHit;
          obstacle.mesh.position.copy(savedPosition);
          obstacle.mesh.quaternion.copy(savedQuaternion);
          obstacle.velocity.copy(savedVelocity);
          obstacle.angularVelocity.copy(savedAngularVelocity);
          obstacle.sleeping = savedSleeping;
          this.worldColliderGridDirty = true;
        }

        const subsoilTarget =
          subsoilSamples.find((sample) => sample.key === "bucket-link-left-0.50") ??
          subsoilSamples.find((sample) => sample.key?.startsWith("bucket-link")) ??
          subsoilSamples[0];
        if (subsoilTarget) {
          const ground = this.terrain.getHeightAt(subsoilTarget.point.x, subsoilTarget.point.z);
          const buryDepth = Math.max(0, subsoilTarget.point.y - ground + subsoilTarget.radius + 0.28);
          this.excavator.group.position.y -= buryDepth;
          this.excavator.applyAngles(this.angles);
        }
        const subsoilResult = this.resolveArmTerrainResistance(previousAngles);
        this.updateUi(0);
        return {
          sampleCount: samples.length,
          subsoilSampleCount: subsoilSamples.length,
          pinSampleCount: pinSamples.length,
          movableHit,
          pinObjectHit,
          objectPenetrationBefore,
          objectPenetrationAfter,
          objectTravel,
          objectVelocity,
          pinObjectPenetrationBefore,
          pinObjectPenetrationAfter,
          pinObjectTravel,
          pinObjectVelocity,
          pressure: this.pressure,
          collisionCount: this.collisionCount,
          subsoilResisted: subsoilResult.resisted,
          subsoilMaxSubmerged: subsoilResult.maxSubmerged,
          subsoilAverageSubmerged: subsoilResult.averageSubmerged,
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
        const result = this.compactTrackStripWithWake(center, forward, side, TRACK_LENGTH, TRACK_WIDTH, 0.2);
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
      forceTrackTractionPhysics: () => {
        const savedPosition = this.excavator.group.position.clone();
        const savedRotation = this.excavator.group.rotation.clone();
        const savedLeftTrack = this.leftTrackVelocity;
        const savedRightTrack = this.rightTrackVelocity;
        const savedTraction = { ...this.trackTraction };
        const forward = new THREE.Vector3(1, 0, 0);

        const runAt = (point: THREE.Vector3) => {
          this.excavator.group.position.set(point.x, this.terrain.getHeightAt(point.x, point.z), point.z);
          this.excavator.group.rotation.set(0, 0, 0);
          this.leftTrackVelocity = TRACK_MAX_SPEED;
          this.rightTrackVelocity = TRACK_MAX_SPEED;
          const surface = this.terrain.getSurfaceConditionAt(point.x, point.z);
          const side = new THREE.Vector3(0, 0, 1);
          const leftCenter = point.clone().addScaledVector(side, -0.72);
          const rightCenter = point.clone().addScaledVector(side, 0.72);
          const beforeHeight =
            (this.terrain.getHeightAt(leftCenter.x, leftCenter.z) + this.terrain.getHeightAt(rightCenter.x, rightCenter.z)) * 0.5;
          this.trackTraction = this.computeTrackTraction(forward);
          const traction = (this.trackTraction.leftTraction + this.trackTraction.rightTraction) * 0.5;
          const slip = (this.trackTraction.leftSlip + this.trackTraction.rightSlip) * 0.5;
          const groundSpeed = (this.trackTraction.leftGroundSpeed + this.trackTraction.rightGroundSpeed) * 0.5;
          this.updateTrackSoilInteraction(0.48, forward);
          const afterHeight =
            (this.terrain.getHeightAt(leftCenter.x, leftCenter.z) + this.terrain.getHeightAt(rightCenter.x, rightCenter.z)) * 0.5;
          return {
            traction,
            slip,
            groundSpeed,
            rutDrop: Math.max(0, beforeHeight - afterHeight),
            dragMultiplier: surface.trackDragMultiplier,
          };
        };

        const mud = runAt(new THREE.Vector3(9.8, 0, -8.8));
        const hard = runAt(new THREE.Vector3(-8.0, 0, 20.5));

        this.excavator.group.position.copy(savedPosition);
        this.excavator.group.rotation.copy(savedRotation);
        this.leftTrackVelocity = savedLeftTrack;
        this.rightTrackVelocity = savedRightTrack;
        this.trackTraction = savedTraction;
        this.updateUi(0);

        return {
          mudTraction: mud.traction,
          hardTraction: hard.traction,
          mudSlip: mud.slip,
          hardSlip: hard.slip,
          mudGroundSpeed: mud.groundSpeed,
          hardGroundSpeed: hard.groundSpeed,
          mudRutDrop: mud.rutDrop,
          hardRutDrop: hard.rutDrop,
          mudDragMultiplier: mud.dragMultiplier,
          hardDragMultiplier: hard.dragMultiplier,
        };
      },
      forceTruckCollision: () => {
        const yawFromForward = (worldForward: THREE.Vector3) => Math.atan2(-worldForward.z, worldForward.x);
        const runScenario = (localStart: THREE.Vector3, localForward: THREE.Vector3) => {
          const start = this.truck.group.localToWorld(localStart.clone());
          const forwardWorld = localForward
            .clone()
            .normalize()
            .applyQuaternion(this.truck.group.quaternion)
            .setY(0)
            .normalize();
          const beforeLocal = this.truck.group.worldToLocal(start.clone());
          this.excavator.group.position.set(start.x, this.terrain.getHeightAt(start.x, start.z), start.z);
          this.excavator.group.rotation.set(0, yawFromForward(forwardWorld), 0);
          this.leftTrackVelocity = TRACK_MAX_SPEED;
          this.rightTrackVelocity = TRACK_MAX_SPEED;
          this.collisionCooldown = 0;
          const result = this.resolveWorldCollisions(TRACK_MAX_SPEED, 0, forwardWorld);
          const afterLocal = this.truck.group.worldToLocal(this.excavator.group.position.clone());
          return {
            beforeLocal,
            afterLocal,
            contact: result.truckContact,
            leftTrackVelocity: this.leftTrackVelocity,
            rightTrackVelocity: this.rightTrackVelocity,
          };
        };

        const front = runScenario(new THREE.Vector3(-3.1, 0, 0), new THREE.Vector3(1, 0, 0));
        const side = runScenario(new THREE.Vector3(0.24, 0, -2.72), new THREE.Vector3(0, 0, 1));
        const diagonal = runScenario(new THREE.Vector3(-3.18, 0, -2.28), new THREE.Vector3(1, 0, 0.72));
        const highClearProbe = this.truck.group.localToWorld(new THREE.Vector3(0.2, 3.05, 0));
        const elevatedFalseContact = Boolean(this.truck.resolveBodyCollision(highClearProbe, TRACK_WIDTH * 0.54));
        const openBedProbe = this.truck.group.localToWorld(new THREE.Vector3(0.54, 1.24, 0));
        const chassisProbe = this.truck.group.localToWorld(new THREE.Vector3(0.0, 0.45, 0.0));
        const wheelProbe = this.truck.group.localToWorld(new THREE.Vector3(-1.7, 0.32, -1.02));
        const openBedEnvelopePenetration = this.truck.resolveBodyCollision(openBedProbe, 0.08)?.penetration ?? 0;
        const openBedSolidPenetration = this.truck.resolveSolidCollision(openBedProbe, 0.08)?.penetration ?? 0;
        const chassisSolidPenetration = this.truck.resolveSolidCollision(chassisProbe, 0.08)?.penetration ?? 0;
        const wheelSolidPenetration = this.truck.resolveSolidCollision(wheelProbe, 0.08)?.penetration ?? 0;
        const supportForward = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.excavator.group.rotation.y);
        this.updateExcavatorSupport(0.3, supportForward);
        this.updateUi(0);
        return {
          beforeX: front.beforeLocal.x,
          afterX: front.afterLocal.x,
          blocked:
            front.afterLocal.x < front.beforeLocal.x - 0.08 &&
            Math.abs(front.leftTrackVelocity) < TRACK_MAX_SPEED * 0.58 &&
            Math.abs(front.rightTrackVelocity) < TRACK_MAX_SPEED * 0.58,
          sideBeforeZ: side.beforeLocal.z,
          sideAfterZ: side.afterLocal.z,
          sideBlocked:
            side.afterLocal.z < side.beforeLocal.z - 0.06 &&
            Math.abs(side.leftTrackVelocity) < TRACK_MAX_SPEED * 0.7 &&
            Math.abs(side.rightTrackVelocity) < TRACK_MAX_SPEED * 0.7,
          diagonalBeforeX: diagonal.beforeLocal.x,
          diagonalBeforeZ: diagonal.beforeLocal.z,
          diagonalAfterX: diagonal.afterLocal.x,
          diagonalAfterZ: diagonal.afterLocal.z,
          diagonalBlocked:
            diagonal.afterLocal.x < diagonal.beforeLocal.x - 0.04 &&
            diagonal.afterLocal.z < diagonal.beforeLocal.z - 0.04 &&
            (Math.abs(diagonal.leftTrackVelocity) < TRACK_MAX_SPEED * 0.72 ||
              Math.abs(diagonal.rightTrackVelocity) < TRACK_MAX_SPEED * 0.72),
          elevatedFalseContact,
          openBedEnvelopePenetration,
          openBedSolidPenetration,
          chassisSolidPenetration,
          wheelSolidPenetration,
          frontContact: front.contact,
          sideContact: side.contact,
          diagonalContact: diagonal.contact,
          collisionCount: this.collisionCount,
          pressure: this.pressure,
        };
      },
      forceTruckImpactPhysics: () => {
        const yawFromForward = (worldForward: THREE.Vector3) => Math.atan2(-worldForward.z, worldForward.x);
        this.truck.reset(this.terrain);
        this.truckLoad = 0;
        this.truck.updateLoad(this.truckLoad);
        const before = this.truck.physicsState();

        const localStart = new THREE.Vector3(-3.1, 0, 0);
        const localForward = new THREE.Vector3(1, 0, 0);
        const start = this.truck.group.localToWorld(localStart.clone());
        const forwardWorld = localForward
          .clone()
          .normalize()
          .applyQuaternion(this.truck.group.quaternion)
          .setY(0)
          .normalize();
        this.excavator.group.position.set(start.x, this.terrain.getHeightAt(start.x, start.z), start.z);
        this.excavator.group.rotation.set(0, yawFromForward(forwardWorld), 0);
        this.leftTrackVelocity = TRACK_MAX_SPEED;
        this.rightTrackVelocity = TRACK_MAX_SPEED;
        this.collisionCooldown = 0;
        const crawlerContact = this.resolveWorldCollisions(TRACK_MAX_SPEED, 0, forwardWorld).truckContact;
        const afterCrawlerImpact = this.truck.physicsState();
        const crawlerImpactImpulse = Math.max(0, afterCrawlerImpact.impactImpulse - before.impactImpulse);
        const afterCrawlerBody = this.truck.updatePhysics(this.terrain, this.truckLoad, 0.08, false);

        let objectImpactImpulse = 0;
        const obstacle =
          this.worldColliders.find((collider) => collider.kind === "boulder") ??
          this.worldColliders.find((collider) => collider.kind === "rock");
        if (obstacle) {
          const savedPosition = obstacle.mesh.position.clone();
          const savedQuaternion = obstacle.mesh.quaternion.clone();
          const savedVelocity = obstacle.velocity.clone();
          const savedAngularVelocity = obstacle.angularVelocity.clone();
          const savedSleeping = obstacle.sleeping;
          const probe = this.truck.group.localToWorld(new THREE.Vector3(-2.12, 1.03, 0.0));
          obstacle.mesh.position.copy(probe);
          const hit = this.truck.resolveSolidCollision(obstacle.mesh.position, obstacle.radius);
          obstacle.velocity.copy(hit?.normal ?? new THREE.Vector3(1, 0, 0)).multiplyScalar(-1.15);
          obstacle.angularVelocity.set(0, 0, 0);
          obstacle.sleeping = false;
          const beforeObjectImpact = this.truck.physicsState().impactImpulse;
          this.resolveLooseObjectTruckCollision(obstacle);
          objectImpactImpulse = Math.max(0, this.truck.physicsState().impactImpulse - beforeObjectImpact);
          this.truck.updatePhysics(this.terrain, this.truckLoad, 0.08, false);
          obstacle.mesh.position.copy(savedPosition);
          obstacle.mesh.quaternion.copy(savedQuaternion);
          obstacle.velocity.copy(savedVelocity);
          obstacle.angularVelocity.copy(savedAngularVelocity);
          obstacle.sleeping = savedSleeping;
          this.worldColliderGridDirty = true;
        }

        const soilRadius = 0.08;
        const soilMesh = this.acquireSoilParticleMesh(soilRadius, this.looseSoilMats[0], 3409);
        const soilProbe = this.truck.group.localToWorld(new THREE.Vector3(0.54, 1.12, -0.86));
        soilMesh.position.copy(soilProbe);
        const soilHit = this.truck.resolveSolidCollision(soilMesh.position, soilRadius);
        const soilParticle: SoilParticle = {
          mesh: soilMesh,
          velocity: (soilHit?.normal ?? new THREE.Vector3(0, 0, 1)).clone().multiplyScalar(-0.85).add(new THREE.Vector3(0, -0.08, 0)),
          volume: 0.045,
          radius: soilRadius,
          life: 0,
          settles: true,
        };
        const beforeSoilImpact = this.truck.physicsState().impactImpulse;
        this.resolveSoilParticleCollisions(soilParticle);
        const afterSoilImpact = this.truck.physicsState();
        const soilImpactImpulse = Math.max(0, afterSoilImpact.impactImpulse - beforeSoilImpact);
        this.recycleSoilParticle(soilParticle);

        const afterBody = this.truck.updatePhysics(this.terrain, this.truckLoad, 0.08, false);
        this.updateUi(0);
        return {
          crawlerContact: crawlerContact.contact,
          crawlerBlocked:
            crawlerContact.leftBlocked ||
            crawlerContact.rightBlocked ||
            Math.abs(this.leftTrackVelocity) < TRACK_MAX_SPEED * 0.58 ||
            Math.abs(this.rightTrackVelocity) < TRACK_MAX_SPEED * 0.58,
          crawlerImpactImpulse,
          objectImpactImpulse,
          soilImpactImpulse,
          bodyPitchDelta: Math.abs(afterBody.pitch - before.pitch),
          bodyRollDelta: Math.abs(afterBody.roll - before.roll),
          impactPitch: Math.max(Math.abs(afterCrawlerImpact.impactPitch), Math.abs(afterCrawlerBody.impactPitch), Math.abs(afterBody.impactPitch)),
          impactRoll: Math.max(Math.abs(afterCrawlerImpact.impactRoll), Math.abs(afterCrawlerBody.impactRoll), Math.abs(afterBody.impactRoll)),
          truckStayedPut: Math.hypot(this.truck.group.position.x - TRUCK_CENTER.x, this.truck.group.position.z - TRUCK_CENTER.z) < 0.02,
        };
      },
      forceTruckWheelPhysics: () => {
        this.truck.reset(this.terrain);
        this.truckLoad = 0;
        this.truck.updateLoad(this.truckLoad);
        const wheelProbe = this.truck.group.localToWorld(new THREE.Vector3(-1.7, 0.32, -1.22));
        const probeRadius = 0.08;
        const wheelPenetrationBefore = this.truck.resolveWheelCollision(wheelProbe, probeRadius)?.penetration ?? 0;
        const solidPenetrationBefore = this.truck.resolveSolidCollision(wheelProbe, probeRadius)?.penetration ?? 0;
        const impactStart = this.truck.physicsState().impactImpulse;

        let wheelPenetrationAfter = 0;
        let objectTravel = 0;
        let objectImpulse = 0;
        let objectVelocity = 0;
        const obstacle =
          this.worldColliders.find((collider) => !collider.immovable && collider.kind === "rock") ??
          this.worldColliders.find((collider) => !collider.immovable && collider.kind === "clod") ??
          this.worldColliders.find((collider) => !collider.immovable && collider.kind === "boulder");
        if (obstacle) {
          const savedPosition = obstacle.mesh.position.clone();
          const savedQuaternion = obstacle.mesh.quaternion.clone();
          const savedVelocity = obstacle.velocity.clone();
          const savedAngularVelocity = obstacle.angularVelocity.clone();
          const savedSleeping = obstacle.sleeping;
          obstacle.mesh.position.copy(wheelProbe);
          const hit = this.truck.resolveWheelCollision(obstacle.mesh.position, obstacle.radius);
          obstacle.velocity.copy(hit?.normal ?? new THREE.Vector3(0, 0, -1)).multiplyScalar(-0.72);
          obstacle.angularVelocity.set(0, 0, 0);
          obstacle.sleeping = false;
          const beforeObject = obstacle.mesh.position.clone();
          const beforeImpact = this.truck.physicsState().impactImpulse;
          this.resolveLooseObjectTruckCollision(obstacle);
          wheelPenetrationAfter = this.truck.resolveWheelCollision(obstacle.mesh.position, obstacle.radius)?.penetration ?? 0;
          objectTravel = obstacle.mesh.position.distanceTo(beforeObject);
          objectVelocity = obstacle.velocity.length();
          objectImpulse = Math.max(0, this.truck.physicsState().impactImpulse - beforeImpact);
          obstacle.mesh.position.copy(savedPosition);
          obstacle.mesh.quaternion.copy(savedQuaternion);
          obstacle.velocity.copy(savedVelocity);
          obstacle.angularVelocity.copy(savedAngularVelocity);
          obstacle.sleeping = savedSleeping;
          this.worldColliderGridDirty = true;
        }

        const soilRadius = 0.07;
        const soilMesh = this.acquireSoilParticleMesh(soilRadius, this.looseSoilMats[0], 4551);
        soilMesh.position.copy(wheelProbe);
        const soilParticle: SoilParticle = {
          mesh: soilMesh,
          velocity: new THREE.Vector3(0, -0.05, -0.55),
          volume: 0.04,
          radius: soilRadius,
          life: 0,
          settles: true,
        };
        const soilPenetrationBefore = this.truck.resolveWheelCollision(soilMesh.position, soilRadius)?.penetration ?? 0;
        const beforeSoilImpact = this.truck.physicsState().impactImpulse;
        this.resolveSoilParticleCollisions(soilParticle);
        const soilPenetrationAfter = this.truck.resolveWheelCollision(soilMesh.position, soilRadius)?.penetration ?? 0;
        const soilImpactImpulse = Math.max(0, this.truck.physicsState().impactImpulse - beforeSoilImpact);
        this.recycleSoilParticle(soilParticle);
        this.updateUi(0);

        return {
          wheelPenetrationBefore,
          wheelPenetrationAfter,
          solidPenetrationBefore,
          objectTravel,
          objectImpulse,
          objectVelocity,
          soilPenetrationBefore,
          soilPenetrationAfter,
          soilImpactImpulse,
          truckImpactImpulse: Math.max(0, this.truck.physicsState().impactImpulse - impactStart),
        };
      },
      forceUpperStructurePhysics: () => {
        this.truck.reset(this.terrain);
        this.truckLoad = 0;
        this.truck.updateLoad(this.truckLoad);
        this.excavator.group.rotation.set(0, 0, 0);

        const previousTruckAngles: ExcavatorAngles = { swing: -0.42, boom: 0.36, stick: -1.24, bucket: -1.2 };
        const truckAngles: ExcavatorAngles = { ...previousTruckAngles, swing: 0.42 };
        Object.assign(this.angles, truckAngles);
        this.excavator.group.position.set(0, this.terrain.getHeightAt(0, 0), 0);
        this.excavator.applyAngles(this.angles);
        const truckProbe = this.truck.group.localToWorld(new THREE.Vector3(-2.12, 1.03, 0));
        const truckSample = this.excavator.upperCollisionSamples().find((sample) => sample.key === "cab-low") ?? this.excavator.upperCollisionSamples()[0];
        const truckOffset = truckSample.point.clone().sub(this.excavator.group.position);
        this.excavator.group.position.x = truckProbe.x - truckOffset.x;
        this.excavator.group.position.z = truckProbe.z - truckOffset.z;
        this.excavator.group.position.y = this.terrain.getHeightAt(this.excavator.group.position.x, this.excavator.group.position.z);
        this.excavator.applyAngles(this.angles);
        this.velocities.swing = 1.1;
        this.collisionCooldown = 0;
        const swingBefore = this.angles.swing;
        const truckImpactBefore = this.truck.physicsState().impactImpulse;
        const truckResult = this.resolveUpperTruckCollisions(previousTruckAngles);
        const truckImpactImpulse = Math.max(0, this.truck.physicsState().impactImpulse - truckImpactBefore);
        const truckSwingAfter = this.angles.swing;
        const truckVelocityAfter = this.velocities.swing;

        let objectHit = false;
        let objectTravel = 0;
        let objectImpulse = 0;
        let movedMass = 0;
        let upperSampleCount = 0;
        let exhaustSamplePresent = false;
        let exhaustObjectHit = false;
        let exhaustObjectTravel = 0;
        let exhaustObjectImpulse = 0;
        const obstacle =
          this.worldColliders.find((collider) => collider.kind === "boulder") ??
          this.worldColliders.find((collider) => collider.kind === "rock");
        if (obstacle) {
          const savedPosition = obstacle.mesh.position.clone();
          const savedQuaternion = obstacle.mesh.quaternion.clone();
          const savedVelocity = obstacle.velocity.clone();
          const savedAngularVelocity = obstacle.angularVelocity.clone();
          const savedSleeping = obstacle.sleeping;
          const previousObjectAngles: ExcavatorAngles = { swing: -0.35, boom: 0.36, stick: -1.24, bucket: -1.2 };
          const objectAngles: ExcavatorAngles = { ...previousObjectAngles, swing: 0.35 };
          Object.assign(this.angles, objectAngles);
          this.excavator.group.position.set(0, this.terrain.getHeightAt(0, 0), 0);
          this.excavator.applyAngles(this.angles);
          const objectSample =
            this.excavator.upperCollisionSamples().find((sample) => sample.key === "engine-center") ??
            this.excavator.upperCollisionSamples()[0];
          const overlap = Math.max(0.04, (objectSample.radius + obstacle.radius) * 0.42);
          obstacle.mesh.position.copy(objectSample.point).add(new THREE.Vector3(overlap, 0, 0));
          obstacle.velocity.set(0, 0, 0);
          obstacle.angularVelocity.set(0, 0, 0);
          obstacle.sleeping = false;
          this.worldColliderGridDirty = true;
          this.velocities.swing = 0.9;
          this.collisionCooldown = 0;
          const objectBefore = obstacle.mesh.position.clone();
          const objectResult = this.resolveUpperWorldObjectCollisions(previousObjectAngles);
          this.updateLooseWorldObjects(0.24);
          objectHit = objectResult.movableHit;
          objectTravel = obstacle.mesh.position.distanceTo(objectBefore);
          objectImpulse = objectResult.objectImpulse;
          movedMass = objectResult.movedMass;
          obstacle.mesh.position.copy(savedPosition);
          obstacle.mesh.quaternion.copy(savedQuaternion);
          obstacle.velocity.copy(savedVelocity);
          obstacle.angularVelocity.copy(savedAngularVelocity);
          obstacle.sleeping = savedSleeping;
          this.worldColliderGridDirty = true;
        }

        const exhaustObstacle =
          this.worldColliders.find((collider) => !collider.immovable && collider.kind === "cone") ??
          this.worldColliders.find((collider) => !collider.immovable && collider.kind === "rock");
        if (exhaustObstacle) {
          const savedPosition = exhaustObstacle.mesh.position.clone();
          const savedQuaternion = exhaustObstacle.mesh.quaternion.clone();
          const savedVelocity = exhaustObstacle.velocity.clone();
          const savedAngularVelocity = exhaustObstacle.angularVelocity.clone();
          const savedSleeping = exhaustObstacle.sleeping;
          const previousExhaustAngles: ExcavatorAngles = { swing: -0.28, boom: 0.36, stick: -1.24, bucket: -1.2 };
          const exhaustAngles: ExcavatorAngles = { ...previousExhaustAngles, swing: 0.28 };
          Object.assign(this.angles, exhaustAngles);
          this.excavator.group.position.set(0, this.terrain.getHeightAt(0, 0), 0);
          this.excavator.applyAngles(this.angles);
          const upperSamples = this.excavator.upperCollisionSamples();
          upperSampleCount = upperSamples.length;
          const exhaustSample = upperSamples.find((sample) => sample.key === "exhaust-mid");
          exhaustSamplePresent = Boolean(exhaustSample);
          if (exhaustSample) {
            const overlap = Math.max(0.035, (exhaustSample.radius + exhaustObstacle.radius) * 0.42);
            exhaustObstacle.mesh.position.copy(exhaustSample.point).add(new THREE.Vector3(overlap, 0, 0));
            exhaustObstacle.velocity.set(0, 0, 0);
            exhaustObstacle.angularVelocity.set(0, 0, 0);
            exhaustObstacle.sleeping = false;
            this.worldColliderGridDirty = true;
            this.velocities.swing = 0.78;
            this.collisionCooldown = 0;
            const exhaustBefore = exhaustObstacle.mesh.position.clone();
            const exhaustResult = this.resolveUpperWorldObjectCollisions(previousExhaustAngles);
            this.updateLooseWorldObjects(0.18);
            exhaustObjectHit = exhaustResult.movableHit;
            exhaustObjectTravel = exhaustObstacle.mesh.position.distanceTo(exhaustBefore);
            exhaustObjectImpulse = exhaustResult.objectImpulse;
          }
          exhaustObstacle.mesh.position.copy(savedPosition);
          exhaustObstacle.mesh.quaternion.copy(savedQuaternion);
          exhaustObstacle.velocity.copy(savedVelocity);
          exhaustObstacle.angularVelocity.copy(savedAngularVelocity);
          exhaustObstacle.sleeping = savedSleeping;
          this.worldColliderGridDirty = true;
        } else {
          upperSampleCount = this.excavator.upperCollisionSamples().length;
          exhaustSamplePresent = this.excavator.upperCollisionSamples().some((sample) => sample.key === "exhaust-mid");
        }

        this.updateUi(0);
        return {
          truckCollided: truckResult.collided,
          truckBlocked: truckResult.blocked,
          swingBefore,
          swingAfter: truckSwingAfter,
          velocityAfter: truckVelocityAfter,
          truckImpactImpulse,
          truckPenetration: truckResult.penetration,
          objectHit,
          objectTravel,
          objectImpulse,
          movedMass,
          upperSampleCount,
          exhaustSamplePresent,
          exhaustObjectHit,
          exhaustObjectTravel,
          exhaustObjectImpulse,
          pressure: this.pressure,
          collisionCount: this.collisionCount,
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
        const sweptStart = this.truck.group.localToWorld(new THREE.Vector3(-3.1, 1.03, 0));
        const sweptEnd = this.truck.group.localToWorld(new THREE.Vector3(-1.1, 1.03, 0));
        const sweptRadius = 0.12;
        const sweptOnlyCurrentPenetration = this.truck.resolveSolidCollision(sweptEnd, sweptRadius)?.penetration ?? 0;
        const sweptOnlyHit = this.resolveSweptTruckSampleHit(sweptStart, sweptEnd, sweptRadius);
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
          sweptOnlyCurrentPenetration,
          sweptOnlyPenetration: sweptOnlyHit?.penetration ?? 0,
          sweptOnlySteps: sweptOnlyHit?.sweptSteps ?? 0,
          sweptOnlyT: sweptOnlyHit?.sweptT ?? 0,
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
        const currentAngles = { ...this.angles };
        this.excavator.applyAngles(previousAngles);
        const previousStickSample = this.excavator
          .armSubsoilSamples()
          .find((sample) => sample.action === "stick" && sample.key === "stick-0.8");
        this.excavator.applyAngles(currentAngles);
        const sweepMotion = buryPoint.clone().sub(previousStickSample?.point ?? buryPoint);
        let sweepSide =
          Math.hypot(sweepMotion.x, sweepMotion.z) > 0.0001
            ? new THREE.Vector3(-sweepMotion.z, 0, sweepMotion.x).normalize()
            : this.excavator.bucketSidewaysWorld().setY(0).normalize();
        if (sweepSide.lengthSq() < 0.0001) {
          sweepSide = new THREE.Vector3(0, 0, 1);
        }
        const sweepCenter = previousStickSample?.point ? new THREE.Vector3().addVectors(previousStickSample.point, buryPoint).multiplyScalar(0.5) : buryPoint;
        this.raiseTerrainWithWake(buryPoint, 0.58, 0.86);
        const sampleBerm = () =>
          Math.max(
            this.terrain.getHeightAt(sweepCenter.x + sweepSide.x * 0.66, sweepCenter.z + sweepSide.z * 0.66),
            this.terrain.getHeightAt(sweepCenter.x - sweepSide.x * 0.66, sweepCenter.z - sweepSide.z * 0.66),
          );
        const beforeSurface = this.terrain.getHeightAt(sweepCenter.x, sweepCenter.z);
        const beforeBerm = sampleBerm();
        const beforeTerrain = this.terrain.terrainVolumeDelta();
        this.collisionCooldown = 0;
        const beforeStick = this.angles.stick;
        const result = this.resolveArmTerrainResistance(previousAngles);
        const afterSurface = this.terrain.getHeightAt(sweepCenter.x, sweepCenter.z);
        const afterBerm = sampleBerm();
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
          displacedVolume: result.displacedVolume,
          surfaceDrop: beforeSurface - afterSurface,
          bermRise: afterBerm - afterSurface - (beforeBerm - beforeSurface),
          terrainDelta: this.terrain.terrainVolumeDelta() - beforeTerrain,
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
        let carriedTruckReleased = false;
        let carriedTruckPenetrationBefore = 0;
        let carriedTruckPenetrationAfter = 0;
        let carriedTerrainReleased = false;
        let carriedTerrainPenetrationBefore = 0;
        let carriedTerrainPenetrationAfter = 0;
        let carriedTerrainImpactSpeed = 0;
        let carriedExcavatorReleased = false;
        let carriedExcavatorPenetrationBefore = 0;
        let carriedExcavatorPenetrationAfter = 0;
        let carriedExcavatorImpactSpeed = 0;
        let carriedObjectImpulse = 0;
        let heavyOrientationDelta = 0;
        let bucketOrientationDelta = 0;
        let orientationDeltaError = 0;
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
          debris.angularVelocity.set(0, 0, 0);
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
          const park = new THREE.Vector3(4.8, 0, 4.8);
          park.y = this.terrain.getHeightAt(park.x, park.z) + debris.groundOffset;
          debris.mesh.position.copy(park);
          debris.velocity.set(0, 0, 0);
          debris.angularVelocity.set(0, 0, 0);
          debris.sleeping = true;
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
          hard.angularVelocity.set(0, 0, 0);
          hard.sleeping = false;
          this.collisionCooldown = 0;
          beforeStick = this.angles.stick;
          const result = this.resolveArmWorldObjectCollisions(previousAngles);
          const carriedAfterHit = this.carriedWorldColliders.has(hard);
          const beforeLiftY = hard.mesh.position.y;
          const heavyQuaternionBeforeLift = hard.mesh.quaternion.clone();
          const bucketQuaternionBeforeLift = this.excavator.bucketGroup.getWorldQuaternion(new THREE.Quaternion());
          Object.assign(this.angles, { boom: this.angles.boom + 0.2, stick: this.angles.stick + 0.04 });
          this.velocities.boom = 0.42;
          this.excavator.applyAngles(this.angles);
          this.updateCarriedWorldObjects(0.34);
          heavyOrientationDelta = heavyQuaternionBeforeLift.angleTo(hard.mesh.quaternion);
          bucketOrientationDelta = bucketQuaternionBeforeLift.angleTo(this.excavator.bucketGroup.getWorldQuaternion(new THREE.Quaternion()));
          orientationDeltaError = Math.abs(heavyOrientationDelta - bucketOrientationDelta);
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

        if (debris) {
          this.carriedWorldColliders.clear();
          this.carriedWorldPreviousPositions.clear();
          this.carriedWorldLocalQuaternions.clear();
          Object.assign(this.angles, { swing: 0, boom: 0.44, stick: -1.46, bucket: -2.24 });
          this.excavator.applyAngles(this.angles);
          const local = new THREE.Vector3(-0.56, -0.28, 0);
          const truckTarget = this.truck.group.localToWorld(new THREE.Vector3(-2.12, 1.03, 0));
          const current = this.excavator.bucketGroup.localToWorld(local.clone());
          this.excavator.group.position.add(truckTarget.clone().sub(current));
          this.excavator.applyAngles(this.angles);
          debris.mesh.position.copy(truckTarget);
          debris.velocity.set(0, 0, 0);
          debris.angularVelocity.set(0, 0, 0);
          debris.sleeping = false;
          this.carryWorldColliderAt(debris, local, truckTarget.clone().add(new THREE.Vector3(-0.42, 0, 0)));
          this.collisionCooldown = 0;
          carriedTruckPenetrationBefore = this.truck.resolveSolidCollision(debris.mesh.position, debris.radius)?.penetration ?? 0;
          this.updateCarriedWorldObjects(0.08);
          carriedTruckReleased = !this.carriedWorldColliders.has(debris);
          carriedTruckPenetrationAfter = this.truck.resolveSolidCollision(debris.mesh.position, debris.radius)?.penetration ?? 0;
          this.releaseCarriedWorldObjects();
        }

        if (hard) {
          this.carriedWorldColliders.clear();
          this.carriedWorldPreviousPositions.clear();
          this.carriedWorldLocalQuaternions.clear();
          this.excavator.group.position.set(0, this.terrain.getHeightAt(0, 0), 0);
          Object.assign(this.angles, { swing: 0, boom: 0.42, stick: -1.52, bucket: -2.32 });
          this.excavator.applyAngles(this.angles);
          const local = new THREE.Vector3(-0.58, -0.3, 0.02);
          const terrainTarget = new THREE.Vector3(2.25, 0, -2.65);
          terrainTarget.y = this.terrain.getHeightAt(terrainTarget.x, terrainTarget.z) + hard.groundOffset - 0.34;
          const current = this.excavator.bucketGroup.localToWorld(local.clone());
          this.excavator.group.position.add(terrainTarget.clone().sub(current));
          this.excavator.applyAngles(this.angles);
          hard.mesh.position.copy(terrainTarget);
          hard.velocity.set(0, 0, 0);
          hard.angularVelocity.set(0, 0, 0);
          hard.sleeping = false;
          this.carryWorldColliderAt(hard, local, terrainTarget.clone().add(new THREE.Vector3(0, 0.46, 0)));
          this.collisionCooldown = 0;
          carriedTerrainPenetrationBefore = this.worldColliderTerrainSupport(hard).penetration;
          this.updateCarriedWorldObjects(0.08);
          carriedTerrainReleased = !this.carriedWorldColliders.has(hard);
          carriedTerrainPenetrationAfter = this.worldColliderTerrainSupport(hard).penetration;
          carriedTerrainImpactSpeed = hard.velocity.length();
          this.releaseCarriedWorldObjects();
        }

        if (hard) {
          this.carriedWorldColliders.clear();
          this.carriedWorldPreviousPositions.clear();
          this.carriedWorldLocalQuaternions.clear();
          this.excavator.group.position.set(0, this.terrain.getHeightAt(0, 0), 0);
          this.excavator.group.rotation.set(0, 0, 0);
          Object.assign(this.angles, { swing: 0, boom: 0.4, stick: -1.58, bucket: -2.28 });
          this.excavator.applyAngles(this.angles);
          const forward = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.excavator.group.rotation.y).normalize();
          const side = new THREE.Vector3(-forward.z, 0, forward.x).normalize();
          const excavatorTarget = this.excavator.group.position
            .clone()
            .addScaledVector(side, TRACK_GAUGE * 0.5);
          excavatorTarget.y = this.excavator.group.position.y + 0.34;
          const local = this.excavator.bucketGroup.worldToLocal(excavatorTarget.clone());
          hard.mesh.position.copy(excavatorTarget);
          hard.velocity.set(0, 0, 0);
          hard.angularVelocity.set(0, 0, 0);
          hard.sleeping = false;
          this.carryWorldColliderAt(hard, local, excavatorTarget.clone().add(new THREE.Vector3(-0.44, 0, 0)));
          this.collisionCooldown = 0;
          carriedExcavatorPenetrationBefore = this.resolveCarriedWorldObjectExcavatorHit(hard)?.penetration ?? 0;
          this.updateCarriedWorldObjects(0.08);
          carriedExcavatorReleased = !this.carriedWorldColliders.has(hard);
          carriedExcavatorPenetrationAfter = this.resolveCarriedWorldObjectExcavatorHit(hard)?.penetration ?? 0;
          carriedExcavatorImpactSpeed = hard.velocity.length();
          this.releaseCarriedWorldObjects();
        }

        if (debris && hard) {
          this.carriedWorldColliders.clear();
          this.carriedWorldPreviousPositions.clear();
          this.carriedWorldLocalQuaternions.clear();
          this.excavator.group.position.set(0, this.terrain.getHeightAt(0, 0), 0);
          Object.assign(this.angles, { swing: 0, boom: 0.48, stick: -1.5, bucket: -2.36 });
          this.excavator.applyAngles(this.angles);
          const local = new THREE.Vector3(-0.56, -0.28, 0);
          const target = new THREE.Vector3(1.6, 0, 2.9);
          target.y = this.terrain.getHeightAt(target.x, target.z) + Math.max(debris.groundOffset, hard.groundOffset) + 0.12;
          const current = this.excavator.bucketGroup.localToWorld(local.clone());
          this.excavator.group.position.add(target.clone().sub(current));
          this.excavator.applyAngles(this.angles);
          const overlap = Math.max(0.08, (debris.radius + hard.radius) * 0.48);
          debris.mesh.position.copy(target);
          hard.mesh.position.set(target.x + overlap, target.y, target.z);
          debris.velocity.set(0, 0, 0);
          hard.velocity.set(0, 0, 0);
          debris.angularVelocity.set(0, 0, 0);
          hard.angularVelocity.set(0, 0, 0);
          debris.sleeping = false;
          hard.sleeping = false;
          this.carryWorldColliderAt(debris, local, target.clone().add(new THREE.Vector3(-0.36, 0, 0)));
          this.updateCarriedWorldObjects(0.08);
          carriedObjectImpulse = hard.velocity.length();
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
          carriedTruckReleased,
          carriedTruckPenetrationBefore,
          carriedTruckPenetrationAfter,
          carriedTerrainReleased,
          carriedTerrainPenetrationBefore,
          carriedTerrainPenetrationAfter,
          carriedTerrainImpactSpeed,
          carriedExcavatorReleased,
          carriedExcavatorPenetrationBefore,
          carriedExcavatorPenetrationAfter,
          carriedExcavatorImpactSpeed,
          carriedObjectImpulse,
          heavyOrientationDelta,
          bucketOrientationDelta,
          orientationDeltaError,
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
        this.raiseTerrainWithWake(roughWheel, 0.52, 0.1);
        const beforeRut = this.terrain.getHeightAt(roughWheel.x, roughWheel.z);
        const dumpPoint = this.truck.group.localToWorld(new THREE.Vector3(1.18, 1.36, 0.58));
        const accepted = this.truck.depositSoilAt(dumpPoint, TRUCK_CAPACITY * 0.74, TRUCK_CAPACITY);
        this.truckLoad = accepted;
        this.truck.updateLoad(this.truckLoad);
        this.truck.settleLoad(2);
        const loadStatsBeforeSlump = this.truck.loadDistributionStats();
        const loadHeightBeforeSlump = loadStatsBeforeSlump.totalHeight;
        this.truck.group.rotation.x = 0.16;
        this.truck.group.rotation.z = -0.12;
        const loadSlumpMoved = this.truck.slumpLoadUnderGravity(1.2, 2.2);
        const loadStatsAfterSlump = this.truck.loadDistributionStats();
        const state = this.truck.updatePhysics(this.terrain, this.truckLoad, 0.95, true);
        this.wakeTruckWheelColliders();
        const afterRut = this.terrain.getHeightAt(roughWheel.x, roughWheel.z);
        this.truck.updateLoad(this.truckLoad);

        let loadSurfaceHeight = 0;
        let loadSurfaceNormalY = 0;
        let loadSurfacePenetrationBefore = 0;
        let loadSurfacePenetrationAfter = 0;
        let loadSurfaceObjectTravel = 0;
        let loadSurfaceObjectImpulse = 0;
        let loadSurfaceObjectVelocity = 0;
        let spilledVolume = 0;
        let spillTerrainGain = 0;
        let loadHeightDropFromSpill = 0;
        const loadProbe = this.truck.group.localToWorld(new THREE.Vector3(1.12, 1.18, 0.28));
        const loadSurface = this.truck.loadSurfaceAtWorld(loadProbe);
        const loadObstacle =
          this.worldColliders.find((collider) => !collider.immovable && collider.kind === "boulder") ??
          this.worldColliders.find((collider) => !collider.immovable && collider.kind === "rock");
        if (loadSurface && loadObstacle) {
          loadSurfaceHeight = loadSurface.loadHeight;
          loadSurfaceNormalY = loadSurface.normal.y;
          const savedPosition = loadObstacle.mesh.position.clone();
          const savedQuaternion = loadObstacle.mesh.quaternion.clone();
          const savedVelocity = loadObstacle.velocity.clone();
          const savedAngularVelocity = loadObstacle.angularVelocity.clone();
          const savedSleeping = loadObstacle.sleeping;
          const targetPenetration = clamp(loadObstacle.radius * 0.42, 0.08, 0.18);
          const loadLocal = this.truck.group.worldToLocal(loadSurface.point.clone());
          loadLocal.y += loadObstacle.radius - targetPenetration;
          loadObstacle.mesh.position.copy(this.truck.group.localToWorld(loadLocal));
          loadObstacle.velocity.copy(loadSurface.normal).multiplyScalar(-0.7);
          loadObstacle.angularVelocity.set(0, 0, 0);
          loadObstacle.sleeping = false;
          loadSurfacePenetrationBefore = this.truck.resolveLoadCollision(loadObstacle.mesh.position, loadObstacle.radius)?.penetration ?? 0;
          const beforePosition = loadObstacle.mesh.position.clone();
          const beforeImpact = this.truck.physicsState().impactImpulse;
          this.resolveLooseObjectTruckCollision(loadObstacle);
          loadSurfacePenetrationAfter = this.truck.resolveLoadCollision(loadObstacle.mesh.position, loadObstacle.radius)?.penetration ?? 0;
          loadSurfaceObjectTravel = loadObstacle.mesh.position.distanceTo(beforePosition);
          loadSurfaceObjectVelocity = loadObstacle.velocity.length();
          loadSurfaceObjectImpulse = Math.max(0, this.truck.physicsState().impactImpulse - beforeImpact);
          loadObstacle.mesh.position.copy(savedPosition);
          loadObstacle.mesh.quaternion.copy(savedQuaternion);
          loadObstacle.velocity.copy(savedVelocity);
          loadObstacle.angularVelocity.copy(savedAngularVelocity);
          loadObstacle.sleeping = savedSleeping;
          this.worldColliderGridDirty = true;
        }

        const loadStatsBeforeSpill = this.truck.loadDistributionStats();
        this.truck.group.rotation.x = 0.24;
        this.truck.group.rotation.z = -0.22;
        this.truck.applyImpact(this.truck.group.localToWorld(new THREE.Vector3(1.9, 1.5, 0.84)), new THREE.Vector3(0, -1, 0.75), 3.8);
        const spill = this.spillTruckLoadToTerrain(0.9, 3.6);
        spilledVolume = spill.spilledVolume;
        spillTerrainGain = spill.terrainGain;
        loadHeightDropFromSpill = Math.max(0, loadStatsBeforeSpill.totalHeight - this.truck.loadDistributionStats().totalHeight);

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
          loadCenterShiftX: loadStatsAfterSlump.centerX - loadStatsBeforeSlump.centerX,
          loadCenterShiftZ: loadStatsAfterSlump.centerZ - loadStatsBeforeSlump.centerZ,
          loadHeightConserved: Math.abs(loadStatsAfterSlump.totalHeight - loadHeightBeforeSlump),
          loadSlumpMoved,
          loadSurfaceHeight,
          loadSurfaceNormalY,
          loadSurfacePenetrationBefore,
          loadSurfacePenetrationAfter,
          loadSurfaceObjectTravel,
          loadSurfaceObjectImpulse,
          loadSurfaceObjectVelocity,
          spilledVolume,
          loadAfterSpill: this.truckLoad,
          spillTerrainGain,
          loadHeightDropFromSpill,
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
        const mudResult = this.compactTrackStripWithWake(
          mud,
          forward,
          side,
          TRACK_LENGTH,
          TRACK_WIDTH,
          0.035 * mudSurface.trackSinkMultiplier,
        );
        const dryResult = this.compactTrackStripWithWake(
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
        this.raiseTerrainWithWake(base.clone().addScaledVector(side, 0.72).addScaledVector(forward, 0.65), 0.78, 0.18);
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
      forceExcavatorPayloadSupport: () => {
        this.carriedWorldColliders.clear();
        this.carriedWorldPreviousPositions.clear();
        this.carriedWorldLocalQuaternions.clear();
        this.excavator.group.position.set(0, this.terrain.getHeightAt(0, 0), 0);
        this.excavator.group.rotation.set(0, 0, 0);
        Object.assign(this.angles, { swing: 0, boom: 0.64, stick: -0.78, bucket: -1.46 });
        this.bucketLoad = 0;
        this.bucketTransitLoad = 0;
        this.excavator.setBucketLoad(this.bucketLoad);
        this.excavator.applyAngles(this.angles);
        const forward = new THREE.Vector3(1, 0, 0);
        this.updateExcavatorSupport(1.2, forward);
        const unloadedPitch = this.chassisPitch;
        const unloadedSinkage = this.chassisSinkage;

        const heavy = this.worldColliders.find((collider) => collider.kind === "boulder");
        let carriedMass = 0;
        this.bucketLoad = BUCKET_CAPACITY;
        this.bucketTransitLoad = 0.34;
        if (heavy) {
          const local = new THREE.Vector3(-0.62, -0.28, 0);
          heavy.mesh.position.copy(this.excavator.bucketGroup.localToWorld(local.clone()));
          heavy.velocity.set(0, 0, 0);
          heavy.angularVelocity.set(0, 0, 0);
          this.carryWorldColliderAt(heavy, local, heavy.mesh.position);
          carriedMass = this.carriedWorldObjectMass();
        }
        this.excavator.setBucketLoad(this.bucketLoad);
        this.updateExcavatorSupport(1.2, forward);
        const loadedPitch = this.chassisPitch;
        const loadedSinkage = this.chassisSinkage;

        Object.assign(this.angles, { swing: Math.PI / 2, boom: 0.64, stick: -0.78, bucket: -1.46 });
        this.excavator.applyAngles(this.angles);
        if (heavy) {
          const local = this.carriedWorldColliders.get(heavy) ?? new THREE.Vector3(-0.62, -0.28, 0);
          heavy.mesh.position.copy(this.excavator.bucketGroup.localToWorld(local.clone()));
          const localQuaternion = this.carriedWorldLocalQuaternions.get(heavy);
          if (localQuaternion) {
            const bucketWorldQuaternion = this.excavator.bucketGroup.getWorldQuaternion(new THREE.Quaternion());
            heavy.mesh.quaternion.copy(bucketWorldQuaternion.multiply(localQuaternion));
          }
          this.carriedWorldPreviousPositions.set(heavy, heavy.mesh.position.clone());
        }
        this.updateExcavatorSupport(1.2, forward);
        const sideRoll = this.chassisRoll;
        this.releaseCarriedWorldObjects();
        this.updateUi(0);
        return {
          unloadedPitch,
          loadedPitch,
          sideRoll,
          unloadedSinkage,
          loadedSinkage,
          carriedMass,
          pressure: this.pressure,
        };
      },
      forceWorldObjectPhysics: () => {
        const debris = this.worldColliders.find((collider) => !collider.immovable && (collider.kind === "clod" || collider.kind === "cone" || collider.kind === "rock"));
        const hard = this.worldColliders.find((collider) => collider.kind === "boulder");
        const rail = this.worldColliders.find((collider) => collider.kind === "fence" && collider.radius > 0.4);
        const pipe = this.worldColliders.find((collider) => collider.kind === "pipe" && collider.capsule);
        const forward = new THREE.Vector3(1, 0, 0);
        let debrisTravel = 0;
        let hardTravel = 0;
        let railTravel = 0;
        let debrisAngularSpeed = 0;
        let hardAngularSpeed = 0;
        let railAngularSpeed = 0;
        let excavatorPenetrationBefore = 0;
        let excavatorPenetrationAfter = 0;
        let excavatorObjectTravel = 0;
        let excavatorObjectVelocity = 0;
        let turntablePenetrationBefore = 0;
        let turntablePenetrationAfter = 0;
        let turntableObjectTravel = 0;
        let turntableObjectVelocity = 0;
        let pipeSphereFalsePenetration = 0;
        let pipeCapsuleFalsePenetration = 0;
        let pipeCapsuleHitBefore = 0;
        let pipeCapsuleHitAfter = 0;
        let pipePairSphereFalsePenetration = 0;
        let pipePairCapsuleFalsePenetration = 0;
        let pipePairCapsuleHitBefore = 0;
        let pipePairCapsuleHitAfter = 0;
        let pipeTruckCapsuleHitBefore = 0;
        let pipeTruckCapsuleHitAfter = 0;
        let pipeExcavatorCapsuleHitBefore = 0;
        let pipeExcavatorCapsuleHitAfter = 0;
        let truckPenetrationBefore = 0;
        let truckPenetrationAfter = 0;
        let pairDistanceBefore = 0;
        let pairDistanceAfter = 0;
        let pairAngularSpeed = 0;
        let softGroundDrop = 0;
        let hardGroundDrop = 0;
        let softRutDrop = 0;
        let hardRutDrop = 0;
        let objectBermRise = 0;
        const crawlerSampleCount = this.crawlerFootprintSamples().length;
        let trackContactCount = 0;
        let cornerContacts = 0;
        let movedMass = 0;
        let leftImpulse = 0;
        let rightImpulse = 0;
        let centerContact = false;
        let elevatedFalseContact = false;
        const collectObjectContact = (contact: CrawlerWorldObjectContactResult) => {
          trackContactCount += contact.trackContactCount;
          cornerContacts += contact.cornerContacts;
          movedMass += contact.movedMass;
          leftImpulse += contact.leftImpulse;
          rightImpulse += contact.rightImpulse;
          centerContact = centerContact || contact.centerContact;
        };

        if (debris) {
          const savedPosition = debris.mesh.position.clone();
          const trackProbe = new THREE.Vector3(TRACK_LENGTH * 0.46, 0, TRACK_GAUGE * 0.5);
          trackProbe.y = this.terrain.getHeightAt(trackProbe.x, trackProbe.z) + TRACK_CONTACT_HEIGHT;
          debris.mesh.position.set(
            trackProbe.x,
            trackProbe.y + TRACK_WIDTH * 0.58 + debris.radius + 0.42,
            trackProbe.z,
          );
          elevatedFalseContact = Boolean(this.resolveColliderHit(debris, trackProbe, TRACK_WIDTH * 0.58));
          debris.mesh.position.copy(savedPosition);
          this.worldColliderGridDirty = true;
        }

        this.excavator.group.rotation.set(0, 0, 0);
        if (debris) {
          const debrisStart = new THREE.Vector3(1.68, 0, 0.74);
          debrisStart.y = this.terrain.getHeightAt(debrisStart.x, debrisStart.z) + debris.groundOffset;
          debris.mesh.position.copy(debrisStart);
          debris.velocity.set(0, 0, 0);
          debris.angularVelocity.set(0, 0, 0);
          debris.sleeping = false;
          this.worldColliderGridDirty = true;
          this.excavator.group.position.set(0, this.terrain.getHeightAt(0, 0), 0);
          this.leftTrackVelocity = TRACK_MAX_SPEED;
          this.rightTrackVelocity = TRACK_MAX_SPEED;
          this.collisionCooldown = 0;
          collectObjectContact(this.resolveWorldCollisions(TRACK_MAX_SPEED, 0, forward).objectContact);
          this.updateLooseWorldObjects(0.28);
          debrisTravel = debris.mesh.position.distanceTo(debrisStart);
          debrisAngularSpeed = debris.angularVelocity.length();
        }

        if (hard) {
          const hardStart = new THREE.Vector3(1.68, 0, -0.74);
          hardStart.y = this.terrain.getHeightAt(hardStart.x, hardStart.z) + hard.groundOffset;
          hard.mesh.position.copy(hardStart);
          hard.velocity.set(0, 0, 0);
          hard.angularVelocity.set(0, 0, 0);
          hard.sleeping = false;
          this.worldColliderGridDirty = true;
          this.excavator.group.position.set(0, this.terrain.getHeightAt(0, 0), 0);
          this.leftTrackVelocity = TRACK_MAX_SPEED;
          this.rightTrackVelocity = TRACK_MAX_SPEED;
          this.collisionCooldown = 0;
          collectObjectContact(this.resolveWorldCollisions(TRACK_MAX_SPEED, 0, forward).objectContact);
          this.updateLooseWorldObjects(0.28);
          hardTravel = hard.mesh.position.distanceTo(hardStart);
          hardAngularSpeed = hard.angularVelocity.length();
        }

        if (rail) {
          const railForward = new THREE.Vector3(1, 0, 0);
          const railStart = new THREE.Vector3(TRACK_LENGTH * 0.46, 0, TRACK_GAUGE * 0.5 + 0.26);
          railStart.y = this.terrain.getHeightAt(railStart.x, railStart.z) + rail.groundOffset;
          rail.mesh.position.copy(railStart);
          rail.mesh.rotation.set(0, 0, 0);
          rail.velocity.set(0, 0, 0);
          rail.angularVelocity.set(0, 0, 0);
          this.excavator.group.position.set(0, this.terrain.getHeightAt(0, 0), 0);
          this.excavator.group.rotation.set(0, 0, 0);
          this.leftTrackVelocity = TRACK_MAX_SPEED;
          this.rightTrackVelocity = TRACK_MAX_SPEED;
          this.collisionCooldown = 0;
          const railBefore = rail.mesh.position.clone();
          rail.sleeping = false;
          this.worldColliderGridDirty = true;
          collectObjectContact(this.resolveWorldCollisions(TRACK_MAX_SPEED, 0, railForward).objectContact);
          this.updateLooseWorldObjects(0.28);
          railTravel = rail.mesh.position.distanceTo(railBefore);
          railAngularSpeed = rail.angularVelocity.length();
        }

        if (debris) {
          const truckProbe = this.truck.group.localToWorld(new THREE.Vector3(-2.12, 1.03, 0));
          debris.mesh.position.copy(truckProbe);
          debris.velocity.set(-0.45, -0.2, 0.12);
          debris.angularVelocity.set(0, 0, 0);
          debris.sleeping = false;
          truckPenetrationBefore = this.truck.resolveSolidCollision(debris.mesh.position, debris.radius)?.penetration ?? 0;
          for (let i = 0; i < 4; i += 1) {
            this.updateLooseWorldObjects(0.06);
          }
          truckPenetrationAfter = this.truck.resolveSolidCollision(debris.mesh.position, debris.radius)?.penetration ?? 0;
        }

        if (debris) {
          this.excavator.group.position.set(0, this.terrain.getHeightAt(0, 0), 0);
          this.excavator.group.rotation.set(0, 0, 0);
          Object.assign(this.angles, { swing: 0, boom: 0.46, stick: -1.16, bucket: -1.9 });
          this.excavator.applyAngles(this.angles);
          const base = this.excavator.group.position;
          const normal = new THREE.Vector3(0, 0, 1);
          const trackPoint = base.clone().add(new THREE.Vector3(0, 0, TRACK_GAUGE * 0.5));
          trackPoint.y = base.y + 0.34;
          debris.mesh.position.copy(trackPoint).addScaledVector(normal, TRACK_WIDTH * 0.72 + debris.radius - 0.16);
          debris.velocity.copy(normal).multiplyScalar(-0.72);
          debris.angularVelocity.set(0, 0, 0);
          debris.sleeping = false;
          this.worldColliderGridDirty = true;
          excavatorPenetrationBefore = this.resolveLooseObjectExcavatorHit(debris)?.penetration ?? 0;
          const beforePosition = debris.mesh.position.clone();
          this.collisionCooldown = 0;
          this.resolveLooseObjectExcavatorCollision(debris);
          excavatorPenetrationAfter = this.resolveLooseObjectExcavatorHit(debris)?.penetration ?? 0;
          excavatorObjectTravel = debris.mesh.position.distanceTo(beforePosition);
          excavatorObjectVelocity = debris.velocity.length();
        }

        if (debris) {
          const savedPosition = debris.mesh.position.clone();
          const savedQuaternion = debris.mesh.quaternion.clone();
          const savedVelocity = debris.velocity.clone();
          const savedAngularVelocity = debris.angularVelocity.clone();
          const savedSleeping = debris.sleeping;
          this.excavator.group.position.set(0, this.terrain.getHeightAt(0, 0), 0);
          this.excavator.group.rotation.set(0, 0, 0);
          const turntable = this.excavator.turntableCollisionShape();
          const normal = new THREE.Vector3(1, 0, 0);
          debris.mesh.position
            .copy(turntable.center)
            .addScaledVector(normal, turntable.radius + debris.radius - 0.12);
          debris.velocity.copy(normal).multiplyScalar(-0.62);
          debris.angularVelocity.set(0, 0, 0);
          debris.sleeping = false;
          this.worldColliderGridDirty = true;
          turntablePenetrationBefore = this.resolveLooseObjectExcavatorHit(debris)?.penetration ?? 0;
          const beforePosition = debris.mesh.position.clone();
          this.collisionCooldown = 0;
          this.resolveLooseObjectExcavatorCollision(debris);
          turntablePenetrationAfter = this.resolveLooseObjectExcavatorHit(debris)?.penetration ?? 0;
          turntableObjectTravel = debris.mesh.position.distanceTo(beforePosition);
          turntableObjectVelocity = debris.velocity.length();
          debris.mesh.position.copy(savedPosition);
          debris.mesh.quaternion.copy(savedQuaternion);
          debris.velocity.copy(savedVelocity);
          debris.angularVelocity.copy(savedAngularVelocity);
          debris.sleeping = savedSleeping;
          this.worldColliderGridDirty = true;
        }

        if (pipe) {
          const capsule = this.worldColliderCapsuleWorld(pipe);
          if (capsule) {
            const axis = capsule.b.clone().sub(capsule.a);
            const side = new THREE.Vector3(-axis.z, 0, axis.x);
            if (side.lengthSq() < 0.000001) {
              side.set(1, 0, 0);
            } else {
              side.normalize();
            }
            const midpoint = capsule.a.clone().lerp(capsule.b, 0.5);
            const probeRadius = 0.08;
            const falseProbe = midpoint.clone().addScaledVector(side, capsule.radius + probeRadius + 0.08);
            pipeSphereFalsePenetration = Math.max(0, pipe.radius + probeRadius - falseProbe.distanceTo(pipe.mesh.position));
            pipeCapsuleFalsePenetration = this.resolveWorldColliderSampleHit(pipe, falseProbe, probeRadius)?.penetration ?? 0;

            const hitProbe = midpoint.clone().addScaledVector(side, capsule.radius + probeRadius - 0.045);
            const hitBefore = this.resolveWorldColliderSampleHit(pipe, hitProbe, probeRadius);
            pipeCapsuleHitBefore = hitBefore?.penetration ?? 0;
            if (hitBefore) {
              hitProbe.addScaledVector(hitBefore.normal, hitBefore.penetration + 0.004);
            }
            pipeCapsuleHitAfter = this.resolveWorldColliderSampleHit(pipe, hitProbe, probeRadius)?.penetration ?? 0;

            if (debris) {
              const falsePairProbe = midpoint.clone().addScaledVector(side, capsule.radius + debris.radius + 0.08);
              debris.mesh.position.copy(falsePairProbe);
              debris.velocity.set(0, 0, 0);
              debris.angularVelocity.set(0, 0, 0);
              debris.sleeping = false;
              pipe.sleeping = false;
              this.worldColliderGridDirty = true;
              pipePairSphereFalsePenetration = Math.max(0, pipe.radius + debris.radius - falsePairProbe.distanceTo(pipe.mesh.position));
              pipePairCapsuleFalsePenetration = this.resolveWorldColliderPairHit(pipe, debris)?.penetration ?? 0;

              const hitPairProbe = midpoint.clone().addScaledVector(side, capsule.radius + debris.radius - 0.055);
              debris.mesh.position.copy(hitPairProbe);
              debris.velocity.copy(side).multiplyScalar(-0.2);
              pipe.velocity.set(0, 0, 0);
              debris.angularVelocity.set(0, 0, 0);
              pipe.angularVelocity.set(0, 0, 0);
              debris.sleeping = false;
              pipe.sleeping = false;
              this.worldColliderGridDirty = true;
              pipePairCapsuleHitBefore = this.resolveWorldColliderPairHit(pipe, debris)?.penetration ?? 0;
              this.resolveLooseObjectPairCollisions();
              pipePairCapsuleHitAfter = this.resolveWorldColliderPairHit(pipe, debris)?.penetration ?? 0;
            }

            const pipeHalfLength = capsule.a.distanceTo(capsule.b) * 0.5;
            const placePipeEndpoint = (endpoint: THREE.Vector3, axisWorld: THREE.Vector3): void => {
              const pipeAxis = axisWorld.clone().normalize();
              pipe.mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pipeAxis);
              pipe.mesh.position.copy(endpoint).addScaledVector(pipeAxis, -pipeHalfLength);
              pipe.velocity.set(0, 0, 0);
              pipe.angularVelocity.set(0, 0, 0);
              pipe.sleeping = false;
              this.worldColliderGridDirty = true;
            };

            const truckTarget = this.truck.group.localToWorld(new THREE.Vector3(-2.12, 1.03, 0.86 + capsule.radius - 0.055));
            placePipeEndpoint(truckTarget, new THREE.Vector3(1, 0, 0));
            const truckPipeHitBefore = this.resolveWorldColliderShapeHit(pipe, (point, radius) => this.truck.resolveSolidCollision(point, radius));
            pipeTruckCapsuleHitBefore = truckPipeHitBefore?.penetration ?? 0;
            if (truckPipeHitBefore) {
              pipe.velocity.copy(truckPipeHitBefore.normal).multiplyScalar(-0.22);
              this.resolveLooseObjectTruckCollision(pipe);
            }
            pipeTruckCapsuleHitAfter = this.resolveWorldColliderShapeHit(pipe, (point, radius) => this.truck.resolveSolidCollision(point, radius))?.penetration ?? 0;

            this.excavator.group.position.set(0, this.terrain.getHeightAt(0, 0), 0);
            this.excavator.group.rotation.set(0, 0, 0);
            const excavatorSide = new THREE.Vector3(0, 0, 1);
            const excavatorTarget = this.excavator.group.position
              .clone()
              .add(new THREE.Vector3(TRACK_LENGTH * 0.46, 0, TRACK_GAUGE * 0.5))
              .addScaledVector(excavatorSide, TRACK_WIDTH * 0.66 + capsule.radius - 0.055);
            excavatorTarget.y = this.excavator.group.position.y + 0.34;
            placePipeEndpoint(excavatorTarget, new THREE.Vector3(1, 0, 0));
            const excavatorPipeHitBefore = this.resolveLooseObjectExcavatorHit(pipe);
            pipeExcavatorCapsuleHitBefore = excavatorPipeHitBefore?.penetration ?? 0;
            if (excavatorPipeHitBefore) {
              pipe.velocity.copy(excavatorPipeHitBefore.normal).multiplyScalar(-0.22);
              this.resolveLooseObjectExcavatorCollision(pipe);
            }
            pipeExcavatorCapsuleHitAfter = this.resolveLooseObjectExcavatorHit(pipe)?.penetration ?? 0;
          }
        }

        if (debris && hard) {
          const pairBase = new THREE.Vector3(1.15, 0, 2.85);
          const ground = this.terrain.getHeightAt(pairBase.x, pairBase.z);
          const sharedY = ground + Math.max(debris.groundOffset, hard.groundOffset) + 0.02;
          const overlapDistance = Math.max(0.06, (debris.radius + hard.radius) * 0.42);
          debris.mesh.position.set(pairBase.x, sharedY, pairBase.z);
          hard.mesh.position.set(pairBase.x + overlapDistance, sharedY, pairBase.z);
          debris.velocity.set(0.25, 0, 0);
          hard.velocity.set(-0.12, 0, 0);
          debris.angularVelocity.set(0, 0, 0);
          hard.angularVelocity.set(0, 0, 0);
          debris.sleeping = false;
          hard.sleeping = false;
          this.worldColliderGridDirty = true;
          pairDistanceBefore = debris.mesh.position.distanceTo(hard.mesh.position);
          this.resolveLooseObjectPairCollisions();
          pairDistanceAfter = debris.mesh.position.distanceTo(hard.mesh.position);
          pairAngularSpeed = debris.angularVelocity.length() + hard.angularVelocity.length();
        }

        if (hard) {
          const measureGroundLoad = (x: number, z: number) => {
            const savedPosition = hard.mesh.position.clone();
            const savedQuaternion = hard.mesh.quaternion.clone();
            const savedVelocity = hard.velocity.clone();
            const savedAngularVelocity = hard.angularVelocity.clone();
            const savedSleeping = hard.sleeping;
            const savedGroundLoadCooldown = hard.groundLoadCooldown;
            const groundBefore = this.terrain.getHeightAt(x, z);
            hard.mesh.position.set(x, groundBefore + hard.groundOffset - 0.055, z);
            hard.velocity.set(0.08, -0.82, -0.04);
            hard.angularVelocity.set(0, 0, 0);
            hard.sleeping = false;
            hard.groundLoadCooldown = 0;
            this.worldColliderGridDirty = true;
            for (let i = 0; i < 3; i += 1) {
              this.updateLooseWorldObjects(0.08);
            }
            const groundAfter = this.terrain.getHeightAt(x, z);
            const berm = Math.max(
              this.terrain.getHeightAt(x + hard.radius * 1.1, z),
              this.terrain.getHeightAt(x - hard.radius * 1.1, z),
              this.terrain.getHeightAt(x, z + hard.radius * 1.1),
              this.terrain.getHeightAt(x, z - hard.radius * 1.1),
            );
            hard.mesh.position.copy(savedPosition);
            hard.mesh.quaternion.copy(savedQuaternion);
            hard.velocity.copy(savedVelocity);
            hard.angularVelocity.copy(savedAngularVelocity);
            hard.sleeping = savedSleeping;
            hard.groundLoadCooldown = savedGroundLoadCooldown;
            this.worldColliderGridDirty = true;
            const groundDrop = Math.max(0, groundBefore - groundAfter);
            return {
              groundDrop,
              rutDrop: groundDrop,
              bermRise: Math.max(0, berm - groundAfter),
            };
          };
          const softLoad = measureGroundLoad(9.8, -8.8);
          const hardLoad = measureGroundLoad(-52.0, 42.0);
          softGroundDrop = softLoad.groundDrop;
          hardGroundDrop = hardLoad.groundDrop;
          softRutDrop = softLoad.rutDrop;
          hardRutDrop = hardLoad.rutDrop;
          objectBermRise = Math.max(softLoad.bermRise, hardLoad.bermRise);
        }

        this.updateExcavatorSupport(0.3, forward);
        this.updateUi(0);
        return {
          debrisTravel,
          hardTravel,
          railTravel,
          debrisAngularSpeed,
          hardAngularSpeed,
          railAngularSpeed,
          excavatorPenetrationBefore,
          excavatorPenetrationAfter,
          excavatorObjectTravel,
          excavatorObjectVelocity,
          turntablePenetrationBefore,
          turntablePenetrationAfter,
          turntableObjectTravel,
          turntableObjectVelocity,
          pipeSphereFalsePenetration,
          pipeCapsuleFalsePenetration,
          pipeCapsuleHitBefore,
          pipeCapsuleHitAfter,
          pipePairSphereFalsePenetration,
          pipePairCapsuleFalsePenetration,
          pipePairCapsuleHitBefore,
          pipePairCapsuleHitAfter,
          pipeTruckCapsuleHitBefore,
          pipeTruckCapsuleHitAfter,
          pipeExcavatorCapsuleHitBefore,
          pipeExcavatorCapsuleHitAfter,
          crawlerSampleCount,
          trackContactCount,
          cornerContacts,
          movedMass,
          leftImpulse,
          rightImpulse,
          centerContact,
          elevatedFalseContact,
          truckPenetrationBefore,
          truckPenetrationAfter,
          pairDistanceBefore,
          pairDistanceAfter,
          pairAngularSpeed,
          softGroundDrop,
          hardGroundDrop,
          softRutDrop,
          hardRutDrop,
          objectBermRise,
          collisionCount: this.collisionCount,
          pressure: this.pressure,
        };
      },
      forceTerrainChangeWakesObjects: () => {
        const collider =
          this.worldColliders.find((candidate) => candidate.kind === "boulder") ??
          this.worldColliders.find((candidate) => candidate.kind === "rock") ??
          this.worldColliders.find((candidate) => candidate.kind === "clod");
        const capsuleCollider = this.worldColliders.find((candidate) => candidate.kind === "pipe" && candidate.capsule);
        if (!collider) {
          return {
            sleptBefore: false,
            wokeFromCut: 0,
            wokeFromRaise: 0,
            groundDrop: 0,
            fallDistance: 0,
            liftDelta: 0,
            capsuleTerrainPenetrationBefore: 0,
            capsuleTerrainPenetrationAfter: 0,
            capsuleTerrainLift: 0,
            capsuleTerrainSlopeKick: 0,
            finalSleeping: false,
            pressure: this.pressure,
          };
        }

        const savedPosition = collider.mesh.position.clone();
        const savedQuaternion = collider.mesh.quaternion.clone();
        const savedScale = collider.mesh.scale.clone();
        const savedVelocity = collider.velocity.clone();
        const savedAngularVelocity = collider.angularVelocity.clone();
        const savedSleeping = collider.sleeping;
        const savedPressure = this.pressure;
        const savedCapsulePosition = capsuleCollider?.mesh.position.clone();
        const savedCapsuleQuaternion = capsuleCollider?.mesh.quaternion.clone();
        const savedCapsuleScale = capsuleCollider?.mesh.scale.clone();
        const savedCapsuleVelocity = capsuleCollider?.velocity.clone();
        const savedCapsuleAngularVelocity = capsuleCollider?.angularVelocity.clone();
        const savedCapsuleSleeping = capsuleCollider?.sleeping;
        const testPoint = new THREE.Vector3(24.5, 0, -16.5);
        const beforeGround = this.terrain.getHeightAt(testPoint.x, testPoint.z);
        collider.mesh.position.set(testPoint.x, beforeGround + collider.groundOffset, testPoint.z);
        collider.velocity.set(0, 0, 0);
        collider.angularVelocity.set(0, 0, 0);
        collider.sleeping = true;
        this.worldColliderGridDirty = true;

        const sleptBefore = collider.sleeping;
        const cutStart = new THREE.Vector3(testPoint.x - 0.58, beforeGround + 0.02, testPoint.z);
        const cutEnd = new THREE.Vector3(testPoint.x + 0.58, beforeGround - 0.22, testPoint.z);
        const cutRemoved = this.excavateTerrainWithWake(cutStart, cutEnd, new THREE.Vector3(0, 0, 1), 1.24, 0.7, 3.2);
        const wokeFromCut = cutRemoved > 0 && !collider.sleeping ? 1 : 0;
        const afterCutGround = this.terrain.getHeightAt(testPoint.x, testPoint.z);
        for (let i = 0; i < 96; i += 1) {
          this.updateLooseWorldObjects(1 / 60);
        }
        const afterFallY = collider.mesh.position.y;

        collider.velocity.set(0, 0, 0);
        collider.angularVelocity.set(0, 0, 0);
        collider.sleeping = true;
        this.worldColliderGridDirty = true;
        const beforeRaiseY = collider.mesh.position.y;
        const raised = this.raiseTerrainWithWake(new THREE.Vector3(testPoint.x, afterCutGround, testPoint.z), 0.72, 0.46, 1);
        const wokeFromRaise = raised > 0 && !collider.sleeping ? 1 : 0;
        for (let i = 0; i < 8; i += 1) {
          this.updateLooseWorldObjects(1 / 60);
        }
        const afterRaiseY = collider.mesh.position.y;
        const finalSleeping = collider.sleeping;
        const pressure = this.pressure;
        let capsuleTerrainPenetrationBefore = 0;
        let capsuleTerrainPenetrationAfter = 0;
        let capsuleTerrainLift = 0;
        let capsuleTerrainSlopeKick = 0;

        if (capsuleCollider?.capsule) {
          const axis = new THREE.Vector3(1, 0, 0);
          const halfLength = capsuleCollider.capsule.localA.distanceTo(capsuleCollider.capsule.localB) * 0.5;
          const capsuleCenter = new THREE.Vector3(27.6, 0, -18.4);
          const capsuleGround = this.terrain.getHeightAt(capsuleCenter.x, capsuleCenter.z);
          capsuleCollider.mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), axis);
          capsuleCollider.mesh.position.set(capsuleCenter.x, capsuleGround + capsuleCollider.groundOffset, capsuleCenter.z);
          capsuleCollider.velocity.set(0, 0, 0);
          capsuleCollider.angularVelocity.set(0, 0, 0);
          capsuleCollider.sleeping = false;
          this.worldColliderGridDirty = true;

          const endPoint = capsuleCenter.clone().addScaledVector(axis, halfLength);
          this.terrain.raiseAt(endPoint, 0.48, 0.42, 0);
          capsuleTerrainPenetrationBefore = this.worldColliderTerrainSupport(capsuleCollider).penetration;
          const beforeCapsuleY = capsuleCollider.mesh.position.y;
          for (let i = 0; i < 3; i += 1) {
            this.updateLooseWorldObjects(1 / 60);
          }
          capsuleTerrainPenetrationAfter = this.worldColliderTerrainSupport(capsuleCollider).penetration;
          capsuleTerrainLift = capsuleCollider.mesh.position.y - beforeCapsuleY;
          capsuleTerrainSlopeKick = Math.hypot(capsuleCollider.velocity.x, capsuleCollider.velocity.z);
        }

        collider.mesh.position.copy(savedPosition);
        collider.mesh.quaternion.copy(savedQuaternion);
        collider.mesh.scale.copy(savedScale);
        collider.velocity.copy(savedVelocity);
        collider.angularVelocity.copy(savedAngularVelocity);
        collider.sleeping = savedSleeping;
        if (
          capsuleCollider &&
          savedCapsulePosition &&
          savedCapsuleQuaternion &&
          savedCapsuleScale &&
          savedCapsuleVelocity &&
          savedCapsuleAngularVelocity &&
          savedCapsuleSleeping !== undefined
        ) {
          capsuleCollider.mesh.position.copy(savedCapsulePosition);
          capsuleCollider.mesh.quaternion.copy(savedCapsuleQuaternion);
          capsuleCollider.mesh.scale.copy(savedCapsuleScale);
          capsuleCollider.velocity.copy(savedCapsuleVelocity);
          capsuleCollider.angularVelocity.copy(savedCapsuleAngularVelocity);
          capsuleCollider.sleeping = savedCapsuleSleeping;
        }
        this.pressure = Math.max(savedPressure, pressure);
        this.worldColliderGridDirty = true;
        this.updateUi(0);

        return {
          sleptBefore,
          wokeFromCut,
          wokeFromRaise,
          groundDrop: beforeGround - afterCutGround,
          fallDistance: beforeGround + collider.groundOffset - afterFallY,
          liftDelta: afterRaiseY - beforeRaiseY,
          capsuleTerrainPenetrationBefore,
          capsuleTerrainPenetrationAfter,
          capsuleTerrainLift,
          capsuleTerrainSlopeKick,
          finalSleeping,
          pressure,
        };
      },
      forceLiftableObjectAudit: () => {
        const savedAngles = { ...this.angles };
        const savedPosition = this.excavator.group.position.clone();
        const savedRotation = this.excavator.group.rotation.clone();
        const boulder = this.worldColliders.find((collider) => collider.kind === "boulder");
        const fence = this.worldColliders.find((collider) => collider.kind === "fence" && collider.radius > 0.4);
        const pipe = this.worldColliders.find((collider) => collider.kind === "pipe" && collider.capsule);

        const liftOne = (collider?: WorldCollider): { lifted: boolean; liftHeight: number } => {
          if (!collider) {
            return { lifted: false, liftHeight: 0 };
          }
          const objectPosition = collider.mesh.position.clone();
          const objectQuaternion = collider.mesh.quaternion.clone();
          const objectScale = collider.mesh.scale.clone();
          const objectVelocity = collider.velocity.clone();
          const objectAngularVelocity = collider.angularVelocity.clone();
          const objectSleeping = collider.sleeping;

          this.carriedWorldColliders.delete(collider);
          this.carriedWorldPreviousPositions.delete(collider);
          this.carriedWorldLocalQuaternions.delete(collider);
          this.excavator.group.position.set(0, this.terrain.getHeightAt(0, 0), 0);
          this.excavator.group.rotation.set(0, 0, 0);
          Object.assign(this.angles, { swing: 0, boom: 0.48, stick: -1.34, bucket: -2.18 });
          this.excavator.applyAngles(this.angles);

          const bucketLocal = new THREE.Vector3(-0.58, -0.32, 0.02);
          collider.mesh.position.copy(this.excavator.bucketGroup.localToWorld(bucketLocal.clone()));
          collider.velocity.set(0, 0, 0);
          collider.angularVelocity.set(0, 0, 0);
          collider.sleeping = false;
          this.worldColliderGridDirty = true;
          const captured = this.tryCarryWorldCollider(collider);
          const beforeY = collider.mesh.position.y;

          Object.assign(this.angles, { swing: 0, boom: 0.78, stick: -1.02, bucket: -1.82 });
          this.excavator.applyAngles(this.angles);
          this.updateCarriedWorldObjects(0.18);
          const liftHeight = collider.mesh.position.y - beforeY;
          const lifted = captured && this.carriedWorldColliders.has(collider) && liftHeight > 0.04;

          this.carriedWorldColliders.delete(collider);
          this.carriedWorldPreviousPositions.delete(collider);
          this.carriedWorldLocalQuaternions.delete(collider);
          collider.mesh.position.copy(objectPosition);
          collider.mesh.quaternion.copy(objectQuaternion);
          collider.mesh.scale.copy(objectScale);
          collider.velocity.copy(objectVelocity);
          collider.angularVelocity.copy(objectAngularVelocity);
          collider.sleeping = objectSleeping;
          this.worldColliderGridDirty = true;
          return { lifted, liftHeight };
        };

        const liftEndpoint = (collider?: WorldCollider): { lifted: boolean; liftHeight: number; centerOffset: number } => {
          if (!collider?.capsule) {
            return { lifted: false, liftHeight: 0, centerOffset: 0 };
          }
          const objectPosition = collider.mesh.position.clone();
          const objectQuaternion = collider.mesh.quaternion.clone();
          const objectScale = collider.mesh.scale.clone();
          const objectVelocity = collider.velocity.clone();
          const objectAngularVelocity = collider.angularVelocity.clone();
          const objectSleeping = collider.sleeping;

          this.carriedWorldColliders.delete(collider);
          this.carriedWorldPreviousPositions.delete(collider);
          this.carriedWorldLocalQuaternions.delete(collider);
          this.excavator.group.position.set(0, this.terrain.getHeightAt(0, 0), 0);
          this.excavator.group.rotation.set(0, 0, 0);
          Object.assign(this.angles, { swing: 0, boom: 0.48, stick: -1.34, bucket: -2.18 });
          this.excavator.applyAngles(this.angles);

          const endpointLocal = new THREE.Vector3(-0.58, -0.32, 0.02);
          const endpointWorld = this.excavator.bucketGroup.localToWorld(endpointLocal.clone());
          const axis = this.excavator.bucketForwardWorld().setY(0);
          if (axis.lengthSq() < 0.0001) {
            axis.set(1, 0, 0);
          } else {
            axis.normalize();
          }
          collider.mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), axis);
          const endpointOffset = collider.capsule.localB.clone().applyQuaternion(collider.mesh.quaternion);
          collider.mesh.position.copy(endpointWorld).sub(endpointOffset);
          collider.velocity.set(0, 0, 0);
          collider.angularVelocity.set(0, 0, 0);
          collider.sleeping = false;
          this.worldColliderGridDirty = true;

          const centerLocalBefore = this.excavator.bucketGroup.worldToLocal(collider.mesh.position.clone());
          const centerOffset = centerLocalBefore.distanceTo(endpointLocal);
          const captured = this.tryCarryWorldCollider(collider);
          const beforeY = collider.mesh.position.y;

          Object.assign(this.angles, { swing: 0, boom: 0.78, stick: -1.02, bucket: -1.82 });
          this.excavator.applyAngles(this.angles);
          this.updateCarriedWorldObjects(0.18);
          const liftHeight = collider.mesh.position.y - beforeY;
          const lifted = captured && this.carriedWorldColliders.has(collider) && liftHeight > 0.04;

          this.carriedWorldColliders.delete(collider);
          this.carriedWorldPreviousPositions.delete(collider);
          this.carriedWorldLocalQuaternions.delete(collider);
          collider.mesh.position.copy(objectPosition);
          collider.mesh.quaternion.copy(objectQuaternion);
          collider.mesh.scale.copy(objectScale);
          collider.velocity.copy(objectVelocity);
          collider.angularVelocity.copy(objectAngularVelocity);
          collider.sleeping = objectSleeping;
          this.worldColliderGridDirty = true;
          return { lifted, liftHeight, centerOffset };
        };

        const boulderLift = liftOne(boulder);
        const fenceLift = liftOne(fence);
        const pipeEndpointLift = liftEndpoint(pipe);
        this.excavator.group.position.copy(savedPosition);
        this.excavator.group.rotation.copy(savedRotation);
        Object.assign(this.angles, savedAngles);
        this.excavator.applyAngles(this.angles);
        this.previousBucketTip.copy(this.excavator.bucketTipWorld());
        this.updateUi(0);

        const liftable = this.worldColliders.filter((collider) => !collider.immovable);
        const blocked = this.worldColliders.filter((collider) => collider.immovable);
        return {
          worldColliderCount: this.worldColliders.length,
          liftableCount: liftable.length,
          blockedCount: blocked.length,
          heaviestLiftableMass: Math.max(...liftable.map((collider) => collider.mass)),
          boulderLifted: boulderLift.lifted,
          boulderLiftHeight: boulderLift.liftHeight,
          fenceLifted: fenceLift.lifted,
          fenceLiftHeight: fenceLift.liftHeight,
          pipeEndpointLifted: pipeEndpointLift.lifted,
          pipeEndpointLiftHeight: pipeEndpointLift.liftHeight,
          pipeEndpointCenterOffset: pipeEndpointLift.centerOffset,
          truckStillBlocks: Boolean(this.truck.resolveBodyCollision(TRUCK_CENTER.clone(), 1.62)),
        };
      },
      forceLagFreeSoilCycle: () => {
        this.bucketLoad = BUCKET_CAPACITY * 0.72;
        this.bucketTransitLoad = 0;
        this.excavator.setBucketLoad(this.bucketLoad);
        Object.assign(this.angles, { swing: 0, boom: 0.22, stick: -1.82, bucket: -2.3 });
        this.excavator.applyAngles(this.angles);
        const pocket = this.excavator.bucketPocketWorld();
        this.spawnSoilParticles(pocket, 0.78, new THREE.Vector3(0.2, -0.9, 0.08), 0.95);
        this.spawnFineGrains(pocket, 0.22, new THREE.Vector3(0.12, -0.8, 0.16), true, 1.0);

        const previousAngles: ExcavatorAngles = { swing: 0, boom: 0.24, stick: -1.52, bucket: -1.72 };
        this.velocities.boom = -0.04;
        this.velocities.stick = -0.34;
        this.velocities.bucket = -0.82;
        const resistance = this.resolveArmTerrainResistance(previousAngles);
        this.warmWorldColliderGrid();
        this.updateSoilParticles(1 / 60);
        this.updateFineGrains(1 / 60);
        this.updateLooseWorldObjects(1 / 60);

        let totalStepMs = 0;
        let maxStepMs = 0;
        for (let step = 0; step < 80; step += 1) {
          const started = performance.now();
          this.updateSoilParticles(1 / 60);
          this.updateFineGrains(1 / 60);
          this.updateLooseWorldObjects(1 / 60);
          const elapsed = performance.now() - started;
          totalStepMs += elapsed;
          maxStepMs = Math.max(maxStepMs, elapsed);
        }

        const nearbyCandidates = this.nearbyWorldColliders(this.excavator.bucketPocketWorld(), 1.4).length;
        this.updateUi(0);
        return {
          averageStepMs: totalStepMs / 80,
          maxStepMs,
          particleCount: this.soilParticles.length,
          fineGrainCount: this.fineGrainCount(),
          worldColliderCount: this.worldColliders.length,
          nearbyCandidates,
          terrainDrag: resistance.drag,
          bucketLoad: this.bucketLoad,
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
          farWetland: new THREE.Vector3(52.0, 0, -42.0),
          basaltShelf: new THREE.Vector3(-52.0, 0, 42.0),
          outerHaulRoad: new THREE.Vector3(42.0, 0, -38.0),
          farSpoil: new THREE.Vector3(54.0, 0, 18.0),
        };
        const wetland = this.terrain.getSurfaceConditionAt(surfacePoints.wetland.x, surfacePoints.wetland.z);
        const gravelFan = this.terrain.getSurfaceConditionAt(surfacePoints.gravelFan.x, surfacePoints.gravelFan.z);
        const hardBench = this.terrain.getSurfaceConditionAt(surfacePoints.hardBench.x, surfacePoints.hardBench.z);
        const haulRoad = this.terrain.getSurfaceConditionAt(surfacePoints.haulRoad.x, surfacePoints.haulRoad.z);
        const farWetland = this.terrain.getSurfaceConditionAt(surfacePoints.farWetland.x, surfacePoints.farWetland.z);
        const basaltShelf = this.terrain.getSurfaceConditionAt(surfacePoints.basaltShelf.x, surfacePoints.basaltShelf.z);
        const outerHaulRoad = this.terrain.getSurfaceConditionAt(surfacePoints.outerHaulRoad.x, surfacePoints.outerHaulRoad.z);
        const heights = Object.values(surfacePoints).map((point) => this.terrain.getHeightAt(point.x, point.z));
        const materialZones = [
          wetland.wetness > 0.6,
          gravelFan.gravel > 0.55,
          hardBench.hardpack > 0.58,
          haulRoad.compaction > 0.62,
          farWetland.wetness > 0.6,
          basaltShelf.hardpack > 0.7,
          outerHaulRoad.compaction > 0.62,
        ].filter(Boolean).length;
        const farColliderCount = this.worldColliders.filter(
          (collider) => Math.hypot(collider.mesh.position.x, collider.mesh.position.z) > 38,
        ).length;
        return {
          terrainSize: this.terrain.size,
          spacing: this.terrain.spacing,
          heightRange: Math.max(...heights) - Math.min(...heights),
          wetlandWetness: wetland.wetness,
          gravelFan: gravelFan.gravel,
          hardBench: hardBench.hardpack,
          haulRoadCompaction: haulRoad.compaction,
          outerWetness: farWetland.wetness,
          basaltHardpack: basaltShelf.hardpack,
          outerHaulCompaction: outerHaulRoad.compaction,
          materialZones,
          roughSlope: Math.max(
            this.terrain.getSlopeAt(-32.5, -27.0),
            this.terrain.getSlopeAt(-39.5, -27.0),
            this.terrain.getSlopeAt(33.5, -9.5),
            this.terrain.getSlopeAt(33.5, 1.5),
            this.terrain.getSlopeAt(24.5, 26.0),
            this.terrain.getSlopeAt(30.5, 26.0),
            this.terrain.getSlopeAt(50.0, -42.0),
            this.terrain.getSlopeAt(-54.0, 42.0),
            this.terrain.getSlopeAt(54.0, 18.0),
          ),
          farColliderCount,
          colliderKinds: new Set(this.worldColliders.map((collider) => collider.kind)).size,
          pipeCount: this.worldColliders.filter((collider) => collider.kind === "pipe").length,
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

        let fineObjectImpulse = 0;
        let fineObjectTravel = 0;
        let fineObjectPenetrationBefore = 0;
        let fineObjectPenetrationAfter = 0;
        let excavatorFinePenetrationBefore = 0;
        let excavatorFinePenetrationAfter = 0;
        let excavatorFineTravel = 0;
        let excavatorFineVelocity = 0;
        let finePairDistanceBefore = 0;
        let finePairDistanceAfter = 0;
        let finePairVelocityDelta = 0;
        const fineTarget =
          this.worldColliders.find((collider) => collider.kind === "cone") ??
          this.worldColliders.find((collider) => collider.kind === "rock") ??
          this.worldColliders.find((collider) => collider.kind === "boulder");
        if (fineTarget) {
          const savedPosition = fineTarget.mesh.position.clone();
          const savedQuaternion = fineTarget.mesh.quaternion.clone();
          const savedScale = fineTarget.mesh.scale.clone();
          const savedVelocity = fineTarget.velocity.clone();
          const savedAngularVelocity = fineTarget.angularVelocity.clone();
          const savedSleeping = fineTarget.sleeping;
          const radius = 0.026;
          const idx = this.fineGrainCursor;
          const p = idx * 3;
          const start = fineTarget.mesh.position.clone();
          this.deactivateFineGrain(idx);
          this.fineGrainPositions[p] = fineTarget.mesh.position.x - fineTarget.radius - radius + 0.018;
          this.fineGrainPositions[p + 1] = fineTarget.mesh.position.y + Math.min(0.08, fineTarget.radius * 0.18);
          this.fineGrainPositions[p + 2] = fineTarget.mesh.position.z;
          this.fineGrainVelocities[p] = 0.82;
          this.fineGrainVelocities[p + 1] = -0.04;
          this.fineGrainVelocities[p + 2] = 0.02;
          this.fineGrainVolumes[idx] = 0.035;
          this.fineGrainLife[idx] = 0;
          this.fineGrainMaxLife[idx] = 1;
          this.fineGrainSettles[idx] = 1;
          fineTarget.velocity.set(0, 0, 0);
          fineTarget.angularVelocity.set(0, 0, 0);
          fineTarget.sleeping = false;
          this.worldColliderGridDirty = true;
          fineObjectPenetrationBefore =
            fineTarget.radius +
            radius -
            fineTarget.mesh.position.distanceTo(new THREE.Vector3(this.fineGrainPositions[p], this.fineGrainPositions[p + 1], this.fineGrainPositions[p + 2]));
          this.resolveFineGrainCollisions(idx, radius);
          fineObjectImpulse = fineTarget.velocity.length();
          fineObjectTravel = fineTarget.mesh.position.distanceTo(start);
          fineObjectPenetrationAfter =
            fineTarget.radius +
            radius -
            fineTarget.mesh.position.distanceTo(new THREE.Vector3(this.fineGrainPositions[p], this.fineGrainPositions[p + 1], this.fineGrainPositions[p + 2]));
          this.deactivateFineGrain(idx);
          fineTarget.mesh.position.copy(savedPosition);
          fineTarget.mesh.quaternion.copy(savedQuaternion);
          fineTarget.mesh.scale.copy(savedScale);
          fineTarget.velocity.copy(savedVelocity);
          fineTarget.angularVelocity.copy(savedAngularVelocity);
          fineTarget.sleeping = savedSleeping;
          this.worldColliderGridDirty = true;
        }

        const savedAngles = { ...this.angles };
        const savedMachinePosition = this.excavator.group.position.clone();
        const savedMachineRotation = this.excavator.group.rotation.clone();
        this.excavator.group.position.set(0, this.terrain.getHeightAt(0, 0), 0);
        this.excavator.group.rotation.set(0, 0, 0);
        Object.assign(this.angles, { swing: 0, boom: 0.46, stick: -1.16, bucket: -1.9 });
        this.excavator.applyAngles(this.angles);
        const excavatorFineRadius = 0.026;
        const excavatorFineIndex = this.fineGrainCursor;
        const fp = excavatorFineIndex * 3;
        const trackNormal = new THREE.Vector3(0, 0, 1);
        const trackPoint = this.excavator.group.position.clone().add(new THREE.Vector3(0, 0, TRACK_GAUGE * 0.5));
        trackPoint.y = this.excavator.group.position.y + 0.34;
        this.deactivateFineGrain(excavatorFineIndex);
        this.fineGrainPositions[fp] = trackPoint.x + trackNormal.x * (TRACK_WIDTH * 0.72 + excavatorFineRadius - 0.052);
        this.fineGrainPositions[fp + 1] = trackPoint.y + trackNormal.y * (TRACK_WIDTH * 0.72 + excavatorFineRadius - 0.052);
        this.fineGrainPositions[fp + 2] = trackPoint.z + trackNormal.z * (TRACK_WIDTH * 0.72 + excavatorFineRadius - 0.052);
        this.fineGrainVelocities[fp] = -trackNormal.x * 0.64;
        this.fineGrainVelocities[fp + 1] = -0.02;
        this.fineGrainVelocities[fp + 2] = -trackNormal.z * 0.64;
        this.fineGrainVolumes[excavatorFineIndex] = 0.018;
        this.fineGrainLife[excavatorFineIndex] = 0;
        this.fineGrainMaxLife[excavatorFineIndex] = 1;
        this.fineGrainSettles[excavatorFineIndex] = 1;
        const excavatorFineBeforePosition = new THREE.Vector3(
          this.fineGrainPositions[fp],
          this.fineGrainPositions[fp + 1],
          this.fineGrainPositions[fp + 2],
        );
        excavatorFinePenetrationBefore = this.resolveExcavatorSolidHit(excavatorFineBeforePosition, excavatorFineRadius)?.penetration ?? 0;
        this.resolveFineGrainCollisions(excavatorFineIndex, excavatorFineRadius);
        const excavatorFineAfterPosition = new THREE.Vector3(
          this.fineGrainPositions[fp],
          this.fineGrainPositions[fp + 1],
          this.fineGrainPositions[fp + 2],
        );
        excavatorFinePenetrationAfter = this.resolveExcavatorSolidHit(excavatorFineAfterPosition, excavatorFineRadius)?.penetration ?? 0;
        excavatorFineTravel = excavatorFineAfterPosition.distanceTo(excavatorFineBeforePosition);
        excavatorFineVelocity = Math.hypot(this.fineGrainVelocities[fp], this.fineGrainVelocities[fp + 1], this.fineGrainVelocities[fp + 2]);
        this.deactivateFineGrain(excavatorFineIndex);
        Object.assign(this.angles, savedAngles);
        this.excavator.group.position.copy(savedMachinePosition);
        this.excavator.group.rotation.copy(savedMachineRotation);
        this.excavator.applyAngles(this.angles);

        const pairFineRadius = 0.026;
        const finePairA = this.fineGrainCursor;
        const finePairB = (finePairA + 1) % this.fineGrainMax;
        this.deactivateFineGrain(finePairA);
        this.deactivateFineGrain(finePairB);
        const fa = finePairA * 3;
        const fb = finePairB * 3;
        const finePairBase = new THREE.Vector3(6.4, this.terrain.getHeightAt(6.4, -5.6) + 1.1, -5.6);
        this.fineGrainPositions[fa] = finePairBase.x;
        this.fineGrainPositions[fa + 1] = finePairBase.y;
        this.fineGrainPositions[fa + 2] = finePairBase.z;
        this.fineGrainPositions[fb] = finePairBase.x + pairFineRadius * 1.25;
        this.fineGrainPositions[fb + 1] = finePairBase.y + 0.004;
        this.fineGrainPositions[fb + 2] = finePairBase.z;
        this.fineGrainVelocities[fa] = 0.28;
        this.fineGrainVelocities[fa + 1] = -0.02;
        this.fineGrainVelocities[fa + 2] = 0;
        this.fineGrainVelocities[fb] = -0.18;
        this.fineGrainVelocities[fb + 1] = -0.01;
        this.fineGrainVelocities[fb + 2] = 0;
        this.fineGrainVolumes[finePairA] = 0.018;
        this.fineGrainVolumes[finePairB] = 0.016;
        this.fineGrainLife[finePairA] = 0;
        this.fineGrainLife[finePairB] = 0;
        this.fineGrainMaxLife[finePairA] = 1;
        this.fineGrainMaxLife[finePairB] = 1;
        this.fineGrainSettles[finePairA] = 1;
        this.fineGrainSettles[finePairB] = 1;
        const finePairVelocityBeforeA = new THREE.Vector3(this.fineGrainVelocities[fa], this.fineGrainVelocities[fa + 1], this.fineGrainVelocities[fa + 2]);
        const finePairVelocityBeforeB = new THREE.Vector3(this.fineGrainVelocities[fb], this.fineGrainVelocities[fb + 1], this.fineGrainVelocities[fb + 2]);
        const finePairPosA = new THREE.Vector3(this.fineGrainPositions[fa], this.fineGrainPositions[fa + 1], this.fineGrainPositions[fa + 2]);
        const finePairVelocityA = finePairVelocityBeforeA.clone();
        finePairDistanceBefore = finePairPosA.distanceTo(new THREE.Vector3(this.fineGrainPositions[fb], this.fineGrainPositions[fb + 1], this.fineGrainPositions[fb + 2]));
        this.rebuildFineGrainPairGrid();
        this.resolveFineGrainPairCollision(finePairA, finePairPosA, finePairVelocityA, pairFineRadius, Math.max(0.006, this.fineGrainVolumes[finePairA] * 1.8));
        this.fineGrainPositions[fa] = finePairPosA.x;
        this.fineGrainPositions[fa + 1] = finePairPosA.y;
        this.fineGrainPositions[fa + 2] = finePairPosA.z;
        this.fineGrainVelocities[fa] = finePairVelocityA.x;
        this.fineGrainVelocities[fa + 1] = finePairVelocityA.y;
        this.fineGrainVelocities[fa + 2] = finePairVelocityA.z;
        finePairDistanceAfter = finePairPosA.distanceTo(new THREE.Vector3(this.fineGrainPositions[fb], this.fineGrainPositions[fb + 1], this.fineGrainPositions[fb + 2]));
        finePairVelocityDelta =
          finePairVelocityA.distanceTo(finePairVelocityBeforeA) +
          new THREE.Vector3(this.fineGrainVelocities[fb], this.fineGrainVelocities[fb + 1], this.fineGrainVelocities[fb + 2]).distanceTo(finePairVelocityBeforeB);
        this.deactivateFineGrain(finePairA);
        this.deactivateFineGrain(finePairB);

        this.updateUi(0);
        return {
          spawnedVolume,
          settledVolume: this.fineGrainSettledVolume - beforeSettled,
          activeAfter: this.fineGrainCount(),
          terrainGain: this.terrain.terrainVolumeDelta() - beforeTerrain,
          fineObjectImpulse,
          fineObjectTravel,
          fineObjectPenetrationBefore,
          fineObjectPenetrationAfter,
          excavatorFinePenetrationBefore,
          excavatorFinePenetrationAfter,
          excavatorFineTravel,
          excavatorFineVelocity,
          finePairDistanceBefore,
          finePairDistanceAfter,
          finePairVelocityDelta,
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
      forceDeepExcavation: () => {
        const beforeHeight = this.terrain.getHeightAt(DIG_SITE.x, DIG_SITE.z);
        const shallowResistance = this.terrain.getSubsoilResistanceAt(DIG_SITE.x, DIG_SITE.z);
        let removed = 0;

        const lanes = [-0.82, 0, 0.82];
        for (let pass = 0; pass < 36; pass += 1) {
          const lane = lanes[pass % lanes.length];
          const current = this.terrain.getHeightAt(DIG_SITE.x, DIG_SITE.z + lane);
          const start = new THREE.Vector3(DIG_SITE.x - 0.86, current + 0.08, DIG_SITE.z + lane);
          const end = new THREE.Vector3(DIG_SITE.x + 0.86, current - 0.68, DIG_SITE.z + lane);
          removed += this.excavateTerrainWithWake(
            start,
            end,
            new THREE.Vector3(0, 0, 1),
            1.38,
            0.68,
            BUCKET_CAPACITY,
          );
          if (pass % lanes.length === lanes.length - 1) {
            this.settleTerrainWithWake(DIG_SITE, 2.45, 1);
          }
        }

        const afterHeight = this.terrain.getHeightAt(DIG_SITE.x, DIG_SITE.z);
        const deepResistance = this.terrain.getSubsoilResistanceAt(DIG_SITE.x, DIG_SITE.z);
        const previousAngles: ExcavatorAngles = { swing: 0, boom: 0.24, stick: -1.52, bucket: -1.72 };
        this.velocities.boom = -0.04;
        this.velocities.stick = -0.34;
        this.velocities.bucket = -0.82;
        const resistance = this.resolveArmTerrainResistance(previousAngles);
        this.updateUi(0);

        return {
          beforeHeight,
          afterHeight,
          removed,
          depthReached: beforeHeight - afterHeight,
          shallowResistance,
          deepResistance,
          bedrockFloor: SOIL_BEDROCK_FLOOR,
          terrainDrag: resistance.drag,
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
    this.resolveUpperTruckCollisions(anglesBeforeArmMotion);
    this.resolveUpperWorldObjectCollisions(anglesBeforeArmMotion);
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
    const spill = this.spillTruckLoadToTerrain(
      dt,
      0.85 + clamp(Math.abs(state.pitch) + Math.abs(state.roll) + state.impactImpulse * 0.016, 0, 1.25),
    );
    if (spill.spilledVolume > 0.001) {
      this.pressure = Math.max(this.pressure, clamp(0.12 + spill.spilledVolume * 0.32 + spill.terrainGain * 0.45, 0, 0.48));
    }
    if (state.tireCompacted > 0.001) {
      this.wakeTruckWheelColliders();
      this.pressure = Math.max(this.pressure, clamp(0.04 + state.loadRatio * 0.18 + state.tireRutDrop * 2.4, 0, 0.42));
    }
  }

  private spillTruckLoadToTerrain(dt: number, intensity = 1): { spilledVolume: number; terrainGain: number; worldPoint: THREE.Vector3 } {
    if (this.truckLoad <= 0.002) {
      return { spilledVolume: 0, terrainGain: 0, worldPoint: this.truck.group.position.clone() };
    }

    const beforeTerrain = this.terrain.terrainVolumeDelta();
    const spill = this.truck.spillLoadOverBed(dt, intensity, this.truckLoad);
    if (spill.spilledVolume <= 0) {
      return { spilledVolume: 0, terrainGain: 0, worldPoint: spill.worldPoint };
    }

    const spilledVolume = Math.min(this.truckLoad, spill.spilledVolume);
    const depositRadius = clamp(0.34 + Math.cbrt(spilledVolume) * 0.28, 0.36, 0.78);
    const depositPoint = spill.worldPoint.clone();
    depositPoint.y = this.terrain.getHeightAt(depositPoint.x, depositPoint.z);
    this.raiseTerrainWithWake(depositPoint, depositRadius, spilledVolume, 1);
    this.truckLoad = Math.max(0, this.truckLoad - spilledVolume);
    this.truck.updateLoad(this.truckLoad);
    return {
      spilledVolume,
      terrainGain: this.terrain.terrainVolumeDelta() - beforeTerrain,
      worldPoint: spill.worldPoint,
    };
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

    const loadFactor = clamp(this.bucketLoad / BUCKET_CAPACITY + (this.carriedWorldObjectMass() / BUCKET_OBJECT_LOAD_REFERENCE) * 0.38, 0, 1.4);
    this.pressure = smoothTo(this.pressure, clamp(targetPressure * (0.55 + loadFactor * 0.45), 0, 1), 3.8, dt);
    if (targetPressure < 0.03) {
      this.idleSeconds += dt;
    }
  }

  private emptyTrackTraction(): TrackTractionState {
    return {
      leftTraction: 1,
      rightTraction: 1,
      leftSlip: 0,
      rightSlip: 0,
      leftGroundSpeed: this.leftTrackVelocity,
      rightGroundSpeed: this.rightTrackVelocity,
      leftRoughness: 0,
      rightRoughness: 0,
      leftGrade: 0,
      rightGrade: 0,
    };
  }

  private computeTrackTraction(forward: THREE.Vector3): TrackTractionState {
    const side = new THREE.Vector3(-forward.z, 0, forward.x).normalize();
    const base = this.excavator.group.position;
    const evaluate = (offset: number, motorVelocity: number) => {
      const center = base.clone().addScaledVector(side, offset);
      center.y = this.terrain.getHeightAt(center.x, center.z);
      const support = this.terrain.sampleTrackSupport(center, forward, side, TRACK_LENGTH, TRACK_WIDTH);
      const surface = this.terrain.getSurfaceConditionAt(center.x, center.z);
      const front = center.clone().addScaledVector(forward, TRACK_LENGTH * 0.42);
      const rear = center.clone().addScaledVector(forward, -TRACK_LENGTH * 0.42);
      const frontHeight = this.terrain.getHeightAt(front.x, front.z);
      const rearHeight = this.terrain.getHeightAt(rear.x, rear.z);
      const grade = (frontHeight - rearHeight) / Math.max(TRACK_LENGTH * 0.84, 0.001);
      const driveDirection = Math.sign(motorVelocity || 1);
      const uphillGrade = Math.max(0, grade * driveDirection);
      const roughness = clamp((support.highHeight - support.lowHeight) * 0.95 + support.disturbedDepth * 0.28, 0, 0.85);
      const materialLoss =
        surface.wetness * 0.18 +
        roughness * 0.3 +
        support.disturbedDepth * 0.16 +
        uphillGrade * 0.34 +
        Math.max(0, surface.trackDragMultiplier - 1) * 0.16;
      const traction = clamp(1.04 + surface.compaction * 0.08 + surface.hardpack * 0.04 - materialLoss, 0.34, 1.08);
      const slip = clamp(1 - traction + roughness * 0.18 + surface.wetness * 0.08 + uphillGrade * 0.08, 0, 1);
      const speedLoss = clamp((1 - traction) * 0.08 + uphillGrade * 0.02, 0, 0.09);
      const groundSpeed = motorVelocity * (1 - speedLoss);
      return { traction, slip, groundSpeed, roughness, grade };
    };

    const left = evaluate(-0.72, this.leftTrackVelocity);
    const right = evaluate(0.72, this.rightTrackVelocity);
    return {
      leftTraction: left.traction,
      rightTraction: right.traction,
      leftSlip: left.slip,
      rightSlip: right.slip,
      leftGroundSpeed: left.groundSpeed,
      rightGroundSpeed: right.groundSpeed,
      leftRoughness: left.roughness,
      rightRoughness: right.roughness,
      leftGrade: left.grade,
      rightGrade: right.grade,
    };
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

    let forward = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.excavator.group.rotation.y);
    this.trackTraction = this.computeTrackTraction(forward);
    const forwardSpeed = (this.trackTraction.leftGroundSpeed + this.trackTraction.rightGroundSpeed) * 0.5;
    const turnRate = (this.trackTraction.rightGroundSpeed - this.trackTraction.leftGroundSpeed) / TRACK_GAUGE;
    this.excavator.group.rotation.y -= turnRate * dt;

    forward = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.excavator.group.rotation.y);
    const move = forwardSpeed * dt;
    this.excavator.group.position.addScaledVector(forward, move);
    this.resolveWorldCollisions(forwardSpeed, turnRate, forward);
    this.travelDistance += Math.abs(move);
    this.updateTrackSoilInteraction(dt, forward);
    this.updateExcavatorSupport(dt, forward);
  }

  private emptyTruckCrawlerContact(): TruckCrawlerContactResult {
    return {
      contact: false,
      contactCount: 0,
      cornerContacts: 0,
      maxPenetration: 0,
      minApproachSpeed: 0,
      leftBlocked: false,
      rightBlocked: false,
    };
  }

  private crawlerFootprintSamples(): CrawlerFootprintSample[] {
    const samples: CrawlerFootprintSample[] = [];
    const addTrackSamples = (track: "left" | "right", z: number): void => {
      for (let i = 0; i < TRACK_PAD_COUNT; i += 1) {
        const x = TRACK_PAD_START_X + i * TRACK_PAD_SPACING;
        const endDistance = Math.min(i, TRACK_PAD_COUNT - 1 - i);
        samples.push({
          x,
          z,
          radius: TRACK_WIDTH * (endDistance <= 1 ? 0.54 : 0.46),
          track,
          padIndex: i,
          isEnd: endDistance <= 1,
        });
      }
      samples.push(
        { x: 0, z, radius: TRACK_WIDTH * 0.6, track, padIndex: Math.floor(TRACK_PAD_COUNT * 0.5), isEnd: false },
        { x: TRACK_LENGTH * 0.46, z, radius: TRACK_WIDTH * 0.58, track, padIndex: TRACK_PAD_COUNT, isEnd: true },
        { x: -TRACK_LENGTH * 0.46, z, radius: TRACK_WIDTH * 0.58, track, padIndex: -1, isEnd: true },
      );
    };

    addTrackSamples("left", -TRACK_GAUGE * 0.5);
    addTrackSamples("right", TRACK_GAUGE * 0.5);
    return samples;
  }

  private resolveTruckCrawlerFootprintCollision(
    forwardSpeed: number,
    turnRate: number,
    forward: THREE.Vector3,
  ): TruckCrawlerContactResult {
    const side = new THREE.Vector3(-forward.z, 0, forward.x).normalize();
    const base = this.excavator.group.position;
    const samples = this.crawlerFootprintSamples();

    let contactCount = 0;
    let cornerContacts = 0;
    let maxPenetration = 0;
    let minApproachSpeed = 0;
    let leftSeverity = 0;
    let rightSeverity = 0;
    let correctionWeight = 0;
    const correctionNormal = new THREE.Vector3();
    const impactPoint = new THREE.Vector3();
    let impactWeight = 0;

    for (const sample of samples) {
      const world = base
        .clone()
        .addScaledVector(forward, sample.x)
        .addScaledVector(side, sample.z);
      world.y = this.terrain.getHeightAt(world.x, world.z) + TRACK_CONTACT_HEIGHT;
      const hit = this.resolveTruckCrawlerSolidHit(world, sample.radius);
      if (!hit) {
        continue;
      }

      const sampleVelocity = forward
        .clone()
        .multiplyScalar(forwardSpeed + turnRate * sample.z)
        .addScaledVector(side, -turnRate * sample.x);
      const approachSpeed = sampleVelocity.dot(hit.normal);
      const severity = clamp(hit.penetration * 2.2 + Math.max(0, -approachSpeed) * 0.75 + Math.abs(turnRate) * 0.08, 0, 1);

      contactCount += 1;
      maxPenetration = Math.max(maxPenetration, hit.penetration);
      minApproachSpeed = Math.min(minApproachSpeed, approachSpeed);
      correctionWeight += Math.min(hit.penetration + Math.max(0, -approachSpeed) * 0.04, 0.36);
      correctionNormal.addScaledVector(hit.normal, 0.12 + severity);
      impactPoint.addScaledVector(world, 0.1 + severity);
      impactWeight += 0.1 + severity;
      if (sample.isEnd && Math.abs(sample.z) > TRACK_GAUGE * 0.34) {
        cornerContacts += 1;
      }
      if (sample.track === "left") {
        leftSeverity = Math.max(leftSeverity, severity);
      } else {
        rightSeverity = Math.max(rightSeverity, severity);
      }
    }

    if (contactCount === 0) {
      return this.emptyTruckCrawlerContact();
    }

    if (correctionNormal.lengthSq() < 0.000001) {
      const bodyPoint = base.clone();
      bodyPoint.y = this.terrain.getHeightAt(bodyPoint.x, bodyPoint.z) + CRAWLER_BODY_CONTACT_HEIGHT;
      const centerHit = this.resolveTruckCrawlerSolidHit(bodyPoint, 1.62, true);
      if (!centerHit) {
        return this.emptyTruckCrawlerContact();
      }
      correctionNormal.copy(centerHit.normal);
    }
    correctionNormal.normalize();
    const correction = Math.min(0.36, correctionWeight / contactCount + 0.012);
    this.excavator.group.position.addScaledVector(correctionNormal, correction);

    if (leftSeverity > 0.02) {
      this.leftTrackVelocity *= clamp(1 - leftSeverity * 1.7, 0, 0.58);
    }
    if (rightSeverity > 0.02) {
      this.rightTrackVelocity *= clamp(1 - rightSeverity * 1.7, 0, 0.58);
    }

    const peakSeverity = Math.max(leftSeverity, rightSeverity, maxPenetration * 1.8);
    if (impactWeight > 0) {
      const truckImpact = clamp(0.28 + peakSeverity * 2.2 + Math.max(0, -minApproachSpeed) * 0.7, 0.04, 3.4);
      this.truck.applyImpact(impactPoint.divideScalar(impactWeight), correctionNormal, truckImpact);
    }
    this.pressure = Math.max(this.pressure, clamp(0.36 + peakSeverity * 0.54, 0, 1));
    if (this.collisionCooldown <= 0 && peakSeverity > 0.07) {
      this.collisionCount += 1;
      this.collisionCooldown = 0.34;
    }

    return {
      contact: true,
      contactCount,
      cornerContacts,
      maxPenetration,
      minApproachSpeed,
      leftBlocked: leftSeverity > 0.18,
      rightBlocked: rightSeverity > 0.18,
    };
  }

  private resolveTruckCrawlerSolidHit(
    worldCenter: THREE.Vector3,
    radius: number,
    allowEnvelopeFallback = false,
  ): { normal: THREE.Vector3; penetration: number } | null {
    const hit =
      this.truck.resolveSolidCollision(worldCenter, radius) ??
      (allowEnvelopeFallback ? this.truck.resolveBodyCollision(worldCenter, radius) : null);
    if (!hit) {
      return null;
    }

    const normal = hit.normal.clone();
    normal.y = 0;
    if (normal.lengthSq() < 0.000001) {
      normal.copy(worldCenter).sub(this.truck.group.position).setY(0);
    }
    if (normal.lengthSq() < 0.000001) {
      normal.set(1, 0, 0);
    } else {
      normal.normalize();
    }
    return { normal, penetration: hit.penetration };
  }

  private emptyCrawlerWorldObjectContact(): CrawlerWorldObjectContactResult {
    return {
      contact: false,
      contactCount: 0,
      trackContactCount: 0,
      cornerContacts: 0,
      centerContact: false,
      maxPenetration: 0,
      minApproachSpeed: 0,
      movedCount: 0,
      movedMass: 0,
      leftImpulse: 0,
      rightImpulse: 0,
    };
  }

  private resolveCrawlerWorldObjectFootprintCollision(
    forwardSpeed: number,
    turnRate: number,
    forward: THREE.Vector3,
    hasDriveIntent: boolean,
  ): CrawlerWorldObjectContactResult {
    const result = this.emptyCrawlerWorldObjectContact();
    const side = new THREE.Vector3(-forward.z, 0, forward.x).normalize();
    const base = this.excavator.group.position;
    const samples = this.crawlerFootprintSamples();
    const candidates = [...this.nearbyWorldColliders(base, TRACK_LENGTH * 0.62 + TRACK_GAUGE * 0.58 + 1.35)];

    for (const collider of candidates) {
      if (this.carriedWorldColliders.has(collider)) {
        continue;
      }

      let colliderContactCount = 0;
      let colliderTrackContactCount = 0;
      let colliderCornerContacts = 0;
      let colliderMaxPenetration = 0;
      let colliderMinApproachSpeed = 0;
      let colliderMaxClosingSpeed = 0;
      let colliderSeverity = 0;
      let colliderLeftSeverity = 0;
      let colliderRightSeverity = 0;
      const correctionNormal = new THREE.Vector3();
      const contactPoint = new THREE.Vector3();
      let contactPointWeight = 0;

      for (const sample of samples) {
        const samplePoint = base
          .clone()
          .addScaledVector(forward, sample.x)
          .addScaledVector(side, sample.z);
        samplePoint.y = this.terrain.getHeightAt(samplePoint.x, samplePoint.z) + TRACK_CONTACT_HEIGHT;
        const hit = this.resolveColliderHit(collider, samplePoint, sample.radius);
        if (!hit) {
          continue;
        }

        const normal = hit.normal;
        const penetration = hit.penetration;
        const sampleVelocity = forward
          .clone()
          .multiplyScalar(forwardSpeed + turnRate * sample.z)
          .addScaledVector(side, -turnRate * sample.x);
        const approachSpeed = sampleVelocity.dot(normal);
        const closingSpeed = Math.max(0, -approachSpeed);
        const severity = clamp(penetration * 2.35 + closingSpeed * 0.62 + Math.abs(turnRate) * 0.08, 0, 1);

        colliderContactCount += 1;
        colliderTrackContactCount += 1;
        colliderMaxPenetration = Math.max(colliderMaxPenetration, penetration);
        colliderMinApproachSpeed = Math.min(colliderMinApproachSpeed, approachSpeed);
        colliderMaxClosingSpeed = Math.max(colliderMaxClosingSpeed, closingSpeed);
        colliderSeverity = Math.max(colliderSeverity, severity);
        const contactWeight = 0.16 + severity + penetration * 1.8;
        correctionNormal.addScaledVector(normal, contactWeight);
        contactPoint.addScaledVector(hit.point, contactWeight);
        contactPointWeight += contactWeight;
        if (sample.isEnd) {
          colliderCornerContacts += 1;
        }
        if (sample.track === "left") {
          colliderLeftSeverity = Math.max(colliderLeftSeverity, severity);
        } else {
          colliderRightSeverity = Math.max(colliderRightSeverity, severity);
        }
      }

      if (colliderContactCount === 0) {
        const bodyPoint = base.clone();
        bodyPoint.y = this.terrain.getHeightAt(bodyPoint.x, bodyPoint.z) + CRAWLER_BODY_CONTACT_HEIGHT;
        const bodyHit = this.resolveColliderHit(collider, bodyPoint, 1.62);
        if (!bodyHit) {
          continue;
        }
        const approachSpeed = forward.clone().multiplyScalar(forwardSpeed).dot(bodyHit.normal);
        const closingSpeed = Math.max(0, -approachSpeed);
        const severity = clamp(bodyHit.penetration * 2.1 + closingSpeed * 0.48 + Math.abs(turnRate) * 0.08, 0, 1);
        colliderContactCount = 1;
        colliderMaxPenetration = bodyHit.penetration;
        colliderMinApproachSpeed = approachSpeed;
        colliderMaxClosingSpeed = closingSpeed;
        colliderSeverity = severity;
        correctionNormal.copy(bodyHit.normal);
        contactPoint.copy(bodyHit.point);
        contactPointWeight = 1;
        result.centerContact = true;
      }

      if (correctionNormal.lengthSq() < 0.000001) {
        correctionNormal.copy(forward).multiplyScalar(-1);
      }
      correctionNormal.normalize();

      result.contact = true;
      result.contactCount += colliderContactCount;
      result.trackContactCount += colliderTrackContactCount;
      result.cornerContacts += colliderCornerContacts;
      result.maxPenetration = Math.max(result.maxPenetration, colliderMaxPenetration);
      result.minApproachSpeed = Math.min(result.minApproachSpeed, colliderMinApproachSpeed);

      if (collider.immovable) {
        this.applyCollisionResponse(correctionNormal, colliderMaxPenetration, forwardSpeed, turnRate, forward, 0.92);
        continue;
      }

      if (!hasDriveIntent && colliderMaxPenetration < 0.22) {
        continue;
      }

      const impulsePoint =
        contactPointWeight > 0
          ? contactPoint.clone().divideScalar(contactPointWeight)
          : collider.mesh.position.clone().addScaledVector(correctionNormal, collider.radius);
      const impulse = clamp(
        (colliderSeverity * 1.55 + colliderMaxClosingSpeed * 0.5 + colliderMaxPenetration * 0.9) / Math.max(collider.mass, 0.1),
        0.045,
        1.9,
      );
      const correction = Math.min(colliderMaxPenetration * (0.72 + colliderSeverity * 0.16), 0.22);
      collider.mesh.position.addScaledVector(correctionNormal, -correction);
      collider.velocity.addScaledVector(correctionNormal, -impulse);
      collider.velocity.y = Math.max(collider.velocity.y, 0.08 + 0.18 * colliderSeverity);
      this.applyWorldColliderAngularImpulse(
        collider,
        impulsePoint,
        correctionNormal.clone().multiplyScalar(-impulse * collider.mass),
        0.34,
      );
      collider.sleeping = false;
      result.movedCount += 1;
      result.movedMass += collider.mass;
      result.leftImpulse += impulse * colliderLeftSeverity;
      result.rightImpulse += impulse * colliderRightSeverity;
      this.worldColliderGridDirty = true;
      this.pressure = Math.max(this.pressure, clamp(0.1 + colliderSeverity * 0.38 + collider.mass * 0.018, 0, 0.66));
      if (collider.crushable && colliderSeverity > 0.32) {
        collider.mesh.scale.multiplyScalar(1 - Math.min(colliderSeverity * 0.04, 0.08));
        this.raiseTerrainWithWake(collider.mesh.position, Math.max(0.16, collider.radius * 1.7), collider.radius * 0.012 * colliderSeverity, 0);
      }
    }

    return result;
  }

  private resolveWorldCollisions(
    forwardSpeed: number,
    turnRate: number,
    forward: THREE.Vector3,
  ): { truckContact: TruckCrawlerContactResult; objectContact: CrawlerWorldObjectContactResult; bodyHit: boolean } {
    const hasDriveIntent = Math.abs(forwardSpeed) > 0.02 || Math.abs(turnRate) > 0.05;
    const truckContact = this.resolveTruckCrawlerFootprintCollision(forwardSpeed, turnRate, forward);
    const bodyPoint = this.excavator.group.position.clone();
    bodyPoint.y = this.terrain.getHeightAt(bodyPoint.x, bodyPoint.z) + CRAWLER_BODY_CONTACT_HEIGHT;
    const hit = this.resolveTruckCrawlerSolidHit(bodyPoint, 1.62, true);
    if (hit) {
      this.truck.applyImpact(
        this.excavator.group.position,
        hit.normal,
        clamp(0.18 + hit.penetration * 2.2 + Math.abs(forwardSpeed) * 0.72 + Math.abs(turnRate) * 0.18, 0.04, 2.8),
      );
      this.applyCollisionResponse(hit.normal, hit.penetration, forwardSpeed, turnRate, forward, 1.0);
    }

    const objectContact = this.resolveCrawlerWorldObjectFootprintCollision(forwardSpeed, turnRate, forward, hasDriveIntent);

    return { truckContact, objectContact, bodyHit: Boolean(hit) };
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

  private worldColliderInertia(collider: WorldCollider): number {
    if (collider.capsule) {
      const length = collider.capsule.localA.distanceTo(collider.capsule.localB);
      const radius = Math.max(collider.capsule.radius, 0.035);
      return Math.max(0.025, collider.mass * (length * length / 12 + radius * radius * 0.5));
    }
    return Math.max(0.025, collider.mass * Math.max(collider.radius * collider.radius * 0.4, 0.006));
  }

  private clampWorldColliderAngularVelocity(collider: WorldCollider): void {
    const maxSpin = collider.capsule ? 9.5 : 13.5;
    const spin = collider.angularVelocity.length();
    if (spin > maxSpin) {
      collider.angularVelocity.multiplyScalar(maxSpin / spin);
    }
  }

  private applyWorldColliderAngularImpulse(
    collider: WorldCollider,
    contactPoint: THREE.Vector3,
    impulseVector: THREE.Vector3,
    scale = 1,
  ): void {
    if (collider.immovable) {
      return;
    }
    const lever = contactPoint.clone().sub(collider.mesh.position);
    if (lever.lengthSq() < 0.000001 || impulseVector.lengthSq() < 0.000001) {
      return;
    }
    const torque = lever.cross(impulseVector);
    collider.angularVelocity.addScaledVector(torque, scale / this.worldColliderInertia(collider));
    this.clampWorldColliderAngularVelocity(collider);
  }

  private applyWorldColliderRollingSpin(collider: WorldCollider, groundNormal: THREE.Vector3, dt: number): void {
    const horizontal = new THREE.Vector3(collider.velocity.x, 0, collider.velocity.z);
    const speed = horizontal.length();
    if (speed <= 0.01) {
      return;
    }
    const up = groundNormal.clone().normalize();
    const axis = up.cross(horizontal);
    if (axis.lengthSq() < 0.000001) {
      return;
    }
    axis.normalize();
    const targetSpin = axis.multiplyScalar(speed / Math.max(collider.radius, collider.capsule?.radius ?? 0.08, 0.08));
    collider.angularVelocity.lerp(targetSpin, clamp(dt * (1.55 + collider.friction * 2.1), 0, 0.34));
    this.clampWorldColliderAngularVelocity(collider);
  }

  private integrateWorldColliderAngularMotion(collider: WorldCollider, dt: number): void {
    const spin = collider.angularVelocity.length();
    if (spin > 0.0001) {
      const delta = new THREE.Quaternion().setFromAxisAngle(
        collider.angularVelocity.clone().divideScalar(spin),
        Math.min(spin * dt, 0.42),
      );
      collider.mesh.quaternion.premultiply(delta).normalize();
    }
    const damping = 1 - Math.min(dt * (0.46 + collider.friction * 0.7), 0.16);
    collider.angularVelocity.multiplyScalar(damping);
    if (collider.angularVelocity.lengthSq() < 0.000025) {
      collider.angularVelocity.set(0, 0, 0);
    }
  }

  private worldColliderCapsuleWorld(collider: WorldCollider): { a: THREE.Vector3; b: THREE.Vector3; radius: number } | null {
    if (!collider.capsule) {
      return null;
    }
    return {
      a: collider.mesh.localToWorld(collider.capsule.localA.clone()),
      b: collider.mesh.localToWorld(collider.capsule.localB.clone()),
      radius: collider.capsule.radius,
    };
  }

  private resolveWorldColliderSampleHit(
    collider: WorldCollider,
    samplePoint: THREE.Vector3,
    sampleRadius: number,
  ): { normal: THREE.Vector3; penetration: number } | null {
    const capsule = this.worldColliderCapsuleWorld(collider);
    if (capsule) {
      const axis = capsule.b.clone().sub(capsule.a);
      const axisLenSq = axis.lengthSq();
      const t = axisLenSq > 0.000001 ? clamp(samplePoint.clone().sub(capsule.a).dot(axis) / axisLenSq, 0, 1) : 0;
      const closest = capsule.a.clone().addScaledVector(axis, t);
      const delta = samplePoint.clone().sub(closest);
      const combinedRadius = sampleRadius + capsule.radius;
      const distanceSq = delta.lengthSq();
      if (distanceSq >= combinedRadius * combinedRadius) {
        return null;
      }
      if (distanceSq < 0.000001) {
        const fallback = samplePoint.clone().sub(collider.mesh.position);
        if (fallback.lengthSq() > 0.000001) {
          fallback.normalize();
        } else {
          fallback.set(1, 0, 0);
        }
        return { normal: fallback, penetration: combinedRadius };
      }
      const distance = Math.sqrt(distanceSq);
      return {
        normal: delta.divideScalar(distance),
        penetration: combinedRadius - distance,
      };
    }

    const delta = samplePoint.clone().sub(collider.mesh.position);
    const combinedRadius = sampleRadius + collider.radius;
    const distanceSq = delta.lengthSq();
    if (distanceSq >= combinedRadius * combinedRadius) {
      return null;
    }
    if (distanceSq < 0.000001) {
      return { normal: new THREE.Vector3(1, 0, 0), penetration: combinedRadius };
    }
    const distance = Math.sqrt(distanceSq);
    return {
      normal: delta.divideScalar(distance),
      penetration: combinedRadius - distance,
    };
  }

  private worldColliderShapeSamples(collider: WorldCollider): { point: THREE.Vector3; radius: number }[] {
    const capsule = this.worldColliderCapsuleWorld(collider);
    if (!capsule) {
      return [{ point: collider.mesh.position.clone(), radius: collider.radius }];
    }

    const samples: { point: THREE.Vector3; radius: number }[] = [];
    for (const t of [0, 0.25, 0.5, 0.75, 1] as const) {
      samples.push({
        point: capsule.a.clone().lerp(capsule.b, t),
        radius: capsule.radius,
      });
    }
    return samples;
  }

  private worldColliderTerrainSupport(collider: WorldCollider): {
    supportDelta: number;
    penetration: number;
    unsupportedDrop: number;
    slopeX: number;
    slopeZ: number;
    slope: number;
    normal: THREE.Vector3;
    point: THREE.Vector3;
  } {
    const samples = this.worldColliderShapeSamples(collider);
    let supportDelta = -Infinity;
    let supportPoint = collider.mesh.position.clone();
    let slopeX = 0;
    let slopeZ = 0;

    for (const sample of samples) {
      const supportY = this.terrain.getHeightAt(sample.point.x, sample.point.z) + collider.groundOffset;
      const delta = supportY - sample.point.y;
      if (delta > supportDelta) {
        supportDelta = delta;
        supportPoint = sample.point.clone();
      }

      const span = Math.max(0.24, sample.radius * 2.2);
      slopeX +=
        (this.terrain.getHeightAt(sample.point.x + span, sample.point.z) -
          this.terrain.getHeightAt(sample.point.x - span, sample.point.z)) /
        Math.max(span * 2, 0.001);
      slopeZ +=
        (this.terrain.getHeightAt(sample.point.x, sample.point.z + span) -
          this.terrain.getHeightAt(sample.point.x, sample.point.z - span)) /
        Math.max(span * 2, 0.001);
    }

    const count = Math.max(samples.length, 1);
    slopeX /= count;
    slopeZ /= count;
    const slope = Math.hypot(slopeX, slopeZ);
    const normal = new THREE.Vector3(-slopeX, 1, -slopeZ).normalize();
    const resolvedDelta = Number.isFinite(supportDelta) ? supportDelta : 0;
    return {
      supportDelta: resolvedDelta,
      penetration: Math.max(0, resolvedDelta),
      unsupportedDrop: Math.max(0, -resolvedDelta),
      slopeX,
      slopeZ,
      slope,
      normal,
      point: supportPoint,
    };
  }

  private resolveWorldColliderShapeHit(
    collider: WorldCollider,
    resolver: (point: THREE.Vector3, radius: number) => { normal: THREE.Vector3; penetration: number } | null,
  ): { normal: THREE.Vector3; penetration: number; point: THREE.Vector3 } | null {
    let best: { normal: THREE.Vector3; penetration: number; point: THREE.Vector3 } | null = null;
    for (const sample of this.worldColliderShapeSamples(collider)) {
      const hit = resolver(sample.point, sample.radius);
      if (!hit) {
        continue;
      }
      if (!best || hit.penetration > best.penetration) {
        best = {
          normal: hit.normal.clone().normalize(),
          penetration: hit.penetration,
          point: sample.point.clone(),
        };
      }
    }
    return best;
  }

  private closestPointOnSegment(point: THREE.Vector3, a: THREE.Vector3, b: THREE.Vector3): THREE.Vector3 {
    const axis = b.clone().sub(a);
    const axisLenSq = axis.lengthSq();
    const t = axisLenSq > 0.000001 ? clamp(point.clone().sub(a).dot(axis) / axisLenSq, 0, 1) : 0;
    return a.clone().addScaledVector(axis, t);
  }

  private closestPointsBetweenSegments(
    a0: THREE.Vector3,
    a1: THREE.Vector3,
    b0: THREE.Vector3,
    b1: THREE.Vector3,
  ): { a: THREE.Vector3; b: THREE.Vector3 } {
    const d1 = a1.clone().sub(a0);
    const d2 = b1.clone().sub(b0);
    const r = a0.clone().sub(b0);
    const aLen = d1.dot(d1);
    const bLen = d2.dot(d2);
    const epsilon = 0.000001;

    if (aLen <= epsilon && bLen <= epsilon) {
      return { a: a0.clone(), b: b0.clone() };
    }
    if (aLen <= epsilon) {
      const t = clamp(d2.dot(r) / bLen, 0, 1);
      return { a: a0.clone(), b: b0.clone().addScaledVector(d2, t) };
    }
    if (bLen <= epsilon) {
      const s = clamp(-d1.dot(r) / aLen, 0, 1);
      return { a: a0.clone().addScaledVector(d1, s), b: b0.clone() };
    }

    const c = d1.dot(r);
    const f = d2.dot(r);
    const denom = aLen * bLen - d1.dot(d2) * d1.dot(d2);
    let s = denom !== 0 ? clamp((d1.dot(d2) * f - c * bLen) / denom, 0, 1) : 0;
    let t = (d1.dot(d2) * s + f) / bLen;

    if (t < 0) {
      t = 0;
      s = clamp(-c / aLen, 0, 1);
    } else if (t > 1) {
      t = 1;
      s = clamp((d1.dot(d2) - c) / aLen, 0, 1);
    }

    return {
      a: a0.clone().addScaledVector(d1, s),
      b: b0.clone().addScaledVector(d2, t),
    };
  }

  private resolveWorldColliderPairHit(
    a: WorldCollider,
    b: WorldCollider,
  ): { normal: THREE.Vector3; penetration: number; pointA: THREE.Vector3; pointB: THREE.Vector3 } | null {
    const capsuleA = this.worldColliderCapsuleWorld(a);
    const capsuleB = this.worldColliderCapsuleWorld(b);
    let pointA: THREE.Vector3;
    let pointB: THREE.Vector3;
    let combinedRadius: number;

    if (capsuleA && capsuleB) {
      const closest = this.closestPointsBetweenSegments(capsuleA.a, capsuleA.b, capsuleB.a, capsuleB.b);
      pointA = closest.a;
      pointB = closest.b;
      combinedRadius = capsuleA.radius + capsuleB.radius;
    } else if (capsuleA) {
      pointA = this.closestPointOnSegment(b.mesh.position, capsuleA.a, capsuleA.b);
      pointB = b.mesh.position;
      combinedRadius = capsuleA.radius + b.radius;
    } else if (capsuleB) {
      pointA = a.mesh.position;
      pointB = this.closestPointOnSegment(a.mesh.position, capsuleB.a, capsuleB.b);
      combinedRadius = a.radius + capsuleB.radius;
    } else {
      pointA = a.mesh.position;
      pointB = b.mesh.position;
      combinedRadius = a.radius + b.radius;
    }

    const delta = pointA.clone().sub(pointB);
    const distanceSq = delta.lengthSq();
    if (distanceSq >= combinedRadius * combinedRadius) {
      return null;
    }

    if (distanceSq < 0.000001) {
      const fallback = a.mesh.position.clone().sub(b.mesh.position);
      if (fallback.lengthSq() > 0.000001) {
        fallback.normalize();
      } else {
        fallback.set(1, 0, 0);
      }
      return { normal: fallback, penetration: combinedRadius, pointA: pointA.clone(), pointB: pointB.clone() };
    }

    const distance = Math.sqrt(distanceSq);
    return {
      normal: delta.divideScalar(distance),
      penetration: combinedRadius - distance,
      pointA: pointA.clone(),
      pointB: pointB.clone(),
    };
  }

  private resolveColliderHit(
    collider: WorldCollider,
    bodyPosition: THREE.Vector3,
    bodyRadius: number,
  ): { normal: THREE.Vector3; penetration: number; point: THREE.Vector3 } | null {
    const horizontalNormalFrom = (delta: THREE.Vector3): THREE.Vector3 => {
      const normal = new THREE.Vector3(delta.x, 0, delta.z);
      if (normal.lengthSq() > 0.000001) {
        return normal.normalize();
      }
      const fallback = bodyPosition.clone().sub(collider.mesh.position).setY(0);
      if (fallback.lengthSq() > 0.000001) {
        return fallback.normalize();
      }
      return new THREE.Vector3(1, 0, 0);
    };

    const capsule = this.worldColliderCapsuleWorld(collider);
    if (capsule) {
      const axis = capsule.b.clone().sub(capsule.a);
      const axisLenSq = axis.lengthSq();
      const t = axisLenSq > 0.000001 ? clamp(bodyPosition.clone().sub(capsule.a).dot(axis) / axisLenSq, 0, 1) : 0;
      const closest = capsule.a.clone().addScaledVector(axis, t);
      const delta = bodyPosition.clone().sub(closest);
      const combinedRadius = bodyRadius + capsule.radius;
      const distanceSq = delta.lengthSq();
      if (distanceSq >= combinedRadius * combinedRadius) {
        return null;
      }
      return {
        normal: horizontalNormalFrom(delta),
        penetration: combinedRadius - Math.sqrt(Math.max(distanceSq, 0.000001)),
        point: closest,
      };
    }

    const obstacle = collider.mesh.position;
    const delta = bodyPosition.clone().sub(obstacle);
    const distanceSq = delta.lengthSq();
    const combinedRadius = bodyRadius + collider.radius;
    if (distanceSq >= combinedRadius * combinedRadius) {
      return null;
    }

    return {
      normal: horizontalNormalFrom(delta),
      penetration: combinedRadius - Math.sqrt(Math.max(distanceSq, 0.000001)),
      point: obstacle.clone(),
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
    let best: { local: THREE.Vector3; score: number } | null = null;
    const heavyReach = collider.kind === "cone" ? 0.48 : collider.kind === "twig" ? 0.52 : 0.78;

    for (const sample of this.worldColliderShapeSamples(collider)) {
      const local = this.excavator.bucketGroup.worldToLocal(sample.point.clone());
      const radius = Math.max(0.08, sample.radius);
      const captureRadius = radius + heavyReach;
      const withinBucket =
        local.x >= -BUCKET_LEN - 0.52 - captureRadius &&
        local.x <= 0.34 + captureRadius &&
        local.y >= -1.02 - captureRadius &&
        local.y <= 0.44 + captureRadius &&
        Math.abs(local.z) <= 0.82 + captureRadius;
      const pocketDx = local.x + 0.46;
      const pocketDy = local.y + 0.28;
      const pocketDz = local.z;
      const pocketReach = 0.56 + captureRadius;
      const nearPocket = pocketDx * pocketDx + pocketDy * pocketDy + pocketDz * pocketDz < pocketReach * pocketReach;
      const nearCuttingEdge =
        local.x >= -BUCKET_LEN - 0.78 - captureRadius &&
        local.x <= -0.02 + captureRadius &&
        local.y >= -1.08 - captureRadius &&
        local.y <= 0.46 + captureRadius &&
        Math.abs(local.z) <= 0.88 + captureRadius;
      const underLip =
        local.x >= -BUCKET_LEN - 0.28 - captureRadius &&
        local.x <= -0.22 + captureRadius &&
        local.y >= -1.18 - captureRadius &&
        local.y <= -0.02 + captureRadius &&
        Math.abs(local.z) <= 0.86 + captureRadius;
      if (!withinBucket && !nearPocket && !nearCuttingEdge && !underLip) {
        continue;
      }

      const capturedSampleLocal = new THREE.Vector3(
        clamp(local.x, -1.08, -0.1),
        clamp(local.y, -0.64, -0.02),
        clamp(local.z, -0.58, 0.58),
      );
      const desiredSampleWorld = this.excavator.bucketGroup.localToWorld(capturedSampleLocal.clone());
      const sampleOffset = sample.point.clone().sub(collider.mesh.position);
      const desiredCenterWorld = desiredSampleWorld.sub(sampleOffset);
      const carriedCenterLocal = this.excavator.bucketGroup.worldToLocal(desiredCenterWorld);
      const score = local.distanceTo(capturedSampleLocal);
      if (!best || score < best.score) {
        best = { local: carriedCenterLocal, score };
      }
    }

    return best?.local ?? null;
  }

  private canCarryWorldCollider(collider: WorldCollider): boolean {
    if (this.carriedWorldColliders.has(collider)) {
      return false;
    }
    if (collider.immovable) {
      return false;
    }
    return true;
  }

  private bucketLocalQuaternionFor(collider: WorldCollider): THREE.Quaternion {
    const bucketWorldQuaternion = this.excavator.bucketGroup.getWorldQuaternion(new THREE.Quaternion());
    return bucketWorldQuaternion.invert().multiply(collider.mesh.quaternion);
  }

  private carryWorldColliderAt(collider: WorldCollider, local: THREE.Vector3, previousWorld?: THREE.Vector3): void {
    const world = this.excavator.bucketGroup.localToWorld(local.clone());
    this.carriedWorldColliders.set(collider, local.clone());
    this.carriedWorldPreviousPositions.set(collider, previousWorld?.clone() ?? world.clone());
    this.carriedWorldLocalQuaternions.set(collider, this.bucketLocalQuaternionFor(collider));
    collider.mesh.position.copy(world);
    collider.velocity.set(0, 0, 0);
    collider.angularVelocity.set(0, 0, 0);
    collider.sleeping = false;
    this.worldColliderGridDirty = true;
  }

  private tryCarryWorldCollider(collider: WorldCollider): boolean {
    if (!this.canCarryWorldCollider(collider)) {
      return false;
    }

    const local = this.bucketCarryLocalPoint(collider);
    if (!local) {
      return false;
    }

    this.carryWorldColliderAt(collider, local);
    this.pressure = Math.max(this.pressure, clamp(0.18 + collider.mass / BUCKET_OBJECT_LOAD_REFERENCE * 0.34, 0, 0.62));
    return true;
  }

  private updateCarriedWorldObjects(dt: number): void {
    if (this.carriedWorldColliders.size === 0) {
      return;
    }

    for (const [collider, local] of Array.from(this.carriedWorldColliders)) {
      if (!this.carriedWorldColliders.has(collider)) {
        continue;
      }
      const previous = this.carriedWorldPreviousPositions.get(collider) ?? collider.mesh.position.clone();
      const next = this.excavator.bucketGroup.localToWorld(local.clone());
      collider.velocity.copy(next).sub(previous).divideScalar(Math.max(dt, 0.001));
      collider.mesh.position.copy(next);
      const localQuaternion = this.carriedWorldLocalQuaternions.get(collider);
      if (localQuaternion) {
        const bucketWorldQuaternion = this.excavator.bucketGroup.getWorldQuaternion(new THREE.Quaternion());
        collider.mesh.quaternion.copy(bucketWorldQuaternion.multiply(localQuaternion));
      } else if (!collider.capsule) {
        collider.mesh.rotation.x += collider.velocity.z * dt * 0.65;
        collider.mesh.rotation.z -= collider.velocity.x * dt * 0.65;
      }
      if (!this.resolveCarriedWorldObjectImpact(collider, dt)) {
        this.carriedWorldPreviousPositions.set(collider, next.clone());
      }
    }

    this.pressure = Math.max(
      this.pressure,
      clamp(0.1 + this.carriedWorldObjectMass() / BUCKET_OBJECT_LOAD_REFERENCE * 0.34, 0, 0.58),
    );
  }

  private resolveCarriedWorldObjectImpact(collider: WorldCollider, dt: number): boolean {
    const truckHit = this.resolveWorldColliderShapeHit(collider, (point, radius) => this.truck.resolveSolidCollision(point, radius));
    if (truckHit) {
      const normal = truckHit.normal.clone().normalize();
      let maxPenetration = truckHit.penetration;
      for (let pass = 0; pass < 4; pass += 1) {
        const passHit = this.resolveWorldColliderShapeHit(collider, (point, radius) => this.truck.resolveSolidCollision(point, radius));
        if (!passHit) {
          break;
        }
        maxPenetration = Math.max(maxPenetration, passHit.penetration);
        collider.mesh.position.addScaledVector(passHit.normal, passHit.penetration + 0.006);
      }
      const normalSpeed = collider.velocity.dot(normal);
      const tangent = collider.velocity.clone().addScaledVector(normal, -normalSpeed).multiplyScalar(0.72);
      const bounceSpeed = normalSpeed < 0 ? -normalSpeed * clamp(collider.restitution + 0.08, 0.08, 0.42) : normalSpeed;
      const truckImpulse = clamp(
        0.12 + maxPenetration * 2.2 + Math.max(0, -normalSpeed) * collider.mass * 0.045 + collider.mass * 0.015,
        0.05,
        3.2,
      );
      this.truck.applyImpact(
        truckHit.point,
        normal,
        truckImpulse,
      );
      collider.velocity.copy(tangent).addScaledVector(normal, bounceSpeed);
      this.applyWorldColliderAngularImpulse(collider, truckHit.point, normal.clone().multiplyScalar(truckImpulse * collider.mass), 0.2);
      this.releaseCarriedWorldCollider(collider);
      this.pressure = Math.max(this.pressure, clamp(0.42 + maxPenetration * 1.6 + collider.mass * 0.008, 0, 1));
      if (this.collisionCooldown <= 0 && maxPenetration > 0.018) {
        this.collisionCount += 1;
        this.collisionCooldown = 0.34;
      }
      return true;
    }

    const terrainSupport = this.worldColliderTerrainSupport(collider);
    if (terrainSupport.penetration > 0.018) {
      const normal = terrainSupport.normal.clone().normalize();
      let maxPenetration = terrainSupport.penetration;
      let contactPoint = terrainSupport.point.clone();
      for (let pass = 0; pass < 4; pass += 1) {
        const passSupport = this.worldColliderTerrainSupport(collider);
        if (passSupport.penetration <= 0.003) {
          break;
        }
        maxPenetration = Math.max(maxPenetration, passSupport.penetration);
        contactPoint = passSupport.point.clone();
        collider.mesh.position.addScaledVector(passSupport.normal, Math.min(passSupport.penetration + 0.004, 0.42));
      }

      const normalSpeed = collider.velocity.dot(normal);
      const tangent = collider.velocity.clone().addScaledVector(normal, -normalSpeed).multiplyScalar(0.58);
      const bounceSpeed =
        normalSpeed < 0
          ? -normalSpeed * clamp(collider.restitution + 0.06, 0.06, 0.34)
          : Math.max(normalSpeed, 0.02 + maxPenetration * 0.08);
      const impactSpeed = Math.max(0, -normalSpeed) + maxPenetration * 2.2;
      const footprint = this.compactWorldObjectFootprint(collider, contactPoint, impactSpeed, dt);
      collider.velocity.copy(tangent).addScaledVector(normal, bounceSpeed + clamp(maxPenetration * 0.42, 0, 0.18));
      this.applyWorldColliderAngularImpulse(
        collider,
        contactPoint,
        normal.clone().multiplyScalar(Math.max(impactSpeed, 0.08) * collider.mass),
        0.22,
      );
      this.releaseCarriedWorldCollider(collider);
      this.pressure = Math.max(
        this.pressure,
        clamp(0.34 + maxPenetration * 1.45 + impactSpeed * 0.12 + footprint.rutDrop * 2.8, 0, 1),
      );
      if (this.collisionCooldown <= 0 && maxPenetration > 0.018) {
        this.collisionCount += 1;
        this.collisionCooldown = 0.34;
      }
      return true;
    }

    let excavatorHit = this.resolveCarriedWorldObjectExcavatorHit(collider);
    if (excavatorHit) {
      const responseNormal = excavatorHit.normal.clone().normalize();
      let maxPenetration = excavatorHit.penetration;
      for (let pass = 0; pass < 4 && excavatorHit; pass += 1) {
        const normal = excavatorHit.normal.clone().normalize();
        maxPenetration = Math.max(maxPenetration, excavatorHit.penetration);
        collider.mesh.position.addScaledVector(normal, Math.min(excavatorHit.penetration + 0.005, 0.44));
        excavatorHit = this.resolveCarriedWorldObjectExcavatorHit(collider);
        if (!excavatorHit || excavatorHit.penetration < 0.01) {
          break;
        }
      }

      const normalSpeed = collider.velocity.dot(responseNormal);
      const tangent = collider.velocity.clone().addScaledVector(responseNormal, -normalSpeed);
      const bounceSpeed =
        normalSpeed < 0
          ? -normalSpeed * clamp(collider.restitution + 0.08, 0.08, 0.42)
          : Math.max(normalSpeed, 0.02 + maxPenetration * 0.08);
      const impactSpeed = Math.max(0, -normalSpeed) + maxPenetration * 2.0;
      collider.velocity.copy(tangent.multiplyScalar(0.62)).addScaledVector(responseNormal, bounceSpeed + clamp(maxPenetration * 0.32, 0, 0.16));
      this.applyWorldColliderAngularImpulse(
        collider,
        collider.mesh.position.clone().addScaledVector(responseNormal, collider.radius),
        responseNormal.clone().multiplyScalar(Math.max(impactSpeed, 0.08) * collider.mass),
        0.24,
      );
      this.releaseCarriedWorldCollider(collider);
      this.pressure = Math.max(this.pressure, clamp(0.36 + maxPenetration * 1.4 + impactSpeed * 0.1 + collider.mass * 0.006, 0, 1));
      if (this.collisionCooldown <= 0 && maxPenetration > 0.018) {
        this.collisionCount += 1;
        this.collisionCooldown = 0.34;
      }
      return true;
    }

    let checkedLooseObjects = 0;
    for (const other of this.nearbyWorldColliders(collider.mesh.position, collider.radius + 0.68)) {
      if (other === collider || this.carriedWorldColliders.has(other)) {
        continue;
      }
      checkedLooseObjects += 1;
      if (checkedLooseObjects > 18) {
        break;
      }

      const hit = this.resolveWorldColliderPairHit(collider, other);
      if (!hit) {
        continue;
      }

      const normal = hit.normal;
      const penetration = hit.penetration;
      const invMassA = 0;
      const invMassB = other.immovable ? 0 : 1 / Math.max(other.mass, 0.05);
      const totalInvMass = invMassA + invMassB;
      if (totalInvMass <= 0) {
        this.releaseCarriedWorldCollider(collider);
        return true;
      }

      const correction = Math.min(penetration * 0.86, 0.32);
      collider.mesh.position.addScaledVector(normal, correction * (invMassA / totalInvMass));
      other.mesh.position.addScaledVector(normal, -correction * (invMassB / totalInvMass));

      const relativeVelocity = collider.velocity.clone().sub(other.velocity);
      const closingSpeed = relativeVelocity.dot(normal);
      if (closingSpeed < 0) {
        const restitution = Math.min(collider.restitution, other.restitution);
        const impulse = (-(1 + restitution) * closingSpeed) / totalInvMass;
        collider.velocity.addScaledVector(normal, impulse * invMassA);
        other.velocity.addScaledVector(normal, -impulse * invMassB);
        this.applyWorldColliderAngularImpulse(other, hit.pointB, normal.clone().multiplyScalar(-impulse), 0.28);
      }

      const tangent = relativeVelocity.addScaledVector(normal, -closingSpeed);
      if (tangent.lengthSq() > 0.000001) {
        tangent.normalize().multiplyScalar(clamp((collider.friction + other.friction) * 0.06, 0.035, 0.14));
        collider.velocity.addScaledVector(tangent, -invMassA / totalInvMass);
        other.velocity.addScaledVector(tangent, invMassB / totalInvMass);
        this.applyWorldColliderAngularImpulse(other, hit.pointB, tangent.clone().multiplyScalar(invMassB / totalInvMass), 0.2);
      }

      other.sleeping = false;
      this.worldColliderGridDirty = true;
      this.pressure = Math.max(this.pressure, clamp(0.22 + penetration * 1.35 + Math.min(collider.mass, other.mass) * 0.006, 0, 0.72));
      if (this.collisionCooldown <= 0 && penetration > 0.018) {
        this.collisionCount += 1;
        this.collisionCooldown = 0.34;
      }
      return false;
    }

    return false;
  }

  private releaseCarriedWorldCollider(collider: WorldCollider, extraVelocity?: THREE.Vector3): void {
    const carriedVelocity = collider.velocity.clone();
    this.carriedWorldColliders.delete(collider);
    this.carriedWorldPreviousPositions.delete(collider);
    this.carriedWorldLocalQuaternions.delete(collider);
    collider.velocity.copy(carriedVelocity);
    if (extraVelocity) {
      collider.velocity.add(extraVelocity);
    }
    collider.sleeping = false;
    this.worldColliderGridDirty = true;
  }

  private releaseCarriedWorldObjects(extraVelocity?: THREE.Vector3): void {
    for (const collider of Array.from(this.carriedWorldColliders.keys())) {
      this.releaseCarriedWorldCollider(collider, extraVelocity);
    }
  }

  private updateLooseWorldObjects(dt: number): void {
    this.flushWorldColliderGridRefresh();
    const bucket = this.excavator.bucketPocketWorld();
    const machine = this.excavator.group.position;
    let activeObjectMoved = false;
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
      const angularSpeedSq = collider.angularVelocity.lengthSq();
      collider.groundLoadCooldown = Math.max(0, collider.groundLoadCooldown - dt);
      const bucketWakeRadius = collider.radius + 1.28;
      const nearActiveBucket = dxBucket * dxBucket + dyBucket * dyBucket + dzBucket * dzBucket < bucketWakeRadius * bucketWakeRadius;
      const crawlerWakeRadius = 3.6 + collider.radius;
      const nearCrawlerBody = dxMachine * dxMachine + dzMachine * dzMachine < crawlerWakeRadius * crawlerWakeRadius;
      if (collider.sleeping && speedSq < 0.0004 && angularSpeedSq < 0.0004 && !nearActiveBucket && !nearCrawlerBody) {
        continue;
      }
      collider.sleeping = false;

      const slopeSupport = this.worldColliderTerrainSupport(collider);
      const slopeAccel = clamp(slopeSupport.slope, 0, 0.9) * 3.4;
      if (slopeAccel > 0.02) {
        collider.velocity.x += -slopeSupport.slopeX * slopeAccel * dt;
        collider.velocity.z += -slopeSupport.slopeZ * slopeAccel * dt;
      }

      collider.velocity.y -= 9.81 * dt;
      const airDrag = 1 - Math.min(dt * 0.18, 0.05);
      collider.velocity.multiplyScalar(airDrag);
      const previousX = pos.x;
      const previousY = pos.y;
      const previousZ = pos.z;
      pos.addScaledVector(collider.velocity, dt);

      const groundSupport = this.worldColliderTerrainSupport(collider);
      if (groundSupport.penetration > 0) {
        const normalSpeed = collider.velocity.dot(groundSupport.normal);
        const contactLoad = Math.max(0, -normalSpeed) + clamp(groundSupport.penetration * 1.25, 0, 0.5);
        const shouldCompactFootprint =
          collider.groundLoadCooldown <= 0 &&
          collider.mass >= 1.8 &&
          (contactLoad > 0.12 || groundSupport.penetration > 0.032);
        const footprint = shouldCompactFootprint
          ? this.compactWorldObjectFootprint(collider, groundSupport.point, contactLoad, dt)
          : { compacted: 0, rutDrop: 0, bermRise: 0 };
        if (footprint.compacted > 0) {
          collider.groundLoadCooldown = 0.42;
        }
        const resolvedPenetration = Math.max(0, groundSupport.penetration - footprint.rutDrop * 0.72);
        pos.addScaledVector(groundSupport.normal, Math.min(resolvedPenetration + 0.0015, 0.34));
        if (footprint.compacted > 0) {
          activeObjectMoved = true;
          this.pressure = Math.max(this.pressure, clamp(0.08 + footprint.rutDrop * 3.8 + footprint.bermRise * 1.6, 0, 0.64));
        }
        const tangent = collider.velocity.clone().addScaledVector(groundSupport.normal, -normalSpeed);
        const groundFriction = 1 - Math.min(dt * (1.2 + collider.friction * 3.4), 0.32);
        if (normalSpeed < -0.05) {
          collider.velocity.copy(tangent.multiplyScalar(groundFriction)).addScaledVector(groundSupport.normal, -normalSpeed * collider.restitution);
          this.applyWorldColliderAngularImpulse(
            collider,
            groundSupport.point,
            groundSupport.normal.clone().multiplyScalar(Math.max(0, -normalSpeed) * collider.mass * (1 + collider.restitution)),
            0.16,
          );
        } else {
          collider.velocity.copy(tangent.multiplyScalar(groundFriction));
        }
        this.applyWorldColliderRollingSpin(collider, groundSupport.normal, dt);
      }

      if (this.resolveLooseObjectTruckCollision(collider)) {
        activeObjectMoved = true;
      }
      if (nearCrawlerBody && this.resolveLooseObjectExcavatorCollision(collider)) {
        activeObjectMoved = true;
      }
      if (this.resolveLooseObjectBucketLoadCollision(collider)) {
        activeObjectMoved = true;
      }

      const horizontalSpeed = Math.hypot(collider.velocity.x, collider.velocity.z);
      this.integrateWorldColliderAngularMotion(collider, dt);
      const settledSupport = this.worldColliderTerrainSupport(collider);
      if (
        settledSupport.penetration < 0.004 &&
        settledSupport.unsupportedDrop < 0.002 &&
        horizontalSpeed < 0.008 &&
        Math.abs(collider.velocity.y) < 0.008 &&
        collider.angularVelocity.lengthSq() < 0.00008
      ) {
        collider.velocity.set(0, 0, 0);
        collider.angularVelocity.set(0, 0, 0);
        collider.sleeping = true;
      }
      if (Math.abs(pos.x - previousX) + Math.abs(pos.y - previousY) + Math.abs(pos.z - previousZ) > 0.00001) {
        activeObjectMoved = true;
      }
    }
    if (activeObjectMoved) {
      this.worldColliderGridDirty = true;
      this.resolveLooseObjectPairCollisions();
    }
  }

  private resolveLooseObjectBucketLoadCollision(collider: WorldCollider): boolean {
    const hit = this.resolveWorldColliderShapeHit(collider, (point, radius) => this.excavator.resolveBucketLoadCollision(point, radius));
    if (!hit) {
      return false;
    }

    const normal = hit.normal.clone().normalize();
    collider.mesh.position.addScaledVector(normal, Math.min(hit.penetration + 0.003, 0.28));
    const normalSpeed = collider.velocity.dot(normal);
    const tangent = collider.velocity.clone().addScaledVector(normal, -normalSpeed);
    const bounceSpeed = normalSpeed < 0 ? -normalSpeed * clamp(collider.restitution + 0.02, 0.04, 0.24) : normalSpeed;
    collider.velocity.copy(tangent.multiplyScalar(0.72)).addScaledVector(normal, bounceSpeed);
    this.applyWorldColliderAngularImpulse(
      collider,
      hit.point,
      normal.clone().multiplyScalar((Math.max(0, -normalSpeed) + hit.penetration * 1.6) * collider.mass),
      0.18,
    );
    collider.sleeping = false;
    this.worldColliderGridDirty = true;
    this.pressure = Math.max(this.pressure, clamp(0.18 + hit.penetration * 0.9 + collider.mass * 0.006, 0, 0.62));
    return true;
  }

  private resolveLooseObjectTruckCollision(collider: WorldCollider): boolean {
    const hit = this.resolveWorldColliderShapeHit(collider, (point, radius) => this.truck.resolveSolidCollision(point, radius));
    if (!hit) {
      return false;
    }

    const normal = hit.normal.clone().normalize();
    collider.mesh.position.addScaledVector(normal, Math.min(hit.penetration + 0.004, 0.5));
    this.worldColliderGridDirty = true;

    const normalSpeed = collider.velocity.dot(normal);
    const tangent = collider.velocity.clone().addScaledVector(normal, -normalSpeed);
    const tangentDamping = 1 - clamp(0.12 + collider.friction * 0.24, 0.12, 0.42);
    const bounceSpeed = normalSpeed < 0 ? -normalSpeed * clamp(collider.restitution, 0.04, 0.38) : normalSpeed;
    this.truck.applyImpact(
      hit.point,
      normal,
      clamp(0.08 + hit.penetration * 2.0 + Math.max(0, -normalSpeed) * collider.mass * 0.04 + collider.mass * 0.012, 0.035, 2.8),
    );
    collider.velocity.copy(tangent.multiplyScalar(tangentDamping)).addScaledVector(normal, bounceSpeed);
    this.applyWorldColliderAngularImpulse(
      collider,
      hit.point,
      normal.clone().multiplyScalar((Math.max(0, -normalSpeed) + hit.penetration * 1.8) * collider.mass),
      0.2,
    );
    collider.sleeping = false;
    this.pressure = Math.max(this.pressure, clamp(0.34 + hit.penetration * 1.8 + collider.mass * 0.008, 0, 0.9));
    if (this.collisionCooldown <= 0 && hit.penetration > 0.025) {
      this.collisionCount += 1;
      this.collisionCooldown = 0.34;
    }
    return true;
  }

  private resolveLooseObjectExcavatorHit(collider: WorldCollider): { normal: THREE.Vector3; penetration: number } | null {
    return this.resolveWorldColliderShapeHit(collider, (point, radius) => this.resolveExcavatorSolidHit(point, radius));
  }

  private resolveCarriedWorldObjectExcavatorHit(collider: WorldCollider): { normal: THREE.Vector3; penetration: number } | null {
    return this.resolveWorldColliderShapeHit(collider, (point, radius) => this.resolveExcavatorSolidHit(point, radius, true));
  }

  private resolveExcavatorSolidHit(pos: THREE.Vector3, radius: number, excludeBucketSamples = false): { normal: THREE.Vector3; penetration: number } | null {
    const base = this.excavator.group.position;
    const broadphaseRadius = 8.8 + radius;
    const broadphaseDx = pos.x - base.x;
    const broadphaseDz = pos.z - base.z;
    if (broadphaseDx * broadphaseDx + broadphaseDz * broadphaseDz > broadphaseRadius * broadphaseRadius) {
      return null;
    }

    const yaw = this.excavator.group.rotation.y;
    const forward = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw).normalize();
    const side = new THREE.Vector3(-forward.z, 0, forward.x).normalize();
    let best: { normal: THREE.Vector3; penetration: number } | null = null;

    const considerHorizontal = (point: THREE.Vector3, sampleRadius: number): void => {
      if (Math.abs(pos.y - point.y) > radius + 0.72) {
        return;
      }
      const dx = pos.x - point.x;
      const dz = pos.z - point.z;
      const combined = sampleRadius + radius;
      const distanceSq = dx * dx + dz * dz;
      if (distanceSq >= combined * combined) {
        return;
      }
      const distance = Math.sqrt(Math.max(distanceSq, 0.000001));
      const normal = distanceSq < 0.000001 ? forward.clone() : new THREE.Vector3(dx / distance, 0, dz / distance);
      const penetration = combined - distance;
      if (!best || penetration > best.penetration) {
        best = { normal, penetration };
      }
    };

    const considerSphere = (point: THREE.Vector3, sampleRadius: number): void => {
      const delta = pos.clone().sub(point);
      const combined = sampleRadius + radius;
      const distanceSq = delta.lengthSq();
      if (distanceSq >= combined * combined) {
        return;
      }
      const distance = Math.sqrt(Math.max(distanceSq, 0.000001));
      const normal = distanceSq < 0.000001 ? new THREE.Vector3(1, 0, 0) : delta.divideScalar(distance);
      const penetration = combined - distance;
      if (!best || penetration > best.penetration) {
        best = { normal, penetration };
      }
    };

    const considerVerticalCylinder = (center: THREE.Vector3, cylinderRadius: number, halfHeight: number): void => {
      const dx = pos.x - center.x;
      const dy = pos.y - center.y;
      const dz = pos.z - center.z;
      const radialSq = dx * dx + dz * dz;
      const radial = Math.sqrt(radialSq);
      const vertical = Math.abs(dy);
      const horizontalGap = Math.max(0, radial - cylinderRadius);
      const verticalGap = Math.max(0, vertical - halfHeight);

      if (horizontalGap > 0 || verticalGap > 0) {
        const distanceSq = horizontalGap * horizontalGap + verticalGap * verticalGap;
        if (distanceSq >= radius * radius) {
          return;
        }
        const distance = Math.sqrt(Math.max(distanceSq, 0.000001));
        const radialX = radial > 0.000001 ? dx / radial : forward.x;
        const radialZ = radial > 0.000001 ? dz / radial : forward.z;
        const normal = new THREE.Vector3(
          (radialX * horizontalGap) / distance,
          (Math.sign(dy) || 1) * (verticalGap / distance),
          (radialZ * horizontalGap) / distance,
        ).normalize();
        const penetration = radius - distance;
        if (!best || penetration > best.penetration) {
          best = { normal, penetration };
        }
        return;
      }

      const radialClearance = cylinderRadius - radial;
      const verticalClearance = halfHeight - vertical;
      const useSide = radialClearance <= verticalClearance;
      const normal = useSide
        ? new THREE.Vector3(radial > 0.000001 ? dx / radial : forward.x, 0, radial > 0.000001 ? dz / radial : forward.z)
        : new THREE.Vector3(0, Math.sign(dy) || 1, 0);
      const penetration = radius + (useSide ? radialClearance : verticalClearance);
      if (!best || penetration > best.penetration) {
        best = { normal, penetration };
      }
    };

    for (const sample of [
      { x: TRACK_LENGTH * 0.46, z: -TRACK_GAUGE * 0.5, radius: TRACK_WIDTH * 0.66 },
      { x: TRACK_LENGTH * 0.46, z: TRACK_GAUGE * 0.5, radius: TRACK_WIDTH * 0.66 },
      { x: 0, z: -TRACK_GAUGE * 0.5, radius: TRACK_WIDTH * 0.72 },
      { x: 0, z: TRACK_GAUGE * 0.5, radius: TRACK_WIDTH * 0.72 },
      { x: -TRACK_LENGTH * 0.46, z: -TRACK_GAUGE * 0.5, radius: TRACK_WIDTH * 0.66 },
      { x: -TRACK_LENGTH * 0.46, z: TRACK_GAUGE * 0.5, radius: TRACK_WIDTH * 0.66 },
    ] as const) {
      const point = base.clone().addScaledVector(forward, sample.x).addScaledVector(side, sample.z);
      point.y = base.y + 0.34;
      considerHorizontal(point, sample.radius);
    }

    const turntable = this.excavator.turntableCollisionShape();
    considerVerticalCylinder(turntable.center, turntable.radius, turntable.halfHeight);

    const armSamples = excludeBucketSamples
      ? this.excavator.armCollisionSamples().filter((sample) => sample.action !== "bucket")
      : this.excavator.armCollisionSamples();
    for (const sample of [...this.excavator.upperCollisionSamples(), ...armSamples]) {
      considerSphere(sample.point, sample.radius);
    }

    return best;
  }

  private resolveLooseObjectExcavatorCollision(collider: WorldCollider): boolean {
    let hit = this.resolveLooseObjectExcavatorHit(collider);
    if (!hit) {
      return false;
    }

    const responseNormal = hit.normal.clone().normalize();
    let maxPenetration = hit.penetration;
    for (let i = 0; i < 3 && hit; i += 1) {
      const normal = hit.normal.clone().normalize();
      maxPenetration = Math.max(maxPenetration, hit.penetration);
      collider.mesh.position.addScaledVector(normal, Math.min(hit.penetration + 0.004, 0.42));
      hit = this.resolveLooseObjectExcavatorHit(collider);
      if (!hit || hit.penetration < 0.012) {
        break;
      }
    }

    const normalSpeed = collider.velocity.dot(responseNormal);
    const tangent = collider.velocity.clone().addScaledVector(responseNormal, -normalSpeed);
    const tangentDamping = 1 - clamp(0.08 + collider.friction * 0.2, 0.08, 0.34);
    const bounceSpeed = normalSpeed < 0 ? -normalSpeed * clamp(collider.restitution + 0.04, 0.06, 0.42) : Math.max(normalSpeed, 0);
    collider.velocity.copy(tangent.multiplyScalar(tangentDamping)).addScaledVector(responseNormal, bounceSpeed);
    this.applyWorldColliderAngularImpulse(
      collider,
      collider.mesh.position.clone().addScaledVector(responseNormal, collider.radius),
      responseNormal.clone().multiplyScalar((Math.max(0, -normalSpeed) + maxPenetration * 1.6) * collider.mass),
      0.22,
    );
    collider.sleeping = false;
    this.worldColliderGridDirty = true;

    this.pressure = Math.max(this.pressure, clamp(0.22 + maxPenetration * 1.45 + collider.mass * 0.006, 0, 0.82));
    if (this.collisionCooldown <= 0 && maxPenetration > 0.02) {
      this.collisionCount += 1;
      this.collisionCooldown = 0.34;
    }
    return true;
  }

  private resolveSoilExcavatorCollision(pos: THREE.Vector3, velocity: THREE.Vector3, radius: number, mass: number, fineGrain = false): boolean {
    let hit = this.resolveExcavatorSolidHit(pos, radius);
    if (!hit) {
      return false;
    }

    const responseNormal = hit.normal.clone().normalize();
    let maxPenetration = hit.penetration;
    const maxCorrection = fineGrain ? 0.09 : 0.18;
    const skin = fineGrain ? 0.0015 : 0.003;
    for (let i = 0; i < 2 && hit; i += 1) {
      const normal = hit.normal.clone().normalize();
      maxPenetration = Math.max(maxPenetration, hit.penetration);
      pos.addScaledVector(normal, Math.min(hit.penetration + skin, maxCorrection));
      hit = this.resolveExcavatorSolidHit(pos, radius);
      if (!hit || hit.penetration < (fineGrain ? 0.004 : 0.01)) {
        break;
      }
    }

    const normalSpeed = velocity.dot(responseNormal);
    const tangent = velocity.clone().addScaledVector(responseNormal, -normalSpeed);
    const tangentDamping = fineGrain ? 0.56 : 0.66;
    const bounceSpeed = normalSpeed < 0 ? -normalSpeed * (fineGrain ? 0.08 : 0.12) : Math.max(normalSpeed, 0);
    velocity.copy(tangent.multiplyScalar(tangentDamping)).addScaledVector(responseNormal, bounceSpeed);
    this.pressure = Math.max(this.pressure, clamp(0.05 + maxPenetration * (fineGrain ? 0.42 : 0.78) + mass * 0.04, 0, fineGrain ? 0.22 : 0.36));
    return true;
  }

  private resolveLooseObjectPairCollisions(): void {
    const activeColliders = this.worldColliders
      .filter((collider) => !collider.sleeping && !this.carriedWorldColliders.has(collider))
      .slice(0, WORLD_COLLIDER_PAIR_ACTIVE_LIMIT);
    let moved = false;

    for (const a of activeColliders) {
      const candidates = this.nearbyWorldColliders(a.mesh.position, a.radius + 0.55);
      for (const b of candidates) {
        if (b === a || this.carriedWorldColliders.has(b) || (!b.sleeping && b.id <= a.id)) {
          continue;
        }

        const hit = this.resolveWorldColliderPairHit(a, b);
        if (!hit) {
          continue;
        }

        const normal = hit.normal;
        const penetration = hit.penetration;
        const invMassA = a.immovable ? 0 : 1 / Math.max(a.mass, 0.05);
        const invMassB = b.immovable ? 0 : 1 / Math.max(b.mass, 0.05);
        const totalInvMass = invMassA + invMassB;
        if (totalInvMass <= 0) {
          continue;
        }

        const correction = Math.min(penetration * 0.82, 0.28);
        a.mesh.position.addScaledVector(normal, correction * (invMassA / totalInvMass));
        b.mesh.position.addScaledVector(normal, -correction * (invMassB / totalInvMass));
        moved = true;

        const relVelocity = a.velocity.clone().sub(b.velocity);
        const closingSpeed = relVelocity.dot(normal);
        if (closingSpeed < 0) {
          const restitution = Math.min(a.restitution, b.restitution);
          const impulse = (-(1 + restitution) * closingSpeed) / totalInvMass;
          a.velocity.addScaledVector(normal, impulse * invMassA);
          b.velocity.addScaledVector(normal, -impulse * invMassB);
          this.applyWorldColliderAngularImpulse(a, hit.pointA, normal.clone().multiplyScalar(impulse), 0.32);
          this.applyWorldColliderAngularImpulse(b, hit.pointB, normal.clone().multiplyScalar(-impulse), 0.32);
        }

        const tangent = relVelocity.addScaledVector(normal, -closingSpeed);
        const tangentLenSq = tangent.lengthSq();
        if (tangentLenSq > 0.000001) {
          const friction = clamp((a.friction + b.friction) * 0.08, 0.04, 0.18);
          tangent.normalize().multiplyScalar(friction);
          a.velocity.addScaledVector(tangent, -invMassA / totalInvMass);
          b.velocity.addScaledVector(tangent, invMassB / totalInvMass);
          this.applyWorldColliderAngularImpulse(a, hit.pointA, tangent.clone().multiplyScalar(-invMassA / totalInvMass), 0.24);
          this.applyWorldColliderAngularImpulse(b, hit.pointB, tangent.clone().multiplyScalar(invMassB / totalInvMass), 0.24);
        }

        const spinAxis = new THREE.Vector3(-normal.z, 0, normal.x);
        if (spinAxis.lengthSq() > 0.000001) {
          spinAxis.normalize();
          const spinAmount = clamp(penetration * 0.55 + Math.max(0, -closingSpeed) * 0.08, 0.012, 0.22);
          if (!a.immovable) {
            a.angularVelocity.addScaledVector(spinAxis, spinAmount / Math.max(0.45, Math.sqrt(a.mass)));
            this.clampWorldColliderAngularVelocity(a);
          }
          if (!b.immovable) {
            b.angularVelocity.addScaledVector(spinAxis, -spinAmount / Math.max(0.45, Math.sqrt(b.mass)));
            this.clampWorldColliderAngularVelocity(b);
          }
        }

        a.sleeping = false;
        b.sleeping = false;
        this.pressure = Math.max(this.pressure, clamp(0.16 + penetration * 1.2, 0, 0.58));
      }
    }
    if (moved) {
      this.worldColliderGridDirty = true;
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
    const bucketPocket = this.excavator.bucketPocketWorld();
    const payloadMass = this.bucketLoad * 0.55 + this.bucketTransitLoad * 0.45 + this.carriedWorldObjectMass();
    const reach = bucketPocket.clone().sub(base);
    const forwardReach = reach.dot(forward);
    const sideReach = reach.dot(side);
    const normalizedPayload = clamp(payloadMass / 12, 0, 2.2);
    const pitchMoment = clamp((forwardReach / Math.max(TRACK_LENGTH, 0.001)) * normalizedPayload, -0.9, 0.9);
    const rollMoment = clamp((sideReach / Math.max(TRACK_GAUGE, 0.001)) * normalizedPayload, -1.0, 1.0);
    const loadFactor = clamp(this.bucketLoad / BUCKET_CAPACITY + this.bucketTransitLoad / BUCKET_CAPACITY * 0.6 + this.carriedWorldObjectMass() / 18, 0, 2.4);
    const targetSinkage = clamp(
      0.012 + disturbedDepth * 0.13 + contactSpan * 0.035 + loadFactor * 0.026 + Math.abs(pitchMoment) * 0.026 + Math.abs(rollMoment) * 0.018,
      0.012,
      0.28,
    );
    const targetRoll = clamp(Math.atan2(left.supportHeight - right.supportHeight, TRACK_GAUGE) - rollMoment * 0.11, -0.28, 0.28);
    const targetPitch = clamp(Math.atan2(frontHeight - rearHeight, TRACK_LENGTH * 0.84) - pitchMoment * 0.12, -0.24, 0.24);

    this.supportHeight = smoothTo(this.supportHeight, rawSupportHeight, 8.5, dt);
    this.chassisSinkage = smoothTo(this.chassisSinkage, targetSinkage, 3.2, dt);
    this.chassisRoll = smoothTo(this.chassisRoll, targetRoll, 4.8, dt);
    this.chassisPitch = smoothTo(this.chassisPitch, targetPitch, 4.8, dt);
    if (loadFactor > 0.05 || Math.abs(pitchMoment) > 0.03 || Math.abs(rollMoment) > 0.03) {
      this.pressure = Math.max(this.pressure, clamp(0.08 + loadFactor * 0.16 + Math.abs(pitchMoment) * 0.2 + Math.abs(rollMoment) * 0.16, 0, 0.72));
    }
    this.excavator.group.position.y = smoothTo(this.excavator.group.position.y, this.supportHeight - this.chassisSinkage, 8.5, dt);
    this.excavator.group.rotation.x = this.chassisRoll;
    this.excavator.group.rotation.z = this.chassisPitch;
  }

  private updateTrackSoilInteraction(dt: number, forward: THREE.Vector3): void {
    const base = this.excavator.group.position;
    const side = new THREE.Vector3(-forward.z, 0, forward.x).normalize();
    this.trackTraction = this.computeTrackTraction(forward);
    for (const [offset, velocity, contactSlip] of [
      [-0.72, this.leftTrackVelocity, this.trackTraction.leftSlip],
      [0.72, this.rightTrackVelocity, this.trackTraction.rightSlip],
    ] as const) {
      const trackMotion = Math.abs(velocity);
      if (trackMotion < 0.035) {
        continue;
      }
      const center = base.clone().addScaledVector(side, offset);
      center.y = this.terrain.getHeightAt(center.x, center.z);
      const steeringSlip = Math.abs(this.leftTrackVelocity - this.rightTrackVelocity) / Math.max(TRACK_MAX_SPEED * 2, 0.001);
      const slip = clamp(steeringSlip + contactSlip, 0, 1);
      const soilResistance = this.terrain.getSubsoilResistanceAt(center.x, center.z);
      const surface = this.terrain.getSurfaceConditionAt(center.x, center.z);
      const support = this.terrain.sampleTrackSupport(center, forward, side, TRACK_LENGTH, TRACK_WIDTH);
      const roughness = clamp((support.highHeight - support.lowHeight) * 0.9 + support.disturbedDepth * 0.24, 0, 0.72);
      const materialSink = clamp(surface.trackSinkMultiplier * (1 + surface.wetness * 0.45 - surface.hardpack * 0.32), 0.35, 2.35);
      const depth = clamp(
        (0.006 + trackMotion * dt * 0.055) *
          (1 + slip * 1.45 + roughness * 0.85) *
          materialSink,
        0.002,
        0.052,
      );
      const result = this.compactTrackStripWithWake(center, forward, side, TRACK_LENGTH, TRACK_WIDTH, depth);
      this.trackSoilWork += result.compacted;
      if (result.compacted > 0 && surface.wetness > 0.45) {
        const wetRutVolume = this.terrain.lowerAt(
          center,
          TRACK_WIDTH * 0.55,
          depth * clamp((surface.wetness - surface.hardpack * 0.35) * 0.72, 0, 0.72),
        );
        if (wetRutVolume > 0) {
          this.trackSoilWork += wetRutVolume;
          this.wakeWorldCollidersNear(center, TRACK_WIDTH + 0.7);
        }
      }
      if (result.compacted > 0) {
        this.pressure = Math.max(
          this.pressure,
          clamp(0.08 + result.rutDrop * 4.8 + slip * 0.18 + soilResistance * 0.12 + surface.wetness * 0.12, 0, 0.88),
        );
      }
    }
  }

  private sweptSampleStepCount(previousPoint: THREE.Vector3, currentPoint: THREE.Vector3, radius: number): number {
    const travel = previousPoint.distanceTo(currentPoint);
    return clamp(Math.ceil(travel / Math.max(radius * 0.7, 0.09)), 1, 6);
  }

  private resolveSweptTruckSampleHit(
    previousPoint: THREE.Vector3,
    currentPoint: THREE.Vector3,
    radius: number,
  ): { normal: THREE.Vector3; penetration: number; point: THREE.Vector3; motion: THREE.Vector3; sweptSteps: number; sweptT: number } | null {
    const motion = currentPoint.clone().sub(previousPoint);
    const steps = this.sweptSampleStepCount(previousPoint, currentPoint, radius);
    let best: { normal: THREE.Vector3; penetration: number; point: THREE.Vector3; motion: THREE.Vector3; sweptSteps: number; sweptT: number } | null = null;

    for (let step = 1; step <= steps; step += 1) {
      const t = step / steps;
      const point = previousPoint.clone().lerp(currentPoint, t);
      const hit = this.truck.resolveSolidCollision(point, radius);
      if (!hit) {
        continue;
      }
      if (!best || hit.penetration > best.penetration) {
        best = {
          normal: hit.normal.clone().normalize(),
          penetration: hit.penetration,
          point,
          motion,
          sweptSteps: steps,
          sweptT: t,
        };
      }
    }
    return best;
  }

  private resolveSweptWorldColliderSampleHit(
    collider: WorldCollider,
    previousPoint: THREE.Vector3,
    currentPoint: THREE.Vector3,
    radius: number,
  ): { normal: THREE.Vector3; penetration: number; point: THREE.Vector3; motion: THREE.Vector3; sweptSteps: number; sweptT: number } | null {
    const motion = currentPoint.clone().sub(previousPoint);
    const steps = this.sweptSampleStepCount(previousPoint, currentPoint, radius);
    let best: { normal: THREE.Vector3; penetration: number; point: THREE.Vector3; motion: THREE.Vector3; sweptSteps: number; sweptT: number } | null = null;

    for (let step = 1; step <= steps; step += 1) {
      const t = step / steps;
      const point = previousPoint.clone().lerp(currentPoint, t);
      const hit = this.resolveWorldColliderSampleHit(collider, point, radius);
      if (!hit) {
        continue;
      }
      if (!best || hit.penetration > best.penetration) {
        best = {
          normal: hit.normal.clone().normalize(),
          penetration: hit.penetration,
          point,
          motion,
          sweptSteps: steps,
          sweptT: t,
        };
      }
    }
    return best;
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

  private resolveUpperTruckCollisions(previousAngles: ExcavatorAngles): {
    collided: boolean;
    blocked: boolean;
    penetration: number;
    impactImpulse: number;
  } {
    if (Math.abs(this.velocities.swing) + Math.abs(this.leftTrackVelocity) + Math.abs(this.rightTrackVelocity) < 0.01) {
      return { collided: false, blocked: false, penetration: 0, impactImpulse: 0 };
    }

    const currentAngles = { ...this.angles };
    const currentSamples = this.excavator.upperCollisionSamples();
    this.excavator.applyAngles(previousAngles);
    const previousSamples = this.excavator.upperCollisionSamples();
    this.excavator.applyAngles(currentAngles);

    let maxPenetration = 0;
    let maxSeverity = 0;
    let impactImpulse = 0;
    let collided = false;

    for (let i = 0; i < currentSamples.length; i += 1) {
      const sample = currentSamples[i];
      const previous = previousSamples[i] ?? sample;
      const hit = this.resolveSweptTruckSampleHit(previous.point, sample.point, sample.radius);
      if (!hit) {
        continue;
      }

      const approach = Math.max(0, -hit.motion.dot(hit.normal));
      const severity = clamp(hit.penetration * 2.55 + approach * 7.2 + Math.abs(this.velocities.swing) * 0.08, 0, 1);
      const impulse = clamp(0.08 + hit.penetration * 2.4 + approach * 4.8 + sample.radius * 0.18, 0.04, 1.8);
      this.truck.applyImpact(hit.point, hit.normal, impulse);
      maxPenetration = Math.max(maxPenetration, hit.penetration);
      maxSeverity = Math.max(maxSeverity, severity);
      impactImpulse += impulse;
      collided = true;
    }

    if (!collided) {
      return { collided: false, blocked: false, penetration: 0, impactImpulse: 0 };
    }

    let blocked = false;
    if (Math.abs(this.angles.swing - previousAngles.swing) > 0.00001) {
      this.angles.swing = previousAngles.swing;
      this.velocities.swing = 0;
      this.excavator.applyAngles(this.angles);
      blocked = true;
    }

    this.pressure = Math.max(this.pressure, clamp(0.34 + maxSeverity * 0.58, 0, 1));
    if (this.collisionCooldown <= 0 && (blocked || maxPenetration > 0.022)) {
      this.collisionCount += 1;
      this.collisionCooldown = 0.34;
    }

    return { collided, blocked, penetration: maxPenetration, impactImpulse };
  }

  private resolveUpperWorldObjectCollisions(previousAngles: ExcavatorAngles): {
    collided: boolean;
    movableHit: boolean;
    blocked: boolean;
    penetration: number;
    movedMass: number;
    objectImpulse: number;
  } {
    if (Math.abs(this.velocities.swing) + Math.abs(this.leftTrackVelocity) + Math.abs(this.rightTrackVelocity) < 0.01) {
      return { collided: false, movableHit: false, blocked: false, penetration: 0, movedMass: 0, objectImpulse: 0 };
    }

    const currentAngles = { ...this.angles };
    const currentSamples = this.excavator.upperCollisionSamples();
    this.excavator.applyAngles(previousAngles);
    const previousSamples = this.excavator.upperCollisionSamples();
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

    const broadphaseCenter = new THREE.Vector3((minX + maxX) * 0.5, 0, (minZ + maxZ) * 0.5);
    const broadphaseRadius = Math.hypot(maxX - minX, maxZ - minZ) * 0.5 + ARM_WORLD_BROADPHASE_PADDING;
    let maxPenetration = 0;
    let maxSeverity = 0;
    let movableHit = false;
    let immovableHit = false;
    let movedMass = 0;
    let objectImpulse = 0;
    const moved = new Set<WorldCollider>();

    for (const collider of this.nearbyWorldColliders(broadphaseCenter, broadphaseRadius)) {
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
        const hit = this.resolveSweptWorldColliderSampleHit(collider, previous.point, sample.point, sample.radius);
        if (!hit) {
          continue;
        }

        const normal = hit.normal;
        const penetration = hit.penetration;
        const motion = hit.motion;
        const approach = Math.max(0, -motion.dot(normal));
        const severity = clamp(penetration * 2.65 + approach * 6.2 + (collider.immovable ? 0.18 : 0), 0, 1);
        maxPenetration = Math.max(maxPenetration, penetration);
        maxSeverity = Math.max(maxSeverity, severity);

        if (collider.immovable) {
          immovableHit = true;
          continue;
        }

        movableHit = true;
        if (!moved.has(collider)) {
          moved.add(collider);
          movedMass += collider.mass;
        }
        const horizontal = new THREE.Vector3(normal.x, 0, normal.z);
        if (horizontal.lengthSq() < 0.0001) {
          horizontal.set(-motion.x, 0, -motion.z);
        }
        if (horizontal.lengthSq() < 0.0001) {
          horizontal.set(1, 0, 0);
        }
        horizontal.normalize();
        const impulse = clamp((penetration * 2.8 + approach * 5.4 + 0.05) / Math.max(collider.mass, 0.12), 0.035, 1.55);
        const correction = Math.min(penetration * (0.7 + severity * 0.16), 0.2);
        collider.mesh.position.addScaledVector(horizontal, -correction);
        collider.velocity.addScaledVector(horizontal, -impulse);
        collider.velocity.y = Math.max(collider.velocity.y, 0.045 + severity * 0.16);
        this.applyWorldColliderAngularImpulse(
          collider,
          hit.point,
          horizontal.clone().multiplyScalar(-impulse * collider.mass),
          0.3,
        );
        collider.sleeping = false;
        objectImpulse += impulse;
        this.worldColliderGridDirty = true;
        this.pressure = Math.max(this.pressure, clamp(0.08 + severity * 0.28 + collider.mass * 0.008, 0, 0.58));
      }
    }

    let blocked = false;
    if (immovableHit && Math.abs(this.angles.swing - previousAngles.swing) > 0.00001) {
      this.angles.swing = previousAngles.swing;
      this.velocities.swing = 0;
      this.excavator.applyAngles(this.angles);
      blocked = true;
    }

    if (maxSeverity > 0.08) {
      this.pressure = Math.max(this.pressure, clamp(0.26 + maxSeverity * 0.52, 0, 0.9));
      if (this.collisionCooldown <= 0 && (blocked || movableHit || maxPenetration > 0.02)) {
        this.collisionCount += 1;
        this.collisionCooldown = 0.34;
      }
    }

    return {
      collided: movableHit || immovableHit,
      movableHit,
      blocked,
      penetration: maxPenetration,
      movedMass,
      objectImpulse,
    };
  }

  private resolveArmTruckCollisions(previousAngles: ExcavatorAngles): {
    collided: boolean;
    blockedActions: ActionName[];
    penetration: number;
  } {
    const currentAngles = { ...this.angles };
    const currentSamples = this.excavator.armCollisionSamples();
    this.excavator.applyAngles(previousAngles);
    const previousSamples = this.excavator.armCollisionSamples();
    this.excavator.applyAngles(currentAngles);

    let maxPenetration = 0;
    const affected = new Set<"boom" | "stick" | "bucket">();

    for (let i = 0; i < currentSamples.length; i += 1) {
      const sample = currentSamples[i];
      const previous = previousSamples[i] ?? sample;
      const hit = this.resolveSweptTruckSampleHit(previous.point, sample.point, sample.radius);
      if (!hit) {
        continue;
      }
      maxPenetration = Math.max(maxPenetration, hit.penetration);
      affected.add(sample.action);
      this.truck.applyImpact(
        hit.point,
        hit.normal,
        clamp(0.06 + hit.penetration * 2.6 + Math.max(0, -hit.motion.dot(hit.normal)) * 3.2 + sample.radius * 0.22, 0.03, 1.1),
      );
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

    const broadphaseCenter = new THREE.Vector3((minX + maxX) * 0.5, 0, (minZ + maxZ) * 0.5);
    const broadphaseRadius = Math.hypot(maxX - minX, maxZ - minZ) * 0.5 + ARM_WORLD_BROADPHASE_PADDING;
    const candidates = [...this.nearbyWorldColliders(broadphaseCenter, broadphaseRadius)];
    for (const collider of candidates) {
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
        const hit = this.resolveSweptWorldColliderSampleHit(collider, previous.point, sample.point, sample.radius);
        if (!hit) {
          continue;
        }

        const normalX = hit.normal.x;
        const normalY = hit.normal.y;
        const normalZ = hit.normal.z;
        const penetration = hit.penetration;
        const motionX = hit.motion.x;
        const motionY = hit.motion.y;
        const motionZ = hit.motion.z;
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
        this.applyWorldColliderAngularImpulse(
          collider,
          hit.point,
          new THREE.Vector3(-pushX * impulse * collider.mass, -normalY * impulse * collider.mass * 0.35, -pushZ * impulse * collider.mass),
          0.32,
        );
        collider.sleeping = false;
        this.worldColliderGridDirty = true;
        this.pressure = Math.max(this.pressure, clamp(0.08 + severity * 0.26 + collider.mass * 0.01, 0, 0.55));
        if (collider.crushable && severity > 0.34) {
          collider.mesh.scale.multiplyScalar(1 - Math.min(severity * 0.035, 0.07));
          this.raiseTerrainWithWake(collider.mesh.position, Math.max(0.14, collider.radius * 1.4), collider.radius * 0.008 * severity, 0);
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
    displacedVolume: number;
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
    const displacementStrokes: Array<{
      start: THREE.Vector3;
      end: THREE.Vector3;
      sideways: THREE.Vector3;
      width: number;
      depth: number;
      volumeLimit: number;
      score: number;
    }> = [];

    for (let i = 0; i < currentSamples.length; i += 1) {
      const sample = currentSamples[i];
      const previous = previousSamples[i] ?? sample;
      const ground = this.terrain.getHeightAt(sample.point.x, sample.point.z);
      const submerged = clamp(ground - (sample.point.y - sample.radius * 0.62), 0, 2.35);
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
      const weighted = Math.pow(submerged, 1.08) * (1 + subsoil * 0.48) * yieldingScale;
      const intrusionLoad = localIntrusion * yieldingScale;
      const motionLoad = (verticalIntrusion + horizontalMotion) * (cuttingBucketContact ? 0.55 : 1);
      if (motionLoad > 0.006) {
        const horizontalMotionVector = new THREE.Vector3(motion.x, 0, motion.z);
        const sideways =
          horizontalMotionVector.lengthSq() > 0.0001
            ? new THREE.Vector3(-horizontalMotionVector.z, 0, horizontalMotionVector.x).normalize()
            : this.excavator.bucketSidewaysWorld().setY(0).normalize();
        if (sideways.lengthSq() > 0.0001) {
          const structureScale = isBucket ? (cuttingBucketContact ? 0.28 : 0.54) : 0.74;
          const sweptLength = Math.max(sample.point.distanceTo(previous.point), sample.radius * 0.45);
          const width = clamp(sample.radius * (isBucket ? 3.0 : 2.75), 0.42, 0.86);
          const depth = clamp((submerged * 0.055 + motionLoad * 0.2) * structureScale / (1 + subsoil * 0.18), 0.002, isBucket ? 0.052 : 0.07);
          const volumeLimit = clamp(width * depth * sweptLength * (0.72 + subsoil * 0.12), 0.004, isBucket ? 0.075 : 0.11);
          displacementStrokes.push({
            start: previous.point,
            end: sample.point,
            sideways,
            width,
            depth,
            volumeLimit,
            score: submerged * motionLoad * (isBucket ? 0.75 : 1) * (1 + subsoil * 0.12),
          });
        }
      }

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
      return { resisted: false, blockedActions: [], maxSubmerged: 0, averageSubmerged: 0, displacedVolume: 0, drag: 1 };
    }

    const averageSubmerged = weightedSubmerged / contactCount;
    const averageMaterialLoad = materialLoad / contactCount;
    const severity = clamp(
      maxSubmerged * 1.05 +
        averageSubmerged * 0.58 +
        pushingIntoSoil * 5.4 +
        submergedMotion * 1.2 +
        averageMaterialLoad * 0.12,
      0,
      1,
    );
    const drag = 1;

    const hasSubmergedMotion = submergedMotion > 0.004;
    if (!hasSubmergedMotion) {
      return { resisted: false, blockedActions: [], maxSubmerged, averageSubmerged, displacedVolume: 0, drag: 1 };
    }

    const blockedActions: ActionName[] = [];
    let displacedVolume = 0;
    displacementStrokes.sort((a, b) => b.score - a.score);
    for (const stroke of displacementStrokes.slice(0, 1)) {
      displacedVolume += this.displaceTerrainWithWake(
        stroke.start,
        stroke.end,
        stroke.sideways,
        stroke.width,
        stroke.depth * 1.28,
        stroke.volumeLimit * 1.7,
      );
    }

    this.pressure = Math.max(this.pressure, clamp(0.22 + severity * 0.74, 0, 1));
    if (displacedVolume > 0) {
      this.pressure = Math.max(this.pressure, clamp(0.34 + displacedVolume * 1.9, 0, 1));
    }

    return { resisted: true, blockedActions, maxSubmerged, averageSubmerged, displacedVolume, drag };
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
      curlInSpeed > 0.035 ||
      stickPullSpeed > 0.035 ||
      tipSpeed > 0.08;

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
        (curlInSpeed * 0.9 + stickPullSpeed * 0.42 + tipSpeed * 0.32 + 0.32) *
          attackEfficiency *
          (0.5 + contactRatio * 0.5),
        0.12,
        1.55,
      );
      const digDepth = clamp(
        (penetration * 0.68 + Math.min(tipSpeed, 1.8) * 0.055) * bite * dt * 4.6,
        0.006,
        0.28,
      );
      const removed = this.excavateTerrainWithWake(
        this.previousBucketTip,
        tip,
        sideways,
        1.08,
        digDepth,
        freeCapacity,
      );
      const airborneFines = removed * clamp(0.025 + tipSpeed * 0.008 + (1 - attackEfficiency) * 0.014, 0.025, 0.075);
      const bucketAccepted = Math.min(freeCapacity, Math.max(0, removed - airborneFines));
      const spill = Math.max(0, removed - airborneFines - bucketAccepted);
      this.totalExcavated += removed;
      if (removed > 0) {
        this.pressure = Math.max(this.pressure, clamp(0.42 + removed * 1.8 + contactRatio * 0.22, 0, 1));
        if (bucketAccepted > 0.001) {
          const directCaptureRatio = clamp(0.68 + attackEfficiency * 0.18 + curlInSpeed * 0.06 + contactRatio * 0.06, 0.62, 0.9);
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
      const displaced = this.displaceTerrainWithWake(
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

    this.excavator.setBucketLoad(this.bucketLoad);
    const bucketLoadSlumpMoved = this.excavator.slumpBucketLoadUnderGravity(
      dt,
      0.72 + Math.abs(this.velocities.bucket) * 0.52 + clamp(tipSpeed * 0.1, 0, 0.4),
    );
    if (bucketLoadSlumpMoved > 0.0005) {
      this.pressure = Math.max(this.pressure, clamp(0.08 + bucketLoadSlumpMoved * 0.42, 0, 0.34));
    }
    const bucketLoadStats = this.excavator.bucketLoadDistributionStats();
    const lipDumpBias = clamp((bucketLoadStats.lipRatio - 0.24) * 0.9 + Math.max(0, -bucketLoadStats.centerX - 0.56) * 0.36, 0, 0.58);
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
      const dumpRate = (0.1 + openFactor * openFactor * 1.45 + Math.max(0, this.velocities.bucket) * 0.95 + lipDumpBias * 0.62) * dt;
      const spill = this.spillBucketLoadToWorld(
        dt,
        1.0 + openFactor * 2.4 + Math.max(0, this.velocities.bucket) * 0.8 + lipDumpBias,
        openFactor + lipDumpBias * 0.45,
        dumpRate,
      );
      if (spill.spilledVolume > 0.001) {
        this.pressure = Math.max(this.pressure, clamp(0.1 + spill.spilledVolume * 0.36, 0, 0.46));
      }
    }

    this.excavator.setBucketLoad(this.bucketLoad);
    this.truck.updateLoad(this.truckLoad);
    this.previousBucketTip.copy(tip);
  }

  private spillBucketLoadToWorld(
    dt: number,
    intensity: number,
    lipBias: number,
    maxVolume = this.bucketLoad,
  ): { spilledVolume: number; heightRemoved: number; worldPoint: THREE.Vector3 } {
    if (this.bucketLoad <= 0.002 || maxVolume <= 0) {
      return { spilledVolume: 0, heightRemoved: 0, worldPoint: this.excavator.bucketPocketWorld() };
    }

    const spill = this.excavator.spillBucketLoadOverLip(
      dt,
      intensity,
      this.bucketLoad,
      Math.min(this.bucketLoad, maxVolume),
      lipBias,
    );
    if (spill.spilledVolume <= 0) {
      return { spilledVolume: 0, heightRemoved: 0, worldPoint: spill.worldPoint };
    }

    const spilledVolume = Math.min(this.bucketLoad, spill.spilledVolume);
    this.bucketLoad = Math.max(0, this.bucketLoad - spilledVolume);
    const direction = spill.worldPoint.clone().sub(this.excavator.bucketPocketWorld());
    const forward = direction.lengthSq() > 0.0001 ? direction.normalize() : this.excavator.bucketForwardWorld();
    const openness = clamp(lipBias, 0, 1.2);
    const fineVolume = spilledVolume * clamp(0.035 + openness * 0.055, 0.035, 0.1);
    const coarseVolume = Math.max(0, spilledVolume - fineVolume);
    this.spawnSoilParticles(spill.worldPoint, coarseVolume, forward, openness);
    this.spawnFineGrains(spill.worldPoint, fineVolume, forward.clone().add(new THREE.Vector3(0, -0.35 - openness, 0)), true, 1.05 + openness);
    return { spilledVolume, heightRemoved: spill.heightRemoved, worldPoint: spill.worldPoint };
  }

  private spawnCuttingFlow(edgePoints: THREE.Vector3[], pocket: THREE.Vector3, volume: number): void {
    if (volume <= 0) {
      return;
    }
    const count = clamp(Math.ceil(volume * 5), 1, 2);
    const perParticle = volume / count;
    for (let i = 0; i < count; i += 1) {
      if (this.soilParticles.length > SOIL_PARTICLE_HARD_LIMIT || (this.soilParticles.length > SOIL_PARTICLE_SOFT_LIMIT && i % 2 === 0)) {
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
      this.soilParticles.push({ mesh, velocity, volume: perParticle, radius, life: 0, settles: false, target, toBucket: true });
    }
  }

  private spawnSoilParticles(origin: THREE.Vector3, volume: number, bucketForward: THREE.Vector3, openFactor: number): void {
    if (volume <= 0) {
      return;
    }
    const count = clamp(Math.ceil(volume * 4.5), 1, 2);
    const perParticle = volume / count;
    const flowDirection =
      bucketForward.lengthSq() > 0.0001 ? bucketForward.clone().normalize() : new THREE.Vector3(0, -1, 0);
    const horizontal = new THREE.Vector3(flowDirection.x, 0, flowDirection.z);
    const sideways =
      horizontal.lengthSq() > 0.0001 ? new THREE.Vector3(-horizontal.z, 0, horizontal.x).normalize() : new THREE.Vector3(1, 0, 0);

    for (let i = 0; i < count; i += 1) {
      if (this.soilParticles.length > SOIL_PARTICLE_HARD_LIMIT || (this.soilParticles.length > SOIL_PARTICLE_SOFT_LIMIT && i % 2 === 0)) {
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
      this.soilParticles.push({ mesh, velocity, volume: perParticle, radius, life: 0, settles: true });
    }
  }

  private acquireSoilParticleMesh(radius: number, material: THREE.Material, seed: number): THREE.Mesh {
    const mesh = this.soilParticlePool.pop() ?? new THREE.Mesh(this.pooledSoilGeometry, material);
    const squash = 0.72 + hash2(seed, 11) * 0.28;
    const stretchX = 0.82 + hash2(seed, 17) * 0.36;
    const stretchZ = 0.82 + hash2(seed, 23) * 0.36;

    mesh.material = material;
    mesh.visible = true;
    mesh.castShadow = false;
    mesh.receiveShadow = false;
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

    const count = clamp(Math.ceil(volume * 7 * burst), 1, 2);
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
      this.fineGrainMaxLife[idx] = settles ? 0.55 + Math.random() * 0.5 : 0.28 + Math.random() * 0.2;
      this.fineGrainSettles[idx] = settles ? 1 : 0;
      this.fineGrainVolumes[idx] = perGrain;
    }

    (this.fineGrainGeometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
  }

  private shouldResolveDynamicSoilCollisionAt(
    x: number,
    y: number,
    z: number,
    radius: number,
    bucketPocket: THREE.Vector3,
  ): boolean {
    const bucketReach = 1.55 + radius;
    const bucketDx = x - bucketPocket.x;
    const bucketDy = y - bucketPocket.y;
    const bucketDz = z - bucketPocket.z;
    if (bucketDx * bucketDx + bucketDy * bucketDy + bucketDz * bucketDz < bucketReach * bucketReach) {
      return true;
    }

    const machine = this.excavator.group.position;
    const machineReach = 4.2 + radius;
    const machineDx = x - machine.x;
    const machineDz = z - machine.z;
    if (y < machine.y + 3.1 && machineDx * machineDx + machineDz * machineDz < machineReach * machineReach) {
      return true;
    }

    const truckReach = 5.0 + radius;
    const truckDx = x - TRUCK_CENTER.x;
    const truckDz = z - TRUCK_CENTER.z;
    return y < TRUCK_CENTER.y + 2.7 && truckDx * truckDx + truckDz * truckDz < truckReach * truckReach;
  }

  private updateFineGrains(dt: number): void {
    let changed = false;
    let dynamicCollisionBudget = this.isMobilePerformanceProfile()
      ? MOBILE_FINE_GRAIN_DYNAMIC_COLLISION_BUDGET
      : FINE_GRAIN_DYNAMIC_COLLISION_BUDGET;
    const bucketPocket = this.excavator.bucketPocketWorld();
    if (dynamicCollisionBudget > 0 && this.fineGrainCount() > 1) {
      this.rebuildFineGrainPairGrid();
    } else {
      this.fineGrainPairGrid.clear();
    }

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

      const canResolveDynamicCollision =
        settles &&
        dynamicCollisionBudget > 0 &&
        this.shouldResolveDynamicSoilCollisionAt(
          this.fineGrainPositions[p],
          this.fineGrainPositions[p + 1],
          this.fineGrainPositions[p + 2],
          0.026,
          bucketPocket,
        );
      if (canResolveDynamicCollision) {
        dynamicCollisionBudget -= 1;
        if (this.resolveFineGrainCollisions(i, 0.026)) {
          changed = true;
        }
      }

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
        this.raiseTerrainWithWake(new THREE.Vector3(pos.x, 0, pos.z), 0.18, volume - accepted, 0);
      }
    } else {
      const ground = this.terrain.getHeightAt(pos.x, pos.z);
      const settleRadius = Math.max(this.terrain.spacing * 0.62, 0.14 + Math.cbrt(volume) * 0.08);
      this.raiseTerrainWithWake(new THREE.Vector3(pos.x, ground, pos.z), settleRadius, volume, 0);
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
    let dynamicCollisionBudget = this.isMobilePerformanceProfile()
      ? MOBILE_SOIL_DYNAMIC_COLLISION_BUDGET
      : SOIL_DYNAMIC_COLLISION_BUDGET;
    const bucketPocket = this.excavator.bucketPocketWorld();
    if (dynamicCollisionBudget > 0 && this.soilParticles.length > 1) {
      this.rebuildSoilParticlePairGrid();
    } else {
      this.soilParticlePairGrid.clear();
    }

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
        if (particle.toBucket && this.captureParticleOnBucketLoad(particle)) {
          this.soilParticles.splice(i, 1);
          this.recycleSoilParticle(particle);
          continue;
        }
        const canResolveDynamicCollision =
          dynamicCollisionBudget > 0 &&
          this.shouldResolveDynamicSoilCollisionAt(
            particle.mesh.position.x,
            particle.mesh.position.y,
            particle.mesh.position.z,
            particle.radius,
            bucketPocket,
          );
        const dynamicCollisionResolved = canResolveDynamicCollision ? this.resolveSoilParticleCollisions(particle) : false;
        if (canResolveDynamicCollision) {
          dynamicCollisionBudget -= 1;
        }
        if (particle.toBucket && dynamicCollisionResolved) {
          particle.toBucket = false;
          particle.target = undefined;
          particle.settles = true;
          this.bucketTransitLoad = Math.max(0, this.bucketTransitLoad - particle.volume);
        } else if (!particle.toBucket) {
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
      const canResolveDynamicCollision =
        dynamicCollisionBudget > 0 &&
        this.shouldResolveDynamicSoilCollisionAt(pos.x, pos.y, pos.z, particle.radius, bucketPocket);
      if (canResolveDynamicCollision) {
        dynamicCollisionBudget -= 1;
        this.resolveSoilParticleCollisions(particle);
      }

      const ground = this.terrain.getHeightAt(pos.x, pos.z);
      const inTruck = this.truck.containsWorldPoint(pos) && pos.y < TRUCK_CENTER.y + 1.72;
      const hitGround = pos.y <= ground + 0.05;
      if (inTruck || hitGround || particle.life > 5.5) {
        this.soilParticles.splice(i, 1);
        if (inTruck) {
          const accepted = this.truck.depositSoilAt(pos, particle.volume, TRUCK_CAPACITY - this.truckLoad);
          this.truckLoad = Math.min(TRUCK_CAPACITY, this.truckLoad + accepted);
          if (accepted < particle.volume) {
            this.raiseTerrainWithWake(new THREE.Vector3(pos.x, 0, pos.z), 0.42, particle.volume - accepted, 1);
          }
        } else {
          this.raiseTerrainWithWake(new THREE.Vector3(pos.x, 0, pos.z), 0.38 + Math.cbrt(particle.volume) * 0.12, particle.volume, 1);
        }
        this.recycleSoilParticle(particle);
      }
    }
  }

  private captureParticleOnBucketLoad(particle: SoilParticle): boolean {
    const hit = this.excavator.resolveBucketLoadCollision(particle.mesh.position, Math.max(0.018, particle.radius));
    if (!hit) {
      return false;
    }

    particle.mesh.position.addScaledVector(hit.normal, Math.min(hit.penetration + 0.002, 0.16));
    this.captureParticleIntoBucket(particle);
    this.pressure = Math.max(this.pressure, clamp(0.2 + hit.loadHeight * 0.5, 0, 0.55));
    return true;
  }

  private resolveFineGrainCollisions(i: number, radius: number): boolean {
    const p = i * 3;
    const pos = new THREE.Vector3(this.fineGrainPositions[p], this.fineGrainPositions[p + 1], this.fineGrainPositions[p + 2]);
    const velocity = new THREE.Vector3(this.fineGrainVelocities[p], this.fineGrainVelocities[p + 1], this.fineGrainVelocities[p + 2]);
    let collided = false;
    const fineMass = Math.max(0.006, this.fineGrainVolumes[i] * 1.8);

    if (!this.truck.containsWorldPoint(pos)) {
      const truckHit = this.truck.resolveSolidCollision(pos, radius);
      if (truckHit) {
        pos.addScaledVector(truckHit.normal, truckHit.penetration + 0.002);
        const normalSpeed = velocity.dot(truckHit.normal);
        this.truck.applyImpact(
          pos,
          truckHit.normal,
          clamp(0.002 + truckHit.penetration * 0.08 + Math.max(0, -normalSpeed) * fineMass * 0.24, 0.001, 0.05),
        );
        if (normalSpeed < 0) {
          velocity.addScaledVector(truckHit.normal, -(1.18 * normalSpeed));
          velocity.multiplyScalar(0.62);
        }
        collided = true;
      }
    }

    const bucketLoadHit = this.excavator.resolveBucketLoadCollision(pos, radius);
    if (bucketLoadHit) {
      pos.addScaledVector(bucketLoadHit.normal, Math.min(bucketLoadHit.penetration + 0.0015, 0.08));
      const normalSpeed = velocity.dot(bucketLoadHit.normal);
      const tangent = velocity.clone().addScaledVector(bucketLoadHit.normal, -normalSpeed);
      if (normalSpeed < 0) {
        velocity.copy(tangent.multiplyScalar(0.58)).addScaledVector(bucketLoadHit.normal, -normalSpeed * 0.14);
      } else {
        velocity.copy(tangent.multiplyScalar(0.64)).addScaledVector(bucketLoadHit.normal, normalSpeed);
      }
      this.pressure = Math.max(this.pressure, clamp(0.08 + bucketLoadHit.penetration * 0.35, 0, 0.28));
      collided = true;
      this.fineGrainPositions[p] = pos.x;
      this.fineGrainPositions[p + 1] = pos.y;
      this.fineGrainPositions[p + 2] = pos.z;
      this.fineGrainVelocities[p] = velocity.x;
      this.fineGrainVelocities[p + 1] = velocity.y;
      this.fineGrainVelocities[p + 2] = velocity.z;
      return true;
    }

    if (this.resolveSoilExcavatorCollision(pos, velocity, radius, fineMass, true)) {
      collided = true;
      this.fineGrainPositions[p] = pos.x;
      this.fineGrainPositions[p + 1] = pos.y;
      this.fineGrainPositions[p + 2] = pos.z;
      this.fineGrainVelocities[p] = velocity.x;
      this.fineGrainVelocities[p + 1] = velocity.y;
      this.fineGrainVelocities[p + 2] = velocity.z;
      return true;
    }

    for (const collider of this.nearbyWorldColliders(pos, radius + FINE_GRAIN_COLLISION_QUERY_PADDING)) {
      if (this.carriedWorldColliders.has(collider)) {
        continue;
      }
      const hit = this.resolveWorldColliderSampleHit(collider, pos, radius);
      if (!hit) {
        continue;
      }
      const normal = hit.normal;
      const penetration = hit.penetration;
      const invFine = 1 / fineMass;
      const invObject = collider.immovable ? 0 : 1 / Math.max(collider.mass, 0.05);
      const totalInvMass = invFine + invObject;
      if (totalInvMass <= 0) {
        continue;
      }

      const correction = Math.min(penetration * 0.9 + 0.002, 0.12);
      pos.addScaledVector(normal, correction * (invFine / totalInvMass));
      collider.mesh.position.addScaledVector(normal, -correction * (invObject / totalInvMass));

      const relativeVelocity = velocity.clone().sub(collider.velocity);
      const closingSpeed = relativeVelocity.dot(normal);
      if (closingSpeed < 0) {
        const restitution = Math.min(0.16, collider.restitution + 0.03);
        const impulse = (-(1 + restitution) * closingSpeed) / totalInvMass;
        velocity.addScaledVector(normal, impulse * invFine);
        collider.velocity.addScaledVector(normal, -impulse * invObject);
        this.applyWorldColliderAngularImpulse(collider, pos, normal.clone().multiplyScalar(-impulse), 0.18);
      }

      const tangent = relativeVelocity.addScaledVector(normal, -closingSpeed);
      if (tangent.lengthSq() > 0.000001) {
        tangent.normalize().multiplyScalar(clamp(collider.friction * 0.055, 0.018, 0.08));
        velocity.addScaledVector(tangent, -invFine / totalInvMass);
        collider.velocity.addScaledVector(tangent, invObject / totalInvMass);
        this.applyWorldColliderAngularImpulse(collider, pos, tangent.clone().multiplyScalar(invObject / totalInvMass), 0.12);
        velocity.multiplyScalar(1 - Math.min(collider.friction * 0.04, 0.08));
      }
      collider.sleeping = false;
      this.deferWorldColliderGridRefresh();
      this.pressure = Math.max(this.pressure, clamp(0.025 + penetration * 0.55 + fineMass * 0.4, 0, 0.2));
      collided = true;
      break;
    }

    if (this.resolveFineGrainPairCollision(i, pos, velocity, radius, fineMass)) {
      collided = true;
    }

    if (collided) {
      this.fineGrainPositions[p] = pos.x;
      this.fineGrainPositions[p + 1] = pos.y;
      this.fineGrainPositions[p + 2] = pos.z;
      this.fineGrainVelocities[p] = velocity.x;
      this.fineGrainVelocities[p + 1] = velocity.y;
      this.fineGrainVelocities[p + 2] = velocity.z;
    }
    return collided;
  }

  private resolveFineGrainPairCollision(i: number, pos: THREE.Vector3, velocity: THREE.Vector3, radius: number, fineMass: number): boolean {
    let collided = false;
    if (this.fineGrainPairGrid.size === 0) {
      this.rebuildFineGrainPairGrid();
    }
    for (const j of this.nearbyFineGrainPairCandidates(pos, radius + FINE_GRAIN_COLLISION_QUERY_PADDING)) {
      if (j === i || this.fineGrainMaxLife[j] <= 0 || this.fineGrainVolumes[j] <= 0) {
        continue;
      }
      if (this.fineGrainSettles[i] !== 1 && this.fineGrainSettles[j] !== 1) {
        continue;
      }
      const q = j * 3;
      const dx = pos.x - this.fineGrainPositions[q];
      const dy = pos.y - this.fineGrainPositions[q + 1];
      const dz = pos.z - this.fineGrainPositions[q + 2];
      const otherRadius = 0.026;
      const combinedRadius = radius + otherRadius;
      const distanceSq = dx * dx + dy * dy + dz * dz;
      if (distanceSq >= combinedRadius * combinedRadius) {
        continue;
      }

      const distance = Math.sqrt(Math.max(distanceSq, 0.000001));
      const normal = distanceSq < 0.000001 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(dx / distance, dy / distance, dz / distance);
      const penetration = combinedRadius - distance;
      const otherMass = Math.max(0.006, this.fineGrainVolumes[j] * 1.8);
      const invFine = 1 / fineMass;
      const invOther = 1 / otherMass;
      const totalInvMass = invFine + invOther;
      const correction = Math.min(penetration * 0.62 + 0.0008, 0.035);

      pos.addScaledVector(normal, correction * (invFine / totalInvMass));
      this.fineGrainPositions[q] -= normal.x * correction * (invOther / totalInvMass);
      this.fineGrainPositions[q + 1] -= normal.y * correction * (invOther / totalInvMass);
      this.fineGrainPositions[q + 2] -= normal.z * correction * (invOther / totalInvMass);

      const otherVelocity = new THREE.Vector3(this.fineGrainVelocities[q], this.fineGrainVelocities[q + 1], this.fineGrainVelocities[q + 2]);
      const relativeVelocity = velocity.clone().sub(otherVelocity);
      const closingSpeed = relativeVelocity.dot(normal);
      if (closingSpeed < 0) {
        const impulse = (-(1.08 * closingSpeed)) / totalInvMass;
        velocity.addScaledVector(normal, impulse * invFine);
        otherVelocity.addScaledVector(normal, -impulse * invOther);
      }

      const tangent = relativeVelocity.addScaledVector(normal, -closingSpeed);
      if (tangent.lengthSq() > 0.000001) {
        tangent.normalize().multiplyScalar(0.012);
        velocity.addScaledVector(tangent, -invFine / totalInvMass);
        otherVelocity.addScaledVector(tangent, invOther / totalInvMass);
      }
      this.fineGrainVelocities[q] = otherVelocity.x * 0.985;
      this.fineGrainVelocities[q + 1] = otherVelocity.y * 0.985;
      this.fineGrainVelocities[q + 2] = otherVelocity.z * 0.985;
      velocity.multiplyScalar(0.985);
      this.pressure = Math.max(this.pressure, clamp(0.018 + penetration * 0.32, 0, 0.12));
      collided = true;
      break;
    }
    return collided;
  }

  private resolveSoilParticleCollisions(particle: SoilParticle): boolean {
    const radius = Math.max(0.018, particle.radius);
    const pos = particle.mesh.position;
    let collided = false;
    const soilMass = Math.max(0.025, particle.volume * 1.8);

    if (!this.truck.containsWorldPoint(pos)) {
      const truckHit = this.truck.resolveSolidCollision(pos, radius);
      if (truckHit) {
        pos.addScaledVector(truckHit.normal, truckHit.penetration + 0.004);
        const normalSpeed = particle.velocity.dot(truckHit.normal);
        const tangent = particle.velocity.clone().addScaledVector(truckHit.normal, -normalSpeed);
        this.truck.applyImpact(
          pos,
          truckHit.normal,
          clamp(0.012 + truckHit.penetration * 0.42 + Math.max(0, -normalSpeed) * soilMass * 0.28, 0.006, 0.42),
        );
        if (normalSpeed < 0) {
          particle.velocity.copy(tangent.multiplyScalar(0.68)).addScaledVector(truckHit.normal, -normalSpeed * 0.22);
        } else {
          particle.velocity.copy(tangent.multiplyScalar(0.78)).addScaledVector(truckHit.normal, normalSpeed);
        }
        collided = true;
      }
    }

    if (!particle.toBucket) {
      const bucketLoadHit = this.excavator.resolveBucketLoadCollision(pos, radius);
      if (bucketLoadHit) {
        pos.addScaledVector(bucketLoadHit.normal, Math.min(bucketLoadHit.penetration + 0.003, 0.18));
        const normalSpeed = particle.velocity.dot(bucketLoadHit.normal);
        const tangent = particle.velocity.clone().addScaledVector(bucketLoadHit.normal, -normalSpeed);
        if (normalSpeed < 0) {
          particle.velocity.copy(tangent.multiplyScalar(0.66)).addScaledVector(bucketLoadHit.normal, -normalSpeed * 0.16);
        } else {
          particle.velocity.copy(tangent.multiplyScalar(0.72)).addScaledVector(bucketLoadHit.normal, normalSpeed);
        }
        this.pressure = Math.max(this.pressure, clamp(0.12 + bucketLoadHit.penetration * 0.55, 0, 0.38));
        return true;
      }
    }

    if (!particle.toBucket && this.resolveSoilExcavatorCollision(pos, particle.velocity, radius, soilMass, false)) {
      return true;
    }

    if ((particle.settles || !particle.toBucket) && this.resolveSoilParticlePairCollision(particle, radius, soilMass)) {
      collided = true;
    }

    for (const collider of this.nearbyWorldColliders(pos, radius + SOIL_PARTICLE_COLLISION_QUERY_PADDING)) {
      if (this.carriedWorldColliders.has(collider)) {
        continue;
      }
      const hit = this.resolveWorldColliderSampleHit(collider, pos, radius);
      if (!hit) {
        continue;
      }

      const normal = hit.normal;
      const penetration = hit.penetration;
      const invSoil = 1 / soilMass;
      const invObject = collider.immovable ? 0 : 1 / Math.max(collider.mass, 0.05);
      const totalInvMass = invSoil + invObject;
      if (totalInvMass <= 0) {
        continue;
      }

      const correction = Math.min(penetration * 0.9, 0.22);
      pos.addScaledVector(normal, correction * (invSoil / totalInvMass));
      collider.mesh.position.addScaledVector(normal, -correction * (invObject / totalInvMass));

      const relativeVelocity = particle.velocity.clone().sub(collider.velocity);
      const closingSpeed = relativeVelocity.dot(normal);
      if (closingSpeed < 0) {
        const restitution = Math.min(0.18, collider.restitution + 0.04);
        const impulse = (-(1 + restitution) * closingSpeed) / totalInvMass;
        particle.velocity.addScaledVector(normal, impulse * invSoil);
        collider.velocity.addScaledVector(normal, -impulse * invObject);
        this.applyWorldColliderAngularImpulse(collider, pos, normal.clone().multiplyScalar(-impulse), 0.2);
      }

      const tangent = relativeVelocity.addScaledVector(normal, -closingSpeed);
      if (tangent.lengthSq() > 0.000001) {
        tangent.normalize().multiplyScalar(clamp(collider.friction * 0.08, 0.035, 0.12));
        particle.velocity.addScaledVector(tangent, -invSoil / totalInvMass);
        collider.velocity.addScaledVector(tangent, invObject / totalInvMass);
        this.applyWorldColliderAngularImpulse(collider, pos, tangent.clone().multiplyScalar(invObject / totalInvMass), 0.14);
      }

      collider.sleeping = false;
      this.deferWorldColliderGridRefresh();
      this.pressure = Math.max(this.pressure, clamp(0.08 + penetration * 0.92, 0, 0.42));
      collided = true;
      break;
    }

    return collided;
  }

  private resolveSoilParticlePairCollision(particle: SoilParticle, radius: number, soilMass: number): boolean {
    const pos = particle.mesh.position;
    let collided = false;
    if (this.soilParticlePairGrid.size === 0) {
      this.rebuildSoilParticlePairGrid();
    }
    for (const other of this.nearbySoilParticlePairCandidates(pos, radius + SOIL_PARTICLE_COLLISION_QUERY_PADDING)) {
      if (other === particle || other.toBucket || (!particle.settles && !other.settles)) {
        continue;
      }
      const otherPos = other.mesh.position;
      const delta = pos.clone().sub(otherPos);
      const combinedRadius = radius + Math.max(0.018, other.radius);
      const distanceSq = delta.lengthSq();
      if (distanceSq >= combinedRadius * combinedRadius) {
        continue;
      }

      const distance = Math.sqrt(Math.max(distanceSq, 0.000001));
      const normal = distanceSq < 0.000001 ? new THREE.Vector3(1, 0, 0) : delta.divideScalar(distance);
      const penetration = combinedRadius - distance;
      const otherMass = Math.max(0.025, other.volume * 1.8);
      const invSoil = 1 / soilMass;
      const invOther = 1 / otherMass;
      const totalInvMass = invSoil + invOther;
      const correction = Math.min(penetration * 0.72 + 0.0015, 0.12);

      pos.addScaledVector(normal, correction * (invSoil / totalInvMass));
      otherPos.addScaledVector(normal, -correction * (invOther / totalInvMass));

      const relativeVelocity = particle.velocity.clone().sub(other.velocity);
      const closingSpeed = relativeVelocity.dot(normal);
      if (closingSpeed < 0) {
        const impulse = (-(1.12 * closingSpeed)) / totalInvMass;
        particle.velocity.addScaledVector(normal, impulse * invSoil);
        other.velocity.addScaledVector(normal, -impulse * invOther);
      }

      const tangent = relativeVelocity.addScaledVector(normal, -closingSpeed);
      if (tangent.lengthSq() > 0.000001) {
        tangent.normalize().multiplyScalar(0.035);
        particle.velocity.addScaledVector(tangent, -invSoil / totalInvMass);
        other.velocity.addScaledVector(tangent, invOther / totalInvMass);
      }
      particle.velocity.multiplyScalar(0.992);
      other.velocity.multiplyScalar(0.992);
      this.pressure = Math.max(this.pressure, clamp(0.035 + penetration * 0.42, 0, 0.18));
      collided = true;
      break;
    }
    return collided;
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
      this.raiseTerrainWithWake(new THREE.Vector3(pos.x, 0, pos.z), 0.34 + Math.cbrt(volume - accepted) * 0.1, volume - accepted, 1);
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
        this.raiseTerrainWithWake(new THREE.Vector3(pos.x, 0, pos.z), 0.36, volume - accepted, 1);
      }
    } else {
      this.raiseTerrainWithWake(new THREE.Vector3(pos.x, 0, pos.z), 0.32 + Math.cbrt(volume) * 0.1, volume, 1);
    }
    this.truck.updateLoad(this.truckLoad);
  }

  private updatePassiveSoil(dt: number): void {
    this.soilSettleAccumulator += dt;
    if (this.soilSettleAccumulator < 0.22) {
      return;
    }
    this.soilSettleAccumulator = 0;
    this.settleTerrainWithWake(DIG_SITE, 2.6, 1);
    const tip = this.excavator.bucketTipWorld();
    this.settleTerrainWithWake(tip, 1.15, 1);
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
        this.raiseTerrainWithWake(new THREE.Vector3(pos.x, 0, pos.z), 0.42, particle.volume - accepted, 1);
      }
    } else {
      this.raiseTerrainWithWake(new THREE.Vector3(pos.x, 0, pos.z), 0.38 + Math.cbrt(particle.volume) * 0.12, particle.volume, 1);
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
    this.ui.travelText.textContent = `${this.travelDistance.toFixed(2)} m`;
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
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.pixelRatioLimit()));
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
