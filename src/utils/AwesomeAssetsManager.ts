import { Scene, AssetsManager } from "@babylonjs/core";

export class AwesomeAssetsManager extends AssetsManager {
  public static _instance: AwesomeAssetsManager;
  private _meshes: any = {};
  private _textures: any = {};
  private _cubeTextures: any = {};

  private constructor(scene: Scene) {
    super(scene);
  }

  public static setupInstance(scene: Scene) {
    if (!this._instance) this._instance = new AwesomeAssetsManager(scene);
  }

  public static getInstance() {
    if (!this._instance)
      throw new Error("AwesomeAssetsManager not initialized");

    return this._instance;
  }

  public addAndStoreMesh(name: string, url: string) {
    const task = this.addMeshTask(name, "", "", url);
    task.onSuccess = (task) => {
      this._meshes[name] = task.loadedMeshes[0];
      console.log("mesh loaded (", name, "): ", task.loadedMeshes[0]);
    };
  }

  public getMesh(name: string) {
    return this._meshes[name];
  }

  public addAndStoreTexture(name: string, url: string) {
    const task = this.addTextureTask(name, url);
    task.onSuccess = (task) => {
      this._textures[name] = task.texture;
      console.log("texture loaded (", name, "): ", task.texture);
    };
  }

  public getTexture(name: string) {
    return this._textures[name];
  }

  public addAndStoreCubeTexture(name: string, url: string) {
    const task = this.addCubeTextureTask(name, url);
    task.onSuccess = (task) => {
      this._cubeTextures[name] = task.texture;
      console.log("texture loaded (", name, "): ", task.texture);
    };
  }

  public getCubeTexture(name: string) {
    return this._cubeTextures[name];
  }
}
