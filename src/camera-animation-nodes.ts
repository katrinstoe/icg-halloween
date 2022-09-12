import Vector from './vector';
import {CameraNode, GroupNode} from './nodes';
import {Rotation, Scaling, SQT, Translation} from './transformation';
import Quaternion from './quaternion';
import Matrix from "./matrix";
import Camera from "./camera";

/**
 * Class representing an Animation
 */
class CameraAnimationNode {
  /**
   * Describes if the animation is running
   */
  active: boolean;

  /**
   * Creates a new AnimationNode
   * @param cameraNode The CameraNode to attach to
   */
  constructor(public cameraNode: CameraNode) {
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
export class CameraRotationNode extends CameraAnimationNode{

  /**
   * Creates a new RotationNode
   * @param cameraNode The group node to attach to
   * @param axis The axis to rotate around
   */
  constructor(cameraNode: CameraNode) {
    super(cameraNode);
  }

  /**
   * Advances the animation by deltaT
   * @param deltaT The time difference, the animation is advanced by
   */
  simulate(deltaT: number) {

    if(this.active){
        this.cameraNode.camera.up.x += 0.001*deltaT
        this.cameraNode.camera.up.y -= 0.001*deltaT
    }
  }
}

/**
 * Class representing a Mover Animation
 * @extends AnimationNode
 */
export class CameraDriverNode extends CameraAnimationNode {
  /**
   * The vector to move along
   */
  direction: String;

  /**
   * Creates a new MoverNode
   * @param cameraNode The group node to attach to
   * @param vector The vector to move along
   */
  constructor(cameraNode: CameraNode) {
    super(cameraNode);
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
        this.cameraNode.camera.eye.y += 0.001 * deltaT
        this.cameraNode.camera.center.y += 0.001 * deltaT
      }
      if(this.direction == "down"){
        this.cameraNode.camera.eye.y -= 0.001 * deltaT
        this.cameraNode.camera.center.y -= 0.001* deltaT
      }
      if(this.direction == "left"){
        this.cameraNode.camera.eye.x -= 0.001 * deltaT
        this.cameraNode.camera.center.x -= 0.001 * deltaT
      }
      if(this.direction == "right") {
        this.cameraNode.camera.eye.x += 0.001 * deltaT
        this.cameraNode.camera.center.x += 0.001 * deltaT
      }
      //this.groupNode.transform = new Translation(this.vector);
    }
  }
}

export class CameraTranslatorNode extends CameraAnimationNode{
  cameraNode: CameraNode
  constructor(cameraNode: CameraNode) {
    super(cameraNode)
    this.active = false;
    this.cameraNode = cameraNode;
  }

  simulate(deltaT: number){
    this.cameraNode.camera.eye.x += 0.001*deltaT
    this.cameraNode.camera.center.x += 0.001*deltaT
  }

}
