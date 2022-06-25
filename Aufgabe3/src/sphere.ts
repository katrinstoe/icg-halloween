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


    let x0Squared = (Math.pow(ray.origin.x, 2), Math.pow(ray.origin.y, 2), Math.pow(ray.origin.z, 2), Math.pow(ray.origin.w, 2))
    let dSquared = (Math.pow(ray.direction.x, 2), Math.pow(ray.origin.y, 2), Math.pow(ray.origin.z, 2), Math.pow(ray.origin.w, 2))
    let t = - x0.dot(ray.direction) + Math.sqrt((Math.pow(x0.dot(ray.direction), 2))- x0Squared + Math.pow(this.radius, 2));
    let t2 = - x0.dot(ray.direction) - Math.sqrt((Math.pow(x0.dot(ray.direction), 2))- x0Squared + Math.pow(this.radius, 2));


    let shorterT;
    let intersectionPoint = x0.add(ray.direction.mul(shorterT))
    //let rSquared = x0Squared + 2* t* x0 * ray.direction + Math.pow(t, 2)*dSquared;

    let normal = intersectionPoint.sub(this.center).normalize()




    let c = Math.pow(x0.dot(ray.direction), 2)-x0Squared+Math.pow(this.radius, 2)
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
    //let raySphereIntersection = Math.pow(t, 2) + 2*shorterT*(ray.origin.dot(ray.direction))+(x0Squared-Math.pow(this.radius, 2));

    return new Intersection(shorterT, normal, intersectionPoint)

  }
}