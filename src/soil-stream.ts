import * as THREE from "three";

export interface StreamPacket {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  volume: number;
  age: number;
  seed: number;
}

// Each packet carries conserved volume; its eight rendered grains cost one
// instanced draw call for the entire stream, without pairwise DEM collisions.
export class SoilStream {
  readonly capacity = 384;
  readonly packets: StreamPacket[] = [];
  readonly mesh: THREE.InstancedMesh;
  private serial = 0;
  private readonly transform = new THREE.Object3D();
  private readonly previous = new THREE.Vector3();

  constructor() {
    this.mesh = new THREE.InstancedMesh(
      new THREE.IcosahedronGeometry(1, 0),
      new THREE.MeshStandardMaterial({ color: 0x997044, roughness: 1 }),
      this.capacity * 8,
    );
    this.mesh.name = "flowing-soil";
    this.mesh.userData.physicsRole = "soil-particles";
    this.mesh.count = 0;
    this.mesh.frustumCulled = false;
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    for (let i = 0; i < this.capacity * 8; i++) {
      this.mesh.setColorAt(i, new THREE.Color().setScalar(0.65 + (i % 7) * 0.065));
    }
  }

  get volume(): number { return this.packets.reduce((sum, packet) => sum + packet.volume, 0); }
  get available(): number { return this.capacity - this.packets.length; }
  clear(): void { this.packets.length = 0; this.mesh.count = 0; }

  emit(origin: THREE.Vector3, velocity: THREE.Vector3, sideways: THREE.Vector3, volume: number, dt: number): number {
    if (volume <= 0 || this.available === 0) return 0;
    const count = Math.min(this.available, Math.max(1, Math.ceil(dt * 180)));
    for (let i = 0; i < count; i++) {
      const seed = this.serial++;
      const spread = ((seed * 0.61803398875) % 1 - 0.5);
      this.packets.push({
        position: origin.clone().addScaledVector(sideways, spread * 0.7),
        velocity: velocity.clone().addScaledVector(sideways, spread * 0.55),
        volume: volume / count,
        age: 0,
        seed,
      });
    }
    return volume;
  }

  // Collision callback sees the swept segment and may keep a packet sliding
  // on a pile or spilling over the truck rim. Only actual deposits remove it.
  update(dt: number, contact: (packet: StreamPacket, previous: THREE.Vector3, dt: number) => boolean): void {
    if (dt <= 0) return;
    const steps = Math.max(1, Math.ceil(dt / (1 / 60)));
    const h = dt / steps;
    for (let step = 0; step < steps; step++) {
      for (let i = this.packets.length - 1; i >= 0; i--) {
        const packet = this.packets[i];
        this.previous.copy(packet.position);
        packet.position.addScaledVector(packet.velocity, h);
        packet.position.y -= 0.5 * 9.81 * h * h;
        packet.velocity.y -= 9.81 * h;
        packet.age += h;
        if (contact(packet, this.previous, h)) {
          this.packets[i] = this.packets[this.packets.length - 1];
          this.packets.pop();
        }
      }
    }
    this.render();
  }

  render(): void {
    let index = 0;
    for (const packet of this.packets) {
      const radius = Math.max(0.018, Math.min(0.065, Math.cbrt(packet.volume / 8) * 0.52));
      const fan = 0.04 + Math.min(packet.age, 1) * 0.1;
      for (let grain = 0; grain < 8; grain++) {
        const phase = packet.seed * 2.399963 + grain * 2.399963;
        this.transform.position.copy(packet.position);
        this.transform.position.x += Math.sin(phase) * fan;
        this.transform.position.z += Math.cos(phase) * fan;
        this.transform.position.y += (grain / 8 - 0.5) * (0.07 + Math.min(0.18, packet.velocity.length() * 0.018));
        this.transform.rotation.set(phase + packet.age * 2, phase, packet.age * 3);
        this.transform.scale.set(radius * 0.8, radius * 1.2, radius);
        this.transform.updateMatrix();
        this.mesh.setMatrixAt(index++, this.transform.matrix);
      }
    }
    this.mesh.count = index;
    this.mesh.instanceMatrix.needsUpdate = true;
  }
}
