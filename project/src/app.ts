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
import { SpaceshipController } from "./SpaceshipController";
import { FireEffect } from "./effect/FireEffect";
import { ToonMaterial } from "./material/ToonMaterial";
import { AwesomeFollowCamera } from "./AwesomeFollowCamera";
import { UI } from "./ui/UI";
import { AwesomeAssetsManager } from "./utils/AwesomeAssetsManager";
import { CloudEffect } from "./effect/CloudEffect";
import { CloudPlanet } from "./CloudPlanet";

// create a class to hold the scene and camera export it
export class App {
  private _canvas: HTMLCanvasElement;
  private _engine: Engine;
  private _scene: Scene;
  private _camera: AwesomeFollowCamera;
  private _sun: HemisphericLight;

  async setup(canvasElement: string) {
    this._canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
    this._engine = await this.createEngine(this._canvas);
    this._scene = new Scene(this._engine);
    AwesomeAssetsManager.setupInstance(this._scene);
    var physicsPlugin = new CannonJSPlugin();
    this._scene.enablePhysics(new Vector3(0, -9.81, 0), physicsPlugin);

    this.loadAsset();
    AwesomeAssetsManager.getInstance().onFinish = (tasks) => this.loadLogic();
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

  private loadLogic() {
    console.log("load logic");
    this.createCamera();

    this.createWorld();

    this.createSkybox();

    SceneLoader.ImportMeshAsync("", "obj/", "starship.glb", this._scene).then(
      (result) => {
        const spaceship = result.meshes[0];
        const fireEffect = MeshBuilder.CreateBox("fireEffect", {
          width: 0.1,
          height: 0.1,
          depth: 0.1,
        });
        fireEffect.visibility = 0;
        fireEffect.parent = spaceship;
        fireEffect.position = new Vector3(0.6, 0.25, -4.2);
        fireEffect.rotation = new Vector3(90, 0, 0);
        let b1 = new FireEffect(this._scene, fireEffect);
        const fireEffect1 = MeshBuilder.CreateBox("fireEffect1", {
          width: 0.1,
          height: 0.1,
          depth: 0.1,
        });
        fireEffect1.visibility = 0;
        fireEffect1.parent = spaceship;
        fireEffect1.position = new Vector3(-0.56, 0.33, -4.2);
        fireEffect1.rotation = new Vector3(90, 0, 0);
        let b2 = new FireEffect(this._scene, fireEffect1);
        const fireEffect2 = MeshBuilder.CreateBox("fireEffect2", {
          width: 0.1,
          height: 0.1,
          depth: 0.1,
        });
        fireEffect2.visibility = 0;
        fireEffect2.parent = spaceship;
        fireEffect2.position = new Vector3(0, -0.55, -4.2);
        fireEffect2.rotation = new Vector3(90, 0, 0);
        let b3 = new FireEffect(this._scene, fireEffect2);
        b1.start();
        b2.start();
        b3.start();

        new SpaceshipController(spaceship, this._scene, this._camera);
      }
    );

    this.createPlanets();
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
  }

  private createCamera() {
    // Create a camera that follow
    this._camera = new AwesomeFollowCamera(
      "camera",
      Math.PI / 2,
      Math.PI / 2,
      10,
      this._scene
    );
    //set render camera distance to 20000
    this._camera.maxZ = 40000;
    this._camera.position = new Vector3(0, 2, 10);
    //attach input to camera
    //this._camera.attachControl(this._canvas, true);
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
    let planetMaterials = [];
    for (let i = 1; i <= 17; i++) {
      let planetMaterial = ToonMaterial.createMaterial(
        AwesomeAssetsManager.getInstance().getTexture(`planet${i}`),
        this._scene
      );
      planetMaterials.push(planetMaterial);
    }
    for (let i = 0; i < 100; i++) {
      let diameter = Math.random() * 500;
      let radius = 10000;
      let randomPosition = Vector3.Random(-radius, radius);
      const planet = new CloudPlanet(
        diameter,
        this._scene,
        randomPosition,
        this._camera
      );

      planet.setMaterial(planetMaterials[Math.floor(Math.random() * 17)]);
    }
  }
}

new App().setup("renderCanvas");
