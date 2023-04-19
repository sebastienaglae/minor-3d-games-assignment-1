import {
  ArcRotateCamera,
  AssetsManager,
  Camera,
  CannonJSPlugin,
  Color3,
  CubeTexture,
  Engine,
  FollowCamera,
  FreeCamera,
  HemisphericLight,
  MeshBuilder,
  PhysicsImpostor,
  Scene,
  SceneLoader,
  StandardMaterial,
  Texture,
  Vector3,
  WebGPUEngine,
} from "@babylonjs/core";
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { CloudEffect } from "./effect/CloudEffect";
import { CloudPlanet } from "./CloudPlanet";

// create a class to hold the scene and camera export it
export class App {
  private _canvas: HTMLCanvasElement;
  private _engine: Engine;
  private _scene: Scene;
  private _camera: FreeCamera;
  private _sun: HemisphericLight;

  async setup(canvasElement: string) {
    this._canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
    this._engine = await this.createEngine(this._canvas);
    this._scene = new Scene(this._engine);
    var physicsPlugin = new CannonJSPlugin();
    this._scene.enablePhysics(new Vector3(0, -9.81, 0), physicsPlugin);
    this.setupCamera();
    this.createWorld();
    this.createCloudSphere();

    this._engine.runRenderLoop(() => {
      this._scene.render();
    });

    window.addEventListener("resize", () => {
      this._engine.resize();
    });

    this._scene.debugLayer.show();
  }

  createCloudSphere() {
    const planet1 = new CloudPlanet(
      2,
      this._scene,
      new Vector3(5, 5, 0),
      this._camera
    );
    const planet2 = new CloudPlanet(
      10,
      this._scene,
      new Vector3(-5, 5, 0),
      this._camera
    );
  }
  // Create sphere
  setupCamera() {
    this._camera = new FreeCamera(
      "camera1",
      new Vector3(0, 5, -10),
      this._scene
    );
    this._camera.attachControl(this._canvas, true);
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

  private createWorld() {
    this._sun = new HemisphericLight(
      "light1",
      new Vector3(1, 1, 0),
      this._scene
    );

    const ground = MeshBuilder.CreateGround(
      "ground",
      { width: 60, height: 60 },
      this._scene
    );
  }
}

new App().setup("renderCanvas");
