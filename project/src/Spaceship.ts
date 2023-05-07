import {
  AbstractMesh,
  Axis,
  ISceneLoaderAsyncResult,
  PhysicsImpostor,
  Quaternion,
  Scene,
  SceneLoader,
  UniversalCamera,
  Vector3,
  Vector4,
  Matrix,
  Mesh,
  MeshBuilder,
  Space,
} from "@babylonjs/core";
import { Dashboard } from "./Dashboard";
import { TrailsManager } from "./effect/TrailsManager";
import { Utils } from "./utils/Utils";

export class Spaceship {
  private _parentMesh: AbstractMesh;
  private _spaceship: AbstractMesh;
  private _scene: Scene;
  private _camera: UniversalCamera;
  private _speed: number;
  private _speedKm: number;
  private _velocity: Vector3;
  private _maxSpeed: number;
  private _acceleration: number;
  private _deceleration: number;
  private _rotationSpeedHori: number;
  private _rotationSpeedVer: number;
  private _maxRotationSpeed: number;
  private _rotationAcceleration: number;
  private _rotationDeceleration: number;
  private _isGoingUp: boolean;
  private _isGoingDown: boolean;
  private _isGoingLeft: boolean;
  private _isGoingRight: boolean;
  private _isGoingForward: boolean;
  private _isGoingBackward: boolean;
  private _lastPosition = Vector3.Zero();

  private _speedCooldown = 0;
  private _speedRefresh = 0.1;

  private _lastScrollWheel = 0;

  private _rootUrl: string;
  private _sceneFilename: string;
  private _scaleFactor: number = 2;

  private _r: Vector4;
  private _t: number;
  private _projectionMatrix: Matrix;

  private _trailManager: TrailsManager;
  private _dashboard: Dashboard;

  constructor(
    rootUrl: string,
    sceneFilename: string,
    scene: Scene,
    camera: UniversalCamera
  ) {
    this._rootUrl = rootUrl;
    this._sceneFilename = sceneFilename;
    this._scene = scene;
    this._camera = camera;
    this._speed = 0;
    this._speedKm = 0;
    this._velocity = new Vector3(0, 0, 0);
    this._maxSpeed = 75;
    this._acceleration = 0.5;
    this._deceleration = 0.001; // 0.01
    this._rotationSpeedHori = 0;
    this._rotationSpeedVer = 0;
    this._maxRotationSpeed = 0.05;
    this._rotationAcceleration = 0.001;
    this._rotationDeceleration = 0.0005; // 0.0025
    this._isGoingUp = false;
    this._isGoingDown = false;
    this._isGoingLeft = false;
    this._isGoingRight = false;
    this._isGoingForward = false;
    this._isGoingBackward = false;
  }

  public spawn() {
    SceneLoader.ImportMeshAsync(
      "",
      this._rootUrl,
      this._sceneFilename,
      this._scene
    ).then(this.onSpawnSuccess.bind(this), () => {
      console.log("error loading spaceship");
    });
  }

  onSpawnSuccess(result: ISceneLoaderAsyncResult) {
    this._spaceship = result.meshes[0];
    this._setupSpaceship();
    this._setupCamera();

    this._scene.onBeforeRenderObservable.add(() => {
      this._update();
    });

    this._setupKeyboardInput();
    this._setupScrollWheelInput();
    this._projectionMatrix = this._camera.getProjectionMatrix();
    this._r = this._projectionMatrix.getRow(3);
    this._t = 0;

    this._dashboard = new Dashboard(this._scene, this._spaceship);
    this._trailManager = new TrailsManager(
      50,
      this._scene,
      this._spaceship,
      0.1,
      6
    );
    this._trailManager.start();
  }

  private _setupSpaceship() {
    this._parentMesh = MeshBuilder.CreateBox(
      "parentMesh",
      { size: 1 },
      this._scene
    );
    this._parentMesh.position = new Vector3(0, 0, 0);
    this._parentMesh.rotationQuaternion = Quaternion.Identity();

    this._spaceship.parent = this._parentMesh;
    this._parentMesh.physicsImpostor = new PhysicsImpostor(
      this._spaceship,
      PhysicsImpostor.BoxImpostor,
      { mass: 0, restitution: 0.9 },
      this._scene
    );

    this._spaceship.scaling = new Vector3(
      this._scaleFactor,
      this._scaleFactor,
      this._scaleFactor
    );
  }

  private _setupCamera() {
    this._camera.parent = this._spaceship;
    this._camera.position = new Vector3(
      0 * this._scaleFactor,
      0.2 * this._scaleFactor,
      -0.75 * this._scaleFactor
    );
    this._camera.fov = 1;
  }

  private _setupKeyboardInput() {
    this._scene.onKeyboardObservable.add((kbInfo) => {
      switch (kbInfo.type) {
        case 1:
          switch (kbInfo.event.key) {
            case "q":
              this._isGoingLeft = true;
              break;
            case "d":
              this._isGoingRight = true;
              break;
            case "z":
              this._isGoingUp = true;
              break;
            case "s":
              this._isGoingDown = true;
              break;
          }
          break;
        case 2:
          switch (kbInfo.event.key) {
            case "q":
              this._isGoingLeft = false;
              break;
            case "d":
              this._isGoingRight = false;
              break;
            case "z":
              this._isGoingUp = false;
              break;
            case "s":
              this._isGoingDown = false;
              break;
          }
          break;
      }
    });
  }

