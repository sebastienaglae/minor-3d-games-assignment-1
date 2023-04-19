import {
  ArcRotateCamera,
  MeshBuilder,
  Quaternion,
  Vector3,
} from "@babylonjs/core";

export class AwesomeFollowCamera extends ArcRotateCamera {
  private realTarget: any;
  private sphereTarget: any;

  constructor(
    name: string,
    alpha: number,
    beta: number,
    radius: number,
    scene: any,
    setActiveOnSceneIfNoneActive = true
  ) {
    super(
      name,
      alpha,
      beta,
      radius,
      Vector3.Zero(),
      scene,
      setActiveOnSceneIfNoneActive
    );
    this.alpha = alpha;
    this.beta = beta;
    this.radius = radius;
    this.realTarget = null;
  }

  setPosLerp(arg0: number) {
    this.sphereTarget.position = Vector3.Lerp(
      this.sphereTarget.position,
      this.realTarget.position.add(this.realTarget.forward.scale(arg0)),
      0.5
    );
  }

  setPos(arg0: number) {
    this.sphereTarget.position = this.realTarget.position.add(
      this.realTarget.forward.scale(arg0)
    );
  }

  getDistance() {
    return this.realTarget.position
      .subtract(this.sphereTarget.position)
      .length();
  }

  updateRotation() {
    this.sphereTarget.rotation =
      this.realTarget.rotationQuaternion.toEulerAngles();
  }

  public override setTarget(target: any): void {
    this.realTarget = target;
    this.sphereTarget = MeshBuilder.CreateSphere(
      "subTarget",
      { diameter: 0.1 },
      this.getScene()
    );
    this.sphereTarget.visibility = 0;

    this.parent = this.sphereTarget;
  }

  public override update(): void {
    super.update();
  }
}
