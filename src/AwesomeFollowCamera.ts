// Do a camera based on a free camera that follow a target and stay always behind it (rotate to saty a t the back)
// There is velocity and acceleration to make the camera move smoothly like a follow camera
// keep it simple
// don't do getter and setter for now
// Do a class that extends FreeCamera
// Add an heigh offset
// Add distance offset
// Don't based this script on the spaceship
// Do a simple script that follow a target

import {
  AbstractMesh,
  ArcRotateCamera,
  FreeCamera,
  Mesh,
  MeshBuilder,
  Scene,
  TransformNode,
  Vector3,
} from "@babylonjs/core";

export class AwesomeFollowCamera extends ArcRotateCamera {
  private _heightOffset: number;
  private _distanceOffset: number;
  private subTarget: AbstractMesh;

  constructor(
    name: string,
    alpha: number,
    beta: number,
    radius: number,
    scene: Scene
  ) {
    super(name, alpha, beta, radius, null, scene);
  }

  public setTarget(target: AbstractMesh) {
    // super.setTarget(target);
    this.subTarget = target;
  }


  public update() {
    super.update();

    if (!this.subTarget) {
      return;
    }

    // Use the camera direction to always see the target. Don't move the camera using the position. The camera is stationary
    let direction = this.getDirection(new Vector3(0, 0, 0));
    direction.normalize();

    

  }

  public getHeightOffset(): number {
    return this._heightOffset;
  }

  public setHeightOffset(value: number) {
    this._heightOffset = value;
  }

  public getDistanceOffset(): number {
    return this._distanceOffset;
  }

  public setDistanceOffset(value: number) {
    this._distanceOffset = value;
  }
}
