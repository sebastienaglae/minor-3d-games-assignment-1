import {
  AbstractMesh,
  Color4,
  GPUParticleSystem,
  MeshBuilder,
  ParticleSystem,
  Scene,
  Texture,
  Vector3,
} from "@babylonjs/core";
import { AwesomeAssetsManager } from "../utils/AwesomeAssetsManager";

export class CloudEffect extends GPUParticleSystem {
  private _meshSpace: AbstractMesh;
  private _maxEmitRate: number;

  constructor(scene: Scene, meshSpace: AbstractMesh) {
    super("cloud", { capacity: 1500 }, scene);
    if (!GPUParticleSystem.IsSupported) {
      throw new Error("GPUParticleSystem is not supported");
    }
    this._meshSpace = meshSpace;

    let emitter = MeshBuilder.CreateBox("cloud", {
      size: 1,
    });
    emitter.visibility = 0;
    emitter.parent = meshSpace;
    this.emitter = emitter;
    this.isLocal = true;
    this.emitter.position = new Vector3(0, 0, 5);

    this.particleTexture = AwesomeAssetsManager.getTexture("cloud");

    this.color1 = new Color4(0.8, 0.8, 0.8, 0.5);
    this.color2 = new Color4(0.95, 0.95, 0.95, 0.4);
    this.colorDead = new Color4(0.9, 0.9, 0.9, 0.3);
    this.minSize = 1.5;
    this.maxSize = 2.5;
    this.minLifeTime = 0.1;
    this.maxLifeTime = 1.2;
    this.emitRate = 0;
    this._maxEmitRate = 600;
    this.blendMode = ParticleSystem.BLENDMODE_STANDARD;
    this.gravity = new Vector3(0, 0, 0);
    this.direction1 = new Vector3(0, 0, 0);
    this.direction2 = new Vector3(0, 0, 0);
    this.minAngularSpeed = -2;
    this.maxAngularSpeed = 2;
    this.minEmitBox = new Vector3(-5, -4, -0.5);
    this.maxEmitBox = new Vector3(5, 4, 0.5);
    this.minEmitPower = 0.5;
    this.maxEmitPower = 1;
    this.updateSpeed = 0.005;
  }

  public changeEmitRate(rate: number) {
    this.emitRate = rate * this._maxEmitRate;
    if (rate <= 0) {
      this.reset();
    }
  }
}
