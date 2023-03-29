import {
  ArcRotateCamera,
  MeshBuilder,
  Quaternion,
  Vector3,
} from "@babylonjs/core";

export class AwesomeFollowCamera extends ArcRotateCamera {
  setPosLerp(arg0: number) {
    this.sphereTarget.position = Vector3.Lerp(
      this.sphereTarget.position,
      this.realTarget.position.add(this.realTarget.forward.scale(arg0)),
      0.9
    );
  }
  setPos(arg0: number) {
    this.sphereTarget.position = this.realTarget.position.add(
      this.realTarget.forward.scale(arg0)
    );
  }
  getDistance() {
    return this.realTarget.position.subtract(this.sphereTarget.position).length();
  }

  updateRotation() {
    // rotate the sphere to look at the target
    // this.sphereTarget.lookAt(this.realTarget.position, 0, Math.PI, 0);
    // invert rotation of the sphere
    this.sphereTarget.rotation = this.realTarget.rotationQuaternion.toEulerAngles();
    

    
  }

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

  public override setTarget(target: any): void {
    this.realTarget = target;
    this.sphereTarget = MeshBuilder.CreateSphere(
      "subTarget",
      { diameter: 0.1 },
      this.getScene()
    );

    // camera child of the sphereTarget
    this.parent = this.sphereTarget;
  }

  public override update(): void {
    super.update();
  }
}
