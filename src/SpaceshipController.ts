import {
  AbstractMesh,
  PhysicsImpostor,
  PointerEventTypes,
  Scene,
  Vector3,
} from "@babylonjs/core";
import { FireEffect } from "./FireEffect";
import { AwesomeFollowCamera } from "./AwesomeFollowCamera";
import { UI } from './UI';

export class SpaceshipController {
  private _spaceship: AbstractMesh;
  private _scene: Scene;
  private _camera: AwesomeFollowCamera;
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
  private _isMoving: boolean;
  private _isRotating: boolean;
  private _isGoingUp: boolean;
  private _isGoingDown: boolean;
  private _isGoingLeft: boolean;
  private _isGoingRight: boolean;
  private _isGoingForward: boolean;
  private _isGoingBackward: boolean;
  private _lastPosition = Vector3.Zero();
  private _lastLeftRight: string | "right" | "left" = "";
  private _lastLeftUpDown: string | "up" | "down" = "";

  constructor(
    spaceship: AbstractMesh,
    scene: Scene,
    camera: AwesomeFollowCamera
  ) {
    this._spaceship = spaceship;
    this._scene = scene;
    this._camera = camera;
    this._speed = 0;
    this._speedKm = 0;
    this._velocity = new Vector3(0, 0, 0);
    this._maxSpeed = 20;
    this._acceleration = 0.05;
    this._deceleration = 0.01;
    this._rotationSpeedHori = 0;
    this._rotationSpeedVer = 0;
    this._maxRotationSpeed = 0.05;
    this._rotationAcceleration = 0.005;
    this._rotationDeceleration = 0.0025;
    this._isMoving = false;
    this._isRotating = false;
    this._isGoingUp = false;
    this._isGoingDown = false;
    this._isGoingLeft = false;
    this._isGoingRight = false;
    this._isGoingForward = false;
    this._isGoingBackward = false;
    this._spaceship.physicsImpostor = new PhysicsImpostor(
      this._spaceship,
      PhysicsImpostor.BoxImpostor,
      { mass: 0, restitution: 0.9 },
      this._scene
    );

    this._camera.setTarget(this._spaceship);

    this._scene.onBeforeRenderObservable.add(() => {
      this._update();
    });

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

    this._scene.onPointerObservable.add((pointerInfo) => {
      switch (pointerInfo.type) {
        case PointerEventTypes.POINTERDOWN:
          switch (pointerInfo.event.button) {
            case 0:
              this._isGoingForward = true;
              break;
            case 2:
              this._isGoingBackward = true;
              break;
          }
          break;
        case PointerEventTypes.POINTERUP:
          switch (pointerInfo.event.button) {
            case 0:
              this._isGoingForward = false;
              break;
            case 2:
              this._isGoingBackward = false;
              break;
          }
          break;
      }
    });
  }

  private _update() {
    let isPressed = false;
    if (this._isGoingBackward) {
      this._isMoving = true;
      this._speed += this._acceleration;
      if (this._speed > this._maxSpeed) {
        this._speed = this._maxSpeed;
      }
    }
    if (this._isGoingForward) {
      this._isMoving = true;
      this._speed -= this._acceleration;
      if (this._speed < -this._maxSpeed) {
        this._speed = -this._maxSpeed;
      }
    }
    if (!this._isGoingForward && !this._isGoingBackward) {
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

    if (this._isGoingRight) {
      isPressed = true;
      this._lastLeftRight = "right";
      this._isRotating = true;
      this._rotationSpeedHori += this._rotationAcceleration;
      if (this._rotationSpeedHori > this._maxRotationSpeed) {
        this._rotationSpeedHori = this._maxRotationSpeed;
      }
      this._spaceship.rotate(Vector3.Up(), this._rotationSpeedHori);
    }
    if (this._isGoingLeft) {
      isPressed = true;
      this._lastLeftRight = "left";
      this._isRotating = true;
      this._rotationSpeedHori += this._rotationAcceleration;
      if (this._rotationSpeedHori > this._maxRotationSpeed) {
        this._rotationSpeedHori = this._maxRotationSpeed;
      }
      this._spaceship.rotate(Vector3.Up(), -this._rotationSpeedHori);
    }

    if (this._isGoingUp) {
      isPressed = true;
      this._lastLeftUpDown = "up";
      this._isRotating = true;
      this._rotationSpeedVer += this._rotationAcceleration;
      if (this._rotationSpeedVer > this._maxRotationSpeed) {
        this._rotationSpeedVer = this._maxRotationSpeed;
      }
      this._spaceship.rotate(Vector3.Right(), this._rotationSpeedVer);
    }
    if (this._isGoingDown) {
      isPressed = true;
      this._lastLeftUpDown = "down";
      this._isRotating = true;
      this._rotationSpeedVer += this._rotationAcceleration;
      if (this._rotationSpeedVer > this._maxRotationSpeed) {
        this._rotationSpeedVer = this._maxRotationSpeed;
      }
      this._spaceship.rotate(Vector3.Right(), -this._rotationSpeedVer);
    }

    if (!this._isGoingForward) {
      if (this._speed > 0) {
        this._speed -= this._deceleration;
      }
    }
    this._velocity = this._spaceship.forward.scale(-this._speed);

    if (!isPressed) {
      this._isMoving = false;
      this._isRotating = false;
      if (this._rotationSpeedHori > 0) {
        this._rotationSpeedHori -= this._rotationDeceleration;
        if (this._rotationSpeedHori < 0) {
          this._rotationSpeedHori = 0;
        }
        if (this._lastLeftRight === "right") {
          this._spaceship.rotate(Vector3.Up(), this._rotationSpeedHori);
        }
        if (this._lastLeftRight === "left") {
          this._spaceship.rotate(Vector3.Up(), -this._rotationSpeedHori);
        }
      }
      if (this._rotationSpeedVer > 0) {
        this._rotationSpeedVer -= this._rotationDeceleration;
        if (this._rotationSpeedVer < 0) {
          this._rotationSpeedVer = 0;
        }
        if (this._lastLeftUpDown === "up") {
          this._spaceship.rotate(Vector3.Right(), this._rotationSpeedVer);
        }
        if (this._lastLeftUpDown === "down") {
          this._spaceship.rotate(Vector3.Right(), -this._rotationSpeedVer);
        }
      }
    }

    this._spaceship.moveWithCollisions(this._velocity);
    this._moveCamera();
    this._computeSpeedKm();
    UI.Instance.setSpeed(this._speedKm);
  }

  private _computeSpeedKm() {
    const distance = Vector3.Distance(
      this._lastPosition,
      this._spaceship.position
    );
    const time = this._scene.getEngine().getDeltaTime() / 1000;
    const speed = (distance / time) * 3.6;
    this._lastPosition = this._spaceship.position;
    this._speedKm = speed;
  }

  private _moveCamera() {
    var maxFov = 2;
    this._camera.fov = this.clamp(this._speed / 10 + 0.5, 0.8, maxFov);

    this._camera.setPosLerp(3);

    this._camera.updateRotation();
  }

  private clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
  }
}
