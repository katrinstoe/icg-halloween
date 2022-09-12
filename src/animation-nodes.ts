import Vector from './vector';
import { GroupNode } from './nodes';
import {Rotation, Scaling, SQT, Translation} from './transformation';
import Quaternion from './quaternion';
import Matrix from "./matrix";

/**
 * Class representing an Animation
 */
export class AnimationNode {
  /**
   * Describes if the animation is running
   */
  active: boolean;

  /**
   * Creates a new AnimationNode
   * @param groupNode The GroupNode to attach to
   */
  constructor(public groupNode: GroupNode) {
    this.active = true;
  }

  /**
   * Toggles the active state of the animation node
   */
  toggleActive() {
    this.active = !this.active;
  }

}

/**
 * Class representing a Rotation Animation
 * @extends AnimationNode
 */
export class RotationNode extends AnimationNode {
  /**
   * The absolute angle of the rotation
   */
  angle: number;
  /**
   * The vector to rotate around
   */
  axis: Vector;

  /**
   * Creates a new RotationNode
   * @param groupNode The group node to attach to
   * @param axis The axis to rotate around
   */
  constructor(groupNode: GroupNode, axis: Vector) {
    super(groupNode);
    this.angle = 0;
    this.axis = axis;
  }

  /**
   * Advances the animation by deltaT
   * @param deltaT The time difference, the animation is advanced by
   */
  simulate(deltaT: number) {

    if(this.active){
        this.angle += 0.005 * deltaT;
        this.groupNode.transform = new Rotation(this.axis, this.angle);
    }
  }
}

/**
 * Class representing a Rotation Animation
 * @extends AnimationNode
 */
export class SlerpNode extends AnimationNode {
  /**
   * The time
   */
  t: number;

  /**
   * The rotations to interpolate between
   */
  rotations: [Quaternion, Quaternion];

  /**
   * Creates a new RotationNode
   * @param groupNode The group node to attach to
   * @param axis The axis to rotate around
   */
  constructor(groupNode: GroupNode, rotation1: Quaternion, rotation2: Quaternion) {
    super(groupNode);
    this.rotations = [rotation1, rotation2];
    this.t = 0;
  }

  /**
   * Advances the animation by deltaT
   * @param deltaT The time difference, the animation is advanced by
   */
  simulate(deltaT: number) {
    if (this.active) {
      this.t += 0.001 * deltaT;
      const rot = this.rotations[0].slerp(this.rotations[1], (Math.sin(this.t) + 1) / 2);
      (this.groupNode.transform as SQT).rotation = rot;
    }
  }

}

/**
 * Class representing a Scaler Animation
 * @extends AnimationNode
 */
export class ScalerNode extends AnimationNode {
  /**
   * The vector to scale along
   */
  vector: Vector;
  zoom: String;

  /**
   * Creates a new ScalerNode
   * @param groupNode The group node to attach to
   * @param vector The vector to scale along
   */
  constructor(groupNode: GroupNode, vector: Vector) {
    super(groupNode);
    this.vector = vector
    this.active = false;
    this.zoom = "in";
  }

  /**
   * Advances the animation by deltaT
   * @param deltaT The time difference, the animation is advanced by
   */
  simulate(deltaT: number) {

    if(this.active){
      if(this.zoom == "in"){
        this.vector.x += 0.001 * deltaT
        this.vector.y += 0.001 * deltaT
        this.vector.z += 0.001 * deltaT
      }
      if(this.zoom == "out"){
        this.vector.x -= 0.001 * deltaT
        this.vector.y -= 0.001 * deltaT
        this.vector.z -= 0.001 * deltaT
      }
      this.groupNode.transform = new Scaling(this.vector);
    }
  }
}

export class MinMaxNode extends AnimationNode {
  /**
   * The vector to scale along
   */
  vector: Vector;
  zoom: String;
  limit = 3000;
  currentlimit = 0;
  startSize = new Vector(0.5,0.5,0.5,0);
  endSize = new Vector(1,1,1,0);
  factor: number;


