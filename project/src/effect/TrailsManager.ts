import { Mesh, Vector3 } from "@babylonjs/core";
import { TrailsEffect } from "./TrailsEffect";
import { Utils } from '../utils/Utils';

export class TrailsManager {
  private trails: TrailsEffect[] = [];
  private _radius: number;
  private _distance: number;
  private _maxEmitRate: number = 200;
  private _maxGravity: number = -10;
  constructor(
    trailsCount: number,
    scene: any,
    spaceship: any,
    radius,
    distance
  ) {
    this._radius = radius;
    this._distance = distance;
    for (let i = 0; i < trailsCount; i++) {
      this.trails.push(new TrailsEffect(i.toString(), 200, scene, spaceship));
    }
    this.setEmmitersPosition();
  }

  public start() {
    this.trails.forEach((trail) => {
      trail.start();
    });
  }

  private setEmmitersPosition() {
    let angle = 0;
    let step = (2 * Math.PI) / this.trails.length;
    this.trails.forEach((trail) => {
      if (trail.emitter instanceof Mesh) {
        trail.emitter.position.x = Math.cos(angle) * this._radius;
        trail.emitter.position.y = Math.sin(angle) * this._radius;
        trail.emitter.position.z = this._distance;
        // Change the direction to be like a sun rays
        let direction = new Vector3(5, 5, 1);
        let vector = new Vector3(
          Math.cos(angle) * this._radius * -direction.x,
          Math.sin(angle) * this._radius * -direction.y,
          this._distance * direction.z
        );
        trail.emitter.lookAt(vector);
      } else if (trail.emitter instanceof Vector3) {
        trail.emitter.x = Math.cos(angle) * this._radius;
        trail.emitter.y = Math.sin(angle) * this._radius;
        trail.emitter.z = this._distance;
      }

      angle += step;
    });
  }

  public changeEmitRate(rate: number) {
    this.trails.forEach((trail) => {
        trail.emitRate = this._maxEmitRate * rate;
        trail.gravity = new Vector3(0, 0, this._maxGravity * rate);
    });
  }
}
