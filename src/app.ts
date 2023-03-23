import {
  ArcRotateCamera,
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
} from "@babylonjs/core";
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { SpaceshipController } from "./SpaceshipController";
import { FireEffect } from "./FireEffect";
import { ToonMaterial } from "./material/ToonMaterial";

// create a class to hold the scene and camera export it
export class App {
  private _canvas: HTMLCanvasElement;
  private _engine: Engine;
  private _scene: Scene;
  private _camera: FreeCamera;

  constructor(canvasElement: string) {
    this._canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
    this._engine = new Engine(this._canvas, true);

    this._scene = new Scene(this._engine);
    var physicsPlugin = new CannonJSPlugin();
    this._scene.enablePhysics(new Vector3(0, -9.81, 0), physicsPlugin);

    // Create a camera that follow
    this._camera = new FreeCamera(
      "camera",
      new Vector3(0, 0, -10),
      this._scene
    );
    //set render camera distance to 20000
    this._camera.maxZ = 20000;

    new HemisphericLight("light1", new Vector3(1, 1, 0), this._scene);

    // create a ground
    const ground = MeshBuilder.CreateGround(
      "ground",
      { width: 6, height: 6 },
      this._scene
    );

    var skybox = MeshBuilder.CreateBox(
      "skyBox",
      { size: 10000.0 },
      this._scene
    );
    var skyboxMaterial = new StandardMaterial("skyBox", this._scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new CubeTexture(
      "obj/skybox/skybox",
      this._scene
    );
    skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
    skyboxMaterial.specularColor = new Color3(0, 0, 0);
    skybox.infiniteDistance = true;
    skybox.material = skyboxMaterial;

    SceneLoader.ImportMeshAsync("", "obj/", "spaceship.glb", this._scene).then(
      (result) => {
        const spaceship = result.meshes[0];
        // create an empty mesh to hold a fire effect at 1 -1.5
        const fireEffect = MeshBuilder.CreateBox("fireEffect", {
          width: 0.1,
          height: 0.1,
          depth: 0.1,
        });
        fireEffect.parent = spaceship;
        fireEffect.position = new Vector3(1, 0, 1.5);
        fireEffect.rotation = new Vector3(90, 0, 0);
        // load the fire effect
        let b1 = new FireEffect(this._scene, fireEffect);
        const fireEffect1 = MeshBuilder.CreateBox("fireEffect1", {
          width: 0.1,
          height: 0.1,
          depth: 0.1,
        });
        fireEffect1.parent = spaceship;
        fireEffect1.position = new Vector3(-1, 0, 1.5);
        fireEffect1.rotation = new Vector3(90, 0, 0);
        // load the fire effect
        let b2 = new FireEffect(this._scene, fireEffect1);
        b1.start();
        b2.start();
        
        new SpaceshipController(spaceship, this._scene, this._camera, [b1,b2]);
      }
    );

    this.createPlanets();
    this._engine.runRenderLoop(() => {
      this._scene.render();
    });

    window.addEventListener("resize", () => {
      this._engine.resize();
    });

    //show debug layer
    this._scene.debugLayer.show();
  }

  private createPlanets() {
    // for each png in /obj/planets create a material and store it
    let planetMaterials = [];
    for (let i = 1; i <= 17; i++) {
      let planetMaterial = ToonMaterial.createMaterial(
        `obj/planets/${i}.png`,
        null,
        null,
        this._scene
      );
      planetMaterials.push(planetMaterial);
    }
    for (let i = 0; i < 200; i++) {
      const sphere = MeshBuilder.CreateSphere(
        "sphere",
        { diameter: Math.random() * 500 },
        this._scene
      );

      let radius = 10000;
      sphere.position.x = Math.random() * radius - radius / 2;
      sphere.position.y = Math.random() * radius - radius / 2;
      sphere.position.z = Math.random() * radius - radius / 2;

      sphere.physicsImpostor = new PhysicsImpostor(
        sphere,
        PhysicsImpostor.SphereImpostor,
        { mass: 0, restitution: 0.9 },
        this._scene
      );

      sphere.material = planetMaterials[Math.floor(Math.random() * 17)];
    }
  }
}

new App("renderCanvas");
