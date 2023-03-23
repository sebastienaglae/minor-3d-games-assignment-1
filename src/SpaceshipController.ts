// Create a SIMPLE spaceship controller.
// The player using keyboard can control the spaceship
// Z: go foward
// S: go backward
// Q: turn left
// D: turn right
// A: go up
// E: go down
// When the player press nothing stops moving but it can have a a little of velocity left
// This class will be called by the game engine (app.ts)
// I will provide an abstract mesh (spaceship) and the scene and the camera
// Use onPointerObservable
// The spaceship has a velocity
// Create a method that compute the speed in km/h
// Also the player when moving go faster and faster to a max speed
// Also the rotating speed is set according to the actual speed of the spaceship
// You need to update yourself to the scene

import {
  AbstractMesh,
  ArcRotateCamera,
  FollowCamera,
  FreeCamera,
  Matrix,
  Mesh,
  MeshBuilder,
  PhysicsImpostor,
  PointerEventTypes,
  PointerInfo,
  Quaternion,
  Scene,
  TransformNode,
  Vector2,
  Vector3,
} from "@babylonjs/core";
import { FireEffect } from "./FireEffect";
import { AwesomeFollowCamera } from './AwesomeFollowCamera';

// Keep it simple
export class SpaceshipController {
  // simple
  private _spaceship: AbstractMesh;
  private _scene: Scene;
  private _camera: AwesomeFollowCamera;
  private _speed: number;
  private _velocity: Vector3;
  private _maxSpeed: number;
  private _acceleration: number;
  private _deceleration: number;
  private _rotationSpeed: number;
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
  private _boosters: FireEffect[];

  constructor(
    spaceship: AbstractMesh,
    scene: Scene,
    camera: AwesomeFollowCamera,
    boosters: FireEffect[]
  ) {
    this._spaceship = spaceship;
    this._scene = scene;
    this._camera = camera;
    this._speed = 0;
    this._velocity = new Vector3(0, 0, 0);
    this._maxSpeed = 20;
    this._acceleration = 0.05;
    this._deceleration = 0.01;
    this._rotationSpeed = 0;
    this._maxRotationSpeed = 0.05;
    this._rotationAcceleration = 0.05;
    this._rotationDeceleration = 0.05;
    this._isMoving = false;
    this._isRotating = false;
    this._isGoingUp = false;
    this._isGoingDown = false;
    this._isGoingLeft = false;
    this._isGoingRight = false;
    this._isGoingForward = false;
    this._isGoingBackward = false;
    this._boosters = boosters;
    this._spaceship.physicsImpostor = new PhysicsImpostor(
      this._spaceship,
      PhysicsImpostor.BoxImpostor,
      { mass: 0, restitution: 0.9 },
      this._scene
    );

    this._camera.setDistanceOffset(10)
    // this._camera.setTarget(this._spaceship)

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
    if (this._isGoingForward) {
      isPressed = true;
      this._isMoving = true;
      this._speed += this._acceleration;
      if (this._speed > this._maxSpeed) {
        this._speed = this._maxSpeed;
      }
    }
    //deceleration
    if (this._isGoingBackward) {
      isPressed = true;
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

    if (this._isGoingLeft) {
      isPressed = true;
      this._isRotating = true;
      this._rotationSpeed += this._rotationAcceleration;
      if (this._rotationSpeed > this._maxRotationSpeed) {
        this._rotationSpeed = this._maxRotationSpeed;
      }
      this._spaceship.rotate(Vector3.Up(), this._rotationSpeed);
    }
    if (this._isGoingRight) {
      isPressed = true;
      this._isRotating = true;
      this._rotationSpeed += this._rotationAcceleration;
      if (this._rotationSpeed > this._maxRotationSpeed) {
        this._rotationSpeed = this._maxRotationSpeed;
      }
      this._spaceship.rotate(Vector3.Up(), -this._rotationSpeed);
    }
    if (this._isGoingDown) {
      isPressed = true;
      this._isRotating = true;
      this._rotationSpeed += this._rotationAcceleration;
      if (this._rotationSpeed > this._maxRotationSpeed) {
        this._rotationSpeed = this._maxRotationSpeed;
      }
      this._spaceship.rotate(Vector3.Right(), this._rotationSpeed);
    }
    if (this._isGoingUp) {
      isPressed = true;
      this._isRotating = true;
      this._rotationSpeed += this._rotationAcceleration;
      if (this._rotationSpeed > this._maxRotationSpeed) {
        this._rotationSpeed = this._maxRotationSpeed;
      }
      this._spaceship.rotate(Vector3.Right(), -this._rotationSpeed);
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
      if (this._rotationSpeed > 0) {
        this._rotationSpeed -= this._rotationDeceleration;
      }
    }

    this._spaceship.moveWithCollisions(this._velocity);
    for (let booster of this._boosters) {
      booster.changeEmitRate(this.clamp(this._speed * 30, 10, 600));
    }
    this._moveCamera();
  }

  private _moveCamera() {
    // var maxFov = 2;
    // this._camera.fov = this.clamp(this._speed / 10 + 0.5, 0.8, maxFov);

  }

  private clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
  }
}
