/**
 * Class representing an Animation
 */
import {GroupNode} from "./nodes";
import Vector from "../mathOperations/vector";
import {Rotation, Scaling, SQT, Translation} from "../mathOperations/transformation";
import Quaternion from "../mathOperations/quaternion";


export class AnimationNode {
  /**
   * Beschreibt, ob die Animation läuft
   */
  active: boolean;

  /**
   * Kreiert eine neue AnimationNode
   * @param groupNode Die GroupNode, an die die
   * AnimationNode angefügt werden soll
   */
  constructor(public groupNode: GroupNode) {
    this.active = true;
  }

  /**
   * Ändert den Aktiv-Status der AnimationNode
   */
  toggleActive() {
    this.active = !this.active;
  }

}

/**
 * Klasse, die eine Rotations Animation repräsentiert
 * @extends AnimationNode
 */
export class RotationNode extends AnimationNode {
  /**
   * Der absolute Winkel der Rotation
   */
  angle: number;
  /**
   * Der Vector, um den herum rotiert werden soll
   */
  axis: Vector;

  /**
   * Kreiert eine neue RotationNode
   * @param groupNode Die GroupNode, an die die
   * AnimationNode angefügt werden soll
   * @param axis Die Achse, um die rotiert werden
   * soll
   */
  constructor(groupNode: GroupNode, axis: Vector) {
    super(groupNode);
    this.angle = 0;
    this.axis = axis;
  }

  /**
   * Treibt die Animation um deltaT voran
   * @param deltaT Der Zeitunterschied, um den die Animation
   * vorangetrieben wird
   */
  simulate(deltaT: number) {

    if(this.active){
        this.angle += 0.001 * deltaT;
        this.groupNode.transform = new Rotation(this.axis, this.angle);
    }
  }
}

/**
 * Klasse, die eine Rotations Animation mithilfe von Slerp
 * repräsentiert
 * @extends AnimationNode
 */
export class SlerpNode extends AnimationNode {
  /**
   * Die Zeit
   */
  t: number;

  /**
   * Die Rotationen, zwischen denen interpoliert
   * werden soll
   */
  rotations: [Quaternion, Quaternion];

  /**
   * Kreiert eine neue RotationNode
   * @param groupNode Die GroupNode, an die die
   * AnimationNode angefügt werden soll
   * @param rotation1 die 1. Rotation
   * soll
   * @param rotation2 die 2. Rotation
   */
  constructor(groupNode: GroupNode, rotation1: Quaternion, rotation2: Quaternion) {
    super(groupNode);
    this.rotations = [rotation1, rotation2];
    this.t = 0;
  }

  /** Treibt die Animation um deltaT voran
   * @param deltaT Der Zeitunterschied, um den die Animation
   * vorangetrieben wird
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
 * Klasse, die eine ScalerAnimation repräsentiert
 * @extends AnimationNode
 */
export class ScalerNode extends AnimationNode {
  /**
   * Der Vector, an dem entlang gescalet wird
   */
  vector: Vector;
  zoom: String;

  /**
   * Kreiert eine neue ScalerNode
   * @param groupNode Die GroupNode, an die die
   * AnimationNode angefügt werden soll
   * @param vector Der Vector, an dem entlang gescalet wird
   */
  constructor(groupNode: GroupNode, vector: Vector) {
    super(groupNode);
    this.vector = vector
    this.active = false;
    this.zoom = "in";
  }

  /**
   * Treibt die Animation um deltaT voran
   * @param deltaT Der Zeitunterschied, um den die Animation
   * vorangetrieben wird
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


/**
 * Klasse die eine Scaler Animation mit maximaler
 * und minimaler Größe repräsentiert
 */
export class MinMaxNode extends AnimationNode {
  /**
   * Der Vector, an dem entlang gescalet wird
   */
  vector: Vector;
  zoom: String;
  limit = 3000;
  currentlimit = 0;
  /**
   * Die Startgröße
   */
  startSize = new Vector(0.5,0.5,0.5,0);

  /**
   * Die Endgröße
   */
  endSize = new Vector(1,1,1,0);
  factor: number;


  /**
   * Kreiert eine neue MinMaxNode
   * @param groupNode Die GroupNode, an die die
   * AnimationNode angefügt werden soll
   * @param startSize die Startgröße
   * @param endSize die Endgröße
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
   * Treibt die Animation um deltaT voran
   * @param deltaT Der Zeitunterschied, um den die Animation
   * vorangetrieben wird
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
      }
      if (this.zoom == "out") {
        this.vector = this.startSize.mul(this.factor).add(this.endSize.mul(1-this.factor));
      }
      this.groupNode.transform = new Scaling(this.vector);
    }
  }
}


/**
 * Klasse, die eine Driver Animation repräsentiert
 * Die Klasse kann auch als Translator Node genutzt werden,
 * je nachdem ob und wie man User Input handelt
 * @extends AnimationNode
 */
export class DriverNode extends AnimationNode {
  /**
   * Der Vector, von dem aus bewegt wird
   */
  vector: Vector;

  /**
   * Die Richtung, in die das Object bewegt werden soll
   */
  direction: String;

  /**
   * Kreiert eine neue DriverNode
   * @param groupNode Die GroupNode, an die die
   * AnimationNode angefügt werden soll
   * @param vector der Vector, von dem aus bewegt wird
   */
  constructor(groupNode: GroupNode, vector: Vector) {
    super(groupNode);
    this.vector = vector;
    this.active = false;
    this.direction = "up"
  }

  /**
   * Treibt die Animation um deltaT voran
   * @param deltaT Der Zeitunterschied, um den die Animation
   * vorangetrieben wird
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
      if(this.direction == "in"){
        this.vector.z -= 0.001 * deltaT;
      }
      if(this.direction == "out"){
        this.vector.z += 0.001 * deltaT;
      }
      this.groupNode.transform = new Translation(this.vector);
    }
  }
}
