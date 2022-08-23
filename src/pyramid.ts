import Vector from './vector';
import Intersection from './intersection';
import Ray from './ray';

/**
 * A class representing a pyramid
 */
export default class Pyramid {
  /**
   * The pyramid's vertices
   */
  vertices: Array<Vector>;
  /**
   * The indices of the vertices that
   * together form the faces of the pyramid
   */
  indices: Array<number>;
  /**
   * Creates a new Pyramid
   * @param top The top corner
   * @param backPoint The back corner
   * @param rightPoint The right corner
   * @param leftPoint the left corner
   * @param color The colour of the Pyramid
   */
  constructor(public top: Vector, public backPoint: Vector, public rightPoint: Vector, public leftPoint: Vector, public color: Vector) {
    /*
        2         2 = top
       / \        3 = backPoint
      /  3\       1 = rightPoint
     /     \      0 = leftPoint
    0-------1
     */
    this.vertices = [
      leftPoint, rightPoint, top, backPoint
    ];
    this.indices = [
      0, 1, 2, //front
      1, 3, 2, //right
      3, 0, 2, //left
      0, 1, 3 //bottom
    ];
    this.color = color;

  }

  /**
   * Calculates the intersection of the pyramid with the given ray
   * @param ray The ray to intersect with
   * @return The intersection if there is one, null if there is none
   */
  intersect(ray: Ray): Intersection | null {
    // TODO
    return null;
  }

}

