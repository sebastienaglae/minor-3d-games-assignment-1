import { Mesh, MeshBuilder, Scene, StandardMaterial, Texture } from '@babylonjs/core';

export class Planet {
  private readonly _name: string;
  private readonly _orbitRadius: number;
  private readonly _orbitSpeed: number;
  private readonly _rotationSpeed: number;
  private readonly _diameter: number;
  private readonly _texturePath: string;
  private _orbitMesh: Mesh | undefined;
  private _planetMesh: Mesh | undefined;

  constructor(
    name: string,
    orbitRadius: number,
    orbitSpeed: number,
    rotationSpeed: number,
    diameter: number,
    texturePath: string
  ) {
    this._name = name;
    this._orbitRadius = orbitRadius;
    this._orbitSpeed = orbitSpeed;
    this._rotationSpeed = rotationSpeed;
    this._diameter = diameter;
    this._texturePath = texturePath;
  }

  public createMeshes(scene: Scene): void {
    const orbit = MeshBuilder.CreateTorus(
      `${this._name}-orbit`,
      {
        diameter: this._orbitRadius * 2,
        thickness: 0.01,
      },
      scene
    );
    orbit.rotation.x = Math.PI / 2;
    this._orbitMesh = orbit;

    const planet = MeshBuilder.CreateSphere(
      `${this._name}-planet`,
      {
        diameter: this._diameter,
      },
      scene
    );
    planet.material = new StandardMaterial(
      `${this._name}-material`,
      scene
    );
    // planet.material.diffuseTexture = new Texture(
    //   this._texturePath,
    //   scene
    // );
    this._planetMesh = planet;
  }

  public update(deltaTime: number): void {
    if (this._orbitMesh && this._planetMesh) {
      this._planetMesh.rotation.y += deltaTime * this._rotationSpeed;
      this._planetMesh.position.x =
        this._orbitRadius * Math.cos((Date.now() / 1000) * this._orbitSpeed);
      this._planetMesh.position.z =
        this._orbitRadius * Math.sin((Date.now() / 1000) * this._orbitSpeed);
    }
  }
}
