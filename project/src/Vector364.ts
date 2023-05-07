import { Vector3 } from '@babylonjs/core';

export class Vector364 {
  private _data: Float64Array;

  constructor(x: number = 0, y: number = 0, z: number = 0) {
    this._data = new Float64Array([x, y, z]);
  }

  public get x(): number {
    return this._data[0];
  }

  public set x(value: number) {
    this._data[0] = value;
  }

  public get y(): number {
    return this._data[1];
  }

  public set y(value: number) {
    this._data[1] = value;
  }

  public get z(): number {
    return this._data[2];
  }

  public set z(value: number) {
    this._data[2] = value;
  }

  public clone(): Vector3 {
    return new Vector3(this.x, this.y, this.z);
  }

  public add(other: Vector3): Vector3 {
    return new Vector3(this.x + other.x, this.y + other.y, this.z + other.z);
  }

  public subtract(other: Vector3): Vector3 {
    return new Vector3(this.x - other.x, this.y - other.y, this.z - other.z);
  }

  public multiplyScalar(scalar: number): Vector3 {
    return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
  }

  public dot(other: Vector3): number {
    return this.x * other.x + this.y * other.y + this.z * other.z;
  }

  public cross(other: Vector3): Vector3 {
    const x = this.y * other.z - this.z * other.y;
    const y = this.z * other.x - this.x * other.z;
    const z = this.x * other.y - this.y * other.x;
    return new Vector3(x, y, z);
  }

  public length(): number {
    return Math.sqrt(this.dot(this.clone()));
  }

  public normalize(): Vector3 {
    const len = this.length();
    if (len === 0) {
      return new Vector3();
    }
    return this.multiplyScalar(1 / len);
  }
}
