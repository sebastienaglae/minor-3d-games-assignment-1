import { FreeCamera, Mesh, MeshBuilder, Scene, Vector3 } from "@babylonjs/core";
import { CloudEffect } from "./effect/CloudEffect";

export class CloudPlanet {
  private _sphere: Mesh;
  private _diameter: number;
  private _scene: Scene;
  private _position: Vector3;
  private _cloudEffect: CloudEffect;
  private _camera: FreeCamera;

  constructor(
    diameter: number,
    scene: Scene,
    position: Vector3,
    camera: FreeCamera
  ) {
    this._diameter = diameter;
    this._scene = scene;
    this._position = position;
    this._camera = camera;
    this.createSphere();
    this.attachCloudEffect();
    //renderloop move sphere right and left with sin
    this._scene.registerBeforeRender(() => {
      this._sphere.position.x =
        this._position.x +
        Math.sin(this._scene.getEngine().getDeltaTime() / 100);
      this._cloudEffect.emitter = this._sphere.position;
    });
  }

  createSphere() {
    this._sphere = MeshBuilder.CreateSphere(
      "planet",
      { diameter: this._diameter },
      this._scene
    );
    this._sphere.position = this._position;
  }

  attachCloudEffect() {
    this._cloudEffect = new CloudEffect(
      this._scene,
      this._sphere,
        this._diameter,
        this._camera
    );
    this._cloudEffect.start();
  }
}