  private _setupScrollWheelInput() {
    const canvas = this._scene.getEngine().getRenderingCanvas();
    canvas.addEventListener("wheel", (event) => {
      if (event.timeStamp - this._lastScrollWheel > 100) {
        this._lastScrollWheel = event.timeStamp;
        if (event.deltaY > 0) {
          this._isGoingBackward = true;
          setTimeout(() => {
            this._isGoingBackward = false;
          }, 100);
        } else {
          this._isGoingForward = true;
          setTimeout(() => {
            this._isGoingForward = false;
          }, 100);
        }
      }
      if (event.button === 1) {
        this._speed = 0;
      }
    });
  }

  private _update() {
    let isPressed = false;
    // Forward and backward
    if (this._isGoingBackward) {
      this._speed += this._acceleration;
      if (this._speed >= 0) {
        this._speed = 0;
      } else if (this._speed > this._maxSpeed) {
        this._speed = this._maxSpeed;
      }
    }
    if (this._isGoingForward) {
      this._speed -= this._acceleration;
      if (this._speed < -this._maxSpeed) {
        this._speed = -this._maxSpeed;
      }
    }
    // Left and right
    if (this._isGoingRight) {
      isPressed = true;
      this._rotationSpeedHori += this._rotationAcceleration;
      if (this._rotationSpeedHori > this._maxRotationSpeed) {
        this._rotationSpeedHori = this._maxRotationSpeed;
      }
    }
    if (this._isGoingLeft) {
      isPressed = true;
      this._rotationSpeedHori -= this._rotationAcceleration;
      if (this._rotationSpeedHori < -this._maxRotationSpeed) {
        this._rotationSpeedHori = -this._maxRotationSpeed;
      }
    }
    // Up and down
    if (this._isGoingUp) {
      isPressed = true;
      this._rotationSpeedVer += this._rotationAcceleration;
      if (this._rotationSpeedVer > this._maxRotationSpeed) {
        this._rotationSpeedVer = this._maxRotationSpeed;
      }
    }
    if (this._isGoingDown) {
      isPressed = true;
      this._rotationSpeedVer -= this._rotationAcceleration;
      if (this._rotationSpeedVer < -this._maxRotationSpeed) {
        this._rotationSpeedVer = -this._maxRotationSpeed;
      }
    }

    // if (!this._isGoingForward) {
    //   if (this._speed > 0) {
    //     this._speed -= this._deceleration;
    //   }
    // }
    this._velocity = this._parentMesh.forward.scale(-this._speed);

    if (!isPressed) {
      // Horizontal deceleration (left and right)
      if (this._rotationSpeedHori > 0) {
        this._rotationSpeedHori -= this._rotationDeceleration;
        if (this._rotationSpeedHori < 0) {
          this._rotationSpeedHori = 0;
        }
      }
      if (this._rotationSpeedHori < 0) {
        this._rotationSpeedHori += this._rotationDeceleration;
        if (this._rotationSpeedHori > 0) {
          this._rotationSpeedHori = 0;
        }
      }
      // Vertical deceleration (up and down)
      if (this._rotationSpeedVer > 0) {
        this._rotationSpeedVer -= this._rotationDeceleration;
        if (this._rotationSpeedVer < 0) {
          this._rotationSpeedVer = 0;
        }
      }
      if (this._rotationSpeedVer < 0) {
        this._rotationSpeedVer += this._rotationDeceleration;
        if (this._rotationSpeedVer > 0) {
          this._rotationSpeedVer = 0;
        }
      }
      // Speed deceleration
      if (this._speed > 0) {
        this._speed -= this._deceleration;
        if (this._speed < 0) {
          this._speed = 0;
        }
      } else if (this._speed < 0) {
        this._speed += this._deceleration;
        if (this._speed > 0) {
          this._speed = 0;
        }
      }
    }
    this.turnHorizontal(this._rotationSpeedHori);
    this.turnVertical(this._rotationSpeedVer);

    this._parentMesh.moveWithCollisions(this._velocity);
    this._computeSpeedKm();
    this._shakeCamera();

    this._trailManager.changeEmitRate(
      Utils.clamp(0, this._maxSpeed, -this._speed)
    );

    this._updateDashboard();
  }

  private _computeSpeedKm() {
    this._speedCooldown -= this._scene.getEngine().getDeltaTime();
    if (this._speedCooldown > 0) return;
    const distance = Vector3.Distance(
      this._lastPosition,
      this._parentMesh.position
    );
    const speed = (distance * 3600 * (1 / this._speedRefresh)) / 1000;
    this._lastPosition = this._parentMesh.position;
    this._speedCooldown += this._speedRefresh;
    this._speedKm = speed;
  }

  private turnHorizontal(angle: number) {
    const quaternion = Quaternion.RotationAxis(Axis.Y, angle);
    this._parentMesh.rotationQuaternion.multiplyInPlace(quaternion);
  }

  private turnVertical(angle: number) {
    const quaternion = Quaternion.RotationAxis(Axis.X, angle);
    this._parentMesh.rotationQuaternion.multiplyInPlace(quaternion);
  }

  private _shakeCamera() {
    this._r.x +=
      Math.cos(this._t) * 0.01 * Utils.clamp(0, this._maxSpeed, this._speed);
    this._r.y +=
      Math.sin(this._t) * 0.01 * Utils.clamp(0, this._maxSpeed, this._speed);
    this._projectionMatrix.setRowFromFloats(
      3,
      this._r.x,
      this._r.y,
      this._r.z,
      this._r.w
    );
    this._t += 81337.18;
  }

  private _updateDashboard() {
    this._dashboard.setAllEngText(
      Utils.clamp(0, this._maxSpeed, -this._speed) * 100
    );
    this._dashboard.setSpeedText(this._speedKm);
    this._dashboard.updateTime();
    this._dashboard.updateFPSText();
  }
}
