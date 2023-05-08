import { AbstractMesh } from "@babylonjs/core";
import { Planet } from "./Planet";
import { AwesomeAssetsManager } from "./utils/AwesomeAssetsManager";

export class PlanetManager {
  private _planets: Planet[];
  private _scale: number = 1 / 200;
  constructor() {
    this._planets = [];
    let mercury = new Planet(
      "mercury",
      2000 / 4,
      0.0004,
      0.00001,
      4879 * this._scale,
      AwesomeAssetsManager.getTexture("planet1")
    );
    let venus = new Planet(
      "venus",
      3500 / 4,
      0.0035,
      0.00001,
      12104 * this._scale,
      AwesomeAssetsManager.getTexture("planet2")
    );
    let earth = new Planet(
      "earth",
      5000 / 4,
      0.003,
      0.00001,
      12742 * this._scale,
      AwesomeAssetsManager.getTexture("planet3")
    );
    let mars = new Planet(
      "mars",
      7500 / 4,
      0.0024,
      0.00001,
      6779 * this._scale,
      AwesomeAssetsManager.getTexture("planet4")
    );
    let jupiter = new Planet(
      "jupiter",
      10000 / 4,
      0.0013,
      0.00001,
      139820 * this._scale,
      AwesomeAssetsManager.getTexture("planet5")
    );
    let saturn = new Planet(
      "saturn",
      12500 / 4,
      0.009,
      0.00001,
      116460 * this._scale,
      AwesomeAssetsManager.getTexture("planet6")
    );
    let uranus = new Planet(
      "uranus",
      15000 / 4,
      0.0007,
      0.00001,
      50724 * this._scale,
      AwesomeAssetsManager.getTexture("planet7")
    );
    let neptune = new Planet(
      "neptune",
      17500 / 4,
      0.0005,
      0.00001,
      49244 * this._scale,
      AwesomeAssetsManager.getTexture("planet8")
    );
    let pluto = new Planet(
      "pluto",
      20000 / 4,
      0.0004,
      0.00001,
      2376 * this._scale,
      AwesomeAssetsManager.getTexture("planet9")
    );

    this._planets.push(
      mercury,
      venus,
      earth,
      mars,
      jupiter,
      saturn,
      uranus,
      neptune,
      pluto
    );
  }

  public createMeshes(scene) {
    this._planets.forEach((planet) => {
      planet.createMeshes(scene);
    });
  }

  public getPlanets() {
    return this._planets;
  }

  public update(deltaTime) {
    this._planets.forEach((planet) => {
      planet.update(deltaTime);
    });
  }

  public getDistanceMost(mesh: AbstractMesh): number {
    let distance = 0;
    this._planets.forEach((planet) => {
      let planetMesh = planet.getMesh();
      if (planetMesh) {
        let distanceToPlanet = planetMesh.position
          .subtract(mesh.position)
          .length();
        if (distanceToPlanet > distance) {
          distance = distanceToPlanet;
        }
      }
    });
    return distance;
  }

  public getDistanceClosestPlanet(mesh: AbstractMesh): {
    planet: Planet;
    distance: number;
  } {
    let distance = Number.MAX_VALUE;
    let planet = null;
    this._planets.forEach((p) => {
      let planetMesh = p.getMesh();
      if (planetMesh) {
        let distanceToPlanet =
          planetMesh.position.subtract(mesh.position).length() - p.getRadius();
        if (distanceToPlanet < distance) {
          distance = distanceToPlanet;
          planet = p;
        }
      }
    });
    return { planet: planet, distance: distance };
  }

  public disposeAll() {
    this._planets.forEach((planet) => {
      planet.dispose();
    });
  }
}
