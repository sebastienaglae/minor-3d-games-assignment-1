import {
  Color4,
  GPUParticleSystem,
  Particle,
  ParticleSystem,
  Scene,
  SphereParticleEmitter,
  CylinderParticleEmitter,
  Texture,
  Vector3,
} from "@babylonjs/core";

export class CloudEffect extends GPUParticleSystem {
  constructor(scene: Scene, emitter: any, texture: Texture, diameter: number, isSphere = true) {
    super("fire", { capacity: 15000 }, scene);

    if (!GPUParticleSystem.IsSupported) {
      throw new Error("GPUParticleSystem is not supported");
    }

    this.activeParticleCount = 10000;
    this.manualEmitCount = this.activeParticleCount;

    this.particleTexture = texture.clone();
    this.emitter = emitter;

    this.color1 = new Color4(0.8, 0.8, 0.8, 0.1);
    this.color2 = new Color4(0.95, 0.95, 0.95, 0.15);
    this.colorDead = new Color4(0.9, 0.9, 0.9, 0.1);
    this.minSize = 3.5;
    this.maxSize = 5.0;
    this.minLifeTime = Number.MAX_SAFE_INTEGER;
    this.emitRate = 10000;
    this.blendMode = ParticleSystem.BLENDMODE_STANDARD;
    this.gravity = new Vector3(0, 0, 0);
    this.direction1 = new Vector3(0, 0, 0);
    this.direction2 = new Vector3(0, 0, 0);
    this.minAngularSpeed = -2;
    this.maxAngularSpeed = 2;
    this.minEmitPower = 0.5;
    this.maxEmitPower = 1;
    this.updateSpeed = 0.005;
    if (isSphere) {
      this.particleEmitterType = new SphereParticleEmitter(1.5 * diameter, 0.5);
    }
    else {
      this.particleEmitterType = new CylinderParticleEmitter();
    }
    //renderloop
    scene.registerBeforeRender(() => {
      this.emitter = emitter.position;
    });
  }
}
