import {
  AbstractMesh,
  Color4,
  Mesh,
  MeshBuilder,
  Particle,
  ParticleSystem,
  Texture,
  Vector3,
} from "@babylonjs/core";
import { AwesomeAssetsManager } from "../utils/AwesomeAssetsManager";

export class TrailsEffect extends ParticleSystem {
  constructor(
    name: string,
    capacity: number,
    scene: any,
    spaceShip: AbstractMesh
  ) {
    super(name, capacity, scene);
    var box = MeshBuilder.CreateBox("box", { size: 0.01 }, scene);

    this.particleTexture =
      AwesomeAssetsManager.getInstance().getTexture("trails");

    box.parent = spaceShip;
    this.emitter = box;
    this.isLocal = true;

    this.minEmitBox = new Vector3(0, 0, 0);
    this.maxEmitBox = new Vector3(0, 0, 0);
    this.color1 = new Color4(1, 1, 0.7, 1.0);
    this.color2 = new Color4(1, 1, 0.2, 1.0);
    this.colorDead = new Color4(0.2, 0.2, 0, 0.0);
    this.minSize = 0.1;
    this.maxSize = 0.5;
    this.minLifeTime = 0.3;
    this.maxLifeTime = 1.5;
    this.emitRate = 200;
    this.blendMode = ParticleSystem.BLENDMODE_ONEONE;
    this.gravity = new Vector3(0, 0, -10);
    this.direction1 = new Vector3(-1, 4, 1);
    this.direction2 = new Vector3(1, 4, -1);
    this.minEmitPower = 0;
    this.maxEmitPower = 0;
    this.updateSpeed = 0.005;
    }
}
