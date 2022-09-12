import Vector from './vector';
import Intersection from './intersection';
import Ray from './ray';
import {intersectTriangle} from "./rayIntersection";

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

   * @param color The color of the Pyramid

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

      leftPoint, rightPoint, backPoint,

      rightPoint, top, backPoint,

      top, leftPoint, backPoint,

      leftPoint, top, rightPoint

    ];

    this.indices = [

      // front
      0, 1, 3,
      // right
      1, 2, 3,
      // left
      2, 0, 3,
      // bottom
      0, 2, 1

    ];

    this.color = color;

  }

  /**

   * Calculates the intersection of the pyramid with the given ray

   * @param ray The ray to intersect with

   * @return The intersection if there is one, null if there is none

   */
  //https://www.scratchapixel.com/lessons/3d-basic-rendering/ray-tracing-rendering-a-triangle/ray-triangle-intersection-geometric-solution

  intersect(ray: Ray): Intersection | null {

    // TODO
    let nearestIntersection: Intersection;

    let min = Number.MAX_VALUE;

    for (let i = 0; i < this.vertices.length; i+=3) {
      let intersection = intersectTriangle(ray, this.vertices[i], this.vertices[i+1], this.vertices[i+2])
      if (intersection) {
        if (min === Number.MAX_VALUE || intersection.t < min) {
          nearestIntersection = intersection;
          min = intersection.t

        }
      }

    }
    if (nearestIntersection) {
      return nearestIntersection;
    }
    return null;

  }


}