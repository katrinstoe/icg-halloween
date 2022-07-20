import Vector from './vector';
import { GroupNode } from './nodes';
import { Rotation, SQT } from './transformation';
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

    /*let angleTime = deltaT*this.angle;

    var c = Math.cos(angleTime);
    var s = Math.sin(angleTime);

    this.groupNode.transform.getMatrix().setVal(0,0, c*this.groupNode.transform.getMatrix().getVal(0,0)-s*this.groupNode.transform.getMatrix().getVal(0,1));
    this.groupNode.transform.getMatrix().setVal(1,0, c*this.groupNode.transform.getMatrix().getVal(1,0)-s*this.groupNode.transform.getMatrix().getVal(1,1));
    this.groupNode.transform.getMatrix().setVal(2,0, c*this.groupNode.transform.getMatrix().getVal(2,0)-s*this.groupNode.transform.getMatrix().getVal(2,1));
    this.groupNode.transform.getMatrix().setVal(0,1, c*this.groupNode.transform.getMatrix().getVal(0,1)-s*this.groupNode.transform.getMatrix().getVal(0,0));
    this.groupNode.transform.getMatrix().setVal(1,1, c*this.groupNode.transform.getMatrix().getVal(1,1)-s*this.groupNode.transform.getMatrix().getVal(1,0));
    this.groupNode.transform.getMatrix().setVal(2,1, c*this.groupNode.transform.getMatrix().getVal(2,1)-s*this.groupNode.transform.getMatrix().getVal(2,0));
  */
    /*if (this.active) {
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          this.groupNode.transform.getMatrix().setVal(row, col, deltaT*this.groupNode.transform.getMatrix().getVal(row,col))
        }
      }
    }*/
   // this.groupNode.transform.getMatrix().getVal()

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