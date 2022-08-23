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
   * Creates a new Pyramid with center and radius
   * @param top The top corner of the Sphere
   * @param minPoint The left corner of the Sphere
   * @param maxPoint The right corner of the Pyramid
   * @param color The colour of the Sphere
   */
  constructor(public top: Vector, public minPoint: Vector, public maxPoint: Vector, public color: Vector) {
    /*
        2         2 = top
       / \        3 = minPoint
      /3--\---4   1 = maxPoint
     /     \ /
    0-------1
     */
    this.vertices = [
      new Vector(minPoint.x, minPoint.y, maxPoint.z, 1), //0
      new Vector(maxPoint.x, maxPoint.y, maxPoint.z, 1), //1
      new Vector(top.x, top.y, top.z, 1), //2
      new Vector(minPoint.x, minPoint.y, minPoint.z, 1), //3
      new Vector(maxPoint.x, minPoint.y, minPoint.z, 1), //4
    ];
    this.indices = [
      0, 1, 2, //front
      1, 4, 2, //right
      3, 4, 2, //back
      3, 0, 2, //left
      0, 4, 5, 1 //bottom
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

