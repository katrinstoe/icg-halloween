import Vector from './vector';
import Intersection from './intersection';
import Ray from './ray';

/**
 * A class representing a sphere
 */
export default class Sphere {
  /**
   * Creates a new Sphere with center and radius
   * @param center The center of the Sphere
   * @param radius The radius of the Sphere
   * @param color The colour of the Sphere
   */
  constructor(
      public center: Vector,
      public radius: number,
      public color: Vector
  ) { }

  /**
   * Calculates the intersection of the sphere with the given ray
   * @param ray The ray to intersect with
   * @return The intersection if there is one, null if there is none
   */
  intersect(ray: Ray): Intersection | null {
    // TODO

    let x0 = ray.origin.sub(this.center);
    // let x0 = new Vector(x0Old.x, x0Old.y, x0Old.z,1)


    let x0Squared = x0.dot(x0)
    let d = ray.direction.normalize();
    let t = - x0.dot(d) + Math.sqrt((Math.pow(x0.dot(d), 2))- x0Squared + Math.pow(this.radius, 2));
    let t2 = - x0.dot(d) - Math.sqrt((Math.pow(x0.dot(d), 2))- x0Squared + Math.pow(this.radius, 2));


    // let t = - x0.dot(d) + Math.sqrt((Math.pow(x0.dot(d), 2))- x0Squared.length + Math.pow(this.radius, 2));
    // let t2 = - x0.dot(d) - Math.sqrt((Math.pow(x0.dot(d), 2))- x0Squared.length + Math.pow(this.radius, 2));

    let shorterT;

    let c = Math.pow(x0.dot(d), 2)-x0Squared + (Math.pow(this.radius, 2))
    // let c = Math.pow(x0.dot(d), 2)-x0Squared.length + (Math.pow(this.radius, 2))
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
//ray equation
    //let raySphereIntersection = Math.pow(t, 2) + 2*shorterT*(ray.origin.dot(ray.d))+(x0Squared-Math.pow(this.radius, 2));
    let intersectionPoint = ray.origin.add(d.mul(shorterT))
    intersectionPoint.w = 1;
    let normal = intersectionPoint.sub(this.center)
    normal.w = 0
    normal.normalize()
    return new Intersection(shorterT, intersectionPoint, normal)
  }

}