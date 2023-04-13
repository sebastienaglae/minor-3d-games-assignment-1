import * as GUI from "@babylonjs/gui";

// class UI static singleton
export class UI {
  private static _instance: UI;
  private _advancedTexture: GUI.AdvancedDynamicTexture;
  private _speedText: GUI.TextBlock;

  private constructor() {
    this._advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    this._speedText = new GUI.TextBlock();
    this._speedText.outlineColor = "black";
    this._speedText.text = "0 km/h";
    this._speedText.color = "white";
    this._speedText.width = 1;
    this._speedText.height = 1;
    this._speedText.fontSize = 100;
    this._speedText.outlineWidth = 4;
    this._speedText.top = "25%";
    this._speedText.alpha = 0.5;
    this._speedText.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    this._speedText.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;

    this._advancedTexture.addControl(this._speedText);
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public setSpeed(score: number) {
    this._speedText.text = score.toFixed() + " km/h";
  }
}
