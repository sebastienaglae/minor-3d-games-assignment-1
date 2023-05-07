import {
  Camera,
  CannonJSPlugin,
  Color3,
  Engine,
  HemisphericLight,
  MeshBuilder,
  Scene,
  SceneLoader,
  StandardMaterial,
  Texture,
  UniversalCamera,
  Vector3,
  WebGPUEngine,
} from "@babylonjs/core";
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { Spaceship } from "./Spaceship";
import { FireEffect } from "./effect/FireEffect";
import { ToonMaterial } from "./material/ToonMaterial";
import { AwesomeFollowCamera } from "./scrap/AwesomeFollowCamera";
import { AwesomeAssetsManager } from "./utils/AwesomeAssetsManager";
import { CloudPlanet } from "./scrap/CloudPlanet";
import { Planet } from "./Planet";
import { PlanetManager } from "./PlanetManager";

export class App {
  private _canvas: HTMLCanvasElement;
  private _engine: Engine;
  private _scene: Scene;
  private _camera: UniversalCamera;
  private _sun: HemisphericLight;
  private _planets: PlanetManager;

  async setup(canvasElement: string) {
    this._canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
    this._engine = await this.createEngine(this._canvas);
    this._scene = new Scene(this._engine);
    AwesomeAssetsManager.setupInstance(this._scene);
    var physicsPlugin = new CannonJSPlugin();
    this._scene.enablePhysics(new Vector3(0, -9.81, 0), physicsPlugin);

    this.loadAsset();
    AwesomeAssetsManager.getInstance().onFinish = async (tasks) =>
      this.loadLogic();
    AwesomeAssetsManager.getInstance().load();
  }

  async createEngine(canvas: any) {
    const webGPUSupported = await WebGPUEngine.IsSupportedAsync;
    if (webGPUSupported) {
      const engine = new WebGPUEngine(canvas);
      await engine.initAsync();
      return engine;
    }
    return new Engine(canvas, true);
  }

  private async loadLogic() {
    console.log("load logic");
    this.createCamera();

    this.createWorld();

    this.createSkybox();
    this.createPlanets();
    let ship = new Spaceship("obj/", "cockpit.glb", this._scene, this._camera);
    await ship.spawn(this._planets);

    this._engine.runRenderLoop(() => {
      this._scene.render();
    });

    window.addEventListener("resize", () => {
      this._engine.resize();
    });

    this._scene.debugLayer.show();
  }

  private loadAsset() {
    for (let i = 1; i <= 17; i++) {
      AwesomeAssetsManager.getInstance().addAndStoreTexture(
        `planet${i}`,
        `img/planets/${i}.png`
      );
    }
    AwesomeAssetsManager.getInstance().addAndStoreCubeTexture(
      "skyBox",
      "img/skybox/skybox"
    );
    AwesomeAssetsManager.getInstance().addAndStoreTexture(
      "cloud",
      "img/effects/smoke_15.png"
    );
    AwesomeAssetsManager.getInstance().addAndStoreTexture(
      "trails",
      "img/effects/flare.png"
    );
  }

  private createCamera() {
    this._camera = new UniversalCamera(
      "camera",
      new Vector3(0, 0, -10),
      this._scene
    );
    this._camera.maxZ = 100000;
  }

  private createWorld() {
    this._sun = new HemisphericLight(
      "light1",
      new Vector3(1, 1, 0),
      this._scene
    );
  }

  private createSkybox() {
    let skybox = MeshBuilder.CreateBox(
      "skyBox",
      { size: 10000.0 },
      this._scene
    );
    let skyboxMaterial = new StandardMaterial("skyBox", this._scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture =
      AwesomeAssetsManager.getInstance().getCubeTexture("skyBox");
    skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
    skyboxMaterial.specularColor = new Color3(0, 0, 0);
    skybox.material = skyboxMaterial;
    skybox.infiniteDistance = true;
  }

  private createPlanets() {
    this._planets = new PlanetManager();
    this._planets.createMeshes(this._scene);
    this._scene.registerBeforeRender(() => {
      this._planets.update(this._engine.getDeltaTime());
    });
  }
}

new App().setup("renderCanvas");
