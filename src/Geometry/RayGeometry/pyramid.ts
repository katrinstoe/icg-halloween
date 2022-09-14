import Vector from '../../mathOperations/vector';
import Intersection from '../../RayTracing/intersection';
import Ray from '../../RayTracing/ray';
import {intersectTriangle} from "../../RayTracing/rayIntersection";
import Sphere from "./sphere";

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


    let intersection = this.intersectBoundingSphere(ray);
    if (!intersection){
      return null;
    }

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

  intersectBoundingSphere(ray: Ray): Intersection | null {

    let point1 = new Vector(-0.5, -0.5, 0.5, 1);
    let point2 = new Vector(0.5, -0.5, 0.5, 1);
    let point3 = new Vector(0, -0.5, -0.5, 1);
    let point4 = new Vector(0, 0.5, 0, 1);

    let averageX = (point1.x+point3.x+point4.x)/3;
    let averageY = (point1.y+point3.y+point4.y)/3;
    let averageZ = (point1.z+point3.z+point4.z)/3;

    let baseCenter = new Vector(averageX, averageY,averageZ, 1);
    let centerPyramid = (point2.sub(baseCenter)).div(2);

    let r = -Infinity;
    r = centerPyramid.sub(point1).length;
    if (r<centerPyramid.sub(point2).length){
      r = centerPyramid.sub(point2).length;
    }
    if (r<centerPyramid.sub(point3).length){
      r = centerPyramid.sub(point3).length;
    }
    if (r<centerPyramid.sub(point4).length){
      r = centerPyramid.sub(point4).length;
    }


    let boundingSphere = new Sphere(centerPyramid,r*2, new Vector(0,0,0,0));

    let intersection = boundingSphere.intersect(ray);

    if (intersection){
      return intersection;

    }
    else{
      return null;
    }
  }
}