import Vector from '../mathOperations/vector';
import {Node} from "../Nodes/nodes";

/**
 * Class representing a ray-sphere intersection in 3D space
 */
export default class Intersection {
  /**
   * Create an Intersection
   * @param _t The distance on the ray
   * @param _point The intersection point
   * @param _normal The normal in the intersection
   */
  constructor(public _t: number, public _point: Vector, public _normal: Vector) {
    if (_t) {
      this._t = _t;
    } else {
      this._t = Infinity;
    }
  }

  /**
   * Determines whether this intersection
   * is closer than the other
   * @param other The other Intersection
   * @return The result
   */
  closerThan(other: Intersection): boolean {
    if (this._t < other._t) return true;
    else return false;
  }


  get t(): number {
    return this._t;
  }

  get point(): Vector {
    return this._point;
  }

  get normal(): Vector {
    return this._normal;
  }
}