  /**
   * Creates a new ScalerNode
   * @param groupNode The group node to attach to
   * @param startSize
   * @param endSize
   */
  constructor(groupNode: GroupNode, startSize: Vector, endSize: Vector, duration: number) {
    super(groupNode);
    this.startSize = startSize;
    this.endSize = endSize;
    this.active = false;
    this.zoom = "in";
    this.groupNode.transform = new Scaling(this.startSize);
    this.limit = duration;
  }

  /**
   * Advances the animation by deltaT
   * @param deltaT The time difference, the animation is advanced by
   */
  simulate(deltaT: number) {
    if (this.active){
      this.currentlimit += deltaT;
    }
    this.factor = this.currentlimit/this.limit;
    if(this.currentlimit>=this.limit){
      if(this.zoom == "out"){
        this.zoom = "in";
      } else {
        this.zoom = "out";
      };
      this.active=false;
      this.currentlimit = 0;
    }
    if (this.active) {
      if (this.zoom == "in") {
        this.vector = this.endSize.mul(this.factor).add(this.startSize.mul(1-this.factor));
        /*this.vector.x += this.startSize.x * (this.factor) + this.endSize.x * (1-this.factor);
        this.vector.y += this.startSize.y * (this.factor) + this.endSize.y * (1-this.factor);
        this.vector.z += this.startSize.z * (this.factor) + this.endSize.z * (1-this.factor);*/
      }
      if (this.zoom == "out") {
        this.vector = this.startSize.mul(this.factor).add(this.endSize.mul(1-this.factor));
        /*this.vector.x -= 0.001 * deltaT
        this.vector.y -= 0.001 * deltaT
        this.vector.z -= 0.001 * deltaT*/
      }
      this.groupNode.transform = new Scaling(this.vector);
    }
  }
}


/**
 * Class representing a Mover Animation
 * @extends AnimationNode
 */
export class DriverNode extends AnimationNode {
  /**
   * The vector to move along
   */
  vector: Vector;
  direction: String;

  /**
   * Creates a new MoverNode
   * @param groupNode The group node to attach to
   * @param vector The vector to move along
   */
  constructor(groupNode: GroupNode, vector: Vector) {
    super(groupNode);
    this.vector = vector;
    this.active = false;
    this.direction = "up"
  }

  /**
   * Advances the animation by deltaT
   * @param deltaT The time difference, the animation is advanced by
   */
  simulate(deltaT: number) {

    if(this.active){
      if(this.direction == "up"){
        this.vector.y += 0.001 * deltaT;
      }
      if(this.direction == "down"){
        this.vector.y -= 0.001 * deltaT;
      }
      if(this.direction == "left"){
        this.vector.x -= 0.001 * deltaT;
      }
      if(this.direction == "right"){
        this.vector.x += 0.001 * deltaT;
      }
      this.groupNode.transform = new Translation(this.vector);
    }
  }
}
/**
 * Class representing a Mover Animation
 * @extends AnimationNode
 */
export class TranslatorNode extends AnimationNode {
  /**
   * The vector to move along
   */
  vector: Vector;
  direction: String;

  /**
   * Creates a new MoverNode
   * @param groupNode The group node to attach to
   * @param vector The vector to move along
   */
  constructor(groupNode: GroupNode, vector: Vector, direction: String) {
    super(groupNode);
    this.vector = vector;
    this.active = false;
    this.direction = direction
  }

  /**
   * Advances the animation by deltaT
   * @param deltaT The time difference, the animation is advanced by
   */
  simulate(deltaT: number) {

    if(this.active){
      if(this.direction == "up"){
        this.vector.y += 0.001 * deltaT;
      }
      if(this.direction == "down"){
        this.vector.y -= 0.001 * deltaT;
      }
      if(this.direction == "left"){
        this.vector.x += 0.001 * deltaT;
      }
      if(this.direction == "right"){
        this.vector.x -= 0.001 * deltaT;
      }
      this.groupNode.transform = new Translation(this.vector);
    }
  }
}
