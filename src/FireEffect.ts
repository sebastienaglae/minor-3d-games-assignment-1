import {
  Color4,
  ParticleSystem,
  Scene,
  Texture,
  Vector3,
} from "@babylonjs/core";

export class FireEffect extends ParticleSystem {
  constructor(scene: Scene, emitter: any) {
    super("fire", 2000, scene);

    //Texture of each particle
    this.particleTexture = new Texture("obj/flare.png", scene);

    // Where the particles come from
    this.emitter = emitter; // the starting object, the emitter
    this.minEmitBox = new Vector3(-0.25, 1, -0.25); // Starting all from
    this.maxEmitBox = new Vector3(0.25, 1, 0.25); // To...

    // Colors of all particles
    this.color1 = new Color4(1, 0.5, 0, 1.0);
    this.color2 = new Color4(1, 0.5, 0, 1.0);
    this.colorDead = new Color4(0, 0, 0, 0.0);

    this.minSize = 0.3;
    this.maxSize = 1;

    this.minLifeTime = 0.2;
    this.maxLifeTime = 0.4;

    this.emitRate = 0;

    this.blendMode = ParticleSystem.BLENDMODE_ONEONE;

    this.gravity = new Vector3(0, 0, 0);

    this.direction1 = new Vector3(0, 4, 0);
    this.direction2 = new Vector3(0, 4, 0);

    this.minAngularSpeed = 0;
    this.maxAngularSpeed = Math.PI;

    this.minEmitPower = 1;
    this.maxEmitPower = 3;
    this.updateSpeed = 0.007;
  }

  public changeEmitRate(rate: number) {
    this.emitRate = rate;
  }
}
