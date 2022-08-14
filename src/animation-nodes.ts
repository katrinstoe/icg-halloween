import Vector from './vector';
import { GroupNode } from './nodes';
import {Rotation, Scaling, SQT, Translation} from './transformation';
import Quaternion from './quaternion';
import Matrix from "./matrix";

/**
 * Class representing an Animation
 */
class AnimationNode {
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
        this.angle += 0.001 * deltaT;
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

  /**
   * Creates a new ScalerNode
   * @param groupNode The group node to attach to
   * @param vector The vector to scale along
   */
  constructor(groupNode: GroupNode, vector: Vector) {
    super(groupNode);
    this.vector = vector
  }

  /**
   * Advances the animation by deltaT
   * @param deltaT The time difference, the animation is advanced by
   */
  simulate(deltaT: number) {

    if(this.active){
      this.vector.x += 0.001 * deltaT
      this.vector.y += 0.001 * deltaT
      this.vector.z += 0.001 * deltaT
      this.groupNode.transform = new Scaling(this.vector);
    }
  }
}

/**
 * Class representing a Mover Animation
 * @extends AnimationNode
 */
export class MoverNode extends AnimationNode {
  /**
   * The vector to move along
   */
  vector: Vector;

  /**
   * Creates a new MoverNode
   * @param groupNode The group node to attach to
   * @param vector The vector to move along
   */
  constructor(groupNode: GroupNode, vector: Vector) {
    super(groupNode);
    this.vector = vector;
  }

  /**
   * Advances the animation by deltaT
   * @param deltaT The time difference, the animation is advanced by
   */
  simulate(deltaT: number) {

    if(this.active){
      this.vector.x += 0.001 * deltaT;
      this.vector.y += 0.001 * deltaT;
      this.vector.z += 0.001 * deltaT;
      this.groupNode.transform = new Translation(this.vector);
    }
  }
}

/**
 * Class representing a Driver Animation
 * @extends AnimationNode
 */
export class DriverNode extends AnimationNode {
  /**
   * The vector to rotate around
   */
  input: Vector;

  /**
   * Creates a new DriverNode
   * @param groupNode The group node to attach to
   */
  constructor(groupNode: GroupNode) {
    super(groupNode);
  }

  /**
   * Advances the animation by deltaT
   * @param deltaT The time difference, the animation is advanced by
   */
  simulate(deltaT: number) {

    if (this.active) {
      //this.groupNode.transform = new Translation(direction);
    }
  }}