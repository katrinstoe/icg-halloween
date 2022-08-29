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

    let tmin = (min.x - ray.origin.x) / ray.direction.x;
    let tmax = (max.x - ray.origin.x) / ray.direction.x;

    let tymin = (min.y - ray.origin.y) / ray.direction.y;
    let tymax = (max.y - ray.origin.y) / ray.direction.y;

    if ((tmin > tymax) || (tymin > tmax)){
      return null;
    }

    if (tymin > tmin)
      tmin = tymin;

    if (tymax < tmax)
      tmax = tymax;

    let tzmin = (min.z - ray.origin.z) / ray.direction.z;
    let tzmax = (max.z -  ray.origin.z) / ray.direction.z;

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

    /*let x0 = ray.origin.sub(this.center);

    let x0Squared = x0.dot(x0)
    let direction = ray.direction;
    let d = new Vector(...ray.direction.data).normalize();
    let t = - x0.dot(d) + Math.sqrt((Math.pow(x0.dot(d), 2))- x0Squared + Math.pow(this.radius, 2));
    let t2 = - x0.dot(d) - Math.sqrt((Math.pow(x0.dot(d), 2))- x0Squared + Math.pow(this.radius, 2));


    let shorterT;

    let c = Math.pow(x0.dot(d), 2)-x0Squared + (Math.pow(this.radius, 2))

    let amountOfIntersections;
    if (c < 0){
      amountOfIntersections = 0;
      return null;
    } else if (c == 0){
      amountOfIntersections = 1;
      shorterT = t;
    } else {
      amountOfIntersections = 2;
      if (t < t2){
        shorterT = t;
      } else shorterT = t2;
    }

    let intersectionPoint = ray.origin.add(d.mul(shorterT))
    intersectionPoint.w = 1;
    let normal = intersectionPoint.sub(this.center).normalize()
    return new Intersection(shorterT, intersectionPoint, normal)*/
    return null
  }

}