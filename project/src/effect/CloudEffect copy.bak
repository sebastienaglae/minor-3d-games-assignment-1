import {
  Camera,
  Color4,
  FreeCamera,
  GPUParticleSystem,
  Mesh,
  ParticleSystem,
  Scene,
  SphereParticleEmitter,
  Texture,
  Vector3,
} from "@babylonjs/core";

export class CloudEffect extends GPUParticleSystem {
  private _camera: Camera;
  private _maxParticleCount: number;
  private _diameter: number;

  constructor(scene: Scene, emitter: Mesh, diameter: number, camera: Camera) {
    super("cloud", { capacity: 15000 }, scene);
    if (!GPUParticleSystem.IsSupported) {
      throw new Error("GPUParticleSystem is not supported");
    }

    this._camera = camera;
    this._diameter = diameter;
    this._maxParticleCount = 1 * diameter;
    this.activeParticleCount = this._maxParticleCount;
    this.manualEmitCount = this.activeParticleCount;
    this.particleTexture = new Texture("img/effects/smoke_15.png", scene);
    this.emitter = emitter;

    this.color1 = new Color4(0.8, 0.8, 0.8, 0.1);
    this.color2 = new Color4(0.95, 0.95, 0.95, 0.15);
    this.colorDead = new Color4(0.9, 0.9, 0.9, 0.1);
    this.minSize = 1 * diameter;
    this.maxSize = 2 * diameter;
    this.minLifeTime = 0.1;
    this.emitRate = 1000;
    this.blendMode = ParticleSystem.BLENDMODE_STANDARD;
    this.gravity = new Vector3(0, 0, 0);
    this.direction1 = new Vector3(0, 0, 0);
    this.direction2 = new Vector3(0, 0, 0);
    this.minAngularSpeed = -2;
    this.maxAngularSpeed = 2;
    this.minEmitBox = new Vector3(
      -0.5 * diameter,
      -0.5 * diameter,
      -0.5 * diameter
    );
    this.maxEmitBox = new Vector3(
      0.5 * diameter,
      0.5 * diameter,
      0.5 * diameter
    );
    this.minEmitPower = 0.5;
    this.maxEmitPower = 1;
    this.updateSpeed = 0.005;
    this.particleEmitterType = new SphereParticleEmitter(1.2 * diameter, 0.5);
    scene.registerBeforeRender(() => {
      this.emitter = emitter.position;
      // this.changeFactor();
    });
  }

  private changeFactor() {
    const distance = Vector3.Distance(
      this._camera.position,
      this.emitter as Vector3
    );
    const factor = 1 - (distance - 5 * this._diameter) / (20 * this._diameter);
    this.activeParticleCount = this._maxParticleCount * factor;
  }
}
