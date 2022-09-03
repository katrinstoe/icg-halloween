import Vector from './vector';
import Ray from './ray';
import Intersection from './intersection';

/**
 * Class representing an axis aligned box
 */
export default class AABox {
  /**
   * The box's vertices
   */
  vertices: Array<Vector>;
  /**
   * The indices of the vertices that
   * together form the faces of the box
   */
  indices: Array<number>;


  /**
   * Creates an axis aligned box
   * @param minPoint The minimum Point
   * @param maxPoint The maximum Point
   * @param color The colour of the cube
   */
  constructor(minPoint: Vector, maxPoint: Vector, public color: Vector) {
    /*
      7----6
     /|   /|   2 = maxPoint
    3----2 |   4 = minPoint
    | 4--|-5   Looking into negative z direction
    |/   |/
    0----1
     */
    this.vertices = [
      new Vector(minPoint.x, minPoint.y, maxPoint.z, 1),
      new Vector(maxPoint.x, minPoint.y, maxPoint.z, 1),
      new Vector(maxPoint.x, maxPoint.y, maxPoint.z, 1),
      new Vector(minPoint.x, maxPoint.y, maxPoint.z, 1),
      new Vector(minPoint.x, minPoint.y, minPoint.z, 1),
      new Vector(maxPoint.x, minPoint.y, minPoint.z, 1),
      new Vector(maxPoint.x, maxPoint.y, minPoint.z, 1),
      new Vector(minPoint.x, maxPoint.y, minPoint.z, 1)
    ];
    this.indices = [
      0, 1, 2, 3,
      1, 5, 6, 2,
      4, 0, 3, 7,
      3, 2, 6, 7,
      5, 4, 7, 6,
      0, 4, 5, 1
    ];
    this.color = color;

  }

  /**
   * Calculates the intersection of the AAbox with the given ray
   * @param ray The ray to intersect with
   * @return The intersection if there is one, null if there is none
   */
  intersect(ray: Ray): Intersection | null {

    let min = this.vertices[4]
    let max = this.vertices[2]

    let tmin = (min.x-ray.origin.x)/ray.direction.x;;
    let tmax = (max.x - ray.origin.x) / ray.direction.x;

    if (tmin > tmax){
      //swap tmax and tmin
      let temp = tmin;
      tmin = tmax;
      tmax = temp;
    }

    let tymin = (min.y - ray.origin.y) / ray.direction.y;
    let tymax = (max.y - ray.origin.y) / ray.direction.y;

    if (tymin > tymax){
      //swap tmax and tmin
      let temp = tymin;
      tymin = tymax;
      tymax = temp;
    }

    if (tymin > tymax || tymin > tmax){
      return null
    }

    if (tymin > tmin)
      tmin = tymin;

    if (tymax < tmax)
      tmax = tymax;

    let tzmin = (min.z - ray.origin.z) / ray.direction.z;
    let tzmax = (max.z -  ray.origin.z) / ray.direction.z;

    if (tzmin > tzmax){
      let temp = tzmin;
      tzmin = tzmax;
      tzmax = temp;
    }

    if ((tmin > tzmax) || (tzmin > tmax)){
      return null;
    }

    if (tzmin > tmin)
      tmin = tzmin;

    if (tzmax < tmax)
      tmax = tzmax;

    let d = new Vector(...ray.direction.data).normalize();
    let intersectionPoint = ray.origin.add(d.mul(tmin))
    intersectionPoint.w = 1;

    return new Intersection(tmin, intersectionPoint, new Vector(0,0,0,1))
  }
}